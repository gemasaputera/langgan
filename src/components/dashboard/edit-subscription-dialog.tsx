"use client";

import { useState, useEffect } from "react";
import { updateSubscription } from "@/lib/actions/subscriptions";
import { getCategories } from "@/lib/actions/categories";
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
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onUpdated: () => void;
}

export function EditSubscriptionDialog({
  subscription,
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
  const [categories, setCategories] = useState<{ id: string; name: string; color: string }[]>([]);

  useEffect(() => {
    if (open) {
      setName(subscription.name);
      setPrice(subscription.price);
      setBillingCycle(subscription.billingCycle);
      setNextPaymentDate(subscription.nextPaymentDate.split("T")[0]);
      setCategoryId(subscription.categoryId || "");
      setNotes(subscription.notes || "");
      getCategories().then(setCategories).catch(console.error);
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
      <DialogContent className="bg-neutral-900 border-white/10 text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Langganan</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name" className="text-neutral-300">
              Nama Langganan
            </Label>
            <Input
              id="edit-name"
              placeholder="Nama langganan"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-neutral-800 border-white/10 text-white placeholder:text-neutral-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-price" className="text-neutral-300">
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
              className="bg-neutral-800 border-white/10 text-white placeholder:text-neutral-500"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-neutral-300">Siklus Penagihan</Label>
            <Select value={billingCycle} onValueChange={(v) => setBillingCycle(v ?? "monthly")}>
              <SelectTrigger className="bg-neutral-800 border-white/10 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-neutral-800 border-white/10">
                <SelectItem value="daily">Harian</SelectItem>
                <SelectItem value="weekly">Mingguan</SelectItem>
                <SelectItem value="monthly">Bulanan</SelectItem>
                <SelectItem value="yearly">Tahunan</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-date" className="text-neutral-300">
              Pembayaran Berikutnya
            </Label>
            <Input
              id="edit-date"
              type="date"
              value={nextPaymentDate}
              onChange={(e) => setNextPaymentDate(e.target.value)}
              required
              className="bg-neutral-800 border-white/10 text-white"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-neutral-300">Kategori (Opsional)</Label>
            <Select value={categoryId} onValueChange={(v) => setCategoryId(v ?? "")}>
              <SelectTrigger className="bg-neutral-800 border-white/10 text-white">
                <SelectValue placeholder="Pilih kategori" />
              </SelectTrigger>
              <SelectContent className="bg-neutral-800 border-white/10">
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-notes" className="text-neutral-300">
              Catatan (Opsional)
            </Label>
            <Input
              id="edit-notes"
              placeholder="Catatan tambahan"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-neutral-800 border-white/10 text-white placeholder:text-neutral-500"
            />
          </div>
          {error && <p className="text-sm text-red-400">{error}</p>}
          <Button
            type="submit"
            className="w-full bg-indigo-600 text-white hover:bg-indigo-700"
            disabled={loading}
          >
            {loading ? "Menyimpan..." : "Perbarui"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
