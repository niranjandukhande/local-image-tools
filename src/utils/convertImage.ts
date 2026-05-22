export async function convertImageToPng(imageUrl: string): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    if (!ctx) {
      reject(new Error("Canvas context failed"));
      return;
    }

    const img = new Image();

    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;

      ctx.drawImage(img, 0, 0);

      canvas.toBlob((blob) => {
        if (!blob) {
          reject(new Error("Conversion failed"));
          return;
        }
        resolve(blob);
      }, "image/png");
    };

    img.onerror = () => {
      reject(new Error("Image failed to load"));
    };

    img.src = imageUrl;
  });
}
