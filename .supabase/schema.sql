-- ============================
-- PROFILES TABLE
-- ============================

create table if not exists profiles (
  id uuid primary key references auth.users on delete cascade,
  username text unique,
  bio text,
  avatar_url text,
  created_at timestamp with time zone default timezone('utc', now())
);

-- Enable Row Level Security
alter table profiles enable row level security;

-- RLS policy: Users can read their own profile
create policy "Users can view their own profile"
  on profiles
  for select
  using (auth.uid() = id);

-- RLS policy: Users can update their own profile
create policy "Users can update their own profile"
  on profiles
  for update
  using (auth.uid() = id);

-- ============================
-- POSTS TABLE
-- ============================

create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users on delete cascade,
  title text not null,
  content text,
  status text check (status in ('draft', 'published')) default 'draft',
  created_at timestamp with time zone default timezone('utc', now()),
  updated_at timestamp with time zone default timezone('utc', now())
);

-- Enable RLS
alter table posts enable row level security;

-- RLS policy: Users can read published posts
create policy "Public can read published posts"
  on posts
  for select
  using (status = 'published');

-- RLS policy: Users can read their own posts
create policy "Users can read their own posts"
  on posts
  for select
  using (auth.uid() = user_id);

-- RLS policy: Users can insert their own posts
create policy "Users can insert posts"
  on posts
  for insert
  with check (auth.uid() = user_id);

-- RLS policy: Users can update their own posts
create policy "Users can update their own posts"
  on posts
  for update
  using (auth.uid() = user_id);

-- RLS policy: Users can delete their own posts
create policy "Users can delete their own posts"
  on posts
  for delete
  using (auth.uid() = user_id);

-- ============================
-- POST_STATS TABLE
-- ============================

create table if not exists post_stats (
  post_id uuid primary key references posts on delete cascade,
  views int default 0,
  likes int default 0,
  comments int default 0
);

-- Enable RLS
alter table post_stats enable row level security;

-- RLS policy: Allow everyone to view stats of published posts
create policy "Allow viewing stats for published posts"
  on post_stats
  for select
  using (exists (
    select 1 from posts
    where posts.id = post_stats.post_id
      and posts.status = 'published'
  ));

-- RLS policy: Allow authors to update stats of their own posts
create policy "Allow post authors to update stats"
  on post_stats
  for update
  using (exists (
    select 1 from posts
    where posts.id = post_stats.post_id
      and posts.user_id = auth.uid()
  ));
