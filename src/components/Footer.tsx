import React from 'react';
import { GraduationCap, MapPin, Phone, Mail, Globe, Heart, Github } from 'lucide-react';
import { SCHOOL_PROFILE } from '../data/initialData';

interface FooterProps {
  onNavigate: (tab: 'home' | 'register' | 'check-status' | 'admin-verify' | 'announcement') => void;
  onOpenDeploy: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenDeploy }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-12 pb-8 border-t border-slate-800 no-print">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: School Identity */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-sm">
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-white text-base leading-tight">
                  {SCHOOL_PROFILE.name}
                </h3>
                <p className="text-[11px] text-blue-400">
                  Kab. Berau, Kalimantan Timur
                </p>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Sistem Penerimaan Murid Baru (SPMB) Online berbasis transparansi, keadilan, dan akuntabilitas bagi calon siswa berprestasi dan berkarakter.
            </p>
            <div className="inline-block px-2.5 py-1 rounded bg-blue-900/50 border border-blue-700/50 text-[11px] text-blue-300 font-semibold">
              NPSN: {SCHOOL_PROFILE.npsn} • Terakreditasi A
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Menu Utama SPMB
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button
                  onClick={() => onNavigate('home')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Beranda & Informasi Alur
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('register')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Pendaftaran Online Mandiri
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('check-status')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Cek Status & Cetak Kartu Peserta
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('admin-verify')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Portal Verifikasi Panitia PPDB
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('announcement')}
                  className="hover:text-white transition-colors cursor-pointer"
                >
                  Pengumuman Hasil Seleksi
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Jalur PPDB */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Jalur Pendaftaran
            </h4>
            <ul className="space-y-1.5 text-xs text-slate-400">
              <li>• Jalur Zonasi (Kuota 50%)</li>
              <li>• Jalur Prestasi Akademik & Lomba (30%)</li>
              <li>• Jalur Afirmasi & KIP / PKH (15%)</li>
              <li>• Jalur Perpindahan Tugas Orang Tua (5%)</li>
            </ul>
            <div className="pt-2">
              <button
                onClick={onOpenDeploy}
                className="flex items-center gap-1.5 text-xs text-amber-400 hover:text-amber-300 cursor-pointer font-medium"
              >
                <Github className="w-3.5 h-3.5" />
                <span>Panduan Deploy GitHub Pages</span>
              </button>
            </div>
          </div>

          {/* Col 4: Contact & Secretariat */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider">
              Sekretariat SPMB
            </h4>
            <div className="space-y-2 text-xs text-slate-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <span>{SCHOOL_PROFILE.address}, Kec. {SCHOOL_PROFILE.kecamatan}, Kab. Berau, Kaltim ({SCHOOL_PROFILE.postalCode})</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-400 shrink-0" />
                <span>{SCHOOL_PROFILE.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <span>{SCHOOL_PROFILE.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <Globe className="w-4 h-4 text-indigo-400 shrink-0" />
                <span>{SCHOOL_PROFILE.website}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom copyright */}
        <div className="pt-8 border-t border-slate-800 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2025 {SCHOOL_PROFILE.name}. Hak Cipta Dilindungi Undang-Undang.</p>
          <p className="flex items-center gap-1">
            <span>Dikelola oleh Panitia SPMB SMPN 2 Teluk Bayur & Dinas Pendidikan Kab. Berau</span>
          </p>
        </div>
      </div>
    </footer>
  );
};
