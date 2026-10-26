import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function formatDateTime(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return dateString;
    return new Intl.DateTimeFormat('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  } catch {
    return dateString;
  }
}

export function getStatusBadge(status: string) {
  switch (status) {
    case 'published':
    case 'aktif':
    case 'sudah_dikumpulkan':
    case 'sudah_dinilai':
    case 'Tuntas':
      return {
        label: status === 'published' ? 'Terbit' : status === 'aktif' ? 'Aktif' : status === 'sudah_dikumpulkan' ? 'Dikumpulkan' : status === 'sudah_dinilai' ? 'Dinilai' : 'Tuntas',
        className: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800',
      };
    case 'draft':
    case 'in_progress':
      return {
        label: status === 'draft' ? 'Draf' : 'Sedang Dikerjakan',
        className: 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400 border-amber-200 dark:border-amber-800',
      };
    case 'archived':
    case 'closed':
    case 'nonaktif':
      return {
        label: status === 'archived' ? 'Arsip' : status === 'closed' ? 'Ditutup' : 'Nonaktif',
        className: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
      };
    case 'terlambat':
    case 'Belum Tuntas':
    case 'darurat':
      return {
        label: status === 'terlambat' ? 'Terlambat' : status === 'darurat' ? 'Darurat' : 'Belum Tuntas',
        className: 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200 dark:border-rose-800',
      };
    case 'belum_dikerjakan':
      return {
        label: 'Belum Dikerjakan',
        className: 'bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400 border-blue-200 dark:border-blue-800',
      };
    case 'penting':
      return {
        label: 'Penting',
        className: 'bg-orange-50 text-orange-700 dark:bg-orange-950/40 dark:text-orange-400 border-orange-200 dark:border-orange-800',
      };
    default:
      return {
        label: status,
        className: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
      };
  }
}

export function calculateGrade(score: number): { letter: 'A' | 'B' | 'C' | 'D' | 'E'; tuntas: boolean } {
  if (score >= 88) return { letter: 'A', tuntas: true };
  if (score >= 78) return { letter: 'B', tuntas: true };
  if (score >= 70) return { letter: 'C', tuntas: true };
  if (score >= 60) return { letter: 'D', tuntas: false };
  return { letter: 'E', tuntas: false };
}
