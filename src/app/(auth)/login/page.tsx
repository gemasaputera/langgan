import { LoginForm } from "@/components/auth/login-form";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <Link href="/" className="inline-flex items-center gap-2 mb-6">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-lg font-bold text-primary-foreground">
              L
            </div>
          </Link>
          <h1 className="text-3xl font-semibold text-balance text-foreground">Masuk ke Langgan</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Kelola langgananmu dengan mudah
          </p>
        </div>
        <div className="rounded-xl border border-border bg-card p-8">
          <LoginForm />
          <p className="mt-6 text-center text-sm text-muted-foreground">
            Belum punya akun?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Daftar sekarang
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
