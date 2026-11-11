import type { Metadata } from "next";
import InvitationNotice from "./invitation-notice";

export const metadata: Metadata = {
  title: "Tautan Undangan Tidak Valid | Rizal & Dewi",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return <InvitationNotice />;
}
