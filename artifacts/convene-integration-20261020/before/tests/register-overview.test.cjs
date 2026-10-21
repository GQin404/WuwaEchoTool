const fs=require('fs'),vm=require('vm'),assert=require('node:assert/strict');const adapter=require('../js/register-overview.js'),i18n=require('../js/i18n.js');
const html=new Map();let chain;chain=new Proxy({},{get:(_,k)=>(v)=>{if(k==='html')html.set(chain.selector,v);return chain;}});
const context={getDaysDiff:()=>1,$:s=>{if(typeof s==='function')return;return {attr(){return this},tooltip(){return this},html(v){html.set(s,v);return this}}},console};
vm.createContext(context);vm.runInContext(fs.readFileSync('js/base.js','utf8'),context);vm.runInContext(fs.readFileSync('artifacts/register-overview/classic-before.js','utf8'),context);
const cases=[[90,80,70,60,90.01,80.01,70.01,60.01],...Array.from({length:25},(_,i)=>Array(16).fill(100-i*4)),[50,50.004],[75,25.004]];
cases.push(...[1250,1150,1050,950,850,750,650,550,450,375,325,275,225,175,125,100].map(total=>Array(Math.ceil(total/85)).fill(total/Math.ceil(total/85))));
const levels=new Set();
for(const scores of cases){const records=scores.map((score,i)=>({roleId:i,totalScore:score,isImport:false}));context.curData={role:records};context.pulaoPJ();const r=context.getCultivationOverview(records);levels.add(r.appraisal.level);assert.equal(html.get('#by01'),r.bys.b01+'个');assert.equal(html.get('#by02'),r.bys.b02+'个');assert.equal(html.get('#by03'),r.bys.b03+'个');assert.equal(html.get('#by04'),r.bys.b04+'个');assert.equal(html.get('#userPJ'),r.appraisal.dj);assert.ok(html.get('#pj-words').includes(r.sumScore));assert.ok(html.get('#pj-words').includes(r.avgScore));assert.ok(html.get('#pj-words').includes(r.appraisal.ps));}
assert.equal(levels.size,16);
const calc=context.getCultivationOverview,valid=()=>({summary:{status:'complete'}}),records=[{totalScore:99},{isImport:true,totalScore:65}];assert.equal(calc(records).sumScore,'65.00');assert.equal(calc(records).count,1);
const boundary=calc(cases[0].map(totalScore=>({totalScore})));assert.deepEqual(JSON.parse(JSON.stringify(boundary.bys)),{b01:1,b02:2,b03:2,b04:2});assert.equal(boundary.sumScore,'600.04');assert.equal(boundary.avgScore,'75.00');
for(const locale of ['zh-TW','zh-CN','en']){const lang=i18n.create({language:locale});for(const scores of cases){const data=adapter.prepare(scores.map(totalScore=>({totalScore})),valid,calc);assert.ok(!adapter.render(data,lang).includes('[overview.'));}for(const list of [[],[{totalScore:null}],[{totalScore:''}],[{totalScore:'bad'}]]){const data=adapter.prepare(list,valid,calc);assert.equal(data.result,null);assert.ok(!adapter.render(data,lang).includes('rr-overview-readings'));assert.equal(data.bys,null);assert.ok(!adapter.render(data,lang).includes(lang.t('overview.unavailable')));}assert.equal(adapter.prepare(records,()=>({summary:{status:'incomplete'}}),calc).result,null);}
console.log('PASS Classic parity: 45 fixtures, all 16 appraisal levels, strict boundaries, imported precedence, rounding, localized appraisal and empty/incomplete data.');


// 混合完整度不隐藏总览，也不使用部分角色生成全范围鉴定。
for(const locale of ['zh-TW','zh-CN','en']){
 const input=[{totalScore:67.65,complete:true},{totalScore:95,complete:false}],before=JSON.stringify(input);
 const normalize=r=>({summary:{status:r.complete?'complete':'incomplete'}}),lang=i18n.create({language:locale});
 const mixed=adapter.prepare(input,normalize,calc);
 assert.equal(mixed.ready,1);assert.equal(mixed.pending,1);assert.equal(mixed.result,null);
 assert.deepEqual(JSON.parse(JSON.stringify(mixed.bys)),{b01:0,b02:0,b03:0,b04:1});
 const output=adapter.render(mixed,lang);assert.equal((output.match(/<h3>/g)||[]).length,5);assert.ok(!output.includes(lang.t('overview.unavailable')));assert.ok(!output.includes('67.65'));assert.ok(output.includes(lang.t('overview.completedOnly')));assert.ok(!output.includes('Classic'));assert.ok(!output.includes(lang.t('overview.boundaries')));assert.equal(mixed.total,2);assert.equal(mixed.completed,1);assert.equal(mixed.remaining,1);
 assert.equal(JSON.stringify(input),before);
 const importedOnly=adapter.prepare([...input,{isImport:true,totalScore:99,complete:false}],normalize,calc);
 assert.equal(importedOnly.total,3);assert.equal(importedOnly.completed,1);assert.equal(importedOnly.remaining,2);assert.equal(importedOnly.count,1);assert.equal(importedOnly.ready,0);assert.equal(importedOnly.bys,null);
 const complete=adapter.prepare(input.map(r=>({...r,complete:true})),normalize,calc);assert.equal(complete.result.sumScore,'162.65');assert.equal(complete.pending,0);
}
console.log('PASS mixed completeness: persistent four bands and natural empty state, partial distribution, no partial appraisal, imported precedence, three locales, no mutation.');
