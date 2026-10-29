'use client';

import React, { useState, useRef } from 'react';
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
  File,
  Presentation,
  Code,
  Table,
  FolderArchive,
  Download,
  ExternalLink,
  Trash2,
  Sparkles,
  RefreshCw,
} from 'lucide-react';
import { formatDate, formatDateTime, getStatusBadge } from '@/lib/utils';
import Link from 'next/link';

// Helper to categorize any file type and provide appropriate visual styling
export function getFileCategoryInfo(fileName: string) {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';

  if (['pdf'].includes(ext)) {
    return {
      category: 'pdf',
      label: 'PDF Dokumen',
      badgeClass: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border-rose-200 dark:border-rose-900',
      iconClass: 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400',
      icon: FileText,
    };
  }
  if (['doc', 'docx', 'odt', 'rtf'].includes(ext)) {
    return {
      category: 'word',
      label: 'Word Dokumen',
      badgeClass: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-900',
      iconClass: 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400',
      icon: FileText,
    };
  }
  if (['ppt', 'pptx', 'odp'].includes(ext)) {
    return {
      category: 'ppt',
      label: 'Slide Presentasi PPT',
      badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-900',
      iconClass: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400',
      icon: Presentation,
    };
  }
  if (['xls', 'xlsx', 'csv', 'ods'].includes(ext)) {
    return {
      category: 'excel',
      label: 'Spreadsheet Excel',
      badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900',
      iconClass: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400',
      icon: Table,
    };
  }
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) {
    return {
      category: 'archive',
      label: 'Arsip Terkompresi ZIP/RAR',
      badgeClass: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border-purple-200 dark:border-purple-900',
      iconClass: 'bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400',
      icon: FolderArchive,
    };
  }
  if (['c', 'cpp', 'h', 'hpp', 'ino', 'py', 'java', 'js', 'ts', 'jsx', 'tsx', 'html', 'css', 'json', 'php', 'sql', 'sh', 'hex', 'bin'].includes(ext)) {
    return {
      category: 'code',
      label: 'Source Code / Proyek Kejuruan',
      badgeClass: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300 border-cyan-200 dark:border-cyan-900',
      iconClass: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-950/60 dark:text-cyan-400',
      icon: Code,
    };
  }
  if (['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg', 'bmp', 'psd', 'ai'].includes(ext)) {
    return {
      category: 'image',
      label: 'Berkas Desain / Gambar',
      badgeClass: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-200 dark:border-indigo-900',
      iconClass: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400',
      icon: FileText,
    };
  }
  return {
    category: 'other',
    label: ext ? `Berkas .${ext.toUpperCase()}` : 'Berkas Tugas',
    badgeClass: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    iconClass: 'bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
    icon: File,
  };
}

