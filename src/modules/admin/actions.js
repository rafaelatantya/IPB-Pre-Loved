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
    return { success: false, error: "Unauthorized: Admin only" };
  }

  // Validasi Zod
  const validation = qcReviewSchema.safeParse({ productId, decision, note });
  if (!validation.success) {
    return { success: false, error: validation.error.errors[0].message };
  }

  try {
    const db = await getContextDb();

    // Jalankan dalam transaksi agar atomik
    await db.batch([
      // 1. Update status produk
      db.update(products)
        .set({ status: decision === "APPROVED" ? "APPROVED" : "REJECTED" })
        .where(eq(products.id, productId)),
      
      // 2. Catat di tabel QC Reviews
      db.insert(qcReviews).values({
        id: crypto.randomUUID(),
        productId,
        adminId: session.user.id,
        decision,
        note: note || "",
      })
    ]);

    return { success: true, message: `Berhasil melakukan QC: ${decision}` };
  } catch (error) {
    console.error("QC Error:", error);
    return { success: false, error: "Gagal memproses QC Review" };
  }
}

/**
 * Action: Ambil semua user dengan fitur search
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
          like(users.email, `%${search}%`)
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
