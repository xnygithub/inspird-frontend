drop function if exists public.match_posts_to_post(uuid, integer, double precision);

create or replace function match_posts_to_post (
  post_id uuid,
  match_count int default 12,
  min_similarity float default 0.6
)
returns table (
  id uuid,
  "ownerId" uuid,
  "ownerUsername" text,
  "mediaUrl" text,
  "mediaHeight" int,
  "mediaWidth" int,
  similarity float
)
language sql
stable
as $$
with base as (
  select embedding
  from posts
  where id = post_id
    and embedding is not null
)
select
  p.id,
  p."userId"                         as "ownerId",
  u.username                         as "ownerUsername",
  p."mediaUrl"                       as "mediaUrl",
  p."mediaHeight"                    as "mediaHeight",
  p."mediaWidth"                     as "mediaWidth",
  1 - (p.embedding <=> b.embedding)  as similarity
from posts p
join profiles u on u.id = p."userId"
cross join base b
where p.embedding is not null
  and p.id <> post_id
  and (1 - (p.embedding <=> b.embedding)) >= min_similarity
order by p.embedding <=> b.embedding
limit match_count;
$$;
