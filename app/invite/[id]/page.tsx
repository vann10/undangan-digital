import Invitation from "../../page";

export default async function GuestInvitation({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <Invitation invitationId={id} />;
}
