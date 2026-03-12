-- 1. Criar o bucket "patient-documents" se ele não existir
INSERT INTO storage.buckets (id, name, public)
VALUES ('patient-documents', 'patient-documents', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Habilitar políticas de acesso (RLS) para o bucket
-- Importante: Execute cada bloco abaixo. Se algum der erro de "already exists", pode ignorar.

-- Permitir leitura pública dos documentos
CREATE POLICY "Public Document Access" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'patient-documents' );

-- Permitir que usuários autenticados (Admin) enviem arquivos
CREATE POLICY "Admin Document Upload" 
ON storage.objects FOR INSERT 
WITH CHECK ( bucket_id = 'patient-documents' );

-- Permitir que usuários autenticados (Admin) atualizem arquivos
CREATE POLICY "Admin Document Update" 
ON storage.objects FOR UPDATE 
USING ( bucket_id = 'patient-documents' );

-- Permitir que usuários autenticados (Admin) excluam arquivos
CREATE POLICY "Admin Document Delete" 
ON storage.objects FOR DELETE 
USING ( bucket_id = 'patient-documents' );
