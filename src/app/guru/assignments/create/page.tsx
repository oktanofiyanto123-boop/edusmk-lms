'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useLms } from '@/lib/store';
import {
  ClipboardList,
  Plus,
  Trash2,
  CheckCircle2,
  ArrowLeft,
  Calendar,
  Award,
} from 'lucide-react';
import { SubmissionType, RubricItem } from '@/lib/types';
import Link from 'next/link';

export default function CreateAssignmentPage() {
  const router = useRouter();
  const { classes, subjects, addAssignment, currentUser } = useLms();

  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || '');
  const [classId, setClassId] = useState(classes[0]?.id || '');
  const [description, setDescription] = useState('');
  const [instructions, setInstructions] = useState('');
  const [dueDate, setDueDate] = useState('2026-11-30T23:59');
  const [submissionType, setSubmissionType] = useState<SubmissionType>('both');
  const [weight, setWeight] = useState(25);
  const [rubric, setRubric] = useState<RubricItem[]>([
    { id: 'rub-1', criteria: 'Kesesuaian dengan spesifikasi instruksi', weight: 40 },
    { id: 'rub-2', criteria: 'Kerapian arsitektur kode dan implementasi', weight: 35 },
    { id: 'rub-3', criteria: 'Ketepatan waktu dan dokumentasi pengujian', weight: 25 },
  ]);
  const [newCriteria, setNewCriteria] = useState('');
  const [newWeight, setNewWeight] = useState(20);

  const handleAddRubric = () => {
    if (newCriteria.trim()) {
      setRubric([
        ...rubric,
        { id: `rub-${Date.now()}`, criteria: newCriteria.trim(), weight: Number(newWeight) },
      ]);
      setNewCriteria('');
    }
  };

  const handleRemoveRubric = (id: string) => {
    setRubric(rubric.filter((r) => r.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !instructions) {
      alert('Mohon lengkapi judul dan instruksi tugas.');
      return;
    }

    const sub = subjects.find((s) => s.id === subjectId);
    const cls = classes.find((c) => c.id === classId);

    addAssignment({
      subject_id: subjectId,
      subject_name: sub?.name,
      class_id: classId,
      class_name: cls?.name,
      teacher_id: currentUser.id,
      teacher_name: currentUser.full_name,
      title,
      description: description || 'Tugas praktik kejuruan standar industri SMK.',
      instructions,
      start_date: new Date().toISOString(),
      due_date: new Date(dueDate).toISOString(),
      submission_type: submissionType,
      max_score: 100,
      weight: Number(weight),
      status: 'published',
      rubric,
    });

    router.push('/guru/assignments');
  };

  return (
    <DashboardLayout
      title="Buat Tugas Praktik Baru"
      subtitle="Tetapkan Instruksi Tugas Kejuruan, Rubrik, dan Batas Tenggat Waktu"
    >
      <div className="max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/guru/assignments"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Daftar Tugas</span>
          </Link>
        </div>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6 text-xs">
          {/* Target Mapel & Rombel */}
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
              <label className="block font-semibold mb-1">Kelas Sasaran Penugasan</label>
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

          {/* Judul & Batas Waktu */}
          <div className="space-y-4">
            <div>
              <label className="block font-semibold mb-1">Judul Tugas Praktik</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Pembuatan REST API & Konfigurasi Row Level Security Supabase"
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold text-sm"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block font-semibold mb-1">Tenggat Waktu (Due Date)</label>
                <input
                  type="datetime-local"
                  required
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Metode Pengumpulan Jawaban</label>
                <select
                  value={submissionType}
                  onChange={(e) => setSubmissionType(e.target.value as SubmissionType)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                >
                  <option value="both">Teks & Berkas File (Rekomendasi)</option>
                  <option value="file">Hanya Berkas File (ZIP / PDF)</option>
                  <option value="text">Hanya Teks Kode / Link Git</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold mb-1">Bobot Penilaian (%)</label>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={weight}
                  onChange={(e) => setWeight(Number(e.target.value))}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                />
              </div>
            </div>
          </div>

          {/* Instruksi Pengerjaan */}
          <div>
            <label className="block font-semibold mb-1">Instruksi & Langkah Pengerjaan Tugas</label>
            <textarea
              rows={5}
              required
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="1. Buat skema database PostgreSQL&#10;2. Tuliskan kueri SQL DDL&#10;3. Unggah arsip ZIP file kodingan Anda..."
              className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
            />
          </div>

          {/* Rubrik Penilaian */}
          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <label className="block font-semibold">Rubrik Penilaian Asesmen</label>
            <div className="space-y-2">
              {rubric.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs bg-slate-50 dark:bg-slate-800/60"
                >
                  <span className="font-medium text-slate-800 dark:text-slate-200">{item.criteria}</span>
                  <div className="flex items-center gap-3">
                    <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                      Bobot {item.weight}%
                    </span>
                    <button
                      type="button"
                      onClick={() => handleRemoveRubric(item.id)}
                      className="p-1 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newCriteria}
                onChange={(e) => setNewCriteria(e.target.value)}
                placeholder="Kriteria penilaian baru..."
                className="flex-1 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
              <input
                type="number"
                value={newWeight}
                onChange={(e) => setNewWeight(Number(e.target.value))}
                placeholder="%"
                className="w-20 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
              />
              <button
                type="button"
                onClick={handleAddRubric}
                className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 font-semibold"
              >
                Tambah
              </button>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end gap-2">
            <Link
              href="/guru/assignments"
              className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300"
            >
              Batal
            </Link>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-2 shadow-md shadow-blue-600/20"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Terbitkan Tugas Praktik</span>
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
