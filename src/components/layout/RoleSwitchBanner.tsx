'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLms } from '@/lib/store';
import { UserRole } from '@/lib/types';
import { Shield, GraduationCap, UserCheck, RefreshCw, Sun, Moon, ArrowRight } from 'lucide-react';

export function RoleSwitchBanner() {
  const { currentUser, switchRole, resetAllData } = useLms();
  const router = useRouter();
  const [isDark, setIsDark] = React.useState(false);

  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      const isDarkMode = document.documentElement.classList.contains('dark');
      setIsDark(isDarkMode);
    }
  }, []);

  const toggleTheme = () => {
    if (typeof document !== 'undefined') {
      const root = document.documentElement;
      if (root.classList.contains('dark')) {
        root.classList.remove('dark');
        setIsDark(false);
      } else {
        root.classList.add('dark');
        setIsDark(true);
      }
    }
  };

  const handleRoleChange = (role: UserRole) => {
    switchRole(role);
    if (role === 'admin') router.push('/admin');
    else if (role === 'guru') router.push('/guru');
    else if (role === 'siswa') router.push('/siswa');
  };

  return (
    <aside
      aria-label="Demo mode switcher"
      className="bg-slate-900 text-white text-xs border-b border-slate-800 relative z-30 px-3 py-2 flex items-center justify-between gap-2 overflow-x-auto select-none"
    >
      <div className="flex items-center gap-2 shrink-0">
        <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
        <span className="font-semibold tracking-wide text-slate-300 uppercase text-[10px] sm:text-[11px] hidden sm:inline">
          Demo:
        </span>
        <div className="flex items-center gap-1 bg-slate-800/80 p-0.5 rounded-lg border border-slate-700 shrink-0">
          <button
            type="button"
            onClick={() => handleRoleChange('admin')}
            className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] transition-all touch-manipulation ${
              currentUser.role === 'admin'
                ? 'bg-blue-600 text-white font-medium shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
            title="Beralih ke Admin Sekolah"
          >
            <Shield className="w-3.5 h-3.5 shrink-0" />
            <span>Admin</span>
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange('guru')}
            className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] transition-all touch-manipulation ${
              currentUser.role === 'guru'
                ? 'bg-emerald-600 text-white font-medium shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
            title="Beralih ke Guru Pengampu"
          >
            <GraduationCap className="w-3.5 h-3.5 shrink-0" />
            <span>Guru</span>
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange('siswa')}
            className={`flex items-center gap-1 px-2 py-1 rounded text-[11px] transition-all touch-manipulation ${
              currentUser.role === 'siswa'
                ? 'bg-indigo-600 text-white font-medium shadow-xs'
                : 'text-slate-400 hover:text-white hover:bg-slate-700/50'
            }`}
            title="Beralih ke Siswa SMK"
          >
            <UserCheck className="w-3.5 h-3.5 shrink-0" />
            <span>Siswa</span>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <div className="hidden lg:flex items-center text-slate-400 text-[11px]">
          Aktif: <strong className="text-white ml-1 font-medium truncate max-w-[140px]">{currentUser.full_name}</strong>
          <span className="mx-1.5 text-slate-600">•</span>
          <span className="capitalize text-blue-400 font-mono text-[10px] bg-blue-950/60 border border-blue-800 px-1.5 py-0.5 rounded">
            {currentUser.role}
          </span>
        </div>

        <button
          type="button"
          onClick={toggleTheme}
          className="p-1.5 rounded-md text-slate-300 hover:text-white hover:bg-slate-800 transition-colors touch-manipulation"
          title={isDark ? 'Ganti ke Light Mode' : 'Ganti ke Dark Mode'}
          aria-label="Toggle theme"
        >
          {isDark ? <Sun className="w-3.5 h-3.5 text-amber-300" /> : <Moon className="w-3.5 h-3.5" />}
        </button>

        <button
          type="button"
          onClick={resetAllData}
          className="hidden sm:flex items-center gap-1 text-[10px] sm:text-[11px] text-slate-400 hover:text-rose-300 px-1.5 py-1 rounded hover:bg-slate-800 transition-colors touch-manipulation"
          title="Reset data simulasi ke setelan awal"
        >
          <RefreshCw className="w-3 h-3" />
          <span>Reset</span>
        </button>

        <Link
          href="/"
          className="flex items-center gap-1 text-slate-300 hover:text-white hover:underline text-[11px] px-1 py-0.5 touch-manipulation"
        >
          <span>Landing</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>
    </aside>
  );
}
