/**
 * 🎥 Frontend Video Compression Utility
 * Menggunakan ffmpeg.wasm untuk melakukan kompresi di sisi client.
 * Target: 1080p, 30fps, H.264, VBR 5000kbps peak.
 */

// NOTE: Library ffmpeg.wasm harus diinstal dulu oleh tim frontend:
// npm install @ffmpeg/ffmpeg @ffmpeg/util

/* 
// CONTOH IMPLEMENTASI DI FRONTEND (KONTRAK KERJA):

import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile, toBlobURL } from '@ffmpeg/util';

export async function compressVideo(file) {
  const ffmpeg = new FFmpeg();
  
  // Load library
  await ffmpeg.load({
    coreURL: await toBlobURL(`/ffmpeg-core.js`, 'text/javascript'),
    wasmURL: await toBlobURL(`/ffmpeg-core.wasm`, 'application/wasm'),
  });

  const { name } = file;
  await ffmpeg.writeFile(name, await fetchFile(file));

  // Jalankan Command FFmpeg sesuai spek System Boundaries:
  // -vf "scale='min(1920,iw)':-2" -> Max 1080p, jaga aspect ratio
  // -r 30 -> 30 FPS
  // -c:v libx264 -> Codec H.264
  // -b:v 5000k -maxrate 5000k -bufsize 10000k -> VBR 5000kbps peak
  // -preset fast -> Kecepatan kompresi
  await ffmpeg.exec([
    '-i', name,
    '-vf', "scale='min(1920,iw)':-2", 
    '-r', '30',
    '-c:v', 'libx264',
    '-b:v', '5000k',
    '-maxrate', '5000k',
    '-bufsize', '10000k',
    '-preset', 'fast',
    '-c:a', 'aac', // Audio standard
    'output.mp4'
  ]);

  const data = await ffmpeg.readFile('output.mp4');
  return new File([data.buffer], 'compressed_video.mp4', { type: 'video/mp4' });
}
*/

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
