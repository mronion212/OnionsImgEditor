const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const path = require('node:path');
const os = require('node:os');

// Run against `node server.mjs`. Playwright can be supplied through NODE_PATH.
(async () => {
  const browser = await chromium.launch({ channel: 'msedge', headless: true });
  try {
    const page = await browser.newPage({ viewport: { width: 1500, height: 1000 } });
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.route('**/app.js*', async route => {
      const source = await fs.readFile(path.join(__dirname, '../src/app.js'), 'utf8');
      await route.fulfill({ contentType: 'text/javascript', body: source + '\nwindow.editorTest={state,ui,geometry,paint,analyzeImage};' });
    });
    await page.goto('http://127.0.0.1:4173');
    await page.locator('[data-preset="clearlogo"]').click();
    async function load(color, small = false, empty = false) {
      await page.evaluate(({ color, small, empty }) => {
        const c = document.createElement('canvas');c.width = 2400;c.height = 1000;
        const ctx = c.getContext('2d');ctx.fillStyle = color;
        if (!empty) {
          ctx.fillRect(301, 123, small ? 100 : 1170, small ? 30 : 435);
          // A transparent hole must stay transparent with a contour outline.
          if (!small) ctx.clearRect(600, 230, 180, 150);
        }
        c.toBlob(blob => {
          const transfer = new DataTransfer();transfer.items.add(new File([blob], 'logo.png', { type: 'image/png' }));
          const input = document.querySelector('#file-input');input.files = transfer.files;input.dispatchEvent(new Event('change', { bubbles: true }));
        });
      }, { color, small, empty });
      await page.waitForFunction(() => window.editorTest?.state.image?.naturalWidth === 2400 && document.querySelector('#file-state').textContent !== 'No file yet');
      // Wait for the new asynchronous image load, including repeated same-size files.
      await page.waitForFunction(({ color, small, empty }) => {
        const s = window.editorTest.state;
        return s.hasArtwork === !empty && (empty || s.alphaBounds.right === (small ? 401 : 1471)) && (empty || s.outlineColor === (color === '#000000' ? 'white' : 'black'));
      }, { color, small, empty });
    }
    for (const color of ['#ffffff', '#000000', '#ffee55']) {
      await load(color);
      for (const outline of ['none', 'auto', 'black', 'white', 'dual']) {
        await page.selectOption('#logo-outline', outline);
        for (const width of [1, 2, 4]) {
          await page.locator('#outline-width').evaluate((node, value) => {node.value = value;node.dispatchEvent(new Event('input'));}, String(width));
          await page.locator('#fit-logo').click();
          const g = await page.evaluate(() => {
            const { state, geometry } = window.editorTest;return { ...geometry(), bounds: state.alphaBounds };
          });
          assert.deepEqual(g.bounds, { left: 301, top: 123, right: 1471, bottom: 558 });
          assert.ok(Math.abs(g.x + (301 + 1471) * g.scale / 2 - 400) < 1e-7);
          assert.ok(Math.abs(g.y + (123 + 558) * g.scale / 2 - 155) < 1e-7);
          const radius = outline === 'none' ? 0 : width * (outline === 'dual' ? 2 : 1);
          assert.ok(g.x + 301 * g.scale - radius >= 10 - 1e-7);
          assert.ok(g.y + 558 * g.scale + radius <= 300 + 1e-7);
          assert.ok(Math.abs(Math.max((1170 * g.scale + 2 * radius) / 780, (435 * g.scale + 2 * radius) / 290) - 1) < 1e-7);
          // Programmatic and UI zoom cannot push the logo beyond the safe area.
          await page.evaluate(() => {window.editorTest.state.zoom = 5;window.editorTest.state.shiftX = 10000;window.editorTest.state.shiftY = -10000;window.editorTest.paint();});
          assert.equal(await page.locator('#safe-area-check').getAttribute('class'), 'check-row ok');
          assert.ok((await page.evaluate(() => window.editorTest.geometry().scale)) <= 1);
        }
      }
    }
    await page.locator('#fit-logo').click();
    await page.selectOption('#preview-background', 'white');
    assert.equal(await page.locator('#artboard').evaluate(node=>getComputedStyle(node).backgroundImage),'none');
    assert.equal(await page.locator('#artboard').evaluate(node=>getComputedStyle(node).backgroundColor),'rgb(255, 255, 255)');
    await page.selectOption('#preview-background','black');
    assert.equal(await page.locator('#artboard').evaluate(node=>getComputedStyle(node).backgroundColor),'rgb(0, 0, 0)');
    await page.selectOption('#preview-background','white');
    const downloadEvent = page.waitForEvent('download');await page.locator('#download-button').click();
    const download = await downloadEvent;
    const exportPath = path.join(os.tmpdir(), 'onions-editor-test-export.png');await download.saveAs(exportPath);
    const png = await fs.readFile(exportPath);
    const pixels = await page.evaluate(async data => {
      const image = new Image();image.src = data;await image.decode();
      const c = document.createElement('canvas');c.width = image.width;c.height = image.height;
      const ctx = c.getContext('2d');ctx.drawImage(image, 0, 0);const d = ctx.getImageData(0, 0, c.width, c.height).data;
      let minX=c.width,minY=c.height,maxX=-1,maxY=-1,dark=0,white=0;
      for(let y=0;y<c.height;y++)for(let x=0;x<c.width;x++){const i=(y*c.width+x)*4;if(d[i+3]){minX=Math.min(minX,x);maxX=Math.max(maxX,x);minY=Math.min(minY,y);maxY=Math.max(maxY,y);if(d[i]<40&&d[i+1]<40&&d[i+2]<40)dark++;if(d[i]>245&&d[i+1]>245&&d[i+2]>245)white++;}}
      const g=window.editorTest.geometry();const hx=Math.round(g.x+690*g.scale),hy=Math.round(g.y+300*g.scale);
      return {width:c.width,height:c.height,cornerAlpha:d[3],holeAlpha:d[(hy*c.width+hx)*4+3],minX,minY,maxX,maxY,dark,white};
    }, 'data:image/png;base64,' + png.toString('base64'));
    assert.equal(pixels.width,800);assert.equal(pixels.height,310);assert.equal(pixels.cornerAlpha,0);assert.equal(pixels.holeAlpha,0);
    assert.ok(pixels.minX>=10 && pixels.minY>=10 && pixels.maxX<790 && pixels.maxY<300);
    assert.ok(pixels.dark>0 && pixels.white>0);
    await page.screenshot({path:path.join(os.tmpdir(),'onions-editor-preview.png'),fullPage:true});
    // Exact alpha scan catches even a faint isolated pixel beyond the first tile.
    const exact = await page.evaluate(async () => {const c=document.createElement('canvas');c.width=2400;c.height=1200;const ctx=c.getContext('2d');ctx.fillRect(200,100,1000,500);ctx.fillStyle='rgba(0,0,0,0.004)';ctx.fillRect(2201,1101,1,1);const image=new Image();image.src=c.toDataURL();await image.decode();return window.editorTest.analyzeImage(image).bounds;});
    assert.deepEqual(exact,{left:200,top:100,right:2202,bottom:1102});
    await load('#000000',true);assert.equal(await page.locator('#download-button').isDisabled(),true);
    await page.locator('#allow-upscale').check();assert.equal(await page.locator('#download-button').isDisabled(),false);
    await page.evaluate(() => {window.editorTest.state.zoom=100;window.editorTest.paint();});
    assert.equal(await page.locator('#safe-area-check').getAttribute('class'),'check-row ok');
    await load('#000000',false,true);assert.equal(await page.locator('#download-button').isDisabled(),true);
    await page.selectOption('#language-select','nl');assert.equal(await page.locator('#fit-logo').textContent(),'Pas en centreer logo');
    await page.setViewportSize({width:390,height:844});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
    await load('#ffffff');
    await page.locator('#more-presets').click();
    for(const preset of ['poster','season-poster','background','clearlogo','banner','icon','clearart','episode-hd','episode-sd']){
      await page.locator(`[data-preset="${preset}"]`).click();
      assert.ok(await page.locator('#preview-image').evaluate(canvas=>{const d=canvas.getContext('2d').getImageData(0,0,canvas.width,canvas.height).data;for(let i=3;i<d.length;i+=4)if(d[i])return true;return false;}),`${preset} preview contains artwork`);
    }
    await page.locator('[data-preset="season-poster"]').click();assert.equal(await page.locator('#season-stamp').isVisible(),true);
    await page.locator('[data-preset="poster"]').click();await page.selectOption('#format-select','jpeg');
    const jpegEvent=page.waitForEvent('download');await page.locator('#download-button').click();const jpeg=await jpegEvent;
    assert.ok(jpeg.suggestedFilename().endsWith('-680x1000.jpg'));
    assert.deepEqual(errors,[]);
    console.log('PASS: exact alpha bounds, proportional fit, 45 color/outline/width cases, gutter/zoom/drag constraints, transparent PNG with double outline and hole, small/empty source checks, Dutch UI and mobile layout.');
    console.log('Preview screenshot:',path.join(os.tmpdir(),'onions-editor-preview.png'));
  } finally { await browser.close(); }
})().catch(error => { console.error(error);process.exitCode=1; });
