"use server";

import { getRequestContext } from "@cloudflare/next-on-pages";
import { getDb } from "./lib/db";
import { users, products, categories } from "./db/schema";
import { desc, eq } from "drizzle-orm";

/**
 * Helper to get DB instance safely within a Server Action
 */
async function getContextDb() {
  const { env } = getRequestContext();
  return getDb(env);
}

/**
 * Action: Ambil semua user (Admin Only Testing)
 */
export async function getAdminUsers() {
  try {
    const db = await getContextDb();
    const result = await db.select().from(users).orderBy(desc(users.createdAt));
    return { success: true, data: result };
  } catch (error) {
    console.error("Error fetching users:", error);
    return { success: false, error: "Gagal mengambil data user" };
  }
}

/**
 * Action: Ambil semua produk (Testing Seeding & QC Review)
 */
export async function getAllProducts() {
  try {
    const db = await getContextDb();
    const result = await db.query.products.findMany({
      with: {
        seller: true,
        category: true,
        images: true,
      },
      orderBy: [desc(products.createdAt)],
    });
    return { success: true, data: result };
  } catch (error) {
    console.error("Error fetching products:", error);
    return { success: false, error: "Gagal mengambil data produk" };
  }
}

/**
 * Action: Tambah Admin Dummy (Testing Purpose Only)
 * Berguna saat baru pertama kali setup database lokal agar ada user ADMIN.
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
    console.error("Error creating dummy admin:", error);
    return { success: false, error: "Gagal membuat admin dummy" };
  }
}

/**
 * Action: Ambil Kategori
 */
export async function getCategories() {
  try {
    const db = await getContextDb();
    const result = await db.select().from(categories);
    return { success: true, data: result };
  } catch (error) {
    console.error("Error fetching categories:", error);
    return { success: false, error: "Gagal mengambil kategori" };
  }
}