function AssignmentDetailContent() {
  const params = useParams();
  const router = useRouter();
  const assignmentId = params.id as string;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const { assignments, submissions, submitAssignment, currentUser } = useLms();
  const assignment = assignments.find((a) => a.id === assignmentId);
  const mySubmission = submissions.find(
    (s) => s.assignment_id === assignmentId && s.student_id === currentUser.id
  );

  const [textContent, setTextContent] = useState(mySubmission?.content || '');
  const [fileName, setFileName] = useState(mySubmission?.file_name || '');
  const [fileUrl, setFileUrl] = useState(mySubmission?.file_url || '');
  const [fileSize, setFileSize] = useState(mySubmission?.file_size || '');
  const [isDragging, setIsDragging] = useState(false);
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

  // Handle file selection from local filesystem (all file types supported)
  const handleFile = (file: File) => {
    const sizeInMb = file.size / (1024 * 1024);
    const sizeString =
      sizeInMb >= 1
        ? `${sizeInMb.toFixed(1)} MB`
        : `${Math.max(1, Math.round(file.size / 1024))} KB`;

    const blobUrl = URL.createObjectURL(file);

    setFileName(file.name);
    setFileSize(sizeString);
    setFileUrl(blobUrl);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleRemoveFile = () => {
    setFileName('');
    setFileSize('');
    setFileUrl('');
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  // Preset demo samples
  const setSampleZip = () => {
    setFileName(`Proyek_Praktik_${currentUser.full_name.replace(/\s+/g, '_')}.zip`);
    setFileSize('14.2 MB');
    setFileUrl('https://raw.githubusercontent.com/siswa/project/main/submission.zip');
  };

  const setSamplePdf = () => {
    setFileName(`Laporan_Hasil_Praktikum_${currentUser.full_name.replace(/\s+/g, '_')}.pdf`);
    setFileSize('3.5 MB');
    setFileUrl('https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf');
  };

  const setSamplePpt = () => {
    setFileName(`Presentasi_Sidang_Praktik_${currentUser.full_name.replace(/\s+/g, '_')}.pptx`);
    setFileSize('8.4 MB');
    setFileUrl('https://view.officeapps.live.com/op/view.aspx?src=https%3A%2F%2Ffile-examples.com%2Fstorage%2Ffe8c279c1664bf87b8f9e61%2F2017%2F08%2Ffile_example_PPT_1MB.ppt');
  };

  const setSampleCode = () => {
    setFileName(`Firmware_Kendali_Aktuator_ESP32.ino`);
    setFileSize('48 KB');
    setFileUrl('https://raw.githubusercontent.com/siswa/project/main/main.ino');
  };

  const setSampleExcel = () => {
    setFileName(`Data_Hasil_Pengukuran_Sensor.xlsx`);
    setFileSize('1.2 MB');
    setFileUrl('https://raw.githubusercontent.com/siswa/project/main/data.xlsx');
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!textContent && !fileName) {
      alert('Mohon isi jawaban teks atau upload berkas tugas praktik.');
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
        file_url: fileUrl || (fileName ? 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf' : undefined),
        file_size: fileSize || (fileName ? '2.5 MB' : undefined),
      });

      setIsSubmitting(false);
      setSuccessMessage(true);
      setTimeout(() => setSuccessMessage(false), 4000);
    }, 400);
  };

  const badge = mySubmission ? getStatusBadge(mySubmission.status) : null;
  const fileCategory = fileName ? getFileCategoryInfo(fileName) : null;

  return (
    <DashboardLayout
      title={assignment.title}
      subtitle={`Mata Pelajaran: ${assignment.subject_name} • Batas Tenggat: ${formatDate(assignment.due_date)}`}
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/siswa/assignments"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Tugas Praktik Saya</span>
          </Link>

          {badge && (
            <span className={`px-3 py-1 rounded-full text-xs font-semibold border ${badge.className}`}>
              {badge.label}
            </span>
          )}
        </div>

        {successMessage && (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2.5 text-xs text-emerald-700 dark:text-emerald-300 shadow-xs animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span className="font-semibold">
              Berkas tugas praktik Anda berhasil dikumpulkan dan tercatat di sistem pengajar!
            </span>
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
                Dinilai oleh {mySubmission.graded_by || 'Guru Pengampu'}
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

        {/* Uraian Petunjuk & Langkah Pengerjaan Tugas */}
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

        {/* Berkas Tugas yang Telah Dikumpulkan Sebelumnya (Jika Ada) */}
        {mySubmission && mySubmission.file_name && (
          <div className="bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-2xs space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-600" />
                <span>Berkas Tugas yang Telah Dikumpulkan</span>
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                {formatDateTime(mySubmission.submitted_at)}
              </span>
            </div>

            <div className="p-3.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                    {mySubmission.file_name}
                  </p>
                  <p className="text-[10px] text-slate-400 font-mono">
                    {mySubmission.file_size || 'Berkas tugas terunggah'}
                  </p>
                </div>
              </div>

              {mySubmission.file_url && (
                <a
                  href={mySubmission.file_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5 shrink-0 self-start sm:self-auto transition-colors shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh / Buka Berkas</span>
                </a>
              )}
            </div>
          </div>
        )}

        {/* Formulir Upload dan Pengumpulan Tugas (Mendukung SEMUA Jenis Berkas) */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-blue-600" />
                <span>Upload Berkas & Jawaban Tugas Praktik</span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Mendukung <strong>semua format file</strong>: ZIP/RAR, PDF, Word, PPT, Excel, Source Code, Gambar, CAD, dsb.
              </p>
            </div>
          </div>

          {/* Quick Preset Samples for Testing */}
          <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-50/80 via-indigo-50/80 to-purple-50/80 dark:from-blue-950/20 dark:via-indigo-950/20 dark:to-purple-950/20 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
            <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Simulasi Cepat Jenis File:</span>
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                type="button"
                onClick={setSampleZip}
                className="px-2 py-1 rounded-lg bg-purple-100 dark:bg-purple-950/60 text-purple-700 dark:text-purple-300 text-[10px] font-bold hover:bg-purple-200 transition-colors"
              >
                + ZIP Proyek
              </button>
              <button
                type="button"
                onClick={setSamplePdf}
                className="px-2 py-1 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-[10px] font-bold hover:bg-rose-200 transition-colors"
              >
                + PDF Laporan
              </button>
              <button
                type="button"
                onClick={setSamplePpt}
                className="px-2 py-1 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[10px] font-bold hover:bg-amber-200 transition-colors"
              >
                + Slide PPT
              </button>
              <button
                type="button"
                onClick={setSampleCode}
                className="px-2 py-1 rounded-lg bg-cyan-100 dark:bg-cyan-950/60 text-cyan-800 dark:text-cyan-300 text-[10px] font-bold hover:bg-cyan-200 transition-colors"
              >
                + Source Code (.ino)
              </button>
              <button
                type="button"
                onClick={setSampleExcel}
                className="px-2 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold hover:bg-emerald-200 transition-colors"
              >
                + Data Excel (.xlsx)
              </button>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5 text-xs">
            {/* File Upload Dropzone (All Files) */}
            <div className="space-y-2">
              <label className="block font-bold text-slate-800 dark:text-slate-200">
                Pilih Berkas Tugas Praktik Anda (Semua Format Diperbolehkan)
              </label>

              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                  isDragging
                    ? 'border-blue-500 bg-blue-50/60 dark:bg-blue-950/40 scale-[0.99]'
                    : 'border-slate-200 dark:border-slate-700 hover:border-blue-500/60 bg-slate-50/50 dark:bg-slate-800/30'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="*/*"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      handleFile(e.target.files[0]);
                    }
                  }}
                  className="hidden"
                />
                <div className="w-12 h-12 rounded-2xl bg-blue-50 dark:bg-blue-950/70 text-blue-600 dark:text-blue-400 flex items-center justify-center mx-auto mb-2">
                  <UploadCloud className="w-6 h-6" />
                </div>
                <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                  Tarik & Letakkan Berkas Tugas di sini, atau{' '}
                  <span className="text-blue-600 dark:text-blue-400 underline">Sentuh / Pilih Berkas dari HP atau Komputer</span>
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  Bebas mengunggah berkas apa pun: <strong>.zip, .rar, .pdf, .docx, .pptx, .xlsx, .c, .cpp, .ino, .py, .png, .jpg</strong> tanpa batasan tipe file.
                </p>
              </div>

              {/* Selected File Card Display */}
              {fileName && fileCategory && (
                <div className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-2xs flex items-center justify-between gap-3 animate-in fade-in">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${fileCategory.iconClass}`}>
                      <fileCategory.icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                        {fileName}
                      </p>
                      <div className="flex items-center gap-2 text-[10px] text-slate-400 mt-0.5">
                        <span className={`px-1.5 py-0.2 rounded font-mono font-bold uppercase border ${fileCategory.badgeClass}`}>
                          {fileCategory.label}
                        </span>
                        <span>•</span>
                        <span>{fileSize || 'Ukuran siap kirim'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    {fileUrl && (
                      <a
                        href={fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
                        title="Buka / Unduh Berkas Ini"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                    <button
                      type="button"
                      onClick={handleRemoveFile}
                      className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors"
                      title="Hapus Berkas Ini"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Optional Text Documentation / Repository URL */}
            <div>
              <label className="block font-bold text-slate-800 dark:text-slate-200 mb-1">
                Catatan Penjelasan, Langkah Praktik, atau Link Repository GitHub (Opsional)
              </label>
              <textarea
                rows={4}
                value={textContent}
                onChange={(e) => setTextContent(e.target.value)}
                placeholder="Tuliskan dokumentasi pengerjaan, instruksi cara kompilasi kode/program, atau catatan tambahan untuk guru..."
                className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white leading-relaxed font-sans focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Submit Action */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="text-[11px] text-slate-400">
                {mySubmission
                  ? 'Anda dapat mengunggah berkas baru kapan saja untuk memperbarui pengumpulan tugas.'
                  : 'Pastikan berkas tugas telah sesuai sebelum mengklik tombol kumpulkan.'}
              </p>
              <button
                type="submit"
                disabled={isSubmitting || (!fileName && !textContent)}
                className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold flex items-center justify-center gap-2 shadow-md shadow-blue-600/20 disabled:opacity-50 transition-all cursor-pointer"
              >
                {isSubmitting ? (
                  <span>Mengirimkan berkas tugas...</span>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    <span>{mySubmission ? 'Kirim Pembaruan Berkas Tugas' : 'Kumpulkan Tugas Sekarang'}</span>
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
