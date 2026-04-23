"use server";

import { getContextDb } from "@/lib/db";
import { categories } from "@/db/schema";
import { eq } from "drizzle-orm";

/**
 * Action: Ambil Kategori
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
 * Action: Tambah Kategori
 */
export async function addCategory(name) {
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
  } catch (error) {
    return { success: false, error: `Gagal menambah kategori: ${error.message}` };
  }
}

/**
 * Action: Hapus Kategori
 */
export async function deleteCategory(id) {
  try {
    const db = await getContextDb();
    await db.delete(categories).where(eq(categories.id, id));
    return { success: true, message: "Kategori berhasil dihapus" };
  } catch (error) {
    return { success: false, error: "Gagal menghapus kategori" };
  }
}
