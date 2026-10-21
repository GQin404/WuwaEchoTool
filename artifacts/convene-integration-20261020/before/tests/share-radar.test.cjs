/* 图表只展示原始贡献：校正、缺项、零分与负分不能被改写成质量比例。 */
const {test}=require('node:test'),assert=require('node:assert/strict'),Share=require('../js/register-share.js');
function model(values){return {model:{status:'available',chain:3,parameters:{mode:'fusion'}},scale:{min:0,max:140},slots:values.map((value,i)=>({position:i+1,status:value==null?'empty':'complete',echo:value==null?null:{cost:[4,3,3,1,1][i],score:{value}}})),summary:{score:199.75,energyCorrection:-10}};}
test('radar retains all five actual contributions and shared score scale without changing total',()=>{
 const data=model([76.5,42,39.25,28,24]),before=JSON.stringify(data),chart=Share.radarData(data);
 assert.deepEqual(chart.entries.map(e=>e.value),[76.5,42,39.25,28,24]);assert.equal(chart.max,80);assert.equal(chart.filled,true);assert.notEqual(data.summary.score,chart.entries.reduce((n,e)=>n+e.value,0));assert.equal(JSON.stringify(data),before);
 const snap=Share.snapshot(data);snap.scale.max=200;assert.equal(data.scale.max,140);
});
test('zero is a real coordinate; incomplete, unavailable and negative values use labels without fill',()=>{
 assert.equal(Share.radarData(model([0,0,0,0,0])).filled,true);
 for(const values of [[null,20,30,40,50],[-3,20,30,40,50],[NaN,20,30,40,50]]){const chart=Share.radarData(model(values));assert.equal(chart.filled,false);assert.equal(chart.entries[0].value,Number.isFinite(values[0])?values[0]:null);}
 const data=model([10,20,30,40,50]);data.slots[1].status='incomplete';assert.equal(Share.radarData(data).filled,false);data.model.status='unavailable';assert.ok(Share.radarData(data).entries.every(e=>e.value===null));
});
