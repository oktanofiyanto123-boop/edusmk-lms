'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useLms } from '@/lib/store';
import { Bell, Pin, Calendar, AlertTriangle } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';

export default function SiswaAnnouncementsPage() {
  const { announcements, currentUser } = useLms();

  const relevant = announcements.filter(
    (a) => a.target_role === 'all' || a.target_role === 'siswa'
  );

  return (
    <DashboardLayout
      title="Pengumuman Sekolah & Guru"
      subtitle="Informasi Akademik, Surat Edaran, dan Jadwal Kegiatan Sekolah"
    >
      <div className="space-y-4 max-w-4xl">
        {relevant.map((ann) => (
          <div
            key={ann.id}
            className={`p-5 rounded-2xl bg-white dark:bg-slate-900 border shadow-xs transition-all ${
              ann.is_pinned
                ? 'border-blue-300 dark:border-blue-800 bg-blue-50/20 dark:bg-blue-950/20'
                : 'border-slate-200 dark:border-slate-800'
            }`}
          >
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                {ann.is_pinned && (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300 text-[10px] font-bold">
                    <Pin className="w-3 h-3" />
                    Penting
                  </span>
                )}
                {ann.class_name && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-mono">
                    {ann.class_name}
                  </span>
                )}
                <span className="text-slate-400 text-[11px]">
                  Oleh: <strong className="text-slate-600 dark:text-slate-300">{ann.author_name}</strong>
                </span>
              </div>

              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                {ann.title}
              </h3>

              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                {ann.content}
              </p>

              <div className="flex items-center gap-1.5 text-[11px] text-slate-400 pt-1">
                <Calendar className="w-3.5 h-3.5" />
                <span>Diumumkan pada {formatDateTime(ann.created_at)}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </DashboardLayout>
  );
}
