"use client";

import { useAnimateOnView } from "@/hooks/use-animate-on-view";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  const ref = useAnimateOnView(0.05);

  return (
    <section className="relative overflow-hidden">
      {/* Subtle ambient glow */}
      <div
        className="absolute inset-0 opacity-40"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, var(--primary) 0%, transparent 60%)",
        }}
      />

      <div
        ref={ref}
        data-animate="paused"
        className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <div className="mx-auto max-w-3xl pt-36 pb-24 sm:pt-44 sm:pb-32 lg:pt-52 lg:pb-40 text-center">
          <h1
            className="hero-heading animate-fade-in-up text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl text-balance"
            style={{ letterSpacing: "-0.02em", "--i": "0" } as React.CSSProperties}
          >
            Jangan Lagi Kaget Saat
            <br />
            <span className="accent">Tagihan Langganan</span> Tiba
          </h1>

          <p
            className="animate-fade-in-up mt-8 text-lg leading-8 text-muted-foreground sm:text-xl max-w-2xl mx-auto text-pretty"
            style={{ "--i": "1" } as React.CSSProperties}
          >
            Catat semua langgananmu di satu tempat. Lihat total pengeluaran bulanan,
            dapatkan pengingat jatuh tempo, dan kendalikan keuangan digitalmu.
          </p>

          <div
            className="animate-fade-in-up mt-12 flex flex-col sm:flex-row items-center justify-center gap-4"
            style={{ "--i": "2" } as React.CSSProperties}
          >
            <Link href="/register">
              <Button size="lg" className="min-h-11 px-8 text-base transition-transform duration-150 hover:scale-[1.02]">
                Mulai Gratis
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="min-h-11 border-border/50 text-foreground hover:bg-secondary/50 px-8 text-base transition-transform duration-150 hover:scale-[1.02]"
              >
                Masuk
              </Button>
            </Link>
          </div>

          <p
            className="animate-fade-in mt-6 text-sm text-muted-foreground"
            style={{ "--i": "4" } as React.CSSProperties}
          >
            Tidak perlu kartu kredit. Buat akun dalam 30 detik.
          </p>
        </div>
      </div>
    </section>
  );
}
