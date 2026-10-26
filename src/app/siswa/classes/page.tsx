'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useLms } from '@/lib/store';
import { BookOpen, Clock, Users, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export default function SiswaClassesPage() {
  const { subjects, currentUser, materials } = useLms();

  return (
    <DashboardLayout
      title="Mata Pelajaran Saya"
      subtitle={`Kurikulum Kejuruan Kelas ${currentUser.class_name || 'XII RPL 1'}`}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subjects.map((sub) => {
            const subjectMaterials = materials.filter((m) => m.subject_id === sub.id);
            return (
              <div
                key={sub.id}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
                      {sub.code}
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-slate-400">
                      <Clock className="w-3.5 h-3.5" />
                      <span>{sub.hours_per_week} Jam/Mg</span>
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {sub.name}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">
                    {sub.description || 'Kompetensi kejuruan inti berbasis kurikulum merdeka SMK.'}
                  </p>

                  <p className="text-[11px] text-blue-600 dark:text-blue-400 font-semibold">
                    {subjectMaterials.length} Modul Tersedia
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 dark:border-slate-800">
                  <Link
                    href={`/siswa/materials?subjectId=${sub.id}`}
                    className="w-full py-2 px-3 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 hover:bg-blue-100 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <span>Buka Modul Belajar</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
