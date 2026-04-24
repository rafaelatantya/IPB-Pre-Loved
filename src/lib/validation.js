import { z } from "zod";

// Schema untuk Onboarding User
export const onboardingSchema = z.object({
  role: z.enum(["BUYER", "SELLER"]),
  whatsappNumber: z.string().min(10, "Nomor WhatsApp minimal 10 karakter").max(15, "Nomor WhatsApp maksimal 15 karakter"),
});

// Schema untuk Create/Update Produk
export const productSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter").max(100),
  description: z.string().min(10, "Deskripsi minimal 10 karakter"),
  price: z.coerce.number().min(1, "Harga tidak boleh kosong"),
  categoryId: z.string().uuid("Kategori tidak valid"),
  condition: z.enum(["NEW", "LIKE_NEW", "GOOD", "FAIR"]),
  location: z.string().default("IPB Dramaga"),
});

// Schema untuk QC Review
export const qcReviewSchema = z.object({
  productId: z.string().uuid(),
  decision: z.enum(["APPROVED", "REJECTED"]),
  note: z.string().optional(),
});
