-- ============================================================
-- EduSMK LMS - Seed Data Awal
-- Jalankan SETELAH 001_initial_schema.sql
-- ============================================================

-- SCHOOL SETTINGS
INSERT INTO public.school_settings (id, school_name, npsn, address, phone, email, website, principal_name, academic_year, active_semester, grading_weights)
VALUES (
  'settings-1',
  'SMK Negeri 1 Sukoharjo',
  '20313774',
  'Jl. Raya Solo-Wonogiri Km. 3, Sukoharjo, Jawa Tengah',
  '(0271) 592902',
  'smkn1sukoharjo@gmail.com',
  'https://smkn1sukoharjo.sch.id',
  'Drs. H. Bambang Suryadi, M.Pd',
  '2025/2026',
  'Ganjil',
  '{"assignments": 40, "quizzes": 30, "exams": 30}'
)
ON CONFLICT (id) DO NOTHING;

-- DEPARTMENTS
INSERT INTO public.departments (id, code, name, description, icon, head_of_department) VALUES
('dept-atph', 'ATPH', 'Agribisnis Tanaman Pangan dan Hortikultura', 'Program keahlian budidaya tanaman pangan, hortikultura, dan tanaman hias', '🌱', 'Okta Nofiyanto, S.P.'),
('dept-tkj', 'TKJ', 'Teknik Komputer dan Jaringan', 'Program keahlian instalasi jaringan komputer dan pemeliharaan perangkat', '💻', NULL),
('dept-akl', 'AKL', 'Akuntansi dan Keuangan Lembaga', 'Program keahlian akuntansi keuangan dan perbankan', '📊', NULL)
ON CONFLICT (id) DO NOTHING;

-- CLASSROOMS (dari backup)
INSERT INTO public.classrooms (id, name, grade_level, department_id, department_name, academic_year, teacher_id, student_count) VALUES
('cls-x-at-1',  'X AT 1',   10, 'dept-atph', 'ATPH', '2025/2026', 'user-guru-1', 32),
('cls-x-at-2',  'X AT 2',   10, 'dept-atph', 'ATPH', '2025/2026', 'user-guru-1', 32),
('cls-x-at-3',  'X AT 3',   10, 'dept-atph', 'ATPH', '2025/2026', 'user-guru-1', 30),
('cls-xi-at-1', 'XI AT 1',  11, 'dept-atph', 'ATPH', '2025/2026', 'user-guru-1', 32),
('cls-xi-at-2', 'XI AT 2',  11, 'dept-atph', 'ATPH', '2025/2026', 'user-guru-1', 31),
('cls-xi-at-3', 'XI AT 3',  11, 'dept-atph', 'ATPH', '2025/2026', 'user-guru-1', 30),
('cls-xii-at-1','XII AT 1', 12, 'dept-atph', 'ATPH', '2025/2026', 'user-guru-1', 30),
('cls-xii-at-2','XII AT 2', 12, 'dept-atph', 'ATPH', '2025/2026', 'user-guru-1', 29),
('cls-xii-at-3','XII AT 3', 12, 'dept-atph', 'ATPH', '2025/2026', 'user-guru-1', 28)
ON CONFLICT (id) DO NOTHING;

-- SUBJECTS (dari backup categories)
INSERT INTO public.subjects (id, code, name, department_id, department_name, description, hours_per_week) VALUES
('cat-1',  'DDAT',  'Dasar-Dasar Agribisnis Tanaman',            'dept-atph', 'ATPH', 'Pengenalan prinsip ekologi pertanian, fisiologi tanaman, dan keselamatan kerja di kebun.', 4),
('cat-2',  'PMT',   'Penyiapan Media Tanam',                     'dept-atph', 'ATPH', 'Formula media tanam tanah, kompos matang, arang sekam, cocopeat, dan sterilisasi media.', 3),
('cat-3',  'PBB',   'Penyiapan Benih dan Bibit',                 'dept-atph', 'ATPH', 'Seleksi benih bersertifikat, perlakuan benih (seed treatment), dan uji daya berkecambah.', 3),
('cat-4',  'PBT',   'Pembibitan Tanaman',                        'dept-atph', 'ATPH', 'Teknik persemaian di tray, pemeliharaan bibit muda di greenhouse, dan adaptasi lingkungan.', 3),
('cat-5',  'BTP',   'Budidaya Tanaman Pangan',                   'dept-atph', 'ATPH', 'Teknologi budidaya padi sawah intensif, jagung hibrida, kedelai, dan ubi jalar bermutu.', 4),
('cat-6',  'BTH',   'Budidaya Tanaman Hortikultura',             'dept-atph', 'ATPH', 'Sayuran daun (pakcoy, selada), sayuran buah (cabai, tomat), tanaman hias, dan biofarmaka.', 4),
('cat-7',  'PLB',   'Pertanian Lahan Basah',                     'dept-atph', 'ATPH', 'Sistem irigasi teknis sawah, tata kelola air pasang surut, dan penanganan tanah masam.', 3),
('cat-8',  'PLK',   'Pertanian Lahan Kering',                    'dept-atph', 'ATPH', 'Teknik konservasi air tanah, mulsa jerami/plastik hitam perak, dan pola tanam tumpang sari.', 3),
('cat-9',  'SHD',   'Sistem Hidroponik',                         'dept-atph', 'ATPH', 'Teknik NFT, DFT, Wick System, manajemen larutan nutrisi AB Mix, dan kalibrasi pH/EC meter.', 4),
('cat-10', 'PMN',   'Pemeliharaan Tanaman',                      'dept-atph', 'ATPH', 'Teknik penyulaman, penyiangan, pemangkasan pucuk/tunas air (pruning), dan pemasangan ajir.', 3),
('cat-11', 'PPK',   'Pemupukan',                                 'dept-atph', 'ATPH', 'Penerapan prinsip 5T (Tepat Jenis, Dosis, Waktu, Cara, Tempat), POC, dan pupuk berimbang.', 3),
('cat-12', 'PHT',   'Pengendalian Hama dan Penyakit Tanaman',    'dept-atph', 'ATPH', 'Penerapan Pengendalian Hama Terpadu (PHT), perangkap likat kuning, pestisida nabati.', 4),
('cat-13', 'PPC',   'Panen dan Pascapanen',                      'dept-atph', 'ATPH', 'Penentuan waktu petik optimum, sortasi, grading SNI, pengemasan vakum, dan cold chain.', 3),
('cat-14', 'K3P',   'Keselamatan dan Kesehatan Kerja Pertanian', 'dept-atph', 'ATPH', 'Penggunaan APD pertanian, SOP pengoperasian traktor/sprayer, dan penanganan pestisida.', 2),
('cat-15', 'AGP',   'Agripreneurship',                           'dept-atph', 'ATPH', 'Analisis kelayakan usaha tani (R/C ratio, BEP), branding produk hortikultura, pemasaran online.', 3)
ON CONFLICT (id) DO NOTHING;

