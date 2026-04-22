
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
    <section className="py-24 bg-[#fafbfc]">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <span className="text-indigo-600 font-black text-xs uppercase tracking-[0.3em] mb-4 block">Educação e Cuidado</span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-[1.1] tracking-tight">
              Nosso Blog de <span className="text-indigo-600 underline decoration-indigo-200 underline-offset-8">Psicopedagogia</span>
            </h2>
          </div>
          <Link 
            to="/blog" 
            className="group flex items-center bg-white border border-slate-200 px-8 py-4 rounded-2xl font-black text-slate-900 hover:border-indigo-500 hover:text-indigo-600 transition-all shadow-sm"
          >
            Explorar Tudo <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {posts.map((post) => (
            <Link 
              key={post.id} 
              to={`/blog/${post.slug}`}
              className="group flex flex-col bg-white rounded-[2rem] overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-indigo-100 transition-all duration-500 border border-slate-50"
            >
              <div className="relative h-64 overflow-hidden bg-indigo-50">
                <img 
                  src={post.image_url || 'https://images.unsplash.com/photo-1594608661623-aa0bd3a67d28?auto=format&fit=crop&q=80&w=1200'} 
                  alt={post.title}
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://images.unsplash.com/photo-1594608661623-aa0bd3a67d28?auto=format&fit=crop&q=80&w=1200';
                  }}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-6 left-6">
                  <span className="bg-white/95 backdrop-blur-sm text-indigo-600 text-[10px] font-black px-4 py-2 rounded-xl uppercase tracking-widest shadow-lg">
                    Destaque
                  </span>
                </div>
              </div>
              <div className="p-8 flex-grow flex flex-col">
                <div className="flex items-center text-slate-400 text-[11px] font-bold uppercase tracking-widest mb-4">
                  <Calendar className="w-3 h-3 mr-2" />
                  {new Date(post.created_at).toLocaleDateString('pt-BR')}
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-indigo-600 transition-colors leading-tight line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-slate-500 text-base leading-relaxed mb-8 line-clamp-3 font-medium">
                  {post.excerpt}
                </p>
                <div className="mt-auto flex items-center text-indigo-600 font-black text-xs uppercase tracking-wider gap-2 group-hover:gap-3 transition-all">
                  Ler artigo completo <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
