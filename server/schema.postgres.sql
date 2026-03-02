create extension if not exists "pgcrypto";

create table if not exists teachers (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null unique,
  password_hash text not null,
  created_at timestamptz not null default now()
);

create table if not exists classes (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references teachers(id) on delete cascade,
  name text not null check (name in ('Form 1', 'Form 2', 'Form 3', 'Form 4')),
  stream text,
  year int not null,
  created_at timestamptz not null default now()
);

create table if not exists students (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references classes(id) on delete cascade,
  admission_number text not null,
  full_name text not null,
  gender text not null check (gender in ('Male', 'Female')),
  created_at timestamptz not null default now(),
  unique (class_id, admission_number)
);

create table if not exists attendance (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  class_id uuid not null references classes(id) on delete cascade,
  date date not null,
  status text not null check (status in ('present', 'absent')),
  reason text,
  created_at timestamptz not null default now(),
  unique (student_id, date)
);

create table if not exists subjects (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references classes(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  unique (class_id, name)
);

create table if not exists marks (
  id uuid primary key default gen_random_uuid(),
  student_id uuid not null references students(id) on delete cascade,
  subject_id uuid not null references subjects(id) on delete cascade,
  class_id uuid not null references classes(id) on delete cascade,
  exam_type text not null,
  term text not null check (term in ('Term 1', 'Term 2', 'Term 3')),
  score numeric(5,2) not null check (score >= 0 and score <= 100),
  out_of numeric(5,2) not null default 100,
  created_at timestamptz not null default now(),
  unique (student_id, subject_id, exam_type, term)
);

create table if not exists timetable_lessons (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references classes(id) on delete cascade,
  subject_id uuid references subjects(id) on delete set null,
  day_of_week text not null check (day_of_week in ('Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday')),
  start_time time not null,
  end_time time not null,
  attended boolean,
  reason text,
  compensated boolean not null default false,
  compensation_note text,
  compensation_date date,
  compensation_for_lesson_id uuid references timetable_lessons(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists timetable_history (
  id uuid primary key default gen_random_uuid(),
  class_id uuid not null references classes(id) on delete cascade,
  lesson_id uuid references timetable_lessons(id) on delete set null,
  subject_id uuid references subjects(id) on delete set null,
  day_of_week text not null,
  start_time time not null,
  end_time time not null,
  status text not null check (status in ('attended', 'not_attended')),
  reason text,
  recorded_at timestamptz not null default now()
);

create table if not exists grade_settings (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null unique references teachers(id) on delete cascade,
  a_min numeric(5,2) not null default 80,
  a_minus_min numeric(5,2) not null default 75,
  b_plus_min numeric(5,2) not null default 70,
  b_min numeric(5,2) not null default 65,
  b_minus_min numeric(5,2) not null default 60,
  c_plus_min numeric(5,2) not null default 55,
  c_min numeric(5,2) not null default 50,
  c_minus_min numeric(5,2) not null default 45,
  d_plus_min numeric(5,2) not null default 40,
  d_min numeric(5,2) not null default 35,
  d_minus_min numeric(5,2) not null default 30,
  e_min numeric(5,2) not null default 0,
  average_multiplier numeric(5,2) not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists exam_types (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references teachers(id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now(),
  unique (teacher_id, name)
);

create table if not exists teacher_notes (
  id uuid primary key default gen_random_uuid(),
  teacher_id uuid not null references teachers(id) on delete cascade,
  class_id uuid not null references classes(id) on delete cascade,
  title text not null,
  content_html text not null,
  due_date date,
  is_completed boolean not null default false,
  completed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
