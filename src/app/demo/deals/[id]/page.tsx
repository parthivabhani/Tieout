import { notFound } from "next/navigation";
import { Workspace } from "@/components/app/Workspace";

export default async function DealPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (id !== "falcon-trust" && id !== "fjord-thread") notFound();
  return <Workspace />;
}
