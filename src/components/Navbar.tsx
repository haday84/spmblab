import React, { useState } from 'react';
import { 
  GraduationCap, 
  FileText, 
  Search, 
  ShieldCheck, 
  Award, 
  Menu, 
  X, 
  Github, 
  PhoneCall, 
  Home,
  LogIn,
  LogOut,
  User as UserIcon,
  Shield
} from 'lucide-react';
import { SCHOOL_PROFILE } from '../data/initialData';
import { useAuth } from '../context/AuthContext';

interface NavbarProps {
  activeTab: 'home' | 'register' | 'check-status' | 'admin-verify' | 'announcement';
  setActiveTab: (tab: 'home' | 'register' | 'check-status' | 'admin-verify' | 'announcement') => void;
  onOpenDeployModal: () => void;
}

interface NavItem {
  id: 'home' | 'register' | 'check-status' | 'admin-verify' | 'announcement';
  label: string;
  icon: any;
  badge?: string;
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, onOpenDeployModal }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, signInWithGoogle, signOutUser, adminUser, adminLogout } = useAuth();

  const navItems: NavItem[] = [
    { id: 'home', label: 'Beranda', icon: Home },
    { id: 'register', label: 'Pendaftaran Online', icon: FileText },
    { id: 'check-status', label: 'Cek Status & Kartu', icon: Search },
    { 
      id: 'admin-verify', 
      label: adminUser ? `Panitia: ${adminUser.name.split(' ')[0]}` : 'Portal Panitia', 
      icon: ShieldCheck,
      badge: adminUser ? 'Aktif' : undefined
    },
    { id: 'announcement', label: 'Pengumuman Seleksi', icon: Award },
  ];

  const handleNavClick = (id: typeof activeTab) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 no-print transition-all">
      {/* Top Banner Contact & Info */}
      <div className="bg-gradient-to-r from-blue-900 via-blue-800 to-indigo-900 text-white text-xs py-1.5 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-1">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-medium">SPMB Online T.A {SCHOOL_PROFILE.academicYear} Telah Dibuka</span>
            <span className="hidden md:inline text-blue-300">|</span>
            <span className="hidden md:inline text-blue-200">Kec. Teluk Bayur, Kab. Berau, Kalimantan Timur</span>
          </div>
          <div className="flex items-center gap-3 text-blue-200">
            <span className="flex items-center gap-1">
              <PhoneCall className="w-3 h-3 text-emerald-400" />
              <span>Bantuan: {SCHOOL_PROFILE.phone}</span>
            </span>
            <span>•</span>
            <button
              onClick={onOpenDeployModal}
              className="hover:text-white flex items-center gap-1 font-medium text-amber-300 hover:underline cursor-pointer"
              title="Panduan Deploy ke GitHub"
            >
              <Github className="w-3 h-3" />
              <span>Deploy ke GitHub</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18">
          {/* Logo & School Identity */}
          <div 
            onClick={() => handleNavClick('home')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-slate-900 tracking-tight leading-tight">
                  SPMB SMPN 2
                </span>
                <span className="bg-blue-100 text-blue-800 text-[10px] font-semibold px-2 py-0.5 rounded-full border border-blue-200">
                  Teluk Bayur
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Sistem Penerimaan Murid Baru Online Kab. Berau
              </p>
            </div>
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors cursor-pointer relative ${
                    isActive
                      ? 'bg-blue-600 text-white shadow-sm shadow-blue-600/30'
                      : 'text-slate-600 hover:text-blue-700 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action: Auth, GitHub Deploy Guide & Registration CTA */}
          <div className="hidden sm:flex items-center gap-2">
            {adminUser && (
              <button
                onClick={() => handleNavClick('admin-verify')}
                className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 border border-blue-200 text-blue-800 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
                title={`Login sebagai: ${adminUser.name} (${adminUser.roleLabel || adminUser.role})`}
              >
                <Shield className="w-3.5 h-3.5 text-blue-600" />
                <span className="max-w-[100px] truncate">{adminUser.name.split(' ')[0]}</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              </button>
            )}

            {user ? (
              <div className="flex items-center gap-2 bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 text-xs text-slate-700">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt={user.displayName || 'User'}
                    className="w-5 h-5 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <UserIcon className="w-4 h-4 text-blue-600" />
                )}
                <span className="font-medium max-w-[120px] truncate">{user.displayName || user.email}</span>
                <button
                  onClick={() => signOutUser()}
                  title="Keluar"
                  className="text-slate-400 hover:text-rose-600 p-0.5 rounded transition-colors cursor-pointer"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => signInWithGoogle()}
                className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-300 rounded-lg transition-colors cursor-pointer shadow-xs"
              >
                <LogIn className="w-3.5 h-3.5 text-blue-600" />
                <span>Masuk Akun</span>
              </button>
            )}

            <button
              onClick={onOpenDeployModal}
              className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 border border-slate-300 rounded-lg transition-colors cursor-pointer"
            >
              <Github className="w-3.5 h-3.5 text-slate-800" />
              <span>Deploy GitHub</span>
            </button>
            <button
              onClick={() => handleNavClick('register')}
              className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 rounded-lg shadow-sm shadow-blue-600/30 transition-all hover:scale-102 cursor-pointer"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Daftar Sekarang</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex lg:hidden items-center gap-2">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white px-4 pt-3 pb-5 space-y-1 shadow-lg">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span>{item.label}</span>
              </button>
            );
          })}
          <div className="pt-2 border-t border-slate-100 flex flex-col gap-2">
            {user ? (
              <div className="flex items-center justify-between px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-xs">
                <div className="flex items-center gap-2">
                  <UserIcon className="w-4 h-4 text-blue-600" />
                  <span className="font-semibold text-slate-800">{user.displayName || user.email}</span>
                </div>
                <button
                  onClick={() => signOutUser()}
                  className="text-rose-600 hover:underline text-xs font-semibold"
                >
                  Keluar
                </button>
              </div>
            ) : (
              <button
                onClick={() => {
                  signInWithGoogle();
                  setMobileMenuOpen(false);
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 rounded-lg"
              >
                <LogIn className="w-4 h-4" />
                <span>Masuk Akun Google</span>
              </button>
            )}
            <button
              onClick={() => {
                onOpenDeployModal();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 text-xs font-semibold text-slate-700 bg-slate-100 rounded-lg"
            >
              <Github className="w-4 h-4" />
              <span>Panduan Deploy GitHub</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
