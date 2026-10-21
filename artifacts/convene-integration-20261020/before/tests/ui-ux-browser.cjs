/* 使用独立本机来源和合成数据验证导出及连续操作，不访问玩家账号。 */
const {chromium}=require('C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {seed}=require('./register-operations-browser.cjs'),root=path.resolve(__dirname,'..'),out=require('./browser-qa.cjs').output('ui-ux-focused');
fs.mkdirSync(out,{recursive:true});let server,browser;const errors=[],exportsChecked=[];
(async()=>{
 server=http.createServer((req,res)=>{const file=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]));if(!file.startsWith(root+path.sep))return res.writeHead(403).end();fs.readFile(file,(error,data)=>{if(error)return res.writeHead(404).end();res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.webp':'image/webp'}[path.extname(file)]||'application/octet-stream'));res.end(data);});});
 await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));const base='http://127.0.0.1:'+server.address().port;browser=await chromium.launch({channel:'msedge',headless:true});
 for(const locale of ['zh-TW','zh-CN','en']){
  const context=await browser.newContext({viewport:{width:390,height:844},reducedMotion:'reduce'}),page=await context.newPage();page.on('pageerror',e=>errors.push(e.message));page.on('dialog',d=>d.accept());
  await context.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
  const work=mode=>base+'/register-workspace.html?view=register&lang='+locale+'&mode='+mode;
  await page.goto(work('library'));await page.locator('#register-workspace').waitFor();await seed(page,false);await page.goto(base+'/mccost.html?view=register&roleid=100&lang='+locale);await page.locator('.rr-evaluation').waitFor();
  assert.ok(await page.evaluate(()=>document.querySelector('.rr-evaluation').getBoundingClientRect().top<document.querySelector('.rr-loadout').getBoundingClientRect().top));
  await page.locator('[data-rr-select="3"].rr-slot-trigger').click();await require('./browser-qa.cjs').openDetails(page,'.rr-substats-details');
  assert.ok(await page.locator('.rr-substats tbody th').first().evaluate(e=>e.getBoundingClientRect().width>=e.closest('table').getBoundingClientRect().width-1));
  await page.screenshot({path:path.join(out,locale+'-mobile-analysis.png'),fullPage:true});
  const before=await page.evaluate(()=>localStorage.getItem('mcData'));
  // 记录实际 Canvas 文字边界与共鸣符号，不替换绘制实现。
  await page.evaluate(()=>{const proto=CanvasRenderingContext2D.prototype,fillText=proto.fillText,moveTo=proto.moveTo;window.qaText=[];window.qaMoves=[];proto.fillText=function(text,x,y,...args){if(this.canvas.closest('.rr-share-dialog')){const size=parseFloat(this.font.match(/([\d.]+)px/)[1]),width=this.measureText(text).width;window.qaText.push({text,x,y,size,width,align:this.textAlign});}return fillText.call(this,text,x,y,...args);};proto.moveTo=function(x,y){if(this.canvas.closest('.rr-share-dialog'))window.qaMoves.push({x,y});return moveTo.call(this,x,y);};});
  for(const scenario of ['normal','long','partial','unknown','empty'])for(const mode of ['compact','detailed']){
   await page.evaluate(async({locale,scenario})=>{
    const normalize=RoleViewModel.createAdapter({roleList,costList,suiteAttributeMap,newCharacterModels,getRoleScoreConfig,getScoreDetails,countScores,countMainAttr,countMainAttr2,getRoleEnergyCorrection}),data=JSON.parse(localStorage.getItem('mcData')),model=normalize(data.role[0]);
    model.slots.forEach(s=>{if(s.echo)s.echo.image='image/cost/'+String(s.echo.catalogId).padStart(3,'0')+'.png';});
    if(scenario==='long'){model.role.catalogId=999;model.role.legacy.name='Long character identity with extended name for localized layout';model.slots[0].echo.catalogId=999;model.slots[0].echo.legacy.name='Long Echo identity with a complete multi-line name for sharing without truncation '.repeat(2);}
    if(scenario==='partial'){model.summary.status='incomplete';model.summary.score=null;model.slots[2].echo.substats=[];model.slots[2].status='incomplete';}
    if(scenario==='unknown'){model.model.status='unavailable';model.summary.score=null;model.summary.status='unavailable';}
    if(scenario==='empty'){model.slots.forEach(s=>{s.echo=null;s.status='empty';});model.summary.status='incomplete';model.summary.score=null;model.summary.substatTotals=[];}
    window.qaText=[];window.qaMoves=[];await RegisterShare.open(model,EchoI18n.create({language:locale}));
   },{locale,scenario});
   await page.locator('.rr-share-choices button').nth(mode==='compact'?0:1).click();await page.waitForFunction(()=>!document.querySelector('.rr-share-dialog .rr-dialog-actions button:nth-child(2)').disabled);
   const canvas=await page.locator('.rr-share-dialog canvas').evaluate(c=>({width:c.width,height:c.height,png:c.toDataURL().split(',')[1]})),measure=await page.evaluate(()=>({text:qaText,moves:qaMoves}));
   assert.equal(canvas.width,mode==='compact'?1440:2040);assert.ok(canvas.height>=1000);assert.ok(measure.text.every(r=>r.y-r.size>=0&&r.y+Math.ceil(r.size*.25)<canvas.height));
   assert.ok(measure.text.every(r=>r.align==='right'?r.x-r.width>=0:r.align==='center'?r.x-r.width/2>=0&&r.x+r.width/2<=canvas.width:r.x+r.width<=canvas.width));
   const footer=canvas.height-65;
   assert.equal(measure.moves.filter(r=>Math.abs(r.x-canvas.width/2)<=44&&r.y>=footer-26&&r.y<=footer).length,5,'resonance footer retains five symbols');
   if(scenario==='long'&&mode==='compact')assert.ok(canvas.height>1150);
   const downloadEvent=page.waitForEvent('download');await page.locator('.rr-share-dialog .rr-dialog-actions button').nth(1).click();const download=await downloadEvent,file=path.join(out,locale+'-'+scenario+'-'+mode+'.png');await download.saveAs(file);assert.deepEqual(fs.readFileSync(file),Buffer.from(canvas.png,'base64'),'download equals preview pixels');
   if(scenario==='long'&&mode==='detailed')await page.screenshot({path:path.join(out,locale+'-mobile-share.png')});
   exportsChecked.push({locale,scenario,mode,width:canvas.width,height:canvas.height,previewMatchesDownload:true,resonanceSymbols:5});await page.keyboard.press('Escape');
  }
  assert.equal(await page.evaluate(()=>localStorage.getItem('mcData')),before);
  // 收藏与 Escape 返回必须保留页面位置及会话状态。
  await page.goto(work('library'));await page.locator('[data-library-select]').nth(6).scrollIntoViewIfNeeded();const scroll=await page.evaluate(()=>scrollY);await page.locator('[data-library-favorite]').nth(6).focus();await page.keyboard.press('Space');assert.ok(Math.abs(await page.evaluate(()=>scrollY)-scroll)<2);
  await page.locator('[data-library-select]').nth(6).click();await page.keyboard.press('Escape');assert.equal(await page.evaluate(()=>RegisterNavigation.create(sessionStorage).load('library').detailOpen),false);
  await page.reload();assert.equal(await page.locator('.rw-inspector.is-open').count(),0);
  // 同时触发两次历史刷新，后完成的旧请求不能覆盖删除后的列表。
  await page.goto(work('library'));await seed(page,true);await page.goto(work('compare'));await page.locator('[data-delete-draft]').first().waitFor();
  await page.evaluate(()=>{const digest=crypto.subtle.digest.bind(crypto.subtle);window.qaRelease=[];crypto.subtle.digest=(...args)=>new Promise(resolve=>qaRelease.push(()=>resolve(digest(...args))));window.dispatchEvent(new Event('focus'));});
  await page.waitForFunction(()=>qaRelease.length>0);await page.locator('[data-delete-draft]').first().click();
  await page.evaluate(()=>{const pending=qaRelease.splice(0);pending.reverse().forEach(release=>release());});await page.waitForFunction(()=>document.querySelectorAll('[data-delete-draft]').length===5);
  assert.equal(await page.locator('.rw-notice').getAttribute('role'),'status');
  await context.close();
 }
 assert.deepEqual(errors,[]);fs.writeFileSync(path.join(out,'results.json'),JSON.stringify({exports:exportsChecked,pageErrors:errors,isolatedSyntheticData:true,classicCoreUnchanged:true},null,2));console.log('PASS: '+exportsChecked.length+' PNG exports match previews; footer, long names, missing data, session retention and history races.');
})().catch(error=>{console.error(error);process.exitCode=1;}).finally(async()=>{await browser?.close();server?.close();});
