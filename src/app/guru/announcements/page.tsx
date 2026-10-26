'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useLms } from '@/lib/store';
import { Bell, Plus, Trash2, Calendar, X } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';

export default function GuruAnnouncementsPage() {
  const { announcements, addAnnouncement, deleteAnnouncement, currentUser, classes } = useLms();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    content: '',
    class_id: classes[0]?.id || '',
    priority: 'normal' as 'normal' | 'penting',
  });

  const myAnnouncements = announcements.filter(
    (a) => a.author_id === currentUser.id || currentUser.role === 'admin'
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.content) return;

    const targetClass = classes.find((c) => c.id === formData.class_id);

    addAnnouncement({
      title: formData.title,
      content: formData.content,
      author_id: currentUser.id,
      author_name: currentUser.full_name,
      author_role: 'guru',
      target_role: 'siswa',
      class_id: formData.class_id,
      class_name: targetClass?.name,
      priority: formData.priority,
      is_pinned: false,
    });

    setIsModalOpen(false);
    setFormData({
      title: '',
      content: '',
      class_id: classes[0]?.id || '',
      priority: 'normal',
    });
  };

  return (
    <DashboardLayout
      title="Pengumuman Guru untuk Siswa"
      subtitle="Sampaikan Info Pembagian Kelompok, Jadwal Praktikum, atau Remedial"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-500">{myAnnouncements.length} Pengumuman Dibuat</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Buat Pengumuman Kelas</span>
          </button>
        </div>

        <div className="space-y-4">
          {myAnnouncements.map((ann) => (
            <div
              key={ann.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2"
            >
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    {ann.class_name && (
                      <span className="font-mono text-[10px] font-bold text-blue-600 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
                        {ann.class_name}
                      </span>
                    )}
                    <span className="text-[11px] text-slate-400">
                      {formatDateTime(ann.created_at)}
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                    {ann.title}
                  </h3>
                </div>
                <button
                  onClick={() => deleteAnnouncement(ann.id)}
                  className="p-1 text-slate-400 hover:text-rose-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {ann.content}
              </p>
            </div>
          ))}
        </div>

        {/* Modal Pengumuman */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Pengumuman Kelas Baru
                </h3>
                <button onClick={() => setIsModalOpen(false)}>
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold mb-1">Kelas Tujuan</label>
                  <select
                    value={formData.class_id}
                    onChange={(e) => setFormData({ ...formData, class_id: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  >
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Judul Pengumuman</label>
                  <input
                    type="text"
                    required
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Contoh: Jadwal Presentasi Proyek Akhir"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Isi Pesan Pengumuman</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    placeholder="Tuliskan pesan instruksi untuk siswa..."
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
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
                    Terbitkan
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
