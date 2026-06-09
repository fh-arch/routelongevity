import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import {
  clearSessionCookie,
  createEmailVerification,
  createPasswordReset,
  hashPassword,
  hashResetToken,
  hashVerificationCode,
  optionalAuth,
  publicUser,
  requireAdmin,
  requireAuth,
  requirePartner,
  setSessionCookie,
  signSession,
  verifyPassword,
} from './auth.js';
import { query } from './db.js';

const app = express();
const port = Number(process.env.PORT || 4000);
const appUrl = process.env.APP_URL || 'http://localhost:3000';
const emailFrom = process.env.AUTH_EMAIL_FROM || 'Route Longevity <notifications@routelongevity.com>';
const adminNotifyEmail = process.env.ADMIN_NOTIFY_EMAIL || '';

if (!process.env.DATABASE_URL || !process.env.JWT_SECRET) {
  console.error('DATABASE_URL and JWT_SECRET are required.');
  process.exit(1);
}

app.set('trust proxy', 1);
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(cors({
  origin: process.env.CORS_ORIGIN?.split(',') || appUrl,
  credentials: true,
}));

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 30,
  standardHeaders: true,
  legacyHeaders: false,
});

const signupSchema = z.object({
  role: z.enum(['user', 'partner']).default('user'),
  name: z.string().min(2).max(120),
  businessName: z.string().max(160).optional(),
  email: z.string().email().max(180).transform((email) => email.toLowerCase()),
  password: z.string().min(8).max(100),
});

const signinSchema = z.object({
  email: z.string().email().transform((email) => email.toLowerCase()),
  password: z.string().min(1),
});

const verifyEmailSchema = z.object({
  email: z.string().email().transform((email) => email.toLowerCase()),
  code: z.string().regex(/^\d{6}$/, 'Enter the 6-digit verification code.'),
});

const forgotPasswordSchema = z.object({
  email: z.string().email().transform((email) => email.toLowerCase()),
});

const resetPasswordSchema = z.object({
  token: z.string().min(32),
  password: z.string().min(8).max(100),
});

const listingSchema = z.object({
  categoryId: z.string().min(1),
  name: z.string().min(2).max(180),
  description: z.string().max(1600).optional(),
  city: z.string().max(120).optional(),
  region: z.string().max(120).optional(),
  address: z.string().max(260).optional(),
  latitude: z.number().min(-90).max(90).optional(),
  longitude: z.number().min(-180).max(180).optional(),
  imageUrl: z.string().url().optional(),
  website: z.string().url().optional(),
  phone: z.string().max(60).optional(),
});

const adApplicationSchema = z.object({
  businessName: z.string().min(2).max(160),
  contactName: z.string().min(2).max(120),
  email: z.string().email().max(180).transform((email) => email.toLowerCase()),
  phone: z.string().max(60).optional(),
  website: z.string().url().optional(),
  requestedSlot: z.string().max(80).optional(),
  campaignGoal: z.string().max(1000).optional(),
  budgetRange: z.string().max(80).optional(),
});

const eventRegistrationSchema = z.object({
  eventId: z.string().min(1).max(120),
  name: z.string().min(2).max(120),
  email: z.string().email().max(180).transform((email) => email.toLowerCase()),
});

const contactMessageSchema = z.object({
  name: z.string().min(2).max(120),
  email: z.string().email().max(180).transform((email) => email.toLowerCase()),
  topic: z.string().min(2).max(80).default('general'),
  message: z.string().min(4).max(2000),
});

const listingApplicationSchema = z.object({
  venueName: z.string().min(2).max(180),
  contactName: z.string().max(120).optional(),
  email: z.string().email().max(180).transform((email) => email.toLowerCase()),
  categoryId: z.string().min(1).max(80).optional(),
  city: z.string().max(120).optional(),
  website: z.string().url().optional(),
  message: z.string().max(2000).optional(),
});

const partnerApplicationSchema = z.object({
  businessName: z.string().min(2).max(180),
  contactName: z.string().max(120).optional(),
  email: z.string().email().max(180).transform((email) => email.toLowerCase()),
  website: z.string().url().optional(),
  partnerType: z.string().max(80).optional(),
  message: z.string().max(2000).optional(),
});

const externalIdSchema = z.object({
  id: z.string().min(1).max(120),
});

const adminStatusSchema = z.object({
  status: z.string().min(2).max(40),
});

const adminApplicationParamsSchema = z.object({
  type: z.enum(['contact', 'listing', 'partner', 'ad', 'event']),
  id: z.string().uuid(),
});

const nullableUrl = z.string().url().or(z.literal('')).optional().transform((value) => value || null);
const optionalText = (max = 2000) => z.string().max(max).optional().transform((value) => value?.trim() || null);
const optionalNumber = z.coerce.number().optional().nullable();

