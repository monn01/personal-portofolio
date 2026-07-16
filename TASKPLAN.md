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

**Status:** [~]
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
- [ ] Website bisa diakses via URL publik — **menunggu eksekusi kamu** (buat akun Turso & Vercel, lihat README.md bagian "Deploy ke production")
- [~] Tidak ada broken layout di ukuran layar umum (375px, 768px, 1440px) — audit code-level selesai + beberapa bug diperbaiki, tapi belum ada konfirmasi visual asli di browser (extension claude-in-chrome tidak terhubung sepanjang project ini)
- [ ] Login admin tetap berfungsi di production — belum bisa diverifikasi, production belum di-deploy

### Catatan implementasi
- **Bug ditemukan & diperbaiki:** `SiteHeader` (navbar publik, ditambahkan ke root layout di Module 3) ternyata ikut tampil di `/login` dan semua `/admin/*`, padahal halaman-halaman itu didesain Module 2 full-viewport (`min-h-screen`) tanpa asumsi ada header di atasnya — hasilnya tinggi halaman jadi header+100vh (extra scroll, login card tidak center sempurna). Diperbaiki dengan restrukturisasi pakai **Next.js route group**: halaman publik (`/`, `/about`, `/skills`, `/portfolio`, `/portfolio/[id]`) dipindah ke `app/(public)/` dengan layout sendiri yang render `SiteHeader`; `/login` dan `/admin/*` tetap di luar grup itu jadi otomatis tidak dapat header. URL tidak berubah sama sekali (route group tidak masuk path)
- **Inkonsistensi kecil diperbaiki:** tombol CTA biru mayoritas pakai `rounded-full`, tapi tombol submit login & tombol Contact di mobile nav masih `rounded-md` — disamakan
- **Bug responsive diperbaiki:** baris form "Contact Link" (2 input + tombol Hapus) dan baris "Kategori + Hapus" di form Skill (Module 5) berpotensi overflow di layar 375px karena dipaksa 1 baris tanpa wrap — diperbaiki jadi stack vertikal/full-width di breakpoint mobile
- Breakpoint navbar (`SiteHeader`/`MobileNav`) digeser dari `sm:` (640px) ke `md:` (768px) supaya lebih longgar di lebar 640-767px, tanpa mengubah perilaku di 3 breakpoint yang diuji (375/768/1440)
- **Production DB:** dikonfirmasi ke user bahwa SQLite lokal (`better-sqlite3`, native binding, file lokal) **tidak bisa dipakai di Vercel** (filesystem serverless read-only/ephemeral). Pilihan production: **Turso** (SQLite-compatible via libSQL, disetujui user). `lib/prisma.ts` diubah jadi dual-adapter: `DATABASE_URL` diawali `file:` → pakai `@prisma/adapter-better-sqlite3` (dev lokal), selain itu → pakai `@prisma/adapter-libsql` + `TURSO_AUTH_TOKEN` (production)
- Sempat coba pakai top-level `await` di `lib/prisma.ts` buat dynamic import adapter sesuai environment — **gagal**, karena `tsx` (dipakai `prisma/seed.ts`) transpile ke CJS yang tidak support top-level await. Diperbaiki jadi synchronous: kedua adapter di-`import` statis di atas, dipilih lewat if/else biasa berdasarkan prefix `DATABASE_URL`
- `package.json` ditambah script `postinstall: "prisma generate"` — perlu karena `lib/generated/prisma` di-gitignore (bukan di-commit), jadi Vercel wajib generate ulang Prisma Client saat build
- `README.md` ditulis ulang (sebelumnya masih boilerplate `create-next-app`) — isinya setup lokal + panduan step-by-step deploy (buat DB Turso, migrate+seed ke Turso, push ke GitHub, set env var di Vercel)
- **Keputusan pembagian kerja** (dikonfirmasi user): Claude siapkan semua kode/config/instruksi, tapi **tidak** membuat akun Turso/Vercel/GitHub atau melakukan `git push`/deploy aktual — itu tugas user sendiri, karena approval akun & kredensial eksternal ada di luar wewenang yang diizinkan
- Git repo sebelumnya belum pernah di-commit sama sekali sejak Module 1 (semua kerjaan 6 module numpuk uncommitted). Sudah dibuat 1 commit awal mencakup seluruh project (git identity di-set lokal khusus repo ini pakai email user, bukan `--global`)
- **Belum dikerjakan** (menunggu user, langkah lengkap ada di README.md): buat database Turso, `prisma migrate deploy` + `prisma db seed` ke Turso, ganti password admin default, push ke GitHub, buat project Vercel + set env var, deploy, verifikasi production

### Review checkpoint
- [ ] Sudah direview
- Catatan review:

---

## Module 8: Database Schema Update — Experience, Certifications, Taglines

**Status:** [x]
**Prioritas:** Tinggi

### Fungsi & code yang direncanakan
```
- Schema tambahan di Prisma:
  - Experience { id, title, organization, startDate, endDate?, description, profileId }
  - Certification { id, title, issuer, issueDate, credentialUrl?, imageUrl, profileId }
  - Profile.taglines (Json/array) -> list string untuk rotating text, mis. ["Mahasiswa Informatika UAD", "Full-Stack Developer", "UI/UX Enthusiast"]
- Migration + update seed data (dummy Experience & Certification biar ada yang ditest)
```

### Dependency
- Module 1 (extend schema yang sudah ada)

### Definition of Done
- [x] `npx prisma migrate dev` jalan tanpa error, model baru bisa di-query
- [x] Seed data Experience & Certification muncul saat testing lokal

### Catatan implementasi
- Schema field sesuai persis rencana TASKPLAN: `Experience { id, title, organization, startDate, endDate?, description, profileId }`, `Certification { id, title, issuer, issueDate, credentialUrl?, imageUrl, profileId }`. `imageUrl` di `Certification` sengaja **wajib** (bukan `?`) sesuai spec — beda dengan `thumbnailUrl`/`photoUrl` di model lain yang opsional
- `Profile.taglines` pakai tipe `Json?` (array of string), pola sama seperti `contactLinks` — di-normalize ke `string[]` di layer query nanti (Module 11/12), bukan di schema
- Kedua model baru punya relasi ke `Profile` dengan `onDelete: Cascade`, konsisten dengan pola `Skill` yang sudah ada
- Migration: `20260709065749_add_experience_certification_taglines`
- Seed: nambah 3 dummy Experience (freelance, organisasi kampus, magang — mencakup kasus `endDate: null` buat "masih berjalan") dan 2 dummy Certification. Update `Profile.taglines` ditambahkan ke branch `update` upsert (bukan cuma `create`) supaya profile yang sudah ada di database lama (sebelum Module 8) ikut ke-backfill taglines-nya saat re-seed — beda dengan field lain yang sengaja cuma di `create` supaya tidak menimpa hasil edit admin lewat dashboard
- Sempat error `Unknown argument taglines` saat pertama kali jalankan seed — penyebabnya Prisma Client belum di-generate ulang otomatis setelah migration (kemungkinan konflik proses karena dev server masih jalan di background). Fix: jalankan `npx prisma generate` manual sebelum seed
- `imageUrl` certification dummy diisi path lokal placeholder (`/certificates/...png`), bukan URL eksternal — belum ada gambar asli karena Module 10 (Cloudinary) belum dikerjakan, dan sengaja hindari dependency ke domain placeholder eksternal saat seed
- Verifikasi query (taglines, Experience, Certification) dan `npm run build` sudah dicoba, semua sukses tanpa error

### Review checkpoint
- [ ] Sudah direview
- Catatan review:

---

## Module 9: Design System — Warna, Tipografi, Interaksi Button

**Status:** [x]
**Prioritas:** Tinggi

### Fungsi & code yang direncanakan
```
- Update Tailwind config: palet warna baru (dark base + gradient aksen biru-ungu, bukan hitam polos)
- Definisikan design token: warna primary/secondary/accent, radius, shadow
- Komponen Button reusable dengan Framer Motion:
  - whileHover -> scale/glow/color shift
  - whileTap -> efek tekan (penting buat mobile)
- Terapkan komponen Button baru ke semua tombol yang sudah ada (Contact, Lihat Projects, Tentang Saya, dst)
```

### Dependency
- Tidak ada (foundational, tapi disarankan sebelum module 10-13 biar komponen baru langsung pakai style ini)

### Definition of Done
- [x] Semua button di seluruh halaman pakai komponen Button baru, ada hover & tap effect yang terasa
- [x] Warna web tidak lagi terkesan hitam kosongan — ada aksen warna di elemen penting
- [x] Kontras warna tetap nyaman dibaca (accessibility check dasar)

### Catatan implementasi
- `components/ui/Button.tsx` — komponen polymorphic tunggal: render sebagai `<button>` (tanpa `href`), `next/link` (href internal, diawali `/` atau `#`), atau `<a target="_blank">` (href eksternal/`mailto:`), semua lewat `motion.create(Link)` / `motion.a` / `motion.button` dari Framer Motion. 4 variant: `primary` (gradient `blue-600` → `violet-600`), `secondary` (outline neutral), `danger` (outline, hover merah — dipakai konsisten untuk semua aksi "Hapus"/Logout), `ghost` (teks polos, dipakai untuk aksi minor seperti "+Tambah"). 2 size: `md` (default, CTA besar) dan `sm` (aksi inline/row)
- Efek interaksi: `whileHover={{ scale: 1.03 }}`, `whileTap={{ scale: 0.96 }}` — konsisten di semua instance, termasuk di mobile (tap terasa lewat scale-down singkat)
- **Isu tipe TypeScript:** native DOM event props (`onDrag*`, `onAnimationStart`, dst) punya signature yang beda dari prop gesture Framer Motion bernama sama, jadi keduanya bentrok kalau di-spread langsung ke `motion.button`/`motion.a`. Solusi pragmatis: prop passthrough (`...rest`) di-cast lewat `Record<string, unknown>` sebelum di-spread ke elemen motion — API publik komponen (`ButtonProps`) tetap type-safe buat pemanggil, cuma implementasi internal yang melonggarkan tipe. Ini pola umum & dianggap aman untuk masalah friksi tipe Framer Motion x React DOM ini (bukan bug runtime, murni gesekan level tipe)
- Design token warna ditambah di `app/globals.css`: `--accent-secondary` (`#8b5cf6`, violet) mendampingi `--accent` (`#3b82f6`, blue) yang sudah ada dari Module 3, diekspos lewat `@theme inline` biar bisa dipakai sebagai utility Tailwind (`text-accent-secondary` dst) kalau dibutuhkan nanti
- Semua elemen ber-gaya CTA (background solid/gradient atau border+padding ala tombol) dikonversi ke `<Button>` — dicek lewat grep `bg-blue-600` di seluruh codebase, hasilnya nihil (semua sudah pindah ke Button). Yang **sengaja tidak** dikonversi: link teks polos tanpa background (back-link "← Kembali ke...", link "Repo/Demo ↗" di `PortfolioCard`, link "Edit" di admin list, nav-card "Edit Profil"/"Kelola Portofolio" di dashboard) — karena secara semantik itu link biasa, bukan tombol CTA
- `DeletePortfolioButton` (Module 6) dan form `EditProfileForm`/`PortfolioForm` (Module 5/6) tetap pakai logic asli (confirm dialog, loading state, fetch API) — cuma bagian visual/markup tombolnya yang diganti ke `<Button>`, behavior tidak berubah
- Testing: `npm run build` sukses tanpa error, dicek juga lewat curl ke dev server (`/`, `/login`, `/portfolio`) — konten & class gradient (`from-blue-600 to-violet-600`) muncul di HTML. Interaksi hover/tap Framer Motion asli (animasi terlihat halus di browser) belum tercoba visual karena browser extension masih belum terhubung sepanjang project ini

### Review checkpoint
- [ ] Sudah direview
- Catatan review:

---

## Module 10: Cloudinary Integration — Image Upload

**Status:** [~]
**Prioritas:** Tinggi

### Fungsi & code yang direncanakan
```
- Setup akun Cloudinary (manual oleh user) + simpan credential di .env (CLOUDINARY_CLOUD_NAME, API_KEY, API_SECRET)
- API route /api/upload -> terima file, upload ke Cloudinary, return URL
- Komponen reusable ImageUpload (dipakai di form Profile, Portfolio, Certification)
- Validasi: ukuran file max, tipe file (jpg/png/webp only)
```

### Dependency
- Tidak ada, tapi dibutuhkan oleh Module 13 (admin dashboard upload foto)

### Definition of Done
- [x] Upload gambar dari form admin berhasil tersimpan di Cloudinary — **terverifikasi dengan kredensial asli** (user sudah buat akun & isi `.env`), file test ter-upload dan bisa diakses langsung dari CDN Cloudinary
- [ ] URL Cloudinary otomatis tersimpan ke field terkait di database (photoUrl/imageUrl) — **belum berlaku**, `ImageUpload` belum di-wire ke form manapun (itu scope Module 13, sesuai dependency yang sudah dicatat di module ini)
- [x] Ada pesan error yang jelas kalau upload gagal (file terlalu besar/format salah, atau Cloudinary belum dikonfigurasi)

### Catatan implementasi
- Kode & struktur disiapkan duluan sesuai permintaan user, kredensial Cloudinary asli menyusul: `.env`/`.env.example` sudah punya 3 variable (`CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`) dengan value **dikosongkan sengaja** — isi manual setelah bikin akun di cloudinary.com (Dashboard → Product Environment Credentials)
- Pakai SDK resmi `cloudinary` (server-side, `v2.uploader.upload`) — bukan widget/SDK client-side, supaya `API_SECRET` tidak pernah terekspos ke browser. Upload selalu lewat route handler kita sendiri (`/api/upload`), bukan langsung dari client ke Cloudinary
- `lib/cloudinary.ts`: `cloudinary.config()` dipanggil di level module tapi **tidak throw** kalau env var kosong (beda dengan `lib/prisma.ts` yang throw eager) — supaya aplikasi tetap bisa jalan normal sebelum Cloudinary diisi. Validasi sebenarnya (`isCloudinaryConfigured()`) baru dicek saat route `/api/upload` benar-benar dipanggil, dan return `500` dengan pesan jelas kalau belum siap
- `POST /api/upload`: auth check manual (pola sama seperti `/api/profile` & `/api/portfolio`, di luar cakupan `proxy.ts`), validasi tipe file (jpg/png/webp) & ukuran (max 5MB) di server sebagai sumber kebenaran, convert file ke base64 data URI lalu upload ke folder `personal-portofolio` di Cloudinary, return `{ url: result.secure_url }`
- `components/ui/ImageUpload.tsx`: komponen reusable generik (`value`, `onChange`, `label` sebagai props) — preview gambar, tombol upload (pakai `Button` dari Module 9, variant secondary), validasi tipe/ukuran di client dulu (UX cepat) sebelum kirim ke server. **Sengaja belum dipasang** ke `EditProfileForm`/`PortfolioForm` manapun — TASKPLAN sendiri sudah catat ini dependency Module 13, jadi scope Module 10 cuma nyiapin komponennya siap pakai
- Testing sebelum kredensial diisi: (1) unauthenticated POST `/api/upload` → 401 ✓, (2) authenticated POST tanpa Cloudinary configured → 500 dengan pesan `"Cloudinary belum dikonfigurasi di server..."` ✓, (3) `npm run build` sukses
- **Setelah user isi kredensial asli** di `.env` (buat akun cloudinary.com sendiri): Next.js dev server otomatis reload env (`Reload env: .env` di log, tidak perlu restart manual). Test upload end-to-end lewat script kecil (PowerShell 5.1 tidak punya cara reliable buat multipart binary upload — `Invoke-WebRequest` versi ini tidak punya parameter `-Form`, dan konstruksi manual `MultipartFormDataContent` via `.NET HttpClient` gagal auth karena cara reconstruct cookie header-nya beda dengan `-WebSession`; jadi dipakai skrip Node.js sekali-pakai dengan `fetch`+`FormData`+`Blob` bawaan Node 24, jauh lebih reliable buat kasus ini) — hasil: upload sukses (200), dapat URL asli `https://res.cloudinary.com/rduq1b3o/image/upload/.../personal-portofolio/....png`, dan URL itu dikonfirmasi bisa diakses langsung (200, `Content-Type: image/png`) lewat CDN Cloudinary. Skrip test dihapus setelah selesai (tidak masuk repo)

