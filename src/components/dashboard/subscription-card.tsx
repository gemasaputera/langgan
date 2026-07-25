"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatIDR, billingCycleLabel } from "@/lib/utils";
import { Pencil, Trash2 } from "lucide-react";

interface SubscriptionCardProps {
  subscription: {
    id: string;
    name: string;
    price: number;
    currency: string;
    billingCycle: string;
    nextPaymentDate: string;
    category: { name: string; color: string } | null;
    isActive: boolean;
    notes: string | null;
  };
  onEdit: () => void;
  onDelete: () => void;
}

export function SubscriptionCard({
  subscription,
  onEdit,
  onDelete,
}: SubscriptionCardProps) {
  const nextDate = new Date(subscription.nextPaymentDate);
  const today = new Date();
  const daysUntil = Math.ceil(
    (nextDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <Card className="bg-neutral-900 border-white/10 hover:border-white/20 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-white">{subscription.name}</h3>
              {subscription.category && (
                <Badge
                  variant="secondary"
                  className="text-xs"
                  style={{
                    backgroundColor: `${subscription.category.color}20`,
                    color: subscription.category.color,
                    borderColor: `${subscription.category.color}40`,
                  }}
                >
                  {subscription.category.name}
                </Badge>
              )}
            </div>
            <p className="text-xl font-bold text-white">
              {formatIDR(subscription.price)}
              <span className="text-sm font-normal text-neutral-500">
                {" "}/{ billingCycleLabel(subscription.billingCycle) }
              </span>
            </p>
            <p className="text-sm text-neutral-400">
              Pembayaran berikutnya:{" "}
              <span className={`font-medium ${daysUntil <= 3 ? "text-amber-400" : "text-neutral-300"}`}>
                {nextDate.toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              {daysUntil > 0 && (
                <span className="text-neutral-500"> ({daysUntil} hari lagi)</span>
              )}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-neutral-400 hover:text-white"
              onClick={onEdit}
            >
              <Pencil className="h-3 w-3" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-neutral-400 hover:text-red-400"
              onClick={onDelete}
            >
              <Trash2 className="h-3 w-3" />
            </Button>
          </div>
        </div>
        {subscription.notes && (
          <p className="mt-2 text-xs text-neutral-500 line-clamp-2">
            {subscription.notes}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
