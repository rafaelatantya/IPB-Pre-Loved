import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

let ffmpegInstance = null;

/**
 * Utility: Load FFmpeg Singleton
 * Menggunakan unpkg.com sebagai CDN agar repo tetap ringan.
 */
async function getFFmpeg() {
  if (ffmpegInstance) return ffmpegInstance;

  const ffmpeg = new FFmpeg();
  const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
  
  await ffmpeg.load({
    coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
  });

  ffmpegInstance = ffmpeg;
  return ffmpegInstance;
}

/**
 * 🎥 Action: Kompres Video (Client-Side)
 * Target: 720p, 30fps, H.264, 2500kbps.
 * @param {File} file - File video mentah dari input
 * @param {Function} onProgress - Callback untuk progress (0-100)
 */
export async function compressVideo(file, onProgress) {
  const ffmpeg = await getFFmpeg();
  const { name } = file;
  const outputName = `compressed_${Date.now()}.mp4`;

  // Track Progress
  ffmpeg.on('log', ({ message }) => {
    // Parsing progress dari log ffmpeg bisa kompleks, 
    // untuk MVP kita pake log dasar atau progress event jika didukung
    console.log("[FFmpeg Log]", message);
  });

  ffmpeg.on('progress', ({ progress }) => {
    if (onProgress) onProgress(Math.round(progress * 100));
  });

  try {
    // 1. Tulis file ke Virtual File System (VFS)
    await ffmpeg.writeFile(name, await fetchFile(file));

    // 2. Jalankan Kompresi (Optimized for Mobile/Web)
    await ffmpeg.exec([
      '-i', name,
      '-vf', "scale='min(1280,iw)':-2", // Downscale ke 720p jika lebih besar
      '-r', '30',                      // Paksa 30 FPS
      '-c:v', 'libx264',               // Codec sejuta umat (H.264)
      '-b:v', '2500k',                 // Target bitrate 2.5Mbps
      '-maxrate', '2500k',
      '-bufsize', '5000k',
      '-preset', 'fast',               // Balance speed vs quality
      '-crf', '23',                    // Constant Rate Factor (Standard Quality)
      '-c:a', 'aac',                   // Audio AAC (Standard)
      '-b:a', '128k',                  // Audio Bitrate
      outputName
    ]);

    // 3. Baca hasil kompresi
    const data = await ffmpeg.readFile(outputName);
    
    // 4. Cleanup VFS (Biar nggak Memory Leak)
    await ffmpeg.deleteFile(name);
    await ffmpeg.deleteFile(outputName);

    return new File([data.buffer], outputName, { type: 'video/mp4' });
  } catch (error) {
    console.error("FFmpeg Compression Error:", error);
    throw new Error("Gagal mengompres video. Pastikan browser mendukung SharedArrayBuffer.");
  }
}

/**
 * Validasi Durasi Video (Helper buat UI)
 */
export async function getVideoDuration(file) {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.preload = 'metadata';
    video.onloadedmetadata = () => {
      window.URL.revokeObjectURL(video.src);
      resolve(Math.round(video.duration));
    };
    video.src = URL.createObjectURL(file);
  });
}
