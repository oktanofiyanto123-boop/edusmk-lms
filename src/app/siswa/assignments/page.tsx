'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useLms } from '@/lib/store';
import {
  ClipboardList,
  Search,
  Calendar,
  CheckCircle2,
  Clock,
  Award,
  ArrowRight,
  FileCheck,
  FileText,
  AlertCircle,
  UploadCloud,
} from 'lucide-react';
import { formatDate, getStatusBadge } from '@/lib/utils';

export default function SiswaAssignmentsPage() {
  const { assignments, submissions, currentUser } = useLms();
  const [filter, setFilter] = useState<'all' | 'pending' | 'submitted' | 'graded'>('all');
  const [search, setSearch] = useState('');

  const mySubmissions = submissions.filter((s) => s.student_id === currentUser.id);

  // Statistics
  const pendingCount = assignments.filter((a) => !mySubmissions.find((s) => s.assignment_id === a.id)).length;
  const submittedCount = mySubmissions.filter((s) => s.status === 'sudah_dikumpulkan').length;
  const gradedCount = mySubmissions.filter((s) => s.status === 'sudah_dinilai').length;

  const filtered = assignments.filter((asg) => {
    const sub = mySubmissions.find((s) => s.assignment_id === asg.id);
    const matchSearch =
      asg.title.toLowerCase().includes(search.toLowerCase()) ||
      asg.subject_name?.toLowerCase().includes(search.toLowerCase());

    if (!matchSearch) return false;

    if (filter === 'pending') return !sub;
    if (filter === 'submitted') return sub && sub.status === 'sudah_dikumpulkan';
    if (filter === 'graded') return sub && sub.status === 'sudah_dinilai';
    return true;
  });

  return (
    <DashboardLayout
      title="Tugas Praktik Saya"
      subtitle="Instruksi Tugas Kejuruan, Upload Berkas (Semua Format), dan Hasil Evaluasi Guru"
    >
      <div className="space-y-6">
        {/* KPI Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Total Tugas</span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <ClipboardList className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-2">
              {assignments.length}
            </p>
            <p className="text-[11px] text-slate-400">Tugas praktik kelas</p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Belum Dikerjakan</span>
              <div className="w-8 h-8 rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-600 dark:text-amber-400 flex items-center justify-center">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-2">
              {pendingCount}
            </p>
            <p className="text-[11px] text-amber-600 dark:text-amber-400 font-medium">Perlu diunggah segera</p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Sudah Dikumpulkan</span>
              <div className="w-8 h-8 rounded-xl bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                <UploadCloud className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-2">
              {submittedCount}
            </p>
            <p className="text-[11px] text-blue-600 dark:text-blue-400 font-medium">Menunggu evaluasi guru</p>
          </div>

          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xs">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500">Sudah Dinilai</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <p className="text-xl font-extrabold text-slate-900 dark:text-white mt-2">
              {gradedCount}
            </p>
            <p className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">Nilai telah masuk</p>
          </div>
        </div>

        {/* Filter and Search Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {(['all', 'pending', 'submitted', 'graded'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider whitespace-nowrap transition-all ${
                  filter === f
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800'
                }`}
              >
                {f === 'all'
                  ? `Semua (${assignments.length})`
                  : f === 'pending'
                  ? `Belum (${pendingCount})`
                  : f === 'submitted'
                  ? `Terkumpul (${submittedCount})`
                  : `Dinilai (${gradedCount})`}
              </button>
            ))}
          </div>

          <div className="relative sm:w-64">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Cari tugas..."
              className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Assignments Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.length === 0 ? (
            <div className="col-span-full p-12 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-3">
              <ClipboardList className="w-10 h-10 text-slate-300 mx-auto" />
              <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                Tidak ada tugas praktik dalam kategori ini
              </p>
              <p className="text-xs text-slate-400">
                Seluruh tugas yang diberikan guru akan muncul di sini.
              </p>
            </div>
          ) : (
            filtered.map((asg) => {
              const sub = mySubmissions.find((s) => s.assignment_id === asg.id);
              const badge = sub
                ? getStatusBadge(sub.status)
                : {
                    label: 'Belum Dikerjakan',
                    className: 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-200',
                  };

              return (
                <div
                  key={asg.id}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4 hover:border-blue-500/40 transition-all group"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
                        {asg.subject_name?.split(' ')[0]}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold border ${badge.className}`}>
                        {badge.label}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-slate-900 dark:text-white line-clamp-2 group-hover:text-blue-600 transition-colors">
                      {asg.title}
                    </h3>

                    <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                      {asg.description}
                    </p>

                    {/* Submitted File Badge if already uploaded */}
                    {sub?.file_name && (
                      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs">
                        <FileCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                          {sub.file_name}
                        </span>
                        <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                          {sub.file_size || 'Terkirim'}
                        </span>
                      </div>
                    )}

                    <div className="space-y-1 text-[11px] text-slate-400 pt-1">
                      <p className="flex items-center gap-1.5 text-rose-500">
                        <Calendar className="w-3.5 h-3.5" />
                        <span>Batas: {formatDate(asg.due_date)}</span>
                      </p>
                      <p className="flex items-center gap-1.5">
                        <Award className="w-3.5 h-3.5" />
                        <span>Bobot: {asg.weight}% Rapor</span>
                      </p>
                      {sub?.score !== undefined && (
                        <p className="text-emerald-600 font-bold text-xs pt-1 flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Nilai Guru: {sub.score} / 100</span>
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-800">
                    <Link
                      href={`/siswa/assignments/${asg.id}`}
                      className={`w-full py-2 px-3 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-all ${
                        sub
                          ? 'border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                          : 'bg-blue-600 hover:bg-blue-700 text-white shadow-xs'
                      }`}
                    >
                      <UploadCloud className="w-3.5 h-3.5" />
                      <span>{sub ? 'Lihat / Perbarui Berkas' : 'Upload Berkas Tugas'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
