import {
  UserProfile,
  Department,
  ClassRoom,
  Subject,
  TeachingMaterial,
  Assignment,
  Submission,
  Quiz,
  GradeRecord,
  Announcement,
  SchoolSettings,
} from './types';

export const INITIAL_SCHOOL_SETTINGS: SchoolSettings = {
  id: 'school-main',
  school_name: 'SMK Negeri 1 Digital Nusantara',
  npsn: '20109988',
  address: 'Jl. Teknokrat Cemerlang No. 45, Kawasan Pendidikan Kejuruan, Jakarta',
  phone: '(021) 7890-1234',
  email: 'info@edusmk.sch.id',
  website: 'https://edusmk.sch.id',
  principal_name: 'Dr. Ir. H. Bambang Sudarmono, M.T.',
  academic_year: '2026/2027',
  active_semester: 'Ganjil',
  logo_url: '/logo-smk.png',
  grading_weights: {
    assignments: 40,
    quizzes: 30,
    exams: 30,
  },
};

export const INITIAL_DEPARTMENTS: Department[] = [
  {
    id: 'dept-rpl',
    code: 'RPL',
    name: 'Rekayasa Perangkat Lunak',
    description: 'Kompetensi keahlian berfokus pada pengembangan aplikasi web, mobile, cloud computing, dan database engineering modern.',
    icon: 'Code2',
    head_of_department: 'Budi Santoso, S.Kom., M.T.',
    total_students: 144,
  },
  {
    id: 'dept-tkj',
    code: 'TKJ',
    name: 'Teknik Komputer dan Jaringan',
    description: 'Keahlian dalam instalasi infrastruktur jaringan komputer, server enterprise, keamanan siber, dan mikrotik/cisco routing.',
    icon: 'Network',
    head_of_department: 'Siti Nurhaliza, S.T.',
    total_students: 138,
  },
  {
    id: 'dept-dkv',
    code: 'DKV',
    name: 'Desain Komunikasi Visual',
    description: 'Keahlian dalam seni digital, UI/UX design, visual branding, motion graphics, dan animasi kreatif untuk industri multimedia.',
    icon: 'Palette',
    head_of_department: 'Hendra Wijaya, S.Ds.',
    total_students: 120,
  },
  {
    id: 'dept-sija',
    code: 'SIJA',
    name: 'Sistem Informatika, Jaringan, dan Aplikasi',
    description: 'Program kejuruan 4 tahun mengintegrasikan automasi cloud, DevOps, IoT, dan sistem enterprise terdistribusi.',
    icon: 'Cpu',
    head_of_department: 'Eko Prasetyo, M.Kom.',
    total_students: 96,
  },
];

export const INITIAL_CLASSES: ClassRoom[] = [
  {
    id: 'class-xii-rpl-1',
    name: 'XII RPL 1',
    grade_level: 12,
    department_id: 'dept-rpl',
    department_name: 'Rekayasa Perangkat Lunak',
    academic_year: '2026/2027',
    teacher_id: 'user-guru-1',
    homeroom_teacher: 'Budi Santoso, S.Kom.',
    student_count: 36,
  },
  {
    id: 'class-xii-rpl-2',
    name: 'XII RPL 2',
    grade_level: 12,
    department_id: 'dept-rpl',
    department_name: 'Rekayasa Perangkat Lunak',
    academic_year: '2026/2027',
    teacher_id: 'user-guru-1',
    homeroom_teacher: 'Budi Santoso, S.Kom.',
    student_count: 36,
  },
  {
    id: 'class-xii-tkj-1',
    name: 'XII TKJ 1',
    grade_level: 12,
    department_id: 'dept-tkj',
    department_name: 'Teknik Komputer dan Jaringan',
    academic_year: '2026/2027',
    teacher_id: 'user-guru-2',
    homeroom_teacher: 'Siti Nurhaliza, S.T.',
    student_count: 35,
  },
  {
    id: 'class-xii-dkv-1',
    name: 'XII DKV 1',
    grade_level: 12,
    department_id: 'dept-dkv',
    department_name: 'Desain Komunikasi Visual',
    academic_year: '2026/2027',
    teacher_id: 'user-guru-3',
    homeroom_teacher: 'Hendra Wijaya, S.Ds.',
    student_count: 34,
  },
];

