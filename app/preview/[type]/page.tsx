import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Invitation from "../../page";

export const metadata: Metadata = {
  title: "Pratinjau Undangan Rizal & Dewi",
  robots: { index: false, follow: false, nocache: true },
};

export default async function PreviewInvitation({ params }: { params: Promise<{ type: string }> }) {
  const { type } = await params;
  if (type !== "pria" && type !== "wanita") notFound();
  return <Invitation previewEventType={type} />;
}
