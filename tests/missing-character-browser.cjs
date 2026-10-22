// 仅使用独立本机来源及合成角色，不读取玩家账号或现有浏览器存档。
const {chromium}=require('C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {seed}=require('./register-operations-browser.cjs');
const model=require('../scripts/new-character-model.cjs').createNewCharacterModels();
const root=path.resolve(__dirname,'..'),out=path.join(root,'artifacts/missing-characters-20261022');
let browser,server;const errors=[];
(async()=>{
 fs.mkdirSync(out,{recursive:true});
 server=http.createServer((req,res)=>{
  const file=path.resolve(root,'.'+decodeURIComponent(req.url.split('?')[0]));
  if(!file.startsWith(root+path.sep))return res.writeHead(403).end();
  fs.readFile(file,(err,data)=>{if(err)return res.writeHead(404).end();res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.webp':'image/webp'}[path.extname(file)]||'application/octet-stream'));res.end(data);});
 });
 await new Promise(r=>server.listen(0,'127.0.0.1',r));
 const base='http://127.0.0.1:'+server.address().port;
 browser=await chromium.launch({channel:'msedge',headless:true});
 let checked=0,classicChecked=0;
 for(const locale of ['zh-CN','zh-TW','en']) {
  const context=await browser.newContext({viewport:{width:1280,height:900},reducedMotion:'reduce'}),page=await context.newPage();
  page.on('pageerror',e=>errors.push(e.message));
  await context.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
  await page.goto(base+'/register-workspace.html?view=register&mode=library');
  await page.locator('#register-workspace').waitFor();await seed(page,false);
  await page.evaluate(()=>{
   const data=JSON.parse(localStorage.getItem('mcData')),template=data.role[0];
   data.role=[];
   for(const id of [54,55,56])for(const imported of [false,true]) {
    const r=structuredClone(template),entry=roleList[id-1];
    Object.assign(r,{roleId:id*10+(imported?1:0),roleListId:id,name:entry.name,cls:entry.cls,isImport:imported,ming:0});
    delete r.damageMode;
    r.costList.forEach((e,i)=>{e.costId=id*100+(imported?50:0)+i;if(imported)e.mainAtrri={property:['暴击','属伤','共鸣效率','大攻击','大攻击'][i],value:['22%','30%','32%','18%','18%'][i]};});
    data.role.push(r);
   }
   localStorage.setItem('mcData',JSON.stringify(data));localStorage.removeItem('wuwa.echoTool.drafts.v1');
  });
  for(const catalogId of [54,55,56])for(const imported of [false,true]) {
   const id=catalogId*10+(imported?1:0),modes=model.settings[catalogId].modes.map(m=>m[0]);
   await page.goto(base+'/'+(imported?'mccost-readonly.html':'mccost.html')+'?view=register&roleid='+id+'&lang='+locale);
   await page.locator('[data-rr-model=damageMode]').waitFor();
   assert.equal(await page.locator('[data-rr-model=damageMode]').inputValue(),modes[0]);
   const expectedLabels=await page.evaluate(modes=>modes.map(m=>EchoI18n.createBrowser(window).t('register.mode.'+m)),modes);
   assert.deepEqual(await page.locator('[data-rr-model=damageMode] option').allTextContents(),expectedLabels);
   assert.equal(await page.locator('.rr-identity h1').innerText(),await page.evaluate(id=>EchoI18n.createBrowser(window).t('characters.'+id),catalogId));
   for(const mode of modes)for(let chain=0;chain<=6;chain++) {
    await page.selectOption('[data-rr-model=damageMode]',mode);await page.selectOption('[data-rr-model=ming]',String(chain));
    const readings=await page.evaluate(id=>{
     const r=JSON.parse(localStorage.getItem('mcData')).role.find(r=>r.roleId===id);
     const normalize=RoleViewModel.createAdapter({roleList,costList,suiteAttributeMap,newCharacterModels,getRoleScoreConfig,getScoreDetails,countScores,countMainAttr,countMainAttr2,getRoleEnergyCorrection});
     return {mode:r.damageMode,chain:Number(r.ming),expected:normalize(r).summary.score,actual:parseFloat(document.querySelector('.rr-overall>strong').textContent)};
    },id);
    assert.equal(readings.mode||modes[0],mode);assert.equal(readings.chain,chain);
    assert(Math.abs(readings.expected-readings.actual)<.02,JSON.stringify(readings));checked++;
   }
   await page.reload();await page.locator('[data-rr-model=damageMode]').waitFor();
   assert.equal(await page.locator('[data-rr-model=damageMode]').inputValue(),modes.at(-1));
   assert.equal(await page.locator('[data-rr-model=ming]').inputValue(),'6');
   if(!imported)await page.screenshot({path:path.join(out,locale+'-'+catalogId+'-c6.png'),fullPage:true});
   console.log(locale+' '+catalogId+' '+(imported?'导入':'手动')+'：链数／玩法与重载通过');
  }
  // 在同一新版页面操作真正的语言选择器，确认玩法文案同步刷新且不改变角色配置。
  const stored=await page.evaluate(()=>localStorage.getItem('mcData'));
  await page.locator('.rs-settings>summary').click();
  const switched=locale==='en'?'zh-CN':'en';
  await page.selectOption('[data-ui-locale]',switched);
  const changedLabels=await page.locator('[data-rr-model=damageMode] option').allTextContents();
  assert.deepEqual(changedLabels,await page.evaluate(()=>newCharacterModels.settings[56].modes.map(([mode])=>EchoI18n.createBrowser(window).t('register.mode.'+mode))));
  assert.equal(await page.evaluate(()=>localStorage.getItem('mcData')),stored);
  for(const catalogId of [54,55,56]) {
   await page.goto(base+'/mccost.html?view=classic&roleid='+catalogId*10+'&lang=en');
   await page.locator('#mc-damage-mode').waitFor();
   assert.deepEqual(await page.locator('#mc-damage-mode option').allTextContents(),model.settings[catalogId].modes.map(m=>m[1]));
   classicChecked++;
  }
  await page.goto(base+'/rule.html');await page.locator('#new-character-profiles tr').last().waitFor({state:'attached'});
  assert.equal(await page.locator('#new-character-profiles tr').count(),182);
  for(const name of ['露西','丽贝卡','洛瑟菈'])assert(await page.locator('#new-character-profiles tr').filter({hasText:name}).count()>=14);
  await context.close();
 }
 assert.deepEqual(errors,[]);
 fs.writeFileSync(path.join(out,'result.json'),JSON.stringify({checked,classicChecked,locales:3,sources:2,profiles:63,pageErrors:errors},null,2));
 console.log('通过：'+checked+'次新版评分核对、三语切换、保存重载，以及'+classicChecked+'次旧版简体控件核对。');
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(async()=>{await browser?.close();await new Promise(r=>server?server.close(r):r());});