export const INITIAL_USERS: UserProfile[] = [
  {
    id: 'user-admin-1',
    email: 'admin@edusmk.sch.id',
    full_name: 'Drs. H. Suryanto, M.Pd.',
    role: 'admin',
    nisn_nip: '197508121999031002',
    phone: '0812-3456-7890',
    avatar_url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80',
    status: 'aktif',
    created_at: '2026-01-10T08:00:00Z',
  },
  {
    id: 'user-guru-1',
    email: 'budi@edusmk.sch.id',
    full_name: 'Budi Santoso, S.Kom.',
    role: 'guru',
    nisn_nip: '198503152010011015',
    phone: '0813-9876-5432',
    avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    department_id: 'dept-rpl',
    department_name: 'Rekayasa Perangkat Lunak',
    class_id: 'class-xii-rpl-1',
    class_name: 'XII RPL 1',
    status: 'aktif',
    created_at: '2026-01-12T08:00:00Z',
  },
  {
    id: 'user-guru-2',
    email: 'siti@edusmk.sch.id',
    full_name: 'Siti Nurhaliza, S.T.',
    role: 'guru',
    nisn_nip: '198906202014022004',
    phone: '0815-5555-4433',
    avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    department_id: 'dept-tkj',
    department_name: 'Teknik Komputer dan Jaringan',
    class_id: 'class-xii-tkj-1',
    class_name: 'XII TKJ 1',
    status: 'aktif',
    created_at: '2026-01-15T08:00:00Z',
  },
  {
    id: 'user-guru-3',
    email: 'hendra@edusmk.sch.id',
    full_name: 'Hendra Wijaya, S.Ds.',
    role: 'guru',
    nisn_nip: '199104182018011009',
    phone: '0817-2233-4455',
    avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80',
    department_id: 'dept-dkv',
    department_name: 'Desain Komunikasi Visual',
    class_id: 'class-xii-dkv-1',
    class_name: 'XII DKV 1',
    status: 'aktif',
    created_at: '2026-01-20T08:00:00Z',
  },
  {
    id: 'user-siswa-1',
    email: 'ahmad@siswa.edusmk.sch.id',
    full_name: 'Ahmad Rizky Pratama',
    role: 'siswa',
    nisn_nip: '0067823412',
    phone: '0857-1122-3344',
    avatar_url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    department_id: 'dept-rpl',
    department_name: 'Rekayasa Perangkat Lunak',
    class_id: 'class-xii-rpl-1',
    class_name: 'XII RPL 1',
    status: 'aktif',
    created_at: '2026-02-01T08:00:00Z',
  },
  {
    id: 'user-siswa-2',
    email: 'rina@siswa.edusmk.sch.id',
    full_name: 'Rina Wulandari',
    role: 'siswa',
    nisn_nip: '0067823413',
    phone: '0858-2233-4455',
    avatar_url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    department_id: 'dept-rpl',
    department_name: 'Rekayasa Perangkat Lunak',
    class_id: 'class-xii-rpl-1',
    class_name: 'XII RPL 1',
    status: 'aktif',
    created_at: '2026-02-01T08:00:00Z',
  },
  {
    id: 'user-siswa-3',
    email: 'dimas@siswa.edusmk.sch.id',
    full_name: 'Dimas Setiawan',
    role: 'siswa',
    nisn_nip: '0067823414',
    phone: '0859-3344-5566',
    avatar_url: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&auto=format&fit=crop&q=80',
    department_id: 'dept-tkj',
    department_name: 'Teknik Komputer dan Jaringan',
    class_id: 'class-xii-tkj-1',
    class_name: 'XII TKJ 1',
    status: 'aktif',
    created_at: '2026-02-01T08:00:00Z',
  },
];

