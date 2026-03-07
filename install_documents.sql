-- Create Document Templates Table
create table if not exists document_templates (
  id bigint primary key generated always as identity,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  content text not null, -- HTML content
  category text
);

-- Create Clinical Records Table (Filled Documents)
create table if not exists clinical_records (
  id bigint primary key generated always as identity,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  patient_id bigint references patients(id) on delete cascade not null,
  template_id bigint references document_templates(id),
  title text not null,
  content text not null,
  date date default CURRENT_DATE
);

-- Enable RLS
alter table document_templates enable row level security;
alter table clinical_records enable row level security;

-- Policies for Templates
create policy "Admins can select templates" on document_templates for select to authenticated using (true);
create policy "Admins can insert templates" on document_templates for insert to authenticated with check (true);
create policy "Admins can update templates" on document_templates for update to authenticated using (true);
create policy "Admins can delete templates" on document_templates for delete to authenticated using (true);

-- Policies for Clinical Records
create policy "Admins can select records" on clinical_records for select to authenticated using (true);
create policy "Admins can insert records" on clinical_records for insert to authenticated with check (true);
create policy "Admins can update records" on clinical_records for update to authenticated using (true);
create policy "Admins can delete records" on clinical_records for delete to authenticated using (true);



-- Seed Document Templates
INSERT INTO document_templates (title, category, content) VALUES ('Informe de Acompanhamento', 'Relatórios', '

<div class="text-center mb-8">
    <h3 class="font-bold text-xl text-slate-800">Léia Neves</h3>
    <p class="text-slate-500 text-sm">Psicopedagoga Especializada</p>
    <p class="text-slate-400 text-xs">CBO: [Inserir] | ABPp: [Inserir]</p>
</div>


<h2 class="text-center font-bold text-slate-800 text-lg mb-6">INFORME DE ACOMPANHAMENTO</h2>

<p class="mb-4">Informamos à (instituição, responsável ou interessado) que o paciente (aluno) <strong>[Nome do Paciente]</strong> está recebendo acompanhamento psicopedagógico especializado desde [Data de Início], para avaliação e diagnóstico psicopedagógico.</p>
<p class="mb-4">Este acompanhamento tem como objetivo investigar as dificuldades de aprendizagem e intervir de forma adequada para o desenvolvimento do paciente.</p>
<p class="mb-4">Estamos à disposição para qualquer esclarecimento.</p>
<p class="mb-8">Atenciosamente,</p>
<p class="mb-4">[Local e Data]</p>


<div class="mt-12 text-center">
    <div class="border-t border-slate-300 w-64 mx-auto mb-2"></div>
    <p class="font-bold text-slate-700">Léia Neves</p>
    <p class="text-slate-500 text-sm">Psicopedagoga</p>
</div>

');
INSERT INTO document_templates (title, category, content) VALUES ('Ficha de Encaminhamento', 'Encaminhamentos', '

<div class="text-center mb-8">
    <h3 class="font-bold text-xl text-slate-800">Léia Neves</h3>
    <p class="text-slate-500 text-sm">Psicopedagoga Especializada</p>
    <p class="text-slate-400 text-xs">CBO: [Inserir] | ABPp: [Inserir]</p>
</div>


<h2 class="text-center font-bold text-slate-800 text-lg mb-6">ENCAMINHAMENTO</h2>

<p class="mb-4"><strong>Ao(À):</strong> [Nome do Profissional/Especialidade]</p>
<p class="mb-4">Prezado(a) Dr(a),</p>
<p class="mb-4">Encaminho o(a) paciente/aprendente <strong>[Nome do Paciente]</strong>, que apresenta os seguintes dados subjetivos e objetivos mais relevantes ao motivo do encaminhamento (descrever sinais de alerta):</p>

<div class="p-4 bg-slate-50 border border-slate-200 rounded mb-4 italic text-slate-600">
    (Descreva aqui as observações...)
</div>

<p class="mb-4">Estamos à disposição para qualquer esclarecimento.</p>
<p class="mb-8">Atenciosamente,</p>
<p class="mb-4">[Local e Data]</p>


<div class="mt-12 text-center">
    <div class="border-t border-slate-300 w-64 mx-auto mb-2"></div>
    <p class="font-bold text-slate-700">Léia Neves</p>
    <p class="text-slate-500 text-sm">Psicopedagoga</p>
</div>

');
