'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useLms } from '@/lib/store';
import {
  LayoutDashboard,
  Users,
  Building2,
  BookOpen,
  FileText,
  ClipboardList,
  Award,
  Bell,
  Settings,
  HelpCircle,
  LogOut,
  ChevronRight,
  GraduationCap,
  CheckCircle2,
  ListTodo,
  TrendingUp,
  User,
  Shield,
  Layers,
  FileCheck,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function DashboardSidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { currentUser, schoolSettings, switchRole } = useLms();

  const handleLogout = () => {
    router.push('/login');
  };

  const adminNav = [
    { label: 'Ringkasan Statistik', href: '/admin', icon: LayoutDashboard },
    { label: 'Manajemen Pengguna', href: '/admin/users', icon: Users },
    { label: 'Kelas & Jurusan', href: '/admin/classes', icon: Building2 },
    { label: 'Mata Pelajaran', href: '/admin/subjects', icon: BookOpen },
    { label: 'Materi Sekolah', href: '/admin/materials', icon: FileText },
    { label: 'Manajemen Tugas', href: '/admin/assignments', icon: ClipboardList },
    { label: 'Pengumuman Sekolah', href: '/admin/announcements', icon: Bell },
    { label: 'Rekap Penilaian', href: '/admin/grades', icon: Award },
    { label: 'Pengaturan LMS', href: '/admin/settings', icon: Settings },
  ];

  const guruNav = [
    { label: 'Dashboard Mengajar', href: '/guru', icon: LayoutDashboard },
    { label: 'Kelas & Mapel Diampu', href: '/guru/classes', icon: Layers },
    { label: 'Kelola Materi', href: '/guru/materials', icon: FileText },
    { label: 'Kelola Tugas Siswa', href: '/guru/assignments', icon: ClipboardList },
    { label: 'Penilaian & Feedback', href: '/guru/grading', icon: FileCheck },
    { label: 'Bank Kuis & Evaluasi', href: '/guru/quizzes', icon: CheckCircle2 },
    { label: 'Pengumuman Kelas', href: '/guru/announcements', icon: Bell },
    { label: 'Rekap Nilai (Export)', href: '/guru/recap', icon: Award },
  ];

  const siswaNav = [
    { label: 'Dashboard Belajar', href: '/siswa', icon: LayoutDashboard },
    { label: 'Mata Pelajaran', href: '/siswa/classes', icon: BookOpen },
    { label: 'Materi Pembelajaran', href: '/siswa/materials', icon: FileText },
    { label: 'Tugas Saya', href: '/siswa/assignments', icon: ListTodo },
    { label: 'Kuis & Evaluasi', href: '/siswa/quizzes', icon: CheckCircle2 },
    { label: 'Nilai & Feedback', href: '/siswa/grades', icon: Award },
    { label: 'Progres Capaian', href: '/siswa/progress', icon: TrendingUp },
    { label: 'Pengumuman', href: '/siswa/announcements', icon: Bell },
    { label: 'Profil Saya', href: '/siswa/profile', icon: User },
  ];

  const navItems =
    currentUser.role === 'admin'
      ? adminNav
      : currentUser.role === 'guru'
      ? guruNav
      : siswaNav;

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-40 lg:hidden"
        />
      )}

      <aside
        className={`fixed top-0 bottom-0 left-0 z-50 w-64 bg-slate-900 text-slate-200 border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out lg:translate-x-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Brand Header */}
        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-bold text-base tracking-tight text-white">EduSMK</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-400 border border-blue-500/30">
                  LMS
                </span>
              </div>
              <p className="text-[11px] text-slate-400 truncate max-w-[140px]">
                {schoolSettings.school_name}
              </p>
            </div>
          </Link>
        </div>

        {/* User Card Mini */}
        <div className="px-4 py-3 bg-slate-950/40 border-b border-slate-800/80 flex items-center gap-3">
          <img
            src={currentUser.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
            alt={currentUser.full_name}
            className="w-9 h-9 rounded-full object-cover border border-slate-700 shadow-xs"
          />
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-white truncate">{currentUser.full_name}</p>
            <p className="text-[11px] text-blue-400 capitalize flex items-center gap-1">
              {currentUser.role === 'admin' ? (
                <Shield className="w-3 h-3 text-blue-400" />
              ) : currentUser.role === 'guru' ? (
                <GraduationCap className="w-3 h-3 text-emerald-400" />
              ) : (
                <User className="w-3 h-3 text-indigo-400" />
              )}
              {currentUser.role}
              {currentUser.class_name && (
                <span className="text-slate-400">• {currentUser.class_name}</span>
              )}
            </p>
          </div>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
            Menu Utama ({currentUser.role})
          </div>

          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => {
                  if (window.innerWidth < 1024) onClose();
                }}
                className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-all group ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30 font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/80'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-colors ${
                      isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {isActive && <ChevronRight className="w-3.5 h-3.5 opacity-80" />}
              </Link>
            );
          })}
        </div>

        {/* Footer actions */}
        <div className="p-3 border-t border-slate-800 bg-slate-950/60 space-y-1">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Keluar Akun</span>
          </button>
        </div>
      </aside>
    </>
  );
}
