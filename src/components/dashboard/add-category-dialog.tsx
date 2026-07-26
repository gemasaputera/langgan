"use client";

import { useState } from "react";
import { createCategory } from "@/lib/actions/categories";
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

interface AddCategoryDialogProps {
  children: React.ReactNode;
  onCreated: () => void;
}

const COLORS = [
  "#6366f1", "#8b5cf6", "#ec4899", "#ef4444", "#f97316",
  "#eab308", "#22c55e", "#14b8a6", "#06b6d4", "#3b82f6",
];

export function AddCategoryDialog({ children, onCreated }: AddCategoryDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [color, setColor] = useState("#6366f1");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await createCategory({ name, color });
      setOpen(false);
      setName("");
      setColor("#6366f1");
      onCreated();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal membuat kategori");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={<span />} nativeButton={false}>
        {children}
      </DialogTrigger>
      <DialogContent className="bg-popover border-border text-popover-foreground">
        <DialogHeader>
          <DialogTitle>Tambah Kategori</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-secondary-foreground">
              Nama Kategori
            </Label>
            <Input
              id="name"
              placeholder="Contoh: Streaming, Musik, Produktivitas"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              maxLength={50}
              className="bg-muted border-border text-foreground placeholder:text-muted-foreground"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-secondary-foreground">Warna</Label>
            <div className="flex flex-wrap gap-2">
              {COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  className={`h-8 w-8 rounded-full transition-transform focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
                    color === c ? "scale-125 ring-2 ring-foreground" : ""
                  }`}
                  style={{ backgroundColor: c }}
                  onClick={() => setColor(c)}
                  aria-label={`Pilih warna ${c}`}
                  aria-pressed={color === c}
                />
              ))}
            </div>
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
