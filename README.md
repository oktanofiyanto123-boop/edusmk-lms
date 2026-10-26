# 🎓 EduSMK — Learning Management System (LMS)

Platform pembelajaran digital modern, elegan, dan profesional berstandar industri khusus untuk Sekolah Menengah Kejuruan (SMK) di Indonesia. Dilengkapi fitur manajemen materi multimedia, tugas proyek, kuis interaktif anti-kecurangan, rekapitulasi penilaian rapor, dan keamanan database berbasis PostgreSQL Row Level Security (RLS).

---

## 🚀 Fitur Utama Berdasarkan Peran

### 1. 🛡️ Administrator Sekolah (`/admin`)
- **Dashboard Statistik Terpadu**: Pantau total siswa, guru, rombel kelas, materi terbit, dan keaktifan sistem secara *real-time*.
- **Manajemen Pengguna (User Management)**: Tambah, edit, aktifkan/nonaktifkan akun Guru, Siswa, dan Staf Tata Usaha.
- **Manajemen Kelas & Jurusan**: Kelola Kompetensi Keahlian (RPL, ATPH, DKV, Teknik Elektronika) dan Rombongan Belajar beserta penugasan Wali Kelas.
- **Manajemen Mata Pelajaran**: Pengaturan kurikulum kejuruan dan alokasi jam mengajar mingguan.
- **Audit Materi & Tugas Sekolah**: Tinjau seluruh materi dan tugas yang diterbitkan guru di semua kelas.
- **Pengumuman Resmi Sekolah**: Publikasi surat edaran dan pengumuman dengan opsi *pinned* di dashboard.
- **Rekap Penilaian & Ekspor CSV**: Akses rekapitulasi nilai rapor seluruh kelas dan ekspor data ke spreadsheet.
- **Konfigurasi Identitas Sekolah**: Pengaturan NPSN, data Kepala Sekolah, tahun ajaran/semester, dan bobot penilaian.

### 2. 👨‍🏫 Dewan Guru Pengampu (`/guru`)
- **Dashboard Mengajar**: Pantau aktivitas kelas, materi aktif, dan notifikasi tugas siswa yang menunggu penilaian.
- **Manajemen Materi Pembelajaran**:
  - Penyusunan modul interaktif dengan subbab terstruktur.
  - Penambahan tujuan pembelajaran (*learning objectives*).
  - Integrasi video YouTube player langsung pada modul.
  - Unggah dokumen lampiran (PDF, panduan praktikum, cheatsheet).
  - Pengaturan status: *Draft*, *Published*, atau *Archived*.
- **Manajemen Tugas Praktik**:
  - Penentuan batas tenggat waktu (*due date*).
  - Pengaturan jenis pengumpulan (teks kode/link git atau berkas ZIP/PDF).
  - Rubrik penilaian kriteria & bobot skor.
- **Portal Penilaian & Umpan Balik Siswa**:
  - Periksa jawaban teks dan berkas tugas siswa.
  - Berikan skor angka (0 - 100) dan catatan konstruktif.
  - Publikasi nilai langsung ke siswa bersangkutan.
- **Bank Kuis & Evaluasi**:
  - Pembuatan soal pilihan ganda interaktif beserta kunci jawaban.
  - Pengaturan durasi pengerjaan (timer otomatis) dan ambang batas KKM.
- **Pengumuman Khusus Rombel**: Kirim informasi praktikum langsung ke siswa kelas binaan.
- **Rekapitulasi Nilai Kelas**: Unduh nilai akhir dan predikat rapor dalam format file CSV.

### 3. 🎓 Peserta Didik / Siswa (`/siswa`)
- **Dashboard Belajar Pribadi**:
  - Indikator persentase ketuntasan modul (*progress bar* dinamis).
  - Peringatan tenggat waktu tugas mendesak.
  - Ringkasan nilai rata-rata dan predikat sementara.
- **Katalog Materi Interaktif**:
  - Baca modul teks dengan tipografi nyaman dan tata letak responsif.
  - Tonton video demonstrasi praktikum.
  - Unduh modul PDF dan berkas instruksi.
  - Tombol **"Tandai Selesai"** untuk memperbarui progres capaian kompetensi secara riil.
