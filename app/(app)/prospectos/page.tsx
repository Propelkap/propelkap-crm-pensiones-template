import ProspectosClient from "./ProspectosClient";
import type { Stage } from "@/lib/demo-data";

export default async function ProspectosPage({
  searchParams,
}: {
  searchParams: Promise<{ stage?: string }>;
}) {
  const params = await searchParams;
  return <ProspectosClient initialStage={params.stage as Stage | undefined} />;
}
