import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Search, ChevronRight, X, AlertCircle } from 'lucide-react';

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
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = [
    'Aprendizagem', 'Métodos de Ensino', 'Desenvolvimento', 'Emoções', 
    'Intervenções', 'Família & Escola', 'Tecnologia', 'Inclusão', 
    'Pesquisas', 'Autocuidado', 'Motivação', 'Criatividade'
  ];

  useEffect(() => {
    fetchPosts();
  }, []); // Removemos selectedCategory daqui para não recarregar do banco a cada clique

  const fetchPosts = async () => {
    setLoading(true);
    try {
      // Buscamos TODOS os posts e filtramos no frontend para maior flexibilidade
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('is_published', true)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      
      console.log('Posts carregados:', data?.map(p => ({ title: p.title, cat: p.category })));
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const normalize = (val: any) => {
    if (!val) return "";
    return String(val).trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  const filteredPosts = posts.filter(post => {
    // Filtro por termo de pesquisa
    const searchNorm = normalize(searchTerm);
    const matchesSearch = searchNorm === '' || 
      normalize(post.title).includes(searchNorm) ||
      normalize(post.excerpt).includes(searchNorm);
    
    // Filtro por categoria (comparação segura e flexível)
    const categoryNorm = normalize(selectedCategory);
    const postCategoryNorm = normalize(post.category);
    
    const matchesCategory = !selectedCategory || 
      postCategoryNorm === categoryNorm || 
      postCategoryNorm.includes(categoryNorm) || 
      categoryNorm.includes(postCategoryNorm);

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans overflow-x-hidden">
      {/* VERIFICATION TAG - To ensure you are seeing the latest version */}
      <div className="bg-amber-400 py-2 text-center text-[10px] font-black uppercase tracking-[0.3em] text-amber-950">
        SISTEMA ATUALIZADO - MODO 5 COLUNAS ATIVO
      </div>

      <Navbar onOpenScheduling={() => {}} />
      
      {/* Header */}
      <div className="border-b border-slate-100 py-6 bg-white">
        <div className="max-w-[1440px] mx-auto px-6 flex justify-between items-center">
          <h1 className="text-3xl font-black text-slate-900 tracking-tighter uppercase">Blog Profissional</h1>
          <div className="flex items-center gap-2 text-[10px] font-black text-slate-300 uppercase tracking-[0.2em]">
            <Link to="/" className="hover:text-sky-600 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-slate-900">Blog</span>
          </div>
        </div>
      </div>

      <main className="max-w-[1440px] mx-auto px-6 py-8 w-full">
        {/* Search Bar - Full Width & Modern with Suggestions */}
        <div className="max-w-3xl mx-auto mb-8 relative group">
          <div className="relative">
            <input 
              type="text" 
              placeholder="O que você está buscando hoje?" 
              className="w-full px-8 py-5 bg-slate-50 border border-slate-100 rounded-[2rem] text-sm focus:outline-none focus:border-sky-400 focus:bg-white focus:shadow-2xl focus:shadow-sky-100/50 transition-all font-semibold text-slate-700 text-center"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute right-8 top-1/2 -translate-y-1/2 w-6 h-6 text-slate-300 group-focus-within:text-sky-500 transition-colors" />
          </div>

          {/* Search Suggestions Dropdown */}
          {searchTerm && filteredPosts.length > 0 && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 rounded-2xl shadow-2xl z-50 overflow-hidden max-h-60 overflow-y-auto backdrop-blur-sm">
              <div className="p-2">
                <span className="px-4 py-2 text-[9px] font-black text-slate-400 uppercase tracking-widest block border-b border-slate-50 mb-2">Sugestões de Leitura</span>
                {filteredPosts.slice(0, 5).map(post => (
                  <Link 
                    key={post.id}
                    to={`/blog/${post.slug}`}
                    className="flex items-center gap-4 px-4 py-3 hover:bg-sky-50 transition-colors rounded-xl group"
                  >
                    <div className="w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 bg-slate-100">
                      <img src={post.image_url} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-slate-900 group-hover:text-sky-600 transition-colors line-clamp-1">{post.title}</span>
                      <span className="text-[9px] text-sky-500 font-black uppercase tracking-widest">{post.category}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Categories Grid - 4 Columns Always */}
        <section className="mb-10">
          <div className="flex justify-between items-center mb-4 border-b border-slate-100 pb-4">
            <h3 className="text-[10px] font-black text-slate-900 uppercase tracking-[0.3em]">Explorar por Temas</h3>
            {selectedCategory && (
              <button onClick={() => setSelectedCategory(null)} className="text-[8px] font-black text-rose-500 uppercase tracking-widest flex items-center gap-1 hover:text-rose-600 transition-colors">
                Ver todos os artigos <X size={10} />
              </button>
            )}
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
            {categories.map((cat) => (
              <button 
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`text-[15px] font-bold py-4 px-4 rounded-xl transition-all text-center border ${
                  selectedCategory === cat 
                  ? 'bg-sky-600 text-white border-sky-600 shadow-lg shadow-sky-100 scale-[1.02]' 
                  : 'bg-white text-slate-500 border-slate-100 hover:border-sky-200 hover:text-sky-600 hover:shadow-md'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </section>

        {/* ARTICLES GRID (ULTRA COMPACT 5 COLUMNS) */}
        <section>
          {loading ? (
            <div className="flex justify-center py-40">
              <div className="w-12 h-12 border-4 border-slate-50 border-t-sky-600 rounded-full animate-spin"></div>
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {filteredPosts.map((post) => (
                <Link 
                  key={post.id} 
                  to={`/blog/${post.slug}`} 
                  className="group flex flex-col bg-white rounded-xl border border-slate-100 hover:border-sky-200 hover:shadow-xl hover:shadow-sky-100/20 transition-all duration-300 overflow-hidden"
                >
                  <div className="relative aspect-[4/3] overflow-hidden bg-slate-50">
                    <img 
                      src={post.image_url} 
                      alt={post.title} 
                      loading="lazy" 
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    />
                    <div className="absolute top-2 left-2 z-10">
                      <span className="px-2 py-1 bg-white/95 backdrop-blur-sm rounded-lg text-[8px] font-black text-sky-600 uppercase tracking-widest shadow-md border border-slate-100">
                        {post.category || 'Geral'}
                      </span>
                    </div>
                  </div>
                  <div className="p-3 flex flex-col flex-grow">
                    <h3 className="text-sm font-black text-slate-900 group-hover:text-sky-600 transition-colors leading-tight line-clamp-2 mb-1.5">
                      {post.title}
                    </h3>
                    <p className="text-slate-500 text-[11px] leading-relaxed line-clamp-2 font-medium mb-3">
                      {post.excerpt}
                    </p>
                    <div className="mt-auto pt-2 border-t border-slate-50 flex items-center justify-between">
                      <span className="text-slate-300 text-[8px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                        <span className="w-1 h-1 bg-sky-400 rounded-full"></span>
                        {new Date(post.created_at).toLocaleDateString('pt-BR')}
                      </span>
                      <div className="text-sky-600 group-hover:translate-x-0.5 transition-transform">
                        <ChevronRight size={12} strokeWidth={3} />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-40 bg-slate-50/50 rounded-[3rem] border border-slate-100 border-dashed">
              <AlertCircle size={32} className="mx-auto text-slate-200 mb-4" />
              <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px]">Nenhum artigo encontrado para esta busca ou categoria.</p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
