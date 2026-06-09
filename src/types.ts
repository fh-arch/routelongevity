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
  phone: string;
  email: string;
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
