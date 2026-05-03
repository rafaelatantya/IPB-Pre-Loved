import { NextResponse } from "next/server";
import { getAuth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { wishlists } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { getRequestContext } from "@cloudflare/next-on-pages";

export const runtime = "edge";

export async function POST(req) {
  try {
    const auth = await getAuth();
    const session = await auth();
    if (!session?.user?.id) return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });

    const { productId, action } = await req.json();
    const userId = session.user.id;
    
    // Support production context
    const env = process.env.NODE_ENV === 'production' ? getRequestContext().env : process.env;
    const db = getDb(env);

    if (action === "TOGGLE") {
      const results = await db.select().from(wishlists)
        .where(and(eq(wishlists.userId, userId), eq(wishlists.productId, productId)))
        .all();
      
      const existing = results[0];
      if (existing) {
        await db.delete(wishlists).where(eq(wishlists.id, existing.id)).run();
        return NextResponse.json({ success: true, wishlisted: false });
      } else {
        await db.insert(wishlists).values({
          id: crypto.randomUUID(),
          userId: userId,
          productId: productId,
          createdAt: new Date().getTime(),
        }).run();
        return NextResponse.json({ success: true, wishlisted: true });
      }
    }

    if (action === "CHECK") {
      const results = await db.select().from(wishlists)
        .where(and(eq(wishlists.userId, userId), eq(wishlists.productId, productId)))
        .all();
      return NextResponse.json({ success: true, wishlisted: results.length > 0 });
    }

    return NextResponse.json({ success: false, error: "Invalid Action" }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
