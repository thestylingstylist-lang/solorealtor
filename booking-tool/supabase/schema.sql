-- Run this once in the Supabase SQL Editor (Database > SQL Editor > New query).

create extension if not exists "pgcrypto";

create table if not exists public.bookings (
  id           uuid primary key default gen_random_uuid(),
  created_at   timestamptz not null default now(),
  first_name   text not null,
  last_name    text not null,
  email        text,
  phone        text,
  meeting_type text not null check (meeting_type in ('virtual', 'phone')),
  slot_start   timestamptz not null,
  -- must have at least one way to reach the client
  constraint contact_present check (email is not null or phone is not null)
);

-- One booking per time slot (blocks double-booking at the database level).
create unique index if not exists bookings_slot_start_key
  on public.bookings (slot_start);

-- Newest-relevant ordering support.
create index if not exists bookings_slot_start_idx
  on public.bookings (slot_start);

-- Lock the table down. The public booking flow writes through the server's
-- service-role key (which bypasses these policies); the browser can do nothing
-- directly. Only a signed-in agent can read bookings.
alter table public.bookings enable row level security;

drop policy if exists "agents can read bookings" on public.bookings;
create policy "agents can read bookings"
  on public.bookings
  for select
  to authenticated
  using (true);
