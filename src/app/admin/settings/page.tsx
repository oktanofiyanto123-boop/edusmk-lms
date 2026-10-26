'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useLms } from '@/lib/store';
import { Settings, Save, CheckCircle2, Building, ShieldCheck, Database } from 'lucide-react';

export default function AdminSettingsPage() {
  const { schoolSettings, updateSchoolSettings } = useLms();
  const [saved, setSaved] = useState(false);

  const [formData, setFormData] = useState({
    school_name: schoolSettings.school_name,
    npsn: schoolSettings.npsn,
    address: schoolSettings.address,
    phone: schoolSettings.phone,
    email: schoolSettings.email,
    principal_name: schoolSettings.principal_name,
    academic_year: schoolSettings.academic_year,
    active_semester: schoolSettings.active_semester,
    assignmentsWeight: schoolSettings.grading_weights.assignments,
    quizzesWeight: schoolSettings.grading_weights.quizzes,
    examsWeight: schoolSettings.grading_weights.exams,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateSchoolSettings({
      school_name: formData.school_name,
      npsn: formData.npsn,
      address: formData.address,
      phone: formData.phone,
      email: formData.email,
      principal_name: formData.principal_name,
      academic_year: formData.academic_year,
      active_semester: formData.active_semester as any,
      grading_weights: {
        assignments: Number(formData.assignmentsWeight),
        quizzes: Number(formData.quizzesWeight),
        exams: Number(formData.examsWeight),
      },
    });

    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <DashboardLayout
      title="Pengaturan & Konfigurasi LMS"
      subtitle="Identitas Sekolah, Kalender Akademik, dan Pembobotan Nilai Rapor"
    >
      <div className="max-w-4xl space-y-6">
        {saved && (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2.5 text-xs text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Konfigurasi sekolah dan pembobotan nilai berhasil diperbarui!</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6 text-xs">
          {/* Identitas Sekolah */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <Building className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Identitas Resmi Satuan Pendidikan (SMK)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">Nama Satuan Pendidikan</label>
                <input
                  type="text"
                  required
                  value={formData.school_name}
                  onChange={(e) => setFormData({ ...formData, school_name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Nomor Pokok Sekolah Nasional (NPSN)</label>
                <input
                  type="text"
                  required
                  value={formData.npsn}
                  onChange={(e) => setFormData({ ...formData, npsn: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Nama Kepala Sekolah Beserta Gelar</label>
                <input
                  type="text"
                  required
                  value={formData.principal_name}
                  onChange={(e) => setFormData({ ...formData, principal_name: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Email Resmi Sekolah</label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Telepon Sekolah</label>
                <input
                  type="text"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>

              <div>
                <label className="block font-semibold mb-1">Tahun Ajaran & Semester Berjalan</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="text"
                    value={formData.academic_year}
                    onChange={(e) => setFormData({ ...formData, academic_year: e.target.value })}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                  <select
                    value={formData.active_semester}
                    onChange={(e) => setFormData({ ...formData, active_semester: e.target.value as any })}
                    className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  >
                    <option value="Ganjil">Ganjil</option>
                    <option value="Genap">Genap</option>
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Alamat Kampus Sekolah</label>
              <textarea
                rows={2}
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
              />
            </div>
          </div>

          {/* Konfigurasi Bobot Penilaian */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4">
            <div className="flex items-center gap-2 pb-3 border-b border-slate-100 dark:border-slate-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                Formula & Pembobotan Nilai Akhir Rapor (%)
              </h3>
            </div>

            <p className="text-slate-500 text-xs">
              Tentukan persentase proporsi kalkulasi nilai akhir siswa. Total ketiga komponen harus berjumlah 100%.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                <label className="block font-semibold">Tugas Praktik (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.assignmentsWeight}
                  onChange={(e) => setFormData({ ...formData, assignmentsWeight: Number(e.target.value) })}
                  className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 font-mono font-bold"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                <label className="block font-semibold">Kuis & Evaluasi (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.quizzesWeight}
                  onChange={(e) => setFormData({ ...formData, quizzesWeight: Number(e.target.value) })}
                  className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 font-mono font-bold"
                />
              </div>

              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-1">
                <label className="block font-semibold">Ujian Akhir Semester / UKK (%)</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  value={formData.examsWeight}
                  onChange={(e) => setFormData({ ...formData, examsWeight: Number(e.target.value) })}
                  className="w-full p-2 rounded-lg border border-slate-300 dark:border-slate-600 font-mono font-bold"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end">
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-600/20 flex items-center gap-2"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan Pengaturan</span>
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}
