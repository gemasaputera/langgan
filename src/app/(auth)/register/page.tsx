import { RegisterForm } from "@/components/auth/register-form";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600 text-lg font-bold text-white">
              L
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-white">Buat Akun Langgan</h1>
          <p className="mt-2 text-sm text-neutral-400">
            Mulai kelola langgananmu dalam 30 detik
          </p>
        </div>
        <div className="rounded-2xl border border-white/10 bg-neutral-900 p-8">
          <RegisterForm />
          <p className="mt-6 text-center text-sm text-neutral-400">
            Sudah punya akun?{" "}
            <Link href="/login" className="text-indigo-400 hover:text-indigo-300">
              Masuk
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
