import type { AuthRole, AuthSession } from './components/AuthModal';
import type { RouteJourney } from './types';
import type { BlogPost, LongevityEvent } from './components/BlogEventsModal';

const API_BASE = import.meta.env.VITE_API_BASE || '';

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || 'Request failed.');
  }

  return data;
}

export async function signup(input: {
  role: AuthRole;
  name: string;
  businessName?: string;
  email: string;
  password: string;
}) {
  return request<{ verificationRequired: true; email: string; message: string }>('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function signin(input: {
  email: string;
  password: string;
}) {
  return request<{ user: AuthSession }>('/api/auth/signin', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function verifyEmail(input: {
  email: string;
  code: string;
}) {
  return request<{ user: AuthSession }>('/api/auth/verify-email', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function getCurrentUser() {
  return request<{ user: AuthSession }>('/api/auth/me');
}

export async function signout() {
  return request<{ ok: true }>('/api/auth/signout', { method: 'POST' });
}

export async function getFavorites() {
  return request<{ listingIds: string[]; journeyIds: string[] }>('/api/favorites');
}

export async function setFavoriteListing(id: string, isFavorite: boolean) {
  return request<{ ok: true }>(`/api/favorites/listings/${encodeURIComponent(id)}`, {
    method: isFavorite ? 'PUT' : 'DELETE',
  });
}

export async function setFavoriteJourney(id: string, isFavorite: boolean) {
  return request<{ ok: true }>(`/api/favorites/journeys/${encodeURIComponent(id)}`, {
    method: isFavorite ? 'PUT' : 'DELETE',
  });
}

export async function getExperiences() {
  return request<{ journeys: RouteJourney[] }>('/api/experiences');
}

export async function getBlogPosts(language: 'en' | 'tr') {
  return request<{ posts: BlogPost[] }>(`/api/blog-posts?lang=${language}`);
}

export async function getEvents(language: 'en' | 'tr') {
  return request<{ events: LongevityEvent[] }>(`/api/events?lang=${language}`);
}

export async function registerEvent(input: {
  eventId: string;
  name: string;
  email: string;
}) {
  return request<{ registration: unknown }>('/api/event-registrations', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}
