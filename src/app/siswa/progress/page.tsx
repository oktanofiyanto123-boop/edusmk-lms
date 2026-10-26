'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useLms } from '@/lib/store';
import { TrendingUp, BookOpen, ClipboardList, CheckCircle2, Award } from 'lucide-react';

export default function SiswaProgressPage() {
  const { materials, learningProgress, currentUser, assignments, submissions, subjects } = useLms();

  const classMaterials = materials.filter(
    (m) => m.class_id === currentUser.class_id || !m.class_id || currentUser.role === 'admin'
  );

  const completedMaterials = learningProgress.filter(
    (lp) => lp.student_id === currentUser.id && lp.is_completed
  ).length;

  const mySubmissions = submissions.filter((s) => s.student_id === currentUser.id);

  const overallProgress = classMaterials.length > 0
    ? Math.round((completedMaterials / classMaterials.length) * 100)
    : 0;

  return (
    <DashboardLayout
      title="Capaian & Progres Belajar"
      subtitle="Statistik Riil Pemahaman Modul dan Pengumpulan Tugas Mandiri"
    >
      <div className="space-y-6">
        {/* Overall Progress Hero */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                Total Persentase Ketuntasan Materi Kejuruan
              </h3>
              <p className="text-xs text-slate-500">
                Berdasarkan {completedMaterials} dari {classMaterials.length} modul yang telah Anda selesaikan.
              </p>
            </div>
            <span className="font-mono text-3xl font-black text-blue-600 dark:text-blue-400">
              {overallProgress}%
            </span>
          </div>

          <div className="w-full h-4 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 transition-all duration-700 rounded-full"
              style={{ width: `${Math.max(overallProgress, 5)}%` }}
            />
          </div>
        </div>

        {/* Breakdown by Subject */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {subjects.map((sub) => {
            const subMats = classMaterials.filter((m) => m.subject_id === sub.id);
            const subCompleted = subMats.filter((m) =>
              learningProgress.some(
                (lp) => lp.material_id === m.id && lp.student_id === currentUser.id && lp.is_completed
              )
            ).length;
            const subPercent = subMats.length > 0 ? Math.round((subCompleted / subMats.length) * 100) : 0;

            return (
              <div
                key={sub.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
                    {sub.code}
                  </span>
                  <span className="font-mono text-xs font-bold text-slate-700 dark:text-slate-300">
                    {subPercent}% Selesai
                  </span>
                </div>

                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  {sub.name}
                </h4>

                <div className="w-full h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-blue-600 rounded-full"
                    style={{ width: `${Math.max(subPercent, 3)}%` }}
                  />
                </div>

                <p className="text-[11px] text-slate-400">
                  {subCompleted} dari {subMats.length} modul materi tuntas dipelajari.
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
