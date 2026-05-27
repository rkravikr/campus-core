-- 1. Create subjects table
create table public.subjects (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  subject_name text not null,
  total_classes integer default 0 not null,
  attended_classes integer default 0 not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 2. Create assignments table
create table public.assignments (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  subject_id uuid references public.subjects(id) on delete set null,
  title text not null,
  description text,
  due_date timestamp with time zone not null,
  priority text default 'Medium' not null check (priority in ('Low', 'Medium', 'High')),
  completed boolean default false not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 3. Create exams table
create table public.exams (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  subject_id uuid references public.subjects(id) on delete set null,
  exam_type text not null, -- Midterm, Endterm, Quiz, etc.
  exam_date timestamp with time zone not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. Create timetable table
create table public.timetable (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  subject_id uuid references public.subjects(id) on delete set null,
  day text not null check (day in ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday')),
  start_time time not null,
  end_time time not null,
  room text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. Create grades table
create table public.grades (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  semester integer not null check (semester between 1 and 8),
  subject_name text not null,
  credits integer not null,
  grade text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS on all tables
alter table public.subjects enable row level security;
alter table public.assignments enable row level security;
alter table public.exams enable row level security;
alter table public.timetable enable row level security;
alter table public.grades enable row level security;

-- ----------------- SUBJECTS POLICIES -----------------
create policy "Users can view their own subjects" on public.subjects
  for select to authenticated using ( (select auth.uid()) = user_id );

create policy "Users can create their own subjects" on public.subjects
  for insert to authenticated with check ( (select auth.uid()) = user_id );

create policy "Users can update their own subjects" on public.subjects
  for update to authenticated 
  using ( (select auth.uid()) = user_id ) 
  with check ( (select auth.uid()) = user_id );

create policy "Users can delete their own subjects" on public.subjects
  for delete to authenticated using ( (select auth.uid()) = user_id );

-- ----------------- ASSIGNMENTS POLICIES -----------------
create policy "Users can view their own assignments" on public.assignments
  for select to authenticated using ( (select auth.uid()) = user_id );

create policy "Users can create their own assignments" on public.assignments
  for insert to authenticated with check ( (select auth.uid()) = user_id );

create policy "Users can update their own assignments" on public.assignments
  for update to authenticated 
  using ( (select auth.uid()) = user_id ) 
  with check ( (select auth.uid()) = user_id );

create policy "Users can delete their own assignments" on public.assignments
  for delete to authenticated using ( (select auth.uid()) = user_id );

-- ----------------- EXAMS POLICIES -----------------
create policy "Users can view their own exams" on public.exams
  for select to authenticated using ( (select auth.uid()) = user_id );

create policy "Users can create their own exams" on public.exams
  for insert to authenticated with check ( (select auth.uid()) = user_id );

create policy "Users can update their own exams" on public.exams
  for update to authenticated 
  using ( (select auth.uid()) = user_id ) 
  with check ( (select auth.uid()) = user_id );

create policy "Users can delete their own exams" on public.exams
  for delete to authenticated using ( (select auth.uid()) = user_id );

-- ----------------- TIMETABLE POLICIES -----------------
create policy "Users can view their own timetable entries" on public.timetable
  for select to authenticated using ( (select auth.uid()) = user_id );

create policy "Users can create their own timetable entries" on public.timetable
  for insert to authenticated with check ( (select auth.uid()) = user_id );

create policy "Users can update their own timetable entries" on public.timetable
  for update to authenticated 
  using ( (select auth.uid()) = user_id ) 
  with check ( (select auth.uid()) = user_id );

create policy "Users can delete their own timetable entries" on public.timetable
  for delete to authenticated using ( (select auth.uid()) = user_id );

-- ----------------- GRADES POLICIES -----------------
create policy "Users can view their own grades" on public.grades
  for select to authenticated using ( (select auth.uid()) = user_id );

create policy "Users can create their own grades" on public.grades
  for insert to authenticated with check ( (select auth.uid()) = user_id );

create policy "Users can update their own grades" on public.grades
  for update to authenticated 
  using ( (select auth.uid()) = user_id ) 
  with check ( (select auth.uid()) = user_id );

create policy "Users can delete their own grades" on public.grades
  for delete to authenticated using ( (select auth.uid()) = user_id );