const adminListingSchema = z.object({
  externalId: z.string().min(1).max(120).optional(),
  categoryId: z.string().min(1).max(80),
  name: z.string().min(2).max(180),
  description: optionalText(2500),
  city: optionalText(120),
  region: optionalText(120),
  address: optionalText(260),
  latitude: optionalNumber,
  longitude: optionalNumber,
  imageUrl: nullableUrl,
  website: nullableUrl,
  phone: optionalText(60),
  email: z.string().email().or(z.literal('')).optional().transform((value) => value || null),
  specialty: optionalText(180),
  rating: z.coerce.number().min(0).max(5).optional().nullable(),
  reviewCount: z.coerce.number().int().min(0).optional().nullable(),
  licenseType: z.enum(['Premium', 'Standard']).default('Standard'),
  annualFee: z.coerce.number().int().min(0).optional().nullable(),
  isPremium: z.boolean().default(false),
  featured: z.boolean().default(false),
  status: z.enum(['draft', 'pending', 'approved', 'rejected']).default('approved'),
});

const adminContentIdSchema = z.object({
  id: z.string().min(1).max(120),
});

const adminUserParamsSchema = z.object({
  id: z.string().uuid(),
});

const adminUserRoleSchema = z.object({
  role: z.enum(['user', 'partner', 'admin']),
});

const adminBlogSchema = z.object({
  id: z.string().min(1).max(120).optional(),
  titleEn: z.string().min(2).max(240),
  titleTr: z.string().max(240).optional(),
  subtitleEn: z.string().max(500).optional(),
  subtitleTr: z.string().max(500).optional(),
  categoryEn: z.string().max(80).optional(),
  categoryTr: z.string().max(80).optional(),
  readTimeEn: z.string().max(80).optional(),
  readTimeTr: z.string().max(80).optional(),
  dateEn: z.string().max(120).optional(),
  dateTr: z.string().max(120).optional(),
  authorEn: z.string().max(120).optional(),
  authorTr: z.string().max(120).optional(),
  imageUrl: nullableUrl,
  contentEn: z.string().min(20).max(20000),
  contentTr: z.string().max(20000).optional(),
  tagsEn: z.string().max(500).optional(),
  tagsTr: z.string().max(500).optional(),
  status: z.enum(['draft', 'published']).default('published'),
  sortOrder: z.coerce.number().int().default(0),
});

const adminEventSchema = z.object({
  id: z.string().min(1).max(120).optional(),
  titleEn: z.string().min(2).max(240),
  titleTr: z.string().max(240).optional(),
  dateEn: z.string().max(120).optional(),
  dateTr: z.string().max(120).optional(),
  timeEn: z.string().max(120).optional(),
  timeTr: z.string().max(120).optional(),
  locationEn: z.string().max(180).optional(),
  locationTr: z.string().max(180).optional(),
  cityEn: z.string().max(120).optional(),
  cityTr: z.string().max(120).optional(),
  descriptionEn: z.string().min(10).max(4000),
  descriptionTr: z.string().max(4000).optional(),
  spotsLeft: z.coerce.number().int().min(0).default(0),
  tagsEn: z.string().max(500).optional(),
  tagsTr: z.string().max(500).optional(),
  imageUrl: nullableUrl,
  status: z.enum(['draft', 'published']).default('published'),
  sortOrder: z.coerce.number().int().default(0),
});

function validate(schema, req, res) {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.issues[0]?.message || 'Invalid request.' });
    return null;
  }

  return result.data;
}

function slugify(value) {
  return value
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .slice(0, 80);
}

function makeContentId(prefix, title) {
  return `${prefix}-${slugify(title) || Date.now()}`;
}

function localized(en, tr) {
  return {
    en: en?.trim() || '',
    tr: tr?.trim() || en?.trim() || '',
  };
}

function tagList(value) {
  return (value || '')
    .split(',')
    .map((tag) => tag.trim())
    .filter(Boolean);
}

async function sendVerificationCode(email, code) {
  await sendEmail({
    to: email,
    subject: 'Your Route Longevity verification code',
    text: `Your Route Longevity verification code is ${code}. It expires in 15 minutes.`,
    fallbackLog: `Route Longevity verification code for ${email}: ${code}`,
  });
}

async function sendEmail({ to, subject, text, html, fallbackLog }) {
  if (!to) return;

  if (!process.env.RESEND_API_KEY) {
    console.info(fallbackLog || `Email not sent because RESEND_API_KEY is not set. To: ${to}; subject: ${subject}; body: ${text}`);
    return;
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      from: emailFrom,
      to,
      subject,
      text,
      html,
    }),
  });

  if (!response.ok) {
    const details = await response.text();
    console.error(`Email failed for ${to}: ${details}`);
  }
}

async function notifyAdmin(subject, lines) {
  if (!adminNotifyEmail) {
    console.info(`Admin notification skipped: ${subject}\n${lines.join('\n')}`);
    return;
  }

  await sendEmail({
    to: adminNotifyEmail,
    subject,
    text: lines.filter(Boolean).join('\n'),
    fallbackLog: `Admin notification: ${subject}\n${lines.join('\n')}`,
  });
}

app.get('/api/health', (req, res) => {
  res.json({ ok: true, service: 'route-longevity-api' });
});

