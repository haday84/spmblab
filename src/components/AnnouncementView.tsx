import React, { useState, useEffect } from 'react';
import { 
  Award, 
  Search, 
  Printer, 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  FileText, 
  MapPin, 
  School, 
  Sparkles,
  Info,
  Clock,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { Candidate, JalurPendaftaran } from '../types/spmb';
import { StorageService } from '../services/storage';
import { SCHOOL_PROFILE, QUOTA_LIST } from '../data/initialData';

export const AnnouncementView: React.FC = () => {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [activeJalurTab, setActiveJalurTab] = useState<JalurPendaftaran>('zonasi');

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

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setHasSearched(true);
    const found = StorageService.findByRegNumberOrNisn(searchQuery);
    setSelectedCandidate(found || null);
  };

  const handleQuickSearch = (regNo: string) => {
    setSearchQuery(regNo);
    setHasSearched(true);
    const found = StorageService.findByRegNumberOrNisn(regNo);
    setSelectedCandidate(found || null);
    window.scrollTo({ top: 400, behavior: 'smooth' });
  };

  const handlePrint = () => {
    window.print();
  };

  // Filter candidates by Jalur for public rankings
  const rankedInJalur = candidates
    .filter(c => c.jalur === activeJalurTab)
    .sort((a, b) => {
      // Sort logic
      if (a.selectionResult === 'diterima' && b.selectionResult !== 'diterima') return -1;
      if (a.selectionResult !== 'diterima' && b.selectionResult === 'diterima') return 1;
      return (a.selectionRank || 999) - (b.selectionRank || 999);
    });

  const quotaInfo = QUOTA_LIST.find(q => q.jalur === activeJalurTab);
  const acceptedInActiveJalur = candidates.filter(c => c.jalur === activeJalurTab && c.selectionResult === 'diterima').length;

  return (
    <div className="space-y-10 max-w-5xl mx-auto">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white rounded-3xl p-8 sm:p-12 shadow-xl border border-blue-800 text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-300 text-xs sm:text-sm font-semibold">
          <Award className="w-4 h-4" />
          <span>Pengumuman Resmi Kelulusan SPMB Online T.A {SCHOOL_PROFILE.academicYear}</span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
          Hasil Seleksi Penerimaan Murid Baru
        </h1>

        <p className="text-sm sm:text-base text-blue-200 max-w-2xl mx-auto">
          Selamat kepada calon peserta didik yang dinyatakan diterima di SMP Negeri 2 Teluk Bayur. Cek hasil kelulusan pribadi Anda atau pantau daftar peringkat seleksi transparan di bawah ini.
        </p>

        {/* Search Box */}
        <form onSubmit={handleSearch} className="max-w-xl mx-auto flex flex-col sm:flex-row gap-2 pt-4">
          <div className="relative flex-1">
            <Search className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Ketik Nomor Pendaftaran atau NISN..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-2xl bg-white text-slate-900 placeholder:text-slate-400 text-sm font-medium outline-none focus:ring-2 focus:ring-amber-400 shadow-sm"
            />
          </div>
          <button
            type="submit"
            className="px-6 py-3 rounded-2xl font-bold text-sm text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 transition-all flex items-center justify-center gap-2 shadow-md shadow-amber-500/20 cursor-pointer"
          >
            <span>Cari Hasil</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Demo Chips */}
        <div className="flex flex-wrap items-center justify-center gap-2 pt-2 text-xs text-blue-200">
          <span>Contoh Cepat:</span>
          <button
            type="button"
            onClick={() => handleQuickSearch('SPMB-2025-001')}
            className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white font-mono cursor-pointer"
          >
            SPMB-2025-001 (Lulus Zonasi)
          </button>
          <button
            type="button"
            onClick={() => handleQuickSearch('SPMB-2025-002')}
            className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white font-mono cursor-pointer"
          >
            SPMB-2025-002 (Lulus Prestasi)
          </button>
          <button
            type="button"
            onClick={() => handleQuickSearch('SPMB-2025-008')}
            className="px-2.5 py-1 rounded bg-white/10 hover:bg-white/20 text-white font-mono cursor-pointer"
          >
            SPMB-2025-008 (Cadangan)
          </button>
        </div>
      </div>

      {/* RESULT DISPLAY IF SEARCHED */}
      {hasSearched && selectedCandidate && (
        <div className="space-y-6">
          {/* Action Bar (Print button) */}
          <div className="flex items-center justify-between no-print bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
            <span className="text-xs sm:text-sm font-semibold text-slate-700">
              Hasil Ditemukan untuk: <strong className="text-slate-900">{selectedCandidate.fullName}</strong> ({selectedCandidate.registrationNumber})
            </span>
            <button
              onClick={handlePrint}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Surat Keterangan Kelulusan</span>
            </button>
          </div>

          {/* Official Letterhead Printable Document */}
          <div className="print-card bg-white rounded-3xl p-8 sm:p-12 border-2 border-slate-300 shadow-lg space-y-6 relative">
            {/* Kop Sekolah */}
            <div className="border-b-4 border-double border-slate-900 pb-4 text-center">
              <div className="flex items-center justify-center gap-4 mb-2">
                <div className="w-16 h-16 rounded-xl bg-blue-900 text-white flex items-center justify-center font-bold text-2xl shadow-sm shrink-0">
                  <School className="w-10 h-10" />
                </div>
                <div className="text-slate-900">
                  <h4 className="text-xs sm:text-sm font-bold tracking-wider uppercase">
                    Pemerintah Kabupaten Berau • Dinas Pendidikan
                  </h4>
                  <h2 className="text-xl sm:text-2xl font-extrabold uppercase tracking-tight text-blue-950">
                    {SCHOOL_PROFILE.name}
                  </h2>
                  <p className="text-[11px] text-slate-600">
                    {SCHOOL_PROFILE.address}, Kec. {SCHOOL_PROFILE.kecamatan}, Kab. {SCHOOL_PROFILE.kabupaten}, {SCHOOL_PROFILE.provinsi}
                  </p>
                  <p className="text-[10px] text-slate-500">
                    NPSN: {SCHOOL_PROFILE.npsn} • Website: {SCHOOL_PROFILE.website} • Telp: {SCHOOL_PROFILE.phone}
                  </p>
                </div>
              </div>
            </div>

            {/* Document Title */}
            <div className="text-center space-y-1">
              <h3 className="text-base sm:text-lg font-black tracking-wide uppercase text-slate-900 underline">
                SURAT KETERANGAN HASIL SELEKSI SPMB
              </h3>
              <p className="text-xs font-mono text-slate-600">
                Nomor: 421.3 / 188 / SMPN.02-TB / PPDB / 2025
              </p>
            </div>

            <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
              Berdasarkan hasil verifikasi berkas dokumen dan rapat pleno penetapan kelulusan panitia Penerimaan Murid Baru (SPMB) SMP Negeri 2 Teluk Bayur Tahun Ajaran {SCHOOL_PROFILE.academicYear}, Kepala Sekolah menerangkan bahwa:
            </p>

            {/* Candidate Details Table */}
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
              <table className="w-full text-xs sm:text-sm border-collapse">
                <tbody>
                  <tr className="border-b border-slate-200">
                    <td className="py-1.5 font-semibold text-slate-500 w-44">Nama Lengkap Siswa</td>
                    <td className="py-1.5 font-bold uppercase text-slate-900">: {selectedCandidate.fullName}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-1.5 font-semibold text-slate-500">Nomor Pendaftaran</td>
                    <td className="py-1.5 font-mono font-bold text-blue-900">: {selectedCandidate.registrationNumber}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-1.5 font-semibold text-slate-500">NISN / NIK</td>
                    <td className="py-1.5 font-mono">: {selectedCandidate.nisn} / {selectedCandidate.nik}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-1.5 font-semibold text-slate-500">Asal SD / MI</td>
                    <td className="py-1.5">: {selectedCandidate.previousSchool}</td>
                  </tr>
                  <tr className="border-b border-slate-200">
                    <td className="py-1.5 font-semibold text-slate-500">Jalur Pendaftaran</td>
                    <td className="py-1.5 font-bold uppercase">: Jalur {selectedCandidate.jalur}</td>
                  </tr>
                  <tr>
                    <td className="py-1.5 font-semibold text-slate-500">Peringkat / Skor</td>
                    <td className="py-1.5">: Ranking #{selectedCandidate.selectionRank || '-'} ({selectedCandidate.jalur === 'zonasi' ? `Jarak ${selectedCandidate.distanceToSchoolKm} Km` : `Rata-rata ${selectedCandidate.averageScore}`})</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* BIG RESULT BADGE */}
            <div className={`p-6 rounded-2xl text-center border-2 ${
              selectedCandidate.selectionResult === 'diterima'
                ? 'bg-emerald-50 border-emerald-400 text-emerald-950'
                : selectedCandidate.selectionResult === 'cadangan'
                ? 'bg-amber-50 border-amber-400 text-amber-950'
                : selectedCandidate.selectionResult === 'tidak_diterima'
                ? 'bg-rose-50 border-rose-400 text-rose-950'
                : 'bg-blue-50 border-blue-400 text-blue-950'
            }`}>
              <span className="text-xs font-extrabold uppercase tracking-widest block mb-1">
                KEPUTUSAN AKHIR SELEKSI:
              </span>
              <div className="text-2xl sm:text-3xl font-black uppercase tracking-tight">
                {selectedCandidate.selectionResult === 'diterima' && 'DITERIMA / LULUS SELEKSI'}
                {selectedCandidate.selectionResult === 'cadangan' && 'DINYATAKAN SEBAGAI CADANGAN'}
                {selectedCandidate.selectionResult === 'tidak_diterima' && 'TIDAK DITERIMA'}
                {selectedCandidate.selectionResult === 'pending' && 'MENUNGGU PLENO KELULUSAN'}
              </div>
              <p className="text-xs mt-2 max-w-lg mx-auto">
                {selectedCandidate.selectionResult === 'diterima' && 'Sebagai Calon Peserta Didik Baru Kelas VII SMP Negeri 2 Teluk Bayur Tahun Ajaran 2025/2026.'}
                {selectedCandidate.selectionResult === 'cadangan' && 'Akan dipanggil mengisi kuota yang kosong apabila peserta diterima tidak melakukan daftar ulang.'}
              </p>
            </div>

            {/* Next Step Instructions */}
            {selectedCandidate.selectionResult === 'diterima' && (
              <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 text-xs text-slate-700 space-y-2">
                <div className="flex items-center gap-2 font-bold text-blue-950 text-sm">
                  <Calendar className="w-4 h-4 text-blue-600" />
                  <span>Instruksi & Jadwal Daftar Ulang Siswa Baru:</span>
                </div>
                <ul className="list-disc list-inside space-y-1 leading-relaxed">
                  <li><strong>Waktu Daftar Ulang:</strong> 30 Juni s.d. 4 Juli 2025, Pukul 08.00 - 13.00 WITA.</li>
                  <li><strong>Tempat:</strong> Gedung Laboratorium Komputer / Posko SPMB SMPN 2 Teluk Bayur.</li>
                  <li><strong>Dokumen Fisik Wajib Dibawa:</strong>
                    <span className="block pl-4 text-slate-600">
                      1) Cetakan Surat Keterangan Lulus ini & Kartu Peserta SPMB.<br />
                      2) Fotokopi & Asli Kartu Keluarga (KK) serta Akta Kelahiran.<br />
                      3) Surat Keterangan Lulus (SKL) asli dari SD/MI.<br />
                      4) Pas foto berwarna 3x4 (4 lembar) latar merah.<br />
                      5) Mengisi formulir biodata dapodik dan surat pernyataan tata tertib siswa bermaterai Rp 10.000.
                    </span>
                  </li>
                  <li className="text-rose-700 font-semibold">
                    Peserta yang tidak melakukan daftar ulang sampai batas waktu yang ditentukan dinyatakan mengundurkan diri.
                  </li>
                </ul>
              </div>
            )}

            {/* Official Signature Footer */}
            <div className="pt-6 grid grid-cols-2 text-center text-xs text-slate-800">
              <div />
              <div className="space-y-1">
                <p>Ditetapkan di: Teluk Bayur</p>
                <p>Pada tanggal: 28 Juni 2025</p>
                <p className="font-bold">Kepala SMP Negeri 2 Teluk Bayur,</p>
                <div className="h-16 flex items-center justify-center text-blue-900 font-serif italic text-xs">
                  (Tertanda & Dicap Resmi)
                </div>
                <p className="font-bold uppercase underline">{SCHOOL_PROFILE.headmasterName}</p>
                <p className="text-[11px] text-slate-600">NIP. {SCHOOL_PROFILE.headmasterNip}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Not found message */}
      {hasSearched && !selectedCandidate && (
        <div className="bg-white rounded-3xl p-8 border border-slate-200 text-center space-y-3">
          <XCircle className="w-10 h-10 text-rose-500 mx-auto" />
          <h3 className="text-lg font-bold text-slate-900">Data Pendaftar Tidak Ditemukan</h3>
          <p className="text-xs text-slate-500">
            Pastikan Nomor Pendaftaran (misal: SPMB-2025-001) atau NISN 10 digit dimasukkan dengan tepat.
          </p>
        </div>
      )}

      {/* Transparent Public Ranking Section */}
      <section className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
              Prinsip Transparansi PPDB
            </span>
            <h2 className="text-2xl font-bold text-slate-900">
              Rangkuman Hasil Seleksi Publik Per Jalur
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Daftar ranking pendaftar yang memenuhi kriteria seleksi kuota SMPN 2 Teluk Bayur.
            </p>
          </div>

          <div className="bg-slate-50 px-4 py-2.5 rounded-2xl border border-slate-200 text-xs">
            <span className="text-slate-500 block">Daya Tampung {quotaInfo?.name}:</span>
            <span className="font-bold text-slate-900 text-sm">
              {acceptedInActiveJalur} / {quotaInfo?.quotaSeats} Terisi ({quotaInfo?.percentage}%)
            </span>
          </div>
        </div>

        {/* Jalur Filter Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {QUOTA_LIST.map(q => (
            <button
              key={q.jalur}
              onClick={() => setActiveJalurTab(q.jalur)}
              className={`p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                activeJalurTab === q.jalur
                  ? 'bg-blue-600 text-white border-blue-600 shadow-sm shadow-blue-500/20'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <span>{q.name}</span>
              <span className="block text-[10px] font-normal opacity-80 mt-0.5">
                Kuota: {q.quotaSeats} Siswa
              </span>
            </button>
          ))}
        </div>

        {/* Public Ranking Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-200">
          <table className="w-full text-left text-xs sm:text-sm border-collapse">
            <thead>
              <tr className="bg-slate-100/80 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4 text-center">Rank</th>
                <th className="py-3 px-4">No. Pendaftaran</th>
                <th className="py-3 px-4">Nama Siswa</th>
                <th className="py-3 px-4">Asal SD / MI</th>
                <th className="py-3 px-4">
                  {activeJalurTab === 'zonasi' ? 'Jarak Domisili' : 'Rata-rata Rapor'}
                </th>
                <th className="py-3 px-4 text-center">Status Kelulusan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rankedInJalur.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    Belum ada data calon siswa pada jalur {quotaInfo?.name}.
                  </td>
                </tr>
              ) : (
                rankedInJalur.map((cand, idx) => (
                  <tr key={cand.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-3 px-4 text-center font-bold text-slate-700">
                      {cand.selectionRank ? `#${cand.selectionRank}` : idx + 1}
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-blue-900">
                      {cand.registrationNumber}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 uppercase">
                      {cand.fullName}
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {cand.previousSchool}
                    </td>
                    <td className="py-3 px-4 font-semibold text-slate-800">
                      {activeJalurTab === 'zonasi' ? `${cand.distanceToSchoolKm} Km` : cand.averageScore}
                    </td>
                    <td className="py-3 px-4 text-center">
                      <span className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                        cand.selectionResult === 'diterima'
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : cand.selectionResult === 'cadangan'
                          ? 'bg-amber-100 text-amber-800 border border-amber-300'
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {cand.selectionResult === 'diterima' && 'Diterima'}
                        {cand.selectionResult === 'cadangan' && 'Cadangan'}
                        {cand.selectionResult === 'tidak_diterima' && 'Tidak Lulus'}
                        {cand.selectionResult === 'pending' && 'Antrean'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};
