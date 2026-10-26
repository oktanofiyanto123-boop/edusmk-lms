'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useLms } from '@/lib/store';
import { Award, Search, Download, CheckCircle2, AlertCircle } from 'lucide-react';

export default function AdminGradesPage() {
  const { grades, classes, subjects } = useLms();
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [search, setSearch] = useState('');

  const filtered = grades.filter((g) => {
    const matchClass = selectedClass === 'all' || g.class_id === selectedClass;
    const matchSearch =
      g.student_name.toLowerCase().includes(search.toLowerCase()) ||
      g.student_nisn.includes(search) ||
      g.subject_name.toLowerCase().includes(search.toLowerCase());
    return matchClass && matchSearch;
  });

  const exportCsv = () => {
    const headers = ['Nama Siswa', 'NISN', 'Kelas', 'Mata Pelajaran', 'Nilai Tugas', 'Nilai Kuis', 'Nilai Ujian', 'Nilai Akhir', 'Predikat', 'Status'];
    const rows = filtered.map((g) => [
      `"${g.student_name}"`,
      `"${g.student_nisn}"`,
      `"${g.class_name}"`,
      `"${g.subject_name}"`,
      g.assignment_score,
      g.quiz_score,
      g.exam_score,
      g.final_score,
      g.letter_grade,
      g.status_ketuntasan,
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `Rekap_Nilai_EduSMK_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DashboardLayout
      title="Rekapitulasi Penilaian Siswa"
      subtitle="Evaluasi Kinerja Akademik, Skor Akhir, dan Status Ketuntasan Pembelajaran"
    >
      <div className="space-y-6">
        {/* Filter bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="text-xs p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
            >
              <option value="all">Semua Rombel (Kelas)</option>
              {classes.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>

            <div className="relative sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari siswa atau NISN..."
                className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>
          </div>

          <button
            onClick={exportCsv}
            className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Ekspor Rekap (CSV/Excel)</span>
          </button>
        </div>

        {/* Grades Table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Nama Siswa & NISN</th>
                  <th className="py-3 px-4">Kelas & Mapel</th>
                  <th className="py-3 px-4 text-center">Tugas (40%)</th>
                  <th className="py-3 px-4 text-center">Kuis (30%)</th>
                  <th className="py-3 px-4 text-center">Ujian (30%)</th>
                  <th className="py-3 px-4 text-center">Nilai Akhir</th>
                  <th className="py-3 px-4 text-center">Predikat</th>
                  <th className="py-3 px-4 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {filtered.map((g) => (
                  <tr key={g.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900 dark:text-white">{g.student_name}</p>
                      <p className="font-mono text-[11px] text-slate-400">{g.student_nisn}</p>
                    </td>
                    <td className="py-3 px-4">
                      <p className="font-medium text-slate-800 dark:text-slate-200">{g.class_name}</p>
                      <p className="text-[11px] text-slate-400">{g.subject_name}</p>
                    </td>
                    <td className="py-3 px-4 text-center font-mono font-semibold">{g.assignment_score}</td>
                    <td className="py-3 px-4 text-center font-mono font-semibold">{g.quiz_score}</td>
                    <td className="py-3 px-4 text-center font-mono font-semibold">{g.exam_score}</td>
                    <td className="py-3 px-4 text-center">
                      <span className="font-mono font-bold text-sm text-blue-600 dark:text-blue-400">
                        {g.final_score}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className="w-6 h-6 rounded-full inline-flex items-center justify-center font-bold text-xs bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                        {g.letter_grade}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                        g.status_ketuntasan === 'Tuntas'
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                      }`}>
                        {g.status_ketuntasan === 'Tuntas' ? <CheckCircle2 className="w-3.5 h-3.5" /> : <AlertCircle className="w-3.5 h-3.5" />}
                        <span>{g.status_ketuntasan}</span>
                      </span>
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
