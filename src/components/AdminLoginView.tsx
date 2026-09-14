import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  Key, 
  LogIn, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  UserCheck,
  Building2,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { SCHOOL_PROFILE } from '../data/initialData';

interface AdminLoginViewProps {
  onLoginSuccess?: () => void;
}

export const AdminLoginView: React.FC<AdminLoginViewProps> = ({ onLoginSuccess }) => {
  const { adminLogin, signInWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const presetAccounts = [
    {
      role: 'Ketua Panitia PPDB',
      name: 'Rizal Fahmi, S.Pd',
      email: 'admin@smpn2telukbayur.sch.id',
      pass: 'admin123',
      color: 'border-blue-200 hover:border-blue-400 bg-blue-50/50',
    },
    {
      role: 'Admin Sistem IT',
      name: 'Hady Gruty',
      email: 'hadygruty2@gmail.com',
      pass: 'admin123',
      color: 'border-purple-200 hover:border-purple-400 bg-purple-50/50',
    },
    {
      role: 'Verifikator Zonasi',
      name: 'Siti Rahmawati, S.Pd',
      email: 'verifikator1@smpn2telukbayur.sch.id',
      pass: 'panitia2025',
      color: 'border-emerald-200 hover:border-emerald-400 bg-emerald-50/50',
    },
    {
      role: 'Verifikator Prestasi',
      name: 'Budi Santoso, M.Pd',
      email: 'verifikator2@smpn2telukbayur.sch.id',
      pass: 'panitia2025',
      color: 'border-amber-200 hover:border-amber-400 bg-amber-50/50',
    },
  ];

  const handleSelectPreset = (presetEmail: string, presetPass: string) => {
    setEmail(presetEmail);
    setPassword(presetPass);
    setErrorMessage('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');
    setIsLoading(true);

    try {
      const res = await adminLogin(email, password);
      if (!res) {
        setErrorMessage('Email atau password panitia tidak sesuai.');
      } else {
        onLoginSuccess?.();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Terjadi kesalahan saat masuk.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setErrorMessage('');
    setIsLoading(true);
    try {
      await signInWithGoogle();
      onLoginSuccess?.();
    } catch (err: any) {
      setErrorMessage('Login dengan Google dibatalkan atau terjadi kesalahan.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-8 px-4">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-700 via-indigo-700 to-blue-800 p-6 text-white text-center relative">
          <div className="w-14 h-14 mx-auto mb-3 bg-white/10 backdrop-blur-xs rounded-2xl flex items-center justify-center border border-white/20 shadow-inner">
            <ShieldCheck className="w-8 h-8 text-white" />
          </div>
          <h2 className="text-xl font-bold tracking-tight">Portal Panitia SPMB</h2>
          <p className="text-xs text-blue-100 mt-1 max-w-md mx-auto">
            {SCHOOL_PROFILE.name} — Tahun Ajaran {SCHOOL_PROFILE.academicYear}
          </p>
          <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 rounded-full text-[11px] font-medium backdrop-blur-xs">
            <Lock className="w-3 h-3 text-amber-300" />
            <span>Akses Khusus Verifikasi Berkas & Manajemen Panitia</span>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {errorMessage && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 rounded-xl flex items-start gap-2.5 text-xs text-rose-700">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Quick Preset Accounts */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Pilih Akun Panitia (Klik Cepat):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {presetAccounts.map((item, idx) => (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectPreset(item.email, item.pass)}
                  className={`text-left p-2.5 rounded-xl border transition-all text-xs cursor-pointer ${item.color} ${
                    email === item.email ? 'ring-2 ring-blue-500 border-blue-500' : ''
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-slate-800">{item.role}</span>
                    {email === item.email && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-blue-600" />
                    )}
                  </div>
                  <p className="text-slate-600 text-[11px] mt-0.5 font-medium truncate">{item.name}</p>
                  <p className="text-slate-400 text-[10px] font-mono truncate">{item.email}</p>
                </button>
              ))}
            </div>
          </div>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
              Atau Masukkan Akun
            </span>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Email / Username Panitia
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="admin@smpn2telukbayur.sch.id"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-3 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Password
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="Password akun"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2 text-sm border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-hidden"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-lg shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <LogIn className="w-4 h-4" />
              <span>{isLoading ? 'Memverifikasi...' : 'Masuk sebagai Panitia'}</span>
            </button>
          </form>

          {/* Google Sign-in Alternative */}
          <div className="pt-2 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-500 mb-3">
              Atau masuk menggunakan Akun Google Panitia terdaftar:
            </p>
            <button
              type="button"
              onClick={handleGoogleLogin}
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 py-2 px-4 border border-slate-300 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-lg shadow-2xs transition-colors cursor-pointer"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>Masuk via Google (Auto-Admin)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
