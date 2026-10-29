-- ============================================================
-- EduSMK LMS - Supabase Schema
-- Jalankan di: Supabase Dashboard > SQL Editor
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- PROFILES (Pengguna: admin, guru, siswa)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id            TEXT PRIMARY KEY DEFAULT 'usr-' || replace(gen_random_uuid()::text, '-', ''),
  email         TEXT,
  full_name     TEXT NOT NULL,
  role          TEXT NOT NULL CHECK (role IN ('admin','guru','siswa')),
  nisn_nip      TEXT NOT NULL DEFAULT '',
  password_hash TEXT NOT NULL DEFAULT 'siswa123',
  phone         TEXT,
  avatar_url    TEXT,
  department_id TEXT,
  department_name TEXT,
  class_id      TEXT,
  class_name    TEXT,
  status        TEXT NOT NULL DEFAULT 'aktif' CHECK (status IN ('aktif','nonaktif')),
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ
);

-- ============================================================
-- DEPARTMENTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.departments (
  id          TEXT PRIMARY KEY,
  code        TEXT NOT NULL,
  name        TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  icon        TEXT,
  head_of_department TEXT,
  total_students INTEGER DEFAULT 0
);

-- ============================================================
-- CLASSROOMS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.classrooms (
  id             TEXT PRIMARY KEY,
  name           TEXT NOT NULL,
  grade_level    INTEGER NOT NULL CHECK (grade_level IN (10,11,12)),
  department_id  TEXT,
  department_name TEXT,
  academic_year  TEXT NOT NULL DEFAULT '2025/2026',
  teacher_id     TEXT,
  homeroom_teacher TEXT,
  student_count  INTEGER DEFAULT 0
);

-- ============================================================
-- SUBJECTS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.subjects (
  id              TEXT PRIMARY KEY,
  code            TEXT NOT NULL,
  name            TEXT NOT NULL,
  department_id   TEXT,
  department_name TEXT,
  description     TEXT,
  hours_per_week  INTEGER NOT NULL DEFAULT 2
);

