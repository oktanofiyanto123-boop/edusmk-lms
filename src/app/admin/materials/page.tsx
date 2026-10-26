'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useLms } from '@/lib/store';
import { FileText, Search, Video, File, Trash2, Eye } from 'lucide-react';
import { formatDate, getStatusBadge } from '@/lib/utils';
import Link from 'next/link';

export default function AdminMaterialsPage() {
  const { materials, deleteMaterial } = useLms();
  const [search, setSearch] = useState('');

  const filtered = materials.filter(
    (m) =>
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.subject_name?.toLowerCase().includes(search.toLowerCase()) ||
      m.teacher_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <DashboardLayout
      title="Manajemen Seluruh Materi Sekolah"
      subtitle="Monitoring Konten Instruksional dan Media Pembelajaran Guru"
    >
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-xs text-slate-500">{materials.length} Total Modul Terbit di Sekolah</p>
          <div className="relative sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari modul, guru, mapel..."
              className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900"
            />
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Judul Modul Materi</th>
                  <th className="py-3 px-4">Mata Pelajaran</th>
                  <th className="py-3 px-4">Kelas Sasaran</th>
                  <th className="py-3 px-4">Guru Pembuat</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                {filtered.map((mat) => {
                  const badge = getStatusBadge(mat.status);
                  return (
                    <tr key={mat.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 flex items-center justify-center shrink-0">
                            {mat.youtube_url ? <Video className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white line-clamp-1">{mat.title}</p>
                            <p className="text-[11px] text-slate-400">
                              {mat.subchapters?.length || 0} Subbab • {mat.attachments?.length || 0} Lampiran
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-medium">{mat.subject_name}</td>
                      <td className="py-3 px-4 font-mono text-[11px]">{mat.class_name}</td>
                      <td className="py-3 px-4">{mat.teacher_name}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${badge.className}`}>
                          {badge.label}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right space-x-1">
                        <Link
                          href={`/siswa/materials/${mat.id}`}
                          className="inline-flex p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950"
                          title="Lihat Pratinjau Materi"
                        >
                          <Eye className="w-4 h-4" />
                        </Link>
                        <button
                          onClick={() => {
                            if (confirm(`Hapus materi ${mat.title}?`)) deleteMaterial(mat.id);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950"
                          title="Hapus Materi"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
