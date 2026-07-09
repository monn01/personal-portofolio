# TASKPLAN.md
> Living document — update status tiap ada progress.
> Referensi: lihat PROJECT.md untuk konteks besar (what/who/features/stack).
> Status: [ ] belum | [~] proses | [x] selesai | [!] blocked

---

## Cara pakai
1. Kerjakan module secara berurutan (ada dependency antar module)
2. Satu sesi Claude Code = fokus ke satu module
3. Setelah module selesai, isi Definition of Done + Review checkpoint sebelum lanjut
4. Kalau rencana berubah di tengah jalan, edit file ini + catat di Changelog

---

## Module 1: Project Setup & Database Schema

**Status:** [x]
**Prioritas:** Tinggi

### Fungsi & code yang direncanakan
```
- Inisialisasi Next.js (App Router) + TypeScript + Tailwind CSS
- Setup Prisma + SQLite
- Schema database:
  - Profile { id, name, bio, photoUrl, email, contactLinks (json/relasi), skills (relasi/array) }
  - Skill { id, name, iconSlug/iconUrl, category?, profileId }
    <!-- iconSlug: kalau pakai icon library (mis. Simple Icons); iconUrl: kalau upload custom icon -->
  - Portfolio { id, title, description, category (web/app/design), icon/thumbnailUrl, year, role, techStack (array/json tags), externalUrl (repo/demo), createdAt, updatedAt }
  - AdminUser { id, email, passwordHash }
- Seed data awal (dummy) buat testing tampilan
```

### Dependency
- Tidak ada (module pertama)

### Definition of Done
- [x] `npx prisma migrate dev` jalan tanpa error
- [x] Semua model bisa di-query lewat Prisma Client (test sederhana)
- [x] Struktur folder Next.js App Router siap (`app/`, `components/`, `lib/`)

### Catatan implementasi
- Node.js belum terinstall di environment awal → diinstall via `winget install OpenJS.NodeJS.LTS` (v24.18.0, npm 11.16.0)
- `create-next-app` menolak jalan langsung di root karena ada CLAUDE.md/PROJECT.md/TASKPLAN.md (dianggap conflicting files) → di-scaffold ke folder temp `tmp-nextapp`, lalu isinya dipindah ke root (kecuali CLAUDE.md & AGENTS.md bawaan generator, supaya tidak menimpa dokumen project yang sudah ada)
- Stack terpasang: Next.js 16.2.10 (App Router, Turbopack), React 19.2.4, TypeScript, Tailwind CSS v4
- Prisma versi 7.8.0 — pakai generator baru `prisma-client` (bukan `prisma-client-js`), output di-arahkan ke `lib/generated/prisma` (bukan default `app/generated/prisma`) biar konsisten dengan struktur folder yang direncanakan
- Prisma 7 mewajibkan driver adapter eksplisit (tidak ada default query engine lagi) → pakai `@prisma/adapter-better-sqlite3` (native binding `better-sqlite3`, prebuilt binary berhasil di-download di Windows tanpa perlu build tools)
- `prisma.config.ts` dipakai untuk konfigurasi (bukan cuma `schema.prisma`) sesuai konvensi Prisma 7 — datasource URL & seed command (`migrations.seed`) didefinisikan di sana
- DB SQLite disimpan di `prisma/dev.db` (di-gitignore). Sempat salah lokasi ke root `./dev.db` karena `lib/prisma.ts` awalnya tidak load `.env` sendiri (dotenv cuma di-load otomatis oleh Prisma CLI lewat `prisma.config.ts`, bukan oleh script biasa) — sudah diperbaiki dengan `import "dotenv/config"` langsung di `lib/prisma.ts`
- Password admin di-hash pakai `bcryptjs` (pure JS, hindari kebutuhan native build tools untuk `bcrypt` asli) — tetap kompatibel dengan requirement "password wajib di-hash" di CLAUDE.md
- Seed dummy (`prisma/seed.ts`, dijalankan via `npx prisma db seed`) mengisi 1 AdminUser, 1 Profile, 7 Skill, 3 Portfolio — semua sudah diverifikasi bisa di-query lewat Prisma Client
- Folder `components/` sudah dibuat (masih kosong, akan diisi mulai Module 3)

