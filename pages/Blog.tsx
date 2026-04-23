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
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar onOpenScheduling={() => {}} />
      
      {/* 1. Slim Header with Breadcrumbs on the right (Exact Match) */}
      <div className="border-b border-slate-100 py-6">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <h1 className="text-xl font-bold text-slate-800 tracking-tight">Blog</h1>
          <div className="flex items-center gap-2 text-[9px] font-black text-slate-300 uppercase tracking-[0.2em]">
            <Link to="/" className="hover:text-sky-600 transition-colors">Home</Link>
            <span>/</span>
            <span>Blog</span>
            <span>/</span>
            <span className="text-slate-800">Layout</span>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-16 flex flex-col lg:flex-row gap-12">
        
        {/* 2. SIDEBAR - Left Side (As in photo) */}
        <aside className="w-full lg:w-72 flex-shrink-0 flex flex-col gap-12">
          
          {/* Search bar - minimalist */}
          <div className="relative group">
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full px-4 py-3 bg-white border border-slate-100 text-xs focus:outline-none focus:border-sky-300 transition-all text-slate-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-200" />
          </div>

          {/* Categories Section */}
          <section>
            <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] mb-6">Categories</h3>
            <ul className="flex flex-col gap-4">
              {['Autismo', 'TDAH', 'Alfabetização', 'Desenvolvimento', 'Saúde'].map((cat) => (
                <li key={cat}>
                  <button className="text-slate-400 hover:text-sky-600 text-[12px] font-bold transition-colors">
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </section>

          {/* Popular Posts (Numbered) */}
          <section>
            <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] mb-6">Popular Posts</h3>
            <div className="flex flex-col gap-6">
              {[
                "Sinais de TEA no aprendizado infantil",
                "Estratégias para foco em crianças com TDAH",
                "A importância do diagnóstico precoce",
                "Ansiedade escolar: como acolher seu filho"
              ].map((title, idx) => (
                <div key={idx} className="flex gap-4 items-start group cursor-pointer">
                  <span className="text-4xl font-black text-slate-50 group-hover:text-sky-50 transition-colors leading-none -mt-1">{idx + 1}</span>
                  <div className="flex flex-col gap-1">
                    <h4 className="text-[12px] font-black text-slate-700 leading-snug group-hover:text-sky-600 transition-colors line-clamp-2">{title}</h4>
                    <span className="text-[9px] text-slate-300 font-bold uppercase tracking-widest">April 2026</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Instagram Grid (3x2) */}
          <section>
            <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.2em] mb-6">Instagram</h3>
            <div className="grid grid-cols-3 gap-1">
              {[1,2,3,4,5,6].map((i) => (
                <div key={i} className="aspect-square bg-slate-50 overflow-hidden hover:opacity-80 transition-opacity cursor-pointer">
                  <img src={`https://images.unsplash.com/photo-1594608661623-aa0bd3a67d28?auto=format&fit=crop&q=80&w=200&sig=${i}`} alt="insta" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </section>
        </aside>

        {/* 3. POST GRID - Right Side (2 Columns) */}
        <section className="flex-grow">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-6 h-6 border-2 border-slate-50 border-t-sky-600 rounded-full animate-spin"></div>
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-16">
              {filteredPosts.map((post) => (
                <Link key={post.id} to={`/blog/${post.slug}`} className="group flex flex-col bg-white">
                  <div className="relative aspect-[16/11] overflow-hidden mb-6 rounded-sm">
                    <img 
                      src={post.image_url} 
                      alt={post.title}
                      loading="lazy"
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                  </div>
                  
                  <div className="flex items-center gap-2 text-[9px] font-black text-slate-300 uppercase tracking-[0.2em] mb-3">
                    <span aria-hidden="true">Admin</span>
                    <span className="w-1 h-1 bg-slate-100 rounded-full"></span>
                    <span aria-label={`Publicado em ${new Date(post.created_at).toLocaleDateString('pt-BR')}`}>
                      {new Date(post.created_at).toLocaleDateString('pt-BR', { month: 'long', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                  
                  <h3 className="text-lg font-black text-slate-800 mb-3 group-hover:text-sky-600 transition-colors leading-tight">
                    {post.title}
                  </h3>
                  
                  <p className="text-slate-400 text-[12px] leading-relaxed line-clamp-3 mb-5 font-medium">
                    {post.excerpt}
                  </p>
                  
                  <div className="mt-auto text-sky-600 font-black text-[10px] uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all">
                    Continue Reading <ChevronRight className="w-3 h-3" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-slate-200 italic text-sm">
              No articles found.
            </div>
          )}

          {/* 4. PAGINATION - Sada Style (Exact Match) */}
          {filteredPosts.length > 0 && (
            <div className="flex items-center justify-center gap-2 mt-24 pt-12 border-t border-slate-50">
              <button className="w-8 h-8 flex items-center justify-center bg-slate-900 text-white text-[10px] font-black">1</button>
              <button className="w-8 h-8 flex items-center justify-center bg-white text-slate-300 border border-slate-100 text-[10px] font-black hover:text-slate-900 transition-all">2</button>
              <button className="w-8 h-8 flex items-center justify-center bg-white text-slate-300 border border-slate-100 text-[10px] font-black hover:text-slate-900 transition-all">3</button>
              <button className="w-8 h-8 flex items-center justify-center bg-white text-slate-300 border border-slate-100 text-[10px] font-black hover:text-slate-900 transition-all">
                <ChevronRight className="w-3 h-3" />
              </button>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
