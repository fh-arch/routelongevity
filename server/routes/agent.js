import express from 'express';
import crypto from 'node:crypto';
import rateLimit from 'express-rate-limit';
import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';
import { requireAuth } from '../auth.js';
import { query } from '../db.js';

const router = express.Router();

const agentLimiter = rateLimit({
  windowMs: 60 * 1000,
  limit: 10,
  standardHeaders: true,
  legacyHeaders: false,
});

const goals = ['sleep', 'stress', 'inflammation', 'nutrition', 'general', 'biohacking'];
const budgetRanges = ['economy', 'premium', 'luxury'];

const profileSchema = z.object({
  goals: z.array(z.enum(goals)).max(6).default([]),
  budgetRange: z.enum(budgetRanges).default('premium'),
  travelDays: z.coerce.number().int().min(3).max(30).default(7),
  preferredRegions: z.array(z.string().min(2).max(80)).max(12).default(['turkiye']),
  biomarkers: z.record(z.unknown()).optional().default({}),
});

const chatSchema = z.object({
  message: z.string().min(2).max(2000),
  sessionId: z.string().min(8).max(120),
  language: z.enum(['en', 'tr']).optional().default('en'),
});

const outcomeSchema = z.object({
  listingId: z.string().uuid().optional(),
  listingExternalId: z.string().min(1).max(120).optional(),
  visitedAt: z.coerce.date(),
  selfReportedScore: z.coerce.number().int().min(1).max(10),
  notes: z.string().max(2000).optional(),
  biomarkerChange: z.record(z.unknown()).optional().default({}),
}).refine((value) => value.listingId || value.listingExternalId, {
  message: 'Listing id is required.',
});

const suggestionSchema = z.object({
  listingId: z.string().uuid().optional(),
  externalId: z.string().nullable().optional(),
  reason: z.string().max(800).optional(),
  durationDays: z.coerce.number().int().min(1).max(30).optional(),
  priceRange: z.string().max(80).optional(),
});

const agentResponseSchema = z.object({
  text: z.string().min(1).max(3000),
  suggestions: z.array(suggestionSchema).max(5).default([]),
});

const goalCategoryMap = {
  sleep: ['retreat-nature', 'thermal-spa', 'hammams'],
  stress: ['retreat-nature', 'hammams', 'thermal-spa'],
  inflammation: ['thermal-spa', 'mediterranean-diet', 'longevity-clinics'],
  nutrition: ['mediterranean-diet', 'local-producers', 'longevity-clinics'],
  biohacking: ['longevity-clinics'],
  general: ['hammams', 'thermal-spa', 'retreat-nature', 'longevity-clinics'],
};

const keywordCategoryMap = [
  { keywords: ['sleep', 'uyku', 'insomnia'], categories: goalCategoryMap.sleep },
  { keywords: ['stress', 'stres', 'anxiety', 'reset'], categories: goalCategoryMap.stress },
  { keywords: ['inflammation', 'inflamasyon', 'ağrı', 'agri'], categories: goalCategoryMap.inflammation },
  { keywords: ['nutrition', 'beslenme', 'diet', 'diyet', 'olive', 'zeytin'], categories: goalCategoryMap.nutrition },
  { keywords: ['biohacking', 'nad', 'epigenetic', 'clinic', 'klinik'], categories: goalCategoryMap.biohacking },
  { keywords: ['hamam', 'hammam'], categories: ['hammams'] },
  { keywords: ['thermal', 'termal', 'spa'], categories: ['thermal-spa'] },
  { keywords: ['retreat', 'yoga', 'nature', 'doğa', 'doga'], categories: ['retreat-nature'] },
];

function validate(schema, req, res) {
  const result = schema.safeParse(req.body);
  if (!result.success) {
    res.status(400).json({ error: result.error.issues[0]?.message || 'Invalid request.' });
    return null;
  }

  return result.data;
}

