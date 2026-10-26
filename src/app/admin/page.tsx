'use client';

import React from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useLms } from '@/lib/store';
import {
  Users,
  GraduationCap,
  Building2,
  BookOpen,
  FileText,
  ClipboardList,
  CheckCircle2,
  Shield,
  TrendingUp,
  ArrowUpRight,
  Plus,
  Layers,
  Database,
  Server,
  Bell,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function AdminDashboardPage() {
  const { users, classes, departments, subjects, materials, assignments, schoolSettings, announcements } = useLms();

  const totalTeachers = users.filter((u) => u.role === 'guru').length;
  const totalStudents = users.filter((u) => u.role === 'siswa').length;
  const totalMaterials = materials.length;
  const totalAssignments = assignments.length;

  return (
    <DashboardLayout
      title="Dashboard Administrator Sekolah"
      subtitle={`Selamat datang di Panel Utama ${schoolSettings.school_name}`}
    >
      <div className="space-y-6">
        {/* Top welcome banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white shadow-xl relative overflow-hidden">
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-400/30 text-[11px] font-medium">
                <Shield className="w-3.5 h-3.5" />
                <span>Kendali Penuh Sistem LMS Terpadu</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                Pusat Komando Digital SMK
              </h2>
              <p className="text-xs sm:text-sm text-slate-300 max-w-xl">
                Pantau keaktifan belajar-mengajar, kelola data master guru & siswa, konfigurasikan pembobotan nilai, serta pastikan integritas data database PostgreSQL.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5">
              <Link
                href="/admin/users"
                className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md flex items-center gap-1.5 transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Pengguna</span>
              </Link>
              <Link
                href="/admin/announcements"
                className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold border border-white/20 flex items-center gap-1.5 transition-all"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>Buat Pengumuman</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Statistic Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Total Siswa Aktif</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{totalStudents}</p>
              <p className="text-[11px] text-emerald-600 dark:text-emerald-400 flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" />
                <span>Terdata di {classes.length} Rombel</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <GraduationCap className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Dewan Guru Pengampu</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{totalTeachers}</p>
              <p className="text-[11px] text-blue-600 dark:text-blue-400 flex items-center gap-1 mt-1">
                <span>{subjects.length} Mata Pelajaran</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Users className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Materi Pembelajaran</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{totalMaterials}</p>
              <p className="text-[11px] text-indigo-600 dark:text-indigo-400 flex items-center gap-1 mt-1">
                <span>Modul & Video Siap Akses</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
              <FileText className="w-6 h-6" />
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex items-center justify-between">
            <div>
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Jurusan Kejuruan</p>
              <p className="text-2xl font-bold text-slate-900 dark:text-white mt-1">{departments.length}</p>
              <p className="text-[11px] text-purple-600 dark:text-purple-400 flex items-center gap-1 mt-1">
                <span>RPL, TKJ, DKV, SIJA</span>
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950 text-purple-600 dark:text-purple-400 flex items-center justify-center">
              <Layers className="w-6 h-6" />
            </div>
          </div>
        </div>

        {/* Two-column layout: Recent Users & Jurusan Status */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Recent Users List */}
          <div className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                  Daftar Pengguna Terbaru
                </h3>
                <p className="text-xs text-slate-500">Guru, Siswa, dan Staf Terdaftar</p>
              </div>
              <Link
                href="/admin/users"
                className="text-xs text-blue-600 dark:text-blue-400 font-semibold hover:underline flex items-center gap-1"
              >
                <span>Kelola Semua</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-semibold uppercase text-[10px]">
                    <th className="pb-3 pl-2">Nama & Email</th>
                    <th className="pb-3">Peran</th>
                    <th className="pb-3">NISN / NIP</th>
                    <th className="pb-3">Status</th>
                    <th className="pb-3 pr-2 text-right">Terdaftar</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-700 dark:text-slate-300">
                  {users.slice(0, 5).map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 pl-2 flex items-center gap-2.5">
                        <img
                          src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80'}
                          alt={user.full_name}
                          className="w-7 h-7 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">{user.full_name}</p>
                          <p className="text-[11px] text-slate-400">{user.email}</p>
                        </div>
                      </td>
                      <td className="py-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold uppercase ${
                          user.role === 'admin'
                            ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                            : user.role === 'guru'
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                        }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 font-mono text-[11px]">{user.nisn_nip || '-'}</td>
                      <td className="py-3">
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Aktif</span>
                        </span>
                      </td>
                      <td className="py-3 pr-2 text-right text-slate-400 text-[11px]">
                        {formatDate(user.created_at)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right sidebar: System Info & Quick Settings */}
          <div className="lg:col-span-4 space-y-6">
            {/* System Status card */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <h3 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <Database className="w-4 h-4 text-blue-600" />
                  <span>Status Infrastruktur LMS</span>
                </h3>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>

              <div className="space-y-2.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Database Engine:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">PostgreSQL (Supabase)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Keamanan Akses:</span>
                  <span className="font-semibold text-emerald-600 dark:text-emerald-400">RLS Aktif (17 Kebijakan)</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Penyimpanan File:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Supabase Storage</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-500">Versi Framework:</span>
                  <span className="font-semibold text-slate-800 dark:text-slate-200">Next.js 16 (App Router)</span>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-3">
              <h3 className="text-xs font-bold text-slate-900 dark:text-white">
                Aksi Cepat Administrator
              </h3>
              <div className="space-y-2">
                <Link
                  href="/admin/classes"
                  className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all text-xs"
                >
                  <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-medium">
                    <Building2 className="w-4 h-4 text-blue-600" />
                    <span>Kelola Rombel & Jurusan</span>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>

                <Link
                  href="/admin/grades"
                  className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all text-xs"
                >
                  <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-medium">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    <span>Rekapitulasi Nilai Siswa</span>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>

                <Link
                  href="/admin/settings"
                  className="w-full flex items-center justify-between p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-blue-500 hover:bg-slate-50 dark:hover:bg-slate-800/60 transition-all text-xs"
                >
                  <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-medium">
                    <Server className="w-4 h-4 text-purple-600" />
                    <span>Konfigurasi Sekolah & Bobot</span>
                  </div>
                  <ArrowUpRight className="w-3.5 h-3.5 text-slate-400" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
