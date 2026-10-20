/** Edit these confirmed details before publishing. Leave unknown values null. */
export const wedding = {
  groom: "Rizal",
  bride: "Dewi",
  groomFullName: null as string | null,
  brideFullName: null as string | null,
  groomFather: null as string | null,
  groomMother: null as string | null,
  date: "2026-11-14",
  time: "09:00" as string | null, // 24-hour local time
  timeZone: "Asia/Jakarta" as string | null, // Confirmed WIB
  venueName: null as string | null,
  venueAddress: null as string | null,
  mapsUrl: null as string | null, // Exact Google Maps place URL
  bankName: null as string | null,
  bankAccountName: null as string | null,
  bankAccountNumber: null as string | null,
  giftDeliveryAddress: null as string | null,
};

export const displayValue = (value: string | null) => value?.trim() || "XXX";

export function eventDate() {
  if (!wedding.time || !wedding.timeZone) return null;
  // The confirmed date is kept independent of the still-pending event time.
  const [year, month, day] = wedding.date.split("-").map(Number);
  const [hour, minute] = wedding.time.split(":").map(Number);
  if (![year, month, day, hour, minute].every(Number.isFinite)) return null;
  const localeDate = new Date(Date.UTC(year, month - 1, day, hour, minute));
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: wedding.timeZone, year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit", hourCycle: "h23",
  }).formatToParts(localeDate);
  const read = (type: string) => Number(parts.find(part => part.type === type)?.value);
  const desired = Date.UTC(year, month - 1, day, hour, minute);
  const actual = Date.UTC(read("year"), read("month") - 1, read("day"), read("hour"), read("minute"));
  return new Date(localeDate.getTime() + desired - actual);
}

export function calendarUrl() {
  const start = eventDate();
  if (!start || !wedding.venueAddress || !wedding.venueName || !wedding.timeZone) return null;
  const end = new Date(start.getTime() + 2 * 60 * 60 * 1000);
  const stamp = (date: Date) => date.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: `Pernikahan ${wedding.groom} & ${wedding.bride}`,
    dates: `${stamp(start)}/${stamp(end)}`,
    ctz: wedding.timeZone,
    location: `${wedding.venueName}, ${wedding.venueAddress}`,
    details: `Undangan pernikahan ${wedding.groom} & ${wedding.bride}.`,
  });
  return `https://calendar.google.com/calendar/render?${params}`;
}
