# 🛍️ IPB Pre-Loved - Backend (Modular Monolith)

A modern, secure, and high-performance marketplace for IPB students. Built with Next.js, Cloudflare D1, and R2.

---

## 🚀 Quick Start (Run from Scratch)

Ikuti langkah-langkah berikut untuk menjalankan project ini di komputer lokal Anda:

### 1. Clone & Install
```bash
git clone <repository-url>
cd IPB-Pre-Loved
npm install
```

### 2. Environment Setup
Buat file `.dev.vars` dari template yang tersedia:
```bash
cp .dev.vars.example .dev.vars
```
Buka file `.dev.vars` dan isi variabel berikut:
- `AUTH_SECRET`: Generate pake `npx auth secret`.
- `AUTH_GOOGLE_ID` & `AUTH_GOOGLE_SECRET`: Ambil dari Google Cloud Console.
- `ADMIN_EMAILS`: Daftar email admin (dipisahkan koma).

### 3. Database Migration (Local)
Inisialisasi database SQLite lokal Anda:
```bash
# Jalankan migrasi ke database D1 lokal
npx wrangler d1 migrations apply DB --local
```

### 4. Run Development Server
```bash
# Menggunakan wrangler dev (Direkomendasikan untuk testing R2/D1)
npx wrangler dev

# ATAU menggunakan standard next dev
npm run dev
```
Akses di: `http://localhost:3000`

---

## 🛠️ Tech Stack
- **Framework**: Next.js (App Router)
- **Runtime**: Cloudflare Pages (Edge Runtime)
- **Database**: Cloudflare D1 (SQLite)
- **ORM**: Drizzle ORM
- **Storage**: Cloudflare R2
- **Validation**: Zod
- **Auth**: NextAuth.js (Auth.js v5)

---

## 📖 Dokumentasi Lengkap
Silahkan cek folder `docs/` untuk detail lebih mendalam:
- [System Boundaries (RBAC)](/docs/system_boundaries.md)
- [Backend & Integration Guide](/docs/backend_docs.md)
- [File Dictionary](/docs/file_desc.md)
- [AI Agents Mandate](/agents.md)

---

## 🛡️ Security Rules
1. Hanya email `@apps.ipb.ac.id` yang diizinkan masuk.
2. Penjual wajib upload 3 foto atau 1 foto + 1 video (min 5 detik).
3. Semua upload video otomatis dikompresi di sisi client.
4. Admin memiliki otoritas penuh untuk memoderasi produk dan user.
