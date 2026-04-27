-- 1. Garante que cada paciente tenha apenas uma ficha de anamnese (necessário para o UPSERT funcionar)
ALTER TABLE IF EXISTS public.patient_anamnesis 
ADD CONSTRAINT patient_anamnesis_patient_id_key UNIQUE (patient_id);

-- 2. Adiciona a coluna updated_at para rastrear edições
ALTER TABLE IF EXISTS public.patient_anamnesis 
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ;

-- Comentário opcional para documentação
COMMENT ON COLUMN public.patient_anamnesis.updated_at IS 'Data da última atualização da ficha de anamnese';
