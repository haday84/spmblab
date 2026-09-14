export type JalurPendaftaran = 'zonasi' | 'prestasi' | 'afirmasi' | 'mutasi';

export type StatusVerifikasi = 'menunggu' | 'terverifikasi' | 'perlu_perbaikan' | 'ditolak';

export type HasilSeleksi = 'pending' | 'diterima' | 'cadangan' | 'tidak_diterima';

export type DocumentKey = 
  | 'pasFoto' 
  | 'kartuKeluarga' 
  | 'aktaKelahiran' 
  | 'skl' 
  | 'raporOrSertifikat' 
  | 'suratMutasiOrKip';

export interface DocumentItem {
  name: string;
  url: string;
  status: 'valid' | 'invalid' | 'pending';
  note?: string;
}

export interface Candidate {
  id: string;
  registrationNumber: string;
  jalur: JalurPendaftaran;
  nisn: string;
  nik: string;
  fullName: string;
  gender: 'L' | 'P';
  birthPlace: string;
  birthDate: string;
  religion: string;
  previousSchool: string;
  address: string;
  rtRw: string;
  kelurahan: string;
  kecamatan: string;
  distanceToSchoolKm: number;
  phone: string;
  parentName: string;
  parentPhone: string;
  parentJob: string;
  averageScore: number;
  achievementName?: string;
  achievementLevel?: string;
  kipOrPkhNumber?: string;
  documents: {
    pasFoto: DocumentItem;
    kartuKeluarga: DocumentItem;
    aktaKelahiran: DocumentItem;
    skl: DocumentItem;
    raporOrSertifikat?: DocumentItem;
    suratMutasiOrKip?: DocumentItem;
  };
  verificationStatus: StatusVerifikasi;
  verificationNotes: string;
  verifiedAt?: string;
  verifiedBy?: string;
  selectionResult: HasilSeleksi;
  selectionRank?: number;
  createdAt: string;
  updatedAt: string;
}

export interface QuotaInfo {
  jalur: JalurPendaftaran;
  name: string;
  percentage: number;
  quotaSeats: number;
  description: string;
  criteria: string;
}

export interface SchoolInfo {
  name: string;
  npsn: string;
  address: string;
  kelurahan: string;
  kecamatan: string;
  kabupaten: string;
  provinsi: string;
  postalCode: string;
  phone: string;
  email: string;
  website: string;
  headmasterName: string;
  headmasterNip: string;
  panitiaContact: string;
  academicYear: string;
  totalQuota: number;
}

export type AdminRole = 'superadmin' | 'admin' | 'verifikator';

export interface AdminAccount {
  id: string;
  name: string;
  email: string;
  role: AdminRole;
  roleLabel: string;
  password?: string;
  assignedJalur?: JalurPendaftaran | 'semua';
  active: boolean;
  lastLogin?: string;
  createdAt?: string;
}
