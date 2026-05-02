"use server";

import { getContextDb } from "@/lib/db";
import { notifications } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";

/**
 * Action: Kirim Notifikasi ke User
 */
export async function createNotification({ userId, title, message, type = "INFO" }) {
  try {
    const db = await getContextDb();
    const id = crypto.randomUUID();

    await db.insert(notifications).values({
      id,
      userId,
      title,
      message,
      type,
    }).run();

    return { success: true, id };
  } catch (error) {
    console.error("Failed to create notification:", error);
    return { success: false, error: "Gagal mengirim notifikasi" };
  }
}

/**
 * Action: Ambil Notifikasi User
 */
export async function getUserNotifications(userId) {
  try {
    const db = await getContextDb();
    const result = await db.query.notifications.findMany({
      where: eq(notifications.userId, userId),
      orderBy: [desc(notifications.createdAt)],
      limit: 20
    });
    return { success: true, data: result };
  } catch (error) {
    return { success: false, error: "Gagal mengambil notifikasi" };
  }
}

/**
 * Action: Tandai Notifikasi sudah dibaca
 */
export async function markAsRead(notificationId) {
  try {
    const db = await getContextDb();
    await db.update(notifications)
      .set({ isRead: true })
      .where(eq(notifications.id, notificationId))
      .run();
    return { success: true };
  } catch (error) {
    return { success: false, error: "Gagal mengupdate notifikasi" };
  }
}
