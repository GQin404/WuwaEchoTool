// Isolated real-browser acceptance for the existing character-workspace tabs.
const {chromium}=require('C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),out=require('./browser-qa.cjs').output('register-tabs');
fs.mkdirSync(out,{recursive:true});
let server,browser;const results=[],errors=[];
const style=tab=>tab.evaluate(e=>{const s=getComputedStyle(e),r=e.getBoundingClientRect();return {background:s.backgroundColor,color:s.color,weight:s.fontWeight,line:s.borderBottomColor,lineWidth:s.borderBottomWidth,outline:s.outlineStyle,outlineWidth:s.outlineWidth,transition:s.transitionDuration,cursor:s.cursor,width:r.width,height:r.height};});
async function selected(page,view){
 const tab=page.locator('[data-dock-view='+view+']'),other=view==='overview'?'roles':'overview';
 assert.equal(await tab.getAttribute('aria-selected'),'true');
 assert.equal(await tab.getAttribute('tabindex'),'0');
 assert.equal(await page.locator('[data-dock-view='+other+']').getAttribute('aria-selected'),'false');
 assert.equal(await page.locator('[data-dock-view='+other+']').getAttribute('tabindex'),'-1');
 assert.ok(await page.locator('#dock-panel-'+view).isVisible());
 assert.ok(!await page.locator('#dock-panel-'+other).isVisible());
 assert.equal(await tab.getAttribute('aria-controls'),'dock-panel-'+view);
 assert.equal(await page.locator('#dock-panel-'+view).getAttribute('role'),'tabpanel');
}
(async()=>{
 server=http.createServer((req,res)=>{const file=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]));if(!file.startsWith(root+path.sep))return res.writeHead(403).end();fs.readFile(file,(err,data)=>{if(err)return res.writeHead(404).end();res.setHeader('Content-Type',({'.html':'text/html','.css':'text/css','.js':'text/javascript','.png':'image/png'}[path.extname(file)]||'application/octet-stream'));res.end(data);});});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));const base='http://127.0.0.1:'+server.address().port;
 browser=await chromium.launch({channel:'msedge',headless:true});
 for(const width of require('./browser-qa.cjs').widths([1440,1024,390,360]))for(const locale of ['zh-TW','zh-CN','en']){
  const context=await browser.newContext({viewport:{width,height:width<700?844:1000},reducedMotion:'no-preference'}),page=await context.newPage();
  page.on('pageerror',e=>errors.push(e.message));await context.route('**/*',route=>new URL(route.request().url()).hostname==='127.0.0.1'?route.continue():route.abort());
  const url=base+'/index.html?view=register&lang='+locale;
  await page.goto(url);await page.locator('[role=tablist]').waitFor();
  await page.evaluate(()=>{localStorage.setItem('mcData',JSON.stringify({role:roleList.slice(0,2).map((r,i)=>({roleId:100+i,roleListId:r.id,name:r.name,cls:r.cls,level:90,ming:0,isImport:false,costList:[]})),unusedEchoes:[]}));sessionStorage.clear();});
  await page.reload();const overview=page.locator('[data-dock-view=overview]'),roles=page.locator('[data-dock-view=roles]');
  await selected(page,'overview');await page.mouse.move(0,0);
  const initial=await style(overview),idle=await style(roles);
  assert.equal(initial.lineWidth,'3px');assert.equal(idle.line,'rgba(0, 0, 0, 0)');assert.ok(+initial.weight>+idle.weight);assert.notEqual(initial.background,idle.background);assert.notEqual(initial.color,idle.color);assert.equal(idle.cursor,'pointer');assert.ok(idle.height>=48);assert.equal(idle.transition,'0.18s, 0.18s, 0.18s');
  const listWidth=await page.locator('[role=tablist]').evaluate(e=>e.getBoundingClientRect().width);
  if(width<700)assert.ok(Math.abs(initial.width-idle.width)<1);else assert.ok(initial.width+idle.width<listWidth*.8);
  if(width===1440&&locale==='zh-TW')await page.screenshot({path:path.join(out,'desktop-selected.png')});
  await roles.hover();await page.waitForTimeout(220);const hover=await style(roles);
  assert.notEqual(hover.background,idle.background);assert.notEqual(hover.color,idle.color);assert.notEqual(hover.background,initial.background);assert.equal(hover.line,idle.line);await selected(page,'overview');
  if(width===1440&&locale==='zh-TW')await page.screenshot({path:path.join(out,'desktop-hover.png')});
  await roles.click();await selected(page,'roles');await page.waitForFunction(expected=>getComputedStyle(document.querySelector('[data-dock-view=roles]')).backgroundColor===expected,initial.background);assert.equal((await style(roles)).background,initial.background);
  const core=await page.evaluate(()=>localStorage.getItem('mcData'));assert.equal(await page.locator('.dock-character-link').count(),2);
  await page.locator('[data-dock-picker] summary').click();await page.locator('[data-dock-source]').selectOption('manual');await page.locator('[data-dock-sort]').selectOption('name');await page.locator('[data-dock-search]').fill('NO MATCH');
  await overview.click();await roles.click();assert.equal(await page.locator('[data-dock-search]').inputValue(),'NO MATCH');assert.equal(await page.locator('[data-dock-source]').inputValue(),'manual');assert.equal(await page.locator('[data-dock-sort]').inputValue(),'name');assert.ok(await page.locator('[data-dock-picker]').evaluate(e=>e.open));
  await page.locator('[data-dock-search]').fill('');assert.equal(await page.locator('.dock-character-link').count(),2);
  // Tab enters the tablist at its sole selected tab; arrows automatically activate.
  await roles.focus();await page.keyboard.press('Shift+Tab');await page.keyboard.press('Tab');assert.ok(await roles.evaluate(e=>e===document.activeElement));
  await page.keyboard.press('ArrowLeft');await selected(page,'overview');assert.ok(await overview.evaluate(e=>e===document.activeElement));
  await page.waitForTimeout(220);const focus=await style(overview);assert.equal(focus.outline,'solid');assert.equal(focus.outlineWidth,'2px');assert.ok(await overview.evaluate(e=>e.matches(':focus-visible')));
  if(width===1440&&locale==='zh-TW')await page.screenshot({path:path.join(out,'desktop-focus.png')});
  await page.keyboard.press('ArrowRight');await selected(page,'roles');await page.keyboard.press('Home');await selected(page,'overview');await page.keyboard.press('End');await selected(page,'roles');await page.keyboard.press('ArrowRight');await selected(page,'overview');await page.keyboard.press('ArrowLeft');await selected(page,'roles');
  await page.keyboard.press('Tab');assert.ok(!await page.locator('[role=tablist]').evaluate(e=>e.contains(document.activeElement)));
  assert.equal(await page.evaluate(()=>localStorage.getItem('mcData')),core);
  assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
  if(width===390&&locale==='zh-TW'){await page.mouse.move(0,0);await page.screenshot({path:path.join(out,'mobile-roles.png')});await overview.click();await page.waitForTimeout(220);await page.screenshot({path:path.join(out,'mobile-overview.png')});}
  await page.emulateMedia({reducedMotion:'reduce'});assert.ok((await style(roles)).transition.split(',').every(v=>parseFloat(v)===0));
  results.push({width,locale,passed:true,checks:'selected/panel sync, hover, click, roving Tab, arrows/wrap, Home/End, focus, filters and mcData retained, responsive widths, no overflow, reduced motion'});
  await context.close();
 }
 assert.deepEqual(errors,[]);fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({isolated:true,browser:'headless Microsoft Edge',realMobileDevice:false,results,pageErrors:errors},null,2));console.log('PASS: '+results.length+' tab interaction scenarios; 5 actual browser screenshots; no page errors.');
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(async()=>{await browser?.close();server?.close();});
