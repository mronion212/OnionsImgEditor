const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');

// Exercise the real UI: narrow phones, both layout boundaries and ultrawide screens.
(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  const screenshots = process.env.EDITOR_SCREENSHOTS;
  try {
    if (screenshots) await fs.mkdir(screenshots, { recursive: true });
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.goto('http://127.0.0.1:4173');
    const sizes = [[320,740],[390,844],[600,900],[601,900],[768,1024],[959,900],
      [960,900],[1024,768],[1199,900],[1200,800],[1536,960],[1920,1080],
      [2560,1080],[3440,1440],[5120,1440],[1920,600]];
    for (const language of ['en','nl']) {
      await page.selectOption('#language-select', language);
      for (const theme of ['dark','light']) {
        if (await page.locator('html').getAttribute('data-theme') !== theme) await page.locator('#theme-toggle').click();
        for (const [width,height] of sizes) {
          await page.setViewportSize({width,height});
          await page.evaluate(() => new Promise(resolve => requestAnimationFrame(() => requestAnimationFrame(resolve))));
          const layout = await page.evaluate(() => {
            const rect = selector => document.querySelector(selector).getBoundingClientRect();
            const shell = rect('.app-shell'), stage = rect('#stage'), board = rect('#artboard');
            const canvas = rect('.stage-card'), inspector = rect('.control-panel');
            const field = rect('#format-select'), download = rect('#download-button');
            const controlOverflow = [...document.querySelectorAll('.preset-card,.stage-toolbar,.position-toolbar,.right-panel,.topbar-inner')]
              .filter(node => node.scrollWidth > node.clientWidth + 1).map(node => node.className);
            return {overflow:document.documentElement.scrollWidth > innerWidth, shellWidth:shell.width,
              boardWidth:board.width, boardHeight:board.height,
              boardContained:board.left >= stage.left && board.right <= stage.right + 1 && board.top >= stage.top && board.bottom <= stage.bottom + 1,
              controlOverflow, desktop:innerWidth>=960,
              aligned:Math.abs(canvas.top-inspector.top)<1 && Math.abs(canvas.bottom-inspector.bottom)<1,
              fieldsAligned:Math.abs(field.left-download.left)<1 && Math.abs(field.right-download.right)<1};
          });
          const label = `${language}/${theme} ${width}×${height}`;
          assert.equal(layout.overflow, false, label + ' has no page overflow');
          assert.deepEqual(layout.controlOverflow, [], label + ' has no clipped controls');
          assert.ok(layout.shellWidth <= 2201, label + ' keeps a bounded workspace');
          if (layout.desktop) assert.ok(layout.aligned, label + ' aligns canvas and inspector at both edges');
          assert.ok(layout.fieldsAligned, label + ' aligns format and export controls');
          assert.ok(layout.boardContained && layout.boardWidth > 0 && layout.boardHeight > 0, label + ' fits the canvas');
          if (screenshots && language === 'nl' && ((theme === 'dark' && [390,768,1024,1536,3440].includes(width)) || (theme === 'light' && width === 1536))) {
            await page.screenshot({path:path.join(screenshots,`${theme}-${width}.png`),fullPage:true});
          }
        }
      }
    }
    // The primary canvas action opens the same file chooser as the sidebar.
    await page.setViewportSize({width:1536,height:960});
    const chooserEvent = page.waitForEvent('filechooser');
    await page.locator('#canvas-upload').click();
    const chooser = await chooserEvent;
    const png = await page.evaluate(() => {
      const canvas = document.createElement('canvas');canvas.width=2400;canvas.height=1800;
      const ctx=canvas.getContext('2d');ctx.fillStyle='#466957';ctx.fillRect(100,100,2200,1600);
      ctx.fillStyle='#d8bb8d';ctx.fillRect(400,400,500,600);
      return canvas.toDataURL().split(',')[1];
    });
    await chooser.setFiles({name:'artwork.png',mimeType:'image/png',buffer:Buffer.from(png,'base64')});
    await page.waitForFunction(() => !document.querySelector('#preview-image').hidden);
    await page.locator('#more-presets').click();
    for (const [width,height] of [[390,844],[1024,768],[1280,800],[3440,1440]]) {
      await page.setViewportSize({width,height});
      for (const preset of ['poster','season-poster','background','clearlogo','banner','icon','clearart','episode-hd','episode-sd']) {
        await page.locator(`[data-preset="${preset}"]`).click();
        assert.equal(await page.evaluate(() => document.documentElement.scrollWidth > innerWidth),false,`${preset} at ${width}`);
        const dimensions = await page.locator('#artboard').boundingBox();
        assert.ok(dimensions.width > 0 && dimensions.height > 0, `${preset} remains visible at ${width}`);
      }
    }
    await page.locator('[data-preset="season-poster"]').click();
    assert.equal(await page.locator('#season-stamp').isVisible(),true);
    await page.selectOption('#format-select','jpeg');
    assert.equal(await page.locator('#jpeg-options').isVisible(),true);
    await page.locator('#remove-image').click();
    assert.equal(await page.locator('#canvas-upload').isVisible(),true);
    assert.equal(await page.locator('#download-button').isDisabled(),true);
    assert.deepEqual(errors,[]);
    console.log('PASS: 64 layouts across 320–5120 px, English/Dutch, light/dark, aligned canvas/inspector edges and export fields, upload chooser and 36 loaded preset layouts.');
  } finally { await browser.close(); }
})().catch(error => { console.error(error);process.exitCode=1; });