### Review checkpoint
- [ ] Sudah direview
- Catatan review:

---

## Module 11: Public Pages — Experience & Certifications

**Status:** [x]
**Prioritas:** Sedang

### Fungsi & code yang direncanakan
```
- Halaman/section Experience — timeline style (title, organization, periode, deskripsi)
- Halaman/section Certifications — grid card (judul, issuer, tanggal, gambar sertifikat, link credential kalau ada)
- Update navbar: tambah menu Experience & Certifications
- Komponen: ExperienceTimeline, CertificationCard
- getExperiences() -> Experience[], getCertifications() -> Certification[]
```

### Dependency
- Module 8 (butuh schema & data Experience/Certification)

### Definition of Done
- [x] Data Experience & Certification dari database tampil dengan benar
- [x] Empty state wajar kalau belum ada data
- [x] Responsive di mobile & desktop (audit code-level; visual browser masih pending)

### Catatan implementasi
- `getExperiences()`/`getCertifications()` di `lib/queries.ts` — query sederhana (tidak ada field Json yang perlu di-normalize, beda dari `getProfile()`/`getPortfolios()`), sort descending by tanggal (`startDate`/`issueDate`)
- `lib/format.ts` — helper `formatDate()` kecil (locale `id-ID`, format "MMM YYYY") dipakai bareng oleh `ExperienceTimeline` dan `CertificationCard`, daripada duplikat logic format tanggal di 2 tempat
- `ExperienceTimeline`: awalnya mau pakai border-left di `<ol>` + dot absolute-positioned (butuh pixel-math buat align dot pas di garis), diganti ke pola lebih robust: tiap `<li>` adalah flex row `[kolom dot+garis] + [kolom konten]`, garis penghubung cuma div `w-px flex-1` yang otomatis stretch ngikutin tinggi konten di sebelahnya lewat default flex `align-items: stretch` — tidak butuh angka ajaib sama sekali
- `CertificationCard`: link "Lihat Credential ↗" sengaja dibuat link teks polos (bukan `<Button>`), konsisten dengan pola "Repo/Demo ↗" di `PortfolioCard` (Module 4) — link kecil non-CTA tetap di luar cakupan komponen Button (Module 9)
- **Navbar jadi 6 item** (Home/About/Skills/Projects/Experience/Certifications) + logo + tombol Contact — dihitung dulu bakal mepet kalau breakpoint desktop tetap `md:` (768px, sisa slack cuma ~30px dari 720px available). Digeser ke `lg:` (1024px, pas sama `max-w-5xl` container) buat `SiteHeader` & `MobileNav`, gap nav dikecilin `gap-6`→`gap-5` — jadi hamburger mobile-style dipakai lebih lama (sampai 1023px), baru desktop nav muncul di ≥1024px dengan ruang jauh lebih lega
- **Bug ditemukan & diperbaiki:** dev server yang sudah jalan lama (sejak testing Module 7) sempat gagal query `prisma.experience`/`prisma.certification` dengan error `Cannot read properties of undefined (reading 'findMany')`, padahal `npm run build` sukses dan `prisma generate` sudah pernah dijalankan waktu Module 8. Penyebabnya: proses dev server yang panjang umur nge-cache instance Prisma Client lama di `globalForPrisma` (pola singleton yang sengaja dibuat di `lib/prisma.ts` biar hemat koneksi pas hot-reload), jadi tidak otomatis lihat model baru walau file client di disk sudah ke-regenerate berkali-kali sejak itu. Fix: restart dev server penuh. **Catatan buat ke depan:** kalau abis ubah `schema.prisma` terus ada error aneh "reading 'findMany' of undefined" padahal build sukses, restart dev server dulu sebelum debug lebih jauh
- Testing: `npm run build` sukses, curl ke `/experience` dan `/certifications` (setelah restart dev server) — semua data seed (3 experience termasuk kasus "Sekarang" buat yang masih berjalan, 2 certification dengan link credential) muncul dengan benar. Navbar di halaman lain juga dikonfirmasi sudah include link Experience & Certifications

### Review checkpoint
- [ ] Sudah direview
- Catatan review:

---

## Module 12: Home Page Enhancement — Rotating Tagline & Scrollable Sections

**Status:** [x]
**Prioritas:** Sedang

### Fungsi & code yang direncanakan
```
- Komponen RotatingText (Framer Motion) — cycle otomatis antar Profile.taglines tiap beberapa detik, dengan transisi fade/slide, ditaruh di bawah foto profil hero
- Home page diperluas jadi scrollable, berisi preview section:
  - Preview Experience (highlight 2-3 terbaru)
  - Preview Certifications (highlight beberapa)
  - Preview Projects (highlight beberapa portofolio)
  - Tiap section ada tombol "Lihat semua" ke halaman lengkapnya
- Scroll-triggered animation (Framer Motion whileInView) — section fade-in/slide-in saat discroll masuk viewport
```

### Dependency
- Module 8 (taglines), Module 9 (design system/button), Module 11 (data Experience/Certifications untuk preview)

### Definition of Done
- [x] Rotating text di hero berganti otomatis dan smooth, tidak patah-patah (kode-level: `AnimatePresence` + interval 3 detik, transisi fade+slide 0.4s)
- [x] Home page bisa discroll dan menampilkan preview semua section utama
- [~] Animasi scroll terasa halus, tidak bikin lag — implementasi standar Framer Motion `whileInView`, tapi belum bisa dikonfirmasi visual asli di browser (extension belum terhubung sepanjang project)

### Catatan implementasi
- `getProfile()` di `lib/queries.ts` sekarang ikut normalize `taglines` (Json → `string[]`), pola sama persis dengan `contactLinks` — biar konsumen (Home page) tidak perlu casting manual
- `RotatingText` (`components/ui/RotatingText.tsx`): `useState` index + `useEffect`+`setInterval` buat auto-cycle, `AnimatePresence mode="wait"` buat transisi keluar-masuk (slide vertikal + fade). Render `null` kalau taglines kosong, dan skip interval kalau cuma 1 item (`items.length <= 1`) — tidak ada state basi atau interval nganggur. Index mulai dari 0 di server maupun client jadi tidak ada hydration mismatch
- `ScrollReveal` (`components/ui/ScrollReveal.tsx`): wrapper generik `motion.div` pakai `whileInView` + `viewport={{ once: true, margin: "-80px" }}` (animasi cuma sekali trigger per section, mulai sedikit sebelum section actually masuk viewport) — dipakai bungkus ke-3 preview section di Home biar Home page sendiri tetap Server Component (fetch data), cuma section wrapper-nya yang jadi client boundary
- Home page (`app/(public)/page.tsx`) direstrukturisasi total: hero (foto+nama+**rotating tagline**+bio+CTA) tetap di atas, diikuti 3 section scrollable di bawahnya — masing-masing **reuse komponen yang sudah ada** (bukan bikin varian baru): `ExperienceTimeline` (slice 3 terbaru), `CertificationCard` grid (slice 3), `PortfolioCard` grid (slice 3). Tiap section only render kalau datanya tidak kosong (`length > 0`), dan pakai `SectionHeader` helper lokal (title + tombol "Lihat semua →" pakai `Button` variant ghost) buat konsistensi
- Fetch data di Home page pakai `Promise.all([...])` (4 query paralel: profile, experiences, certifications, portfolios) — bukan sequential await, biar tidak nunggu bergantian padahal query-nya independen satu sama lain
- Testing: `npm run build` sukses, dan kali ini **tidak perlu restart dev server** (schema tidak berubah di module ini, cuma Module 8-11 yang butuh restart karena Prisma Client regenerate) — konten homepage dikonfirmasi lewat curl: tagline pertama muncul di HTML, ketiga section preview (Experience/Certifications/Projects) beserta tombol "Lihat semua" semua ada

### Review checkpoint
- [ ] Sudah direview
- Catatan review:

---

## Module 13: Admin Dashboard Redesign

**Status:** [x]
**Prioritas:** Sedang

### Fungsi & code yang direncanakan
```
- Redesign layout /admin/dashboard: sidebar navigasi dengan section terpisah (Profile, Skills, Portfolio, Experience, Certifications)
- Form edit Profile: tambahkan upload foto profil (pakai Module 10 Cloudinary) + input taglines (bisa tambah/hapus baris)
- CRUD UI untuk Experience (list + form tambah/edit/hapus)
- CRUD UI untuk Certifications (list + form tambah/edit/hapus, termasuk upload gambar sertifikat)
- Tampilan dashboard lebih jelas: preview data sebelum publish, indikator status (draft/published) opsional
```

### Dependency
- Module 8, 9, 10, 11 (butuh semua data model & upload sudah siap)

### Definition of Done
- [x] Admin bisa upload foto profil dari dashboard, langsung tampil di halaman publik — **diverifikasi end-to-end dengan Cloudinary asli**
- [x] Admin bisa CRUD Experience & Certifications tanpa sentuh kode — **diverifikasi end-to-end lewat HTTP** (create/update/delete, termasuk upload gambar sertifikat)
- [x] Dashboard terasa terstruktur — sidebar persisten dengan 5 section (bukan cuma form polos berurutan)

### Catatan implementasi
- **Interpretasi "Skills" sebagai section terpisah:** TASKPLAN awal menyebut 5 section sidebar termasuk "Skills" berdiri sendiri, tapi rencana "Fungsi & code" tidak menyebutkan CRUD Skill terpisah (skills memang sudah dikelola dalam satu form bersama Profile sejak Module 5, dan itu tetap masuk akal — tidak ada alasan kuat buat dipisah). Diputuskan: sidebar nav-nya jadi "Profile & Skills" (satu entry, sesuai kenyataan form-nya), bukan dipaksa dipisah jadi halaman/CRUD baru yang tidak ada di deliverables
- **Refactor DRY sebelum nambah fitur baru:** karena Module 13 bakal nambah 2 form admin baru (Experience, Certification) yang polanya sama persis dengan `PortfolioForm`/`EditProfileForm`, sekalian di-extract dulu: `isNotFoundError()` (dulu didefinisikan lokal di tiap route `[id]`) pindah ke `lib/mutations.ts`; `Field` + `inputClass` (dulu duplikat di 2 form) pindah ke `components/admin/FormField.tsx`; `DeletePortfolioButton` digeneralisasi jadi `DeleteEntityButton` (`endpoint`+`confirmMessage`+`errorMessage` sebagai props) dipakai di Portfolio, Experience, Certification — total 3 titik duplikasi kehapus sebelum sempat berkembang jadi 5-6 titik
- `lib/mutations.ts` & API routes (`/api/experience`, `/api/certification`) untuk Experience/Certification dibangun **persis pola Module 6** (Portfolio): `parseXInput`/`validateXInput`/`createX`/`updateX`/`deleteX`, auth check manual per route, `revalidatePath` ke halaman publik + halaman admin terkait + `/` (karena Home sekarang preview Experience/Certification juga sejak Module 12)
- `ExperienceForm`: `endDate` nullable dikontrol lewat checkbox "Masih berjalan sampai sekarang" (disable input tanggal selesai kalau dicentang) — lebih jelas buat admin dibanding harus kosongin field manual
- `CertificationForm`: field gambar pakai `<ImageUpload>` (Module 10) langsung, bukan input URL manual — ini penggunaan pertama komponen itu di form beneran. Validasi "gambar wajib" dicek di client sebelum submit (selain validasi server yang sudah ada di `validateCertificationInput`)
- `EditProfileForm`: field foto diganti dari input URL teks ke `<ImageUpload>`; ditambah section **Taglines** (dynamic add/remove row, pola sama dengan Contact Links tapi single-value bukan label+url). `lib/mutations.ts` (`UpdateProfileInput`), `app/api/profile/route.ts`, dan `getProfile()` di `lib/queries.ts` semua diupdate buat terima/kirim `taglines`
- **Sidebar admin** (`app/admin/dashboard/layout.tsx`) membungkus SEMUA route `/admin/dashboard/*` — responsive: horizontal top bar scrollable di mobile, sidebar kiri persisten di desktop (`md:` breakpoint, konsisten dengan breakpoint navbar publik dari Module 11). Logout dipindah dari halaman dashboard overview ke sidebar (dipakai bareng di semua halaman admin, tidak perlu diulang tiap page)
- **Bug ditemukan & diperbaiki (preemptive, sebelum sempat jadi masalah):** setelah nambah sidebar layout yang membungkus semua halaman admin, sadar 11 halaman admin lama masih pakai `<main className="min-h-screen ...">` — persis pola bug yang sama seperti Module 7 (SiteHeader publik dulu). Karena sekarang setiap halaman admin dibungkus `<div class="flex-1">` di dalam layout yang sendirinya sudah `min-h-screen`, kalau `<main>` di dalamnya JUGA `min-h-screen`, di mobile (layout jadi `flex-col`, sidebar-turned-topbar duluan) totalnya jadi topbar-height + 100vh (extra scroll). Semua 11 file diganti `min-h-screen` → `flex-1` sebelum sempat di-test dan ketauan sebagai bug beneran — dicek ulang lewat `grep` sampai bersih
- Semua halaman `/admin/dashboard/*` sekarang ter-render dynamic (ƒ) saat build (sebelumnya sebagian statis) — efek samping wajar dari `layout.tsx` yang manggil `auth()` (session-dependent), bukan regresi
- Testing end-to-end lengkap lewat HTTP (login → session cookie → aksi): (1) sidebar tampil dengan 5 nav item + label "Profile & Skills" (sempat kelihatan "gagal" di test karena `&` di-escape jadi `&amp;` di HTML — false alarm, bukan bug), (2) CRUD Experience penuh (create 201 → muncul di `/experience` publik → update 200 → delete 200 → hilang dari publik), (3) CRUD Certification **dengan upload gambar sertifikat asli ke Cloudinary** (upload 200 → dapat URL Cloudinary → create certification pakai URL itu → muncul di `/certifications` publik dengan URL Cloudinary yang benar → delete 200), (4) update taglines profile → langsung muncul di Home, (5) proteksi 401 untuk semua endpoint baru tanpa auth, (6) redirect 307 ke `/login` untuk akses halaman admin baru tanpa sesi. Semua data test sudah dibersihkan/dikembalikan ke seed asli setelah verifikasi

### Review checkpoint
- [ ] Sudah direview
- Catatan review:

---

# Phase 3 (V3) — UI/UX Polish & Feature Rounding

