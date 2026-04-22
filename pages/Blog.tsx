
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
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />
      
      <main className="flex-grow pt-20">
        {/* Header Section - Sky Palette */}
        <section className="relative overflow-hidden bg-white py-32 px-6">
          <div className="absolute top-0 right-0 w-1/3 h-full bg-sky-50 -skew-x-12 translate-x-20"></div>
          <div className="max-w-6xl mx-auto relative z-10">
            <div className="max-w-3xl">
              <span className="text-sky-600 font-black text-xs uppercase tracking-[0.4em] mb-6 block">Portal de Psicopedagogia</span>
              <h1 className="text-6xl md:text-8xl font-black text-slate-900 mb-10 leading-[0.95] tracking-tighter">
                Onde o Saber <br/> encontra o <span className="text-sky-600">Cuidado</span>.
              </h1>
              <p className="text-xl text-slate-600 leading-relaxed font-medium max-w-xl">
                Artigos científicos traduzidos em linguagem simples para pais e educadores. Uma jornada de acolhimento e desenvolvimento.
              </p>
            </div>
          </div>
        </section>

        {/* Search Bar - Slate Style */}
        <div className="max-w-6xl mx-auto px-6 -mt-12 relative z-20">
          <div className="bg-white rounded-3xl shadow-2xl shadow-sky-100 p-4 border border-slate-100 flex flex-col md:flex-row gap-3">
            <div className="relative flex-grow">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Pesquisar por tema (Autismo, TDAH, Alfabetização)..." 
                className="w-full pl-14 pr-6 py-5 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-sky-500 text-slate-800 font-semibold transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button className="bg-sky-600 text-white px-12 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-sky-700 transition-all shadow-lg shadow-sky-200">
              Buscar
            </button>
          </div>
        </div>

        {/* Grid - Modern Cards */}
        <section className="max-w-6xl mx-auto px-6 py-24">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-32">
              <div className="w-12 h-12 border-4 border-sky-100 border-t-sky-600 rounded-full animate-spin"></div>
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
              {filteredPosts.map((post) => (
                <Link 
                  key={post.id} 
                  to={`/blog/${post.slug}`}
                  className="group flex flex-col bg-white rounded-[2.5rem] overflow-hidden border border-slate-50 shadow-sm hover:shadow-2xl hover:shadow-sky-100 transition-all duration-700"
                >
                  <div className="relative h-72 overflow-hidden bg-slate-100">
                    <img 
                      src={post.image_url || 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80&w=1200'} 
                      alt={post.title}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80&w=1200';
                      }}
                      className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110"
                    />
                    <div className="absolute top-6 left-6">
                      <span className="bg-white/95 backdrop-blur-md text-sky-600 text-[10px] font-black px-5 py-2 rounded-full shadow-xl uppercase tracking-widest">
                        {post.category || 'Educação'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-10 flex-grow flex flex-col">
                    <div className="flex items-center text-slate-400 text-[11px] font-bold uppercase tracking-[0.2em] mb-6">
                      <Calendar className="w-3 h-3 mr-2" />
                      {new Date(post.created_at).toLocaleDateString('pt-BR')}
                    </div>
                    
                    <h3 className="text-2xl font-black text-slate-900 mb-5 group-hover:text-sky-600 transition-colors leading-[1.2] line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-slate-500 text-base leading-relaxed mb-10 line-clamp-3 font-medium">
                      {post.excerpt}
                    </p>
                    
                    <div className="mt-auto flex items-center text-sky-600 font-black text-xs uppercase tracking-widest gap-2 group-hover:gap-4 transition-all">
                      Abrir Artigo <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-32 bg-white rounded-[3rem] border border-slate-100">
              <Search className="w-12 h-12 text-slate-200 mx-auto mb-6" />
              <h3 className="text-2xl font-black text-slate-900 mb-2">Sem resultados</h3>
              <p className="text-slate-500 font-medium">Tente uma nova busca.</p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};
