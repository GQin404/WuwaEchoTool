/* Isolated, offline browser acceptance. No personal browser profile or official account is used. */
const {chromium}=require('C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),http=require('node:http'),path=require('node:path'),vm=require('node:vm'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..'),out=require('./browser-qa.cjs').output('official-import');fs.mkdirSync(out,{recursive:true});
const env={$:()=>{},console:{log(){}}};vm.runInNewContext(fs.readFileSync(path.join(root,'js/base.js'),'utf8')+';globalThis.api={roleList,costList};',env);
const entries=env.api.roleList.slice(0,3),echoes=[59,51,52,35,39].map(id=>env.api.costList.find(e=>e.id===id));
const list=entries.map(r=>({roleId:r.gid,roleName:r.name,level:90}));
const reports=[],errors=[];let base,server,browser;
function detail(){return {level:90,chainList:[{unlocked:true},{unlocked:false}],weaponData:{level:90,resonLevel:1,weapon:{weaponName:'Fixture weapon',weaponStarLevel:5,weaponId:99,weaponIcon:base+'/image/weapon.png'}},skillList:[{level:10,skill:{name:'Fixture skill',iconUrl:base+'/image/weapon.png'}}],phantomData:{equipPhantomList:echoes.map((e,i)=>({phantomProp:{phantomPropId:900000+i,name:e.name,cost:Number(e.type.replace('Cost','')),iconUrl:base+'/image/cost/'+String(e.id).padStart(3,'0')+'.png'},fetterDetail:{iconUrl:base+'/image/weapon.png'},mainProps:[{attributeName:['暴击','衍射伤害加成','共鸣效率','攻击','攻击'][i],attributeValue:['22%','30%','32%','18%','18%'][i]}],subProps:[['暴击','8.1%'],['暴击伤害','16.2%'],['攻击','8.6%'],['共鸣技能伤害加成','8.6%'],['共鸣效率','8.4%']].map(([attributeName,attributeValue])=>({attributeName,attributeValue}))}))}};}
async function context(options={}){
 const context=await browser.newContext({viewport:{width:options.width||1440,height:options.width&&options.width<700?844:1100},reducedMotion:'reduce'}),page=await context.newPage();
 const control={mode:'normal',list:list,delay:0,failed:new Set(),requests:[],auth:0};
 await context.route('**/*',async route=>{
  const request=route.request(),url=new URL(request.url());
  if(url.hostname==='127.0.0.1'){await route.continue();return;}
  if(url.hostname!=='api.kurobbs.com'){await route.abort();return;}
  if(request.method()==='OPTIONS'){await route.fulfill({status:204,headers:{'Access-Control-Allow-Origin':'*','Access-Control-Allow-Headers':'*','Access-Control-Allow-Methods':'POST,OPTIONS'}});return;}
  const method=url.pathname.split('/').pop(),body=new URLSearchParams(request.postData()||'');control.requests.push(method);
  let value={success:true,code:200};
  if(control.delay&&method==='getRoleDetail')await new Promise(r=>setTimeout(r,control.delay));
  if(method==='queryUsage'&&control.mode==='invalid')value={code:220,msg:'访问令牌已失效'};
  else if(method==='requestToken'){
   control.auth++;value=control.mode==='verification'?{code:200,data:{geeTest:true}}:{code:200,data:{accessToken:'fixture-access'}};
  }else if(method==='roleData')value={code:200,data:{roleList:control.list}};
  else if(method==='getRoleDetail'){
   assert.equal(request.headers().token,undefined);assert.equal(request.headers()['b-at'],'fixture-access');
   value=control.failed.has(body.get('id'))?{code:503,msg:'系统维护'}:{code:200,data:detail()};
   if(control.mode==='unknownEcho')value.data.phantomData.equipPhantomList[0].phantomProp.name='Unknown fixture echo';
   if(control.mode==='incomplete'){value.data.phantomData.equipPhantomList[0].mainProps=[];value.data.phantomData.equipPhantomList[0].subProps=[];delete value.data.weaponData.weapon.weaponIcon;}
   if(control.mode==='dataToken'){control.mode='normal';value={code:999,msg:'数据令牌已失效'};}
  }
  await route.fulfill({status:200,contentType:'application/json',headers:{'Access-Control-Allow-Origin':'*'},body:JSON.stringify(value)}).catch(()=>{});
 });
 page.on('pageerror',e=>errors.push(page.url()+': '+e.stack));page.on('dialog',d=>d.accept());
 await page.goto(base+'/register-workspace.html?view=register&mode=import&lang='+(options.locale||'zh-TW'));
 return {context,page,control};
}
async function connect(page){await page.locator('#ri-uid').fill('123456789');await page.locator('#ri-token').fill('fixture-token');await page.locator('[data-ri-connect] button.rw-primary').click();await page.locator('#ri-search').waitFor();}
async function read(page){for(const select of await page.locator('[data-ri-decision]').all()){const option=select.locator('option[value^="update:"]');if(await option.count())await select.selectOption(await option.first().getAttribute('value'));}await page.locator('[data-ri-action=read]').click();await page.waitForFunction(()=>!document.querySelector('[data-ri-action=cancel]')&&!!document.querySelector('[data-ri-action=save]'));if(await page.locator('[data-ri-overwrite-ack]').count())await page.locator('[data-ri-overwrite-ack]').check();}
async function capture(page,name){
 assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'horizontal overflow: '+name);
 assert.equal(await page.locator('#register-workspace').innerText().then(t=>/official\.|workspace\.importReason|issues\./.test(t)),false,'raw translation keys: '+name);
 assert.equal(await page.locator('#ri-token').getAttribute('type'),'password');
 await page.screenshot({path:path.join(out,name+'.png'),fullPage:true});
}
(async()=>{
 server=http.createServer((req,res)=>{const file=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]));if(!file.startsWith(root+path.sep)){res.writeHead(403).end();return;}fs.readFile(file,(error,data)=>{if(error){res.writeHead(404).end();return;}res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.webp':'image/webp'}[path.extname(file)]||'application/octet-stream'));res.end(data);});});
 await new Promise(r=>server.listen(0,'127.0.0.1',r));base='http://127.0.0.1:'+server.address().port;
 browser=await chromium.launch({channel:'msedge',headless:true});
 for(const width of [1440,320])for(const locale of ['zh-TW','zh-CN','en']){
  const {page,context,control}=await contextFor({width,locale});
  const reported=[{roleId:990052,roleName:'绯雪',level:90},{roleId:990055,roleName:'丽贝卡',level:40},{roleId:990056,roleName:'洛瑟菈',level:90}];
  control.list=reported;await connect(page);
  assert.equal(await page.locator('[data-ri-select]:disabled').count(),0);
  for(const row of reported)assert.ok((await page.locator('#register-workspace').innerText()).includes(row.roleName));
  await page.locator('[data-ri-action=all]').click();await read(page);
  assert.equal(await page.locator('[data-ri-details]').count(),3);
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('mcData')).role.length),0);
  await page.locator('[data-ri-action=save]').click();await page.locator('.ri-result-summary').waitFor();
  const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('mcData')).role);
  assert.deepEqual(saved.map(r=>r.roleListId),[52,55,56]);
  assert.deepEqual(saved.map(r=>r.importSource.gameRoleId),reported.map(r=>String(r.roleId)));
  assert.equal(await page.evaluate(()=>roleList.find(r=>r.id===55).name),'丽贝卡');
  await capture(page,width+'-'+locale+'-reported-characters');
  reports.push({width,locale,scenario:'reported three characters: official simplified names, selectable, preview, explicit save and source identity',passed:true});await context.close();
 }
 for(const width of require('./browser-qa.cjs').widths([1440,1024,390,360]))for(const locale of ['zh-TW','zh-CN','en']){
  const {page,context,control}=await contextFor({width,locale});const prefix=width+'-'+locale;
  assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('mcData')).role.length),0);await capture(page,prefix+'-connect');
  await page.locator('#ri-token').fill('fixture-token');await page.locator('[data-ri-action=toggle]').click();assert.equal(await page.locator('#ri-token').getAttribute('type'),'text');await page.locator('[data-ri-action=toggle]').click();
  await connect(page);await capture(page,prefix+'-select');
  assert.equal(await page.locator('[data-ri-select]').count(),3);await page.locator('[data-ri-select="0"]').check();await page.locator('#ri-search').fill('NO_MATCH');assert.equal(await page.locator('[data-ri-select]').count(),0);await page.locator('#ri-search').fill(entries[1].name);await page.locator('[data-ri-action=all]').click();await page.locator('#ri-search').fill('');assert.equal(await page.locator('[data-ri-select]:checked').count(),2);
  await page.locator('#ri-search').fill('Jinhsi');assert.equal(await page.locator('[data-ri-select]').count(),1);await page.locator('#ri-search').fill('');
  assert.ok(await page.locator('#ri-search').evaluate(e=>e===document.activeElement));await page.locator('[data-ri-action=all]').click();
  control.failed.add(String(entries[1].gid));await read(page);assert.equal(await page.locator('[data-ri-details]').count(),2);assert.equal(await page.locator('details[data-ri-details][open]').count(),0);assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('mcData')).role.length),0);
  await page.locator('[data-ri-details="0"] summary').click();await capture(page,prefix+'-partial-preview');
  const requestsBefore=control.requests.length;await page.evaluate(()=>window.dispatchEvent(new CustomEvent('wuwa-locale',{detail:'en'})));assert.equal(control.requests.length,requestsBefore);assert.equal(await page.locator('[data-ri-select]:checked').count(),3);await page.evaluate(locale=>window.dispatchEvent(new CustomEvent('wuwa-locale',{detail:locale})),locale);
  assert.ok(await page.locator('[data-ri-action=save]').isDisabled());await capture(page,prefix+'-blocked-partial-save');
  control.failed.clear();const firstReads=control.requests.filter(x=>x==='getRoleDetail').length;await page.locator('[data-ri-action=retry]').click();await page.waitForFunction(()=>!!document.querySelector('[data-ri-action=save]')&&!document.querySelector('[data-ri-action=cancel]'));assert.equal(control.requests.filter(x=>x==='getRoleDetail').length,firstReads+1);await page.locator('[data-ri-action=save]').click();await page.locator('.ri-result-summary').waitFor();assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('mcData')).role.length),3);
  await page.locator('[data-ri-row="1"] a').last().click();await page.locator('#role-register .rr-slot').first().waitFor();assert.match(page.url(),/view=register/);assert.match(page.url(),new RegExp('lang='+locale));assert.equal(await page.locator('.rr-slot').count(),5);await page.screenshot({path:path.join(out,prefix+'-analysis.png'),fullPage:true});
  reports.push({width,locale,flow:'connect → multi-select/search → block partial commit → retry failed → atomic save → analyze',passed:true});await context.close();
 }
 // Empty, saved credentials, unknown mapping, invalid credentials and official verification.
 for(const mode of ['empty','saved','unknown','invalid','verification','unknownEcho','dataToken','incomplete']){
  const {context,page,control}=await contextFor({width:390,locale:'en'});control.mode=mode;
  if(mode==='saved'){await page.evaluate(()=>localStorage.setItem('kjq_token','fixture-token'));await page.reload();assert.match(await page.locator('#ri-credential-state').textContent(),/not been verified/);}
  if(mode==='empty')control.list=[];if(mode==='unknown')control.list=[...list,{roleId:999999,roleName:'Unknown fixture character'}];
  await page.locator('#ri-uid').fill('123456789');if(mode!=='saved')await page.locator('#ri-token').fill('fixture-token');await page.locator('[data-ri-connect] .rw-primary').click();
  if(['invalid','verification'].includes(mode)){await page.waitForFunction(()=>!!document.querySelector('#ri-error').textContent);assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('mcData')).role.length),0);}
  else {await page.locator('#ri-search').waitFor();if(mode==='unknown')assert.equal(await page.locator('[data-ri-select="3"]').isDisabled(),true);if(['unknownEcho','dataToken','incomplete'].includes(mode)){await page.locator('[data-ri-select="0"]').check();await read(page);if(mode==='unknownEcho')assert.ok(await page.locator('[data-ri-action=save]').isDisabled());else if(mode==='dataToken')assert.equal(control.auth,2);else {await page.locator('[data-ri-details="0"] summary').click();assert.ok(await page.locator('.ri-issues li').count());assert.ok(!/^0/.test(await page.locator('.ri-metrics strong').textContent()));assert.match(await page.locator('.ri-detail').textContent(),/Fixture weapon/);assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('mcData')).role.length),0);}}}
  await capture(page,'state-'+mode+'-mobile');if(mode==='saved'){assert.equal(control.requests.includes('queryUsage'),false);await page.locator('[data-ri-action=clear]').click();assert.equal(await page.evaluate(()=>localStorage.getItem('kjq_token')),null);}
  reports.push({scenario:mode,passed:true});await context.close();
 }
 // Cancel, stale UID responses, update conflict, failed storage and idempotence through real DOM.
 {
  const {context,page,control}=await contextFor({width:1440,locale:'zh-TW'});await connect(page);await page.locator('[data-ri-action=all]').click();control.delay=500;await page.locator('[data-ri-action=read]').click();await page.locator('[data-ri-action=cancel]').click();await page.waitForTimeout(700);assert.equal(control.requests.filter(x=>x==='getRoleDetail').length,1);assert.equal(await page.locator('[data-ri-details]').count(),0);assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('mcData')).role.length),0);await capture(page,'state-cancel-desktop');
  await page.locator('[data-ri-action=retry]').click();await page.locator('#ri-uid').fill('987654321');await page.waitForTimeout(700);assert.equal(await page.locator('[data-ri-details]').count(),0);assert.equal(await page.locator('#ri-search').count(),0);
  control.delay=0;await connect(page);await page.locator('[data-ri-action=all]').click();await read(page);
  await page.evaluate(()=>{const original=Storage.prototype.setItem;window.restoreStorage=()=>Storage.prototype.setItem=original;Storage.prototype.setItem=function(k,v){if(k==='mcData')throw new DOMException('Fixture quota','QuotaExceededError');return original.call(this,k,v);};});await page.locator('[data-ri-action=save]').click();await page.waitForFunction(()=>!!document.querySelector('#ri-error').textContent);assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('mcData')).role.length),0);assert.equal(await page.locator('[data-ri-row] a').count(),0);await capture(page,'state-storage-failed-desktop');await page.evaluate(()=>window.restoreStorage());await page.locator('[data-ri-action=save]').click();await page.locator('.ri-result-summary').waitFor();
  const id=await page.evaluate(()=>JSON.parse(localStorage.getItem('mcData')).role[0].roleId);await page.goto(base+'/register-workspace.html?mode=import&view=register&lang=zh-TW&roleid='+id);await connect(page);await read(page);await page.waitForFunction(()=>!!document.querySelector('[data-ri-action=save]')&&!document.querySelector('[data-ri-action=cancel]'));
  await page.evaluate(()=>{const d=JSON.parse(localStorage.getItem('mcData'));d.role[0].level=80;localStorage.setItem('mcData',JSON.stringify(d));});await page.locator('[data-ri-action=save]').click();await page.waitForFunction(()=>!!document.querySelector('#ri-error').textContent);assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('mcData')).role[0].level),80);assert.ok(await page.locator('[data-ri-action=save]').isDisabled());await capture(page,'state-update-conflict-desktop');await page.locator('[data-ri-decision="0"]').selectOption('update:'+id);await page.locator('[data-ri-overwrite-ack]').check();await page.locator('[data-ri-action=save]').click();await page.locator('.ri-result-summary').waitFor();assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('mcData')).role[0].roleId),id);await page.locator('.ri-primary-link').click();await page.locator('#role-register .rr-slot').first().waitFor();assert.match(page.url(),new RegExp('roleid='+id));
  reports.push({scenario:'cancel, changed UID, stale response, storage failure/retry, update conflict, stable ID and original return',passed:true});await context.close();
 }
 // Empty-save entry, client errors, keyboard-sized viewport, keyboard selection and cross-account update entry.
 {
  const {context,page,control}=await contextFor({width:360,locale:'en'});
  await page.goto(base+'/index.html?view=register&lang=en');await page.locator('#character-dock a[href*="mode=import"]').first().click();await page.locator('#ri-token').waitFor();assert.match(page.url(),/lang=en/);
  await page.locator('#ri-uid').fill('123');await page.locator('#ri-token').fill('fixture-token');await page.locator('[data-ri-connect] .rw-primary').click();await page.waitForFunction(()=>!!document.querySelector('#ri-error').textContent);assert.equal(control.requests.length,0);await capture(page,'state-invalid-uid-mobile');
  await page.locator('#ri-uid').fill('123456789');await page.locator('#ri-token').fill('');await page.locator('[data-ri-connect] .rw-primary').click();await page.waitForFunction(()=>!!document.querySelector('#ri-error').textContent);assert.equal(control.requests.length,0);await capture(page,'state-missing-token-mobile');
  await page.setViewportSize({width:360,height:460});await page.locator('#ri-token').focus();await page.locator('#ri-token').fill('fixture-token');await page.waitForFunction(()=>document.querySelector('#register-workspace').classList.contains('ri-keyboard'));
  assert.equal(await page.locator('#register-shell nav').isVisible(),false);const rect=await page.locator('#ri-token').boundingBox();assert.ok(rect.y>=0&&rect.y+rect.height<=460);await capture(page,'state-keyboard-viewport-mobile');await page.screenshot({path:path.join(out,'state-keyboard-visible-viewport.png')});await page.setViewportSize({width:360,height:844});
  await connect(page);await page.locator('[data-ri-select="0"]').focus();await page.keyboard.press('Space');assert.equal(await page.locator('[data-ri-select="0"]').isChecked(),true);assert.ok(await page.locator('[data-ri-select="0"]').evaluate(e=>e===document.activeElement));await page.locator('[data-ri-action=all]').click();await read(page);await page.locator('[data-ri-action=save]').click();await page.locator('.ri-result-summary').waitFor();
  const original=await page.evaluate(()=>JSON.parse(localStorage.getItem('mcData')).role[0]);await page.goto(base+'/register-workspace.html?mode=import&view=register&lang=en&roleid='+original.roleId);await page.locator('#ri-uid').fill('987654321');await page.locator('[data-ri-connect] .rw-primary').click();await page.locator('#ri-search').waitFor();assert.match(await page.locator('#ri-error').textContent(),/differs/);await read(page);await capture(page,'state-account-mismatch-mobile');await page.locator('[data-ri-action=save]').click();await page.locator('.ri-result-summary').waitFor();assert.deepEqual(await page.evaluate(id=>JSON.parse(localStorage.getItem('mcData')).role.find(r=>r.roleId===id),original.roleId),original);assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('mcData')).role.length),4);
  const before=await page.evaluate(()=>localStorage.getItem('mcData'));await page.goto(base+'/register-workspace.html?mode=import&view=register&lang=en');await connect(page);await page.locator('[data-ri-action=all]').click();control.delay=300;await page.locator('[data-ri-action=read]').click();await page.goto(base+'/register-workspace.html?mode=library&view=register&lang=en');await page.waitForTimeout(500);assert.equal(await page.evaluate(()=>localStorage.getItem('mcData')),before);
  reports.push({scenario:'empty-save entry, invalid UID, missing Token, keyboard-sized viewport, keyboard checkbox, account mismatch and navigation cancellation',passed:true});await context.close();
 }
 // Related Register actions use real forms and core storage; Classic runs on the same saved records.
 for(const width of require('./browser-qa.cjs').widths([1440,1024,390,360]))for(const locale of ['zh-TW','zh-CN','en']){
  const {context,page}=await contextFor({width,locale}),prefix='unified-'+width+'-'+locale;
  const workspace=mode=>base+'/register-workspace.html?view=register&lang='+locale+'&mode='+mode;
  async function shot(name){if(name!=='classic')assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),name+' overflow');await page.screenshot({path:path.join(out,prefix+'-'+name+'.png'),fullPage:true});}
  await connect(page);await page.locator('[data-ri-action=all]').click();await read(page);await page.locator('[data-ri-action=save]').click();await page.locator('.ri-result-summary').waitFor();
  const importedId=await page.evaluate(()=>JSON.parse(localStorage.getItem('mcData')).role[0].roleId);
  await page.goto(workspace('create'));await page.locator('[name=catalog]').selectOption('1');await shot('create');await page.locator('[data-action=create] button').click();await page.locator('#role-register .rr-slot').first().waitFor();const manualId=new URL(page.url()).searchParams.get('roleid');
  async function makeEcho(roleId){
   await page.goto(workspace('echo')+(roleId?'&roleid='+roleId:''));await page.locator('[name=catalog]').selectOption('59');await page.locator('[name=main]').selectOption('暴击22%');await page.locator('[name=suite]').selectOption('光套');
   const keys=['crit_rate','crit_damage','atk_percent','resonance_skill_damage','resonance_efficiency'];for(let i=0;i<keys.length;i++){await page.locator('[name=key'+i+']').selectOption(keys[i]);const option=await page.locator('[name=value'+i+'] option').last().getAttribute('value');await page.locator('[name=value'+i+']').selectOption(option);}
   await shot('echo');await page.locator('[data-action=echo] .rw-primary').click();await page.waitForURL(roleId?'**/mccost.html?*':'**/register-workspace.html?*mode=library*');
  }
  await makeEcho(manualId);assert.equal(await page.evaluate(id=>JSON.parse(localStorage.getItem('mcData')).role.find(r=>String(r.roleId)===id).costList.length,manualId),1);await makeEcho(null);
  await page.locator('[data-library-favorite]').first().click();await page.locator('[data-library-select]').first().click();await page.locator('[data-library-field=compareRole]').selectOption(String(importedId));await page.locator('[data-library-field=position]').selectOption('1');await shot('library');
  const coreBefore=await page.evaluate(()=>localStorage.getItem('mcData'));await page.locator('[data-library-compare]').click();await page.locator('.rr-candidate-surface[data-phase=context]').waitFor();await shot('candidate');assert.equal(await page.evaluate(()=>localStorage.getItem('mcData')),coreBefore);const draftsBefore=await page.evaluate(()=>localStorage.getItem('wuwa.echoTool.drafts.v1'));assert.ok(JSON.parse(draftsBefore).drafts.length>0);const draftId=JSON.parse(draftsBefore).drafts.at(-1).id;
  await page.goto(workspace('import')+'&roleid='+importedId);await connect(page);await read(page);await page.locator('[data-ri-action=save]').click();await page.locator('.ri-result-summary').waitFor();assert.notEqual(await page.evaluate(()=>localStorage.getItem('wuwa.echoTool.drafts.v1')),draftsBefore);assert.equal(await page.evaluate(id=>JSON.parse(localStorage.getItem('wuwa.echoTool.drafts.v1')).drafts.some(d=>d.id===id),draftId),false);
  await page.goto(base+'/mccost-readonly.html?view=register&lang='+locale+'&roleid='+importedId+'&draft='+draftId);await page.locator('.rr-candidate-surface[data-phase=error]').waitFor();await shot('stale-draft');assert.equal(await page.locator('[data-rc-decision]').count(),0);
  await page.goto(base+'/index.html?view=register&lang='+locale);await page.locator('[data-dock-view=roles]').click();await page.locator('[data-delete-role="'+manualId+'"]').waitFor();await shot('roles');await page.locator('[data-dock-view=overview]').click();await shot('overview');
  await page.goto(workspace('tools'));await page.locator('#rw-tools form [name=stat]').first().check();await page.locator('#rw-tools form button[type=submit], #rw-tools form button.rw-primary').click();await page.waitForFunction(()=>document.querySelector('#rw-tools').getAttribute('aria-busy')==='false');assert.match(await page.locator('.rt-primary-number').innerText(),/100/);await page.locator('[data-tool-mode=simulation]').click();await page.locator('[data-roll]').click();await page.waitForFunction(()=>document.querySelector('#rw-tools').getAttribute('aria-busy')==='false');assert.equal(await page.locator('.rw-simulation-rows strong').count(),1);await page.locator('[data-tool-mode=rules]').click();await shot('tools');
  await page.goto(workspace('backup'));const downloadPromise=page.waitForEvent('download');await page.locator('[data-full-backup-export]').click();const download=await downloadPromise,downloadPath=await download.path(),backup=JSON.parse(fs.readFileSync(downloadPath,'utf8'));assert.ok(backup.sections.core.role[0].importSource);assert.equal(JSON.stringify(backup).includes('fixture-token'),false);await shot('backup');
  await page.locator('[data-full-backup-file]').setInputFiles({name:'fixture-backup.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(backup))});await page.waitForFunction(()=>!document.querySelector('[data-full-backup-restore]').disabled);assert.ok(await page.locator('[data-full-backup-restore]').isEnabled());await page.locator('[data-full-backup-restore]').click();assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('mcData'))),backup.sections.core);assert.equal(await page.evaluate(()=>RoleLocalConfiguration.create(localStorage).load().ok && RoleDraftStorage.create(localStorage).load().ok),true);
  // Shared scoring parity in the actual Classic page, followed by its original official refresh button.
  await page.goto(base+'/mccost-readonly.html?view=classic&roleid='+importedId);await page.locator('#zfz').waitFor();
  const parity=await page.evaluate(id=>{const data=JSON.parse(localStorage.getItem('mcData')),role=data.role.find(r=>String(r.roleId)===String(id)),normalize=RoleViewModel.createAdapter({roleList,costList,suiteAttributeMap,newCharacterModels,getRoleScoreConfig,getScoreDetails,countScores,countMainAttr,countMainAttr2,getRoleEnergyCorrection});return {shared:normalize(role).summary.score,classic:parseFloat(document.querySelector('#zfz').textContent)};},importedId);assert.ok(Math.abs(parity.shared-parity.classic)<0.02);
  if(await page.locator('#mc-maintenance-modal').isVisible())await page.locator('#mc-maintenance-modal .close').click();
  await shot('classic');await Promise.all([page.waitForNavigation({waitUntil:'domcontentloaded'}),page.locator('.mc-character-addbtn2').click()]);await page.waitForFunction(()=>document.querySelector('#zfz')?.textContent);assert.equal(await page.evaluate(id=>JSON.parse(localStorage.getItem('mcData')).role.find(r=>String(r.roleId)===String(id)).roleId,importedId),importedId);
  reports.push({width,locale,scenario:'create, Echo save, library favorite/compare, stale draft, roster/overview, tools, full backup restore, Classic score/official refresh',passed:true});await context.close();
 }
 assert.deepEqual(errors,[]);fs.writeFileSync(path.join(out,'browser-results.json'),JSON.stringify({isolated:true,officialAccountVerified:false,reports,screenshots:fs.readdirSync(out).filter(f=>f.endsWith('.png')),pageErrors:errors},null,2));console.log('PASS: '+reports.length+' browser acceptance scenarios, '+fs.readdirSync(out).filter(f=>f.endsWith('.png')).length+' screenshots, zero page errors.');
})().catch(error=>{console.error(error);process.exitCode=1;}).finally(async()=>{await browser?.close();server?.close();});
async function contextFor(options){return context(options);}
