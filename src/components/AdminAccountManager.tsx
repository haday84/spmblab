import React, { useState, useEffect } from 'react';
import { 
  Shield, 
  UserPlus, 
  Trash2, 
  CheckCircle, 
  XCircle, 
  Lock, 
  Key, 
  Mail, 
  UserCheck, 
  RefreshCw, 
  AlertCircle, 
  Plus,
  X,
  Eye,
  EyeOff,
  SlidersHorizontal,
  UserCheck2
} from 'lucide-react';
import { AdminAccount, AdminRole, JalurPendaftaran } from '../types/spmb';
import { StorageService } from '../services/storage';

interface AdminAccountManagerProps {
  currentAdmin: AdminAccount;
  onToast: (msg: string) => void;
}

export const AdminAccountManager: React.FC<AdminAccountManagerProps> = ({ currentAdmin, onToast }) => {
  const [adminList, setAdminList] = useState<AdminAccount[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState<AdminRole>('verifikator');
  const [roleLabel, setRoleLabel] = useState('Verifikator Dokumen');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [assignedJalur, setAssignedJalur] = useState<JalurPendaftaran | 'semua'>('semua');
  const [formError, setFormError] = useState('');

  const loadAdmins = async () => {
    setIsLoading(true);
    try {
      const data = await StorageService.syncAdminsWithServer();
      setAdminList(data);
    } catch (e) {
      setAdminList(StorageService.getAdminAccounts());
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdmins();
    const handleUpdate = () => loadAdmins();
    window.addEventListener('spmb-admins-updated', handleUpdate);
    return () => window.removeEventListener('spmb-admins-updated', handleUpdate);
  }, []);

  const handleRoleChange = (newRole: AdminRole) => {
    setRole(newRole);
    if (newRole === 'superadmin') {
      setRoleLabel('Ketua / Pengarah PPDB');
      setAssignedJalur('semua');
    } else if (newRole === 'admin') {
      setRoleLabel('Administrator Sistem');
      setAssignedJalur('semua');
    } else {
      setRoleLabel('Verifikator Dokumen & Berkas');
    }
  };

  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!name.trim() || !email.trim() || !password.trim()) {
      setFormError('Semua kolom wajib diisi.');
      return;
    }

    if (password.length < 6) {
      setFormError('Password minimal 6 karakter.');
      return;
    }

    // Check duplicate
    if (adminList.some(a => a.email.toLowerCase() === email.trim().toLowerCase())) {
      setFormError('Email sudah terdaftar untuk akun panitia lain.');
      return;
    }

    try {
      await StorageService.addAdminAccount({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role,
        roleLabel: roleLabel.trim() || (role === 'superadmin' ? 'Ketua Panitia PPDB' : 'Verifikator Dokumen'),
        password: password.trim(),
        assignedJalur,
        active: true,
      });

      onToast(`Akun admin panitia "${name}" berhasil ditambahkan.`);
      setIsAddModalOpen(false);
      // Reset form
      setName('');
      setEmail('');
      setPassword('');
      setRole('verifikator');
      setRoleLabel('Verifikator Dokumen');
      setAssignedJalur('semua');
      loadAdmins();
    } catch (err: any) {
      setFormError(err.message || 'Gagal menambahkan akun admin.');
    }
  };

  const handleToggleStatus = async (admin: AdminAccount) => {
    if (admin.id === currentAdmin.id) {
      alert('Anda tidak dapat menonaktifkan akun yang sedang digunakan saat ini.');
      return;
    }
    const newStatus = !admin.active;
    await StorageService.updateAdminAccount(admin.id, { active: newStatus });
    onToast(`Status akun ${admin.name} diubah menjadi ${newStatus ? 'Aktif' : 'Non-aktif'}.`);
    loadAdmins();
  };

  const handleDelete = async (admin: AdminAccount) => {
    if (admin.id === currentAdmin.id) {
      alert('Anda tidak dapat menghapus akun Anda sendiri.');
      return;
    }
    if (window.confirm(`Apakah Anda yakin ingin menghapus akun panitia "${admin.name}" (${admin.email})?`)) {
      await StorageService.deleteAdminAccount(admin.id);
      onToast(`Akun ${admin.name} berhasil dihapus.`);
      loadAdmins();
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Actions */}
      <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="p-2 bg-blue-50 text-blue-700 rounded-lg">
              <Shield className="w-5 h-5" />
            </span>
            <div>
              <h3 className="font-bold text-slate-800 text-lg">Manajemen Akun Panitia & Verifikator</h3>
              <p className="text-xs text-slate-500">
                Kelola hak akses panitia SPMB SMP Negeri 2 Teluk Bayur untuk verifikasi berkas dan penetapan hasil.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <button
            onClick={loadAdmins}
            disabled={isLoading}
            className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Segarkan</span>
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="flex-1 sm:flex-initial flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
          >
            <UserPlus className="w-4 h-4" />
            <span>Tambah Akun Panitia</span>
          </button>
        </div>
      </div>

      {/* Admin Cards Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Total Akun Panitia</span>
            <span className="p-1.5 bg-blue-50 text-blue-600 rounded-md">
              <UserCheck className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-800">{adminList.length}</span>
            <span className="text-xs text-slate-400">petugas terdaftar</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Akun Aktif</span>
            <span className="p-1.5 bg-emerald-50 text-emerald-600 rounded-md">
              <CheckCircle className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-600">
              {adminList.filter(a => a.active).length}
            </span>
            <span className="text-xs text-emerald-700">dapat memverifikasi</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500">Akun Anda Saat Ini</span>
            <span className="p-1.5 bg-amber-50 text-amber-600 rounded-md">
              <Shield className="w-4 h-4" />
            </span>
          </div>
          <div className="mt-1">
            <p className="text-sm font-bold text-slate-800 truncate">{currentAdmin.name}</p>
            <p className="text-xs text-slate-500 truncate">{currentAdmin.roleLabel} ({currentAdmin.email})</p>
          </div>
        </div>
      </div>

      {/* Admin Accounts Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="px-5 py-4 border-b border-slate-200 bg-slate-50/70 flex items-center justify-between">
          <h4 className="font-semibold text-slate-800 text-sm">Daftar Akun Panitia Terdaftar</h4>
          <span className="text-xs text-slate-500 font-mono">
            {adminList.length} akun terdaftar di sistem
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50 text-slate-700 uppercase font-semibold border-b border-slate-200 tracking-wider">
              <tr>
                <th className="px-5 py-3">Nama & Kontak</th>
                <th className="px-4 py-3">Peran (Role)</th>
                <th className="px-4 py-3">Tugas Jalur</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Login Terakhir</th>
                <th className="px-5 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {adminList.map((admin) => {
                const isCurrent = admin.id === currentAdmin.id;
                return (
                  <tr key={admin.id} className={`hover:bg-slate-50/80 transition-colors ${isCurrent ? 'bg-blue-50/40' : ''}`}>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs ${
                          admin.role === 'superadmin' ? 'bg-amber-100 text-amber-800' :
                          admin.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                          'bg-blue-100 text-blue-800'
                        }`}>
                          {admin.name.charAt(0)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-slate-800 text-sm">{admin.name}</span>
                            {isCurrent && (
                              <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 text-[10px] font-bold rounded">
                                Anda
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-1 text-slate-500 text-xs mt-0.5">
                            <Mail className="w-3 h-3 text-slate-400" />
                            <span>{admin.email}</span>
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3.5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold ${
                        admin.role === 'superadmin' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                        admin.role === 'admin' ? 'bg-purple-50 text-purple-700 border border-purple-200' :
                        'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        <Shield className="w-3 h-3" />
                        {admin.roleLabel || admin.role}
                      </span>
                    </td>

                    <td className="px-4 py-3.5 font-medium">
                      {admin.assignedJalur === 'semua' ? (
                        <span className="px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-xs">
                          Semua Jalur
                        </span>
                      ) : (
                        <span className="capitalize px-2 py-0.5 bg-sky-50 text-sky-700 rounded text-xs">
                          Jalur {admin.assignedJalur}
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3.5">
                      <button
                        onClick={() => handleToggleStatus(admin)}
                        title="Klik untuk mengubah status"
                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold cursor-pointer ${
                          admin.active 
                            ? 'bg-emerald-50 text-emerald-700 hover:bg-emerald-100' 
                            : 'bg-rose-50 text-rose-700 hover:bg-rose-100'
                        }`}
                      >
                        {admin.active ? (
                          <>
                            <CheckCircle className="w-3 h-3 text-emerald-600" />
                            <span>Aktif</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 text-rose-600" />
                            <span>Non-Aktif</span>
                          </>
                        )}
                      </button>
                    </td>

                    <td className="px-4 py-3.5 text-slate-500 font-mono text-xs">
                      {admin.lastLogin 
                        ? new Date(admin.lastLogin).toLocaleString('id-ID', { dateStyle: 'medium', timeStyle: 'short' })
                        : 'Belum pernah login'}
                    </td>

                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleDelete(admin)}
                          disabled={isCurrent}
                          title={isCurrent ? 'Tidak dapat menghapus akun sendiri' : 'Hapus akun'}
                          className={`p-1.5 rounded text-slate-400 transition-colors ${
                            isCurrent 
                              ? 'opacity-30 cursor-not-allowed' 
                              : 'hover:text-rose-600 hover:bg-rose-50 cursor-pointer'
                          }`}
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

      {/* Modal: Tambah Akun Panitia Baru */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-700 to-indigo-700 px-6 py-4 text-white flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-blue-200" />
                <h3 className="font-bold text-base">Tambah Akun Panitia / Verifikator</h3>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleCreateAdmin} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-lg flex items-center gap-2 text-xs text-rose-700 font-medium">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Lengkap & Gelar Panitia *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Contoh: Ahmad Yani, S.Kom"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Alamat Email / Username Panitia *
                </label>
                <input
                  type="email"
                  required
                  placeholder="Contoh: ahmadyani@smpn2telukbayur.sch.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Password Masuk Panitia *
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Minimal 6 karakter"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden pr-10"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Tingkat Akses (Role)
                  </label>
                  <select
                    value={role}
                    onChange={(e) => handleRoleChange(e.target.value as AdminRole)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden bg-white"
                  >
                    <option value="verifikator">Verifikator Dokumen</option>
                    <option value="admin">Administrator Sistem</option>
                    <option value="superadmin">Ketua / Super Admin</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    Jalur yang Ditugaskan
                  </label>
                  <select
                    value={assignedJalur}
                    onChange={(e) => setAssignedJalur(e.target.value as any)}
                    className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden bg-white"
                  >
                    <option value="semua">Semua Jalur</option>
                    <option value="zonasi">Jalur Zonasi</option>
                    <option value="prestasi">Jalur Prestasi</option>
                    <option value="afirmasi">Jalur Afirmasi</option>
                    <option value="mutasi">Jalur Perpindahan Tugas</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Label Jabatan / Keterangan Tugas
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Petugas Verifikasi Berkas Zonasi"
                  value={roleLabel}
                  onChange={(e) => setRoleLabel(e.target.value)}
                  className="w-full px-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden"
                />
              </div>

              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg shadow-xs transition-colors cursor-pointer"
                >
                  <Plus className="w-4 h-4" />
                  <span>Simpan Akun Panitia</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
