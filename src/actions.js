"use server";

import { getRequestContext } from "@cloudflare/next-on-pages";
import { getDb } from "./lib/db";
import { users, products, categories, productImages } from "./db/schema";
import { desc, eq } from "drizzle-orm";

/**
 * Helper to get DB instance safely within a Server Action
 */
export const getEnv = async () => {
    const context = getRequestContext();
    if (!context || !context.env) {
      throw new Error("Cloudflare Environment not found. Are you running with 'wrangler pages dev'?");
    }
    return context.env;
};

export const getContextDb = async () => {
  try {
    const env = await getEnv();
    if (!env.DB) {
      throw new Error("D1 Database binding 'DB' not found in environment.");
    }
    return getDb(env);
  } catch (err) {
    console.error("DEBUG [getContextDb]:", err.message);
    throw err;
  }
};

/**
 * Action: Ambil semua user
 */
export async function getAdminUsers() {
  try {
    const db = await getContextDb();
    const result = await db.select().from(users).orderBy(desc(users.createdAt));
    return { success: true, data: result };
  } catch (error) {
    console.error("DEBUG: Error fetching users:", {
      message: error.message,
      stack: error.stack,
      cause: error.cause
    });
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
    console.error("DEBUG: Update role error:", error);
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
    console.error("DEBUG: Delete user error:", error);
    return { success: false, error: `Gagal menghapus user: ${error.message}` };
  }
}

/**
 * Action: Ambil semua produk (Testing Seeding & QC Review)
 */
export async function getProducts() {
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
    }).run(); // Pakai .run() buat mastiin eksekusi di D1
    
    return { success: true, message: "Kategori berhasil ditambahkan" };
  } catch (error) {
    console.error("DEBUG: Add category error:", error);
    return { success: false, error: `Gagal menambah kategori: ${error.message}` };
  }
}

// ACTION BARU: Seed langsung dari dalam aplikasi (Solusi paling aman)
export async function initializeDatabaseInternal(sessionUser = null) {
  try {
    console.log("STEP 1: Getting DB context...");
    const db = await getContextDb();
    
    // 1. Sync User yang sedang login (Jika ada)
    if (sessionUser && sessionUser.email) {
      console.log("STEP 1.5: Syncing Current Session User:", sessionUser.email);
      await db.insert(users).values({
        id: sessionUser.id || crypto.randomUUID(),
        name: sessionUser.name || 'Anonymous User',
        email: sessionUser.email,
        role: 'ADMIN' // Pastikan user pengetes selalu jadi Admin
      }).onConflictDoUpdate({ 
        target: users.email, 
        set: { role: 'ADMIN' } 
      }).run();
    }

    console.log("STEP 2: Seeding Default Super Admin...");
    await db.insert(users).values({
      id: 'admin-fixed',
      name: 'Super Admin Default',
      email: 'rafaelatantya@apps.ipb.ac.id',
      role: 'ADMIN'
    }).onConflictDoUpdate({ 
      target: users.email, 
      set: { role: 'ADMIN' } 
    }).run();
    console.log("STEP 2: Success");

    console.log("STEP 3: Seeding Default Categories...");
    const defaultCategories = [
        { id: crypto.randomUUID(), name: 'Elektronik', slug: 'elektronik' },
        { id: crypto.randomUUID(), name: 'Fashion', slug: 'fashion' },
        { id: crypto.randomUUID(), name: 'Buku', slug: 'buku' }
    ];

    for (const cat of defaultCategories) {
        await db.insert(categories).values(cat).onConflictDoNothing().run();
    }
    console.log("STEP 3: Success");

    return { success: true, message: "Database berhasil diinisialisasi & User disinkronkan!" };
  } catch (error) {
    console.error("DEBUG: initializeDatabaseInternal FATAL ERROR:", error);
    return { success: false, error: `Seeding gagal: ${error.message}` };
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

/**
 * Action: Create Product with Image (Modular for testing)
 */
export async function createProductWithImage({ formData, imageFile, userRole = "BUYER" }) {
  try {
    const env = await getEnv();
    const db = getDb(env);
    const bucket = env.BUCKET;

    if (!bucket) {
      throw new Error("R2 Bucket binding 'BUCKET' not found in environment.");
    }

    const productId = crypto.randomUUID();
    
    // 1. Upload ke R2 jika ada gambar
    let imageUrl = "";
    let r2Key = "";
    
    if (imageFile && imageFile.size > 0) {
      r2Key = `products/${productId}-${Date.now()}-${imageFile.name}`;
      const arrayBuffer = await imageFile.arrayBuffer();
      await bucket.put(r2Key, arrayBuffer, {
        httpMetadata: { contentType: imageFile.type }
      });
      
      imageUrl = `https://r2.ipb-preloved.workers.dev/${r2Key}`; 
    }

    // 2. Tentukan status berdasarkan ROLE
    // Admin langsung APPROVED, Buyer/Seller masuk PENDING
    const initialStatus = userRole === "ADMIN" ? "APPROVED" : "PENDING";

    // 3. Insert Product
    await db.insert(products).values({
      id: productId,
      sellerId: formData.sellerId,
      categoryId: formData.categoryId || null, 
      title: formData.title,
      description: formData.description,
      price: parseInt(formData.price) || 0,
      condition: formData.condition || "GOOD",
      location: formData.location || "IPB Dramaga",
      status: initialStatus, 
    }).run();

    // 4. Simpan relasi gambar
    if (imageUrl) {
      await db.insert(productImages).values({
        id: crypto.randomUUID(),
        productId,
        r2Key,
        url: imageUrl,
        sortOrder: 0
      }).run();
    }

    return { success: true, message: `Produk berhasil disimpan dengan status ${initialStatus}!` };
  } catch (error) {
    console.error("ERROR [createProductWithImage]:", error);
    return { success: false, error: "Gagal memproses produk/gambar: " + error.message };
  }
}

/**
 * Action: Update Status Produk (QC Admin)
 */
export async function updateProductStatus(productId, status) {
  try {
    const db = await getContextDb();
    await db.update(products).set({ status }).where(eq(products.id, productId));
    return { success: true, message: `Produk berhasil di-${status.toLowerCase()}` };
  } catch (error) {
    console.error("DEBUG: Update product status error:", error);
    return { success: false, error: `Gagal mengubah status: ${error.message}` };
  }
}

/**
 * Action: Hapus Produk
 */
export async function deleteProduct(id) {
  try {
    const db = await getContextDb();
    await db.delete(products).where(eq(products.id, id));
    return { success: true, message: "Produk berhasil dihapus" };
  } catch (error) {
    console.error("DEBUG: Delete product error:", error);
    return { success: false, error: "Gagal menghapus produk" };
  }
}
