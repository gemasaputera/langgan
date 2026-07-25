"use client";

import { CategoryList } from "@/components/dashboard/category-list";

export default function CategoriesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white">Kategori</h1>
        <p className="mt-1 text-sm text-neutral-400">
          Kelola kategori langgananmu
        </p>
      </div>

      <div className="max-w-2xl">
        <CategoryList />
      </div>
    </div>
  );
}
