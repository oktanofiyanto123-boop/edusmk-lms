'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useLms } from '@/lib/store';
import {
  FileText,
  Search,
  Video,
  File,
  Trash2,
  Eye,
  Plus,
  UploadCloud,
  Presentation,
  Edit3,
  Layers,
  Sparkles,
} from 'lucide-react';
import { getStatusBadge } from '@/lib/utils';
import { MaterialModal } from '@/components/materials/MaterialModal';
import { TeachingMaterial } from '@/lib/types';
import Link from 'next/link';

export default function AdminMaterialsPage() {
  const { materials, deleteMaterial } = useLms();
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState<'all' | 'pdf' | 'ppt' | 'video'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');

  // Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [materialToEdit, setMaterialToEdit] = useState<TeachingMaterial | null>(null);

  // Statistics
  const countPdf = materials.filter((m) =>
    m.attachments?.some(
      (a) => a.file_type === 'pdf' || a.file_name.toLowerCase().endsWith('.pdf')
    )
  ).length;

  const countPpt = materials.filter((m) =>
    m.attachments?.some(
      (a) =>
        a.file_type === 'ppt' ||
        a.file_name.toLowerCase().endsWith('.ppt') ||
        a.file_name.toLowerCase().endsWith('.pptx')
    )
  ).length;

  const countVideo = materials.filter((m) => Boolean(m.youtube_url)).length;

  const filtered = materials.filter((m) => {
    const matchSearch =
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.subject_name?.toLowerCase().includes(search.toLowerCase()) ||
      m.teacher_name?.toLowerCase().includes(search.toLowerCase()) ||
      m.class_name?.toLowerCase().includes(search.toLowerCase());

    const matchStatus = statusFilter === 'all' || m.status === statusFilter;

    let matchType = true;
    if (typeFilter === 'pdf') {
      matchType = Boolean(
        m.attachments?.some(
          (a) => a.file_type === 'pdf' || a.file_name.toLowerCase().endsWith('.pdf')
        )
      );
    } else if (typeFilter === 'ppt') {
      matchType = Boolean(
        m.attachments?.some(
          (a) =>
            a.file_type === 'ppt' ||
            a.file_name.toLowerCase().endsWith('.ppt') ||
            a.file_name.toLowerCase().endsWith('.pptx')
        )
      );
    } else if (typeFilter === 'video') {
      matchType = Boolean(m.youtube_url);
    }

    return matchSearch && matchStatus && matchType;
  });

  const handleOpenCreateModal = () => {
    setMaterialToEdit(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (material: TeachingMaterial) => {
    setMaterialToEdit(material);
    setIsModalOpen(true);
  };

  return (
    <DashboardLayout
      title="Manajemen Seluruh Materi Sekolah"
      subtitle="Monitoring Konten Instruksional, Berkas PDF & PPT, serta Media YouTube Pembelajaran"
    >
      <div className="space-y-6">
        {/* Quick KPI Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Total Modul</span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-2">
              {materials.length}
            </p>
            <p className="text-[11px] text-slate-400">Modul terdaftar di sekolah</p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Modul PDF</span>
              <div className="w-8 h-8 rounded-xl bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-2">
              {countPdf}
            </p>
            <p className="text-[11px] text-rose-600 dark:text-rose-400 font-medium">Dokumen format PDF</p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Slide PPT</span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Presentation className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-2">
              {countPpt}
            </p>
            <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">Slide presentasi PPT</p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Video Praktik</span>
              <div className="w-8 h-8 rounded-xl bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 flex items-center justify-center">
                <Video className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-2">
              {countVideo}
            </p>
            <p className="text-[11px] text-red-600 dark:text-red-400 font-medium">Tautan video YouTube</p>
          </div>
        </div>

        {/* Filter and Action Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
            <button
              onClick={() => setTypeFilter('all')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${
                typeFilter === 'all'
                  ? 'bg-slate-900 text-white dark:bg-white dark:text-slate-900 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              Semua Modul ({materials.length})
            </button>
            <button
              onClick={() => setTypeFilter('pdf')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                typeFilter === 'pdf'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/60'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Dengan PDF ({countPdf})</span>
            </button>
            <button
              onClick={() => setTypeFilter('ppt')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                typeFilter === 'ppt'
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/60'
              }`}
            >
              <Presentation className="w-3.5 h-3.5" />
              <span>Dengan PPT ({countPpt})</span>
            </button>
            <button
              onClick={() => setTypeFilter('video')}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                typeFilter === 'video'
                  ? 'bg-red-600 text-white shadow-xs'
                  : 'text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/60'
              }`}
            >
              <Video className="w-3.5 h-3.5" />
              <span>Dengan YouTube ({countVideo})</span>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1 md:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari modul, guru, mapel..."
                className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-600/20 flex items-center gap-1.5 shrink-0 transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah / Upload Modul</span>
            </button>
          </div>
        </div>

        {/* Materials Table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Judul Modul Materi</th>
                  <th className="py-3 px-4">Mata Pelajaran</th>
                  <th className="py-3 px-4">Kelas Sasaran</th>
                  <th className="py-3 px-4">Guru Pembuat</th>
                  <th className="py-3 px-4">Media Terlampir</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="py-12 text-center">
                      <div className="space-y-2">
                        <FileText className="w-8 h-8 text-slate-300 mx-auto" />
                        <p className="text-xs font-semibold text-slate-600 dark:text-slate-400">
                          Tidak ada materi pembelajaran yang cocok dengan filter
                        </p>
                        <button
                          type="button"
                          onClick={handleOpenCreateModal}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-[11px] font-semibold"
                        >
                          + Tambah Modul Baru
                        </button>
                      </div>
                    </td>
                  </tr>
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
                      <tr key={mat.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                                hasVideo
                                  ? 'bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400'
                                  : hasPpt
                                  ? 'bg-amber-50 text-amber-600 dark:bg-amber-950 dark:text-amber-400'
                                  : 'bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-400'
                              }`}
                            >
                              {hasVideo ? (
                                <Video className="w-4 h-4" />
                              ) : hasPpt ? (
                                <Presentation className="w-4 h-4" />
                              ) : (
                                <FileText className="w-4 h-4" />
                              )}
                            </div>
                            <div className="min-w-0 max-w-xs">
                              <p className="font-bold text-slate-900 dark:text-white line-clamp-1">
                                {mat.title}
                              </p>
                              <p className="text-[11px] text-slate-400 truncate">
                                {mat.description || 'Tidak ada deskripsi'}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3.5 px-4 font-medium text-slate-800 dark:text-slate-200">
                          {mat.subject_name}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[11px] font-semibold text-slate-600 dark:text-slate-400">
                          {mat.class_name}
                        </td>
                        <td className="py-3.5 px-4 text-slate-700 dark:text-slate-300">
                          {mat.teacher_name}
                        </td>
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5 flex-wrap">
                            {hasPdf && (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-rose-50 text-rose-700 dark:bg-rose-950/70 dark:text-rose-300 border border-rose-200 dark:border-rose-900">
                                PDF
                              </span>
                            )}
                            {hasPpt && (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-amber-50 text-amber-800 dark:bg-amber-950/70 dark:text-amber-300 border border-amber-200 dark:border-amber-900">
                                PPT
                              </span>
                            )}
                            {hasVideo && (
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-red-50 text-red-700 dark:bg-red-950/70 dark:text-red-300 border border-red-200 dark:border-red-900 flex items-center gap-1">
                                <Video className="w-2.5 h-2.5" />
                                <span>YouTube</span>
                              </span>
                            )}
                            {!hasPdf && !hasPpt && !hasVideo && (
                              <span className="text-[10px] text-slate-400 italic">Teks/Bab</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${badge.className}`}
                          >
                            {badge.label}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right space-x-1 whitespace-nowrap">
                          <Link
                            href={`/siswa/materials/${mat.id}`}
                            className="inline-flex p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950 transition-colors"
                            title="Pratinjau Materi (Tampilan Siswa)"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(mat)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950 transition-colors"
                            title="Edit Modul Materi"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={() => {
                              if (confirm(`Hapus materi "${mat.title}"?`)) {
                                deleteMaterial(mat.id);
                              }
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950 transition-colors"
                            title="Hapus Materi"
                          >
                            <Trash2 className="w-4 h-4" />
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
      </div>

      {/* Modal Tambah / Upload & Edit Modul */}
      <MaterialModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        materialToEdit={materialToEdit}
        defaultRole="admin"
      />
    </DashboardLayout>
  );
}
