'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useLms } from '@/lib/store';
import { Building2, Layers, Plus, Users, Trash2, Edit2, X, Check } from 'lucide-react';

export default function AdminClassesPage() {
  const { classes, departments, users, addClass, deleteClass } = useLms();
  const teachers = users.filter((u) => u.role === 'guru');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    grade_level: 12 as 10 | 11 | 12,
    department_id: departments[0]?.id || '',
    academic_year: '2026/2027',
    teacher_id: teachers[0]?.id || '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    const dept = departments.find((d) => d.id === formData.department_id);
    const teacher = teachers.find((t) => t.id === formData.teacher_id);

    addClass({
      name: formData.name,
      grade_level: Number(formData.grade_level) as 10 | 11 | 12,
      department_id: formData.department_id,
      department_name: dept?.name,
      academic_year: formData.academic_year,
      teacher_id: formData.teacher_id,
      homeroom_teacher: teacher?.full_name,
      student_count: 0,
    });

    setIsModalOpen(false);
    setFormData({
      name: '',
      grade_level: 12,
      department_id: departments[0]?.id || '',
      academic_year: '2026/2027',
      teacher_id: teachers[0]?.id || '',
    });
  };

  return (
    <DashboardLayout
      title="Manajemen Kelas & Jurusan"
      subtitle="Kelola Rombongan Belajar (Rombel) dan Kompetensi Keahlian SMK"
    >
      <div className="space-y-8">
        {/* Jurusan Overview Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Kompetensi Keahlian (Jurusan)</span>
            </h3>
            <span className="text-xs text-slate-500">{departments.length} Jurusan Aktif</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {departments.map((dept) => (
              <div
                key={dept.id}
                className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded">
                    {dept.code}
                  </span>
                  <span className="text-[11px] text-slate-500">{dept.total_students} Siswa</span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                  {dept.name}
                </h4>
                <p className="text-[11px] text-slate-500 line-clamp-2">
                  Kaprog: {dept.head_of_department}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Classes Table */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Building2 className="w-4 h-4 text-emerald-600" />
              <span>Daftar Rombongan Belajar (Kelas)</span>
            </h3>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Kelas Baru</span>
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Nama Kelas</th>
                    <th className="py-3 px-4">Tingkat</th>
                    <th className="py-3 px-4">Jurusan</th>
                    <th className="py-3 px-4">Wali Kelas</th>
                    <th className="py-3 px-4">Tahun Ajaran</th>
                    <th className="py-3 px-4">Jumlah Siswa</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {classes.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40">
                      <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">{c.name}</td>
                      <td className="py-3 px-4">Kelas {c.grade_level}</td>
                      <td className="py-3 px-4 font-medium">{c.department_name}</td>
                      <td className="py-3 px-4 text-slate-600 dark:text-slate-300">
                        {c.homeroom_teacher || 'Belum Ditugaskan'}
                      </td>
                      <td className="py-3 px-4 font-mono text-[11px]">{c.academic_year}</td>
                      <td className="py-3 px-4">
                        <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded-full">
                          <Users className="w-3 h-3" />
                          <span>{c.student_count || 0} Siswa</span>
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            if (confirm(`Hapus rombel ${c.name}?`)) deleteClass(c.id);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                          title="Hapus Rombel"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Modal Tambah Kelas */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Buat Rombongan Belajar (Kelas) Baru
                </h3>
                <button onClick={() => setIsModalOpen(false)}>
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold mb-1">Nama Rombel</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: XII RPL 3 atau X TKJ 2"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">Tingkat Kelas</label>
                    <select
                      value={formData.grade_level}
                      onChange={(e) => setFormData({ ...formData, grade_level: Number(e.target.value) as any })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    >
                      <option value={10}>Kelas 10 (Fase E)</option>
                      <option value={11}>Kelas 11 (Fase F)</option>
                      <option value={12}>Kelas 12 (Fase F Akhir)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Jurusan</label>
                    <select
                      value={formData.department_id}
                      onChange={(e) => setFormData({ ...formData, department_id: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    >
                      {departments.map((d) => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Wali Kelas</label>
                  <select
                    value={formData.teacher_id}
                    onChange={(e) => setFormData({ ...formData, teacher_id: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  >
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>{t.full_name}</option>
                    ))}
                  </select>
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
                    Simpan Rombel
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
