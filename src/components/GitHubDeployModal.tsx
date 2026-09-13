import React, { useState } from 'react';
import { 
  X, 
  Github, 
  Check, 
  Copy, 
  Download, 
  Terminal, 
  ExternalLink, 
  Sparkles, 
  ShieldCheck, 
  Layers
} from 'lucide-react';

interface GitHubDeployModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const GitHubDeployModal: React.FC<GitHubDeployModalProps> = ({ isOpen, onClose }) => {
  const [copiedWorkflow, setCopiedWorkflow] = useState(false);
  const [copiedGitCommands, setCopiedGitCommands] = useState(false);

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
        run: npm ci

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
git commit -m "feat: Aplikasi SPMB Online SMP Negeri 2 Teluk Bayur"

# 2. Hubungkan ke Repository GitHub Anda
git branch -M main
git remote add origin https://github.com/<username-anda>/spmb-smpn2-telukbayur.git

# 3. Push ke GitHub
git push -u origin main`;

  const copyToClipboard = (text: string, type: 'workflow' | 'git') => {
    navigator.clipboard.writeText(text);
    if (type === 'workflow') {
      setCopiedWorkflow(true);
      setTimeout(() => setCopiedWorkflow(false), 2000);
    } else {
      setCopiedGitCommands(true);
      setTimeout(() => setCopiedGitCommands(false), 2000);
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
                Panduan Deploy ke GitHub & GitHub Pages
              </h3>
              <p className="text-xs text-slate-500">
                Aplikasi SPMB SMPN 2 Teluk Bayur 100% Client-Side SPA yang siap di-hosting gratis di GitHub Pages
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

        {/* Highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
          <div className="p-3.5 rounded-2xl bg-blue-50 border border-blue-200 space-y-1">
            <span className="font-bold text-blue-900 flex items-center gap-1.5">
              <Check className="w-4 h-4 text-blue-600" />
              Base Path Relatif
            </span>
            <p className="text-slate-600 text-[11px]">
              Telah disetting <code>base: './'</code> di <code>vite.config.ts</code> sehingga berjalan lancar di subpath repo GitHub.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 space-y-1">
            <span className="font-bold text-emerald-900 flex items-center gap-1.5">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Tanpa Server Khusus
            </span>
            <p className="text-slate-600 text-[11px]">
              Tidak membutuhkan database berbayar; menggunakan penyimpanan lokal reaktif browser dan ekspor CSV.
            </p>
          </div>

          <div className="p-3.5 rounded-2xl bg-purple-50 border border-purple-200 space-y-1">
            <span className="font-bold text-purple-900 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-purple-600" />
              Gratis & HTTPS
            </span>
            <p className="text-slate-600 text-[11px]">
              Dapatkan domain gratis <code>username.github.io/repo</code> dengan sertifikat SSL resmi otomatis.
            </p>
          </div>
        </div>

        {/* Step-by-Step Instructions */}
        <div className="space-y-4">
          <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-blue-600" />
            <span>Langkah 1: Push Proyek ke Repository GitHub</span>
          </h4>

          <div className="relative bg-slate-950 text-slate-100 rounded-2xl p-4 font-mono text-xs overflow-x-auto">
            <button
              onClick={() => copyToClipboard(gitCommands, 'git')}
              className="absolute top-3 right-3 px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
            >
              {copiedGitCommands ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedGitCommands ? 'Tersalin!' : 'Salin Perintah'}</span>
            </button>
            <pre className="pr-24">{gitCommands}</pre>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-2">
              <Layers className="w-4 h-4 text-blue-600" />
              <span>Langkah 2: Otomasi Deploy via GitHub Actions (.github/workflows/deploy.yml)</span>
            </h4>
            <button
              onClick={() => copyToClipboard(workflowYml, 'workflow')}
              className="text-xs font-semibold px-3 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg flex items-center gap-1 cursor-pointer transition-colors"
            >
              {copiedWorkflow ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedWorkflow ? 'Tersalin!' : 'Salin Workflow YAML'}</span>
            </button>
          </div>

          <div className="bg-slate-900 text-slate-100 rounded-2xl p-4 font-mono text-xs max-h-48 overflow-y-auto">
            <pre>{workflowYml}</pre>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 space-y-2 text-xs text-amber-950">
          <strong className="block font-bold">Langkah 3: Aktifkan GitHub Pages di Pengaturan Repository:</strong>
          <ol className="list-decimal list-inside space-y-1 text-slate-700">
            <li>Buka repository Anda di GitHub.</li>
            <li>Klik tab <strong>Settings</strong> &gt; menu samping <strong>Pages</strong>.</li>
            <li>Pada bagian <strong>Build and deployment &gt; Source</strong>, pilih <strong>GitHub Actions</strong>.</li>
            <li>Selesai! Setiap kali Anda melakukan <code>git push</code>, website SPMB akan otomatis ter-build dan tayang secara langsung.</li>
          </ol>
        </div>

        {/* Footer Buttons */}
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
