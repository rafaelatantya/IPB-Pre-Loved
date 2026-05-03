"use server";

import { getContextDb } from "@/lib/db";
import { wishlists, products } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getAuth } from "@/lib/auth";

/**
 * Action: Tambah/Hapus Produk dari Wishlist (Toggle)
 * Hardened with: Self-wishlist guard & availability check.
 */
export async function toggleWishlist(productId) {
  const auth = await getAuth();
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, code: 401, error: "Silakan login terlebih dahulu" };
  }

  const userId = session.user.id;

  try {
    const db = await getContextDb();

    // 1. Validasi Produk (Mencegah wishlist barang fiktif/rejected/milik sendiri)
    const product = await db.query.products.findFirst({
      where: eq(products.id, productId)
    });

    if (!product) {
      return { success: false, error: "Produk tidak ditemukan" };
    }

    if (product.sellerId === userId) {
      return { success: false, error: "Anda tidak bisa menambahkan barang sendiri ke wishlist" };
    }

    if (product.status !== "APPROVED") {
      return { success: false, error: "Produk ini sedang tidak tersedia untuk publik" };
    }

    // 2. Cek apakah sudah ada
    const existing = await db.query.wishlists.findFirst({
      where: and(
        eq(wishlists.userId, userId),
        eq(wishlists.productId, productId)
      )
    });

    if (existing) {
      // PROSES UNLIKE: Hapus dari wishlist
      await db.delete(wishlists).where(eq(wishlists.id, existing.id)).run();
      return { success: true, wishlisted: false, message: "Dihapus dari favorit" };
    } else {
      // PROSES LIKE: Tambah ke wishlist
      await db.insert(wishlists).values({
        id: crypto.randomUUID(),
        userId,
        productId,
      }).run();
      return { success: true, wishlisted: true, message: "Ditambahkan ke favorit" };
    }
  } catch (error) {
    console.error("Wishlist Error:", error);
    return { success: false, error: "Terjadi kesalahan sistem saat memproses wishlist" };
  }
}

/**
 * Action: Ambil daftar Wishlist User
 * Mengembalikan produk lengkap dengan gambar dan kategori.
 */
export async function getWishlist() {
  const auth = await getAuth();
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  const userId = session.user.id;

  try {
    const db = await getContextDb();
    
    // Tarik relasi wishlist -> product
    const result = await db.query.wishlists.findMany({
      where: eq(wishlists.userId, userId),
      with: {
        product: {
          with: {
            images: {
              orderBy: (images, { asc }) => [asc(images.sortOrder)],
              limit: 1
            },
            category: true,
            seller: { columns: { name: true } }
          }
        }
      },
      orderBy: (wishlists, { desc }) => [desc(wishlists.createdAt)]
    });

    // 🛡️ Data Cleaning: Pastikan produk masih ada & statusnya APPROVED
    const validWishlistItems = result
      .filter(item => item.product && item.product.status === "APPROVED")
      .map(item => item.product);

    return { 
      success: true, 
      data: validWishlistItems,
      totalItems: validWishlistItems.length
    };
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return { success: false, error: "Gagal memuat daftar favorit" };
  }
}

/**
 * Action: Cek status wishlist produk tertentu (SSR/Client Helper)
 */
export async function isProductWishlisted(productId) {
  const auth = await getAuth();
  const session = await auth();

  if (!session?.user?.id) return false;

  try {
    const db = await getContextDb();
    const existing = await db.query.wishlists.findFirst({
      where: and(
        eq(wishlists.userId, session.user.id),
        eq(wishlists.productId, productId)
      )
    });
    return !!existing;
  } catch (error) {
    return false;
  }
}
