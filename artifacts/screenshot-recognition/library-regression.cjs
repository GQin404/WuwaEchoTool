const {chromium}=require('C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const assert=require('node:assert/strict');
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 const page=await browser.newPage({viewport:{width:1440,height:1100}});
 const base='http://127.0.0.1:8765/register-workspace.html?view=register&';
 await page.goto(base+'mode=import');assert.equal(await page.locator('[data-library-screenshot],[data-import-source],[data-ocr-files]').count(),0);assert.equal(await page.locator('[data-action="fetch"]').count(),1);
 await page.goto(base+'mode=library');await page.screenshot({path:'artifacts/screenshot-recognition/library-entry-desktop.png'});
 await page.setViewportSize({width:390,height:844});await page.screenshot({path:'artifacts/screenshot-recognition/library-entry-mobile.png'});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
 const fixture=await browser.newPage({viewport:{width:620,height:600}});
 await fixture.setContent('<style>body{margin:0;padding:30px;background:#162128;color:#fafafa;font:24px Arial}p{margin:0;height:48px;display:flex;justify-content:space-between}h2{font-size:28px;margin:0 0 20px}</style><h2>Jué +25</h2><p>COST 4</p>'+[['Crit. DMG','44.0%'],['ATK','150'],['ATK','10.1%'],['DEF','40'],['HP','470'],['Crit. Rate','7.5%'],['Energy Regen','10.0%']].map(([key,val])=>'<p><span>'+key+'</span><span>'+val+'</span></p>').join('')+'<p>Echo Skill</p>');
 await fixture.screenshot({path:'artifacts/screenshot-recognition/english-ocr-fixture.png'});await fixture.close();
 await page.setViewportSize({width:1440,height:1100});await page.locator('[data-library-add]').click();await page.locator('[data-library-screenshot]').click();await page.locator('[data-ocr-files]').setInputFiles('artifacts/screenshot-recognition/english-ocr-fixture.png');await page.waitForFunction(()=>document.querySelector('[data-ocr-item]')&&!document.querySelector('[data-ocr-files]').disabled,{},{timeout:90000});
 assert.equal(await page.locator('[data-ocr-field="catalogId"]').inputValue(),'59');
 for(const [i,key,value] of [[0,'atk_percent','10.1'],[1,'def_flat','40'],[2,'hp_flat','470'],[3,'crit_rate','7.5'],[4,'resonance_efficiency','10']]){assert.equal(await page.locator(`[data-ocr-field="sub${i}.key"]`).inputValue(),key);assert.equal(await page.locator(`[data-ocr-field="sub${i}.value"]`).inputValue(),value);}
 assert.equal(await page.locator('.rw-ocr input[type=number]').count(),0);
 const types={crit_rate:0,crit_damage:1,atk_percent:2,hp_percent:2,basic_attack_damage:2,heavy_attack_damage:2,resonance_skill_damage:2,resonance_liberation_damage:2,def_percent:3,resonance_efficiency:4,hp_flat:5,atk_flat:6,def_flat:7};
 await page.locator('[data-ocr-item]').screenshot({path:'artifacts/screenshot-recognition/english-ocr-review.png'});
 for(const [key,index] of Object.entries(types)){
  await page.locator('[data-ocr-field="sub0.key"]').selectOption(key);
  const options=await page.locator('[data-ocr-field="sub0.value"] option').evaluateAll(o=>o.map(x=>x.value));
  const expected=await page.evaluate(i=>['',...fctValue[i].values.map(v=>String(parseFloat(v)))],index);assert.deepEqual(options,expected);
 }
 await page.locator('[data-ocr-field="detectedCost"]').selectOption('1');assert.equal(await page.locator('[data-ocr-field="main.key"]').inputValue(),'');await page.locator('[data-ocr-field="main.key"]').selectOption('atk_percent');assert.deepEqual(await page.locator('[data-ocr-field="main.value"] option').evaluateAll(o=>o.map(x=>x.value)),['','18']);
 await page.locator('[data-library-screenshot-back]').click();assert.equal(await page.locator('[data-ocr-files]').count(),0);await page.locator('[data-library-add]').click();await page.locator('[data-library-screenshot]').click();assert.equal(await page.locator('[data-ocr-item]').count(),0);assert.equal(await page.evaluate(()=>localStorage.getItem('mcData')),null);
 console.log('PASS library entry Desktop/Mobile, original import retained, real OCR English fixture maps to Chinese catalog, percent/flat, all fixed dropdown options, Cost reset, fresh session and no writes');await browser.close();
})().catch(e=>{console.error(e);process.exit(1)});