function normalizeProfile(row) {
  if (!row) return null;
  return {
    goals: row.goals || [],
    budgetRange: row.budget_range || 'premium',
    travelDays: row.travel_days || 7,
    preferredRegions: row.preferred_regions || ['turkiye'],
    biomarkers: row.biomarkers || {},
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function getHealthProfile(userId) {
  const result = await query(
    `SELECT goals, budget_range, travel_days, preferred_regions, biomarkers, created_at, updated_at
     FROM user_health_profiles
     WHERE user_id = $1`,
    [userId],
  );
  return normalizeProfile(result.rows[0]);
}

function categoriesFor(profile, message) {
  const selected = new Set();

  for (const goal of profile?.goals || []) {
    for (const category of goalCategoryMap[goal] || []) {
      selected.add(category);
    }
  }

  const normalized = message.toLowerCase();
  for (const item of keywordCategoryMap) {
    if (item.keywords.some((keyword) => normalized.includes(keyword))) {
      for (const category of item.categories) {
        selected.add(category);
      }
    }
  }

  if (selected.size === 0) {
    for (const category of goalCategoryMap.general) {
      selected.add(category);
    }
  }

  return Array.from(selected);
}

function locationSearchTerms(profile, message) {
  const terms = new Set();
  const normalized = message.toLowerCase();
  const knownLocations = [
    'turkiye', 'türkiye', 'turkey', 'istanbul', 'bursa', 'izmir', 'bodrum',
    'antalya', 'mugla', 'muğla', 'cappadocia', 'kapadokya', 'greece',
    'italy', 'spain', 'france', 'portugal', 'uae', 'dubai', 'qatar',
    'morocco', 'egypt', 'mena', 'europe', 'americas', 'america',
    'usa', 'united states', 'canada', 'mexico', 'brazil', 'argentina',
    'chile', 'peru', 'costa rica', 'panama', 'colombia',
  ];

  for (const location of knownLocations) {
    if (normalized.includes(location)) terms.add(location);
  }

  for (const region of profile?.preferredRegions || []) {
    if (region && region !== 'any') terms.add(region);
  }

  return Array.from(terms).slice(0, 6);
}

async function filterListings(profile, message) {
  const categories = categoriesFor(profile, message);
  const terms = locationSearchTerms(profile, message);
  const params = [categories];
  let locationClause = '';

  if (terms.length > 0) {
    params.push(terms.map((term) => `%${term}%`));
    locationClause = `
      AND (
        l.city ILIKE ANY($2)
        OR l.region ILIKE ANY($2)
        OR l.country ILIKE ANY($2)
        OR l.address ILIKE ANY($2)
      )`;
  }

  const result = await query(
    `SELECT
       l.id,
       l.external_id,
       l.name,
       l.description,
       l.category_id,
       COALESCE(c.name_en, l.category_label, l.category_id) AS category_name,
       l.city,
       l.region,
       l.country,
       l.rating,
       l.review_count,
       l.is_premium,
       l.license_type,
       l.specialty,
       COALESCE(los.avg_score, 5.0) AS outcome_score,
       COALESCE(los.visit_count, 0) AS outcome_visit_count
     FROM listings l
     LEFT JOIN listing_categories c ON c.id = l.category_id
     LEFT JOIN listing_outcome_scores los ON los.listing_id = l.id
     WHERE l.status = 'approved'
       AND l.category_id = ANY($1)
       ${locationClause}
     ORDER BY
       COALESCE(los.avg_score, 5.0) DESC,
       l.is_premium DESC,
       l.rating DESC NULLS LAST,
       l.created_at DESC
     LIMIT 8`,
    params,
  );

  if (result.rows.length > 0 || terms.length === 0) {
    return result.rows;
  }

  const fallback = await query(
    `SELECT
       l.id,
       l.external_id,
       l.name,
       l.description,
       l.category_id,
       COALESCE(c.name_en, l.category_label, l.category_id) AS category_name,
       l.city,
       l.region,
       l.country,
       l.rating,
       l.review_count,
       l.is_premium,
       l.license_type,
       l.specialty,
       COALESCE(los.avg_score, 5.0) AS outcome_score,
       COALESCE(los.visit_count, 0) AS outcome_visit_count
     FROM listings l
     LEFT JOIN listing_categories c ON c.id = l.category_id
     LEFT JOIN listing_outcome_scores los ON los.listing_id = l.id
     WHERE l.status = 'approved'
       AND l.category_id = ANY($1)
     ORDER BY
       COALESCE(los.avg_score, 5.0) DESC,
       l.is_premium DESC,
       l.rating DESC NULLS LAST,
       l.created_at DESC
     LIMIT 8`,
    [categories],
  );

  return fallback.rows;
}

async function getSessionMessages(userId, sessionId) {
  const result = await query(
    `SELECT messages
     FROM agent_sessions
     WHERE id = $1 AND user_id = $2 AND expires_at > now()`,
    [sessionId, userId],
  );

  return Array.isArray(result.rows[0]?.messages) ? result.rows[0].messages.slice(-10) : [];
}

async function saveSessionMessages(userId, sessionId, messages) {
  const trimmed = messages.slice(-20);
  await query(
    `INSERT INTO agent_sessions (id, user_id, messages, last_active, expires_at)
     VALUES ($1, $2, $3::jsonb, now(), now() + interval '24 hours')
     ON CONFLICT (id) DO UPDATE SET
       messages = EXCLUDED.messages,
       last_active = now(),
       expires_at = now() + interval '24 hours'`,
    [sessionId, userId, JSON.stringify(trimmed)],
  );
}

async function getUserLongevityHistory(userId) {
  const result = await query(
    `SELECT l.name, l.city, l.country, o.visited_at, o.self_reported_score, o.notes
     FROM user_journey_outcomes o
     JOIN listings l ON l.id = o.listing_id
     WHERE o.user_id = $1
     ORDER BY o.visited_at DESC
     LIMIT 5`,
    [userId],
  );

  return result.rows;
}

function buildSystemInstruction(language) {
  return [
    'You are Route Longevity, an agentic longevity travel guide.',
    'You recommend verified longevity destinations from the provided database context only.',
    'You are not a doctor. Do not diagnose, prescribe, or promise medical outcomes.',
    'If the user asks medical-risk questions, recommend consulting a qualified clinician.',
    'Return only JSON with this shape: {"text":"...","suggestions":[{"listingId":"uuid","externalId":"p1","reason":"...","durationDays":2,"priceRange":"premium"}]}.',
    'Every suggestion must use a listingId from AVAILABLE_LISTINGS.',
    'Give a short reason for each suggested listing.',
    'Maximum 5 suggestions.',
    language === 'tr' ? 'Answer in Turkish.' : 'Answer in English.',
  ].join('\n');
}

function buildPrompt({ profile, history, listings, outcomes, message }) {
  const availableListings = listings.map((listing) => ({
    listingId: listing.id,
    externalId: listing.external_id,
    name: listing.name,
    categoryId: listing.category_id,
    category: listing.category_name,
    city: listing.city,
    region: listing.region,
    country: listing.country,
    rating: listing.rating,
    premium: listing.is_premium,
    specialty: listing.specialty,
    outcomeScore: listing.outcome_score,
    outcomeVisits: listing.outcome_visit_count,
  }));

  return JSON.stringify({
    userMessage: message,
    userProfile: profile || null,
    recentConversation: history,
    recentUserOutcomes: outcomes,
    availableListings,
  });
}

function parseAgentJson(text) {
  try {
    return JSON.parse(text);
  } catch (error) {
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw error;
    return JSON.parse(match[0]);
  }
}

function withTimeout(promise, timeoutMs) {
  let timeoutId;
  const timeout = new Promise((_, reject) => {
    timeoutId = setTimeout(() => reject(new Error('Gemini request timed out.')), timeoutMs);
  });

  return Promise.race([promise, timeout]).finally(() => clearTimeout(timeoutId));
}

async function callGemini({ profile, history, listings, outcomes, message, language }) {
  if (!process.env.GEMINI_API_KEY) {
    const error = new Error('GEMINI_API_KEY is not configured.');
    error.statusCode = 503;
    throw error;
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const model = process.env.AI_MODEL || 'gemini-2.5-flash';
  const maxOutputTokens = Number(process.env.AGENT_MAX_TOKENS || 800);
  const timeoutMs = Number(process.env.AGENT_REQUEST_TIMEOUT_MS || 30000);

  const response = await withTimeout(
    ai.models.generateContent({
      model,
      contents: buildPrompt({ profile, history, listings, outcomes, message }),
      config: {
        systemInstruction: buildSystemInstruction(language),
        responseMimeType: 'application/json',
        maxOutputTokens,
        temperature: 0.35,
      },
    }),
    timeoutMs,
  );

  const rawText = response.text || '';
  const parsed = agentResponseSchema.parse(parseAgentJson(rawText));
  return parsed;
}

function hydrateSuggestions(agentSuggestions, listings) {
  const listingById = new Map(listings.map((listing) => [listing.id, listing]));
  const listingByExternalId = new Map(
    listings
      .filter((listing) => listing.external_id)
      .map((listing) => [listing.external_id, listing]),
  );

  return agentSuggestions
    .map((suggestion) => {
      const listing = suggestion.listingId
        ? listingById.get(suggestion.listingId)
        : listingByExternalId.get(suggestion.externalId);

      if (!listing) return null;

      return {
        listingId: listing.id,
        externalId: listing.external_id,
        name: listing.name,
        categoryId: listing.category_id,
        category: listing.category_name,
        city: listing.city,
        country: listing.country,
        reason: suggestion.reason || listing.specialty || 'Matched your longevity goals.',
        durationDays: suggestion.durationDays || null,
        priceRange: suggestion.priceRange || (listing.is_premium ? 'premium' : 'standard'),
        rating: listing.rating,
        outcomeScore: listing.outcome_score,
      };
    })
    .filter(Boolean)
    .slice(0, 5);
}

router.get('/profile', requireAuth, async (req, res, next) => {
  try {
    const profile = await getHealthProfile(req.user.id);
    return res.json({ profile });
  } catch (error) {
    return next(error);
  }
});

router.post('/profile', requireAuth, async (req, res, next) => {
  try {
    const body = validate(profileSchema, req, res);
    if (!body) return;

    const result = await query(
      `INSERT INTO user_health_profiles (
         user_id, goals, budget_range, travel_days, preferred_regions, biomarkers
       )
       VALUES ($1, $2, $3, $4, $5, $6::jsonb)
       ON CONFLICT (user_id) DO UPDATE SET
         goals = EXCLUDED.goals,
         budget_range = EXCLUDED.budget_range,
         travel_days = EXCLUDED.travel_days,
         preferred_regions = EXCLUDED.preferred_regions,
         biomarkers = EXCLUDED.biomarkers,
         updated_at = now()
       RETURNING goals, budget_range, travel_days, preferred_regions, biomarkers, created_at, updated_at`,
      [
        req.user.id,
        body.goals,
        body.budgetRange,
        body.travelDays,
        body.preferredRegions,
        JSON.stringify(body.biomarkers),
      ],
    );

    return res.json({ profile: normalizeProfile(result.rows[0]) });
  } catch (error) {
    return next(error);
  }
});

router.post('/outcomes', requireAuth, async (req, res, next) => {
  try {
    const body = validate(outcomeSchema, req, res);
    if (!body) return;

    let listingId = body.listingId;
    if (!listingId) {
      const listingResult = await query(
        `SELECT id FROM listings WHERE external_id = $1 AND status = 'approved'`,
        [body.listingExternalId],
      );
      listingId = listingResult.rows[0]?.id;
    }

    if (!listingId) {
      return res.status(404).json({ error: 'Listing not found.' });
    }

    const result = await query(
      `INSERT INTO user_journey_outcomes (
         user_id, listing_id, visited_at, self_reported_score, notes, biomarker_change
       )
       VALUES ($1, $2, $3, $4, $5, $6::jsonb)
       ON CONFLICT (user_id, listing_id, visited_at) DO UPDATE SET
         self_reported_score = EXCLUDED.self_reported_score,
         notes = EXCLUDED.notes,
         biomarker_change = EXCLUDED.biomarker_change
       RETURNING id, listing_id, visited_at, self_reported_score, notes, biomarker_change, created_at`,
      [
        req.user.id,
        listingId,
        body.visitedAt.toISOString().slice(0, 10),
        body.selfReportedScore,
        body.notes || null,
        JSON.stringify(body.biomarkerChange),
      ],
    );

    return res.status(201).json({ outcome: result.rows[0] });
  } catch (error) {
    return next(error);
  }
});

router.post('/chat', requireAuth, agentLimiter, async (req, res, next) => {
  try {
    const body = validate(chatSchema, req, res);
    if (!body) return;

    const [profile, history, outcomes] = await Promise.all([
      getHealthProfile(req.user.id),
      getSessionMessages(req.user.id, body.sessionId),
      getUserLongevityHistory(req.user.id),
    ]);
    const listings = await filterListings(profile, body.message);

    if (listings.length === 0) {
      return res.json({
        reply: body.language === 'tr'
          ? 'Bu hedef için onaylı kayıt bulamadım. Filtreyi genişletmeyi deneyebiliriz.'
          : 'I could not find approved listings for this goal yet. We can broaden the route filters.',
        suggestions: [],
        sessionId: body.sessionId,
      });
    }

    const userMessage = {
      id: crypto.randomUUID(),
      role: 'user',
      type: 'text',
      content: body.message,
      timestamp: new Date().toISOString(),
    };

    const agentResponse = await callGemini({
      profile,
      history,
      listings,
      outcomes,
      message: body.message,
      language: body.language,
    });

    const suggestions = hydrateSuggestions(agentResponse.suggestions, listings);
    const agentMessage = {
      id: crypto.randomUUID(),
      role: 'agent',
      type: suggestions.length ? 'route_suggestion' : 'text',
      content: agentResponse.text,
      suggestions,
      timestamp: new Date().toISOString(),
    };

    await saveSessionMessages(req.user.id, body.sessionId, [...history, userMessage, agentMessage]);

    if (suggestions.length > 0) {
      await query(
        `INSERT INTO ai_route_suggestions (
           user_id, session_id, suggested_listing_ids, suggested_external_ids,
           reasoning, user_message, agent_response
         )
     VALUES ($1, $2, $3::uuid[], $4::text[], $5, $6, $7)`,
        [
          req.user.id,
          body.sessionId,
          suggestions.map((suggestion) => suggestion.listingId),
          suggestions.map((suggestion) => suggestion.externalId).filter(Boolean),
          suggestions.map((suggestion) => `${suggestion.name}: ${suggestion.reason}`).join('\n'),
          body.message,
          agentResponse.text,
        ],
      );
    }

    return res.json({
      reply: agentResponse.text,
      suggestions,
      sessionId: body.sessionId,
      message: agentMessage,
    });
  } catch (error) {
    if (error.statusCode) {
      return res.status(error.statusCode).json({ error: error.message });
    }

    if (error.message?.includes('timed out')) {
      return res.status(504).json({ error: 'The agent timed out. Please try again.' });
    }

    return next(error);
  }
});

export default router;
