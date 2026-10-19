import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

type Submission = {
  submissionId: string;
  name: string;
  attendance: "attending" | "not_attending";
  guestCount: number;
  message: string;
  website?: string;
};

function configured() {
  const url = process.env.GOOGLE_APPS_SCRIPT_URL;
  const token = process.env.GOOGLE_APPS_SCRIPT_TOKEN;
  if (!url || !token || !/^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec$/.test(url)) return null;
  return { url, token };
}

function error(message: string, status: number) {
  return NextResponse.json({ error: message }, { status, headers: { "Cache-Control": "no-store" } });
}

export async function GET() {
  const settings = configured();
  if (!settings) return error("RSVP belum tersedia.", 503);
  try {
    const url = new URL(settings.url);
    url.searchParams.set("token", settings.token);
    const response = await fetch(url, { cache: "no-store", signal: AbortSignal.timeout(10000) });
    if (!response.ok) throw new Error(`Google Apps Script returned ${response.status}`);
    const data = await response.json();
    if (!data.ok || !Array.isArray(data.wishes)) throw new Error("Invalid wishes response");
    const wishes = data.wishes.map((wish: Record<string, unknown>) => ({
      id: String(wish.id ?? ""), name: String(wish.name ?? "").slice(0, 100),
      message: String(wish.message ?? "").slice(0, 1000),
      createdAt: String(wish.createdAt ?? ""),
    }));
    return NextResponse.json({ wishes }, { headers: { "Cache-Control": "no-store" } });
  } catch (cause) {
    console.error("RSVP wishes request failed", cause);
    return error("Ucapan belum dapat dimuat. Coba lagi nanti.", 502);
  }
}

export async function POST(request: Request) {
  const settings = configured();
  if (!settings) return error("RSVP belum tersedia.", 503);
  let body: Submission;
  try { body = await request.json(); } catch { return error("Data formulir tidak valid.", 400); }
  if (!body || typeof body !== "object") return error("Data formulir tidak valid.", 400);
  if (body.website) return NextResponse.json({ ok: true });
  const valid = typeof body.submissionId === "string" && /^[a-f0-9-]{36}$/i.test(body.submissionId)
    && typeof body.name === "string" && body.name.trim().length >= 2 && body.name.trim().length <= 100
    && ["attending", "not_attending"].includes(body.attendance)
    && Number.isInteger(body.guestCount) && body.guestCount === (body.attendance === "attending" ? Math.max(1, Math.min(10, body.guestCount)) : 0)
    && typeof body.message === "string" && body.message.trim().length >= 2 && body.message.trim().length <= 1000;
  if (!valid) return error("Periksa kembali nama, kehadiran, jumlah tamu, dan ucapan.", 400);
  try {
    const response = await fetch(settings.url, {
      method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" },
      body: JSON.stringify({ token: settings.token, submissionId: body.submissionId,
        name: body.name.trim(), attendance: body.attendance, guestCount: body.guestCount,
        message: body.message.trim() }),
      cache: "no-store", signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) throw new Error(`Google Apps Script returned ${response.status}`);
    const result = await response.json();
    if (!result.ok) throw new Error(String(result.error || "Google Apps Script rejected RSVP"));
    return NextResponse.json({ ok: true, id: body.submissionId }, { headers: { "Cache-Control": "no-store" } });
  } catch (cause) {
    console.error("RSVP submission failed", cause);
    return error("RSVP belum terkirim. Silakan coba lagi.", 502);
  }
}
