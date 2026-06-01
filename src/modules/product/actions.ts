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
 * Action: Ambil satu produk berdasarkan ID (untuk halaman Edit)
 */
export async function getProductById(id: string) {
  const auth = await getAuth();
  const session = await auth();

  if (!session?.user?.id) return { success: false, code: 401, error: "Unauthenticated" };

  try {
    const db = await getContextDb();
    const product = await db.query.products.findFirst({
      where: eq(products.id, id),
      with: { seller: true, category: true, images: true },
    });

    if (!product) return { success: false, error: "Produk tidak ditemukan" };

    // 🛡️ SECURITY: Seller hanya bisa lihat produk milik sendiri, Admin bisa lihat semua
    const isOwner = product.sellerId === session.user.id;
    const isAdmin = session.user.role === "ADMIN";
    if (!isOwner && !isAdmin) {
      return { success: false, code: 403, error: "Akses ditolak" };
    }

    return { success: true, data: product };
  } catch (error) {
    console.error("Get Product By ID Error:", error);
    return { success: false, error: "Gagal mengambil data produk" };
  }
}

/**
 * Types untuk parameter Product
 */
interface ProductFormData {
  title: string;
  description: string;
  price: string | number;
  categoryId: string;
  condition: "NEW" | "LIKE_NEW" | "GOOD" | "FAIR";
  location?: string;
  status?: "PENDING" | "APPROVED" | "REJECTED" | "SOLD";
}

interface ProductMediaData {
  formData: ProductFormData;
  imageUrls: string[];
  videoUrl?: string | null;
  videoDuration?: number;
}

/**
 * Action: Create Product (Final Version)
 */
export async function createProduct({ formData, imageUrls = [], videoUrl = "", videoDuration = 0 }: ProductMediaData) {
  const auth = await getAuth();
  const session = await auth();

  if (!session?.user?.id) return { success: false, code: 401 };

  // 🛡️ SECURITY: Hanya SELLER atau ADMIN yang bisa upload barang
  const userRole = session.user.role;
  if (userRole !== "SELLER" && userRole !== "ADMIN") {
    return { success: false, code: 403, error: "Anda harus terdaftar sebagai Seller untuk berjualan." };
  }

  const isInternal = (url: any) => typeof url === 'string' && url.startsWith("/api/images/products/");
  const safeImages = Array.from(new Set((imageUrls || []).filter(url => isInternal(url))));
  const safeVideo = videoUrl && isInternal(videoUrl) ? videoUrl : "";

  const validation = productSchema.safeParse({
    ...formData,
    imageCount: safeImages.length,
    hasVideo: !!safeVideo,
    videoDuration: safeVideo ? videoDuration : 0
  });

  if (!validation.success) {
    const fieldErrors = validation.error.flatten().fieldErrors;
    const formattedErrors = Object.fromEntries(
      Object.entries(fieldErrors).map(([key, value]) => [key, value?.[0] || "Validasi gagal"])
    );
    return { success: false, code: 400, error: "Validasi gagal", errors: formattedErrors };
  }

  try {
    const db = await getContextDb();

    // 🛡️ SECURITY: Pastikan User/Admin punya nomor WA sebelum jualan
    const { users } = await import("@/db/schema");
    const seller = await db.select().from(users).where(eq(users.id, session.user.id)).get();
    if (!seller || !seller.whatsappNumber) {
      return { success: false, code: 400, error: "Nomor WhatsApp belum disetel. Silakan lengkapi di Pengaturan Profil terlebih dahulu." };
    }

    const productId = crypto.randomUUID();
    const userId = session.user.id;
    const initialStatus = userRole === "ADMIN" ? "APPROVED" : "PENDING";

    const operations: any[] = [
      db.insert(products).values({
        id: productId,
        sellerId: userId,
        categoryId: formData.categoryId,
        title: formData.title,
        description: formData.description,
        price: Math.floor(Number(formData.price) || 0),
        condition: formData.condition,
        location: formData.location || "IPB Dramaga",
        status: initialStatus,
        videoUrl: safeVideo,
        videoDuration: safeVideo ? videoDuration : 0,
        createdAt: new Date().getTime(),
        updatedAt: new Date().getTime()
      }),
      ...safeImages.map((url, i) => db.insert(productImages).values({
        id: crypto.randomUUID(),
        productId,
        url,
        r2Key: url.replace("/api/images/", ""),
        sortOrder: i
      }))
    ];

    if (userRole === "ADMIN") {
      operations.push(
        db.insert(adminLogs).values({
          id: crypto.randomUUID(),
          adminId: userId,
          action: "CREATE_PRODUCT",
          targetId: productId,
          details: `Admin uploaded product: ${formData.title} (Auto-Approved)`,
        })
      );
      operations.push(
        db.insert(notifications).values({
          id: crypto.randomUUID(),
          userId: userId,
          title: "Produk Terunggah 🎉",
          message: `Anda baru saja mengupload barang baru "${formData.title}" (auto approve)`,
          type: "SUCCESS",
        })
      );
    }

    await db.batch(operations as any);

    return { success: true, message: `Berhasil! Status: ${initialStatus}`, productId };
  } catch (error) {
    console.error("Create Product Error:", error);
    return { success: false, error: "Gagal menyimpan produk" };
  }
}

