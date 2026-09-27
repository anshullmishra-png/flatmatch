-- FlatMatch schema
-- No auth: participants are identified by a locally-stored id, not a login.

create extension if not exists "pgcrypto";

create table if not exists rooms (
  id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null default 'Our flat search',
  created_at timestamptz not null default now()
);

create table if not exists participants (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references rooms(id) on delete cascade,
  name text not null,
  display_name text not null,
  has_submitted boolean not null default false,
  created_at timestamptz not null default now()
);

create table if not exists profiles (
  participant_id uuid primary key references participants(id) on delete cascade,
  max_rent numeric not null check (max_rent > 0),
  excluded_areas text[] not null default '{}',
  needs_lift boolean not null default false,
  needs_parking boolean not null default false,
  min_bathrooms int not null default 0 check (min_bathrooms >= 0),
  pet_friendly_required boolean not null default false,
  max_commute_minutes int check (max_commute_minutes is null or max_commute_minutes > 0),
  commute_reference text,
  soft_preferences text[] not null default '{}',
  updated_at timestamptz not null default now()
);

create table if not exists listings (
  id uuid primary key default gen_random_uuid(),
  room_id uuid not null references rooms(id) on delete cascade,
  added_by_participant_id uuid not null references participants(id) on delete cascade,
  title text not null,
  area text not null,
  rent numeric not null check (rent > 0),
  floor int not null default 0 check (floor >= 0),
  has_lift boolean not null default false,
  has_parking boolean not null default false,
  bathrooms int not null default 1 check (bathrooms >= 0),
  pet_friendly boolean not null default false,
  link text,
  commute_ok_for uuid[] not null default '{}',
  created_at timestamptz not null default now()
);

create index if not exists idx_participants_room on participants(room_id);
create index if not exists idx_listings_room on listings(room_id);

-- Row Level Security: the app has no auth, so all reads/writes go through
-- server-side code using the service role key. Block anon direct access.
alter table rooms enable row level security;
alter table participants enable row level security;
alter table profiles enable row level security;
alter table listings enable row level security;