export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'sub-pwpb',
    code: 'C3-RPL-01',
    name: 'Pemrograman Web dan Perangkat Bergerak',
    department_id: 'dept-rpl',
    department_name: 'Rekayasa Perangkat Lunak',
    description: 'Materi kejuruan mencakup HTML5, CSS3, Modern JavaScript, React/Next.js, REST API, dan integrasi PostgreSQL Database.',
    hours_per_week: 8,
  },
  {
    id: 'sub-db',
    code: 'C3-RPL-02',
    name: 'Basis Data & SQL Enterprise',
    department_id: 'dept-rpl',
    department_name: 'Rekayasa Perangkat Lunak',
    description: 'Pemodelan ERD, normalisasi data, DDL/DML, indexing, relasi kompleks, store procedure, dan Row Level Security (RLS).',
    hours_per_week: 6,
  },
  {
    id: 'sub-aij',
    code: 'C3-TKJ-01',
    name: 'Administrasi Infrastruktur Jaringan',
    department_id: 'dept-tkj',
    department_name: 'Teknik Komputer dan Jaringan',
    description: 'Konfigurasi VLAN, trunking, inter-VLAN routing, OSPF, BGP, firewall filtering, dan manajemen bandwidth Mikrotik.',
    hours_per_week: 8,
  },
  {
    id: 'sub-uiux',
    code: 'C3-DKV-01',
    name: 'Desain Antarmuka Pengguna (UI/UX Design)',
    department_id: 'dept-dkv',
    department_name: 'Desain Komunikasi Visual',
    description: 'Prinsip desain antarmuka modern, typography, color harmony, wireframing, interactive prototyping di Figma, dan usability testing.',
    hours_per_week: 6,
  },
];