app.post('/api/auth/signup', authLimiter, async (req, res, next) => {
  try {
    const body = validate(signupSchema, req, res);
    if (!body) return;

    if (body.role === 'partner' && !body.businessName?.trim()) {
      return res.status(400).json({ error: 'Business name is required for partner accounts.' });
    }

    const passwordHash = await hashPassword(body.password);
    const userResult = await query(
      `INSERT INTO users (role, name, email, password_hash)
       VALUES ($1, $2, $3, $4)
       RETURNING id, role, name, email, email_verified_at`,
      [body.role, body.name.trim(), body.email, passwordHash],
    );

    const user = userResult.rows[0];

    if (body.role === 'partner') {
      await query(
        `INSERT INTO partner_profiles (user_id, business_name)
         VALUES ($1, $2)`,
        [user.id, body.businessName.trim()],
      );
    }

    const code = await createEmailVerification(user.id);
    await sendVerificationCode(user.email, code);

    return res.status(201).json({
      verificationRequired: true,
      email: user.email,
      message: 'Verification code sent.',
    });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'An account already exists for this email.' });
    }

    return next(error);
  }
});

app.post('/api/auth/verify-email', authLimiter, async (req, res, next) => {
  try {
    const body = validate(verifyEmailSchema, req, res);
    if (!body) return;

    const codeHash = hashVerificationCode(body.code);
    const result = await query(
      `SELECT u.id, u.role, u.name, u.email, c.id AS code_id
       FROM email_verification_codes c
       JOIN users u ON u.id = c.user_id
       WHERE u.email = $1
         AND c.code_hash = $2
         AND c.used_at IS NULL
         AND c.expires_at > now()
       ORDER BY c.created_at DESC
       LIMIT 1`,
      [body.email, codeHash],
    );

    const user = result.rows[0];
    if (!user) {
      return res.status(400).json({ error: 'Verification code is invalid or expired.' });
    }

    await query('UPDATE email_verification_codes SET used_at = now() WHERE id = $1', [user.code_id]);
    await query('UPDATE users SET email_verified_at = now(), updated_at = now() WHERE id = $1', [user.id]);

    const token = signSession(user);
    setSessionCookie(res, token);
    return res.json({ user: publicUser(user) });
  } catch (error) {
    return next(error);
  }
});

app.post('/api/auth/signin', authLimiter, async (req, res, next) => {
  try {
    const body = validate(signinSchema, req, res);
    if (!body) return;

    const userResult = await query(
      `SELECT id, role, name, email, password_hash, email_verified_at
       FROM users
       WHERE email = $1`,
      [body.email],
    );
    const user = userResult.rows[0];

    if (!user || !(await verifyPassword(body.password, user.password_hash))) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    if (!user.email_verified_at) {
      const code = await createEmailVerification(user.id);
      await sendVerificationCode(user.email, code);
      return res.status(403).json({
        verificationRequired: true,
        email: user.email,
        error: 'Please verify your email before signing in. A new code was sent.',
      });
    }

    const token = signSession(user);
    setSessionCookie(res, token);
    return res.json({ user: publicUser(user) });
  } catch (error) {
    return next(error);
  }
});

app.post('/api/auth/signout', (req, res) => {
  clearSessionCookie(res);
  res.json({ ok: true });
});

app.get('/api/auth/me', requireAuth, (req, res) => {
  res.json({ user: req.user });
});

app.get('/api/profile', requireAuth, async (req, res, next) => {
  try {
    const [
      userResult,
      partnerProfileResult,
      favoriteListingsResult,
      favoriteJourneysResult,
      listingApplicationsResult,
      partnerApplicationsResult,
      adApplicationsResult,
      eventRegistrationsResult,
    ] = await Promise.all([
      query(
        `SELECT id, role, name, email, email_verified_at, created_at
         FROM users
         WHERE id = $1`,
        [req.user.id],
      ),
      query(
        `SELECT business_name, approval_status, contact_phone, website, created_at, updated_at
         FROM partner_profiles
         WHERE user_id = $1`,
        [req.user.id],
      ),
      query(
        `SELECT count(*)::int AS count
         FROM user_favorite_listings
         WHERE user_id = $1`,
        [req.user.id],
      ),
      query(
        `SELECT count(*)::int AS count
         FROM user_favorite_journeys
         WHERE user_id = $1`,
        [req.user.id],
      ),
      query(
        `SELECT id, venue_name, email, category_id, city, website, status, created_at
         FROM listing_applications
         WHERE user_id = $1 OR email = $2
         ORDER BY created_at DESC
         LIMIT 10`,
        [req.user.id, req.user.email],
      ),
      query(
        `SELECT id, business_name, email, partner_type, website, status, created_at
         FROM partner_applications
         WHERE user_id = $1 OR email = $2
         ORDER BY created_at DESC
         LIMIT 10`,
        [req.user.id, req.user.email],
      ),
      query(
        `SELECT id, business_name, email, requested_slot, budget_range, status, created_at
         FROM ad_applications
         WHERE user_id = $1 OR email = $2
         ORDER BY created_at DESC
         LIMIT 10`,
        [req.user.id, req.user.email],
      ),
      query(
        `SELECT id, event_id, name, email, status, created_at
         FROM event_registrations
         WHERE user_id = $1 OR email = $2
         ORDER BY created_at DESC
         LIMIT 10`,
        [req.user.id, req.user.email],
      ),
    ]);

    return res.json({
      user: publicUser(userResult.rows[0]),
      partnerProfile: partnerProfileResult.rows[0] || null,
      stats: {
        favoriteListings: favoriteListingsResult.rows[0]?.count || 0,
        favoriteJourneys: favoriteJourneysResult.rows[0]?.count || 0,
        listingApplications: listingApplicationsResult.rows.length,
        partnerApplications: partnerApplicationsResult.rows.length,
        adApplications: adApplicationsResult.rows.length,
        eventRegistrations: eventRegistrationsResult.rows.length,
      },
      applications: {
        listings: listingApplicationsResult.rows,
        partners: partnerApplicationsResult.rows,
        ads: adApplicationsResult.rows,
        events: eventRegistrationsResult.rows,
      },
    });
  } catch (error) {
    return next(error);
  }
});

