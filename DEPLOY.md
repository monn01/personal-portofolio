# DEPLOY.md
> Panduan deploy project ke production. Dikerjakan setelah semua module di TASKPLAN.md selesai & ditest lokal.
> Stack deploy: Vercel (Hobby/gratis) + Turso (libSQL, gratis) + domain custom (my.id)

---

## Prasyarat sebelum mulai
- [x] Semua module di TASKPLAN.md sudah selesai dan ditest lokal
- [ ] Kode sudah di-push ke GitHub (repo `personal-portofolio`)
- [x] Domain `.my.id` sudah dibeli dan aktif — **dzakydev.my.id** (aktif s.d. 2027-07-15, auto-renew nyala)
- [ ] Akun Vercel (bisa daftar pakai akun GitHub, gratis)
- [ ] Akun Turso (turso.tech, gratis)

**Catatan domain:** Nameserver saat ini masih default/parking (`hermes.dns-parking.com`, `artemis.dns-parking.com`) — belum diarahkan ke mana pun. Ini akan diubah di Tahap 8.

**Catatan teknis:** Kode sudah pakai dual-adapter Prisma (`@prisma/adapter-better-sqlite3` untuk lokal, `@prisma/adapter-libsql` untuk production) — dipilih otomatis oleh `lib/prisma.ts` berdasarkan prefix `DATABASE_URL` (`file:` = lokal, selain itu = Turso). Jadi **tidak perlu ubah `schema.prisma` atau kode apapun** untuk deploy — provider tetap `sqlite`, cukup isi environment variable production dengan benar.

---

## Tahap 1 — Setup Database Production (Turso)

1. Daftar/login ke turso.tech (bisa pakai akun GitHub)
2. Install Turso CLI kalau belum ada, lalu login: `turso auth login`
3. Buat database baru: `turso db create personal-portofolio` (pilih region terdekat kalau ditanya, mis. Singapore)
4. Ambil connection URL: `turso db show personal-portofolio --url` → hasilnya format `libsql://personal-portofolio-<org>.turso.io`
5. Buat auth token: `turso db tokens create personal-portofolio` → catat hasilnya
6. **Jangan share connection URL/token ini ke siapapun**, termasuk jangan ditempel ke chat AI manapun

### Definition of Done
- Database Turso kosong sudah aktif
- Connection URL dan auth token sudah dicatat aman (password manager / notes pribadi)

---

## Tahap 2 — Push Kode ke GitHub (kalau ada perubahan)

```bash
git add .
git commit -m "Update sebelum deploy production"
git push origin main
```

---

## Tahap 3 — Import Project ke Vercel

1. Buka vercel.com, login pakai akun GitHub
2. Klik "Add New Project" → pilih repo `personal-portofolio`
3. Vercel otomatis mendeteksi ini project Next.js — biarkan setting default
4. **Jangan klik Deploy dulu** — isi environment variables terlebih dahulu (tahap 4)

---

## Tahap 4 — Isi Environment Variables di Vercel

Di halaman setup project (sebelum deploy), buka bagian **Environment Variables**, tambahkan satu-satu:

| Key | Value |
|---|---|
| `DATABASE_URL` | connection URL dari Turso (Tahap 1), format `libsql://...` |
| `TURSO_AUTH_TOKEN` | auth token dari Turso (Tahap 1) |
| `AUTH_SECRET` | generate baru khusus production (lihat di bawah), **jangan pakai yang sama dengan lokal** |
| `AUTH_TRUST_HOST` | `true` (wajib di Vercel — proxy-nya tidak otomatis dikenali Auth.js tanpa ini) |
| `CLOUDINARY_CLOUD_NAME` | sama seperti di `.env` lokal |
| `CLOUDINARY_API_KEY` | sama seperti di `.env` lokal |
| `CLOUDINARY_API_SECRET` | sama seperti di `.env` lokal |
| `NEXT_PUBLIC_SITE_URL` | `https://dzakydev.my.id` (dipakai untuk SEO/sitemap/OG image; sementara boleh isi domain `xxx.vercel.app` dulu, update lagi setelah Tahap 8) |

**Catatan keamanan:** isi semua value ini langsung di dashboard Vercel (browser), bukan lewat chat Claude Code.

### Cara generate AUTH_SECRET baru
```bash
npx auth secret
```
Jalankan di terminal lokal, copy hasilnya. (Alternatif: `openssl rand -base64 32`)

### Definition of Done
- Semua environment variable production sudah terisi di Vercel Dashboard

---

## Tahap 5 — Deploy

1. Klik **Deploy** di Vercel
2. Tunggu proses build selesai (biasanya 1-3 menit)
3. Kalau build gagal, cek log error di Vercel — screenshot ke Claude/Claude Code untuk didiagnosa

### Definition of Done
- Deployment sukses, muncul URL `xxx.vercel.app` yang bisa diakses

---

## Tahap 6 — Migrasi Schema ke Database Production

