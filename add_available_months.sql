-- add_available_months.sql
-- Run this script in the Supabase SQL Editor.

-- Add the 'available_months' column to 'business_settings'
ALTER TABLE public.business_settings 
ADD COLUMN IF NOT EXISTS available_months integer[] DEFAULT '{0,1,2,3,4,5,6,7,8,9,10,11}'::integer[];
