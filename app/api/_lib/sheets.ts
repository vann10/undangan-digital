import { createHmac } from "node:crypto";
import { NextResponse } from "next/server";
import { normalizeInvitationToken } from "../../invitation-token";

export type InvitationCredentials = { invitationId: string; invitationToken: string };

export function settings() {
  const url = process.env.GOOGLE_APPS_SCRIPT_URL;
  const token = process.env.GOOGLE_APPS_SCRIPT_TOKEN;
  if (!url || !token || !/^https:\/\/script\.google\.com\/macros\/s\/[^/]+\/exec$/.test(url)) return null;
  return { url, token };
}

export function error(message: string, status: number) {
  return NextResponse.json({ error: message }, { status, headers: { "Cache-Control": "no-store" } });
}

export function credentials(body: Record<string, unknown>): InvitationCredentials | null {
  const invitationToken = normalizeInvitationToken(body.invitationToken);
  if (typeof body.invitationId !== "string" || !/^[1-9]\d{0,9}$/.test(body.invitationId)
    || invitationToken === null) return null;
  return { invitationId: body.invitationId, invitationToken };
}

export async function payload(request: Request): Promise<Record<string, unknown> | null> {
  if (Number(request.headers.get("content-length")) > 4096) return null;
  try {
    const raw = await request.text();
    if (raw.length > 4096) return null;
    const body = JSON.parse(raw);
    return body && typeof body === "object" && !Array.isArray(body) ? body : null;
  } catch { return null; }
}

export async function callSheets(action: string, body: Record<string, unknown>, request: Request) {
  const config = settings();
  if (!config) return null;
  const source = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim()
    || request.headers.get("x-real-ip") || "unknown";
  const clientKey = createHmac("sha256", config.token).update(source).digest("hex").slice(0, 24);
  const response = await fetch(config.url, {
    method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({ ...body, action, serviceToken: config.token, clientKey }),
    cache: "no-store", signal: AbortSignal.timeout(15000),
  });
  if (!response.ok) throw new Error(`Apps Script returned ${response.status}`);
  const result = await response.json();
  if (!result || typeof result !== "object") throw new Error("Invalid Apps Script response");
  return result as Record<string, unknown>;
}
