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
  const [roadmap, setRoadmap] = useState<{ id: string, title: string, items: any[] } | null>(null);

  useEffect(() => {
    fetchPost();
  }, [slug]);

  useEffect(() => {
    if (post) {
      fetchRoadmap();
      document.title = `${post.meta_title || post.title} | Léia Neves`;
      const metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) metaDesc.setAttribute('content', post.meta_description || post.title);
    }
  }, [post]);

  const fetchRoadmap = async () => {
    if (!post) return;
    try {
      const { data: item } = await supabase
        .from('blog_roadmap_items')
        .select('roadmap_id')
        .eq('post_id', post.id)
        .single();
      
      if (item) {
        const { data: roadmapData } = await supabase
          .from('blog_roadmaps')
          .select('id, title')
          .eq('id', item.roadmap_id)
          .single();
        
        const { data: items } = await supabase
          .from('blog_roadmap_items')
          .select('post_id, order_index, blog_posts(title, slug)')
          .eq('roadmap_id', item.roadmap_id)
          .order('order_index', { ascending: true });
        
        if (roadmapData && items) {
          setRoadmap({
            id: roadmapData.id,
            title: roadmapData.title,
            items: items.map(i => ({
              id: i.post_id,
              order: i.order_index,
              title: (i.blog_posts as any).title,
              slug: (i.blog_posts as any).slug
            }))
          });
        }
      }
    } catch (e) {
      console.warn('Post is not part of a roadmap');
    }
  };

  const currentItemIndex = roadmap?.items.findIndex(i => i.id === post?.id) ?? -1;
  const prevPost = currentItemIndex > 0 ? roadmap?.items[currentItemIndex - 1] : null;
  const nextPost = currentItemIndex !== -1 && currentItemIndex < (roadmap?.items.length ?? 0) - 1 
    ? roadmap?.items[currentItemIndex + 1] 
    : null;

  const fetchPost = async () => {
    // ... rest of the code (keeping the existing fetchPost)
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
        {/* ROADMAP NAVIGATION WIDGET - NEW */}
        {roadmap && (
          <div className="mb-12 bg-sky-50/50 rounded-2xl p-6 border border-sky-100/50">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
              <div>
                <span className="text-[10px] font-black text-sky-600 uppercase tracking-widest block mb-1">Você está lendo a trilha:</span>
                <h4 className="text-lg font-black text-slate-900">{roadmap.title}</h4>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Progresso</span>
                <div className="flex items-center gap-3">
                  <div className="w-32 h-2 bg-slate-200 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-sky-600 transition-all duration-1000" 
                      style={{ width: `${((currentItemIndex + 1) / roadmap.items.length) * 100}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-black text-slate-900">{currentItemIndex + 1} de {roadmap.items.length}</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {roadmap.items.map((item, idx) => (
                <Link 
                  key={item.id}
                  to={`/blog/${item.slug}`}
                  className={`flex-shrink-0 w-8 h-8 rounded-lg flex items-center justify-center text-[10px] font-black transition-all ${
                    idx === currentItemIndex 
                      ? 'bg-sky-600 text-white shadow-lg shadow-sky-200' 
                      : 'bg-white text-slate-400 border border-slate-100 hover:border-sky-300 hover:text-sky-600'
                  }`}
                >
                  {idx + 1}
                </Link>
              ))}
            </div>
          </div>
        )}

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

        {/* ROADMAP NEXT/PREV BUTTONS - NEW */}
        {roadmap && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-20">
            {prevPost ? (
              <Link 
                to={`/blog/${prevPost.slug}`}
                className="flex items-center gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100 hover:border-sky-300 hover:bg-white transition-all group"
              >
                <div className="w-10 h-10 rounded-full bg-white flex items-center justify-center text-slate-400 group-hover:text-sky-600 transition-colors">
                  <ChevronLeft size={20} />
                </div>
                <div>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Anterior</span>
                  <span className="text-sm font-bold text-slate-700 line-clamp-1">{prevPost.title}</span>
                </div>
              </Link>
            ) : <div />}

            {nextPost ? (
              <Link 
                to={`/blog/${nextPost.slug}`}
                className="flex items-center justify-between gap-4 p-6 bg-sky-600 rounded-2xl shadow-lg shadow-sky-100 hover:bg-sky-700 transition-all group"
              >
                <div className="text-left">
                  <span className="text-[10px] font-black text-sky-200 uppercase tracking-widest block">Próximo</span>
                  <span className="text-sm font-bold text-white line-clamp-1">{nextPost.title}</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white group-hover:translate-x-1 transition-transform">
                  <ChevronRight size={20} />
                </div>
              </Link>
            ) : (
              <button 
                onClick={() => setIsSchedulingModalOpen(true)}
                className="flex items-center justify-between gap-4 p-6 bg-emerald-600 rounded-2xl shadow-lg shadow-emerald-100 hover:bg-emerald-700 transition-all group cursor-pointer border-none"
              >
                <div className="text-left">
                  <span className="text-[10px] font-black text-emerald-200 uppercase tracking-widest block">Fim do Roteiro</span>
                  <span className="text-sm font-bold text-white">Agendar Avaliação</span>
                </div>
                <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-white">
                  <Calendar size={20} />
                </div>
              </button>
            )}
          </div>
        )}

        {/* Newsletter Section - NOVO */}
        <section className="bg-slate-900 rounded-3xl p-8 md:p-12 mb-20 text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-sky-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
          <div className="relative z-10">
            <span className="text-[10px] font-black text-sky-400 uppercase tracking-widest block mb-4">Mantenha-se Informado</span>
            <h3 className="text-2xl md:text-3xl font-black text-white mb-4">Receba orientações exclusivas sobre TEA e TDAH</h3>
            <p className="text-slate-400 text-sm md:text-base max-w-xl mx-auto mb-8 font-medium">
              Junte-se a centenas de famílias que recebem nossos artigos técnicos e dicas práticas diretamente no e-mail.
            </p>
            <form className="flex flex-col md:flex-row gap-4 max-w-lg mx-auto" onSubmit={(e) => e.preventDefault()}>
              <input 
                type="email" 
                placeholder="Seu melhor e-mail" 
                className="flex-1 px-6 py-4 bg-white/5 border border-white/10 rounded-2xl text-white focus:outline-none focus:border-sky-500 transition-all font-medium"
              />
              <button className="px-8 py-4 bg-sky-600 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-sky-700 transition-all shadow-xl shadow-sky-900/20 whitespace-nowrap">
                Quero me Inscrever
              </button>
            </form>
          </div>
        </section>

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

      {/* Floating Mobile CTA */}
      <div className="fixed bottom-6 right-6 z-50 md:hidden">
        <button 
          onClick={() => setIsSchedulingModalOpen(true)}
          className="w-16 h-16 bg-emerald-500 text-white rounded-full shadow-2xl flex items-center justify-center animate-bounce shadow-emerald-200"
        >
          <Calendar size={28} />
        </button>
      </div>

      <Footer />
      <SchedulingModal
        isOpen={isSchedulingModalOpen}
        onClose={() => setIsSchedulingModalOpen(false)}
      />
    </div>
  );
};
