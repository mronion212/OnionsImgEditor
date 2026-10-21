// Decode in a disposable worker so large files do not block editing or retain WASM memory.
export function decodeJxl(file, signal) {
 return new Promise((resolve, reject) => {
  const worker = new Worker(new URL('./jxl-worker.js', import.meta.url), { type: 'module' });
  const finish = (error, blob) => {
   worker.terminate();
   signal.removeEventListener('abort', abort);
   if (error) reject(error); else resolve(blob);
  };
  const abort = () => finish(new DOMException('Image load cancelled', 'AbortError'));
  signal.addEventListener('abort', abort, { once: true });
  if (signal.aborted) { abort(); return; }
  worker.onmessage = ({ data }) => data.error ? finish(new Error(data.error)) : finish(null, data.blob);
  worker.onerror = (event) => { event.preventDefault(); finish(new Error('JPEG XL decoder failed')); };
  worker.onmessageerror = () => finish(new Error('JPEG XL decoder response failed'));
  worker.postMessage(file);
 });
}

export async function isJxl(file) {
 if (file.type === 'image/jxl' || /\.jxl$/i.test(file.name)) return true;
 const bytes = new Uint8Array(await file.slice(0, 12).arrayBuffer());
 return (bytes[0] === 0xff && bytes[1] === 0x0a) ||
  [0, 0, 0, 12, 0x4a, 0x58, 0x4c, 0x20, 13, 10, 0x87, 10].every((byte, i) => bytes[i] === byte);
}
