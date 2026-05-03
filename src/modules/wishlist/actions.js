"use server";

import { getDb } from "@/lib/db";
import { wishlists } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getAuth } from "@/lib/auth";

export async function toggleWishlist(productId) {
  try {
    const auth = await getAuth();
    const session = await auth();
    if (!session?.user?.id) {
      return { success: false, error: "Unauthorized" };
    }

    const userId = session.user.id;
    const db = getDb(process.env);

    const existing = await db.select().from(wishlists).where(and(eq(wishlists.userId, userId), eq(wishlists.productId, productId))).get();

    if (existing) {
      await db.delete(wishlists).where(eq(wishlists.id, existing.id)).run();
      return { success: true, wishlisted: false };
    } else {
      await db.insert(wishlists).values({
        userId: userId,
        productId: productId,
        createdAt: new Date().getTime(),
      }).run();
      return { success: true, wishlisted: true };
    }
  } catch (error) {
    console.error("Wishlist toggle error:", error);
    return { success: false, error: error.message };
  }
}

export async function isProductWishlisted(productId) {
  try {
    const auth = await getAuth();
    const session = await auth();
    if (!session?.user?.id) return false;

    const db = getDb(process.env);
    const existing = await db.select().from(wishlists).where(and(eq(wishlists.userId, session.user.id), eq(wishlists.productId, productId))).get();
    return !!existing;
  } catch (error) {
    return false;
  }
}