-- PROFILES: Admin
INSERT INTO public.profiles (id, full_name, role, email, nisn_nip, password_hash, department_id, department_name, status, created_at) VALUES
('user-admin-1', 'Admin Sekolah', 'admin', 'admin@edusmk.sch.id', '198501012010011001', 'admin123', 'dept-atph', 'ATPH', 'aktif', '2026-01-01T00:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- PROFILES: Guru
INSERT INTO public.profiles (id, full_name, role, email, nisn_nip, password_hash, department_id, department_name, class_id, class_name, status, created_at) VALUES
('user-guru-1', 'Okta Nofiyanto', 'guru', 'okta@edusmk.sch.id', '199001012015041001', 'guru123', 'dept-atph', 'ATPH', 'cls-x-at-1', 'X AT 1', 'aktif', '2026-01-01T00:00:00Z')
ON CONFLICT (id) DO NOTHING;

-- PROFILES: Siswa (tambahkan siswa-siswa Anda di sini)
-- Password default: siswa123
INSERT INTO public.profiles (id, full_name, role, nisn_nip, password_hash, department_id, department_name, class_id, class_name, status, created_at) VALUES
('user-siswa-1', 'Andi Pratama',     'siswa', '0071234567', 'siswa123', 'dept-atph', 'ATPH', 'cls-x-at-1', 'X AT 1', 'aktif', '2026-07-15T08:00:00Z'),
('user-siswa-2', 'Budi Santoso',     'siswa', '0072345678', 'siswa123', 'dept-atph', 'ATPH', 'cls-x-at-1', 'X AT 1', 'aktif', '2026-07-15T08:00:00Z'),
('user-siswa-3', 'Citra Dewi',       'siswa', '0073456789', 'siswa123', 'dept-atph', 'ATPH', 'cls-x-at-1', 'X AT 1', 'aktif', '2026-07-15T08:00:00Z'),
('user-siswa-4', 'Deni Kurniawan',   'siswa', '0074567890', 'siswa123', 'dept-atph', 'ATPH', 'cls-x-at-2', 'X AT 2', 'aktif', '2026-07-15T08:00:00Z'),
('user-siswa-5', 'Eka Putri',        'siswa', '0075678901', 'siswa123', 'dept-atph', 'ATPH', 'cls-x-at-2', 'X AT 2', 'aktif', '2026-07-15T08:00:00Z'),
('user-siswa-6', 'Fahmi Ramadhan',   'siswa', '0076789012', 'siswa123', 'dept-atph', 'ATPH', 'cls-x-at-2', 'X AT 2', 'aktif', '2026-07-15T08:00:00Z'),
('user-siswa-7', 'Gita Nuraini',     'siswa', '0077890123', 'siswa123', 'dept-atph', 'ATPH', 'cls-x-at-3', 'X AT 3', 'aktif', '2026-07-15T08:00:00Z'),
('user-siswa-8', 'Hendra Wijaya',    'siswa', '0078901234', 'siswa123', 'dept-atph', 'ATPH', 'cls-x-at-3', 'X AT 3', 'aktif', '2026-07-15T08:00:00Z'),
('user-siswa-9', 'Indah Lestari',    'siswa', '0079012345', 'siswa123', 'dept-atph', 'ATPH', 'cls-x-at-3', 'X AT 3', 'aktif', '2026-07-15T08:00:00Z')
ON CONFLICT (id) DO NOTHING;
