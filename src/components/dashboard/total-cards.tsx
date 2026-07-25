import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatIDR } from "@/lib/utils";
import { TrendingUp, Calendar } from "lucide-react";

interface TotalCardsProps {
  monthlyTotal: number;
  subscriptionCount: number;
}

export function TotalCards({ monthlyTotal, subscriptionCount }: TotalCardsProps) {
  const yearlyTotal = monthlyTotal * 12;

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      <Card className="bg-neutral-900 border-white/10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-neutral-400">
            Pengeluaran Bulanan
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-indigo-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            {formatIDR(monthlyTotal)}
          </div>
          <p className="text-xs text-neutral-500 mt-1">per bulan (estimasi)</p>
        </CardContent>
      </Card>

      <Card className="bg-neutral-900 border-white/10">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-neutral-400">
            Pengeluaran Tahunan
          </CardTitle>
          <Calendar className="h-4 w-4 text-indigo-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            {formatIDR(yearlyTotal)}
          </div>
          <p className="text-xs text-neutral-500 mt-1">per tahun (estimasi)</p>
        </CardContent>
      </Card>

      <Card className="bg-neutral-900 border-white/10 sm:col-span-2 lg:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-neutral-400">
            Langganan Aktif
          </CardTitle>
          <div className="h-4 w-4 rounded-full bg-indigo-400" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-white">
            {subscriptionCount}
          </div>
          <p className="text-xs text-neutral-500 mt-1">langganan aktif</p>
        </CardContent>
      </Card>
    </div>
  );
}
