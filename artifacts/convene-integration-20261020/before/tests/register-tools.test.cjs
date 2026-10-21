const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const Tools=require('../js/register-tools.js'),Core=require('../js/echo-tool-core.js'),Keys=require('../js/stat-keys.js'),Candidates=require('../js/role-candidates.js');
const env={$:()=>{}};vm.runInNewContext(fs.readFileSync('js/base.js','utf8')+';globalThis.api={roleList,getScoreDetails,countScores,fctValue,fctValueHJ,costExperance};',env);const api=env.api;
const options={core:Core,score:api.countScores,details:api.getScoreDetails,values:api.fctValue,expectedValues:api.fctValueHJ,resources:api.costExperance,roleIds:api.roleList.map(r=>r.id),keys:Candidates.SUB,statKeys:Keys};
test('Register results match the existing probability core for every frozen legacy profile and all roles',()=>{
 const cases=require('./fixtures/legacy-probability.json').cases;
 for(const entry of api.roleList)for(const c of cases){const m=Tools.create(options),known=c.properties.map(Keys.fromLegacy);m.setRole(entry.id);m.setKnown(known);const result=m.calculate(),expected=Core.probability(c.properties.map(property=>({property,value:null})),s=>api.countScores(s,{roleListId:entry.id,ming:0}),api.fctValueHJ);assert.deepEqual(result,expected);assert.deepEqual(m.result(),expected);}
});
test('input changes invalidate old results, target inspection does not, and tools retain independent work',()=>{
 const m=Tools.create(options);assert.equal(m.result(),null);m.setKnown(['crit_rate']);const initial=m.calculate();assert.equal(initial.crit.total,100);m.setTarget('dual');assert.deepEqual(m.result(),initial);m.setMode('simulation');m.roll();m.setMode('rules');m.setRole(2);assert.equal(m.result(),null);m.setMode('probability');assert.deepEqual(m.snapshot().known,['crit_rate']);assert.equal(m.snapshot().simulation.length,1);m.calculate();m.setKnown([]);assert.equal(m.result(),null);m.resetSimulation();assert.equal(m.snapshot().roleId,'2');assert.deepEqual(m.snapshot().known,[]);
});
test('seeded simulation, resources and rule coefficients are unchanged from the original calls',()=>{
 for(let seed=0;seed<100;seed++){let step1=0,step2=0;const rand=n=>((seed*17+n*37)%100)/100,m=Tools.create({...options,random:()=>rand(step1++)}),direct=[];for(let i=0;i<5;i++){const expected=Core.roll(direct,api.fctValue,()=>rand(step2++));direct.push(expected);assert.deepEqual(m.roll(),JSON.parse(JSON.stringify(expected)));assert.deepEqual(m.resources(i+1),Core.resources(i+1,api.costExperance));}assert.equal(m.roll(),null);assert.equal(new Set(m.snapshot().simulation.map(s=>s.property)).size,5);}
 const m=Tools.create(options);for(const r of api.roleList){m.setRole(r.id);for(const row of m.coefficients())assert.equal(row.coefficient,api.getScoreDetails({property:Keys.keyToLegacy[row.key],value:row.unit==='flat'?'1':'1%'},{roleListId:r.id,ming:0}).coefficient);}
});
test('saved UI state restores inputs and results; malformed state is isolated; invalid conditions never reach core',()=>{
 const m=Tools.create(options);m.setKnown(['crit_rate','atk_percent']);m.calculate();m.roll();m.expand('probability',true);m.setMode('rules');const state=m.snapshot(),fresh=Tools.create({...options,initial:state});assert.deepEqual(fresh.snapshot(),state);assert.deepEqual(fresh.result(),m.result());assert.equal(Tools.create({...options,initial:{...state,simulation:[{property:'wrong',value:1}]}}).recovered(),true);
 let called=0;const invalid=Tools.create({...options,core:{...Core,probability(){called++;return {};}}});invalid.setKnown(Candidates.SUB.slice(0,6));assert.throws(()=>invalid.calculate(),/TOO_MANY/);assert.equal(called,0);assert.equal(invalid.setKnown(['crit_rate','crit_rate']),false);assert.equal(invalid.setRole(999),false);
});
test('legacy tool entry URLs select the matching Register tool without changing Classic routes',()=>{
 const View=require('../js/ui-view.js');for(const [page,mode]of [['probability','probability'],['imitate','simulation'],['rule','rules']]){assert.equal(new URL(View.nativeUrl('https://local/'+page+'.html?view=register','register'),'https://local').searchParams.get('tool'),mode);assert.equal(View.nativeUrl('https://local/'+page+'.html?view=classic','classic'),null);}
});
