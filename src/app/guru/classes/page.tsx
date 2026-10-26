'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useLms } from '@/lib/store';
import {
  Building2,
  BookOpen,
  Users,
  Clock,
  Award,
  Minus,
  Plus,
  UserCheck,
  UserMinus,
  UserPlus,
  X,
  Search,
  Sparkles,
  GraduationCap,
  Check,
} from 'lucide-react';
import Link from 'next/link';
import { ClassRoom, UserProfile } from '@/lib/types';

export default function GuruClassesPage() {
  const { classes, subjects, users, currentUser, updateClass, updateUser } = useLms();
  const allStudents = users.filter((u) => u.role === 'siswa');

  const [selectedClass, setSelectedClass] = useState<ClassRoom | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [assignSearch, setAssignSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'roster' | 'add'>('roster');

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const currentClass = selectedClass
    ? classes.find((c) => c.id === selectedClass.id) || selectedClass
    : null;

  const currentStudents = currentClass
    ? allStudents.filter((s) => s.class_id === currentClass.id)
    : [];

  const availableStudents = currentClass
    ? allStudents.filter((s) => {
        const notInThis = s.class_id !== currentClass.id;
        const match =
          s.full_name.toLowerCase().includes(assignSearch.toLowerCase()) ||
          s.nisn_nip?.toLowerCase().includes(assignSearch.toLowerCase());
        return notInThis && match;
      })
    : [];

  const handleIncrement = (cls: ClassRoom) => {
    const newCount = (cls.student_count || 0) + 1;
    updateClass(cls.id, { student_count: newCount });
    showToast(`Jumlah siswa ${cls.name} ditambah menjadi ${newCount} anak`);
  };

  const handleDecrement = (cls: ClassRoom) => {
    const newCount = Math.max(0, (cls.student_count || 0) - 1);
    updateClass(cls.id, { student_count: newCount });
    showToast(`Jumlah siswa ${cls.name} dikurangi menjadi ${newCount} anak`);
  };

  const handleRemoveStudent = (student: UserProfile, cls: ClassRoom) => {
    updateUser(student.id, { class_id: undefined, class_name: undefined });
    const newCount = Math.max(0, (cls.student_count || 0) - 1);
    updateClass(cls.id, { student_count: newCount });
    showToast(`${student.full_name} dikeluarkan dari rombel ${cls.name}`);
  };

  const handleAssignStudent = (student: UserProfile, cls: ClassRoom) => {
    updateUser(student.id, {
      class_id: cls.id,
      class_name: cls.name,
      department_id: cls.department_id,
      department_name: cls.department_name,
    });
    const newCount = (cls.student_count || 0) + 1;
    updateClass(cls.id, { student_count: newCount });
    showToast(`${student.full_name} dimasukkan ke rombel ${cls.name}`);
  };

  return (
    <DashboardLayout
      title="Kelas & Mata Pelajaran Diampu"
      subtitle="Rombongan Belajar Binaan dan Kelola Anggota Siswa Kejuruan"
    >
      <div className="space-y-6">
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2 duration-200">
            <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
            <span>{toastMessage}</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {classes.map((c) => {
            const assignedCount = allStudents.filter((s) => s.class_id === c.id).length;
            const studentCount = c.student_count || 36;

            return (
              <div
                key={c.id}
                className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-4 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
                      {c.department_name}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">Tingkat {c.grade_level}</span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                    {c.name}
                  </h3>

                  <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Wali Kelas:</span>
                      <span className="font-medium">{c.homeroom_teacher || currentUser.full_name}</span>
                    </div>

                    {/* Stepper Jumlah Siswa */}
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-slate-400">Jumlah Siswa:</span>
                      <div className="inline-flex items-center border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800 p-0.5">
                        <button
                          type="button"
                          onClick={() => handleDecrement(c)}
                          disabled={studentCount <= 0}
                          title="Kurangi 1 Siswa"
                          className="w-5 h-5 flex items-center justify-center rounded text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/60 disabled:opacity-30"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 font-bold text-emerald-600 dark:text-emerald-400 text-xs">
                          {studentCount} Anak
                        </span>
                        <button
                          type="button"
                          onClick={() => handleIncrement(c)}
                          title="Tambah 1 Siswa"
                          className="w-5 h-5 flex items-center justify-center rounded text-slate-500 hover:text-emerald-600 hover:bg-emerald-50 dark:hover:bg-emerald-950/60"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-slate-400">Tahun Akademik:</span>
                      <span className="font-mono">{c.academic_year}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2 pt-4 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedClass(c);
                      setActiveTab('roster');
                    }}
                    className="w-full py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors"
                  >
                    <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                    <span>Kelola Anggota Siswa ({assignedCount} Akun)</span>
                  </button>

                  <div className="flex items-center justify-between gap-2">
                    <Link
                      href={`/guru/materials/create?classId=${c.id}`}
                      className="flex-1 text-center px-3 py-1.5 rounded-lg bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 text-xs font-semibold hover:bg-blue-100 transition-colors"
                    >
                      Tambah Materi
                    </Link>
                    <Link
                      href={`/guru/assignments/create?classId=${c.id}`}
                      className="flex-1 text-center px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 text-xs font-semibold hover:bg-emerald-100 transition-colors"
                    >
                      Beri Tugas
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Modal Kelola Anggota Siswa Guru */}
        {currentClass && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <h3 className="font-bold text-base text-slate-900 dark:text-white">
                    Anggota Rombel: {currentClass.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Total Siswa: {currentClass.student_count || 0} Anak • {currentStudents.length} Siswa Terdaftar
                  </p>
                </div>
                <button onClick={() => setSelectedClass(null)} className="p-1 text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Tabs */}
              <div className="flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('roster')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'roster'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  Daftar Siswa ({currentStudents.length})
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('add')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                    activeTab === 'add'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  + Masukkan Siswa Lain ({availableStudents.length})
                </button>
              </div>

              {activeTab === 'roster' ? (
                <div className="max-h-64 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl">
                  {currentStudents.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-500">
                      Belum ada akun siswa yang terhubung dengan rombel ini.
                    </div>
                  ) : (
                    currentStudents.map((st) => (
                      <div key={st.id} className="p-3 flex items-center justify-between text-xs">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={st.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${st.full_name}`}
                            alt={st.full_name}
                            className="w-7 h-7 rounded-full object-cover"
                          />
                          <div>
                            <span className="font-bold text-slate-900 dark:text-white block">{st.full_name}</span>
                            <span className="text-[11px] text-slate-500 font-mono">NISN: {st.nisn_nip || '-'}</span>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveStudent(st, currentClass)}
                          className="px-2 py-1 rounded-lg text-rose-600 hover:bg-rose-50 text-[11px] font-semibold border border-rose-200"
                        >
                          Keluarkan
                        </button>
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <div className="space-y-2">
                  <input
                    type="text"
                    placeholder="Cari siswa berdasarkan nama/NISN..."
                    value={assignSearch}
                    onChange={(e) => setAssignSearch(e.target.value)}
                    className="w-full p-2 text-xs rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  />
                  <div className="max-h-56 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-xl">
                    {availableStudents.map((st) => (
                      <div key={st.id} className="p-2.5 flex items-center justify-between text-xs">
                        <div>
                          <span className="font-bold block">{st.full_name}</span>
                          <span className="text-[11px] text-slate-500 font-mono">NISN: {st.nisn_nip || '-'}</span>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleAssignStudent(st, currentClass)}
                          className="px-2.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold"
                        >
                          + Masukkan
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-2 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedClass(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs font-semibold"
                >
                  Tutup
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
