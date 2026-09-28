import { NextResponse } from "next/server";
import { availability } from "@/lib/orders";

export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(await availability(), { headers: { "Cache-Control": "no-store" } });
}
