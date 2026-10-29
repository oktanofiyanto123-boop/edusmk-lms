/**
 * supabase-service.ts
 * Semua fungsi database Supabase untuk EduSMK LMS
 * Dipakai oleh store.tsx sebagai pengganti localStorage
 */
import { createClient } from './client';
import type {
  UserProfile,
  ClassRoom,
  Subject,
  TeachingMaterial,
  Assignment,
  Submission,
  Quiz,
  QuizAttempt,
  GradeRecord,
  Announcement,
  LearningProgress,
  SchoolSettings,
} from '../types';

// ── helpers ──────────────────────────────────────────────────────────────────

function sb() {
  return createClient();
}

// ── PROFILES ─────────────────────────────────────────────────────────────────

export async function fetchProfiles(): Promise<UserProfile[]> {
  const { data, error } = await sb().from('profiles').select('*').order('created_at', { ascending: true });
  if (error) throw error;
  return (data || []).map(dbToProfile);
}

export async function insertProfile(profile: Omit<UserProfile, 'id' | 'created_at'>): Promise<UserProfile> {
  const row = profileToDb(profile);
  const { data, error } = await sb().from('profiles').insert(row).select().single();
  if (error) throw error;
  return dbToProfile(data);
}

export async function updateProfile(id: string, updates: Partial<UserProfile>): Promise<void> {
  const row: Record<string, unknown> = {};
  if (updates.full_name !== undefined) row.full_name = updates.full_name;
  if (updates.email !== undefined) row.email = updates.email;
  if (updates.phone !== undefined) row.phone = updates.phone;
  if (updates.avatar_url !== undefined) row.avatar_url = updates.avatar_url;
  if (updates.department_id !== undefined) row.department_id = updates.department_id;
  if (updates.department_name !== undefined) row.department_name = updates.department_name;
  if (updates.class_id !== undefined) row.class_id = updates.class_id;
  if (updates.class_name !== undefined) row.class_name = updates.class_name;
  if (updates.status !== undefined) row.status = updates.status;
  if (updates.password !== undefined) row.password_hash = updates.password;
  if (updates.nisn_nip !== undefined) row.nisn_nip = updates.nisn_nip;
  row.updated_at = new Date().toISOString();
  const { error } = await sb().from('profiles').update(row).eq('id', id);
  if (error) throw error;
}

export async function deleteProfile(id: string): Promise<void> {
  const { error } = await sb().from('profiles').delete().eq('id', id);
  if (error) throw error;
}

export async function changeProfilePassword(id: string, newPassword: string): Promise<void> {
  const { error } = await sb().from('profiles').update({ password_hash: newPassword, updated_at: new Date().toISOString() }).eq('id', id);
  if (error) throw error;
}

function dbToProfile(row: Record<string, unknown>): UserProfile {
  return {
    id: row.id as string,
    email: (row.email as string) || undefined,
    full_name: row.full_name as string,
    role: row.role as UserProfile['role'],
    nisn_nip: (row.nisn_nip as string) || '',
    password: (row.password_hash as string) || (row.role === 'siswa' ? 'siswa123' : row.role === 'guru' ? 'guru123' : 'admin123'),
    phone: (row.phone as string) || undefined,
    avatar_url: (row.avatar_url as string) || undefined,
    department_id: (row.department_id as string) || undefined,
    department_name: (row.department_name as string) || undefined,
    class_id: (row.class_id as string) || undefined,
    class_name: (row.class_name as string) || undefined,
    status: (row.status as UserProfile['status']) || 'aktif',
    created_at: row.created_at as string,
    updated_at: (row.updated_at as string) || undefined,
  };
}

function profileToDb(p: Omit<UserProfile, 'id' | 'created_at'>) {
  return {
    email: p.email || null,
    full_name: p.full_name,
    role: p.role,
    nisn_nip: p.nisn_nip || '',
    password_hash: p.password || (p.role === 'siswa' ? 'siswa123' : p.role === 'guru' ? 'guru123' : 'admin123'),
    phone: p.phone || null,
    avatar_url: p.avatar_url || null,
    department_id: p.department_id || null,
    department_name: p.department_name || null,
    class_id: p.class_id || null,
    class_name: p.class_name || null,
    status: p.status || 'aktif',
  };
}

// ── CLASSROOMS ───────────────────────────────────────────────────────────────

