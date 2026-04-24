"use server";

import { getContextDb } from "@/lib/db";
import { users, products, qcReviews } from "@/db/schema";
import { desc, eq, like, or } from "drizzle-orm";
import { getAuth } from "@/lib/auth";
import { qcReviewSchema } from "@/lib/validation";

/**
 * Action: Review Produk (Approve/Reject + Log QC)
 */
export async function reviewProduct({ productId, decision, note }) {
  const auth = await getAuth();
  const session = await auth();

  if (session?.user?.role !== "ADMIN") {
    return { success: false, code: 403, error: "Unauthorized: Admin only" };
  }

  // Validasi Zod
  const validation = qcReviewSchema.safeParse({ productId, decision, note });
  if (!validation.success) {
    return { success: false, error: validation.error.errors[0].message };
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
        note: note || "",
      }),

      // 3. Log Aktivitas Admin (Audit Trail)
      db.insert(adminLogs).values({
        id: crypto.randomUUID(),
        adminId: session.user.id,
        action: "REVIEW_PRODUCT",
        targetId: productId,
        details: `Decision: ${decision}. Note: ${note || "none"}`,
      }),

      // 4. Kirim Notifikasi ke Seller
      db.insert(notifications).values({
        id: crypto.randomUUID(),
        userId: currentProduct.sellerId,
        title: decision === "APPROVED" ? "Produk Disetujui!" : "Produk Ditolak",
        message: decision === "APPROVED" 
          ? `Produk "${currentProduct.title}" Anda sekarang sudah tayang di katalog.`
          : `Produk "${currentProduct.title}" ditolak. Alasan: ${note || "Melanggar aturan."}`,
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
    await db.update(users).set({ isFlagged: status }).where(eq(users.id, userId));
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
    await db.update(users).set({ role: newRole }).where(eq(users.id, userId));
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
    await db.delete(users).where(eq(users.id, userId));
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
