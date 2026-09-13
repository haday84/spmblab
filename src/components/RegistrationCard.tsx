import React from 'react';
import { Candidate } from '../types/spmb';
import { SCHOOL_PROFILE } from '../data/initialData';
import { Printer, ArrowLeft, CheckCircle2, QrCode, School } from 'lucide-react';

interface RegistrationCardProps {
  candidate: Candidate;
  onBack: () => void;
}

export const RegistrationCard: React.FC<RegistrationCardProps> = ({ candidate, onBack }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Action Bar (Hidden on print) */}
      <div className="flex items-center justify-between no-print bg-white p-4 rounded-2xl border border-slate-200 shadow-xs">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs sm:text-sm font-semibold text-slate-600 hover:text-slate-900 px-3 py-2 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Kembali</span>
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak / Simpan PDF</span>
          </button>
        </div>
      </div>

      {/* Printable Card */}
      <div className="print-card bg-white rounded-3xl p-8 sm:p-10 border-2 border-slate-300 shadow-lg space-y-6 relative overflow-hidden">
        {/* Top Watermark Background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-[0.03] pointer-events-none select-none">
          <School className="w-96 h-96 text-slate-900" />
        </div>

        {/* Kop Surat Resmi */}
        <div className="border-b-4 border-double border-slate-900 pb-4 text-center relative">
          <div className="flex items-center justify-center gap-4 mb-2">
            <div className="w-16 h-16 rounded-xl bg-blue-900 text-white flex items-center justify-center font-bold text-2xl shadow-sm shrink-0">
              <School className="w-10 h-10" />
            </div>
            <div className="text-slate-900">
              <h4 className="text-xs sm:text-sm font-bold tracking-wider uppercase">
                Pemerintah Kabupaten Berau • Dinas Pendidikan
              </h4>
              <h2 className="text-lg sm:text-2xl font-extrabold uppercase tracking-tight text-blue-950">
                {SCHOOL_PROFILE.name}
              </h2>
              <p className="text-[11px] text-slate-600">
                {SCHOOL_PROFILE.address}, Kec. {SCHOOL_PROFILE.kecamatan}, Kab. {SCHOOL_PROFILE.kabupaten}, {SCHOOL_PROFILE.provinsi}
              </p>
              <p className="text-[10px] text-slate-500">
                NPSN: {SCHOOL_PROFILE.npsn} • Telp: {SCHOOL_PROFILE.phone} • Email: {SCHOOL_PROFILE.email}
              </p>
            </div>
          </div>
        </div>

        {/* Title of Document */}
        <div className="text-center space-y-1">
          <span className="inline-block text-xs font-extrabold tracking-widest text-blue-900 uppercase bg-blue-50 px-4 py-1 rounded-full border border-blue-200">
            KARTU TANDA PESERTA SPMB T.A {SCHOOL_PROFILE.academicYear}
          </span>
          <p className="text-[11px] text-slate-500">
            Tanda Bukti Pendaftaran Resmi Sistem Penerimaan Murid Baru Online
          </p>
        </div>

        {/* Card Body: Photo, QR Code, Details */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6 items-start">
          {/* Left Column: Photo & QR */}
          <div className="sm:col-span-1 flex flex-col items-center space-y-3">
            <div className="w-32 h-44 rounded-xl border-2 border-slate-300 overflow-hidden bg-slate-100 flex items-center justify-center shadow-xs">
              {candidate.documents.pasFoto?.url ? (
                <img
                  src={candidate.documents.pasFoto.url}
                  alt={candidate.fullName}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="text-center p-2 text-slate-400 text-xs">
                  Foto 3x4
                </div>
              )}
            </div>

            {/* QR Code Simulation */}
            <div className="p-2 border border-slate-300 rounded-xl bg-slate-50 text-center">
              <QrCode className="w-16 h-16 text-slate-800 mx-auto" />
              <span className="text-[9px] font-mono text-slate-600 block mt-1">
                VERIFIED SPMB
              </span>
            </div>
          </div>

          {/* Right Column: Complete Student Info */}
          <div className="sm:col-span-3 space-y-3 text-xs sm:text-sm">
            <div className="p-3 bg-blue-50/70 border border-blue-200 rounded-xl flex justify-between items-center">
              <div>
                <span className="text-[11px] text-blue-700 font-semibold block">NOMOR PENDAFTARAN:</span>
                <span className="text-lg font-mono font-black text-blue-950">
                  {candidate.registrationNumber}
                </span>
              </div>
              <div className="text-right">
                <span className="text-[11px] text-blue-700 font-semibold block">JALUR SELEKSI:</span>
                <span className="text-sm font-bold uppercase text-blue-900 bg-white px-2 py-0.5 rounded border border-blue-300">
                  {candidate.jalur}
                </span>
              </div>
            </div>

            <table className="w-full text-slate-800 text-xs border-collapse">
              <tbody>
                <tr className="border-b border-slate-100">
                  <td className="py-1.5 font-semibold text-slate-500 w-36">NISN</td>
                  <td className="py-1.5 font-mono font-bold text-slate-900">{candidate.nisn}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-1.5 font-semibold text-slate-500">NIK Siswa</td>
                  <td className="py-1.5 font-mono">{candidate.nik}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-1.5 font-semibold text-slate-500">Nama Lengkap</td>
                  <td className="py-1.5 font-bold uppercase text-slate-900">{candidate.fullName}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-1.5 font-semibold text-slate-500">Jenis Kelamin</td>
                  <td className="py-1.5">{candidate.gender === 'L' ? 'Laki-Laki' : 'Perempuan'}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-1.5 font-semibold text-slate-500">Tempat, Tgl Lahir</td>
                  <td className="py-1.5">{candidate.birthPlace}, {candidate.birthDate}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-1.5 font-semibold text-slate-500">Asal SD / MI</td>
                  <td className="py-1.5 font-semibold">{candidate.previousSchool}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-1.5 font-semibold text-slate-500">Alamat Domisili</td>
                  <td className="py-1.5">{candidate.address}, RT/RW {candidate.rtRw}, Kel. {candidate.kelurahan}, Kec. {candidate.kecamatan}</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-1.5 font-semibold text-slate-500">Jarak ke Sekolah</td>
                  <td className="py-1.5 font-bold text-blue-700">{candidate.distanceToSchoolKm} Km</td>
                </tr>
                <tr className="border-b border-slate-100">
                  <td className="py-1.5 font-semibold text-slate-500">Rata-rata Rapor</td>
                  <td className="py-1.5 font-bold">{candidate.averageScore}</td>
                </tr>
                {candidate.achievementName && (
                  <tr className="border-b border-slate-100">
                    <td className="py-1.5 font-semibold text-slate-500">Prestasi</td>
                    <td className="py-1.5 text-amber-800 font-semibold">
                      {candidate.achievementName} ({candidate.achievementLevel})
                    </td>
                  </tr>
                )}
                {candidate.kipOrPkhNumber && (
                  <tr className="border-b border-slate-100">
                    <td className="py-1.5 font-semibold text-slate-500">No. KIP/PKH</td>
                    <td className="py-1.5 text-emerald-800 font-semibold">{candidate.kipOrPkhNumber}</td>
                  </tr>
                )}
                <tr className="border-b border-slate-100">
                  <td className="py-1.5 font-semibold text-slate-500">Nama Orang Tua</td>
                  <td className="py-1.5">{candidate.parentName} ({candidate.parentPhone})</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Verification Status Banner */}
        <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
            <span className="font-semibold text-slate-700">Status Verifikasi Sistem:</span>
            <span className="font-bold uppercase px-2 py-0.5 rounded bg-blue-100 text-blue-800">
              {candidate.verificationStatus.replace('_', ' ')}
            </span>
          </div>
          <span className="text-slate-500 text-[11px]">
            Terdaftar: {candidate.createdAt}
          </span>
        </div>

        {/* Instructions */}
        <div className="text-[11px] text-slate-600 space-y-1 bg-amber-50/60 p-3.5 rounded-xl border border-amber-200/80">
          <strong className="text-amber-900 block font-bold">PERHATIAN BAGI CALON SISWA:</strong>
          <ol className="list-decimal list-inside space-y-0.5">
            <li>Kartu tanda peserta ini adalah bukti sah bahwa calon siswa telah mendaftar di SMPN 2 Teluk Bayur.</li>
            <li>Simpan nomor pendaftaran untuk mengecek status verifikasi berkas dan pengumuman hasil seleksi.</li>
            <li>Saat verifikasi berkas fisik atau daftar ulang, bawa kartu ini beserta berkas dokumen asli (KK, Akta, SKL).</li>
          </ol>
        </div>

        {/* Signature Area */}
        <div className="pt-6 grid grid-cols-2 text-center text-xs text-slate-800">
          <div>
            <p>Calon Siswa / Orang Tua,</p>
            <div className="h-16" />
            <p className="font-bold uppercase underline">{candidate.fullName}</p>
          </div>
          <div>
            <p>Teluk Bayur, {candidate.createdAt.split(' ')[0]}</p>
            <p className="font-medium">Panitia SPMB SMPN 2 Teluk Bayur,</p>
            <div className="h-16 flex items-center justify-center text-slate-400 italic text-[10px]">
              (Tanda Tangan & Cap Panitia)
            </div>
            <p className="font-bold underline">Panitia SPMB 2025/2026</p>
          </div>
        </div>
      </div>
    </div>
  );
};
