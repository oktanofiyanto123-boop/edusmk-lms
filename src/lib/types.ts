export type UserRole = 'admin' | 'guru' | 'siswa';

export type UserStatus = 'aktif' | 'nonaktif';

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  nisn_nip: string;
  phone?: string;
  avatar_url?: string;
  department_id?: string;
  department_name?: string;
  class_id?: string;
  class_name?: string;
  status: UserStatus;
  created_at: string;
  updated_at?: string;
}

export interface Department {
  id: string;
  code: string;
  name: string;
  description: string;
  icon?: string;
  head_of_department?: string;
  total_students?: number;
}

export interface ClassRoom {
  id: string;
  name: string;
  grade_level: 10 | 11 | 12;
  department_id: string;
  department_name?: string;
  academic_year: string;
  teacher_id: string;
  homeroom_teacher?: string;
  student_count?: number;
}

export interface ClassMember {
  id: string;
  class_id: string;
  student_id: string;
  student?: UserProfile;
  joined_at: string;
}

export interface Subject {
  id: string;
  code: string;
  name: string;
  department_id?: string;
  department_name?: string;
  description?: string;
  hours_per_week: number;
}

export interface TeacherSubject {
  id: string;
  teacher_id: string;
  teacher_name?: string;
  subject_id: string;
  subject_name?: string;
  class_id: string;
  class_name?: string;
}

export interface SubChapter {
  id: string;
  title: string;
  content: string;
}

export interface MaterialAttachment {
  id: string;
  material_id?: string;
  file_name: string;
  file_url: string;
  file_type: 'pdf' | 'image' | 'doc' | 'video' | 'archive' | 'other';
  file_size: string;
}

export type PublicationStatus = 'draft' | 'published' | 'archived';

export interface TeachingMaterial {
  id: string;
  subject_id: string;
  subject_name?: string;
  class_id: string;
  class_name?: string;
  teacher_id: string;
  teacher_name?: string;
  title: string;
  slug: string;
  description: string;
  learning_objectives?: string[];
  content: string;
  subchapters?: SubChapter[];
  status: PublicationStatus;
  youtube_url?: string;
  attachments?: MaterialAttachment[];
  order_index: number;
  created_at: string;
  updated_at: string;
}

export type SubmissionType = 'text' | 'file' | 'both';
export type AssignmentStatus = 'draft' | 'published' | 'closed';
export type StudentSubmissionStatus = 'belum_dikerjakan' | 'draft' | 'sudah_dikumpulkan' | 'terlambat' | 'sudah_dinilai';

export interface RubricItem {
  id: string;
  criteria: string;
  weight: number;
}

export interface Assignment {
  id: string;
  subject_id: string;
  subject_name?: string;
  class_id: string;
  class_name?: string;
  teacher_id: string;
  teacher_name?: string;
  title: string;
  description: string;
  instructions: string;
  start_date: string;
  due_date: string;
  submission_type: SubmissionType;
  max_score: number;
  weight: number;
  status: AssignmentStatus;
  rubric?: RubricItem[];
  attachments?: MaterialAttachment[];
  submitted_count?: number;
  total_students?: number;
  created_at: string;
}

export interface Submission {
  id: string;
  assignment_id: string;
  assignment_title?: string;
  student_id: string;
  student_name: string;
  student_nisn: string;
  student_avatar?: string;
  content?: string;
  file_url?: string;
  file_name?: string;
  file_size?: string;
  submitted_at: string;
  status: StudentSubmissionStatus;
  score?: number;
  feedback?: string;
  graded_at?: string;
  graded_by?: string;
}

export type QuestionType = 'multiple_choice' | 'true_false' | 'short_answer' | 'essay';

export interface QuizQuestion {
  id: string;
  quiz_id: string;
  question_text: string;
  question_type: QuestionType;
  options?: string[];
  correct_answer?: string; // Hidden on client for students
  explanation?: string;
  points: number;
  order_index: number;
}

export interface Quiz {
  id: string;
  subject_id: string;
  subject_name?: string;
  class_id: string;
  class_name?: string;
  teacher_id: string;
  teacher_name?: string;
  title: string;
  instructions: string;
  duration_minutes: number;
  max_attempts: number;
  pass_score: number;
  status: PublicationStatus;
  due_date: string;
  question_count: number;
  questions?: QuizQuestion[];
  created_at: string;
}

export interface QuizAttempt {
  id: string;
  quiz_id: string;
  quiz_title?: string;
  student_id: string;
  student_name: string;
  started_at: string;
  completed_at?: string;
  score?: number;
  max_score: number;
  is_passed?: boolean;
  answers: Record<string, string>;
  status: 'in_progress' | 'submitted' | 'graded';
}

export interface GradeRecord {
  id: string;
  student_id: string;
  student_name: string;
  student_nisn: string;
  class_id: string;
  class_name: string;
  subject_id: string;
  subject_name: string;
  assignment_score: number;
  quiz_score: number;
  exam_score: number;
  final_score: number;
  letter_grade: 'A' | 'B' | 'C' | 'D' | 'E';
  status_ketuntasan: 'Tuntas' | 'Belum Tuntas';
  notes?: string;
  updated_at: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  author_id: string;
  author_name: string;
  author_role: UserRole;
  target_role: 'all' | 'guru' | 'siswa';
  class_id?: string;
  class_name?: string;
  priority: 'normal' | 'penting' | 'darurat';
  is_pinned: boolean;
  created_at: string;
}

export interface LearningProgress {
  id: string;
  student_id: string;
  material_id: string;
  is_completed: boolean;
  completed_at?: string;
}

export interface SchoolSettings {
  id: string;
  school_name: string;
  npsn: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  principal_name: string;
  academic_year: string;
  active_semester: 'Ganjil' | 'Genap';
  logo_url?: string;
  grading_weights: {
    assignments: number;
    quizzes: number;
    exams: number;
  };
}
