-- add_custom_schedule.sql
-- Run this script in the Supabase SQL Editor to allow overriding the schedule per day.

ALTER TABLE public.business_settings 
ADD COLUMN IF NOT EXISTS custom_schedule JSONB DEFAULT '{}'::jsonb;
