const {chromium}=require('C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:1000}}),url='http://127.0.0.1:8765/register-workspace.html?view=register&mode=library';
 const open=async p=>{await p.goto(url);await p.locator('[data-library-add]').click();await p.locator('[data-library-screenshot]').click();};
 await page.addInitScript(()=>{Object.defineProperty(crypto,'subtle',{value:undefined});});
 for(const lang of ['zh-TW','zh-CN','en']){
  await page.goto(url+'&lang='+lang);assert.equal(await page.locator('[data-library-screenshot]').count(),0);await page.locator('[data-library-add]').click();assert.equal(await page.locator('dialog[open]').count(),1);await page.screenshot({path:'artifacts/screenshot-recognition/add-choice-'+lang+'-desktop.png'});
  await page.setViewportSize({width:390,height:844});await page.screenshot({path:'artifacts/screenshot-recognition/add-choice-'+lang+'-mobile.png'});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));await page.keyboard.press('Escape');assert.equal(await page.locator('dialog').count(),0);assert.equal(await page.locator('[data-library-add]').evaluate(e=>e===document.activeElement),true);await page.setViewportSize({width:1440,height:1000});
 }
 await page.locator('[data-library-add]').click();await page.locator('dialog a').click();assert.match(page.url(),/mode=echo/);await page.locator('[data-action="echo"]').waitFor();
 await open(page);
 let release,requested,handled;const finished=new Promise(r=>handled=r);const gate=new Promise(r=>release=r),arrived=new Promise(r=>requested=r);
 await page.route('**/library/ocr/tesseract.min.js',async route=>{requested();await gate;await route.abort();handled();});
 await page.locator('[data-ocr-files]').setInputFiles('image/screenshot-examples/panel.png');await arrived;
 assert.match(await page.locator('[data-ocr-progress]').textContent(),/載入|加载|Loading/);await page.locator('[data-ocr-cancel]').click();await page.waitForFunction(()=>!document.querySelector('[data-ocr-files]').disabled);assert.equal(await page.locator('[data-ocr-retry]').count(),1);release();await finished;await page.unroute('**/library/ocr/tesseract.min.js');await page.locator('[data-ocr-retry]').click();await page.waitForFunction(()=>!document.querySelector('[data-ocr-files]').disabled,{},{timeout:90000});assert.equal(await page.locator('[data-ocr-field="catalogId"]').inputValue(),'186');assert.equal(await page.evaluate(()=>localStorage.getItem('mcData')),null);
 await page.locator('[data-ocr-files]').setInputFiles('image/screenshot-examples/panel.png');await page.waitForFunction(()=>!document.querySelector('[data-ocr-files]').disabled);assert.equal(await page.locator('[data-ocr-item]').count(),1);
 const timed=await browser.newPage();await timed.addInitScript(()=>{const original=window.setTimeout;window.setTimeout=(fn,ms,...args)=>original(fn,ms===90000?100:ms,...args);});await timed.route('**/library/ocr/tesseract.min.js',()=>{});await open(timed);await timed.locator('[data-ocr-files]').setInputFiles('image/screenshot-examples/panel.png');await timed.waitForFunction(()=>document.querySelector('[data-ocr-retry]')&&!document.querySelector('[data-ocr-files]').disabled);assert.match(await timed.locator('[data-ocr-item]').innerText(),/逾時|超时|timed out/);await timed.close();
 const file=await browser.newPage();await file.goto('file:///C:/Users/user/Downloads/WuwaEchoTool/register-workspace.html?view=register&mode=library');await file.locator('[data-library-add]').click();await file.locator('[data-library-screenshot]').click();assert.equal(await file.locator('[data-ocr-files]').isDisabled(),true);assert.match(await file.locator('.rw-ocr [role=alert]').textContent(),/HTML/);await file.screenshot({path:'artifacts/screenshot-recognition/file-protocol-help.png'});
 console.log('PASS add choice in 3 locales/Desktop/Mobile, Escape focus, manual route, unavailable crypto.subtle, loading visibility, cancel/retry, duplicate detection, bounded timeout, file URL guidance, no writes');await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
