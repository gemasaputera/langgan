import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function Pricing() {
  return (
    <section className="py-20 sm:py-28" id="pricing">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Harga Sederhana
          </h2>
          <p className="mt-4 text-lg text-neutral-400">
            Mulai gratis. Tingkatkan kapan saja.
          </p>
        </div>

        <div className="mx-auto mt-16 max-w-md">
          <div className="relative rounded-2xl border border-indigo-500/50 bg-neutral-900 p-8">
            <div className="mb-6">
              <h3 className="text-xl font-bold text-white">Gratis</h3>
              <p className="mt-2 text-sm text-neutral-400">
                Cocok untuk individu yang ingin mulai mengelola langganan.
              </p>
            </div>
            <div className="mb-8">
              <span className="text-4xl font-bold text-white">Rp 0</span>
              <span className="text-neutral-400"> / bulan</span>
            </div>
            <ul className="mb-8 space-y-3">
              {[
                "Katalog langganan tanpa batas",
                "Pengingat pembayaran",
                "Analisis pengeluaran bulanan",
                "Kategori langganan",
                "Dukungan email",
              ].map((feature) => (
                <li key={feature} className="flex items-center gap-3 text-sm text-neutral-300">
                  <Check className="h-4 w-4 flex-shrink-0 text-indigo-400" />
                  {feature}
                </li>
              ))}
            </ul>
            <Link href="/register" className="block">
              <Button className="w-full bg-indigo-600 text-white hover:bg-indigo-700">
                Daftar Gratis
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
