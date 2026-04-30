# 🛍️ IPB Pre-Loved (Kelompok 5 R3)

Platform jual-beli barang bekas layak pakai khusus untuk Civitas Akademika IPB University.

## 🛠️ Tech Stack
- **Framework:** Next.js 15 (App Router)
- **Runtime:** Cloudflare Pages (Edge)
- **Database:** Cloudflare D1 (SQLite)
- **ORM:** Drizzle ORM
- **Storage:** Cloudflare R2
- **Auth:** NextAuth (Google SSO - @apps.ipb.ac.id)
- **Styling:** Tailwind CSS & Shadcn UI

### 🐳 Docker Environment
Proyek ini mendukung penuh Docker untuk kemudahan setup:
- **Auto-install:** Dependencies di-install otomatis saat container jalan.
- **Interactive Reset:** Saat container dimulai, Anda akan ditanya: `Do you want to RESET database and dummy data? (y/N)`. Anda punya waktu 10 detik untuk menjawab sebelum otomatis lanjut ke "No".
- **Port:** Aplikasi berjalan di `http://localhost:8788`.

## 💻 Manual Setup (Tanpa Docker)
Jika Anda ingin menjalankan secara native:

## 🚀 Cara Menjalankan (Development)

### A. Menggunakan Docker (Rekomendasi - Paling Stabil)
1.  Copy `.dev.vars.example` menjadi `.dev.vars` dan isi secret-nya.
2.  Jalankan `docker-compose up --build`.
3.  Akses di `http://localhost:8788`.
    *   *Sistem akan otomatis mengelola database dan sinkronisasi data dummy untuk Anda.*

### B. Menjalankan Lokal (Native)
1.  **Install Dependencies**: `npm install --legacy-peer-deps`
2.  **Environment**: Setup `.dev.vars`.
3.  **Database**: `npx wrangler d1 migrations apply DB --local`
4.  **Run Dev**: `npm run pages:dev`

**Opsi B: Fast Development (Recommended for Daily Coding)**
> Gunakan ini biar ngoding UI/Logic dapet HMR instan tapi tetep konek ke D1/R2.
> Buka 2 terminal:
> - **Terminal 1:** `npm run dev:turbo`
> - **Terminal 2:** `npm run dev:proxy`
> - **Akses di:** `http://localhost:8788`

## 🛡️ Security & Boundaries
1.  **Auth:** Wajib login menggunakan email `@apps.ipb.ac.id`.
2.  **Media:** Video otomatis dikompres ke **720p 2500kbps** (H.264) untuk efisiensi bandwidth.
3.  **Workflow:** Setiap edit barang oleh Non-Admin akan meriset status barang menjadi `PENDING` untuk di-review ulang oleh Admin.

## 📊 Sample Data Overview (GIGA SEED V5)
Setelah menjalankan `npm run db:wipe`, database Anda akan terisi dengan 15+ produk dummy untuk keperluan testing:

| Kategori | Jumlah Produk | Contoh Barang |
| :--- | :--- | :--- |
| **Elektronik** | 4 | MacBook Air M1, Monitor LG, Headset Logitech |
| **Buku & Modul** | 3 | Buku Python, Modul Kalkulus I & II |
| **Kebutuhan Kost** | 4 | Meja Lipat, Kipas Angin, Rak Sepatu, Termos |
| **Peralatan Praktikum** | 2 | Kalkulator Casio FX-991EX, Jas Lab |
| **Fashion & Formal** | 2 | Sepatu Pantofel, Batik IPB Official |

### 📸 Media Consistency Mapping
Semua produk dijamin memiliki kombinasi media yang konsisten sesuai aturan bisnis:

| Product ID | Pattern | Media Assets |
| :--- | :--- | :--- |
| **p-1 (MacBook)** | 3 Img + 1 Vid | `prod_1-3.jpg`, `video_1.mp4` |
| **p-3 (Meja)** | 3 Img + 1 Vid | `prod_7-9.jpg`, `video_2.mp4` |
| **p-7 (Sepatu)** | 3 Img + 1 Vid | `prod_19-21.jpg`, `video_3.mp4` |
| **p-2, p-4 s/d p-6** | 3 Images | `prod_X.jpg` (Unique per product) |
| **p-8 s/d p-15** | 3 Images | `prod_X.jpg` (Unique per product) |

---
*Note: Selalu ikuti [Hierarchy of Truth](.agents/rules/agents.md) sebelum melakukan perubahan besar.*
