
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
      
      <main className="flex-grow">
        {/* Header Section */}
        <section className="bg-gradient-to-br from-indigo-900 to-indigo-700 text-white py-20 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Blog e Orientações</h1>
            <p className="text-xl text-indigo-100 max-w-2xl mx-auto">
              Conteúdo especializado sobre psicopedagogia, desenvolvimento infantil e saúde mental em Cajazeiras, Salvador.
            </p>
          </div>
        </section>

        {/* Search and Filters */}
        <div className="max-w-6xl mx-auto px-4 -mt-8">
          <div className="bg-white rounded-xl shadow-lg p-4 flex flex-col md:flex-row gap-4 items-center">
            <div className="relative flex-grow w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5" />
              <input 
                type="text" 
                placeholder="Buscar por tema..." 
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Posts Grid */}
        <section className="max-w-6xl mx-auto px-4 py-16">
          {loading ? (
            <div className="flex justify-center py-20">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
          ) : filteredPosts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredPosts.map((post) => (
                <Link 
                  key={post.id} 
                  to={`/blog/${post.slug}`}
                  className="group bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-slate-100"
                >
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={post.image_url} 
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-indigo-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                      {post.category}
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="flex items-center text-slate-400 text-xs mb-3 gap-4">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(post.created_at).toLocaleDateString('pt-BR')}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="w-3 h-3" />
                        Léia Neves
                      </span>
                    </div>
                    
                    <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    
                    <p className="text-slate-600 text-sm mb-6 line-clamp-3">
                      {post.excerpt}
                    </p>
                    
                    <div className="flex items-center text-indigo-600 font-semibold text-sm">
                      Ler mais <ChevronRight className="w-4 h-4 ml-1 group-hover:ml-2 transition-all" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-slate-500 text-lg">Nenhum artigo encontrado para sua busca.</p>
            </div>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
};