export const INITIAL_MATERIALS: TeachingMaterial[] = [
  {
    id: 'mat-01',
    subject_id: 'sub-pwpb',
    subject_name: 'Pemrograman Web dan Perangkat Bergerak',
    class_id: 'class-xii-rpl-1',
    class_name: 'XII RPL 1',
    teacher_id: 'user-guru-1',
    teacher_name: 'Budi Santoso, S.Kom.',
    title: 'Arsitektur Next.js App Router & Server Components',
    slug: 'arsitektur-nextjs-app-router',
    description: 'Memahami konsep dasar Server Components, Client Components, Server Actions, dan struktur folder App Router di Next.js terkini.',
    learning_objectives: [
      'Memahami perbedaan antara React Server Component (RSC) dan Client Component ("use client")',
      'Mampu menyusun arsitektur folder App Router dengan nested layout',
      'Mengimplementasikan pengambilan data asynchronous langsung di server component',
      'Menerapkan keamanan credential dan proteksi route dengan Middleware',
    ],
    content: `
### 1. Pengenalan App Router
Next.js App Router memperkenalkan paradigma baru dengan React Server Components (RSC). Secara default, semua komponen di dalam folder \`src/app\` adalah Server Components.

### 2. Mengapa Server Components Sangat Menguntungkan untuk SMK?
- **Zero Client-side Bundle**: Kode server, database driver, dan parsing tidak dikirimkan ke peramban siswa.
- **Akses Langsung ke Database**: Kita dapat memanggil query SQL atau Supabase langsung tanpa membocorkan rahasia kredensial.
- **Kinerja Optimal**: Halaman dirender lebih cepat, bahkan di koneksi internet seluler siswa.

\`\`\`tsx
// Contoh Server Component di Next.js App Router
export default async function DashboardPage() {
  const data = await getLmsStatistics();
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Dashboard Pembelajaran Siswa</h1>
      <p>Total Materi Aktif: {data.totalMaterials}</p>
    </div>
  );
}
\`\`\`

### 3. Kapan Menggunakan 'use client'?
Gunakan penanda \`'use client'\` hanya jika komponen membutuhkan:
1. State lokal (\`useState\`, \`useReducer\`)
2. Interaksi event pengguna seperti \`onClick\`, \`onChange\`
3. Lifecycle hooks (\`useEffect\`)
4. Akses API Browser (misalnya \`localStorage\`, \`navigator\`, window dimensions)
    `.trim(),
    subchapters: [
      {
        id: 'sub-1',
        title: 'Bab 1: Evolusi React Server Components (RSC)',
        content: 'Pembahasan mendalam bagaimana RSC memisahkan eksekusi server-side dari interaktivitas client-side untuk memangkas ukuran JavaScript bundle.',
      },
      {
        id: 'sub-2',
        title: 'Bab 2: Struktur Direktori, Layout, dan Routing Konvensi',
        content: 'Penjelasan hirarki file page.tsx, layout.tsx, loading.tsx, error.tsx, dan route.ts serta strategi navigasi SPA.',
      },
      {
        id: 'sub-3',
        title: 'Bab 3: Best Practice Optimasi Kinerja Web SMK',
        content: 'Langkah praktis kompresi gambar, caching strategi, dynamic font loading, dan responsivitas layar HP siswa.',
      },
    ],
    status: 'published',
    youtube_url: 'https://www.youtube.com/watch?v=wm5gMKuwSYk',
    attachments: [
      {
        id: 'att-1',
        material_id: 'mat-01',
        file_name: 'Modul_Praktikum_NextJS_AppRouter_SMK.pdf',
        file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        file_type: 'pdf',
        file_size: '2.4 MB',
      },
      {
        id: 'att-2',
        material_id: 'mat-01',
        file_name: 'Cheatsheet_Komponen_Server_vs_Client.png',
        file_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?w=800&auto=format&fit=crop&q=80',
        file_type: 'image',
        file_size: '850 KB',
      },
    ],
    order_index: 1,
    created_at: '2026-02-10T09:00:00Z',
    updated_at: '2026-02-12T14:30:00Z',
  },
  {
    id: 'mat-02',
    subject_id: 'sub-db',
    subject_name: 'Basis Data & SQL Enterprise',
    class_id: 'class-xii-rpl-1',
    class_name: 'XII RPL 1',
    teacher_id: 'user-guru-1',
    teacher_name: 'Budi Santoso, S.Kom.',
    title: 'Desain Skema PostgreSQL & Row Level Security (RLS)',
    slug: 'desain-skema-postgresql-rls',
    description: 'Penerapan foreign keys, indexing, dan kebijakan keamanan RLS pada database Supabase untuk sistem multi-tenant sekolah.',
    learning_objectives: [
      'Merancang relasi 1-to-many dan many-to-many yang konsisten',
      'Mengaktifkan RLS pada seluruh tabel sensitif',
      'Membuat kebijakan RLS berdasarkan auth.uid() dan peran pengguna',
    ],
    content: `
### Keamanan Database Tingkat Baris (RLS)
Pada aplikasi LMS sekolah, keamanan data siswa dan guru tidak boleh hanya bergantung pada filter di frontend. PostgreSQL menyediakan fitur **Row Level Security (RLS)** yang membatasi hak akses pada level engine database.

\`\`\`sql
-- Contoh Kebijakan RLS: Siswa hanya boleh melihat submission miliknya sendiri
CREATE POLICY "Siswa can view own submissions"
ON submissions FOR SELECT
USING (auth.uid() = student_id);
\`\`\`
    `.trim(),
    subchapters: [
      {
        id: 'sub-db-1',
        title: 'Bab 1: Relasi & Constraint PostgreSQL',
        content: 'Penggunaan FOREIGN KEY dengan ON DELETE CASCADE vs ON DELETE RESTRICT untuk mencegah data yatim.',
      },
      {
        id: 'sub-db-2',
        title: 'Bab 2: Implementasi Kebijakan RLS Multi-Role',
        content: 'Menuliskan ekspresi SQL policy untuk membedakan hak akses Admin, Guru pembina kelas, dan Siswa peserta didik.',
      },
    ],
    status: 'published',
    youtube_url: 'https://www.youtube.com/watch?v=Ow_Uzedfohk',
    attachments: [
      {
        id: 'att-3',
        material_id: 'mat-02',
        file_name: 'Panduan_RLS_PostgreSQL_EduSMK.pdf',
        file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        file_type: 'pdf',
        file_size: '1.8 MB',
      },
    ],
    order_index: 2,
    created_at: '2026-02-15T10:00:00Z',
    updated_at: '2026-02-15T10:00:00Z',
  },
];

