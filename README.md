# Sistem Penerimaan Murid Baru (SPMB) Online
## SMP Negeri 2 Teluk Bayur - Kabupaten Berau, Kalimantan Timur

Aplikasi web modern untuk Sistem Penerimaan Murid Baru (SPMB / PPDB) SMP Negeri 2 Teluk Bayur Tahun Ajaran 2025/2026. Aplikasi ini dilengkapi dengan fitur pendaftaran online mandiri, verifikasi berkas dokumen oleh panitia, serta pengumuman hasil seleksi transparan dan cetak surat keterangan kelulusan resmi.

---

### Fitur Utama

1. **Pendaftaran Online (Calon Siswa & Orang Tua)**:
   - Formulir multi-step terstruktur (Data Jalur Masuk, Identitas Kependudukan NISN & NIK, Domisili & Jarak Zonasi, Data Orang Tua/Wali & Nilai Rapor/Prestasi/KIP).
   - Unggah Dokumen Berkas Asli (Pas Foto 3x4, Kartu Keluarga, Akta Kelahiran, SKL SD/MI, serta Sertifikat Prestasi/KIP/SK Mutasi).
   - Pencetakan **Kartu Tanda Peserta SPMB** resmi dilengkapi foto, barcode/QR code, rincian data siswa, dan tanda tangan panitia.

2. **Verifikasi Dokumen (Portal Panitia PPDB)**:
   - Dashboard statistik real-time (Total Pendaftar, Berkas Terverifikasi, Menunggu Antrean, Butuh Perbaikan, Lulus Seleksi).
   - Filter pendaftar berdasarkan Jalur (Zonasi, Prestasi, Afirmasi, Mutasi) dan Status Verifikasi.
   - Modal Review Dokumen: Panitia dapat membuka dan mengecek tiap berkas yang diunggah, menandai status keabsahan berkas (Valid / Perlu Perbaikan), menulis catatan perbaikan kepada siswa, dan menetapkan status verifikasi.
   - Kalkulasi Hasil Seleksi Otomatis: Menghitung peringkat calon siswa terverifikasi berdasarkan kuota resmi dan kriteria jalur.
   - Ekspor Data Pendaftar ke format file CSV / Excel untuk arsip dinas pendidikan.

3. **Pengumuman Hasil Seleksi**:
   - Pencarian mandiri kelulusan menggunakan Nomor Pendaftaran atau NISN.
   - Penerbitan dan pencetakan **Surat Keterangan Hasil Seleksi (SKL PPDB)** resmi dengan kop sekolah dan tanda tangan Kepala Sekolah.
   - Panduan jadwal daftar ulang fisik dan daftar berkas yang wajib dibawa ke sekolah.
   - Tabel Rangkuman Hasil Seleksi Publik yang transparan per jalur seleksi.

4. **Tracking & Perbaikan Dokumen**:
   - Calon siswa dapat mengecek progres verifikasi berkas secara mandiri.
   - Jika berkas dinyatakan "Perlu Perbaikan", siswa dapat mengunggah kembali berkas perbaikan secara langsung dari menu Cek Status.

---

### Cara Menjalankan Secara Lokal

```bash
# 1. Install dependensi
npm install

# 2. Jalankan server pengembangan
npm run dev

# 3. Akses di browser
# Buka http://localhost:3000
```

---

### Cara Deploy ke GitHub & GitHub Pages

Aplikasi ini dibangun menggunakan Vite + React sebagai Client-Side SPA murni dengan konfigurasi base path relatif (`base: './'`), sehingga sangat mudah dan gratis di-hosting di GitHub Pages.

1. **Buat Repository di GitHub**:
   - Buat repository baru di [GitHub](https://github.com/new), misalnya `spmb-smpn2-telukbayur`.

2. **Push Kode Proyek**:
   ```bash
   git init
   git add .
   git commit -m "feat: Aplikasi SPMB Online SMP Negeri 2 Teluk Bayur"
   git branch -M main
   git remote add origin https://github.com/<username-anda>/spmb-smpn2-telukbayur.git
   git push -u origin main
   ```

3. **Aktifkan GitHub Pages**:
   - Buka halaman repository di GitHub.
   - Masuk ke menu **Settings** > **Pages**.
   - Pada bagian **Build and deployment > Source**, pilih **GitHub Actions**.
   - Workflow `.github/workflows/deploy.yml` yang disertakan di repositori ini akan otomatis mem-build dan mempublikasikan website SPMB secara live!
