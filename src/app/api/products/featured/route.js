import { getApprovedProducts } from "@/modules/catalog/services";
import { NextResponse } from "next/server";

export const runtime = "edge";

export async function GET() {
  try {
    const res = await getApprovedProducts({ limit: 4 });
    return NextResponse.json(res);
  } catch (error) {
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
