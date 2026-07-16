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

## Production

Live di **https://dzakydev.my.id** (Vercel + Turso). Panduan deploy lengkap (setup Turso, env vars, custom domain, dll) ada di `DEPLOY.md`.
