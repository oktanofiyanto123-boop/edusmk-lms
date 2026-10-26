-- ==============================================================================
-- EDUSMK LMS - DATABASE INITIALIZATION & MIGRATION SCRIPT
-- PostgreSQL / Supabase Schema with Row Level Security (RLS)
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (Linked with Supabase auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL UNIQUE,
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('admin', 'guru', 'siswa')),
    nisn_nip TEXT,
    phone TEXT,
    avatar_url TEXT,
    department_id UUID,
    class_id UUID,
    status TEXT NOT NULL DEFAULT 'aktif' CHECK (status IN ('aktif', 'nonaktif')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. DEPARTMENTS TABLE (Jurusan SMK: ATPH, TE, DKV, dll.)
CREATE TABLE IF NOT EXISTS public.departments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    description TEXT,
    icon TEXT,
    head_of_department TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. CLASSES TABLE (Kelas: X, XI, XII)
CREATE TABLE IF NOT EXISTS public.classes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    grade_level SMALLINT NOT NULL CHECK (grade_level IN (10, 11, 12)),
    department_id UUID REFERENCES public.departments(id) ON DELETE RESTRICT,
    academic_year TEXT NOT NULL DEFAULT '2026/2027',
    teacher_id UUID REFERENCES public.profiles(id) ON DELETE SET NULL, -- Wali Kelas
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Add foreign key constraint back to profiles
ALTER TABLE public.profiles 
    ADD CONSTRAINT fk_profile_dept FOREIGN KEY (department_id) REFERENCES public.departments(id) ON DELETE SET NULL,
    ADD CONSTRAINT fk_profile_class FOREIGN KEY (class_id) REFERENCES public.classes(id) ON DELETE SET NULL;

-- 4. CLASS MEMBERS TABLE
CREATE TABLE IF NOT EXISTS public.class_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    joined_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_class_student UNIQUE (class_id, student_id)
);

-- 5. SUBJECTS TABLE (Mata Pelajaran)
CREATE TABLE IF NOT EXISTS public.subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    department_id UUID REFERENCES public.departments(id) ON DELETE SET NULL,
    description TEXT,
    hours_per_week SMALLINT NOT NULL DEFAULT 4,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 6. TEACHER SUBJECTS (Pengampu Mapel per Kelas)
CREATE TABLE IF NOT EXISTS public.teacher_subjects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    CONSTRAINT uq_teacher_sub_class UNIQUE (teacher_id, subject_id, class_id)
);

-- 7. TEACHING MATERIALS TABLE (Materi Pembelajaran)
CREATE TABLE IF NOT EXISTS public.teaching_materials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    slug TEXT NOT NULL,
    description TEXT,
    content TEXT NOT NULL,
    subchapters JSONB DEFAULT '[]'::jsonb,
    learning_objectives JSONB DEFAULT '[]'::jsonb,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    youtube_url TEXT,
    order_index INTEGER NOT NULL DEFAULT 1,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 8. MATERIAL ATTACHMENTS TABLE
CREATE TABLE IF NOT EXISTS public.material_attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    material_id UUID NOT NULL REFERENCES public.teaching_materials(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_url TEXT NOT NULL,
    file_type TEXT NOT NULL,
    file_size TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 9. ASSIGNMENTS TABLE (Tugas Siswa)
CREATE TABLE IF NOT EXISTS public.assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    instructions TEXT NOT NULL,
    start_date TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    due_date TIMESTAMPTZ NOT NULL,
    submission_type TEXT NOT NULL DEFAULT 'both' CHECK (submission_type IN ('text', 'file', 'both')),
    max_score NUMERIC(5,2) NOT NULL DEFAULT 100.00,
    weight NUMERIC(5,2) NOT NULL DEFAULT 20.00,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'closed')),
    rubric JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 10. SUBMISSIONS TABLE (Pengumpulan Tugas)
CREATE TABLE IF NOT EXISTS public.submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    assignment_id UUID NOT NULL REFERENCES public.assignments(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    content TEXT,
    file_url TEXT,
    file_name TEXT,
    file_size TEXT,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    status TEXT NOT NULL DEFAULT 'belum_dikerjakan' CHECK (status IN ('belum_dikerjakan', 'draft', 'sudah_dikumpulkan', 'terlambat', 'sudah_dinilai')),
    score NUMERIC(5,2),
    feedback TEXT,
    graded_at TIMESTAMPTZ,
    graded_by UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    CONSTRAINT uq_assignment_student UNIQUE (assignment_id, student_id)
);

