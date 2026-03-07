-- Garante que RLS está habilitado
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Remove políticas anteriores para limpar
DROP POLICY IF EXISTS "Allow anonymous inserts" ON public.appointments;
DROP POLICY IF EXISTS "Enable insert for anon" ON public.appointments;
DROP POLICY IF EXISTS "Enable insert for all" ON public.appointments;

-- Cria a política correta explicitamente
CREATE POLICY "Enable insert for anon"
ON public.appointments
FOR INSERT
TO anon
WITH CHECK (true);

-- Concede permissão de uso na sequência (caso necessário)
GRANT USAGE, SELECT ON SEQUENCE appointments_id_seq TO anon;

-- Concede permissão de insert na tabela explicitamente
GRANT INSERT ON TABLE public.appointments TO anon;
