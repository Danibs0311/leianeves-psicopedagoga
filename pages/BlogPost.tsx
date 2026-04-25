import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { Navbar } from '../components/Navbar';
import { Footer } from '../components/Footer';
import { Calendar, User, ChevronLeft, Share2, MessageCircle } from 'lucide-react';
import { SchedulingModal } from '../components/SchedulingModal';

interface Post {
  id: string;
  title: string;
  content: string;
  image_url: string;
  category: string;
  created_at: string;
  meta_title?: string;
  meta_description?: string;
}

export const BlogPost: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSchedulingModalOpen, setIsSchedulingModalOpen] = useState(false);
  useEffect(() => {
    fetchPost();
  }, [slug]);

  useEffect(() => {
    if (post) {
      document.title = `${post.meta_title || post.title} | Léia Neves`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', post.meta_description || post.title);
    }
  }, [post]);

  const fetchPost = async () => {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', slug)
        .single();

      if (error) throw error;
      setPost(data);
    } catch (error) {
      console.error('Error fetching post:', error);
    } finally {
      setLoading(false);
    }
  };

  const shareArticle = () => {
    if (navigator.share) {
      navigator.share({
        title: post?.title,
        url: window.location.href
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-slate-100 border-t-sky-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center px-6">
        <h2 className="text-2xl font-bold text-slate-800 mb-4">Artigo não encontrado</h2>
        <Link to="/blog" className="text-sky-600 font-bold flex items-center gap-2">
          <ChevronLeft className="w-4 h-4" /> Voltar ao Blog
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col font-sans">
      <Navbar onOpenScheduling={() => setIsSchedulingModalOpen(true)} />

      {/* Article Header */}
      <header className="max-w-4xl mx-auto px-6 pt-16 pb-8 w-full">
        <Link to="/blog" className="text-[10px] font-black text-slate-300 uppercase tracking-[0.2em] mb-8 inline-flex items-center gap-2 hover:text-sky-600 transition-colors">
          <ChevronLeft className="w-3 h-3" /> Back to Articles
        </Link>
        
        <div className="flex items-center gap-3 text-[10px] font-black text-sky-600 uppercase tracking-[0.2em] mb-6">
          <span>{post.category}</span>
          <span className="w-1 h-1 bg-slate-200 rounded-full"></span>
          <span className="text-slate-300 font-bold">{new Date(post.created_at).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}</span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 leading-[1.1] mb-8 tracking-tight">
          {post.title}
        </h1>

        <div className="flex items-center justify-between py-6 border-y border-slate-50">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-full bg-sky-100 flex items-center justify-center text-sky-600">
              <User className="w-5 h-5" />
            </div>
            <div>
              <span className="block text-sm font-black text-slate-900 uppercase tracking-widest">Léia Neves</span>
              <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-widest">Psicopedagoga Especialista em TEA e TDAH</span>
            </div>
          </div>
          <button 
            onClick={shareArticle}
            className="p-3 rounded-full bg-slate-50 text-slate-400 hover:bg-sky-50 hover:text-sky-600 transition-all"
            aria-label="Compartilhar artigo"
          >
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 pb-24 w-full">
        <div className="relative aspect-[16/9] mb-16 rounded-2xl overflow-hidden shadow-2xl shadow-slate-100 bg-slate-50">
          <img 
            src={post.image_url} 
            alt={post.title}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>

        <article 
          className="prose prose-slate prose-lg max-w-none 
          prose-headings:text-slate-900 prose-headings:font-black prose-headings:tracking-tight
          prose-p:text-slate-600 prose-p:leading-relaxed prose-p:font-medium
          prose-strong:text-slate-900 prose-strong:font-black
          prose-blockquote:border-sky-500 prose-blockquote:bg-sky-50/50 prose-blockquote:py-2 prose-blockquote:rounded-r-xl
          prose-li:text-slate-600
          mb-20"
          dangerouslySetInnerHTML={{ 
            __html: post.content
              .replace(/<a[^>]*>.*?Agendar\s+Conversa.*?<\/a>/gi, '')
              .replace(/<button[^>]*>.*?Agendar\s+Conversa.*?<\/button>/gi, '') 
          }}
        />

        {/* Premium CTA Footer - Design de Alta Conversão */}
        <section 
          style={{ backgroundColor: '#050a15', color: 'white' }}
          className="relative overflow-hidden rounded-[3rem] p-12 md:p-20 text-center shadow-[0_20px_50px_rgba(8,112,184,0.15)] border border-slate-800/50"
        >
          {/* Background Glows */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-sky-600/10 rounded-full blur-[100px]"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-600/10 rounded-full blur-[100px]"></div>

          <div className="relative z-10 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-black mb-8 leading-[1.1] tracking-tight" style={{ color: '#ffffff' }}>
              Deseja um acompanhamento exclusivo para o seu filho?
            </h2>
            <p className="text-lg md:text-xl mb-12 font-medium leading-relaxed" style={{ color: '#94a3b8' }}>
              Entenda cada etapa do desenvolvimento e transforme desafios em conquistas. 
              <span className="block mt-4 font-black text-sky-400 uppercase tracking-widest text-sm">
                Agende uma consulta agora
              </span>
            </p>
            
            <button 
              onClick={() => setIsSchedulingModalOpen(true)}
              style={{ 
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                boxShadow: '0 10px 40px -10px rgba(16, 185, 129, 0.5)'
              }}
              className="group relative inline-flex items-center gap-4 px-12 py-6 rounded-2xl font-black text-xl transition-all hover:scale-105 active:scale-95 overflow-hidden border-none cursor-pointer text-white"
            >
              {/* Shimmer Effect */}
              <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:animate-shimmer" />
              
              <Calendar className="w-8 h-8 animate-bounce-subtle" /> 
              <span className="relative z-10">Agendar Consulta Agora</span>
            </button>
          </div>
        </section>
      </main>

      <Footer />
      <SchedulingModal
        isOpen={isSchedulingModalOpen}
        onClose={() => setIsSchedulingModalOpen(false)}
      />
    </div>
  );
};
