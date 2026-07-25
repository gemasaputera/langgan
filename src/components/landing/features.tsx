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
      "Simpan semua langgananmu di satu tempat. Netflix, Spotify, Spotify, dan lainnya.",
  },
  {
    icon: Bell,
    title: "Pengingat Pembayaran",
    description:
      "Dapatkan notifikasi sebelum jatuh tempo. Tidak pernah lagi terlambat bayar.",
  },
  {
    icon: PieChart,
    title: "Analisis Pengeluaran",
    description:
      "Lihat breakdown pengeluaran langgananmu per kategori dan siklus penagihan.",
  },
  {
    icon: Shield,
    title: "Keamanan Terjamin",
    description:
      "Data tersimpan aman. Kami tidak menyimpan informasi kartu kreditmu.",
  },
  {
    icon: Smartphone,
    title: "Responsif & Modern",
    description:
      "Akses dari perangkat apapun. Desain yang bersih dan mudah digunakan.",
  },
  {
    icon: BarChart3,
    title: "Total Pengeluaran",
    description:
      "Hitung total pengeluaran bulanan dan tahunan secara otomatis dalam Rupiah.",
  },
];

export function Features() {
  return (
    <section className="py-20 sm:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Fitur Lengkap untuk Mengelola
            <br />
            Langgananmu
          </h2>
          <p className="mt-4 text-lg text-neutral-400">
            Semua yang kamu butuhkan untuk mengontrol pengeluaran digital.
          </p>
        </div>

        <div className="mx-auto mt-16 grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <div
              key={feature.title}
              className="group relative rounded-2xl border border-white/10 bg-neutral-900/50 p-6 transition-all hover:border-indigo-500/50 hover:bg-neutral-900"
            >
              <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-indigo-600/10 text-indigo-400 transition-colors group-hover:bg-indigo-600/20">
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-white">{feature.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-400">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
