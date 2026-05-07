"use server";

import { getContextDb } from "@/lib/db";
import { categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getAuth } from "@/lib/auth";

/**
 * Action: Ambil Kategori (Public)
 */
export async function getCategories() {
  try {
    const db = await getContextDb();
    const result = await db.select().from(categories);
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: "Gagal mengambil kategori" };
  }
}

/**
 * Action: Tambah Kategori (Admin Only)
 */
export async function addCategory(name: string) {
  const auth = await getAuth();
  const session = await auth();

  // 🛡️ SECURITY GUARD: Admin Only
  if (session?.user?.role !== "ADMIN") {
    return { success: false, error: "Akses ditolak: Hanya Admin yang dapat menambah kategori" };
  }

  try {
    const db = await getContextDb();
    if (!name) throw new Error("Nama kategori tidak boleh kosong");
    const slug = name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
    
    await db.insert(categories).values({ 
      id: crypto.randomUUID(), 
      name, 
      slug 
    }).run();
    
    return { success: true, message: "Kategori berhasil ditambahkan" };
  } catch (error: any) {
    return { success: false, error: `Gagal menambah kategori: ${error.message}` };
  }
}

/**
 * Action: Update Kategori (Admin Only)
 */
export async function updateCategory(id: string, name: string) {
  const auth = await getAuth();
  const session = await auth();

  // 🛡️ SECURITY GUARD: Admin Only
  if (session?.user?.role !== "ADMIN") {
    return { success: false, error: "Akses ditolak: Hanya Admin yang dapat mengubah kategori" };
  }

  try {
    const db = await getContextDb();
    if (!name) throw new Error("Nama kategori tidak boleh kosong");
    const slug = name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
    
    await db.update(categories)
      .set({ name, slug })
      .where(eq(categories.id, id))
      .run();
      
    return { success: true, message: "Kategori berhasil diperbarui" };
  } catch (error: any) {
    return { success: false, error: `Gagal memperbarui kategori: ${error.message}` };
  }
}

/**
 * Action: Hapus Kategori (Admin Only)
 */
export async function deleteCategory(id: string) {
  const auth = await getAuth();
  const session = await auth();

  // 🛡️ SECURITY GUARD: Admin Only
  if (session?.user?.role !== "ADMIN") {
    return { success: false, error: "Akses ditolak: Hanya Admin yang dapat menghapus kategori" };
  }

  try {
    const db = await getContextDb();
    await db.delete(categories).where(eq(categories.id, id)).run();
    return { success: true, message: "Kategori berhasil dihapus" };
  } catch (error) {
    return { success: false, error: "Gagal menghapus kategori" };
  }
}
