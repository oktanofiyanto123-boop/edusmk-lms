'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  UploadCloud,
  FileText,
  Video,
  Presentation,
  Trash2,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  File,
  Plus,
  Play,
  Sparkles,
} from 'lucide-react';
import { useLms } from '@/lib/store';
import { TeachingMaterial, MaterialAttachment, PublicationStatus } from '@/lib/types';

interface MaterialModalProps {
  isOpen: boolean;
  onClose: () => void;
  materialToEdit?: TeachingMaterial | null;
  defaultRole?: 'admin' | 'guru';
}

export function extractYouTubeId(url: string): string | null {
  if (!url) return null;
  const regExp = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/;
  const match = url.match(regExp);
  return match ? match[1] : null;
}

export function getYouTubeEmbedUrl(url: string): string | null {
  const videoId = extractYouTubeId(url);
  return videoId ? `https://www.youtube.com/embed/${videoId}` : null;
}

export function MaterialModal({
  isOpen,
  onClose,
  materialToEdit,
  defaultRole = 'admin',
}: MaterialModalProps) {
  const { subjects, classes, users, currentUser, addMaterial, updateMaterial } = useLms();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isEditing = Boolean(materialToEdit);

  // Form states
  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [classId, setClassId] = useState('');
  const [teacherId, setTeacherId] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<PublicationStatus>('published');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [attachments, setAttachments] = useState<MaterialAttachment[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const teachers = users.filter((u) => u.role === 'guru');

  // Initialize form
  useEffect(() => {
    if (materialToEdit) {
      setTitle(materialToEdit.title || '');
      setSubjectId(materialToEdit.subject_id || (subjects[0]?.id || ''));
      setClassId(materialToEdit.class_id || (classes[0]?.id || ''));
      setTeacherId(materialToEdit.teacher_id || currentUser.id);
      setDescription(materialToEdit.description || '');
      setContent(materialToEdit.content || '');
      setStatus(materialToEdit.status || 'published');
      setYoutubeUrl(materialToEdit.youtube_url || '');
      setAttachments(materialToEdit.attachments ? [...materialToEdit.attachments] : []);
    } else {
      setTitle('');
      setSubjectId(subjects[0]?.id || '');
      setClassId(classes[0]?.id || '');
      // If admin, default to first teacher or current user
      setTeacherId(
        currentUser.role === 'admin'
          ? (teachers[0]?.id || currentUser.id)
          : currentUser.id
      );
      setDescription('');
      setContent('');
      setStatus('published');
      setYoutubeUrl('');
      setAttachments([]);
    }
    setErrorMsg('');
  }, [materialToEdit, isOpen, subjects, classes, currentUser, users]);

  if (!isOpen) return null;

  // Process chosen or dropped files
  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const newAttachments: MaterialAttachment[] = [];

    Array.from(files).forEach((file) => {
      const extension = file.name.split('.').pop()?.toLowerCase() || '';
      let fileType: MaterialAttachment['file_type'] = 'other';

      if (extension === 'pdf') {
        fileType = 'pdf';
      } else if (['ppt', 'pptx'].includes(extension)) {
        fileType = 'ppt';
      } else if (['doc', 'docx'].includes(extension)) {
        fileType = 'doc';
      } else if (['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(extension)) {
        fileType = 'image';
      }

      // Format size
      const sizeInMb = file.size / (1024 * 1024);
      const sizeString =
        sizeInMb >= 1
          ? `${sizeInMb.toFixed(1)} MB`
          : `${Math.round(file.size / 1024)} KB`;

      // Create preview URL
      const fileUrl = URL.createObjectURL(file);

      newAttachments.push({
        id: `att-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`,
        file_name: file.name,
        file_url: fileUrl,
        file_type: fileType,
        file_size: sizeString,
      });
    });

    setAttachments((prev) => [...prev, ...newAttachments]);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFiles(e.dataTransfer.files);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleRemoveAttachment = (id: string) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  // Add Preset sample files (helps testing and quick demo)
  const addSamplePdf = () => {
    const sample: MaterialAttachment = {
      id: `att-${Date.now()}`,
      file_name: 'Modul_Panduan_Praktik_Kejuruan.pdf',
      file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
      file_type: 'pdf',
      file_size: '3.4 MB',
    };
    setAttachments((prev) => [...prev, sample]);
  };

  const addSamplePpt = () => {
    const sample: MaterialAttachment = {
      id: `att-${Date.now()}`,
      file_name: 'Slide_Presentasi_Materi_Teori.pptx',
      file_url: 'https://view.officeapps.live.com/op/view.aspx?src=https%3A%2F%2Ffile-examples.com%2Fstorage%2Ffe8c279c1664bf87b8f9e61%2F2017%2F08%2Ffile_example_PPT_1MB.ppt',
      file_type: 'ppt',
      file_size: '5.2 MB',
    };
    setAttachments((prev) => [...prev, sample]);
  };

  const addSampleYoutube = () => {
    setYoutubeUrl('https://www.youtube.com/watch?v=wm5gMKuwSYk');
  };

  const youtubeEmbedUrl = getYouTubeEmbedUrl(youtubeUrl);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setErrorMsg('Judul Modul Materi wajib diisi.');
      return;
    }
    if (!subjectId) {
      setErrorMsg('Pilih Mata Pelajaran.');
      return;
    }
    if (!classId) {
      setErrorMsg('Pilih Kelas Sasaran.');
      return;
    }

    const selectedSubject = subjects.find((s) => s.id === subjectId);
    const selectedClass = classes.find((c) => c.id === classId);
    const selectedTeacher = users.find((u) => u.id === teacherId) || currentUser;

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    if (isEditing && materialToEdit) {
      updateMaterial(materialToEdit.id, {
        title,
        slug,
        subject_id: subjectId,
        subject_name: selectedSubject?.name,
        class_id: classId,
        class_name: selectedClass?.name,
        teacher_id: selectedTeacher.id,
        teacher_name: selectedTeacher.full_name,
        description,
        content: content || 'Modul materi instruksional SMK.',
        status,
        youtube_url: youtubeUrl.trim() || undefined,
        attachments,
      });
    } else {
      addMaterial({
        title,
        slug,
        subject_id: subjectId,
        subject_name: selectedSubject?.name,
        class_id: classId,
        class_name: selectedClass?.name,
        teacher_id: selectedTeacher.id,
        teacher_name: selectedTeacher.full_name,
        description: description || 'Modul pembelajaran digital SMK.',
        content: content || 'Modul materi instruksional SMK.',
        status,
        youtube_url: youtubeUrl.trim() || undefined,
        attachments,
        order_index: 1,
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl w-full max-w-3xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/60 dark:bg-slate-800/40">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <UploadCloud className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-white">
                {isEditing ? 'Perbarui Modul Materi Sekolah' : 'Tambah & Upload Modul Materi'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Mendukung upload berkas presentasi PPT, dokumen PDF, dan video YouTube
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {errorMsg && (
            <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-900 text-rose-700 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Quick Demo Pre-fill Bar */}
          <div className="p-3 rounded-2xl bg-gradient-to-r from-blue-50/80 via-emerald-50/80 to-purple-50/80 dark:from-blue-950/20 dark:via-emerald-950/20 dark:to-purple-950/20 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-slate-300">
              <Sparkles className="w-4 h-4 text-amber-500" />
              <span>Sampel Cepat Pengujian:</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <button
                type="button"
                onClick={addSamplePdf}
                className="px-2.5 py-1 rounded-lg bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 text-[11px] font-semibold hover:bg-rose-200 transition-colors flex items-center gap-1"
              >
                <FileText className="w-3.5 h-3.5" />
                <span>+ Contoh PDF</span>
              </button>
              <button
                type="button"
                onClick={addSamplePpt}
                className="px-2.5 py-1 rounded-lg bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 text-[11px] font-semibold hover:bg-amber-200 transition-colors flex items-center gap-1"
              >
                <Presentation className="w-3.5 h-3.5" />
                <span>+ Contoh Slide PPT</span>
              </button>
              <button
                type="button"
                onClick={addSampleYoutube}
                className="px-2.5 py-1 rounded-lg bg-red-100 dark:bg-red-950/60 text-red-700 dark:text-red-300 text-[11px] font-semibold hover:bg-red-200 transition-colors flex items-center gap-1"
              >
                <Play className="w-3.5 h-3.5" />
                <span>+ Contoh Video YT</span>
              </button>
            </div>
          </div>

          {/* Basic Info */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Judul Modul Materi <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Modul & Presentasi: Arsitektur Mikrokontroler Industri"
                className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Mata Pelajaran <span className="text-rose-500">*</span>
                </label>
                <select
                  value={subjectId}
                  onChange={(e) => setSubjectId(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {subjects.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Kelas Sasaran <span className="text-rose-500">*</span>
                </label>
                <select
                  value={classId}
                  onChange={(e) => setClassId(e.target.value)}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
                >
                  {classes.map((cls) => (
                    <option key={cls.id} value={cls.id}>
                      {cls.name}
                    </option>
                  ))}
                </select>
              </div>

              {/* Teacher selector (especially useful for Admin) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                  Guru Pengampu / Pembuat
                </label>
                <select
                  value={teacherId}
                  onChange={(e) => setTeacherId(e.target.value)}
                  disabled={currentUser.role === 'guru'}
                  className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none disabled:opacity-75"
                >
                  {teachers.map((tch) => (
                    <option key={tch.id} value={tch.id}>
                      {tch.full_name}
                    </option>
                  ))}
                  {currentUser.role === 'admin' && (
                    <option value={currentUser.id}>{currentUser.full_name} (Administrator)</option>
                  )}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Deskripsi Singkat Modul
              </label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Deskripsi singkat tujuan materi, panduan praktikum kejuruan, atau silabus materi..."
                className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Section: Upload Modul (PDF / PPT / Berkas) */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
                  <span>Upload Berkas Modul Pembelajaran (PDF / PPT)</span>
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Unggah berkas presentasi Microsoft PowerPoint (.ppt, .pptx) atau dokumen (.pdf)
                </p>
              </div>
              <span className="text-[11px] font-mono font-semibold px-2 py-0.5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                {attachments.length} Berkas
              </span>
            </div>

            {/* Drag & Drop Area */}
            <div
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                isDragging
                  ? 'border-emerald-500 bg-emerald-50/60 dark:bg-emerald-950/40 scale-[0.99]'
                  : 'border-slate-200 dark:border-slate-700 hover:border-emerald-500/60 bg-white dark:bg-slate-900'
              }`}
            >
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept=".pdf,.ppt,.pptx,application/pdf,application/vnd.ms-powerpoint,application/vnd.openxmlformats-officedocument.presentationml.presentation,.doc,.docx"
                onChange={(e) => handleFiles(e.target.files)}
                className="hidden"
              />
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 dark:bg-emerald-950/70 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-3">
                <UploadCloud className="w-6 h-6" />
              </div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Tarik & Letakkan Berkas PDF atau PPT di sini, atau{' '}
                <span className="text-emerald-600 dark:text-emerald-400 underline">Pilih Berkas</span>
              </p>
              <p className="text-[11px] text-slate-400 mt-1">
                Format didukung: <strong>PDF (.pdf)</strong>, <strong>PowerPoint (.ppt, .pptx)</strong>, Dokumen Word (.docx) hingga 50MB
              </p>
            </div>

            {/* List of Attachments */}
            {attachments.length > 0 && (
              <div className="space-y-2 pt-2">
                <p className="text-[11px] font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  Berkas Terlampir:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {attachments.map((att) => {
                    const isPdf = att.file_type === 'pdf' || att.file_name.toLowerCase().endsWith('.pdf');
                    const isPpt =
                      att.file_type === 'ppt' ||
                      att.file_name.toLowerCase().endsWith('.ppt') ||
                      att.file_name.toLowerCase().endsWith('.pptx');

                    return (
                      <div
                        key={att.id}
                        className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 flex items-center justify-between gap-3 shadow-2xs"
                      >
                        <div className="flex items-center gap-2.5 min-w-0">
                          <div
                            className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                              isPdf
                                ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
                                : isPpt
                                ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400'
                                : 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400'
                            }`}
                          >
                            {isPdf ? (
                              <FileText className="w-4 h-4" />
                            ) : isPpt ? (
                              <Presentation className="w-4 h-4" />
                            ) : (
                              <File className="w-4 h-4" />
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                              {att.file_name}
                            </p>
                            <div className="flex items-center gap-1.5 text-[10px] text-slate-400">
                              <span
                                className={`px-1.5 py-0.2 rounded font-mono font-bold uppercase ${
                                  isPdf
                                    ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                                    : isPpt
                                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                                    : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                                }`}
                              >
                                {isPdf ? 'PDF' : isPpt ? 'PPT' : att.file_type}
                              </span>
                              <span>•</span>
                              <span>{att.file_size}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-1 shrink-0">
                          {att.file_url && (
                            <a
                              href={att.file_url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
                              title="Buka / Unduh Berkas"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveAttachment(att.id)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors"
                            title="Hapus Lampiran"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Section: Video YouTube */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/30 space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-2">
                  <Video className="w-4 h-4 text-rose-500" />
                  <span>Tautan Video Praktik / Teori (YouTube)</span>
                </h3>
                <p className="text-[11px] text-slate-500 dark:text-slate-400">
                  Masukkan link video tutorial atau demonstrasi praktikum dari YouTube
                </p>
              </div>
              {youtubeEmbedUrl && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/70 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-800">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>URL Terverifikasi</span>
                </span>
              )}
            </div>

            <div className="space-y-3">
              <div className="relative">
                <input
                  type="url"
                  value={youtubeUrl}
                  onChange={(e) => setYoutubeUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=... atau https://youtu.be/..."
                  className="w-full text-xs p-3 pr-10 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
                {youtubeUrl && (
                  <button
                    type="button"
                    onClick={() => setYoutubeUrl('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 text-xs"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* YouTube Live Embed Preview */}
              {youtubeEmbedUrl && (
                <div className="rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-black aspect-video max-h-56 w-full shadow-md">
                  <iframe
                    src={youtubeEmbedUrl}
                    title="Pratinjau Video YouTube"
                    className="w-full h-full border-0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              )}
            </div>
          </div>

          {/* Section: Catatan & Rangkuman Materi */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1.5">
              Rangkuman / Catatan Instruksi Guru (Opsional)
            </label>
            <textarea
              rows={4}
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Tuliskan catatan arahan guru, instruksi langkah praktikum, atau panduan pengerjaan tugas modul..."
              className="w-full text-xs p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:outline-none"
            />
          </div>

          {/* Status */}
          <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
            <div>
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200">Status Modul Pembelajaran</p>
              <p className="text-[11px] text-slate-500">
                Pilih apakah modul langsung dapat diakses siswa atau disimpan sebagai draf
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setStatus('published')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  status === 'published'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                Terbitkan
              </button>
              <button
                type="button"
                onClick={() => setStatus('draft')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  status === 'draft'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
                }`}
              >
                Draf
              </button>
            </div>
          </div>

          {/* Action Footer */}
          <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-lg shadow-emerald-600/20 flex items-center gap-2 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isEditing ? 'Simpan Perubahan Modul' : 'Terbitkan Modul Materi'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
