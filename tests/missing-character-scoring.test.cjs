// 独立核对库街区十级系数与逐链作用对象，避免只把模型输出与自身比较。
const assert=require('node:assert/strict'),fs=require('node:fs'),path=require('node:path');
const model=require('../scripts/new-character-model.cjs').createNewCharacterModels();
const {tables}=require('../scripts/missing-character-report.cjs');
const near=(a,b)=>assert.ok(Math.abs(a-b)<.00001,`${a} != ${b}`);
const role=(id,ming,damageMode)=>({roleListId:id,ming,damageMode});
const packet=(id,c,tag,mode)=>model.packets(role(id,c,mode)).find(p=>p.tag===tag);
const profile=(id,c,mode)=>model.profile(role(id,c,mode));
let count=0;
for(const id of [54,55,56]) {
 assert.equal(model.modeFor(role(id,0,'old-unsupported')),model.settings[id].modes[0][0]);
 for(const [mode] of model.settings[id].modes)for(let c=0;c<=6;c++) {
  const p=profile(id,c,mode),packets=model.packets(role(id,c,mode));
  near(['normal','skill','heavy','liberate','other'].reduce((s,k)=>s+p.weights[k],0),1);
  assert(p.weights.maxscore>0&&Object.values(p.rule.typeCoefficients).every(Number.isFinite));
  assert(packets.every(p=>p.damage>=0&&Number.isFinite(p.damage)));
  assert(packets.filter(p=>p.fixed).every(p=>p.type==='other'));
  if(id===54)assert.equal(p.weights.liberate,0);
  if(id===55)assert.equal(p.weights.heavy,0);
  if(id===56){assert.equal(p.weights.liberate,0);assert.equal(p.weights.heavy,0);assert.equal(p.rule.efficiency01,0);}
  count++;
 }
}
assert.equal(count,63);
// 露西：SQL提升是“增加倍率”，初始Ram限制程序次数，生存链不捏造输出。
near(packet(54,0,'multiThreadSQL').budget,238.6*3.7);
near(packet(54,2,'multiThreadSQL').budget,238.6*6.6);
assert.equal(packet(54,0,'motion').count,4);assert.equal(packet(54,0,'motion').ram,24);
assert.equal(packet(54,2,'motion').count,5);assert.equal(packet(54,2,'motion').ram,32);
assert.equal(packet(54,0,'cluster'),undefined);near(packet(54,2,'cluster').budget,79.53);
near(packet(54,2,'pulseC2').budget,450);assert.equal(packet(54,1,'pulseC2'),undefined);
near(packet(54,3,'overwrite').budget/packet(54,2,'overwrite').budget,1.5);
near(packet(54,3,'overwrite').cd,3.8);near(packet(54,3,'multiThreadSQL').cd,2.8);
near(packet(54,3,'motion').budget/packet(54,2,'motion').budget,1.65);
near(packet(54,6,'motion').budget/packet(54,5,'motion').budget,1.6);
near(packet(54,6,'multiThreadSQL').budget/packet(54,5,'multiThreadSQL').budget,1.4);
near(packet(54,1,'motion').damage,packet(54,0,'motion').damage);
assert.equal(packet(54,0,'multiThreadSQL','lucyNetwork'),undefined);
near(packet(54,0,'overwrite','lucyNetwork').budget,894.65);
near(packet(54,0,'overwrite').budget,1789.29);
assert.deepEqual(profile(54,4).weights,profile(54,5).weights);
// 丽贝卡：大招机枪归普攻，只有大烟花归解放；一链不强化回路强化重击。
const burst='rebeccaBurst';
near(packet(55,0,'liberationGun',burst).budget,5*24.3+5*48.6+10*72.9);
near(packet(55,0,'liberationGun').budget,24.3);
assert.equal(packet(55,0,'liberationGun',burst).type,'normal');
assert.equal(packet(55,0,'firework').type,'liberate');
near(packet(55,1,'hunterAttacks').budget/packet(55,0,'hunterAttacks').budget,1.5);
near(packet(55,1,'convertedFinishers').budget,packet(55,0,'convertedFinishers').budget);
near(packet(55,3,'liberationGun').budget/packet(55,2,'liberationGun').budget,1.6);
near(packet(55,3,'firework').budget/packet(55,2,'firework').budget,1.6);
near(packet(55,4,'liberationGun').cd,3.28);
near(packet(55,4,'liberationGun').multiplier,1.15*2/(2-.24));
near(packet(55,6,'finishC6').budget,1800);
near(packet(55,6,'finishC6','rebeccaOpening').budget,2700);
near(packet(55,6,'convertedFinishers','rebeccaOpening').budget,397.66*2+278.34);
near(packet(55,6,'hunterAttacks').typeScale,1.4);
near(packet(55,6,'hunterAttacks').bonus,2+.2+.2*1.4);
const r6=profile(55,6),ps=model.packets(role(55,6));
near(r6.rule.typeCoefficients.normal,2.5*ps.filter(p=>p.type==='normal').reduce((s,p)=>s+p.damage*1.4/p.bonus,0)/ps.reduce((s,p)=>s+p.damage,0));
assert(packet(55,3,'ironAttacks','rebeccaOpening').cd>packet(55,2,'ironAttacks','rebeccaOpening').cd);
assert(packet(55,3,'hunterAttacks','rebeccaOpening').multiplier>packet(55,2,'hunterAttacks','rebeccaOpening').multiplier);
// 洛瑟菈：照片来自变奏100+追光50；同一动作按实际模态转换伤害分类。
for(const tag of ['convertedLiberation','forget1','forget2','forget3','departure']) {
 assert.equal(packet(56,0,tag).type,'other');assert.equal(packet(56,0,tag).echoSkill,true);
 assert.equal(packet(56,0,tag,'lucillaFrost').type,'normal');
}
near(packet(56,0,'chaseLight').budget,548.98);
near(packet(56,0,'focusSetup').budget,39.78);
near(packet(56,0,'departure').budget,848.07);
near(packet(56,3,'departure').budget,848.07*2);
near(packet(56,6,'departure').multiplier,7);
near(packet(56,5,'forget1').budget,285.48*1.5);
near(packet(56,1,'intro').crit,.8);near(packet(56,1,'focusSetup').crit,.8);near(packet(56,1,'chaseLight').crit,1);
assert(profile(56,1).rule.crit<profile(56,0).rule.crit/5);
for(let i=1;i<=3;i++){
 near(packet(56,4,'forget'+i).attack,2500+i*100);
 near(packet(56,0,'forget'+i,'lucillaEchoOpening').cd,2.8+(i+1)*.1);
}
near(packet(56,0,'convertedLiberation','lucillaEchoOpening').cd,2.9);
near(packet(56,0,'convertedLiberation').cd,3.2);
near(packet(56,2,'convertedLiberation').bonus,2+.25+.3+.4);
// 霜渐的二链是效应／团队收益，不能虚构直接伤害评分变化。
assert.deepEqual(profile(56,1,'lucillaFrost').weights,profile(56,2,'lucillaFrost').weights);
const document=fs.readFileSync(path.join(__dirname,'../docs/character-weights-54-56.md'),'utf8');
assert(document.includes(tables()));
console.log('通过：三位角色63组配置、技能分类、逐链系数、Ram与过载预算、暴击封顶、声骸转换和文档一致性。');
