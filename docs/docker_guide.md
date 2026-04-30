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
-   **Reset Database:** Hapus folder `./local-db-info` lalu jalankan `docker-compose up` kembali.
-   **Masuk ke Terminal Container:** `docker exec -it ipb-preloved-web bash`

## Troubleshooting
-   **Port Conflict:** Jika muncul error `Address already in use`, pastikan tidak ada proses `npm run pages:dev` yang sedang berjalan di luar Docker.
-   **Database Error:** Jika schema tidak sinkron, jalankan `npx drizzle-kit push` dari dalam container.

---
*Kembali ke: [Agents Rules](../.agents/rules/agents.md) | [File Dictionary](./file_desc.md)*
