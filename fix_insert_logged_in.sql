-- Permitir que QUALQUER UM (Logado ou Não) possa agendar
-- Isso resolve o problema de você estar logado como Admin e tentar agendar.

-- Remove política restrita anterior
DROP POLICY IF EXISTS "Enable insert for anon" ON public.appointments;
DROP POLICY IF EXISTS "Allow anonymous inserts" ON public.appointments;

-- Cria política Universal para Inserção
CREATE POLICY "Enable insert for all"
ON public.appointments
FOR INSERT
TO public
WITH CHECK (true);

-- Garante permissão no banco
GRANT INSERT ON TABLE public.appointments TO authenticated;
GRANT INSERT ON TABLE public.appointments TO anon;
