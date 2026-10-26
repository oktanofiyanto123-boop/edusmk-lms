'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useLms } from '@/lib/store';
import { CheckCircle2, Plus, Trash2, ArrowLeft, Clock, Award } from 'lucide-react';
import { QuizQuestion } from '@/lib/types';
import Link from 'next/link';

export default function CreateQuizPage() {
  const router = useRouter();
  const { classes, subjects, addQuiz, currentUser } = useLms();

  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || '');
  const [classId, setClassId] = useState(classes[0]?.id || '');
  const [instructions, setInstructions] = useState('');
  const [durationMinutes, setDurationMinutes] = useState(20);
  const [passScore, setPassScore] = useState(75);
  const [dueDate, setDueDate] = useState('2026-11-28T23:59');

  const [questions, setQuestions] = useState<QuizQuestion[]>([
    {
      id: 'q-new-1',
      quiz_id: '',
      question_text: 'Sebutkan keunggulan utama dari penggunaan Server Components di Next.js?',
      question_type: 'multiple_choice',
      options: [
        'Mengurangi ukuran JavaScript bundle di sisi klien',
        'Menghilangkan kebutuhan akan koneksi internet',
        'Mengubah kode TypeScript menjadi file gambar',
        'Membatasi peramban hanya pada Google Chrome',
      ],
      correct_answer: 'Mengurangi ukuran JavaScript bundle di sisi klien',
      points: 50,
      order_index: 1,
    },
    {
      id: 'q-new-2',
      quiz_id: '',
      question_text: 'Fitur keamanan database PostgreSQL apa yang membatasi hak akses data baris per baris?',
      question_type: 'multiple_choice',
      options: [
        'Row Level Security (RLS)',
        'Foreign Key Cascading',
        'Auto Increment Primary Key',
        'Database Vacuuming',
      ],
      correct_answer: 'Row Level Security (RLS)',
      points: 50,
      order_index: 2,
    },
  ]);

  const handleAddQuestion = () => {
    const newQ: QuizQuestion = {
      id: `q-${Date.now()}`,
      quiz_id: '',
      question_text: `Pertanyaan Butir ${questions.length + 1}`,
      question_type: 'multiple_choice',
      options: ['Pilihan A', 'Pilihan B', 'Pilihan C', 'Pilihan D'],
      correct_answer: 'Pilihan A',
      points: 25,
      order_index: questions.length + 1,
    };
    setQuestions([...questions, newQ]);
  };

  const handleRemoveQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id));
  };

  const handleUpdateOption = (qId: string, optIndex: number, val: string) => {
    setQuestions(
      questions.map((q) => {
        if (q.id === qId && q.options) {
          const newOpts = [...q.options];
          newOpts[optIndex] = val;
          return { ...q, options: newOpts };
        }
        return q;
      })
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || questions.length === 0) {
      alert('Mohon masukkan judul kuis dan minimal 1 butir soal.');
      return;
    }

    const sub = subjects.find((s) => s.id === subjectId);
    const cls = classes.find((c) => c.id === classId);

    addQuiz({
      subject_id: subjectId,
      subject_name: sub?.name,
      class_id: classId,
      class_name: cls?.name,
      teacher_id: currentUser.id,
      teacher_name: currentUser.full_name,
      title,
      instructions: instructions || 'Pilihlah salah satu jawaban yang paling tepat pada setiap butir soal.',
      duration_minutes: Number(durationMinutes),
      max_attempts: 2,
      pass_score: Number(passScore),
      status: 'published',
      due_date: new Date(dueDate).toISOString(),
      question_count: questions.length,
      questions,
    });

    router.push('/guru/quizzes');
  };

  return (
    <DashboardLayout
      title="Buat Kuis Baru"
      subtitle="Susun Soal Evaluasi Kompetensi, Kunci Jawaban, dan Batas Waktu Kuis"
    >
      <div className="max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/guru/quizzes"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Bank Kuis</span>
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6 text-xs">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block font-semibold mb-1">Mata Pelajaran</label>
              <select
                value={subjectId}
                onChange={(e) => setSubjectId(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              >
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>{s.name} ({s.code})</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block font-semibold mb-1">Kelas Sasaran Kuis</label>
              <select
                value={classId}
                onChange={(e) => setClassId(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>{c.name} - {c.department_name}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block font-semibold mb-1">Judul Kuis Evaluasi</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Evaluasi Tengah Semester: Pemrograman Web & RLS"
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold mb-1">Durasi Pengerjaan (Menit)</label>
                <input
                  type="number"
                  required
                  min="5"
                  max="180"
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Nilai KKM Kelulusan</label>
                <input
                  type="number"
                  required
                  min="1"
                  max="100"
                  value={passScore}
                  onChange={(e) => setPassScore(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Batas Akhir Kuis</label>
                <input
                  type="datetime-local"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>
            </div>
          </div>

          {/* Builder Soal Kuis */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <label className="block font-semibold">Daftar Butir Soal Kuis ({questions.length} Soal)</label>
              <button
                type="button"
                onClick={handleAddQuestion}
                className="px-3 py-1.5 rounded-lg bg-purple-50 dark:bg-purple-950 text-purple-600 text-xs font-semibold hover:bg-purple-100 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Soal</span>
              </button>
            </div>

            <div className="space-y-4">
              {questions.map((q, qIdx) => (
                <div
                  key={q.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 bg-slate-50/50 dark:bg-slate-800/40"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-bold text-xs text-purple-600">Nomor {qIdx + 1}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveQuestion(q.id)}
                      className="p-1 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <textarea
                    rows={2}
                    value={q.question_text}
                    onChange={(e) => {
                      const val = e.target.value;
                      setQuestions(questions.map((item) => (item.id === q.id ? { ...item, question_text: val } : item)));
                    }}
                    placeholder="Tuliskan pertanyaan soal di sini..."
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 font-medium"
                  />

                  {/* Options */}
                  <div className="space-y-2">
                    <p className="text-[11px] font-semibold text-slate-500">Pilihan Jawaban (Pilih radio untuk Kunci Jawaban):</p>
                    {q.options?.map((opt, optIdx) => (
                      <div key={optIdx} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`correct-${q.id}`}
                          checked={q.correct_answer === opt}
                          onChange={() => {
                            setQuestions(questions.map((item) => (item.id === q.id ? { ...item, correct_answer: opt } : item)));
                          }}
                          className="text-purple-600 focus:ring-purple-500"
                        />
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => handleUpdateOption(q.id, optIdx, e.target.value)}
                          className="flex-1 p-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-semibold flex items-center gap-2 shadow-md shadow-purple-600/20"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Terbitkan Kuis Sekarang</span>
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
