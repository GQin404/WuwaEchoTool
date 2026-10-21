const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const View=require('../js/role-view-model.js');
test('new Echo catalogs recover missing or unresolved names without changing old/imported scores or source data',()=>{
 const env={$:()=>{},console:{log(){}}};vm.runInNewContext(fs.readFileSync('js/base.js','utf8')+';globalThis.api={roleList,costList,suiteAttributeMap,newCharacterModels,getRoleScoreConfig,getScoreDetails,countScores,countMainAttr,countMainAttr2,getRoleEnergyCorrection};',env);const normalize=View.createAdapter(env.api);
 for(const id of [181,182,183,184,185,186])for(const storedName of [undefined,'[echoes.'+id+']'])for(const imported of [false,true]){
  const cat=env.api.costList.find(e=>e.id===id),main=cat.type==='Cost4'?'暴击22%':cat.type==='Cost3'?'共鸣效率32%':'攻击18%',record={roleId:100,roleListId:1,level:90,ming:0,isImport:imported,costList:[{costId:200,costListId:id,type:cat.type,name:storedName,mainAtrri:imported?{property:cat.type==='Cost4'?'暴击':cat.type==='Cost3'?'共鸣效率':'大攻击',value:cat.type==='Cost4'?'22%':cat.type==='Cost3'?'32%':'18%'}:main,propertyList:[{property:'暴击',value:'8.1%'}]}]},before=JSON.stringify(record),model=normalize(record),expected=normalize({...record,costList:[{...record.costList[0],name:cat.name}]});
  assert.equal(model.slots[0].echo.legacy.name,cat.name);assert.deepEqual(model.slots[0].echo.score,expected.slots[0].echo.score);assert.deepEqual(model.summary,expected.summary);assert.equal(JSON.stringify(record),before);
 }
});
