-- Enable UUID generation
create extension if not exists "pgcrypto";

-- ────────────────────────────────────────────────
-- Subjects
-- ────────────────────────────────────────────────
create table if not exists subjects (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  description text,
  year        int,
  created_at  timestamptz default now()
);

alter table subjects enable row level security;
create policy "Subjects are publicly readable"
  on subjects for select using (true);

-- ────────────────────────────────────────────────
-- Documents (past papers + notes)
-- ────────────────────────────────────────────────
create table if not exists documents (
  id             uuid primary key default gen_random_uuid(),
  subject_id     uuid references subjects(id) on delete cascade,
  title          text not null,
  type           text not null check (type in ('past_paper','notes','other')),
  language       text not null default 'en' check (language in ('en','fr')),
  storage_path   text not null,
  extracted_text text,
  summary        text,
  key_topics     text[],
  exam_year      int,
  created_at     timestamptz default now()
);

alter table documents enable row level security;
create policy "Documents are publicly readable"
  on documents for select using (true);

-- ────────────────────────────────────────────────
-- Questions
-- ────────────────────────────────────────────────
create table if not exists questions (
  id             uuid primary key default gen_random_uuid(),
  document_id    uuid references documents(id) on delete cascade,
  subject_id     uuid references subjects(id) on delete cascade,
  type           text not null check (type in ('multiple_choice','short_answer')),
  question       text not null,
  options        text[],
  correct_answer text not null,
  explanation    text,
  difficulty     text check (difficulty in ('easy','medium','hard')),
  created_at     timestamptz default now()
);

alter table questions enable row level security;
create policy "Questions are publicly readable"
  on questions for select using (true);

-- ────────────────────────────────────────────────
-- Test attempts
-- ────────────────────────────────────────────────
create table if not exists test_attempts (
  id                  uuid primary key default gen_random_uuid(),
  user_id             uuid references auth.users(id) on delete cascade,
  subject_id          uuid references subjects(id) on delete cascade,
  score               int not null,
  total_questions     int not null,
  time_taken_seconds  int,
  answers             jsonb not null default '{}',
  completed_at        timestamptz default now()
);

alter table test_attempts enable row level security;
create policy "Users can read their own attempts"
  on test_attempts for select using (auth.uid() = user_id);
create policy "Users can insert their own attempts"
  on test_attempts for insert with check (auth.uid() = user_id);

-- ────────────────────────────────────────────────
-- Storage bucket for PDFs
-- ────────────────────────────────────────────────
insert into storage.buckets (id, name, public)
values ('documents', 'documents', false)
on conflict do nothing;

create policy "Authenticated users can upload documents"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'documents');

create policy "Authenticated users can read documents"
  on storage.objects for select
  to authenticated
  using (bucket_id = 'documents');
