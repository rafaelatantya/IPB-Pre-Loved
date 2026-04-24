"use server";
import { getContextDb } from "@/lib/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

import { onboardingSchema } from "@/lib/validation";

/**
 * Menyelesaikan proses onboarding dengan memilih role dan mengisi nomor WA
 */
export async function completeOnboarding({ role, whatsappNumber }) {
  const auth = await getAuth();
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  // Validasi dengan Zod
  const validation = onboardingSchema.safeParse({ role, whatsappNumber });
  if (!validation.success) {
    return { success: false, error: validation.error.errors[0].message };
  }

  const userId = session.user.id;

  try {
    const db = await getContextDb();

    // Pastikan user masih berstatus ONBOARDING atau amankan logicnya
    const existingUser = await db.select().from(users).where(eq(users.id, userId)).get();
    
    if (!existingUser) {
      return { success: false, error: "User tidak ditemukan" };
    }

    // Update user
    await db.update(users)
      .set({
        role: role,
        whatsappNumber: whatsappNumber,
      })
      .where(eq(users.id, userId));

    revalidatePath("/");
    return { success: true };
  } catch (error) {
    console.error("Error in completeOnboarding:", error);
    return { success: false, error: "Gagal menyimpan data onboarding" };
  }
}