/**
 * Action: Update Produk (Multi-Image & R2 Cleanup Support)
 */
export async function updateProduct(id: string, { formData, imageUrls = [], videoUrl = null, videoDuration = 0 }: ProductMediaData) {
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

    // 🛡️ SECURITY: PENDING products cannot be edited by sellers to prevent QC conflicts
    if (product.status === "PENDING" && !isAdmin) {
      return { success: false, code: 400, error: "Produk yang sedang dalam proses verifikasi (Pending) tidak dapat diedit." };
    }

    // 2. Filter URL Internal (Cegah injection URL luar)
    const isInternal = (url: any) => typeof url === 'string' && url.startsWith("/api/images/products/");
    const safeImageUrls = Array.from(new Set((imageUrls || []).filter(url => isInternal(url))));

    // Logic Video: null (tidak berubah), "" (hapus), URL (baru)
    let safeVideoUrl = product.videoUrl;
    if (videoUrl === "") safeVideoUrl = "";
    else if (videoUrl && isInternal(videoUrl)) safeVideoUrl = videoUrl;

    // 3. Validasi Form via Zod
    const validation = productSchema.safeParse({
      ...formData,
      imageCount: safeImageUrls.length,
      hasVideo: !!safeVideoUrl,
      videoDuration: safeVideoUrl ? videoDuration : 0
    });

    if (!validation.success) {
      return {
        success: false,
        code: 400,
        error: "Validasi gagal",
        errors: validation.error.flatten().fieldErrors
      };
    }

    // 4. Logic Diffing Gambar untuk Cleanup R2
    const currentImages = product.images || [];
    const imagesToDelete = currentImages.filter(img => !safeImageUrls.includes(img.url));
    const keysToDelete = imagesToDelete.map(img => img.r2Key);

    const existingUrls = currentImages.map(img => img.url);
    const imagesToAdd = safeImageUrls.filter(url => !existingUrls.includes(url));

    // Cleanup Video jika diganti atau dihapus
    if (product.videoUrl && safeVideoUrl !== product.videoUrl) {
      keysToDelete.push(product.videoUrl.replace("/api/images/", ""));
    }

    // 5. Tentukan Status (Seller edit APPROVED -> PENDING)
    const newStatus = isAdmin ? (formData.status || product.status) : "PENDING";

    const operations: any[] = [
      // A. Update data utama produk
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
        updatedAt: new Date().getTime(),
      }).where(eq(products.id, id)),

      // B. Hapus record gambar lama yang dibuang user
      ...(imagesToDelete.length > 0
        ? [db.delete(productImages).where(inArray(productImages.id, imagesToDelete.map(i => i.id)))]
        : []),

      // C. Insert record gambar baru
      ...imagesToAdd.map((url) => db.insert(productImages).values({
        id: crypto.randomUUID(),
        productId: id,
        url,
        r2Key: url.replace("/api/images/", ""),
        sortOrder: safeImageUrls.indexOf(url)
      })),

      // D. Update urutan (sortOrder) untuk gambar yang dipertahankan
      ...currentImages.filter(img => safeImageUrls.includes(img.url)).map(img =>
        db.update(productImages).set({ sortOrder: safeImageUrls.indexOf(img.url) }).where(eq(productImages.id, img.id))
      )
    ];

    // 6. Audit Trail: Log jika Admin yang melakukan perubahan
    if (isAdmin && !isOwner) {
      operations.push(
        db.insert(adminLogs).values({
          id: crypto.randomUUID(),
          adminId: session.user.id,
          action: "UPDATE_PRODUCT",
          targetId: id,
          details: `Admin updated product: ${formData.title} (Seller: ${product.sellerId})`,
        })
      );
    }

    // 7. Eksekusi Batch
    await db.batch(operations as any);

    // 8. Cleanup R2 (Background Task)
    if (keysToDelete.length > 0) {
      deleteFilesFromR2(keysToDelete);
    }

    return {
      success: true,
      message: isAdmin ? "Produk diperbarui" : "Produk diperbarui, menunggu QC Admin",
      status: newStatus
    };
  } catch (error) {
    console.error("Update Product Error:", error);
    return { success: false, error: "Terjadi kesalahan sistem saat update produk" };
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

    const operations: any[] = [
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

    await db.batch(operations as any);

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
      await db.delete(products).where(eq(products.id, id)).run();
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
    console.log(`[WA_LEADS] Incrementing click count for product ID: ${productId}`);
    const res = await db.update(products)
      .set({ whatsappClicks: sql`coalesce(whatsapp_clicks, 0) + 1` })
      .where(eq(products.id, productId))
      .run();
    console.log(`[WA_LEADS] Click successfully updated in D1 database. Query result:`, res);
    return { success: true };
  } catch (error) {
    console.error("[WA_LEADS] Track WA Click Error:", error);
    return { success: false, error: error.message };
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
      totalClicks: sql`sum(coalesce(${products.whatsappClicks}, 0))`,
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
