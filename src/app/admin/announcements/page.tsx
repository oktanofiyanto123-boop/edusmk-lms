'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useLms } from '@/lib/store';
import { Bell, Plus, Trash2, Pin, Calendar, X, AlertTriangle } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';

export default function AdminAnnouncementsPage() {
  const { announcements, addAnnouncement, deleteAnnouncement, currentUser } = useLms();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    target_role: 'all' as 'all' | 'guru' | 'siswa',
    priority: 'normal' as 'normal' | 'penting' | 'darurat',
    is_pinned: false,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;

    addAnnouncement({
      title: formData.title,
      content: formData.content,
      author_id: currentUser.id,
      author_name: currentUser.full_name,
      author_role: currentUser.role,
      target_role: formData.target_role,
      priority: formData.priority,
      is_pinned: formData.is_pinned,
    });

    setIsModalOpen(false);
    setFormData({
      title: '',
      content: '',
      target_role: 'all',
      priority: 'normal',
      is_pinned: false,
    });
  };

  return (
    <DashboardLayout
      title="Manajemen Pengumuman Sekolah"
      subtitle="Publikasikan Surat Edaran dan Informasi Penting ke Seluruh Civitas Akademika"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-500">{announcements.length} Pengumuman Terbit</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Pengumuman Baru</span>
          </button>
        </div>

        <div className="space-y-4">
          {announcements.map((ann) => (
            <div
              key={ann.id}
              className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border shadow-xs transition-all ${
                ann.is_pinned
                  ? 'border-blue-300 dark:border-blue-800 bg-blue-50/20 dark:bg-blue-950/20'
                  : 'border-slate-200 dark:border-slate-800'
              }`}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <div className="flex flex-wrap items-center gap-2 text-xs">
                    {ann.is_pinned && (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 text-[10px] font-bold">
                        <Pin className="w-3 h-3" />
                        Disematkan
                      </span>
                    )}
                    <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                      ann.priority === 'darurat'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        : ann.priority === 'penting'
                        ? 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                        : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}>
                      {ann.priority}
                    </span>
                    <span className="text-slate-400 text-[11px]">
                      Target: <strong className="text-slate-600 dark:text-slate-300 uppercase">{ann.target_role}</strong>
                    </span>
                    <span className="text-slate-400 text-[11px]">• Oleh: {ann.author_name}</span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 dark:text-white">
                    {ann.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                    {ann.content}
                  </p>

                  <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>Diterbitkan pada {formatDateTime(ann.created_at)}</span>
                  </div>
                </div>

                <button
                  onClick={() => {
                    if (confirm(`Hapus pengumuman: ${ann.title}?`)) deleteAnnouncement(ann.id);
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950"
                  title="Hapus Pengumuman"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Tambah Pengumuman */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Buat Pengumuman Sekolah
                </h3>
                <button onClick={() => setIsModalOpen(false)}>
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold mb-1">Judul Surat Edaran / Pengumuman</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Contoh: Jadwal Uji Kompetensi Keahlian (UKK) 2026"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">Target Audiens</label>
                    <select
                      value={formData.target_role}
                      onChange={(e) => setFormData({ ...formData, target_role: e.target.value as any })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    >
                      <option value="all">Semua Civitas (Guru & Siswa)</option>
                      <option value="guru">Hanya Dewan Guru</option>
                      <option value="siswa">Hanya Siswa</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Tingkat Prioritas</label>
                    <select
                      value={formData.priority}
                      onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    >
                      <option value="normal">Biasa (Normal)</option>
                      <option value="penting">Penting (Wajib Baca)</option>
                      <option value="darurat">Darurat (Urgent)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Isi Pengumuman Lengkap</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Tuliskan uraian pengumuman secara rinci..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="pin"
                    checked={formData.is_pinned}
                    onChange={(e) => setFormData({ ...formData, is_pinned: e.target.checked })}
                    className="rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                  />
                  <label htmlFor="pin" className="text-xs text-slate-700 dark:text-slate-300">
                    Sematkan di posisi teratas dashboard pengguna (Pinned)
                  </label>
                </div>

                <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                  >
                    Terbitkan Pengumuman
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
