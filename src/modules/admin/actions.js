"use server";

import { getContextDb } from "@/lib/db";
import { users, products, qcReviews, adminLogs, notifications, productImages, categories } from "@/db/schema";
import { desc, eq, like, or, sql } from "drizzle-orm";
import { getAuth } from "@/lib/auth";
import { qcReviewSchema } from "@/lib/validation";

/**
 * Action: Ambil Antrean QC (Pending Products)
 */
export async function getPendingProducts() {
  const auth = await getAuth();
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const db = await getContextDb();
    const result = await db.query.products.findMany({
      where: eq(products.status, "PENDING"),
      with: {
        seller: { columns: { name: true, email: true } },
        category: true,
        images: true
      },
      orderBy: [desc(products.createdAt)]
    });

    return { success: true, data: result };
  } catch (error) {
    console.error("Fetch Pending Error:", error);
    return { success: false, error: "Gagal mengambil antrean QC" };
  }
}

/**
 * Action: Ambil Seluruh Inventory (Pagination)
 */
export async function getAdminInventory({ page = 1, limit = 20, status = null }) {
  const auth = await getAuth();
  const session = await auth();

  if (session?.user?.role !== "ADMIN") return { success: false, error: "Unauthorized" };

  try {
    const db = await getContextDb();
    const offset = (page - 1) * limit;

    const result = await db.query.products.findMany({
      where: status ? eq(products.status, status) : undefined,
      with: {
        seller: { columns: { name: true, email: true } },
        category: true,
      },
      orderBy: [desc(products.createdAt)],
      limit,
      offset
    });

    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: "Gagal mengambil inventory" };
  }
}

/**
 * Daftar Alasan Penolakan Standar (Advanced QC Feedback)
 */
export const REJECTION_REASONS = {
  BAD_PHOTO: "Foto produk buram, gelap, atau tidak jelas.",
  INAPPROPRIATE: "Produk mengandung konten yang melanggar aturan atau tidak pantas.",
  PRICE_UNREALISTIC: "Harga yang dicantumkan tidak masuk akal atau mencurigakan.",
  MISLEADING: "Judul atau deskripsi barang menyesatkan atau tidak sesuai.",
  DUPLICATE: "Produk ini terdeteksi sebagai duplikasi dari listing yang sudah ada.",
  LOW_QUALITY: "Deskripsi terlalu singkat atau informasi barang sangat minim.",
  OUT_OF_SCOPE: "Barang ini tidak diizinkan untuk dijual di platform IPB Pre-Loved.",
  OTHER: "Alasan lainnya (cek catatan admin)."
};

/**
 * Action: Review Produk (Approve/Reject + Log QC + Advanced Feedback)
 */
export async function reviewProduct({ productId, decision, reasonCode = null, note = "" }) {
  const auth = await getAuth();
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    return { success: false, code: 403, error: "Unauthorized: Admin only" };
  }

  // Validasi Zod
  const validation = qcReviewSchema.safeParse({ productId, decision, note, reasonCode });
  if (!validation.success) {
    return { success: false, code: 400, error: "Validasi gagal", errors: validation.error.flatten().fieldErrors };
  }

  try {
    const db = await getContextDb();

    // EDGE CASE: Cek apakah produk masih PENDING (mencegah double-review)
    const currentProduct = await db.query.products.findFirst({
      where: eq(products.id, productId)
    });

    if (!currentProduct || currentProduct.status !== "PENDING") {
      return { success: false, error: "Produk sudah diproses atau tidak ditemukan" };
    }

    // Tentukan pesan penolakan yang ramah
    let rejectionMessage = "Produk Anda ditolak karena belum memenuhi kriteria komunitas.";
    if (decision === "REJECTED") {
      const reasonText = REJECTION_REASONS[reasonCode] || note || "Melanggar aturan komunitas.";
      rejectionMessage = `Produk "${currentProduct.title}" ditolak. Alasan: ${reasonText}${note && reasonCode ? " | Catatan: " + note : ""}`;
    }

    // Jalankan dalam transaksi agar atomik
    await db.batch([
      // 1. Update status produk
      db.update(products).set({ status: decision }).where(eq(products.id, productId)),
      
      // 2. Simpan Log Review
      db.insert(qcReviews).values({
        id: crypto.randomUUID(),
        productId,
        adminId: session.user.id,
        decision,
        note: note || (reasonCode ? REJECTION_REASONS[reasonCode] : ""),
      }),

      // 3. Log Aktivitas Admin (Audit Trail)
      db.insert(adminLogs).values({
        id: crypto.randomUUID(),
        adminId: session.user.id,
        action: "REVIEW_PRODUCT",
        targetId: productId,
        details: `Decision: ${decision}. Reason: ${reasonCode || "N/A"}. Note: ${note || "none"}`,
      }),

      // 4. Kirim Notifikasi ke Seller
      db.insert(notifications).values({
        id: crypto.randomUUID(),
        userId: currentProduct.sellerId,
        title: decision === "APPROVED" ? "Produk Disetujui! 🎉" : "Produk Ditolak ⚠️",
        message: decision === "APPROVED" 
          ? `Produk "${currentProduct.title}" Anda sekarang sudah tayang di katalog publik.`
          : rejectionMessage,
        type: decision === "APPROVED" ? "SUCCESS" : "DANGER",
      })
    ]);

    return { success: true, message: `Berhasil melakukan QC: ${decision}` };
  } catch (error) {
    console.error("QC Error:", error);
    return { success: false, error: "Gagal memproses QC Review" };
  }
}

