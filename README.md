# Personal Portfolio

Website portofolio pribadi (profil, skill, project) dengan dashboard admin. Lihat `PROJECT.md` untuk konteks lengkap dan `TASKPLAN.md` untuk status pengerjaan tiap module.

**Stack:** Next.js (App Router) · TypeScript · Tailwind CSS · Prisma (SQLite dev / Turso production) · NextAuth.js (Auth.js v5, Credentials provider)

## Setup lokal

```bash
npm install
npx prisma migrate dev
npx prisma db seed
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000). Login admin: `admin@example.com` / `admin123` (dari `prisma/seed.ts` — ganti setelah deploy).

Salin `.env.example` ke `.env` kalau belum ada, lalu sesuaikan `AUTH_SECRET` (generate dengan `npx auth secret`).

## Deploy ke production (Vercel + Turso)

Database dev pakai SQLite file lokal (`better-sqlite3`), yang **tidak bisa dipakai di Vercel** karena filesystem-nya read-only/ephemeral saat runtime. Production karena itu pakai [Turso](https://turso.tech) (SQLite-compatible, via libSQL) — kode di `lib/prisma.ts` otomatis pilih driver yang sesuai berdasarkan format `DATABASE_URL` (`file:...` → SQLite lokal, selain itu → Turso).

### 1. Buat database Turso

```bash
# install Turso CLI, lalu login
turso auth login

# buat database
turso db create personal-portofolio

# ambil connection URL
turso db show personal-portofolio --url

# generate auth token
turso db tokens create personal-portofolio
```

Simpan URL (`libsql://...`) dan token — dipakai di step 3.

### 2. Jalankan migration & seed ke Turso

Dari mesin lokal, arahkan sementara `DATABASE_URL` ke Turso lalu jalankan migration + seed (buat akun admin pertama):

```bash
# di .env, sementara ganti:
# DATABASE_URL="libsql://<nama-db>-<org>.turso.io"
# TURSO_AUTH_TOKEN="<token dari step 1>"

npx prisma migrate deploy
npx prisma db seed
```

**Ganti password admin default** setelah ini (lewat `/admin/dashboard/profile` tidak bisa ganti password — untuk sekarang update manual lewat script/Prisma Studio, ganti `passwordHash` pakai `bcryptjs.hash()`). Kembalikan `.env` lokal ke `file:./prisma/dev.db` setelah selesai supaya dev lokal tidak tidak sengaja nulis ke Turso.

### 3. Push ke GitHub & deploy di Vercel

```bash
git add -A
git commit -m "Initial commit"
git remote add origin <url-repo-github>
git push -u origin master
```

Di [vercel.com/new](https://vercel.com/new), import repo GitHub tersebut. Set environment variables berikut di Vercel project settings:

| Variable | Value |
|---|---|
| `DATABASE_URL` | `libsql://<nama-db>-<org>.turso.io` |
| `TURSO_AUTH_TOKEN` | token dari `turso db tokens create` |
| `AUTH_SECRET` | generate baru khusus production: `npx auth secret` |

Deploy. Next.js akan otomatis jalankan `prisma generate` lewat `postinstall` script sebelum build.

### 4. Verifikasi

- Halaman publik (`/`, `/about`, `/skills`, `/portfolio`) tampil dengan data dari Turso
- Login admin di `/login` berhasil, redirect ke `/admin/dashboard`
- Coba edit profil / tambah portofolio, cek perubahan muncul di halaman publik
