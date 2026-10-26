'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useLms } from '@/lib/store';
import { UserRole, UserProfile } from '@/lib/types';
import {
  Users,
  Search,
  Plus,
  Filter,
  CheckCircle2,
  XCircle,
  Trash2,
  Shield,
  GraduationCap,
  UserCheck,
  X,
} from 'lucide-react';
import { formatDate } from '@/lib/utils';

export default function AdminUsersPage() {
  const { users, addUser, updateUser, deleteUser, departments, classes } = useLms();

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState<'all' | UserRole>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // New user form state
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    role: 'siswa' as UserRole,
    nisn_nip: '',
    phone: '',
    department_id: '',
    class_id: '',
  });

  const filteredUsers = users.filter((u) => {
    const matchSearch =
      u.full_name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.nisn_nip.includes(search);
    const matchRole = roleFilter === 'all' || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.full_name || !formData.email) return;

    const selectedDept = departments.find((d) => d.id === formData.department_id);
    const selectedClass = classes.find((c) => c.id === formData.class_id);

    addUser({
      full_name: formData.full_name,
      email: formData.email,
      role: formData.role,
      nisn_nip: formData.nisn_nip,
      phone: formData.phone,
      department_id: formData.department_id || undefined,
      department_name: selectedDept?.name,
      class_id: formData.class_id || undefined,
      class_name: selectedClass?.name,
      status: 'aktif',
      avatar_url: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(formData.full_name)}`,
    });

    setIsModalOpen(false);
    setFormData({
      full_name: '',
      email: '',
      role: 'siswa',
      nisn_nip: '',
      phone: '',
      department_id: '',
      class_id: '',
    });
  };

  const handleToggleStatus = (user: UserProfile) => {
    const newStatus = user.status === 'aktif' ? 'nonaktif' : 'aktif';
    updateUser(user.id, { status: newStatus });
  };

  return (
    <DashboardLayout
      title="Manajemen Pengguna Sekolah"
      subtitle="Kelola akun Guru, Siswa, dan Staf Administrator"
    >
      <div className="space-y-6">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            {(['all', 'guru', 'siswa', 'admin'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all whitespace-nowrap ${
                  roleFilter === r
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 border border-slate-200 dark:border-slate-800 hover:bg-slate-50'
                }`}
              >
                {r === 'all' ? 'Semua Pengguna' : r}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-64">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Cari nama, email, NISN..."
                className="w-full text-xs pl-9 pr-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs flex items-center gap-1.5 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Tambah Akun</span>
            </button>
          </div>
        </div>

        {/* Users Table */}
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-semibold uppercase text-[10px]">
                <tr>
                  <th className="py-3 px-4">Nama Lengkap & Kontak</th>
                  <th className="py-3 px-4">Peran</th>
                  <th className="py-3 px-4">NISN / NIP</th>
                  <th className="py-3 px-4">Jurusan / Kelas</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80 text-slate-700 dark:text-slate-300">
                {filteredUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400">
                      Tidak ada pengguna yang sesuai dengan filter pencarian.
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map((user) => (
                    <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                      <td className="py-3 px-4 flex items-center gap-3">
                        <img
                          src={user.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80'}
                          alt={user.full_name}
                          className="w-8 h-8 rounded-full object-cover border border-slate-200 dark:border-slate-700"
                        />
                        <div>
                          <p className="font-semibold text-slate-900 dark:text-white">{user.full_name}</p>
                          <p className="text-[11px] text-slate-400">{user.email}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
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
                      <td className="py-3 px-4 font-mono text-[11px]">{user.nisn_nip || '-'}</td>
                      <td className="py-3 px-4">
                        {user.class_name ? (
                          <span className="font-medium text-slate-800 dark:text-slate-200">{user.class_name}</span>
                        ) : user.department_name ? (
                          <span className="text-slate-500">{user.department_name}</span>
                        ) : (
                          <span className="text-slate-400">-</span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => handleToggleStatus(user)}
                          className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full ${
                            user.status === 'aktif'
                              ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                              : 'bg-rose-50 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300'
                          }`}
                        >
                          {user.status === 'aktif' ? <CheckCircle2 className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                          <span className="capitalize">{user.status}</span>
                        </button>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => {
                            if (confirm(`Hapus pengguna ${user.full_name}?`)) deleteUser(user.id);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="Hapus Pengguna"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Modal Tambah Pengguna */}
        {isModalOpen && (
          <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-900 rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                  Tambah Akun Pengguna Baru
                </h3>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Peran Pengguna (Role)
                  </label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  >
                    <option value="siswa">Siswa (Peserta Didik)</option>
                    <option value="guru">Guru (Tenaga Pendidik)</option>
                    <option value="admin">Administrator Sekolah</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Nama Lengkap Beserta Gelar
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.full_name}
                    onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                    placeholder="Contoh: Muhammad Fauzan atau Ir. H. Sudirman, M.Kom."
                    className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Email Akun
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="user@edusmk.sch.id"
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      NISN atau NIP
                    </label>
                    <input
                      type="text"
                      value={formData.nisn_nip}
                      onChange={(e) => setFormData({ ...formData, nisn_nip: e.target.value })}
                      placeholder="0067823415"
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    />
                  </div>
                </div>

                {formData.role === 'siswa' && (
                  <div>
                    <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                      Kelas Rombongan Belajar
                    </label>
                    <select
                      value={formData.class_id}
                      onChange={(e) => setFormData({ ...formData, class_id: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                    >
                      <option value="">-- Pilih Kelas --</option>
                      {classes.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name} ({c.department_name})
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                <div className="pt-3 flex items-center justify-end gap-2 border-t border-slate-100 dark:border-slate-800">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs"
                  >
                    Simpan Pengguna
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
