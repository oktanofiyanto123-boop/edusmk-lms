'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { GraduationCap, Mail, ArrowLeft, CheckCircle2, AlertCircle } from 'lucide-react';
import { RoleSwitchBanner } from '@/components/layout/RoleSwitchBanner';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <RoleSwitchBanner />
      <div className="flex-1 flex flex-col justify-center items-center px-4 py-12">
        <div className="w-full max-w-md space-y-6">
          <div className="text-center space-y-2">
            <Link href="/" className="inline-flex items-center gap-2 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                <GraduationCap className="w-7 h-7" />
              </div>
            </Link>
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
              Pemulihan Kata Sandi
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Masukkan alamat email akun sekolah Anda yang terdaftar.
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xl">
            {submitted ? (
              <div className="text-center space-y-4 py-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Instruksi Pemulihan Telah Dikirim
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
                  Tautan untuk mengatur ulang kata sandi telah dikirim ke <strong>{email}</strong>. Periksa kotak masuk atau folder spam Anda.
                </p>
                <div className="pt-2">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-1.5 text-xs text-blue-600 font-semibold hover:underline"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Kembali ke Halaman Masuk</span>
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Alamat Email Terdaftar
                  </label>
                  <div className="relative">
                    <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="nama@edusmk.sch.id"
                      className="w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md transition-all"
                >
                  Kirim Tautan Reset
                </button>

                <div className="text-center pt-2">
                  <Link
                    href="/login"
                    className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Kembali ke Login</span>
                  </Link>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
