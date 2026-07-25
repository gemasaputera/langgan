"use client";

import { useState, useEffect } from "react";
import { getSubscriptions, deleteSubscription } from "@/lib/actions/subscriptions";
import { SubscriptionCard } from "./subscription-card";
import { AddSubscriptionDialog } from "./add-subscription-dialog";
import { EditSubscriptionDialog } from "./edit-subscription-dialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

interface Subscription {
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

export function SubscriptionList() {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [loading, setLoading] = useState(true);
  const [editSubscription, setEditSubscription] = useState<Subscription | null>(null);

  const fetchSubscriptions = async () => {
    try {
      const data = await getSubscriptions();
      const mapped = data.map((s) => ({
        ...s,
        price: Number(s.price),
        nextPaymentDate: s.nextPaymentDate.toISOString(),
        categoryId: s.categoryId ?? null,
        category: s.category
          ? { id: s.category.id, name: s.category.name, color: s.category.color }
          : null,
      }));
      setSubscriptions(mapped);
    } catch (error) {
      console.error("Failed to fetch subscriptions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSubscriptions();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus langganan ini?")) return;
    try {
      await deleteSubscription(id);
      setSubscriptions(subscriptions.filter((s) => s.id !== id));
    } catch (error) {
      console.error("Failed to delete subscription:", error);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-white">Langganan</h2>
        <AddSubscriptionDialog onCreated={fetchSubscriptions}>
          <Button size="sm" className="bg-indigo-600 text-white hover:bg-indigo-700">
            <Plus className="h-4 w-4 mr-1" />
            Tambah Langganan
          </Button>
        </AddSubscriptionDialog>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 rounded-xl bg-neutral-900 animate-pulse" />
          ))}
        </div>
      ) : subscriptions.length === 0 ? (
        <div className="rounded-xl border border-dashed border-white/10 bg-neutral-900/50 p-12 text-center">
          <p className="text-neutral-500">
            Belum ada langganan. Tambahkan langganan pertamamu!
          </p>
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
          open={!!editSubscription}
          onOpenChange={(open) => !open && setEditSubscription(null)}
          onUpdated={fetchSubscriptions}
        />
      )}
    </div>
  );
}
