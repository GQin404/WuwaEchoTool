/* 真实浏览器刷新恢复验收；仅本地服务、隔离上下文和合成存档。 */
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),vm=require('node:vm'),assert=require('node:assert/strict');
const {chromium}=require('C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const MC=require('../js/multi-config.js'),Core=require('../js/character-core.js');
const root=path.resolve(__dirname,'..'),out=process.env.WUWA_RECOVERY_OUT;
const env={$:()=>{},console:{log(){}}};vm.runInNewContext(fs.readFileSync(path.join(root,'js/base.js'),'utf8')+';globalThis.catalog={roleList,costList};',env);
const entry=env.catalog.roleList[0],echo=env.catalog.costList.find(e=>e.type==='Cost4');
function fixture(){
 const data=MC.migrate({role:[Core.createRole(entry,'fixture-role')],unusedEchoes:[{...Core.createEcho(echo,'fixture-echo'),mainAtrri:'暴击22%'}]});
 data.role[0].costList=null;data.unusedEchoes=null;return data;
}
let server,browser;
(async()=>{
 server=http.createServer((q,r)=>{
  const file=path.resolve(root,'.'+decodeURIComponent(q.url.split('?')[0]));
  if(!file.startsWith(root+path.sep))return r.writeHead(403).end();
  fs.readFile(file,(error,bytes)=>{if(error)return r.writeHead(404).end();r.setHeader('Content-Type',({'.html':'text/html; charset=utf-8','.js':'text/javascript; charset=utf-8','.css':'text/css','.png':'image/png','.webp':'image/webp'}[path.extname(file)]||'application/octet-stream'));r.end(bytes);});
 });
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const base='http://127.0.0.1:'+server.address().port;
 browser=await chromium.launch({channel:'msedge',headless:true});const reports=[];
 for(const [width,locale] of [[1440,'zh-TW'],[390,'zh-CN'],[1440,'en']]){
  const context=await browser.newContext({viewport:{width,height:1000},acceptDownloads:true}),page=await context.newPage(),errors=[];
  page.on('pageerror',e=>errors.push(e.message));
  await context.route('**/*',route=>new URL(route.request().url()).hostname==='127.0.0.1'?route.continue():route.abort());
  const raw=JSON.stringify(fixture());await context.addInitScript(raw=>{if(!sessionStorage.getItem('recovery-fixture')){localStorage.setItem('mcData',raw);sessionStorage.setItem('recovery-fixture','seeded');}},raw);
  const work=mode=>base+'/register-workspace.html?view=register&lang='+locale+'&mode='+mode;
  await page.goto(base+'/index.html?view=register&lang='+locale);await page.locator('#character-dock').waitFor();
  assert.equal(await page.locator('.mc-boot-error').count(),0);assert.equal(await page.evaluate(()=>!!MultiConfigUI.bootError),false);
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('mcData')).role.length),1);
  assert.equal(await page.evaluate(key=>JSON.parse(localStorage.getItem(key)).snapshots[0].values.mcData,Core.COMPATIBILITY_BACKUP),raw);
  const repaired=await page.evaluate(()=>localStorage.getItem('mcData'));await page.reload();assert.equal(await page.evaluate(()=>localStorage.getItem('mcData')),repaired);
  await page.goto(work('library'));await page.locator('#register-workspace').waitFor();assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('mcData')).unusedEchoes.length),1);
  await page.goto(work('create'));await page.locator('form[data-action=create]').waitFor();
  await Promise.all([page.waitForURL('**/mccost.html?**'),page.locator('form[data-action=create] button[type=submit]').click()]);
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('mcData')).role.length),2);
  await page.goto(work('echo'));await page.locator('form[data-action=echo]').waitFor();
  await Promise.all([page.waitForURL('**/register-workspace.html?**mode=library**'),page.locator('form[data-action=echo] button[type=submit]').click()]);
  await page.reload();assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('mcData')).unusedEchoes.length),2);
  if(out){fs.mkdirSync(out,{recursive:true});await page.screenshot({path:path.join(out,'recovered-'+locale+'.png'),fullPage:true});}
  // 损坏 JSON 仍可逐字节导出，并且失败页不允许通过旧保存入口写回。
  const broken='{broken original';await page.evaluate(raw=>localStorage.setItem('mcData',raw),broken);await page.goto(work('create'));
  await page.locator('.mc-boot-error button').waitFor();assert.equal(await page.locator('#register-workspace').evaluate(el=>el.inert),true);
  const locked=await page.evaluate(()=>{try{saveDataToCache({role:[],unusedEchoes:[]});return false;}catch(_){return true;}});assert.equal(locked,true);
  assert.equal(await page.evaluate(()=>localStorage.getItem('mcData')),broken);
  const [download]=await Promise.all([page.waitForEvent('download'),page.locator('.mc-boot-error button').click()]);
  const stream=await download.createReadStream(),chunks=[];for await(const chunk of stream)chunks.push(chunk);
  assert.equal(JSON.parse(Buffer.concat(chunks).toString('utf8')).values.mcData,broken);
  assert.ok(!/mc\.rawBackup|mc\.migrationError/.test(await page.locator('.mc-boot-error').innerText()));
  for(const [language,label] of [['en','Download raw data backup'],['zh-TW','下載原始資料備份'],['zh-CN','下载原始数据备份']]){
   if(!await page.locator('#register-shell details').evaluate(el=>el.open))await page.locator('#register-shell details summary').click();
   await page.locator('[data-ui-locale]').selectOption(language);assert.equal(await page.locator('.mc-boot-error button').innerText(),label);
  }
  if(!await page.locator('#register-shell details').evaluate(el=>el.open))await page.locator('#register-shell details summary').click();
  await page.locator('[data-ui-locale]').selectOption(locale);
  if(await page.locator('#register-shell details').evaluate(el=>el.open))await page.locator('#register-shell details summary').click();
  if(out)await page.screenshot({path:path.join(out,'blocked-'+locale+'.png'),fullPage:true});
  assert.deepEqual(errors,[]);reports.push({width,locale,refreshRecovery:true,createAndSave:true,rawExport:true,writeBlocked:true});await context.close();
 }
 console.log(JSON.stringify(reports,null,2));
})().catch(error=>{console.error(error);process.exitCode=1;}).finally(async()=>{await browser?.close();server?.close();});
