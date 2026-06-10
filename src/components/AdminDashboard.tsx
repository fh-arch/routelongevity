import React, { useEffect, useState } from 'react';
import {
  AlertCircle,
  Building,
  CalendarCheck,
  ClipboardCheck,
  FileText,
  Inbox,
  ListChecks,
  Loader2,
  MapPin,
  Megaphone,
  Newspaper,
  Save,
  Users,
} from 'lucide-react';
import {
  AdminBlogInput,
  AdminEventInput,
  AdminListingInput,
  AdminOverview,
  createAdminListing,
  getAdminOverview,
  saveAdminBlogPost,
  saveAdminEvent,
  updateAdminApplicationStatus,
  updateAdminUserRole,
} from '../api';
import { AuthSession } from './AuthModal';
import Footer from './Footer';
import { useLanguage } from '../context/LanguageContext';

type AdminTab = 'overview' | 'approvals' | 'listings' | 'travelers' | 'blogs' | 'events';

interface AdminDashboardProps {
  authSession: AuthSession;
  onOpenBlog: () => void;
  onOpenEvents: () => void;
}

const emptyListing: AdminListingInput = {
  categoryId: 'longevity-clinics',
  name: '',
  description: '',
  city: '',
  region: '',
  address: '',
  imageUrl: '',
  website: '',
  phone: '',
  email: '',
  specialty: '',
  licenseType: 'Standard',
  isPremium: false,
  featured: false,
  status: 'approved',
};

const emptyBlog: AdminBlogInput = {
  titleEn: '',
  titleTr: '',
  subtitleEn: '',
  categoryEn: 'Research',
  readTimeEn: '8 min read',
  authorEn: 'Route Longevity Editorial',
  imageUrl: '',
  contentEn: '',
  tagsEn: '',
  status: 'published',
  sortOrder: 0,
};

const emptyEvent: AdminEventInput = {
  titleEn: '',
  titleTr: '',
  dateEn: '',
  timeEn: '',
  locationEn: '',
  cityEn: '',
  descriptionEn: '',
  spotsLeft: 20,
  tagsEn: '',
  imageUrl: '',
  status: 'published',
  sortOrder: 0,
};

const asText = (item: Record<string, unknown>, key: string) => {
  const value = item[key];
  if (typeof value === 'string') return value;
  if (value && typeof value === 'object' && 'en' in value) return String((value as { en?: unknown }).en || '-');
  return value === null || value === undefined ? '-' : String(value);
};

const dateText = (value: unknown) => {
  if (typeof value !== 'string') return '-';
  return new Date(value).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
};

