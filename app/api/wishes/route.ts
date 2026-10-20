import { NextResponse } from "next/server";
import { callSheets, credentials, error, payload, settings } from "../_lib/sheets";

export const dynamic = "force-dynamic";

export async function GET() {
  const config = settings();
  if (!config) return error("Ucapan belum tersedia.", 503);
  try {
    const url = new URL(config.url);
    url.searchParams.set("token", config.token);
    const response = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(10000) });
    if (!response.ok) throw new Error(`Apps Script returned ${response.status}`);
    const result = await response.json();
    if (result.ok !== true || !Array.isArray(result.wishes)) throw new Error("Invalid wishes response");
    const wishes = result.wishes.slice(0, 100).map((wish: Record<string, unknown>) => ({
      id: String(wish.id ?? ""), name: String(wish.name ?? "").slice(0, 100),
      message: String(wish.message ?? "").slice(0, 1000), createdAt: String(wish.createdAt ?? ""),
    }));
    return NextResponse.json({ wishes }, { headers: { "Cache-Control": "no-store" } });
  } catch (cause) {
    console.error("Wishes request failed", cause);
    return error("Ucapan belum dapat dimuat. Coba lagi nanti.", 502);
  }
}

export async function POST(request: Request) {
  const body = await payload(request);
  const identity = body && credentials(body);
  if (!identity || typeof body?.wishId !== "string" || !/^[a-f0-9-]{36}$/i.test(body.wishId)
    || typeof body.message !== "string" || body.message.trim().length < 2 || body.message.trim().length > 1000)
    return error("Ucapan harus berisi 2 sampai 1000 karakter.", 400);
  try {
    const result = await callSheets("wish", { ...identity, wishId: body.wishId, message: body.message.trim() });
    if (!result) return error("Ucapan belum tersedia.", 503);
    if (result.code === "invalid_invitation") return error("Tautan undangan tidak valid atau tidak aktif.", 404);
    if (result.code === "invalid_request") return error("Ucapan harus berisi 2 sampai 1000 karakter tanpa karakter kendali.", 400);
    if (result.code === "wish_already_submitted") return error("Ucapan Anda sudah tercatat.", 409);
    if (result.ok !== true) throw new Error(`Wish rejected: ${String(result.code)}`);
    return NextResponse.json({ ok: true }, { headers: { "Cache-Control": "no-store" } });
  } catch (cause) {
    console.error("Wish submission failed", cause);
    return error("Ucapan belum terkirim. Silakan coba lagi.", 502);
  }
}
