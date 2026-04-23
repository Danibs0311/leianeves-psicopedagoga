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
    <div className="min-h-screen bg-white flex flex-col font-sans overflow-x-hidden">
      <Navbar onOpenScheduling={() => {}} />
      
      {/* Page Header */}
      <div className="border-b border-slate-100 py-10 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Blog Profissional</h1>
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
            <Link to="/" className="hover:text-sky-600 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-slate-900">Blog</span>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-20 w-full">
        {/* GRID LAYOUT - Force 3/9 distribution on large screens */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* SIDEBAR - 3 Columns (25%) */}
          <aside className="lg:col-span-3 flex flex-col gap-14">
            
            {/* Search */}
            <div className="relative">
              <input 
                type="text" 
                placeholder="Search articles..." 
                className="w-full px-5 py-4 bg-slate-50 border border-slate-100 rounded-xl text-sm focus:outline-none focus:border-sky-300 transition-all text-slate-600"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <Search className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
            </div>

            {/* Categories */}
            <section>
              <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em] mb-8 border-b border-slate-100 pb-3">Tópicos</h3>
              <ul className="flex flex-col gap-4">
                {['TEA (Autismo)', 'TDAH', 'Alfabetização', 'Desenvolvimento', 'Apoio Familiar'].map((cat) => (
                  <li key={cat}>
                    <button className="text-slate-400 hover:text-sky-600 text-[13px] font-bold transition-colors">
                      {cat}
                    </button>
                  </li>
                ))}
              </ul>
            </section>

            {/* Popular Posts */}
            <section>
              <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em] mb-8 border-b border-slate-100 pb-3">Mais Lidos</h3>
              <div className="flex flex-col gap-8">
                {[
                  "Sinais precoces no desenvolvimento",
                  "Estratégias para foco e atenção",
                  "Alfabetização inclusiva: por onde começar",
                  "O papel da família na terapia"
                ].map((title, idx) => (
                  <div key={idx} className="flex gap-4 items-start group cursor-pointer">
                    <span className="text-4xl font-black text-slate-50 group-hover:text-sky-50 transition-colors leading-none">{idx + 1}</span>
                    <div className="flex flex-col gap-1">
                      <h4 className="text-[13px] font-black text-slate-700 leading-snug group-hover:text-sky-600 transition-colors line-clamp-2">{title}</h4>
                      <span className="text-[9px] text-slate-300 font-bold uppercase tracking-widest mt-1">Léia Neves</span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Instagram */}
            <section>
              <h3 className="text-[11px] font-black text-slate-900 uppercase tracking-[0.3em] mb-8 border-b border-slate-100 pb-3">Instagram</h3>
              <div className="grid grid-cols-3 gap-2">
                {[1,2,3,4,5,6].map((i) => (
                  <div key={i} className="aspect-square bg-slate-50 rounded-lg overflow-hidden hover:opacity-80 transition-opacity">
                    <img src={`https://images.unsplash.com/photo-1594608661623-aa0bd3a67d28?auto=format&fit=crop&q=80&w=200&sig=${i}`} alt="ig" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </section>
          </aside>

          {/* MAIN CONTENT - 9 Columns (75%) */}
          <section className="lg:col-span-9">
            {loading ? (
              <div className="flex justify-center py-40">
                <div className="w-10 h-10 border-4 border-slate-50 border-t-sky-600 rounded-full animate-spin"></div>
              </div>
            ) : filteredPosts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-20">
                {filteredPosts.map((post) => (
                  <Link 
                    key={post.id} 
                    to={`/blog/${post.slug}`} 
                    className="group flex flex-col bg-white"
                  >
                    <div className="relative aspect-[16/10] overflow-hidden rounded-2xl mb-8 shadow-sm">
                      <img 
                        src={post.image_url} 
                        alt={post.title}
                        loading="lazy"
                        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
                      />
                    </div>
                    
                    <div className="flex items-center gap-3 text-[10px] font-black text-sky-600 uppercase tracking-[0.2em] mb-4">
                      <span>Autoridade Clínica</span>
                      <span className="w-1 h-1 bg-slate-100 rounded-full"></span>
                      <span className="text-slate-300">{new Date(post.created_at).toLocaleDateString('pt-BR')}</span>
                    </div>
                    
                    <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-sky-600 transition-colors leading-tight tracking-tight">
                      {post.title}
                    </h3>
                    
                    <p className="text-slate-500 text-[14px] leading-relaxed line-clamp-3 mb-6 font-medium">
                      {post.excerpt}
                    </p>
                    
                    <div className="mt-auto text-sky-600 font-black text-[11px] uppercase tracking-[0.2em] flex items-center gap-2 group-hover:gap-4 transition-all">
                      Ler Artigo <ChevronRight className="w-4 h-4" />
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-40 bg-slate-50 rounded-[3rem] border border-slate-100 border-dashed">
                <p className="text-slate-400 font-bold uppercase tracking-widest text-xs italic">Nenhum artigo encontrado para esta busca.</p>
              </div>
            )}

            {/* Pagination */}
            {filteredPosts.length > 0 && (
              <div className="flex items-center justify-center gap-3 mt-32 pt-16 border-t border-slate-100">
                <button className="w-12 h-12 flex items-center justify-center bg-slate-900 text-white text-xs font-black rounded-xl shadow-xl shadow-slate-200">1</button>
                <button className="w-12 h-12 flex items-center justify-center bg-white text-slate-400 border border-slate-100 text-xs font-bold rounded-xl hover:bg-slate-50 transition-all">2</button>
                <button className="w-12 h-12 flex items-center justify-center bg-white text-slate-400 border border-slate-100 text-xs font-bold rounded-xl hover:bg-slate-50 transition-all">3</button>
                <button className="w-12 h-12 flex items-center justify-center bg-white text-slate-400 border border-slate-100 text-xs font-bold rounded-xl hover:bg-slate-50 transition-all">
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
