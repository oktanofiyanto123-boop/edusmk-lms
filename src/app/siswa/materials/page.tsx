'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useLms } from '@/lib/store';
import { FileText, Search, Video, CheckCircle2, Clock, ArrowRight } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function SiswaMaterialsPage() {
  const { materials, learningProgress, currentUser, subjects } = useLms();
  const [search, setSearch] = useState('');
  const [selectedSubject, setSelectedSubject] = useState<string>('all');

  const myMaterials = materials.filter(
    (m) => m.status === 'published' && (m.class_id === currentUser.class_id || !m.class_id || currentUser.role === 'admin')
  );

  const filtered = myMaterials.filter((m) => {
    const matchSub = selectedSubject === 'all' || m.subject_id === selectedSubject;
    const matchSearch =
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.subject_name?.toLowerCase().includes(search.toLowerCase());
    return matchSub && matchSearch;
  });

  return (
    <DashboardLayout
      title="Katalog Materi Pembelajaran"
      subtitle="Modul Digital Interaktif, Video Praktik, dan Panduan Kejuruan"
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <select
              value={selectedSubject}
              onChange={(e) => setSelectedSubject(e.target.value)}
              className="text-xs p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
            >
              <option value="all">Semua Mata Pelajaran</option>
              {subjects.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
            <div className="relative sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari materi..."
                className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((mat) => {
            const isCompleted = learningProgress.some(
              (lp) => lp.material_id === mat.id && lp.student_id === currentUser.id && lp.is_completed
            );

            return (
              <div
                key={mat.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4 hover:border-blue-500/40 transition-all group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
                      {mat.subject_name?.split(' ')[0]}
                    </span>
                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Tuntas Dipelajari</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-slate-400">Belum Selesai</span>
                    )}
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {mat.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {mat.description}
                  </p>

                  <div className="space-y-1 text-[11px] text-slate-400 pt-1">
                    <p>{mat.subchapters?.length || 0} Subbab Pembahasan</p>
                    <p>Oleh: {mat.teacher_name}</p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                  <Link
                    href={`/siswa/materials/${mat.id}`}
                    className="w-full py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-xs transition-all"
                  >
                    <span>{isCompleted ? 'Pelajari Ulang' : 'Buka & Baca Materi'}</span>
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
