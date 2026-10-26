'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useLms } from '@/lib/store';
import { ClipboardList, Plus, Search, Trash2, Calendar, Users, FileCheck, Award } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function GuruAssignmentsPage() {
  const { assignments, deleteAssignment, currentUser } = useLms();
  const [search, setSearch] = useState('');

  const myAssignments = assignments.filter(
    (a) => a.teacher_id === currentUser.id || currentUser.role === 'admin'
  );

  const filtered = myAssignments.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.subject_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout
      title="Manajemen Tugas Praktik"
      subtitle="Instruksi Tugas Kejuruan, Rubrik Penilaian, dan Rekap Pengumpulan"
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-xs text-slate-500">{myAssignments.length} Tugas Praktik Aktif</p>
          <div className="flex items-center gap-3">
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
            <Link
              href="/guru/assignments/create"
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Beri Tugas Baru</span>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((asg) => (
            <div
              key={asg.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4 hover:border-blue-500/40 transition-all"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
                    {asg.class_name}
                  </span>
                  <span className="text-[11px] text-slate-500">Bobot {asg.weight}%</span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
                  {asg.title}
                </h3>

                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {asg.description}
                </p>

                <div className="space-y-1.5 pt-2 text-[11px] text-slate-400">
                  <p className="flex items-center gap-1.5 text-rose-500 font-medium">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Tenggat: {formatDate(asg.due_date)}</span>
                  </p>
                  <p className="flex items-center gap-1.5 text-emerald-600">
                    <FileCheck className="w-3.5 h-3.5" />
                    <span>{asg.submitted_count || 0} / {asg.total_students || 36} Siswa Mengumpulkan</span>
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <Link
                  href={`/guru/grading?assignmentId=${asg.id}`}
                  className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold"
                >
                  Periksa Pengumpulan
                </Link>

                <button
                  onClick={() => {
                    if (confirm(`Hapus tugas: ${asg.title}?`)) deleteAssignment(asg.id);
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950"
                  title="Hapus Tugas"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  );
}
