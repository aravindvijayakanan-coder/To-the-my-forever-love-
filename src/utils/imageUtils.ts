/**
 * Utility to optimize and read images as base64 or upload to server
 */

export async function processImageFile(file: File, maxWidth = 1920, maxHeight = 1920, quality = 0.88): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onerror = () => reject(new Error('Failed to read file'));
    reader.onload = (e) => {
      const img = new Image();
      img.onerror = () => reject(new Error('Failed to load image'));
      img.onload = () => {
        let { width, height } = img;
        
        // Scale down if larger than max
        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }

        // Draw image onto canvas
        ctx.drawImage(img, 0, 0, width, height);
        
        // Convert to high quality JPEG data URL
        const dataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(dataUrl);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  });
}

export async function uploadPhotoToServer(base64Image: string, photoId: number): Promise<string> {
  try {
    const res = await fetch('/api/upload-photo', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ image: base64Image, photoId })
    });
    if (!res.ok) {
      // If server upload fails, fallback to using the base64 string directly
      console.warn('Server photo upload non-ok, falling back to base64');
      return base64Image;
    }
    const data = await res.json();
    if (data.success && data.url) {
      return data.url;
    }
    return base64Image;
  } catch (err) {
    console.warn('Error uploading photo to server, using base64 fallback:', err);
    return base64Image;
  }
}
