'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLms } from '@/lib/store';
import {
  GraduationCap,
  Lock,
  Mail,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Shield,
  UserCheck,
  CheckCircle2,
} from 'lucide-react';
import { RoleSwitchBanner } from '@/components/layout/RoleSwitchBanner';

export default function LoginPage() {
  const router = useRouter();
  const { users, setCurrentUser, schoolSettings } = useLms();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      // Find matching user in database/store
      const matchedUser = users.find(
        (u) => u.email.toLowerCase() === email.toLowerCase() || u.nisn_nip === email
      );

      if (!matchedUser) {
        setError('Email atau NISN/NIP tidak ditemukan dalam sistem sekolah. Silakan periksa kembali.');
        setIsLoading(false);
        return;
      }

      if (matchedUser.status === 'nonaktif') {
        setError('Akun Anda sedang dinonaktifkan oleh Administrator. Hubungi pihak Tata Usaha sekolah.');
        setIsLoading(false);
        return;
      }

      // Successful login
      setCurrentUser(matchedUser);
      setIsLoading(false);

      if (matchedUser.role === 'admin') router.push('/admin');
      else if (matchedUser.role === 'guru') router.push('/guru');
      else router.push('/siswa');
    }, 600);
  };

  const handleQuickLogin = (role: 'admin' | 'guru' | 'siswa') => {
    const user = users.find((u) => u.role === role);
    if (user) {
      setEmail(user.email);
      setPassword('password123');
      setCurrentUser(user);
      if (role === 'admin') router.push('/admin');
      else if (role === 'guru') router.push('/guru');
      else router.push('/siswa');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <RoleSwitchBanner />

      <div className="flex-1 flex flex-col justify-center items-center px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center space-y-2">
            <Link href="/" className="inline-flex items-center gap-2 mb-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
                <GraduationCap className="w-7 h-7" />
              </div>
            </Link>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Masuk ke EduSMK LMS
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
              {schoolSettings.school_name}
            </p>
          </div>

          {/* Login Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl">
            {error && (
              <div className="mb-6 p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 flex items-start gap-3 text-rose-700 dark:text-rose-300 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Email Akun atau NISN / NIP
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type="text"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="nama@edusmk.sch.id atau 0067823412"
                    className="w-full text-xs sm:text-sm pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Kata Sandi
                  </label>
                  <Link
                    href="/forgot-password"
                    className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Lupa sandi?
                  </Link>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full text-xs sm:text-sm pl-9 pr-10 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                    aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              >
                {isLoading ? (
                  <span>Memverifikasi kredensial...</span>
                ) : (
                  <>
                    <span>Masuk ke Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Access Buttons */}
            <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-center">
                Atau Masuk Instan (Mode Uji Coba):
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin')}
                  className="p-2 text-center rounded-lg border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/40 transition-all text-xs"
                >
                  <Shield className="w-4 h-4 mx-auto text-blue-600 mb-1" />
                  <span className="font-semibold block text-[11px] text-slate-800 dark:text-slate-200">Admin</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('guru')}
                  className="p-2 text-center rounded-lg border border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/40 transition-all text-xs"
                >
                  <GraduationCap className="w-4 h-4 mx-auto text-emerald-600 mb-1" />
                  <span className="font-semibold block text-[11px] text-slate-800 dark:text-slate-200">Guru</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('siswa')}
                  className="p-2 text-center rounded-lg border border-slate-200 dark:border-slate-700 hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/40 transition-all text-xs"
                >
                  <UserCheck className="w-4 h-4 mx-auto text-indigo-600 mb-1" />
                  <span className="font-semibold block text-[11px] text-slate-800 dark:text-slate-200">Siswa</span>
                </button>
              </div>
            </div>
          </div>

          <p className="text-center text-xs text-slate-500 dark:text-slate-400">
            Kembali ke{' '}
            <Link href="/" className="text-blue-600 dark:text-blue-400 hover:underline font-medium">
              Halaman Utama
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
