import React, { useState } from 'react';
import { 
  X, 
  Github, 
  Check, 
  Copy, 
  Terminal, 
  Sparkles, 
  ShieldCheck, 
  Layers,
  AlertTriangle,
  HelpCircle,
  Zap
} from 'lucide-react';

interface GitHubDeployModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubDeployModal: React.FC<GitHubDeployModalProps> = ({ isOpen, onClose }) => {
  const [copiedWorkflow, setCopiedWorkflow] = useState(false);
  const [copiedGitCommands, setCopiedGitCommands] = useState(false);
  const [copiedNpmDeploy, setCopiedNpmDeploy] = useState(false);

  if (!isOpen) return null;

  const workflowYml = `name: Deploy SPMB SMPN 2 Teluk Bayur to GitHub Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  deploy:
    environment:
      name: github-pages
      url: \${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Repository
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: 'npm'

      - name: Install Dependencies
        run: npm install

      - name: Build Application
        run: npm run build

      - name: Setup Pages
        uses: actions/configure-pages@v5

      - name: Upload Artifact
        uses: actions/upload-pages-artifact@v3
        with:
          path: './dist'

      - name: Deploy to GitHub Pages
        id: deployment
        uses: actions/deploy-pages@v4
`;

  const gitCommands = `# 1. Inisialisasi Git dan Commit Kode
git init
git add .
git commit -m "feat: SPMB Online SMP Negeri 2 Teluk Bayur"

# 2. Hubungkan ke Repository GitHub Anda
git branch -M main
git remote add origin https://github.com/<username-anda>/spmb-smpn2-telukbayur.git

# 3. Push ke GitHub
git push -u origin main`;