export const INITIAL_ASSIGNMENTS: Assignment[] = [
  {
    id: 'asg-01',
    subject_id: 'sub-pwpb',
    subject_name: 'Pemrograman Web dan Perangkat Bergerak',
    class_id: 'class-xii-rpl-1',
    class_name: 'XII RPL 1',
    teacher_id: 'user-guru-1',
    teacher_name: 'Budi Santoso, S.Kom.',
    title: 'Tugas Proyek 01: Implementasi Halaman Dashboard Responsif',
    description: 'Buatlah halaman dashboard responsif menggunakan Next.js App Router, Tailwind CSS, dan komponen reusable.',
    instructions: `
1. Gunakan Next.js App Router dan TypeScript.
2. Buat tata letak grid responsif (1 kolom di HP, 2-3 kolom di laptop/desktop).
3. Tampilkan kartu statistik (Materi Selesai, Tugas Tertunda, Nilai Rata-rata).
4. Sediakan komponen visualisasi progres atau grafik aktivitas.
5. Kirimkan tautan repository GitHub dan file arsip ZIP atau screenshot hasil kerja.
    `.trim(),
    start_date: '2026-02-10T08:00:00Z',
    due_date: '2026-11-30T23:59:00Z',
    submission_type: 'both',
    max_score: 100,
    weight: 25,
    status: 'published',
    rubric: [
      { id: 'rub-1', criteria: 'Kelengkapan fitur & responsivitas layar', weight: 40 },
      { id: 'rub-2', criteria: 'Kerapian arsitektur kode & TypeScript type safety', weight: 35 },
      { id: 'rub-3', criteria: 'Estetika desain, konsistensi warna, dan UX', weight: 25 },
    ],
    submitted_count: 2,
    total_students: 36,
    created_at: '2026-02-10T08:30:00Z',
  },
  {
    id: 'asg-02',
    subject_id: 'sub-db',
    subject_name: 'Basis Data & SQL Enterprise',
    class_id: 'class-xii-rpl-1',
    class_name: 'XII RPL 1',
    teacher_id: 'user-guru-1',
    teacher_name: 'Budi Santoso, S.Kom.',
    title: 'Tugas Praktik 02: Perancangan Skema Database LMS & Skrip RLS',
    description: 'Rancanglah diagram relasi entitas (ERD) dan skrip SQL DDL untuk tabel pengguna, materi, tugas, dan nilai.',
    instructions: `
1. Rancang skema database normalisasi 3NF.
2. Tuliskan query migrasi SQL yang valid di PostgreSQL.
3. Terapkan RLS policy untuk keamanan data siswa.
4. Lampirkan file skrip SQL (.sql) atau dokumen PDF.
    `.trim(),
    start_date: '2026-02-15T08:00:00Z',
    due_date: '2026-12-05T23:59:00Z',
    submission_type: 'file',
    max_score: 100,
    weight: 25,
    status: 'published',
    rubric: [
      { id: 'rub-4', criteria: 'Normalisasi ERD & Konsistensi Relasi', weight: 50 },
      { id: 'rub-5', criteria: 'Validitas Skrip SQL & Efektivitas RLS', weight: 50 },
    ],
    submitted_count: 1,
    total_students: 36,
    created_at: '2026-02-15T08:30:00Z',
  },
];