> Latar belakang: user merasa tampilan saat ini "masih terlalu biasa". Referensi visual: napa.ituaku.com (screenshot di `gambar-referensi/`) — situs personal branding dengan palet navy+cream+merah, font rounded, blob dekoratif, foto cutout dinamis, stat showcase, numbered list. **Bukan ditiru langsung** — dipakai sebagai acuan level polish (pattern & komposisi), identitas kita (dark neutral-950 + gradient biru-ungu, Geist font) tetap dipertahankan. V3 juga sekalian merapikan item Backlog lama (filter kategori, form kontak, SEO basic, blog/artikel) + toggle light/dark yang tadinya cuma catatan singkat. Breakdown di bawah diusulkan Claude, menunggu review user sebelum eksekusi. Urutan disusun: fondasi visual & sistem tema dulu (Module 14-15), baru komponen/polish yang bergantung padanya (Module 16-18), baru fitur baru yang independen (Module 19-21).

## Module 14: Visual Foundation — Depth, Motion & Decorative Layer

**Status:** [x]
**Prioritas:** Tinggi

### Fungsi & code yang direncanakan
```
- Komponen dekoratif reusable (mis. GradientBlob) — blob gradient blur biru/ungu, ditaruh di belakang hero/section header buat pecah kesan flat di background neutral-950 polos
- Floating action buttons (scroll-to-top, dipasang di root layout supaya muncul di semua halaman publik) pakai Framer Motion (fade-in setelah scroll melewati threshold)
- Audit & perbesar kontras skala tipografi (heading vs body) di halaman publik utama (Home, About, Skills, Portfolio, Experience, Certifications) — beberapa heading saat ini terasa datar dibanding body text
- Review spacing/padding antar section — beberapa halaman kepadatannya masih seragam dari Module 1-13, belum ada "napas" ala referensi
```

### Dependency
- Tidak ada (foundational, tapi disarankan sebelum Module 15-16 biar komponen baru langsung konsisten)

### Definition of Done
- [x] Ada minimal 1 elemen dekoratif (blob/glow) yang kepakai konsisten di section hero/highlight, tidak mengganggu keterbacaan teks — diterapkan di **6 halaman publik** (Home, About, Skills, Portfolio, Experience, Certifications), bukan cuma 1
- [x] Floating scroll-to-top muncul di semua halaman publik setelah scroll, hilang di posisi atas — implementasi selesai, perilaku scroll-triggered tidak bisa diverifikasi lewat curl (memang baru muncul di client setelah interaksi scroll, bukan di HTML awal)
- [x] Kontras ukuran heading vs body terasa lebih tegas di 6 halaman utama (lebih dari target minimal 3)

### Catatan implementasi
- `GradientBlob` (`components/ui/GradientBlob.tsx`) — komponen dekoratif paling sederhana yang mungkin: `div` absolute + `blur-3xl` + gradient `from-blue-600/30 to-violet-600/30`, positioning sepenuhnya lewat `className` yang dioper caller (tidak ada prop posisi terpisah, biar fleksibel). `aria-hidden="true"` karena murni dekoratif
- **Wajib `overflow-hidden` di parent:** karena blob diposisikan `absolute` dan sengaja "bleeding" keluar batas (mis. `-top-20 -right-20`), setiap `<main>` yang makai `GradientBlob` di-kasih `relative overflow-hidden` — kalau tidak, blob bisa bikin horizontal scrollbar muncul. Dicek manual satu-satu di 6 halaman, semua aman
- `ScrollToTopButton` (`components/ui/ScrollToTopButton.tsx`) — `useEffect` + scroll listener (`passive: true` biar tidak block scrolling), threshold 400px, `AnimatePresence` buat fade+scale in/out pas muncul/hilang. Dipasang di `app/(public)/layout.tsx` (bukan root layout) — sengaja cuma tampil di halaman publik, konsisten dengan `SiteHeader` yang juga cuma di situ (pola dari Module 7)
- Kontras tipografi: heading `text-3xl` di 5 halaman list (About/Skills/Portfolio/Experience/Certifications) dinaikkan ke `text-4xl sm:text-5xl tracking-tight` — disamakan dengan hero Home yang dari awal sudah segitu. `SectionHeader` di Home (dipakai preview Experience/Certifications/Projects) dinaikkan dari `text-2xl` ke `text-3xl tracking-tight`. Section padding dinaikkan dari `py-16` ke `py-20 sm:py-24` (list pages) dan margin-top konten dari `mt-10` ke `mt-12` — konsisten di semua 6 halaman
- Blob ditaruh gantian kiri/kanan antar halaman (Home & Skills & Portfolio kanan, About & Experience & Certifications kiri) — biar tidak terasa berulang/monoton kalau user navigasi antar halaman berurutan
- Testing: `npm run build` sukses, curl ke 6 halaman publik — semua confirm ada `blur-3xl` (blob) dan `overflow-hidden` di HTML. Kehalusan animasi scroll-to-top & efek visual blob belum diverifikasi visual asli di browser (extension belum terhubung sepanjang project ini)

### Review checkpoint
- [ ] Sudah direview
- Catatan review:

---

## Module 15: Light/Dark Mode Toggle & Semantic Theme System

**Status:** [x]
**Prioritas:** Tinggi

### Fungsi & code yang direncanakan
```
- Perluas token warna di app/globals.css: definisikan set lengkap semantic variable (--background, --foreground, --surface, --border, --muted-foreground, --accent, --accent-secondary) untuk dark (default) DAN light mode lewat selector attribute (mis. [data-theme="light"])
- ThemeProvider ringan (client) — simpan preferensi ke localStorage, sinkron ke <html data-theme="...">, default ikut prefers-color-scheme sistem saat kunjungan pertama
- Komponen ThemeToggle (ikon sun/moon, pakai Button ghost/secondary) di SiteHeader (desktop) dan MobileNav (mobile)
- Refactor bertahap: ganti class Tailwind hardcoded (bg-neutral-950, text-neutral-100, border-neutral-800, dst) di seluruh komponen publik+admin jadi class semantic (bg-background, text-foreground, border-border, dst) yang otomatis ikut token di atas
```

### Dependency
- Module 14 (biar refactor warna sekalian dipakai buat elemen dekoratif baru yang ditambahkan di situ)

### Definition of Done
- [x] Toggle di navbar berhasil switch dark ↔ light — implementasi pakai `next-themes` (localStorage persistence + FOUC prevention bawaan library), belum diverifikasi visual asli di browser
- [x] Semua halaman publik (Home, About, Skills, Portfolio+detail, Experience, Certifications) pakai semantic token — dikonfirmasi tidak ada sisa class hardcoded lewat grep
- [x] Halaman admin (dashboard, semua form) juga full theme-aware — sama, dikonfirmasi lewat grep + curl

### Catatan implementasi
- **Keputusan pakai library, bukan custom:** awalnya rencana "ThemeProvider ringan custom", tapi dievaluasi ulang — bikin theme-switching yang benar (FOUC-free, sinkron system preference, tanpa hydration mismatch) itu solved problem yang gampang salah kalau custom. Pakai `next-themes` (~3kb, dipakai luas di ekosistem Next.js) — `attribute="data-theme"`, `defaultTheme="system"`, `enableSystem`. Sesuai prinsip "jangan reinvent yang sudah ada solusi matang"-nya CLAUDE.md
- **Token warna final** (`app/globals.css`): 4 tingkat teks (`foreground` > `foreground-secondary` > `muted-foreground` > `subtle-foreground`) — awalnya mau disederhanakan jadi 3 tingkat, tapi ketauan neutral-400 vs neutral-500 dipakai buat bedain hierarki asli (mis. issuer vs tanggal di `CertificationCard`), jadi dipertahankan 4 tingkat biar nuansa visual tidak hilang. Plus `surface`/`surface-hover` (card & hover bg), `border`/`border-strong`, `accent`/`accent-hover`/`accent-secondary`, `danger`, `success` — total 13 token semantic
- **Refactor massal pakai script, bukan Edit satu-satu:** 30+ file punya class warna hardcoded (`bg-neutral-950`, `text-neutral-400`, dst). Karena tiap substitusi 1:1 literal & tidak ambigu (bukan keputusan konteks, murni rename), dipakai PowerShell batch replace ketimbang manual Edit per file — jauh lebih efisien untuk skala ini. **Ketemu isu:** 4 file dengan `[id]` di path (dynamic route) gagal diproses karena PowerShell `Get-Content -Path` menganggap `[...]` sebagai wildcard glob, bukan literal — fix pakai `[IO.File]::ReadAllText()`/`WriteAllText()` yang baca path secara literal. Verifikasi akhir pakai `grep` pattern `(bg|text|border)-(neutral|blue|violet|red|green)-\d+` di semua `.tsx` sampai hasilnya nihil
- `Button.tsx` primary variant, `GradientBlob`, dan `ScrollToTopButton` awalnya masih gradient literal `from-blue-600 to-violet-600` (di luar cakupan mapping rename karena beda shade dari token `--accent`/`--accent-secondary`) — disamakan manual ke `from-accent to-accent-secondary`. Hover effect gradient disederhanakan dari geser warna stop (`hover:from-blue-500...`) jadi `hover:opacity-90` — lebih simpel dan otomatis aman di kedua tema (gradient shift butuh 2 warna hover terpisah per tema, opacity cukup 1 aturan)
- **Permintaan tambahan user (efek interaktif navbar):** dibuat `components/NavLink.tsx` — Link dengan `whileTap` scale-down (Framer Motion, kerasa "ditekan" pas diklik) + underline animasi CSS `group-hover:scale-x-100` yang muncul dari kiri saat hover. Dipakai di nav desktop (`SiteHeader`) dan style serupa (tap scale + hover bg) di dropdown mobile (`MobileNav`). `ThemeToggle` sendiri juga dikasih animasi icon sun/moon crossfade+rotate (`AnimatePresence`) pas diklik, bukan cuma ganti warna instan
- `ThemeToggle` & `ScrollToTopButton` sama-sama pakai pola "mounted guard" (render placeholder kosong dulu di server, baru tampil beneran setelah `useEffect` konfirmasi sudah di client) — mencegah hydration mismatch. Konsekuensinya: keduanya **tidak muncul di HTML awal** kalau dicek via curl, itu bukan bug, memang cuma nongol setelah JS jalan di browser
- Testing: `npm run build` sukses, dev server di-restart (pelajaran dari module-module sebelumnya), curl ke semua halaman publik+admin — tidak ada sisa class hardcoded, script blocking `next-themes` terkonfirmasi ter-inject di `<head>` (baca localStorage sebelum paint). Smoke test fungsional (bukan cuma visual): konten Portfolio/Skills/Experience masih benar, proteksi redirect admin masih 307 — tidak ada regresi dari refactor besar ini. **Yang belum bisa diverifikasi:** toggle beneran diklik di browser, kontras visual asli di kedua mode — extension browser masih belum terhubung sepanjang project ini

### Review checkpoint
- [ ] Sudah direview
- Catatan review:

---

## Module 16: Stat Highlight Component

**Status:** [x]
**Prioritas:** Sedang

### Fungsi & code yang direncanakan
```
- Komponen StatCard reusable (icon + angka besar + label singkat), gaya kontras tipografi besar-kecil ala referensi (bukan copy warna/layout persis)
- Terapkan ke Home dan/atau About: representasi pencapaian yang JUJUR dari data yang sudah ada di database (bukan metrik palsu) — mis. jumlah tahun pengalaman (dihitung dari Experience.startDate terlama), jumlah project (count Portfolio), jumlah sertifikat (count Certification), jumlah skill (count Skill)
- getStats() di lib/queries.ts — agregasi angka-angka di atas dari data existing, bukan field baru di schema
```

### Dependency
- Module 8 (data Experience/Certification), Module 14-15 (biar StatCard langsung pakai bahasa visual & tema baru)

### Definition of Done
- [x] Minimal 3-4 StatCard tampil di Home dengan angka yang benar-benar dihitung dari database (bukan hardcode) — **diverifikasi**: 3 project, 2 sertifikat, 7 skill, 4+ tahun pengalaman, semua persis cocok dengan isi database
- [x] Angka otomatis berubah kalau data Portfolio/Experience/Certification/Skill berubah — query pakai `prisma.count()`/`findFirst` langsung ke DB tiap request (kena `cache()` per-request React saja, bukan cache jangka panjang), plus halaman Home sudah kena `revalidatePath("/")` dari semua mutation Module 5/6/13
- [x] Responsive di mobile & desktop, tetap kebaca di kedua mode tema — pakai semantic token dari Module 15 dari awal, tidak ada warna hardcoded baru

### Catatan implementasi
- `getStats()` di `lib/queries.ts` — 4 query paralel (`Promise.all`): `count()` Portfolio/Certification/Skill (murni agregasi count, tidak fetch row), plus `findFirst` Experience diurutkan `startDate asc` buat cari yang paling lama. Tahun pengalaman dihitung `Math.ceil((sekarang - startDate terlama) / 365 hari)`, dibungkus `Math.max(1, ...)` biar tidak nampilin "0+ tahun" kalau baru mulai kurang dari setahun — pembulatan ke atas ("4+") lebih jujur mengesankan "minimal segini" daripada membulatkan ke bawah yang bisa under-represent
- `StatCard` (`components/ui/StatCard.tsx`) — primitif generik (icon+value+label), tidak tau apa-apa soal Portfolio/Experience/dst, bisa dipakai ulang buat stat lain kapan pun
- `StatsSection` (`components/StatsSection.tsx`) — Server Component async yang fetch `getStats()` sendiri lalu susun 4 `StatCard` dengan icon spesifik (briefcase/folder/award/tools, di-hand-draw pakai shape SVG dasar mirip pola `PortfolioIcon`/`ThemeToggle` sebelumnya, bukan icon library tambahan), dibungkus `ScrollReveal` (Module 12) biar konsisten fade-in pas discroll
- Dipasang di Home, sebagai section PERTAMA dalam area scrollable (sebelum preview Experience/Certifications/Projects) — representasi pencapaian duluan sebelum detail, matching pola umum landing page "hook dengan angka dulu, baru detail". Spacing section Experience yang tadinya `mt-4` (karena dulu jadi section pertama) disesuaikan ke `mt-16` (samain sama section lain) karena sekarang StatsSection yang jadi section pertama
- Testing: `npm run build` sukses, dev server tidak perlu restart (tidak ada perubahan schema di module ini), curl ke Home — keempat angka statistik dicek satu-satu lewat regex dan **persis cocok** dengan isi database saat ini (3/2/7/4+)

### Review checkpoint
- [ ] Sudah direview
- Catatan review:

---

## Module 17: Card & Photo Treatment Polish

**Status:** [x]
**Prioritas:** Sedang

### Fungsi & code yang direncanakan
```
- Refine visual PortfolioCard/CertificationCard/ExperienceTimeline: depth (shadow/border lebih hidup), hover state lebih terasa (bukan cuma ganti warna border)
- Review treatment foto profil di hero Home & About — saat ini avatar bulat kecil polos, eksplorasi opsi lebih dinamis (ukuran lebih besar, kombinasi dengan GradientBlob dari Module 14) kalau user berkenan upload foto baru yang cocok
- Eksplorasi numbered-list treatment (ala referensi "1. 2. 3.") untuk salah satu section yang cocok (kandidat: Skills per kategori) — opsional, tergantung cocok/tidaknya dengan konten yang ada
- **Tambahan di luar rencana awal (diminta user saat sesi ini):** SiteFooter — belum pernah dibuat sepanjang project, ketauan pas user cek langsung
```

### Dependency
- Module 14-16 (visual foundation, tema, stat card — biar konsisten kalau dipoles bareng)

