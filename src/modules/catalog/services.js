"use server";

import { getContextDb } from "@/lib/db";
import { products } from "@/db/schema";
import { desc, eq, and } from "drizzle-orm";

/**
 * Service: Ambil produk yang sudah APPROVED untuk Katalog Publik
 */
export async function getApprovedProducts(categoryId = null) {
  try {
    const db = await getContextDb();
    
    // Base conditions
    const conditions = [eq(products.status, "APPROVED")];
    
    if (categoryId) {
      conditions.push(eq(products.categoryId, categoryId));
    }

    const result = await db.query.products.findMany({
      where: and(...conditions),
      with: {
        seller: {
          columns: {
            name: true,
            email: true,
          }
        },
        category: true,
        images: true,
      },
      orderBy: [desc(products.createdAt)],
    });

    return { success: true, data: result };
  } catch (error) {
    console.error("Error fetching catalog products:", error);
    return { success: false, error: "Gagal memuat katalog produk" };
  }
}