### Review checkpoint
- [ ] Sudah direview
- Catatan review:

---

## Module 2: Auth (Login Admin)

**Status:** [x]
**Prioritas:** Tinggi

### Fungsi & code yang direncanakan
```
- Setup NextAuth.js dengan Credentials provider
- hashPassword(password) -> string        (bcryptjs — sudah terpasang sejak Module 1)
- verifyPassword(input, hash) -> boolean
- Halaman /login (form email + password)
- Middleware untuk protect semua route /admin/*
- Script/seed untuk buat akun admin pertama kali (karena cuma single-admin)
```

### Dependency
- Module 1 (butuh tabel AdminUser)

### Definition of Done
- [x] Login sukses dengan kredensial benar → redirect ke /admin/dashboard
- [x] Login gagal dengan kredensial salah → tampilkan pesan error, tidak redirect
- [x] Akses langsung ke /admin/* tanpa login → redirect otomatis ke /login
- [x] Password tidak pernah tersimpan/terkirim dalam bentuk plain text

### Catatan implementasi
- Karena cuma 1 admin, tidak perlu halaman register publik — akun dibuat lewat seed (`prisma/seed.ts`, sudah ada sejak Module 1)
- Pakai `next-auth@5.0.0-beta.31` (Auth.js v5) karena versi stable v4 belum resmi dukung App Router + React 19 + Next 16 — v5 beta sudah lama jadi standar untuk App Router dan peer-dep-nya cocok (`next ^16.0.0`, `react ^19.0.0`)
- Config dipecah dua file: `lib/auth.config.ts` (Edge-safe, tanpa Prisma/bcrypt — dipakai oleh proxy/middleware) dan `lib/auth.ts` (full config + Credentials provider, dipakai server component/action/route handler). Ini pola resmi Auth.js v5 supaya Prisma & better-sqlite3 (native binding) tidak ikut ter-bundle ke Edge runtime
- Route proteksi pakai file convention `proxy.ts` (bukan `middleware.ts`) — Next.js 16 me-rename convention ini (`middleware.ts` dianggap deprecated, warning "please use proxy instead"), perilaku & default export-nya sama persis
- Session pakai strategy JWT (cocok buat Credentials provider tanpa database session)
- Login form pakai server action (`app/login/actions.ts`) + `useActionState` (React 19), bukan `next-auth/react` client hook — jadi tidak perlu `SessionProvider` wrapper di layout
- `AUTH_SECRET` digenerate random dan disimpan di `.env` (gitignored). Ditambahkan `.env.example` sebagai referensi env var yang dibutuhkan (dikecualikan dari `.gitignore` lewat `!.env.example`)
- Testing: browser extension (claude-in-chrome) tidak terhubung di sesi ini, jadi klik-form manual di browser belum tercoba otomatis. Yang sudah diverifikasi terautomasi: (1) redirect middleware 307 ke `/login` saat akses `/admin/dashboard` tanpa sesi, (2) halaman `/login` render field email+password dengan benar, (3) logika inti verifikasi (lookup email via Prisma + `bcrypt.compare`) benar untuk kasus kredensial benar/password salah/email tidak terdaftar. Login end-to-end lewat form browser sebaiknya dicoba manual sebelum lanjut ke module berikutnya (kredensial seed: `admin@example.com` / `admin123`)

### Review checkpoint
- [ ] Sudah direview
- Catatan review:

---

## Module 3: Public Pages — Profile & Skills

**Status:** [x]
**Prioritas:** Tinggi

### Fungsi & code yang direncanakan
```
- Layout header: nama/branding pojok kiri atas + navbar (Home, About, Skills, Projects, Contact)
- Tombol Contact dengan aksen warna kontras (CTA)
- Halaman Home (/) — profil singkat, tanpa hero photo besar
- Halaman/section Skills — grid skill, tiap item = icon tool + nama skill
- Komponen: SiteHeader, ProfileSection, SkillBadge (icon + label)
- Fetch data profile & skills dari database (server component)
- Riset icon library buat logo tools skill (mis. react-icons / simple-icons) vs upload icon manual per skill lewat admin
```

### Dependency
- Module 1 (butuh data profile & skill tersedia)

### Definition of Done
- [x] Data profil & skill tampil sesuai isi database (bukan hardcode)
- [x] Responsive di mobile & desktop
- [x] Tampilan sesuai gaya minimalis-modern yang disepakati

### Catatan implementasi
- Konfirmasi struktur dulu ke user sebelum implementasi (sesuai instruksi CLAUDE.md): navbar pakai **route terpisah** (bukan single-page scroll anchor) → `/` (Home), `/about`, `/skills`, `/portfolio` (link ke Module 4). Tombol Contact = `mailto:` langsung ke email profil (form kontak masih backlog)
- Icon skill pakai package `simple-icons` (dikonfirmasi user) — cocok karena data seed Module 1 sudah pakai slug gaya Simple Icons ("react", "nextdotjs", dst). Implementasi baca file SVG mentah langsung dari `node_modules/simple-icons/icons/{slug}.svg` (bukan import seluruh dataset JS `simple-icons` yang isinya ribuan icon) — lebih hemat memori, cukup untuk kebutuhan lookup-by-slug di server component. Path slug divalidasi regex `[a-z0-9]+` sebelum dipakai untuk baca file (cegah path traversal kalau nanti admin bisa isi iconSlug bebas di Module 5/6)
- Prioritas render icon: `iconUrl` (custom upload admin) → `iconSlug` (simple-icons) → fallback inisial huruf pertama nama skill
- Dark mode dijadikan baseline permanen di `app/globals.css` (bukan ikut `prefers-color-scheme` OS) sesuai PROJECT.md — semua page pakai `bg-neutral-950` dkk, aksen CTA `blue-600`
- `SiteHeader` jadi Server Component async yang fetch profile sendiri (nama jadi branding kiri atas, tombol Contact mailto), dipasang di `app/layout.tsx` supaya konsisten di semua halaman termasuk Module 4 nanti. Mobile nav pakai client component terpisah (`MobileNav.tsx`, hamburger toggle) supaya tetap dipakai walau layar kecil (bukan cuma disembunyikan)
- `getProfile()` di `lib/queries.ts` dibungkus `cache()` dari React supaya tidak query database berkali-kali kalau dipanggil dari beberapa Server Component di request yang sama (mis. SiteHeader + halaman itu sendiri)
- Halaman `/`, `/about`, `/skills` ke-generate sebagai static page (○) saat build karena tidak pakai dynamic API — ini OK untuk performa, TAPI perlu diingat di **Module 5/6**: setelah admin update profil/skill lewat dashboard, API route mutasinya wajib panggil `revalidatePath()` untuk halaman terkait supaya perubahan langsung muncul di publik tanpa perlu rebuild
- Testing: browser extension (claude-in-chrome) belum terhubung di sesi ini juga, jadi cek visual/responsive asli di browser belum tercoba otomatis — divalidasi lewat `npm run build` (sukses, tanpa error) + curl konten HTML (nama profil, bio, contact links, nama skill semua muncul sesuai data seed). Styling responsive pakai Tailwind breakpoint standar (`sm:`) dan `flex-wrap`, tapi sebaiknya dicek manual di browser (mobile & desktop) sebelum lanjut ke module berikutnya

### Review checkpoint
- [ ] Sudah direview
- Catatan review:

---

## Module 4: Public Pages — Portfolio List & Detail

**Status:** [x]
**Prioritas:** Tinggi

### Fungsi & code yang direncanakan
```
- Halaman /portfolio — grid card semua portofolio (dark card style)
- Halaman /portfolio/[id] — detail satu portofolio
- Komponen PortfolioCard, layout hierarki:
  - Icon/thumbnail (kiri atas), Tahun (kanan atas)
  - Judul (bold, besar)
  - Label "Peran: ..."
  - Deskripsi singkat
  - Tech stack sebagai pill tags
  - Link eksternal (repo/demo) di bawah card
- Hover transition halus di card (subtle, bukan berat)
- Komponen: PortfolioCard, PortfolioDetail
- getPortfolios() -> Portfolio[]
- getPortfolioById(id) -> Portfolio
```

### Dependency
- Module 1

### Definition of Done
- [x] Semua portofolio dari database muncul di /portfolio
- [x] Klik satu item → halaman detail menampilkan info lengkap
- [x] Kalau portofolio kosong (belum ada data) → tampilkan empty state yang wajar, bukan error

### Catatan implementasi
- `getPortfolios()` & `getPortfolioById(id)` ditambahkan di `lib/queries.ts` (dibungkus `cache()` seperti `getProfile()`), sort berdasarkan `year` desc lalu `createdAt` desc
- Card TIDAK dibuat 100% clickable lewat 1 elemen `<Link>` raksasa — HTML tidak boleh nested `<a>` di dalam `<a>`, sedangkan link eksternal (repo/demo) juga harus jadi anchor sendiri. Solusi: `<Link>` cuma membungkus bagian icon+judul+peran+deskripsi (area non-interaktif lain), link eksternal jadi `<a target="_blank">` terpisah di bawahnya — tetap dalam satu card div yang sama, hover style tetap nyala bareng lewat parent `group`
- `PortfolioIcon` (fallback icon per category: web/app/design pakai inline SVG generik hand-crafted, bukan icon library tambahan) dipakai di card & detail — prioritas `thumbnailUrl` (kalau admin upload) → icon kategori → fallback inisial huruf judul
- Route detail `/portfolio/[id]` pakai `notFound()` dari `next/navigation` kalau id tidak ketemu di database → otomatis render halaman 404 bawaan Next.js (belum dibuat custom `not-found.tsx`, cukup untuk sekarang)
- `params` di halaman `[id]` di-`await` sebagai Promise, sesuai konvensi Next.js 15+/16 App Router
- Testing: `npm run build` sukses, konten `/portfolio` (semua 3 dummy project) dan `/portfolio/[id]` (detail + role + CTA repo/demo) dikonfirmasi lewat curl ke dev server, serta id yang tidak ada di database mengembalikan 404. Visual/responsive asli di browser masih belum tercoba otomatis (browser extension belum terhubung)

### Review checkpoint
- [ ] Sudah direview
- Catatan review:

---

## Module 5: Admin Dashboard — Edit Profile

**Status:** [x]
**Prioritas:** Sedang

### Fungsi & code yang direncanakan
```
- Halaman /admin/dashboard/profile
- Form edit: nama, bio, foto, kontak, skill (tambah/hapus skill)
- API route: PUT /api/profile
- updateProfile(data) -> Profile
```

### Dependency
- Module 1, Module 2 (butuh protected route)

### Definition of Done
- [x] Admin bisa update profil dan perubahan langsung terlihat di halaman publik
- [x] Validasi input dasar (field wajib tidak boleh kosong)

### Catatan implementasi
- Ikut spec TASKPLAN apa adanya: REST API route (`PUT /api/profile`) + fungsi `updateProfile(data)` terpisah di `lib/mutations.ts`, bukan server action seperti Module 2 — biar konsisten dengan Module 6 yang juga direncanakan REST (`POST/PUT/DELETE /api/portfolio`)
- **Penting soal proteksi:** `proxy.ts` (middleware) cuma cover path `/admin/:path*` untuk redirect halaman. Route API (`/api/profile`, nanti `/api/portfolio`) TIDAK ke-cover middleware itu — jadi tiap API route wajib cek `auth()` manual sendiri di dalam handler dan return `401 Unauthorized` (bukan redirect, karena ini dikonsumsi lewat `fetch` bukan navigasi browser). Sudah diverifikasi: PUT tanpa session ditolak 401
- Skill pakai strategi **full-replace** per save (`deleteMany` lalu `createMany` dalam satu `prisma.$transaction`) alih-alih diff/update satu-satu — jauh lebih sederhana untuk jumlah skill yang kecil (~10-20), dan cocok karena form skill di admin memang bentuknya "daftar ulang semua skill" tiap submit, bukan edit-per-baris independen
- Field foto pakai **input URL teks**, bukan file upload — konsisten dengan `Skill.iconUrl` yang juga URL-based, dan PROJECT.md sendiri bilang image storage lokal/upload masih rencana upgrade nanti (bukan requirement Module 5)
- Validasi dilakukan manual (bukan pakai library seperti zod) karena cuma pengecekan field wajib + format email dasar — sesuai instruksi "jangan nambah abstraksi di luar yang dibutuhkan". Validasi jalan di server (`validateProfileInput` di `lib/mutations.ts`, dipanggil dari route handler) sebagai sumber kebenaran, form di client cuma kasih UX cepat (`required` attribute)
- Setelah update sukses, route handler manggil `revalidatePath()` untuk `/`, `/about`, `/skills`, DAN `/admin/dashboard/profile` sendiri (halaman ini ikut ke-generate statis saat build, jadi kalau tidak di-revalidate juga, form bakal nampilin data basi kalau di-refresh)
- Testing end-to-end dilakukan lewat HTTP request manual (login via NextAuth credentials callback flow dapat session cookie, lalu PUT dengan cookie itu) karena browser extension belum terhubung. Sudah diverifikasi: (1) PUT tanpa session → 401, (2) PUT dengan session + data valid → 200, perubahan langsung muncul di `/about` & `/skills` publik, (3) PUT dengan field kosong/email invalid → 400. Data test dikembalikan ke nilai seed semula setelah verifikasi selesai
- Visual form (tambah/hapus baris contact link & skill secara interaktif) belum tercoba lewat klik asli di browser — sebaiknya dicek manual sebelum lanjut

### Review checkpoint
- [ ] Sudah direview
- Catatan review:

---

## Module 6: Admin Dashboard — CRUD Portfolio

**Status:** [x]
**Prioritas:** Sedang

### Fungsi & code yang direncanakan
```
- Halaman /admin/dashboard/portfolio (list + tombol tambah)
- Form tambah/edit portofolio (title, description, category, image, url, tech)
- API routes:
  - POST /api/portfolio       -> create
  - PUT /api/portfolio/[id]   -> update
  - DELETE /api/portfolio/[id] -> delete
- Konfirmasi sebelum delete (avoid accidental delete)
```

### Dependency
- Module 1, Module 2

### Definition of Done
- [x] Admin bisa create, edit, delete portofolio tanpa sentuh kode
- [x] Setelah create/edit/delete, halaman publik /portfolio otomatis ter-update
- [x] Delete butuh konfirmasi (tidak langsung hilang sekali klik)

### Catatan implementasi
- Struktur sama persis dengan pola Module 5: `lib/mutations.ts` (`createPortfolio`, `updatePortfolio`, `deletePortfolio`, `validatePortfolioInput`, plus `parsePortfolioInput` untuk parsing body request yang aman dari `unknown`/`any`) → dipanggil dari API route (`app/api/portfolio/route.ts` untuk POST, `app/api/portfolio/[id]/route.ts` untuk PUT/DELETE) yang masing-masing cek `auth()` manual (bukan lewat middleware, karena `/api/*` di luar matcher `proxy.ts`)
- `techStack` di form pakai **input teks dipisah koma** (bukan dynamic add/remove row seperti skill di Module 5) — lebih pas untuk data yang cuma array string polos tanpa sub-field, di-split & di-trim saat submit
- Kategori portofolio dibatasi ke 3 pilihan tetap (`web`/`app`/`design`) lewat `<select>` di form + divalidasi di server (`validatePortfolioInput`) supaya tidak ada kategori "liar" yang bikin `PortfolioIcon` (Module 4) gagal cari fallback icon-nya
- Delete pakai `window.confirm()` native browser (bukan modal custom) — cukup untuk tool admin single-user, sesuai prinsip "jangan nambah abstraksi di luar yang dibutuhkan"
- Error 404 dari Prisma (`P2025`, record tidak ketemu saat update/delete) ditangkap eksplisit di route handler dan dikembalikan sebagai HTTP 404 yang rapi, bukan bocor jadi 500
- Tiap mutasi (create/update/delete) manggil `revalidatePath()` ke `/portfolio`, `/portfolio/[id]` (kalau relevan), dan `/admin/dashboard/portfolio` — konsisten dengan pola revalidation dari Module 3 & 5
- Testing end-to-end penuh lewat HTTP (login via credentials callback → session cookie → CRUD): create (201) → langsung muncul di `/portfolio` publik & halaman detail-nya bisa diakses → update (200) → perubahan judul/peran langsung ter-refleksi → delete tanpa auth (401) → delete dengan auth (200) → item hilang dari publik & detail-nya 404 → delete id yang sudah tidak ada (404, bukan 500) → payload tidak valid (400). Data dummy hasil testing sudah dibersihkan, 3 portfolio seed asli dari Module 1 dikonfirmasi tetap utuh
- Interaksi form & tombol delete asli di browser (klik "+Tambah", isi form, klik konfirmasi delete) belum tercoba manual — extension browser masih belum terhubung di semua sesi sejauh ini

### Review checkpoint
- [ ] Sudah direview
- Catatan review:

---

## Module 7: Polish — Styling, Responsive, Deploy

**Status:** [ ]
**Prioritas:** Sedang

### Fungsi & code yang direncanakan
```
- Review konsistensi styling (spacing, font, warna) di semua halaman
- Uji responsive: mobile, tablet, desktop
- Setup environment variables untuk production (DB url, auth secret)
- Deploy ke Vercel
- Migrasi database dev (SQLite) ke production DB kalau perlu (Turso/Supabase)
```

### Dependency
- Semua module sebelumnya selesai

### Definition of Done
- Website bisa diakses via URL publik
- Tidak ada broken layout di ukuran layar umum (375px, 768px, 1440px)
- Login admin tetap berfungsi di production

### Catatan implementasi
-

### Review checkpoint
- [ ] Sudah direview
- Catatan review:

---

## Backlog / Ide belum masuk plan
- Section blog/artikel (nice to have)
- Filter kategori portofolio
- Dark mode
- Form kontak
- SEO basic

## Changelog rencana
- 9 Juli 2026 — Task plan awal dibuat, stack dikunci: Next.js + Prisma/SQLite + NextAuth (Credentials)
- 9 Juli 2026 — Fokus dipersempit ke profil-portofolio saja (blog artikel jadi backlog). Referensi visual ditambahkan (dark mode, aksen biru, grid card portofolio, skill dengan icon tools) — dikembangkan jadi versi sendiri, bukan replikasi persis
- 9 Juli 2026 — Module 1 selesai. Deviasi teknis kecil dari rencana awal (stack inti tidak berubah): (1) Prisma pakai versi 7 dengan driver adapter `@prisma/adapter-better-sqlite3` karena versi ini tidak lagi punya default query engine bawaan; (2) hashing password pakai `bcryptjs` (implementasi bcrypt pure-JS) bukan `bcrypt` native, supaya tidak butuh build tools tambahan di Windows — tetap penuhi requirement "password wajib di-hash" di CLAUDE.md

---

*Terakhir diupdate: 9 Juli 2026*
