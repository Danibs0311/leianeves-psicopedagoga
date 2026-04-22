
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Calendar, User, ChevronRight, Search } from 'lucide-react';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  image_url: string;
  created_at: string;
  category: string;
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
        .order('published_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Erro ao buscar posts:', error);
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
      <Navbar />
      
      {/* Breadcrumb Header */}
      <div className="bg-slate-50 py-12 border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight">Blog</h1>
          <div className="flex items-center gap-2 text-sm font-bold text-slate-400 uppercase tracking-widest">
            <Link to="/" className="hover:text-sky-600 transition-colors">Início</Link>
            <span>/</span>
            <span className="text-sky-600">Blog</span>
          </div>
        </div>
      </div>

      <main className="max-w-7xl mx-auto px-6 py-20 flex flex-col lg:flex-row gap-16">
        
        {/* Sidebar - Left Side */}
        <aside className="w-full lg:w-80 flex flex-col gap-12 order-2 lg:order-1">
          
          {/* Search */}
          <div className="relative group">
            <input 
              type="text" 
              placeholder="Pesquisar..." 
              className="w-full pl-6 pr-12 py-4 bg-slate-50 border border-slate-100 rounded-xl focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all outline-none font-medium text-slate-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute right-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-hover:text-sky-500 transition-colors" />
          </div>

          {/* Categories */}
          <div>
            <h3 className="text-lg font-black text-slate-900 mb-6 pb-2 border-b-2 border-sky-100 inline-block">Categorias</h3>
            <ul className="flex flex-col gap-4">
              {['Autismo', 'TDAH', 'Alfabetização', 'Desenvolvimento', 'Dicas para Pais'].map((cat) => (
                <li key={cat}>
                  <button className="text-slate-500 hover:text-sky-600 font-bold transition-all flex items-center group">
                    <ChevronRight className="w-4 h-4 mr-2 opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                    {cat}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Popular Posts - Numbered List */}
          <div>
            <h3 className="text-lg font-black text-slate-900 mb-6 pb-2 border-b-2 border-sky-100 inline-block">Mais Lidos</h3>
            <div className="flex flex-col gap-6">
              {[
                "Como identificar sinais precoces de TEA",
                "Estratégias para TDAH na sala de aula",
                "A importância do brincar no aprendizado",
                "Ansiedade infantil em tempos digitais"
              ].map((title, idx) => (
                <div key={idx} className="flex gap-4 group cursor-pointer">
                  <span className="text-3xl font-black text-slate-100 group-hover:text-sky-100 transition-colors">{idx + 1}</span>
                  <div>
                    <h4 className="text-sm font-black text-slate-800 leading-snug group-hover:text-sky-600 transition-colors line-clamp-2">{title}</h4>
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1 block">Leia Neves • 2026</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Instagram Feed Mockup */}
          <div>
            <h3 className="text-lg font-black text-slate-900 mb-6 pb-2 border-b-2 border-sky-100 inline-block">Instagram</h3>
            <div className="grid grid-cols-3 gap-2">
              {[1,2,3,4,5,6].map((i) => (
                <div key={i} className="aspect-square bg-slate-100 rounded-lg overflow-hidden hover:opacity-80 transition-opacity cursor-pointer">
                  <img src={`https://images.unsplash.com/photo-1594608661623-aa0bd3a67d28?auto=format&fit=crop&q=80&w=200&sig=${i}`} alt="Instagram" className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

        </aside>

        {/* Blog Feed - Right Side (Main Content) */}
        <section className="flex-grow order-1 lg:order-2">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="w-10 h-10 border-4 border-sky-100 border-t-sky-600 rounded-full animate-spin"></div>
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-16">
              {filteredPosts.map((post) => (
                <Link 
                  key={post.id} 
                  to={`/blog/${post.slug}`}
                  className="group flex flex-col bg-white overflow-hidden"
                >
                  <div className="relative aspect-[4/3] overflow-hidden rounded-2xl mb-8">
                    <img 
                      src={post.image_url || 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80&w=800'} 
                      alt={post.title}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80&w=800';
                      }}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-sky-600 text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-widest shadow-lg">
                        {post.category || 'Destaque'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                    <span>{new Date(post.created_at).toLocaleDateString('pt-BR')}</span>
                    <span className="w-1 h-1 bg-sky-300 rounded-full"></span>
                    <span>Psicopedagogia</span>
                  </div>
                  
                  <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-sky-600 transition-colors leading-tight">
                    {post.title}
                  </h3>
                  
                  <p className="text-slate-500 text-sm leading-relaxed line-clamp-3 font-medium mb-6">
                    {post.excerpt}
                  </p>
                  
                  <div className="mt-auto flex items-center text-sky-600 font-black text-xs uppercase tracking-widest gap-2 group-hover:gap-4 transition-all">
                    Continuar Lendo <ChevronRight className="w-4 h-4" />
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
              <Search className="w-12 h-12 text-slate-200 mx-auto mb-4" />
              <h3 className="text-xl font-black text-slate-800">Sem resultados para sua busca</h3>
            </div>
          )}

          {/* Pagination Mockup */}
          {filteredPosts.length > 0 && (
            <div className="flex items-center justify-center gap-2 mt-20">
              {[1, 2, 3].map((n) => (
                <button key={n} className={`w-10 h-10 rounded-lg font-bold transition-all ${n === 1 ? 'bg-sky-600 text-white shadow-lg shadow-sky-200' : 'bg-slate-100 text-slate-400 hover:bg-slate-200'}`}>
                  {n}
                </button>
              ))}
              <button className="w-10 h-10 rounded-lg bg-slate-100 text-slate-400 hover:bg-slate-200 font-bold transition-all">
                <ChevronRight className="w-5 h-5 mx-auto" />
              </button>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};
