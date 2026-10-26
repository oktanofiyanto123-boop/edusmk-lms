'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useLms } from '@/lib/store';
import {
  CheckCircle2,
  Clock,
  Award,
  AlertCircle,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  HelpCircle,
  Sparkles,
  RotateCcw,
} from 'lucide-react';
import Link from 'next/link';

function QuizPlayerContent() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.id as string;

  const { quizzes, submitQuizAttempt, currentUser } = useLms();
  const quiz = quizzes.find((q) => q.id === quizId);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [secondsRemaining, setSecondsRemaining] = useState((quiz?.duration_minutes || 20) * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [finalScore, setFinalScore] = useState<number | null>(null);

  // Timer countdown
  useEffect(() => {
    if (isSubmitted) return;

    const interval = setInterval(() => {
      setSecondsRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          handleFinishQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isSubmitted]);

  if (!quiz || !quiz.questions || quiz.questions.length === 0) {
    return (
      <DashboardLayout title="Kuis Tidak Ditemukan">
        <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <p className="text-sm text-slate-500">Kuis ini belum memiliki butir soal yang dipublikasikan.</p>
          <Link href="/siswa/quizzes" className="inline-flex px-4 py-2 bg-purple-600 text-white rounded-xl text-xs font-semibold">
            Kembali ke Bank Kuis
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const currentQuestion = quiz.questions[currentIndex];
  const minutes = Math.floor(secondsRemaining / 60);
  const seconds = secondsRemaining % 60;
  const isTimeRunningOut = minutes < 3;

  const handleSelectOption = (questionId: string, option: string) => {
    if (isSubmitted) return;
    setAnswers({ ...answers, [questionId]: option });
  };

  const handleFinishQuiz = () => {
    if (isSubmitted) return;

    const score = submitQuizAttempt({
      quiz_id: quiz.id,
      quiz_title: quiz.title,
      student_id: currentUser.id,
      student_name: currentUser.full_name,
      started_at: new Date().toISOString(),
      max_score: 100,
      answers,
      status: 'submitted',
    });

    setFinalScore(score);
    setIsSubmitted(true);
  };

  const answeredCount = Object.keys(answers).length;
  const isPassed = finalScore !== null && finalScore >= quiz.pass_score;

  return (
    <DashboardLayout
      title={quiz.title}
      subtitle={`Mata Pelajaran: ${quiz.subject_name} • KKM: ${quiz.pass_score} Poin`}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        {/* Top bar with back and timer */}
        <div className="flex items-center justify-between">
          <Link
            href="/siswa/quizzes"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Bank Kuis</span>
          </Link>

          {!isSubmitted && (
            <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border text-xs font-mono font-bold shadow-xs ${
              isTimeRunningOut
                ? 'bg-rose-50 border-rose-300 text-rose-600 dark:bg-rose-950 dark:border-rose-800 animate-pulse'
                : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200'
            }`}>
              <Clock className="w-4 h-4 text-purple-600" />
              <span>
                Sisa Waktu: {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </span>
            </div>
          )}
        </div>

        {/* Results Modal / Banner if Submitted */}
        {isSubmitted && finalScore !== null && (
          <div className={`p-8 rounded-2xl text-white shadow-2xl space-y-4 text-center ${
            isPassed
              ? 'bg-gradient-to-r from-emerald-800 via-teal-900 to-slate-900'
              : 'bg-gradient-to-r from-rose-900 via-red-950 to-slate-900'
          }`}>
            <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center mx-auto">
              {isPassed ? <CheckCircle2 className="w-10 h-10 text-emerald-400" /> : <AlertCircle className="w-10 h-10 text-rose-400" />}
            </div>

            <div className="space-y-1">
              <h3 className="text-2xl font-black tracking-tight">
                {isPassed ? 'Selamat, Anda Lulus Evaluasi!' : 'Perlu Remedial & Latihan Lebih Lanjut'}
              </h3>
              <p className="text-xs text-slate-300 max-w-md mx-auto">
                {isPassed
                  ? `Hasil belajar Anda memenuhi kriteria ketuntasan minimal (KKM: ${quiz.pass_score}). Nilai otomatis tersinkronisasi ke buku rapor digital.`
                  : `Skor Anda belum mencapai ambang batas KKM (${quiz.pass_score}). Silakan tinjau kembali modul dan konsultasikan ke guru pengampu.`}
              </p>
            </div>

            <div className="flex items-baseline justify-center gap-2 pt-2">
              <span className="font-mono text-5xl font-black">{finalScore}</span>
              <span className="text-slate-300 text-lg">/ 100 Poin</span>
            </div>

            <div className="pt-4 flex justify-center gap-3">
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setFinalScore(null);
                  setAnswers({});
                  setSecondsRemaining((quiz.duration_minutes || 20) * 60);
                }}
                className="px-4 py-2 rounded-xl bg-white/20 hover:bg-white/30 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Coba Ulang Kuis</span>
              </button>
              <Link
                href="/siswa/quizzes"
                className="px-4 py-2 rounded-xl bg-white text-slate-900 text-xs font-bold hover:bg-slate-100 shadow-md"
              >
                Selesai & Keluar
              </Link>
            </div>
          </div>
        )}

        {/* Question Interface */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Main Question Card */}
          <div className="md:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <span className="font-bold text-xs text-purple-600 dark:text-purple-400 uppercase tracking-wider">
                Soal Nomor {currentIndex + 1} dari {quiz.questions.length}
              </span>
              <span className="text-xs text-slate-400">
                Bobot: {currentQuestion.points} Poin
              </span>
            </div>

            <p className="text-sm sm:text-base font-semibold text-slate-900 dark:text-white leading-relaxed">
              {currentQuestion.question_text}
            </p>

            {/* Options */}
            <div className="space-y-3 pt-2">
              {currentQuestion.options?.map((opt, i) => {
                const isSelected = answers[currentQuestion.id] === opt;
                const isCorrect = isSubmitted && opt === currentQuestion.correct_answer;
                const isWrong = isSubmitted && isSelected && !isCorrect;

                return (
                  <button
                    key={i}
                    type="button"
                    onClick={() => handleSelectOption(currentQuestion.id, opt)}
                    className={`w-full text-left p-4 rounded-xl border text-xs sm:text-sm font-medium transition-all flex items-center justify-between ${
                      isCorrect
                        ? 'bg-emerald-50 text-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200 border-emerald-500 font-bold'
                        : isWrong
                        ? 'bg-rose-50 text-rose-900 dark:bg-rose-950/60 dark:text-rose-200 border-rose-500 font-bold'
                        : isSelected
                        ? 'bg-purple-50 text-purple-900 dark:bg-purple-950/60 dark:text-purple-200 border-purple-500 font-semibold shadow-xs'
                        : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-800 dark:text-slate-200'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center font-bold text-xs shrink-0">
                        {String.fromCharCode(65 + i)}
                      </span>
                      <span>{opt}</span>
                    </div>

                    {isCorrect && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                  </button>
                );
              })}
            </div>

            {/* Explanation if submitted */}
            {isSubmitted && currentQuestion.explanation && (
              <div className="p-3.5 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-200 dark:border-purple-800 text-xs text-purple-900 dark:text-purple-300 space-y-1">
                <p className="font-bold">Pembahasan Soal:</p>
                <p className="leading-relaxed">{currentQuestion.explanation}</p>
              </div>
            )}

            {/* Pagination Controls */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <button
                type="button"
                disabled={currentIndex === 0}
                onClick={() => setCurrentIndex((prev) => prev - 1)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold flex items-center gap-1 disabled:opacity-30"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Sebelumnya</span>
              </button>

              <button
                type="button"
                disabled={currentIndex === quiz.questions.length - 1}
                onClick={() => setCurrentIndex((prev) => prev + 1)}
                className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold flex items-center gap-1 disabled:opacity-30"
              >
                <span>Selanjutnya</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Side Question Navigator */}
          <div className="md:col-span-4 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Navigasi Butir Soal
            </h4>

            <div className="grid grid-cols-5 gap-2">
              {quiz.questions.map((q, idx) => {
                const isAnswered = Boolean(answers[q.id]);
                const isCurrent = currentIndex === idx;

                return (
                  <button
                    key={q.id}
                    onClick={() => setCurrentIndex(idx)}
                    className={`p-2.5 rounded-xl font-bold text-xs transition-all ${
                      isCurrent
                        ? 'ring-2 ring-purple-600 bg-purple-600 text-white'
                        : isAnswered
                        ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 font-bold'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-200'
                    }`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>

            <div className="pt-2 text-[11px] text-slate-400 space-y-1">
              <p>Terjawab: <strong className="text-slate-700 dark:text-slate-200">{answeredCount}</strong> dari {quiz.questions.length} butir</p>
            </div>

            {!isSubmitted && (
              <button
                type="button"
                onClick={handleFinishQuiz}
                className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-md shadow-purple-600/20 transition-all"
              >
                Selesaikan & Kumpulkan Kuis
              </button>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function QuizPlayerPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8 text-center text-xs text-slate-400">Memuat butir soal kuis...</div>}>
      <QuizPlayerContent />
    </React.Suspense>
  );
}
