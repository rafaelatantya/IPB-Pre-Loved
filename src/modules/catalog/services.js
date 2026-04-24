"use server";

import { getContextDb } from "@/lib/db";
import { products, users, categories, productImages } from "@/db/schema";
import { desc, asc, eq, and, or, like, between, sql } from "drizzle-orm";

/**
 * Service: Ambil produk yang sudah APPROVED dengan filter canggih & Smart Search
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

    let finalMin = minPrice;
    let finalMax = maxPrice;
    if (finalMin > finalMax) {
      [finalMin, finalMax] = [finalMax, finalMin];
    }

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

    let orderBy;
    if (search) {
        orderBy = sql`
            (CASE WHEN ${products.title} LIKE ${`%${search}%`} THEN 10 ELSE 0 END) +
            (CASE WHEN ${products.description} LIKE ${`%${search}%`} THEN 1 ELSE 0 END) DESC
        `;
    } else {
        orderBy = desc(products.createdAt);
        if (sortBy === "cheapest") orderBy = asc(products.price);
        if (sortBy === "expensive") orderBy = desc(products.price);
    }

    const data = await db.query.products.findMany({
      where: and(...conditions),
      with: {
        seller: { columns: { name: true, email: true, whatsappNumber: true } },
        category: true,
        images: true,
      },
      orderBy: [orderBy, desc(products.createdAt)],
      limit: limit,
      offset: offset,
    });

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
 * Service: AI-Like Recommendations (Complex IF Heuristics)
 */
export async function getRecommendedProducts(targetProductId, limit = 4) {
  try {
    const db = await getContextDb();
    const base = await db.query.products.findFirst({ where: eq(products.id, targetProductId) });
    if (!base) return { success: false, error: "Produk referensi tidak ditemukan" };

    const candidates = await db.query.products.findMany({
      where: and(eq(products.status, "APPROVED"), sql`${products.id} != ${targetProductId}`),
      with: { category: true, images: true, seller: { columns: { name: true } } },
      limit: 50
    });

    const scored = candidates.map(item => {
      let score = 0;
      if (item.categoryId === base.categoryId) score += 50;
      const priceDiff = Math.abs(item.price - base.price);
      if (priceDiff <= base.price * 0.25) score += 30;
      if (item.condition === base.condition) score += 20;
      if (item.location === base.location) score += 10;
      const daysOld = (Date.now() - new Date(item.createdAt).getTime()) / (1000 * 3600 * 24);
      if (daysOld < 3) score += 15;
      return { ...item, _score: score };
    });

    const finalResult = scored.sort((a, b) => b._score - a._score).slice(0, limit);
    return { success: true, data: finalResult };
  } catch (error) {
    return { success: false, error: "Gagal memuat rekomendasi" };
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
      orderBy: [desc(products.createdAt)],
      limit: limit,
    });
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: "Gagal memuat produk unggulan" };
  }
}
