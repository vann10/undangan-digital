"use client";

import { useEffect, useState } from "react";
import { normalizeEventType, type EventType } from "./wedding-config";

type Guest = {
  name: string;
  token: string;
  attendance: "attending" | "not_attending" | null;
  guestCount: number | null;
  eventType: EventType;
};

export function useGuestInvitation(invitationId?: string, accessCode?: string) {
  const [guest, setGuest] = useState<Guest | null>(null);
  const [loading, setLoading] = useState(Boolean(invitationId));
  const [error, setError] = useState("");
  const [attempt, setAttempt] = useState(0);

  useEffect(() => {
    let disposed = false;
    let activeRequest: AbortController | undefined;
    setGuest(null);
    setError("");
    setLoading(Boolean(invitationId));
    if (!invitationId) return;

    const token = accessCode ?? window.location.hash.slice(1);
    if (!/^(?:[A-Za-z0-9_-]{43}|\d{4})$/.test(token)) {
      setError("Tautan undangan tidak valid.");
      setLoading(false);
      return;
    }

    async function load() {
      // Retry temporary network/backend failures; never retry invalid credentials.
      for (let retry = 0; retry < 3 && !disposed; retry++) {
        activeRequest = new AbortController();
        const timeout = setTimeout(() => activeRequest?.abort(), 18000);
        let retryable = true;
        try {
          const response = await fetch("/api/invitation", {
            method: "POST", headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ invitationId, invitationToken: token }),
            signal: activeRequest.signal, cache: "no-store",
          });
          retryable = response.status >= 500 || response.status === 408;
          const data = await response.json();
          if (!response.ok) throw new Error(data.error || "Undangan belum dapat dibuka.");
          retryable = true;
          if (typeof data.name !== "string" || !data.name.trim()) throw new Error("Nama tamu belum dapat dimuat.");
          const eventType = normalizeEventType(data.eventType);
          if (!eventType) throw new Error("Tipe acara pada undangan belum valid. Silakan hubungi mempelai.");
          if (disposed) return;
          setGuest({ name: data.name, token, attendance: data.attendance ?? null, guestCount: data.guestCount ?? null, eventType });
          setLoading(false);
          return;
        } catch (cause) {
          if (disposed) return;
          if (!retryable || retry === 2) {
            setError(cause instanceof Error && cause.name !== "AbortError"
              ? cause.message : "Nama tamu belum dapat dimuat. Silakan coba lagi.");
            setLoading(false);
            return;
          }
        } finally {
          clearTimeout(timeout);
        }
        await new Promise(resolve => setTimeout(resolve, 500 * (retry + 1)));
      }
    }
    void load();
    return () => { disposed = true; activeRequest?.abort(); };
  }, [invitationId, accessCode, attempt]);

  return {
    guestName: guest?.name ?? (invitationId ? "" : "Tamu Undangan"),
    invitationToken: guest?.token ?? null,
    attendance: guest?.attendance ?? null,
    guestCount: guest?.guestCount ?? null,
    eventType: guest?.eventType ?? (invitationId ? null : "pria" as EventType),
    guestLoading: loading,
    guestError: error,
    retryGuest: () => setAttempt(value => value + 1),
  };
}
