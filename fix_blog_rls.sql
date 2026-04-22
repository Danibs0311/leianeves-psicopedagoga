-- CORREÇÃO DE RLS PARA O BLOG
-- Permite que o script de automação (mesmo sem login) possa inserir posts.
-- IMPORTANTE: Em produção, use a Service Role Key no script para maior segurança.

CREATE POLICY "Permitir inserção anônima para automação" 
ON public.blog_posts 
FOR INSERT 
TO public 
WITH CHECK (true);

-- Garante que o PostgREST tenha permissão de escrita
GRANT INSERT ON TABLE public.blog_posts TO anon;
