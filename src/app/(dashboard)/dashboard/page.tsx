"use client";

import { useState, useEffect } from "react";
import { getMonthlyTotal, getSubscriptions } from "@/lib/actions/subscriptions";
import { TotalCards } from "@/components/dashboard/total-cards";
import { CategoryList } from "@/components/dashboard/category-list";
import { SubscriptionList } from "@/components/dashboard/subscription-list";

export default function DashboardPage() {
  const [monthlyTotal, setMonthlyTotal] = useState(0);
  const [subscriptionCount, setSubscriptionCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [total, subs] = await Promise.all([
          getMonthlyTotal(),
          getSubscriptions(),
        ]);
        setMonthlyTotal(total);
        setSubscriptionCount(subs.length);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Dashboard</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Ringkasan pengeluaran langgananmu
        </p>
      </div>

      {loading ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-32 rounded-xl bg-neutral-900 animate-pulse" />
          ))}
        </div>
      ) : (
        <TotalCards monthlyTotal={monthlyTotal} subscriptionCount={subscriptionCount} />
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <SubscriptionList />
        </div>
        <div>
          <CategoryList />
        </div>
      </div>
    </div>
  );
}
