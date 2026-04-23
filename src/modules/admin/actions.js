"use server";

import { getContextDb } from "@/lib/db";
import { users } from "@/db/schema";
import { desc, eq, like, or } from "drizzle-orm";

/**
 * Action: Ambil semua user dengan fitur search
 */
export async function getAdminUsers(search = "") {
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
    console.error("DEBUG: Error fetching users:", error.message);
    return { success: false, error: `Gagal mengambil data user: ${error.message}` };
  }
}

/**
 * Action: Toggle Role User (Admin <-> Buyer)
 */
export async function toggleUserRole(userId, currentRole) {
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
  try {
    const db = await getContextDb();
    await db.delete(users).where(eq(users.id, userId));
    return { success: true, message: "User berhasil dihapus" };
  } catch (error) {
    return { success: false, error: `Gagal menghapus user: ${error.message}` };
  }
}

/**
 * Action: Tambah Admin Dummy (Testing Purpose Only)
 */
export async function createDummyAdmin(name, email) {
  try {
    const db = await getContextDb();
    await db.insert(users).values({
      id: crypto.randomUUID(),
      name,
      email,
      role: "ADMIN",
    }).onConflictDoUpdate({
      target: users.email,
      set: { role: "ADMIN" }
    });
    return { success: true, message: `Berhasil mendaftarkan ${email} sebagai ADMIN` };
  } catch (error) {
    return { success: false, error: "Gagal membuat admin dummy" };
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

    await db.insert(users).values({
      id: 'admin-fixed',
      name: 'Super Admin Default',
      email: 'rafaelatantya@apps.ipb.ac.id',
      role: 'ADMIN'
    }).onConflictDoUpdate({ 
      target: users.email, 
      set: { role: 'ADMIN' } 
    }).run();

    return { success: true, message: "Database berhasil diinisialisasi & User disinkronkan!" };
  } catch (error) {
    return { success: false, error: `Seeding gagal: ${error.message}` };
  }
}
