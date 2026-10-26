'use client';

import React, { useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useLms } from '@/lib/store';
import {
  FileCheck,
  Search,
  Filter,
  CheckCircle2,
  Clock,
  Download,
  Award,
  X,
  Send,
  MessageSquare,
  FileText,
} from 'lucide-react';
import { formatDateTime, getStatusBadge } from '@/lib/utils';
import { Submission } from '@/lib/types';

function GuruGradingContent() {
  const searchParams = useSearchParams();
  const initialAssignmentId = searchParams.get('assignmentId') || 'all';

  const { assignments, submissions, gradeSubmission, currentUser } = useLms();
  const [selectedAssignmentId, setSelectedAssignmentId] = useState<string>(initialAssignmentId);
  const [selectedSubmission, setSelectedSubmission] = useState<Submission | null>(null);

  // Form states for grading
  const [scoreInput, setScoreInput] = useState<number>(90);
  const [feedbackInput, setFeedbackInput] = useState<string>('');

  const filteredSubmissions = submissions.filter((s) => {
    if (selectedAssignmentId === 'all') return true;
    return s.assignment_id === selectedAssignmentId;
  });

  const handleOpenGradeModal = (subm: Submission) => {
    setSelectedSubmission(subm);
    setScoreInput(subm.score || 85);
    setFeedbackInput(subm.feedback || 'Kerja bagus! Struktur kode rapi dan memenuhi kriteria.');
  };

  const handleSaveGrade = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubmission) return;

    gradeSubmission(
      selectedSubmission.id,
      Number(scoreInput),
      feedbackInput,
      currentUser.full_name
    );

    setSelectedSubmission(null);
  };

  return (
    <DashboardLayout
      title="Penilaian Tugas & Umpan Balik Siswa"
      subtitle="Evaluasi Hasil Kerja Siswa, Berikan Skor Angka, dan Saran Konstruktif"
    >
      <div className="space-y-6">
        {/* Filter Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-500">Pilih Tugas:</span>
            <select
              value={selectedAssignmentId}
              onChange={(e) => setSelectedAssignmentId(e.target.value)}
              className="text-xs p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
            >
              <option value="all">Semua Tugas Praktik ({submissions.length})</option>
              {assignments.map((a) => (
                <option key={a.id} value={a.id}>
                  {a.title} ({a.class_name})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Submissions Table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Nama Siswa</th>
                  <th className="py-3 px-4">Judul Tugas</th>
                  <th className="py-3 px-4">Waktu Mengumpulkan</th>
                  <th className="py-3 px-4">Status Pengumpulan</th>
                  <th className="py-3 px-4">Nilai Diperoleh</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {filteredSubmissions.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      Belum ada siswa yang mengumpulkan tugas untuk kriteria ini.
                    </td>
                  </tr>
                ) : (
                  filteredSubmissions.map((subm) => {
                    const badge = getStatusBadge(subm.status);
                    return (
                      <tr key={subm.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <td className="py-3 px-4 flex items-center gap-3">
                          <img
                            src={subm.student_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80'}
                            alt={subm.student_name}
                            className="w-8 h-8 rounded-full object-cover shrink-0"
                          />
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">{subm.student_name}</p>
                            <p className="font-mono text-[11px] text-slate-400">{subm.student_nisn}</p>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-medium max-w-xs truncate">
                          {subm.assignment_title}
                        </td>
                        <td className="py-3 px-4 text-slate-500 text-[11px]">
                          {formatDateTime(subm.submitted_at)}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${badge.className}`}>
                            {badge.label}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          {subm.score !== undefined ? (
                            <span className="font-mono font-bold text-sm text-emerald-600 dark:text-emerald-400">
                              {subm.score} / 100
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[11px]">Belum Dinilai</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleOpenGradeModal(subm)}
                            className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-xs"
                          >
                            {subm.score !== undefined ? 'Ubah Nilai' : 'Beri Nilai'}
                          </button>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Penilaian Tugas */}
        {selectedSubmission && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    Penilaian Tugas Siswa
                  </h3>
                  <p className="text-xs text-slate-500">
                    {selectedSubmission.student_name} ({selectedSubmission.student_nisn})
                  </p>
                </div>
                <button onClick={() => setSelectedSubmission(null)}>
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              {/* Uraian Tugas & Jawaban Siswa */}
              <div className="space-y-3 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-xl text-xs">
                <p className="font-semibold text-slate-900 dark:text-white">Jawaban Siswa:</p>
                <p className="text-slate-700 dark:text-slate-300 whitespace-pre-line leading-relaxed bg-white dark:bg-slate-900 p-3 rounded-lg border border-slate-200 dark:border-slate-700">
                  {selectedSubmission.content || 'Siswa tidak menyertakan teks keterangan tambahan.'}
                </p>

                {selectedSubmission.file_name && (
                  <div className="flex items-center justify-between p-2.5 bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-600" />
                      <span className="font-medium text-slate-800 dark:text-slate-200">{selectedSubmission.file_name}</span>
                      <span className="text-[10px] text-slate-400">({selectedSubmission.file_size || '3.2 MB'})</span>
                    </div>
                    <a
                      href={selectedSubmission.file_url || '#'}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Unduh File</span>
                    </a>
                  </div>
                )}
              </div>

              {/* Form Input Nilai & Umpan Balik */}
              <form onSubmit={handleSaveGrade} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold mb-1">Nilai Angka (Skala 0 - 100)</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    required
                    value={scoreInput}
                    onChange={(e) => setScoreInput(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono font-bold text-base text-blue-600 dark:text-blue-400"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Catatan & Umpan Balik Konstruktif Guru</label>
                  <textarea
                    rows={4}
                    required
                    value={feedbackInput}
                    onChange={(e) => setFeedbackInput(e.target.value)}
                    placeholder="Tuliskan apresiasi, saran perbaikan, atau catatan rubrik untuk siswa..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 leading-relaxed"
                  />
                </div>

                <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setSelectedSubmission(null)}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold flex items-center gap-2 shadow-md shadow-emerald-600/20"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Simpan & Publikasikan Nilai</span>
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

export default function GuruGradingPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8 text-center text-xs text-slate-400">Memuat portal penilaian...</div>}>
      <GuruGradingContent />
    </React.Suspense>
  );
}
