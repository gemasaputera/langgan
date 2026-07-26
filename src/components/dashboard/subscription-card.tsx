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

  const isUrgent = daysUntil <= 3 && daysUntil >= 0;
  const isOverdue = daysUntil < 0;

  return (
    <Card className="bg-card border-border hover:border-border/50 transition-colors">
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1 min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="font-semibold text-foreground">{subscription.name}</h3>
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
            <p className="text-xl font-bold text-foreground">
              {formatIDR(subscription.price)}
              <span className="text-sm font-normal text-muted-foreground">
                {" "}/{ billingCycleLabel(subscription.billingCycle) }
              </span>
            </p>
            <p className="text-sm text-muted-foreground">
              Pembayaran berikutnya:{" "}
              <span
                className={`font-medium ${
                  isOverdue
                    ? "text-destructive"
                    : isUrgent
                      ? "text-warning"
                      : "text-secondary-foreground"
                }`}
              >
                {nextDate.toLocaleDateString("id-ID", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </span>
              {isOverdue ? (
                <span className="text-destructive"> ({Math.abs(daysUntil)} hari telat)</span>
              ) : daysUntil === 0 ? (
                <span className={isUrgent ? "text-warning" : "text-muted-foreground"}> (hari ini)</span>
              ) : daysUntil > 0 ? (
                <span className="text-muted-foreground"> ({daysUntil} hari lagi)</span>
              ) : null}
            </p>
          </div>
          <div className="flex items-center gap-1 flex-shrink-0">
            <Button
              variant="ghost"
              size="icon"
              className="h-11 w-11 text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              onClick={onEdit}
              aria-label={`Edit ${subscription.name}`}
            >
              <Pencil className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-11 w-11 text-muted-foreground hover:text-destructive focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
              onClick={onDelete}
              aria-label={`Hapus ${subscription.name}`}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        {subscription.notes && (
          <p className="mt-2 text-xs text-muted-foreground line-clamp-2">
            {subscription.notes}
          </p>
        )}
      </CardContent>
    </Card>
  );
}