export const INITIAL_SUBMISSIONS: Submission[] = [
  {
    id: 'subm-01',
    assignment_id: 'asg-01',
    assignment_title: 'Tugas Proyek 01: Implementasi Halaman Dashboard Responsif',
    student_id: 'user-siswa-1',
    student_name: 'Ahmad Rizky Pratama',
    student_nisn: '0067823412',
    student_avatar: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80',
    content: 'Selamat siang Pak Budi. Saya telah menyelesaikan pembuatan Dashboard LMS EduSMK menggunakan Next.js App Router, Tailwind CSS, dan Lucide Icons. Kode terstruktur dengan TypeScript ketat dan telah diuji responsif pada resolusi 375px (iPhone) hingga 1920px (Desktop Monitor). GitHub repo: https://github.com/ahmad-rizky/edusmk-dashboard',
    file_url: 'https://raw.githubusercontent.com/ahmad-rizky/edusmk-dashboard/main/docs/screenshot.png',
    file_name: 'Dokumentasi_Proyek_Dashboard_AhmadRizky.pdf',
    file_size: '3.2 MB',
    submitted_at: '2026-02-18T16:45:00Z',
    status: 'sudah_dinilai',
    score: 95,
    feedback: 'Luar biasa Ahmad! Tata letak grid sangat rapi, transisi halus, kode modular, dan penanganan TypeScript tanpa any. Tingkatkan sedikit kontras pada badge status saat dark mode.',
    graded_at: '2026-02-19T10:15:00Z',
    graded_by: 'Budi Santoso, S.Kom.',
  },
  {
    id: 'subm-02',
    assignment_id: 'asg-01',
    assignment_title: 'Tugas Proyek 01: Implementasi Halaman Dashboard Responsif',
    student_id: 'user-siswa-2',
    student_name: 'Rina Wulandari',
    student_nisn: '0067823413',
    student_avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    content: 'Tugas telah dikerjakan dengan menerapkan layout grid dan visual chart SVG. Tautan live demo: https://rina-lms.vercel.app',
    file_url: 'https://raw.githubusercontent.com/rina/lms/main/preview.png',
    file_name: 'LMS_Dashboard_RinaWulandari_XII_RPL_1.zip',
    file_size: '5.1 MB',
    submitted_at: '2026-02-19T09:20:00Z',
    status: 'sudah_dikumpulkan',
  },
];

