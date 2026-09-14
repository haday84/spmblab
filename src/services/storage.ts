import { Candidate, HasilSeleksi, StatusVerifikasi, AdminAccount } from '../types/spmb';
import { INITIAL_CANDIDATES, QUOTA_LIST, INITIAL_ADMINS } from '../data/initialData';

const STORAGE_KEY = 'spmb_smpn2_candidates_v1';
const ADMINS_STORAGE_KEY = 'spmb_smpn2_admins_v1';
const ACTIVE_ADMIN_KEY = 'spmb_smpn2_active_admin_v1';

export const StorageService = {
  getCandidates(): Candidate[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CANDIDATES));
        return INITIAL_CANDIDATES;
      }
      return JSON.parse(stored);
    } catch (e) {
      console.error('Error reading localStorage', e);
      return INITIAL_CANDIDATES;
    }
  },

  saveCandidates(candidates: Candidate[]): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(candidates));
      window.dispatchEvent(new Event('spmb-data-updated'));
    } catch (e) {
      console.error('Error writing localStorage', e);
    }
  },

  getCandidateById(id: string): Candidate | undefined {
    const list = this.getCandidates();
    return list.find(c => c.id === id);
  },

  findByRegNumberOrNisn(query: string, birthDate?: string): Candidate | undefined {
    const cleaned = query.trim().toUpperCase();
    const list = this.getCandidates();
    return list.find(c => {
      const matchQuery = c.registrationNumber.toUpperCase() === cleaned || c.nisn === cleaned;
      if (!matchQuery) return false;
      if (birthDate) {
        return c.birthDate === birthDate;
      }
      return true;
    });
  },

  generateNextRegNumber(): string {
    const list = this.getCandidates();
    let maxNum = 0;
    list.forEach(c => {
      const match = c.registrationNumber.match(/SPMB-2025-(\d+)/);
      if (match && match[1]) {
        const num = parseInt(match[1], 10);
        if (num > maxNum) maxNum = num;
      }
    });
    const next = maxNum + 1;
    return `SPMB-2025-${String(next).padStart(3, '0')}`;
  },

  addCandidate(candidateData: Omit<Candidate, 'id' | 'registrationNumber' | 'verificationStatus' | 'verificationNotes' | 'selectionResult' | 'createdAt' | 'updatedAt'>): Candidate {
    const list = this.getCandidates();
    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    
    const newCandidate: Candidate = {
      ...candidateData,
      id: `cand-${Date.now()}`,
      registrationNumber: this.generateNextRegNumber(),
      verificationStatus: 'menunggu',
      verificationNotes: 'Pendaftaran berhasil dikirim. Menunggu proses verifikasi dokumen oleh panitia SPMB.',
      selectionResult: 'pending',
      createdAt: dateStr,
      updatedAt: dateStr,
    };

    const updated = [newCandidate, ...list];
    this.saveCandidates(updated);
    return newCandidate;
  },

  updateCandidate(id: string, partial: Partial<Candidate>): Candidate | undefined {
    const list = this.getCandidates();
    const index = list.findIndex(c => c.id === id);
    if (index === -1) return undefined;

    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const updatedCandidate: Candidate = {
      ...list[index],
      ...partial,
      updatedAt: dateStr,
    };

    list[index] = updatedCandidate;
    this.saveCandidates(list);
    return updatedCandidate;
  },

  verifyCandidate(
    id: string,
    status: StatusVerifikasi,
    notes: string,
    verifiedBy: string,
    documentsPatch?: Candidate['documents']
  ): Candidate | undefined {
    const list = this.getCandidates();
    const candidate = list.find(c => c.id === id);
    if (!candidate) return undefined;

    const now = new Date();
    const dateStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;

    const patch: Partial<Candidate> = {
      verificationStatus: status,
      verificationNotes: notes,
      verifiedAt: dateStr,
      verifiedBy,
    };

    if (documentsPatch) {
      patch.documents = documentsPatch;
    }

    return this.updateCandidate(id, patch);
  },

  updateSelectionResult(id: string, result: HasilSeleksi, rank?: number): Candidate | undefined {
    return this.updateCandidate(id, {
      selectionResult: result,
      selectionRank: rank,
    });
  },

  autoRankAndCalculateSelection(): { updatedCount: number } {
    const list = this.getCandidates();
    
    // Only rank candidates whose documents are 'terverifikasi'
    // Group by Jalur
    const jalurs = ['zonasi', 'prestasi', 'afirmasi', 'mutasi'] as const;
    let count = 0;

    jalurs.forEach(jalur => {
      const quota = QUOTA_LIST.find(q => q.jalur === jalur)?.quotaSeats || 20;
      const verifiedInJalur = list.filter(c => c.jalur === jalur && c.verificationStatus === 'terverifikasi');

      if (jalur === 'zonasi') {
        // Zonasi sort by distance ascending (closest first)
        verifiedInJalur.sort((a, b) => a.distanceToSchoolKm - b.distanceToSchoolKm);
      } else if (jalur === 'prestasi') {
        // Prestasi sort by averageScore descending
        verifiedInJalur.sort((a, b) => b.averageScore - a.averageScore);
      } else if (jalur === 'afirmasi') {
        // Afirmasi sort by distance ascending
        verifiedInJalur.sort((a, b) => a.distanceToSchoolKm - b.distanceToSchoolKm);
      } else {
        // Mutasi sort by score descending
        verifiedInJalur.sort((a, b) => b.averageScore - a.averageScore);
      }

      verifiedInJalur.forEach((cand, index) => {
        const rank = index + 1;
        const candidateInList = list.find(c => c.id === cand.id);
        if (candidateInList) {
          candidateInList.selectionRank = rank;
          if (rank <= quota) {
            candidateInList.selectionResult = 'diterima';
          } else {
            candidateInList.selectionResult = 'cadangan';
          }
          count++;
        }
      });
    });

    this.saveCandidates([...list]);
    return { updatedCount: count };
  },

  resetToDefault(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(INITIAL_CANDIDATES));
    window.dispatchEvent(new Event('spmb-data-updated'));
  },

  exportToCsv(): string {
    const list = this.getCandidates();
    const headers = [
      'No. Pendaftaran',
      'Jalur',
      'NISN',
      'NIK',
      'Nama Lengkap',
      'JK',
      'Asal Sekolah',
      'Jarak (Km)',
      'Rata-rata Rapor',
      'Prestasi',
      'Nama Orang Tua',
      'No WhatsApp',
      'Status Verifikasi',
      'Hasil Seleksi',
      'Ranking',
    ];

    const rows = list.map(c => [
      `"${c.registrationNumber}"`,
      `"${c.jalur.toUpperCase()}"`,
      `"${c.nisn}"`,
      `"${c.nik}"`,
      `"${c.fullName.replace(/"/g, '""')}"`,
      `"${c.gender}"`,
      `"${c.previousSchool.replace(/"/g, '""')}"`,
      c.distanceToSchoolKm,
      c.averageScore,
      `"${(c.achievementName || '-').replace(/"/g, '""')}"`,
      `"${c.parentName.replace(/"/g, '""')}"`,
      `"${c.parentPhone}"`,
      `"${c.verificationStatus}"`,
      `"${c.selectionResult}"`,
      c.selectionRank || '-',
    ]);

    return [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
  },

  /**
   * Cloud SQL Backend Integration:
   * Synchronizes candidate data with PostgreSQL database.
   */
  async syncWithServer(): Promise<Candidate[]> {
    try {
      const res = await fetch('/api/candidates');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const mapped: Candidate[] = data.map(item => ({
            id: String(item.id),
            registrationNumber: item.registrationNumber,
            jalur: item.jalur as any,
            fullName: item.fullName,
            gender: (item.gender === 'P' ? 'P' : 'L') as 'L' | 'P',
            nisn: item.nisn,
            nik: item.nik,
            birthPlace: item.birthPlace,
            birthDate: item.birthDate,
            religion: item.religion || 'Islam',
            previousSchool: item.previousSchool,
            address: item.address,
            rtRw: item.rt && item.rw ? `RT ${item.rt} / RW ${item.rw}` : (item.rtRw || 'RT 001 / RW 002'),
            kelurahan: item.kelurahan || '',
            kecamatan: item.kecamatan || '',
            distanceToSchoolKm: Number(item.distanceToSchoolKm) || 1.0,
            phone: item.parentPhone || '',
            parentName: item.parentName,
            parentPhone: item.parentPhone,
            parentJob: item.parentJob || '',
            averageScore: Number(item.averageScore) || 80,
            achievementName: item.achievementName || undefined,
            achievementLevel: item.achievementLevel || undefined,
            kipOrPkhNumber: item.kipOrPkhNumber || undefined,
            documents: item.documents || {},
            verificationStatus: item.verificationStatus as any,
            verificationNotes: item.verificationNotes || '',
            verifiedBy: item.verifiedBy || undefined,
            verifiedAt: item.verifiedAt ? new Date(item.verifiedAt).toISOString() : undefined,
            selectionResult: item.selectionResult as any,
            selectionRank: item.selectionRank || undefined,
            createdAt: item.createdAt ? new Date(item.createdAt).toISOString() : new Date().toISOString(),
            updatedAt: item.updatedAt ? new Date(item.updatedAt).toISOString() : new Date().toISOString(),
          }));
          this.saveCandidates(mapped);
          return mapped;
        }
      }
    } catch (e) {
      // Backend not running (e.g. static GitHub Pages) - graceful fallback to localStorage
      console.info('Client-side storage active:', e);
    }
    return this.getCandidates();
  },

  async addCandidateServer(candidate: Candidate): Promise<void> {
    try {
      await fetch('/api/candidates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          registrationNumber: candidate.registrationNumber,
          fullName: candidate.fullName,
          gender: candidate.gender,
          nisn: candidate.nisn,
          nik: candidate.nik,
          birthPlace: candidate.birthPlace,
          birthDate: candidate.birthDate,
          address: candidate.address,
          rt: candidate.rtRw || '',
          rw: '',
          kelurahan: candidate.kelurahan,
          kecamatan: candidate.kecamatan,
          distanceToSchoolKm: candidate.distanceToSchoolKm,
          jalur: candidate.jalur,
          previousSchool: candidate.previousSchool,
          parentName: candidate.parentName,
          parentPhone: candidate.parentPhone,
          parentJob: candidate.parentJob,
          averageScore: candidate.averageScore,
          achievementName: candidate.achievementName,
          achievementLevel: candidate.achievementLevel,
          kipOrPkhNumber: candidate.kipOrPkhNumber,
          documents: candidate.documents,
          verificationStatus: candidate.verificationStatus,
          verificationNotes: candidate.verificationNotes,
          selectionResult: candidate.selectionResult,
        }),
      });
    } catch (e) {
      console.warn('Could not post to server, saved locally:', e);
    }
  },

  async verifyCandidateServer(id: string, status: string, notes: string, verifiedBy: string, documents: any): Promise<void> {
    try {
      const numId = parseInt(id.replace(/\D/g, ''), 10);
      if (numId) {
        await fetch(`/api/candidates/${numId}/verify`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status, notes, verifiedBy, documents }),
        });
      }
    } catch (e) {
      console.warn('Could not update verification on server:', e);
    }
  },

  async calculateSelectionServer(): Promise<void> {
    try {
      await fetch('/api/candidates/calculate-selection', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });
    } catch (e) {
      console.warn('Could not calculate selection on server:', e);
    }
  },

  // ===== ADMIN ACCOUNTS MANAGEMENT =====
  getAdminAccounts(): AdminAccount[] {
    try {
      const stored = localStorage.getItem(ADMINS_STORAGE_KEY);
      if (!stored) {
        localStorage.setItem(ADMINS_STORAGE_KEY, JSON.stringify(INITIAL_ADMINS));
        return INITIAL_ADMINS;
      }
      return JSON.parse(stored);
    } catch (e) {
      console.error('Error reading admin accounts', e);
      return INITIAL_ADMINS;
    }
  },

  saveAdminAccounts(admins: AdminAccount[]): void {
    try {
      localStorage.setItem(ADMINS_STORAGE_KEY, JSON.stringify(admins));
      window.dispatchEvent(new Event('spmb-admins-updated'));
    } catch (e) {
      console.error('Error saving admin accounts', e);
    }
  },

  getActiveAdmin(): AdminAccount | null {
    try {
      const stored = localStorage.getItem(ACTIVE_ADMIN_KEY);
      if (!stored) return null;
      return JSON.parse(stored);
    } catch (e) {
      return null;
    }
  },

  setActiveAdmin(admin: AdminAccount | null): void {
    try {
      if (admin) {
        localStorage.setItem(ACTIVE_ADMIN_KEY, JSON.stringify(admin));
      } else {
        localStorage.removeItem(ACTIVE_ADMIN_KEY);
      }
      window.dispatchEvent(new Event('spmb-admin-auth-changed'));
    } catch (e) {
      console.error('Error setting active admin', e);
    }
  },

  async authenticateAdmin(emailOrUser: string, password: string): Promise<AdminAccount | null> {
    const cleanEmail = emailOrUser.trim().toLowerCase();

    // 1. Attempt Cloud SQL backend authentication
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, password }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.admin) {
          const authObj: AdminAccount = {
            id: String(data.admin.id),
            name: data.admin.name,
            email: data.admin.email,
            role: data.admin.role,
            roleLabel: data.admin.roleLabel,
            assignedJalur: data.admin.assignedJalur,
            active: data.admin.active !== false,
            lastLogin: data.admin.lastLogin || new Date().toISOString(),
          };
          this.setActiveAdmin(authObj);
          return authObj;
        }
      }
    } catch (e) {
      console.info('Server admin auth unavailable, testing local credentials:', e);
    }

    // 2. Client-side fallback authentication (for offline or static deployments)
    const list = this.getAdminAccounts();
    const found = list.find(a => 
      a.active &&
      (a.email.toLowerCase() === cleanEmail || a.name.toLowerCase() === cleanEmail) &&
      a.password === password
    );

    if (found) {
      const updated: AdminAccount = {
        ...found,
        lastLogin: new Date().toISOString(),
      };
      const nextList = list.map(a => a.id === found.id ? updated : a);
      this.saveAdminAccounts(nextList);
      this.setActiveAdmin(updated);
      return updated;
    }

    return null;
  },

  async addAdminAccount(account: Omit<AdminAccount, 'id'>): Promise<AdminAccount> {
    const newId = `adm-${Date.now().toString().slice(-4)}`;
    const newAdmin: AdminAccount = {
      ...account,
      id: newId,
      active: true,
      createdAt: new Date().toISOString(),
    };

    // Save locally
    const current = this.getAdminAccounts();
    this.saveAdminAccounts([newAdmin, ...current]);

    // Sync to Cloud SQL server if available
    try {
      await fetch('/api/admin/accounts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(account),
      });
    } catch (e) {
      console.warn('Could not post admin to server:', e);
    }

    return newAdmin;
  },

  async updateAdminAccount(id: string, updates: Partial<AdminAccount>): Promise<void> {
    const current = this.getAdminAccounts();
    const updated = current.map(a => a.id === id ? { ...a, ...updates } : a);
    this.saveAdminAccounts(updated);

    // If updating currently logged in admin, update active session
    const active = this.getActiveAdmin();
    if (active && active.id === id) {
      this.setActiveAdmin({ ...active, ...updates });
    }

    // Sync to server if numeric id
    const numId = parseInt(id.replace(/\D/g, ''), 10);
    if (numId) {
      try {
        await fetch(`/api/admin/accounts/${numId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(updates),
        });
      } catch (e) {
        console.warn('Could not update admin on server:', e);
      }
    }
  },

  async deleteAdminAccount(id: string): Promise<void> {
    const current = this.getAdminAccounts();
    const updated = current.filter(a => a.id !== id);
    this.saveAdminAccounts(updated);

    const numId = parseInt(id.replace(/\D/g, ''), 10);
    if (numId) {
      try {
        await fetch(`/api/admin/accounts/${numId}`, { method: 'DELETE' });
      } catch (e) {
        console.warn('Could not delete admin on server:', e);
      }
    }
  },

  async syncAdminsWithServer(): Promise<AdminAccount[]> {
    try {
      const res = await fetch('/api/admin/accounts');
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data) && data.length > 0) {
          const mapped: AdminAccount[] = data.map((item: any) => ({
            id: String(item.id),
            name: item.name,
            email: item.email,
            role: item.role,
            roleLabel: item.roleLabel,
            assignedJalur: item.assignedJalur || 'semua',
            active: item.active === 1 || item.active === true,
            lastLogin: item.lastLogin ? new Date(item.lastLogin).toISOString() : undefined,
            createdAt: item.createdAt ? new Date(item.createdAt).toISOString() : undefined,
          }));
          this.saveAdminAccounts(mapped);
          return mapped;
        }
      }
    } catch (e) {
      console.info('Using local admin cache:', e);
    }
    return this.getAdminAccounts();
  }
};
