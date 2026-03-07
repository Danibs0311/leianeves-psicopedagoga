-- Enable RLS just in case
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

-- Drop existing policy if it exists to avoid conflicts
DROP POLICY IF EXISTS "Allow anonymous inserts" ON public.appointments;

-- Create the policy to allow everyone (anon) to insert appointments
CREATE POLICY "Allow anonymous inserts"
ON public.appointments
FOR INSERT
TO anon
WITH CHECK (true);

-- Optional: Allow anon to read their own appointments? 
-- For now, let's just allow inserts as that's what failed.
