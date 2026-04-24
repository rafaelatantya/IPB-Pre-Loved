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
 * Action: Create Product with Image
 */
export async function createProductWithImage({ formData, imageFile }) {
  const auth = await getAuth();
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, code: 401, error: "Silakan login terlebih dahulu" };
  }

  // 1. Validasi Awal Media
  const imageCount = imageFiles.filter(f => f && f.size > 0).length;
  const hasVideo = !!(videoFile && videoFile.size > 0);

  // 2. Validasi dengan Zod (Termasuk Aturan Saklek)
  const validation = productSchema.safeParse({
    ...formData,
    imageCount,
    hasVideo,
    videoDuration
  });

  if (!validation.success) {
    return { success: false, code: 400, error: validation.error.errors[0].message };
  }

  const userId = session.user.id;
  const userRole = session.user.role;

  try {
    const env = await getEnv();
    const db = await getContextDb();
    const bucket = env.BUCKET;

    if (!bucket) throw new Error("R2 Bucket binding 'BUCKET' not found.");

    const productId = crypto.randomUUID();
    
    // 3. Upload Video (Jika ada) - Max 50MB
    let videoUrl = "";
    if (hasVideo) {
      if (videoFile.size > 50 * 1024 * 1024) throw new Error("Video terlalu besar (Maks 50MB)");
      const videoKey = `products/v-${productId}-${Date.now()}.mp4`;
      const videoBuffer = await videoFile.arrayBuffer();
      await bucket.put(videoKey, videoBuffer, { httpMetadata: { contentType: videoFile.type } });
      videoUrl = `/api/images/${videoKey}`;
    }

    // 4. Upload Images - Max 5MB per image
    const imageRecords = [];
    for (let i = 0; i < imageFiles.length; i++) {
      const file = imageFiles[i];
      if (!file || file.size === 0) continue;
      if (file.size > 5 * 1024 * 1024) throw new Error(`Gambar ke-${i+1} terlalu besar (Maks 5MB)`);

      const imgKey = `products/i-${productId}-${i}-${Date.now()}.jpg`;
      const imgBuffer = await file.arrayBuffer();
      await bucket.put(imgKey, imgBuffer, { httpMetadata: { contentType: file.type } });
      
      imageRecords.push({
        id: crypto.randomUUID(),
        productId,
        r2Key: imgKey,
        url: `/api/images/${imgKey}`,
        sortOrder: i
      });
    }

    const initialStatus = userRole === "ADMIN" ? "APPROVED" : "PENDING";

    // 5. Simpan ke Database (Atomic)
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
        videoUrl,
        videoDuration
      }),
      ...imageRecords.map(img => db.insert(productImages).values(img))
    ]);

    return { 
      success: true, 
      message: `Produk berhasil disimpan dengan status ${initialStatus}!`,
      productId 
    };
  } catch (error) {
    console.error("Upload Error:", error);
    return { success: false, error: "Gagal memproses media: " + error.message };
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
