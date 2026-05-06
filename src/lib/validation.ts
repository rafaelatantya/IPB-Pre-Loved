import { z } from "zod";

// Schema untuk Onboarding User
export const onboardingSchema = z.object({
  role: z.string().refine(v => ["BUYER", "SELLER"].includes(v)),
  whatsappNumber: z.string().optional().or(z.literal("")),
}).refine((data) => {
  if (data.role === "SELLER") {
    return data.whatsappNumber && data.whatsappNumber.length >= 10 && data.whatsappNumber.length <= 15;
  }
  return true;
}, {
  message: "Nomor WhatsApp wajib diisi (10-15 karakter) untuk Penjual",
  path: ["whatsappNumber"],
});

// Schema untuk Create/Update Produk
export const productSchema = z.object({
  title: z.string()
    .min(3, "Nama barang minimal 3 karakter")
    .max(100, "Nama barang terlalu panjang (maks 100)"),
  description: z.string()
    .min(10, "Berikan deskripsi yang lebih jelas (min 10 karakter)")
    .max(1000, "Deskripsi terlalu panjang"),
  price: z.coerce.number()
    .min(500, "Harga minimal adalah Rp 500")
    .max(1000000000, "Harga tidak masuk akal (maks 1 miliar)"),
  categoryId: z.string().min(1, "Silakan pilih kategori yang valid"),
  condition: z.string().refine(v => ["NEW", "LIKE_NEW", "GOOD", "FAIR"].includes(v), {
    message: "Pilih kondisi barang yang sesuai"
  }),
  location: z.string().min(3, "Lokasi pengambilan harus jelas").default("IPB Dramaga"),
  // Info Media (diisi dari backend setelah hitung file)
  imageCount: z.number().min(0),
  hasVideo: z.boolean().default(false),
  videoDuration: z.number().optional(),
}).refine((data) => {
  // ATURAN SAKLEK: 3 Foto ATAU (1 Foto + 1 Video min 5 detik)
  const caseA = data.imageCount >= 3;
  const caseB = data.imageCount >= 1 && data.hasVideo && (data.videoDuration || 0) >= 5;
  
  return caseA || caseB;
}, {
  message: "Syarat media tidak terpenuhi: Minimal 3 Foto ATAU 1 Foto + 1 Video (min 5 detik)",
  path: ["imageCount"]
});

// Schema untuk QC Review
export const qcReviewSchema = z.object({
  productId: z.string().uuid(),
  decision: z.string().refine(v => ["APPROVED", "REJECTED"].includes(v)),
  reasonCode: z.string().optional().nullable(),
  note: z.string().optional(),
});
