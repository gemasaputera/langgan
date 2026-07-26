"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const { error: authError } = await authClient.signIn.email({
        email,
        password,
      });

      if (authError) {
        setError(authError.message || "Email atau kata sandi salah");
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
    <form onSubmit={handleSubmit} className="space-y-4">
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
      {error && (
        <p className="text-sm text-destructive" role="alert">{error}</p>
      )}
      <Button
        type="submit"
        className="min-h-11 w-full"
        disabled={loading}
      >
        {loading ? "Masuk..." : "Masuk"}
      </Button>
    </form>
  );
}
