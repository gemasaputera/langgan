"use client";

import { useAnimateOnView } from "@/hooks/use-animate-on-view";
import { Check, Zap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export function Pricing() {
  const ref = useAnimateOnView(0.1);

  return (
    <section className="py-20 sm:py-28" id="pricing">
      <div
        ref={ref}
        data-animate="paused"
        className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8"
      >
        <div className="text-center">
          <h2
            className="animate-fade-in-up text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance"
            style={{ "--i": "0" } as React.CSSProperties}
          >
            Harga Sederhana
          </h2>
          <p
            className="animate-fade-in-up mt-5 text-lg text-muted-foreground leading-relaxed"
            style={{ "--i": "1" } as React.CSSProperties}
          >
            Mulai gratis. Tidak ada biaya tersembunyi.
          </p>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-2">
          {/* Free tier */}
          <div
            className="animate-fade-in-up relative rounded-xl border border-primary/50 bg-card p-8 transition-shadow hover:shadow-ambient-low"
            style={{ "--i": "2" } as React.CSSProperties}
          >
            <div className="mb-8">
              <h3 className="font-heading text-xl font-bold text-foreground">Gratis</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Untuk individu yang ingin mulai mengelola langganan.
              </p>
            </div>
            <div className="mb-8">
              <span className="text-4xl font-bold text-foreground">Rp 0</span>
              <span className="text-muted-foreground"> / bulan</span>
            </div>
            <ul className="mb-8 space-y-3">
              {[
                "Katalog langganan tanpa batas",
                "Pengingat pembayaran",
                "Analisis pengeluaran bulanan",
                "Kategori langganan",
                "Dukungan email",
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm text-secondary-foreground">
                  <Check className="h-4 w-4 flex-shrink-0 text-primary" />
                  {feature}
                </li>
              ))}
            </ul>
            <Link href="/register" className="block">
              <Button className="min-h-11 w-full transition-transform duration-150 hover:scale-[1.02]">Daftar Gratis</Button>
            </Link>
          </div>

          {/* Premium teaser */}
          <div
            className="animate-fade-in-up relative rounded-xl border border-border bg-card p-8"
            style={{ "--i": "3" } as React.CSSProperties}
          >
            <Badge
              variant="outline"
              className="absolute -top-3 right-6 gap-1.5 border-primary/20 bg-primary/10 px-3 py-1 text-primary"
            >
              <Zap className="h-3 w-3" />
              Segera Hadir
            </Badge>
            <div className="mb-8">
              <h3 className="font-heading text-xl font-bold text-foreground">Premium</h3>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                Fitur lanjutan untuk pengguna yang ingin kontrol lebih.
              </p>
            </div>
            <div className="mb-8">
              <span className="text-4xl font-bold text-foreground">-</span>
            </div>
            <ul className="mb-8 space-y-3">
              {[
                "Semua fitur Gratis",
                "Sinkronisasi keuangan bank",
                "Prediksi pengeluaran AI",
                "Laporan PDF bulanan",
                "Dukungan prioritas",
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm text-secondary-foreground">
                  <Check className="h-4 w-4 flex-shrink-0 text-muted-foreground" />
                  {feature}
                </li>
              ))}
            </ul>
            <Button variant="outline" className="min-h-11 w-full border-border/50 text-muted-foreground" disabled>
              Nantikan
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
