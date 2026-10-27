'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useLms } from '@/lib/store';
import {
  FileText,
  Plus,
  Search,
  Trash2,
  Eye,
  Video,
  File,
  CheckCircle2,
  Clock,
  Edit3,
  Cpu,
  Sprout,
  UploadCloud,
  Presentation,
} from 'lucide-react';
import { formatDate, getStatusBadge } from '@/lib/utils';
import { PublicationStatus, TeachingMaterial } from '@/lib/types';
import { MaterialModal } from '@/components/materials/MaterialModal';

export default function GuruMaterialsPage() {
  const { materials, deleteMaterial, updateMaterial, subjects, currentUser } = useLms();
  const [filter, setFilter] = useState<'all' | PublicationStatus>('all');
  const [selectedDept, setSelectedDept] = useState<'all' | 'dept-te' | 'dept-atph' | 'dept-dkv'>('all');
  const [search, setSearch] = useState('');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [materialToEdit, setMaterialToEdit] = useState<TeachingMaterial | null>(null);

  const myMaterials = materials.filter(
    (m) => m.teacher_id === currentUser.id || currentUser.role === 'admin'
  );

  const filtered = myMaterials.filter((m) => {
    const matchStatus = filter === 'all' || m.status === filter;
    const matchSearch =
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.subject_name?.toLowerCase().includes(search.toLowerCase()) ||
      m.class_name?.toLowerCase().includes(search.toLowerCase());

    const subject = subjects.find((s) => s.id === m.subject_id);
    const matchDept = selectedDept === 'all' || subject?.department_id === selectedDept;

    return matchStatus && matchSearch && matchDept;
  });

  const handleStatusChange = (id: string, newStatus: PublicationStatus) => {
    updateMaterial(id, { status: newStatus });
  };

  const handleOpenCreateModal = () => {
    setMaterialToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (mat: TeachingMaterial) => {
    setMaterialToEdit(mat);
    setIsModalOpen(true);
  };

  return (
    <DashboardLayout
      title="Kelola Materi Pembelajaran"
      subtitle="Publikasikan Modul Kejuruan, Dokumen PDF, Slide Presentasi PPT, dan Video Praktik YouTube"
    >
      <div className="space-y-6">
        {/* Jurusan & Mapel Quick Filter */}
        <div className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
            <button
              onClick={() => setSelectedDept('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedDept === 'all'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Semua Jurusan
            </button>
            <button
              onClick={() => setSelectedDept('dept-te')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                selectedDept === 'dept-te'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/60'
              }`}
            >
              <Cpu className="w-3.5 h-3.5" />
              <span>Teknik Elektronika (TE)</span>
            </button>
            <button
              onClick={() => setSelectedDept('dept-atph')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                selectedDept === 'dept-atph'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/60'
              }`}
            >
              <Sprout className="w-3.5 h-3.5" />
              <span>Agribisnis (ATPH)</span>
            </button>
            <button
              onClick={() => setSelectedDept('dept-dkv')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                selectedDept === 'dept-dkv'
                  ? 'bg-purple-600 text-white shadow-xs'
                  : 'text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/60'
              }`}
            >
              🎨 DKV
            </button>
          </div>

          <div className="flex items-center gap-1.5">
            {(['all', 'published', 'draft', 'archived'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold uppercase tracking-wider transition-all ${
                  filter === status
                    ? 'bg-emerald-600 text-white font-bold shadow-xs'
                    : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {status === 'all' ? 'Semua' : status === 'published' ? 'Terbit' : status === 'draft' ? 'Draf' : 'Arsip'}
              </button>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-xs text-slate-500">{filtered.length} Modul Pembelajaran Ditemukan</p>
          <div className="flex items-center gap-2.5 flex-wrap">
            <div className="relative sm:w-60">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari modul materi..."
                className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-sm flex items-center gap-1.5 shrink-0 transition-all cursor-pointer"
            >
              <UploadCloud className="w-4 h-4" />
              <span>Upload Modul (PDF/PPT/YT)</span>
            </button>

            <Link
              href="/guru/materials/create"
              className="px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold shadow-2xs flex items-center gap-1.5 shrink-0 transition-all"
            >
              <Plus className="w-4 h-4 text-emerald-600" />
              <span>Editor Modul Lengkap</span>
            </Link>
          </div>
        </div>

        {/* Materials List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.length === 0 ? (
            <div className="col-span-full p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
              <FileText className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Belum ada materi pembelajaran</p>
              <p className="text-xs text-slate-400">Klik tombol "Upload Modul" untuk mulai mengunggah materi berkas atau video.</p>
              <button
                type="button"
                onClick={handleOpenCreateModal}
                className="mt-2 inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-600 text-white text-xs font-semibold rounded-xl"
              >
                <UploadCloud className="w-4 h-4" />
                <span>Upload Modul Sekarang</span>
              </button>
            </div>
          ) : (
            filtered.map((mat) => {
              const badge = getStatusBadge(mat.status);
              const hasPdf = mat.attachments?.some(
                (a) => a.file_type === 'pdf' || a.file_name.toLowerCase().endsWith('.pdf')
              );
              const hasPpt = mat.attachments?.some(
                (a) =>
                  a.file_type === 'ppt' ||
                  a.file_name.toLowerCase().endsWith('.ppt') ||
                  a.file_name.toLowerCase().endsWith('.pptx')
              );
              const hasVideo = Boolean(mat.youtube_url);

              return (
                <div
                  key={mat.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4 hover:border-emerald-500/40 transition-all"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950 px-2 py-0.5 rounded">
                        {mat.class_name}
                      </span>
                      <select
                        value={mat.status}
                        onChange={(e) => handleStatusChange(mat.id, e.target.value as PublicationStatus)}
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border cursor-pointer ${badge.className}`}
                      >
                        <option value="published">Terbit (Published)</option>
                        <option value="draft">Draf (Disimpan)</option>
                        <option value="archived">Arsip</option>
                      </select>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2">
                      {mat.title}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {mat.description || 'Tidak ada deskripsi modul.'}
                    </p>

                    {/* Media Badges */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-1">
                      {hasPdf && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300 border border-rose-200 dark:border-rose-900 flex items-center gap-1">
                          <FileText className="w-3 h-3 text-rose-600" />
                          <span>PDF</span>
                        </span>
                      )}
                      {hasPpt && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-200 dark:border-amber-900 flex items-center gap-1">
                          <Presentation className="w-3 h-3 text-amber-600" />
                          <span>PPT</span>
                        </span>
                      )}
                      {hasVideo && (
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-50 text-red-700 dark:bg-red-950/70 dark:text-red-300 border border-red-200 dark:border-red-900 flex items-center gap-1">
                          <Video className="w-3 h-3 text-red-600" />
                          <span>YouTube</span>
                        </span>
                      )}
                    </div>

                    <div className="space-y-1.5 pt-2 text-[11px] text-slate-400">
                      <p className="flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" />
                        <span>{mat.subchapters?.length || 0} Subbab Pembahasan</span>
                      </p>
                      {mat.attachments && mat.attachments.length > 0 && (
                        <p className="flex items-center gap-1.5">
                          <File className="w-3.5 h-3.5" />
                          <span>{mat.attachments.length} Berkas Modul Lampiran</span>
                        </p>
                      )}
                      <p className="flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Diperbarui {formatDate(mat.updated_at)}</span>
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <Link
                      href={`/siswa/materials/${mat.id}`}
                      className="inline-flex items-center gap-1 text-xs text-blue-600 font-semibold hover:underline"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Lihat Siswa</span>
                    </Link>

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleOpenEditModal(mat)}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold transition-all"
                        title="Edit Cepat Modul"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </button>

                      <Link
                        href={`/guru/materials/${mat.id}/edit`}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 text-xs font-semibold hover:bg-emerald-100 dark:hover:bg-emerald-900/60 transition-all"
                        title="Buka Editor Modul Lengkap"
                      >
                        <span>Editor Lengkap</span>
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          if (confirm(`Hapus materi: ${mat.title}?`)) deleteMaterial(mat.id);
                        }}
                        className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors"
                        title="Hapus Materi"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>

      {/* Modal Quick Upload & Edit Modul */}
      <MaterialModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        materialToEdit={materialToEdit}
        defaultRole="guru"
      />
    </DashboardLayout>
  );
}
