"use server";
import { getContextDb } from "@/lib/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getAuth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

/**
 * Menyelesaikan proses onboarding dengan memilih role dan mengisi nomor WA
 */
export async function completeOnboarding({ role, whatsappNumber }) {
  const auth = await getAuth();
  const session = await auth();

  if (!session?.user?.id) {
    return { success: false, error: "Unauthorized" };
  }

  const userId = session.user.id;

  if (!role || !whatsappNumber) {
    return { success: false, error: "Data tidak lengkap" };
  }

  // Validasi role
  if (!["BUYER", "SELLER"].includes(role)) {
    return { success: false, error: "Role tidak valid" };
  }

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
