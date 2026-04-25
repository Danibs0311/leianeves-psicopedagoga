-- ==========================================
-- FIX ADMIN PERMISSIONS (RLS)
-- ==========================================

-- 1. APPOINTMENTS
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable all for authenticated users" ON public.appointments;
CREATE POLICY "Enable all for authenticated users"
ON public.appointments
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 2. PATIENTS
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable all for authenticated users" ON public.patients;
CREATE POLICY "Enable all for authenticated users"
ON public.patients
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 3. PATIENT ANAMNESIS
ALTER TABLE public.patient_anamnesis ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable all for authenticated users" ON public.patient_anamnesis;
CREATE POLICY "Enable all for authenticated users"
ON public.patient_anamnesis
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 4. BUSINESS SETTINGS
ALTER TABLE public.business_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable all for authenticated users" ON public.business_settings;
CREATE POLICY "Enable all for authenticated users"
ON public.business_settings
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- 5. BLOG POSTS
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Enable all for authenticated users" ON public.blog_posts;
CREATE POLICY "Enable all for authenticated users"
ON public.blog_posts
FOR ALL
TO authenticated
USING (true)
WITH CHECK (true);

-- Explicitly Grant Permissions to Authenticated Role
GRANT ALL ON TABLE public.appointments TO authenticated;
GRANT ALL ON TABLE public.patients TO authenticated;
GRANT ALL ON TABLE public.patient_anamnesis TO authenticated;
GRANT ALL ON TABLE public.business_settings TO authenticated;
GRANT ALL ON TABLE public.blog_posts TO authenticated;

-- Ensure sequences are also accessible (needed for inserts)
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO authenticated;
