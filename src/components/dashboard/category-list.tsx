"use client";

import { useState } from "react";
import { deleteCategory } from "@/lib/actions/categories";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AddCategoryDialog } from "./add-category-dialog";
import { EditCategoryDialog } from "./edit-category-dialog";
import { FolderOpen, Plus, Pencil, Trash2 } from "lucide-react";

export interface Category {
  id: string;
  name: string;
  color: string;
  icon: string | null;
  _count: { subscriptions: number };
}

interface CategoryListProps {
  categories: Category[];
  loading: boolean;
  onRefresh: () => void;
}

export function CategoryList({
  categories,
  loading,
  onRefresh,
}: CategoryListProps) {
  const [editCategory, setEditCategory] = useState<Category | null>(null);
  const [deleteError, setDeleteError] = useState("");

  const handleDelete = async (id: string) => {
    if (!confirm("Hapus kategori ini? Langganan terkait akan dikategorikan ulang.")) {
      return;
    }
    setDeleteError("");
    try {
      await deleteCategory(id);
      onRefresh();
    } catch {
      setDeleteError("Gagal menghapus kategori. Silakan coba lagi.");
    }
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <FolderOpen className="h-5 w-5 text-primary" />
          <CardTitle className="text-foreground">Kategori</CardTitle>
        </div>
        <AddCategoryDialog onCreated={onRefresh}>
          <Button size="sm" className="min-h-11">
            <Plus className="h-4 w-4 mr-1" />
            Tambah
          </Button>
        </AddCategoryDialog>
      </CardHeader>
      <CardContent>
        {deleteError && (
          <p className="text-sm text-destructive mb-4" role="alert" aria-live="polite">
            {deleteError}
          </p>
        )}

        {loading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 rounded-lg bg-muted animate-pulse motion-reduce:animate-none" />
            ))}
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground mb-4">
              Belum ada kategori. Buat kategori pertamamu!
            </p>
            <AddCategoryDialog onCreated={onRefresh}>
              <Button size="sm" className="min-h-11">
                <Plus className="h-4 w-4 mr-1" />
                Tambah Kategori
              </Button>
            </AddCategoryDialog>
          </div>
        ) : (
          <div className="space-y-2">
            {categories.map((category) => (
              <div
                key={category.id}
                className="flex items-center justify-between rounded-lg bg-muted p-3"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className="h-3 w-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: category.color }}
                  />
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{category.name}</p>
                    <p className="text-xs text-muted-foreground">
                      {category._count.subscriptions} langganan
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-1 flex-shrink-0">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-11 w-11 text-muted-foreground hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    onClick={() => setEditCategory(category)}
                    aria-label={`Edit kategori ${category.name}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-11 w-11 text-muted-foreground hover:text-destructive focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    onClick={() => handleDelete(category.id)}
                    aria-label={`Hapus kategori ${category.name}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>

      {editCategory && (
        <EditCategoryDialog
          category={editCategory}
          open={!!editCategory}
          onOpenChange={(open) => !open && setEditCategory(null)}
          onUpdated={onRefresh}
        />
      )}
    </Card>
  );
}
