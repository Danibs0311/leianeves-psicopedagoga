-- Add CPF column to patients table
ALTER TABLE patients ADD COLUMN IF NOT EXISTS cpf text UNIQUE;

-- Add CPF column to appointments table
ALTER TABLE appointments ADD COLUMN IF NOT EXISTS cpf text;

-- Add index for faster search
CREATE INDEX IF NOT EXISTS idx_patients_cpf ON patients(cpf);
CREATE INDEX IF NOT EXISTS idx_appointments_cpf ON appointments(cpf);
