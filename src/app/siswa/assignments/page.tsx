'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useLms } from '@/lib/store';
import { ClipboardList, Search, Calendar, CheckCircle2, Clock, Award, ArrowRight } from 'lucide-react';
import { formatDate, getStatusBadge } from '@/lib/utils';

export default function SiswaAssignmentsPage() {
  const { assignments, submissions, currentUser } = useLms();
  const [filter, setFilter] = useState<'all' | 'pending' | 'submitted' | 'graded'>('all');
  const [search, setSearch] = useState('');

  const mySubmissions = submissions.filter((s) => s.student_id === currentUser.id);

  const filtered = assignments.filter((asg) => {
    const sub = mySubmissions.find((s) => s.assignment_id === asg.id);
    const matchSearch =
      asg.title.toLowerCase().includes(search.toLowerCase()) ||
      asg.subject_name?.toLowerCase().includes(search.toLowerCase());

    if (!matchSearch) return false;

    if (filter === 'pending') return !sub;
    if (filter === 'submitted') return sub && sub.status === 'sudah_dikumpulkan';
    if (filter === 'graded') return sub && sub.status === 'sudah_dinilai';
    return true;
  });

  return (
    <DashboardLayout
      title="Tugas Praktik Saya"
      subtitle="Instruksi Tugas Kejuruan, Pengumpulan Berkas, dan Hasil Penilaian Guru"
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {(['all', 'pending', 'submitted', 'graded'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all ${
                  filter === f
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
                }`}
              >
                {f === 'all' ? 'Semua Tugas' : f === 'pending' ? 'Belum Dikerjakan' : f === 'submitted' ? 'Sudah Dikumpulkan' : 'Sudah Dinilai'}
              </button>
            ))}
          </div>

          <div className="relative sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari tugas..."
              className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((asg) => {
            const sub = mySubmissions.find((s) => s.assignment_id === asg.id);
            const badge = sub ? getStatusBadge(sub.status) : { label: 'Belum Dikerjakan', className: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-200' };

            return (
              <div
                key={asg.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4 hover:border-blue-500/40 transition-all group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
                      {asg.subject_name?.split(' ')[0]}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${badge.className}`}>
                      {badge.label}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-blue-600 transition-colors">
                    {asg.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {asg.description}
                  </p>

                  <div className="space-y-1 text-[11px] text-slate-400 pt-1">
                    <p className="flex items-center gap-1.5 text-rose-500">
                      <Calendar className="w-3.5 h-3.5" />
                      <span>Batas: {formatDate(asg.due_date)}</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Award className="w-3.5 h-3.5" />
                      <span>Bobot: {asg.weight}% Rapor</span>
                    </p>
                    {sub?.score !== undefined && (
                      <p className="text-emerald-600 font-bold text-xs pt-1">
                        Nilai Anda: {sub.score} / 100
                      </p>
                    )}
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                  <Link
                    href={`/siswa/assignments/${asg.id}`}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      sub
                        ? 'border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                        : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                    }`}
                  >
                    <span>{sub ? 'Lihat Pengumpulan & Nilai' : 'Kerjakan Sekarang'}</span>
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
