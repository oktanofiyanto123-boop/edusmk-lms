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

export function getFileCategoryInfo(fileName: string) {
  const ext = fileName.split('.').pop()?.toLowerCase() || '';

  if (['pdf'].includes(ext)) {
    return {
      category: 'pdf',
      label: 'PDF Dokumen',
      badgeClass: 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 border-rose-200 dark:border-rose-900',
      iconClass: 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400',
    };
  }
  if (['doc', 'docx', 'odt', 'rtf'].includes(ext)) {
    return {
      category: 'word',
      label: 'Word Dokumen',
      badgeClass: 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 border-blue-200 dark:border-blue-900',
      iconClass: 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400',
    };
  }
  if (['ppt', 'pptx', 'odp'].includes(ext)) {
    return {
      category: 'ppt',
      label: 'Slide Presentasi PPT',
      badgeClass: 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 border-amber-200 dark:border-amber-900',
      iconClass: 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400',
    };
  }
  if (['xls', 'xlsx', 'csv', 'ods'].includes(ext)) {
    return {
      category: 'excel',
      label: 'Spreadsheet Excel',
      badgeClass: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border-emerald-200 dark:border-emerald-900',
      iconClass: 'bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400',
    };
  }
  if (['zip', 'rar', '7z', 'tar', 'gz'].includes(ext)) {
    return {
      category: 'archive',
      label: 'Arsip Terkompresi ZIP/RAR',
      badgeClass: 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 border-purple-200 dark:border-purple-900',
      iconClass: 'bg-purple-50 text-purple-600 dark:bg-purple-950/60 dark:text-purple-400',
    };
  }
  if (['c', 'cpp', 'h', 'hpp', 'ino', 'py', 'java', 'js', 'ts', 'jsx', 'tsx', 'html', 'css', 'json', 'php', 'sql', 'sh', 'hex', 'bin'].includes(ext)) {
    return {
      category: 'code',
      label: 'Source Code / Proyek Kejuruan',
      badgeClass: 'bg-cyan-100 text-cyan-800 dark:bg-cyan-950 dark:text-cyan-300 border-cyan-200 dark:border-cyan-900',
      iconClass: 'bg-cyan-50 text-cyan-600 dark:bg-cyan-950/60 dark:text-cyan-400',
    };
  }
  if (['png', 'jpg', 'jpeg', 'webp', 'gif', 'svg', 'bmp', 'psd', 'ai'].includes(ext)) {
    return {
      category: 'image',
      label: 'Berkas Desain / Gambar',
      badgeClass: 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300 border-indigo-200 dark:border-indigo-900',
      iconClass: 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400',
    };
  }
  return {
    category: 'other',
    label: ext ? `Berkas .${ext.toUpperCase()}` : 'Berkas Tugas',
    badgeClass: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
    iconClass: 'bg-slate-50 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
  };
}
