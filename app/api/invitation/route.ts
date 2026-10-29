import { NextResponse } from "next/server";
import { callSheets, credentials, error, payload } from "../_lib/sheets";
import { normalizeEventType } from "../../wedding-config";

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
    if (result.code === "invalid_event_type") return error("Tipe acara pada undangan belum valid. Silakan hubungi mempelai.", 422);
    if (result.ok !== true || typeof result.name !== "string") throw new Error("Guest lookup failed");
    const eventType = normalizeEventType(result.eventType);
    if (!eventType) return error("Tipe acara pada undangan belum valid. Silakan hubungi mempelai.", 422);
    return NextResponse.json({ name: result.name.slice(0, 100), eventType, attendance: result.attendance ?? null, guestCount: result.guestCount ?? null }, { headers: { "Cache-Control": "no-store" } });
  } catch (cause) {
    console.error("Invitation lookup failed", cause);
    return error("Undangan belum dapat dibuka. Coba lagi nanti.", 502);
  }
}
