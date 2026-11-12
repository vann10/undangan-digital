// Keep four-digit codes canonical for the Sheets backend and existing links.
export function normalizeInvitationToken(value: unknown): string | null {
  if (typeof value !== "string" || value !== value.trim()) return null;
  if (/^\d{1,4}$/.test(value)) return value.padStart(4, "0");
  return /^[A-Za-z0-9_-]{43}$/.test(value) ? value : null;
}