Setelah deploy pertama sukses, database Turso masih kosong (belum ada tabel). Perlu jalankan migration ke sana dari terminal lokal, dengan env var sementara diarahkan ke Turso (bukan SQLite lokal):

```bash
DATABASE_URL="libsql://<url-turso-kamu>" TURSO_AUTH_TOKEN="<token-turso-kamu>" npx prisma migrate deploy
```

(Di PowerShell, set env var per-command dulu: `$env:DATABASE_URL="..."; $env:TURSO_AUTH_TOKEN="..."; npx prisma migrate deploy`)

### Definition of Done
- Tabel-tabel sudah muncul di Turso (cek via `turso db shell personal-portofolio` → `.tables`)

---

## Tahap 7 — Buat Akun Admin di Production

Sama seperti di lokal (`npm run set-admin`), tapi dijalankan dengan `DATABASE_URL`/`TURSO_AUTH_TOKEN` yang mengarah ke Turso production (env var sementara, sama seperti Tahap 6).

```bash
DATABASE_URL="libsql://<url-turso-kamu>" TURSO_AUTH_TOKEN="<token-turso-kamu>" npm run set-admin -- "email-kamu@example.com" "PasswordProductionBaru"
```

**Gunakan password yang BEDA dari password development lokal.**

### Definition of Done
- Bisa login ke `https://xxx.vercel.app/login` dengan akun admin production

---

## Tahap 8 — Hubungkan Domain Custom (dzakydev.my.id)

1. Di Vercel Dashboard → project kamu → Settings → Domains
2. Masukkan `dzakydev.my.id`
3. Vercel akan kasih instruksi DNS record (biasanya tipe `A` atau `CNAME`) yang harus ditambahkan
4. Buka panel pengelolaan domain (tempat kamu beli `dzakydev.my.id`), masuk ke bagian **DNS/Nameserver → Edit**
5. **Catatan:** nameserver saat ini masih default parking (`hermes.dns-parking.com` / `artemis.dns-parking.com`). Ganti/tambahkan record sesuai instruksi Vercel — biasanya ini berarti mengganti ke custom DNS record (bukan ganti nameserver provider), tapi ikuti persis instruksi yang muncul di Vercel saat itu
6. Tunggu propagasi DNS (bisa beberapa menit sampai beberapa jam)
7. Setelah terhubung, Vercel otomatis provision SSL certificate — domain langsung aktif dengan `https://`

### Definition of Done
- `https://dzakydev.my.id` bisa diakses, ada ikon gembok (SSL aktif) di browser
- Tidak ada redirect ke `xxx.vercel.app` yang terlihat pengunjung

---

## Tahap 9 — Update NEXT_PUBLIC_SITE_URL

Setelah domain aktif, kembali ke Environment Variables di Vercel, update `NEXT_PUBLIC_SITE_URL` ke domain custom yang sudah aktif:
```
NEXT_PUBLIC_SITE_URL=https://dzakydev.my.id
```
Redeploy project setelah update ini (Vercel biasanya otomatis redeploy saat env variable berubah, atau trigger manual dari dashboard).

---

## Tahap 10 — Testing Akhir di Production

- [ ] Buka domain custom, cek semua halaman publik tampil benar
- [ ] Login admin berhasil dengan akun production
- [ ] Coba edit profil, tambah portofolio — cek tersimpan dan tampil di publik
- [ ] Upload gambar (Cloudinary) berfungsi di production
- [ ] Cek tampilan mobile & desktop
- [ ] Logout, coba akses `/admin/dashboard` langsung tanpa login → harus redirect ke `/login`
- [ ] Cek traffic chart di `/admin/dashboard` mulai terisi setelah beberapa kunjungan

---

## Checklist keamanan sebelum benar-benar "go live"
- [ ] `.env` tidak pernah ter-commit ke GitHub (sudah dicek dari awal, tapi cek ulang)
- [ ] Password admin production berbeda dari development
- [ ] `AUTH_SECRET` production berbeda dari development
- [ ] Tidak ada API key/secret yang ter-expose di kode frontend (cek dengan inspect element/view source)

---

## Troubleshooting umum

| Masalah | Kemungkinan penyebab |
|---|---|
| Build gagal di Vercel | Environment variable belum lengkap, atau ada error TypeScript yang lolos di lokal |
| Domain tidak terhubung setelah lama | DNS belum ter-propagasi, cek ulang record di panel domain |
| Login gagal di production tapi sukses di lokal | `AUTH_TRUST_HOST` belum di-set `true`, atau `AUTH_SECRET` salah isi |
| Upload gambar gagal di production | Environment variable Cloudinary belum terisi di Vercel |
| Query database error di production | `DATABASE_URL` bukan format `libsql://`, atau `TURSO_AUTH_TOKEN` salah/kosong |

---

*Terakhir diupdate: 16 Juli 2026 — disesuaikan ke Turso (bukan Neon/Postgres) supaya sinkron dengan implementasi kode yang sudah ada.*
