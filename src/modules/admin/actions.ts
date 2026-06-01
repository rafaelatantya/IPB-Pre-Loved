"use server";

import { getContextDb } from "@/lib/db";
import { users, products, qcReviews, adminLogs, notifications, productImages, categories } from "@/db/schema";
import { desc, eq, like, or, sql } from "drizzle-orm";
import { getAuth } from "@/lib/auth";
import { qcReviewSchema } from "@/lib/validation";
import { REJECTION_REASONS } from "./constants";


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
        images: { limit: 1 }, // Only first image needed for thumbnail
      },
      orderBy: [desc(products.createdAt)],
      limit,
      offset
    });

    return { success: true, data: result, total: result.length };
  } catch (error) {
    return { success: false, error: "Gagal mengambil inventory" };
  }
}

/**
 * Action: Admin Update Product Status (Take Down / Direct Approve / Reject)
 */
export async function adminUpdateProductStatus({ productId, status, note = "" }) {
  const auth = await getAuth();
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const db = await getContextDb();

    const product = await db.query.products.findFirst({
      where: eq(products.id, productId)
    });

    if (!product) {
      return { success: false, error: "Produk tidak ditemukan" };
    }

    const operations: any[] = [
      db.update(products).set({ status }).where(eq(products.id, productId)),
      db.insert(adminLogs).values({
        id: crypto.randomUUID(),
        adminId: session.user.id,
        action: status === "APPROVED" ? "APPROVE_PRODUCT" : "REJECT_PRODUCT",
        targetId: productId,
        details: `Admin changed status of ${product.title} to ${status}. Note: ${note || "No note"}`,
      }),
      db.insert(notifications).values({
        id: crypto.randomUUID(),
        userId: product.sellerId,
        title: status === "APPROVED" ? "Produk Disetujui! 🎉" : "Produk Diturunkan ⚠️",
        message: status === "APPROVED" 
          ? `Produk "${product.title}" Anda disetujui oleh Admin dan sekarang tayang.`
          : `Produk "${product.title}" Anda diturunkan/ditolak oleh Admin. Catatan: ${note || "Melanggar aturan komunitas"}`,
        type: status === "APPROVED" ? "SUCCESS" : "DANGER",
      })
    ];

    await db.batch(operations as any);
    return { success: true, message: `Status produk berhasil diubah ke ${status}` };
  } catch (error) {
    console.error("Admin Status Update Error:", error);
    return { success: false, error: "Gagal memperbarui status produk" };
  }
}

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
        details: `Decision: ${decision}. Reason: ${note || reasonCode || "Tidak ada alasan"}`,
      }),

      // 4. Kirim Notifikasi ke Seller
      db.insert(notifications).values({
        id: crypto.randomUUID(),
        userId: currentProduct.sellerId,
        title: decision === "APPROVED" ? "Produk Disetujui! 🎉" : "Produk Ditolak ⚠️",
        message: decision === "APPROVED" 
          ? `Produk "${currentProduct.title}" Anda sekarang sudah tayang di katalog publik. Catatan Admin: ${note || "Lolos QC"}`
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
    
    const operations: any[] = [
      db.update(users).set({ 
        isBlocked: status,
        updatedAt: new Date().getTime() 
      }).where(eq(users.id, userId)),
      db.insert(adminLogs).values({
        id: crypto.randomUUID(),
        adminId: session.user.id,
        action: status ? "BLOCK_USER" : "UNBLOCK_USER",
        targetId: userId,
        details: status ? "Account suspended, products archived" : "Account reactivated, products restored",
      }),
      db.insert(notifications).values({
        id: crypto.randomUUID(),
        userId: userId,
        title: status ? "Akun Ditangguhkan" : "Akun Diaktifkan Kembali",
        message: status 
          ? "Akun Anda telah ditangguhkan oleh Admin karena melanggar ketentuan layanan. Seluruh produk Anda telah diarsipkan."
          : "Akun Anda telah diaktifkan kembali. Seluruh produk Anda telah dikembalikan.",
        type: status ? "DANGER" : "SUCCESS",
      })
    ];

    if (status) {
      // BAN: set all user's APPROVED products to ARCHIVED
      operations.push(
        db.update(products).set({ status: "ARCHIVED" }).where(sql`${products.sellerId} = ${userId} AND ${products.status} = 'APPROVED'`)
      );
    } else {
      // UNBAN: restore ARCHIVED back to APPROVED
      operations.push(
        db.update(products).set({ status: "APPROVED" }).where(sql`${products.sellerId} = ${userId} AND ${products.status} = 'ARCHIVED'`)
      );
    }

    await db.batch(operations as any);

    return { success: true, message: status ? "User diblokir & produk diarsipkan" : "Blokir dibuka & produk dipulihkan" };
  } catch (error) {
    return { success: false, error: "Gagal update status blokir: " + error.message };
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
      db.update(users).set({ 
        isFlagged: status,
        updatedAt: new Date().getTime()
      }).where(eq(users.id, userId)),
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
    let result;
    if (search) {
      result = await db.select().from(users).where(
        or(
          like(users.name, `%${search}%`),
          like(users.email, `%${search}%`),
          like(users.userType, `%${search}%`)
        )
      ).orderBy(desc(users.createdAt));
    } else {
      result = await db.select().from(users).orderBy(desc(users.createdAt));
    }
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
      db.update(users).set({ 
        role: newRole,
        updatedAt: new Date().getTime()
      }).where(eq(users.id, userId)),
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
 * Action: Ambil Info Produk User Sebelum Dihapus
 */
export async function getUserProductsInfo(userId) {
  const auth = await getAuth();
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const db = await getContextDb();
    const result = await db.select({
      id: products.id,
      title: products.title
    }).from(products).where(eq(products.sellerId, userId));
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: `Gagal mengambil info produk: ${error.message}` };
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
    
    // Ambil semua produk user
    const userProducts = await db.select({ id: products.id }).from(products).where(eq(products.sellerId, userId));
    const productIds = userProducts.map(p => p.id);

    const operations: any[] = [];
    if (productIds.length > 0) {
      // Hapus data relasi produk
      for (const pId of productIds) {
        operations.push(db.delete(qcReviews).where(eq(qcReviews.productId, pId)));
        operations.push(db.delete(productImages).where(eq(productImages.productId, pId)));
      }
      operations.push(db.delete(products).where(eq(products.sellerId, userId)));
    }
    
    operations.push(db.delete(users).where(eq(users.id, userId)));
    operations.push(db.insert(adminLogs).values({
      id: crypto.randomUUID(),
      adminId: session.user.id,
      action: "DELETE_USER",
      targetId: userId,
      details: `Permanently deleted user account (${userId}) along with ${productIds.length} products.`,
    }));

    await db.batch(operations as any);
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
      await db.batch([
        db.insert(users).values({
          id: sessionUser.id || crypto.randomUUID(),
          name: sessionUser.name || 'Anonymous User',
          email: sessionUser.email,
          role: 'ADMIN' 
        }).onConflictDoUpdate({ 
          target: users.email, 
          set: { role: 'ADMIN' } 
        }),
        db.insert(adminLogs).values({
          id: crypto.randomUUID(),
          adminId: sessionUser.id || "system",
          action: "INITIALIZE_DATABASE",
          targetId: "DATABASE",
          details: `Database initialized/synced by ${sessionUser.email}`,
        })
      ]);
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