export default function AdminDashboard({ authSession, onOpenBlog, onOpenEvents }: AdminDashboardProps) {
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [overview, setOverview] = useState<AdminOverview | null>(null);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [listingForm, setListingForm] = useState<AdminListingInput>(emptyListing);
  const [blogForm, setBlogForm] = useState<AdminBlogInput>(emptyBlog);
  const [eventForm, setEventForm] = useState<AdminEventInput>(emptyEvent);

  const loadOverview = async () => {
    try {
      setError('');
      setIsLoading(true);
      setOverview(await getAdminOverview());
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : 'Admin data could not be loaded.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadOverview();
  }, [authSession.id]);

  const runSave = async (action: () => Promise<unknown>, message: string) => {
    try {
      setIsSaving(true);
      setError('');
      setNotice('');
      await action();
      setNotice(message);
      await loadOverview();
    } catch (saveError) {
      setError(saveError instanceof Error ? saveError.message : 'Save failed.');
    } finally {
      setIsSaving(false);
    }
  };

  const statusPill = (status: unknown) => (
    <span className="rounded-full bg-[#F1F7EA] px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-[#086058]">
      {typeof status === 'string' ? status : 'new'}
    </span>
  );

  const tabs: Array<{ id: AdminTab; label: string; icon: React.ElementType }> = [
    { id: 'overview', label: 'Overview', icon: ListChecks },
    { id: 'approvals', label: 'Approvals', icon: ClipboardCheck },
    { id: 'listings', label: 'Pins', icon: MapPin },
    { id: 'travelers', label: 'Travelers', icon: Users },
    { id: 'blogs', label: 'Blogs', icon: Newspaper },
    { id: 'events', label: 'Events', icon: CalendarCheck },
  ];

  const renderQueue = (
    title: string,
    type: 'contact' | 'listing' | 'partner' | 'ad' | 'event',
    items: Array<Record<string, unknown>>,
    primaryKey: string,
    secondaryKey: string,
    statuses: string[],
  ) => (
    <section className="rounded-2xl border border-brand-warm-sand/45 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between border-b border-[#d8ebe6] pb-3">
        <h3 className="text-sm font-black text-brand-deep-slate">{title}</h3>
        <span className="text-[10px] font-black text-brand-deep-slate/45">{items.length}</span>
      </div>
      <div className="mt-4 space-y-3">
        {items.length === 0 ? (
          <p className="text-xs text-brand-deep-slate/55">No records yet.</p>
        ) : items.map((item) => (
          <article key={String(item.id)} className="rounded-2xl border border-[#d8ebe6] bg-[#f6fbf9] p-4">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <div className="truncate text-sm font-black text-brand-deep-slate">{asText(item, primaryKey)}</div>
                <div className="mt-1 text-xs text-brand-deep-slate/55">{asText(item, secondaryKey)} • {dateText(item.created_at)}</div>
              </div>
              {statusPill(item.status)}
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {statuses.map((status) => (
                <button
                  key={status}
                  onClick={() => runSave(() => updateAdminApplicationStatus(type, String(item.id), status), 'Status updated.')}
                  className="rounded-xl border border-brand-warm-sand bg-white px-3 py-1.5 text-[11px] font-bold text-brand-deep-slate/70 hover:border-brand-med-teal"
                >
                  {status}
                </button>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );

  const inputClass = 'w-full rounded-xl border border-brand-warm-sand/70 bg-white px-3 py-2.5 text-sm text-brand-deep-slate outline-none focus:border-brand-med-teal';

  return (
    <div className="flex-1 overflow-y-auto bg-[#f6fbf9] p-4 md:p-8 max-w-7xl mx-auto w-full space-y-8 animate-in fade-in duration-300">
      <section className="rounded-3xl bg-brand-deep-slate p-6 text-white shadow-sm">
        <span className="text-[10px] uppercase font-extrabold tracking-widest text-brand-med-teal bg-brand-med-teal/10 px-2.5 py-1 rounded">
          {language === 'tr' ? 'Yönetim' : 'Admin'}
        </span>
        <h2 className="mt-3 text-3xl font-black tracking-normal">
          {language === 'tr' ? 'Route Longevity yönetim paneli' : 'Route Longevity management panel'}
        </h2>
        <p className="mt-3 max-w-2xl text-sm leading-6 text-white/70">
          Manage pins, approvals, travelers, blog posts, events, and application queues from PostgreSQL.
        </p>
      </section>

      <nav className="flex gap-2 overflow-x-auto rounded-2xl border border-brand-warm-sand/45 bg-white p-2 shadow-sm">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex shrink-0 items-center gap-2 rounded-xl px-4 py-2 text-xs font-black transition-colors ${
                active ? 'bg-brand-deep-slate text-white' : 'text-brand-deep-slate/60 hover:bg-[#F1F7EA]'
              }`}
            >
              <Icon className="h-4 w-4" />
              {tab.label}
            </button>
          );
        })}
      </nav>

      {isLoading && (
        <div className="flex items-center gap-2 rounded-2xl border border-brand-warm-sand/50 bg-white p-4 text-sm font-bold text-brand-deep-slate">
          <Loader2 className="h-4 w-4 animate-spin" />
          Loading admin data...
        </div>
      )}

      {error && (
        <div className="flex items-center gap-2 rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-700">
          <AlertCircle className="h-4 w-4" />
          {error}
        </div>
      )}

      {notice && (
        <div className="rounded-2xl border border-[#79c9b8]/35 bg-[#F1F7EA] p-4 text-sm font-bold text-[#086058]">
          {notice}
        </div>
      )}

      {overview && activeTab === 'overview' && (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-4 lg:grid-cols-7">
          {[
            { label: 'Users', value: overview.stats.users, icon: Users },
            { label: 'Listings', value: overview.stats.listings, icon: ListChecks },
            { label: 'Contact', value: overview.stats.contacts, icon: Inbox },
            { label: 'Listing apps', value: overview.stats.listingApplications, icon: ClipboardCheck },
            { label: 'Partners', value: overview.stats.partnerApplications, icon: Building },
            { label: 'Ads', value: overview.stats.adApplications, icon: Megaphone },
            { label: 'Events', value: overview.stats.eventRegistrations, icon: CalendarCheck },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="rounded-2xl border border-brand-warm-sand/45 bg-white p-4 shadow-sm">
                <Icon className="h-4 w-4 text-brand-med-teal" />
                <div className="mt-3 text-2xl font-black text-brand-deep-slate">{stat.value}</div>
                <div className="text-[10px] font-black uppercase tracking-wider text-brand-deep-slate/45">{stat.label}</div>
              </div>
            );
          })}
        </div>
      )}

      {overview && activeTab === 'approvals' && (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
          {renderQueue('Contact messages', 'contact', overview.queues.contacts, 'name', 'email', ['new', 'read', 'archived'])}
          {renderQueue('Listing applications', 'listing', overview.queues.listingApplications, 'venue_name', 'email', ['pending', 'approved', 'rejected'])}
          {renderQueue('Partner applications', 'partner', overview.queues.partnerApplications, 'business_name', 'email', ['pending', 'approved', 'rejected'])}
          {renderQueue('Ad applications', 'ad', overview.queues.adApplications, 'business_name', 'email', ['pending', 'approved', 'rejected'])}
          {renderQueue('Event registrations', 'event', overview.queues.eventRegistrations, 'name', 'event_id', ['pending', 'confirmed', 'cancelled'])}
        </div>
      )}

      {overview && activeTab === 'listings' && (
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-[420px_minmax(0,1fr)]">
          <section className="rounded-3xl border border-brand-warm-sand/45 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-black text-brand-deep-slate">Add new pin</h3>
            <div className="mt-4 space-y-3">
              <input className={inputClass} placeholder="Name" value={listingForm.name} onChange={(e) => setListingForm({ ...listingForm, name: e.target.value })} />
              <select className={inputClass} value={listingForm.categoryId} onChange={(e) => setListingForm({ ...listingForm, categoryId: e.target.value })}>
                <option value="hammams">Hammams</option>
                <option value="thermal-spa">Thermal & Spa</option>
                <option value="mediterranean-diet">Mediterranean Diet</option>
                <option value="longevity-clinics">Longevity Clinics</option>
                <option value="retreat-nature">Retreat & Nature</option>
                <option value="traditional-med">Traditional Medicine</option>
                <option value="local-producers">Local Producers</option>
              </select>
              <textarea className={inputClass} rows={4} placeholder="Description" value={listingForm.description} onChange={(e) => setListingForm({ ...listingForm, description: e.target.value })} />
              <div className="grid grid-cols-2 gap-3">
                <input className={inputClass} placeholder="City" value={listingForm.city} onChange={(e) => setListingForm({ ...listingForm, city: e.target.value })} />
                <input className={inputClass} placeholder="Region" value={listingForm.region} onChange={(e) => setListingForm({ ...listingForm, region: e.target.value })} />
                <input className={inputClass} placeholder="Latitude" type="number" onChange={(e) => setListingForm({ ...listingForm, latitude: e.target.value ? Number(e.target.value) : null })} />
                <input className={inputClass} placeholder="Longitude" type="number" onChange={(e) => setListingForm({ ...listingForm, longitude: e.target.value ? Number(e.target.value) : null })} />
              </div>
              <input className={inputClass} placeholder="Website" value={listingForm.website} onChange={(e) => setListingForm({ ...listingForm, website: e.target.value })} />
              <input className={inputClass} placeholder="Image URL" value={listingForm.imageUrl} onChange={(e) => setListingForm({ ...listingForm, imageUrl: e.target.value })} />
              <div className="flex flex-wrap gap-3 text-xs font-bold text-brand-deep-slate">
                <label className="flex items-center gap-2"><input type="checkbox" checked={listingForm.isPremium} onChange={(e) => setListingForm({ ...listingForm, isPremium: e.target.checked, licenseType: e.target.checked ? 'Premium' : 'Standard' })} /> Premium</label>
                <label className="flex items-center gap-2"><input type="checkbox" checked={listingForm.featured} onChange={(e) => setListingForm({ ...listingForm, featured: e.target.checked })} /> Featured</label>
              </div>
              <button
                disabled={isSaving}
                onClick={() => runSave(() => createAdminListing(listingForm), 'Listing pin saved.')}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-brand-deep-slate px-4 py-3 text-sm font-black text-white"
              >
                <Save className="h-4 w-4" />
                Save pin
              </button>
            </div>
          </section>

          <section className="rounded-3xl border border-brand-warm-sand/45 bg-white p-5 shadow-sm">
            <h3 className="text-lg font-black text-brand-deep-slate">Latest pins</h3>
            <div className="mt-4 overflow-hidden rounded-2xl border border-[#d8ebe6]">
              {overview.content.listings.map((listing) => (
                <div key={String(listing.id)} className="grid grid-cols-[minmax(0,1fr)_120px_90px] gap-3 border-b border-[#d8ebe6] p-3 text-xs last:border-0">
                  <div className="min-w-0">
                    <div className="truncate font-black text-brand-deep-slate">{asText(listing, 'name')}</div>
                    <div className="text-brand-deep-slate/50">{asText(listing, 'city')} • {asText(listing, 'category_id')}</div>
                  </div>
                  <div>{statusPill(listing.status)}</div>
                  <div className="text-right font-bold text-brand-deep-slate/55">{asText(listing, 'external_id')}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      )}

      {overview && activeTab === 'travelers' && (
        <section className="rounded-3xl border border-brand-warm-sand/45 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-black text-brand-deep-slate">Users and travelers</h3>
          <div className="mt-4 space-y-3">
            {overview.content.users.map((user) => (
              <article key={String(user.id)} className="flex flex-col gap-3 rounded-2xl border border-[#d8ebe6] bg-[#f6fbf9] p-4 md:flex-row md:items-center md:justify-between">
                <div>
                  <div className="font-black text-brand-deep-slate">{asText(user, 'name')}</div>
                  <div className="text-xs text-brand-deep-slate/55">{asText(user, 'email')}</div>
                </div>
                <select
                  className="rounded-xl border border-brand-warm-sand bg-white px-3 py-2 text-xs font-bold text-brand-deep-slate"
                  value={asText(user, 'role')}
                  onChange={(e) => runSave(() => updateAdminUserRole(String(user.id), e.target.value as AuthSession['role']), 'User role updated.')}
                >
                  <option value="user">Traveler</option>
                  <option value="partner">Partner</option>
                  <option value="admin">Admin</option>
                </select>
              </article>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'blogs' && (
        <section className="rounded-3xl border border-brand-warm-sand/45 bg-white p-5 shadow-sm">
          <h3 className="flex items-center gap-2 text-lg font-black text-brand-deep-slate"><FileText className="h-5 w-5" /> Add blog article</h3>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            <input className={inputClass} placeholder="Title EN" value={blogForm.titleEn} onChange={(e) => setBlogForm({ ...blogForm, titleEn: e.target.value })} />
            <input className={inputClass} placeholder="Title TR" value={blogForm.titleTr} onChange={(e) => setBlogForm({ ...blogForm, titleTr: e.target.value })} />
            <input className={inputClass} placeholder="Category" value={blogForm.categoryEn} onChange={(e) => setBlogForm({ ...blogForm, categoryEn: e.target.value })} />
            <input className={inputClass} placeholder="Image URL" value={blogForm.imageUrl} onChange={(e) => setBlogForm({ ...blogForm, imageUrl: e.target.value })} />
            <textarea className={`${inputClass} md:col-span-2`} rows={2} placeholder="Subtitle EN" value={blogForm.subtitleEn} onChange={(e) => setBlogForm({ ...blogForm, subtitleEn: e.target.value })} />
            <textarea className={`${inputClass} md:col-span-2`} rows={8} placeholder="Scientific article content EN" value={blogForm.contentEn} onChange={(e) => setBlogForm({ ...blogForm, contentEn: e.target.value })} />
            <input className={inputClass} placeholder="Tags comma separated" value={blogForm.tagsEn} onChange={(e) => setBlogForm({ ...blogForm, tagsEn: e.target.value })} />
            <button disabled={isSaving} onClick={() => runSave(() => saveAdminBlogPost(blogForm), 'Blog post saved.')} className="rounded-xl bg-brand-deep-slate px-4 py-3 text-sm font-black text-white">
              Save blog
            </button>
          </div>
        </section>
      )}

      {activeTab === 'events' && (
        <section className="rounded-3xl border border-brand-warm-sand/45 bg-white p-5 shadow-sm">
          <h3 className="flex items-center gap-2 text-lg font-black text-brand-deep-slate"><CalendarCheck className="h-5 w-5" /> Add event</h3>
          <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
            <input className={inputClass} placeholder="Title EN" value={eventForm.titleEn} onChange={(e) => setEventForm({ ...eventForm, titleEn: e.target.value })} />
            <input className={inputClass} placeholder="Title TR" value={eventForm.titleTr} onChange={(e) => setEventForm({ ...eventForm, titleTr: e.target.value })} />
            <input className={inputClass} placeholder="Date" value={eventForm.dateEn} onChange={(e) => setEventForm({ ...eventForm, dateEn: e.target.value })} />
            <input className={inputClass} placeholder="Time" value={eventForm.timeEn} onChange={(e) => setEventForm({ ...eventForm, timeEn: e.target.value })} />
            <input className={inputClass} placeholder="Location" value={eventForm.locationEn} onChange={(e) => setEventForm({ ...eventForm, locationEn: e.target.value })} />
            <input className={inputClass} placeholder="City" value={eventForm.cityEn} onChange={(e) => setEventForm({ ...eventForm, cityEn: e.target.value })} />
            <textarea className={`${inputClass} md:col-span-2`} rows={5} placeholder="Description EN" value={eventForm.descriptionEn} onChange={(e) => setEventForm({ ...eventForm, descriptionEn: e.target.value })} />
            <input className={inputClass} placeholder="Image URL" value={eventForm.imageUrl} onChange={(e) => setEventForm({ ...eventForm, imageUrl: e.target.value })} />
            <input className={inputClass} type="number" placeholder="Spots left" value={eventForm.spotsLeft} onChange={(e) => setEventForm({ ...eventForm, spotsLeft: Number(e.target.value) })} />
            <button disabled={isSaving} onClick={() => runSave(() => saveAdminEvent(eventForm), 'Event saved.')} className="rounded-xl bg-brand-deep-slate px-4 py-3 text-sm font-black text-white md:col-span-2">
              Save event
            </button>
          </div>
        </section>
      )}

      <Footer onOpenBlog={onOpenBlog} onOpenEvents={onOpenEvents} />
    </div>
  );
}
