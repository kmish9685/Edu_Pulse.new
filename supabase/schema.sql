-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- SESSIONS
create table public.sessions (
  id uuid default uuid_generate_v4() primary key,
  course_name text not null,
  educator_name text not null,
  status text not null check (status in ('active', 'ended')),
  started_at timestamp with time zone default now(),
  ended_at timestamp with time zone
);

-- SIGNAL TYPES (Lookup table)
create table public.signal_types (
  id uuid default uuid_generate_v4() primary key,
  label text not null,
  active boolean default true,
  created_at timestamp with time zone default now()
);

-- SIGNALS
create table public.signals (
  id uuid default uuid_generate_v4() primary key,
  session_id uuid references public.sessions(id) not null,
  device_id text not null, -- Anonymous device fingerprint
  signal_type text not null, -- e.g., 'confusion', 'too_fast'
  topic text, -- optional specific topic
  created_at timestamp with time zone default now()
);

-- CAMPUS SETTINGS (Geofencing)
create table public.campus_settings (
  id uuid default uuid_generate_v4() primary key,
  latitude double precision not null,
  longitude double precision not null,
  radius double precision not null, -- in meters
  demo_mode boolean default false,
  updated_at timestamp with time zone default now()
);

-- RLS POLICIES (Simple for MVP)
alter table public.sessions enable row level security;
alter table public.signals enable row level security;
alter table public.campus_settings enable row level security;
alter table public.signal_types enable row level security;

-- Allow read access to everyone (public dashboard)
create policy "Allow public read access" on public.sessions for select using (true);
create policy "Allow public read access" on public.signals for select using (true);
create policy "Allow public read access" on public.campus_settings for select using (true);
create policy "Allow public read access" on public.signal_types for select using (true);

-- Allow insert access to everyone (student signals, teacher starts session)
-- Ideally this should be restricted, but for "No login ever" + MVP, we open it.
create policy "Allow public insert access" on public.sessions for insert with check (true);
create policy "Allow public insert access" on public.signals for insert with check (true);
-- Update only for sessions (end session)
create policy "Allow public update access" on public.sessions for update using (true);

-- Functions for Realtime (if needed, but standard insert triggers work)
