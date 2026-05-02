<div align="center">
  <img src="https://img.shields.io/badge/Kelompok_5_R3-IPB_University-f97316?style=for-the-badge" />
  <h1>🌌 IPB PRE-LOVED</h1>
  <p><strong>Cloud-Native Marketplace Infrastructure • Serverless Architecture • Edge Computing</strong></p>
  
  <p align="center">
    <img src="https://img.shields.io/badge/Next.js_15-000?style=flat&logo=nextdotjs&logoColor=white" />
    <img src="https://img.shields.io/badge/React_19-20232A?style=flat&logo=react&logoColor=61DAFB" />
    <img src="https://img.shields.io/badge/Tailwind_4-38B2AC?style=flat&logo=tailwind-css&logoColor=white" />
    <img src="https://img.shields.io/badge/Cloudflare_Pages-F38020?style=flat&logo=cloudflare&logoColor=white" />
    <img src="https://img.shields.io/badge/Cloudflare_D1-F38020?style=flat&logo=cloudflare&logoColor=white" />
    <img src="https://img.shields.io/badge/Cloudflare_R2-F38020?style=flat&logo=cloudflare&logoColor=white" />
    <br/>
    <img src="https://img.shields.io/badge/Drizzle_ORM-C5F74F?style=flat&logo=drizzle&logoColor=black" />
    <img src="https://img.shields.io/badge/Zod-3E67B1?style=flat&logo=zod&logoColor=white" />
    <img src="https://img.shields.io/badge/Auth.js-000?style=flat&logo=authjs&logoColor=white" />
    <img src="https://img.shields.io/badge/Docker-2496ED?style=flat&logo=docker&logoColor=white" />
    <img src="https://img.shields.io/badge/Wrangler-F38020?style=flat&logo=cloudflare&logoColor=white" />
    <img src="https://img.shields.io/badge/Lucide-FF0000?style=flat&logo=lucide&logoColor=white" />
  </p>
</div>

<br/>

### 🏗️ SYSTEM ARCHITECTURE
Visualisasi alur data dan interaksi komponen sistem berbasis *UML Sequence Diagram*.

<p align="center">
  <img src="public/images/architecture.svg" width="100%" alt="System Architecture" />
</p>

<br/>

### 📦 PROJECT MATRIX

<table align="center">
  <tr>
    <td width="50%" valign="top">
      <h4>🛍️ Katalog & Discovery</h4>
      <p>Sistem katalog produk dengan fitur <i>Doom Scroll</i>, filter kategori dinamis, dan integrasi WhatsApp Direct untuk transaksi aman.</p>
      <code>Search Engine</code> <code>WA Integration</code> <code>Grid UI</code>
    </td>
    <td width="50%" valign="top">
      <h4>🛡️ Admin Moderation Queue</h4>
      <p>Antrean moderasi produk (QC) yang efisien. Mendukung fitur <i>Reversion Status</i> jika produk diedit setelah disetujui.</p>
      <code>QC Queue</code> <code>Role Protection</code> <code>Audit Logs</code>
    </td>
  </tr>
  <tr>
    <td width="50%" valign="top">
      <h4>🐳 Docker-Sync Database</h4>
      <p>Otomasi sinkronisasi database lokal antar tim pengembang menggunakan <b>MD5 Checksum</b> untuk mencegah konflik migrasi.</p>
      <code>Docker Compose</code> <code>MD5 Checksum</code> <code>Auto-Migration</code>
    </td>
    <td width="50%" valign="top">
      <h4>🔒 Security Boundaries</h4>
      <p>Otentikasi khusus domain <b>@apps.ipb.ac.id</b> dengan proteksi <i>Self-Moderation Guard</i> dan validasi Server-Side Action.</p>
      <code>Auth Guard</code> <code>Internal Session</code> <code>Zod Validation</code>
    </td>
  </tr>
</table>

<br/>

### 🛠️ TECHNICAL ARSENAL

| Layer | Technology Stack |
| :--- | :--- |
| **Frontend** | Next.js 15 (App Router), React 19, Tailwind CSS, Lucide Icons |
| **Backend** | Cloudflare Edge Runtime, Drizzle ORM, Zod Validation |
| **Storage** | Cloudflare D1 (Relational), Cloudflare R2 (Media/Images) |
| **DevOps** | Docker, Wrangler CLI, MD5 Checksum Automation |

<br/>

### 📊 REPOSITORY ANALYTICS

<p align="center">
  <img src="https://img.shields.io/github/languages/top/rafaelatantya/IPB-Pre-Loved?style=for-the-badge&color=f97316" />
  <img src="https://img.shields.io/github/stars/rafaelatantya/IPB-Pre-Loved?style=for-the-badge&color=3b82f6" />
  <img src="https://img.shields.io/github/forks/rafaelatantya/IPB-Pre-Loved?style=for-the-badge&color=27c93f" />
  <img src="https://img.shields.io/github/repo-size/rafaelatantya/IPB-Pre-Loved?style=for-the-badge&color=8b5cf6" />
</p>

<br/>

### 🚀 QUICK START GUIDE

#### 1. Repository Setup
```zsh
git clone https://github.com/rafaelatantya/IPB-Pre-Loved.git
cd IPB-Pre-Loved
```

#### 2. Configuration (`.dev.vars`)
Salin `.dev.vars.example` dan isi variabel berikut untuk mengaktifkan fitur Auth & Database.

[IMPORTANT]
> - `AUTH_SECRET`: Gunakan `npx auth secret` untuk generate.
> - `AUTH_GOOGLE_ID`: Client ID dari Google Cloud Console.
> - `ADMIN_EMAILS`: Email yang diberikan hak akses Admin (pisahkan dengan koma).

#### 3. Run Development Server

**A. Menggunakan Docker (Sync Database)**
<br>
<img src="https://img.shields.io/badge/-~/p/IPB--Pre--Loved-blue?style=flat-square" /><img src="https://img.shields.io/badge/-yellow?style=flat-square" />
```zsh
docker-compose up --build
```

**B. Menggunakan Wrangler (Native)**
<br>
<img src="https://img.shields.io/badge/-~/p/IPB--Pre--Loved-blue?style=flat-square" /><img src="https://img.shields.io/badge/-yellow?style=flat-square" />
```zsh
npm install --legacy-peer-deps
npx wrangler d1 migrations apply DB --local
npm run pages:dev
```

<br/>

### 🛡️ SYSTEM BOUNDARIES & RULES
- **No Internal Payments**: Transaksi dilakukan secara eksternal via WhatsApp untuk menjamin fleksibilitas.
- **Email Restricted**: Hanya civitas akademika IPB (@apps.ipb.ac.id) yang dapat mengakses sistem.
- **Automatic QC**: Setiap perubahan data pada produk `APPROVED` akan mengembalikan status ke `PENDING`.

<br/>

---
<div align="center">
  <p><strong>Kelompok 5 R3 - Pengembangan Aplikasi Web</strong></p>
  <p>Departemen Ilmu Komputer • IPB University</p>
</div>
