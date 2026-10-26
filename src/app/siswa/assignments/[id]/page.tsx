'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useLms } from '@/lib/store';
import {
  ClipboardList,
  CheckCircle2,
  Calendar,
  Clock,
  UploadCloud,
  FileText,
  ArrowLeft,
  Send,
  MessageSquare,
  Award,
  AlertCircle,
  FileCheck,
} from 'lucide-react';
import { formatDate, formatDateTime, getStatusBadge } from '@/lib/utils';
import Link from 'next/link';

function AssignmentDetailContent() {
  const params = useParams();
  const router = useRouter();
  const assignmentId = params.id as string;

  const { assignments, submissions, submitAssignment, currentUser } = useLms();
  const assignment = assignments.find((a) => a.id === assignmentId);
  const mySubmission = submissions.find(
    (s) => s.assignment_id === assignmentId && s.student_id === currentUser.id
  );

  const [textContent, setTextContent] = useState(mySubmission?.content || '');
  const [fileName, setFileName] = useState(mySubmission?.file_name || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(false);

  if (!assignment) {
    return (
      <DashboardLayout title="Tugas Tidak Ditemukan">
        <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <p className="text-sm text-slate-500">Tugas yang Anda cari tidak ditemukan.</p>
          <Link href="/siswa/assignments" className="inline-flex px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold">
            Kembali ke Daftar Tugas
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textContent && !fileName) {
      alert('Mohon isi jawaban teks atau masukkan nama berkas lampiran tugas.');
      return;
    }

    setIsSubmitting(true);

    setTimeout(() => {
      submitAssignment({
        assignment_id: assignment.id,
        assignment_title: assignment.title,
        student_id: currentUser.id,
        student_name: currentUser.full_name,
        student_nisn: currentUser.nisn_nip,
        student_avatar: currentUser.avatar_url,
        content: textContent,
        file_name: fileName || undefined,
        file_url: fileName ? 'https://raw.githubusercontent.com/siswa/project/main/submission.zip' : undefined,
        file_size: fileName ? '4.8 MB' : undefined,
      });

      setIsSubmitting(false);
      setSuccessMessage(true);
      setTimeout(() => setSuccessMessage(false), 4000);
    }, 500);
  };

  const badge = mySubmission ? getStatusBadge(mySubmission.status) : null;

  return (
    <DashboardLayout
      title={assignment.title}
      subtitle={`Mata Pelajaran: ${assignment.subject_name} • Batas Tenggat: ${formatDate(assignment.due_date)}`}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/siswa/assignments"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Daftar Tugas</span>
          </Link>

          {badge && (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${badge.className}`}>
              {badge.label}
            </span>
          )}
        </div>

        {successMessage && (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2.5 text-xs text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Tugas praktik Anda berhasil dikumpulkan ke sistem pengajar!</span>
          </div>
        )}

        {/* Jika sudah dinilai: Tampilkan Nilai & Catatan Guru */}
        {mySubmission && mySubmission.score !== undefined && (
          <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-900 via-teal-900 to-slate-900 text-white shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs uppercase font-bold tracking-wider text-emerald-300 flex items-center gap-1.5">
                <Award className="w-4 h-4" />
                <span>Hasil Penilaian & Evaluasi Guru</span>
              </span>
              <span className="font-mono text-xs text-slate-300">
                Dinilai oleh {mySubmission.graded_by}
              </span>
            </div>

            <div className="flex items-baseline gap-3">
              <span className="font-mono text-4xl sm:text-5xl font-black text-white">
                {mySubmission.score}
              </span>
              <span className="text-slate-300 text-sm">/ 100 Poin</span>
            </div>

            {mySubmission.feedback && (
              <div className="pt-2 border-t border-emerald-800/80">
                <p className="text-xs text-emerald-200 font-semibold mb-1">Catatan Umpan Balik Guru:</p>
                <p className="text-xs sm:text-sm text-slate-200 leading-relaxed italic bg-emerald-950/40 p-3 rounded-xl border border-emerald-800/40">
                  "{mySubmission.feedback}"
                </p>
              </div>
            )}
          </div>
        )}

        {/* Uraian Instruksi Tugas */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500">
              <span className="flex items-center gap-1 text-rose-500 font-medium">
                <Calendar className="w-3.5 h-3.5" />
                <span>Tenggat: {formatDate(assignment.due_date)}</span>
              </span>
              <span>• Bobot Penilaian: {assignment.weight}% Rapor</span>
              <span>• Skor Maksimal: {assignment.max_score} Poin</span>
            </div>

            <h3 className="text-base font-bold text-slate-900 dark:text-white">
              Petunjuk & Langkah Pengerjaan
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800 font-mono">
              {assignment.instructions}
            </p>
          </div>

          {/* Rubrik Penilaian */}
          {assignment.rubric && assignment.rubric.length > 0 && (
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                Rubrik Penilaian yang Digunakan Guru:
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {assignment.rubric.map((r) => (
                  <div
                    key={r.id}
                    className="p-2.5 rounded-lg border border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/40"
                  >
                    <span className="text-slate-700 dark:text-slate-300">{r.criteria}</span>
                    <span className="font-mono font-bold text-blue-600 dark:text-blue-400">
                      {r.weight}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Formulir Pengumpulan Tugas */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <UploadCloud className="w-4 h-4 text-blue-600" />
              <span>Formulir Pengumpulan Jawaban Tugas</span>
            </h3>
            {mySubmission && (
              <span className="text-[11px] text-slate-400">
                Terakhir dikumpulkan: {formatDateTime(mySubmission.submitted_at)}
              </span>
            )}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold mb-1">
                Jawaban Teks, Catatan Penjelasan, atau Tautan Repositori GitHub
              </label>
              <textarea
                rows={5}
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="Tuliskan dokumentasi kodingan, cara menjalankan proyek, atau tautan GitHub repository Anda..."
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 leading-relaxed font-sans"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">
                Nama File Lampiran Arsip (ZIP / PDF)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={fileName}
                  onChange={(e) => setFileName(e.target.value)}
                  placeholder="Contoh: Proyek_LMS_AhmadRizky_XII_RPL_1.zip"
                  className="flex-1 p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                />
              </div>
              <p className="text-[11px] text-slate-400 mt-1">
                Format yang diperbolehkan: .zip, .rar, .pdf, .png (Maksimal 25MB). File akan diunggah ke Supabase Storage.
              </p>
            </div>

            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <p className="text-[11px] text-slate-400">
                {mySubmission ? 'Anda dapat mengirim ulang untuk memperbarui berkas tugas.' : 'Pastikan seluruh berkas telah lengkap sebelum mengirim.'}
              </p>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-2 shadow-md shadow-blue-600/20 disabled:opacity-50 transition-all"
              >
                {isSubmitting ? (
                  <span>Mengirimkan berkas...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{mySubmission ? 'Kirim Pembaruan Tugas' : 'Kumpulkan Tugas Sekarang'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function AssignmentDetailPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8 text-center text-xs text-slate-400">Memuat rincian tugas...</div>}>
      <AssignmentDetailContent />
    </React.Suspense>
  );
}
