import type { Metadata } from "next";
import "@fontsource/cormorant-garamond/400.css";
import "@fontsource/cormorant-garamond/400-italic.css";
import "@fontsource/cormorant-garamond/500.css";
import "@fontsource/dm-sans/400.css";
import "@fontsource/dm-sans/500.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "Undangan Pernikahan Rizal & Dewi",
  description: "Undangan pernikahan Rizal & Dewi.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="id"><head><link rel="stylesheet" href="https://fonts.cdnfonts.com/css/runethia" /></head><body>{children}</body></html>;
}
