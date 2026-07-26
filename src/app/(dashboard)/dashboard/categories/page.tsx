"use client";

import { useState, useEffect, useCallback } from "react";
import { getCategories } from "@/lib/actions/categories";
import { CategoryList } from "@/components/dashboard/category-list";
import { Button } from "@/components/ui/button";
import { AlertCircle, RefreshCw } from "lucide-react";

export default function CategoriesPage() {
  const [categories, setCategories] = useState<{
    id: string;
    name: string;
    color: string;
    icon: string | null;
    _count: { subscriptions: number };
  }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await getCategories();
      setCategories(data as unknown as typeof categories);
    } catch {
      setError("Gagal memuat data. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-semibold text-balance text-foreground">Kategori</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Kelola kategori langgananmu
        </p>
      </div>

      {error && (
        <div
          className="rounded-xl border border-destructive/30 bg-destructive/10 p-4 flex items-center gap-3"
          role="alert"
        >
          <AlertCircle className="h-5 w-5 text-destructive flex-shrink-0" />
          <div className="flex-1">
            <p className="text-sm text-destructive">{error}</p>
          </div>
          <Button
            variant="destructive"
            size="sm"
            onClick={fetchData}
            className="flex items-center gap-1 min-h-11"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Coba Lagi
          </Button>
        </div>
      )}

      <div className="max-w-2xl">
        <CategoryList
          categories={categories}
          loading={loading}
          onRefresh={fetchData}
        />
      </div>
    </div>
  );
}
