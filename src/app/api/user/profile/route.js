import { NextResponse } from "next/server";
import { updateSellerProfile } from "@/modules/user/actions";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const { whatsappNumber } = await req.json();
    const res = await updateSellerProfile({ whatsappNumber });
    return NextResponse.json(res);
  } catch (error) {
    return NextResponse.json({ success: false, error: "Internal Error" }, { status: 500 });
  }
}
