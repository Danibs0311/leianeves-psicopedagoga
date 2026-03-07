-- Create Patients Table
create table if not exists patients (
  id bigint primary key generated always as identity,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  child_name text not null,
  parent_name text not null,
  phone text,
  email text,
  birth_date date,
  notes text,
  status text default 'active' -- active, archived
);

-- Create Documents Table
create table if not exists patient_documents (
  id bigint primary key generated always as identity,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  patient_id bigint references patients(id) on delete cascade not null,
  title text not null,
  description text,
  file_url text not null,
  file_type text -- pdf, image, doc, etc
);

-- Enable RLS for Patients
alter table patients enable row level security;

-- Policies for Patients
-- Allow authorized admins to do everything
create policy "Admins can select patients"
  on patients for select
  to authenticated
  using (true);

create policy "Admins can insert patients"
  on patients for insert
  to authenticated
  with check (true);

create policy "Admins can update patients"
  on patients for update
  to authenticated
  using (true);

create policy "Admins can delete patients"
  on patients for delete
  to authenticated
  using (true);

-- Enable RLS for Documents
alter table patient_documents enable row level security;

-- Policies for Documents
-- Allow authorized admins to do everything
create policy "Admins can select documents"
  on patient_documents for select
  to authenticated
  using (true);

create policy "Admins can insert documents"
  on patient_documents for insert
  to authenticated
  with check (true);

create policy "Admins can update documents"
  on patient_documents for update
  to authenticated
  using (true);

create policy "Admins can delete documents"
  on patient_documents for delete
  to authenticated
  using (true);

-- Also create Storage Bucket for documents if needed (using SQL for storage is tricky, usually done via UI, but policies can be set here)
-- Ideally, create a 'patient-documents' bucket in Supabase Dashboard.
