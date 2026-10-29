'use client';

import { useLms } from '@/lib/store';
import { Cloud, CloudOff, Loader2 } from 'lucide-react';

export function ConnectionStatus() {
  const { isOnline, isLoading } = useLms();

  if (isLoading) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-yellow-600 bg-yellow-50 border border-yellow-200 px-2.5 py-1 rounded-full">
        <Loader2 className="w-3 h-3 animate-spin" />
        <span className="hidden sm:inline">Memuat...</span>
      </div>
    );
  }

  if (isOnline) {
    return (
      <div className="flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-full">
        <Cloud className="w-3 h-3" />
        <span className="hidden sm:inline">Tersimpan ke Server</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 text-xs text-orange-700 bg-orange-50 border border-orange-200 px-2.5 py-1 rounded-full">
      <CloudOff className="w-3 h-3" />
      <span className="hidden sm:inline">Mode Lokal</span>
    </div>
  );
}
