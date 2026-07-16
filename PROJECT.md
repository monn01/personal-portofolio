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
- [x] Halaman publik: profil (bio, foto, kontak)
- [x] Halaman publik: daftar skill yang dikuasai, tiap skill disertai logo/icon tools terkait (mis. React, Figma, dsb)
- [x] Halaman publik: daftar portofolio (website, aplikasi, desain) + detail per item
- [x] Login admin via email + password (akun tunggal, bukan multi-user)
- [x] Dashboard admin: edit profil (bio, foto, kontak, skill)
- [x] Dashboard admin: CRUD portofolio (create, read, update, delete)
- [x] Pengunjung publik hanya bisa lihat, tidak ada akses edit sama sekali

### v2 — CV Digital Enhancement (Wajib) — [x] selesai
- [x] Halaman publik: Experience (riwayat pengalaman/organisasi, timeline style)
- [x] Halaman publik: Certifications (sertifikat, grid card + gambar + link credential)
- [x] Rotating tagline di hero section Home (mis. "Mahasiswa Informatika UAD" / "Full-Stack Developer" bergantian)
- [x] Home page diperluas jadi scrollable dengan preview section (Experience, Certifications, Projects) + scroll-triggered animation
- [x] Upload gambar (foto profil, thumbnail portofolio, gambar sertifikat) via Cloudinary — bukan cuma isi URL manual
- [x] Design system baru: palet warna dark + gradient aksen biru-ungu, komponen Button reusable dengan efek hover/tap (Framer Motion)
- [x] Dashboard admin: CRUD Experience & Certifications
- [x] Dashboard admin: redesign dengan sidebar navigasi per section (Profile & Skills digabung satu section, Portfolio, Experience, Certifications)

### v3 — UI/UX Polish & Feature Rounding (Wajib) — selesai
> Detail lengkap tiap module ada di TASKPLAN.md Module 14-21. Referensi visual: napa.ituaku.com (bukan ditiru langsung, cuma acuan level polish — lihat `gambar-referensi/`, gitignored).
- [x] Elemen dekoratif (gradient blob), floating scroll-to-top, kontras tipografi & spacing lebih tegas
- [x] Toggle light/dark mode beneran (bukan cuma dark permanen) — refactor warna jadi semantic token
- [x] Stat highlight (angka pencapaian dari data asli: jumlah project, tahun pengalaman, dst — bukan metrik palsu)
- [x] Card & photo treatment lebih hidup (hover, depth, opsi treatment foto profil)
- [x] Filter kategori portofolio (web/app/design) di halaman /portfolio
- [x] Form kontak (pengunjung kirim pesan ke admin, admin kelola lewat dashboard)
- [x] SEO basic (meta tags per halaman, sitemap, robots.txt)
- [x] Section blog/artikel (model Post baru, admin CRUD dengan markdown, halaman publik /blog)

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
| Database | SQLite (dev) via Prisma ORM, Turso (production) | Prisma dual-adapter: `better-sqlite3` lokal, `libsql` di production |
| Auth | NextAuth.js (Auth.js) v5 — Credentials provider | Email + password, password di-hash pakai bcryptjs |
| Hosting | Vercel | Gratis untuk skala personal, terintegrasi baik dengan Next.js |
| Image storage | Cloudinary | v2: upload foto profil, thumbnail portofolio, gambar sertifikat — butuh akun + API key aktif sebelum Module 10 bisa dikerjakan |
| Animasi | Framer Motion | v2: efek hover/tap di komponen Button, scroll-triggered animation, transisi rotating tagline |
| Theming | CSS variable custom + `next-themes` | v3: token semantic (--background/--foreground/dst) + attribute `data-theme`, di-switch via `next-themes` (localStorage persistence + FOUC prevention bawaan) |
| Markdown rendering | react-markdown + @tailwindcss/typography | v3: render konten Post/artikel dari markdown ke HTML di halaman /blog/[slug], styling `.prose` di-mapping ke token semantic sendiri |

**Status stack:** [x] fix (v1) — v2 menambahkan Cloudinary & Framer Motion di atas stack yang sama, bukan ganti stack

---

## 5. What it should look like — Tampilan/UX

**Referensi visual:** Terinspirasi dari portofolio Dio Lutvi Andre (bukan ditiru persis — dibuat versi sendiri dengan gaya khas pribadi).

