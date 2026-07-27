"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GoogleLoginButton } from "@/components/auth/google-login-button";
import Link from "next/link";

export function RegisterForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (password !== confirmPassword) {
      setError("Kata sandi tidak cocok");
      return;
    }

    if (password.length < 8) {
      setError("Kata sandi minimal 8 karakter");
      return;
    }

    setLoading(true);

    try {
      const { error: authError } = await authClient.signUp.email({
        name,
        email,
        password,
      });

      if (authError) {
        const msg = authError.message || "";
        if (
          msg.toLowerCase().includes("already") ||
          msg.toLowerCase().includes("exist")
        ) {
          setError(
            "Email sudah terdaftar. Silakan masuk dengan akun yang sudah ada."
          );
        } else {
          setError(msg || "Gagal membuat akun");
        }
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch {
      setError("Terjadi kesalahan. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <GoogleLoginButton mode="register" />
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-card px-2 text-muted-foreground">atau</span>
        </div>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name" className="text-secondary-foreground">
          Nama
        </Label>
        <Input
          id="name"
          type="text"
          placeholder="Nama lengkap"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          className="text-foreground placeholder:text-muted-foreground"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="email" className="text-secondary-foreground">
          Email
        </Label>
        <Input
          id="email"
          type="email"
          placeholder="email@contoh.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="text-foreground placeholder:text-muted-foreground"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password" className="text-secondary-foreground">
          Kata Sandi
        </Label>
        <Input
          id="password"
          type="password"
          placeholder="Minimal 8 karakter"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="text-foreground placeholder:text-muted-foreground"
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword" className="text-secondary-foreground">
          Konfirmasi Kata Sandi
        </Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="Ulangi kata sandi"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          className="text-foreground placeholder:text-muted-foreground"
        />
      </div>
      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
          {error.includes("sudah terdaftar") && (
            <>
              {" "}
              <Link href="/login" className="underline">
                Masuk di sini
              </Link>
            </>
          )}
        </p>
      )}
      <Button
        type="submit"
        className="min-h-11 w-full"
        disabled={loading}
      >
        {loading ? "Membuat akun..." : "Daftar"}
      </Button>
      </form>
    </div>
  );
}
