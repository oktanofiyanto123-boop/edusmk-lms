'use client';

import React from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useLms } from '@/lib/store';
import { CheckCircle2, Plus, Clock, Award, Trash2, Users } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function GuruQuizzesPage() {
  const { quizzes, deleteQuiz, quizAttempts } = useLms();

  return (
    <DashboardLayout
      title="Bank Kuis & Evaluasi Pembelajaran"
      subtitle="Kuis Interaktif, Ujian Teori Kejuruan, dan Penilaian Otomatis"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-500">{quizzes.length} Kuis Aktif</p>
          <Link
            href="/guru/quizzes/create"
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Kuis Baru</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => {
            const attemptsCount = quizAttempts.filter((a) => a.quiz_id === quiz.id).length;
            return (
              <div
                key={quiz.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4 hover:border-purple-500/40 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-purple-600 bg-purple-50 dark:bg-purple-950 px-2 py-0.5 rounded">
                      {quiz.class_name}
                    </span>
                    <span className="text-[11px] text-slate-500">KKM: {quiz.pass_score}</span>
                  </div>

                  <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
                    {quiz.title}
                  </h3>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {quiz.instructions}
                  </p>

                  <div className="space-y-1.5 pt-2 text-[11px] text-slate-400">
                    <p className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5" />
                      <span>Durasi Pengerjaan: {quiz.duration_minutes} Menit</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{quiz.question_count || quiz.questions?.length || 5} Butir Soal PG</span>
                    </p>
                    <p className="flex items-center gap-1.5 text-emerald-600 font-semibold">
                      <Users className="w-3.5 h-3.5" />
                      <span>{attemptsCount} Siswa Telah Mengerjakan</span>
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <Link
                    href={`/siswa/quizzes/${quiz.id}`}
                    className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-medium"
                  >
                    Simulasi Kuis
                  </Link>
                  <button
                    onClick={() => {
                      if (confirm(`Hapus kuis ${quiz.title}?`)) deleteQuiz(quiz.id);
                    }}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </DashboardLayout>
  );
}
