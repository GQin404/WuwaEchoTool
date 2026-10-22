const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const {createNewCharacterModels}=require('../scripts/new-character-model.cjs');
const {estimate,chainTables}=require('../scripts/suoming-share-estimate.cjs');
const m=createNewCharacterModels(), f=m.suomingFacts;
const near=(a,b)=>assert.ok(Math.abs(a-b)<.00001,`${a} != ${b}`);
const role=(ming,damageMode='unison')=>({roleListId:64,ming,damageMode});
const parts=(c,mode)=>m.packets(role(c,mode));
const packet=(c,tag,mode)=>parts(c,mode).find(p=>p.tag===tag);
// Independent source-based classification and C0 sum, including the delayed liberation packet.
const c0=m.profile(role(0)).weights;
const total=3579.46+106.61+695.88+59.65*6*.8+273.54;
near(c0.normal,3579.46/total); near(c0.skill,106.61/total);
near(c0.liberate,(695.88+59.65*6*.8)/total); near(c0.other,273.54/total);
near(c0.normal,estimate().percent.normal/100);
assert.equal(m.modeFor({roleListId:64,damageMode:'obsolete'}),'unison');
for(const [mode] of m.settings[64].modes)for(let c=0;c<=6;c++) {
  const p=m.profile(role(c,mode));
  assert.equal(p.weights.heavy,0); assert.equal(p.rule.typeCoefficients.heavy,0);
  near(['normal','skill','heavy','liberate','other'].reduce((s,k)=>s+p.weights[k],0),1);
  assert(parts(c,mode).every(p=>!p.fixed&&p.element==='导电'&&p.damage>=0));
  if(mode.startsWith('contract')) {
    assert.equal(packet(c,'thunder',mode),undefined);
    near(packet(c,'contractCombo',mode).budget,4*(130.84+228.82+234.56+357.51));
    near(packet(c,'finisher',mode).cd,(c>=2?3.2:2.8)+(c>=6?3:1));
  } else {
    near(packet(c,'thunder',mode).budget,6*59.65);
    assert.equal(packet(c,'contractCombo',mode),undefined);
  }
}
// C1 amplifies both intros by 60%, not the finisher / no-abandon skill.
near(packet(1,'introClosed').budget/packet(0,'introClosed').budget,1.6);
near(packet(1,'introOpen').budget/packet(0,'introOpen').budget,1.6);
near(packet(1,'noAbandon').budget,152.67);
near(packet(1,'finisher').budget,1551.41);
// C2's own 40% CD includes off-field packets, without assigning the next ally's bonus to self.
for(const p of parts(2))near(p.cd,3.2);
for(const p of parts(2,'contract'))near(p.cd,p.tag==='contractActivation'||['contractCombo','noAbandon','finisher','finisherHold','echo'].includes(p.tag)?4.2:3.2);
// C3 is final amplification; first-rotation damage before liberation must not receive it.
near(packet(3,'beforeLiberation').multiplier,1.3);
near(packet(3,'beforeLiberation','unisonOpening').multiplier,1);
near(packet(3,'introOpen','unisonOpening').multiplier,1.3);
near(packet(3,'finisher','contractOpening').multiplier,1.3);
near(packet(3,'liberationMain','contract').multiplier,1.03);
near(packet(6,'liberationMain','contract').multiplier,1.045);
// C4 increases all packet attacks by 20% BASE ATK; common scaling need not alter shares.
for(const p of parts(4))near(p.attack,2700);
for(const k of ['normal','skill','heavy','liberate','other'])near(m.profile(role(4)).weights[k],m.profile(role(3)).weights[k]);
assert(m.profile(role(4)).rule.attack01<m.profile(role(3)).rule.attack01);
// C5 targets only liberation main hit, not the six thunder strikes.
near(packet(5,'liberationMain').budget/packet(4,'liberationMain').budget,1.4);
near(packet(5,'thunder').budget,packet(4,'thunder').budget);
// C6 boosts both finisher portions, not no-abandon; contract CD adds 200% on top of 100%.
for(const mode of ['unison','contract']) {
  for(const tag of ['finisher','finisherHold'])near(packet(6,tag,mode).budget/packet(5,tag,mode).budget,1.5);
  near(packet(6,'noAbandon',mode).budget,f.noAbandon);
}
near(packet(6,'finisher','contract').cd,6.2);
near(packet(6,'finisher').cd,3.2);
assert(m.profile(role(6,'contract')).rule.critDamage < m.profile(role(5,'contract')).rule.critDamage);
// Rule-page table and report are generated from the same source as scoring.
assert(fs.readFileSync(path.join(__dirname,'../docs/suoming-share-estimate.md'),'utf8').includes(chainTables()));
console.log('PASS: Suoming 28 chain/scenario profiles, packet-specific chain mechanics, mode exclusivity and report parity.');
