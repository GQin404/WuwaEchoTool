const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const Portraits=require('../js/character-portraits.js'),VM=require('../js/role-view-model.js'),Renderer=require('../js/role-register-renderer.js'),Core=require('../js/character-core.js'),I18n=require('../js/i18n.js');
const ctx={$:()=>{}};vm.runInNewContext(fs.readFileSync('js/base.js','utf8')+';globalThis.api={roleList,costList,newCharacterModels,getRoleScoreConfig,getScoreDetails,countScores,countMainAttr,countMainAttr2,getRoleEnergyCorrection};',ctx);
assert.equal(Portraits.resolve(ctx.api.roleList.find(r=>r.id===1)),'image/characters/jinxi.webp');
assert.equal(Portraits.resolve(ctx.api.roleList.find(r=>r.id===63)),'image/characters/xin.webp');
assert.equal(Portraits.resolve({cls:'mcr-test'}),'image/characters/test.png');
assert.equal(Portraits.resolve(null),null);
assert.equal(Portraits.resolve({cls:'mcr-test',portrait:'javascript:alert(1)'}),'image/characters/test.png');
const official='https://prod-alicdn-community.kurobbs.com/forum/540ebca2f4fc4ab6ba8c9754f9c6327420260829.png?x-oss-process=image/format,webp';
const catalog=ctx.api.roleList.map(r=>({...r,portrait:r.id===1?official:r.portrait}));
assert.equal(Portraits.resolve(catalog[0]),official);
assert.ok(Portraits.classicStyles(catalog).includes(JSON.stringify(official)));assert.ok(Portraits.classicStyles(catalog).includes('content:"今汐"'));
const role=Core.createRole(catalog[0],101);role.costList=[59,51,52,35,39].map((id,i)=>({...Core.createEcho(ctx.api.costList.find(c=>c.id===id),i+1),imgCode:'https://example.test/echo-'+id+'.png'}));
const before=JSON.stringify(role),normalize=VM.createAdapter({...ctx.api,roleList:catalog}),model=normalize(role);
assert.equal(model.role.portrait,official);assert.equal(JSON.stringify(role),before);
for(const locale of ['zh-TW','zh-CN','en']){
 const html=Renderer.render(model,I18n.create({language:locale})).html;
 assert.ok(html.includes(official));for(const echo of role.costList)assert.ok(html.includes(echo.imgCode));assert.ok(!html.includes('image/register/'));
}
for(const file of fs.readdirSync('js').filter(n=>n.endsWith('.js')))assert.ok(!fs.readFileSync('js/'+file,'utf8').includes('image/register/'),file);
for(const file of fs.readdirSync('.').filter(n=>n.endsWith('.html'))){const html=fs.readFileSync(file,'utf8');if(html.includes('js/base.js'))assert.ok(html.includes('js/character-portraits.js'),file);}
console.log('PASS: shared local/HTTPS portrait resolution, unsafe URL fallback, Classic names, five source Echo URLs without sample overrides, trilingual renders, unchanged role data and all page dependencies.');
