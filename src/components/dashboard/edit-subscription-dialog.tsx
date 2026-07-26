"use client";

import { useState, useEffect } from "react";
import { updateSubscription } from "@/lib/actions/subscriptions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface EditSubscriptionDialogProps {
  subscription: {
    id: string;
    name: string;
    price: string;
    billingCycle: string;
    nextPaymentDate: string;
    categoryId: string | null;
    notes: string | null;
  };
  categories: { id: string; name: string; color: string }[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated: () => void;
}

export function EditSubscriptionDialog({
  subscription,
  categories,
  open,
  onOpenChange,
  onUpdated,
}: EditSubscriptionDialogProps) {
  const [name, setName] = useState(subscription.name);
  const [price, setPrice] = useState(subscription.price);
  const [billingCycle, setBillingCycle] = useState(subscription.billingCycle);
  const [nextPaymentDate, setNextPaymentDate] = useState(subscription.nextPaymentDate.split("T")[0]);
  const [categoryId, setCategoryId] = useState(subscription.categoryId || "");
  const [notes, setNotes] = useState(subscription.notes || "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      setName(subscription.name);
      setPrice(subscription.price);
      setBillingCycle(subscription.billingCycle);
      setNextPaymentDate(subscription.nextPaymentDate.split("T")[0]);
      setCategoryId(subscription.categoryId || "");
      setNotes(subscription.notes || "");
    }
  }, [open, subscription]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await updateSubscription(subscription.id, {
        name,
        price: parseFloat(price),
        billingCycle: billingCycle as "daily" | "weekly" | "monthly" | "yearly",
        nextPaymentDate,
        categoryId: categoryId || null,
        notes: notes || null,
        currency: "IDR",
        isActive: true,
      });
      onOpenChange(false);
      onUpdated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memperbarui langganan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-popover border-border text-popover-foreground max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Langganan</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name" className="text-secondary-foreground">
              Nama Langganan
            </Label>
            <Input
              id="edit-name"
              placeholder="Nama langganan"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={100}
              className="bg-muted border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-price" className="text-secondary-foreground">
              Harga (IDR)
            </Label>
            <Input
              id="edit-price"
              type="number"
              placeholder="Harga"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              required
              min="0"
              step="1000"
              className="bg-muted border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-secondary-foreground">Siklus Penagihan</Label>
            <Select value={billingCycle} onValueChange={(v) => setBillingCycle(v ?? "monthly")}>
              <SelectTrigger className="bg-muted border-border text-foreground">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-muted border-border">
                <SelectItem value="daily">Harian</SelectItem>
                <SelectItem value="weekly">Mingguan</SelectItem>
                <SelectItem value="monthly">Bulanan</SelectItem>
                <SelectItem value="yearly">Tahunan</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-date" className="text-secondary-foreground">
              Pembayaran Berikutnya
            </Label>
            <Input
              id="edit-date"
              type="date"
              value={nextPaymentDate}
              onChange={(e) => setNextPaymentDate(e.target.value)}
              required
              className="bg-muted border-border text-foreground"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-secondary-foreground">Kategori (Opsional)</Label>
            <Select value={categoryId} onValueChange={(v) => setCategoryId(v ?? "")}>
              <SelectTrigger className="bg-muted border-border text-foreground">
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent className="bg-muted border-border">
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-notes" className="text-secondary-foreground">
              Catatan (Opsional)
            </Label>
            <Input
              id="edit-notes"
              placeholder="Catatan tambahan"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              maxLength={500}
              className="bg-muted border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>
          {error && (
            <p className="text-sm text-destructive" aria-live="polite" role="alert">
              {error}
            </p>
          )}
          <Button
            type="submit"
            className="w-full"
            disabled={loading}
          >
            {loading ? "Menyimpan..." : "Perbarui"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
