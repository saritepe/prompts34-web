const MAX_DIMENSION = 1920;
const WEBP_QUALITY = 0.85;

export async function compressImage(file: File): Promise<File> {
  const dataUrl = await readAsDataURL(file);
  const image = await loadImage(dataUrl);

  const scale = Math.min(
    1,
    MAX_DIMENSION / Math.max(image.naturalWidth, image.naturalHeight),
  );
  const targetWidth = Math.round(image.naturalWidth * scale);
  const targetHeight = Math.round(image.naturalHeight * scale);

  const canvas = document.createElement('canvas');
  canvas.width = targetWidth;
  canvas.height = targetHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Tarayıcı görseli sıkıştıramadı.');
  }
  ctx.drawImage(image, 0, 0, targetWidth, targetHeight);

  const blob = await new Promise<Blob | null>((resolve) =>
    canvas.toBlob(resolve, 'image/webp', WEBP_QUALITY),
  );
  if (!blob) {
    throw new Error('Görsel WebP olarak kodlanamadı.');
  }

  const baseName = file.name.replace(/\.[^.]+$/, '') || 'image';
  return new File([blob], `${baseName}.webp`, { type: 'image/webp' });
}

function readAsDataURL(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = () => reject(new Error('Görsel okunamadı.'));
    reader.readAsDataURL(file);
  });
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = () => reject(new Error('Görsel açılamadı.'));
    img.src = src;
  });
}
