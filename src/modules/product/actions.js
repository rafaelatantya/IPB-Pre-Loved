"use server";

import { getContextDb } from "@/lib/db";
import { products, productImages, qcReviews, notifications, adminLogs } from "@/db/schema";
import { eq, sql, desc, and, inArray } from "drizzle-orm";
import { getAuth } from "@/lib/auth";
import { productSchema } from "@/lib/validation";
import { deleteFilesFromR2 } from "@/lib/r2";

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

  const isInternal = (url) => typeof url === 'string' && url.startsWith("/api/images/products/");
  const safeImages = [...new Set((imageUrls || []).filter(url => isInternal(url)))];
  const safeVideo = videoUrl && isInternal(videoUrl) ? videoUrl : "";

  const validation = productSchema.safeParse({
    ...formData,
    imageCount: safeImages.length,
    hasVideo: !!safeVideo,
    videoDuration: safeVideo ? videoDuration : 0
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
 * Action: Update Produk (Multi-Image & R2 Cleanup Support)
 */
export async function updateProduct(id, { formData, imageUrls = [], videoUrl = null, videoDuration = 0 }) {
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
    
    // 1. Cek keberadaan dan kepemilikan produk
    const product = await db.query.products.findFirst({ 
      where: eq(products.id, id),
      with: { images: true }
    });

    if (!product) return { success: false, error: "Produk tidak ditemukan" };
    const isAdmin = userRole === "ADMIN";
    const isOwner = product.sellerId === session.user.id;

    if (!isOwner && !isAdmin) return { success: false, code: 403, error: "Akses ditolak" };

    // 2. Filter URL Internal (Edge Case: Prevent External URLs)
    const isInternal = (url) => typeof url === 'string' && url.startsWith("/api/images/products/");
    const safeImageUrls = [...new Set((imageUrls || []).filter(url => isInternal(url)))];
    const safeVideoUrl = videoUrl !== null && isInternal(videoUrl) ? videoUrl : (videoUrl === "" ? "" : product.videoUrl);

    // 3. Validasi Form
    const validation = productSchema.safeParse({
      ...formData,
      imageCount: safeImageUrls.length,
      hasVideo: !!safeVideoUrl,
      videoDuration: safeVideoUrl ? videoDuration : 0
    });

    if (!validation.success) {
      return { success: false, code: 400, error: "Validasi gagal", errors: validation.error.flatten().fieldErrors };
    }

    // 4. Logic Diffing Gambar
    const currentImages = product.images || [];
    
    // Foto yang harus dihapus (Ada di DB tapi nggak ada di list aman baru)
    const imagesToDelete = currentImages.filter(img => !safeImageUrls.includes(img.url));
    const keysToDelete = imagesToDelete.map(img => img.r2Key);

    // Foto yang harus ditambah (Ada di list aman baru tapi nggak ada di DB)
    const existingUrls = currentImages.map(img => img.url);
    const imagesToAdd = safeImageUrls.filter(url => !existingUrls.includes(url));

    // Video Cleanup Logic (Edge Case: Video Removal or Replacement)
    if (product.videoUrl && safeVideoUrl !== product.videoUrl) {
      keysToDelete.push(product.videoUrl.replace("/api/images/", ""));
    }

    // 5. Eksekusi Batch Update
    const newStatus = isAdmin ? (formData.status || product.status) : "PENDING";
    
    const operations = [
      // Update data utama produk
      db.update(products).set({
        title: formData.title,
        description: formData.description,
        price: Math.floor(Number(formData.price) || 0),
        categoryId: formData.categoryId,
        condition: formData.condition,
        location: formData.location || "IPB Dramaga",
        status: newStatus,
        videoUrl: safeVideoUrl,
        videoDuration: safeVideoUrl ? videoDuration : 0,
        updatedAt: new Date().getTime(), // Standar milidetik kita
      }).where(eq(products.id, id)),

      // Hapus record gambar yang dibuang
      ...(imagesToDelete.length > 0 
        ? [db.delete(productImages).where(inArray(productImages.id, imagesToDelete.map(i => i.id)))] 
        : []),

      // Insert gambar baru
      ...imagesToAdd.map((url) => db.insert(productImages).values({
        id: crypto.randomUUID(),
        productId: id,
        url,
        r2Key: url.replace("/api/images/", ""),
        sortOrder: safeImageUrls.indexOf(url)
      })),

      // Update sortOrder untuk gambar yang masih ada
      ...currentImages.filter(img => safeImageUrls.includes(img.url)).map(img => 
        db.update(productImages).set({ sortOrder: safeImageUrls.indexOf(img.url) }).where(eq(productImages.id, img.id))
      )
    ];

    // 6. Log Aktivitas jika dilakukan Admin (dan bukan pemilik)
    if (isAdmin && !isOwner) {
      operations.push(
        db.insert(adminLogs).values({
          id: crypto.randomUUID(),
          adminId: session.user.id,
          action: "UPDATE_PRODUCT",
          targetId: id,
          details: `Admin updated product details: ${formData.title} (Seller ID: ${product.sellerId})`,
        })
      );
    }

    await db.batch(operations);

    // 7. Cleanup R2 (Background)
    if (keysToDelete.length > 0) {
      deleteFilesFromR2(keysToDelete);
    }

    return { success: true, message: isAdmin ? "Updated" : "Updated, Pending QC" };
  } catch (error) {
    console.error("Update Product Error:", error);
    return { success: false, error: "Gagal update produk" };
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

    if (!product) {
      return { success: false, error: "Produk tidak ditemukan" };
    }

    const isAdmin = userRole === "ADMIN";
    const isOwner = product.sellerId === session.user.id;

    if (!isAdmin && !isOwner) {
      return { success: false, code: 403, error: "Akses ditolak" };
    }

    // 🛡️ EDGE CASE: Hanya produk APPROVED yang bisa jadi SOLD
    if (product.status !== "APPROVED") {
      return { success: false, error: "Hanya produk yang sudah disetujui Admin yang bisa ditandai Terjual." };
    }

    const operations = [
      // 1. Update status produk
      db.update(products).set({ 
        status: "SOLD",
        updatedAt: new Date().getTime() 
      }).where(eq(products.id, id)),

      // 2. Kirim Notifikasi ke Penjual
      db.insert(notifications).values({
        id: crypto.randomUUID(),
        userId: product.sellerId,
        title: "Selamat! Produk Terjual 🎉",
        message: `Produk "${product.title}" Anda telah ditandai sebagai terjual. Terima kasih telah menggunakan IPB Pre-Loved!`,
        type: "SUCCESS",
      })
    ];

    // 3. Log Aktivitas jika dilakukan Admin
    if (isAdmin && !isOwner) {
      operations.push(
        db.insert(adminLogs).values({
          id: crypto.randomUUID(),
          adminId: session.user.id,
          action: "MARK_PRODUCT_SOLD",
          targetId: id,
          details: `Admin marked product as SOLD: ${product.title} (Seller ID: ${product.sellerId})`,
        })
      );
    }

    await db.batch(operations);
    
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

    // 1. Ambil semua kunci aset (Gambar & Video) sebelum dihapus dari DB
    const images = await db.query.productImages.findMany({
      where: eq(productImages.productId, id)
    });
    const imageKeys = images.map(img => img.r2Key);
    if (product.videoUrl) {
      imageKeys.push(product.videoUrl.replace("/api/images/", ""));
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

    // 2. Sapu bersih di R2 (Async Cleanup)
    if (imageKeys.length > 0) {
      // Kita nggak pake await biar respons ke user nggak lambat, 
      // R2 cleanup jalan di background (Edge supports this via waitUntil if needed, but in Actions this is fine)
      deleteFilesFromR2(imageKeys);
    }
    
    return { success: true, message: "Produk dihapus" };
  } catch (error) {
    return { success: false, error: "Gagal menghapus" };
  }
}

/**
 * Action: Track WhatsApp Click (Engagement Lead)
 */
export async function trackWhatsAppClick(productId) {
  try {
    const db = await getContextDb();
    // 🛡️ EDGE CASE: Increment atomic biar nggak tabrakan kalau diklik barengan
    await db.update(products)
      .set({ whatsappClicks: sql`${products.whatsappClicks} + 1` })
      .where(eq(products.id, productId));
    return { success: true };
  } catch (error) {
    console.error("Track WA Click Error:", error);
    return { success: false };
  }
}

/**
 * Action: Ambil Statistik Penjual (Personal Analytics)
 */
export async function getSellerStats() {
  const auth = await getAuth();
  const session = await auth();

  if (!session?.user?.id) return { success: false, code: 401 };

  try {
    const db = await getContextDb();
    const sellerId = session.user.id;

    // 1. Hitung Produk Berdasarkan Status milik seller ini
    const productStats = await db.select({
      status: products.status,
      count: sql`count(*)`,
      totalClicks: sql`sum(${products.whatsappClicks})`,
    })
    .from(products)
    .where(eq(products.sellerId, sellerId))
    .groupBy(products.status);

    // Map hasil ke format yang enak dipake UI
    const stats = {
      activeProducts: productStats.find(s => s.status === "APPROVED")?.count || 0,
      soldProducts: productStats.find(s => s.status === "SOLD")?.count || 0,
      pendingQC: productStats.find(s => s.status === "PENDING")?.count || 0,
      totalLeads: productStats.reduce((acc, curr) => acc + (Number(curr.totalClicks) || 0), 0),
    };

    return { success: true, data: stats };
  } catch (error) {
    console.error("Seller Stats Error:", error);
    return { success: false, error: "Gagal mengambil statistik penjual" };
  }
}