  const copyToClipboard = (text: string, type: 'workflow' | 'git' | 'npm') => {
    navigator.clipboard.writeText(text);
    if (type === 'workflow') {
      setCopiedWorkflow(true);
      setTimeout(() => setCopiedWorkflow(false), 2000);
    } else if (type === 'git') {
      setCopiedGitCommands(true);
      setTimeout(() => setCopiedGitCommands(false), 2000);
    } else {
      setCopiedNpmDeploy(true);
      setTimeout(() => setCopiedNpmDeploy(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200 p-6 sm:p-8 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold shadow-sm">
              <Github className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Solusi & Panduan Deploy ke GitHub Pages
              </h3>
              <p className="text-xs text-slate-500">
                Mengatasi halaman kosong (blank) dan mempublikasikan SPMB SMPN 2 Teluk Bayur
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* TROUBLESHOOTING BOX - Mengapa website tidak tampil / blank? */}
        <div className="p-5 rounded-2xl bg-rose-50 border border-rose-200 space-y-3">
          <div className="flex items-center gap-2 text-rose-900 font-bold text-sm">
            <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0" />
            <span>Penyebab Utama Website Tidak Tampil / Putih Kosong di GitHub</span>
          </div>

          <div className="space-y-2 text-xs text-rose-950 leading-relaxed">
            <div className="p-3 bg-white/80 rounded-xl border border-rose-100">
              <strong className="text-rose-900 block font-semibold mb-1">
                Penyebab 1: Pengaturan Source di GitHub Pages masih "Deploy from a branch: main / (root)"
              </strong>
              <p className="text-slate-700">
                Jika Anda memilih branch <code>main</code> folder <code>/ (root)</code>, GitHub Pages mencoba menjalankan kode mentah React TypeScript (<code>main.tsx</code>) yang <strong>tidak bisa dieksekusi langsung oleh browser</strong> tanpa di-build terlebih dahulu.
              </p>
              <p className="text-emerald-700 font-bold mt-1">
                Solusi: Buka menu <strong>Settings &gt; Pages</strong> di repository GitHub Anda, lalu ubah <strong>Source</strong> menjadi <span className="bg-emerald-100 text-emerald-900 px-1.5 py-0.5 rounded">GitHub Actions</span>.
              </p>
            </div>

            <div className="p-3 bg-white/80 rounded-xl border border-rose-100">
              <strong className="text-rose-900 block font-semibold mb-1">
                Penyebab 2: URL dibuka tanpa garis miring di ujung
              </strong>
              <p className="text-slate-700">
                Membuka <code>https://username.github.io/repo</code> tanpa tanda <code>/</code> di akhir menyebabkan file asset gagal dimuat (404). Kami sudah menyertakan script auto-redirect di <code>index.html</code> dan berkas <code>.nojekyll</code> untuk memperbaikinya secara otomatis.
              </p>
            </div>
          </div>
        </div>

        {/* DUA METODE DEPLOY PILIHAN */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Zap className="w-4 h-4 text-amber-500" />
            <span>Pilih Salah Satu dari 2 Metode Deploy Berikut:</span>
          </h4>

          {/* METODE 1: GITHUB ACTIONS (REKOMENDASI) */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[11px] font-mono">1</span>
                Metode A (Rekomendasi): GitHub Actions Otomatis
              </span>
              <span className="text-[11px] bg-blue-100 text-blue-800 font-semibold px-2 py-0.5 rounded">
                Otomatis Tiap Git Push
              </span>
            </div>

            <ol className="list-decimal list-inside text-xs text-slate-700 space-y-1.5 pl-1 leading-relaxed">
              <li>Pastikan file <code>.github/workflows/deploy.yml</code> sudah ter-push ke repository Anda.</li>
              <li>Buka repository Anda di GitHub di browser.</li>
              <li>Klik tab <strong>Settings</strong> &gt; menu samping <strong>Pages</strong>.</li>
              <li>Pada bagian <strong>Build and deployment &gt; Source</strong>, klik dropdown dan pilih <strong>GitHub Actions</strong>.</li>
              <li>Tunggu 1-2 menit, GitHub Actions akan otomatis mem-build folder <code>dist/</code> dan website Anda langsung online!</li>
            </ol>
          </div>

          {/* METODE 2: NPM RUN DEPLOY (ALTERNATIF MUDAH) */}
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="font-bold text-xs sm:text-sm text-slate-900 flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[11px] font-mono">2</span>
                Metode B (Alternatif Mandiri): Perintah `npm run deploy`
              </span>
              <span className="text-[11px] bg-emerald-100 text-emerald-800 font-semibold px-2 py-0.5 rounded">
                Branch gh-pages
              </span>
            </div>

            <p className="text-xs text-slate-600">
              Paket <code>gh-pages</code> telah kami pasang ke proyek. Anda cukup menjalankan satu perintah di terminal:
            </p>

            <div className="relative bg-slate-950 text-slate-100 rounded-xl p-3 font-mono text-xs">
              <button
                onClick={() => copyToClipboard('npm run deploy', 'npm')}
                className="absolute top-2 right-2 px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
              >
                {copiedNpmDeploy ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedNpmDeploy ? 'Tersalin!' : 'Salin'}</span>
              </button>
              <code>npm run deploy</code>
            </div>

            <p className="text-xs text-slate-600">
              Lalu di <strong>Settings &gt; Pages</strong>, pilih <strong>Branch: gh-pages</strong> dan <strong>Folder: / (root)</strong>.
            </p>
          </div>
        </div>

        {/* Perintah Git Lengkap */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center gap-2">
              <Terminal className="w-3.5 h-3.5 text-slate-500" />
              <span>Perintah Git Push Pertama Kali</span>
            </h4>
            <button
              onClick={() => copyToClipboard(gitCommands, 'git')}
              className="text-xs font-semibold px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
            >
              {copiedGitCommands ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedGitCommands ? 'Tersalin!' : 'Salin Perintah'}</span>
            </button>
          </div>

          <div className="bg-slate-950 text-slate-100 rounded-2xl p-4 font-mono text-xs overflow-x-auto">
            <pre>{gitCommands}</pre>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end pt-2 border-t border-slate-200">
          <button
            onClick={onClose}
            className="px-6 py-2.5 rounded-xl font-bold text-xs sm:text-sm text-white bg-slate-900 hover:bg-slate-800 transition-colors cursor-pointer"
          >
            Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
};
