"use client";

import { useAnimateOnView } from "@/hooks/use-animate-on-view";

export function Footer() {
  const ref = useAnimateOnView(0.2);

  return (
    <footer className="border-t border-border py-12">
      <div
        ref={ref}
        data-animate="paused"
        className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
      >
        <div className="animate-fade-in-up flex flex-col items-center justify-between gap-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-xs font-bold text-primary-foreground">
              L
            </div>
            <span className="font-bold text-foreground">Langgan</span>
          </div>
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Langgan. Hak cipta dilindungi.
          </p>
        </div>
      </div>
    </footer>
  );
}