-- ============================================================
-- TEACHING MATERIALS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.teaching_materials (
  id                  TEXT PRIMARY KEY,
  subject_id          TEXT NOT NULL,
  subject_name        TEXT,
  class_id            TEXT NOT NULL,
  class_name          TEXT,
  teacher_id          TEXT NOT NULL,
  teacher_name        TEXT,
  title               TEXT NOT NULL,
  slug                TEXT NOT NULL,
  description         TEXT NOT NULL DEFAULT '',
  learning_objectives JSONB DEFAULT '[]',
  content             TEXT NOT NULL DEFAULT '',
  subchapters         JSONB DEFAULT '[]',
  status              TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  youtube_url         TEXT,
  attachments         JSONB DEFAULT '[]',
  order_index         INTEGER NOT NULL DEFAULT 0,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- ASSIGNMENTS (Tugas)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.assignments (
  id              TEXT PRIMARY KEY,
  subject_id      TEXT NOT NULL,
  subject_name    TEXT,
  class_id        TEXT NOT NULL,
  class_name      TEXT,
  teacher_id      TEXT NOT NULL,
  teacher_name    TEXT,
  title           TEXT NOT NULL,
  description     TEXT NOT NULL DEFAULT '',
  instructions    TEXT NOT NULL DEFAULT '',
  start_date      TIMESTAMPTZ NOT NULL,
  due_date        TIMESTAMPTZ NOT NULL,
  submission_type TEXT NOT NULL DEFAULT 'text' CHECK (submission_type IN ('text','file','both')),
  max_score       INTEGER NOT NULL DEFAULT 100,
  weight          INTEGER NOT NULL DEFAULT 40,
  status          TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','closed')),
  rubric          JSONB DEFAULT '[]',
  attachments     JSONB DEFAULT '[]',
  submitted_count INTEGER DEFAULT 0,
  total_students  INTEGER DEFAULT 36,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- SUBMISSIONS (Pengumpulan Tugas Siswa)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.submissions (
  id              TEXT PRIMARY KEY DEFAULT 'subm-' || replace(gen_random_uuid()::text, '-', ''),
  assignment_id   TEXT NOT NULL,
  assignment_title TEXT,
  student_id      TEXT NOT NULL,
  student_name    TEXT NOT NULL,
  student_nisn    TEXT NOT NULL DEFAULT '',
  student_avatar  TEXT,
  content         TEXT,
  file_url        TEXT,
  file_name       TEXT,
  file_size       TEXT,
  submitted_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  status          TEXT NOT NULL DEFAULT 'sudah_dikumpulkan' CHECK (status IN ('belum_dikerjakan','draft','sudah_dikumpulkan','terlambat','sudah_dinilai')),
  score           INTEGER,
  feedback        TEXT,
  graded_at       TIMESTAMPTZ,
  graded_by       TEXT,
  UNIQUE(assignment_id, student_id)
);

-- ============================================================
-- QUIZZES
-- ============================================================
CREATE TABLE IF NOT EXISTS public.quizzes (
  id               TEXT PRIMARY KEY,
  subject_id       TEXT NOT NULL,
  subject_name     TEXT,
  class_id         TEXT NOT NULL,
  class_name       TEXT,
  teacher_id       TEXT NOT NULL,
  teacher_name     TEXT,
  title            TEXT NOT NULL,
  instructions     TEXT NOT NULL DEFAULT '',
  duration_minutes INTEGER NOT NULL DEFAULT 60,
  max_attempts     INTEGER NOT NULL DEFAULT 1,
  pass_score       INTEGER NOT NULL DEFAULT 75,
  status           TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft','published','archived')),
  due_date         TIMESTAMPTZ NOT NULL,
  question_count   INTEGER NOT NULL DEFAULT 0,
  questions        JSONB DEFAULT '[]',
  created_at       TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- QUIZ ATTEMPTS (Percobaan Kuis Siswa)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
  id           TEXT PRIMARY KEY DEFAULT 'att-' || replace(gen_random_uuid()::text, '-', ''),
  quiz_id      TEXT NOT NULL,
  quiz_title   TEXT,
  student_id   TEXT NOT NULL,
  student_name TEXT NOT NULL,
  started_at   TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  completed_at TIMESTAMPTZ,
  score        INTEGER,
  max_score    INTEGER NOT NULL DEFAULT 100,
  is_passed    BOOLEAN,
  answers      JSONB NOT NULL DEFAULT '{}',
  status       TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress','submitted','graded'))
);

-- ============================================================
-- GRADE RECORDS (Rekap Nilai)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.grade_records (
  id                TEXT PRIMARY KEY DEFAULT 'grade-' || replace(gen_random_uuid()::text, '-', ''),
  student_id        TEXT NOT NULL,
  student_name      TEXT NOT NULL,
  student_nisn      TEXT NOT NULL DEFAULT '',
  class_id          TEXT NOT NULL,
  class_name        TEXT NOT NULL,
  subject_id        TEXT NOT NULL,
  subject_name      TEXT NOT NULL,
  assignment_score  NUMERIC NOT NULL DEFAULT 0,
  quiz_score        NUMERIC NOT NULL DEFAULT 0,
  exam_score        NUMERIC NOT NULL DEFAULT 0,
  final_score       NUMERIC NOT NULL DEFAULT 0,
  letter_grade      TEXT NOT NULL DEFAULT 'C' CHECK (letter_grade IN ('A','B','C','D','E')),
  status_ketuntasan TEXT NOT NULL DEFAULT 'Belum Tuntas' CHECK (status_ketuntasan IN ('Tuntas','Belum Tuntas')),
  notes             TEXT,
  updated_at        TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(student_id, subject_id)
);

-- ============================================================
-- ANNOUNCEMENTS (Pengumuman)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.announcements (
  id          TEXT PRIMARY KEY DEFAULT 'ann-' || replace(gen_random_uuid()::text, '-', ''),
  title       TEXT NOT NULL,
  content     TEXT NOT NULL,
  author_id   TEXT NOT NULL,
  author_name TEXT NOT NULL,
  author_role TEXT NOT NULL,
  target_role TEXT NOT NULL DEFAULT 'all' CHECK (target_role IN ('all','guru','siswa')),
  class_id    TEXT,
  class_name  TEXT,
  priority    TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('normal','penting','darurat')),
  is_pinned   BOOLEAN NOT NULL DEFAULT false,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- ============================================================
-- LEARNING PROGRESS (Progres Materi)
-- ============================================================
CREATE TABLE IF NOT EXISTS public.learning_progress (
  id           TEXT PRIMARY KEY DEFAULT 'lp-' || replace(gen_random_uuid()::text, '-', ''),
  student_id   TEXT NOT NULL,
  material_id  TEXT NOT NULL,
  is_completed BOOLEAN NOT NULL DEFAULT false,
  completed_at TIMESTAMPTZ,
  UNIQUE(student_id, material_id)
);

-- ============================================================
-- SCHOOL SETTINGS
-- ============================================================
CREATE TABLE IF NOT EXISTS public.school_settings (
  id               TEXT PRIMARY KEY DEFAULT 'settings-1',
  school_name      TEXT NOT NULL DEFAULT 'SMK Negeri 1',
  npsn             TEXT NOT NULL DEFAULT '12345678',
  address          TEXT NOT NULL DEFAULT '',
  phone            TEXT NOT NULL DEFAULT '',
  email            TEXT NOT NULL DEFAULT '',
  website          TEXT NOT NULL DEFAULT '',
  principal_name   TEXT NOT NULL DEFAULT '',
  academic_year    TEXT NOT NULL DEFAULT '2025/2026',
  active_semester  TEXT NOT NULL DEFAULT 'Ganjil' CHECK (active_semester IN ('Ganjil','Genap')),
  logo_url         TEXT,
  grading_weights  JSONB NOT NULL DEFAULT '{"assignments":40,"quizzes":30,"exams":30}'
);

-- ============================================================
-- ROW LEVEL SECURITY: Buka akses untuk anon key (mode demo)
-- Catatan: Untuk produksi, perketat RLS ini
-- ============================================================
ALTER TABLE public.profiles           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classrooms         ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects           ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teaching_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions        ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes            ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grade_records      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements      ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_progress  ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_settings    ENABLE ROW LEVEL SECURITY;

-- Policy: izinkan semua operasi via anon key (buka akses penuh)
-- Ini diperlukan karena app tidak pakai Supabase Auth
CREATE POLICY "allow_all" ON public.profiles           FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON public.departments        FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON public.classrooms         FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON public.subjects           FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON public.teaching_materials FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON public.assignments        FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON public.submissions        FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON public.quizzes            FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON public.quiz_attempts      FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON public.grade_records      FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON public.announcements      FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON public.learning_progress  FOR ALL TO anon USING (true) WITH CHECK (true);
CREATE POLICY "allow_all" ON public.school_settings    FOR ALL TO anon USING (true) WITH CHECK (true);
