import React, { useState } from 'react';
import { 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  XCircle, 
  Printer, 
  FileText, 
  Upload, 
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Award
} from 'lucide-react';
import { Candidate, DocumentKey, DocumentItem } from '../types/spmb';
import { StorageService } from '../services/storage';

interface CheckStatusViewProps {
  onViewCard: (candidate: Candidate) => void;
  onNavigateAnnouncement: () => void;
}

export const CheckStatusView: React.FC<CheckStatusViewProps> = ({ onViewCard, onNavigateAnnouncement }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [candidate, setCandidate] = useState<Candidate | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Re-upload state for "perlu_perbaikan"
  const [selectedDocKey, setSelectedDocKey] = useState<DocumentKey>('kartuKeluarga');
  const [reuploadSuccess, setReuploadSuccess] = useState(false);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setErrorMsg('Masukkan Nomor Pendaftaran atau NISN terlebih dahulu.');
      return;
    }

    setErrorMsg('');
    setHasSearched(true);
    setReuploadSuccess(false);

    const found = StorageService.findByRegNumberOrNisn(searchQuery);
    if (found) {
      setCandidate(found);
    } else {
      setCandidate(null);
    }
  };

  const handleQuickDemoSearch = (regNo: string) => {
    setSearchQuery(regNo);
    setHasSearched(true);
    setReuploadSuccess(false);
    const found = StorageService.findByRegNumberOrNisn(regNo);
    setCandidate(found || null);
  };

  // Reupload revised document handler
  const handleReuploadFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !candidate) return;

    const reader = new FileReader();
    reader.onload = () => {
      const updatedDocs = { ...candidate.documents };
      if (updatedDocs[selectedDocKey]) {
        updatedDocs[selectedDocKey] = {
          ...updatedDocs[selectedDocKey]!,
          name: file.name,
          url: reader.result as string,
          status: 'pending',
          note: 'Berkas telah diperbaiki oleh calon siswa, siap diverifikasi ulang.',
        };
      }

      // Update candidate status back to waiting
      const updated = StorageService.updateCandidate(candidate.id, {
        documents: updatedDocs,
        verificationStatus: 'menunggu',
        verificationNotes: 'Calon siswa telah mengunggah berkas perbaikan. Menunggu verifikasi ulang oleh panitia.',
      });

      if (updated) {
        setCandidate(updated);
        setReuploadSuccess(true);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-2">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
          Tracking Mandiri SPMB
        </span>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
          Cek Status Verifikasi & Berkas
        </h2>
        <p className="text-sm text-slate-600">
          Masukkan Nomor Pendaftaran (contoh: SPMB-2025-001) atau 10 digit NISN calon siswa
        </p>
      </div>

      {/* Search Input Box */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-4">
        <form onSubmit={handleSearch} className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Masukkan Nomor Pendaftaran (SPMB-2025-...) atau NISN"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 text-sm sm:text-base rounded-2xl border border-slate-300 focus:border-blue-600 outline-none transition-colors"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Search className="w-4 h-4" />
            <span>Cari Data</span>
          </button>
        </form>

        {errorMsg && <p className="text-xs text-red-600 font-semibold">{errorMsg}</p>}

        {/* Demo Quick Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
          <span className="text-slate-500 font-medium flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            Coba Data Contoh:
          </span>
          <button
            type="button"
            onClick={() => handleQuickDemoSearch('SPMB-2025-001')}
            className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100 border border-emerald-200 cursor-pointer font-medium"
          >
            SPMB-2025-001 (Terverifikasi)
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemoSearch('SPMB-2025-005')}
            className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-300 cursor-pointer font-medium"
          >
            SPMB-2025-005 (Perlu Perbaikan KK)
          </button>
          <button
            type="button"
            onClick={() => handleQuickDemoSearch('SPMB-2025-007')}
            className="px-2.5 py-1 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200 cursor-pointer font-medium"
          >
            SPMB-2025-007 (Menunggu Antrian)
          </button>
        </div>
      </div>

      {/* Result Candidate Card */}
      {hasSearched && candidate && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-md space-y-6">
          {/* Header info */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-200 gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-20 rounded-xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                {candidate.documents.pasFoto?.url ? (
                  <img src={candidate.documents.pasFoto.url} alt={candidate.fullName} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">Foto</div>
                )}
              </div>
              <div>
                <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200">
                  {candidate.registrationNumber}
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 mt-1 uppercase">
                  {candidate.fullName}
                </h3>
                <p className="text-xs text-slate-500">
                  NISN: <span className="font-mono font-semibold">{candidate.nisn}</span> • Asal: {candidate.previousSchool}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                onClick={() => onViewCard(candidate)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak Kartu Peserta</span>
              </button>
              {candidate.selectionResult !== 'pending' && (
                <button
                  onClick={onNavigateAnnouncement}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Award className="w-4 h-4 text-amber-300" />
                  <span>Lihat Surat Kelulusan</span>
                </button>
              )}
            </div>
          </div>

          {/* Verification Status Big Card */}
          <div className={`p-6 rounded-2xl border-2 ${
            candidate.verificationStatus === 'terverifikasi'
              ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
              : candidate.verificationStatus === 'perlu_perbaikan'
              ? 'bg-amber-50/80 border-amber-300 text-amber-950'
              : candidate.verificationStatus === 'ditolak'
              ? 'bg-rose-50/80 border-rose-300 text-rose-950'
              : 'bg-blue-50/70 border-blue-300 text-blue-950'
          }`}>
            <div className="flex items-start gap-4">
              <div className="mt-0.5">
                {candidate.verificationStatus === 'terverifikasi' && <CheckCircle2 className="w-8 h-8 text-emerald-600" />}
                {candidate.verificationStatus === 'perlu_perbaikan' && <AlertTriangle className="w-8 h-8 text-amber-600" />}
                {candidate.verificationStatus === 'ditolak' && <XCircle className="w-8 h-8 text-rose-600" />}
                {candidate.verificationStatus === 'menunggu' && <Clock className="w-8 h-8 text-blue-600" />}
              </div>

              <div className="space-y-1.5 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold tracking-wider uppercase px-2.5 py-0.5 rounded-full bg-white/80 border border-current">
                    Status: {candidate.verificationStatus.replace('_', ' ')}
                  </span>
                  {candidate.verifiedAt && (
                    <span className="text-[11px] opacity-75">
                      Diverifikasi pada {candidate.verifiedAt} {candidate.verifiedBy && `oleh ${candidate.verifiedBy}`}
                    </span>
                  )}
                </div>

                <h4 className="text-base font-bold">
                  {candidate.verificationStatus === 'terverifikasi' && 'Berkas Dokumen Dinyatakan Lengkap dan Valid'}
                  {candidate.verificationStatus === 'perlu_perbaikan' && 'Terdapat Dokumen yang Perlu Anda Perbaiki'}
                  {candidate.verificationStatus === 'ditolak' && 'Berkas Pendaftaran Ditolak'}
                  {candidate.verificationStatus === 'menunggu' && 'Berkas Sedang Menunggu Verifikasi Panitia'}
                </h4>

                <p className="text-xs sm:text-sm leading-relaxed">
                  {candidate.verificationNotes}
                </p>
              </div>
            </div>

            {/* Document Fix Box if status is perlu_perbaikan */}
            {candidate.verificationStatus === 'perlu_perbaikan' && (
              <div className="mt-6 pt-6 border-t border-amber-200/80 bg-white/70 p-4 rounded-xl space-y-3">
                <div className="flex items-center gap-2 text-xs font-bold text-amber-900">
                  <Upload className="w-4 h-4 text-amber-700" />
                  <span>Formulir Unggah Ulang Berkas Perbaikan</span>
                </div>
                <p className="text-xs text-slate-600">
                  Pilih jenis dokumen yang ingin Anda perbaiki, lalu pilih file foto/scan yang baru dan jelas:
                </p>

                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  <select
                    value={selectedDocKey}
                    onChange={e => setSelectedDocKey(e.target.value as DocumentKey)}
                    className="w-full sm:w-60 px-3 py-2 text-xs font-semibold rounded-lg border border-slate-300 bg-white"
                  >
                    <option value="kartuKeluarga">Kartu Keluarga (KK)</option>
                    <option value="pasFoto">Pas Foto 3x4</option>
                    <option value="aktaKelahiran">Akta Kelahiran</option>
                    <option value="skl">SKL / Ijazah SD</option>
                    <option value="raporOrSertifikat">Piagam Prestasi</option>
                    <option value="suratMutasiOrKip">Bukti KIP / Mutasi</option>
                  </select>

                  <label className="w-full sm:w-auto px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5" />
                    <span>Pilih & Kirim File Perbaikan</span>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleReuploadFile}
                      className="hidden"
                    />
                  </label>
                </div>

                {reuploadSuccess && (
                  <div className="p-3 bg-emerald-100 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Berkas perbaikan berhasil diunggah! Status telah diperbarui menjadi antrean verifikasi panitia.</span>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Detailed Document Check List */}
          <div className="space-y-3">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-600" />
              <span>Rincian Verifikasi Dokumen Calon Siswa</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {Object.entries(candidate.documents).map(([key, rawDoc]) => {
                if (!rawDoc) return null;
                const doc = rawDoc as DocumentItem;
                const isItemValid = doc.status === 'valid';
                const isItemInvalid = doc.status === 'invalid';
                return (
                  <div key={key} className="p-3 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between">
                    <div>
                      <span className="font-semibold text-slate-800 block capitalize">
                        {key.replace(/([A-Z])/g, ' $1')}
                      </span>
                      <span className="text-[11px] text-slate-500 truncate block max-w-[200px]">
                        {doc.name}
                      </span>
                      {doc.note && (
                        <span className="text-[10px] text-amber-700 font-medium block mt-0.5">
                          Catatan: {doc.note}
                        </span>
                      )}
                    </div>
                    <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${
                      isItemValid ? 'bg-emerald-100 text-emerald-800' :
                      isItemInvalid ? 'bg-red-100 text-red-800' :
                      'bg-slate-200 text-slate-700'
                    }`}>
                      {doc.status}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Not Found */}
      {hasSearched && !candidate && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-4">
          <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <Search className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900">Data Pendaftar Tidak Ditemukan</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Nomor Pendaftaran atau NISN yang Anda masukkan belum terdaftar dalam sistem SPMB SMPN 2 Teluk Bayur. Pastikan format nomor sudah benar.
          </p>
        </div>
      )}
    </div>
  );
};
