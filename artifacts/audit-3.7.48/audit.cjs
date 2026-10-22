// Read committed historical blobs without switching branches or changing the working tree.
const fs=require('node:fs'),path=require('node:path'),vm=require('node:vm'),cp=require('node:child_process');
const root=path.resolve(__dirname,'../..'),revision='d1da524bc140fff09815bd9000ac3fd08eb76459';
const snapshot=path.join(__dirname,'snapshot');
const files=['js/base.js','js/mccost.js','js/mccost2.js','scripts/character-chain-model.cjs','scripts/new-character-model.cjs','tests/character-chain-scoring.test.cjs','tests/new-character-scoring.test.cjs','docs/character-weights-51-53.md','docs/character-weights-57-63.md'];
for(const file of files){const dest=path.join(snapshot,file);fs.mkdirSync(path.dirname(dest),{recursive:true});fs.writeFileSync(dest,cp.execFileSync('git',['show',revision+':'+file],{cwd:root}));}
const context={$:()=>{}};
vm.runInNewContext(fs.readFileSync(path.join(snapshot,'js/base.js'),'utf8')+'\n;globalThis.api={roleList,RoleSumProperty,newCharacterModels,getRoleScoreConfig,countScores};',context);
const api=context.api,types=['normal','skill','heavy','liberate','other'];
const rows=[];
for(const id of [49,...Array.from({length:14},(_,i)=>51+i)]) {
 const role=api.roleList[id-1],ref=api.RoleSumProperty[id-1];
 const modes=api.newCharacterModels.settings[id]?.modes.map(m=>m[0])||(id===49?['tune','fusion']:id===53?['fusion','harmony']:['default']);
 const profiles=modes.flatMap(mode=>Array.from({length:7},(_,ming)=>({mode,ming,...JSON.parse(JSON.stringify(api.getRoleScoreConfig({roleListId:id,ming,damageMode:mode})))})));
 rows.push({id,name:role.name,chainWeightEntries:ref?.mzProperty?.length||0,chainRuleEntries:ref?.mzRule?.length||0,modes,profileCount:profiles.length,
   distinctScoringProfiles:new Set(profiles.map(p=>JSON.stringify({weights:p.weights,rule:p.rule}))).size,
   c0:Object.fromEntries(types.map(t=>[t,role[t]])),hasIndependentChainConfiguration:ref?.mzProperty?.length===6&&ref?.mzRule?.length===6,
   profiles});
}
const tests=['character-chain-scoring.test.cjs','new-character-scoring.test.cjs'].map(file=>{
 const result=cp.spawnSync(process.execPath,[path.join(snapshot,'tests',file)],{cwd:snapshot,encoding:'utf8'});
 return {file,status:result.status,output:result.stdout+result.stderr};
});
const currentContext={$:()=>{}};
vm.runInNewContext(fs.readFileSync(path.join(root,'js/base.js'),'utf8')+'\n;globalThis.api={roleList,RoleSumProperty};',currentContext);
const current=rows.map(({id})=>({id,name:currentContext.api.roleList[id-1].name,
 hasIndependentChainConfiguration:currentContext.api.RoleSumProperty[id-1]?.mzProperty?.length===6&&currentContext.api.RoleSumProperty[id-1]?.mzRule?.length===6}));
const report={revision,rows,tests,current};
fs.writeFileSync(path.join(__dirname,'result.json'),JSON.stringify(report,null,2));
console.log(JSON.stringify({revision,rows:rows.map(({profiles,...r})=>r),tests,currentMissing:current.filter(r=>!r.hasIndependentChainConfiguration)},null,2));
if(tests.some(t=>t.status!==0))process.exitCode=1;