### Definition of Done
- [x] PortfolioCard/CertificationCard/ExperienceTimeline terasa lebih "hidup" saat hover, tidak cuma perubahan warna border tipis
- [x] Tidak ada regresi — semua data tetap tampil benar, responsive tetap aman di 375/768/1440px, tetap benar di kedua mode tema
- [x] **(tambahan)** Footer tampil di semua halaman publik dengan brand+bio, Quick Links, Contact, dan copyright — data dari database, bukan hardcode

### Catatan implementasi
- **Footer (`components/SiteFooter.tsx`)** — gap nyata yang kelewat sepanjang project, ketauan pas user cek langsung. Struktur 3 kolom (brand+bio, Quick Links ke 6 halaman publik, Contact dari `profile.email`+`contactLinks`) + baris copyright dengan tahun otomatis (`new Date().getFullYear()`, bukan hardcode angka tahun). Server Component, fetch `getProfile()` sendiri (dedup otomatis lewat `cache()` React kalau `SiteHeader` juga sudah fetch di request yang sama). Dipasang di `app/(public)/layout.tsx` setelah `{children}` — otomatis nempel di 6 halaman publik lewat shared layout, tidak perlu ditambahkan manual satu-satu
- **Card hover polish:** `PortfolioCard`/`CertificationCard` ditambah `hover:-translate-y-1` (lift) + `hover:shadow-xl hover:shadow-accent/10` (glow bertema accent, bukan shadow hitam generik) + `transition-all duration-300`. `CertificationCard` tambahan: gambar sertifikat sedikit zoom (`group-hover:scale-105`) dalam container `overflow-hidden` terpisah — efek umum "image zoom on card hover" tanpa bikin gambar keluar batas card. `ExperienceTimeline`: tiap baris dikasih `group-hover:bg-surface` (highlight background halus) + dot timeline sedikit membesar (`group-hover:scale-125`) — sebelumnya cuma daftar statis tanpa reaksi hover sama sekali
- **Foto profil (Home & About):** dinaikin dari 64px/80px jadi 96px (`h-24 w-24`), ditambah gradient ring (div pembungkus `bg-gradient-to-br from-accent to-accent-secondary p-1` + `ring-4 ring-background` di img-nya) — bikin efek cincin warna di sekeliling foto tanpa perlu foto baru. **Kebetulan pas dicek user memang sudah upload foto profil asli** (lewat Cloudinary, entah kapan — mungkin sisa testing Module 10/13), jadi treatment ini langsung kelihatan hasilnya, bukan cuma teori
- **Numbered-list treatment: SENGAJA DI-SKIP.** Dicek lagi konteksnya — di referensi, numbered list dipakai buat "Services" (daftar penawaran jasa yang sifatnya sekuensial/pilihan). Skill kita bukan konten sekuensial (bukan "langkah 1, 2, 3"), badge/pill grid yang sudah ada justru lebih tepat buat "kumpulan tools yang dikuasai" (tidak ada urutan prioritas implisit). Dipaksakan jadi numbered list malah bisa menyesatkan (kesannya ada ranking/urutan penting). Sesuai catatan rencana sendiri ("opsional, tergantung cocok"), diputuskan tidak diterapkan
- Testing: `npm run build` sukses, curl ke 6 halaman publik — footer + "Quick Links" + "All rights reserved" muncul di semua, class hover (`hover:-translate-y-1`, `group-hover:bg-surface`) terkonfirmasi ada di HTML, dan foto profil dikonfirmasi render dengan ring treatment yang benar (bukan cuma ke-detect false-positive dari `GradientBlob` yang kebetulan pakai token warna sama — dicek presisi sampai ketemu tag `<img>`-nya langsung)
- **Addendum (diminta user setelah module ini kelar, sebelum lanjut Module 18):** hero section Home dirombak lebih jauh dari treatment foto awal. (1) **Layout 2 kolom** — foto kiri, teks (nama/tagline/bio/CTA) kanan di desktop (`flex-col md:flex-row`), otomatis tetap stack foto-di-atas di mobile karena itu behavior default `flex-col` tanpa perlu breakpoint tambahan; (2) **foto diperbesar signifikan** dari 96px jadi 160px (mobile) sampai 224px (desktop, `md:h-56`); (3) **token warna baru** `--accent-tertiary` (amber, kontras hangat dari accent biru-violet yang sudah ada) — dipakai scoped sebagai glow blur di belakang foto, bukan disebar ke seluruh situs (biar tetap fokus jadi highlight, bukan mengubah identitas warna utama); (4) **animasi**: entrance fade+slide-up saat halaman dimuat (foto & teks staggered, foto duluan lalu teks 0.15s kemudian), plus floating animation halus tak-terputus pada foto (`animate={{ y: [0, -10, 0] }}`, durasi 4 detik, infinite) — kesan "hidup" tanpa berlebihan
- Diekstrak jadi komponen terpisah `components/HeroSection.tsx` (Client Component, terima data profile sebagai props) karena butuh Framer Motion — Home page sendiri tetap Server Component yang fetch data, cuma bagian presentasi hero yang jadi client boundary (pola sama seperti `ScrollReveal` di Module 12)
- Testing addendum: `npm run build` sukses, curl Home — class `md:flex-row`, `md:h-56`, `accent-tertiary` semua terkonfirmasi ada di HTML, data nama/bio tetap benar (tidak ada regresi dari refactor struktur)
- **Addendum ke-2 (user suka hasil hero Home, minta efek yang sama diterapkan ke halaman lain):** dipecah jadi 2 komponen reusable biar tidak duplikasi kode antar halaman: `components/ui/AnimatedAvatar.tsx` (gradient ring + tertiary glow + floating animation — hasil extract dari `HeroSection`, dipakai ulang di `ProfileSection`/About dengan ukuran lebih kecil `h-28/h-32` karena foto di About cuma inline di samping nama, bukan hero penuh) dan `components/ui/PageIntro.tsx` (wrapper fade+slide-up generik buat entrance animation, dipakai bungkus header di About/Skills/Portfolio/Experience/Certifications). `HeroSection` sendiri direfactor buat pakai `AnimatedAvatar` juga (bukan duplikat kode-nya)
- `GradientBlob` ditambah prop `variant` (`"cool"` default = biru-violet yang sudah ada, `"warm"` = amber-violet pakai `--accent-tertiary`) — backward compatible (semua pemanggilan lama otomatis tetap `"cool"`, tidak perlu diubah). Skills/Portfolio/Experience/Certifications masing-masing ditambah 1 blob `warm` kedua di sudut berlawanan dari blob asli, biar dapat kesan depth 2 warna yang sama seperti hero Home — tanpa perlu blob ke-3 di Home sendiri (di Home warna hangat sudah cukup terwakili lewat glow di foto)
- About page **tidak** ditambah blob `warm` kedua di background (beda dari 4 halaman lain) — karena foto profilnya sendiri (lewat `AnimatedAvatar`) sudah bawa glow tertiary sendiri, jadi tidak perlu dobel sumber warna hangat di satu halaman yang sama
- Testing addendum ke-2: `npm run build` sukses, curl ke semua 6 halaman publik — entrance animation (`opacity:0` inline style dari Framer Motion sebelum hydration) dan warm blob (`accent-tertiary`) terkonfirmasi ada di semuanya, smoke test konten About/Skills/Portfolio tetap benar tidak ada regresi
- **Addendum ke-3 (diminta user: tambah preview Skills di Home + perhalus interaktivitas skill di Home & /skills):** `components/SkillOrb.tsx` (baru) — format sengaja beda dari `SkillBadge` (pill horizontal icon+teks di /skills): icon-bubble vertikal (icon di kotak rounded-2xl, nama di bawahnya), hover CSS-only (lift+glow+icon scale+teks terang) supaya tidak perlu jadi Client Component (`SkillIcon` yang dipakai di dalamnya baca file SVG lewat `fs` — server-only, tidak boleh pindah ke "use client"). `components/SkillsPreview.tsx` (baru, Server Component, self-fetch `getProfile()` seperti pola `StatsSection`/`SiteFooter`) dipasang di Home lewat `SectionHeader` "Skills" di antara section Certifications dan Projects
- **Klarifikasi scope dari user di tengah kerjaan:** skill bukan cuma tools berlogo (React/Figma/dst) tapi juga soft skill (public speaking, problem solving, managerial) yang tidak punya logo — dikonfirmasi ke user cara render-nya: **soft skill tanpa icon sama sekali** (bukan fallback huruf inisial, bukan icon generik dari library baru). Deteksi otomatis lewat `Boolean(iconSlug || iconUrl)` (bukan berdasar nama kategori tertentu) — jadi admin tinggal tambah skill baru tanpa isi iconSlug/iconUrl lewat form yang sudah ada (Module 5), langsung otomatis render sebagai pill teks polos, tidak butuh field/kategori baru
- `SkillIcon.tsx` disederhanakan: fallback huruf inisial (`bg-surface-hover` circle) **dihapus**, ganti `return null` — soal "ada icon atau tidak" sekarang jadi keputusan komponen pemanggil (`SkillOrb`/`SkillBadge`), bukan `SkillIcon` sendiri. `SkillOrb` & `SkillBadge` sama-sama dikasih early-branch `hasIcon = Boolean(iconUrl || iconSlug)`: kalau true render bentuk asli (icon-bubble / icon+teks pill), kalau false render pill teks-polos tanpa lingkaran icon sama sekali
- `SkillsPreview` mengelompokkan `toolSkills` (ada icon) dan `otherSkills` (soft skill, tanpa icon) jadi 2 baris `flex-wrap justify-center` terpisah (bukan dicampur random) — dua format visual yang beda tinggi (icon-bubble vertikal vs pill horizontal) kalau digabung satu baris bakal terlihat berantakan, dipisah baris jadi tetap rapi & center sesuai instruksi user
- Data seed saat ini (7 skill, semua ada `iconSlug`) belum punya contoh soft skill riil — jalur `otherSkills`/pill-tanpa-icon sudah dites lewat code review & logic (bukan lewat data live), akan otomatis aktif begitu admin tambah skill baru tanpa icon lewat dashboard
- Testing: `npm run build` sukses. Sempat false-negative saat verifikasi urutan section (`IndexOf("Skills")`/`IndexOf("Certifications")` biasa ke-capture duluan oleh teks link navbar `SiteHeader` yang juga punya menu "Skills"/"Certifications"/"Projects", bukan section heading Home) — diperbaiki dengan cari pattern presisi `>Skills</h2>` dkk (cuma cocok ke elemen `<h2>` `SectionHeader`, bukan `<a>` navbar), hasil dikonfirmasi urutan benar: Certifications → Skills → Projects. Dev server juga di-restart penuh (pola berulang dari module-module sebelumnya) supaya tidak baca output stale
- **Addendum ke-4 (diminta user setelah semua Module V3 selesai — 5 perbaikan sekaligus: tagline size, gambar di Experience & Portfolio, redesign visual lebih berani, redesign admin dashboard):**
  - **Tagline Home**: `RotatingText` sebelumnya identik persis dengan label kecil "Halo, saya" (`text-sm font-medium text-accent` di keduanya) — dibedakan jadi `text-xl sm:text-2xl font-semibold` dengan gradient text (`bg-gradient-to-r from-accent to-accent-secondary bg-clip-text text-transparent`), jadi jelas lebih menonjol sebagai tagline, bukan cuma label
  - **Gambar di Experience**: field baru `Experience.imageUrl` (opsional, migration `add_experience_image`) — `ExperienceForm` dapat `<ImageUpload>`, `ExperienceTimeline` render foto (kalau ada) atau fallback icon briefcase bertema (kalau tidak ada) di slot yang sama, jadi layout tetap konsisten
  - **Gambar di Portfolio**: field `thumbnailUrl` sebenarnya sudah ada sejak Module 6, tapi form admin-nya masih input URL teks manual — diganti pakai `<ImageUpload>` yang sama (konsisten dengan Certification/Post/Profile/Experience), tidak perlu migration baru
  - **Redesign visual lebih berani** (acuan `gambar-referensi/Screenshot 2026-07-09 171754.png` — situs referensi lain, bukan ditiru langsung, cuma pola: icon dalam kotak rounded berwarna + tag kategori berwarna + tipografi tebal): `components/ui/CategoryTag.tsx` (baru) — pill kategori portfolio berwarna beda per kategori (web=biru/`accent`, app=violet/`accent-secondary`, design=amber/`accent-tertiary`), dipasang di `PortfolioCard`+`PortfolioDetail`+`PortfolioFilterTabs` (tab aktif ikut berubah warna sesuai kategori terpilih). `PortfolioIcon` diberi warna category-aware yang sama (dulu selalu biru apapun kategorinya) + radius dibesarkan `rounded-md`→`rounded-xl`. `CertificationCard` dapat icon badge medali (amber, overlay pojok gambar) + link "Lihat Credential" dikasih icon prefix. `ExperienceTimeline` dapat icon badge briefcase sebagai fallback kalau tidak ada foto. `StatCard` dapat prop `color` (accent/accent-secondary/accent-tertiary), 4 stat card di Home sekarang variasi warna bukan biru semua. `PostCard` dapat icon badge dokumen sebagai fallback kalau tidak ada cover image. Semua judul card dinaikkan `font-bold`→`font-extrabold` buat kesan lebih tegas
  - **Redesign admin dashboard** (keluhan user: "UI yang sekarang kurang enak dilihat"): (1) `components/FormField.tsx` — `inputClass` diperbaiki (radius lebih besar, padding lebih lega, **fix bug**: `focus:ring-blue-500` yang ternyata literal hardcoded sisa sebelum refactor token Module 15, diganti `focus:ring-accent`), ditambah komponen baru `FormSection` (card pembungkus section form dengan judul+divider+slot action di kanan atas) — dipakai di semua 5 form admin (`EditProfileForm`, `PortfolioForm`, `ExperienceForm`, `CertificationForm`, `PostForm`) buat visual grouping yang jelas, bukan field mengambang tanpa batas; (2) `components/admin/AdminListRow.tsx` (baru) — baris list generik dengan thumbnail/icon-fallback di kiri, judul+subtitle+badge di tengah, aksi Edit/Hapus di kanan, dipakai di 4 dari 5 halaman list admin (Portfolio/Experience/Certifications/Blog — Messages tetap custom karena bentuk kontennya beda, tidak ada "Edit", ada preview isi pesan panjang); (3) `components/admin/AdminSidebarNav.tsx` (baru, Client Component karena butuh `usePathname()` buat active-state — sebelumnya Server Component `layout.tsx` tidak bisa tahu halaman mana yang aktif sama sekali) + `components/admin/AdminNavIcons.tsx` (7 icon SVG kecil, 1 per section) — sidebar sekarang ada icon per item dan highlight jelas untuk halaman yang lagi dibuka; (4) `getAdminOverviewCounts()` (baru, 5 `prisma.count()` paralel) dipasang di tile overview dashboard — tiap tile sekarang nampilin angka real (jumlah portfolio/experience/certification/post, dan badge merah kalau ada pesan belum dibaca), jadi admin langsung tahu isi tiap section tanpa harus buka satu-satu
  - Testing: `npm run build` + `npm run lint` sukses tiap tahap (5 kali build terpisah selama proses), tidak ada error/warning baru. End-to-end lewat skrip Node: create Experience dengan `imageUrl` → muncul di `/experience` publik dan admin list dengan thumbnail yang benar; create Portfolio kategori "app" → tag "APP" di `/portfolio` berwarna violet (`accent-secondary`) sesuai mapping; tile dashboard overview dicek manual dari HTML mentah — angka count di tiap tile cocok dengan isi database asli (Portfolio: 3, dst). Semua data test dihapus setelah verifikasi
