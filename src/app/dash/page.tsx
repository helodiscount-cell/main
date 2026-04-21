import { GrowthWidget } from "@/components/dash/GrowthWidget";
import { BestPerformerWidget } from "@/components/dash/BestPerformer";
import PlansAndBilling from "@/components/dash/PlansAndBilling";
import { Suspense } from "react";

export default async function Page() {
  return (
    <div className="grid auto-rows-min gap-4 md:grid-cols-3">
      <div className="md:col-span-3 lg:col-span-2">
        <BestPerformerWidget />
      </div>
      <GrowthWidget type="followers" />
      <GrowthWidget type="outreach" />
      <Suspense
        fallback={
          <div className="bg-white rounded-[32px] p-7 border border-gray-100 w-full max-w-sm h-[380px] animate-pulse">
            <div className="flex justify-between mb-8">
              <div className="h-6 w-32 bg-slate-100 rounded" />
              <div className="h-6 w-16 bg-slate-100 rounded" />
            </div>
            <div className="space-y-4 flex-1">
              <div className="h-10 w-48 bg-slate-100 rounded" />
              <div className="h-4 w-32 bg-slate-100 rounded" />
              <div className="h-4 w-full bg-slate-100 rounded-full" />
            </div>
          </div>
        }
      >
        <PlansAndBilling />
      </Suspense>
    </div>
  );
}
