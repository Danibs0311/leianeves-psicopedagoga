
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
                <p className="text-xs uppercase tracking-wider font-semibold text-indigo-600/70">Psicopedagoga Clínica</p>
              </div>
            </div>
            
            <div className="h-8 w-px bg-slate-200 hidden md:block"></div>

            <div className="flex items-center gap-2 text-sm font-medium">
              <Calendar className="w-4 h-4 text-indigo-500" />
              {new Date(post.published_at).toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}
            </div>
          </div>
        </div>

        {/* Featured Image - Ultra Premium Shadow */}
        <div className="max-w-6xl mx-auto px-4 mb-20">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-[2.5rem] blur opacity-15 group-hover:opacity-25 transition duration-1000 group-hover:duration-200"></div>
            <img 
              src={post.image_url || 'https://images.unsplash.com/photo-1594608661623-aa0bd3a67d28?auto=format&fit=crop&q=80&w=1000'} 
              alt={post.title} 
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://images.unsplash.com/photo-1594608661623-aa0bd3a67d28?auto=format&fit=crop&q=80&w=1000';
              }}
              className="relative w-full h-[450px] md:h-[650px] object-cover rounded-[2rem] shadow-2xl"
            />
          </div>
        </div>

        {/* Content with Enhanced Typography */}
        <div className="max-w-3xl mx-auto px-6">
          <div 
            className="prose prose-xl prose-slate max-w-none 
              prose-headings:text-slate-900 prose-headings:font-black prose-headings:tracking-tight
              prose-p:text-slate-600 prose-p:leading-[1.8] prose-p:text-lg
              prose-strong:text-indigo-900 prose-strong:font-bold
              prose-ul:list-disc prose-ul:marker:text-indigo-500
              prose-h2:text-3xl prose-h2:mt-16 prose-h2:mb-8 prose-h2:border-b prose-h2:pb-4 prose-h2:border-slate-100"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          
          {/* Enhanced Call to Action */}
          <div className="mt-24 p-12 bg-gradient-to-br from-slate-900 to-indigo-950 rounded-[2.5rem] relative overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-purple-500/10 rounded-full -ml-32 -mb-32 blur-3xl"></div>
            
            <div className="relative z-10 text-center md:text-left">
              <h3 className="text-3xl md:text-4xl font-black text-white mb-6 leading-tight">
                Apoio especializado para seu filho em <span className="text-indigo-400">Cajazeiras</span>.
              </h3>
              <p className="text-slate-300 text-lg mb-10 max-w-xl leading-relaxed">
                Cada criança é única. Léia Neves utiliza trilhas terapêuticas personalizadas para transformar desafios em conquistas reais.
              </p>
              <div className="flex flex-col md:flex-row gap-4">
                <a 
                  href="https://wa.me/5571999999999" 
                  className="bg-indigo-600 text-white px-10 py-5 rounded-2xl font-black text-center hover:bg-indigo-500 transition-all shadow-xl hover:shadow-indigo-500/20 active:scale-95"
                >
                  Agendar Consulta Agora
                </a>
                <button className="bg-white/5 border border-white/10 text-white px-10 py-5 rounded-2xl font-bold text-center hover:bg-white/10 transition-all">
                  Saber mais sobre o método
                </button>
              </div>
            </div>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
};
