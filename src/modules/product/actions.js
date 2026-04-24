"use server";

import { getContextDb } from "@/lib/db";
import { products, productImages, qcReviews } from "@/db/schema";
import { eq, sql, desc, and } from "drizzle-orm";
import { getAuth } from "@/lib/auth";
import { productSchema } from "@/lib/validation";
import { getEnv } from "@/lib/env";

/**
 * Action: Ambil daftar produk (untuk penjual/admin)
 */
export async function getProducts() {
  const auth = await getAuth();
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const db = await getContextDb();
    const isAdmin = session.user.role === "ADMIN";

    let result;
    if (isAdmin) {
      result = await db.query.products.findMany({
        with: { seller: true, category: true, images: true },
        orderBy: [desc(products.createdAt)]
      });
    } else {
      result = await db.query.products.findMany({
        where: eq(products.sellerId, session.user.id),
        with: { category: true, images: true },
        orderBy: [desc(products.createdAt)]
      });
    }

    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: "Gagal mengambil produk" };
  }
}

/**
 * Action: Create Product (Final Version)
 */
export async function createProduct({ formData, imageUrls = [], videoUrl = "", videoDuration = 0 }) {
  const auth = await getAuth();
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, code: 401, error: "Silakan login terlebih dahulu" };
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
    return { success: false, code: 400, error: validation.error.errors[0].message };
  }

  try {
    const db = await getContextDb();
    const productId = crypto.randomUUID();
    const userRole = session.user.role;
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

    return { success: true, message: `Berhasil! Status: ${initialStatus}`, productId };
  } catch (error) {
    return { success: false, error: "Gagal menyimpan produk" };
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

    await db.delete(products).where(eq(products.id, id));
    return { success: true, message: "Produk dihapus" };
  } catch (error) {
    return { success: false, error: "Gagal menghapus" };
  }
}

/**
 * Action: Update Produk
 */
export async function updateProduct(id, formData) {
  const auth = await getAuth();
  const session = await auth();

  if (!session?.user?.id) return { success: false, code: 401 };

  const validation = productSchema.safeParse(formData);
  if (!validation.success) return { success: false, code: 400, error: validation.error.errors[0].message };

  try {
    const db = await getContextDb();
    const product = await db.query.products.findFirst({ where: eq(products.id, id) });

    if (!product) return { success: false, error: "Produk tidak ditemukan" };
    const isAdmin = session.user.role === "ADMIN";
    const isOwner = product.sellerId === session.user.id;

    if (!isOwner && !isAdmin) return { success: false, code: 403, error: "Akses ditolak" };

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

  try {
    const db = await getContextDb();
    const product = await db.query.products.findFirst({ where: eq(products.id, id) });

    if (!product || product.sellerId !== session.user.id) {
        return { success: false, code: 403, error: "Akses ditolak" };
    }

    await db.update(products).set({ status: "SOLD" }).where(eq(products.id, id));
    return { success: true, message: "Produk ditandai sebagai terjual" };
  } catch (error) {
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
