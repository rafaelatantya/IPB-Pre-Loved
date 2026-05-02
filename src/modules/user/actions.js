"use server";

import { getContextDb } from "@/lib/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getAuth } from "@/lib/auth";
import { onboardingSchema } from "@/lib/validation";
import { revalidatePath } from "next/cache";

/**
 * Action: Ambil profil user yang sedang login
 */
export async function getUserProfile() {
  const auth = await getAuth();
  const session = await auth();

  if (!session?.user?.email) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const db = await getContextDb();
    const user = await db.select().from(users).where(eq(users.email, session.user.email)).get();

    return { success: true, data: user };
  } catch (error) {
    return { success: false, error: "Gagal mengambil profil" };
  }
}

/**
 * Action: Update profil (Nomor WhatsApp)
 */
export async function updateSellerProfile({ whatsappNumber }) {
  const auth = await getAuth();
  const session = await auth();

  if (!session?.user?.email) {
    return { success: false, error: "Unauthorized" };
  }

  // Validasi format nomor WA
  if (!whatsappNumber || whatsappNumber.length < 10 || whatsappNumber.length > 15) {
    return { success: false, error: "Nomor WhatsApp tidak valid (10-15 karakter)" };
  }

    try {
    const db = await getContextDb();
    await db.update(users)
      .set({ 
        whatsappNumber,
        updatedAt: new Date().getTime()
      })
      .where(eq(users.email, session.user.email))
      .run();
    
    revalidatePath("/seller/settings");
    return { success: true, message: "Profil berhasil diperbarui!" };
  } catch (error) {
    return { success: false, error: "Gagal memperbarui profil: " + error.message };
  }
}

/**
 * Action: Upgrade Buyer menjadi Seller
 */
export async function upgradeToSeller(whatsappNumber = null) {
  const auth = await getAuth();
  const session = await auth();

  if (!session?.user?.email) {
    return { success: false, error: "Unauthorized" };
  }

  const userEmail = session.user.email;

  try {
    const db = await getContextDb();
    
    // Ambil data user saat ini
    const user = await db.select().from(users).where(eq(users.email, userEmail)).get();
    
    if (!user) {
      return { success: false, error: "Data user tidak ditemukan di database." };
    }

    // Jika nomor WA dikirim, validasi
    if (whatsappNumber) {
        if (whatsappNumber.length < 10 || whatsappNumber.length > 15) {
            return { success: false, error: "Nomor WhatsApp tidak valid (10-15 karakter)" };
        }
    } else {
        // Jika tidak dikirim, cek apakah sudah ada
        if (!user.whatsappNumber) {
            return { success: false, code: "NEED_WHATSAPP", error: "Nomor WhatsApp diperlukan untuk menjadi Penjual" };
        }
    }

    // Update Role menjadi SELLER
    const updateData = { 
      role: "SELLER",
      updatedAt: new Date().getTime()
    };
    if (whatsappNumber) updateData.whatsappNumber = whatsappNumber;

    await db.update(users)
      .set(updateData)
      .where(eq(users.email, userEmail))
      .run();

    // revalidatePath("/"); // DIMATIKAN SEMENTARA: Sering bikin crash di Cloudflare Pages Dev (Internal DNS Error)
    return { success: true, message: "Selamat! Anda sekarang adalah SELLER." };
  } catch (error) {
    console.error("[UPGRADE ERROR]:", error);
    return { success: false, error: "Terjadi kesalahan pada server: " + error.message };
  }
}
