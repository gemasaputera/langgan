import { z } from "zod";

export const categorySchema = z.object({
  name: z
    .string()
    .min(1, "Nama kategori wajib diisi")
    .max(50, "Nama kategori maksimal 50 karakter"),
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Format warna tidak valid"),
  icon: z.string().max(50, "Icon maksimal 50 karakter").optional(),
});

export type CategoryInput = z.infer<typeof categorySchema>;