/**
 * Action: Ambil Jumlah Antrean QC (Badge Summary)
 */
export async function getPendingQCCount() {
  const auth = await getAuth();
  const session = await auth();

  if (session?.user?.role !== "ADMIN") return 0;

  try {
    const db = await getContextDb();
    const result = await db.select({ count: sql`count(*)` })
      .from(products)
      .where(eq(products.status, "PENDING"));
    
    return result[0]?.count || 0;
  } catch (error) {
    return 0;
  }
}

/**
 * Action: Blokir/Buka Blokir User
 */
export async function toggleBlockUser(userId, status) {
  const auth = await getAuth();
  const session = await auth();

  if (session?.user?.role !== "ADMIN") return { success: false, code: 403, error: "Unauthorized" };

  // EDGE CASE: Dilarang blokir diri sendiri
  if (userId === session.user.id) {
    return { success: false, error: "Anda tidak bisa memblokir akun Anda sendiri" };
  }

  try {
    const db = await getContextDb();
    
    await db.batch([
      db.update(users).set({ isBlocked: status }).where(eq(users.id, userId)),
      db.insert(adminLogs).values({
        id: crypto.randomUUID(),
        adminId: session.user.id,
        action: status ? "BLOCK_USER" : "UNBLOCK_USER",
        targetId: userId,
        details: status ? "Account suspended" : "Account reactivated",
      }),
      db.insert(notifications).values({
        id: crypto.randomUUID(),
        userId: userId,
        title: status ? "Akun Ditangguhkan" : "Akun Diaktifkan Kembali",
        message: status 
          ? "Akun Anda telah ditangguhkan oleh Admin karena melanggar ketentuan layanan."
          : "Akun Anda telah diaktifkan kembali. Silakan masuk untuk melanjutkan.",
        type: status ? "DANGER" : "SUCCESS",
      })
    ]);

    return { success: true, message: status ? "User diblokir" : "Blokir dibuka" };
  } catch (error) {
    return { success: false, error: "Gagal update status blokir" };
  }
}

/**
 * Action: Flag User (Tandai Mencurigakan)
 */
export async function toggleFlagUser(userId, status) {
  const auth = await getAuth();
  const session = await auth();

  if (session?.user?.role !== "ADMIN") return { success: false, error: "Unauthorized" };

  try {
    const db = await getContextDb();
    await db.batch([
      db.update(users).set({ isFlagged: status }).where(eq(users.id, userId)),
      db.insert(adminLogs).values({
        id: crypto.randomUUID(),
        adminId: session.user.id,
        action: status ? "FLAG_USER" : "UNFLAG_USER",
        targetId: userId,
        details: status ? "User marked as suspicious" : "Suspicious flag removed",
      })
    ]);
    return { success: true, message: "Status flag diperbarui" };
  } catch (error) {
    return { success: false, error: "Gagal update flag" };
  }
}

/**
 * Action: Ambil semua user dengan fitur search & filter
 */
export async function getAdminUsers(search = "") {
  const auth = await getAuth();
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const db = await getContextDb();
    let baseQuery = db.select().from(users);
    
    if (search) {
      baseQuery = baseQuery.where(
        or(
          like(users.name, `%${search}%`),
          like(users.email, `%${search}%`),
          like(users.userType, `%${search}%`)
        )
      );
    }
    
    const result = await baseQuery.orderBy(desc(users.createdAt));
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: `Gagal mengambil data user: ${error.message}` };
  }
}

/**
 * Action: Toggle Role User (Admin <-> Buyer)
 */
