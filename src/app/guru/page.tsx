'use client';

import React from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useLms } from '@/lib/store';
import {
  GraduationCap,
  FileText,
  ClipboardList,
  CheckCircle2,
  AlertCircle,
  Plus,
  ArrowRight,
  Clock,
  Users,
  Award,
  Video,
  FileCheck,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function GuruDashboardPage() {
  const { currentUser, materials, assignments, submissions, classes, quizzes } = useLms();

  // Filter materials and assignments created by this teacher
  const myMaterials = materials.filter((m) => m.teacher_id === currentUser.id || currentUser.role === 'admin');
  const myAssignments = assignments.filter((a) => a.teacher_id === currentUser.id || currentUser.role === 'admin');

  // Submissions waiting for grading
  const pendingGrading = submissions.filter((s) => s.status === 'sudah_dikumpulkan');

  return (
    <DashboardLayout
      title={`Dashboard Guru — ${currentUser.full_name}`}
      subtitle={`Wali Kelas & Pengampu Kompetensi Keahlian SMK`}
    >
      <div className="space-y-6">
        {/* Welcome card */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[11px] font-medium">
                <GraduationCap className="w-3.5 h-3.5" />
                <span>Portal Dewan Guru Pengampu</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                Selamat Bertugas, {currentUser.full_name.split(',')[0]}!
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                Kelola materi pembelajaran kejuruan, beri tugas proyek industri, periksa pengumpulan siswa, serta lakukan asesmen sumatif secara transparan.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <Link
                href="/guru/materials/create"
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-md flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Buat Materi Baru</span>
              </Link>
              <Link
                href="/guru/assignments/create"
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 flex items-center gap-1.5 transition-all"
              >
                <ClipboardList className="w-3.5 h-3.5" />
                <span>Beri Tugas Siswa</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Materi Terbit</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{myMaterials.length}</p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 mt-1">Siap dipelajari siswa</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Tugas Praktik</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{myAssignments.length}</p>
              <p className="text-[11px] text-blue-600 dark:text-blue-400 mt-1">Berbobot nilai rapor</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <ClipboardList className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Menunggu Penilaian</p>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{pendingGrading.length}</p>
              <p className="text-[11px] text-amber-600 dark:text-amber-400 mt-1">Submission siswa baru</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <FileCheck className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Bank Kuis Aktif</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{quizzes.length}</p>
              <p className="text-[11px] text-purple-600 dark:text-purple-400 mt-1">Evaluasi otomatis</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <CheckCircle2 className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Priority Action: Submissions needing teacher review */}
        {pendingGrading.length > 0 && (
          <div className="p-5 rounded-2xl bg-amber-50/70 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-800 dark:text-amber-300 font-bold text-sm">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>Tugas Siswa Siap Dinilai ({pendingGrading.length})</span>
              </div>
              <Link
                href="/guru/grading"
                className="text-xs font-semibold text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1"
              >
                <span>Buka Penilaian</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {pendingGrading.map((subm) => (
                <div
                  key={subm.id}
                  className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-amber-200 dark:border-amber-800/60 flex items-center justify-between gap-3 shadow-xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <img
                      src={subm.student_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80'}
                      alt={subm.student_name}
                      className="w-9 h-9 rounded-full object-cover shrink-0"
                    />
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {subm.student_name}
                      </p>
                      <p className="text-[11px] text-slate-500 truncate">{subm.assignment_title}</p>
                    </div>
                  </div>
                  <Link
                    href={`/guru/grading?submissionId=${subm.id}`}
                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shrink-0"
                  >
                    Beri Nilai
                  </Link>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Two columns: Materials by Teacher and Assignments */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Materials Section */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileText className="w-4 h-4 text-emerald-600" />
                <span>Modul Pembelajaran Saya</span>
              </h3>
              <Link href="/guru/materials" className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                Kelola Semua
              </Link>
            </div>

            <div className="space-y-3">
              {myMaterials.map((mat) => (
                <div
                  key={mat.id}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 transition-all flex items-center justify-between gap-3"
                >
                  <div className="space-y-1 min-w-0">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase">
                      {mat.class_name} • {mat.subject_name?.split(' ')[0]}
                    </span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {mat.title}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      {mat.subchapters?.length || 0} Subbab • Terbit {formatDate(mat.created_at)}
                    </p>
                  </div>

                  <Link
                    href={`/siswa/materials/${mat.id}`}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium shrink-0"
                  >
                    Pratinjau
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* Assignments Section */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <ClipboardList className="w-4 h-4 text-blue-600" />
                <span>Tugas Praktik Aktif</span>
              </h3>
              <Link href="/guru/assignments" className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline">
                Kelola Semua
              </Link>
            </div>

            <div className="space-y-3">
              {myAssignments.map((asg) => (
                <div
                  key={asg.id}
                  className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 transition-all flex items-center justify-between gap-3"
                >
                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-bold text-blue-600 uppercase">
                        {asg.class_name}
                      </span>
                      <span className="text-[10px] text-slate-400">
                        Tenggat: {formatDate(asg.due_date)}
                      </span>
                    </div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {asg.title}
                    </h4>
                    <p className="text-[11px] text-slate-400">
                      Pengumpulan: <strong className="text-slate-700 dark:text-slate-300">{asg.submitted_count || 0}</strong> siswa
                    </p>
                  </div>

                  <Link
                    href={`/guru/grading?assignmentId=${asg.id}`}
                    className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shrink-0"
                  >
                    Periksa
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
