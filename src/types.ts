export type LicenseType = 'Premium' | 'Standard';

export interface Partner {
  id: string;
  name: string;
  category: string;
  categoryLabel: string;
  location: string;
  city: string;
  country?: string;
  rating: number;
  reviewCount: number;
  latitude: number;
  longitude: number;
  imageUrl: string;
  description: string;
  licenseType: LicenseType;
  annualFee: number;
  specialty: string;
  phone: string | null;
  email: string | null;
  address: string;
  website: string | null;
  featured: boolean;
  // SaaS Analytics Metrics
  analytics: {
    views: number;
    clicks: number;
    leadsGenerated: number;
    monthlyTrafficTrend: number[]; // 6 months of data
  };
}

export interface Category {
  key: string;
  label: string;
  iconName: string;
  color: string; // Tailwinds colors or hex codes
  borderColor: string;
}

export type ActiveTab = 'explore' | 'map' | 'experiences' | 'favorites' | 'blog' | 'events' | 'profile';

export interface RouteJourney {
  id: string;
  title: string;
  subtitle: string;
  duration: string;
  cities: string[];
  description: string;
  partnerIds: string[];
  imageUrl: string;
  tags: string[];
}

export interface RouteSuggestion {
  listingId: string;
  externalId: string | null;
  name: string;
  categoryId: string;
  category?: string;
  city: string | null;
  country: string | null;
  reason: string;
  durationDays?: number | null;
  priceRange?: string | null;
  rating?: number | null;
  outcomeScore?: number | null;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'agent';
  type: 'text' | 'route_suggestion' | 'loading';
  content: string;
  suggestions?: RouteSuggestion[];
  timestamp: string;
}

export interface HealthProfile {
  goals: string[];
  budgetRange: 'economy' | 'premium' | 'luxury';
  travelDays: number;
  preferredRegions: string[];
  biomarkers?: Record<string, unknown>;
  createdAt?: string;
  updatedAt?: string;
}