export async function toggleUserRole(userId, currentRole) {
  const auth = await getAuth();
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const db = await getContextDb();
    const newRole = currentRole === "ADMIN" ? "BUYER" : "ADMIN";
    await db.batch([
      db.update(users).set({ role: newRole }).where(eq(users.id, userId)),
      db.insert(adminLogs).values({
        id: crypto.randomUUID(),
        adminId: session.user.id,
        action: "CHANGE_USER_ROLE",
        targetId: userId,
        details: `Role changed from ${currentRole} to ${newRole}`,
      }),
      db.insert(notifications).values({
        id: crypto.randomUUID(),
        userId: userId,
        title: "Perubahan Peran Akun",
        message: `Peran akun Anda telah diubah oleh Admin dari ${currentRole} menjadi ${newRole}.`,
        type: "INFO",
      })
    ]);
    return { success: true, message: `Role berhasil diubah menjadi ${newRole}` };
  } catch (error) {
    return { success: false, error: `Gagal mengubah role: ${error.message}` };
  }
}

/**
 * Action: Hapus User
 */
export async function deleteUser(userId) {
  const auth = await getAuth();
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const db = await getContextDb();
    await db.batch([
      db.delete(users).where(eq(users.id, userId)),
      db.insert(adminLogs).values({
        id: crypto.randomUUID(),
        adminId: session.user.id,
        action: "DELETE_USER",
        targetId: userId,
        details: "User account permanently deleted",
      })
    ]);
    return { success: true, message: "User berhasil dihapus" };
  } catch (error) {
    return { success: false, error: `Gagal menghapus user: ${error.message}` };
  }
}

/**
 * Action: Seed langsung dari dalam aplikasi
 */
export async function initializeDatabaseInternal(sessionUser = null) {
  try {
    const db = await getContextDb();
    
    if (sessionUser && sessionUser.email) {
      await db.insert(users).values({
        id: sessionUser.id || crypto.randomUUID(),
        name: sessionUser.name || 'Anonymous User',
        email: sessionUser.email,
        role: 'ADMIN' 
      }).onConflictDoUpdate({ 
        target: users.email, 
        set: { role: 'ADMIN' } 
      }).run();
    }

    return { success: true, message: "Database berhasil diinisialisasi & User disinkronkan!" };
  } catch (error) {
    return { success: false, error: `Seeding gagal: ${error.message}` };
  }
}

/**
 * Action: Ambil Seluruh Admin Logs (Audit Trail)
 */
export async function getAdminLogs({ page = 1, limit = 50 } = {}) {
  const auth = await getAuth();
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const db = await getContextDb();
    const offset = (page - 1) * limit;

    const result = await db.query.adminLogs.findMany({
      with: {
        admin: { columns: { name: true, email: true } },
      },
      orderBy: [desc(adminLogs.createdAt)],
      limit,
      offset
    });

    return { success: true, data: result };
  } catch (error) {
    console.error("Fetch Logs Error:", error);
    return { success: false, error: "Gagal mengambil log aktivitas" };
  }
}

/**
 * Action: Ambil Statistik Dashboard Admin (Optimized)
 */
export async function getAdminDashboardStats() {
  const auth = await getAuth();
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const db = await getContextDb();

    // 1. Hitung Produk Berdasarkan Status
    const productStats = await db.select({
      status: products.status,
      count: sql`count(*)`,
    }).from(products).groupBy(products.status);

    // 2. Hitung Total Users
    const userStats = await db.select({
      count: sql`count(*)`,
    }).from(users);

    // 3. Hitung Produk Baru Hari Ini (Terakhir 24 Jam)
    const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const newProductsToday = await db.select({
      count: sql`count(*)`,
    }).from(products).where(sql`${products.createdAt} >= ${dayAgo.getTime()}`);

    // 4. Hitung Total Klik WA (Leads)
    const waStats = await db.select({
      totalClicks: sql`sum(${products.whatsappClicks})`,
    }).from(products);

    // Map hasil ke format yang enak dipake UI
    const stats = {
      totalUsers: userStats[0]?.count || 0,
      pendingQC: productStats.find(s => s.status === "PENDING")?.count || 0,
      approvedProducts: productStats.find(s => s.status === "APPROVED")?.count || 0,
      soldProducts: productStats.find(s => s.status === "SOLD")?.count || 0,
      newToday: newProductsToday[0]?.count || 0,
      totalLeads: waStats[0]?.totalClicks || 0,
    };

    return { success: true, data: stats };
  } catch (error) {
    console.error("Admin Stats Error:", error);
    return { success: false, error: "Gagal memuat statistik" };
  }
}