app.get('/api/admin/overview', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const [
      usersCount,
      listingsCount,
      contacts,
      listingApplications,
      partnerApplications,
      adApplications,
      eventRegistrations,
      users,
      listings,
      blogPosts,
      events,
    ] = await Promise.all([
      query('SELECT count(*)::int AS count FROM users'),
      query('SELECT count(*)::int AS count FROM listings'),
      query(
        `SELECT id, name, email, topic, message, status, created_at
         FROM contact_messages
         ORDER BY created_at DESC
         LIMIT 25`,
      ),
      query(
        `SELECT id, venue_name, contact_name, email, category_id, city, website, status, created_at
         FROM listing_applications
         ORDER BY created_at DESC
         LIMIT 25`,
      ),
      query(
        `SELECT id, business_name, contact_name, email, partner_type, website, status, created_at
         FROM partner_applications
         ORDER BY created_at DESC
         LIMIT 25`,
      ),
      query(
        `SELECT id, business_name, contact_name, email, requested_slot, budget_range, status, created_at
         FROM ad_applications
         ORDER BY created_at DESC
         LIMIT 25`,
      ),
      query(
        `SELECT id, event_id, name, email, status, created_at
         FROM event_registrations
         ORDER BY created_at DESC
         LIMIT 25`,
      ),
      query(
        `SELECT id, role, name, email, email_verified_at, created_at
         FROM users
         ORDER BY created_at DESC
         LIMIT 100`,
      ),
      query(
        `SELECT id, external_id, name, category_id, city, region, website, is_premium, status, created_at
         FROM listings
         ORDER BY created_at DESC
         LIMIT 100`,
      ),
      query(
        `SELECT id, title, category, status, sort_order, created_at
         FROM blog_posts
         ORDER BY sort_order, created_at DESC
         LIMIT 100`,
      ),
      query(
        `SELECT id, title, date_label, city, status, spots_left, sort_order, created_at
         FROM events
         ORDER BY sort_order, created_at DESC
         LIMIT 100`,
      ),
    ]);

    return res.json({
      stats: {
        users: usersCount.rows[0]?.count || 0,
        listings: listingsCount.rows[0]?.count || 0,
        contacts: contacts.rows.length,
        listingApplications: listingApplications.rows.length,
        partnerApplications: partnerApplications.rows.length,
        adApplications: adApplications.rows.length,
        eventRegistrations: eventRegistrations.rows.length,
      },
      queues: {
        contacts: contacts.rows,
        listingApplications: listingApplications.rows,
        partnerApplications: partnerApplications.rows,
        adApplications: adApplications.rows,
        eventRegistrations: eventRegistrations.rows,
      },
      content: {
        users: users.rows.map((user) => publicUser(user)),
        listings: listings.rows,
        blogPosts: blogPosts.rows,
        events: events.rows,
      },
    });
  } catch (error) {
    return next(error);
  }
});

app.patch('/api/admin/applications/:type/:id', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const params = adminApplicationParamsSchema.safeParse(req.params);
    if (!params.success) {
      return res.status(400).json({ error: 'Invalid application type or id.' });
    }

    const body = validate(adminStatusSchema, req, res);
    if (!body) return;

    const config = {
      contact: {
        table: 'contact_messages',
        allowedStatuses: ['new', 'read', 'archived'],
      },
      listing: {
        table: 'listing_applications',
        allowedStatuses: ['pending', 'approved', 'rejected'],
      },
      partner: {
        table: 'partner_applications',
        allowedStatuses: ['pending', 'approved', 'rejected'],
      },
      ad: {
        table: 'ad_applications',
        allowedStatuses: ['pending', 'approved', 'rejected'],
      },
      event: {
        table: 'event_registrations',
        allowedStatuses: ['pending', 'confirmed', 'cancelled'],
      },
    }[params.data.type];

    if (!config.allowedStatuses.includes(body.status)) {
      return res.status(400).json({ error: 'Invalid status for this queue.' });
    }

    const result = await query(
      `UPDATE ${config.table}
       SET status = $1${['contact', 'event'].includes(params.data.type) ? '' : ', updated_at = now()'}
       WHERE id = $2
       RETURNING *`,
      [body.status, params.data.id],
    );

    if (!result.rows[0]) {
      return res.status(404).json({ error: 'Application not found.' });
    }

    return res.json({ item: result.rows[0] });
  } catch (error) {
    return next(error);
  }
});

