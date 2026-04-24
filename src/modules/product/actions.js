"use server";

import { getContextDb, getEnv } from "@/lib/db";
import { products, productImages } from "@/db/schema";
import { desc, eq, and, or } from "drizzle-orm";

import { getAuth } from "@/lib/auth";
import { productSchema } from "@/lib/validation";

/**
 * Action: Ambil produk (Testing & Dashboard)
 * Jika user bukan admin, hanya ambil produk milik sendiri ATAU yang sudah APPROVED.
 */
export async function getProducts() {
  const auth = await getAuth();
  const session = await auth();

  try {
    const db = await getContextDb();
    
    // Kondisi filter: 
    // - Admin: Bisa lihat semua.
    // - User: Lihat produk miliknya sendiri ATAU yang sudah APPROVED oleh orang lain.
    let whereCondition = undefined;
    if (session?.user?.role !== "ADMIN") {
      const userId = session?.user?.id || "guest";
      whereCondition = or(
        eq(products.sellerId, userId),
        eq(products.status, "APPROVED")
      );
    }

    const result = await db.query.products.findMany({
      where: whereCondition,
      with: {
        seller: {
          columns: { name: true, email: true, whatsappNumber: true }
        },
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
 * Action: Create Product (Final Version)
 * Menggunakan URL media hasil upload dari /api/upload
 */
export async function createProduct({ formData, imageUrls = [], videoUrl = "", videoDuration = 0 }) {
  const auth = await getAuth();
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, code: 401, error: "Silakan login terlebih dahulu" };
  }

  // 1. Security Check: Pastikan URL media berasal dari sistem kita sendiri
  const isInternal = (url) => url.startsWith("/api/images/products/");
  const safeImages = imageUrls.filter(url => isInternal(url));
  const safeVideo = videoUrl && isInternal(videoUrl) ? videoUrl : "";

  // 2. Validasi Aturan Media (3 Foto atau 1 Foto + 1 Video 5s)
  const validation = productSchema.safeParse({
    ...formData,
    imageCount: safeImages.length,
    hasVideo: !!safeVideo,
    videoDuration
  });

  if (!validation.success) {
    return { success: false, code: 400, error: validation.error.errors[0].message };
  }

  try {
    const db = await getContextDb();
    const productId = crypto.randomUUID();
    const userRole = session.user.role;
    const userId = session.user.id;

    const initialStatus = userRole === "ADMIN" ? "APPROVED" : "PENDING";

    // 3. Batch Insert (Atomic)
    await db.batch([
      db.insert(products).values({
        id: productId,
        sellerId: userId,
        categoryId: formData.categoryId,
        title: formData.title,
        description: formData.description,
        price: parseInt(formData.price),
        condition: formData.condition,
        location: formData.location || "IPB Dramaga",
        status: initialStatus,
        videoUrl: safeVideo,
        videoDuration: safeVideo ? videoDuration : 0
      }),
      ...safeImages.map((url, i) => db.insert(productImages).values({
        id: crypto.randomUUID(),
        productId,
        url,
        r2Key: url.replace("/api/images/", ""),
        sortOrder: i
      }))
    ]);

    return { 
      success: true, 
      message: `Produk berhasil disimpan dengan status ${initialStatus}!`,
      productId 
    };
  } catch (error) {
    console.error("Create Product Error:", error);
    return { success: false, error: "Gagal menyimpan produk: " + error.message };
  }
}

/**
 * Action: Hapus Produk (Security Internalized)
 */
export async function deleteProduct(id) {
  const auth = await getAuth();
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  const requesterId = session.user.id;
  const requesterRole = session.user.role;

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
        return { success: false, code: 403, error: "Akses ditolak: Anda bukan pemilik produk ini" };
    }

    // 3. Hapus
    await db.delete(products).where(eq(products.id, id));
    return { success: true, message: "Produk berhasil dihapus" };
  } catch (error) {
    return { success: false, error: "Gagal menghapus produk: " + error.message };
  }
}

/**
 * Action: Update Produk
 * Catatan: Jika penjual (non-admin) mengedit, status kembali ke PENDING.
 */
export async function updateProduct(id, formData) {
  const auth = await getAuth();
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  // Validasi Zod
  const validation = productSchema.safeParse(formData);
  if (!validation.success) {
    return { success: false, error: validation.error.errors[0].message };
  }

  try {
    const db = await getContextDb();
    
    // 1. Cek Kepemilikan
    const product = await db.query.products.findFirst({
        where: eq(products.id, id)
    });

    if (!product) return { success: false, error: "Produk tidak ditemukan" };

    const isOwner = product.sellerId === session.user.id;
    const isAdmin = session.user.role === "ADMIN";

    if (!isOwner && !isAdmin) {
        return { success: false, error: "Akses ditolak" };
    }

    // 2. Tentukan Status Baru
    // Jika bukan admin, paksa status jadi PENDING lagi untuk di-review ulang
    const newStatus = isAdmin ? (formData.status || product.status) : "PENDING";

    await db.update(products).set({
      title: formData.title,
      description: formData.description,
      price: parseInt(formData.price),
      categoryId: formData.categoryId,
      condition: formData.condition,
      location: formData.location || "IPB Dramaga",
      status: newStatus,
    }).where(eq(products.id, id));

    return { 
        success: true, 
        message: isAdmin ? "Produk diperbarui" : "Produk diperbarui dan masuk antrean QC ulang" 
    };
  } catch (error) {
    return { success: false, error: "Gagal memperbarui produk: " + error.message };
  }
}
