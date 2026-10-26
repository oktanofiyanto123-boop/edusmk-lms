'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useLms } from '@/lib/store';
import { FileText, Plus, Search, Trash2, Eye, Video, File, CheckCircle2, Clock } from 'lucide-react';
import { formatDate, getStatusBadge } from '@/lib/utils';
import { PublicationStatus } from '@/lib/types';

export default function GuruMaterialsPage() {
  const { materials, deleteMaterial, updateMaterial, currentUser } = useLms();
  const [filter, setFilter] = useState<'all' | PublicationStatus>('all');
  const [search, setSearch] = useState('');

  const myMaterials = materials.filter(
    (m) => m.teacher_id === currentUser.id || currentUser.role === 'admin'
  );

  const filtered = myMaterials.filter((m) => {
    const matchStatus = filter === 'all' || m.status === filter;
    const matchSearch =
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.subject_name?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const handleStatusChange = (id: string, newStatus: PublicationStatus) => {
    updateMaterial(id, { status: newStatus });
  };

  return (
    <DashboardLayout
      title="Kelola Materi Pembelajaran"
      subtitle="Publikasikan Modul Kejuruan, Video Praktik, dan Panduan Praktikum"
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {(['all', 'published', 'draft', 'archived'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all ${
                  filter === status
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
                }`}
              >
                {status === 'all' ? 'Semua Status' : status === 'published' ? 'Terbit' : status === 'draft' ? 'Draf' : 'Arsip'}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari modul materi..."
                className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
              />
            </div>
            <Link
              href="/guru/materials/create"
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Materi Baru</span>
            </Link>
          </div>
        </div>

        {/* Materials List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.length === 0 ? (
            <div className="col-span-full p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
              <FileText className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">Belum ada materi pembelajaran</p>
              <p className="text-xs text-slate-400">Klik tombol "Buat Materi Baru" untuk mulai menyusun materi.</p>
            </div>
          ) : (
            filtered.map((mat) => {
              const badge = getStatusBadge(mat.status);
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
                      {mat.description}
                    </p>

                    <div className="space-y-1.5 pt-2 text-[11px] text-slate-400">
                      <p className="flex items-center gap-1.5">
                        <FileText className="w-3.5 h-3.5" />
                        <span>{mat.subchapters?.length || 0} Subbab Pembelajaran</span>
                      </p>
                      {mat.youtube_url && (
                        <p className="flex items-center gap-1.5 text-rose-500">
                          <Video className="w-3.5 h-3.5" />
                          <span>Video YouTube Terlampir</span>
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

                    <button
                      onClick={() => {
                        if (confirm(`Hapus materi: ${mat.title}?`)) deleteMaterial(mat.id);
                      }}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950"
                      title="Hapus Materi"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
