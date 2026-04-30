import { NextResponse } from "next/server";
import { upgradeToSeller } from "@/modules/user/actions";
import { getAuth } from "@/lib/auth";

export const runtime = "edge";

/**
 * API Route: Upgrade User to Seller
 * Solusi untuk menghindari 405 Method Not Allowed pada Root Path Server Actions di Cloudflare.
 */
export async function POST(req) {
  try {
    const { whatsappNumber } = await req.json();
    
    // Panggil action yang sudah kita buat
    const res = await upgradeToSeller(whatsappNumber);
    
    return NextResponse.json(res);
  } catch (error) {
    console.error("[API UPGRADE ERROR]:", error);
    return NextResponse.json({ 
      success: false, 
      error: "Terjadi kesalahan internal pada API Upgrade." 
    }, { status: 500 });
  }
}
