# ⚡ Neobrutalist Dynamic Developer Portfolio

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Supabase](https://img.shields.io/badge/Supabase-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)](https://supabase.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/Zustand-orange?style=for-the-badge)](https://github.com/pmndrs/zustand)

Sebuah portfolio digital tingkat lanjut (advanced developer portfolio) dengan desain estetika **Neobrutalisme** berani, kontras tinggi, dan berkarakter kuat. Website ini terintegrasi penuh secara dinamis dengan **Supabase Backend** & **Supabase Storage**, dilengkapi dengan sistem pemutar musik interaktif yang mensimulasikan tempo nada menjadi partikel not musik yang jatuh secara dinamis di layar, serta memiliki **Admin Dashboard** mandiri yang aman dan berfitur lengkap.

---

## ✨ Fitur Utama

### 🎨 1. Estetika Neobrutalisme Premium
*   Desain visual yang berani dengan border hitam tebal (`border-4 border-black`), bayangan keras (`shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]`), palet warna neon berenergi tinggi, dan interaksi melayang (hover) yang responsif dan hidup.
*   **Custom Neobrutalist Toast Notifications**: Modifikasi penuh pustaka `react-toastify` dengan kotak persegi tajam, garis tepi tebal, serta progress bar hitam tebal yang selaras dengan seluruh gaya visual website.
*   **Custom Neobrutalist Confirmation Modal**: Popup konfirmasi interaktif dengan status loading (`Menghapus...` + spinner berputar) yang memanjakan mata sebelum aksi penghapusan dilakukan.

### 🎵 2. Music Engine Interaktif & Particle Effect
*   Pemutar musik mengambang (*floating audio player*) yang mengalirkan lagu langsung dari **Supabase Storage**.
*   **Dynamic Particle System**: Efek partikel not-not musik yang berguguran di latar belakang layar saat musik diputar. Kecepatan jatuh partikel beradaptasi secara otomatis mengikuti nilai tempo musik (`tempo_speed`) yang disimpan di database!

### 🔒 3. Admin Dashboard & Supabase Integration (Full CRUD)
*   **Akses Terproteksi (Login Admin)**: Sistem login aman yang sinkron langsung dengan Supabase Auth.
*   **Kelola Profil & Tentang Saya**: Form lengkap untuk mengubah nama, judul, deskripsi, lokasi, email, dan langsung **mengunggah foto profil baru ke Supabase Storage**.
*   **Kelola Proyek & Sertifikat**: 
    *   Unggah gambar thumbnail utama proyek dan berkas sertifikat secara langsung ke Supabase Storage (bukan base64).
    *   Fitur unggah banyak foto (*Multiple Image Upload*) asinkronus untuk galeri detail proyek.
    *   Pengaturan penandaan proyek utama (*Highlight Project*) dalam carousel slider Swiper.
*   **Kotak Masuk Pesan Pengunjung**: Manajemen pesan terkirim dari form kontak secara langsung dengan kemampuan menghapus pesan yang tidak diinginkan melalui modal konfirmasi kustom.
*   **Kelola Musik**: Tambah, edit, dan hapus lagu. Sistem otomatis membaca panjang durasi berkas audio `.mp3` yang diunggah menggunakan HTML5 Audio API saat itu juga.

---

## 🛠️ Stack Teknologi

*   **Frontend**: React (v19) & Vite (v8)
*   **Styling**: Tailwind CSS (v4) & Vanilla CSS Custom Overrides
*   **State Management**: Zustand (dengan persitensi sinkronisasi lokal dan awan)
*   **Database & Auth**: Supabase (PostgreSQL)
*   **Storage Cloud**: Supabase Storage Buckets (`songs` & `portfolio`)
*   **Libraries**: React Icons, Swiper.js, AOS (Animate On Scroll), React-Toastify

---

## 🚀 Panduan Memulai & Instalasi

### 1. Klon Repositori
```bash
git clone <URL_REPOSI_ANDA>
cd portfolio-baru-main
```

### 2. Instal Dependensi
```bash
npm install
```

### 3. Konfigurasi Lingkungan (`.env`)
Buat berkas `.env` di direktori utama proyek dan tambahkan URL serta Kunci Anonim Supabase Anda:
```env
VITE_SUPABASE_URL=https://<ref_project_anda>.supabase.co
VITE_SUPABASE_ANON_KEY=<anon_key_anda>
```

### 4. Setup Skema Database & Storage
Buka panel administrasi Supabase Anda, masuk ke **SQL Editor**, buat kueri baru, dan jalankan seluruh isi berkas [supabase_setup.sql](file:///home/migwara/Documents/portfolio-baru-main/supabase_setup.sql) untuk mengonfigurasi tabel database, kebijakan Row Level Security (RLS), dan Storage Buckets secara otomatis.

### 5. Jalankan Development Server
```bash
npm run dev
```
Aplikasi akan aktif dan dapat diakses pada alamat default `http://localhost:5555`.

### 6. Build Produksi
```bash
npm run build
```

---

## 🤝 Kontribusi & Inspirasi

Website portfolio ini dibangun dengan dedikasi penuh terhadap kualitas kode dan kesempurnaan desain antarmuka. 

💖 **Inspirasi & Kredit Kode**:
Proyek portfolio ini terinspirasi dan merupakan hasil pengembangan lebih lanjut dari karya orisinal luar biasa milik **[adansyah125](https://github.com/adansyah125)**. Terima kasih banyak atas dedikasi dan inspirasi desain Neobrutalisme yang diberikan!

---

Ditulis dengan ⚡ oleh Muhammad Rifki Apreliant (Migwara).  
*Hak Cipta © 2026. Semua Hak Dilindungi.*
