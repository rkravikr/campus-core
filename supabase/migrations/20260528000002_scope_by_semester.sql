-- Migration to add semester column to subjects, assignments, exams, and timetable
-- and backfill based on user's current profile semester.

-- 1. Add semester column to subjects
alter table public.subjects
  add column semester integer not null default 1 check (semester between 1 and 8);

-- 2. Add semester column to assignments
alter table public.assignments
  add column semester integer not null default 1 check (semester between 1 and 8);

-- 3. Add semester column to exams
alter table public.exams
  add column semester integer not null default 1 check (semester between 1 and 8);

-- 4. Add semester column to timetable
alter table public.timetable
  add column semester integer not null default 1 check (semester between 1 and 8);

-- Backfill data by matching the user's current semester from profiles
update public.subjects s
  set semester = coalesce((select semester from public.profiles p where p.id = s.user_id), 1);

update public.assignments a
  set semester = coalesce((select semester from public.profiles p where p.id = a.user_id), 1);

update public.exams e
  set semester = coalesce((select semester from public.profiles p where p.id = e.user_id), 1);

update public.timetable t
  set semester = coalesce((select semester from public.profiles p where p.id = t.user_id), 1);
