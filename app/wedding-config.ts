/** Details confirmed by the couple. Leave unknown values null. */
export const wedding = {
  groom: "Rizal",
  bride: "Dewi",
  groomFullName: "Rizal Nur Ikhsani",
  brideFullName: "Dewi Nur Alizzah",
  groomFather: "Rohmad",
  groomMother: "Yuni Isnindarwati",
  brideFather: "Muhammad Bahrodin",
  brideMother: "Mariatul Qibtiyah",
  // Konten opsional untuk diaktifkan setelah datanya diberikan:
  // groomBio: "",
  // brideBio: "",
  // groomSocialUrl: "",
  // brideSocialUrl: "",
  // ourStory: "",
  // eventType: "",
  date: "2026-11-28",
  time: "10:00", // 24-hour local time
  endTime: "13:00",
  timeZone: "Asia/Jakarta", // WIB
  venueName: "Kediaman mempelai pria",
  venueAddress: "Jl Manyar gg Bimo, RT 06/RW 02, Beran 1, Beran, Ngawi",
  mapsUrl: "https://maps.app.goo.gl/rrxyNSaMfoAMDv3v5" as string | null,
  mapsEmbedUrl: "https://www.google.com/maps?q=-7.42037%2C111.433512&z=17&output=embed",
  bankAccounts: [
    { bank: "BRI", holder: "RIZAL NUR IKHSANI", number: "009001079530506" },
    { bank: "BCA", holder: "DEWI NUR ALIZZAH", number: "2630842151" },
  ],
  giftDeliveryAddress: "RIZAL NUR IKHSANI, Jl Manyar gg Bimo, RT 06/RW 02, Beran 1, Beran, Ngawi",
};

export type EventType = "pria" | "wanita";
export type EventSchedule = {
  date: string | null;
  time: string | null;
  endTime: string | null;
  timeZone: string;
  venueName: string | null;
  venueAddress: string | null;
  mapsUrl: string | null;
  mapsEmbedUrl: string | null;
};
export type WeddingEvent = EventSchedule & {
  sessions?: (EventSchedule & { title: string })[];
};

const brideVenue = {
  date: "2026-11-20",
  timeZone: "Asia/Jakarta",
  venueName: "Kediaman mempelai wanita",
  venueAddress: "Dsn. Krajan 1, RT 05/RW 06, Setail, Genteng, Banyuwangi (Selatan Ponpes Raudlatut Thalabah)",
  mapsUrl: "https://maps.app.goo.gl/z6gegTTCZxpLcWF9A?g_st=ic",
  mapsEmbedUrl: "https://www.google.com/maps?q=-8.3622471%2C114.1318747&z=17&output=embed",
};

// Shared couple/gift details stay above. Only these fields vary by invitation.
export const weddingEvents: Record<EventType, WeddingEvent> = {
  pria: {
    date: wedding.date, time: wedding.time, endTime: wedding.endTime, timeZone: wedding.timeZone,
    venueName: wedding.venueName, venueAddress: wedding.venueAddress,
    mapsUrl: wedding.mapsUrl, mapsEmbedUrl: wedding.mapsEmbedUrl,
  },
  wanita: {
    ...brideVenue,
    time: "08:00", endTime: null, // Countdown starts at the akad; no fixed end time supplied.
    sessions: [
      { ...brideVenue, title: "Akad Nikah", time: "08:00", endTime: null },
      { ...brideVenue, title: "Resepsi", time: "14:00", endTime: null },
    ],
  },
};

export function normalizeEventType(value: unknown): EventType | null {
  if (value === undefined || value === null || value === "") return "pria";
  if (typeof value !== "string") return null;
  const type = value.trim().toLowerCase();
  return !type ? "pria" : type === "pria" || type === "wanita" ? type : null;
}

export function eventLabels(event: WeddingEvent) {
  const dateLabel = event.date ? new Intl.DateTimeFormat("id-ID", {
  day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
  }).format(new Date(`${event.date}T00:00:00Z`)) : "Tanggal akan diumumkan";

  const fullDateLabel = event.date ? new Intl.DateTimeFormat("id-ID", {
  weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
  }).format(new Date(`${event.date}T00:00:00Z`)) : "Tanggal akan diumumkan";

  const zone = { "Asia/Jakarta": "WIB", "Asia/Makassar": "WITA", "Asia/Jayapura": "WIT" }[event.timeZone] ?? event.timeZone;
  const timeLabel = event.time ? `${event.time.replace(":", ".")}${event.endTime ? `–${event.endTime.replace(":", ".")}` : ""} ${zone}${event.endTime ? "" : " s/d Selesai"}` : "Jam akan diumumkan";
  return { dateLabel, fullDateLabel, timeLabel };
}

export const { dateLabel, fullDateLabel, timeLabel } = eventLabels(weddingEvents.pria);

function eventTime(time: string | null, event: WeddingEvent) {
  if (!event.date || !time) return null;
  const [year, month, day] = event.date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
  if (![year, month, day, hour, minute].every(Number.isFinite)) return null;
  const localeDate = new Date(Date.UTC(year, month - 1, day, hour, minute));
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: event.timeZone, year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(localeDate);
  const read = (type: string) => Number(parts.find(part => part.type === type)?.value);
  const desired = Date.UTC(year, month - 1, day, hour, minute);
  const actual = Date.UTC(read("year"), read("month") - 1, read("day"), read("hour"), read("minute"));
  return new Date(localeDate.getTime() + desired - actual);
}

export function eventDate(event: WeddingEvent = weddingEvents.pria) { return eventTime(event.time, event); }

export function calendarUrl(event: WeddingEvent = weddingEvents.pria) {
  const start = eventDate(event);
  const end = eventTime(event.endTime, event);
  if (!start || !end || end <= start || !event.venueAddress || !event.venueName) return null;
  const stamp = (date: Date) => date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `Pernikahan ${wedding.groom} & ${wedding.bride}`,
    dates: `${stamp(start)}/${stamp(end)}`,
    ctz: event.timeZone,
    location: `${event.venueName}, ${event.venueAddress}`,
    details: `Undangan pernikahan ${wedding.groom} & ${wedding.bride}.`,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}
