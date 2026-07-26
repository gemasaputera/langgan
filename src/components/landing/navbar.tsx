"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-40 border-b border-border bg-background/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 transition-opacity duration-200 hover:opacity-80">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
            L
          </div>
          <span className="text-xl font-bold text-foreground">Langgan</span>
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/login">
            <Button variant="ghost" className="min-h-11 text-foreground hover:text-foreground hover:bg-secondary/50 transition-colors duration-150">
              Masuk
            </Button>
          </Link>
          <Link href="/register">
            <Button className="min-h-11 transition-transform duration-150 hover:scale-[1.02]">
              Daftar Gratis
            </Button>
          </Link>
        </div>
      </div>
    </nav>
  );
}
