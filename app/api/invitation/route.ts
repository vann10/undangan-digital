import { NextResponse } from "next/server";
import { callSheets, credentials, error, payload } from "../_lib/sheets";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await payload(request);
  const identity = body && credentials(body);
  if (!identity) return error("Tautan undangan tidak valid.", 400);
  try {
    const result = await callSheets("guest", identity, request);
    if (!result) return error("Undangan belum tersedia.", 503);
    if (result.code === "too_many_attempts") return error("Terlalu banyak percobaan. Coba lagi dalam 15 menit.", 429);
    if (result.code === "invalid_invitation") return error("Tautan undangan tidak valid atau tidak aktif.", 404);
    if (result.ok !== true || typeof result.name !== "string") throw new Error("Guest lookup failed");
    return NextResponse.json({ name: result.name.slice(0, 100), attendance: result.attendance ?? null, guestCount: result.guestCount ?? null }, { headers: { "Cache-Control": "no-store" } });
  } catch (cause) {
    console.error("Invitation lookup failed", cause);
    return error("Undangan belum dapat dibuka. Coba lagi nanti.", 502);
  }
}
