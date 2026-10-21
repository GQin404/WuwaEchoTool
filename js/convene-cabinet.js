/* Difficulty labels are editorial metadata, never population unlock rates. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./convene-core.js'));else root.ConveneCabinet=factory(root.ConveneCore);})(globalThis,function(Core){
'use strict';
const tiers=['legendary','epic','rare','common'];
const groups={legendary:['pull3000','gold100','seven','fiveEarly','streak','consecutive'],epic:['pull1000','gold30','comeback','characters10','weapons10','months'],rare:['pull500','gold10','one','ten','pity','hard','characters5','weapons5','collab','fourCollect'],common:['pull1','pull100','gold1','weaponGold']};
const rarity=Object.freeze(Object.fromEntries(tiers.flatMap(t=>groups[t].map(k=>[k,t]))));
function items(stats){return Core.achievementDetails(stats).map((a,index)=>({...a,rarity:rarity[a.key]||'common',index})).sort((a,b)=>tiers.indexOf(a.rarity)-tiers.indexOf(b.rarity)||(a.state==='unlocked'?0:1)-(b.state==='unlocked'?0:1)||a.index-b.index);}
return {tiers,rarity,items};
});
