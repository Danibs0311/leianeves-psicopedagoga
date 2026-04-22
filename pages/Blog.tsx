import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Search, ChevronRight } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image_url: string;
  category: string;
  created_at: string;
}

export const Blog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPosts = posts.filter(post =>
    post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Navbar onOpenScheduling={() => {}} />
      
      {/* 1. Page Title & Breadcrumbs Header */}
      <header className="border-b border-slate-100 py-8">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-slate-800 uppercase tracking-tight">Blog</h1>
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
            <Link to="/" className="hover:text-sky-600 transition-colors">Home</Link>
            <span>/</span>
            <span>Blog</span>
            <span>/</span>
            <span className="text-slate-800">List Layout</span>
          </div>
        </div>
      </header>

      {/* 2. Main Content Wrapper */}
      <main className="max-w-7xl mx-auto px-6 py-16 flex flex-col lg:flex-row gap-20">
        
        {/* SIDEBAR (LEFT) - Idêntico à Foto */}
        <aside className="w-full lg:w-64 flex-shrink-0 flex flex-col gap-14">
          
          {/* Search Widget */}
          <div>
            <div className="relative group">
              <input 
                type="text" 
                placeholder="Search..." 
                className="w-full pl-4 pr-10 py-3 bg-slate-50 border border-slate-100 rounded-sm text-sm focus:outline-none focus:border-sky-300 transition-all text-slate-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
            </div>
          </div>

          {/* Categories Widget */}
          <section>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6 border-b border-slate-50 pb-2">Categories</h3>
            <ul className="flex flex-col gap-3">
              {['Autismo', 'TDAH', 'Alfabetização', 'Desenvolvimento', 'Saúde Infantil'].map((cat) => (
                <li key={cat}>
                  <button className="text-slate-500 hover:text-sky-600 text-[13px] font-medium transition-colors">
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </section>

          {/* Popular Posts (Numbered List) */}
          <section>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6 border-b border-slate-50 pb-2">Popular Posts</h3>
            <div className="flex flex-col gap-8">
              {[
                "Entendendo o TEA em 2026",
                "Estratégias para foco no TDAH",
                "A psicopedagogia em casa",
                "Ansiedade e o aprendizado"
              ].map((title, idx) => (
                <div key={idx} className="flex gap-4 items-start group cursor-pointer">
                  <span className="text-3xl font-bold text-slate-100 leading-none">{idx + 1}</span>
                  <div>
                    <h4 className="text-[13px] font-bold text-slate-700 leading-tight group-hover:text-sky-600 transition-colors line-clamp-2">{title}</h4>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">22 April 2026</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Instagram Grid (3x2) */}
          <section>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-6 border-b border-slate-50 pb-2">Instagram</h3>
            <div className="grid grid-cols-3 gap-2">
              {[1,2,3,4,5,6].map((i) => (
                <div key={i} className="aspect-square bg-slate-100 overflow-hidden hover:opacity-80 transition-opacity cursor-pointer rounded-sm">
                  <img src={`https://images.unsplash.com/photo-1594608661623-aa0bd3a67d28?auto=format&fit=crop&q=80&w=200&sig=${i}`} alt="Insta" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </section>
        </aside>

        {/* POSTS GRID (RIGHT) - 2 Columns */}
        <section className="flex-grow">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-slate-50 border-t-sky-600 rounded-full animate-spin"></div>
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
              {filteredPosts.map((post) => (
                <Link key={post.id} to={`/blog/${post.slug}`} className="group flex flex-col">
                  <div className="relative aspect-[4/3] overflow-hidden mb-6">
                    <img 
                      src={post.image_url} 
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">
                    <span>Léia Neves</span>
                    <span>•</span>
                    <span>{new Date(post.created_at).toLocaleDateString('pt-BR', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-sky-600 transition-colors leading-tight">
                    {post.title}
                  </h3>
                  
                  <p className="text-slate-500 text-[13px] leading-relaxed line-clamp-3 mb-5 font-medium">
                    {post.excerpt}
                  </p>
                  
                  <div className="mt-auto text-sky-600 font-bold text-[11px] uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all">
                    Continue Reading <ChevronRight className="w-4 h-4" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-50 rounded-xl">
              <p className="text-slate-400 italic">No posts found for this search.</p>
            </div>
          )}

          {/* PAGINATION - Estilo Sada */}
          {filteredPosts.length > 0 && (
            <div className="flex items-center justify-center gap-2 mt-20 pt-16 border-t border-slate-50">
              <button className="w-9 h-9 flex items-center justify-center bg-slate-900 text-white text-[11px] font-bold">1</button>
              <button className="w-9 h-9 flex items-center justify-center bg-white text-slate-400 border border-slate-100 text-[11px] font-bold hover:bg-slate-50">2</button>
              <button className="w-9 h-9 flex items-center justify-center bg-white text-slate-400 border border-slate-100 text-[11px] font-bold hover:bg-slate-50">3</button>
              <button className="w-9 h-9 flex items-center justify-center bg-white text-slate-400 border border-slate-100 text-[11px] font-bold hover:bg-slate-50">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};
