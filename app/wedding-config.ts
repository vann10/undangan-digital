/** Details confirmed by the couple. Leave unknown values null. */
export const wedding = {
  groom: "Rizal",
  bride: "Dewi",
  groomFullName: "Rizal Nur Ikhsani",
  brideFullName: "Dewi Nur Alizzah",
  groomFather: "Rohmad",
  groomMother: "Yuni Isnindarwati",
  brideFather: "Mohammad Bahrodin",
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
  venueName: "Rumah",
  venueAddress: "Jl Manyar gg Bimo, RT 06/RW 02, Beran 1, Beran, Ngawi",
  mapsUrl: "https://maps.app.goo.gl/rrxyNSaMfoAMDv3v5" as string | null,
  mapsEmbedUrl: "https://www.google.com/maps?q=-7.42037%2C111.433512&z=17&output=embed",
  bankAccounts: [
    { bank: "BRI", holder: "RIZAL NUR IKHSANI", number: "009001079530506" },
    { bank: "BCA", holder: "DEWI NUR ALIZZAH", number: "2630842151" },
  ],
  giftDeliveryAddress: "RIZAL NUR IKHSANI, Jl Manyar gg Bimo, RT 06/RW 02, Beran 1, Beran, Ngawi",
};

export const dateLabel = new Intl.DateTimeFormat("id-ID", {
  day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
}).format(new Date(`${wedding.date}T00:00:00Z`));

export const fullDateLabel = new Intl.DateTimeFormat("id-ID", {
  weekday: "long", day: "numeric", month: "long", year: "numeric", timeZone: "UTC",
}).format(new Date(`${wedding.date}T00:00:00Z`));

export const timeLabel = `${wedding.time.replace(":", ".")}–${wedding.endTime.replace(":", ".")} WIB`;

function eventTime(time: string) {
  const [year, month, day] = wedding.date.split("-").map(Number);
  const [hour, minute] = time.split(":").map(Number);
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

export function eventDate() { return eventTime(wedding.time); }

export function calendarUrl() {
  const start = eventDate();
  const end = eventTime(wedding.endTime);
  if (!start || !end || end <= start || !wedding.venueAddress || !wedding.venueName) return null;
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
