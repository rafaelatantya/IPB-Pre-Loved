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

  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const db = await getContextDb();
    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id)
    });

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

  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  // Validasi format nomor WA (pake schema onboarding yg udah ada)
  if (!whatsappNumber || whatsappNumber.length < 10) {
    return { success: false, error: "Nomor WhatsApp tidak valid" };
  }

  try {
    const db = await getContextDb();
    await db.update(users)
      .set({ whatsappNumber })
      .where(eq(users.id, session.user.id));
    
    revalidatePath("/seller/settings");
    return { success: true, message: "Profil berhasil diperbarui!" };
  } catch (error) {
    return { success: false, error: "Gagal memperbarui profil: " + error.message };
  }
}