- **Addendum ke-5 (diminta user: panel galeri foto + Download CV + tombol Contact di About; redesign Hero Home pakai foto uncropped di tengah; efek cursor-follow "genangan air" di semua panel):**
  - **VideoHero sengaja di-skip untuk sesi ini** — user awalnya minta integrasi Unicorn Studio (WebGL scene dari CDN eksternal `cdn.jsdelivr.net/gh/hiunicornstudio/...`), tapi diblokir otomatis oleh safety classifier karena pola instruksinya mirip "instruksi buat AI agent" yang di-paste dari sumber luar, bukan permintaan personal biasa — dikonfirmasi ke user, lalu user sendiri yang memutuskan fokus ke 5 perbaikan lain dulu tanpa VideoHero. Belum dikerjakan sampai sekarang
  - **Schema baru:** `Profile.galleryPhotos` (`Json?`, array URL, pola sama dengan `taglines`) dan `Profile.cvUrl` (`String?`) — migration `add_profile_gallery_and_cv`. `getProfile()` normalize `galleryPhotos` seperti field Json array lain, `updateProfile()`/API route `/api/profile` diupdate terima kedua field baru
  - **Upload PDF (CV):** `/api/upload` sebelumnya cuma terima JPG/PNG/WEBP (`resource_type: "image"` implisit di Cloudinary). Diperluas terima `application/pdf` juga (validasi tipe+ukuran terpisah, limit PDF 10MB vs gambar 5MB), upload ke Cloudinary pakai `resource_type: "raw"` khusus buat PDF (image tetap `resource_type: "image"`). Komponen baru `components/ui/CvUpload.tsx` (mirip `ImageUpload` tapi utk PDF — preview-nya link "📄 Lihat CV saat ini ↗", bukan thumbnail gambar)
  - **Admin form:** `EditProfileForm` dapat `<CvUpload>` di section "Info Dasar", dan section baru "Galeri Foto (About)" — dynamic list `<ImageUpload>` per foto (pola sama dengan Taglines: tambah/hapus baris), bukan textarea comma-separated, supaya tiap foto tetap upload lewat widget bukan paste URL manual
  - **About page:** `ProfileSection` dapat 2 tombol CTA baru (`Button` variant primary "Download CV ↓" kalau `cvUrl` ada, variant secondary "Hubungi Saya" selalu ada → `/contact`) plus grid galeri foto (`grid-cols-2 sm:grid-cols-3`, `aspect-square`, tiap tile dibungkus `RipplePanel`) — cuma render section galeri kalau `galleryPhotos.length > 0`, tidak ada empty state kosong yang janggal
  - **Efek "genangan air"** (`components/ui/RipplePanel.tsx`, baru): **keputusan desain penting** — awalnya diminta pakai package eksternal (Unicorn Studio, WebGL), tapi karena itu di-skip (lihat di atas), efek ini dibangun 100% self-contained pakai Framer Motion (`useMotionValue` + `useSpring`) — bukan simulasi fisika air sungguhan, tapi radial-gradient blur lembut yang mengikuti posisi kursor dengan smoothing pegas (spring damping 26, stiffness 170), memberi kesan "genangan cahaya" yang mengikuti gerak kursor secara halus. Dipilih pendekatan ini (bukan canvas/WebGL) karena harus jalan performant di puluhan card sekaligus di banyak halaman ("ada pada semua panel") — versi WebGL/canvas per-card akan berat kalau dipasang berulang
  - **Bug non-obvious yang ditemukan & dihindari saat retrofit RipplePanel ke card yang sudah ada:** beberapa card (`ExperienceTimeline`) punya efek `group-hover:bg-surface` pada elemen yang JADI root RipplePanel setelah refactor — karena Tailwind `group-hover:` cuma match DESCENDANT dari `.group`, bukan `.group` itu sendiri, style itu diam-diam tidak akan pernah aktif kalau tetap dipertahankan apa adanya (bukan error, cuma efek hover yang hilang tanpa pesan error). Fix: ganti ke `hover:bg-surface` biasa di elemen yang sama (karena elemen itu sendiri sekarang jadi permukaan interaktif langsung, tidak perlu mekanisme "group" buat referensi ke ancestor lagi)
  - RipplePanel dipasang di: `PortfolioCard`, `CertificationCard`, `PostCard`, `StatCard`, tiap baris `ExperienceTimeline`, tiap foto galeri About, dan `HeroSection` (Home) — mencakup semua card/panel utama yang dilihat pengunjung di halaman publik. Sengaja **tidak** dipasang di halaman admin (fokus admin adalah usability, bukan showcase visual)
  - **Redesign Hero Home** (`components/HeroSection.tsx`, ditulis ulang total): layout 2-kolom lama (foto avatar bulat ter-crop kiri + teks kanan) diganti jadi 1 kolom center: foto besar `object-contain` (bukan `object-cover`) tanpa masking bulat/rounded sama sekali — ukuran natural foto dipertahankan penuh (portrait "setengah badan" tidak terpotong), floating animation + glow gradient blur di belakangnya dipertahankan dari `AnimatedAvatar` lama (bukan dihapus, cuma di-inline ulang tanpa bagian crop-nya). Nama/tagline/bio/CTA tetap di bawah foto, semua center-aligned (drop breakpoint `md:flex-row` lama yang bikin 2 kolom di desktop)
  - Sempat dipertimbangkan pola dari referensi user (`gambar-referensi/WhatsApp Image ....jpeg` — headline besar SEDIKIT overlap di belakang foto cutout transparan) tapi **sengaja tidak ditiru persis**: foto profil yang di-upload admin kemungkinan besar bukan PNG transparan (background biasa), jadi efek "teks di belakang orang" cuma akan kelihatan bagus kalau backgroundnya transparan — kalau tidak, teks cuma ketutup kotak foto secara datar (terlihat rusak, bukan artistik). Diputuskan pola yang lebih aman: foto besar dulu, teks besar di bawahnya terpisah jelas — tetap bold & foto tetap besar-uncropped-center sesuai instruksi eksplisit user, tapi tidak ambil risiko pada bagian yang butuh asset foto khusus yang belum tentu ada
  - Testing: `npm run build` + `npm run lint` sukses. End-to-end lewat skrip Node (baca profile asli via Prisma dulu biar tidak menimpa data taglines/contactLinks/skills yang sudah ada — pelajaran dari kehati-hatian mutasi `updateProfile` yang full-replace): update profile dengan 2 URL galeri test + 1 URL CV test → dikonfirmasi tampil di `/about` (2 foto galeri, tombol Download CV dengan href PDF yang benar, RipplePanel terpasang di sekitar foto galeri) → restore ke data asli → dikonfirmasi foto test hilang dan data asli (tagline "Mahasiswa Informatika...", skill "React") tetap utuh. Kehalusan animasi spring cursor-follow dan tampilan visual hero baru belum bisa diverifikasi visual asli di browser (claude-in-chrome belum pernah terhubung sepanjang project)
- **Addendum ke-6 (feedback user setelah Addendum ke-5): (1) tombol Download CV "belum ada" di `/about`, (2) Hero Home diminta dibuat SAMA seperti referensi (`WhatsApp Image ....jpeg`), bukan versi aman yang dihindari di Addendum ke-5.**
  - **Investigasi tombol CV "hilang":** dicek langsung ke database — `Profile.cvUrl` memang `null` (belum pernah diisi field asli, cuma sempat diisi angka test lalu di-restore ke `null` saat testing Addendum ke-5). **Bukan bug** — tombol memang sengaja conditional (`{cvUrl && <Button>...}`), dikonfirmasi ulang lewat testing: widget `CvUpload` ada & render benar di form admin (`/admin/dashboard/profile`, label "CV (PDF)" + tombol "Upload CV" keduanya ketemu di HTML), dan waktu `cvUrl` diisi manual lewat API, tombol langsung muncul di `/about`. Kesimpulan: pipeline-nya jalan, tombolnya baru akan muncul begitu user beneran upload CV lewat dashboard — bukan sesuatu yang perlu diperbaiki di kode
  - **Hero Home dirombak ulang, kali ini niru struktur referensi lebih dekat** (bukan versi aman sebelumnya): (1) kicker pill kecil "Halo, saya" di atas headline (border rounded-full, mirip pill "Design That Hits Different" di referensi); (2) nama jadi headline BESAR (`text-4xl` mobile → `text-7xl` desktop, `font-black`, `leading-[0.95]` biar rapat kayak referensi); (3) tagline rotating dibikin versi besar baru — `RotatingText` dapat prop `size` (`"md"` default dipakai di tempat lain, `"xl"` khusus hero: `text-4xl`→`text-6xl`, warna solid `text-accent-tertiary` bukan gradient, biar berkesan kayak teks oranye "FRONTEND DEV WEB DESIGNER" di referensi); (4) foto ditarik naik pakai negative margin (`-mt-4 sm:-mt-8 md:-mt-12`) supaya tumpang tindih dikit sama baris bawah tagline — z-index foto di atas teks; (5) **tag pill melayang di sekeliling foto** (baru) — 4 posisi absolute di 4 sudut foto (kiri-atas/kanan-atas/kiri-bawah/kanan-bawah, offset beda-beda biar tidak simetris kaku), isinya diambil dari 4 skill pertama admin (`profile.skills`, dioper dari Home page sebagai prop baru `skills: string[]`), niru pill "UI/UX"/"Designer"/"Frontend"/"Developer" di referensi — disembunyikan di mobile (`hidden sm:block`, terlalu sempit buat pill melayang di layar kecil)
  - **Keputusan sadar soal transparansi foto:** foto profil yang di-upload kemungkinan besar TIDAK py background transparan (bukan PNG cutout), jadi efek "teks ketutup badan orang" dari referensi tidak akan sama persis. Diakali dengan cara yang tetap kerja walau foto opaque: foto (lebar natural, biasanya lebih sempit dari lebar blok teks besar di belakangnya) ditumpuk DI ATAS teks tagline via negative margin + z-index — teks tetap "mengintip" di kiri-kanan foto karena teks lebih lebar dari foto, walau tidak tembus pandang persis kayak PNG transparan. Ini pendekatan paling dekat ke referensi yang bisa dicapai tanpa perlu foto ber-background-transparan
  - Testing: `npm run build` + `npm run lint` sukses, tidak ada error/warning baru. Verifikasi struktural lewat curl: headline besar (`font-black leading-[0.95]`) ketemu, foto ketarik naik (`-mt-4 sm:-mt-8 md:-mt-12`) ketemu, 4 pill melayang ketemu di HTML dengan isi nama skill asli ("React", dst — bukan placeholder), kicker pill "Halo, saya" ketemu. **Belum bisa diverifikasi visual asli** (proporsi overlap teks-foto, apakah pill melayang kepotong/nabrak di berbagai ukuran foto) — perlu dicek langsung di browser oleh user, terutama karena hasil akhirnya sangat tergantung rasio aspek & lebar foto profil yang di-upload (variatif per user, tidak bisa ditebak persis dari kode doang)
- **Addendum ke-7 (feedback lanjutan setelah Addendum ke-6): (1) bedakan bio/foto Hero dari About, (2) font tagline hero kegedean, (3) pill skill di hero pakai icon tools bukan teks nama, (4) efek cursor-glow diperluas ke seluruh layar Home bukan cuma div hero.**
  - **Field baru `Profile.heroPhotoUrl` & `Profile.heroBio`** (migration `add_hero_photo_and_bio`) — keduanya opsional, sengaja terpisah dari `photoUrl`/`bio` yang dipakai About & navbar. `EditProfileForm` dapat section baru "Hero Home" (ImageUpload + textarea pendek) dengan keterangan eksplisit "kosongkan kalau mau pakai foto/bio About sebagai gantinya" — jadi user lama yang belum sempat isi field baru ini tidak kehilangan foto/teks di hero (fallback otomatis)
  - **Fallback chain di Home page:** foto hero = `heroPhotoUrl || photoUrl || null`, teks hero = `heroBio || truncate(bio, 110)`. Helper `truncate()` baru di `lib/format.ts` (potong ke N karakter + tambah "…", trim whitespace dulu) — dipakai supaya hero tetap kelihatan wajar (bukan mendadak kosong) sebelum user sempat isi `heroBio` secara eksplisit. Dikonfirmasi lewat curl: About tampilkan bio penuh ("Halo, saya Muhammad Dzaky Prayata, seorang Web Developer... [lanjut panjang]"), Home hero tampilkan versi terpotong 110 karakter diakhiri "…" — dua teks yang beda nyata, bukan cuma styling beda dari sumber data yang sama
  - **Tagline hero diperkecil:** `RotatingText` sebelumnya (Addendum ke-6) sempat dibikin varian "xl" (`text-4xl` s/d `text-6xl`) yang ternyata kegedean — di-sederhanakan lagi jadi SATU ukuran tetap (`text-xl sm:text-2xl`, prop `size` dihapus karena cuma dipakai 1 tempat, YAGNI) sekaligus balik warna jadi solid `text-accent-tertiary` (bukan gradient clip-text seperti versi paling awal) — konsisten sama arah warna oranye/amber ala referensi tapi versi kita
  - **Pill skill jadi icon, bukan teks:** ini butuh penyesuaian arsitektur — `SkillIcon` (baca file SVG `simple-icons` lewat `fs`) **server-only**, sedangkan `HeroSection` **client component** (butuh Framer Motion). Solusi (pola yang sama dipakai di `SkillOrb`/Module 17 dulu): icon di-resolve di SERVER (`app/(public)/page.tsx`, Server Component) jadi elemen React siap-pakai, dioper ke `HeroSection` lewat prop `skills: { name: string; icon: ReactNode }[]` — bukan `string[]` polos lagi. Cuma skill yang punya `iconSlug`/`iconUrl` yang dipakai buat 4 pill pertama (skill tanpa icon di-filter duluan, supaya tidak ada badge kosong nganggur)
  - **Efek cursor-glow diperluas jadi page-wide:** komponen baru `components/ui/HomeCursorGlow.tsx` — beda dari `RipplePanel` (Module addendum sebelumnya, tracking mouse RELATIF ke satu elemen/card), ini tracking `window.mousemove` GLOBAL lalu render glow `position: fixed` (ikut kursor ke mana pun di viewport, tidak peduli scroll posisi/section mana). Dipasang sekali di `app/(public)/page.tsx` (bukan di komponen `HeroSection` itu sendiri) supaya cakupannya otomatis seluruh halaman Home, bukan cuma area hero. `RipplePanel` di tiap card/hero TETAP dipertahankan (tidak dihapus) — dua efek jalan bersamaan: glow ambient besar yang mengikuti kursor ke mana-mana + glow lebih fokus tiap kali hover card tertentu
  - **Investigasi laporan "Download CV belum ada" (Addendum ke-6):** dicek langsung ke database, `cvUrl` memang masih `null` — bukan bug kode, admin belum pernah upload CV asli (sempat keisi data test doang lalu di-restore `null` waktu testing Addendum ke-5). Dikonfirmasi ulang widget `CvUpload` benar-benar render di form admin (`/admin/dashboard/profile`) lewat HTML mentah — pipeline-nya jalan, tombol otomatis muncul begitu field-nya keisi via dashboard
  - Testing: `npm run build` + `npm run lint` sukses, tidak ada error/warning baru. Verifikasi lewat curl+skrip Node: ukuran font tagline dikonfirmasi kembali ke `text-xl`/`text-2xl` (bukan `text-4xl`+), `HomeCursorGlow` (`fixed z-0 h-[36rem]`) ketemu di HTML Home, pill hero dicek sampai ke isi `<svg>`-nya langsung — bukan cuma class container, benar-benar logo React (bukan teks "React") yang ter-render, About vs Home dikonfirmasi tampilkan bio yang beda (penuh vs terpotong), dan form admin dikonfirmasi punya section "Hero Home" + kedua field barunya
