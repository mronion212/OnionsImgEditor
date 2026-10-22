const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');

// Verify actual downloads: source detail, exact aspect ratios, crops and logo alpha.
(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1500, height: 1000 } });
    page.setDefaultTimeout(15000);
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
      const label = new Intl.NumberFormat('en', { maximumFractionDigits: 3 }).format(multiple);
      assert.equal(await page.locator('#selected-dimensions').textContent(), `${width} × ${height} px · ${label}×`);
      const geometry = await page.evaluate(() => window.editorTest.geometry());
      if (geometry) {
        assert.equal(width * geometry.h, height * geometry.w, 'export keeps the exact preset aspect ratio');
        if (geometry.scale <= 1) assert.ok(multiple * geometry.scale <= 1 + 1e-9, 'export never enlarges source pixels');
      }
    }
    async function downloadPixels(jpeg = false) {
      assert.equal(await page.locator('#download-button').isDisabled(), false, 'export is enabled');
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
    for (const [width, height, multiple] of [[1920,1080,3],[2560,1440,4],[3840,2160,6],[1280,720,2],[640,360,1]]) {
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
    await upload(1280, 719);await expectSize(1264, 711, 1.975);
    const almost720 = await downloadPixels();assert.equal(almost720.width, 1264);assert.equal(almost720.height, 711);
    await upload(320, 180);await expectSize(640, 360, 1);
    assert.equal(await page.locator('#download-button').isDisabled(), true);
    await page.locator('#allow-upscale').check();await expectSize(640, 360, 1);
    assert.equal((await downloadPixels()).width, 640);

    await page.locator('[data-preset="background"]').click();
    for (const [width, height] of [[2560,1440],[3200,1800],[2048,1152]]) {
      await upload(width, height);await expectSize(width, height, width / 1920);
      assert.equal((await downloadPixels()).differences, 0, 'intermediate background resolution retains every source pixel');
    }
    await upload(2560,1440);
    await page.selectOption('#format-select', 'jpeg');
    const jpeg1440 = await downloadPixels(true);assert.equal(jpeg1440.width, 2560);assert.equal(jpeg1440.height, 1440);
    await page.selectOption('#format-select', 'png');
    await page.selectOption('#language-select', 'nl');
    assert.match(await page.locator('#export-resolution-help').textContent(), /1,333× basisformaat/);
    assert.match(await page.locator('#export-resolution-help').textContent(), /dezelfde beeldverhouding/);
    await page.selectOption('#language-select', 'en');
    await page.locator('#zoom-slider').evaluate(node => {node.value = '1.2';node.dispatchEvent(new Event('input'));});
    await expectSize(2128,1197,133/120);
    const zoomed1440 = await downloadPixels();assert.equal(zoomed1440.width, 2128);assert.equal(zoomed1440.height, 1197);
    await page.selectOption('#export-resolution', 'base');await expectSize(1920,1080,1);
    await page.selectOption('#export-resolution', 'auto');

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
    assert.equal(await page.locator('#export-resolution-options').isVisible(), true);
    assert.deepEqual(await page.evaluate(() => window.editorTest.exportDimensions()), { width: 680, height: 1000, multiple: 1 });
    await page.selectOption('#language-select', 'en');
    assert.equal(await page.locator('#jpeg-quality').inputValue(), '1');
    for (const [preset, width, height, nearWidth, nearHeight] of [
      ['poster',680,1000,1343,1975],['season-poster',680,1000,1343,1975],['background',1920,1080,3824,2151],
      ['banner',758,140,1137,210],['icon',1024,1024,2047,2047],['clearart',1000,562,2000,1124],['episode-sd',640,480,1276,957]
    ]) {
      await page.locator('[data-preset="' + preset + '"]').click();
      if (preset === 'season-poster') await page.locator('#season-panel .switch').click();
      await upload(width * 2, height * 2, preset === 'clearart');await expectSize(width * 2, height * 2, 2);
      const pixels = await downloadPixels();
      console.log('Verified native export:', preset, pixels.width, pixels.height);
      assert.equal(pixels.differences, 0, preset + ' retains native detail in the actual PNG');
      await page.selectOption('#export-resolution', 'base');await expectSize(width, height, 1);
      await page.selectOption('#export-resolution', 'auto');
      await upload(width * 2 - 1, height * 2, preset === 'clearart');
      await expectSize(nearWidth, nearHeight, nearWidth / width);
      const intermediate = await downloadPixels();assert.equal(intermediate.width, nearWidth);assert.equal(intermediate.height, nearHeight);
      await upload(Math.floor(width / 2), Math.floor(height / 2));
      assert.equal(await page.locator('#download-button').isDisabled(), true, preset + ' blocks upscaling');
    }
    await page.locator('[data-preset="poster"]').click();
    await upload(1360,2000);
    await page.locator('#zoom-slider').evaluate(node => {node.value = '1.5';node.dispatchEvent(new Event('input'));});
    await expectSize(901,1325,1.325);
    // Custom dimensions use the same automatic source-resolution policy.
    await page.locator('.custom-heading').click();
    await page.locator('#custom-width').fill('340');await page.locator('#custom-height').fill('500');
    await page.locator('#apply-custom').click();await expectSize(1360,2000,4);
    assert.equal((await downloadPixels()).differences, 0);
    await page.locator('#custom-width').fill('680');await page.locator('#custom-height').fill('1000');
    await page.locator('#apply-custom').click();await upload(1020,1500);await expectSize(1020,1500,1.5);
    assert.equal((await downloadPixels()).differences, 0, 'custom sizes retain fractional base multiples');
    await page.locator('#remove-image').click();
    await page.locator('[data-preset="clearlogo"]').click();await expectSize(800, 310, 1);
    // The existing canvas limits also bound automatic resolution for huge sources.
    const limits = await page.evaluate(() => {
      const { state, exportDimensions } = window.editorTest;
      const preset = state.preset;
      state.hasArtwork = true;
      const output = [[1920,1080],[800,310],[758,140],[341,499],[12000,1]].map(([width,height]) => {
        state.preset = {width,height,preserveResolution:true};
        return {baseWidth:width,baseHeight:height,...exportDimensions({scale:0.00001})};
      });
      state.preset = preset;
      state.hasArtwork = false;
      return output;
    });
    for (const output of limits) {
      assert.ok(Number.isInteger(output.width) && Number.isInteger(output.height));
      assert.ok(output.width <= 12000 && output.height <= 12000 && output.width * output.height <= 40000000);
      assert.equal(output.width * output.baseHeight, output.height * output.baseWidth);
      assert.ok(output.width >= output.baseWidth && output.height >= output.baseHeight);
    }
    assert.deepEqual(errors, []);
    console.log('PASS: all presets and custom sizes, native PNG detail, 1440p PNG/JPEG, intermediate resolutions with exact aspect ratios, crop/zoom, base override, undersized sources, logo alpha/gutters/outline, Dutch fractional scales and export limits.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error);process.exitCode = 1; });
