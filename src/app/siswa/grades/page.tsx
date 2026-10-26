'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useLms } from '@/lib/store';
import { Award, CheckCircle2, AlertCircle, FileText, Calendar } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function SiswaGradesPage() {
  const { grades, currentUser, submissions } = useLms();

  const myGrades = grades.filter((g) => g.student_id === currentUser.id);
  const mySubmissions = submissions.filter((s) => s.student_id === currentUser.id);

  return (
    <DashboardLayout
      title="Rapor & Rekapitulasi Nilai Saya"
      subtitle={`Hasil Evaluasi Belajar — ${currentUser.full_name} (${currentUser.nisn_nip})`}
    >
      <div className="space-y-6">
        {/* Rapor Table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
          <div className="p-4 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-purple-600" />
              <span>Buku Rapor Penilaian Akademik Kejuruan</span>
            </h3>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Mata Pelajaran</th>
                  <th className="py-3 px-4 text-center">Tugas (40%)</th>
                  <th className="py-3 px-4 text-center">Kuis (30%)</th>
                  <th className="py-3 px-4 text-center">Ujian (30%)</th>
                  <th className="py-3 px-4 text-center">Nilai Akhir</th>
                  <th className="py-3 px-4 text-center">Predikat</th>
                  <th className="py-3 px-4 text-right">Ketuntasan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {myGrades.map((g) => (
                  <tr key={g.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4">
                      <p className="font-bold text-slate-900 dark:text-white">{g.subject_name}</p>
                      <p className="text-[11px] text-slate-400">{g.notes || 'Capaian kompetensi tuntas.'}</p>
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
                      <span className="w-6 h-6 rounded-full inline-flex items-center justify-center font-bold text-xs bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                        {g.letter_grade}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2.5 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>{g.status_ketuntasan}</span>
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Feedback Guru pada Tugas */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
          <h3 className="font-bold text-sm text-slate-900 dark:text-white">
            Umpan Balik & Catatan Guru pada Tugas Terkumpul:
          </h3>

          <div className="space-y-3">
            {mySubmissions.filter((s) => s.feedback).map((s) => (
              <div
                key={s.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/40 space-y-2 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900 dark:text-white">{s.assignment_title}</span>
                  <span className="font-mono font-bold text-emerald-600">Nilai: {s.score}/100</span>
                </div>
                <p className="text-slate-600 dark:text-slate-300 italic leading-relaxed">
                  "{s.feedback}"
                </p>
                <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
                  <span>Dinilai oleh: {s.graded_by}</span>
                  <span>{s.graded_at ? formatDate(s.graded_at) : ''}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
