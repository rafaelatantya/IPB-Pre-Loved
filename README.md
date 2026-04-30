# 🛍️ IPB Pre-Loved - Platform Jual Beli Barang Bekas Mahasiswa IPB

Platform marketplace terpusat dan aman khusus untuk Civitas Akademika IPB University guna memudahkan transaksi barang bekas layak pakai.

---

## 🐳 Quick Start (Cara Termudah - REKOMENDASI)

Gunakan Docker untuk setup instan tanpa perlu install Node.js, Wrangler, atau database secara manual. Cocok untuk pengguna Windows/Mac/Linux.

1.  **Clone Repo:** `git clone <repository-url> && cd IPB-Pre-Loved`
2.  **Setup Env:** Rename `.dev.vars.example` menjadi `.dev.vars` dan isi variabelnya.
3.  **Run:**
    ```bash
    docker-compose up --build
    ```
4.  **Akses:** Buka `http://localhost:8788`. Database & Data Dummy otomatis terisi!

---

## 💻 Manual Setup (Tanpa Docker)

Jika Anda ingin menjalankan secara native:

1.  **Install:** `npm install --legacy-peer-deps`
2.  **Env:** `cp .dev.vars.example .dev.vars`
3.  **DB:** `npm run db:push:local`
4.  **Run:** `npm run pages:dev`

Akses di: `http://localhost:8788`

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
- [Docker Guide](/docs/docker_guide.md)
- [System Boundaries (RBAC)](/docs/system_boundaries.md)
- [Backend & Integration Guide](/docs/backend_docs.md)
- [File Dictionary](/docs/file_desc.md)
- [AI Agents Rules](/.agents/rules/agents.md)

---

## 🛡️ Security Rules
1. Hanya email `@apps.ipb.ac.id` yang diizinkan masuk.
2. Penjual wajib upload 3 foto atau 1 foto + 1 video (min 5 detik).
3. Semua upload video otomatis dikompresi di sisi client.
4. Admin memiliki otoritas penuh untuk memoderasi produk dan user.