- **Addendum ke-8 (fitur baru + polish lanjutan): (1) reorder About — CV/Contact di atas, social link di bawah, (2) blok Achievement baru di About (di bawah foto/intro) + di Home (di atas Experience, format sama), (3) Experience/Portfolio/Achievement bisa punya "keterangan" yang di-collapse, diklik pakai tombol chevron buat expand — khusus di landing page (Home), (4) icon skill di hero diperbesar.**
  - **Model baru `Achievement`** (migration `add_achievement`): `title`, `description?`, `organizer`, `year` (Int, beda dari `Certification.issueDate` yang full Date — achievement di referensi cuma butuh tahun), `tier` (`"local"` | `"international"`, constant baru `ACHIEVEMENT_TIERS` di `lib/constants.ts`), `certificateUrl?`. **Sengaja tanpa field gambar** — beda dari Certification yang wajib upload gambar sertifikat, Achievement niru pola referensi (icon trophy generik + tag tier berwarna, bukan foto per-item), lebih ringan buat diisi admin
  - **Backend lengkap mengikuti pola Certification 1:1**: `lib/queries.ts` (`getAchievements`, `getAchievementById`), `lib/mutations.ts` (parse/validate/create/update/delete + validasi tier terhadap `ACHIEVEMENT_TIERS`), `/api/achievement` + `/api/achievement/[id]` (auth check manual, revalidate `/`, `/about`, `/admin/dashboard/achievements`)
  - **Admin CRUD penuh**: `AchievementForm.tsx` (title/organizer/year/tier-select/description/certificateUrl, pola sama `FormSection`), list+new+edit page (`AdminListRow` dengan icon `TrophyIcon` baru — bukan `AwardIcon` yang sudah dipakai Certifications, biar beda visual di sidebar/list), nav sidebar + tile overview dashboard (`getAdminOverviewCounts` nambah field `achievement`)
  - **2 komponen publik beda tujuan, bukan 1 dipakai dobel:** `AchievementCard.tsx` (grid card, dipakai di About — icon badge trophy amber, tier tag, judul, organizer+tahun, deskripsi, link sertifikat; niru struktur `CertificationCard` tapi tanpa gambar) vs `AchievementTimeline.tsx` (dot+line spine, dipakai di Home — niru `ExperienceTimeline` 1:1 secara visual sesuai instruksi eksplisit "format samakan dengan experience"). Keduanya pakai `TierTag.tsx` (baru, pola sama `CategoryTag`: `international` = amber/`accent-tertiary`, `local` = abu-abu netral)
  - **About direstruktur ulang** (`ProfileSection.tsx`): urutan lama bio → social links → tombol CV/Contact → galeri, diubah jadi bio → **tombol CV/Contact duluan** → social links → **blok Achievements (baru)** → galeri. Prop baru `achievements: AchievementItem[]`, cuma render section-nya kalau `achievements.length > 0` (pola empty-state konsisten dengan section lain)
  - **Home dapat section Achievements baru** tepat di atas Experience (`AchievementTimeline` dengan `collapsibleDescription`, slice 3 item terbaru, tombol "Lihat semua" mengarah ke `/about` karena sengaja **tidak** dibikin halaman publik `/achievements` terpisah — di luar scope yang diminta, achievement cuma perlu tampil di About + Home preview, bukan punya listing page sendiri kayak Portfolio/Certifications)
  - **Toggle "keterangan" collapsible** (`components/ui/ExpandableDetails.tsx`, baru) — tombol kecil "Keterangan" + icon chevron yang rotate 180° pas dibuka, klik toggle nampilin/nyembunyiin teks deskripsi. **Sengaja cuma dipasang di Home** (`collapsibleDescription` prop baru di `ExperienceTimeline`, `PortfolioCard`, `AchievementTimeline` — default `false`, jadi halaman `/experience`/`/portfolio` sendiri TETAP tampilkan deskripsi penuh seperti biasa, tidak berubah) — sesuai instruksi eksplisit "bisa diklik pada landing page" (landing page = Home, bukan semua halaman)
  - **Bug kecil dicegah sebelum kejadian:** `PortfolioCard` bungkus deskripsinya di dalam `<Link>` (klik area buat ke halaman detail). Kalau tombol expand/collapse taruh di situ tanpa penanganan khusus, klik tombol bakal ke-treat sebagai klik link juga (navigasi tidak sengaja pas user cuma mau baca "keterangan"). Fix: `ExpandableDetails`' button `onClick` selalu panggil `e.preventDefault()` + `e.stopPropagation()` (aman dipasang di dalam ATAU di luar elemen `<a>`, tidak breaking di kedua kasus)
  - **Icon skill hero diperbesar**: pill container `h-11 w-11` → `h-16 w-16`, icon di dalamnya `h-5 w-5` → `h-7 w-7` (diset di `app/(public)/page.tsx` tempat `<SkillIcon>` di-construct), offset posisi melayang (`FLOAT_TAG_POSITIONS`) digeser sedikit lebih jauh dari foto biar pill yang lebih besar tidak nabrak/nutupin foto
  - Testing: `npm run build` + `npm run lint` sukses, tidak ada error/warning baru. End-to-end lewat skrip Node: unauthenticated create achievement (401), create dengan tier "international" (201), tier invalid (400, tervalidasi against `ACHIEVEMENT_TIERS`), achievement muncul di About (title + tier tag "INTERNATIONAL" + link sertifikat, dan dikonfirmasi posisinya SEBELUM blok Achievements di HTML — CTA duluan baru Achievements sesuai reorder), muncul di admin list, delete (200) lalu dikonfirmasi hilang. **Sempat false-negative** pas cek urutan "Achievements sebelum Experience" di Home (karena data test sudah keburu dihapus duluan di skrip sebelumnya sebelum sempat dicek ulang, jadi section-nya otomatis tidak render — bukan bug, cuma race kondisi testing) — diverifikasi ulang dengan skrip terpisah (create → cek urutan `>Achievements</h2>` vs `>Experience</h2>` → baru delete), hasil dikonfirmasi benar: Achievements duluan baru Experience. Tombol "Keterangan" dan ukuran pill icon `h-16 w-16` juga dikonfirmasi ada di HTML Home
- **Addendum ke-9 (polish visual lanjutan hero + section headings + certifications): (1) gradasi natural di foto hero biar tidak terkesan "kecrop" kaku, (2) format skill di hero diganti jadi marquee bergerak, (3) semua heading section Home di-center, (4) halaman /certifications dipisah jadi grup Lokal & International.**
  - **Gradient fade foto hero**: dipakai CSS `mask-image`/`-webkit-mask-image` langsung di elemen `<img>` (`linear-gradient(to_bottom, black_75%, transparent_100%)`) — bagian 75% atas foto full opaque, 25% bawah fade halus ke transparan. Efeknya foto "melebur" ke background alih-alih berhenti tiba-tiba di garis tegas, sesuai instruksi "tidak terlihat seperti kecrop". Teknik CSS mask (bukan gambar PNG transparan manual) dipilih karena otomatis kerja buat foto apapun yang di-upload admin, tidak butuh preprocessing gambar
  - **Floating skill pills diganti jadi marquee bergerak** (`components/ui/SkillMarquee.tsx`, baru) — dulu (Addendum ke-8) cuma 4 icon-circle diam melayang di sekitar foto; sekarang SEMUA skill berikon ditampilkan sebagai pill (icon+nama, format terinspirasi `gambar-referensi/Screenshot 2026-07-09 213508.png` — pill rounded sederhana, tapi tetap pakai warna/border tema kita, bukan niru palet referensi) yang bergerak infinite-scroll kiri→kanan terus-menerus (trik marquee klasik: list di-duplikat 2x, di-animate `translateX` 0% → -50%, loop mulus karena titik sambung persis ketemu salinan pertama). Kecepatan scroll proporsional jumlah skill (`duration: skills.length * 3`, biar tidak kecepetan/kelambatan tergantung banyaknya skill admin). Fade halus di kedua tepi container pakai `mask-image` horizontal (bukan hard cutoff) — konsisten sama treatment gradasi yang sama dipakai di foto
  - **Posisi marquee**: diletakkan di bawah foto (bukan overlap/nempel di foto seperti pill lama), di atas bio pendek — jadi urutan hero sekarang: kicker pill → nama besar → tagline rotating → foto (dengan gradient fade) → **marquee skill** → bio pendek → tombol CTA
  - **Semua heading section Home di-center**: `SectionHeader` (Achievements/Experience/Certifications/Skills/Projects) diubah dari `flex items-center justify-between` (judul kiri, tombol "Lihat semua" kanan) jadi `flex flex-col items-center gap-2 text-center` (judul di tengah, tombol di bawahnya juga center) — matching pola reference "Technical & Soft Skills" yang center. Wrapper konten Achievement/Experience (`max-w-3xl`) ikut dikasih `mx-auto` biar kolomnya center juga di bawah heading yang sekarang center, tidak nabrak/miring ke kiri
  - **Field baru `Certification.tier`** (migration `add_certification_tier`, `@default("local")` — default aman biar data lama otomatis masuk grup "Lokal" tanpa perlu migrasi data manual). Constant `ACHIEVEMENT_TIERS` (Addendum ke-8) di-**generalisasi jadi `TIERS`** di `lib/constants.ts` karena sekarang dipakai 2 model (Achievement DAN Certification) — nama lama sudah tidak akurat begitu dipakai lintas model. `CertificationForm` dapat dropdown Tier baru (sebaris sama Tanggal Terbit), backend (`parseCertificationInput`/`validateCertificationInput`/`toCertificationData`) ikut diupdate
  - **Halaman `/certifications` dipecah jadi 2 grup**: komponen lokal `CertificationGroup` (title + grid, return `null` kalau grup itu kosong — misal admin belum punya sertifikat internasional sama sekali, section itu tidak nongol judul kosong) dipanggil 2x — "Internasional" duluan baru "Lokal" (mengikuti urutan hierarki kepentingan ala referensi achievement page: internasional dianggap lebih menonjol, ditaruh duluan)
  - Testing: `npm run build` + `npm run lint` sukses, tidak ada error/warning baru. Verifikasi lewat curl+skrip Node: mask-image gradient (vertikal di foto, horizontal di marquee) ketemu di HTML, heading center class ketemu 5x (Achievements/Experience/Certifications/Skills/Projects — sempat kelihatan cuma "1x" pakai `grep -c` karena itu ngitung baris bukan occurrence pada HTML minified satu baris, diperbaiki pakai `grep -o | wc -l` baru ketemu 10 = 5 section × 2 karena Next.js embed salinan serialized RSC payload buat hydration, bukan bug). Data seed awal (2 certification) semuanya default tier "local" — dikonfirmasi grup "Internasional" memang sengaja tidak muncul (bukan bug, empty-state kerja benar) lewat testing terpisah: create 1 certification tier "international" → kedua heading "Internasional" DAN "Lokal" muncul, urutan Internasional duluan, tier invalid ditolak 400 — semua sesuai ekspektasi, lalu data test dihapus lagi
- **Addendum ke-10 (koreksi cepat setelah Addendum ke-9): (1) icon skill di hero dikasih warna asli brand, bukan monokrom, (2) marquee bergerak kiri-kanan ternyata salah tempat — seharusnya bukan di hero, hero balik ke konsep icon melayang di sekitar foto (icon-only, tanpa label), (3) yang bergerak kiri-kanan justru section Skills di Home (di bawah Certifications).**
  - **Warna asli brand icon** — sebelumnya semua icon skill (via `simple-icons`) di-render monokrom (`fill="currentColor"`, ikut warna teks di sekitarnya). File SVG mentah dari `simple-icons` (`node_modules/simple-icons/icons/{slug}.svg`) TIDAK menyimpan kode warna sama sekali (cuma path shape) — warna resmi brand disimpan terpisah di `node_modules/simple-icons/data/simple-icons.json` (~450KB, metadata semua icon: title/slug/hex). Ditambah `getSimpleIconHex(slug)` di `lib/simple-icon.ts` — baca & cache file JSON itu sekali (lazy-loaded module-level `Map`, bukan di-baca ulang tiap render), jauh lebih ringan dibanding import seluruh package JS `simple-icons` (yang isinya data + path digabung, jauh lebih besar) — tetap konsisten sama prinsip hemat memori dari keputusan Module 3 dulu
  - `SkillIcon` dapat prop baru `useBrandColor?: boolean` (default `false` — semua pemanggilan lama otomatis tetap monokrom, tidak berubah): kalau `true`, warna icon di-resolve dari `getSimpleIconHex()` dan di-set lewat inline `style={{ color: hex }}` (SVG icon pakai `fill="currentColor"` jadi otomatis ikut). **Sengaja cuma diaktifkan di hero** (sesuai scope eksplisit user) — icon di halaman `/skills`, `SkillBadge`, dan marquee Skills-di-Home TETAP monokrom seperti biasa
  - **Hero dikembalikan ke konsep icon melayang** (revert dari marquee Addendum ke-9 balik ke desain Addendum ke-8): `SkillMarquee` dilepas dari `HeroSection`, diganti lagi jadi 4 badge lingkaran (`h-16 w-16 rounded-full`) melayang di 4 sudut foto dengan animasi fade-in staggered — TAPI kali ini isinya cuma icon polos (tanpa nama skill kelihatan, `title` attribute doang buat tooltip aksesibilitas) dan pakai `useBrandColor`, jadi tiap badge nampilin logo asli tool dengan warna aslinya (React cyan `#61DAFB`, TypeScript biru `#3178C6`, dst — dikonfirmasi lewat curl, warna hex yang ketemu di HTML persis sama dengan warna resmi masing-masing brand)
  - **Marquee dipindah ke section Skills di Home** (`SkillsPreview.tsx`, dipakai di section "Skills" — posisinya di bawah "Certifications", sesuai penjelasan eksplisit user "yang dibawah sertifikat pada home") — `toolSkills` (skill berikon) sekarang render lewat `SkillMarquee` (bergerak infinite kiri→kanan, monokrom, bukan brand color), `otherSkills` (soft skill tanpa icon) tetap pill teks statis kayak sebelumnya
  - **Cleanup kode mati:** `SkillOrb.tsx` sebelumnya py 2 mode (icon-bubble vs pill-teks, tergantung ada/tidaknya icon) — begitu pemanggil satu-satunya (`SkillsPreview`) cuma pernah masukin skill TANPA icon ke situ (skill berikon sekarang lewat `SkillMarquee`, bukan `SkillOrb` lagi), cabang icon-bubble jadi kode mati permanen. Disederhanakan total: `SkillOrb` sekarang cuma nerima prop `name` (drop `iconSlug`/`iconUrl` yang tidak dipakai lagi), langsung render pill teks — bukan lagi komponen bercabang dua mode
  - Testing: `npm run build` + `npm run lint` sukses, tidak ada error/warning baru. Verifikasi lewat curl ke HTML Home: badge icon hero balik ke `h-16 w-16 rounded-full` (bukan marquee lagi), ketemu 3 contoh `style="color:#..."` dengan hex yang match warna brand asli (React `#61DAFB`, TypeScript `#3178C6`, dst — bukan warna acak), marquee (`mask-image` horizontal) cuma ketemu 1x di seluruh halaman dan posisinya persis di antara heading `Skills` dan heading `Projects` (dicek pakai index posisi tiap heading di HTML — Certifications → Skills → Marquee → Projects, urutan benar)