export const INITIAL_QUIZZES: Quiz[] = [
  {
    id: 'quiz-01',
    subject_id: 'sub-pwpb',
    subject_name: 'Pemrograman Web dan Perangkat Bergerak',
    class_id: 'class-xii-rpl-1',
    class_name: 'XII RPL 1',
    teacher_id: 'user-guru-1',
    teacher_name: 'Budi Santoso, S.Kom.',
    title: 'Kuis Evaluasi Kompetensi: Next.js App Router & Full-Stack Architecture',
    instructions: 'Kuis terdiri dari 5 butir soal pilihan ganda dan analisa kode. Bacalah setiap pertanyaan dengan teliti sebelum memilih opsi. Durasi pengerjaan maksimal 20 menit.',
    duration_minutes: 20,
    max_attempts: 2,
    pass_score: 75,
    status: 'published',
    due_date: '2026-11-28T23:59:00Z',
    question_count: 5,
    questions: [
      {
        id: 'q-1',
        quiz_id: 'quiz-01',
        question_text: 'Secara default pada Next.js App Router, semua komponen di dalam direktori app dirender sebagai jenis komponen apa?',
        question_type: 'multiple_choice',
        options: [
          'Client-Side Only Component',
          'React Server Component (RSC)',
          'Static HTML Pure Template',
          'Service Worker Background Script',
        ],
        correct_answer: 'React Server Component (RSC)',
        explanation: 'Pada Next.js App Router, komponen bersifat Server Component secara bawaan kecuali diberikan direktif "use client".',
        points: 20,
        order_index: 1,
      },
      {
        id: 'q-2',
        quiz_id: 'quiz-01',
        question_text: 'Direktif apa yang wajib ditambahkan pada baris pertama file komponen jika ingin menggunakan hook useState atau useEffect?',
        question_type: 'multiple_choice',
        options: [
          "'use client'",
          "'use server'",
          "'use dynamic'",
          "'use state'",
        ],
        correct_answer: "'use client'",
        explanation: 'Directing "use client" menandai boundary antara Server Components dan Client Components tempat React hooks dapat berjalan.',
        points: 20,
        order_index: 2,
      },
      {
        id: 'q-3',
        quiz_id: 'quiz-01',
        question_text: 'Fitur PostgreSQL apa yang digunakan untuk memastikan siswa hanya dapat melihat nilai dan submission miliknya sendiri langsung di level database engine?',
        question_type: 'multiple_choice',
        options: [
          'Database Sharding',
          'Row Level Security (RLS)',
          'Table Partitioning',
          'Materialized Views',
        ],
        correct_answer: 'Row Level Security (RLS)',
        explanation: 'RLS (Row Level Security) adalah mekanisme PostgreSQL untuk membatasi baris data yang bisa diakses user berdasarkan policy.',
        points: 20,
        order_index: 3,
      },
      {
        id: 'q-4',
        quiz_id: 'quiz-01',
        question_text: 'Manakah dari pernyataan berikut yang BENAR mengenai Server Actions di Next.js?',
        question_type: 'multiple_choice',
        options: [
          'Server Actions hanya bisa dipanggil lewat HTTP GET request dari browser external',
          'Server Actions adalah fungsi asinkron yang dieksekusi di server dan dapat dipanggil langsung dari form atau tombol di client',
          'Server Actions menggantikan seluruh fungsi PostgreSQL database',
          'Server Actions tidak mendukung enkripsi data transmisi',
        ],
        correct_answer: 'Server Actions adalah fungsi asinkron yang dieksekusi di server dan dapat dipanggil langsung dari form atau tombol di client',
        explanation: 'Server Actions memungkinkan kita memutasi data di server tanpa perlu membuat API endpoint terpisah.',
        points: 20,
        order_index: 4,
      },
      {
        id: 'q-5',
        quiz_id: 'quiz-01',
        question_text: 'Apa fungsi utama file layout.tsx di dalam folder App Router Next.js?',
        question_type: 'multiple_choice',
        options: [
          'Membungkus halaman anak (children) dengan struktur tata letak bersama yang tidak me-render ulang saat perpindahan rute',
          'Menghapus cache database setiap kali pengguna me-refresh halaman',
          'Mengompilasi file TypeScript menjadi WebAssembly',
          'Mengatur koneksi Bluetooth perangkat',
        ],
        correct_answer: 'Membungkus halaman anak (children) dengan struktur tata letak bersama yang tidak me-render ulang saat perpindahan rute',
        explanation: 'Layout membungkus children dan mempertahankan state serta scroll position antar navigasi rute bersarang.',
        points: 20,
        order_index: 5,
      },
    ],
    created_at: '2026-02-14T08:00:00Z',
  },
];

export const INITIAL_QUIZ_ATTEMPTS: Record<string, any>[] = [
  {
    id: 'att-user-1-quiz-1',
    quiz_id: 'quiz-01',
    quiz_title: 'Kuis Evaluasi Kompetensi: Next.js App Router & Full-Stack Architecture',
    student_id: 'user-siswa-1',
    student_name: 'Ahmad Rizky Pratama',
    started_at: '2026-02-16T14:00:00Z',
    completed_at: '2026-02-16T14:14:30Z',
    score: 100,
    max_score: 100,
    is_passed: true,
    status: 'graded',
    answers: {
      'q-1': 'React Server Component (RSC)',
      'q-2': "'use client'",
      'q-3': 'Row Level Security (RLS)',
      'q-4': 'Server Actions adalah fungsi asinkron yang dieksekusi di server dan dapat dipanggil langsung dari form atau tombol di client',
      'q-5': 'Membungkus halaman anak (children) dengan struktur tata letak bersama yang tidak me-render ulang saat perpindahan rute',
    },
  },
];

