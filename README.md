# ⚡ Neobrutalist Dynamic Developer Portfolio

[![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://react.dev/)
[![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)](https://vitejs.dev/)
[![Neon](https://img.shields.io/badge/Neon_Postgres-00E599?style=for-the-badge&logo=postgresql&logoColor=black)](https://neon.tech/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Zustand](https://img.shields.io/badge/Zustand-orange?style=for-the-badge)](https://github.com/pmndrs/zustand)

Sebuah portfolio digital tingkat lanjut (*advanced developer portfolio*) dengan desain estetika **Neobrutalisme** berani, kontras tinggi, dan berkarakter kuat. Website ini terintegrasi penuh secara dinamis dengan **Neon Serverless PostgreSQL Database** melalui Backend API aman, dilengkapi dengan sistem pemutar musik interaktif yang mensimulasikan tempo nada menjadi partikel not musik yang jatuh secara dinamis di layar, serta memiliki **Admin Dashboard** mandiri yang aman dan berfitur lengkap.

---

## ✨ Fitur Utama

### 🎨 1. Estetika Neobrutalisme Premium
*   Desain visual yang berani dengan border hitam tebal (`border-4 border-black`), bayangan keras (`shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]`), palet warna neon berenergi tinggi, dan interaksi melayang (hover) yang responsif dan hidup.
*   **Custom Neobrutalist Toast Notifications**: Modifikasi penuh pustaka `react-toastify` dengan kotak persegi tajam, garis tepi tebal, serta progress bar hitam tebal yang selaras dengan seluruh gaya visual website.
*   **Custom Neobrutalist Confirmation Modal**: Popup konfirmasi interaktif dengan status loading (`Menghapus...` + spinner berputar) yang memanjakan mata sebelum aksi penghapusan dilakukan.

### 🎵 2. Music Engine Interaktif & Particle Effect
*   Pemutar musik mengambang (*floating audio player*).
*   **Dynamic Particle System**: Efek partikel not-not musik yang berguguran di latar belakang layar saat musik diputar. Kecepatan jatuh partikel beradaptasi secara otomatis mengikuti nilai tempo musik (`tempo_speed`) yang disimpan di database!

### 🔒 3. Admin Dashboard & Neon Database Integration (Full CRUD)
*   **Akses Terproteksi (Login Admin)**: Sistem login aman berbasis token otorisasi HMAC.
*   **Kelola Profil & Tentang Saya**: Form lengkap untuk mengubah nama, judul, deskripsi, lokasi, email, dan foto profil.
*   **Kelola Proyek & Sertifikat**: 
    *   Pengaturan penandaan proyek utama (*Highlight Project*) dalam carousel slider Swiper.
    *   Pengelolaan proyek dan sertifikat secara langsung.
*   **Kotak Masuk Pesan Pengunjung**: Manajemen pesan terkirim dari form kontak secara langsung dengan kemampuan menghapus pesan yang tidak diinginkan melalui modal konfirmasi kustom.
*   **Kelola Musik**: Tambah, edit, dan hapus lagu. Sistem otomatis membaca panjang durasi berkas audio `.mp3` menggunakan HTML5 Audio API.

---

## 🛠️ Stack Teknologi

*   **Frontend**: React (v19) & Vite (v8)
*   **Styling**: Tailwind CSS (v4) & Vanilla CSS Custom Overrides
*   **State Management**: Zustand
*   **Database**: Neon Serverless PostgreSQL (`@neondatabase/serverless`)
*   **Backend API**: Vercel Serverless Function & Vite Local API Middleware
*   **Libraries**: React Icons, Swiper.js, AOS (Animate On Scroll), React-Toastify

---

## 🚀 Panduan Memulai & Instalasi

### 1. Klon Repositori
```bash
git clone <URL_REPOSI_ANDA>
cd <FOLDER_PROYEK>
```

### 2. Instal Dependensi
```bash
npm install
```

### 3. Konfigurasi Lingkungan (`.env`)
Buat berkas `.env` di direktori utama proyek:
```env
DATABASE_URL=postgresql://neondb_owner:password@ep-...neon.tech/neondb?sslmode=require
ADMIN_USERNAME=migwaraa@gmail.com
ADMIN_PASSWORD=admin123
ADMIN_JWT_SECRET=rahasia-kunci-token-admin
```

### 4. Jalankan Development Server
Cukup klik ganda **`run.bat`** atau jalankan perintah:
```bash
npm run dev
```
Aplikasi akan aktif dan dapat diakses pada alamat default `http://localhost:5555`.

### 5. Build Produksi
```bash
npm run build
```

---

Ditulis dengan ⚡ oleh Muhammad Rifki Apreliant (Migwara).  
*Hak Cipta © 2026. Semua Hak Dilindungi.*
