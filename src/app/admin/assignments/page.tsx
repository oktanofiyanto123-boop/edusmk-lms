'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useLms } from '@/lib/store';
import { ClipboardList, Search, Trash2, Calendar, Users, Award } from 'lucide-react';
import { formatDate, getStatusBadge } from '@/lib/utils';

export default function AdminAssignmentsPage() {
  const { assignments, deleteAssignment } = useLms();
  const [search, setSearch] = useState('');

  const filtered = assignments.filter(
    (a) =>
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.subject_name?.toLowerCase().includes(search.toLowerCase()) ||
      a.teacher_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout
      title="Manajemen Seluruh Tugas Siswa"
      subtitle="Monitoring Tugas Praktik Kejuruan, Batas Waktu, dan Pengumpulan"
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-xs text-slate-500">{assignments.length} Total Tugas Praktik Terdaftar</p>
          <div className="relative sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari tugas, guru, kelas..."
              className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Judul Tugas</th>
                  <th className="py-3 px-4">Mapel & Rombel</th>
                  <th className="py-3 px-4">Guru Pengampu</th>
                  <th className="py-3 px-4">Batas Tenggat</th>
                  <th className="py-3 px-4">Progres Kumpul</th>
                  <th className="py-3 px-4">Bobot & Skor Max</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {filtered.map((asg) => (
                  <tr key={asg.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                      {asg.title}
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-slate-800 dark:text-slate-200">{asg.subject_name}</p>
                      <p className="text-[11px] text-slate-400">{asg.class_name}</p>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{asg.teacher_name}</td>
                    <td className="py-3 px-4 text-slate-500 flex items-center gap-1 mt-2">
                      <Calendar className="w-3.5 h-3.5 text-slate-400" />
                      <span>{formatDate(asg.due_date)}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="text-[11px] font-semibold text-emerald-600 dark:text-emerald-400">
                        {asg.submitted_count || 0} / {asg.total_students || 36} Siswa
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-mono text-xs">{asg.max_score} Poin (Bobot {asg.weight}%)</span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => {
                          if (confirm(`Hapus tugas ${asg.title}?`)) deleteAssignment(asg.id);
                        }}
                        className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950"
                        title="Hapus Tugas"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