export const INITIAL_GRADES: GradeRecord[] = [
  {
    id: 'grd-01',
    student_id: 'user-siswa-1',
    student_name: 'Ahmad Rizky Pratama',
    student_nisn: '0067823412',
    class_id: 'class-xii-rpl-1',
    class_name: 'XII RPL 1',
    subject_id: 'sub-pwpb',
    subject_name: 'Pemrograman Web dan Perangkat Bergerak',
    assignment_score: 95,
    quiz_score: 100,
    exam_score: 92,
    final_score: 95.6,
    letter_grade: 'A',
    status_ketuntasan: 'Tuntas',
    notes: 'Pemahaman materi sangat memuaskan, aktif membantu rekan sekelas dan mengerjakan proyek tepat waktu.',
    updated_at: '2026-02-20T10:00:00Z',
  },
  {
    id: 'grd-02',
    student_id: 'user-siswa-2',
    student_name: 'Rina Wulandari',
    student_nisn: '0067823413',
    class_id: 'class-xii-rpl-1',
    class_name: 'XII RPL 1',
    subject_id: 'sub-pwpb',
    subject_name: 'Pemrograman Web dan Perangkat Bergerak',
    assignment_score: 88,
    quiz_score: 85,
    exam_score: 87,
    final_score: 86.8,
    letter_grade: 'B',
    status_ketuntasan: 'Tuntas',
    notes: 'Konsisten dalam pengumpulan tugas, desain antarmuka menarik dan responsif.',
    updated_at: '2026-02-20T10:00:00Z',
  },
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-01',
    title: 'Pelaksanaan Asesmen Sumatif Akhir Semester & Uji Kompetensi Keahlian (UKK) 2026',
    content: 'Diberitahukan kepada seluruh siswa kelas XII SMKN 1 Digital Nusantara bahwa jadwal simulasi Uji Kompetensi Keahlian (UKK) bersama Asesor Industri akan dimulai pada tanggal 10 Maret 2026. Pastikan seluruh berkas portofolio proyek dan tugas mandiri di LMS telah tuntas dikumpulkan.',
    author_id: 'user-admin-1',
    author_name: 'Drs. H. Suryanto, M.Pd.',
    author_role: 'admin',
    target_role: 'all',
    priority: 'penting',
    is_pinned: true,
    created_at: '2026-02-18T07:30:00Z',
  },
  {
    id: 'ann-02',
    title: 'Pembagian Kelompok Praktik Pengembangan Sistem Enterprise - XII RPL 1',
    content: 'Halo teman-teman XII RPL 1, instruksi pembagian kelompok proyek akhir semester telah diunggah pada tab Materi Pelajaran. Setiap kelompok beranggotakan 3-4 siswa dengan pembagian peran Frontend Engineer, Backend/Database Engineer, dan QA.',
    author_id: 'user-guru-1',
    author_name: 'Budi Santoso, S.Kom.',
    author_role: 'guru',
    target_role: 'siswa',
    class_id: 'class-xii-rpl-1',
    class_name: 'XII RPL 1',
    priority: 'normal',
    is_pinned: false,
    created_at: '2026-02-19T08:15:00Z',
  },
  {
    id: 'ann-03',
    title: 'Jadwal Pemeliharaan Server Cloud & Migrasi Database LMS',
    content: 'Pemberitahuan kepada seluruh Dewan Guru dan Tenaga Kependidikan: server LMS akan menjalani optimasi berkala pada Sabtu pukul 22.00 - 24.00 WIB. Seluruh data nilai dan submission otomatis tersinkronisasi.',
    author_id: 'user-admin-1',
    author_name: 'Drs. H. Suryanto, M.Pd.',
    author_role: 'admin',
    target_role: 'guru',
    priority: 'normal',
    is_pinned: false,
    created_at: '2026-02-20T11:00:00Z',
  },
];
