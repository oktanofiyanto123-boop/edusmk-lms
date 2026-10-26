'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useLms } from '@/lib/store';
import { BookOpen, Plus, Trash2, X, Clock, Layers } from 'lucide-react';

export default function AdminSubjectsPage() {
  const { subjects, departments, addSubject, deleteSubject } = useLms();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [formData, setFormData] = useState({
    code: '',
    name: '',
    department_id: departments[0]?.id || '',
    description: '',
    hours_per_week: 6,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.code) return;

    const dept = departments.find((d) => d.id === formData.department_id);

    addSubject({
      code: formData.code,
      name: formData.name,
      department_id: formData.department_id || undefined,
      department_name: dept?.name,
      description: formData.description,
      hours_per_week: Number(formData.hours_per_week),
    });

    setIsModalOpen(false);
    setFormData({
      code: '',
      name: '',
      department_id: departments[0]?.id || '',
      description: '',
      hours_per_week: 6,
    });
  };

  return (
    <DashboardLayout
      title="Manajemen Mata Pelajaran"
      subtitle="Struktur Kurikulum Kejuruan SMK & Alokasi Jam Mengajar"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-500">{subjects.length} Mata Pelajaran Terdaftar</p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" />
            <span>Tambah Mapel Baru</span>
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subjects.map((sub) => (
            <div
              key={sub.id}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
                    {sub.code}
                  </span>
                  <span className="flex items-center gap-1 text-[11px] text-slate-500">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{sub.hours_per_week} Jam / Minggu</span>
                  </span>
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  {sub.name}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2">
                  {sub.description || 'Tidak ada deskripsi kurikulum tambahan.'}
                </p>
              </div>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-xs">
                <span className="text-slate-400">
                  {sub.department_name ? `Jurusan: ${sub.department_name}` : 'Mata Pelajaran Umum'}
                </span>
                <button
                  onClick={() => {
                    if (confirm(`Hapus mapel ${sub.name}?`)) deleteSubject(sub.id);
                  }}
                  className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg"
                  title="Hapus Mapel"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Modal Tambah Mapel */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Tambah Mata Pelajaran
                </h3>
                <button onClick={() => setIsModalOpen(false)}>
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">Kode Mapel</label>
                    <input
                      type="text"
                      required
                      value={formData.code}
                      onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                      placeholder="C3-RPL-03"
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Jam / Minggu</label>
                    <input
                      type="number"
                      required
                      value={formData.hours_per_week}
                      onChange={(e) => setFormData({ ...formData, hours_per_week: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Nama Mata Pelajaran</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: Pemrograman Berorientasi Objek"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Kompetensi Keahlian</label>
                  <select
                    value={formData.department_id}
                    onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  >
                    <option value="">Umum (Semua Jurusan)</option>
                    {departments.map((d) => (
                      <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Deskripsi Ringkas</label>
                  <textarea
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Capaian pembelajaran dan ruang lingkup materi..."
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
                    Simpan Mapel
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