- **Pengumpulan Tugas Mandiri**:
  - Baca instruksi detail dan kriteria rubrik guru.
  - Masukkan catatan, teks kode, tautan repositori GitHub.
  - Lampirkan berkas proyek (arsip ZIP / PDF).
  - Tinjau nilai angka dan komentar umpan balik dari guru setelah dinilai.
- **Pengerjaan Kuis Interaktif**:
  - Pengerjaan dengan *countdown timer* berjalan mundur.
  - Navigasi nomor soal dan seleksi jawaban.
  - Evaluasi otomatis (*auto-grading*) di server dengan tampilan skor, status LULUS/REMEDIAL, serta pembahasan soal.
- **Rapor & Nilai Saya**: Transparansi perolehan nilai tugas, kuis, ujian, dan predikat huruf (A, B, C, D).
- **Profil Siswa**: Manajemen data kontak WhatsApp dan informasi akademik NISN.

---

## 🛠️ Arsitektur Teknologi

- **Frontend**: [Next.js](https://nextjs.org/) (App Router, React 19, Server & Client Components)
- **Bahasa**: [TypeScript](https://www.typescriptlang.org/) dengan *strict type safety*
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) dengan palet warna Navy Vokasi & Dark Mode terintegrasi
- **Ikon**: [Lucide Icons](https://lucide.dev/)
- **Database**: [Supabase PostgreSQL](https://supabase.com/) dengan Row Level Security (RLS)
- **Otentikasi**: Supabase Authentication & Role-Based Access Control (RBAC)
- **Penyimpanan**: Supabase Storage Buckets (`materials`, `submissions`, `avatars`)
- **Deployment**: [Vercel](https://vercel.com/)

---

## 💻 Panduan Menjalankan Secara Lokal

### 1. Prasyarat
- Node.js versi 18.x atau yang lebih baru
- NPM / PNPM / Yarn

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Jalankan Server Pengembangan
```bash
npm run dev
```
Buka peramban Anda di [http://localhost:3000](http://localhost:3000).

---

## 🔑 Akun Demo Bawaan (Pengujian Instan)

Aplikasi dilengkapi tombol **"EduSMK Demo Mode"** di bagian atas halaman untuk beralih peran instan dengan satu klik:

| Peran | Nama Pengguna | Email | Kata Sandi | Akses Dashboard |
|---|---|---|---|---|
| **Admin** | Drs. H. Suryanto, M.Pd. | `admin@edusmk.sch.id` | `password123` | `/admin` |
| **Guru** | Budi Santoso, S.Kom. | `budi@edusmk.sch.id` | `password123` | `/guru` |
| **Siswa** | Ahmad Rizky Pratama | `ahmad@siswa.edusmk.sch.id` | `password123` | `/siswa` |

---

## 🗄️ Panduan Setup Database Supabase

1. Buat proyek baru di [Supabase Dashboard](https://database.new).
2. Buka menu **SQL Editor** pada dashboard Supabase Anda.
3. Buka file migrasi yang telah disediakan di repositori ini:
   ```
   supabase/migrations/20261026000000_init_edusmk.sql
   ```
4. Salin seluruh isi SQL dan jalankan (*Run*) di SQL Editor Supabase.
   - Skrip ini akan membuat seluruh 17 tabel relasional, foreign keys, indexes, triggers sinkronisasi profil, serta Row Level Security (RLS) policies.
5. Salin **Project URL** dan **anon public key** dari menu *Project Settings -> API*.
6. Buat file `.env.local` pada root direktori:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOi...
   ```

---

## 🌐 Panduan Deployment ke Vercel

1. Dorong (*push*) kode ke repositori GitHub Anda:
   ```bash
   git add .
   git commit -m "feat: complete EduSMK LMS production build"
   git push origin main
   ```
2. Buka [Vercel Dashboard](https://vercel.com/new) dan klik **Add New Project**.
3. Impor repositori GitHub `edusmk` / `pembelajaran OKTA`.
4. Pada bagian **Environment Variables**, tambahkan:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Klik tombol **Deploy**. Vercel akan otomatis mengompilasi aplikasi dengan Next.js App Router dan mengaktifkan URL produksi berkecepatan tinggi!

---

© 2026 EduSMK LMS — Transformasi Digital Pendidikan Kejuruan Terdepan.