app.post('/api/admin/listings', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const body = validate(adminListingSchema, req, res);
    if (!body) return;

    const externalId = body.externalId || `admin-${Date.now()}`;
    const result = await query(
      `INSERT INTO listings (
         external_id, category_id, name, description, city, region, address,
         latitude, longitude, image_url, website, phone, email, specialty,
         rating, review_count, license_type, annual_fee, is_premium, featured,
         status, source
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14,
               $15, $16, $17, $18, $19, $20, $21, 'admin')
       RETURNING *`,
      [
        externalId,
        body.categoryId,
        body.name.trim(),
        body.description,
        body.city,
        body.region,
        body.address,
        body.latitude,
        body.longitude,
        body.imageUrl,
        body.website,
        body.phone,
        body.email,
        body.specialty,
        body.rating,
        body.reviewCount,
        body.licenseType,
        body.annualFee,
        body.isPremium,
        body.featured,
        body.status,
      ],
    );

    return res.status(201).json({ listing: result.rows[0] });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'A listing with this external id already exists.' });
    }
    return next(error);
  }
});

app.patch('/api/admin/listings/:id', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const params = adminContentIdSchema.safeParse(req.params);
    if (!params.success) return res.status(400).json({ error: 'Invalid listing id.' });

    const body = validate(adminListingSchema, req, res);
    if (!body) return;

    const result = await query(
      `UPDATE listings
       SET category_id = $1, name = $2, description = $3, city = $4, region = $5,
           address = $6, latitude = $7, longitude = $8, image_url = $9, website = $10,
           phone = $11, email = $12, specialty = $13, rating = $14, review_count = $15,
           license_type = $16, annual_fee = $17, is_premium = $18, featured = $19,
           status = $20, updated_at = now()
       WHERE id::text = $21 OR external_id = $21
       RETURNING *`,
      [
        body.categoryId,
        body.name.trim(),
        body.description,
        body.city,
        body.region,
        body.address,
        body.latitude,
        body.longitude,
        body.imageUrl,
        body.website,
        body.phone,
        body.email,
        body.specialty,
        body.rating,
        body.reviewCount,
        body.licenseType,
        body.annualFee,
        body.isPremium,
        body.featured,
        body.status,
        params.data.id,
      ],
    );

    if (!result.rows[0]) return res.status(404).json({ error: 'Listing not found.' });
    return res.json({ listing: result.rows[0] });
  } catch (error) {
    return next(error);
  }
});

app.post('/api/admin/blog-posts', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const body = validate(adminBlogSchema, req, res);
    if (!body) return;

    const id = body.id || makeContentId('blog', body.titleEn);
    const result = await query(
      `INSERT INTO blog_posts (
         id, title, subtitle, category, read_time, date_label, author,
         image_url, content, tags, status, sort_order
       )
       VALUES ($1, $2::jsonb, $3::jsonb, $4::jsonb, $5::jsonb, $6::jsonb, $7::jsonb,
               $8, $9::jsonb, $10::jsonb, $11, $12)
       ON CONFLICT (id) DO UPDATE SET
         title = EXCLUDED.title,
         subtitle = EXCLUDED.subtitle,
         category = EXCLUDED.category,
         read_time = EXCLUDED.read_time,
         date_label = EXCLUDED.date_label,
         author = EXCLUDED.author,
         image_url = EXCLUDED.image_url,
         content = EXCLUDED.content,
         tags = EXCLUDED.tags,
         status = EXCLUDED.status,
         sort_order = EXCLUDED.sort_order,
         updated_at = now()
       RETURNING *`,
      [
        id,
        JSON.stringify(localized(body.titleEn, body.titleTr)),
        JSON.stringify(localized(body.subtitleEn, body.subtitleTr)),
        JSON.stringify(localized(body.categoryEn, body.categoryTr)),
        JSON.stringify(localized(body.readTimeEn, body.readTimeTr)),
        JSON.stringify(localized(body.dateEn, body.dateTr)),
        JSON.stringify(localized(body.authorEn || 'Route Longevity Editorial', body.authorTr)),
        body.imageUrl,
        JSON.stringify(localized(body.contentEn, body.contentTr)),
        JSON.stringify({ en: tagList(body.tagsEn), tr: tagList(body.tagsTr || body.tagsEn) }),
        body.status,
        body.sortOrder,
      ],
    );

    return res.status(201).json({ post: result.rows[0] });
  } catch (error) {
    return next(error);
  }
});

app.post('/api/admin/events', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const body = validate(adminEventSchema, req, res);
    if (!body) return;

    const id = body.id || makeContentId('event', body.titleEn);
    const result = await query(
      `INSERT INTO events (
         id, title, date_label, time_label, location, city, description,
         spots_left, tags, image_url, status, sort_order
       )
       VALUES ($1, $2::jsonb, $3::jsonb, $4::jsonb, $5::jsonb, $6::jsonb,
               $7::jsonb, $8, $9::jsonb, $10, $11, $12)
       ON CONFLICT (id) DO UPDATE SET
         title = EXCLUDED.title,
         date_label = EXCLUDED.date_label,
         time_label = EXCLUDED.time_label,
         location = EXCLUDED.location,
         city = EXCLUDED.city,
         description = EXCLUDED.description,
         spots_left = EXCLUDED.spots_left,
         tags = EXCLUDED.tags,
         image_url = EXCLUDED.image_url,
         status = EXCLUDED.status,
         sort_order = EXCLUDED.sort_order,
         updated_at = now()
       RETURNING *`,
      [
        id,
        JSON.stringify(localized(body.titleEn, body.titleTr)),
        JSON.stringify(localized(body.dateEn, body.dateTr)),
        JSON.stringify(localized(body.timeEn, body.timeTr)),
        JSON.stringify(localized(body.locationEn, body.locationTr)),
        JSON.stringify(localized(body.cityEn, body.cityTr)),
        JSON.stringify(localized(body.descriptionEn, body.descriptionTr)),
        body.spotsLeft,
        JSON.stringify({ en: tagList(body.tagsEn), tr: tagList(body.tagsTr || body.tagsEn) }),
        body.imageUrl,
        body.status,
        body.sortOrder,
      ],
    );

    return res.status(201).json({ event: result.rows[0] });
  } catch (error) {
    return next(error);
  }
});

