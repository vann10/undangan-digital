import { NextResponse } from "next/server";
import { callSheets, credentials, error, payload } from "../_lib/sheets";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  const body = await payload(request);
  const identity = body && credentials(body);
  if (!identity || !["attending", "not_attending"].includes(String(body?.attendance)))
    return error("Pilih konfirmasi kehadiran yang valid.", 400);
  try {
    const result = await callSheets("rsvp", { ...identity, attendance: body!.attendance }, request);
    if (!result) return error("RSVP belum tersedia.", 503);
    if (result.code === "too_many_attempts") return error("Terlalu banyak percobaan. Coba lagi dalam 15 menit.", 429);
    if (result.code === "invalid_invitation") return error("Tautan undangan tidak valid atau tidak aktif.", 404);
    if (result.code === "invalid_request") return error("Pilih konfirmasi kehadiran yang valid.", 400);
    if (result.code === "already_submitted") return NextResponse.json({ error: "Konfirmasi kehadiran sudah tercatat dan bersifat final.", attendance: result.attendance }, { status: 409, headers: { "Cache-Control": "no-store" } });
    if (result.ok !== true) throw new Error(`RSVP rejected: ${String(result.code)}`);
    return NextResponse.json({ ok: true, attendance: result.attendance }, { headers: { "Cache-Control": "no-store" } });
  } catch (cause) {
    console.error("RSVP submission failed", cause);
    return error("RSVP belum terkirim. Silakan coba lagi.", 502);
  }
}