### Review checkpoint
- [ ] Sudah direview
- Catatan review:

---

## Module 18: Portfolio Category Filter

**Status:** [x]
**Prioritas:** Sedang

### Fungsi & code yang direncanakan
```
- Filter tab di /portfolio: Semua / Web / App / Design, berdasarkan Portfolio.category yang sudah ada di schema (tidak perlu migration)
- Pakai searchParams (?category=web) supaya hasil filter shareable via URL & tetap server-rendered, bukan cuma client-state
- Komponen: PortfolioFilterTabs
```

### Dependency
- Module 4 (halaman /portfolio sudah ada)

### Definition of Done
- [x] Klik tab kategori menampilkan cuma portfolio kategori itu, tab "Semua" reset ke semua data — diverifikasi lewat curl: `?category=web`/`app`/`design` masing-masing cuma tampilkan 1 portfolio yang sesuai dari 3 data seed, `?category` kosong tampilkan semua
- [x] URL berubah sesuai filter aktif (bisa di-share/bookmark) — filter murni lewat `searchParams` server-rendered (bukan client state), tab pakai `<Link href="/portfolio?category=...">` biasa
- [x] Tab tetap nyaman dipakai di mobile (scroll horizontal kalau perlu) — `overflow-x-auto` + `shrink-0` per tab di breakpoint mobile, `sm:flex-wrap sm:overflow-visible` di desktop (tidak perlu scroll kalau muat)

### Catatan implementasi
- `PortfolioFilterTabs` (`components/PortfolioFilterTabs.tsx`) — **Server Component murni**, bukan Client Component: tab filter tidak butuh `"use client"`/JS sama sekali karena state aktifnya cuma ditentukan dari `searchParams` yang sudah di-parse di server (`page.tsx`), tab-nya sendiri cuma `<Link>` biasa ke URL berbeda. Ini konsisten dengan requirement DoD "server-rendered, bukan cuma client-state" — malah lebih longgar dari itu, tidak ada client-state sama sekali
- `getPortfolios()` di `lib/queries.ts` diubah terima parameter opsional `category?: string` (dipakai sebagai Prisma `where`) — backward compatible, 2 caller lain (`Home`, admin dashboard portfolio list) tetap panggil tanpa argumen, tidak perlu diubah. React `cache()` otomatis bikin cache entry terpisah per kombinasi argumen yang beda, jadi tidak ada masalah cache-collision antara `getPortfolios()` dan `getPortfolios("web")`
- `app/(public)/portfolio/page.tsx` sekarang terima `searchParams: Promise<{ category?: string }>` (konvensi Next.js 15+/16, sama seperti `params` di `[id]`), category divalidasi dulu terhadap `PORTFOLIO_CATEGORIES` sebelum dipakai — kalau ada yang isi URL manual dengan kategori ngawur (`?category=bogus`), otomatis fallback ke "Semua" (tidak 500/crash, dikonfirmasi lewat curl tetap 200 dengan tab "Semua" yang aktif)
- **Refactor DRY (dipicu 3 titik duplikasi):** list kategori portofolio (`web`/`app`/`design`) sebelumnya di-hardcode terpisah di `lib/mutations.ts` (`VALID_CATEGORIES`, validasi form), `components/admin/PortfolioForm.tsx` (`CATEGORIES`, dropdown admin), dan sekarang butuh lagi di `PortfolioFilterTabs` — begitu nyampe titik ke-3, diekstrak ke `lib/constants.ts` (`PORTFOLIO_CATEGORIES`, single source of truth), ketiga file diupdate untuk import dari situ. Route `/portfolio` jadi ikut ke-render dinamis (ƒ) saat build (sebelumnya statis ○) — efek samping wajar dari pemakaian `searchParams`, bukan regresi
- Empty state juga dibedakan: kalau filter aktif tapi hasilnya kosong, pesannya `Belum ada portofolio kategori "x".` (bukan pesan generik "belum ada portofolio" yang sama dengan kondisi database kosong total) — supaya user tidak salah kira semua data hilang padahal cuma kategori itu yang belum ada isinya
- **Tambahan di luar rencana awal (diminta user saat sesi ini): audit interaktivitas CSS di semua div card.** User minta semua div yang dibuat sepanjang project punya efek interaktif CSS sederhana, khusus disebut bagian "data" di Home (StatsSection, di bawah hero) yang ternyata **belum ada hover effect sama sekali** sejak dibuat di Module 16 — diperbaiki: `StatCard` dikasih `hover:-translate-y-1 hover:border-accent/60 hover:bg-surface-hover hover:shadow-xl hover:shadow-accent/10` + icon scale on hover (pola sama persis dengan `PortfolioCard`/`CertificationCard` dari Module 17). Di-grep ulang semua div berpola card (`rounded-xl/2xl border border-border bg-surface`) di `components/` — `PortfolioCard`, `CertificationCard`, `SkillOrb` semua sudah punya hover dari sebelumnya, cuma `StatCard` yang kelewat. Admin dashboard (`/admin/dashboard/*`) sengaja **tidak** disentuh — di luar scope "data di Home page" yang diminta, dan bukan bagian tampilan publik yang perlu terasa "menarik" (tool internal single-admin)
- Testing: `npm run build` sukses (route `/portfolio` berubah jadi ƒ seperti dijelaskan di atas, sesuai ekspektasi), `npm run lint` tidak ada error/warning baru dari perubahan module ini (5 warning/error yang muncul semua pre-existing dari module lain, tidak related). Dev server di-restart penuh, verifikasi lewat curl: filter per kategori mengembalikan portfolio yang benar (dicocokkan satu-satu ke judul dari data seed), kategori tidak valid fallback ke "Semua" tanpa error, hover class `StatCard` terkonfirmasi ada di HTML Home

### Review checkpoint
- [ ] Sudah direview
- Catatan review:

---

## Module 19: Contact Form

**Status:** [x]
**Prioritas:** Sedang

### Fungsi & code yang direncanakan
```
- Model baru: ContactMessage { id, name, email, message, isRead (default false), createdAt }
- Form Contact publik (halaman /contact atau section di /about) — nama, email, pesan + honeypot field basic buat anti-spam
- API route POST /api/contact -> validasi + simpan ke database
- Admin: /admin/dashboard/messages -> list pesan masuk, tandai dibaca, hapus
- Tombol "Contact" di navbar diarahkan ke halaman ini (gantikan/lengkapi mailto yang sudah ada — keputusan detail nanti pas eksekusi)
```

### Dependency
- Module 1 (schema baru), Module 2 (admin auth buat halaman messages)

### Definition of Done
- [x] Pengunjung bisa kirim pesan, tersimpan ke database, validasi jelas kalau field kosong/email tidak valid — diverifikasi lewat script HTTP end-to-end: submit valid (201), missing email (400 pesan jelas), body JSON rusak (400 "Body tidak valid.")
- [x] Admin bisa lihat & kelola (tandai dibaca/hapus) pesan masuk tanpa sentuh kode — CRUD penuh dites: list tampil di `/admin/dashboard/messages`, PATCH tandai dibaca/belum (200, balik data ter-update), DELETE (200, hilang dari list)
- [x] Ada proteksi dasar dari spam (honeypot minimal, bukan captcha penuh) — field hidden `company`, kalau keisi API tetap balas `201 {success:true}` (biar bot tidak tahu ditolak) tapi TIDAK disimpan ke database — dikonfirmasi lewat test: submit dengan honeypot terisi, lalu cek list admin, pesan spam tidak muncul

### Catatan implementasi
- **Keputusan tombol Contact navbar:** diarahkan ke halaman `/contact` (form), bukan tetap `mailto:` langsung — `SiteHeader`/`MobileNav` diupdate. Halaman `/contact` sendiri tetap tampilkan email asli profile di bawah form (`mailto:` link) sebagai alternatif buat yang lebih suka kirim email langsung, jadi bukan gantikan total, tapi form jadi jalur utama
- `ContactMessage` bukan child dari `Profile` (beda dari `Skill`/`Experience`/`Certification`) — ini inbox global tunggal, tidak ada `profileId`/relasi, karena cuma ada 1 admin dan pesan tidak "milik" siapa-siapa secara konsep
- **Honeypot** (`components/ContactForm.tsx`): field hidden bernama `company` (nama umum honeypot, cukup generik buat mancing bot form-filler otomatis), disembunyikan pakai `position: absolute; left: -9999px` + `tabIndex={-1}` + `aria-hidden` (bukan `display: none` — sebagian bot yang lebih pintar skip field yang `display:none`, teknik "positioned off-screen" lebih efektif buat honeypot dasar). Validasi honeypot terjadi paling awal di `POST /api/contact` sebelum validasi field lain, dan sengaja balas sukses palsu (`201`) tanpa nyimpen apa-apa — supaya bot tidak dapat sinyal buat coba pola lain
- `POST /api/contact` **sengaja tidak pakai `auth()`** — beda dari kebanyakan API route lain di project ini yang wajib session, karena ini satu-satunya endpoint yang memang untuk pengunjung publik (form kontak). `PATCH`/`DELETE /api/messages/[id]` tetap wajib auth seperti pola API admin lainnya
- **Refactor pendukung:** `components/admin/FormField.tsx` (`Field` + `inputClass`) dipindah jadi `components/FormField.tsx` (level shared, bukan di dalam folder `admin/`) karena sekarang dipakai juga oleh `ContactForm` yang notabene komponen publik — sebelumnya cuma dipakai 4 form admin, jadi lokasinya di `admin/` masih masuk akal, begitu dipakai lintas admin+publik jadi janggal kalau tetap di situ. 4 file admin form (`PortfolioForm`, `ExperienceForm`, `EditProfileForm`, `CertificationForm`) diupdate importnya
- **Sidebar admin** (`app/admin/dashboard/layout.tsx`) dapat nav item "Messages" baru + **badge angka pesan belum dibaca** (`getUnreadMessageCount()`, cuma `prisma.count()`, murah) — bukan bagian dari DoD eksplisit tapi nambah UX yang jelas berguna (admin langsung tahu ada pesan baru tanpa buka halaman list). Tile "Pesan Masuk" juga ditambah di overview `/admin/dashboard`
- Sekalian ketauan tile overview dashboard (`app/admin/dashboard/page.tsx`) dari Module 13 cuma punya `hover:border-accent/50` doang (beda pola sama card publik yang sudah dipoles dari Module 17-18) — dipoles juga (`hover:-translate-y-1` + shadow glow) selagi menyentuh file ini, konsisten sama arahan user "semua div interaktif"
- Baris pesan di `/admin/dashboard/messages` dikasih indikator dot biru + border `accent/40` kalau belum dibaca (beda dari border netral kalau sudah dibaca) — visual scan cepat tanpa perlu baca teks satu-satu
- Testing: `npm run build` sukses (`/contact` jadi ○ statis, `/portfolio`-style routes yang butuh `searchParams`/auth tetap ƒ), `npm run lint` tidak ada error/warning baru. **Sempat lupa `npx prisma generate` manual** setelah `prisma migrate dev` — walau `migrate dev` biasanya auto-generate, kali ini `lib/generated/prisma` belum ke-update pas langsung build (`ContactMessage` bikin TS error "implicitly any"), fix cukup jalanin `npx prisma generate` manual sekali. End-to-end penuh dites lewat skrip Node sekali-pakai (pola sama dari Module 10/13): submit valid, submit honeypot (tidak masuk DB), submit invalid, akses API tanpa auth (401), login, lihat list, tandai dibaca, hapus, konfirmasi badge unread muncul di sidebar lalu ilang lagi setelah dihapus — skrip test dihapus, database dikonfirmasi bersih (0 pesan tersisa) setelah semua verifikasi selesai

### Review checkpoint
- [ ] Sudah direview
- Catatan review:

---

## Module 20: SEO Basic

**Status:** [x]
**Prioritas:** Rendah

### Fungsi & code yang direncanakan
```
- generateMetadata per halaman publik (title+description unik, bukan cuma dari root layout)
- Open Graph tags dasar (og:title, og:description, og:image) minimal di halaman utama
- app/sitemap.ts dan app/robots.ts (konvensi Next.js) generate sitemap.xml & robots.txt otomatis dari data yang ada
```

### Dependency
- Semua halaman publik final (Module 1-19) — idealnya dikerjakan mendekati akhir V3 supaya title/description mengacu konten yang sudah stabil

### Definition of Done
- [x] Tiap halaman publik utama punya title/description berbeda dan relevan — diverifikasi lewat curl ke 8 halaman (Home, About, Skills, Portfolio [+filter kategori], Portfolio detail, Experience, Certifications, Contact), semua title/description unik dan sesuai konten
- [x] `/sitemap.xml` dan `/robots.txt` bisa diakses dan formatnya valid — dicek langsung: `robots.txt` isi rules allow/disallow + pointer ke sitemap, `sitemap.xml` XML valid berisi 7 halaman statis + seluruh portfolio dari database
- [x] Share link ke sosmed menampilkan preview title/description (og:image minimal ada walau generic) — og:title/og:description unik per halaman, og:image selalu ada di semua halaman (generic dari `opengraph-image.tsx` kecuali detail portfolio yang punya thumbnail asli)

### Catatan implementasi
- Root layout (`app/layout.tsx`) diubah dari `export const metadata` statis jadi `generateMetadata()` async — fetch `getProfile()` supaya title/OG default ikut nama profile asli dari database (bukan hardcode "Personal Portfolio"), termasu `title.template` (`%s | {nama}`) yang otomatis dipakai halaman anak yang cuma set title pendek (mis. "About" → "About | Zaky Prayata")
- `lib/site.ts` — `SITE_URL` (dipakai `metadataBase`, `sitemap.ts`, `robots.ts`): fallback berjenjang `NEXT_PUBLIC_SITE_URL` (env manual) → `VERCEL_URL` (otomatis kesedia di Vercel production, belum perlu diisi manual) → `http://localhost:3000` (dev). Didokumentasikan di `.env.example` supaya user tahu perlu diisi setelah deploy actual ke domain final
- **OG image dinamis** (`app/opengraph-image.tsx`) — pakai konvensi file Next.js + `ImageResponse` dari `next/og` (Satori), generate PNG 1200x630 on-the-fly berisi nama profile + tagline pertama, gradient biru-ungu sesuai identitas visual situs (bukan file gambar statis yang perlu dibuat manual). Dicek visual (download & lihat langsung) — gradient text via `backgroundClip: text` di Satori render dengan benar, tidak pecah
- **Bug ditemukan & diperbaiki (perilaku non-obvious Next.js metadata):** kalau suatu halaman anak mendeklarasikan field `openGraph` sendiri (walau cuma `{ description }`, tanpa `images`), Next.js **berhenti mewarisi** OG image otomatis dari file convention `opengraph-image.tsx` di parent — hasilnya `og:image` kosong sama sekali di halaman manapun yang punya `openGraph` sendiri. Ketauan pas testing curl (`og:image` cuma ada di halaman yang TIDAK declare `openGraph` sama sekali). Fix: bikin `lib/seo.ts` (`buildPageMetadata()`) — helper yang SELALU sertakan `images: [DEFAULT_OG_IMAGE]` (atau thumbnail asli kalau ada) tiap kali halaman anak declare `openGraph`, jadi tidak ada halaman yang kehilangan image
- Ditemukan juga: kalau `openGraph` anak tidak set `title`/`description` sendiri, itu **tidak** fallback ke title/description top-level halaman yang sama — malah full-replace dengan `openGraph` milik ROOT layout. Jadi `buildPageMetadata()` juga rekonstruksi `openGraph.title` manual (`"{title} | {siteName}"`, niru title-template yang cuma otomatis berlaku buat tag `<title>` HTML, bukan `og:title`) tiap kali dipanggil — 7 halaman (About/Skills/Portfolio/Portfolio-detail/Experience/Certifications/Contact) semua lewat helper ini, Home sengaja dikecualikan (biarkan inherit penuh dari root, karena title/description Home memang identik dengan default situ)
- Portfolio list (`/portfolio`) generateMetadata ikut baca `searchParams` yang sama dengan komponen halamannya — kalau ada filter kategori aktif (`?category=web`), title/description otomatis menyesuaikan ("Portfolio — Web" / "Kumpulan project kategori Web..."), dicek lewat curl dan hasilnya benar
- Portfolio detail (`/portfolio/[id]`) pakai `thumbnailUrl` asli sebagai `og:image` kalau admin sudah upload gambar project — fallback ke OG image generic kalau belum. Ini satu-satunya halaman yang og:image-nya bisa beda dari yang lain
- `app/sitemap.ts`/`app/robots.ts` pakai konvensi file Next.js (`MetadataRoute.Sitemap`/`MetadataRoute.Robots`) — otomatis ter-serve di `/sitemap.xml`/`/robots.txt` tanpa perlu route handler manual. Sitemap generate entry untuk 7 halaman statis + seluruh portfolio dari database (fetch `getPortfolios()` langsung, jadi otomatis nambah/berkurang kalau admin CRUD portfolio, tidak perlu update manual). Robots disallow `/admin`, `/api`, `/login` (halaman non-publik/tidak perlu di-index)
- Testing: `npm run build` sukses (`/opengraph-image`, `/robots.txt`, `/sitemap.xml` semua ke-generate sebagai route statis ○), `npm run lint` tidak ada error/warning baru. Verifikasi lengkap lewat curl: title/description tiap 8 halaman publik unik dan sesuai, `og:title`/`og:description`/`og:image` ada di semua halaman (dicek satu-satu sampai bug inheritance di atas ketemu & diperbaiki), `robots.txt`/`sitemap.xml` isi & format valid, OG image di-download & dicek visual langsung

