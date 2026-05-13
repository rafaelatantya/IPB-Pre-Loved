"use server";

import { getContextDb } from "@/lib/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getAuth } from "@/lib/auth";
import { onboardingSchema } from "@/lib/validation";
import { revalidatePath } from "next/cache";

/**
 * Format nomor telepon secara otomatis ke format +62
 */
function formatPhoneNumber(phone) {
  if (!phone) return "";
  let clean = phone.replace(/[^0-9+]/g, "");
  if (clean.startsWith("0")) {
    clean = "+62" + clean.substring(1);
  } else if (clean.startsWith("62")) {
    clean = "+" + clean;
  } else if (!clean.startsWith("+62") && clean.length > 0) {
    clean = "+62" + clean.replace(/\+/g, "");
  }
  return clean;
}

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

  // Validasi & Format nomor WA
  const formattedNumber = formatPhoneNumber(whatsappNumber);
  if (!formattedNumber || formattedNumber.length < 10 || formattedNumber.length > 16) {
    return { success: false, error: "Nomor WhatsApp tidak valid (min 10 karakter)" };
  }

    try {
    const db = await getContextDb();
    await db.update(users)
      .set({ 
        whatsappNumber: formattedNumber,
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

    let finalWhatsappNumber = null;

    // Jika nomor WA dikirim, format dan validasi
    if (whatsappNumber) {
        finalWhatsappNumber = formatPhoneNumber(whatsappNumber);
        if (finalWhatsappNumber.length < 10 || finalWhatsappNumber.length > 16) {
            return { success: false, error: "Nomor WhatsApp tidak valid (min 10 karakter)" };
        }
    } else {
        // Jika tidak dikirim, cek apakah sudah ada
        if (!user.whatsappNumber) {
            return { success: false, code: "NEED_WHATSAPP", error: "Nomor WhatsApp diperlukan untuk menjadi Penjual" };
        }
    }

    // Update Role menjadi SELLER
    const updateData: any = { 
      role: "SELLER",
      updatedAt: new Date().getTime()
    };
    if (finalWhatsappNumber) updateData.whatsappNumber = finalWhatsappNumber;

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
