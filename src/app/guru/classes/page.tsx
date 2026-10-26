'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useLms } from '@/lib/store';
import { Building2, BookOpen, Users, Clock, Award } from 'lucide-react';
import Link from 'next/link';

export default function GuruClassesPage() {
  const { classes, subjects, currentUser } = useLms();

  return (
    <DashboardLayout
      title="Kelas & Mata Pelajaran Diampu"
      subtitle="Rombongan Belajar Binaan dan Jadwal Praktikum Kejuruan"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((c) => (
            <div
              key={c.id}
              className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
                    {c.department_name}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">Tingkat {c.grade_level}</span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                  {c.name}
                </h3>

                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Wali Kelas:</span>
                    <span className="font-medium">{c.homeroom_teacher || currentUser.full_name}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Total Siswa Terdaftar:</span>
                    <span className="font-semibold text-emerald-600">{c.student_count || 36} Siswa</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-slate-400">Tahun Akademik:</span>
                    <span className="font-mono">{c.academic_year}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
                <Link
                  href={`/guru/materials/create?classId=${c.id}`}
                  className="px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-xs font-semibold hover:bg-blue-100 transition-colors"
                >
                  Tambah Materi
                </Link>
                <Link
                  href={`/guru/assignments/create?classId=${c.id}`}
                  className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-xs font-semibold hover:bg-emerald-100 transition-colors"
                >
                  Beri Tugas
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
