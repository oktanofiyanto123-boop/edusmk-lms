'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useLms } from '@/lib/store';
import {
  Building2,
  Layers,
  Plus,
  Minus,
  Users,
  Trash2,
  Edit2,
  X,
  Check,
  UserPlus,
  UserMinus,
  Search,
  UserCheck,
  Sparkles,
  AlertCircle,
  GraduationCap,
} from 'lucide-react';
import { ClassRoom, UserProfile } from '@/lib/types';

export default function AdminClassesPage() {
  const { classes, departments, users, addClass, updateClass, deleteClass, addUser, updateUser } = useLms();
  const teachers = users.filter((u) => u.role === 'guru');
  const allStudents = users.filter((u) => u.role === 'siswa');

  // Modal States
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<ClassRoom | null>(null);
  const [studentModalClass, setStudentModalClass] = useState<ClassRoom | null>(null);
  const [studentModalTab, setStudentModalTab] = useState<'roster' | 'assign' | 'register'>('roster');

  // Notification Toast
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Create Form State
  const [createFormData, setCreateFormData] = useState({
    name: '',
    grade_level: 12 as 10 | 11 | 12,
    department_id: departments[0]?.id || '',
    academic_year: '2026/2027',
    teacher_id: teachers[0]?.id || '',
    student_count: 36,
  });

  // Edit Form State
  const [editFormData, setEditFormData] = useState({
    name: '',
    grade_level: 12 as 10 | 11 | 12,
    department_id: '',
    academic_year: '',
    teacher_id: '',
    student_count: 0,
  });

  // Assign Student Search & Filter
  const [assignSearch, setAssignSearch] = useState('');
  const [manualCountInput, setManualCountInput] = useState<number>(0);

  // Quick Register Student Form State
  const [newStudentData, setNewStudentData] = useState({
    full_name: '',
    nisn: '',
    email: '',
    phone: '',
  });

  // Synchronize modal class reference with latest store data
  const currentModalClass = studentModalClass
    ? classes.find((c) => c.id === studentModalClass.id) || studentModalClass
    : null;

  // Active students assigned to this class
  const classStudents = currentModalClass
    ? allStudents.filter((s) => s.class_id === currentModalClass.id)
    : [];

  // Available students who can be assigned to this class
  const availableStudents = currentModalClass
    ? allStudents.filter((s) => {
        const notInThisClass = s.class_id !== currentModalClass.id;
        const matchSearch =
          s.full_name.toLowerCase().includes(assignSearch.toLowerCase()) ||
          s.nisn_nip?.toLowerCase().includes(assignSearch.toLowerCase());
        return notInThisClass && matchSearch;
      })
    : [];

  // Handler: Increment student count
  const handleIncrement = (classId: string, currentCount: number = 0, delta: number = 1) => {
    const updated = Math.max(0, currentCount + delta);
    updateClass(classId, { student_count: updated });
    showToast(`Jumlah siswa diperbarui menjadi ${updated} anak`);
  };

  // Handler: Decrement student count
  const handleDecrement = (classId: string, currentCount: number = 0, delta: number = 1) => {
    const updated = Math.max(0, currentCount - delta);
    updateClass(classId, { student_count: updated });
    showToast(`Jumlah siswa dikurangi menjadi ${updated} anak`);
  };

  // Handler: Set manual student count
  const handleSetManualCount = (classId: string, count: number) => {
    const val = Math.max(0, count);
    updateClass(classId, { student_count: val });
    showToast(`Jumlah siswa rombel ditetapkan: ${val} anak`);
  };

  // Handler: Remove student from class
  const handleRemoveStudentFromClass = (student: UserProfile, cls: ClassRoom) => {
    updateUser(student.id, {
      class_id: undefined,
      class_name: undefined,
    });
    const newCount = Math.max(0, (cls.student_count || 0) - 1);
    updateClass(cls.id, { student_count: newCount });
    showToast(`${student.full_name} berhasil dikeluarkan dari kelas. Jumlah siswa sekarang: ${newCount}`);
  };

  // Handler: Assign existing student to class
  const handleAssignStudent = (student: UserProfile, cls: ClassRoom) => {
    updateUser(student.id, {
      class_id: cls.id,
      class_name: cls.name,
      department_id: cls.department_id,
      department_name: cls.department_name,
    });
    const newCount = (cls.student_count || 0) + 1;
    updateClass(cls.id, { student_count: newCount });
    showToast(`${student.full_name} berhasil dimasukkan ke ${cls.name}. Jumlah siswa sekarang: ${newCount}`);
  };

  // Handler: Quick register new student into this class
  const handleQuickRegisterStudent = (e: React.FormEvent, cls: ClassRoom) => {
    e.preventDefault();
    if (!newStudentData.full_name) return;

    const nisnVal = newStudentData.nisn || `00${Math.floor(10000000 + Math.random() * 90000000)}`;
    const emailVal =
      newStudentData.email ||
      `${newStudentData.full_name.toLowerCase().replace(/\s+/g, '.')}@siswa.edusmk.sch.id`;

    addUser({
      full_name: newStudentData.full_name,
      email: emailVal,
      nisn_nip: nisnVal,
      phone: newStudentData.phone || '0812-0000-0000',
      role: 'siswa',
      class_id: cls.id,
      class_name: cls.name,
      department_id: cls.department_id,
      department_name: cls.department_name,
      status: 'aktif',
      avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
        newStudentData.full_name
      )}`,
    });

    const newCount = (cls.student_count || 0) + 1;
    updateClass(cls.id, { student_count: newCount });

    setNewStudentData({ full_name: '', nisn: '', email: '', phone: '' });
    showToast(`Siswa baru ${newStudentData.full_name} berhasil didaftarkan ke ${cls.name}!`);
    setStudentModalTab('roster');
  };

  // Handler: Submit Create Class
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!createFormData.name) return;

    const dept = departments.find((d) => d.id === createFormData.department_id);
    const teacher = teachers.find((t) => t.id === createFormData.teacher_id);

    addClass({
      name: createFormData.name,
      grade_level: Number(createFormData.grade_level) as 10 | 11 | 12,
      department_id: createFormData.department_id,
      department_name: dept?.name,
      academic_year: createFormData.academic_year,
      teacher_id: createFormData.teacher_id,
      homeroom_teacher: teacher?.full_name,
      student_count: Number(createFormData.student_count) || 0,
    });

    setIsCreateModalOpen(false);
    showToast(`Rombel ${createFormData.name} berhasil dibuat dengan ${createFormData.student_count} siswa.`);
    setCreateFormData({
      name: '',
      grade_level: 12,
      department_id: departments[0]?.id || '',
      academic_year: '2026/2027',
      teacher_id: teachers[0]?.id || '',
      student_count: 36,
    });
  };

  // Handler: Open Edit Class Modal
  const openEditModal = (c: ClassRoom) => {
    setEditingClass(c);
    setEditFormData({
      name: c.name,
      grade_level: c.grade_level,
      department_id: c.department_id,
      academic_year: c.academic_year,
      teacher_id: c.teacher_id,
      student_count: c.student_count || 0,
    });
  };

  // Handler: Submit Edit Class
  const handleEditSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingClass || !editFormData.name) return;

    const dept = departments.find((d) => d.id === editFormData.department_id);
    const teacher = teachers.find((t) => t.id === editFormData.teacher_id);

    updateClass(editingClass.id, {
      name: editFormData.name,
      grade_level: Number(editFormData.grade_level) as 10 | 11 | 12,
      department_id: editFormData.department_id,
      department_name: dept?.name,
      academic_year: editFormData.academic_year,
      teacher_id: editFormData.teacher_id,
      homeroom_teacher: teacher?.full_name,
      student_count: Number(editFormData.student_count) || 0,
    });

    setEditingClass(null);
    showToast(`Data rombel ${editFormData.name} berhasil diperbarui.`);
  };

  return (
    <DashboardLayout
      title="Manajemen Kelas & Jurusan"
      subtitle="Kelola Rombongan Belajar (Rombel), Jumlah Siswa, dan Anggota Kelas SMK"
    >
      <div className="space-y-8">
        {/* Floating Toast Notification */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-4 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-semibold animate-in fade-in slide-in-from-bottom-2 duration-200">
            <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
            <span>{toastMessage}</span>
          </div>
        )}

        {/* Jurusan Overview Grid */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Kompetensi Keahlian (Jurusan)</span>
            </h3>
            <span className="text-xs text-slate-500">{departments.length} Jurusan Aktif</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {departments.map((dept) => {
              const deptClasses = classes.filter((c) => c.department_id === dept.id);
              const totalClassStudents = deptClasses.reduce((acc, c) => acc + (c.student_count || 0), 0);

              return (
                <div
                  key={dept.id}
                  className="p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xs space-y-2"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-950/60 px-2 py-0.5 rounded">
                      {dept.code}
                    </span>
                    <span className="text-[11px] text-slate-500 font-medium">
                      {totalClassStudents || dept.total_students || 0} Siswa
                    </span>
                  </div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-1">
                    {dept.name}
                  </h4>
                  <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-800/80">
                    <span>{deptClasses.length} Rombel</span>
                    <span className="truncate max-w-[120px]">Kaprog: {dept.head_of_department}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Classes Table Section */}
        <div className="space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-emerald-600" />
                <span>Daftar Rombongan Belajar (Kelas)</span>
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Kelola kuota kapasitas kelas, tambah/kurangi jumlah anak, dan atur penempatan siswa
              </p>
            </div>
            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 self-start sm:self-auto transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Kelas Baru</span>
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold uppercase text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4">Nama Kelas</th>
                    <th className="py-3.5 px-4">Tingkat</th>
                    <th className="py-3.5 px-4">Jurusan</th>
                    <th className="py-3.5 px-4">Wali Kelas</th>
                    <th className="py-3.5 px-4">Tahun Ajaran</th>
                    <th className="py-3.5 px-4 min-w-[220px]">
                      Jumlah Siswa (Tambah / Kurangi)
                    </th>
                    <th className="py-3.5 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
                  {classes.map((c) => {
                    const assignedCount = allStudents.filter((s) => s.class_id === c.id).length;
                    const studentCount = c.student_count || 0;

                    return (
                      <tr key={c.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                        <td className="py-3.5 px-4 font-bold text-slate-900 dark:text-white">
                          <div className="flex items-center gap-2">
                            <span className="w-2 h-2 rounded-full bg-emerald-500" />
                            <span>{c.name}</span>
                          </div>
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 font-medium">
                            Kelas {c.grade_level}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-medium">{c.department_name}</td>
                        <td className="py-3.5 px-4 text-slate-600 dark:text-slate-300">
                          {c.homeroom_teacher || 'Belum Ditugaskan'}
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[11px]">{c.academic_year}</td>
                        
                        {/* Interactive Student Stepper & Management Column */}
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2 flex-wrap">
                            {/* Stepper Buttons */}
                            <div className="inline-flex items-center border border-slate-200 dark:border-slate-700 rounded-xl bg-slate-50 dark:bg-slate-800/80 p-0.5 shadow-2xs">
                              <button
                                type="button"
                                onClick={() => handleDecrement(c.id, studentCount, 1)}
                                disabled={studentCount <= 0}
                                title="Kurangi 1 Siswa"
                                className="w-6 h-6 flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 hover:bg-rose-100 hover:text-rose-600 dark:hover:bg-rose-950/60 dark:hover:text-rose-400 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>

                              <button
                                type="button"
                                onClick={() => {
                                  setStudentModalClass(c);
                                  setManualCountInput(studentCount);
                                  setStudentModalTab('roster');
                                }}
                                title="Klik untuk mengelola detail siswa rombel"
                                className="px-2.5 py-0.5 text-xs font-bold text-slate-900 dark:text-white hover:text-blue-600 dark:hover:text-blue-400 transition-colors flex items-center gap-1"
                              >
                                <Users className="w-3 h-3 text-blue-600 dark:text-blue-400" />
                                <span>{studentCount} Siswa</span>
                              </button>

                              <button
                                type="button"
                                onClick={() => handleIncrement(c.id, studentCount, 1)}
                                title="Tambah 1 Siswa"
                                className="w-6 h-6 flex items-center justify-center rounded-lg text-slate-600 dark:text-slate-300 hover:bg-emerald-100 hover:text-emerald-600 dark:hover:bg-emerald-950/60 dark:hover:text-emerald-400 transition-colors"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            {/* Kelola Siswa Button */}
                            <button
                              type="button"
                              onClick={() => {
                                setStudentModalClass(c);
                                setManualCountInput(studentCount);
                                setStudentModalTab('roster');
                              }}
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 text-[11px] font-semibold border border-blue-200 dark:border-blue-900/40 hover:bg-blue-100 dark:hover:bg-blue-900/60 transition-colors"
                            >
                              <UserCheck className="w-3 h-3" />
                              <span>Kelola Siswa ({assignedCount})</span>
                            </button>
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openEditModal(c)}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/40 transition-colors"
                              title="Edit Detail Rombel"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => {
                                if (confirm(`Hapus rombel ${c.name}? Data penugasan siswa pada rombel ini akan dilepaskan.`)) {
                                  deleteClass(c.id);
                                  showToast(`Rombel ${c.name} berhasil dihapus.`);
                                }
                              }}
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                              title="Hapus Rombel"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* MODAL 1: KELOLA ANGGOTA & JUMLAH SISWA ROMBEL */}
        {currentModalClass && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
            <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-5 my-8">
              {/* Header */}
              <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-blue-600 bg-blue-50 dark:bg-blue-950 px-2 py-0.5 rounded">
                      {currentModalClass.department_name}
                    </span>
                    <span className="text-xs text-slate-500 font-medium">Tingkat {currentModalClass.grade_level}</span>
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 dark:text-white mt-1">
                    Kelola Anggota Rombel: {currentModalClass.name}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Wali Kelas: <span className="font-semibold text-slate-700 dark:text-slate-300">{currentModalClass.homeroom_teacher || 'Belum Ditugaskan'}</span>
                  </p>
                </div>
                <button
                  onClick={() => setStudentModalClass(null)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Student Counter & Quick Adjustment Stepper Bar */}
              <div className="p-4 rounded-2xl bg-gradient-to-r from-blue-50/70 via-indigo-50/40 to-slate-50 dark:from-blue-950/30 dark:via-indigo-950/20 dark:to-slate-900 border border-blue-100 dark:border-blue-900/40 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                      Kapasitas & Jumlah Anak Rombel
                    </span>
                    <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                      {currentModalClass.student_count || 0} Siswa
                    </span>
                    <span className="text-xs text-slate-500 ml-2">
                      ({classStudents.length} akun siswa terdata)
                    </span>
                  </div>
                </div>

                {/* Quick Increment/Decrement Stepper Controls */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <button
                    type="button"
                    onClick={() => handleDecrement(currentModalClass.id, currentModalClass.student_count, 5)}
                    className="px-2 py-1 text-xs font-semibold rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 transition-colors shadow-2xs"
                    title="Kurangi 5 Siswa"
                  >
                    -5
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDecrement(currentModalClass.id, currentModalClass.student_count, 1)}
                    className="px-2.5 py-1 text-xs font-bold rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-rose-50 hover:text-rose-600 dark:hover:bg-rose-950/40 transition-colors shadow-2xs"
                    title="Kurangi 1 Siswa"
                  >
                    -1
                  </button>
                  <button
                    type="button"
                    onClick={() => handleIncrement(currentModalClass.id, currentModalClass.student_count, 1)}
                    className="px-2.5 py-1 text-xs font-bold rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-950/40 transition-colors shadow-2xs"
                    title="Tambah 1 Siswa"
                  >
                    +1
                  </button>
                  <button
                    type="button"
                    onClick={() => handleIncrement(currentModalClass.id, currentModalClass.student_count, 5)}
                    className="px-2 py-1 text-xs font-semibold rounded-lg bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-emerald-50 hover:text-emerald-600 dark:hover:bg-emerald-950/40 transition-colors shadow-2xs"
                    title="Tambah 5 Siswa"
                  >
                    +5
                  </button>

                  {/* Direct input */}
                  <div className="flex items-center gap-1 ml-1">
                    <input
                      type="number"
                      min={0}
                      value={manualCountInput}
                      onChange={(e) => setManualCountInput(Number(e.target.value))}
                      className="w-16 p-1 text-xs font-bold text-center rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white"
                      title="Ketik jumlah anak secara langsung"
                    />
                    <button
                      type="button"
                      onClick={() => handleSetManualCount(currentModalClass.id, manualCountInput)}
                      className="px-2 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold transition-colors"
                    >
                      Set
                    </button>
                  </div>
                </div>
              </div>

              {/* Sub Navigation Tabs */}
              <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-2">
                <button
                  type="button"
                  onClick={() => setStudentModalTab('roster')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    studentModalTab === 'roster'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>Siswa di Kelas ({classStudents.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStudentModalTab('assign')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    studentModalTab === 'assign'
                      ? 'bg-blue-600 text-white shadow-xs'
                      : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <UserPlus className="w-3.5 h-3.5" />
                  <span>Tambahkan Siswa yang Ada ({availableStudents.length})</span>
                </button>

                <button
                  type="button"
                  onClick={() => setStudentModalTab('register')}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                    studentModalTab === 'register'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-emerald-600 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/50'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>+ Daftarkan Siswa Baru Langsung</span>
                </button>
              </div>

              {/* TAB 1: DAFTAR SISWA DI KELAS INI */}
              {studentModalTab === 'roster' && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">
                      Daftar Akun Siswa Aktif ({classStudents.length})
                    </span>
                    <span className="text-[11px] text-slate-500">
                      Keluarkan siswa untuk mengurangi anak dari rombel
                    </span>
                  </div>

                  {classStudents.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 dark:bg-slate-800/40 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 space-y-3">
                      <GraduationCap className="w-8 h-8 text-slate-400 mx-auto" />
                      <p className="text-xs text-slate-500">
                        Belum ada akun siswa yang terhubung secara spesifik ke rombel ini.
                      </p>
                      <button
                        type="button"
                        onClick={() => setStudentModalTab('assign')}
                        className="px-3 py-1.5 rounded-xl bg-blue-600 text-white text-xs font-semibold shadow-xs"
                      >
                        Pilih Siswa dari Daftar
                      </button>
                    </div>
                  ) : (
                    <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl">
                      {classStudents.map((st) => (
                        <div
                          key={st.id}
                          className="p-3 flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={st.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${st.full_name}`}
                              alt={st.full_name}
                              className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 object-cover"
                            />
                            <div>
                              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                                {st.full_name}
                              </h4>
                              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                                <span className="font-mono">NISN: {st.nisn_nip || '-'}</span>
                                <span>•</span>
                                <span>{st.email}</span>
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleRemoveStudentFromClass(st, currentModalClass)}
                            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-rose-600 hover:text-white hover:bg-rose-600 dark:text-rose-400 dark:hover:bg-rose-600 dark:hover:text-white border border-rose-200 dark:border-rose-900/50 text-[11px] font-semibold transition-colors"
                            title="Keluarkan siswa dari rombel ini"
                          >
                            <UserMinus className="w-3.5 h-3.5" />
                            <span>Keluarkan</span>
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: TAMBAHKAN SISWA YANG SUDAH ADA */}
              {studentModalTab === 'assign' && (
                <div className="space-y-3">
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Cari siswa berdasarkan nama atau NISN..."
                      value={assignSearch}
                      onChange={(e) => setAssignSearch(e.target.value)}
                      className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-xs text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500/20"
                    />
                  </div>

                  <div className="max-h-72 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-800 rounded-2xl">
                    {availableStudents.length === 0 ? (
                      <div className="p-6 text-center text-xs text-slate-500">
                        Tidak ada siswa lain yang sesuai dengan pencarian.
                      </div>
                    ) : (
                      availableStudents.map((st) => (
                        <div
                          key={st.id}
                          className="p-3 flex items-center justify-between gap-3 hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={st.avatar_url || `https://api.dicebear.com/7.x/initials/svg?seed=${st.full_name}`}
                              alt={st.full_name}
                              className="w-8 h-8 rounded-full border border-slate-200 dark:border-slate-700 object-cover"
                            />
                            <div>
                              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                                {st.full_name}
                              </h4>
                              <div className="flex items-center gap-2 text-[11px] text-slate-500">
                                <span className="font-mono">NISN: {st.nisn_nip || '-'}</span>
                                <span>•</span>
                                <span className="text-blue-600 dark:text-blue-400">
                                  {st.class_name ? `Saat ini di: ${st.class_name}` : 'Belum Memiliki Kelas'}
                                </span>
                              </div>
                            </div>
                          </div>

                          <button
                            type="button"
                            onClick={() => handleAssignStudent(st, currentModalClass)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-semibold shadow-xs transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Masukkan ke {currentModalClass.name}</span>
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              )}

              {/* TAB 3: DAFTARKAN SISWA BARU LANGSUNG */}
              {studentModalTab === 'register' && (
                <form
                  onSubmit={(e) => handleQuickRegisterStudent(e, currentModalClass)}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-800 space-y-3 text-xs"
                >
                  <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-bold">
                    <Sparkles className="w-4 h-4 text-emerald-600" />
                    <span>Daftarkan Akun Siswa Baru & Otomatis Masuk ke Rombel {currentModalClass.name}</span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1">Nama Lengkap Siswa *</label>
                      <input
                        type="text"
                        required
                        value={newStudentData.full_name}
                        onChange={(e) => setNewStudentData({ ...newStudentData, full_name: e.target.value })}
                        placeholder="Contoh: Muhammad Rizki"
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">NISN (Nomor Induk Siswa Nasional)</label>
                      <input
                        type="text"
                        value={newStudentData.nisn}
                        onChange={(e) => setNewStudentData({ ...newStudentData, nisn: e.target.value })}
                        placeholder="Contoh: 0071234567"
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block font-semibold mb-1">Email Siswa (Opsional)</label>
                      <input
                        type="email"
                        value={newStudentData.email}
                        onChange={(e) => setNewStudentData({ ...newStudentData, email: e.target.value })}
                        placeholder="siswa@siswa.edusmk.sch.id"
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">No. WhatsApp / HP</label>
                      <input
                        type="tel"
                        value={newStudentData.phone}
                        onChange={(e) => setNewStudentData({ ...newStudentData, phone: e.target.value })}
                        placeholder="0812-3456-7890"
                        className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white"
                      />
                    </div>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20 transition-colors"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>Simpan & Tambahkan ke {currentModalClass.name}</span>
                    </button>
                  </div>
                </form>
              )}

              {/* Modal Footer */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex justify-between items-center text-xs">
                <span className="text-slate-500">
                  Total saat ini: <strong className="text-slate-900 dark:text-white">{currentModalClass.student_count || 0} Siswa</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setStudentModalClass(null)}
                  className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold transition-colors"
                >
                  Selesai
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 2: EDIT DETAIL ROMBEL */}
        {editingClass && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Edit Data Rombongan Belajar
                </h3>
                <button onClick={() => setEditingClass(null)}>
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleEditSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold mb-1">Nama Rombel</label>
                  <input
                    type="text"
                    required
                    value={editFormData.name}
                    onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">Tingkat Kelas</label>
                    <select
                      value={editFormData.grade_level}
                      onChange={(e) => setEditFormData({ ...editFormData, grade_level: Number(e.target.value) as any })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    >
                      <option value={10}>Kelas 10 (Fase E)</option>
                      <option value={11}>Kelas 11 (Fase F)</option>
                      <option value={12}>Kelas 12 (Fase F Akhir)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Jurusan</label>
                    <select
                      value={editFormData.department_id}
                      onChange={(e) => setEditFormData({ ...editFormData, department_id: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    >
                      {departments.map((d) => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Wali Kelas</label>
                  <select
                    value={editFormData.teacher_id}
                    onChange={(e) => setEditFormData({ ...editFormData, teacher_id: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  >
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>{t.full_name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">Tahun Ajaran</label>
                    <input
                      type="text"
                      value={editFormData.academic_year}
                      onChange={(e) => setEditFormData({ ...editFormData, academic_year: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Jumlah Siswa</label>
                    <input
                      type="number"
                      min={0}
                      value={editFormData.student_count}
                      onChange={(e) => setEditFormData({ ...editFormData, student_count: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                    />
                  </div>
                </div>

                <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setEditingClass(null)}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                  >
                    Simpan Perubahan
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* MODAL 3: TAMBAH KELAS BARU */}
        {isCreateModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Buat Rombongan Belajar (Kelas) Baru
                </h3>
                <button onClick={() => setIsCreateModalOpen(false)}>
                  <X className="w-4 h-4 text-slate-400" />
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold mb-1">Nama Rombel</label>
                  <input
                    type="text"
                    required
                    value={createFormData.name}
                    onChange={(e) => setCreateFormData({ ...createFormData, name: e.target.value })}
                    placeholder="Contoh: XII TE 1 atau X ATPH 2"
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">Tingkat Kelas</label>
                    <select
                      value={createFormData.grade_level}
                      onChange={(e) => setCreateFormData({ ...createFormData, grade_level: Number(e.target.value) as any })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    >
                      <option value={10}>Kelas 10 (Fase E)</option>
                      <option value={11}>Kelas 11 (Fase F)</option>
                      <option value={12}>Kelas 12 (Fase F Akhir)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Jurusan</label>
                    <select
                      value={createFormData.department_id}
                      onChange={(e) => setCreateFormData({ ...createFormData, department_id: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                    >
                      {departments.map((d) => (
                        <option key={d.id} value={d.id}>{d.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1">Wali Kelas</label>
                  <select
                    value={createFormData.teacher_id}
                    onChange={(e) => setCreateFormData({ ...createFormData, teacher_id: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800"
                  >
                    {teachers.map((t) => (
                      <option key={t.id} value={t.id}>{t.full_name}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold mb-1">Tahun Ajaran</label>
                    <input
                      type="text"
                      value={createFormData.academic_year}
                      onChange={(e) => setCreateFormData({ ...createFormData, academic_year: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Jumlah Siswa Awal</label>
                    <input
                      type="number"
                      min={0}
                      value={createFormData.student_count}
                      onChange={(e) => setCreateFormData({ ...createFormData, student_count: Number(e.target.value) })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 font-bold"
                      placeholder="Contoh: 36"
                    />
                  </div>
                </div>

                <div className="pt-3 flex justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold"
                  >
                    Simpan Rombel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}
