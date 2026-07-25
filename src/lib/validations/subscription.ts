import { z } from "zod";

export const subscriptionSchema = z.object({
  name: z
    .string()
    .min(1, "Nama langganan wajib diisi")
    .max(100, "Nama langganan maksimal 100 karakter"),
  price: z.coerce
    .number()
    .positive("Harga harus lebih dari 0")
    .max(9999999999, "Harga terlalu besar"),
  currency: z.string().default("IDR"),
  billingCycle: z.enum(["daily", "weekly", "monthly", "yearly"], {
    error: "Siklus penagihan tidak valid",
  }),
  nextPaymentDate: z.string().min(1, "Tanggal pembayaran berikutnya wajib diisi"),
  categoryId: z.string().optional().nullable(),
  logoUrl: z.string().url("URL tidak valid").optional().nullable(),
  color: z.string().optional().nullable(),
  notes: z.string().max(500, "Catatan maksimal 500 karakter").optional().nullable(),
  isActive: z.boolean().default(true),
});

export type SubscriptionInput = z.infer<typeof subscriptionSchema>;
