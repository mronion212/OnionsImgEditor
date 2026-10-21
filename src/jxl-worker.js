import createDecoder from './vendor/jsquash-jxl/jxl_dec.js';

self.onmessage = async ({ data: file }) => {
 try {
  const decoder = await createDecoder({ noInitialRun: true });
  const pixels = decoder.decode(await file.arrayBuffer());
  if (!pixels) throw new Error('Invalid JPEG XL image');
  const canvas = new OffscreenCanvas(pixels.width, pixels.height);
  canvas.getContext('2d').putImageData(pixels, 0, 0);
  const blob = await canvas.convertToBlob({ type: 'image/png' });
  self.postMessage({ blob });
 } catch {
  self.postMessage({ error: 'JPEG XL image could not be decoded' });
 }
};
