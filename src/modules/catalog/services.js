"use server";

import { getContextDb } from "@/lib/db";
import { products, users, categories, productImages } from "@/db/schema";
import { desc, asc, eq, and, or, like, between, sql } from "drizzle-orm";

/**
 * Service: Ambil produk yang sudah APPROVED dengan filter canggih
 */
export async function getApprovedProducts({ 
  search = "", 
  categoryId = null, 
  minPrice = 0, 
  maxPrice = 1000000000, 
  condition = [], 
  sortBy = "latest",
  page = 1,
  limit = 12
} = {}) {
  try {
    const db = await getContextDb();
    const offset = (page - 1) * limit;

    // EDGE CASE: Swap harga jika min > max
    let finalMin = minPrice;
    let finalMax = maxPrice;
    if (finalMin > finalMax) {
      [finalMin, finalMax] = [finalMax, finalMin];
    }

    // 1. Membangun Conditions
    const conditions = [eq(products.status, "APPROVED")];

    if (search) {
      conditions.push(or(
        like(products.title, `%${search}%`),
        like(products.description, `%${search}%`)
      ));
    }

    if (categoryId && categoryId !== "all") {
      conditions.push(eq(products.categoryId, categoryId));
    }

    if (condition.length > 0) {
      conditions.push(sql`${products.condition} IN ${condition}`);
    }

    conditions.push(between(products.price, finalMin, finalMax));

    // 2. Membangun Sorting
    let orderBy = desc(products.createdAt);
    if (sortBy === "cheapest") orderBy = asc(products.price);
    if (sortBy === "expensive") orderBy = desc(products.price);

    // 3. Query Data
    const data = await db.query.products.findMany({
      where: and(...conditions),
      with: {
        seller: { columns: { name: true, email: true, whatsappNumber: true } },
        category: true,
        images: true,
      },
      orderBy: [orderBy],
      limit: limit,
      offset: offset,
    });

    // 4. Hitung Total untuk Pagination
    // (D1 optimization: Biasanya butuh query terpisah buat count)
    const countResult = await db.select({ count: sql`count(*)` })
      .from(products)
      .where(and(...conditions));
    
    const totalItems = countResult[0]?.count || 0;

    return { 
      success: true, 
      data, 
      pagination: {
        totalItems,
        totalPages: Math.ceil(totalItems / limit),
        currentPage: page
      }
    };
  } catch (error) {
    console.error("Error fetching catalog products:", error);
    return { success: false, error: "Gagal memuat katalog produk" };
  }
}

/**
 * Service: Ambil Detail Produk berdasarkan ID
 */
export async function getProductById(id) {
  try {
    const db = await getContextDb();
    const result = await db.query.products.findFirst({
      where: eq(products.id, id),
      with: {
        seller: { columns: { name: true, email: true, whatsappNumber: true, createdAt: true } },
        category: true,
        images: true,
      }
    });

    if (!result) return { success: false, error: "Produk tidak ditemukan" };
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: "Gagal memuat detail produk" };
  }
}

/**
 * Service: Ambil Produk Unggulan (Featured Finds)
 */
export async function getFeaturedProducts(limit = 4) {
  try {
    const db = await getContextDb();
    const result = await db.query.products.findMany({
      where: eq(products.status, "APPROVED"),
      with: {
        seller: { columns: { name: true } },
        category: true,
        images: true,
      },
      orderBy: [desc(products.createdAt)], // Sementara latest as featured
      limit: limit,
    });

    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: "Gagal memuat produk unggulan" };
  }
}
