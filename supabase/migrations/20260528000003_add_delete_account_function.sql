-- Migration to add a secure security definer function allowing users to delete their own account.

create or replace function public.delete_user_account()
returns void as $$
begin
  delete from auth.users where id = auth.uid();
end;
$$ language plpgsql security definer;
