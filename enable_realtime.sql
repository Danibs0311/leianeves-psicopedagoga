-- =========================================================================================
-- SCRIPT PARA ATIVAR O REALTIME NO SUPABASE
-- Cole este script na aba "SQL Editor" do Supabase e clique em "Run"
-- Isso fará com que novos agendamentos apareçam instantaneamente em todos os computadores.
-- ==========================================

-- 1. Habilitar o Realtime especificamente para a tabela de agendamentos
-- Primeiro, verificamos se a publicação existe (o Supabase cria 'supabase_realtime' por padrão)
-- Adicionamos a tabela à publicação para que o banco "avise" o site sobre mudanças.

BEGIN;
  -- Garante que a tabela tenha o REPLICA IDENTITY FULL para capturar todas as mudanças
  ALTER TABLE public.appointments REPLICA IDENTITY FULL;

  -- Adiciona a tabela à publicação do Realtime
  -- Se você receber um erro dizendo que a publicação já existe, use o comando 'ALTER'
  DO $$ 
  BEGIN
    IF EXISTS (SELECT 1 FROM pg_publication WHERE pubname = 'supabase_realtime') THEN
      ALTER PUBLICATION supabase_realtime ADD TABLE public.appointments;
    ELSE
      CREATE PUBLICATION supabase_realtime FOR TABLE public.appointments;
    END IF;
  END $$;
COMMIT;

-- 2. (Opcional) Ativar também para leads de marketing se desejar ver em tempo real
ALTER TABLE public.marketing_leads REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.marketing_leads;

-- ==========================================
-- INSTRUÇÕES ADICIONAIS
-- ==========================================
-- Além deste script, você deve:
-- 1. Ir no Dashboard do Supabase -> Database -> Replication.
-- 2. Em 'supabase_realtime', clique no botão 'Source' e certifique-se que 'appointments' está marcado.
-- ==========================================
