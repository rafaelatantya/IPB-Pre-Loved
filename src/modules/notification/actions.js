"use server";

import { getContextDb } from "@/lib/db";
import { notifications } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { getAuth } from "@/lib/auth";

/**
 * Action: Ambil notifikasi user (untuk lonceng notif)
 */
export async function getNotifications() {
  const auth = await getAuth();
  const session = await auth();

  if (!session?.user?.id) return { success: false, code: 401 };

  try {
    const db = await getContextDb();
    const result = await db.query.notifications.findMany({
      where: eq(notifications.userId, session.user.id),
      orderBy: [desc(notifications.createdAt)],
      limit: 20
    });

    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: "Gagal mengambil notifikasi" };
  }
}

/**
 * Action: Tandai notifikasi sudah dibaca
 */
export async function markNotificationAsRead(id) {
  const auth = await getAuth();
  const session = await auth();

  if (!session?.user?.id) return { success: false, code: 401 };

  try {
    const db = await getContextDb();
    await db.update(notifications)
      .set({ isRead: true })
      .where(and(
        eq(notifications.id, id),
        eq(notifications.userId, session.user.id)
      ));
    
    return { success: true };
  } catch (error) {
    return { success: false, error: "Gagal update status" };
  }
}
