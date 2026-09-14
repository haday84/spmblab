import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Search, 
  Filter, 
  Download, 
  RefreshCw, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  XCircle, 
  Eye, 
  FileText, 
  Award, 
  SlidersHorizontal,
  X,
  ExternalLink,
  Check,
  RotateCcw,
  Users,
  LogOut,
  Shield,
  UserCheck
} from 'lucide-react';
import { Candidate, StatusVerifikasi, JalurPendaftaran, HasilSeleksi, DocumentKey, DocumentItem } from '../types/spmb';
import { StorageService } from '../services/storage';
import { SCHOOL_PROFILE } from '../data/initialData';
import { useAuth } from '../context/AuthContext';
import { AdminLoginView } from './AdminLoginView';
import { AdminAccountManager } from './AdminAccountManager';

export const VerificationAdmin: React.FC = () => {
  const { adminUser, adminLogout } = useAuth();
  const [adminSubTab, setAdminSubTab] = useState<'verification' | 'accounts'>('verification');

  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [filterJalur, setFilterJalur] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Selected candidate for review modal
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  
  // Modal Review Form state
  const [modalStatus, setModalStatus] = useState<StatusVerifikasi>('terverifikasi');
  const [modalNotes, setModalNotes] = useState('');
  const [modalVerifierName, setModalVerifierName] = useState(adminUser?.name || 'Rizal Fahmi, S.Pd');
  const [modalDocStatuses, setModalDocStatuses] = useState<Candidate['documents'] | null>(null);
  const [previewDocUrl, setPreviewDocUrl] = useState<{ name: string; url: string } | null>(null);

  // Success toast
  const [actionMessage, setActionMessage] = useState<string | null>(null);

  const loadData = () => {
    const list = StorageService.getCandidates();
    setCandidates(list);
  };

  useEffect(() => {
    loadData();
    const handleUpdate = () => loadData();
    window.addEventListener('spmb-data-updated', handleUpdate);
    return () => window.removeEventListener('spmb-data-updated', handleUpdate);
  }, []);

  const showToast = (msg: string) => {
    setActionMessage(msg);
    setTimeout(() => setActionMessage(null), 3500);
  };

  // Open review modal
  const handleOpenReview = (cand: Candidate) => {
    setSelectedCandidate(cand);
    setModalStatus(cand.verificationStatus);
    setModalNotes(cand.verificationNotes || '');
    setModalVerifierName(cand.verifiedBy || adminUser?.name || 'Rizal Fahmi, S.Pd');
    setModalDocStatuses(JSON.parse(JSON.stringify(cand.documents)));
    setPreviewDocUrl(null);
  };

  // Toggle single document item validity in modal
  const handleToggleDocValidity = (docKey: DocumentKey, currentStatus: 'valid' | 'invalid' | 'pending') => {
    if (!modalDocStatuses) return;
    const nextStatus = currentStatus === 'valid' ? 'invalid' : 'valid';
    const updated = { ...modalDocStatuses };
    if (updated[docKey]) {
      updated[docKey] = {
        ...updated[docKey]!,
        status: nextStatus,
        note: nextStatus === 'invalid' ? 'Pindaian dokumen kurang jelas / tidak terbaca' : undefined,
      };
    }
    setModalDocStatuses(updated);
    
    // Auto-suggest status
    const hasInvalid = Object.values(updated).some(d => (d as DocumentItem | undefined)?.status === 'invalid');
    if (hasInvalid) {
      setModalStatus('perlu_perbaikan');
      if (!modalNotes.includes('perlu perbaikan')) {
        setModalNotes('Terdapat dokumen yang kurang jelas atau tidak terbaca. Silakan cek rincian dokumen dan unggah perbaikan.');
      }
    }
  };

  // Save verification review
  const handleSaveReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCandidate) return;

    StorageService.verifyCandidate(
      selectedCandidate.id,
      modalStatus,
      modalNotes,
      modalVerifierName,
      modalDocStatuses || undefined
    );

    // Sync verification to Cloud SQL backend
    StorageService.verifyCandidateServer(
      selectedCandidate.id,
      modalStatus,
      modalNotes,
      modalVerifierName,
      modalDocStatuses
    ).catch(err => console.warn('Deferred verification sync:', err));

    showToast(`Status verifikasi ${selectedCandidate.fullName} berhasil diperbarui.`);
    setSelectedCandidate(null);
    loadData();
  };

  // Auto calculate and rank selection
  const handleAutoSelection = () => {
    if (window.confirm('Hitung dan tetapkan kelulusan seleksi otomatis berdasarkan kuota jalur resmi (Zonasi terdekat & Nilai Prestasi)?')) {
      const result = StorageService.autoRankAndCalculateSelection();
      StorageService.calculateSelectionServer().catch(err => console.warn('Deferred selection sync:', err));
      showToast(`Berhasil menetapkan hasil seleksi untuk ${result.updatedCount} calon siswa terverifikasi!`);
      loadData();
    }
  };

  // Export to CSV
  const handleExportCsv = () => {
    const csvContent = StorageService.exportToCsv();
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `SPMB_SMPN2_TelukBayur_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Data pendaftar berhasil diekspor ke format CSV.');
  };

  // Reset to default data
  const handleResetData = () => {
    if (window.confirm('Reset semua data ke data awal contoh?')) {
      StorageService.resetToDefault();
      showToast('Data pendaftar dikembalikan ke data awal.');
      loadData();
    }
  };

  // Filtered Candidates
  const filteredCandidates = candidates.filter(cand => {
    if (filterJalur !== 'all' && cand.jalur !== filterJalur) return false;
    if (filterStatus !== 'all' && cand.verificationStatus !== filterStatus) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match = 
        cand.fullName.toLowerCase().includes(q) ||
        cand.registrationNumber.toLowerCase().includes(q) ||
        cand.nisn.includes(q) ||
        cand.previousSchool.toLowerCase().includes(q);
      if (!match) return false;
    }
    return true;
  });

  // KPI Statistics
  const totalCount = candidates.length;
  const verifiedCount = candidates.filter(c => c.verificationStatus === 'terverifikasi').length;
  const pendingCount = candidates.filter(c => c.verificationStatus === 'menunggu').length;
  const needFixCount = candidates.filter(c => c.verificationStatus === 'perlu_perbaikan').length;
  const acceptedCount = candidates.filter(c => c.selectionResult === 'diterima').length;

  // If admin is not authenticated, show Admin Login view
  if (!adminUser) {
    return (
      <div className="py-6 max-w-7xl mx-auto">
        <AdminLoginView onLoginSuccess={() => loadData()} />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast notification */}
      {actionMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-2xl shadow-xl border border-slate-700 flex items-center gap-3 text-sm animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{actionMessage}</span>
        </div>
      )}

      {/* Admin Session Identity Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-blue-950 to-slate-900 text-white rounded-2xl p-4 px-6 border border-slate-800 shadow-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/30 flex items-center justify-center font-bold text-blue-300">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm sm:text-base text-white">{adminUser.name}</span>
              <span className="px-2 py-0.5 rounded-full text-[11px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-400/30">
                {adminUser.roleLabel || adminUser.role}
              </span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-300 mt-0.5">
              <span>{adminUser.email}</span>
              <span>•</span>
              <span className="text-amber-300 font-medium">
                Tugas: {adminUser.assignedJalur === 'semua' ? 'Semua Jalur' : `Jalur ${adminUser.assignedJalur}`}
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto justify-between md:justify-end">
          {/* Sub Tab Switcher */}
          <div className="bg-slate-800/80 p-1 rounded-xl border border-slate-700 flex items-center">
            <button
              onClick={() => setAdminSubTab('verification')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                adminSubTab === 'verification'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Verifikasi Berkas ({candidates.length})</span>
            </button>
            <button
              onClick={() => setAdminSubTab('accounts')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                adminSubTab === 'accounts'
                  ? 'bg-blue-600 text-white shadow-xs'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Akun Panitia</span>
            </button>
          </div>

          {/* Logout button */}
          <button
            onClick={() => {
              if (window.confirm('Kunci portal dan keluar dari sesi panitia?')) {
                adminLogout();
              }
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-rose-300 hover:text-white bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/40 transition-colors cursor-pointer"
            title="Keluar dari sesi panitia"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Keluar</span>
          </button>
        </div>
      </div>

      {/* When subtab is Accounts Manager */}
      {adminSubTab === 'accounts' ? (
        <AdminAccountManager currentAdmin={adminUser} onToast={showToast} />
      ) : (
        <div className="space-y-8">
          {/* Header Panel */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-blue-700 bg-blue-100 px-3 py-0.5 rounded-full">
                  Portal Panitia PPDB
                </span>
                <span className="text-xs text-slate-500">SMP Negeri 2 Teluk Bayur</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
                Verifikasi Dokumen & Manajemen Seleksi
              </h2>
              <p className="text-xs sm:text-sm text-slate-500">
                Periksa keabsahan berkas calon siswa, berikan catatan revisi, dan tetapkan hasil kelulusan kuota.
              </p>
            </div>

            {/* Global Action Buttons */}
            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={handleAutoSelection}
                className="px-4 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-indigo-600 hover:bg-indigo-700 shadow-sm shadow-indigo-600/30 flex items-center gap-2 transition-all cursor-pointer"
                title="Otomatis tentukan kelulusan berdasarkan kuota jalur dan ranking skor/jarak"
              >
                <Award className="w-4 h-4 text-amber-300" />
                <span>Kalkulasi Hasil Seleksi Otomatis</span>
              </button>

              <button
                onClick={handleExportCsv}
                className="px-3.5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 flex items-center gap-2 transition-colors cursor-pointer"
                title="Unduh seluruh data dalam format CSV / Excel"
              >
                <Download className="w-4 h-4" />
                <span>Ekspor CSV</span>
              </button>

              <button
                onClick={handleResetData}
                className="p-2.5 rounded-xl text-slate-500 hover:text-slate-800 hover:bg-slate-100 border border-slate-200 transition-colors cursor-pointer"
                title="Reset ke data contoh awal"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
          <span className="text-xs font-semibold text-slate-500 block">Total Pendaftar</span>
          <span className="text-2xl font-black text-slate-900 block mt-1">{totalCount}</span>
          <span className="text-[10px] text-slate-400">Calon siswa masuk</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-blue-200 shadow-xs">
          <span className="text-xs font-semibold text-blue-700 block">Menunggu Antrean</span>
          <span className="text-2xl font-black text-blue-700 block mt-1">{pendingCount}</span>
          <span className="text-[10px] text-blue-500">Belum diperiksa</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-emerald-200 shadow-xs">
          <span className="text-xs font-semibold text-emerald-700 block">Terverifikasi Valid</span>
          <span className="text-2xl font-black text-emerald-700 block mt-1">{verifiedCount}</span>
          <span className="text-[10px] text-emerald-600">Dokumen lengkap</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-xs">
          <span className="text-xs font-semibold text-amber-700 block">Perlu Perbaikan</span>
          <span className="text-2xl font-black text-amber-700 block mt-1">{needFixCount}</span>
          <span className="text-[10px] text-amber-600">Revisi berkas</span>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-indigo-200 shadow-xs col-span-2 sm:col-span-1">
          <span className="text-xs font-semibold text-indigo-700 block">Lulus / Diterima</span>
          <span className="text-2xl font-black text-indigo-700 block mt-1">{acceptedCount}</span>
          <span className="text-[10px] text-indigo-500">Dari total kuota {SCHOOL_PROFILE.totalQuota}</span>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari nama, NISN, no reg, atau asal SD..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-200 outline-none focus:border-blue-600"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-500">
            <Filter className="w-3.5 h-3.5" />
            <span>Jalur:</span>
          </div>
          <select
            value={filterJalur}
            onChange={e => setFilterJalur(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700 outline-none"
          >
            <option value="all">Semua Jalur</option>
            <option value="zonasi">Zonasi (50%)</option>
            <option value="prestasi">Prestasi (30%)</option>
            <option value="afirmasi">Afirmasi (15%)</option>
            <option value="mutasi">Mutasi (5%)</option>
          </select>

          <div className="flex items-center gap-1.5 text-xs text-slate-500 ml-2">
            <span>Status:</span>
          </div>
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="px-3 py-2 text-xs rounded-xl border border-slate-200 bg-white font-medium text-slate-700 outline-none"
          >
            <option value="all">Semua Status</option>
            <option value="menunggu">Menunggu Verifikasi</option>
            <option value="terverifikasi">Terverifikasi</option>
            <option value="perlu_perbaikan">Perlu Perbaikan</option>
            <option value="ditolak">Ditolak</option>
          </select>
        </div>
      </div>

      {/* Table of Candidates */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3.5 px-4">No. Pendaftaran</th>
                <th className="py-3.5 px-4">Nama Siswa & NISN</th>
                <th className="py-3.5 px-4">Jalur</th>
                <th className="py-3.5 px-4">Asal Sekolah</th>
                <th className="py-3.5 px-4">Jarak / Nilai</th>
                <th className="py-3.5 px-4">Status Berkas</th>
                <th className="py-3.5 px-4">Hasil Seleksi</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700">
              {filteredCandidates.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400">
                    Tidak ada data pendaftar yang sesuai filter.
                  </td>
                </tr>
              ) : (
                filteredCandidates.map(cand => (
                  <tr key={cand.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="py-3.5 px-4 font-mono font-bold text-blue-900">
                      {cand.registrationNumber}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-slate-900 uppercase">{cand.fullName}</div>
                      <div className="text-[11px] font-mono text-slate-500">NISN: {cand.nisn}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className="font-bold text-[11px] px-2 py-0.5 rounded uppercase bg-slate-100 text-slate-700 border border-slate-200">
                        {cand.jalur}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">
                      {cand.previousSchool}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">
                        {cand.distanceToSchoolKm} Km
                      </div>
                      <div className="text-[11px] text-slate-500">
                        Rapor: {cand.averageScore}
                      </div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full uppercase ${
                        cand.verificationStatus === 'terverifikasi'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                          : cand.verificationStatus === 'perlu_perbaikan'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : cand.verificationStatus === 'ditolak'
                          ? 'bg-red-100 text-red-800 border border-red-200'
                          : 'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}>
                        {cand.verificationStatus === 'terverifikasi' && <CheckCircle2 className="w-3 h-3" />}
                        {cand.verificationStatus === 'perlu_perbaikan' && <AlertTriangle className="w-3 h-3" />}
                        {cand.verificationStatus === 'ditolak' && <XCircle className="w-3 h-3" />}
                        {cand.verificationStatus === 'menunggu' && <Clock className="w-3 h-3" />}
                        <span>{cand.verificationStatus.replace('_', ' ')}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-block text-[11px] font-bold px-2.5 py-1 rounded uppercase ${
                        cand.selectionResult === 'diterima'
                          ? 'bg-emerald-600 text-white'
                          : cand.selectionResult === 'cadangan'
                          ? 'bg-amber-500 text-white'
                          : cand.selectionResult === 'tidak_diterima'
                          ? 'bg-slate-400 text-white'
                          : 'bg-slate-100 text-slate-500 border border-slate-200'
                      }`}>
                        {cand.selectionResult === 'diterima' && `LULUS (Rank #${cand.selectionRank})`}
                        {cand.selectionResult === 'cadangan' && `CADANGAN (Rank #${cand.selectionRank})`}
                        {cand.selectionResult === 'tidak_diterima' && 'TIDAK LULUS'}
                        {cand.selectionResult === 'pending' && 'BELUM DITETAPKAN'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-center">
                      <button
                        onClick={() => handleOpenReview(cand)}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 transition-colors flex items-center gap-1.5 mx-auto cursor-pointer shadow-xs"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Review Berkas</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      </div>
      )}

      {/* DETAILED VERIFICATION REVIEW MODAL */}
      {selectedCandidate && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6 animate-in fade-in zoom-in-95 duration-150">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-slate-200">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold text-slate-900">
                      Pemeriksaan & Verifikasi Dokumen
                    </h3>
                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
                      {selectedCandidate.registrationNumber}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500">
                    Calon Siswa: <strong className="text-slate-800">{selectedCandidate.fullName}</strong> • NISN: {selectedCandidate.nisn}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedCandidate(null)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Candidate Summary Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-200 text-xs">
              <div>
                <span className="text-slate-500">Jalur:</span>
                <p className="font-bold text-slate-900 uppercase">{selectedCandidate.jalur}</p>
              </div>
              <div>
                <span className="text-slate-500">Asal SD:</span>
                <p className="font-bold text-slate-900">{selectedCandidate.previousSchool}</p>
              </div>
              <div>
                <span className="text-slate-500">Jarak ke SMPN 2:</span>
                <p className="font-bold text-blue-700">{selectedCandidate.distanceToSchoolKm} Km</p>
              </div>
              <div>
                <span className="text-slate-500">Rata-rata Rapor:</span>
                <p className="font-bold text-slate-900">{selectedCandidate.averageScore}</p>
              </div>
              {selectedCandidate.achievementName && (
                <div className="col-span-2">
                  <span className="text-slate-500">Sertifikat Prestasi:</span>
                  <p className="font-semibold text-amber-800">{selectedCandidate.achievementName} ({selectedCandidate.achievementLevel})</p>
                </div>
              )}
              {selectedCandidate.kipOrPkhNumber && (
                <div className="col-span-2">
                  <span className="text-slate-500">Nomor KIP/PKH:</span>
                  <p className="font-semibold text-emerald-800">{selectedCandidate.kipOrPkhNumber}</p>
                </div>
              )}
            </div>

            {/* Documents Checklist & Viewer Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <span>Daftar Dokumen yang Diunggah Siswa</span>
                </h4>
                <span className="text-xs text-slate-500">Klik tombol status dokumen untuk menandai valid/tidak valid</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                {modalDocStatuses && Object.entries(modalDocStatuses).map(([key, rawDoc]) => {
                  if (!rawDoc) return null;
                  const doc = rawDoc as DocumentItem;
                  const docKey = key as DocumentKey;
                  const isValid = doc.status === 'valid';
                  const isInvalid = doc.status === 'invalid';

                  return (
                    <div
                      key={key}
                      className={`p-4 rounded-2xl border transition-all ${
                        isValid
                          ? 'border-emerald-200 bg-emerald-50/40'
                          : isInvalid
                          ? 'border-amber-300 bg-amber-50/60'
                          : 'border-slate-200 bg-white'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <div>
                          <span className="font-bold text-slate-900 capitalize block">
                            {key.replace(/([A-Z])/g, ' $1')}
                          </span>
                          <span className="text-[11px] text-slate-500 truncate block max-w-[180px]">
                            {doc.name}
                          </span>
                        </div>

                        {/* View Preview Button */}
                        {doc.url && (
                          <button
                            type="button"
                            onClick={() => setPreviewDocUrl({ name: doc.name, url: doc.url })}
                            className="px-2 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 text-[11px] font-semibold flex items-center gap-1 cursor-pointer"
                          >
                            <Eye className="w-3 h-3" />
                            <span>Lihat</span>
                          </button>
                        )}
                      </div>

                      {/* Document note if invalid */}
                      {doc.note && (
                        <p className="text-[10px] text-amber-800 mb-2 italic">
                          Catatan: {doc.note}
                        </p>
                      )}

                      {/* Toggle status buttons */}
                      <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                        <button
                          type="button"
                          onClick={() => handleToggleDocValidity(docKey, 'invalid')}
                          className={`flex-1 py-1 rounded text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                            isValid
                              ? 'bg-emerald-600 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-emerald-100'
                          }`}
                        >
                          <Check className="w-3 h-3" />
                          <span>Valid</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => handleToggleDocValidity(docKey, 'valid')}
                          className={`flex-1 py-1 rounded text-[11px] font-bold flex items-center justify-center gap-1 cursor-pointer transition-colors ${
                            isInvalid
                              ? 'bg-amber-600 text-white'
                              : 'bg-slate-100 text-slate-600 hover:bg-amber-100'
                          }`}
                        >
                          <AlertTriangle className="w-3 h-3" />
                          <span>Perlu Perbaikan</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Preview Window if clicked */}
              {previewDocUrl && (
                <div className="p-4 rounded-2xl bg-slate-100 border border-slate-300 space-y-2">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-800">
                    <span>Preview Berkas: {previewDocUrl.name}</span>
                    <button
                      onClick={() => setPreviewDocUrl(null)}
                      className="text-slate-500 hover:text-slate-800 text-xs"
                    >
                      Tutup Preview
                    </button>
                  </div>
                  <div className="max-h-72 overflow-auto bg-white rounded-xl p-2 border border-slate-200 flex items-center justify-center">
                    {previewDocUrl.url.startsWith('data:image') || previewDocUrl.url.includes('images.unsplash.com') ? (
                      <img src={previewDocUrl.url} alt="Doc Preview" className="max-h-64 object-contain rounded" />
                    ) : (
                      <div className="text-center p-6 space-y-2">
                        <FileText className="w-12 h-12 text-blue-600 mx-auto" />
                        <p className="text-xs text-slate-600">Dokumen PDF Terlampir</p>
                        <a
                          href={previewDocUrl.url}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 text-xs font-bold text-blue-700 hover:underline"
                        >
                          Buka di Tab Baru <ExternalLink className="w-3 h-3" />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Panitia Decision Form */}
            <form onSubmit={handleSaveReview} className="space-y-4 pt-4 border-t border-slate-200">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Keputusan Status Verifikasi Akhir
                  </label>
                  <select
                    value={modalStatus}
                    onChange={e => setModalStatus(e.target.value as StatusVerifikasi)}
                    className="w-full px-3 py-2 text-sm font-semibold rounded-xl border border-slate-300 bg-white"
                  >
                    <option value="terverifikasi">Terverifikasi (Dokumen Lengkap & Sah)</option>
                    <option value="perlu_perbaikan">Perlu Perbaikan (Ada berkas buram/salah)</option>
                    <option value="menunggu">Menunggu (Antrean Verifikasi)</option>
                    <option value="ditolak">Ditolak (Tidak Memenuhi Syarat)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Nama Panitia / Petugas Verifikator
                  </label>
                  <input
                    type="text"
                    value={modalVerifierName}
                    onChange={e => setModalVerifierName(e.target.value)}
                    className="w-full px-3 py-2 text-sm rounded-xl border border-slate-300"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Catatan Verifikasi (Akan tampil pada portal cek status siswa)
                </label>
                <textarea
                  rows={2}
                  value={modalNotes}
                  onChange={e => setModalNotes(e.target.value)}
                  placeholder="Contoh: Dokumen telah sesuai kriteria zonasi Teluk Bayur..."
                  className="w-full px-3 py-2 text-xs sm:text-sm rounded-xl border border-slate-300"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setSelectedCandidate(null)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 text-xs sm:text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 rounded-xl shadow-md shadow-blue-500/20 transition-all cursor-pointer"
                >
                  Simpan Hasil Verifikasi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
