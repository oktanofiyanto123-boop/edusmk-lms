'use client';

import React from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useLms } from '@/lib/store';
import { CheckCircle2, Clock, Award, ArrowRight, AlertCircle } from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function SiswaQuizzesPage() {
  const { quizzes, quizAttempts, currentUser } = useLms();

  return (
    <DashboardLayout
      title="Kuis & Evaluasi Pembelajaran"
      subtitle="Uji Kompetensi Mandiri, Simulasi Ujian Kejuruan, dan Penilaian Terpadu"
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => {
            const attempt = quizAttempts.find(
              (a) => a.quiz_id === quiz.id && a.student_id === currentUser.id
            );

            return (
              <div
                key={quiz.id}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4 hover:border-purple-500/40 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-purple-600 bg-purple-50 dark:bg-purple-950 px-2 py-0.5 rounded">
                      {quiz.subject_name?.split(' ')[0]}
                    </span>
                    {attempt ? (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded-full">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>Skor: {attempt.score}/100</span>
                      </span>
                    ) : (
                      <span className="text-[10px] text-amber-600 font-semibold bg-amber-50 dark:bg-amber-950 px-2 py-0.5 rounded-full">
                        Belum Dikerjakan
                      </span>
                    )}
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
                      <span>Durasi: {quiz.duration_minutes} Menit</span>
                    </p>
                    <p className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{quiz.question_count || quiz.questions?.length || 5} Butir Soal</span>
                    </p>
                    <p className="flex items-center gap-1.5 text-purple-600 font-semibold">
                      <Award className="w-3.5 h-3.5" />
                      <span>Standar KKM: {quiz.pass_score} Poin</span>
                    </p>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                  <Link
                    href={`/siswa/quizzes/${quiz.id}`}
                    className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                      attempt
                        ? 'border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                        : 'bg-purple-600 hover:bg-purple-700 text-white shadow-xs'
                    }`}
                  >
                    <span>{attempt ? 'Kerjakan Ulang / Tinjau' : 'Mulai Kerjakan Kuis'}</span>
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