export async function fetchClassrooms(): Promise<ClassRoom[]> {
  const { data, error } = await sb().from('classrooms').select('*').order('name');
  if (error) throw error;
  return (data || []).map((r) => ({
    id: r.id,
    name: r.name,
    grade_level: r.grade_level as 10 | 11 | 12,
    department_id: r.department_id || '',
    department_name: r.department_name || undefined,
    academic_year: r.academic_year || '2025/2026',
    teacher_id: r.teacher_id || '',
    homeroom_teacher: r.homeroom_teacher || undefined,
    student_count: r.student_count || 0,
  }));
}

export async function insertClassroom(cls: Omit<ClassRoom, 'id'>): Promise<ClassRoom> {
  const { data, error } = await sb().from('classrooms').insert(cls).select().single();
  if (error) throw error;
  return data as ClassRoom;
}

export async function updateClassroom(id: string, updates: Partial<ClassRoom>): Promise<void> {
  const { error } = await sb().from('classrooms').update(updates).eq('id', id);
  if (error) throw error;
}

export async function deleteClassroom(id: string): Promise<void> {
  const { error } = await sb().from('classrooms').delete().eq('id', id);
  if (error) throw error;
}

// ── SUBJECTS ─────────────────────────────────────────────────────────────────

export async function fetchSubjects(): Promise<Subject[]> {
  const { data, error } = await sb().from('subjects').select('*').order('name');
  if (error) throw error;
  return (data || []) as Subject[];
}

export async function insertSubject(sub: Omit<Subject, 'id'>): Promise<Subject> {
  const { data, error } = await sb().from('subjects').insert(sub).select().single();
  if (error) throw error;
  return data as Subject;
}

export async function updateSubject(id: string, updates: Partial<Subject>): Promise<void> {
  const { error } = await sb().from('subjects').update(updates).eq('id', id);
  if (error) throw error;
}

export async function deleteSubject(id: string): Promise<void> {
  const { error } = await sb().from('subjects').delete().eq('id', id);
  if (error) throw error;
}

// ── TEACHING MATERIALS ────────────────────────────────────────────────────────

export async function fetchMaterials(): Promise<TeachingMaterial[]> {
  const { data, error } = await sb().from('teaching_materials').select('*').order('order_index');
  if (error) throw error;
  return (data || []).map((r) => ({
    ...r,
    learning_objectives: r.learning_objectives || [],
    subchapters: r.subchapters || [],
    attachments: r.attachments || [],
  })) as TeachingMaterial[];
}

export async function insertMaterial(mat: Omit<TeachingMaterial, 'id' | 'created_at' | 'updated_at'>): Promise<TeachingMaterial> {
  const { data, error } = await sb().from('teaching_materials').insert(mat).select().single();
  if (error) throw error;
  return data as TeachingMaterial;
}

export async function updateMaterial(id: string, updates: Partial<TeachingMaterial>): Promise<void> {
  const { error } = await sb().from('teaching_materials').update({ ...updates, updated_at: new Date().toISOString() }).eq('id', id);
  if (error) throw error;
}

export async function deleteMaterial(id: string): Promise<void> {
  const { error } = await sb().from('teaching_materials').delete().eq('id', id);
  if (error) throw error;
}

// ── ASSIGNMENTS ───────────────────────────────────────────────────────────────

export async function fetchAssignments(): Promise<Assignment[]> {
  const { data, error } = await sb().from('assignments').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map((r) => ({ ...r, rubric: r.rubric || [], attachments: r.attachments || [] })) as Assignment[];
}

export async function insertAssignment(asg: Omit<Assignment, 'id' | 'created_at'>): Promise<Assignment> {
  const { data, error } = await sb().from('assignments').insert(asg).select().single();
  if (error) throw error;
  return data as Assignment;
}

export async function updateAssignment(id: string, updates: Partial<Assignment>): Promise<void> {
  const { error } = await sb().from('assignments').update(updates).eq('id', id);
  if (error) throw error;
}

export async function deleteAssignment(id: string): Promise<void> {
  const { error } = await sb().from('assignments').delete().eq('id', id);
  if (error) throw error;
}

// ── SUBMISSIONS ───────────────────────────────────────────────────────────────

export async function fetchSubmissions(): Promise<Submission[]> {
  const { data, error } = await sb().from('submissions').select('*').order('submitted_at', { ascending: false });
  if (error) throw error;
  return (data || []) as Submission[];
}

export async function upsertSubmission(subm: Omit<Submission, 'id' | 'submitted_at' | 'status'>): Promise<Submission> {
  const row = {
    ...subm,
    submitted_at: new Date().toISOString(),
    status: 'sudah_dikumpulkan' as const,
  };
  const { data, error } = await sb()
    .from('submissions')
    .upsert(row, { onConflict: 'assignment_id,student_id' })
    .select()
    .single();
  if (error) throw error;
  return data as Submission;
}

