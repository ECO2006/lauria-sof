-- ============================================================
-- Laurea Sofia — schema Supabase
-- Incolla tutto questo file in Supabase → SQL Editor → RUN
-- ============================================================

-- Tabella foto
create table if not exists public.photos (
  id uuid primary key default gen_random_uuid(),
  storage_path text not null,
  owner_device_id text not null,
  owner_name text not null,
  owner_color text not null,
  created_at timestamptz not null default now()
);

-- Tabella like (un like per dispositivo per foto)
create table if not exists public.likes (
  id uuid primary key default gen_random_uuid(),
  photo_id uuid not null references public.photos(id) on delete cascade,
  device_id text not null,
  created_at timestamptz not null default now(),
  unique (photo_id, device_id)
);

create index if not exists likes_photo_id_idx on public.likes (photo_id);
create index if not exists photos_created_at_idx on public.photos (created_at desc);

-- Row Level Security: tutte le operazioni passano dalle API routes
-- del sito (che usano la Service Role Key), quindi il client browser
-- (anon key) non deve avere alcun permesso diretto sulle tabelle.
alter table public.photos enable row level security;
alter table public.likes enable row level security;

-- Nessuna policy per il ruolo "anon" = nessun accesso diretto dal browser.
-- La Service Role Key usata dalle API routes ignora comunque la RLS.

-- ============================================================
-- Storage: bucket per le foto
-- ============================================================
-- 1. Vai su Storage → crea un bucket chiamato esattamente "photos"
--    con "Public bucket" attivato (serve per mostrare/scaricare le foto).
-- 2. Non servono policy aggiuntive sullo storage: il sito carica le
--    foto tramite "signed upload URL" generati dal server con la
--    Service Role Key, quindi il bucket può restare privato in
--    scrittura e pubblico solo in lettura.