-- 11. QUIZZES TABLE (Kuis)
CREATE TABLE IF NOT EXISTS public.quizzes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    teacher_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    instructions TEXT,
    duration_minutes INTEGER NOT NULL DEFAULT 30,
    max_attempts INTEGER NOT NULL DEFAULT 1,
    pass_score NUMERIC(5,2) NOT NULL DEFAULT 75.00,
    status TEXT NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'closed')),
    due_date TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 12. QUIZ QUESTIONS TABLE (Soal Kuis)
CREATE TABLE IF NOT EXISTS public.quiz_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type TEXT NOT NULL DEFAULT 'multiple_choice' CHECK (question_type IN ('multiple_choice', 'true_false', 'short_answer', 'essay')),
    options JSONB,
    correct_answer TEXT, -- Protected: not exposed to students
    explanation TEXT,
    points NUMERIC(5,2) NOT NULL DEFAULT 10.00,
    order_index INTEGER NOT NULL DEFAULT 1
);

-- 13. QUIZ ATTEMPTS TABLE (Pengerjaan Kuis)
CREATE TABLE IF NOT EXISTS public.quiz_attempts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    quiz_id UUID NOT NULL REFERENCES public.quizzes(id) ON DELETE CASCADE,
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    started_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    completed_at TIMESTAMPTZ,
    score NUMERIC(5,2),
    max_score NUMERIC(5,2) NOT NULL DEFAULT 100.00,
    is_passed BOOLEAN DEFAULT FALSE,
    answers JSONB DEFAULT '{}'::jsonb,
    status TEXT NOT NULL DEFAULT 'in_progress' CHECK (status IN ('in_progress', 'submitted', 'graded'))
);

-- 14. GRADES TABLE (Rekap Nilai)
CREATE TABLE IF NOT EXISTS public.grades (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    class_id UUID NOT NULL REFERENCES public.classes(id) ON DELETE CASCADE,
    subject_id UUID NOT NULL REFERENCES public.subjects(id) ON DELETE CASCADE,
    assignment_score NUMERIC(5,2) DEFAULT 0,
    quiz_score NUMERIC(5,2) DEFAULT 0,
    exam_score NUMERIC(5,2) DEFAULT 0,
    final_score NUMERIC(5,2) DEFAULT 0,
    letter_grade VARCHAR(2) DEFAULT 'E',
    status_ketuntasan TEXT NOT NULL DEFAULT 'Belum Tuntas' CHECK (status_ketuntasan IN ('Tuntas', 'Belum Tuntas')),
    notes TEXT,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    CONSTRAINT uq_student_class_sub UNIQUE (student_id, class_id, subject_id)
);

