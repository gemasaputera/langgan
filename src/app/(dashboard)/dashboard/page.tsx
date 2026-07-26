"use client";

import { useState, useEffect, useCallback } from "react";
import { getSubscriptions } from "@/lib/actions/subscriptions";
import { getCategories } from "@/lib/actions/categories";
import { calculateMonthlyTotal } from "@/lib/utils";
import { TotalCards } from "@/components/dashboard/total-cards";
import { CategoryList } from "@/components/dashboard/category-list";
import { SubscriptionList } from "@/components/dashboard/subscription-list";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

export interface Subscription {
  id: string;
  name: string;
  price: number;
  currency: string;
  billingCycle: string;
  nextPaymentDate: string;
  categoryId: string | null;
  category: { id: string; name: string; color: string } | null;
  isActive: boolean;
  notes: string | null;
  logoUrl: string | null;
  color: string | null;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string | null;
  _count: { subscriptions: number };
  createdAt: string;
  updatedAt: string;
}

export default function DashboardPage() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [subs, cats] = await Promise.all([
        getSubscriptions(),
        getCategories(),
      ]);
      setSubscriptions(subs as unknown as Subscription[]);
      setCategories(cats as unknown as Category[]);
    } catch {
      setError("Gagal memuat data. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const monthlyTotal = calculateMonthlyTotal(
    subscriptions.filter((s) => s.isActive)
  );
  const subscriptionCount = subscriptions.filter((s) => s.isActive).length;

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-balance text-foreground">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ringkasan pengeluaran langgananmu
        </p>
      </div>

      {error && (
        <div
          className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 flex items-center gap-3"
          role="alert"
        >
          <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-destructive">{error}</p>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={fetchData}
            className="flex items-center gap-1 min-h-11"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Coba Lagi
          </Button>
        </div>
      )}

      {loading ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 rounded-xl bg-card animate-pulse motion-reduce:animate-none" />
          ))}
        </div>
      ) : (
        <TotalCards monthlyTotal={monthlyTotal} subscriptionCount={subscriptionCount} />
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SubscriptionList
            subscriptions={subscriptions}
            categories={categories}
            loading={loading}
            onRefresh={fetchData}
          />
        </div>
        <div>
          <CategoryList
            categories={categories}
            loading={loading}
            onRefresh={fetchData}
          />
        </div>
      </div>
    </div>
  );
}
