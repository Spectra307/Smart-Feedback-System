-- Add faculty role to the enum
ALTER TYPE public.app_role ADD VALUE 'faculty';

-- Add faculty_name to profiles table to link faculty accounts to their feedback
ALTER TABLE public.profiles ADD COLUMN faculty_name TEXT;

-- Create policy for faculty to view their own feedback
CREATE POLICY "Faculty can view feedback about themselves"
ON public.feedback
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.faculty_name = feedback.faculty_name
  )
);

-- Create policy for faculty to view reports about themselves
CREATE POLICY "Faculty can view their own reports"
ON public.reports
FOR SELECT
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.id = auth.uid()
    AND profiles.faculty_name = reports.faculty_name
  )
);