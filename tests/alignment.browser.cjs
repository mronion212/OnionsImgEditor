const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');

(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1500, height: 1000 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/app.js*', async route => {
      const source = await fs.readFile(path.join(__dirname, '../src/app.js'), 'utf8');
      await route.fulfill({ contentType: 'text/javascript', body: source + '\nwindow.editorTest={state,geometry,analyzeImage,exportDimensions};' });
    });
    await page.goto('http://127.0.0.1:4173');
    await page.locator('[data-preset="clearlogo"]').click();
    const source = await page.evaluate(() => {
      const c = document.createElement('canvas');c.width = 2400;c.height = 1000;
      const ctx = c.getContext('2d');ctx.fillStyle = '#eecc55';ctx.fillRect(300, 250, 1700, 400);
      // A detached accent must be included; almost invisible padding noise must not.
      ctx.fillRect(250, 245, 10, 10);ctx.clearRect(900, 350, 200, 200);
      ctx.fillStyle = 'rgba(255,0,0,0.004)';ctx.fillRect(0, 0, 1, 1);ctx.fillRect(2399, 999, 1, 1);
      return c.toDataURL().split(',')[1];
    });
    await page.locator('#file-input').setInputFiles({ name: 'faint-padding.png', mimeType: 'image/png', buffer: Buffer.from(source, 'base64') });
    await page.waitForFunction(() => window.editorTest.state.image);
    const bounds = await page.evaluate(() => ({ exact: window.editorTest.state.alphaBounds, visible: window.editorTest.state.framingBounds }));
    assert.deepEqual(bounds.exact, { left: 0, top: 0, right: 2400, bottom: 1000 });
    assert.deepEqual(bounds.visible, { left: 250, top: 245, right: 2000, bottom: 650 });
    async function checkExport() {
      const event = page.waitForEvent('download');await page.locator('#download-button').click();
      const download = await event, stream = await download.createReadStream(), chunks = [];
      for await (const chunk of stream) chunks.push(chunk);
      const result = await page.evaluate(async base64 => {
        const image = new Image();image.src = 'data:image/png;base64,' + base64;await image.decode();
        const analysis = window.editorTest.analyzeImage(image),b = analysis.framingBounds;
        return {width:image.width,height:image.height,left:b.left,right:image.width-b.right,top:b.top,bottom:image.height-b.bottom};
      }, Buffer.concat(chunks).toString('base64'));
      assert.equal(result.width, 1600);assert.equal(result.height, 620);
      assert.ok(Math.abs(result.left - result.right) <= 2, `horizontal margins match: ${JSON.stringify(result)}`);
      assert.ok(Math.abs(result.top - result.bottom) <= 2, `vertical margins match: ${JSON.stringify(result)}`);
      assert.ok(Math.min(result.left, result.right, result.top, result.bottom) >= 20);
      assert.equal(await page.locator('#center-status-text').textContent(), 'Centered');
      return result;
    }
    await checkExport();
    await page.locator('.nudge-controls [data-dy="1"]').click();
    assert.equal(await page.locator('#center-status-text').textContent(), 'Moved');
    await page.locator('#center-image').click();await checkExport();
    await page.selectOption('#logo-outline', 'dual');await page.locator('#fit-logo').click();await checkExport();
    const faint = await page.evaluate(async () => {
      const c = document.createElement('canvas');c.width = 1000;c.height = 500;
      const ctx = c.getContext('2d');ctx.fillStyle = 'rgba(255,255,255,0.004)';ctx.fillRect(200, 100, 600, 200);
      const image = new Image();image.src = c.toDataURL();await image.decode();return window.editorTest.analyzeImage(image);
    });
    assert.equal(faint.hasArtwork, true);assert.deepEqual(faint.framingBounds, faint.bounds);
    // Optional local fixture stays on this machine and is never added to the repo.
    if (process.env.EDITOR_ALIGNMENT_FIXTURE) {
      await page.selectOption('#logo-outline', 'none');
      await page.locator('#file-input').setInputFiles(process.env.EDITOR_ALIGNMENT_FIXTURE);
      await page.waitForFunction(name => document.querySelector('#file-name').textContent === name, path.basename(process.env.EDITOR_ALIGNMENT_FIXTURE));
      console.log('Fixture analysis:', await page.evaluate(() => ({exact:window.editorTest.state.alphaBounds,visible:window.editorTest.state.framingBounds,output:window.editorTest.exportDimensions()})));
      console.log('Fixture export margins:', await checkExport());
      if (process.env.EDITOR_ALIGNMENT_SCREENSHOT) await page.locator('#artboard').screenshot({path:process.env.EDITOR_ALIGNMENT_SCREENSHOT});
    }
    assert.deepEqual(errors, []);
    console.log('PASS: visible logo centered in actual high-resolution exports, faint padding ignored, detached accent retained, Center/Fit actions, outlines and uniformly faint artwork.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error);process.exitCode = 1; });
