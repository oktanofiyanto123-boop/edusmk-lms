'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useLms } from '@/lib/store';
import { User, Phone, CheckCircle2, Shield, Lock, Save, KeyRound } from 'lucide-react';

export default function SiswaProfilePage() {
  const { currentUser, updateUser, changePassword, schoolSettings } = useLms();
  const [phone, setPhone] = useState(currentUser.phone || '0857-1122-3344');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordSuccess, setPasswordSuccess] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [contactSaved, setContactSaved] = useState(false);

  const handleSaveContact = (e: React.FormEvent) => {
    e.preventDefault();
    updateUser(currentUser.id, { phone });
    setContactSaved(true);
    setTimeout(() => setContactSaved(false), 3000);
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordError(null);
    setPasswordSuccess(null);

    if (!newPassword.trim()) {
      setPasswordError('Kata sandi baru tidak boleh kosong.');
      return;
    }

    if (newPassword.length < 4) {
      setPasswordError('Kata sandi minimal 4 karakter.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError('Konfirmasi kata sandi tidak cocok.');
      return;
    }

    changePassword(currentUser.id, newPassword.trim());
    setPasswordSuccess('Kata sandi berhasil diubah! Gunakan kata sandi ini saat masuk kembali.');
    setNewPassword('');
    setConfirmPassword('');
    setTimeout(() => setPasswordSuccess(null), 5000);
  };

  return (
    <DashboardLayout
      title="Profil Peserta Didik"
      subtitle="Informasi Identitas Siswa, Data Akademik, dan Keamanan Akun"
    >
      <div className="max-w-4xl space-y-6">
        {/* Identitas Card */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-center sm:items-start gap-5">
          <img
            src={currentUser.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'}
            alt={currentUser.full_name}
            className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-indigo-500 shadow-md shrink-0"
          />

          <div className="space-y-2 text-center sm:text-left flex-1 min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white truncate">
                {currentUser.full_name}
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300 uppercase shrink-0">
                {currentUser.role}
              </span>
            </div>

            <p className="text-xs text-slate-500">
              NISN: <span className="font-mono font-bold text-slate-700 dark:text-slate-300">{currentUser.nisn_nip || '-'}</span>
              {' '}• Rombel: <span className="font-bold text-slate-700 dark:text-slate-300">{currentUser.class_name || 'XII RPL 1'}</span>
            </p>

            <p className="text-[11px] text-slate-400">
              {schoolSettings.school_name} • 1 Akun Tunggal Resmi Siswa
            </p>
          </div>
        </div>

        {/* Informasi Keterikatan Data */}
        <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800/60 text-xs text-blue-800 dark:text-blue-300 flex items-start gap-3">
          <Shield className="w-5 h-5 shrink-0 mt-0.5 text-blue-600 dark:text-blue-400" />
          <div className="space-y-1">
            <p className="font-bold">Integritas Data Akun Siswa</p>
            <p className="text-[11px] leading-relaxed text-blue-700 dark:text-blue-300/90">
              Nama lengkap <strong>{currentUser.full_name}</strong> dan NISN <strong>{currentUser.nisn_nip}</strong> terkunci pada sistem untuk memastikan seluruh progres belajar, pengumpulan tugas, kuis, nilai raport, serta transkrip akademik tercatat akurat dan tidak tertukar.
            </p>
          </div>
        </div>

        {/* Form Ubah Sandi Siswa */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4 text-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <KeyRound className="w-4 h-4 text-indigo-600" />
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              Ganti Kata Sandi Akun Siswa
            </h4>
          </div>

          {passwordSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>{passwordSuccess}</span>
            </div>
          )}

          {passwordError && (
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 flex items-center gap-2 text-rose-700 dark:text-rose-300">
              <span>{passwordError}</span>
            </div>
          )}

          <form onSubmit={handleChangePassword} className="space-y-3.5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Kata Sandi Baru
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Buat sandi baru"
                    className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Ulangi Kata Sandi Baru
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="password"
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Ketik ulang sandi"
                    className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold flex items-center gap-1.5 shadow-xs touch-manipulation"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>Simpan Kata Sandi Baru</span>
              </button>
            </div>
          </form>
        </div>

        {/* Form update kontak */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs space-y-4 text-xs">
          <div className="flex items-center gap-2 pb-2 border-b border-slate-100 dark:border-slate-800">
            <Phone className="w-4 h-4 text-blue-600" />
            <h4 className="font-bold text-sm text-slate-900 dark:text-white">
              Nomor Kontak Siswa (Opsional)
            </h4>
          </div>

          {contactSaved && (
            <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 flex items-center gap-2 text-emerald-700 dark:text-emerald-300">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Nomor telepon berhasil disimpan!</span>
            </div>
          )}

          <form onSubmit={handleSaveContact} className="space-y-3.5">
            <div>
              <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Nomor WhatsApp / HP Siswa
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Contoh: 0857-1122-3344"
                className="w-full text-xs p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
              />
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold flex items-center gap-1.5 shadow-xs touch-manipulation"
              >
                <Save className="w-3.5 h-3.5" />
                <span>Simpan Nomor Kontak</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </DashboardLayout>
  );
}
