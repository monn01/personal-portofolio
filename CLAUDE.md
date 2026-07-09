# CLAUDE.md

## Context
Baca @PROJECT.md untuk konteks lengkap project ini (fitur, tech stack, target user, tampilan/UX).
Baca @TASKPLAN.md untuk breakdown module, dependency antar module, dan status pengerjaan.

## Workflow
- Kerjakan module di TASKPLAN.md **secara berurutan** sesuai dependency-nya — jangan lompat ke module yang dependency-nya belum selesai.
- Sebelum mulai module baru, cek dulu "Fungsi & code yang direncanakan" di module tersebut sebagai acuan.
- Setelah module selesai, update status checkbox di TASKPLAN.md (`[ ]` → `[x]`) dan isi bagian "Definition of Done" + "Review checkpoint".
- Kalau ada perubahan rencana di tengah jalan (nambah/ubah fitur, ganti pendekatan teknis), update TASKPLAN.md dan catat di "Changelog rencana" — jangan biarkan dokumen jadi basi.
- Kalau requirement di suatu module kurang jelas, tanya dulu sebelum implementasi, jangan asumsi sendiri.

## Aturan teknis
- Stack: Next.js (App Router) + TypeScript + Tailwind CSS + Prisma/SQLite + NextAuth.js (Credentials provider). Jangan ganti stack tanpa konfirmasi.
- Password wajib di-hash (bcrypt), jangan pernah simpan/log plain text.
- Semua route `/admin/*` wajib protected — cek session, redirect ke `/login` kalau belum auth.
- Data profil & portofolio harus dari database (Prisma), bukan hardcode di komponen.
- Single admin — tidak perlu sistem role/multi-user.

## Style
- Desain: dark mode, aksen biru, minimalis, terstruktur — lihat detail lengkap di section 5 PROJECT.md.
- Skill ditampilkan dengan icon/logo tools terkait, bukan cuma teks nama skill.
- Card portofolio ikuti hierarki: icon (kiri atas) → tahun (kanan atas) → judul → label peran → deskripsi → tech tags → link eksternal.

## Command
<!-- Isi setelah project di-setup, misal: -->
<!-- - Dev server: `npm run dev` -->
<!-- - Migrasi DB: `npx prisma migrate dev` -->
<!-- - Build: `npm run build` -->
