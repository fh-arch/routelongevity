import React, { useEffect, useState } from 'react';
import { ArrowRight, BookOpen, Clock, Loader2, Tag } from 'lucide-react';
import { getBlogPosts } from '../api';
import { useLanguage } from '../context/LanguageContext';
import type { BlogPost } from './BlogEventsModal';
import Footer from './Footer';

interface BlogPageProps {
  onOpenBlog: () => void;
  onOpenEvents: () => void;
}

export default function BlogPage({ onOpenBlog, onOpenEvents }: BlogPageProps) {
  const { language } = useLanguage();
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    setIsLoading(true);
    getBlogPosts(language)
      .then(({ posts: apiPosts }) => {
        setPosts(apiPosts);
        setSelectedPost(apiPosts[0] || null);
      })
      .catch((loadError) => {
        setError(loadError instanceof Error ? loadError.message : 'Articles could not be loaded.');
      })
      .finally(() => setIsLoading(false));
  }, [language]);

  return (
    <div className="flex-1 overflow-y-auto bg-[#f6fbf9] px-4 py-5 md:p-8 max-w-7xl mx-auto w-full space-y-8">
      <section className="rounded-3xl bg-brand-deep-slate text-white p-6 md:p-8 shadow-sm">
        <div className="flex items-center gap-2 text-brand-med-teal">
          <BookOpen className="h-5 w-5" />
          <span className="text-[10px] font-black uppercase tracking-widest">
            {language === 'tr' ? 'Longevity Gazetesi' : 'Longevity Gazette'}
          </span>
        </div>
        <h1 className="mt-4 text-3xl md:text-5xl font-black tracking-normal">
          {language === 'tr' ? 'Bilimsel makaleler ve saha notları' : 'Scientific articles and field notes'}
        </h1>
        <p className="mt-4 max-w-2xl text-sm leading-7 text-white/68">
          {language === 'tr'
            ? 'Termal su, klinik tarama, mikrobiyom, ritüel ve bölgesel üretim üzerine kanıta dayalı Route Longevity yazıları.'
            : 'Evidence-aware Route Longevity articles on thermal water, clinical screening, microbiome, ritual design, and regional production.'}
        </p>
      </section>

      {isLoading && (
        <div className="flex items-center gap-2 rounded-2xl border border-brand-warm-sand/50 bg-white p-4 text-sm font-bold text-brand-deep-slate">
          <Loader2 className="h-4 w-4 animate-spin" />
          {language === 'tr' ? 'Makaleler yükleniyor...' : 'Loading articles...'}
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm font-bold text-red-700">
          {error}
        </div>
      )}

      {selectedPost && (
        <section className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,1fr)_360px]">
          <article className="rounded-3xl border border-brand-warm-sand/45 bg-white overflow-hidden shadow-sm">
            <img src={selectedPost.imageUrl} alt={selectedPost.title} className="h-64 w-full object-cover" referrerPolicy="no-referrer" />
            <div className="p-6 md:p-8">
              <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-brand-deep-slate/55">
                <span className="rounded-full bg-brand-med-teal/10 px-3 py-1 text-brand-med-teal">{selectedPost.category}</span>
                <span className="flex items-center gap-1"><Clock className="h-3.5 w-3.5" /> {selectedPost.readTime}</span>
                <span>{selectedPost.date}</span>
              </div>
              <h2 className="mt-4 text-3xl font-black leading-tight text-brand-deep-slate">{selectedPost.title}</h2>
              <p className="mt-3 text-base leading-7 text-brand-deep-slate/62">{selectedPost.subtitle}</p>
              <div className="mt-6 whitespace-pre-line text-sm leading-8 text-brand-deep-slate/76">{selectedPost.content}</div>
              <div className="mt-6 flex flex-wrap gap-2">
                {selectedPost.tags.map((tag) => (
                  <span key={tag} className="inline-flex items-center gap-1 rounded-full bg-[#F1F7EA] px-3 py-1 text-[11px] font-bold text-[#086058]">
                    <Tag className="h-3 w-3" />
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </article>

          <aside className="space-y-3">
            {posts.map((post) => (
              <button
                key={post.id}
                onClick={() => setSelectedPost(post)}
                className={`w-full rounded-2xl border p-4 text-left transition-colors ${
                  selectedPost.id === post.id
                    ? 'border-brand-med-teal bg-[#F1F7EA]'
                    : 'border-brand-warm-sand/45 bg-white hover:border-brand-med-teal'
                }`}
              >
                <div className="text-[10px] font-black uppercase tracking-wider text-brand-med-teal">{post.category}</div>
                <div className="mt-2 text-sm font-black leading-snug text-brand-deep-slate">{post.title}</div>
                <div className="mt-2 flex items-center gap-2 text-[11px] font-bold text-brand-deep-slate/45">
                  <span>{post.readTime}</span>
                  <ArrowRight className="h-3 w-3" />
                </div>
              </button>
            ))}
          </aside>
        </section>
      )}

      <Footer onOpenBlog={onOpenBlog} onOpenEvents={onOpenEvents} />
    </div>
  );
}
