-- Create profiles table
create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  college_name text,
  course text,
  semester integer,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.profiles enable row level security;

-- Setup RLS Policies
create policy "Public profiles are viewable by everyone" on public.profiles
  for select using (true);

create policy "Users can update their own profiles" on public.profiles
  for update to authenticated
  using ( (select auth.uid()) = id )
  with check ( (select auth.uid()) = id );

-- Automatically create profile row on user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, college_name, course, semester)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'name', ''),
    coalesce(new.raw_user_meta_data->>'college_name', ''),
    coalesce(new.raw_user_meta_data->>'course', ''),
    1
  );
  return new;
end;
$$ language plpgsql security definer;

-- Trigger definition
create or replace trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
