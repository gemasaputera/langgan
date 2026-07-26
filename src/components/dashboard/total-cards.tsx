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
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Pengeluaran Bulanan
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground tabular-nums">
            {formatIDR(monthlyTotal)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">per bulan (estimasi)</p>
        </CardContent>
      </Card>

      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Pengeluaran Tahunan
          </CardTitle>
          <Calendar className="h-4 w-4 text-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground tabular-nums">
            {formatIDR(yearlyTotal)}
          </div>
          <p className="text-xs text-muted-foreground mt-1">per tahun (estimasi)</p>
        </CardContent>
      </Card>

      <Card className="bg-card border-border sm:col-span-2 lg:col-span-1">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-muted-foreground">
            Langganan Aktif
          </CardTitle>
          <div className="h-4 w-4 rounded-full bg-primary" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-foreground tabular-nums">
            {subscriptionCount}
          </div>
          <p className="text-xs text-muted-foreground mt-1">langganan aktif</p>
        </CardContent>
      </Card>
    </div>
  );
}
