import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Trash2, ExternalLink, RefreshCw, FileText, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  created_at: string;
  category: string;
  is_published: boolean;
}

export const AdminBlog: React.FC = () => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select('id, title, slug, created_at, category, is_published')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPosts(data || []);
    } catch (error) {
      console.error('Error fetching admin posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const deletePost = async (id: string) => {
    if (!window.confirm('Tem certeza que deseja excluir este artigo permanentemente?')) return;
    
    try {
      const { error } = await supabase
        .from('blog_posts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      setPosts(posts.filter(p => p.id !== id));
    } catch (error) {
      alert('Erro ao excluir postagem.');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-black text-slate-900 tracking-tight">Gestão do Blog</h2>
          <p className="text-slate-500 font-medium">Monitore e gerencie os artigos gerados pela IA.</p>
        </div>
        <button 
          onClick={fetchPosts}
          className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-slate-200 rounded-xl text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all shadow-sm"
        >
          <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} /> Atualizar Lista
        </button>
      </div>

      {loading ? (
        <div className="py-20 flex justify-center">
          <div className="w-10 h-10 border-4 border-slate-100 border-t-sky-600 rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-3xl overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-slate-100">
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Artigo</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Categoria</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Data</th>
                  <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-50/30 transition-colors group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-sky-50 flex items-center justify-center text-sky-600 shrink-0">
                          <FileText className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="block font-bold text-slate-800 leading-tight mb-1">{post.title}</span>
                          <span className="block text-[10px] text-slate-400 font-bold uppercase tracking-widest">Slug: {post.slug}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest rounded-lg">
                        {post.category}
                      </span>
                    </td>
                    <td className="px-8 py-6 text-sm text-slate-500 font-medium">
                      {new Date(post.created_at).toLocaleDateString('pt-BR')}
                    </td>
                    <td className="px-8 py-6 text-right">
                      <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link 
                          to={`/blog/${post.slug}`} 
                          target="_blank"
                          className="p-2 text-slate-400 hover:text-sky-600 transition-colors"
                          title="Ver post"
                        >
                          <Eye className="w-5 h-5" />
                        </Link>
                        <button 
                          onClick={() => deletePost(post.id)}
                          className="p-2 text-slate-400 hover:text-rose-500 transition-colors"
                          title="Excluir permanentemente"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {posts.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-slate-400 font-medium italic text-sm">Nenhum artigo encontrado no banco de dados.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
