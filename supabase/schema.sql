-- Amira Bechini: enrollments + lesson progress.
-- Run in the Supabase SQL editor. RLS is on: a student only ever sees their own rows.
-- Writes to `enrollments` come from the Stripe webhook using the service role key,
-- which bypasses RLS, so there is deliberately no INSERT policy for students.

create table if not exists enrollments (
  id                 uuid primary key default gen_random_uuid(),
  user_id            uuid not null references auth.users (id) on delete cascade,
  course_slug        text not null,
  stripe_session_id  text unique,
  created_at         timestamptz not null default now(),
  completed_at       timestamptz,
  unique (user_id, course_slug)
);

create table if not exists lesson_progress (
  user_id      uuid not null references auth.users (id) on delete cascade,
  course_slug  text not null,
  lesson_id    text not null,
  completed_at timestamptz not null default now(),
  primary key (user_id, course_slug, lesson_id)
);

create index if not exists lesson_progress_user_course
  on lesson_progress (user_id, course_slug);

alter table enrollments     enable row level security;
alter table lesson_progress enable row level security;

create policy "read own enrollments" on enrollments
  for select using (auth.uid() = user_id);

create policy "read own progress" on lesson_progress
  for select using (auth.uid() = user_id);

-- A student may only mark progress on a course they actually paid for.
create policy "write own progress" on lesson_progress
  for insert with check (
    auth.uid() = user_id
    and exists (
      select 1 from enrollments e
      where e.user_id = auth.uid() and e.course_slug = lesson_progress.course_slug
    )
  );

create policy "delete own progress" on lesson_progress
  for delete using (auth.uid() = user_id);

-- Certificates are derived, not stored: an enrollment with completed_at set is the
-- certificate, and its id is the public verification code.
create policy "complete own enrollment" on enrollments
  for update using (auth.uid() = user_id) with check (auth.uid() = user_id);
