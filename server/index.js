import 'dotenv/config';
import express from 'express';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import { z } from 'zod';
import {
  clearSessionCookie,
  createPasswordReset,
  hashPassword,
  hashResetToken,
  publicUser,
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

function validate(schema, req, res) {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.issues[0]?.message || 'Invalid request.' });
    return null;
  }

  return result.data;
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
       RETURNING id, role, name, email`,
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

    const token = signSession(user);
    setSessionCookie(res, token);
    return res.status(201).json({ user: publicUser(user) });
  } catch (error) {
    if (error.code === '23505') {
      return res.status(409).json({ error: 'An account already exists for this email.' });
    }

    return next(error);
  }
});

app.post('/api/auth/signin', authLimiter, async (req, res, next) => {
  try {
    const body = validate(signinSchema, req, res);
    if (!body) return;

    const userResult = await query(
      `SELECT id, role, name, email, password_hash
       FROM users
       WHERE email = $1`,
      [body.email],
    );
    const user = userResult.rows[0];

    if (!user || !(await verifyPassword(body.password, user.password_hash))) {
      return res.status(401).json({ error: 'Invalid email or password.' });
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
      console.info(`Password reset URL for ${body.email}: ${resetUrl}`);
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
      `SELECT l.id, l.name, l.description, l.city, l.region, l.country, l.address,
              l.latitude, l.longitude, l.image_url, l.website, l.phone,
              l.is_premium, l.status, l.source, l.category_id,
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

app.post('/api/ad-applications', async (req, res, next) => {
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

    res.status(201).json({ application: applicationResult.rows[0] });
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
