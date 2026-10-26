'use client';

import React from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useLms } from '@/lib/store';
import {
  BookOpen,
  ClipboardList,
  CheckCircle2,
  Award,
  Clock,
  ArrowRight,
  TrendingUp,
  FileCheck,
  AlertCircle,
  Video,
  Sparkles,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function SiswaDashboardPage() {
  const { currentUser, materials, assignments, submissions, quizzes, grades, learningProgress } = useLms();

  // Materials available for this student's class
  const classMaterials = materials.filter(
    (m) => m.class_id === currentUser.class_id || !m.class_id || currentUser.role === 'admin'
  );

  // Student completed materials
  const completedCount = learningProgress.filter(
    (lp) => lp.student_id === currentUser.id && lp.is_completed
  ).length;

  const progressPercentage = classMaterials.length > 0
    ? Math.round((completedCount / classMaterials.length) * 100)
    : 0;

  // Student assignments & submissions
  const mySubmissions = submissions.filter((s) => s.student_id === currentUser.id);
  const pendingAssignments = assignments.filter((a) => {
    const isSubmitted = mySubmissions.some((s) => s.assignment_id === a.id);
    return !isSubmitted;
  });

  // Student grades
  const myGrade = grades.find((g) => g.student_id === currentUser.id);

  return (
    <DashboardLayout
      title={`Selamat Datang, ${currentUser.full_name}!`}
      subtitle={`Siswa Kelas ${currentUser.class_name || 'XII RPL 1'} — Kompetensi Keahlian SMK`}
    >
      <div className="space-y-6">
        {/* Banner Motivasi Belajar */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[11px] font-medium">
                <Sparkles className="w-3.5 h-3.5 text-blue-400" />
                <span>Portal Pembelajaran Vokasi Digital</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                Tingkatkan Kompetensi Menuju Standar Industri
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                Pelajari modul interaktif, tonton video tutorial praktikum, kumpulkan proyek tepat waktu, dan pantau hasil evaluasi belajarmu di sini.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <Link
                href="/siswa/materials"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md flex items-center gap-1.5 transition-all"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>Mulai Belajar</span>
              </Link>
              <Link
                href="/siswa/assignments"
                className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 flex items-center gap-1.5 transition-all"
              >
                <ClipboardList className="w-3.5 h-3.5" />
                <span>Tugas Saya</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Progres Belajar</p>
              <p className="text-2xl font-bold text-blue-600 dark:text-blue-400 mt-1">{progressPercentage}%</p>
              <p className="text-[11px] text-slate-500 mt-1">{completedCount} dari {classMaterials.length} Materi</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <TrendingUp className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Tugas Belum Selesai</p>
              <p className="text-2xl font-bold text-amber-600 dark:text-amber-400 mt-1">{pendingAssignments.length}</p>
              <p className="text-[11px] text-amber-600 mt-1">Periksa batas tenggat</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <ClipboardList className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Tugas Dikumpulkan</p>
              <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">{mySubmissions.length}</p>
              <p className="text-[11px] text-emerald-600 mt-1">Tersimpan di sistem</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <FileCheck className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Nilai Rapor Sementara</p>
              <p className="text-2xl font-bold text-purple-600 dark:text-purple-400 mt-1">{myGrade?.final_score || 95.6}</p>
              <p className="text-[11px] text-purple-600 font-semibold mt-1">Predikat {myGrade?.letter_grade || 'A'} (Tuntas)</p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Award className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Progres Bar Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3">
          <div className="flex items-center justify-between text-xs">
            <span className="font-bold text-slate-800 dark:text-slate-200">
              Capaian Modul Kejuruan Semester Ini:
            </span>
            <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
              {progressPercentage}% Tuntas
            </span>
          </div>
          <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 to-indigo-600 transition-all duration-500 rounded-full"
              style={{ width: `${Math.max(progressPercentage, 5)}%` }}
            />
          </div>
        </div>

        {/* Dua Kolom: Materi Terkini & Tugas Mendesak */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Urgent Assignments */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-amber-500" />
                <span>Tugas yang Harus Dikerjakan</span>
              </h3>
              <Link href="/siswa/assignments" className="text-xs text-blue-600 font-semibold hover:underline">
                Lihat Semua
              </Link>
            </div>

            <div className="space-y-3">
              {assignments.slice(0, 3).map((asg) => {
                const sub = mySubmissions.find((s) => s.assignment_id === asg.id);
                return (
                  <div
                    key={asg.id}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500/50 transition-all flex items-center justify-between gap-3"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-blue-600 uppercase">
                          {asg.subject_name?.split(' ')[0]}
                        </span>
                        <span className="text-[10px] text-slate-400">
                          Tenggat: {formatDate(asg.due_date)}
                        </span>
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {asg.title}
                      </h4>
                      {sub ? (
                        <p className="text-[11px] text-emerald-600 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Sudah Dikumpulkan {sub.score ? `(Nilai: ${sub.score})` : ''}</span>
                        </p>
                      ) : (
                        <p className="text-[11px] text-rose-500 font-medium">Belum Dikerjakan</p>
                      )}
                    </div>

                    <Link
                      href={`/siswa/assignments/${asg.id}`}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold shrink-0 ${
                        sub
                          ? 'border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                          : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                      }`}
                    >
                      {sub ? 'Buka Tugas' : 'Kerjakan'}
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Available Teaching Materials */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-blue-600" />
                <span>Modul Materi Pembelajaran</span>
              </h3>
              <Link href="/siswa/materials" className="text-xs text-blue-600 font-semibold hover:underline">
                Buka Katalog
              </Link>
            </div>

            <div className="space-y-3">
              {classMaterials.map((mat) => {
                const isCompleted = learningProgress.some(
                  (lp) => lp.material_id === mat.id && lp.student_id === currentUser.id && lp.is_completed
                );
                return (
                  <div
                    key={mat.id}
                    className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-500/50 transition-all flex items-center justify-between gap-3"
                  >
                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold text-emerald-600 uppercase">
                          {mat.subject_name?.split(' ')[0]}
                        </span>
                        {isCompleted && (
                          <span className="text-[9px] bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 px-1.5 py-0.2 rounded font-bold">
                            Tuntas
                          </span>
                        )}
                      </div>
                      <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {mat.title}
                      </h4>
                      <p className="text-[11px] text-slate-400">
                        {mat.subchapters?.length || 0} Subbab • Guru: {mat.teacher_name}
                      </p>
                    </div>

                    <Link
                      href={`/siswa/materials/${mat.id}`}
                      className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 text-xs font-semibold shrink-0"
                    >
                      Pelajari
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
