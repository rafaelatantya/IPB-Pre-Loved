"use server";

import { getContextDb } from "@/lib/db";
import { wishlists, products } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

/**
 * Action: Tambah/Hapus Produk dari Wishlist (Toggle)
 */
export async function toggleWishlist(productId) {
  const auth = await getAuth();
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  const userId = session.user.id;

  try {
    const db = await getContextDb();

    // 1. Cek apakah sudah ada
    const existing = await db.query.wishlists.findFirst({
      where: and(
        eq(wishlists.userId, userId),
        eq(wishlists.productId, productId)
      )
    });

    if (existing) {
      // Hapus
      await db.delete(wishlists).where(eq(wishlists.id, existing.id));
      revalidatePath("/wishlist");
      return { success: true, wishlisted: false, message: "Dihapus dari wishlist" };
    } else {
      // Tambah
      await db.insert(wishlists).values({
        id: crypto.randomUUID(),
        userId,
        productId,
      });
      revalidatePath("/wishlist");
      return { success: true, wishlisted: true, message: "Ditambah ke wishlist" };
    }
  } catch (error) {
    console.error("Wishlist Error:", error);
    return { success: false, error: "Gagal memproses wishlist" };
  }
}

/**
 * Action: Ambil daftar Wishlist User
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
    const result = await db.query.wishlists.findMany({
      where: eq(wishlists.userId, userId),
      with: {
        product: {
          with: {
            images: true,
            category: true,
            seller: { columns: { name: true } }
          }
        }
      }
    });

    // Filter produk yang masih ada dan statusnya APPROVED
    const filteredProducts = result
      .filter(w => w.product && w.product.status === "APPROVED")
      .map(w => w.product);

    return { 
      success: true, 
      data: filteredProducts,
      totalItems: filteredProducts.length
    };
  } catch (error) {
    console.error("Error fetching wishlist:", error);
    return { success: false, error: "Gagal mengambil wishlist" };
  }
}

/**
 * Action: Cek status wishlist produk tertentu
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
