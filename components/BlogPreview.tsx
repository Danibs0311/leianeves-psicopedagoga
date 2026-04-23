
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
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl">
            <span className="text-sky-600 font-black text-xs uppercase tracking-[0.3em] mb-4 block">Educação e Cuidado</span>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 leading-[1.1] tracking-tight">
              Nosso Blog de <span className="text-sky-600 underline decoration-sky-200 underline-offset-8">Psicopedagogia</span>
            </h2>
          </div>
          <Link 
            to="/blog" 
            className="group flex items-center bg-white border border-slate-200 px-8 py-4 rounded-2xl font-black text-slate-900 hover:border-sky-500 hover:text-sky-600 transition-all shadow-sm"
          >
            Explorar Tudo <ChevronRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {posts.map((post) => (
            <Link 
              key={post.id} 
              to={`/blog/${post.slug}`}
              className="group flex flex-col bg-white rounded-[1.5rem] border border-slate-100 hover:border-sky-100 hover:shadow-xl hover:shadow-sky-50/50 transition-all duration-300 overflow-hidden"
            >
              <div className="relative aspect-[21/9] overflow-hidden bg-slate-50 border-b border-slate-50">
                <img 
                  src={post.image_url || 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80&w=1200'} 
                  alt={post.title}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-5 flex flex-col gap-2">
                <div className="flex items-center text-slate-300 text-[8px] font-black uppercase tracking-widest">
                  <Calendar className="w-3 h-3 mr-2 text-sky-400" />
                  {new Date(post.created_at).toLocaleDateString('pt-BR')}
                </div>
                <h3 className="text-sm font-black text-slate-900 group-hover:text-sky-600 transition-colors leading-tight line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-slate-500 text-[10px] leading-relaxed line-clamp-2 font-medium">
                  {post.excerpt}
                </p>
                <div className="mt-1 flex items-center text-sky-600 font-black text-[8px] uppercase tracking-widest">
                  Ler Agora <ChevronRight className="w-3 h-3" strokeWidth={3} />
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
