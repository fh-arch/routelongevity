import type { AuthRole, AuthSession } from './components/AuthModal';
import type { ChatMessage, HealthProfile, RouteJourney, RouteSuggestion } from './types';
import type { BlogPost, LongevityEvent } from './components/BlogEventsModal';

const API_BASE = import.meta.env.VITE_API_BASE || '';

export interface UserProfileSummary {
  user: AuthSession;
  partnerProfile: {
    business_name: string;
    approval_status: string;
    contact_phone?: string | null;
    website?: string | null;
    created_at: string;
    updated_at: string;
  } | null;
  stats: {
    favoriteListings: number;
    favoriteJourneys: number;
    listingApplications: number;
    partnerApplications: number;
    adApplications: number;
    eventRegistrations: number;
  };
  applications: {
    listings: Array<Record<string, unknown>>;
    partners: Array<Record<string, unknown>>;
    ads: Array<Record<string, unknown>>;
    events: Array<Record<string, unknown>>;
  };
}

export interface AdminOverview {
  stats: {
    users: number;
    listings: number;
    contacts: number;
    listingApplications: number;
    partnerApplications: number;
    adApplications: number;
    eventRegistrations: number;
  };
  queues: {
    contacts: Array<Record<string, unknown>>;
    listingApplications: Array<Record<string, unknown>>;
    partnerApplications: Array<Record<string, unknown>>;
    adApplications: Array<Record<string, unknown>>;
    eventRegistrations: Array<Record<string, unknown>>;
  };
  content: {
    users: Array<Record<string, unknown>>;
    listings: Array<Record<string, unknown>>;
    blogPosts: Array<Record<string, unknown>>;
    events: Array<Record<string, unknown>>;
  };
}

export interface AdminListingInput {
  externalId?: string;
  categoryId: string;
  name: string;
  description?: string;
  city?: string;
  region?: string;
  address?: string;
  latitude?: number | null;
  longitude?: number | null;
  imageUrl?: string;
  website?: string;
  phone?: string;
  email?: string;
  specialty?: string;
  rating?: number | null;
  reviewCount?: number | null;
  licenseType?: 'Premium' | 'Standard';
  annualFee?: number | null;
  isPremium?: boolean;
  featured?: boolean;
  status?: 'draft' | 'pending' | 'approved' | 'rejected';
}

export interface AdminBlogInput {
  id?: string;
  titleEn: string;
  titleTr?: string;
  subtitleEn?: string;
  subtitleTr?: string;
  categoryEn?: string;
  categoryTr?: string;
  readTimeEn?: string;
  readTimeTr?: string;
  dateEn?: string;
  dateTr?: string;
  authorEn?: string;
  authorTr?: string;
  imageUrl?: string;
  contentEn: string;
  contentTr?: string;
  tagsEn?: string;
  tagsTr?: string;
  status?: 'draft' | 'published';
  sortOrder?: number;
}

export interface AdminEventInput {
  id?: string;
  titleEn: string;
  titleTr?: string;
  dateEn?: string;
  dateTr?: string;
  timeEn?: string;
  timeTr?: string;
  locationEn?: string;
  locationTr?: string;
  cityEn?: string;
  cityTr?: string;
  descriptionEn: string;
  descriptionTr?: string;
  spotsLeft?: number;
  tagsEn?: string;
  tagsTr?: string;
  imageUrl?: string;
  status?: 'draft' | 'published';
  sortOrder?: number;
}

export interface AgentChatInput {
  message: string;
  sessionId: string;
  language?: 'en' | 'tr';
}

export interface AgentChatResponse {
  reply: string;
  suggestions: RouteSuggestion[];
  sessionId: string;
  message?: ChatMessage;
}

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
  role: Exclude<AuthRole, 'admin'>;
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

export async function getProfile() {
  return request<UserProfileSummary>('/api/profile');
}

export async function getAgentProfile() {
  return request<{ profile: HealthProfile | null }>('/api/agent/profile');
}

export async function saveAgentProfile(input: HealthProfile) {
  return request<{ profile: HealthProfile }>('/api/agent/profile', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function sendAgentMessage(input: AgentChatInput) {
  return request<AgentChatResponse>('/api/agent/chat', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function submitJourneyOutcome(input: {
  listingId?: string;
  listingExternalId?: string;
  visitedAt: string;
  selfReportedScore: number;
  notes?: string;
  biomarkerChange?: Record<string, unknown>;
}) {
  return request<{ outcome: unknown }>('/api/agent/outcomes', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function getAdminOverview() {
  return request<AdminOverview>('/api/admin/overview');
}

export async function updateAdminApplicationStatus(type: 'contact' | 'listing' | 'partner' | 'ad' | 'event', id: string, status: string) {
  return request<{ item: Record<string, unknown> }>(`/api/admin/applications/${type}/${id}`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

export async function createAdminListing(input: AdminListingInput) {
  return request<{ listing: Record<string, unknown> }>('/api/admin/listings', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function updateAdminListing(id: string, input: AdminListingInput) {
  return request<{ listing: Record<string, unknown> }>(`/api/admin/listings/${encodeURIComponent(id)}`, {
    method: 'PATCH',
    body: JSON.stringify(input),
  });
}

export async function saveAdminBlogPost(input: AdminBlogInput) {
  return request<{ post: Record<string, unknown> }>('/api/admin/blog-posts', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function saveAdminEvent(input: AdminEventInput) {
  return request<{ event: Record<string, unknown> }>('/api/admin/events', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function updateAdminUserRole(id: string, role: AuthRole) {
  return request<{ user: AuthSession }>(`/api/admin/users/${encodeURIComponent(id)}/role`, {
    method: 'PATCH',
    body: JSON.stringify({ role }),
  });
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

export async function submitContactMessage(input: {
  name: string;
  email: string;
  topic: string;
  message: string;
}) {
  return request<{ message: unknown }>('/api/contact-messages', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function submitListingApplication(input: {
  venueName: string;
  contactName?: string;
  email: string;
  categoryId?: string;
  city?: string;
  website?: string;
  message?: string;
}) {
  return request<{ application: unknown }>('/api/listing-applications', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function submitPartnerApplication(input: {
  businessName: string;
  contactName?: string;
  email: string;
  website?: string;
  partnerType?: string;
  message?: string;
}) {
  return request<{ application: unknown }>('/api/partner-applications', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}

export async function submitAdApplication(input: {
  businessName: string;
  contactName: string;
  email: string;
  phone?: string;
  website?: string;
  requestedSlot?: string;
  campaignGoal?: string;
  budgetRange?: string;
}) {
  return request<{ application: unknown }>('/api/ad-applications', {
    method: 'POST',
    body: JSON.stringify(input),
  });
}
