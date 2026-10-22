// Source facts and conditional rotation expansion: docs/suoming-share-estimate.md.
// Chain profiles share the exact model embedded in the application's scoring configuration.
const model = require('./new-character-model.cjs').createNewCharacterModels();
const round = n => Number(n.toFixed(4));
const facts = model.suomingFacts;
function estimate({ thunderHits = 6, echoRelativeBonus = 1, held = true,
  extraOpenCombos = 0, introRelativeBonus = 1 } = {}) {
  // Reference generic damage multiplier 2, on-field passive +0.5.
  // After switching, that passive expires: off-field / on-field = 2 / 2.5.
  const normal = (facts.introClosed + facts.introOpen) * introRelativeBonus
    + facts.openThird + facts.openFourth + facts.noAbandon + facts.finisher
    + (held ? facts.finisherHold : 0)
    + extraOpenCombos * (facts.openFirst + facts.openSecond + facts.openThird + facts.openFourth);
  const damage = {
    normal, skill: facts.skill, heavy: 0,
    liberate: facts.liberation + thunderHits * facts.thunder * 2 / 2.5,
    other: facts.echo * echoRelativeBonus
  };
  const total = Object.values(damage).reduce((a, b) => a + b, 0);
  return { damage: Object.fromEntries(Object.entries(damage).map(([k,v])=>[k,round(v)])),
    percent: Object.fromEntries(Object.entries(damage).map(([k,v])=>[k,round(v / total * 100)])) };
}
function standEstimate(combos) {
  const critRatio = (1 + .8 * (3.8 - 1)) / (1 + .8 * (2.8 - 1));
  const openCombo = facts.openFirst + facts.openSecond + facts.openThird + facts.openFourth;
  const damage = {
    normal: facts.introClosed + facts.openThird + facts.openFourth
      + (combos * openCombo * 2 + facts.noAbandon + facts.finisher + facts.finisherHold) * critRatio,
    // One skill before liberation and one activation skill; activation hit timing is assumed boosted.
    skill: facts.skill * (1 + critRatio), heavy: 0,
    liberate: facts.liberation, other: facts.echo * critRatio
  };
  const total = Object.values(damage).reduce((a,b)=>a+b,0);
  return Object.fromEntries(Object.entries(damage).map(([k,v])=>[k,round(v/total*100)]));
}
const scenarios = {
  echoBeforeSwitch: estimate(),
  echoAfterSwitch: estimate({echoRelativeBonus: .8}),
  threeThunderHits: estimate({thunderHits: 3}),
  noThunderHits: estimate({thunderHits: 0}),
  tapFinisher: estimate({held: false}),
  extraOpenCombo: estimate({extraOpenCombos: 1}),
  introsWithoutPassive: estimate({introRelativeBonus: .8}),
  standaloneOneCombo: standEstimate(1),
  standaloneTwoCombos: standEstimate(2)
};
const profiles = Object.fromEntries(model.settings[64].modes.map(([mode])=>[
  mode, Array.from({length:7},(_,ming)=>model.profile({roleListId:64,ming,damageMode:mode}))
]));
function chainTables() {
  return model.settings[64].modes.map(([mode,label])=>
    '### '+label+'\n\n| 鏈 | 普攻 | 技能 | 重擊 | 解放 | 其他 | 評分分母 |\n|---|---:|---:|---:|---:|---:|---:|\n'+
    profiles[mode].map(({weights:w},c)=>'| '+c+' | '+['normal','skill','heavy','liberate','other'].map(k=>(w[k]*100).toFixed(2)+'%').join(' | ')+' | '+w.maxscore.toFixed(2)+' |').join('\n')
  ).join('\n\n');
}
if (require.main === module) {
  if(process.argv.includes('--write-docs')) {
    const fs=require('node:fs'),path=require('node:path');
    const file=path.join(__dirname,'../docs/suoming-share-estimate.md');
    const start='<!-- BEGIN SUOMING CHAIN TABLES -->',end='<!-- END SUOMING CHAIN TABLES -->';
    const source=fs.readFileSync(file,'utf8');
    if(!source.includes(start)||!source.includes(end))throw Error('Missing chain table markers');
    fs.writeFileSync(file,source.slice(0,source.indexOf(start))+start+'\n\n'+chainTables()+'\n\n'+source.slice(source.indexOf(end)));
    console.log('Updated 28 Suoming chain/scenario rows.');
  } else console.log(JSON.stringify({facts, scenarios, profiles}, null, 2));
}
module.exports = {facts, estimate, scenarios, profiles, chainTables};
