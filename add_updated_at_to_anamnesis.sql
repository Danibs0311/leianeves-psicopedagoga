-- Adiciona a coluna updated_at na tabela patient_anamnesis
ALTER TABLE IF EXISTS public.patient_anamnesis 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ;

-- Comentário opcional para documentação
COMMENT ON COLUMN public.patient_anamnesis.updated_at IS 'Data da última atualização da ficha de anamnese';
