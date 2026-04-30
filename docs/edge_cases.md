# 🌪️ Edge Cases & "Crazy" Infrastructure Bugs

Dokumen ini mencatat masalah teknis non-trivial yang muncul akibat batasan infrastruktur (Cloudflare Workers, Next.js Edge, D1) dan bagaimana cara mengatasinya.

## 1. Cloudflare Root Path 405 (Method Not Allowed)
- **Symptom**: Klik tombol yang memicu Server Action di halaman utama (`/`) menghasilkan alert "Unexpected response" atau error 405 di terminal.
- **Root Cause**: Cloudflare Pages menganggap path `/` sebagai file statis (`index.html`) yang menolak request `POST`.
- **Ultimate Solution**: Jangan gunakan Server Action langsung di root path. Buat **API Route** khusus (misal: `/api/user/upgrade`) dan panggil menggunakan `fetch()` dari client. API Route di Cloudflare tidak memiliki batasan routing 405 seperti root path.

## 2. DNS Lookup Failed: internal_suspense_cache_hostname.local
- **Symptom**: Server Action crash (500 error) saat mencoba menjalankan `revalidatePath("/")`.
- **Root Cause**: Bug pada runtime `workerd` (Cloudflare) saat berinteraksi dengan sistem caching internal Next.js 15. Server mencoba mencari host internal untuk menghapus cache tapi gagal koneksi DNS.
- **Solution**: Matikan/comment semua fungsi `revalidatePath()` di Server Actions.
- **Workaround**: Gunakan `window.location.href = "/..."` di sisi Client setelah action sukses untuk memaksa browser memuat data segar.

## 3. JWT Sync Stale State (Amnesia Session)
- **Symptom**: User sudah berhasil update database (pilih role), tapi Middleware atau UI masih melihat user sebagai `ONBOARDING`.
- **Root Cause**: Next-Auth v5 di Edge Runtime tidak selalu melakukan re-fetch database secara otomatis kecuali dipicu manual.
- **Solution**:
    1. Tambahkan fail-safe check di `jwt` callback (`src/lib/auth.js`) yang akan memaksa query ke database D1 jika `token.role === "ONBOARDING"`.
    2. Gunakan `email` (verified) sebagai identifier utama untuk database update, bukan `userId` dari Google yang formatnya sering tidak konsisten dengan UUID database.

## 4. SQLITE_BUSY (Sequential Uploads)
- **Symptom**: Upload banyak media sekaligus menghasilkan error `database is locked`.
- **Root Cause**: Cloudflare D1 (SQLite) hanya mendukung satu operasi tulis pada satu waktu. Upload paralel yang terlalu cepat mengunci database.
- **Solution**: Gunakan loop **Sequential** (bukan `Promise.all`) untuk operasi yang menulis ke database secara bertubi-tubi di lingkungan lokal.

---
*Catatan: Dokumen ini wajib dibaca Agent AI sebelum melakukan perubahan besar pada alur Auth atau Media.*
