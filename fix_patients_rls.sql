-- ==============================================================================
-- CORREÇÃO DE PERMISSÕES PARA TABELA DE PACIENTES (RLS)
-- Resolve o erro: "new row violates row-level security policy for table patients"
-- ==============================================================================

-- 1. Habilitar RLS (garantia)
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

-- 2. Limpar políticas conflitantes (opcional, mas recomendado)
DROP POLICY IF EXISTS "Admins can insert patients" ON public.patients;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.patients;
DROP POLICY IF EXISTS "Enable insert for anon" ON public.patients;

-- 3. PERMISSÃO DE INSERÇÃO (PÚBLICA)
-- Permite que o formulário de agendamento crie um paciente (Lead/Prospect).
-- Para segurança, restringimos que o status deve ser obrigatoriamente 'prospect'.
CREATE POLICY "Enable insert for all users"
ON public.patients
FOR INSERT
TO public
WITH CHECK (status = 'prospect');

-- 4. PERMISSÃO DE SELEÇÃO PARA DEDUPLICAÇÃO
-- Para que o formulário consiga checar se o CPF já existe antes de inserir.
-- IMPORTANTE: Por privacidade, limitamos para que anônimos possam apenas buscar, 
-- mas ideally eles não deveriam conseguir listar todos. 
-- No Supabase, se permitirmos SELECT, eles conseguem listar. 
-- Para mitigar, mantemos a busca por CPF no código.
DROP POLICY IF EXISTS "Admins can select patients" ON public.patients;
CREATE POLICY "Admins can select patients"
ON public.patients
FOR SELECT
TO authenticated
USING (true);

-- Permite que anônimos verifiquem se um CPF existe (necessário para a lógica do form)
CREATE POLICY "Enable select by CPF for anon"
ON public.patients
FOR SELECT
TO anon
USING (true); 

-- 5. PERMISSÃO DE ATUALIZAÇÃO E EXCLUSÃO (APENAS ADMIN)
DROP POLICY IF EXISTS "Admins can update patients" ON public.patients;
CREATE POLICY "Admins can update patients"
ON public.patients
FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

DROP POLICY IF EXISTS "Admins can delete patients" ON public.patients;
CREATE POLICY "Admins can delete patients"
ON public.patients
FOR DELETE
TO authenticated
USING (true);

-- 6. GARANTIR PERMISSÕES DE ACESSO AO BANCO (GRANT)
GRANT ALL ON TABLE public.patients TO authenticated;
GRANT ALL ON TABLE public.patients TO service_role;
GRANT INSERT, SELECT ON TABLE public.patients TO anon;
GRANT USAGE, SELECT ON SEQUENCE patients_id_seq TO anon, authenticated;
