import crypto from 'node:crypto';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { query } from './db.js';

const cookieName = 'route_longevity_session';

export function publicUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    role: user.role,
    name: user.name,
    email: user.email,
  };
}

export async function hashPassword(password) {
  return bcrypt.hash(password, 12);
}

export async function verifyPassword(password, passwordHash) {
  return bcrypt.compare(password, passwordHash);
}

export function signSession(user) {
  return jwt.sign(publicUser(user), process.env.JWT_SECRET, { expiresIn: '14d' });
}

export function setSessionCookie(res, token) {
  res.cookie(cookieName, token, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.COOKIE_SECURE === 'true',
    maxAge: 14 * 24 * 60 * 60 * 1000,
  });
}

export function clearSessionCookie(res) {
  res.clearCookie(cookieName, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.COOKIE_SECURE === 'true',
  });
}

export function requireAuth(req, res, next) {
  const token = req.cookies?.[cookieName] || req.headers.authorization?.replace(/^Bearer\s+/i, '');

  if (!token) {
    return res.status(401).json({ error: 'Authentication required.' });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch (error) {
    return res.status(401).json({ error: 'Session expired. Please sign in again.' });
  }
}

export function requirePartner(req, res, next) {
  if (!['partner', 'admin'].includes(req.user?.role)) {
    return res.status(403).json({ error: 'Partner account required.' });
  }

  return next();
}

export function makeResetToken() {
  const token = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  return { token, tokenHash };
}

export async function createPasswordReset(userId) {
  const { token, tokenHash } = makeResetToken();
  const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

  await query(
    `INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
     VALUES ($1, $2, $3)`,
    [userId, tokenHash, expiresAt],
  );

  return token;
}

export function hashResetToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}
