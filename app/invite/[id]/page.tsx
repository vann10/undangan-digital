import Invitation from "../../page";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

export const metadata: Metadata = { robots: { index: false, follow: false, nocache: true } };

export default async function GuestInvitation({ params }: { params: Promise<{ id: string }> }) {
  const { id: segment } = await params;
  const short = /^([1-9]\d{0,9})-(\d{4})$/.exec(segment);
  if (!short && !/^[1-9]\d{0,9}$/.test(segment)) notFound();
  return <Invitation invitationId={short?.[1] ?? segment} accessCode={short?.[2]} />;
}
