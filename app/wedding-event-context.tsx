"use client";

import { createContext, useContext } from "react";
import { eventLabels, weddingEvents, type WeddingEvent } from "./wedding-config";

export const WeddingEventContext = createContext<WeddingEvent | null>(weddingEvents.pria);

export function useWeddingEvent() {
  const event = useContext(WeddingEventContext);
  return {
    event,
    ...(event ? eventLabels(event) : {
      dateLabel: "Memuat tanggal acara…",
      fullDateLabel: "Memuat tanggal acara…",
      timeLabel: "Memuat jam acara…",
    }),
  };
}