app.patch('/api/admin/users/:id/role', requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const params = adminUserParamsSchema.safeParse(req.params);
    if (!params.success) return res.status(400).json({ error: 'Invalid user id.' });

    const body = validate(adminUserRoleSchema, req, res);
    if (!body) return;

    const result = await query(
      `UPDATE users
       SET role = $1, updated_at = now()
       WHERE id = $2
       RETURNING id, role, name, email, email_verified_at`,
      [body.role, params.data.id],
    );

    if (!result.rows[0]) return res.status(404).json({ error: 'User not found.' });
    return res.json({ user: publicUser(result.rows[0]) });
  } catch (error) {
    return next(error);
  }
});

app.post('/api/auth/forgot-password', authLimiter, async (req, res, next) => {
  try {
    const body = validate(forgotPasswordSchema, req, res);
    if (!body) return;

    const userResult = await query(
      `SELECT id FROM users WHERE email = $1`,
      [body.email],
    );

    let resetUrl = null;
    if (userResult.rows[0]) {
      const token = await createPasswordReset(userResult.rows[0].id);
      resetUrl = `${appUrl}/reset-password?token=${token}`;
      await sendEmail({
        to: body.email,
        subject: 'Reset your Route Longevity password',
        text: `Use this secure link to reset your Route Longevity password: ${resetUrl}\n\nThis link expires in 1 hour.`,
        fallbackLog: `Password reset URL for ${body.email}: ${resetUrl}`,
      });
    }

    res.json({
      ok: true,
      message: 'If an account exists for this email, a reset link will be sent.',
      resetUrl: process.env.NODE_ENV === 'production' ? undefined : resetUrl,
    });
  } catch (error) {
    return next(error);
  }
});

app.post('/api/auth/reset-password', authLimiter, async (req, res, next) => {
  try {
    const body = validate(resetPasswordSchema, req, res);
    if (!body) return;

    const tokenHash = hashResetToken(body.token);
    const tokenResult = await query(
      `SELECT id, user_id
       FROM password_reset_tokens
       WHERE token_hash = $1
         AND used_at IS NULL
         AND expires_at > now()`,
      [tokenHash],
    );
    const reset = tokenResult.rows[0];

    if (!reset) {
      return res.status(400).json({ error: 'Reset link is invalid or expired.' });
    }

    const passwordHash = await hashPassword(body.password);
    await query('UPDATE users SET password_hash = $1, updated_at = now() WHERE id = $2', [passwordHash, reset.user_id]);
    await query('UPDATE password_reset_tokens SET used_at = now() WHERE id = $1', [reset.id]);

    return res.json({ ok: true });
  } catch (error) {
    return next(error);
  }
});

app.get('/api/listings', async (req, res, next) => {
  try {
    const listingResult = await query(
      `SELECT l.id, l.external_id, l.name, l.description, l.city, l.region, l.country, l.address,
              l.latitude, l.longitude, l.image_url, l.website, l.phone,
              l.is_premium, l.status, l.source, l.category_id,
              l.category_label, l.rating, l.review_count, l.license_type,
              l.annual_fee, l.specialty, l.email, l.featured, l.analytics,
              c.name_en AS category_name_en, c.name_tr AS category_name_tr
       FROM listings l
       LEFT JOIN listing_categories c ON c.id = l.category_id
       WHERE l.status = 'approved'
       ORDER BY l.is_premium DESC, l.created_at DESC
       LIMIT 500`,
    );

    res.json({ listings: listingResult.rows });
  } catch (error) {
    return next(error);
  }
});

app.get('/api/blog-posts', async (req, res, next) => {
  try {
    const language = req.query.lang === 'tr' ? 'tr' : 'en';
    const postResult = await query(
      `SELECT id, title, subtitle, category, read_time, date_label, author,
              image_url, content, tags
       FROM blog_posts
       WHERE status = 'published'
       ORDER BY sort_order, created_at DESC`,
    );

    const posts = postResult.rows.map((post) => ({
      id: post.id,
      title: post.title?.[language] || post.title?.en || '',
      subtitle: post.subtitle?.[language] || post.subtitle?.en || '',
      category: post.category?.[language] || post.category?.en || '',
      readTime: post.read_time?.[language] || post.read_time?.en || '',
      date: post.date_label?.[language] || post.date_label?.en || '',
      author: post.author?.[language] || post.author?.en || '',
      imageUrl: post.image_url,
      content: post.content?.[language] || post.content?.en || '',
      tags: post.tags?.[language] || post.tags?.en || [],
    }));

    return res.json({ posts });
  } catch (error) {
    return next(error);
  }
});

