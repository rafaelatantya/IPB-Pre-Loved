import imageCompression from 'browser-image-compression';

/**
 * 🖼️ Action: Kompres Gambar (Client-Side)
 * Target: Max 1MB, Max 4032px (12MP), Format WebP.
 * @param {File} file - File gambar mentah dari input
 * @returns {Promise<File>} - File gambar hasil kompresi (WebP)
 */
export async function compressImage(file) {
  // 🛡️ Edge Case 1: Cek tipe file. Cuma hajar JPEG, PNG, WEBP.
  // GIF dan SVG kita bypass biar nggak rusak (animasi/vektor).
  const supportedTypes = ['image/jpeg', 'image/png', 'image/webp'];
  if (!supportedTypes.includes(file.type)) {
    console.log(`[Image Compression] Bypassing unsupported type: ${file.type}`);
    return file;
  }

  // 🛡️ Edge Case 2: Jangan kompres kalau filenya udah kecil (misal < 100KB)
  if (file.size < 100 * 1024) {
    return file;
  }

  const options = {
    maxSizeMB: 1,            // Target ukuran file di bawah 1MB
    maxWidthOrHeight: 4032,  // Batas resolusi 12MP (standard iPhone/Android)
    useWebWorker: true,      // Pakai background thread biar UI nggak freeze
    fileType: 'image/webp',  // Konversi paksa ke WebP biar super efisien
    initialQuality: 0.8,     // Kualitas 80% (Sweet spot size vs detail)
    preserveExif: false      // Hapus metadata EXIF buat hemat size & privasi
  };

  try {
    console.log(`[Image Compression] Processing ${file.name} (${(file.size / 1024 / 1024).toFixed(2)} MB)...`);
    const compressedFile = await imageCompression(file, options);
    console.log(`[Image Compression] Success! New size: ${(compressedFile.size / 1024 / 1024).toFixed(2)} MB`);
    
    // Pastikan nama file tetap konsisten dengan ekstensi baru
    const fileName = file.name.split('.').slice(0, -1).join('.') + '.webp';
    return new File([compressedFile], fileName, { type: 'image/webp' });
  } catch (error) {
    console.error("[Image Compression] Error:", error);
    // Edge Case: Kalau gagal, kita balikin file aslinya daripada aplikasinya crash
    return file; 
  }
}

/**
 * Utility: Cek Resolusi Gambar (Helper UI)
 */
export async function getImageResolution(file) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      URL.revokeObjectURL(img.src);
      resolve({ 
        width: img.width, 
        height: img.height, 
        megapixels: Number(((img.width * img.height) / 1000000).toFixed(2)) 
      });
    };
    img.src = URL.createObjectURL(file);
  });
}
