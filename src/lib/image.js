/**
 * 🖼️ Frontend Image Compression Utility
 * Target: 12MP (max 4032px long side), WebP format, Optimized Quality.
 */

// NOTE: Disarankan menggunakan library 'browser-image-compression' 
// npm install browser-image-compression

/*
// CONTOH IMPLEMENTASI DI FRONTEND:

import imageCompression from 'browser-image-compression';

export async function compressImage(file) {
  const options = {
    maxSizeMB: 1,            // Target ukuran file di bawah 1MB
    maxWidthOrHeight: 4032,  // Batas 12MP (resolusi standard iPhone/Android)
    useWebWorker: true,
    fileType: 'image/webp',  // Konversi ke WebP buat efisiensi maksimal
    initialQuality: 0.8,     // Kualitas 80% (Sweet spot antara size & detail)
  };

  try {
    const compressedFile = await imageCompression(file, options);
    return compressedFile;
  } catch (error) {
    console.error("Gagal kompresi gambar:", error);
    return file; // Fallback ke original jika gagal
  }
}
*/

/**
 * Utility: Cek Resolusi Gambar (Helper UI)
 */
export async function getImageResolution(file) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      resolve({ width: img.width, height: img.height, megapixels: (img.width * img.height) / 1000000 });
    };
    img.src = URL.createObjectURL(file);
  });
}
