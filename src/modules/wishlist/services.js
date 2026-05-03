import { getDb } from "@/lib/db";
import { wishlists, products, productImages, categories } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getAuth } from "@/lib/auth";

export async function getWishlistItems() {
  try {
    const auth = await getAuth();
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized", data: [] };

    let env = process.env;
    try {
      const { getRequestContext } = await import("@cloudflare/next-on-pages");
      const ctx = getRequestContext();
      if (ctx && ctx.env) env = ctx.env;
    } catch (e) {}

    if (!env || !env.DB) return { success: false, error: "Database missing", data: [] };

    const db = getDb(env);

    // Join Wishlist + Products + Categories
    const results = await db
      .select({
        id: products.id,
        title: products.title,
        price: products.price,
        condition: products.condition,
        location: products.location,
        createdAt: products.createdAt,
        category: categories.name, // Ambil nama kategori langsung
      })
      .from(wishlists)
      .innerJoin(products, eq(wishlists.productId, products.id))
      .leftJoin(categories, eq(products.categoryId, categories.id))
      .where(eq(wishlists.userId, session.user.id))
      .all();

    const itemsWithImages = await Promise.all(results.map(async (item) => {
      try {
        const images = await db.select()
          .from(productImages)
          .where(eq(productImages.productId, item.id))
          .all();
        
        return {
          ...item,
          image: images[0]?.url || null,
        };
      } catch (imgErr) {
        return { ...item, image: null };
      }
    }));

    return { success: true, data: itemsWithImages };
  } catch (error) {
    console.error("[Wishlist Service] Fatal Error:", error);
    return { success: false, error: error.message, data: [] };
  }
}
