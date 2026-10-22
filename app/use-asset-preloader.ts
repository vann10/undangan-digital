"use client";

import { useEffect, useState } from "react";

// Only artwork visible on the cover needs to load before the invitation opens.
const images = [
  "/artwork/monogram_RD_exact_illustration.svg",
  "/artwork/lake-landscape-review.webp",
  "/artwork/cloud-canopy-review.webp",
  "/artwork/edge-vine-review.webp",
  "/artwork/botanical-ascending-review-560.webp",
  "/artwork/botanical-spray-review-560.webp",
  "/artwork/butterfly-spread-review.webp",
] as const;

const total = images.length + 1; // Cover artwork and web fonts.
type Phase = "loading" | "ready" | "error";

function withTimeout<T>(promise: Promise<T>, milliseconds: number) {
  let timer: ReturnType<typeof setTimeout>;
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => {
      timer = setTimeout(() => reject(new Error("timeout")), milliseconds);
    }),
  ]).finally(() => clearTimeout(timer!));
}

export function useAssetPreloader() {
  const [attempt, setAttempt] = useState(0);
  const [completed, setCompleted] = useState(0);
  const [phase, setPhase] = useState<Phase>("loading");
  const [failed, setFailed] = useState(0);

  useEffect(() => {
    let cancelled = false;
    let next = 0;
    let failures = 0;
    setCompleted(0);
    setFailed(0);
    setPhase("loading");

    const tasks: Array<() => Promise<void>> = images.map(src => async () => {
      const image = new Image();
      image.src = src;
      await withTimeout(image.decode(), 30000);
    });
    tasks.push(async () => { await withTimeout(document.fonts.ready, 30000); });

    let index = 0;
    async function worker() {
      while (index < tasks.length && !cancelled) {
        const task = tasks[index++];
        try { await task(); } catch { failures += 1; }
        if (!cancelled) setCompleted(++next);
      }
    }
    void Promise.all(Array.from({ length: 4 }, worker)).then(() => {
      if (cancelled) return;
      setFailed(failures);
      setPhase(failures ? "error" : "ready");
    });

    return () => { cancelled = true; };
  }, [attempt]);

  return {
    completed, total, progress: Math.round(completed / total * 100), phase, failed,
    retry: () => setAttempt(value => value + 1),
    continueAnyway: () => setPhase("ready"),
  };
}
