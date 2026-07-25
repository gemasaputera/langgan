"use client";

import { useState, useEffect } from "react";
import { createSubscription } from "@/lib/actions/subscriptions";
import { getCategories } from "@/lib/actions/categories";
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
}

export function AddSubscriptionDialog({ children, onCreated }: AddSubscriptionDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [billingCycle, setBillingCycle] = useState("monthly");
  const [nextPaymentDate, setNextPaymentDate] = useState("");
  const [categoryId, setCategoryId] = useState<string>("");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [categories, setCategories] = useState<{ id: string; name: string; color: string }[]>([]);

  useEffect(() => {
    if (open) {
      getCategories().then(setCategories).catch(console.error);
    }
  }, [open]);

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
      <DialogTrigger render={<span />}>{children}</DialogTrigger>
      <DialogContent className="bg-neutral-900 border-white/10 text-white max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Tambah Langganan</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-neutral-300">
              Nama Langganan
            </Label>
            <Input
              id="name"
              placeholder="Contoh: Netflix, Spotify"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="bg-neutral-800 border-white/10 text-white placeholder:text-neutral-500"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="price" className="text-neutral-300">
              Harga (IDR)
            </Label>
            <Input
              id="price"
              type="number"
              placeholder="Contoh: 54000"
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
            <Label htmlFor="nextPaymentDate" className="text-neutral-300">
              Pembayaran Berikutnya
            </Label>
            <Input
              id="nextPaymentDate"
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
            <Label htmlFor="notes" className="text-neutral-300">
              Catatan (Opsional)
            </Label>
            <Input
              id="notes"
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
            {loading ? "Menyimpan..." : "Simpan"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
