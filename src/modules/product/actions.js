"use server";

import { getContextDb, getEnv } from "@/lib/db";
import { products, productImages } from "@/db/schema";
import { desc, eq, and, or } from "drizzle-orm";

/**
 * Action: Ambil produk (Testing & Dashboard)
 * Jika sellerId diberikan (Non-Admin), ambil produk milik sendiri ATAU yang sudah APPROVED.
 */
export async function getProducts(sellerId = null) {
  try {
    const db = await getContextDb();
    
    // Kondisi filter
    let whereCondition = undefined;
    if (sellerId) {
      whereCondition = or(
        eq(products.sellerId, sellerId),
        eq(products.status, "APPROVED")
      );
    }

    const result = await db.query.products.findMany({
      where: whereCondition,
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
 * Action: Create Product with Image
 */
export async function createProductWithImage({ formData, imageFile, userRole = "BUYER" }) {
  try {
    const env = await getEnv();
    const db = await getContextDb();
    const bucket = env.BUCKET;

    if (!bucket) throw new Error("R2 Bucket binding 'BUCKET' not found.");

    const productId = crypto.randomUUID();
    let imageUrl = "";
    let r2Key = "";
    
    if (imageFile && imageFile.size > 0) {
      r2Key = `products/${productId}-${Date.now()}-${imageFile.name}`;
      const arrayBuffer = await imageFile.arrayBuffer();
      await bucket.put(r2Key, arrayBuffer, {
        httpMetadata: { contentType: imageFile.type }
      });
      imageUrl = `/api/images/${r2Key}`; 
    }

    const initialStatus = userRole === "ADMIN" ? "APPROVED" : "PENDING";

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
    return { success: false, error: "Gagal memproses produk: " + error.message };
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
    return { success: false, error: `Gagal mengubah status: ${error.message}` };
  }
}

/**
 * Action: Hapus Produk (Security Updated)
 */
export async function deleteProduct(id, requesterId, requesterRole) {
  try {
    const db = await getContextDb();
    
    // 1. Ambil data produk untuk cek kepemilikan
    const product = await db.query.products.findFirst({
        where: eq(products.id, id)
    });

    if (!product) {
        return { success: false, error: "Produk tidak ditemukan" };
    }

    // 2. Cek Izin: Hanya Admin atau Pemilik (sellerId)
    const isOwner = product.sellerId === requesterId;
    const isAdmin = requesterRole === "ADMIN";

    if (!isAdmin && !isOwner) {
        return { success: false, error: "Akses ditolak: Anda bukan pemilik produk ini" };
    }

    // 3. Hapus
    await db.delete(products).where(eq(products.id, id));
    return { success: true, message: "Produk berhasil dihapus" };
  } catch (error) {
    return { success: false, error: "Gagal menghapus produk: " + error.message };
  }
}
