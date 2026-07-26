import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const idrFormatter = new Intl.NumberFormat("id-ID", {
  style: "currency",
  currency: "IDR",
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function formatIDR(amount: number): string {
  return idrFormatter.format(amount);
}

export function formatIDRFromDecimal(amount: string | number): string {
  return idrFormatter.format(Number(amount));
}

export function billingCycleLabel(cycle: string): string {
  const labels: Record<string, string> = {
    daily: "Harian",
    weekly: "Mingguan",
    monthly: "Bulanan",
    yearly: "Tahunan",
  };
  return labels[cycle] || cycle;
}

export interface SubscriptionLike {
  price: number;
  billingCycle: string;
}

export function calculateMonthlyTotal(
  subscriptions: SubscriptionLike[]
): number {
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);

  return subscriptions.reduce((sum, sub) => {
    const nextDate = new Date((sub as any).nextPaymentDate ?? now);
    if (nextDate < startOfMonth || nextDate > endOfMonth) return sum;

    const price = Number(sub.price);
    switch (sub.billingCycle) {
      case "daily":
        return sum + price * 30;
      case "weekly":
        return sum + price * 4;
      case "monthly":
        return sum + price;
      case "yearly":
        return sum + price / 12;
      default:
        return sum + price;
    }
  }, 0);
}
