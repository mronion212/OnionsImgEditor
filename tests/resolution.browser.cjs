const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');

// Verify actual downloads: source detail, whole multiples, crops and logo alpha.
(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1500, height: 1000 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/app.js*', async route => {
      const source = await fs.readFile(path.join(__dirname, '../src/app.js'), 'utf8');
      await route.fulfill({ contentType: 'text/javascript', body: source + '\nwindow.editorTest={state,geometry,exportDimensions};' });
    });
    await page.goto('http://127.0.0.1:4173');
    await page.locator('#more-presets').click();
    let serial = 0;
    async function upload(width, height, logo = false, padded = false) {
      const png = await page.evaluate(({ width, height, logo, padded }) => {
        const canvas = document.createElement('canvas');canvas.width = width;canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ffee55';
        if (logo) {
          ctx.fillRect(30, 30, padded ? 780 : width - 60, padded ? 290 : height - 60);
          ctx.clearRect(120, 120, 60, 60);
        } else {
          ctx.fillRect(0, 0, width, height);
          // Single-pixel stripes expose accidental downsampling, even if dimensions match.
          ctx.fillStyle = '#123456';for (let x = 0; x < width; x += 2) ctx.fillRect(x, 0, 1, height);
        }
        return canvas.toDataURL().split(',')[1];
      }, { width, height, logo, padded });
      const name = `resolution-${++serial}.png`;
      await page.locator('#file-input').setInputFiles({ name, mimeType: 'image/png', buffer: Buffer.from(png, 'base64') });
      await page.waitForFunction(name => document.querySelector('#file-name').textContent === name, name);
    }
    async function expectSize(width, height, multiple) {
      const output = await page.evaluate(() => window.editorTest.exportDimensions());
      assert.deepEqual(output, { width, height, multiple });
      assert.match(await page.locator('#export-resolution-help').textContent(), new RegExp(`${width} × ${height} px`));
      assert.equal((await page.locator('#output-size').textContent()).replace(/\s+/g, ''), `${width}×${height}`);
      assert.equal(await page.locator('#selected-dimensions').textContent(), `${width} × ${height} px · ${multiple}×`);
    }
    async function downloadPixels(jpeg = false) {
      const event = page.waitForEvent('download');await page.locator('#download-button').click();
      const download = await event, stream = await download.createReadStream(), chunks = [];
      for await (const chunk of stream) chunks.push(chunk);
      const pixels = await page.evaluate(async ({base64, jpeg}) => {
        const image = new Image();image.src = `data:image/${jpeg ? 'jpeg' : 'png'};base64,` + base64;await image.decode();
        const c = document.createElement('canvas');c.width = image.width;c.height = image.height;
        const ctx = c.getContext('2d');ctx.drawImage(image, 0, 0);
        const d = ctx.getImageData(0, 0, c.width, c.height).data;
        let minX = c.width, minY = c.height, maxX = -1, maxY = -1, dark = 0, white = 0;
        for (let y = 0; y < c.height; y++) for (let x = 0; x < c.width; x++) {
          const i = (y * c.width + x) * 4;
          if (d[i + 3]) {
            minX = Math.min(minX, x);maxX = Math.max(maxX, x);minY = Math.min(minY, y);maxY = Math.max(maxY, y);
            if (d[i] < 40 && d[i + 1] < 40 && d[i + 2] < 40) dark++;
            if (d[i] > 245 && d[i + 1] > 245 && d[i + 2] > 245) white++;
          }
        }
        // Compare an unscaled output/crop against the original, pixel for pixel.
        const { state, geometry } = window.editorTest,g = geometry(),factor = c.width / g.w;
        const original = document.createElement('canvas');original.width = c.width;original.height = c.height;
        original.getContext('2d').drawImage(state.image, Math.round(g.x * factor), Math.round(g.y * factor));
        const source = original.getContext('2d').getImageData(0, 0, c.width, c.height).data;
        let differences = 0;for (let i = 0; i < d.length; i++) if (d[i] !== source[i]) differences++;
        const holeX = Math.round((g.x + 150 * g.scale) * factor),holeY = Math.round((g.y + 150 * g.scale) * factor);
        return { width: c.width, height: c.height, differences, minX, minY, maxX, maxY, dark, white,
          cornerAlpha: d[3], holeAlpha: d[(holeY * c.width + holeX) * 4 + 3] };
      }, {base64:Buffer.concat(chunks).toString('base64'),jpeg});
      assert.ok(download.suggestedFilename().endsWith(`-${pixels.width}x${pixels.height}.${jpeg ? 'jpg' : 'png'}`));
      assert.match(await page.locator('#export-message').textContent(), new RegExp(`${pixels.width} × ${pixels.height} px`));
      return pixels;
    }
    await page.locator('[data-preset="episode-hd"]').click();
    assert.equal(await page.locator('#export-resolution').inputValue(), 'auto');
    for (const [width, height, multiple] of [[1920,1080,3],[3840,2160,6],[1280,720,2],[640,360,1]]) {
      await upload(width, height);await expectSize(width, height, multiple);
      const pixels = await downloadPixels();assert.equal(pixels.differences, 0, 'native episode detail is unchanged');
    }
    await upload(2560, 1080);await expectSize(1920, 1080, 3);
    assert.equal((await downloadPixels()).differences, 0, 'wide source crop retains native pixels');
    await page.selectOption('#format-select', 'jpeg');
    assert.equal((await downloadPixels(true)).width, 1920, 'JPEG also retains the selected resolution');
    await page.selectOption('#format-select', 'png');
    await upload(1920, 1080);
    await page.locator('#zoom-slider').evaluate(node => {node.value = '1.5';node.dispatchEvent(new Event('input'));});
    await expectSize(1280, 720, 2);
    await page.selectOption('#export-resolution', 'base');await expectSize(640, 360, 1);
    assert.equal((await downloadPixels()).width, 640);
    await page.selectOption('#export-resolution', 'auto');
    await upload(1280, 719);await expectSize(640, 360, 1);
    await upload(320, 180);await expectSize(640, 360, 1);
    assert.equal(await page.locator('#download-button').isDisabled(), true);
    await page.locator('#allow-upscale').check();await expectSize(640, 360, 1);
    assert.equal((await downloadPixels()).width, 640);

    await page.locator('[data-preset="clearlogo"]').click();
    await upload(2400, 930, true);await expectSize(2400, 930, 3);
    let logo = await downloadPixels();
    assert.equal(logo.differences, 0, 'native visible logo pixels are unchanged');
    assert.equal(logo.cornerAlpha, 0);assert.equal(logo.holeAlpha, 0);
    assert.equal(logo.minX, 30);assert.equal(logo.minY, 30);assert.equal(logo.maxX, 2369);assert.equal(logo.maxY, 899);
    await page.selectOption('#logo-outline', 'dual');
    await page.locator('#outline-width').evaluate(node => {node.value = '1';node.dispatchEvent(new Event('input'));});
    await expectSize(2400, 930, 3);logo = await downloadPixels();
    assert.ok(logo.minX >= 30 && logo.minY >= 30 && logo.maxX < 2370 && logo.maxY < 900);
    assert.ok(logo.dark > 0 && logo.white > 0);assert.equal(logo.holeAlpha, 0);
    await page.selectOption('#logo-outline', 'none');
    await upload(2400, 930, true, true);await expectSize(800, 310, 1);
    await page.selectOption('#language-select', 'nl');
    assert.match(await page.locator('#export-resolution-help').textContent(), /1× basisformaat/);
    await page.locator('[data-preset="poster"]').click();
    assert.equal(await page.locator('#export-resolution-options').isVisible(), false);
    assert.deepEqual(await page.evaluate(() => window.editorTest.exportDimensions()), { width: 680, height: 1000, multiple: 1 });
    await page.locator('#remove-image').click();
    await page.locator('[data-preset="clearlogo"]').click();await expectSize(800, 310, 1);
    // The existing canvas limits also bound automatic resolution for huge sources.
    const limits = await page.evaluate(() => {
      const { state, exportDimensions } = window.editorTest;
      state.hasArtwork = true;
      const output = exportDimensions({scale:0.00001});
      state.hasArtwork = false;
      return output;
    });
    assert.ok(limits.width <= 12000 && limits.height <= 12000 && limits.width * limits.height <= 40000000);
    assert.deepEqual(errors, []);
    console.log('PASS: native HD/4K pixel detail, whole multiples, wide crop, zoom, base override, undersized sources, high-resolution logo alpha/gutters/outline, padded logos, Dutch copy and export limits.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error);process.exitCode = 1; });