export async function gradeSubmissionDb(
  id: string,
  score: number,
  feedback: string,
  gradedBy: string
): Promise<void> {
  const { error } = await sb()
    .from('submissions')
    .update({
      score,
      feedback,
      graded_at: new Date().toISOString(),
      graded_by: gradedBy,
      status: 'sudah_dinilai',
    })
    .eq('id', id);
  if (error) throw error;
}

// ── QUIZZES ───────────────────────────────────────────────────────────────────

export async function fetchQuizzes(): Promise<Quiz[]> {
  const { data, error } = await sb().from('quizzes').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []).map((r) => ({ ...r, questions: r.questions || [] })) as Quiz[];
}

export async function insertQuiz(quiz: Omit<Quiz, 'id' | 'created_at'>): Promise<Quiz> {
  const { data, error } = await sb().from('quizzes').insert(quiz).select().single();
  if (error) throw error;
  return data as Quiz;
}

export async function deleteQuiz(id: string): Promise<void> {
  const { error } = await sb().from('quizzes').delete().eq('id', id);
  if (error) throw error;
}

// ── QUIZ ATTEMPTS ─────────────────────────────────────────────────────────────

export async function fetchQuizAttempts(): Promise<QuizAttempt[]> {
  const { data, error } = await sb().from('quiz_attempts').select('*').order('completed_at', { ascending: false });
  if (error) throw error;
  return (data || []) as QuizAttempt[];
}

export async function insertQuizAttempt(attempt: Omit<QuizAttempt, 'id' | 'completed_at'>): Promise<QuizAttempt> {
  const row = { ...attempt, completed_at: new Date().toISOString() };
  const { data, error } = await sb().from('quiz_attempts').insert(row).select().single();
  if (error) throw error;
  return data as QuizAttempt;
}

// ── GRADE RECORDS ─────────────────────────────────────────────────────────────

export async function fetchGrades(): Promise<GradeRecord[]> {
  const { data, error } = await sb().from('grade_records').select('*').order('student_name');
  if (error) throw error;
  return (data || []) as GradeRecord[];
}

export async function upsertGrade(grade: Partial<GradeRecord> & { student_id: string; subject_id: string }): Promise<void> {
  const { error } = await sb()
    .from('grade_records')
    .upsert({ ...grade, updated_at: new Date().toISOString() }, { onConflict: 'student_id,subject_id' });
  if (error) throw error;
}

// ── ANNOUNCEMENTS ─────────────────────────────────────────────────────────────

export async function fetchAnnouncements(): Promise<Announcement[]> {
  const { data, error } = await sb().from('announcements').select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return (data || []) as Announcement[];
}

export async function insertAnnouncement(ann: Omit<Announcement, 'id' | 'created_at'>): Promise<Announcement> {
  const { data, error } = await sb().from('announcements').insert(ann).select().single();
  if (error) throw error;
  return data as Announcement;
}

export async function deleteAnnouncement(id: string): Promise<void> {
  const { error } = await sb().from('announcements').delete().eq('id', id);
  if (error) throw error;
}

// ── LEARNING PROGRESS ─────────────────────────────────────────────────────────

export async function fetchLearningProgress(): Promise<LearningProgress[]> {
  const { data, error } = await sb().from('learning_progress').select('*');
  if (error) throw error;
  return (data || []) as LearningProgress[];
}

export async function upsertLearningProgress(studentId: string, materialId: string, isCompleted: boolean): Promise<void> {
  const { error } = await sb()
    .from('learning_progress')
    .upsert(
      {
        student_id: studentId,
        material_id: materialId,
        is_completed: isCompleted,
        completed_at: isCompleted ? new Date().toISOString() : null,
      },
      { onConflict: 'student_id,material_id' }
    );
  if (error) throw error;
}

// ── SCHOOL SETTINGS ───────────────────────────────────────────────────────────

export async function fetchSchoolSettings(): Promise<SchoolSettings | null> {
  const { data, error } = await sb().from('school_settings').select('*').single();
  if (error && error.code !== 'PGRST116') throw error;
  if (!data) return null;
  return {
    ...data,
    grading_weights: data.grading_weights || { assignments: 40, quizzes: 30, exams: 30 },
  } as SchoolSettings;
}

export async function upsertSchoolSettings(settings: Partial<SchoolSettings>): Promise<void> {
  const { error } = await sb()
    .from('school_settings')
    .upsert({ id: 'settings-1', ...settings });
  if (error) throw error;
}
