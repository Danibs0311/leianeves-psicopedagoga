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
