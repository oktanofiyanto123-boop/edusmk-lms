'use client';

import React from 'react';
import Link from 'next/link';
import {
  GraduationCap,
  BookOpen,
  ClipboardList,
  CheckCircle2,
  Award,
  Users,
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Laptop,
  Code2,
  Network,
  Palette,
  Cpu,
  Sprout,
  Zap,
  Layers,
  ChevronRight,
  Check,
  Video,
  FileCheck,
  BarChart3,
  Shield,
  UserCheck,
} from 'lucide-react';
import { RoleSwitchBanner } from '@/components/layout/RoleSwitchBanner';
import { useLms } from '@/lib/store';

export default function LandingPage() {
  const { schoolSettings, departments, classes, subjects } = useLms();

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <RoleSwitchBanner />

      {/* Main Navigation */}
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 transition-colors">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-md shadow-blue-600/30">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-lg text-slate-900 dark:text-white tracking-tight flex items-center gap-1.5">
                EduSMK
                <span className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 px-1.5 py-0.2 rounded-md">
                  LMS
                </span>
              </span>
              <p className="text-[10px] text-slate-500 dark:text-slate-400 truncate max-w-[180px]">
                {schoolSettings.school_name}
              </p>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
            <a href="#fitur" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Fitur LMS
            </a>
            <a href="#jurusan" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Kompetensi Keahlian
            </a>
            <a href="#keunggulan" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Keunggulan
            </a>
            <a href="#tentang" className="hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
              Tentang Sekolah
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-medium text-slate-700 dark:text-slate-200 hover:text-blue-600 dark:hover:text-white transition-colors"
            >
              Masuk
            </Link>
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-md shadow-blue-600/20 transition-all flex items-center gap-1.5 hover:gap-2"
            >
              <span>Portal Belajar</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-navy-gradient text-white py-20 lg:py-28">
        {/* Glow ambient effects */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-blue-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-20 -right-20 w-[400px] h-[400px] bg-indigo-500/15 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-400/30 text-blue-300 text-xs font-medium">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Transformasi Digital Pendidikan Kejuruan Terdepan</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white">
                Platform Pembelajaran Digital Modern untuk Generasi Emas{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
                  SMK Indonesia
                </span>
              </h1>

              <p className="text-slate-300 text-base sm:text-lg max-w-2xl leading-relaxed">
                EduSMK menghadirkan ekosistem pembelajaran terpadu setara perguruan tinggi kelas dunia yang disesuaikan khusus dengan kebutuhan kurikulum vokasi, praktikum kejuruan, dan uji kompetensi industri.
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-2">
                <Link
                  href="/login"
                  className="px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-sm shadow-lg shadow-indigo-600/30 flex items-center gap-2 transition-all hover:scale-[1.02]"
                >
                  <UserCheck className="w-4 h-4" />
                  <span>Masuk sebagai Siswa</span>
                </Link>
                <Link
                  href="/login"
                  className="px-6 py-3.5 rounded-xl bg-emerald-700/80 hover:bg-emerald-600/80 text-white border border-emerald-600/50 font-semibold text-sm flex items-center gap-2 transition-all hover:scale-[1.02]"
                >
                  <GraduationCap className="w-4 h-4" />
                  <span>Masuk sebagai Guru</span>
                </Link>
                <Link
                  href="/login"
                  className="px-6 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 border border-slate-700 font-semibold text-sm flex items-center gap-2 transition-all hover:scale-[1.02]"
                >
                  <Shield className="w-4 h-4" />
                  <span>Masuk sebagai Admin</span>
                </Link>
              </div>

              {/* Trust Indicators */}
              <div className="pt-6 border-t border-slate-800/80 flex flex-wrap items-center justify-center lg:justify-start gap-6 text-xs text-slate-400">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Terintegrasi Supabase PostgreSQL</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Row Level Security (RLS)</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Siap Uji Kompetensi Keahlian (UKK)</span>
                </div>
              </div>
            </div>

            {/* Interactive Preview Card */}
            <div className="lg:col-span-5">
              <div className="bg-slate-900/90 border border-slate-700/80 rounded-2xl p-6 shadow-2xl backdrop-blur-xl space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-rose-500/80" />
                    <span className="w-3 h-3 rounded-full bg-amber-500/80" />
                    <span className="w-3 h-3 rounded-full bg-emerald-500/80" />
                    <span className="text-xs font-mono text-slate-400 ml-2">portal.edusmk.sch.id</span>
                  </div>
                  <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-800 px-2 py-0.5 rounded-full font-medium">
                    Live Aktif
                  </span>
                </div>

                {/* Mini Stat preview */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
                    <p className="text-[11px] text-slate-400">Total Siswa Aktif</p>
                    <p className="text-xl font-bold text-white mt-1">498 Siswa</p>
                    <span className="text-[10px] text-emerald-400 flex items-center gap-1 mt-1">
                      <TrendingUpIcon /> 100% Terdaftar
                    </span>
                  </div>
                  <div className="bg-slate-800/60 p-3 rounded-xl border border-slate-700/50">
                    <p className="text-[11px] text-slate-400">Tingkat Ketuntasan</p>
                    <p className="text-xl font-bold text-white mt-1">94.8%</p>
                    <span className="text-[10px] text-blue-400 flex items-center gap-1 mt-1">
                      Target UKK Tercapai
                    </span>
                  </div>
                </div>

                {/* Preview Activity */}
                <div className="space-y-2 pt-2">
                  <p className="text-xs font-semibold text-slate-300">Aktivitas Terkini Kelas XII RPL 1:</p>
                  <div className="bg-slate-800/40 p-2.5 rounded-lg border border-slate-700/40 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-blue-600/20 text-blue-400 flex items-center justify-center">
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white font-medium truncate">Materi: Arsitektur Next.js & Server Components</p>
                      <p className="text-[10px] text-slate-400">Guru: Budi Santoso, S.Kom.</p>
                    </div>
                    <span className="text-[10px] text-blue-300 bg-blue-900/50 px-2 py-0.5 rounded">RPL</span>
                  </div>

                  <div className="bg-slate-800/40 p-2.5 rounded-lg border border-slate-700/40 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
                      <FileCheck className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs text-white font-medium truncate">Tugas 01 telah dinilai: 95/100 (A)</p>
                      <p className="text-[10px] text-slate-400">Siswa: Ahmad Rizky Pratama</p>
                    </div>
                    <span className="text-[10px] text-emerald-300 bg-emerald-900/50 px-2 py-0.5 rounded">Dinilai</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Program Keahlian / Jurusan SMK */}
      <section id="jurusan" className="py-16 sm:py-24 bg-white dark:bg-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60 px-3 py-1 rounded-full">
              Kurikulum Berbasis Industri
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Kompetensi Keahlian SMK Unggulan
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Setiap jurusan didukung modul pembelajaran digital interaktif, laboratorium virtual, dan rubrik asesmen yang diselaraskan dengan kebutuhan dunia usaha dan dunia industri (DUDI).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {departments.map((dept) => {
              const icons: Record<string, any> = {
                ATPH: Sprout,
                TE: Cpu,
                DKV: Palette,
                RPL: Code2,
              };
              const DeptIcon = icons[dept.code] || BookOpen;

              return (
                <div
                  key={dept.id}
                  className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 hover:shadow-xl hover:border-blue-500/40 transition-all group flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="w-12 h-12 rounded-xl bg-blue-600/10 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all">
                      <DeptIcon className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-blue-600 dark:text-blue-400">
                          {dept.code}
                        </span>
                        <span className="text-[11px] text-slate-500">
                          {dept.total_students} Siswa
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mt-1">
                        {dept.name}
                      </h3>
                      <p className="text-xs text-slate-600 dark:text-slate-400 mt-2 line-clamp-3">
                        {dept.description}
                      </p>
                    </div>
                  </div>
                  <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-500">
                    <span>Kaprog: {dept.head_of_department?.split(',')[0]}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Fitur Utama Platform LMS */}
      <section id="fitur" className="py-16 sm:py-24 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-3 py-1 rounded-full">
              Fitur Terintegrasi 100%
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
              Dirancang untuk Pengalaman Belajar & Mengajar Terbaik
            </h2>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">
              Tidak sekadar penyimpan berkas, EduSMK memfasilitasi siklus instruksional lengkap mulai dari penyampaian materi, penugasan proyek, kuis evaluasi, hingga rekap rapor.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Video className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Materi Multimedia & Subbab
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Guru dapat mengunggah modul PDF, video praktikum YouTube, instruksi markdown terstruktur, dan tautan referensi yang langsung dapat diakses siswa.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
                <ClipboardList className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Tugas Praktik & Pengumpulan
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Mendukung pengumpulan tugas teks kode, tautan repositori GitHub, dan berkas arsip ZIP atau PDF dengan validasi batas waktu serta status keterlambatan otomatis.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Kuis & Evaluasi Otomatis
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Pengerjaan kuis interaktif dengan timer countdown, randomisasi soal, auto-grade untuk pilihan ganda, dan proteksi kunci jawaban di sisi server.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Award className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Rubrik Penilaian & Umpan Balik
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Guru dapat memeriksa karya siswa, memasukkan skor angka, serta memberikan komentar konstruktif yang hanya dapat dilihat oleh siswa bersangkutan.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
                <BarChart3 className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Rekap Nilai & Ekspor CSV
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Konfigurasi bobot penilaian tugas, kuis, dan ujian akhir dapat disesuaikan dan diekspor ke format spreadsheet untuk keperluan pelaporan rapor sekolah.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
              <div className="w-10 h-10 rounded-lg bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Row Level Security & Isolasi Peran
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Admin, guru, dan siswa memiliki hak akses yang dipisahkan secara ketat di tingkat database engine, memastikan kerahasiaan data nilai dan ujian.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-gradient-to-r from-blue-900 to-indigo-950 text-white py-16">
        <div className="max-w-5xl mx-auto px-4 text-center space-y-6">
          <h2 className="text-2xl sm:text-4xl font-extrabold">
            Siap Memajukan Pendidikan Kejuruan Digital?
          </h2>
          <p className="text-slate-300 max-w-2xl mx-auto text-sm sm:text-base">
            Masuk sekarang dengan akun sekolah Anda atau uji coba demo dengan peran Admin, Guru, dan Siswa secara langsung.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <Link
              href="/login"
              className="px-8 py-3.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm shadow-xl shadow-blue-600/30 transition-all hover:scale-105 flex items-center gap-2"
            >
              <UserCheck className="w-4 h-4" />
              Masuk — Siswa
            </Link>
            <Link
              href="/login"
              className="px-8 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm border border-white/20 transition-all flex items-center gap-2"
            >
              <Shield className="w-4 h-4" />
              Masuk — Guru / Admin
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="tentang" className="bg-slate-950 text-slate-400 border-t border-slate-800 py-12 text-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3 md:col-span-2">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white font-bold">
                <GraduationCap className="w-5 h-5" />
              </div>
              <span className="text-white font-bold text-base">EduSMK LMS</span>
            </div>
            <p className="text-slate-400 max-w-md leading-relaxed">
              {schoolSettings.school_name} — Platform Pembelajaran Digital Terintegrasi Vokasi Berbasis Cloud. Mempersiapkan siswa SMK terampil, unggul, dan berkarakter siap kerja di era digital.
            </p>
            <p className="text-slate-500">
              NPSN: {schoolSettings.npsn} • Tahun Ajaran: {schoolSettings.academic_year} ({schoolSettings.active_semester})
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-white font-semibold text-sm">Akses Portal</p>
            <ul className="space-y-1.5">
              <li><Link href="/login" className="hover:text-indigo-400 transition-colors">Login Siswa</Link></li>
              <li><Link href="/login" className="hover:text-emerald-400 transition-colors">Login Guru</Link></li>
              <li><Link href="/login" className="hover:text-blue-400 transition-colors">Login Admin</Link></li>
            </ul>
          </div>

          <div className="space-y-2">
            <p className="text-white font-semibold text-sm">Kontak Sekolah</p>
            <p className="leading-relaxed">{schoolSettings.address}</p>
            <p>Telepon: {schoolSettings.phone}</p>
            <p>Email: {schoolSettings.email}</p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 mt-8 border-t border-slate-900 text-center text-slate-500">
          © 2026 {schoolSettings.school_name}. Seluruh hak cipta dilindungi undang-undang.
        </div>
      </footer>
    </div>
  );
}

function TrendingUpIcon() {
  return (
    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
    </svg>
  );
}
