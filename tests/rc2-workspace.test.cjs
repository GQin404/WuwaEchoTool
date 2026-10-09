const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const Views=require('../js/ui-view.js'),Core=require('../js/character-core.js'),I18n=require('../js/i18n.js');
// 每次新建解析上下文，模拟重新进站，不能依赖先前界面选择。
for(const base of ['https://site.test/','https://site.test/index.html','file:///C:/project/index.html'])for(const preference of [null,'register','classic']){
 assert.equal(Views.resolve({url:base,preference}).effective,null);
 for(const view of ['register','classic'])assert.equal(Views.resolve({url:base+'?view='+view,preference}).effective,view);
}
async function render(locale,empty){
 const host={innerHTML:'',querySelector:()=>null,addEventListener:()=>{}},document={documentElement:{},createElement:()=>host,addEventListener:()=>{},body:{append:()=>{}}};
 const stored=new Map(),writes=[],storage={getItem:k=>stored.get(k)||null,setItem:(k,v)=>{writes.push(k);stored.set(k,v);}};
 const context={document,localStorage:storage,URL,TextEncoder,crypto:require('node:crypto').webcrypto,location:new URL('https://site.test/index.html?view=register'),addEventListener:()=>{},$:()=>{}};
 vm.createContext(context);vm.runInContext(fs.readFileSync('js/base.js','utf8')+';globalThis.catalog=roleList;',context);
 const records=empty?[]:[Core.createRole(context.catalog[0],101),Core.createRole(context.catalog[1],102)];
 if(records[1])records[1].isImport=true;
 stored.set('mcData',JSON.stringify({role:records,unusedEchoes:[]}));const original=stored.get('mcData');
 Object.assign(context,{RoleViewModel:require('../js/role-view-model.js'),RoleDraftModel:require('../js/role-draft-model.js'),RoleDraftStorage:require('../js/role-draft-storage.js'),RoleLocalConfiguration:require('../js/role-local-configuration.js'),EchoI18n:{createBrowser:()=>I18n.create({language:locale})},UiView:{state:{effective:'register'},recent:()=>[]}});
 vm.runInContext(fs.readFileSync('js/character-dock.js','utf8'),context);context.CharacterDock.mount(context);await new Promise(setImmediate);
 assert.equal(stored.get('mcData'),original);assert.ok(!writes.includes('mcData'));
 assert.match(host.innerHTML,/mode=import/);assert.match(host.innerHTML,/mode=create/);assert.ok(host.innerHTML.indexOf('mode=create')<host.innerHTML.indexOf('</header>'));
 if(empty){assert.doesNotMatch(host.innerHTML,/dock-roster|dock-recent-reading/);}else{
  assert.equal((host.innerHTML.match(/class="dock-character-link"/g)||[]).length,2);
  assert.match(host.innerHTML,/mccost-readonly.html/);assert.match(host.innerHTML,/mccost.html/);
  assert.ok(host.innerHTML.indexOf('</details>')<host.innerHTML.indexOf('data-dock-roster'));
  assert.doesNotMatch(host.innerHTML,/role\.source\.|dock\.filter/);
 }
}
(async()=>{for(const locale of ['zh-TW','zh-CN','en'])for(const empty of [true,false])await render(locale,empty);console.log('PASS: root chooser ignores saved preferences on HTTP/file URLs; explicit views resolve; trilingual visible manual/import index and primary creation links; empty onboarding; no core writes.');})().catch(e=>{console.error(e);process.exitCode=1;});