app.get('/api/events', async (req, res, next) => {
  try {
    const language = req.query.lang === 'tr' ? 'tr' : 'en';
    const eventResult = await query(
      `SELECT id, title, date_label, time_label, location, city, description,
              spots_left, tags, image_url
       FROM events
       WHERE status = 'published'
       ORDER BY sort_order, created_at DESC`,
    );

    const events = eventResult.rows.map((event) => ({
      id: event.id,
      title: event.title?.[language] || event.title?.en || '',
      date: event.date_label?.[language] || event.date_label?.en || '',
      time: event.time_label?.[language] || event.time_label?.en || '',
      location: event.location?.[language] || event.location?.en || '',
      city: event.city?.[language] || event.city?.en || '',
      description: event.description?.[language] || event.description?.en || '',
      spotsLeft: event.spots_left,
      tags: event.tags?.[language] || event.tags?.en || [],
      imageUrl: event.image_url,
    }));

    return res.json({ events });
  } catch (error) {
    return next(error);
  }
});

app.post('/api/event-registrations', optionalAuth, async (req, res, next) => {
  try {
    const body = validate(eventRegistrationSchema, req, res);
    if (!body) return;

    const registrationResult = await query(
      `INSERT INTO event_registrations (event_id, user_id, name, email)
       VALUES ($1, $2, $3, $4)
       RETURNING id, event_id, name, email, status, created_at`,
      [body.eventId, req.user?.id || null, body.name, body.email],
    );

    await notifyAdmin('Route Longevity event registration', [
      `Event: ${body.eventId}`,
      `Name: ${body.name}`,
      `Email: ${body.email}`,
      `User ID: ${req.user?.id || 'guest'}`,
    ]);

    return res.status(201).json({ registration: registrationResult.rows[0] });
  } catch (error) {
    return next(error);
  }
});

app.get('/api/experiences', async (req, res, next) => {
  try {
    const journeyResult = await query(
      `SELECT j.id, j.title, j.subtitle, j.duration, j.cities, j.description,
              j.image_url, j.tags,
              COALESCE(
                jsonb_agg(s.listing_external_id ORDER BY s.sort_order)
                FILTER (WHERE s.listing_external_id IS NOT NULL),
                '[]'::jsonb
              ) AS partner_ids
       FROM route_journeys j
       LEFT JOIN route_journey_stops s ON s.journey_id = j.id
       WHERE j.is_active = true
       GROUP BY j.id
       ORDER BY j.sort_order, j.created_at`,
    );

    const journeys = journeyResult.rows.map((journey) => ({
      id: journey.id,
      title: journey.title,
      subtitle: journey.subtitle,
      duration: journey.duration,
      cities: journey.cities || [],
      description: journey.description,
      partnerIds: journey.partner_ids || [],
      imageUrl: journey.image_url,
      tags: journey.tags || [],
    }));

    return res.json({ journeys });
  } catch (error) {
    return next(error);
  }
});

app.get('/api/favorites', requireAuth, async (req, res, next) => {
  try {
    const [listingResult, journeyResult] = await Promise.all([
      query(
        `SELECT listing_external_id
         FROM user_favorite_listings
         WHERE user_id = $1
         ORDER BY created_at DESC`,
        [req.user.id],
      ),
      query(
        `SELECT journey_id
         FROM user_favorite_journeys
         WHERE user_id = $1
         ORDER BY created_at DESC`,
        [req.user.id],
      ),
    ]);

    return res.json({
      listingIds: listingResult.rows.map((row) => row.listing_external_id),
      journeyIds: journeyResult.rows.map((row) => row.journey_id),
    });
  } catch (error) {
    return next(error);
  }
});

app.put('/api/favorites/listings/:id', requireAuth, async (req, res, next) => {
  try {
    const params = externalIdSchema.safeParse(req.params);
    if (!params.success) {
      return res.status(400).json({ error: 'Invalid listing id.' });
    }

    await query(
      `INSERT INTO user_favorite_listings (user_id, listing_external_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, listing_external_id) DO NOTHING`,
      [req.user.id, params.data.id],
    );

    return res.json({ ok: true });
  } catch (error) {
    return next(error);
  }
});

app.delete('/api/favorites/listings/:id', requireAuth, async (req, res, next) => {
  try {
    const params = externalIdSchema.safeParse(req.params);
    if (!params.success) {
      return res.status(400).json({ error: 'Invalid listing id.' });
    }

    await query(
      `DELETE FROM user_favorite_listings
       WHERE user_id = $1 AND listing_external_id = $2`,
      [req.user.id, params.data.id],
    );

    return res.json({ ok: true });
  } catch (error) {
    return next(error);
  }
});

app.put('/api/favorites/journeys/:id', requireAuth, async (req, res, next) => {
  try {
    const params = externalIdSchema.safeParse(req.params);
    if (!params.success) {
      return res.status(400).json({ error: 'Invalid journey id.' });
    }

    await query(
      `INSERT INTO user_favorite_journeys (user_id, journey_id)
       VALUES ($1, $2)
       ON CONFLICT (user_id, journey_id) DO NOTHING`,
      [req.user.id, params.data.id],
    );

    return res.json({ ok: true });
  } catch (error) {
    return next(error);
  }
});

