import { getCategories } from "@/modules/category/actions";
import { NextResponse } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const res = await getCategories();
    return NextResponse.json(res);
  } catch (error) {
    console.error("API Categories GET Error:", error);
    return NextResponse.json({ success: false, error: "Internal Server Error" }, { status: 500 });
  }
}
