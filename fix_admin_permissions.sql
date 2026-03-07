-- Permitir que o Painel Admin "Veja" os agendamentos (SELECT)
CREATE POLICY "Enable select for anon"
ON public.appointments
FOR SELECT
TO anon
USING (true);

-- Permitir que o Painel Admin "Altere" o status (UPDATE)
CREATE POLICY "Enable update for anon"
ON public.appointments
FOR UPDATE
TO anon
USING (true);

-- Conceder permissões nível de tabela explicitamente (Garante acesso ao objeto)
GRANT SELECT, UPDATE ON TABLE public.appointments TO anon;
