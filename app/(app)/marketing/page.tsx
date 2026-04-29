import { DEMO_TEMPLATES } from "@/lib/demo-data";
import MarketingClient from "./MarketingClient";

export const dynamic = "force-dynamic";

export default function MarketingPage() {
  return <MarketingClient initialTemplates={DEMO_TEMPLATES} />;
}
