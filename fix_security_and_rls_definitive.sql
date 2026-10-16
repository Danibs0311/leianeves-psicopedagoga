-- ==============================================================================
-- CORREÇÃO DEFINITIVA DE SEGURANÇA, PRIVACIDADE (LGPD) E RLS
-- Projeto: Léia Neves - Psicopedagogia Especializada
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. CORREÇÃO DE STORAGE: BUCKET DE DOCUMENTOS CLÍNICOS PRIVADO
-- ------------------------------------------------------------------------------
-- Documentos clínicos, laudos de menores e relatórios médicos NÃO podem ser públicos.
UPDATE storage.buckets 
SET public = false 
WHERE id = 'patient-documents';

-- Remover políticas públicas inseguras
DROP POLICY IF EXISTS "Public Document Access" ON storage.objects;
DROP POLICY IF EXISTS "Admin Document Upload" ON storage.objects;
DROP POLICY IF EXISTS "Admin Document Update" ON storage.objects;
DROP POLICY IF EXISTS "Admin Document Delete" ON storage.objects;
DROP POLICY IF EXISTS "Admin Document Select" ON storage.objects;

-- Conceder acesso completo ao bucket EXCLUSIVAMENTE para usuários autenticados (Admin)
CREATE POLICY "Admin Document Select" 
ON storage.objects FOR SELECT 
TO authenticated 
USING (bucket_id = 'patient-documents');

CREATE POLICY "Admin Document Upload" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK (bucket_id = 'patient-documents');

CREATE POLICY "Admin Document Update" 
ON storage.objects FOR UPDATE 
TO authenticated 
USING (bucket_id = 'patient-documents')
WITH CHECK (bucket_id = 'patient-documents');

CREATE POLICY "Admin Document Delete" 
ON storage.objects FOR DELETE 
TO authenticated 
USING (bucket_id = 'patient-documents');


-- ------------------------------------------------------------------------------
-- 2. TABELA PATIENTS: PROTEGER DADOS PESSOAIS E EVITAR EXTRAÇÃO NÃO AUTORIZADA
-- ------------------------------------------------------------------------------
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

-- Remover a política insegura que dava SELECT a qualquer anônimo
DROP POLICY IF EXISTS "Enable select by CPF for anon" ON public.patients;
DROP POLICY IF EXISTS "Enable insert for all users" ON public.patients;
DROP POLICY IF EXISTS "Admins can select patients" ON public.patients;
DROP POLICY IF EXISTS "Admins can update patients" ON public.patients;
DROP POLICY IF EXISTS "Admins can delete patients" ON public.patients;

-- Apenas Admin autenticado pode consultar, atualizar e excluir pacientes
CREATE POLICY "Admins can select patients"
ON public.patients FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admins can update patients"
ON public.patients FOR UPDATE
TO authenticated
USING (true)
WITH CHECK (true);

CREATE POLICY "Admins can delete patients"
ON public.patients FOR DELETE
TO authenticated
USING (true);

-- Anônimos só podem criar pacientes com status 'prospect'
CREATE POLICY "Enable insert for all users"
ON public.patients FOR INSERT
TO public
WITH CHECK (status = 'prospect');

-- Revogar permissão direta de SELECT de anon na tabela patients
REVOKE SELECT ON TABLE public.patients FROM anon;
GRANT INSERT ON TABLE public.patients TO anon;
GRANT ALL ON TABLE public.patients TO authenticated;


-- ------------------------------------------------------------------------------
-- 3. FUNÇÃO RPC: VERIFICAÇÃO SEGURA DE CPF (SEM VAZAR PACIENTES)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION check_patient_cpf_exists(p_cpf TEXT)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  RETURN EXISTS (SELECT 1 FROM public.patients WHERE cpf = p_cpf);
END;
$$;

GRANT EXECUTE ON FUNCTION check_patient_cpf_exists(TEXT) TO anon, authenticated;


-- ------------------------------------------------------------------------------
-- 4. FUNÇÃO RPC: GET OR CREATE PATIENT PROSPECT (FLUXO SEGURO)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_or_create_prospect_patient(
  p_child_name TEXT,
  p_parent_name TEXT,
  p_phone TEXT,
  p_email TEXT,
  p_cpf TEXT
)
RETURNS BIGINT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $func$
DECLARE
  v_patient_id BIGINT;
BEGIN
  -- 1. Se já existir paciente com esse CPF, reaproveita o ID
  IF p_cpf IS NOT NULL AND p_cpf <> '' THEN
    SELECT id INTO v_patient_id 
    FROM public.patients 
    WHERE cpf = p_cpf 
    ORDER BY id DESC 
    LIMIT 1;

    IF v_patient_id IS NOT NULL THEN
      RETURN v_patient_id;
    END IF;
  END IF;

  -- 2. Insere novo paciente prospect
  INSERT INTO public.patients (child_name, parent_name, phone, email, cpf, status)
  VALUES (p_child_name, p_parent_name, p_phone, p_email, p_cpf, 'prospect');

  -- 3. Recupera o ID gerado com segurança
  IF p_cpf IS NOT NULL AND p_cpf <> '' THEN
    SELECT id INTO v_patient_id 
    FROM public.patients 
    WHERE cpf = p_cpf 
    ORDER BY id DESC 
    LIMIT 1;
  ELSE
    SELECT id INTO v_patient_id 
    FROM public.patients 
    WHERE child_name = p_child_name 
      AND parent_name = p_parent_name 
    ORDER BY id DESC 
    LIMIT 1;
  END IF;

  RETURN v_patient_id;
END;
$func$;

GRANT EXECUTE ON FUNCTION get_or_create_prospect_patient(TEXT, TEXT, TEXT, TEXT, TEXT) TO anon, authenticated;


-- ------------------------------------------------------------------------------
-- 5. FUNÇÃO RPC: HORÁRIOS OCUPADOS (RESOLVE O CONFLITO SILENCIOSO DE AGENDAMENTO)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION get_booked_times(p_date DATE)
RETURNS TABLE (preferred_time TEXT)
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $func$
BEGIN
  RETURN QUERY
  SELECT a.preferred_time::TEXT
  FROM public.appointments a
  WHERE a.preferred_date = p_date
    AND a.status NOT IN ('cancelled', 'rejected');
END;
$func$;

GRANT EXECUTE ON FUNCTION get_booked_times(DATE) TO anon, authenticated;

-- Garantir que appointments mantém RLS restrito a admin para leitura
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
DROP POLICY IF EXISTS "Enable select for authenticated only" ON public.appointments;
CREATE POLICY "Enable select for authenticated only" 
ON public.appointments FOR SELECT 
TO authenticated 
USING (true);

DROP POLICY IF EXISTS "Enable insert for all users" ON public.appointments;
CREATE POLICY "Enable insert for all users" 
ON public.appointments FOR INSERT 
TO public 
WITH CHECK (true);

DROP POLICY IF EXISTS "Enable update for authenticated only" ON public.appointments;
CREATE POLICY "Enable update for authenticated only" 
ON public.appointments FOR UPDATE 
TO authenticated 
USING (true)
WITH CHECK (true);

GRANT INSERT ON TABLE public.appointments TO anon;
GRANT ALL ON TABLE public.appointments TO authenticated;

-- Garantir acesso a sequências para inserções automáticas (IDs)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated;
