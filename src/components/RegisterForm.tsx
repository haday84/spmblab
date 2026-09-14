import React, { useState } from 'react';
import { 
  FileText, 
  Upload, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft, 
  Sparkles, 
  Info,
  Check,
  X,
  FileCheck2,
  Printer
} from 'lucide-react';
import { JalurPendaftaran, Candidate } from '../types/spmb';
import { QUOTA_LIST, SCHOOL_PROFILE } from '../data/initialData';
import { StorageService } from '../services/storage';

interface RegisterFormProps {
  onSuccess: (candidate: Candidate) => void;
  onViewCard: (candidate: Candidate) => void;
}

export const RegisterForm: React.FC<RegisterFormProps> = ({ onSuccess, onViewCard }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [submittedCandidate, setSubmittedCandidate] = useState<Candidate | null>(null);

  // Form State
  const [jalur, setJalur] = useState<JalurPendaftaran>('zonasi');
  const [nisn, setNisn] = useState('');
  const [nik, setNik] = useState('');
  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState<'L' | 'P'>('L');
  const [birthPlace, setBirthPlace] = useState('Teluk Bayur');
  const [birthDate, setBirthDate] = useState('2012-04-10');
  const [religion, setReligion] = useState('Islam');
  const [previousSchool, setPreviousSchool] = useState('SDN 001 Teluk Bayur');

  // Address
  const [address, setAddress] = useState('');
  const [rtRw, setRtRw] = useState('02/01');
  const [kelurahan, setKelurahan] = useState('Teluk Bayur');
  const [kecamatan, setKecamatan] = useState('Teluk Bayur');
  const [distanceToSchoolKm, setDistanceToSchoolKm] = useState<number>(0.85);

  // Parents
  const [parentName, setParentName] = useState('');
  const [parentPhone, setParentPhone] = useState('');
  const [parentJob, setParentJob] = useState('');

  // Academics / Additional
  const [averageScore, setAverageScore] = useState<number>(88.0);
  const [achievementName, setAchievementName] = useState('');
  const [achievementLevel, setAchievementLevel] = useState('Kabupaten');
  const [kipOrPkhNumber, setKipOrPkhNumber] = useState('');

  // Documents uploaded
  const [docPasFoto, setDocPasFoto] = useState<{ name: string; url: string } | null>(null);
  const [docKk, setDocKk] = useState<{ name: string; url: string } | null>(null);
  const [docAkta, setDocAkta] = useState<{ name: string; url: string } | null>(null);
  const [docSkl, setDocSkl] = useState<{ name: string; url: string } | null>(null);
  const [docTambahan, setDocTambahan] = useState<{ name: string; url: string } | null>(null);

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [agreement, setAgreement] = useState(false);

  // Handle file reader
  const handleFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    setter: (doc: { name: string; url: string } | null) => void
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check size < 5MB
    if (file.size > 5 * 1024 * 1024) {
      alert('Ukuran file maksimal adalah 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      setter({
        name: file.name,
        url: reader.result as string,
      });
    };
    reader.readAsDataURL(file);
  };

  // Quick helper to fill dummy demo files if tester doesn't want to browse files
  const handleAttachDemoDocs = () => {
    setDocPasFoto({
      name: 'pas_foto_resmi.jpg',
      url: gender === 'L' 
        ? 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=300&auto=format&fit=crop&q=80'
        : 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=300&auto=format&fit=crop&q=80',
    });
    setDocKk({
      name: 'scan_kartu_keluarga_asli.pdf',
      url: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&auto=format&fit=crop&q=80',
    });
    setDocAkta({
      name: 'scan_akta_kelahiran_disdukcapil.pdf',
      url: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&auto=format&fit=crop&q=80',
    });
    setDocSkl({
      name: 'surat_keterangan_lulus_sd.pdf',
      url: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&auto=format&fit=crop&q=80',
    });
    if (jalur === 'prestasi') {
      setDocTambahan({
        name: 'piagam_penghargaan_kejuaraan.pdf',
        url: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&auto=format&fit=crop&q=80',
      });
    } else if (jalur === 'afirmasi') {
      setDocTambahan({
        name: 'kartu_kip_pkh_resmi.pdf',
        url: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&auto=format&fit=crop&q=80',
      });
    } else if (jalur === 'mutasi') {
      setDocTambahan({
        name: 'sk_mutasi_kantor_dinas.pdf',
        url: 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=600&auto=format&fit=crop&q=80',
      });
    }
  };

  // Quick preset data for rapid demo
  const handleFillDemoData = () => {
    setFullName('Bagus Saputra');
    setNisn('0124567890');
    setNik('6403011504120009');
    setBirthPlace('Teluk Bayur');
    setBirthDate('2012-04-15');
    setReligion('Islam');
    setPreviousSchool('SDN 002 Teluk Bayur');
    setAddress('Jl. Stasiun Lama No. 19 RT. 03');
    setRtRw('03/01');
    setKelurahan('Teluk Bayur');
    setKecamatan('Teluk Bayur');
    setDistanceToSchoolKm(0.65);
    setParentName('Joko Widodo');
    setParentPhone('081255667788');
    setParentJob('Wiraswasta');
    setAverageScore(89.5);
    handleAttachDemoDocs();
  };

  // Step Validation
  const validateStep = (step: number): boolean => {
    const errs: Record<string, string> = {};

    if (step === 1) {
      if (!fullName.trim()) errs.fullName = 'Nama lengkap wajib diisi.';
      if (!nisn.trim()) {
        errs.nisn = 'NISN wajib diisi.';
      } else if (!/^\d{10}$/.test(nisn.trim())) {
        errs.nisn = 'NISN harus tepat 10 digit angka.';
      }
      if (!nik.trim()) {
        errs.nik = 'NIK wajib diisi.';
      } else if (!/^\d{16}$/.test(nik.trim())) {
        errs.nik = 'NIK harus tepat 16 digit angka.';
      }
      if (!previousSchool.trim()) errs.previousSchool = 'Nama sekolah asal wajib diisi.';
    }

    if (step === 2) {
      if (!address.trim()) errs.address = 'Alamat rumah wajib diisi.';
      if (distanceToSchoolKm <= 0) errs.distance = 'Jarak ke sekolah harus lebih dari 0 km.';
    }

    if (step === 3) {
      if (!parentName.trim()) errs.parentName = 'Nama orang tua / wali wajib diisi.';
      if (!parentPhone.trim()) errs.parentPhone = 'Nomor WhatsApp / HP wajib diisi.';
      if (averageScore <= 0 || averageScore > 100) errs.score = 'Nilai rata-rata harus antara 10 - 100.';
      if (jalur === 'prestasi' && !achievementName.trim()) {
        errs.achievement = 'Nama prestasi / kejuaraan wajib diisi untuk jalur prestasi.';
      }
      if (jalur === 'afirmasi' && !kipOrPkhNumber.trim()) {
        errs.kip = 'Nomor KIP/PKH/KKS wajib diisi untuk jalur afirmasi.';
      }
    }

    if (step === 4) {
      if (!docPasFoto) errs.pasFoto = 'Pas foto wajib diunggah.';
      if (!docKk) errs.kk = 'Kartu Keluarga wajib diunggah.';
      if (!docAkta) errs.akta = 'Akta Kelahiran wajib diunggah.';
      if (!docSkl) errs.skl = 'SKL atau Surat Kelulusan SD wajib diunggah.';
      if ((jalur === 'prestasi' || jalur === 'afirmasi' || jalur === 'mutasi') && !docTambahan) {
        errs.tambahan = `Dokumen pendukung untuk jalur ${jalur} wajib diunggah.`;
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    setCurrentStep(prev => prev - 1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(4)) {
      setCurrentStep(4);
      return;
    }
    if (!agreement) {
      setErrors({ agreement: 'Anda harus menyetujui pernyataan kebenaran data di atas.' });
      return;
    }

    // Create candidate in storage
    const newCand = StorageService.addCandidate({
      jalur,
      nisn: nisn.trim(),
      nik: nik.trim(),
      fullName: fullName.trim(),
      gender,
      birthPlace: birthPlace.trim(),
      birthDate,
      religion,
      previousSchool: previousSchool.trim(),
      address: address.trim(),
      rtRw: rtRw.trim(),
      kelurahan: kelurahan.trim(),
      kecamatan: kecamatan.trim(),
      distanceToSchoolKm: Number(distanceToSchoolKm),
      phone: parentPhone.trim(),
      parentName: parentName.trim(),
      parentPhone: parentPhone.trim(),
      parentJob: parentJob.trim() || 'Wiraswasta',
      averageScore: Number(averageScore),
      achievementName: achievementName.trim() || undefined,
      achievementLevel: achievementLevel || undefined,
      kipOrPkhNumber: kipOrPkhNumber.trim() || undefined,
      documents: {
        pasFoto: {
          name: docPasFoto?.name || 'pas_foto.jpg',
          url: docPasFoto?.url || '',
          status: 'pending',
        },
        kartuKeluarga: {
          name: docKk?.name || 'kartu_keluarga.pdf',
          url: docKk?.url || '',
          status: 'pending',
        },
        aktaKelahiran: {
          name: docAkta?.name || 'akta_kelahiran.pdf',
          url: docAkta?.url || '',
          status: 'pending',
        },
        skl: {
          name: docSkl?.name || 'skl_sd.pdf',
          url: docSkl?.url || '',
          status: 'pending',
        },
        ...(docTambahan && {
          [jalur === 'prestasi' ? 'raporOrSertifikat' : 'suratMutasiOrKip']: {
            name: docTambahan.name,
            url: docTambahan.url,
            status: 'pending',
          }
        })
      }
    });

    // Synchronize to Cloud SQL PostgreSQL database
    StorageService.addCandidateServer(newCand).catch(err => {
      console.warn('Deferred Cloud SQL sync:', err);
    });

    setSubmittedCandidate(newCand);
    onSuccess(newCand);
  };

  // If already submitted in this session
  if (submittedCandidate) {
    return (
      <div className="max-w-2xl mx-auto bg-white rounded-3xl p-8 border border-slate-200 shadow-xl text-center space-y-6">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
          <CheckCircle2 className="w-10 h-10" />
        </div>

        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
            Pendaftaran Berhasil Dikirim
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Selamat, Formulir SPMB Anda Telah Diterima!
          </h2>
          <p className="text-sm text-slate-600">
            Data calon siswa telah tersimpan di sistem SPMB SMP Negeri 2 Teluk Bayur dan masuk ke antrean verifikasi berkas panitia.
          </p>
        </div>

        <div className="p-5 rounded-2xl bg-blue-50 border border-blue-200 text-left space-y-3">
          <div className="flex justify-between items-center pb-2 border-b border-blue-200">
            <span className="text-xs text-blue-700 font-semibold">Nomor Pendaftaran Resmi:</span>
            <span className="text-lg font-mono font-extrabold text-blue-900">
              {submittedCandidate.registrationNumber}
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs text-slate-700">
            <div>
              <span className="text-slate-500">Nama Siswa:</span>
              <p className="font-bold text-slate-900">{submittedCandidate.fullName}</p>
            </div>
            <div>
              <span className="text-slate-500">NISN:</span>
              <p className="font-bold text-slate-900">{submittedCandidate.nisn}</p>
            </div>
            <div>
              <span className="text-slate-500">Jalur:</span>
              <p className="font-bold text-slate-900 uppercase">{submittedCandidate.jalur}</p>
            </div>
            <div>
              <span className="text-slate-500">Status Berkas:</span>
              <p className="font-bold text-amber-600">Menunggu Verifikasi</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
          <button
            onClick={() => onViewCard(submittedCandidate)}
            className="px-6 py-3 rounded-xl font-bold text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Kartu Tanda Peserta</span>
          </button>
          <button
            onClick={() => {
              setSubmittedCandidate(null);
              setCurrentStep(1);
            }}
            className="px-6 py-3 rounded-xl font-semibold text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 flex items-center justify-center gap-2 cursor-pointer transition-all"
          >
            <span>Daftar Siswa Lain</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Header & Demo Helper */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-3 py-1 rounded-full border border-blue-200">
            Formulir Pendaftaran Online
          </span>
          <h2 className="text-2xl font-bold text-slate-900 mt-2">
            Penerimaan Murid Baru T.A {SCHOOL_PROFILE.academicYear}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Silakan lengkapi formulir pendaftaran 4 langkah berikut dengan data yang valid dan benar.
          </p>
        </div>

        {/* Quick Demo Pre-fill for reviewer */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleFillDemoData}
            className="text-xs font-semibold px-3 py-2 rounded-lg bg-amber-50 text-amber-900 hover:bg-amber-100 border border-amber-300 flex items-center gap-1.5 transition-colors cursor-pointer"
            title="Isi otomatis dengan data contoh untuk uji coba cepat"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Isi Data Contoh (Demo)</span>
          </button>
        </div>
      </div>

      {/* Step Indicator */}
      <div className="grid grid-cols-4 gap-2 text-center text-xs font-semibold">
        {[
          { num: 1, title: 'Jalur & Siswa' },
          { num: 2, title: 'Domisili' },
          { num: 3, title: 'Orang Tua & Nilai' },
          { num: 4, title: 'Upload Berkas' },
        ].map(step => (
          <div
            key={step.num}
            onClick={() => {
              if (step.num < currentStep) setCurrentStep(step.num);
            }}
            className={`p-3 rounded-xl border transition-all cursor-pointer ${
              currentStep === step.num
                ? 'bg-blue-600 text-white border-blue-600 shadow-sm'
                : currentStep > step.num
                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                : 'bg-white text-slate-400 border-slate-200'
            }`}
          >
            <div className="flex items-center justify-center gap-1.5">
              {currentStep > step.num ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <span className="w-4 h-4 rounded-full border text-[11px] flex items-center justify-center">
                  {step.num}
                </span>
              )}
              <span className="hidden sm:inline">{step.title}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Form Card */}
      <form onSubmit={handleSubmit} className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200 shadow-sm space-y-8">
        {/* STEP 1: JALUR & IDENTITAS CALON SISWA */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <h3 className="text-lg font-bold text-slate-900">Langkah 1: Jalur Masuk & Identitas Siswa</h3>
              <p className="text-xs text-slate-500">Pilih jalur seleksi dan lengkapi identitas kependudukan calon siswa.</p>
            </div>

            {/* Jalur Selection Grid */}
            <div className="space-y-2">
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider">
                Pilih Jalur Pendaftaran <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {QUOTA_LIST.map(q => (
                  <div
                    key={q.jalur}
                    onClick={() => setJalur(q.jalur)}
                    className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                      jalur === q.jalur
                        ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-slate-900">{q.name}</span>
                      <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-100 text-blue-800">
                        {q.percentage}% ({q.quotaSeats} kursi)
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 mt-1">{q.criteria}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Student Identification */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  NISN (10 Digit Angka) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  maxLength={10}
                  placeholder="Contoh: 0112345678"
                  value={nisn}
                  onChange={e => setNisn(e.target.value.replace(/\D/g, ''))}
                  className={`w-full px-4 py-2.5 text-sm rounded-xl border ${
                    errors.nisn ? 'border-red-500 bg-red-50/50' : 'border-slate-200 focus:border-blue-600'
                  } outline-none transition-colors`}
                />
                {errors.nisn && <p className="text-xs text-red-600 mt-1">{errors.nisn}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  NIK Calon Siswa (16 Digit KK) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  maxLength={16}
                  placeholder="Contoh: 640301xxxxxxxxxx"
                  value={nik}
                  onChange={e => setNik(e.target.value.replace(/\D/g, ''))}
                  className={`w-full px-4 py-2.5 text-sm rounded-xl border ${
                    errors.nik ? 'border-red-500 bg-red-50/50' : 'border-slate-200 focus:border-blue-600'
                  } outline-none transition-colors`}
                />
                {errors.nik && <p className="text-xs text-red-600 mt-1">{errors.nik}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Nama Lengkap Siswa (Sesuai Ijazah/Akta) <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Contoh: Bagus Saputra"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
                className={`w-full px-4 py-2.5 text-sm rounded-xl border ${
                  errors.fullName ? 'border-red-500 bg-red-50/50' : 'border-slate-200 focus:border-blue-600'
                } outline-none transition-colors`}
              />
              {errors.fullName && <p className="text-xs text-red-600 mt-1">{errors.fullName}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Jenis Kelamin <span className="text-red-500">*</span>
                </label>
                <select
                  value={gender}
                  onChange={e => setGender(e.target.value as 'L' | 'P')}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white outline-none focus:border-blue-600"
                >
                  <option value="L">Laki-Laki</option>
                  <option value="P">Perempuan</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tempat Lahir <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Berau"
                  value={birthPlace}
                  onChange={e => setBirthPlace(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Tanggal Lahir <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={e => setBirthDate(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 outline-none focus:border-blue-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Agama <span className="text-red-500">*</span>
                </label>
                <select
                  value={religion}
                  onChange={e => setReligion(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 bg-white outline-none focus:border-blue-600"
                >
                  <option value="Islam">Islam</option>
                  <option value="Kristen Protestan">Kristen Protestan</option>
                  <option value="Katolik">Katolik</option>
                  <option value="Hindu">Hindu</option>
                  <option value="Buddha">Buddha</option>
                  <option value="Konghucu">Konghucu</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Asal Sekolah (SD/MI) <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: SDN 001 Teluk Bayur"
                  value={previousSchool}
                  onChange={e => setPreviousSchool(e.target.value)}
                  className={`w-full px-4 py-2.5 text-sm rounded-xl border ${
                    errors.previousSchool ? 'border-red-500 bg-red-50/50' : 'border-slate-200 focus:border-blue-600'
                  } outline-none transition-colors`}
                />
                {errors.previousSchool && <p className="text-xs text-red-600 mt-1">{errors.previousSchool}</p>}
              </div>
            </div>
          </div>
        )}

        {/* STEP 2: ALAMAT & ESTIMASI JARAK */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <h3 className="text-lg font-bold text-slate-900">Langkah 2: Alamat Domisili & Jarak ke Sekolah</h3>
              <p className="text-xs text-slate-500">Sesuai Kartu Keluarga (KK) yang diterbitkan paling lambat 1 tahun lalu.</p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Alamat Tempat Tinggal Lengkap (Jalan / Gang / Nomor Rumah) <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={2}
                placeholder="Contoh: Jl. Ki Hajar Dewantara Gang Dahlia No. 15"
                value={address}
                onChange={e => setAddress(e.target.value)}
                className={`w-full px-4 py-2.5 text-sm rounded-xl border ${
                  errors.address ? 'border-red-500 bg-red-50/50' : 'border-slate-200 focus:border-blue-600'
                } outline-none transition-colors`}
              />
              {errors.address && <p className="text-xs text-red-600 mt-1">{errors.address}</p>}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">RT / RW</label>
                <input
                  type="text"
                  placeholder="Contoh: 03/01"
                  value={rtRw}
                  onChange={e => setRtRw(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Kelurahan / Kampung</label>
                <input
                  type="text"
                  value={kelurahan}
                  onChange={e => setKelurahan(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Kecamatan</label>
                <input
                  type="text"
                  value={kecamatan}
                  onChange={e => setKecamatan(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 outline-none focus:border-blue-600"
                />
              </div>
            </div>

            {/* Distance Calculator simulator for Zonasi */}
            <div className="p-5 rounded-2xl bg-blue-50/60 border border-blue-200 space-y-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Info className="w-4 h-4 text-blue-600" />
                  <span className="text-xs font-bold text-blue-900 uppercase">
                    Kalkulasi Jarak Domisili ke SMPN 2 Teluk Bayur
                  </span>
                </div>
                <span className="text-xs font-semibold px-2 py-0.5 rounded bg-blue-200 text-blue-800">
                  {distanceToSchoolKm} Km
                </span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Jarak udara dari rumah calon siswa menuju SMP Negeri 2 Teluk Bayur (Jl. Ki Hajar Dewantara No. 14).
                Pada jalur Zonasi, semakin dekat jarak domisili, semakin tinggi prioritas penerimaan.
              </p>
              <div>
                <input
                  type="range"
                  min="0.1"
                  max="10"
                  step="0.05"
                  value={distanceToSchoolKm}
                  onChange={e => setDistanceToSchoolKm(parseFloat(e.target.value))}
                  className="w-full accent-blue-600 cursor-pointer"
                />
                <div className="flex justify-between text-[11px] text-slate-500 mt-1">
                  <span>0.1 Km (Sangat Dekat)</span>
                  <span className="font-semibold text-blue-700">{distanceToSchoolKm} Km</span>
                  <span>10.0 Km (Luar Radius Inti)</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* STEP 3: DATA ORANG TUA & AKADEMIK */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-4">
              <h3 className="text-lg font-bold text-slate-900">Langkah 3: Data Orang Tua / Wali & Nilai</h3>
              <p className="text-xs text-slate-500">Kontak aktif yang dapat dihubungi panitia serta data akademik/prestasi.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nama Ayah / Ibu / Wali <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Agus Pratama"
                  value={parentName}
                  onChange={e => setParentName(e.target.value)}
                  className={`w-full px-4 py-2.5 text-sm rounded-xl border ${
                    errors.parentName ? 'border-red-500 bg-red-50/50' : 'border-slate-200 focus:border-blue-600'
                  } outline-none transition-colors`}
                />
                {errors.parentName && <p className="text-xs text-red-600 mt-1">{errors.parentName}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Nomor WhatsApp / HP Aktif <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  placeholder="Contoh: 081234567890"
                  value={parentPhone}
                  onChange={e => setParentPhone(e.target.value)}
                  className={`w-full px-4 py-2.5 text-sm rounded-xl border ${
                    errors.parentPhone ? 'border-red-500 bg-red-50/50' : 'border-slate-200 focus:border-blue-600'
                  } outline-none transition-colors`}
                />
                {errors.parentPhone && <p className="text-xs text-red-600 mt-1">{errors.parentPhone}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Pekerjaan Orang Tua / Wali</label>
                <input
                  type="text"
                  placeholder="Contoh: PNS / Wiraswasta / Karyawan"
                  value={parentJob}
                  onChange={e => setParentJob(e.target.value)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 outline-none focus:border-blue-600"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Rata-rata Nilai Rapor SD (Semester 1 - 5) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="10"
                  max="100"
                  value={averageScore}
                  onChange={e => setAverageScore(parseFloat(e.target.value) || 0)}
                  className="w-full px-4 py-2.5 text-sm rounded-xl border border-slate-200 outline-none focus:border-blue-600 font-semibold"
                />
              </div>
            </div>

            {/* Conditional Fields based on Jalur */}
            {jalur === 'prestasi' && (
              <div className="p-5 rounded-2xl bg-amber-50/70 border border-amber-200 space-y-4">
                <div className="flex items-center gap-2 text-amber-900 font-bold text-sm">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Keterangan Prestasi / Piagam Kejuaraan</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-amber-900 mb-1">
                      Nama Kejuaraan / Prestasi <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="Contoh: Juara 1 OSN IPA Tingkat Kabupaten"
                      value={achievementName}
                      onChange={e => setAchievementName(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-amber-300 bg-white"
                    />
                    {errors.achievement && <p className="text-xs text-red-600 mt-1">{errors.achievement}</p>}
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-amber-900 mb-1">Tingkat Kejuaraan</label>
                    <select
                      value={achievementLevel}
                      onChange={e => setAchievementLevel(e.target.value)}
                      className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-amber-300 bg-white"
                    >
                      <option value="Kecamatan">Tingkat Kecamatan</option>
                      <option value="Kabupaten">Tingkat Kabupaten (Berau)</option>
                      <option value="Provinsi">Tingkat Provinsi (Kaltim)</option>
                      <option value="Nasional">Tingkat Nasional / Internasional</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {jalur === 'afirmasi' && (
              <div className="p-5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3">
                <div className="flex items-center gap-2 text-emerald-900 font-bold text-sm">
                  <FileCheck2 className="w-4 h-4 text-emerald-600" />
                  <span>Keterangan Afirmasi / Bantuan Sosial</span>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-emerald-900 mb-1">
                    Nomor Kartu KIP / PKH / KKS / Terdaftar DTKS <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: KIP-640301-2024-xxxx"
                    value={kipOrPkhNumber}
                    onChange={e => setKipOrPkhNumber(e.target.value)}
                    className="w-full px-3 py-2 text-xs sm:text-sm rounded-lg border border-emerald-300 bg-white"
                  />
                  {errors.kip && <p className="text-xs text-red-600 mt-1">{errors.kip}</p>}
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 4: UPLOAD BERKAS PERSYARATAN */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <div className="border-b border-slate-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-lg font-bold text-slate-900">Langkah 4: Unggah Berkas & Dokumen Asli</h3>
                <p className="text-xs text-slate-500">Format: JPG, PNG, atau PDF (maks. 5MB per berkas).</p>
              </div>
              <button
                type="button"
                onClick={handleAttachDemoDocs}
                className="text-xs font-semibold px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition-colors self-start cursor-pointer"
              >
                Lampirkan File Contoh Otomatis
              </button>
            </div>

            {/* Document upload grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* 1. Pas Foto */}
              <div className={`p-4 rounded-2xl border-2 ${errors.pasFoto ? 'border-red-400 bg-red-50/30' : 'border-slate-200 bg-slate-50'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-900">1. Pas Foto Berwarna 3x4 *</span>
                  {docPasFoto && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </div>
                <div className="flex items-center gap-3">
                  {docPasFoto?.url && (
                    <img src={docPasFoto.url} alt="Preview" className="w-12 h-16 object-cover rounded-lg border border-slate-300 shrink-0" />
                  )}
                  <div className="w-full">
                    <label className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white border border-slate-300 hover:border-blue-500 text-xs font-semibold text-slate-700 cursor-pointer transition-colors">
                      <Upload className="w-3.5 h-3.5 text-blue-600" />
                      <span>{docPasFoto ? 'Ganti Pas Foto' : 'Pilih Pas Foto'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={e => handleFileUpload(e, setDocPasFoto)}
                        className="hidden"
                      />
                    </label>
                    <p className="text-[10px] text-slate-500 mt-1 truncate">
                      {docPasFoto ? docPasFoto.name : 'Format JPG/PNG latar merah/biru'}
                    </p>
                  </div>
                </div>
              </div>

              {/* 2. Kartu Keluarga */}
              <div className={`p-4 rounded-2xl border-2 ${errors.kk ? 'border-red-400 bg-red-50/30' : 'border-slate-200 bg-slate-50'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-900">2. Kartu Keluarga (KK) Asli *</span>
                  {docKk && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </div>
                <label className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white border border-slate-300 hover:border-blue-500 text-xs font-semibold text-slate-700 cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5 text-blue-600" />
                  <span>{docKk ? 'Ganti File KK' : 'Pilih Scan / Foto KK'}</span>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={e => handleFileUpload(e, setDocKk)}
                    className="hidden"
                  />
                </label>
                <p className="text-[10px] text-slate-500 mt-1 truncate">
                  {docKk ? `Terpilih: ${docKk.name}` : 'Pastikan NIK dan nama jelas terbaca'}
                </p>
              </div>

              {/* 3. Akta Kelahiran */}
              <div className={`p-4 rounded-2xl border-2 ${errors.akta ? 'border-red-400 bg-red-50/30' : 'border-slate-200 bg-slate-50'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-900">3. Akta Kelahiran Siswa *</span>
                  {docAkta && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </div>
                <label className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white border border-slate-300 hover:border-blue-500 text-xs font-semibold text-slate-700 cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5 text-blue-600" />
                  <span>{docAkta ? 'Ganti Akta Kelahiran' : 'Pilih Scan Akta Kelahiran'}</span>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={e => handleFileUpload(e, setDocAkta)}
                    className="hidden"
                  />
                </label>
                <p className="text-[10px] text-slate-500 mt-1 truncate">
                  {docAkta ? `Terpilih: ${docAkta.name}` : 'Diterbitkan oleh Dinas Dukcapil'}
                </p>
              </div>

              {/* 4. SKL / Surat Keterangan Lulus */}
              <div className={`p-4 rounded-2xl border-2 ${errors.skl ? 'border-red-400 bg-red-50/30' : 'border-slate-200 bg-slate-50'}`}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-bold text-slate-900">4. SKL / Ijazah SD/MI *</span>
                  {docSkl && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                </div>
                <label className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white border border-slate-300 hover:border-blue-500 text-xs font-semibold text-slate-700 cursor-pointer transition-colors">
                  <Upload className="w-3.5 h-3.5 text-blue-600" />
                  <span>{docSkl ? 'Ganti File SKL' : 'Pilih SKL dari SD'}</span>
                  <input
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={e => handleFileUpload(e, setDocSkl)}
                    className="hidden"
                  />
                </label>
                <p className="text-[10px] text-slate-500 mt-1 truncate">
                  {docSkl ? `Terpilih: ${docSkl.name}` : 'Surat Keterangan Lulus dari Kepala SD/MI'}
                </p>
              </div>

              {/* 5. Dokumen Tambahan Khusus Jalur Prestasi/Afirmasi/Mutasi */}
              {(jalur === 'prestasi' || jalur === 'afirmasi' || jalur === 'mutasi') && (
                <div className={`p-4 rounded-2xl border-2 sm:col-span-2 ${errors.tambahan ? 'border-red-400 bg-red-50/30' : 'border-indigo-200 bg-indigo-50/40'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-indigo-950">
                      5. Bukti Khusus Jalur {jalur.toUpperCase()} *
                      {jalur === 'prestasi' && ' (Sertifikat / Piagam Kejuaraan)'}
                      {jalur === 'afirmasi' && ' (Kartu KIP / PKH / Surat DTKS)'}
                      {jalur === 'mutasi' && ' (Surat Keputusan Mutasi Kerja)'}
                    </span>
                    {docTambahan && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                  </div>
                  <label className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-white border border-indigo-300 hover:border-indigo-500 text-xs font-semibold text-slate-700 cursor-pointer transition-colors">
                    <Upload className="w-3.5 h-3.5 text-indigo-600" />
                    <span>{docTambahan ? 'Ganti Dokumen Bukti' : 'Pilih Berkas Bukti Pendukung'}</span>
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={e => handleFileUpload(e, setDocTambahan)}
                      className="hidden"
                    />
                  </label>
                  <p className="text-[10px] text-indigo-800 mt-1 truncate">
                    {docTambahan ? `Terpilih: ${docTambahan.name}` : 'Wajib diunggah untuk verifikasi keabsahan jalur'}
                  </p>
                </div>
              )}
            </div>

            {/* Agreement Box */}
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={agreement}
                  onChange={e => setAgreement(e.target.checked)}
                  className="mt-1 w-4 h-4 rounded text-blue-600 accent-blue-600"
                />
                <span className="text-xs text-slate-700 leading-relaxed">
                  Saya menyatakan bahwa seluruh data dan dokumen yang diunggah adalah <strong>BENAR dan ASLI</strong>. Apabila di kemudian hari ditemukan ketidakbenaran data, saya bersedia menerima sanksi pembatalan kelulusan SPMB di SMP Negeri 2 Teluk Bayur.
                </span>
              </label>
              {errors.agreement && <p className="text-xs text-red-600 font-semibold">{errors.agreement}</p>}
            </div>
          </div>
        )}

        {/* Buttons Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-slate-200">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={handlePrev}
              className="px-5 py-2.5 rounded-xl font-semibold text-xs sm:text-sm text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali</span>
            </button>
          ) : (
            <div />
          )}

          {currentStep < 4 ? (
            <button
              type="button"
              onClick={handleNext}
              className="px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-blue-600 hover:bg-blue-700 shadow-sm shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <span>Lanjutkan</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="submit"
              className="px-7 py-3 rounded-xl font-bold text-sm text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Kirim Pendaftaran Online</span>
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
