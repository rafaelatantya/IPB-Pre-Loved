# 📂 KAMUS FILE (File Dictionary)

Dokumen ini berisi pemetaan dan fungsi dari skrip-skrip yang ada di dalam *repository* IPB Pre-Loved.
**[PERHATIAN AI]: WAJIB MENAMBAHKAN ENTRI BARU KE TABEL INI** setiap selesai membuat atau mengubah tujuan fungsionalitas file secara besar-besaran.

| File / Folder Path | Deskripsi Fungsi |
| --- | --- |
| `README.md` | Panduan utama project dengan opsi instalasi Docker (Recommended) dan Manual |
| `src/db/schema.js` | Struktur rancangan tabel database D1 menggunakan Drizzle ORM |
| `src/lib/db.js` | Helper koneksi Drizzle + Context Helpers (`getEnv`, `getContextDb`) |
| `src/lib/auth.js` | Konfigurasi inti dan callback rules pembatasan domain NextAuth (SSO Google) |
| `src/app/api/auth/[...nextauth]/route.js` | Route handler yang mengakomodir standard fetch Edge dari library NextAuth |
| `src/middleware.js` | Middleware pelindung rute SSR Next.js berdasarkan Role (SELLER/ADMIN bypass rules) |
| `wrangler.toml` | Konfigurasi build Cloudflare Emulator, Binding Database ID, dan R2 ID |
| `.agents/rules/agents.md` | Aturan konteks/batas suci mandat untuk semua AI di lingkungan project ini |
| `Dockerfile` | Blueprint environment Linux untuk standardisasi development antar OS |
| `docker-compose.yml` | Konfigurasi orkestrasi container Docker (Binding port, volume, & env) |
| `scripts/docker-entrypoint.sh` | Script automasi startup container (Migrasi DB, Seeding, & Build Project) |
| `drizzle/seed.sql` | Script SQL untuk inisialisasi data dummy (Mega Seed V4) |
| `scripts/seed-media.sh` | Script automasi download aset media ke R2 lokal |
| `.gitattributes` | Pengaturan Git untuk memaksa LF line endings agar script tidak error di Windows |
| `docs/docker_guide.md` | Panduan lengkap penggunaan Docker untuk tim pengembang |
| `src/modules/admin/actions.js` | Server Actions khusus manajemen user dan inisialisasi DB |
| `src/modules/product/actions.js` | Server Actions untuk CRUD produk (dengan security owner logic) |
| `src/modules/category/actions.js` | Server Actions untuk manajemen kategori barang |
| `src/modules/wishlist/actions.js` | Server Actions untuk manajemen produk favorit (Wishlist) pembeli |
| `src/modules/catalog/services.js` | Business logic/Services untuk query data katalog publik (Approved, Featured, & Detail) |
| `docs/backend_docs.md` | Panduan teknis Backend & Integrasi Agent (Role-Based) |
| `jsconfig.json` | Konfigurasi path aliasing `@/*` untuk memudahkan import modul |
| `src/app/admin-test/page.js` | Dashboard modular untuk pengujian CRUD Backend (User, Category, R2 Product) |
| `src/components/auth/OnboardingGuard.jsx` | Komponen Client-Side yang memaksa user ONBOARDING menyelesaikan profil |
| `src/app/(admin)/admin/dashboard/page.jsx` | Dashboard utama panel administrasi (Statistik & Overview) |
| `src/app/(admin)/admin/queue/page.jsx` | Antrean moderasi produk PENDING untuk direview Admin |
| `src/app/(admin)/admin/queue/[id]/page.jsx` | Detail produk dalam antrean QC beserta kontrol Approve/Reject |
| `src/app/(seller)/dashboard/page.jsx` | Dashboard pusat kontrol untuk penjual (Manajemen Produk & Penjualan) |
| `src/app/(seller)/product/add/page.jsx` | Form pengajuan produk baru oleh penjual |
| `src/components/layouts/Sidebar.jsx` | Komponen navigasi samping universal untuk dashboard |
| `src/components/layouts/adminSidebar.jsx` | Komponen navigasi samping khusus panel Admin |
| `src/modules/admin/components/QCActionButtons.jsx` | Komponen tombol interaksi kontrol QC (Approve/Reject) |
| `src/modules/product/components/ImageUploader.jsx` | Komponen UI untuk unggah dan pratinjau gambar produk |
| `src/modules/product/components/ProductForm.jsx` | Komponen form modular untuk input data produk |
| `src/app/api/images/[...key]/route.js` | API Proxy untuk melayani file gambar dari R2 ke browser (Local & Prod) |
| `src/app/api/upload/route.js` | API Route untuk upload file besar ke R2 dengan progress bar support |
| `src/app/api/user/upgrade/route.js` | API Route khusus untuk upgrade role (Bypass Cloudflare 405 Root Error) |
| `src/lib/video.js` | Utility frontend untuk kompresi video 1080p 30fps H.264 (FFmpeg) |
| `src/lib/image.js` | Utility frontend untuk kompresi gambar ke 12MP WebP |
| `src/modules/auth/actions.js` | Server Actions untuk manajemen pendaftaran dan proses onboarding role |
| `src/modules/user/actions.js` | Server Actions untuk manajemen profil user (Seller/Buyer Settings & Upgrade Role) |
| `src/modules/notification/actions.js` | Server Actions untuk mengambil dan menandai notifikasi (Approve/Reject) |
