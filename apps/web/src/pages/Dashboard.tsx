import { lazy, Suspense, useMemo } from "react";
import { SectionCards } from "../components/section-cards";
import { Loader2 } from "lucide-react";

const ChartAreaInteractive = lazy(
  () => import("../components/chart-area-interactive")
);
const DataTable = lazy(() => import("../components/data-table"));

import rawData from "../app/dashboard/data.json";

function Dashboard() {
  const data = useMemo(() => rawData, []);

  const Loader = () => (
    <div className="flex justify-center items-center py-12">
      <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
    </div>
  );

  return (
    <div className="space-y-6">
      <SectionCards />

      <div className="px-4 lg:px-6">
        <Suspense fallback={<Loader />}>
          <ChartAreaInteractive />
        </Suspense>
      </div>

      <Suspense fallback={<Loader />}>
        <DataTable data={data} />
      </Suspense>
    </div>
  );
}

export default Dashboard;
