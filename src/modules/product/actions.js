"use server";

import { getContextDb } from "@/lib/db";
import { products, productImages, qcReviews, notifications, adminLogs } from "@/db/schema";
import { eq, sql, desc, and } from "drizzle-orm";
import { getAuth } from "@/lib/auth";
import { productSchema } from "@/lib/validation";

/**
 * Action: Ambil daftar produk (untuk penjual/admin)
 */
export async function getProducts({ page = 1, limit = 10 } = {}) {
  const auth = await getAuth();
  const session = await auth();

  if (!session?.user?.id) return { success: false, code: 401 };

  try {
    const db = await getContextDb();
    const isAdmin = session.user.role === "ADMIN";
    const offset = (page - 1) * limit;

    let result;
    if (isAdmin) {
      result = await db.query.products.findMany({
        with: { seller: true, category: true, images: true },
        orderBy: [desc(products.createdAt)],
        limit: limit,
        offset: offset
      });
    } else {
      result = await db.query.products.findMany({
        where: eq(products.sellerId, session.user.id),
        with: { category: true, images: true },
        orderBy: [desc(products.createdAt)],
        limit: limit,
        offset: offset
      });
    }

    return { 
      success: true, 
      data: result,
      hasMore: result.length === limit
    };
  } catch (error) {
    console.error("Get Products Error:", error);
    return { success: false, error: "Gagal mengambil produk" };
  }
}

/**
 * Action: Create Product (Final Version)
 */
export async function createProduct({ formData, imageUrls = [], videoUrl = "", videoDuration = 0 }) {
  const auth = await getAuth();
  const session = await auth();

  if (!session?.user?.id) return { success: false, code: 401 };

  // 🛡️ SECURITY: Hanya SELLER atau ADMIN yang bisa upload barang
  const userRole = session.user.role;
  if (userRole !== "SELLER" && userRole !== "ADMIN") {
    return { success: false, code: 403, error: "Anda harus terdaftar sebagai Seller untuk berjualan." };
  }

  const isInternal = (url) => url.startsWith("/api/images/products/");
  const safeImages = imageUrls.filter(url => isInternal(url));
  const safeVideo = videoUrl && isInternal(videoUrl) ? videoUrl : "";

  const validation = productSchema.safeParse({
    ...formData,
    imageCount: safeImages.length,
    hasVideo: !!safeVideo,
    videoDuration
  });

  if (!validation.success) {
    const fieldErrors = validation.error.flatten().fieldErrors;
    // Map array error jadi string tunggal (ambil yang pertama) buat kemudahan di UI
    const formattedErrors = Object.fromEntries(
      Object.entries(fieldErrors).map(([key, value]) => [key, value[0]])
    );
    return { success: false, code: 400, error: "Validasi gagal", errors: formattedErrors };
  }

  try {
    const db = await getContextDb();
    const productId = crypto.randomUUID();
    const userId = session.user.id;
    const initialStatus = userRole === "ADMIN" ? "APPROVED" : "PENDING";

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
        videoDuration: safeVideo ? videoDuration : 0,
        createdAt: new Date(),
        updatedAt: new Date()
      }),
      ...safeImages.map((url, i) => db.insert(productImages).values({
        id: crypto.randomUUID(),
        productId,
        url,
        r2Key: url.replace("/api/images/", ""),
        sortOrder: i
      }))
    ]);

    return { success: true, message: `Berhasil! Status: ${initialStatus}`, productId };
  } catch (error) {
    console.error("Create Product Error:", error);
    return { success: false, error: "Gagal menyimpan produk" };
  }
}

/**
 * Action: Update Produk
 */
export async function updateProduct(id, formData) {
  const auth = await getAuth();
  const session = await auth();

  if (!session?.user?.id) return { success: false, code: 401 };

  // 🛡️ SECURITY: Role Check
  const userRole = session.user.role;
  if (userRole !== "SELLER" && userRole !== "ADMIN") {
    return { success: false, code: 403, error: "Akses ditolak." };
  }

  const validation = productSchema.safeParse(formData);
  if (!validation.success) {
    const fieldErrors = validation.error.flatten().fieldErrors;
    const formattedErrors = Object.fromEntries(
      Object.entries(fieldErrors).map(([key, value]) => [key, value[0]])
    );
    return { success: false, code: 400, error: "Validasi gagal", errors: formattedErrors };
  }

  try {
    const db = await getContextDb();
    const product = await db.query.products.findFirst({ where: eq(products.id, id) });

    if (!product) return { success: false, error: "Produk tidak ditemukan" };
    const isAdmin = userRole === "ADMIN";
    const isOwner = product.sellerId === session.user.id;

    if (!isOwner && !isAdmin) return { success: false, code: 403, error: "Akses ditolak" };

    const newStatus = isAdmin ? (formData.status || product.status) : "PENDING";

    await db.update(products).set({
      title: formData.title,
      description: formData.description,
      price: Math.floor(Number(formData.price) || 0),
      categoryId: formData.categoryId,
      condition: formData.condition,
      location: formData.location || "IPB Dramaga",
      status: newStatus,
      updatedAt: new Date(),
    }).where(eq(products.id, id));

    return { success: true, message: isAdmin ? "Updated" : "Updated, Pending QC" };
  } catch (error) {
    return { success: false, error: "Gagal update" };
  }
}