-- 15. ANNOUNCEMENTS TABLE (Pengumuman)
CREATE TABLE IF NOT EXISTS public.announcements (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    author_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    target_role TEXT NOT NULL DEFAULT 'all' CHECK (target_role IN ('all', 'guru', 'siswa')),
    class_id UUID REFERENCES public.classes(id) ON DELETE CASCADE,
    priority TEXT NOT NULL DEFAULT 'normal' CHECK (priority IN ('normal', 'penting', 'darurat')),
    is_pinned BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 16. LEARNING PROGRESS TABLE (Progres Siswa)
CREATE TABLE IF NOT EXISTS public.learning_progress (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    student_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
    material_id UUID NOT NULL REFERENCES public.teaching_materials(id) ON DELETE CASCADE,
    is_completed BOOLEAN NOT NULL DEFAULT FALSE,
    completed_at TIMESTAMPTZ,
    CONSTRAINT uq_student_material UNIQUE (student_id, material_id)
);

-- 17. SCHOOL SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.school_settings (
    id TEXT PRIMARY KEY DEFAULT 'school-main',
    school_name TEXT NOT NULL,
    npsn TEXT NOT NULL,
    address TEXT,
    phone TEXT,
    email TEXT,
    website TEXT,
    principal_name TEXT,
    academic_year TEXT NOT NULL DEFAULT '2026/2027',
    active_semester TEXT NOT NULL DEFAULT 'Ganjil',
    logo_url TEXT,
    grading_weights JSONB DEFAULT '{"assignments": 40, "quizzes": 30, "exams": 30}'::jsonb,
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- ==============================================================================
-- INDEXES FOR PERFORMANCE
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_classes_dept ON public.classes(department_id);
CREATE INDEX IF NOT EXISTS idx_teaching_materials_class ON public.teaching_materials(class_id);
CREATE INDEX IF NOT EXISTS idx_teaching_materials_sub ON public.teaching_materials(subject_id);
CREATE INDEX IF NOT EXISTS idx_assignments_class ON public.assignments(class_id);
CREATE INDEX IF NOT EXISTS idx_submissions_assignment ON public.submissions(assignment_id);
CREATE INDEX IF NOT EXISTS idx_submissions_student ON public.submissions(student_id);
CREATE INDEX IF NOT EXISTS idx_quizzes_class ON public.quizzes(class_id);
CREATE INDEX IF NOT EXISTS idx_quiz_attempts_student ON public.quiz_attempts(student_id);
CREATE INDEX IF NOT EXISTS idx_grades_student ON public.grades(student_id);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.departments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.class_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teacher_subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teaching_materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.material_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quizzes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_questions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quiz_attempts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.grades ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.learning_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.school_settings ENABLE ROW LEVEL SECURITY;

-- Helper function to check user role
CREATE OR REPLACE FUNCTION public.current_user_role()
RETURNS TEXT AS $$
  SELECT role FROM public.profiles WHERE id = auth.uid();
$$ LANGUAGE sql STABLE SECURITY DEFINER;

-- Profiles: Users can view their own profile, Admins can view all, Teachers can view their students
CREATE POLICY "Profiles viewable by authenticated users"
ON public.profiles FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Profiles updatable by user or admin"
ON public.profiles FOR UPDATE
TO authenticated
USING (auth.uid() = id OR public.current_user_role() = 'admin');

-- Teaching Materials: Published materials viewable by students in class, draft only by author or admin
CREATE POLICY "Teaching materials viewable by students in class or teachers"
ON public.teaching_materials FOR SELECT
TO authenticated
USING (
    status = 'published' OR 
    teacher_id = auth.uid() OR 
    public.current_user_role() = 'admin'
);

CREATE POLICY "Teaching materials manageable by teachers and admin"
ON public.teaching_materials FOR ALL
TO authenticated
USING (
    teacher_id = auth.uid() OR 
    public.current_user_role() = 'admin'
);

-- Assignments: Published viewable by class, managed by teachers/admin
CREATE POLICY "Assignments viewable by class"
ON public.assignments FOR SELECT
TO authenticated
USING (
    status = 'published' OR 
    teacher_id = auth.uid() OR 
    public.current_user_role() = 'admin'
);

CREATE POLICY "Assignments manageable by teacher and admin"
ON public.assignments FOR ALL
TO authenticated
USING (
    teacher_id = auth.uid() OR 
    public.current_user_role() = 'admin'
);

-- Submissions: Students see and submit their own, Teachers of class see and grade
CREATE POLICY "Submissions viewable by owner or teacher/admin"
ON public.submissions FOR SELECT
TO authenticated
USING (
    student_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM public.assignments a WHERE a.id = submissions.assignment_id AND a.teacher_id = auth.uid()) OR
    public.current_user_role() = 'admin'
);

CREATE POLICY "Submissions insertable by student"
ON public.submissions FOR INSERT
TO authenticated
WITH CHECK (student_id = auth.uid());

CREATE POLICY "Submissions updatable by student or teacher"
ON public.submissions FOR UPDATE
TO authenticated
USING (
    student_id = auth.uid() OR 
    EXISTS (SELECT 1 FROM public.assignments a WHERE a.id = submissions.assignment_id AND a.teacher_id = auth.uid()) OR
    public.current_user_role() = 'admin'
);

-- Quizzes: Quiz questions without revealing correct_answer to students
CREATE POLICY "Quizzes viewable by class"
ON public.quizzes FOR SELECT
TO authenticated
USING (
    status = 'published' OR 
    teacher_id = auth.uid() OR 
    public.current_user_role() = 'admin'
);

CREATE POLICY "Quiz questions viewable by class"
ON public.quiz_questions FOR SELECT
TO authenticated
USING (true);

-- Grades: Student views own grade, Teacher updates class grade, Admin views all
CREATE POLICY "Grades viewable by student or teacher"
ON public.grades FOR SELECT
TO authenticated
USING (
    student_id = auth.uid() OR 
    public.current_user_role() IN ('guru', 'admin')
);

CREATE POLICY "Grades manageable by teacher and admin"
ON public.grades FOR ALL
TO authenticated
USING (
    public.current_user_role() IN ('guru', 'admin')
);

-- Trigger to sync auth.users with public.profiles on new registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role, status)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Pengguna Baru'),
    COALESCE(NEW.raw_user_meta_data->>'role', 'siswa'),
    'aktif'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ==============================================================================
-- STORAGE BUCKETS SETUP (Materials, Submissions, Avatars)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES 
    ('materials', 'materials', true),
    ('submissions', 'submissions', false),
    ('avatars', 'avatars', true)
ON CONFLICT (id) DO NOTHING;
