const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const I18n=require('../js/i18n.js'),messages=require('../js/i18n-dictionaries.js'),VM=require('../js/role-view-model.js');
const env={$:()=>{},console:{log(){}}};
vm.runInNewContext(fs.readFileSync('js/base.js','utf8')+';globalThis.api={roleList,costList,suiteAttributeMap,newCharacterModels,getRoleScoreConfig,getScoreDetails,countScores,countMainAttr,countMainAttr2,getRoleEnergyCorrection};',env);
vm.runInNewContext(fs.readFileSync('js/register-secondary-views.js','utf8'),env);
const normalize=VM.createAdapter(env.api),entry=env.api.costList.find(e=>e.type==='Cost3');
const echo={costId:20,costListId:entry.id,type:entry.type,suite:'光套',mainAtrri:'共鸣效率32%',propertyList:[{property:'暴击',value:'8.1%'}]};
const data={role:[{roleId:1,roleListId:1,costList:[echo]}],unusedEchoes:[echo]},before=JSON.stringify(data);
const initial={selected:null,detailOpen:false,search:'',cost:'',suite:'',main:'',completeness:'',equipRole:'',compareRole:'',position:''};
for(const locale of ['zh-TW','zh-CN','en']){
 const base=I18n.create({url:'https://test.invalid/?lang='+locale});
 const i18n={...base,t(k,p){assert.ok(Object.hasOwn(messages[locale],k),'missing '+locale+': '+k);return base.t(k,p);}};
 const views=env.RegisterSecondaryViews.create({i18n,esc:x=>String(x??''),name:(kind,id)=>kind+id,url:m=>m,normalize,summary:()=>'',roleLink:()=>'?roleid=1',catalog:env.api.costList,suites:{'光套':5}});
 let html=views.library(data,initial);assert.equal((html.match(/data-library-select=/g)||[]).length,1);assert.ok(html.includes(entry.imgCode));assert.doesNotMatch(html,/data-remove=/);
 html=views.library(data,{...initial,selected:'20',detailOpen:true,compareRole:'1',position:'1'});assert.equal((html.match(/class="rw-inspector /g)||[]).length,1);assert.match(html,/data-library-compare>/);assert.equal((html.match(/data-remove=/g)||[]).length,1);
 for(const filter of [{search:'NO_MATCH'},{cost:'Cost4'},{suite:'不存在'},{main:'crit_damage'},{completeness:'complete'}])assert.doesNotMatch(views.library(data,{...initial,...filter}),/data-library-select=/);
 assert.match(views.library(data,{...initial,completeness:'incomplete'}),/data-library-select=/);
 html=views.library({...data,unusedEchoes:[echo,echo]},{...initial,selected:'20',compareRole:'1',position:'1'});assert.match(html,/data-library-compare disabled/);assert.match(html,/data-remove="20" disabled/);
 html=views.backup({core:2,drafts:1,adoptions:0},{});assert.equal((html.match(/<details>/g)||[]).length,3);assert.doesNotMatch(html,/<details[^>]*open/);assert.equal((html.match(/data-restore-file=/g)||[]).length,3);
 const baseline={role:{catalogId:1},slots:[{echo:{catalogId:entry.id}}]},draft={id:'draft',targetSlot:1,candidate:{echo:{catalogId:entry.id}},updatedAt:1700000000000};
 html=views.history([{baseline,draft,record:data.role[0],validity:'stale',delta:null}],true);assert.doesNotMatch(html,/&draft=/);assert.ok(html.includes(base.t('dock.recompare')));
 html=views.history([{baseline,draft,record:data.role[0],validity:'valid',delta:1.5}],true);assert.match(html,/&draft=draft/);
}
assert.equal(JSON.stringify(data),before);
console.log('PASS: shared image catalog, selection, filters, duplicate identity guards, collapsed backup controls, revalidated history presentation, three-language keys and immutable input.');
