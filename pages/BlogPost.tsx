
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
    <div className="min-h-screen bg-white">
      <Navbar />

      <article className="pt-24 pb-20">
        {/* Post Header */}
        <div className="max-w-4xl mx-auto px-4">
          <Link to="/blog" className="inline-flex items-center text-slate-500 hover:text-indigo-600 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar para o Blog
          </Link>
          
          <div className="mb-6">
            <span className="bg-indigo-50 text-indigo-600 text-sm font-bold px-4 py-1.5 rounded-full uppercase tracking-wider">
              {post.category}
            </span>
          </div>

          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-6 leading-tight">
            {post.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-slate-500 mb-10 pb-10 border-b border-slate-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                LN
              </div>
              <div>
                <p className="text-slate-900 font-medium text-sm">Léia Neves</p>
                <p className="text-xs">Psicopedagoga</p>
              </div>
            </div>
            
            <div className="flex items-center gap-2 text-sm">
              <Calendar className="w-4 h-4" />
              {new Date(post.published_at).toLocaleDateString('pt-BR')}
            </div>

            <button className="ml-auto p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400 hover:text-indigo-600">
              <Share2 className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Featured Image */}
        <div className="max-w-5xl mx-auto px-4 mb-16">
          <img 
            src={post.image_url} 
            alt={post.title} 
            className="w-full h-[400px] md:h-[500px] object-cover rounded-3xl shadow-2xl"
          />
        </div>

        {/* Content */}
        <div className="max-w-3xl mx-auto px-4">
          <div 
            className="prose prose-lg prose-indigo max-w-none text-slate-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          
          {/* Local SEO Call to Action */}
          <div className="mt-20 p-8 bg-indigo-50 rounded-3xl border border-indigo-100">
            <h3 className="text-2xl font-bold text-indigo-900 mb-4">
              Precisa de ajuda especializada em Cajazeiras?
            </h3>
            <p className="text-indigo-800/80 mb-6">
              Léia Neves oferece atendimento psicopedagógico focado no desenvolvimento integral da criança. Agende uma conversa hoje mesmo.
            </p>
            <button className="bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition-all shadow-lg hover:shadow-indigo-200">
              Agendar Consulta em Salvador
            </button>
          </div>
        </div>
      </article>

      <Footer />
    </div>
  );
};
