"use client";

import { useState } from "react";
import { deleteSubscription } from "@/lib/actions/subscriptions";
import { SubscriptionCard } from "./subscription-card";
import { AddSubscriptionDialog } from "./add-subscription-dialog";
import { EditSubscriptionDialog } from "./edit-subscription-dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

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
}

export interface Category {
  id: string;
  name: string;
  color: string;
}

interface SubscriptionListProps {
  subscriptions: Subscription[];
  categories: Category[];
  loading: boolean;
  onRefresh: () => void;
}

export function SubscriptionList({
  subscriptions,
  categories,
  loading,
  onRefresh,
}: SubscriptionListProps) {
  const [editSubscription, setEditSubscription] = useState<Subscription | null>(null);
  const [deleteError, setDeleteError] = useState("");

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus langganan ini?")) return;
    setDeleteError("");
    try {
      await deleteSubscription(id);
      onRefresh();
    } catch {
      setDeleteError("Gagal menghapus langganan. Silakan coba lagi.");
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-lg font-semibold text-foreground">Langganan</h2>
        <AddSubscriptionDialog onCreated={onRefresh} categories={categories}>
          <Button size="sm" className="min-h-11">
            <Plus className="h-4 w-4 mr-1" />
            Tambah Langganan
          </Button>
        </AddSubscriptionDialog>
      </div>

      {deleteError && (
        <p className="text-sm text-destructive" role="alert" aria-live="polite">
          {deleteError}
        </p>
      )}

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 rounded-xl bg-card animate-pulse motion-reduce:animate-none" />
          ))}
        </div>
      ) : subscriptions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-border bg-card p-12 text-center">
          <p className="text-muted-foreground mb-4">
            Belum ada langganan. Tambahkan langganan pertamamu!
          </p>
          <AddSubscriptionDialog onCreated={onRefresh} categories={categories}>
            <Button size="sm" className="min-h-11">
              <Plus className="h-4 w-4 mr-1" />
              Tambah Langganan
            </Button>
          </AddSubscriptionDialog>
        </div>
      ) : (
        <div className="space-y-3">
          {subscriptions.map((subscription) => (
            <SubscriptionCard
              key={subscription.id}
              subscription={subscription}
              onEdit={() => setEditSubscription(subscription)}
              onDelete={() => handleDelete(subscription.id)}
            />
          ))}
        </div>
      )}

      {editSubscription && (
        <EditSubscriptionDialog
          subscription={{
            ...editSubscription,
            price: String(editSubscription.price),
            nextPaymentDate: editSubscription.nextPaymentDate,
          }}
          categories={categories}
          open={!!editSubscription}
          onOpenChange={(open) => !open && setEditSubscription(null)}
          onUpdated={onRefresh}
        />
      )}
    </div>
  );
}