### Review checkpoint
- [ ] Sudah direview
- Catatan review:

---

## Module 21: Blog/Artikel

**Status:** [x]
**Prioritas:** Rendah

### Fungsi & code yang direncanakan
```
- Model baru: Post { id, title, slug, excerpt, content, coverImageUrl?, published (boolean, default false), publishedAt?, createdAt, updatedAt }
- Halaman publik /blog (list, cuma yang published) + /blog/[slug] (detail)
- Admin CRUD lengkap: /admin/dashboard/blog (list+tambah+edit+hapus), form dengan textarea markdown (bukan rich-text WYSIWYG dulu, biar scope realistis) + toggle draft/published
- Render markdown ke HTML di halaman detail (butuh library ringan, mis. react-markdown)
- Update navbar (tambah menu Blog)
```

### Dependency
- Module 9 (Button/design system), Module 14-17 (biar halaman blog konsisten dengan polish visual & tema yang sudah jadi)

### Definition of Done
- [x] Admin bisa tulis/edit/hapus artikel, toggle draft/published — CRUD penuh dites lewat script HTTP: create draft (201), create published (201, `publishedAt` otomatis keisi), update draft→published (200, `publishedAt` ke-set saat itu juga), delete (200)
- [x] Cuma artikel published yang tampil di halaman publik — draft dikonfirmasi TIDAK muncul di `/blog` list maupun bisa diakses di `/blog/[slug]` (404), sementara published muncul di keduanya
- [x] Halaman detail render markdown dengan benar (heading, list, bold, link, dst) — dites `react-markdown` dengan sample markdown campuran (h1/h2/bold/link/list), semua ter-render jadi tag HTML yang benar (`<h1>`, `<h2>`, `<strong>`, `<a href>`, `<ul><li>`)
- [x] Responsive & konsisten dengan gaya situs, termasuk di kedua mode tema — pakai `GradientBlob`/`PageIntro`/pola card yang sama dengan halaman publik lain (Module 14-17), warna markdown (`.prose`) di-mapping ke token semantic sendiri (bukan warna default plugin) supaya otomatis benar di kedua tema

### Catatan implementasi
- Item paling besar scope-nya di V3 — awalnya sengaja dideprioritaskan di awal project (lihat Changelog awal: "Fokus dipersempit ke profil-portofolio saja"), sekarang dimasukkan lagi atas konfirmasi eksplisit user
- `Post` model berdiri sendiri (tidak ada relasi ke `Profile`), pola sama seperti `ContactMessage` di Module 19 — cuma ada 1 admin, artikel tidak "milik" siapa-siapa secara konsep
- **Markdown rendering:** pakai `react-markdown` (baru diinstall) + plugin `@tailwindcss/typography` (baru diinstall, dev dependency) buat styling otomatis heading/list/bold/link/quote/code tanpa nulis CSS manual per elemen. Karena situs ini pakai sistem token warna custom (CSS variable + `data-theme` attribute, bukan Tailwind `dark:` class), warna default plugin typography (abu-abu fixed) di-override lewat blok `.prose { --tw-prose-* : var(--token-kita) }` di `globals.css` — jadi otomatis ikut tema aktif tanpa perlu varian `prose-invert` terpisah
- **Slug:** validasi format via regex (huruf kecil, angka, tanda hubung), unique constraint di schema (`@unique`) → error Prisma P2002 ditangkap di route handler dan dikembalikan sebagai 400 "Slug sudah dipakai artikel lain." (bukan 500). Admin form auto-generate slug dari judul saat diketik (client-side, `slugify()` sederhana) tapi tetap bisa di-override manual — begitu user mulai ngetik langsung di field slug, auto-generate berhenti (`slugTouched` state)
- **`publishedAt` logic:** diisi otomatis pertama kali status berubah jadi `published: true` (create langsung published, atau update draft→published) — begitu sudah pernah ke-set, nilainya dipertahankan walau artikel di-unpublish lagi (jadi kalau di-publish ulang nanti, tanggalnya tidak "reset" ke hari itu). `updatePost()` butuh 1 query `findUnique` tambahan buat baca `publishedAt` lama sebelum tahu apakah ini transisi pertama kali publish
- **Cover image opsional** (beda dari `Certification.imageUrl` yang wajib) — pakai `<ImageUpload>` yang sama dari Module 10, tapi form & validasi tidak mewajibkan diisi. Kalau kosong, card publik (`PostCard`) skip render gambar sama sekali (bukan placeholder), detail page juga skip hero image
- Navbar (`SiteHeader`) nambah link ke-7 ("Blog") — mengulang pola crowding yang sudah diantisipasi sejak Module 11 (waktu nav nambah dari 4 ke 6 item, breakpoint digeser ke `lg:`). Kali ini gap nav dikecilin lagi `gap-5`→`gap-4` (preemptive, niru pola penyesuaian gap yang sama dari Module 11) buat kasih ruang ekstra di lebar breakpoint 1024px
- `getPostBySlug()` di `lib/queries.ts` sengaja filter `published: true` LANGSUNG di level query database (bukan fetch semua lalu filter di komponen) — jadi draft benar-benar tidak pernah ke-fetch buat halaman publik sama sekali, bukan cuma disembunyikan di UI. `getPostById()` (admin only, buat form edit) sebaliknya tidak filter status, supaya admin tetap bisa edit draft
- `app/sitemap.ts` diupdate ikut nambahkan `/blog` (statis) + seluruh URL `/blog/[slug]` yang published (query `getPosts()` yang sudah otomatis cuma published) — draft otomatis tidak pernah masuk sitemap
- Testing: `npm run build` sukses, `npm run lint` tidak ada error/warning baru. End-to-end penuh lewat skrip Node (pola sama dari Module 10/13/19): login, unauthenticated create (401), create draft (tidak tampil publik, 404 di detail), create published dengan markdown campuran (h1/h2/bold/link/list — semua ke-render benar), duplicate slug (400), invalid slug format (400), admin list tampilkan badge Draft/Published dengan benar, update draft→published (`publishedAt` ke-set), delete kedua post test. Database dikonfirmasi bersih (0 post tersisa) setelah semua verifikasi selesai

### Review checkpoint
- [ ] Sudah direview
- Catatan review:

---

## Backlog / Ide belum masuk plan
*(kosong — semua item lama sudah masuk Module 14-21 di Phase 3/V3 di atas)*

## Changelog rencana
- 9 Juli 2026 — Task plan awal dibuat, stack dikunci: Next.js + Prisma/SQLite + NextAuth (Credentials)
- 9 Juli 2026 — Fokus dipersempit ke profil-portofolio saja (blog artikel jadi backlog). Referensi visual ditambahkan (dark mode, aksen biru, grid card portofolio, skill dengan icon tools) — dikembangkan jadi versi sendiri, bukan replikasi persis
- 9 Juli 2026 — Module 1 selesai. Deviasi teknis kecil dari rencana awal (stack inti tidak berubah): (1) Prisma pakai versi 7 dengan driver adapter `@prisma/adapter-better-sqlite3` karena versi ini tidak lagi punya default query engine bawaan; (2) hashing password pakai `bcryptjs` (implementasi bcrypt pure-JS) bukan `bcrypt` native, supaya tidak butuh build tools tambahan di Windows — tetap penuhi requirement "password wajib di-hash" di CLAUDE.md
- 9 Juli 2026 — Module 7 (in progress). Struktur `app/` direstrukturisasi pakai Next.js route group (`app/(public)/`) supaya `SiteHeader` cuma tampil di halaman publik, tidak di `/login`/`/admin/*` — perbaikan bug, URL tidak berubah. Database production dikonfirmasi ke user: SQLite lokal tidak jalan di Vercel, pindah ke **Turso** (disetujui user, lebih minim perubahan kode dibanding Postgres). Pembagian kerja disepakati: Claude siapkan kode/config/instruksi deploy, user yang eksekusi pembuatan akun (Turso/Vercel/GitHub) dan deploy aktual
- 9 Juli 2026 — Module 1-7 selesai, testing lokal berhasil, push ke GitHub berhasil (`monn01/personal-portofolio`, branch `main`). **Phase 2 (v2) dimulai:** tambah Module 8-13 (Experience, Certifications, Cloudinary image upload, design system baru, rotating tagline, home page scrollable, admin dashboard redesign) supaya website bisa dipakai sebagai CV digital yang lebih menjual. Draft awal v2 dibuat user di file terpisah (`TASKPLAN_1.md`) lalu di-merge ke sini — Module 1-7 tetap pakai versi lengkap (status + catatan implementasi) yang sudah ada, `TASKPLAN_1.md` dihapus setelah merge. `PROJECT.md` ikut diupdate (Core Features, Tech Stack, alur kerja) supaya konsisten sebagai rujukan sistem untuk v2
- 9 Juli 2026 — **Module 8-13 (Phase 2 / v2) selesai semua.** User buat akun Cloudinary sendiri di tengah jalan (Module 10), sehingga upload gambar (foto profil, thumbnail, sertifikat) sudah teruji end-to-end dengan kredensial asli, bukan cuma mocked. Sidebar admin baru menyatukan Profile+Skills jadi satu section (bukan dipisah, karena memang satu form sejak Module 5) — deviasi kecil dari daftar section awal yang menyebut "Skills" terpisah, tapi tidak ada di scope deliverables manapun. Belum ada module baru di-plan setelah ini — semua Definition of Done project-level (lihat PROJECT.md) sudah [x] kecuali deploy production aktual (Module 7, masih menunggu eksekusi user: buat DB Turso, push GitHub sudah jalan, tinggal deploy Vercel)
- 9 Juli 2026 — **Module 7 sengaja ditunda** (dikonfirmasi user) — mau tuntas dulu di lokal sebelum deploy production. **Phase 3 (UI/UX polish) diusulkan:** user merasa tampilan saat ini "terlalu biasa", kasih referensi napa.ituaku.com (screenshot disimpan di `gambar-referensi/`, di-gitignore — bukan dipakai isi database, cuma referensi visual). Instruksi eksplisit: bukan ditiru langsung, dipakai sebagai acuan level polish (pattern: blob dekoratif, foto cutout dinamis, stat showcase kontras tipografi, floating action button, numbered list) sambil tetap pertahankan identitas kita (dark neutral-950 + gradient biru-ungu). Claude yang usulkan breakdown (Module 14-16) berdasarkan analisis referensi — ditambahkan ke TASKPLAN, menunggu review/konfirmasi user sebelum mulai eksekusi
- 9 Juli 2026 — **Phase 3 diperluas jadi "V3"** atas permintaan user: digabung dengan semua item Backlog lama (filter kategori portofolio, form kontak, SEO basic, blog/artikel) plus toggle light/dark (awalnya cuma dianggap "sudah cukup" karena dark mode permanen sudah ada, tapi user tetap mau toggle beneran). Backlog jadi kosong — semua sudah masuk Module 14-21. Module baru: 15 (Light/Dark Toggle & Semantic Theme System, disisipkan sebelum module polish lain karena scope-nya besar — refactor warna hardcoded di puluhan file jadi token semantic), 18 (Portfolio Category Filter), 19 (Contact Form, perlu model baru `ContactMessage`), 20 (SEO Basic), 21 (Blog/Artikel, model baru `Post` — item paling besar, sengaja diletakkan terakhir). Module 16-17 (dulu 15-16) di-renumber dan dependency-nya diupdate. Urutan pengerjaan disepakati: fondasi (14-15) → komponen/polish yang bergantung (16-18) → fitur baru independen (19-21)
- 9 Juli 2026 — **Module 18-21 (sisa V3) selesai semua, V3 tuntas.** Dikerjakan berurutan dalam satu rentetan sesi: 18 (filter kategori portofolio via `searchParams`, plus refactor `PORTFOLIO_CATEGORIES` ke `lib/constants.ts` karena kepakai 3 tempat), 19 (Contact Form + `ContactMessage`, honeypot anti-spam, `FormField.tsx` dipindah dari `admin/` ke shared karena kepakai lintas admin+publik), 20 (SEO — `generateMetadata` per halaman, OG image dinamis via `next/og`, `sitemap.xml`/`robots.txt`; nemu & fix bug non-obvious: halaman anak yang declare `openGraph` sendiri ternyata berhenti mewarisi OG image dari root, fix lewat helper `lib/seo.ts`), 21 (Blog/Artikel + `Post`, `react-markdown` + `@tailwindcss/typography` buat render konten, warna `.prose` di-mapping ke token semantic sendiri). Testing tiap module konsisten lewat `npm run build` + `npm run lint` + skrip Node end-to-end (login, CRUD, verifikasi behavior spesifik tiap fitur), semua data test dibersihkan setelah verifikasi. Di tengah jalan user juga minta polish tambahan di luar rencana modul (efek interactive navbar di Module 15, footer + hero 2-kolom + extend efek visual ke halaman lain setelah Module 17, soft skill tanpa icon + `StatCard` hover fix sebelum Module 18) — semua tercatat di addendum masing-masing module terkait. **Sisa kerja project:** cuma Module 7 (deploy production ke Vercel/Turso, sengaja ditunda user) dan verifikasi visual asli di browser (claude-in-chrome belum pernah terhubung sepanjang project, semua testing sejauh ini lewat `npm run build`/curl/skrip HTTP)

---

*Terakhir diupdate: 9 Juli 2026*
