import { GrowthWidget } from "@/components/dash/GrowthWidget";
import { BestPerformerWidget } from "@/components/dash/BestPerformer";

export default async function Page() {
  return (
    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
      <GrowthWidget type="followers" />
      <GrowthWidget type="outreach" />
      <div className="md:col-span-3 lg:col-span-2">
        <BestPerformerWidget />
      </div>
    </div>
  );
}
