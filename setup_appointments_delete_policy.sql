-- setup_appointments_delete_policy.sql
-- Run this in the Supabase SQL Editor to allow authenticated admins to delete appointments.

-- Allow authorized admins to delete appointments
CREATE POLICY "Admins can delete appointments" 
ON public.appointments 
FOR DELETE 
TO authenticated 
USING (true);
