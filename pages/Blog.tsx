import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Search, Calendar, ChevronRight, User } from 'lucide-react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  image_url: string;
  category: string;
  created_at: string;
}

const Blog: React.FC = () => {
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
      
      {/* Page Header - Exact Match to Photo */}
      <div className="border-b border-slate-100 py-8 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Blog</h1>
          <div className="flex items-center gap-2 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em]">
            <Link to="/" className="hover:text-sky-600 transition-colors">Home</Link>
            <span className="text-slate-200">|</span>
            <span className="text-slate-200">Blog</span>
            <span className="text-slate-200">|</span>
            <span className="text-slate-800">Posts</span>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-20 flex flex-col lg:flex-row gap-16">
        
        {/* Sidebar - Left Side (As in Photo) */}
        <aside className="w-full lg:w-72 flex-shrink-0 flex flex-col gap-14">
          
          {/* Search Bar */}
          <div className="relative group">
            <input 
              type="text" 
              placeholder="Search..." 
              className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-sm text-sm focus:outline-none focus:border-sky-300 transition-all text-slate-600"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-hover:text-sky-500 transition-colors" />
          </div>

          {/* Categories Section */}
          <section>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-8 border-b border-slate-100 pb-3">Categories</h3>
            <ul className="flex flex-col gap-4">
              {['Autismo', 'Desenvolvimento', 'Educação', 'Psicopedagogia', 'Dicas para Pais'].map((cat) => (
                <li key={cat}>
                  <button className="text-slate-500 hover:text-sky-600 text-[13px] font-semibold transition-colors">
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </section>

          {/* Popular Posts Section (Numbered) */}
          <section>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-8 border-b border-slate-100 pb-3">Popular Posts</h3>
            <div className="flex flex-col gap-8">
              {[
                "Sinais precoces de TEA no desenvolvimento",
                "Como o lúdico transforma o aprendizado",
                "Estratégias eficazes para TDAH na escola",
                "A importância do diagnóstico psicopedagógico"
              ].map((title, idx) => (
                <div key={idx} className="flex gap-4 items-start group cursor-pointer">
                  <span className="text-2xl font-bold text-slate-200 group-hover:text-sky-200 transition-colors leading-none">{idx + 1}</span>
                  <div className="flex flex-col gap-1">
                    <h4 className="text-[13px] font-bold text-slate-700 leading-tight group-hover:text-sky-600 transition-colors line-clamp-2">{title}</h4>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">April 2026</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Instagram Grid (3x2 as in photo) */}
          <section>
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-widest mb-8 border-b border-slate-100 pb-3">Instagram</h3>
            <div className="grid grid-cols-3 gap-2">
              {[1,2,3,4,5,6].map((i) => (
                <div key={i} className="aspect-square bg-slate-100 rounded-sm overflow-hidden hover:opacity-80 transition-opacity cursor-pointer">
                  <img src={`https://images.unsplash.com/photo-1594608661623-aa0bd3a67d28?auto=format&fit=crop&q=80&w=200&sig=${i}`} alt="Insta" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </section>

        </aside>

        {/* Content Area - Right Side (2 columns) */}
        <div className="flex-grow">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-8 h-8 border-2 border-slate-100 border-t-sky-600 rounded-full animate-spin"></div>
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20">
              {filteredPosts.map((post) => (
                <Link key={post.id} to={`/blog/${post.slug}`} className="group flex flex-col">
                  <div className="relative aspect-[16/11] overflow-hidden rounded-sm mb-8 bg-slate-50">
                    <img 
                      src={post.image_url || 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80&w=800'} 
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                    />
                  </div>
                  
                  <div className="flex items-center gap-3 text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mb-4">
                    <span className="text-sky-600">Admin</span>
                    <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
                    <span>{new Date(post.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-slate-800 mb-4 group-hover:text-sky-600 transition-colors leading-tight">
                    {post.title}
                  </h3>
                  
                  <p className="text-slate-500 text-[13px] leading-relaxed line-clamp-3 mb-6 font-medium">
                    {post.excerpt}
                  </p>
                  
                  <div className="mt-auto text-sky-600 font-bold text-[11px] uppercase tracking-widest flex items-center gap-2 group-hover:gap-4 transition-all">
                    Continue Reading <ChevronRight className="w-4 h-4" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 text-slate-300 font-medium italic">
              No matching articles found.
            </div>
          )}

          {/* Pagination (Standard style as in photo) */}
          {filteredPosts.length > 0 && (
            <div className="flex items-center justify-center gap-2 mt-24 pt-16 border-t border-slate-100">
              <button className="w-10 h-10 flex items-center justify-center bg-slate-900 text-white text-xs font-bold transition-all">1</button>
              <button className="w-10 h-10 flex items-center justify-center bg-white text-slate-400 border border-slate-200 text-xs font-bold hover:bg-slate-50 transition-all">2</button>
              <button className="w-10 h-10 flex items-center justify-center bg-white text-slate-400 border border-slate-200 text-xs font-bold hover:bg-slate-50 transition-all">3</button>
              <button className="w-10 h-10 flex items-center justify-center bg-white text-slate-400 border border-slate-200 text-xs font-bold hover:bg-slate-50 transition-all">
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
