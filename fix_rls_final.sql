-- ==============================================================================
-- CORREÇÃO FINAL DE PERMISSÕES (RLS) - LÉIA NEVES APP
-- ==============================================================================

-- 1. Habilitar RLS (garantia)
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- 2. Limpar políticas antigas/conflitantes
DROP POLICY IF EXISTS "Allow anonymous inserts" ON public.appointments;
DROP POLICY IF EXISTS "Enable insert for anon" ON public.appointments;
DROP POLICY IF EXISTS "Enable insert for all" ON public.appointments;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.appointments;
DROP POLICY IF EXISTS "Enable read for authenticated only" ON public.appointments;
DROP POLICY IF EXISTS "Enable update for authenticated only" ON public.appointments;

-- ==============================================================================
-- NOVAS POLÍTICAS
-- ==============================================================================

-- 3. PERMISSÃO DE INSERÇÃO (PÚBLICA)
-- Permite que QUALQUER UM (logado ou não) crie um agendamento.
-- Isso resolve o erro "new row violates row-level security policy" quando você está logado.
CREATE POLICY "Enable insert for all users"
ON public.appointments
FOR INSERT
TO public
WITH CHECK (true);

-- 4. PERMISSÃO DE LEITURA (APENAS ADMIN/LOGADO)
-- Permite que usuários logados (você no painel) vejam os agendamentos.
-- Usuários anônimos NÃO podem ver a lista.
CREATE POLICY "Enable select for authenticated only"
ON public.appointments
FOR SELECT
TO authenticated
USING (true);

-- 5. PERMISSÃO DE ATUALIZAÇÃO (APENAS ADMIN/LOGADO)
-- Permite que você mude o status (pending -> confirmed) no painel.
CREATE POLICY "Enable update for authenticated only"
ON public.appointments
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

-- 6. PERMISSÃO DE LEITURA PARA O PRÓPRIO CRIADOR (OPCIONAL/FUTURO)
-- Se quisesse que o usuário visse o próprio agendamento logo após criar, 
-- precisaria retornar o ID na sessão ou usar cookies, mas por enquanto não é necessário.

-- ==============================================================================
-- GRANT FINAL (GARANTIA DE PERMISSÃO NA TABELA)
-- ==============================================================================
GRANT ALL ON TABLE public.appointments TO authenticated;
GRANT ALL ON TABLE public.appointments TO service_role;
GRANT INSERT ON TABLE public.appointments TO anon;
GRANT USAGE, SELECT ON SEQUENCE appointments_id_seq TO anon, authenticated;
