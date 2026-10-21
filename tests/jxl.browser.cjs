const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const http = require('node:http');

(async () => {
  // Serve the real assets with nginx's production CSP, including the worker response.
  const nginx = await fs.readFile(path.join(__dirname, '../nginx.conf'), 'utf8');
  const csp = nginx.match(/Content-Security-Policy "([^"]+)"/)[1];
  const requests = [];
  let holdWorker;
  const server = http.createServer(async (request, response) => {
    try {
      requests.push(request.url);
      if (request.url === '/jxl-worker.js' && holdWorker) await holdWorker();
      const asset = new URL(request.url, 'http://localhost').pathname;
      const file = path.join(__dirname, '../src', asset === '/' ? 'index.html' : asset);
      let body = await fs.readFile(file);
      if (request.url.startsWith('/app.js')) body = Buffer.concat([body, Buffer.from('\nwindow.editorTest={state,loadImage};')]);
      response.writeHead(200, {
        'content-type': ({ '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.wasm': 'application/wasm' })[path.extname(file)] || 'application/octet-stream',
        'content-security-policy': csp,
        'cache-control': 'no-store'
      });
      response.end(body);
    } catch (error) { response.writeHead(500); response.end(String(error)); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  let browser;
  try {
    browser = await chromium.launch({ channel: 'msedge', headless: true });
    const page = await browser.newPage({ viewport: { width: 1500, height: 1000 } });
    page.setDefaultTimeout(15000);
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto(`http://127.0.0.1:${server.address().port}`);
    assert.equal(requests.some(url => /jxl_dec|jxl-worker/.test(url)), false, 'decoder is lazy');
    assert.match(await page.locator('#file-input').getAttribute('accept'), /\.jxl/);
    await page.locator('.custom-size summary').click();
    await page.locator('#custom-width').fill('1280');
    await page.locator('#custom-height').fill('720');
    await page.locator('#apply-custom').click();

    const opaque = await fs.readFile(path.join(__dirname, 'fixtures/opaque.jxl'));
    const transparent = await fs.readFile(path.join(__dirname, 'fixtures/transparent.jxl'));
    async function upload(name, mimeType, buffer = opaque) {
      await page.locator('#file-input').setInputFiles({ name, mimeType, buffer });
      await page.waitForFunction(name => !window.editorTest.state.loading && window.editorTest.state.file?.name === name, name);
      console.log('Imported:', name);
    }
    async function sourcePixels() {
      return page.evaluate(() => {
        const { image, hasTransparency } = window.editorTest.state;
        const canvas = document.createElement('canvas');canvas.width = image.naturalWidth;canvas.height = image.naturalHeight;
        const ctx = canvas.getContext('2d');ctx.drawImage(image, 0, 0);
        return { width: canvas.width, height: canvas.height, hasTransparency,
          corner: [...ctx.getImageData(0, 0, 1, 1).data], center: [...ctx.getImageData(640, 360, 1, 1).data] };
      });
    }
    async function download(format) {
      await page.locator('#format-select').selectOption(format);
      assert.equal(await page.locator('#download-button').isDisabled(), false);
      const event = page.waitForEvent('download');await page.locator('#download-button').click();
      const file = await event, stream = await file.createReadStream(), chunks = [];
      for await (const chunk of stream) chunks.push(chunk);
      const pixels = await page.evaluate(async ({ base64, format }) => {
        const image = new Image();image.src = `data:image/${format};base64,${base64}`;await image.decode();
        const canvas = document.createElement('canvas');canvas.width = image.width;canvas.height = image.height;
        const ctx = canvas.getContext('2d');ctx.drawImage(image, 0, 0);
        return { width: canvas.width, height: canvas.height,
          corner: [...ctx.getImageData(0, 0, 1, 1).data], center: [...ctx.getImageData(640, 360, 1, 1).data] };
      }, { base64: Buffer.concat(chunks).toString('base64'), format });
      assert.equal(pixels.width, 1280);assert.equal(pixels.height, 720);
      assert.ok(file.suggestedFilename().endsWith(format === 'jpeg' ? '.jpg' : '.png'));
      return pixels;
    }

    await upload('videoland.jxl', 'image/jxl');
    assert.deepEqual(await sourcePixels(), { width: 1280, height: 720, hasTransparency: false, corner: [240,80,32,255], center: [240,80,32,255] });
    assert.deepEqual((await download('png')).center, [240,80,32,255]);
    const jpg = await download('jpeg');
    assert.ok(jpg.center.slice(0,3).every((value, i) => Math.abs(value - [240,80,32][i]) <= 3));
    assert.ok(requests.includes('/vendor/jsquash-jxl/jxl_dec.wasm'));
    await upload('no-mime.JXL', '', transparent);
    assert.deepEqual(await sourcePixels(), { width: 1280, height: 720, hasTransparency: true, corner: [0,0,0,0], center: [240,80,32,255] });
    assert.deepEqual((await download('png')).corner, [0,0,0,0]);
    await upload('generic.jxl', 'application/octet-stream');
    await upload('signature-only.bin', 'application/octet-stream');
    // The container signature must also identify JXL, independently of name/MIME.
    const signature = Buffer.from([0,0,0,12,0x4a,0x58,0x4c,0x20,13,10,0x87,10]);
    const fileType = Buffer.alloc(20);fileType.writeUInt32BE(20);fileType.write('ftypjxl ',4);fileType.write('jxl ',16);
    const codestream = Buffer.alloc(8);codestream.writeUInt32BE(8 + opaque.length);codestream.write('jxlc',4);
    await upload('container.bin', '', Buffer.concat([signature,fileType,codestream,opaque]));

    await page.evaluate(base64 => {
      const transfer = new DataTransfer();transfer.items.add(new File([Uint8Array.from(atob(base64), c => c.charCodeAt(0))], 'dropped.jxl'));
      document.querySelector('#drop-zone').dispatchEvent(new DragEvent('drop', { bubbles: true, dataTransfer: transfer }));
    }, transparent.toString('base64'));
    await page.waitForFunction(() => window.editorTest.state.file?.name === 'dropped.jxl');
    assert.equal((await sourcePixels()).hasTransparency, true);

    await page.locator('#language-select').selectOption('nl');
    await page.locator('#file-input').setInputFiles({ name: 'broken.jxl', mimeType: 'image/jxl', buffer: Buffer.from('not a jxl') });
    await page.waitForFunction(() => document.querySelector('#export-message').textContent === 'Deze afbeelding kan niet worden geopend.');
    assert.equal(await page.locator('#file-name').textContent(), 'dropped.jxl', 'failed import preserves the previous file');
    await upload('recovered.jxl', 'image/jxl');

    // Hold worker startup to verify that remove and replacement cancel pending imports.
    async function pendingImport(name) {
      let release, started;
      const ready = new Promise(resolve => { started = resolve; });
      const gate = new Promise(resolve => { release = resolve; });
      holdWorker = () => { started(); return gate; };
      await page.locator('#file-input').setInputFiles({ name, mimeType: 'image/jxl', buffer: opaque });
      await ready;
      assert.equal(await page.locator('#download-button').isDisabled(), true);
      return () => { holdWorker = null;release(); };
    }
    let release = await pendingImport('cancelled.jxl');
    await page.locator('#remove-image').click();release();
    await page.waitForTimeout(200);
    assert.equal(await page.evaluate(() => window.editorTest.state.image), null);
    await upload('before-replacement.jxl', 'image/jxl');
    release = await pendingImport('superseded.jxl');
    const png = await page.evaluate(() => {
      const c = document.createElement('canvas');c.width=1280;c.height=720;return c.toDataURL().split(',')[1];
    });
    await upload('replacement.png', 'image/png', Buffer.from(png, 'base64'));release();
    await page.waitForTimeout(200);
    assert.equal(await page.locator('#file-name').textContent(), 'replacement.png');
    assert.deepEqual(errors, []);
    console.log('PASS: JXL codestream/container imports, lazy local WASM under production CSP, exact dimensions/colors/alpha, PNG/JPEG downloads, MIME fallbacks, drop, corrupt-file recovery and import cancellation.');
  } finally {
    await browser?.close();server.closeAllConnections();await new Promise(resolve => server.close(resolve));
  }
})().catch(error => { console.error(error);process.exitCode = 1; });
