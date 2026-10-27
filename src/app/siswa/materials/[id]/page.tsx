'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useLms } from '@/lib/store';
import {
  FileText,
  CheckCircle2,
  Video,
  Download,
  ArrowLeft,
  BookOpen,
  Calendar,
  Layers,
  Sparkles,
  Award,
  Presentation,
  ExternalLink,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';
import Link from 'next/link';

function MaterialDetailContent() {
  const params = useParams();
  const router = useRouter();
  const materialId = params.id as string;

  const { materials, learningProgress, toggleMaterialCompleted, currentUser } = useLms();
  const material = materials.find((m) => m.id === materialId);

  const [activeTab, setActiveTab] = useState<'content' | 'subchapters'>('content');
  const [selectedSubchapterId, setSelectedSubchapterId] = useState<string>(
    material?.subchapters?.[0]?.id || ''
  );

  if (!material) {
    return (
      <DashboardLayout title="Materi Tidak Ditemukan">
        <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-4">
          <p className="text-sm text-slate-500">Materi yang Anda cari tidak tersedia atau telah dihapus.</p>
          <Link href="/siswa/materials" className="inline-flex px-4 py-2 bg-blue-600 text-white rounded-xl text-xs font-semibold">
            Kembali ke Katalog Materi
          </Link>
        </div>
      </DashboardLayout>
    );
  }

  const isCompleted = learningProgress.some(
    (lp) => lp.material_id === material.id && lp.student_id === currentUser.id && lp.is_completed
  );

  const handleToggleComplete = () => {
    toggleMaterialCompleted(material.id, currentUser.id);
  };

  // Extract YouTube ID if valid (supports standard, shortlinks, embed, shorts)
  const getYouTubeEmbedUrl = (url: string) => {
    if (!url) return null;
    const regExp = /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=|shorts\/))([\w-]{11})/;
    const match = url.match(regExp);
    return match ? `https://www.youtube.com/embed/${match[1]}` : null;
  };

  const youtubeEmbed = material.youtube_url ? getYouTubeEmbedUrl(material.youtube_url) : null;
  const activeSubchapter = material.subchapters?.find((s) => s.id === selectedSubchapterId) || material.subchapters?.[0];

  return (
    <DashboardLayout
      title={material.title}
      subtitle={`Mata Pelajaran: ${material.subject_name} • Guru: ${material.teacher_name}`}
    >
      <div className="space-y-6 max-w-5xl mx-auto">
        {/* Navigation & Completion Action */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <Link
            href="/siswa/materials"
            className="inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Katalog Materi</span>
          </Link>

          <button
            type="button"
            onClick={handleToggleComplete}
            className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-xs ${
              isCompleted
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{isCompleted ? 'Materi Tuntas Dipelajari (Klik Batal)' : 'Tandai Selesai Dipelajari'}</span>
          </button>
        </div>

        {/* Video Tutorial Embed if present */}
        {youtubeEmbed && (
          <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-xl border border-slate-800">
            <div className="p-3 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-2">
                <Video className="w-4 h-4 text-rose-500" />
                <span>Video Praktikum & Demonstrasi Terpandu</span>
              </span>
              <span className="text-[10px] text-slate-400">YouTube Player</span>
            </div>
            <div className="aspect-video w-full">
              <iframe
                src={youtubeEmbed}
                title={material.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        )}

        {/* Learning Objectives Card */}
        {material.learning_objectives && material.learning_objectives.length > 0 && (
          <div className="p-5 rounded-2xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800 space-y-3">
            <h3 className="text-xs font-bold text-blue-900 dark:text-blue-300 flex items-center gap-2 uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-blue-600" />
              <span>Target & Capaian Pembelajaran (Kompetensi Kejuruan)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {material.learning_objectives.map((obj, i) => (
                <div key={i} className="flex items-start gap-2 text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                  <span>{obj}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Main Content & Subchapters Tabs */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-xs space-y-6">
          <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
            <button
              onClick={() => setActiveTab('content')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'content'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Uraian Utama Modul
            </button>
            <button
              onClick={() => setActiveTab('subchapters')}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                activeTab === 'subchapters'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Subbab Interaktif ({material.subchapters?.length || 0})
            </button>
          </div>

          {activeTab === 'content' ? (
            <div className="space-y-4 text-slate-800 dark:text-slate-200 leading-relaxed text-sm">
              <p className="font-semibold text-slate-600 dark:text-slate-400 text-xs">
                {material.description}
              </p>
              <div className="prose dark:prose-invert max-w-none text-xs sm:text-sm whitespace-pre-line font-sans bg-slate-50 dark:bg-slate-800/40 p-4 rounded-xl border border-slate-100 dark:border-slate-800">
                {material.content}
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              {/* Subchapters Navigation Sidebar */}
              <div className="md:col-span-4 space-y-2">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                  Daftar Subbab:
                </p>
                {material.subchapters?.map((sub, idx) => (
                  <button
                    key={sub.id}
                    onClick={() => setSelectedSubchapterId(sub.id)}
                    className={`w-full text-left p-3 rounded-xl text-xs font-medium transition-all ${
                      activeSubchapter?.id === sub.id
                        ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-bold border border-blue-200 dark:border-blue-800'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border border-transparent'
                    }`}
                  >
                    {sub.title}
                  </button>
                ))}
              </div>

              {/* Subchapter Content Viewer */}
              <div className="md:col-span-8 p-5 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-3">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                  {activeSubchapter?.title}
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-line">
                  {activeSubchapter?.content}
                </p>
              </div>
            </div>
          )}

          {/* Lampiran File Pembelajaran (PDF, PPT, Dokumen) */}
          {material.attachments && material.attachments.length > 0 && (
            <div className="pt-6 border-t border-slate-100 dark:border-slate-800 space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  <FileText className="w-4 h-4 text-emerald-600" />
                  <span>Dokumen Modul & Berkas Pembelajaran ({material.attachments.length}):</span>
                </h4>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {material.attachments.map((att) => {
                  const isPdf = att.file_type === 'pdf' || att.file_name.toLowerCase().endsWith('.pdf');
                  const isPpt =
                    att.file_type === 'ppt' ||
                    att.file_name.toLowerCase().endsWith('.ppt') ||
                    att.file_name.toLowerCase().endsWith('.pptx');

                  return (
                    <div
                      key={att.id}
                      className="p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-3 bg-white dark:bg-slate-900 shadow-2xs hover:border-slate-300 dark:hover:border-slate-700 transition-all"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                            isPdf
                              ? 'bg-rose-50 text-rose-600 dark:bg-rose-950/60 dark:text-rose-400'
                              : isPpt
                              ? 'bg-amber-50 text-amber-600 dark:bg-amber-950/60 dark:text-amber-400'
                              : 'bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400'
                          }`}
                        >
                          {isPdf ? (
                            <FileText className="w-5 h-5" />
                          ) : isPpt ? (
                            <Presentation className="w-5 h-5" />
                          ) : (
                            <Download className="w-5 h-5" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {att.file_name}
                          </p>
                          <div className="flex items-center gap-1.5 text-[10px] text-slate-400 mt-0.5">
                            <span
                              className={`px-1.5 py-0.2 rounded font-mono font-bold uppercase ${
                                isPdf
                                  ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                                  : isPpt
                                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
                              }`}
                            >
                              {isPdf ? 'PDF Modul' : isPpt ? 'Slide PPT' : att.file_type}
                            </span>
                            <span>•</span>
                            <span>{att.file_size}</span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1.5 shrink-0">
                        <a
                          href={att.file_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-3 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:text-slate-900 dark:hover:bg-slate-100 text-xs font-bold flex items-center gap-1.5 shadow-xs transition-colors"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Unduh</span>
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

export default function MaterialDetailPage() {
  return (
    <React.Suspense fallback={<div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-8 text-center text-xs text-slate-400">Memuat materi pembelajaran...</div>}>
      <MaterialDetailContent />
    </React.Suspense>
  );
}
