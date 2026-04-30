# 🐳 Panduan Docker - IPB Pre Loved

Panduan ini ditujukan untuk pengembang (Frontend/Backend) yang ingin menjalankan proyek ini di lingkungan yang terisolasi dan konsisten menggunakan Docker. Sangat disarankan bagi pengguna **Windows** (tanpa WSL) untuk menghindari masalah pathing dan binary.

## Prasyarat
1.  **Docker Desktop** sudah terinstall dan berjalan.
2.  File `.dev.vars` sudah ada di root project (Gunakan `.dev.vars.example` sebagai referensi).

## Cara Menjalankan

Cukup jalankan perintah berikut di terminal:

```bash
docker-compose up --build
```

### Apa yang terjadi otomatis?
1.  **Build Environment:** Docker menyiapkan OS Linux dengan Node.js 20.
2.  **Auto-Migration:** Menjalankan `npm run db:push:local` untuk memastikan tabel database tersedia.
3.  **Auto-Seeding:** Menjalankan data dummy dari `seed.sql` agar katalog tidak kosong.
4.  **Dev Server:** Menjalankan server Wrangler di `http://localhost:8788`.

## Perintah Penting Lainnya

-   **Menghentikan Container:** `docker-compose down`
-   **Reset Database:** Jalankan `npm run db:wipe` (disarankan dari dalam container) untuk menghapus data lama dan menerapkan migrasi terbaru.
-   **Update Schema:** Jika ada perubahan di `schema.js`, jalankan `npm run db:generate` untuk membuat file migrasi baru sebelum melakukan deploy atau reset.

## Troubleshooting
-   **Port Conflict:** Jika muncul error `Address already in use`, pastikan tidak ada proses `npm run pages:dev` yang sedang berjalan di luar Docker.
-   **Database Error (No column found):** Ini tandanya migrasi lu ketinggalan. Solusinya: Jalankan `npm run db:generate` lalu `npm run db:wipe`.

---
*Kembali ke: [Agents Rules](../.agents/rules/agents.md) | [File Dictionary](./file_desc.md)*