/**
 * Action: Tandai Produk Terjual (Sold Out)
 */
export async function markProductAsSold(id) {
  const auth = await getAuth();
  const session = await auth();

  if (!session?.user?.id) return { success: false, code: 401 };

  // 🛡️ SECURITY: Role Check
  const userRole = session.user.role;
  if (userRole !== "SELLER" && userRole !== "ADMIN") {
    return { success: false, code: 403, error: "Akses ditolak." };
  }

  try {
    const db = await getContextDb();
    const product = await db.query.products.findFirst({ where: eq(products.id, id) });

    const isAdmin = userRole === "ADMIN";
    const isOwner = product.sellerId === session.user.id;

    if (!product || (!isOwner && !isAdmin)) {
        return { success: false, code: 403, error: "Akses ditolak. Anda bukan pemilik barang ini." };
    }

    // 🛡️ EDGE CASE: Hanya produk APPROVED yang bisa jadi SOLD
    if (product.status !== "APPROVED") {
        return { success: false, error: "Hanya produk yang sudah disetujui Admin yang bisa ditandai Terjual." };
    }

    await db.batch([
      db.update(products).set({ 
        status: "SOLD",
        updatedAt: new Date() 
      }).where(eq(products.id, id)),
      // Kirim Notifikasi Selamat ke Penjual
      db.insert(notifications).values({
        id: crypto.randomUUID(),
        userId: product.sellerId, // Memastikan notif masuk ke Penjual, bukan Admin yang klik
        title: "Selamat! Produk Terjual",
        message: `Produk "${product.title}" Anda telah ditandai sebagai terjual. Terima kasih telah menggunakan IPB Pre-Loved!`,
        type: "SUCCESS",
      })
    ]);
    
    return { success: true, message: "Produk ditandai sebagai terjual" };
  } catch (error) {
    console.error("Mark Sold Error:", error);
    return { success: false, error: "Gagal update status terjual" };
  }
}

/**
 * Action: Update Urutan Gambar (Drag & Drop)
 */
export async function updateImageOrder(productId, imageIds) {
  const auth = await getAuth();
  const session = await auth();

  if (!session?.user?.id) return { success: false, code: 401 };

  try {
    const db = await getContextDb();
    const product = await db.query.products.findFirst({ where: eq(products.id, productId) });

    if (!product || product.sellerId !== session.user.id) {
        return { success: false, code: 403, error: "Akses ditolak" };
    }

    const batchUpdates = imageIds.map((id, index) => 
        db.update(productImages).set({ sortOrder: index }).where(eq(productImages.id, id))
    );

    await db.batch(batchUpdates);
    return { success: true, message: "Urutan foto diperbarui" };
  } catch (error) {
    return { success: false, error: "Gagal update urutan" };
  }
}

/**
 * Action: Hapus Produk
 */
export async function deleteProduct(id) {
  const auth = await getAuth();
  const session = await auth();

  if (!session?.user?.id) return { success: false, code: 401 };

  try {
    const db = await getContextDb();
    const product = await db.query.products.findFirst({ where: eq(products.id, id) });
    if (!product) return { success: false, error: "Produk tidak ditemukan" };

    const isAdmin = session.user.role === "ADMIN";
    const isOwner = product.sellerId === session.user.id;

    if (!isAdmin && !isOwner) {
        return { success: false, code: 403, error: "Akses ditolak" };
    }

    if (isAdmin && !isOwner) {
      await db.batch([
        db.delete(products).where(eq(products.id, id)),
        db.insert(adminLogs).values({
          id: crypto.randomUUID(),
          adminId: session.user.id,
          action: "DELETE_PRODUCT",
          targetId: id,
          details: `Admin deleted product: ${product.title} (Seller ID: ${product.sellerId})`,
        })
      ]);
    } else {
      await db.delete(products).where(eq(products.id, id));
    }
    
    return { success: true, message: "Produk dihapus" };
  } catch (error) {
    return { success: false, error: "Gagal menghapus" };
  }
}
