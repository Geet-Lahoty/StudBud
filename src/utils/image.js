/**
 * Compress an image File in the browser.
 * Resizes so the longest side is at most maxSide pixels,
 * then re-encodes as JPEG at the given quality.
 *
 * @param {File} file        Original image file
 * @param {number} maxSide   Max width or height (default 1600)
 * @param {number} quality   JPEG quality 0–1 (default 0.8)
 * @returns {Promise<File>}  Compressed JPEG File object
 */
export function compressImage(file, maxSide = 1600, quality = 0.8) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      let { width, height } = img;

      // Scale down if either dimension exceeds maxSide
      if (width > maxSide || height > maxSide) {
        const ratio = maxSide / Math.max(width, height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Image compression failed."));
            return;
          }
          // Return a File so the rest of the pipeline sees a File object
          const compressed = new File([blob], file.name, {
            type: "image/jpeg",
            lastModified: Date.now(),
          });
          resolve(compressed);
        },
        "image/jpeg",
        quality
      );
    };
    img.onerror = () => reject(new Error("Could not load the image."));
    img.src = URL.createObjectURL(file);
  });
}
