-- Add optional profile details to public.profiles table
ALTER TABLE public.profiles 
ADD COLUMN usn text,
ADD COLUMN mobile_number text,
ADD COLUMN bio varchar(200),
ADD COLUMN linkedin_url text,
ADD COLUMN github_url text;
