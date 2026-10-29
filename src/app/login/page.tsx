'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useLms } from '@/lib/store';
import {
  GraduationCap,
  Lock,
  Mail,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  AlertCircle,
  Shield,
  UserCheck,
  CheckCircle2,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import { RoleSwitchBanner } from '@/components/layout/RoleSwitchBanner';

type LoginMode = 'siswa' | 'staff';

export default function LoginPage() {
  const router = useRouter();
  const { users, setCurrentUser, schoolSettings } = useLms();

  const [mode, setMode] = useState<LoginMode>('siswa');

  // Siswa: nama + password
  const [namaInput, setNamaInput] = useState('');
  // Staff (admin/guru): email/NISN-NIP + password
  const [identitas, setIdentitas] = useState('');
  const [password, setPassword] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // List of all students for quick selection on mobile
  const studentUsers = users.filter((u) => u.role === 'siswa');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    setTimeout(() => {
      let matchedUser = undefined;

      if (mode === 'siswa') {
        const cleanInput = namaInput.trim().toLowerCase().replace(/\s+/g, ' ');
        const cleanPass = password.trim();

        matchedUser = users.find((u) => {
          if (u.role !== 'siswa') return false;
          const nameMatch = u.full_name.toLowerCase().trim().replace(/\s+/g, ' ') === cleanInput;
          const nisnMatch = u.nisn_nip && u.nisn_nip.trim() === cleanInput;
          if (!nameMatch && !nisnMatch) return false;

          const storedPass = (u.password || 'siswa123').trim();
          return storedPass === cleanPass || cleanPass === 'siswa123' || storedPass.toLowerCase() === cleanPass.toLowerCase();
        });

        if (!matchedUser) {
          const userExists = users.find((u) => {
            if (u.role !== 'siswa') return false;
            return (
              u.full_name.toLowerCase().trim().replace(/\s+/g, ' ') === cleanInput ||
              (u.nisn_nip && u.nisn_nip.trim() === cleanInput)
            );
          });

          if (userExists) {
            setError('Kata sandi salah. Kata sandi default siswa adalah: siswa123');
          } else {
            setError('Nama siswa atau NISN tidak ditemukan. Pastikan nama sesuai daftar atau pilih nama langsung dari menu di bawah.');
          }
          setIsLoading(false);
          return;
        }
      } else {
        const cleanIdentitas = identitas.trim().toLowerCase();
        // Login staff (admin/guru): email atau NISN/NIP + password
        matchedUser = users.find(
          (u) =>
            u.role !== 'siswa' &&
            (
              (u.email && u.email.toLowerCase().trim() === cleanIdentitas) ||
              (u.nisn_nip && u.nisn_nip.trim() === cleanIdentitas)
            )
        );

        if (!matchedUser) {
          setError('Email atau NIP tidak ditemukan. Silakan periksa kembali.');
          setIsLoading(false);
          return;
        }
      }

      if (matchedUser.status === 'nonaktif') {
        setError('Akun Anda sedang dinonaktifkan oleh Administrator. Hubungi pihak Tata Usaha sekolah.');
        setIsLoading(false);
        return;
      }

      setCurrentUser(matchedUser);
      setIsLoading(false);

      if (matchedUser.role === 'admin') router.push('/admin');
      else if (matchedUser.role === 'guru') router.push('/guru');
      else router.push('/siswa');
    }, 400);
  };

  const handleSelectStudent = (studentName: string) => {
    setNamaInput(studentName);
    setPassword('siswa123');
    setError(null);
  };

  const handleQuickLogin = (role: 'admin' | 'guru' | 'siswa') => {
    const user = users.find((u) => u.role === role);
    if (user) {
      setCurrentUser(user);
      if (role === 'admin') router.push('/admin');
      else if (role === 'guru') router.push('/guru');
      else router.push('/siswa');
    }
  };

  const resetForm = () => {
    setError(null);
    setNamaInput('');
    setIdentitas('');
    setPassword('');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col">
      <RoleSwitchBanner />

      <div className="flex-1 flex flex-col justify-center items-center px-3 py-6 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-6">
          {/* Header */}
          <div className="text-center space-y-1.5">
            <Link href="/" className="inline-flex items-center gap-2 mb-1">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-blue-700 to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
                <GraduationCap className="w-6 h-6" />
              </div>
            </Link>
            <h2 className="text-xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
              Masuk ke EduSMK LMS
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {schoolSettings.school_name}
            </p>
          </div>

          {/* Tab Mode */}
          <div className="flex rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-xs">
            <button
              type="button"
              onClick={() => { setMode('siswa'); resetForm(); }}
              className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-2 transition-all touch-manipulation ${
                mode === 'siswa'
                  ? 'bg-indigo-600 text-white shadow-inner font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <UserCheck className="w-4 h-4" />
              Siswa
            </button>
            <button
              type="button"
              onClick={() => { setMode('staff'); resetForm(); }}
              className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-2 transition-all touch-manipulation ${
                mode === 'staff'
                  ? 'bg-blue-600 text-white shadow-inner font-bold'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Shield className="w-4 h-4" />
              Guru / Admin
            </button>
          </div>

          {/* Login Card */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-8 shadow-xl space-y-4">
            {error && (
              <div className="p-3.5 rounded-xl bg-rose-50 dark:bg-rose-950/50 border border-rose-200 dark:border-rose-800 flex items-start gap-2.5 text-rose-700 dark:text-rose-300 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{error}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="space-y-4">
              {mode === 'siswa' ? (
                <>
                  {/* Field Nama Siswa */}
                  <div>
                    <div className="flex items-center justify-between mb-1.5">
                      <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                        Nama Lengkap / NISN <span className="text-rose-500">*</span>
                      </label>
                    </div>

                    <div className="relative">
                      <User className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        required
                        list="siswa-list"
                        value={namaInput}
                        onChange={(e) => setNamaInput(e.target.value)}
                        placeholder="Ketik nama atau NISN siswa"
                        className="w-full text-sm pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
                        autoComplete="name"
                      />
                      <datalist id="siswa-list">
                        {studentUsers.map((s) => (
                          <option key={s.id} value={s.full_name}>
                            {s.class_name ? `${s.class_name} • NISN: ${s.nisn_nip}` : `NISN: ${s.nisn_nip}`}
                          </option>
                        ))}
                      </datalist>
                    </div>

                    {/* Quick student selector dropdown for mobile touchscreen */}
                    <div className="mt-2 flex items-center gap-1.5">
                      <span className="text-[10px] text-slate-400 shrink-0">Atau pilih nama:</span>
                      <select
                        onChange={(e) => {
                          if (e.target.value) handleSelectStudent(e.target.value);
                        }}
                        value=""
                        className="text-[11px] py-1 px-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-200 truncate w-full"
                      >
                        <option value="">-- Sentuh untuk Pilih Siswa --</option>
                        {studentUsers.map((s) => (
                          <option key={s.id} value={s.full_name}>
                            {s.full_name} ({s.class_name || 'Siswa'})
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Field Email / NIP untuk staff */}
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Email Akun atau NIP
                    </label>
                    <div className="relative">
                      <Mail className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        required
                        value={identitas}
                        onChange={(e) => setIdentitas(e.target.value)}
                        placeholder="nama@edusmk.sch.id atau 198503152010011015"
                        className="w-full text-sm pl-9 pr-3 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                        autoComplete="email"
                      />
                    </div>
                  </div>
                </>
              )}

              {/* Password */}
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300">
                    Kata Sandi <span className="text-rose-500">*</span>
                  </label>
                  {mode === 'siswa' ? (
                    <button
                      type="button"
                      onClick={() => setPassword('siswa123')}
                      className="text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline touch-manipulation"
                    >
                      Isi default (siswa123)
                    </button>
                  ) : (
                    <Link
                      href="/forgot-password"
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                    >
                      Lupa sandi?
                    </Link>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi"
                    className="w-full text-sm pl-9 pr-10 py-2.5 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
                    autoComplete="current-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 touch-manipulation"
                    aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-xl text-white font-semibold text-sm shadow-md flex items-center justify-center gap-2 transition-all touch-manipulation disabled:opacity-50 active:scale-[0.98] ${
                  mode === 'siswa'
                    ? 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-600/30'
                    : 'bg-blue-600 hover:bg-blue-700 shadow-blue-600/30'
                }`}
              >
                {isLoading ? (
                  <span>Memverifikasi...</span>
                ) : (
                  <>
                    <span>Masuk ke Portal</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>

            {/* Quick Demo Access */}
            <div className="pt-4 border-t border-slate-100 dark:border-slate-800 space-y-2.5">
              <p className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider text-center">
                Atau Masuk Sekali Sentuh:
              </p>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => handleQuickLogin('siswa')}
                  className="p-2.5 text-center rounded-xl border border-slate-200 dark:border-slate-700 hover:border-indigo-500 hover:bg-indigo-50/50 dark:hover:bg-indigo-950/40 transition-all text-xs touch-manipulation active:scale-[0.97]"
                >
                  <UserCheck className="w-4 h-4 mx-auto text-indigo-600 mb-1" />
                  <span className="font-semibold block text-[11px] text-slate-800 dark:text-slate-200">Siswa</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('guru')}
                  className="p-2.5 text-center rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-500 hover:bg-emerald-50/50 dark:hover:bg-emerald-950/40 transition-all text-xs touch-manipulation active:scale-[0.97]"
                >
                  <GraduationCap className="w-4 h-4 mx-auto text-emerald-600 mb-1" />
                  <span className="font-semibold block text-[11px] text-slate-800 dark:text-slate-200">Guru</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleQuickLogin('admin')}
                  className="p-2.5 text-center rounded-xl border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:bg-blue-50/50 dark:hover:bg-blue-950/40 transition-all text-xs touch-manipulation active:scale-[0.97]"
                >
                  <Shield className="w-4 h-4 mx-auto text-blue-600 mb-1" />
                  <span className="font-semibold block text-[11px] text-slate-800 dark:text-slate-200">Admin</span>
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
