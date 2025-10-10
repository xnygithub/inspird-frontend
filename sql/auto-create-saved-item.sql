create or replace function public.create_saved_item_on_post()

returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.saved_items ("postId", "userId")
  values (new.id, auth.uid())
  on conflict ("userId", "postId") do nothing;
  return new;
end;
$$;


drop trigger if exists trg_posts_ai_create_saved_item on public.posts;

create trigger trg_posts_ai_create_saved_item
after insert on public.posts
for each row
execute procedure public.create_saved_item_on_post();