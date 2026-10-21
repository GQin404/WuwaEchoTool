const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const Candidates=require('../js/role-candidates.js'),Draft=require('../js/role-draft-model.js'),VM=require('../js/role-view-model.js');
const env={$:()=>{}};vm.runInNewContext(fs.readFileSync('js/base.js','utf8')+';globalThis.api={roleList,costList,suiteAttributeMap,newCharacterModels,getRoleScoreConfig,getScoreDetails,countScores,countMainAttr,countMainAttr2,getRoleEnergyCorrection};',env);
const normalize=VM.createAdapter(env.api),adapter=Candidates.createAdapter(normalize);
test('corrupt navigation sessions recover on explicit save without touching roles, plans or other valid views',()=>{
 const Navigation=require('../js/register-navigation.js');
 for(const raw of ['null','[]','42','"old"','{broken']){
  const values=new Map([[Navigation.KEY,raw],['mcData','original roles'],['wuwa.echoTool.drafts.v1','original plans']]);
  const storage={getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v)},nav=Navigation.create(storage);
  assert.deepEqual(nav.load('tools'),{});assert.equal(values.get(Navigation.KEY),raw,'reading must not write');
  assert.equal(nav.save('tools',{role:'3',mode:'simulation'}),true);
  assert.deepEqual(nav.load('tools'),{role:'3',mode:'simulation'});
  assert.equal(values.get('mcData'),'original roles');assert.equal(values.get('wuwa.echoTool.drafts.v1'),'original plans');
 }
 const values=new Map([[Navigation.KEY,JSON.stringify({library:{search:'kept'},tools:null})]]);
 const nav=Navigation.create({getItem:k=>values.get(k),setItem:(k,v)=>values.set(k,v)});
 assert.deepEqual(nav.load('tools'),{});assert.equal(nav.save('roles',{view:'roles'}),true);assert.deepEqual(nav.load('library'),{search:'kept'});
});
test('navigation storage read/write failures report failure and preserve the existing session',()=>{
 const Navigation=require('../js/register-navigation.js');let raw=JSON.stringify({library:{search:'kept'}});
 const nav=Navigation.create({getItem:()=>raw,setItem(){throw Error('quota');}});
 assert.equal(nav.save('tools',{mode:'rules'}),false);assert.deepEqual(nav.load('library'),{search:'kept'});
 const blocked=Navigation.create({getItem(){throw Error('denied');},setItem(){assert.fail('must not overwrite after read failure');}});
 assert.deepEqual(blocked.load('roles'),{});assert.equal(blocked.save('roles',{}),false);
});
function fixture(){
 const role={roleId:1,roleListId:1,ming:0,costList:[59,51,52,35,39].map((id,i)=>({costId:10+i,costListId:id,type:['Cost4','Cost3','Cost3','Cost1','Cost1'][i],suite:'光套',mainAtrri:['暴击22%','属伤30%','共鸣效率32%','攻击18%','攻击18%'][i],propertyList:[['暴击','8.1%'],['暴伤','16.2%'],['大攻击','8.6%'],['技能伤害','8.6%'],['共鸣效率','8.4%']].map(([property,value])=>({property,value}))}))};
 const echo=structuredClone(role.costList[1]);echo.costId=99;
 const b=Draft.createBaseline(normalize(role),{id:'b',createdAt:1,sourceRevision:'source',modelVersion:'legacy-scoring-2026-10-08'}),slot=adapter.fromRecord(echo,role),candidate=adapter.prepare(b,2,slot,{id:'c',source:'inventory',sourceRevision:'candidate',identityScope:[99]}).candidate;
 return {role,echo,b,d:Draft.createDraft(b,candidate,{id:'d',targetSlot:2,createdAt:1})};
}
test('inventory plans become stale for changed, removed, duplicated or equipped sources, without mutating snapshots',()=>{
 const {role,echo,b,d}=fixture(),before=JSON.stringify({role,echo,b,d});
 assert.equal(adapter.assessSource(d,[echo],role).status,'valid');
 const changed=structuredClone(echo);changed.propertyList[0].value='10.5%';assert.equal(adapter.assessSource(d,[changed],role).status,'stale');
 assert.equal(adapter.assessSource(d,[],role).status,'stale');assert.equal(adapter.assessSource(d,[echo,echo],role).status,'stale');
 assert.equal(JSON.stringify({role,echo,b,d}),before);
});
test('inventory validation ignores display caches but checks Cost, main stat and set; manual plans remain snapshots',()=>{
 const {role,echo,b,d}=fixture();assert.equal(adapter.assessSource(d,[{...echo,name:'Renamed display',sumScores:999}],role).status,'valid');
 for(const patch of [{type:'Cost1'},{mainAtrri:'攻击力30%'},{suite:'暗套'}])assert.equal(adapter.assessSource(d,[{...echo,...patch}],role).status,'stale');
 const manual=Draft.createDraft(b,{...d.candidate,source:'manual'},{id:'manual',targetSlot:2,createdAt:1});assert.equal(adapter.assessSource(manual,[],role).status,'valid');
});
test('explicit core save stays clean when optional session cleanup fails; incompatible recovery does not apply',()=>{
 const values=new Map(),listeners={},scope={sessionStorage:{getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v),removeItem(){throw Error('blocked');}},window:{addEventListener:(k,fn)=>listeners[k]=fn},document:{addEventListener(){}}};vm.runInNewContext(fs.readFileSync('js/register-unsaved.js','utf8'),scope);
 let value='before';const guard=scope.RegisterUnsaved.create({scope:'test',get:()=>value,apply:v=>value=v,revision:'old',i18n:{t:k=>k}});value='after';assert.equal(guard.retain(),true);assert.doesNotThrow(()=>guard.markSaved());assert.equal(guard.dirty(),false);
 const other=scope.RegisterUnsaved.create({scope:'test',get:()=>value,apply:()=>assert.fail('changed source must not recover'),revision:'new',i18n:{t:k=>k}});assert.equal(other.recover(),false);
});
test('removing one adopted plan cleans its reference and name, preserves another plan and the original roles',()=>{
 const Local=require('../js/role-local-configuration.js'),History=require('../js/role-history.js'),Storage=require('../js/role-draft-storage.js'),Compare=require('../js/role-compare.js'),Meta=require('../js/register-metadata.js');
 const values=new Map(),s={getItem:k=>values.get(k)??null,setItem:(k,v)=>values.set(k,v),removeItem:k=>values.delete(k)},f=fixture(),store=Storage.create(s);
 f.echo.propertyList[0].value='10.5%';const c=adapter.prepare(f.b,2,adapter.fromRecord(f.echo,f.role),{id:'better',source:'inventory',sourceRevision:'candidate',identityScope:[99]}).candidate;
 const a=Draft.createDraft(f.b,c,{id:'a',targetSlot:2,createdAt:1}),b=Draft.createDraft(f.b,c,{id:'b',targetSlot:2,createdAt:1});store.save(f.b,a,0);store.save(f.b,b,1);s.setItem('mcData',JSON.stringify({role:[f.role],unusedEchoes:[f.echo]}));const original=s.getItem('mcData');
 const result=Compare.evaluate({baseline:f.b,draft:a,current:f.b,role:f.role,normalize,now:2});assert.equal(result.conclusion,'recommended');assert.equal(Local.create(s).adopt(f.b,a,f.b,{},result,2).ok,true);Meta.create(s).rename('drafts','a','Plan A',null);
 assert.equal(History.create(s).remove('a').ok,true);assert.deepEqual(store.load().data.drafts.map(d=>d.id),['b']);assert.deepEqual(Local.create(s).load().data.items,[]);assert.equal(Meta.create(s).load().data.drafts.a,undefined);assert.equal(s.getItem('mcData'),original);
});
test('downloads, new-tab links and in-page anchors do not leave or discard dirty input',()=>{
 const listeners={},scope={URL,location:{href:'https://test.local/mccost.html?roleid=1'},sessionStorage:{getItem:()=>null,setItem:()=>assert.fail('no retain on downloads'),removeItem(){}},window:{addEventListener(){}},document:{addEventListener:(k,fn)=>listeners[k]=fn}};vm.runInNewContext(fs.readFileSync('js/register-unsaved.js','utf8'),scope);
 let value='initial';const guard=scope.RegisterUnsaved.create({scope:'test',get:()=>value,apply(){},revision:'r',i18n:{t:k=>k}});value='dirty';
 for(const link of [{href:'data:text/plain,export',hasAttribute:k=>k==='download'},{href:'https://test.local/index.html',target:'_blank'},{href:'https://test.local/mccost.html?roleid=1#details'}])listeners.click({target:{closest:()=>link},preventDefault:()=>assert.fail('must not intercept')});
 listeners.click({target:{closest:()=>({href:'https://test.local/index.html'})},ctrlKey:true,preventDefault:()=>assert.fail('new tab')});assert.equal(guard.dirty(),true);
});
