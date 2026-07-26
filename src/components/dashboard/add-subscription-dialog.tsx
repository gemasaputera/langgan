"use client";

import { useState, useEffect } from "react";
import { createSubscription } from "@/lib/actions/subscriptions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface AddSubscriptionDialogProps {
  children: React.ReactNode;
  onCreated: () => void;
  categories: { id: string; name: string; color: string }[];
}

export function AddSubscriptionDialog({ children, onCreated, categories }: AddSubscriptionDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [nextPaymentDate, setNextPaymentDate] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await createSubscription({
        name,
        price: parseFloat(price),
        billingCycle: billingCycle as "daily" | "weekly" | "monthly" | "yearly",
        nextPaymentDate,
        categoryId: categoryId || null,
        notes: notes || null,
        currency: "IDR",
        isActive: true,
      });
      setOpen(false);
      setName("");
      setPrice("");
      setBillingCycle("monthly");
      setNextPaymentDate("");
      setCategoryId("");
      setNotes("");
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal membuat langganan");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<span />} nativeButton={false}>
        {children}
      </DialogTrigger>
      <DialogContent className="bg-popover border-border text-popover-foreground max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tambah Langganan</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-secondary-foreground">
              Nama Langganan
            </Label>
            <Input
              id="name"
              placeholder="Misal: Netflix, Spotify"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={100}
              className="bg-muted border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price" className="text-secondary-foreground">
              Harga (IDR)
            </Label>
            <Input
              id="price"
              type="number"
              placeholder="Harga per siklus"
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
            <Label htmlFor="nextPaymentDate" className="text-secondary-foreground">
              Pembayaran Berikutnya
            </Label>
            <Input
              id="nextPaymentDate"
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
            <Label htmlFor="notes" className="text-secondary-foreground">
              Catatan (Opsional)
            </Label>
            <Input
              id="notes"
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
            {loading ? "Menyimpan..." : "Simpan"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
