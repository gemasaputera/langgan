"use client";

import { useAnimateOnView } from "@/hooks/use-animate-on-view";
import {
  CreditCard,
  Bell,
  PieChart,
  Shield,
  Smartphone,
  BarChart3,
} from "lucide-react";

const features = [
  {
    icon: CreditCard,
    title: "Katalog Langganan",
    description:
      "Simpan semua langgananmu di satu tempat. Netflix, Spotify, Disney+, dan lainnya.",
    span: "lg:col-span-2 lg:row-span-2",
    size: "large" as const,
    i: 0,
  },
  {
    icon: Bell,
    title: "Pengingat Pembayaran",
    description:
      "Dapatkan notifikasi sebelum jatuh tempo. Tidak pernah lagi terlambat bayar.",
    span: "lg:col-span-2",
    size: "medium" as const,
    i: 1,
  },
  {
    icon: PieChart,
    title: "Analisis Pengeluaran",
    description:
      "Lihat breakdown pengeluaran langgananmu per kategori dan siklus penagihan.",
    span: "lg:col-span-2",
    size: "medium" as const,
    i: 2,
  },
  {
    icon: Shield,
    title: "Keamanan Terjamin",
    description:
      "Data tersimpan aman. Kami tidak menyimpan informasi kartu kreditmu.",
    span: "lg:col-span-1",
    size: "small" as const,
    i: 3,
  },
  {
    icon: Smartphone,
    title: "Responsif & Modern",
    description:
      "Akses dari perangkat apapun. Desain yang bersih dan mudah digunakan.",
    span: "lg:col-span-1",
    size: "small" as const,
    i: 4,
  },
  {
    icon: BarChart3,
    title: "Total Pengeluaran",
    description:
      "Hitung total pengeluaran bulanan dan tahunan secara otomatis dalam Rupiah.",
    span: "lg:col-span-2",
    size: "medium" as const,
    i: 5,
  },
];

export function Features() {
  const ref = useAnimateOnView(0.08);

  return (
    <section className="py-24 sm:py-32">
      <div
        ref={ref}
        data-animate="paused"
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <div className="max-w-2xl">
          <h2
            className="animate-fade-in-up text-3xl font-bold tracking-tight text-foreground sm:text-4xl text-balance"
            style={{ "--i": "0" } as React.CSSProperties}
          >
            Semua yang kamu butuhkan
          </h2>
          <p
            className="animate-fade-in-up mt-5 text-lg text-muted-foreground leading-relaxed text-pretty"
            style={{ "--i": "1" } as React.CSSProperties}
          >
            Mengelola langganan seharusnya tidak rumit. Langgan menyederhanakan
            semuanya dalam beberapa ketukan.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const isLarge = feature.size === "large";
            const isSmall = feature.size === "small";

            return (
              <div
                key={feature.title}
                className={`animate-fade-in-up group relative rounded-xl border border-border bg-card transition-all hover:border-primary/40 hover:shadow-ambient-low ${feature.span} ${
                  isLarge ? "p-8" : isSmall ? "p-5" : "p-6"
                }`}
                style={{ "--i": String(feature.i + 2) } as React.CSSProperties}
              >
                <div
                  className={`mb-4 flex items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary/20 ${
                    isLarge ? "h-14 w-14" : isSmall ? "h-10 w-10" : "h-12 w-12"
                  }`}
                >
                  <feature.icon className={isLarge ? "h-7 w-7" : isSmall ? "h-5 w-5" : "h-6 w-6"} />
                </div>
                <h3
                  className={`font-heading font-semibold text-foreground ${
                    isLarge ? "text-xl" : "text-lg"
                  }`}
                >
                  {feature.title}
                </h3>
                <p
                  className={`mt-2 leading-relaxed text-muted-foreground ${
                    isLarge ? "text-base" : "text-sm"
                  }`}
                >
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
