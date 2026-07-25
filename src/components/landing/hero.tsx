import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950/30 via-black to-black" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-4 py-1.5 text-sm text-indigo-400">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-indigo-400 opacity-75" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-indigo-500" />
            </span>
            Beta Terbuka — Gratis Selamanya
          </div>

          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl lg:text-7xl">
            Kelola Semua
            <br />
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Langgananmu
            </span>{" "}
            dalam Satu Tempat
          </h1>

          <p className="mt-6 text-lg leading-8 text-neutral-400 sm:text-xl">
            Pantau pengeluaran langganan, dapatkan pengingat pembayaran,
            dan kendalikan keuangan digitalmu dengan mudah.
          </p>

          <div className="mt-10 flex items-center justify-center gap-4">
            <Link href="/register">
              <Button
                size="lg"
                className="bg-indigo-600 text-white hover:bg-indigo-700 px-8 text-base"
              >
                Mulai Gratis
              </Button>
            </Link>
            <Link href="/login">
              <Button
                size="lg"
                variant="outline"
                className="border-white/20 text-white hover:bg-white/10 px-8 text-base"
              >
                Masuk
              </Button>
            </Link>
          </div>

          <p className="mt-4 text-sm text-neutral-500">
            Tidak perlu kartu kredit. Buat akun dalam 30 detik.
          </p>
        </div>

        {/* Dashboard preview */}
        <div className="mt-16 mx-auto max-w-4xl">
          <div className="rounded-2xl border border-white/10 bg-neutral-900/50 p-1 backdrop-blur-sm">
            <div className="rounded-xl bg-neutral-900 p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="h-3 w-3 rounded-full bg-red-500/60" />
                <div className="h-3 w-3 rounded-full bg-yellow-500/60" />
                <div className="h-3 w-3 rounded-full bg-green-500/60" />
                <span className="ml-2 text-xs text-neutral-500">Langgan Dashboard</span>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div className="rounded-lg bg-neutral-800 p-4">
                  <p className="text-xs text-neutral-500">Total Bulanan</p>
                  <p className="text-xl font-bold text-white mt-1">Rp 1.250.000</p>
                </div>
                <div className="rounded-lg bg-neutral-800 p-4">
                  <p className="text-xs text-neutral-500">Langganan Aktif</p>
                  <p className="text-xl font-bold text-white mt-1">12</p>
                </div>
                <div className="rounded-lg bg-neutral-800 p-4">
                  <p className="text-xs text-neutral-500">Pembayaran Mendatang</p>
                  <p className="text-xl font-bold text-white mt-1">3</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
