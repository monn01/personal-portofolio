# PROJECT.md
> Dokumen rujukan utama project. Upload file ini di awal setiap chat/sesi Claude Code terkait project ini.

---

## 1. What — Apa yang dibangun

**Nama project:** Personal Blog & Portfolio Website

**Deskripsi singkat:**
Website pribadi berisi profil diri, daftar skill yang dikuasai, dan portofolio project (website, aplikasi, produk desain). Berfungsi sebagai media perkenalan diri ke publik, dengan dashboard admin privat untuk mengelola konten tanpa perlu edit kode langsung.

---

## 2. Who — Untuk siapa

**Target user:**
- **Pengunjung publik** (read-only) — orang yang ingin mengenal pemilik website lebih dalam: profil, skill, portofolio.
- **Admin (pemilik website, akun tunggal)** — login untuk mengelola seluruh konten.

**Konteks penggunaan:** Portofolio pribadi / personal branding, bisa dipakai untuk keperluan profesional (melamar kerja, freelance, dsb).

---

## 3. Core Features

### Wajib (Must Have)
- [ ] Halaman publik: profil (bio, foto, kontak)
- [ ] Halaman publik: daftar skill yang dikuasai, tiap skill disertai logo/icon tools terkait (mis. React, Figma, dsb)
- [ ] Halaman publik: daftar portofolio (website, aplikasi, desain) + detail per item
- [ ] Login admin via email + password (akun tunggal, bukan multi-user)
- [ ] Dashboard admin: edit profil (bio, foto, kontak, skill)
- [ ] Dashboard admin: CRUD portofolio (create, read, update, delete)
- [ ] Pengunjung publik hanya bisa lihat, tidak ada akses edit sama sekali

### Nice to have (kalau sempat)
- [ ] Section blog/artikel (tulisan bebas, bukan cuma portofolio)
- [ ] Filter/kategori portofolio (mis. by tipe: web / app / design)
- [ ] Dark mode
- [ ] Form kontak (pengunjung bisa kirim pesan ke admin)
- [ ] SEO basic (meta tags, sitemap)

### Out of scope (sengaja TIDAK dikerjakan)
- Multi-admin / role management (cuma satu admin)
- Komentar dari pengunjung
- Sistem notifikasi

---

## 4. Tech Stack

| Layer | Pilihan | Catatan |
|---|---|---|
| Framework | Next.js (App Router) | Satu bahasa (TypeScript/JS) untuk frontend & backend |
| Styling | Tailwind CSS | Cocok untuk gaya modern-minimalis, cepat iterasi |
| Database | SQLite (dev) via Prisma ORM | Ringan, gampang setup. Bisa migrasi ke Turso/Supabase (Postgres) saat production/deploy |
| Auth | NextAuth.js (Auth.js) — Credentials provider | Email + password, password di-hash pakai bcrypt |
| Hosting (rencana) | Vercel | Gratis untuk skala personal, terintegrasi baik dengan Next.js |
| Image storage | Lokal dulu / bisa upgrade ke Cloudinary/S3 nanti | Untuk foto profil & gambar portofolio |

**Status stack:** [x] fix

---

## 5. What it should look like — Tampilan/UX

**Referensi visual:** Terinspirasi dari portofolio Dio Lutvi Andre (bukan ditiru persis — dibuat versi sendiri dengan gaya khas pribadi).

**Elemen yang diadaptasi dari referensi:**
- **Header/branding:** Nama pemilik jadi branding utama di pojok kiri atas, bukan hero image foto besar
- **Navigasi:** Navbar atas bersih berisi menu (Home, About, Skills, Projects, dst sesuai kebutuhan) + tombol Contact dengan aksen warna kontras sebagai CTA
- **Portfolio card (grid):** Tiap card berisi hierarki informasi:
  - Icon/logo project (kiri atas)
  - Tahun (kanan atas)
  - Judul project (font tebal, besar)
  - Label "Peran" (role yang diambil)
  - Deskripsi singkat
  - Tech stack sebagai pill-shaped tags
  - Link eksternal (repo/demo) di bagian bawah card
- **Animasi:** Transisi halus antar section dan saat hover card — interaktif tapi tidak berat/berlebihan

**Skema warna:** Dark mode — latar hitam keabu-abuan, teks putih/abu-abu terang, warna aksen biru untuk elemen penting (tombol CTA, highlight). *(Boleh disesuaikan/dieksplorasi versi sendiri, dark mode + aksen biru ini baseline awal.)*

**Perbedaan dari referensi (versi sendiri):**
- Bukan replikasi 1:1 — layout, spacing, tipografi, dan detail visual dikembangkan ulang jadi gaya sendiri
- Skill section punya fitur tambahan: tiap skill ditampilkan dengan logo/icon tools terkait (bukan cuma nama), bisa pakai icon library (mis. Simple Icons / react-icons) atau upload icon custom

**Gaya/tone:**
- Minimalis, clean, terstruktur — mudah di-scan informasinya
- Modern: font sans-serif, animasi/transisi halus (subtle, bukan berlebihan)
- Responsive (mobile-friendly wajib)

---

## 6. How it works — Alur kerja / arsitektur singkat

**Alur utama (pengunjung):**
1. Buka website → landing/home menampilkan profil singkat
2. Navigasi ke halaman skill dan portofolio
3. Klik salah satu portofolio → lihat detail (deskripsi, gambar, link, tech yang dipakai)

**Alur utama (admin):**
1. Buka `/login` → masukkan email + password
2. Setelah login → redirect ke `/admin/dashboard`
3. Dashboard punya menu: Edit Profil, Kelola Portofolio (list + tombol tambah/edit/hapus)
4. Perubahan langsung tersimpan ke database, otomatis muncul di halaman publik

**Constraint teknis penting:**
- Halaman admin harus protected route (middleware cek session, redirect ke login kalau belum auth)
- Password wajib di-hash, jangan disimpan plain text
- Data portofolio & profil disimpan di database, bukan hardcode di komponen

---

## Definition of Done (project level)
- Pengunjung publik bisa lihat profil, skill, dan semua portofolio tanpa login
- Admin bisa login dan CRUD portofolio + edit profil tanpa sentuh kode
- Non-admin tidak bisa akses `/admin/*` sama sekali (redirect ke login)
- Tampilan responsive di mobile & desktop
- Website bisa di-deploy dan diakses publik (via Vercel atau hosting lain)

---

*Terakhir diupdate: 9 Juli 2026*
