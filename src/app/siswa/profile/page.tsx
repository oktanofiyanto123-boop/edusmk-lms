'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useLms } from '@/lib/store';
import { User, Mail, Phone, Building, CheckCircle2, Shield, Award, Save } from 'lucide-react';

export default function SiswaProfilePage() {
  const { currentUser, updateUser, schoolSettings } = useLms();
  const [phone, setPhone] = useState(currentUser.phone || '0857-1122-3344');
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(currentUser.id, { phone });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <DashboardLayout
      title="Profil Peserta Didik"
      subtitle="Informasi Identitas Siswa, Data Akademik, dan Kontak Resmi"
    >
      <div className="max-w-4xl space-y-6">
        {saved && (
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2.5 text-xs text-emerald-700 dark:text-emerald-300">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>Nomor kontak berhasil diperbarui!</span>
          </div>
        )}

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <img
            src={currentUser.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
            alt={currentUser.full_name}
            className="w-24 h-24 rounded-2xl object-cover border-2 border-blue-500 shadow-md"
          />

          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                {currentUser.full_name}
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 uppercase">
                {currentUser.role}
              </span>
            </div>

            <p className="text-xs text-slate-500">
              NISN: <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{currentUser.nisn_nip}</span>
              {' '}• Kelas: <span className="font-bold text-slate-700 dark:text-slate-300">{currentUser.class_name || 'XII RPL 1'}</span>
            </p>

            <p className="text-xs text-slate-400">
              {schoolSettings.school_name}
            </p>
          </div>
        </div>

        {/* Form update kontak */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-4 text-xs">
          <h4 className="font-bold text-sm text-slate-900 dark:text-white">
            Data Kontak & Akun
          </h4>

          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-semibold mb-1">Alamat Email Terdaftar</label>
                <input
                  type="email"
                  disabled
                  value={currentUser.email}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-100 dark:bg-slate-800/80 text-slate-500 cursor-not-allowed"
                />
                <span className="text-[10px] text-slate-400 mt-1 block">Email dikelola oleh administrator sekolah.</span>
              </div>

              <div>
                <label className="block font-semibold mb-1">Nomor WhatsApp / Telepon Siswa</label>
                <input
                  type="text"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                />
              </div>
            </div>

            <div className="flex justify-end pt-3 border-t border-slate-100 dark:border-slate-800">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-1.5 shadow-xs"
              >
                <Save className="w-4 h-4" />
                <span>Simpan Perubahan Kontak</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
