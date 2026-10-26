'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useLms } from '@/lib/store';
import {
  FileText,
  Plus,
  Trash2,
  Video,
  UploadCloud,
  CheckCircle2,
  ArrowLeft,
  Save,
  Layers,
  BookOpen,
} from 'lucide-react';
import { PublicationStatus, SubChapter, MaterialAttachment } from '@/lib/types';
import Link from 'next/link';

export default function CreateMaterialPage() {
  const router = useRouter();
  const { classes, subjects, addMaterial, currentUser } = useLms();

  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState(subjects[0]?.id || '');
  const [classId, setClassId] = useState(classes[0]?.id || '');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [youtubeUrl, setYoutubeUrl] = useState('');
  const [objectives, setObjectives] = useState<string[]>([
    'Memahami konsep dasar arsitektur sistem',
  ]);
  const [newObjective, setNewObjective] = useState('');
  const [subchapters, setSubchapters] = useState<SubChapter[]>([
    {
      id: 'sub-1',
      title: 'Bab 1: Konsep & Teori Dasar',
      content: 'Penjelasan teori mendalam dan relevansi dengan standar industri kompetensi SMK.',
    },
  ]);
  const [attachments, setAttachments] = useState<MaterialAttachment[]>([]);
  const [newFileName, setNewFileName] = useState('');

  const handleAddObjective = () => {
    if (newObjective.trim()) {
      setObjectives([...objectives, newObjective.trim()]);
      setNewObjective('');
    }
  };

  const handleRemoveObjective = (index: number) => {
    setObjectives(objectives.filter((_, i) => i !== index));
  };

  const handleAddSubchapter = () => {
    const newSub: SubChapter = {
      id: `sub-${Date.now()}`,
      title: `Bab ${subchapters.length + 1}: Topik Pembelajaran Lanjutan`,
      content: 'Tuliskan rincian instruksi materi di sini...',
    };
    setSubchapters([...subchapters, newSub]);
  };

  const handleUpdateSubchapter = (id: string, field: 'title' | 'content', value: string) => {
    setSubchapters(
      subchapters.map((s) => (s.id === id ? { ...s, [field]: value } : s))
    );
  };

  const handleRemoveSubchapter = (id: string) => {
    setSubchapters(subchapters.filter((s) => s.id !== id));
  };

  const handleAddAttachment = () => {
    if (newFileName.trim()) {
      const isPdf = newFileName.toLowerCase().endsWith('.pdf');
      const newAtt: MaterialAttachment = {
        id: `att-${Date.now()}`,
        file_name: newFileName.trim(),
        file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        file_type: isPdf ? 'pdf' : 'other',
        file_size: '2.5 MB',
      };
      setAttachments([...attachments, newAtt]);
      setNewFileName('');
    }
  };

  const handleSave = (status: PublicationStatus) => {
    if (!title) {
      alert('Mohon masukkan judul materi pembelajaran.');
      return;
    }

    const sub = subjects.find((s) => s.id === subjectId);
    const cls = classes.find((c) => c.id === classId);

    const slug = title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    addMaterial({
      subject_id: subjectId,
      subject_name: sub?.name,
      class_id: classId,
      class_name: cls?.name,
      teacher_id: currentUser.id,
      teacher_name: currentUser.full_name,
      title,
      slug,
      description,
      learning_objectives: objectives,
      content: content || 'Materi pembelajaran resmi kejuruan SMK.',
      subchapters,
      status,
      youtube_url: youtubeUrl || undefined,
      attachments,
      order_index: 1,
    });

    router.push('/guru/materials');
  };

  return (
    <DashboardLayout
      title="Editor Materi Pembelajaran"
      subtitle="Susun Modul Multimedia Interaktif untuk Siswa SMK"
    >
      <div className="max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <Link
            href="/guru/materials"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Daftar Materi</span>
          </Link>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => handleSave('draft')}
              className="px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Simpan Draf
            </button>
            <button
              type="button"
              onClick={() => handleSave('published')}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-md shadow-emerald-600/20 flex items-center gap-1.5 transition-all"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Terbitkan Materi</span>
            </button>
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6 text-xs">
          {/* Target Mapel & Kelas */}
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
              <label className="block font-semibold mb-1">Kelas Rombongan Belajar</label>
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

          {/* Judul & Ringkasan */}
          <div className="space-y-4">
            <div>
              <label className="block font-semibold mb-1">Judul Materi Pembelajaran</label>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Contoh: Arsitektur REST API & Integrasi Database PostgreSQL di Next.js"
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-semibold text-sm"
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Deskripsi Singkat / Pengantar Modul</label>
              <textarea
                rows={2}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Ringkasan kompetensi yang akan dicapai oleh siswa..."
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>
          </div>

          {/* Tujuan Pembelajaran Interaktif */}
          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <label className="block font-semibold">Tujuan Pembelajaran (Learning Objectives)</label>
            <div className="space-y-2">
              {objectives.map((obj, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 text-[10px] font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <p className="flex-1 p-2 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200">
                    {obj}
                  </p>
                  <button
                    type="button"
                    onClick={() => handleRemoveObjective(idx)}
                    className="p-1 text-slate-400 hover:text-rose-600"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={newObjective}
                onChange={(e) => setNewObjective(e.target.value)}
                placeholder="Tambah tujuan pembelajaran baru..."
                className="flex-1 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
              <button
                type="button"
                onClick={handleAddObjective}
                className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-700 font-semibold hover:bg-slate-300"
              >
                Tambah
              </button>
            </div>
          </div>

          {/* Video YouTube Embed */}
          <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
            <label className="block font-semibold flex items-center gap-1.5 text-slate-800 dark:text-slate-200">
              <Video className="w-4 h-4 text-rose-500" />
              <span>Tautan Video Tutorial YouTube (Opsional)</span>
            </label>
            <input
              type="url"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              placeholder="https://www.youtube.com/watch?v=wm5gMKuwSYk"
              className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
            />
          </div>

          {/* Subbab Pembelajaran */}
          <div className="space-y-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <div className="flex items-center justify-between">
              <label className="block font-semibold">Subbab & Struktur Materi Pelajaran</label>
              <button
                type="button"
                onClick={handleAddSubchapter}
                className="px-3 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 text-xs font-semibold hover:bg-emerald-100 flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Bab</span>
              </button>
            </div>

            <div className="space-y-3">
              {subchapters.map((sub) => (
                <div
                  key={sub.id}
                  className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 space-y-3 bg-slate-50/50 dark:bg-slate-800/40"
                >
                  <div className="flex items-center justify-between gap-2">
                    <input
                      type="text"
                      value={sub.title}
                      onChange={(e) => handleUpdateSubchapter(sub.id, 'title', e.target.value)}
                      placeholder="Judul Subbab"
                      className="flex-1 font-bold p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                    />
                    <button
                      type="button"
                      onClick={() => handleRemoveSubchapter(sub.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                  <textarea
                    rows={3}
                    value={sub.content}
                    onChange={(e) => handleUpdateSubchapter(sub.id, 'content', e.target.value)}
                    placeholder="Uraian konten subbab..."
                    className="w-full p-2.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Lampiran File (PDF / Gambar) */}
          <div className="space-y-3 pt-4 border-t border-slate-100 dark:border-slate-800">
            <label className="block font-semibold">Berkas Lampiran Modul (PDF / Dokumen Praktikum)</label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newFileName}
                onChange={(e) => setNewFileName(e.target.value)}
                placeholder="Nama file lampiran (contoh: Panduan_Praktikum_PWPB.pdf)"
                className="flex-1 p-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
              <button
                type="button"
                onClick={handleAddAttachment}
                className="px-3 py-2 rounded-xl bg-blue-600 text-white font-semibold flex items-center gap-1.5 hover:bg-blue-700"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Lampirkan</span>
              </button>
            </div>

            {attachments.length > 0 && (
              <div className="space-y-1.5 pt-1">
                {attachments.map((att) => (
                  <div
                    key={att.id}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs bg-slate-50 dark:bg-slate-800/60"
                  >
                    <span className="font-medium text-slate-800 dark:text-slate-200">{att.file_name}</span>
                    <span className="text-slate-400 font-mono text-[11px]">{att.file_size}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