app.delete('/api/favorites/journeys/:id', requireAuth, async (req, res, next) => {
  try {
    const params = externalIdSchema.safeParse(req.params);
    if (!params.success) {
      return res.status(400).json({ error: 'Invalid journey id.' });
    }

    await query(
      `DELETE FROM user_favorite_journeys
       WHERE user_id = $1 AND journey_id = $2`,
      [req.user.id, params.data.id],
    );

    return res.json({ ok: true });
  } catch (error) {
    return next(error);
  }
});

app.post('/api/listings', requireAuth, requirePartner, async (req, res, next) => {
  try {
    const body = validate(listingSchema, req, res);
    if (!body) return;

    const listingResult = await query(
      `INSERT INTO listings (
         partner_user_id, category_id, name, description, city, region, address,
         latitude, longitude, image_url, website, phone, status
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'pending')
       RETURNING *`,
      [
        req.user.id,
        body.categoryId,
        body.name.trim(),
        body.description,
        body.city,
        body.region,
        body.address,
        body.latitude,
        body.longitude,
        body.imageUrl,
        body.website,
        body.phone,
      ],
    );

    res.status(201).json({ listing: listingResult.rows[0] });
  } catch (error) {
    return next(error);
  }
});

app.post('/api/ad-applications', optionalAuth, async (req, res, next) => {
  try {
    const body = validate(adApplicationSchema, req, res);
    if (!body) return;

    const applicationResult = await query(
      `INSERT INTO ad_applications (
         user_id, business_name, contact_name, email, phone, website,
         requested_slot, campaign_goal, budget_range
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
       RETURNING *`,
      [
        req.user?.id || null,
        body.businessName,
        body.contactName,
        body.email,
        body.phone,
        body.website,
        body.requestedSlot,
        body.campaignGoal,
        body.budgetRange,
      ],
    );

    await notifyAdmin('Route Longevity ad application', [
      `Business: ${body.businessName}`,
      `Contact: ${body.contactName}`,
      `Email: ${body.email}`,
      `Phone: ${body.phone || '-'}`,
      `Website: ${body.website || '-'}`,
      `Slot: ${body.requestedSlot || '-'}`,
      `Budget: ${body.budgetRange || '-'}`,
      `Goal: ${body.campaignGoal || '-'}`,
    ]);

    res.status(201).json({ application: applicationResult.rows[0] });
  } catch (error) {
    return next(error);
  }
});

app.post('/api/contact-messages', async (req, res, next) => {
  try {
    const body = validate(contactMessageSchema, req, res);
    if (!body) return;

    const result = await query(
      `INSERT INTO contact_messages (name, email, topic, message)
       VALUES ($1, $2, $3, $4)
       RETURNING id, name, email, topic, status, created_at`,
      [body.name, body.email, body.topic, body.message],
    );

    await notifyAdmin('Route Longevity contact message', [
      `Name: ${body.name}`,
      `Email: ${body.email}`,
      `Topic: ${body.topic}`,
      `Message: ${body.message}`,
    ]);

    return res.status(201).json({ message: result.rows[0] });
  } catch (error) {
    return next(error);
  }
});

app.post('/api/listing-applications', optionalAuth, async (req, res, next) => {
  try {
    const body = validate(listingApplicationSchema, req, res);
    if (!body) return;

    const result = await query(
      `INSERT INTO listing_applications (
         user_id, venue_name, contact_name, email, category_id, city, website, message
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING id, venue_name, email, category_id, status, created_at`,
      [
        req.user?.id || null,
        body.venueName,
        body.contactName,
        body.email,
        body.categoryId,
        body.city,
        body.website,
        body.message,
      ],
    );

    await notifyAdmin('Route Longevity listing application', [
      `Venue: ${body.venueName}`,
      `Contact: ${body.contactName || '-'}`,
      `Email: ${body.email}`,
      `Category: ${body.categoryId || '-'}`,
      `City: ${body.city || '-'}`,
      `Website: ${body.website || '-'}`,
      `Message: ${body.message || '-'}`,
    ]);

    return res.status(201).json({ application: result.rows[0] });
  } catch (error) {
    return next(error);
  }
});

app.post('/api/partner-applications', optionalAuth, async (req, res, next) => {
  try {
    const body = validate(partnerApplicationSchema, req, res);
    if (!body) return;

    const result = await query(
      `INSERT INTO partner_applications (
         user_id, business_name, contact_name, email, website, partner_type, message
       )
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING id, business_name, email, partner_type, status, created_at`,
      [
        req.user?.id || null,
        body.businessName,
        body.contactName,
        body.email,
        body.website,
        body.partnerType,
        body.message,
      ],
    );

    await notifyAdmin('Route Longevity partner application', [
      `Business: ${body.businessName}`,
      `Contact: ${body.contactName || '-'}`,
      `Email: ${body.email}`,
      `Type: ${body.partnerType || '-'}`,
      `Website: ${body.website || '-'}`,
      `Message: ${body.message || '-'}`,
    ]);

    return res.status(201).json({ application: result.rows[0] });
  } catch (error) {
    return next(error);
  }
});

app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: 'Something went wrong. Please try again.' });
});

app.listen(port, () => {
  console.log(`Route Longevity API listening on ${port}`);
});
