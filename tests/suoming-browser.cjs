// Isolated loopback origin + synthetic builds only; never reads a player's stored builds.
const {chromium}=require('C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http'),assert=require('node:assert/strict');
const {seed}=require('./register-operations-browser.cjs');
const root=path.resolve(__dirname,'..'),out=path.join(root,'artifacts/suoming-20261022');
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
 let checked=0;
 for(const locale of ['zh-TW','zh-CN','en']) {
  const context=await browser.newContext({viewport:{width:1280,height:900},reducedMotion:'reduce'}),page=await context.newPage();
  page.on('pageerror',e=>errors.push(e.message));
  await context.route('**/*',r=>new URL(r.request().url()).hostname==='127.0.0.1'?r.continue():r.abort());
  await page.goto(base+'/register-workspace.html?view=register&mode=library');
  await page.locator('#register-workspace').waitFor();await seed(page,false);
  await page.evaluate(()=>{
   const data=JSON.parse(localStorage.getItem('mcData'));
   const manual=data.role[0];Object.assign(manual,{roleListId:64,name:'锁暝',cls:'mcr-suoming',ming:0});
   delete manual.damageMode;
   const imported=structuredClone(manual);Object.assign(imported,{roleId:200,isImport:true});
   imported.costList.forEach((e,i)=>{e.costId+=5000;e.mainAtrri={property:['暴击','属伤','共鸣效率','大攻击','大攻击'][i],value:['22%','30%','32%','18%','18%'][i]};});
   data.role=[manual,imported];localStorage.setItem('mcData',JSON.stringify(data));
  });
  for(const imported of [false,true]) {
   const id=imported?200:100;
   await page.goto(base+'/'+(imported?'mccost-readonly.html':'mccost.html')+'?view=register&roleid='+id+'&lang='+locale);
   await page.locator('[data-rr-model=damageMode]').waitFor();
   assert.equal(await page.locator('[data-rr-model=damageMode]').inputValue(),'unison');
   assert.equal(await page.locator('[data-rr-model=damageMode] option').count(),4);
   for(const mode of ['unison','unisonOpening','contract','contractOpening'])for(let chain=0;chain<=6;chain++) {
    await page.selectOption('[data-rr-model=damageMode]',mode);
    await page.selectOption('[data-rr-model=ming]',String(chain));
    const values=await page.evaluate(id=>{
     const role=JSON.parse(localStorage.getItem('mcData')).role.find(r=>r.roleId===id);
     const normalize=RoleViewModel.createAdapter({roleList,costList,suiteAttributeMap,newCharacterModels,getRoleScoreConfig,getScoreDetails,countScores,countMainAttr,countMainAttr2,getRoleEnergyCorrection});
     return {mode:role.damageMode,chain:Number(role.ming),expected:normalize(role).summary.score,actual:parseFloat(document.querySelector('.rr-overall>strong').textContent),heavy:getRoleScoreConfig(role).weights.heavy,note:document.querySelector('.rr-model-note')?.textContent};
    },id);
    // Initial default does not have to materialize a damageMode field until the first changed control.
    assert.equal(values.mode||'unison',mode,JSON.stringify(values));assert.equal(values.chain,chain,JSON.stringify(values));assert.equal(values.heavy,0);
    assert(Math.abs(values.expected-values.actual)<.02,JSON.stringify(values));checked++;
   }
   await page.reload();await page.locator('[data-rr-model=damageMode]').waitFor();
   assert.equal(await page.locator('[data-rr-model=damageMode]').inputValue(),'contractOpening');
   assert.equal(await page.locator('[data-rr-model=ming]').inputValue(),'6');
   if(!imported)await page.screenshot({path:path.join(out,locale+'-contract-c6.png'),fullPage:true});
   console.log(locale+' '+(imported?'imported':'manual')+': 28 profiles + reload passed');
  }
  await page.goto(base+'/rule.html?lang='+locale);
  await page.locator('#new-character-profiles tr').last().waitFor({state:'attached'});
  assert.equal(await page.locator('#new-character-profiles tr').count(),182);
  assert.equal(await page.locator('#new-character-profiles tr').filter({hasText:'锁暝'}).count(),28);
  await context.close();
 }
 assert.deepEqual(errors,[]);
 fs.writeFileSync(path.join(out,'result.json'),JSON.stringify({checked,locales:3,sources:2,profiles:28,pageErrors:errors},null,2));
 console.log('PASS: '+checked+' Suoming browser score checks, three locales, manual/imported persistence, 28 rule rows.');
})().catch(e=>{console.error(e);process.exitCode=1;}).finally(async()=>{await browser?.close();await new Promise(r=>server?server.close(r):r());});
