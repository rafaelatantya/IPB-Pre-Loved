/**
 * 📈 Upload Utility with Progress Bar support
 * Digunakan untuk mengirim file ke /api/upload
 */

/**
 * Fungsi Upload menggunakan XMLHttpRequest (Native) 
 * agar bisa dapet progress event tanpa install axios.
 */
export async function uploadWithProgress(file, type, onProgress) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    const formData = new FormData();
    
    formData.append("file", file);
    formData.append("type", type); // "image" or "video"

    xhr.open("POST", "/api/upload", true);

    // Track Progress
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) {
        const percentComplete = Math.round((event.loaded / event.total) * 100);
        if (onProgress) onProgress(percentComplete);
      }
    };

    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(new Error(xhr.responseText));
      }
    };

    xhr.onerror = () => reject(new Error("Network Error"));
    
    xhr.send(formData);
  });
}

/*
// CONTOH PENGGUNAAN DI COMPONENT:

const handleUpload = async (file) => {
  try {
    const result = await uploadWithProgress(file, "video", (percent) => {
      setProgressBar(percent); // Update state UI
    });
    console.log("File uploaded to:", result.url);
  } catch (err) {
    alert("Upload gagal!");
  }
}
*/
