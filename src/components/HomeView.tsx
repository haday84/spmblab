import React from 'react';
import { 
  CheckCircle2, 
  MapPin, 
  FileCheck, 
  Calendar, 
  HelpCircle, 
  ArrowRight, 
  FileText, 
  Search, 
  ShieldCheck, 
  Award, 
  Info,
  Clock,
  Sparkles,
  School
} from 'lucide-react';
import { SCHOOL_PROFILE, QUOTA_LIST, TIMELINE_SCHEDULE, FAQ_LIST } from '../data/initialData';

interface HomeViewProps {
  onNavigate: (tab: 'home' | 'register' | 'check-status' | 'admin-verify' | 'announcement') => void;
}

export const HomeView: React.FC<HomeViewProps> = ({ onNavigate }) => {
  return (
    <div className="space-y-12 pb-16">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white rounded-3xl p-8 sm:p-12 lg:p-16 shadow-xl border border-blue-900/50">
        <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        
        <div className="relative z-10 max-w-3xl space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs sm:text-sm font-medium">
            <Sparkles className="w-4 h-4 text-amber-400" />
            <span>Penerimaan Murid Baru Terbuka • Tahun Ajaran {SCHOOL_PROFILE.academicYear}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Selamat Datang di Portal Resmi SPMB{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-300">
              SMP Negeri 2 Teluk Bayur
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-300 leading-relaxed">
            Wadah pendaftaran online peserta didik baru yang transparan, akuntabel, dan terintegrasi di Kabupaten Berau. Lengkapi data, unggah berkas persyaratan, dan pantau status verifikasi serta pengumuman kelulusan secara real-time.
          </p>

          {/* Quick CTA Actions */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onNavigate('register')}
              className="px-6 py-3.5 rounded-xl font-bold text-sm sm:text-base text-slate-900 bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-400 hover:from-amber-300 hover:to-yellow-300 shadow-lg shadow-amber-500/20 transition-all hover:scale-102 flex items-center gap-2 cursor-pointer"
            >
              <FileText className="w-5 h-5 text-slate-900" />
              <span>Daftar Sekarang (Gratis)</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              onClick={() => onNavigate('check-status')}
              className="px-6 py-3.5 rounded-xl font-semibold text-sm sm:text-base text-white bg-white/10 hover:bg-white/20 border border-white/20 backdrop-blur-sm transition-all flex items-center gap-2 cursor-pointer"
            >
              <Search className="w-5 h-5 text-sky-400" />
              <span>Cek Status & Cetak Kartu</span>
            </button>

            <button
              onClick={() => onNavigate('announcement')}
              className="px-5 py-3.5 rounded-xl font-semibold text-sm sm:text-base text-blue-200 hover:text-white bg-blue-900/40 hover:bg-blue-800/60 border border-blue-700/50 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Award className="w-5 h-5 text-amber-400" />
              <span>Pengumuman Kelulusan</span>
            </button>
          </div>

          {/* Key Quick Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-white/10 text-xs sm:text-sm">
            <div className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>100% Bebas Biaya</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Total Kuota {SCHOOL_PROFILE.totalQuota} Siswa</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Verifikasi Dokumen Online</span>
            </div>
            <div className="flex items-center gap-2 text-slate-300">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Deploy Siap di GitHub</span>
            </div>
          </div>
        </div>
      </section>

      {/* 4 Jalur Pendaftaran & Kuota */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Jalur Masuk & Daya Tampung
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            4 Jalur Seleksi Resmi SPMB
          </h2>
          <p className="text-sm sm:text-base text-slate-600">
            Sesuai Permendikbud PPDB dan Petunjuk Teknis Dinas Pendidikan Kabupaten Berau
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {QUOTA_LIST.map((q) => (
            <div
              key={q.jalur}
              className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-extrabold text-blue-600">
                    {q.percentage}%
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-lg border border-slate-200">
                    {q.quotaSeats} Kursi
                  </span>
                </div>
                <h3 className="text-lg font-bold text-slate-900">{q.name}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {q.description}
                </p>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100">
                <div className="text-xs text-slate-500 font-medium">
                  <strong className="text-slate-700">Kriteria:</strong> {q.criteria}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Alur Pendaftaran */}
      <section className="bg-gradient-to-b from-slate-100 to-slate-50 rounded-3xl p-6 sm:p-10 border border-slate-200">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-white px-3 py-1 rounded-full border border-slate-200 shadow-xs">
            Panduan Lengkap
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            5 Langkah Mudah Pendaftaran
          </h2>
          <p className="text-sm text-slate-600">
            Alur pendaftaran dapat dilakukan secara mandiri dari rumah menggunakan HP atau komputer
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {[
            {
              step: '1',
              title: 'Pilih Jalur & Data Diri',
              desc: 'Pilih jalur pendaftaran yang sesuai, masukkan NISN 10 digit, NIK, dan data identitas diri.',
              icon: FileText,
            },
            {
              step: '2',
              title: 'Unggah Berkas',
              desc: 'Upload foto/scan KK, Akta Kelahiran, SKL SD, Pas Foto, dan bukti jalur (KIP/Sertifikat/SK).',
              icon: FileCheck,
            },
            {
              step: '3',
              title: 'Cetak Bukti Pendaftaran',
              desc: 'Dapatkan Nomor Pendaftaran resmi dan cetak Kartu Tanda Peserta SPMB.',
              icon: CheckCircle2,
            },
            {
              step: '4',
              title: 'Verifikasi Dokumen',
              desc: 'Panitia SMPN 2 Teluk Bayur memeriksa keaslian berkas secara online melalui portal verifikasi.',
              icon: ShieldCheck,
            },
            {
              step: '5',
              title: 'Pengumuman & Daftar Ulang',
              desc: 'Lihat status kelulusan, cetak Surat Kelulusan, dan ikuti jadwal daftar ulang fisik.',
              icon: Award,
            },
          ].map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={idx}
                className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs flex flex-col items-center text-center relative group hover:border-blue-300 transition-colors"
              >
                <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center font-bold text-base mb-3 shadow-sm shadow-blue-500/30">
                  {item.step}
                </div>
                <Icon className="w-6 h-6 text-blue-600 mb-2" />
                <h4 className="font-bold text-sm text-slate-900 mb-1.5">{item.title}</h4>
                <p className="text-xs text-slate-500 leading-relaxed">{item.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Dokumen & Jadwal Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Persyaratan Dokumen */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <FileCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Berkas yang Wajib Disiapkan</h3>
              <p className="text-xs text-slate-500">Pastikan scan/foto berkas berformat JPG, PNG, atau PDF (jelas dan tidak buram)</p>
            </div>
          </div>

          <div className="space-y-3">
            {[
              { title: 'Pas Foto Terbaru (3x4)', desc: 'Latar belakang merah atau biru, berpakaian seragam SD atau kemeja rapi.' },
              { title: 'Kartu Keluarga (KK)', desc: 'Diterbitkan paling singkat 1 (satu) tahun sebelum tanggal pendaftaran.' },
              { title: 'Akta Kelahiran', desc: 'Akta kelahiran resmi dari Disdukcapil atau surat keterangan lahir.' },
              { title: 'Surat Keterangan Lulus (SKL) / Ijazah SD', desc: 'Surat keterangan lulus dari SD/MI asal yang mencantumkan nilai rapor/ujian.' },
              { title: 'Sertifikat Prestasi (Jalur Prestasi)', desc: 'Piagam kejuaraan akademik / non-akademik tingkat kecamatan/kabupaten/provinsi.' },
              { title: 'Kartu KIP / PKH / KKS (Jalur Afirmasi)', desc: 'Bukti keikutsertaan program penanganan keluarga tidak mampu dari pemerintah.' },
              { title: 'SK Pindah Tugas (Jalur Mutasi)', desc: 'Surat penugasan orang tua dari instansi/perusahaan minimal terhitung tahun 2024/2025.' },
            ].map((doc, idx) => (
              <div key={idx} className="flex items-start gap-3 p-3 rounded-xl bg-slate-50 border border-slate-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="text-xs sm:text-sm">
                  <span className="font-semibold text-slate-800">{doc.title}: </span>
                  <span className="text-slate-600">{doc.desc}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Timeline Jadwal */}
        <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">Jadwal & Agenda Penting</h3>
              <p className="text-xs text-slate-500">Waktu Indonesia Tengah (WITA)</p>
            </div>
          </div>

          <div className="space-y-4">
            {TIMELINE_SCHEDULE.map((item, idx) => (
              <div key={idx} className="flex gap-4 items-start relative pb-2 border-b border-slate-100 last:border-0 last:pb-0">
                <div className="flex flex-col items-center">
                  <div className={`w-3 h-3 rounded-full mt-1.5 ${
                    item.status === 'active' ? 'bg-emerald-500 ring-4 ring-emerald-100' :
                    item.status === 'completed' ? 'bg-slate-400' : 'bg-blue-500'
                  }`} />
                </div>
                <div className="space-y-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-50 text-blue-700 border border-blue-200">
                      {item.dates}
                    </span>
                    {item.status === 'active' && (
                      <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 animate-pulse">
                        SEDANG BERLANGSUNG
                      </span>
                    )}
                  </div>
                  <h4 className="text-sm font-bold text-slate-900">{item.phase}</h4>
                  <p className="text-xs text-slate-500">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Profile & Info SMPN 2 Teluk Bayur */}
      <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-blue-700 font-bold text-sm">
              <School className="w-5 h-5" />
              <span>Profil Sekolah</span>
            </div>
            <h3 className="text-xl font-extrabold text-slate-900">{SCHOOL_PROFILE.name}</h3>
            <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
              Sekolah Menengah Pertama Negeri unggulan di Kecamatan Teluk Bayur, Kabupaten Berau, yang berkomitmen mencetak generasi berkarakter, berprestasi, dan berwawasan lingkungan.
            </p>
            <div className="text-xs text-slate-500">
              <div><strong>NPSN:</strong> {SCHOOL_PROFILE.npsn}</div>
              <div><strong>Kepala Sekolah:</strong> {SCHOOL_PROFILE.headmasterName}</div>
              <div><strong>NIP:</strong> {SCHOOL_PROFILE.headmasterNip}</div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-blue-700 font-bold text-sm">
              <MapPin className="w-5 h-5" />
              <span>Lokasi & Kontak</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-600">
              {SCHOOL_PROFILE.address}, Kec. {SCHOOL_PROFILE.kecamatan}, {SCHOOL_PROFILE.kabupaten}, {SCHOOL_PROFILE.provinsi} ({SCHOOL_PROFILE.postalCode})
            </p>
            <div className="text-xs text-slate-500 space-y-1">
              <div><strong>Telepon:</strong> {SCHOOL_PROFILE.phone}</div>
              <div><strong>Email:</strong> {SCHOOL_PROFILE.email}</div>
              <div><strong>Website:</strong> {SCHOOL_PROFILE.website}</div>
              <div><strong>Panitia Hotline:</strong> {SCHOOL_PROFILE.panitiaContact}</div>
            </div>
          </div>

          <div className="bg-slate-50 rounded-2xl p-5 border border-slate-200 flex flex-col justify-between">
            <div className="space-y-2">
              <h4 className="font-bold text-sm text-slate-900">Perlu Bantuan Pendaftaran?</h4>
              <p className="text-xs text-slate-600">
                Panitia SPMB SMPN 2 Teluk Bayur siap membantu bagi orang tua yang mengalami kendala teknis atau tidak memiliki akses internet.
              </p>
            </div>
            <div className="pt-3">
              <div className="text-xs font-semibold text-slate-700 flex items-center gap-1.5 mb-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Pelayanan Posko Sekolah: 08.00 - 13.00 WITA</span>
              </div>
              <button
                onClick={() => onNavigate('check-status')}
                className="w-full py-2 px-3 text-xs font-bold text-blue-700 bg-blue-100 hover:bg-blue-200 rounded-lg text-center cursor-pointer transition-colors"
              >
                Cek Progres Verifikasi Anda →
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 text-slate-900">
          <HelpCircle className="w-5 h-5 text-blue-600" />
          <h3 className="text-xl font-bold">Pertanyaan yang Sering Diajukan (FAQ)</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {FAQ_LIST.map((faq, idx) => (
            <div key={idx} className="bg-white rounded-xl p-5 border border-slate-200 shadow-xs space-y-2">
              <h4 className="text-sm font-bold text-slate-900 flex items-start gap-2">
                <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                <span>{faq.q}</span>
              </h4>
              <p className="text-xs text-slate-600 pl-6 leading-relaxed">
                {faq.a}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
