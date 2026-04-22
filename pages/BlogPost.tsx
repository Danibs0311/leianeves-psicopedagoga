
import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Calendar, User, ArrowLeft, Share2 } from 'lucide-react';

interface Post {
  title: string;
  content: string;
  image_url: string;
  published_at: string;
  category: string;
  meta_title: string;
  meta_description: string;
}

export const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (slug) {
      fetchPost();
    }
  }, [slug]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      setPost(data);

      // Atualizar SEO dinamicamente
      if (data) {
        document.title = data.meta_title || data.title;
        const metaDesc = document.querySelector('meta[name="description"]');
        if (metaDesc) {
          metaDesc.setAttribute('content', data.meta_description || '');
        } else {
          const meta = document.createElement('meta');
          meta.name = "description";
          meta.content = data.meta_description || '';
          document.head.appendChild(meta);
        }
      }
    } catch (error) {
      console.error('Erro ao buscar post:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Post não encontrado</h2>
        <Link to="/blog" className="text-indigo-600 hover:underline">Voltar para o blog</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafbfc]">
      <Navbar />

      <article className="pt-28 pb-20">
        {/* Post Header */}
        <div className="max-w-4xl mx-auto px-6 text-center">
          <Link to="/blog" className="inline-flex items-center text-slate-400 hover:text-indigo-600 mb-10 transition-all font-medium group">
            <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Voltar para a Galeria de Conhecimento
          </Link>
          
          <div className="mb-8">
            <span className="bg-indigo-600/10 text-indigo-700 text-xs font-bold px-5 py-2 rounded-full uppercase tracking-[0.2em] border border-indigo-100">
              {post.category}
            </span>
          </div>

          <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-8 leading-[1.1] tracking-tight">
            {post.title}
          </h1>

          <div className="flex items-center justify-center gap-8 text-slate-500 mb-12">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-lg">
                LN
              </div>
              <div className="text-left">
                <p className="text-slate-900 font-bold text-base leading-none mb-1">Léia Neves</p>
      
      <main className="flex-grow pt-24 pb-20">
        <article className="max-w-4xl mx-auto px-6">
          {/* Article Header */}
          <header className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-6 py-2 bg-sky-50 text-sky-600 rounded-full text-[10px] font-black uppercase tracking-[0.3em] mb-8">
              {post.category || 'Conhecimento'}
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-slate-900 leading-[1.1] tracking-tighter mb-10">
              {post.title}
            </h1>
            <div className="flex items-center justify-center gap-8 text-slate-400 font-bold text-[11px] uppercase tracking-widest">
              <span className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-sky-500" />
                {new Date(post.created_at || post.published_at).toLocaleDateString('pt-BR')}
              </span>
              <span className="flex items-center gap-2">
                <User className="w-4 h-4 text-sky-500" />
                Léia Neves
              </span>
            </div>
          </header>

          {/* Main Image */}
          <div className="relative mb-20 group">
            <div className="absolute inset-0 bg-sky-600/5 rounded-[3rem] blur-3xl transform translate-y-8 -z-10 group-hover:scale-105 transition-transform duration-700"></div>
            <img 
              src={post.image_url || 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80&w=1200'} 
              alt={post.title} 
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://images.unsplash.com/photo-1503454537195-1dcabb73ffb9?auto=format&fit=crop&q=80&w=1200';
              }}
              className="w-full h-[500px] md:h-[700px] object-cover rounded-[3rem] shadow-2xl border-4 border-white"
            />
          </div>

          {/* Article Content */}
          <div className="prose prose-xl prose-slate max-w-none 
            prose-headings:font-black prose-headings:text-slate-900 prose-headings:tracking-tight
            prose-p:text-slate-600 prose-p:leading-[1.8] prose-p:font-medium
            prose-li:text-slate-600 prose-li:font-medium
            prose-strong:text-slate-900 prose-strong:font-black
            prose-blockquote:border-sky-500 prose-blockquote:bg-sky-50/50 prose-blockquote:py-4 prose-blockquote:px-8 prose-blockquote:rounded-2xl prose-blockquote:font-bold prose-blockquote:text-sky-900 prose-blockquote:italic
            prose-img:rounded-3xl prose-img:shadow-xl"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />

          {/* CTA Section */}
          <footer className="mt-24 pt-16 border-t border-slate-100">
            <div className="bg-slate-900 rounded-[3rem] p-10 md:p-16 text-center relative overflow-hidden">
              <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full blur-3xl -translate-y-32 translate-x-32"></div>
              <div className="relative z-10">
                <h2 className="text-3xl md:text-5xl font-black text-white mb-6 leading-tight">
                  Precisa de uma orientação <br/> <span className="text-sky-400">especializada?</span>
                </h2>
                <p className="text-slate-400 text-lg mb-10 max-w-xl mx-auto font-medium">
                  A psicopedagogia pode abrir novos caminhos para o desenvolvimento do seu filho. Entre em contato e agende uma conversa.
                </p>
                <div className="flex flex-col md:flex-row gap-4 justify-center">
                  <a 
                    href="https://wa.me/5571991823722" 
                    className="bg-sky-500 text-white px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-sky-400 transition-all shadow-xl shadow-sky-500/20"
                  >
                    Agendar via WhatsApp
                  </a>
                  <Link 
                    to="/blog" 
                    className="bg-white/10 text-white px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-white/20 transition-all backdrop-blur-sm"
                  >
                    Voltar ao Blog
                  </Link>
                </div>
              </div>
            </div>
          </footer>
        </article>
      </main>

      <Footer />
    </div>
  );
};
