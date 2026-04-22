
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Calendar, ChevronRight, BookOpen } from 'lucide-react';

interface BlogPost {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  image_url: string;
  created_at: string;
}

export const BlogPreview: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);

  useEffect(() => {
    fetchLatestPosts();
  }, []);

  const fetchLatestPosts = async () => {
    const { data } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('is_published', true)
      .order('published_at', { ascending: false })
      .limit(3);
    
    if (data) setPosts(data);
  };

  if (posts.length === 0) return null;

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-end mb-12">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2 text-indigo-600 font-bold mb-4 uppercase tracking-wider text-sm">
              <BookOpen className="w-5 h-5" />
              Blog e Conteúdo
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
              Dicas e Orientações para o <span className="text-indigo-600">Desenvolvimento Infantil</span>
            </h2>
          </div>
          <Link 
            to="/blog" 
            className="hidden md:flex items-center text-indigo-600 font-bold hover:text-indigo-700 transition-colors"
          >
            Ver todos os posts <ChevronRight className="w-5 h-5 ml-1" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link 
              key={post.id} 
              to={`/blog/${post.slug}`}
              className="group bg-slate-50 rounded-2xl overflow-hidden border border-slate-100 hover:shadow-xl transition-all duration-300"
            >
              <div className="relative h-56 overflow-hidden">
                <img 
                  src={post.image_url} 
                  alt={post.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-6">
                <div className="flex items-center text-slate-400 text-xs mb-3 gap-2">
                  <Calendar className="w-3 h-3" />
                  {new Date(post.created_at).toLocaleDateString('pt-BR')}
                </div>
                <h3 className="text-xl font-bold text-slate-800 mb-3 group-hover:text-indigo-600 transition-colors line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-slate-600 text-sm mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center text-indigo-600 font-bold text-sm">
                  Continuar lendo <ChevronRight className="w-4 h-4 ml-1" />
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-12 text-center md:hidden">
          <Link 
            to="/blog" 
            className="inline-flex items-center bg-indigo-600 text-white px-8 py-3 rounded-full font-bold hover:bg-indigo-700 transition-all"
          >
            Ver todos os posts
          </Link>
        </div>
      </div>
    </section>
  );
};
