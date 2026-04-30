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

  if (!session?.user?.email) {
    console.error("ONBOARDING ERROR: No session or email found");
    return { success: false, error: "Unauthorized" };
  }

  // Validasi dengan Zod
  const validation = onboardingSchema.safeParse({ role, whatsappNumber });
  if (!validation.success) {
    return { success: false, error: validation.error.errors[0].message };
  }

  const userEmail = session.user.email;

  try {
    const db = await getContextDb();
    console.log(`ONBOARDING ATTEMPT: ${userEmail} -> ${role}`);

    // Update user menggunakan email sebagai identifier yang paling stabil
    const result = await db.update(users)
      .set({
        role: role,
        whatsappNumber: whatsappNumber || "",
      })
      .where(eq(users.email, userEmail));
    
    console.log("ONBOARDING SUCCESS: Database updated");

    // revalidatePath("/"); // DIMATIKAN SEMENTARA: Sering bikin crash di Cloudflare Pages Dev (Internal DNS Error)
    return { success: true };
  } catch (error) {
    console.error("ONBOARDING CRITICAL ERROR:", error);
    return { success: false, error: "Gagal menyimpan data onboarding" };
  }
}
