'use client';

import React, { useState } from 'react';
import { useLms } from '@/lib/store';
import { Menu, Bell, Search, User, Shield, CheckCircle, Clock } from 'lucide-react';
import { formatDateTime } from '@/lib/utils';
import Link from 'next/link';
import { ConnectionStatus } from '@/components/ui/ConnectionStatus';

interface HeaderProps {
  onMenuToggle: () => void;
  title?: string;
  subtitle?: string;
}

export function DashboardHeader({ onMenuToggle, title, subtitle }: HeaderProps) {
  const { currentUser, announcements } = useLms();
  const [showNotifications, setShowNotifications] = useState(false);

  // Filter announcements for current user
  const relevantAnnouncements = announcements.filter(
    (a) => a.target_role === 'all' || a.target_role === currentUser.role
  );

  return (
    <header className="sticky top-0 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-3 sm:px-6 py-2.5 sm:py-3 flex items-center justify-between gap-2 sm:gap-4 transition-all">
      <div className="flex items-center gap-2 sm:gap-3 min-w-0">
        <button
          onClick={onMenuToggle}
          className="lg:hidden p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 focus:outline-hidden touch-manipulation shrink-0"
          aria-label="Toggle Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {title && (
          <div className="min-w-0">
            <h1 className="text-sm sm:text-lg font-bold text-slate-900 dark:text-white leading-tight truncate">
              {title}
            </h1>
            {subtitle && (
              <p className="text-[11px] sm:text-xs text-slate-500 dark:text-slate-400 hidden sm:block truncate">
                {subtitle}
              </p>
            )}
          </div>
        )}
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Status koneksi Supabase */}
        <ConnectionStatus />

        {/* Search input desktop */}
        <div className="relative hidden md:block w-56 lg:w-72">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Cari materi, tugas, siswa..."
            className="w-full text-xs pl-9 pr-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-slate-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </div>

        {/* Notifications Popover */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="relative p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title="Pengumuman & Notifikasi"
          >
            <Bell className="w-5 h-5" />
            {relevantAnnouncements.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-white dark:ring-slate-900" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-[calc(100vw-1.5rem)] max-w-sm sm:w-96 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50">
              <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                <span className="font-semibold text-xs text-slate-900 dark:text-white">
                  Pengumuman Terbaru ({relevantAnnouncements.length})
                </span>
                <span className="text-[10px] text-blue-600 dark:text-blue-400 font-medium">
                  {currentUser.role.toUpperCase()}
                </span>
              </div>
              <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
                {relevantAnnouncements.length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400">
                    Tidak ada pengumuman baru.
                  </div>
                ) : (
                  relevantAnnouncements.map((ann) => (
                    <div key={ann.id} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors">
                      <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mb-1">
                        <Clock className="w-3 h-3" />
                        <span>{formatDateTime(ann.created_at)}</span>
                        {ann.priority === 'penting' && (
                          <span className="ml-auto px-1.5 py-0.5 rounded text-[9px] bg-amber-100 text-amber-800 dark:bg-amber-950/60 dark:text-amber-300 font-medium">
                            Penting
                          </span>
                        )}
                      </div>
                      <p className="text-xs font-semibold text-slate-800 dark:text-slate-100 line-clamp-1">
                        {ann.title}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-2 mt-0.5">
                        {ann.content}
                      </p>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {/* User preview header */}
        <div className="flex items-center gap-2 pl-2 border-l border-slate-200 dark:border-slate-700">
          <img
            src={currentUser.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
            alt={currentUser.full_name}
            className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
          />
          <div className="hidden sm:block text-left">
            <p className="text-xs font-semibold text-slate-900 dark:text-white leading-tight truncate max-w-[120px]">
              {currentUser.full_name.split(' ')[0]}
            </p>
            <p className="text-[10px] text-slate-400 capitalize">
              {currentUser.role}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
