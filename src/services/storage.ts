import { Candidate, HasilSeleksi, StatusVerifikasi } from '../types/spmb';
import { INITIAL_CANDIDATES, QUOTA_LIST } from '../data/initialData';

const STORAGE_KEY = 'spmb_smpn2_candidates_v1';

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
  }
};
