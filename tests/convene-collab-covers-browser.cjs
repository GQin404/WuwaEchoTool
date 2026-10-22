// 独立本机来源、合成联动记录：验证两张实际图片解码、失败回退及存档不变。
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {chromium}=require('C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const C=require('../js/convene-core.js'),{fixture}=require('./convene-redesign-fixture.cjs');
const root=path.resolve(__dirname,'..'),out=path.join(root,'artifacts/convene-collab-covers-20261022');
let server,browser;const errors=[];
(async()=>{
 fs.mkdirSync(out,{recursive:true});
 server=http.createServer((req,res)=>{const file=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]));if(!file.startsWith(root+path.sep))return res.writeHead(403).end();fs.readFile(file,(err,data)=>{if(err)return res.writeHead(404).end();res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.webp':'image/webp','.svg':'image/svg+xml','.png':'image/png'}[path.extname(file)]||'application/octet-stream'));res.end(data);});});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const base='http://127.0.0.1:'+server.address().port;
 let a=fixture(3);const info={uid:a.uid,server:a.server,region:a.region};
 for(const [pool,item,kind,label]of [[10,'1511','角色','Dreaming Upon the Moon'],[11,'21030056','武器','Spectral Trigger']])a=C.mergeAccount(a,info,pool,[{time:'2026-06-15 12:00:00',resourceId:item,name:'Synthetic',resourceType:kind,qualityLevel:5,cardPoolType:label}]).account;
 browser=await chromium.launch({channel:'msedge',headless:true});let checked=0;
 for(const locale of ['zh-CN','zh-TW','en']){
  const ctx=await browser.newContext({viewport:{width:1280,height:900}}),page=await ctx.newPage();page.on('pageerror',e=>errors.push(e.message));
  await ctx.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
  await page.goto(base+'/convene.html?view=register&fixture=1&lang='+locale);
  await page.evaluate(d=>ConveneStore.create().merge(d),{version:1,accounts:[a]});await page.reload();
  const saved=await page.evaluate(async()=>JSON.stringify(await ConveneStore.create().read()));
  await page.locator('.cv-tabs [data-view=pools]').click();
  for(const [pool,name]of [[101,'collab-character'],[102,'collab-weapon']]){
   await page.locator('[data-pool-focus]').selectOption(String(pool));
   const image=page.locator('[data-cover-pool="'+pool+'"] img');
   assert.equal(await image.getAttribute('src'),'image/convene-current/'+name+'.webp');
   assert(await image.evaluate(async i=>{await i.decode();return i.complete&&i.naturalWidth>0&&i.naturalHeight>0;}));
   assert.equal(await page.locator('[data-cover-pool="'+pool+'"] .cv-cover-label').count(),0);
   await page.locator('[data-pool-card="'+pool+'"]').screenshot({path:path.join(out,locale+'-'+name+'.png')});checked++;
  }
  await ctx.route('**/image/convene-current/collab-*.webp',r=>r.abort());await page.reload();
  await page.locator('.cv-tabs [data-view=pools]').click();
  for(const pool of [101,102]){
   await page.locator('[data-pool-focus]').selectOption(String(pool));
   await page.waitForFunction(pool=>document.querySelector('[data-cover-pool="'+pool+'"]').dataset.coverMode==='fallback',pool);
   assert(await page.locator('[data-cover-pool="'+pool+'"] img').evaluate(async i=>{await i.decode();return i.naturalWidth>0;}));
  }
  assert.equal(await page.evaluate(async()=>JSON.stringify(await ConveneStore.create().read())),saved);
  await ctx.close();
 }
 assert.deepEqual(errors,[]);console.log('通过：三语6张联动封面成功解码，图片失败可回退，玩家记录未改变。');
 fs.writeFileSync(path.join(out,'result.json'),JSON.stringify({checked,locales:3,fallbacks:6,pageErrors:errors},null,2));
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(async()=>{await browser?.close();await new Promise(r=>server?server.close(r):r());});