**Elemen yang diadaptasi dari referensi:**
- **Header/branding:** Nama pemilik jadi branding utama di pojok kiri atas, bukan hero image foto besar
- **Navigasi:** Navbar atas bersih berisi menu (Home, About, Skills, Projects, Experience, Certifications) + tombol Contact dengan aksen warna kontras sebagai CTA
- **Portfolio card (grid):** Tiap card berisi hierarki informasi:
  - Icon/logo project (kiri atas)
  - Tahun (kanan atas)
  - Judul project (font tebal, besar)
  - Label "Peran" (role yang diambil)
  - Deskripsi singkat
  - Tech stack sebagai pill-shaped tags
  - Link eksternal (repo/demo) di bagian bawah card
- **Animasi:** Transisi halus antar section dan saat hover card — interaktif tapi tidak berat/berlebihan. v2: pakai Framer Motion untuk hover/tap effect di komponen Button, scroll-triggered fade-in/slide-in per section (`whileInView`), dan transisi rotating tagline di hero

**Skema warna:** Dark mode — latar hitam keabu-abuan, teks putih/abu-abu terang, warna aksen biru untuk elemen penting (tombol CTA, highlight). *(Boleh disesuaikan/dieksplorasi versi sendiri, dark mode + aksen biru ini baseline awal.)* v2: eksplorasi gradient aksen biru-ungu di elemen interaktif (button, highlight) supaya tidak terkesan hitam polos, tetap jaga kontras teks untuk keterbacaan.

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
1. Buka website → landing/home menampilkan profil singkat + rotating tagline, bisa discroll untuk preview Experience/Certifications/Projects
2. Navigasi ke halaman skill, portofolio, experience, atau certifications
3. Klik salah satu portofolio → lihat detail (deskripsi, gambar, link, tech yang dipakai)

**Alur utama (admin):**
1. Buka `/login` → masukkan email + password
2. Setelah login → redirect ke `/admin/dashboard`
3. Dashboard (v2: layout sidebar) punya menu per section: Edit Profil (termasuk upload foto & taglines), Kelola Portofolio, Kelola Experience, Kelola Certifications — masing-masing list + tombol tambah/edit/hapus
4. Upload gambar (foto profil, thumbnail portofolio, gambar sertifikat) diproses lewat Cloudinary, URL hasil upload otomatis tersimpan ke database
5. Perubahan langsung tersimpan ke database, otomatis muncul di halaman publik

**Constraint teknis penting:**
- Halaman admin harus protected route (middleware cek session, redirect ke login kalau belum auth)
- Password wajib di-hash, jangan disimpan plain text
- Data portofolio & profil disimpan di database, bukan hardcode di komponen

---

## Definition of Done (project level)
- [x] Pengunjung publik bisa lihat profil, skill, dan semua portofolio tanpa login
- [x] Admin bisa login dan CRUD portofolio + edit profil tanpa sentuh kode
- [x] Non-admin tidak bisa akses `/admin/*` sama sekali (redirect ke login)
- [x] Tampilan responsive di mobile & desktop (audit code-level selesai, verifikasi visual browser masih pending)
- [ ] Website bisa di-deploy dan diakses publik (kode & instruksi siap, deploy aktual ke Vercel/Turso menunggu eksekusi user)
- [x] **v2:** Pengunjung publik bisa lihat Experience & Certifications tanpa login
- [x] **v2:** Admin bisa CRUD Experience & Certifications + upload gambar (foto profil, portofolio, sertifikat) tanpa sentuh kode — sudah diverifikasi end-to-end dengan Cloudinary asli
- [x] **v2:** Home page scrollable dengan rotating tagline dan preview section (kode-level selesai; kehalusan animasi belum diverifikasi visual di browser)
- [x] **v3:** Toggle light/dark mode berfungsi di semua halaman, preferensi tersimpan (`next-themes`, localStorage) — kode-level selesai & diverifikasi lewat curl (grep hardcoded color nihil), belum ada konfirmasi visual asli klik toggle di browser
- [x] **v3:** Portfolio bisa difilter per kategori, ada form kontak tersimpan ke database, SEO basic (meta+sitemap) terpasang — semua diverifikasi end-to-end lewat HTTP (filter per kategori cocok data, contact form + honeypot dites, title/OG/sitemap/robots dicek satu-satu)
- [x] **v3:** Admin bisa tulis/kelola artikel blog, tampil di halaman publik /blog — CRUD + toggle draft/published + markdown rendering diverifikasi end-to-end lewat HTTP

---

*Terakhir diupdate: 9 Juli 2026 (v3 — Module 14-21 selesai semua: visual polish, theme toggle, stat highlight, filter portofolio, form kontak, SEO, blog. Sisa kerja: Module 7 — deploy production ke Vercel/Turso, masih sengaja ditunda menunggu user, dan verifikasi visual browser asli karena claude-in-chrome belum pernah terhubung sepanjang project)*
