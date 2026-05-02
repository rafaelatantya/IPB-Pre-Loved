import { getRequestContext } from "@cloudflare/next-on-pages";

/**
 * Utility: Hapus file dari Cloudflare R2
 * @param {string|string[]} keys - Satu atau banyak key R2 yang mau dihapus
 */
export async function deleteFilesFromR2(keys) {
  if (!keys) return;
  const keyList = Array.isArray(keys) ? keys : [keys];
  if (keyList.length === 0) return;

  try {
    const { env } = getRequestContext();
    const bucket = env.bucket;

    if (!bucket) {
      console.error("R2 Bucket binding 'bucket' not found in environment.");
      return;
    }

    // R2 delete works one by one in standard Workers API
    const deletePromises = keyList.map(key => {
      console.log(`[R2 Cleanup] Deleting: ${key}`);
      return bucket.delete(key);
    });

    await Promise.all(deletePromises);
    console.log(`[R2 Cleanup] Successfully deleted ${keyList.length} files.`);
  } catch (error) {
    // Edge case: Kita nggak mau gagalin transaksi DB cuma gara-gara gagal hapus file di R2
    // Tapi kita catat error-nya buat maintenance.
    console.error("R2 Cleanup Error:", error);
  }
}
