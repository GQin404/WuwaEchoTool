/* 历史资料与规则分离；未核实的联动规则不参与推算。 */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./convene-history-data.js'));else root.ConveneBanners=factory(root.ConveneHistoryData);})(typeof globalThis!=='undefined'?globalThis:this,function(History){
'use strict';
const rules={1:{key:'limited',hard:80,repeat:true},2:{key:'weapon',hard:80,repeat:true},3:{key:'standard',hard:80,repeat:true},4:{key:'standardWeapon',hard:80,repeat:true},5:{key:'novice',hard:50,repeat:false},6:{key:'choice',hard:80,repeat:false},101:{key:'collabCharacter',hard:null,repeat:false},102:{key:'collabWeapon',hard:null,repeat:false},103:{key:'ambiguous',hard:null,repeat:false},7:{key:'gift',hard:null,repeat:false},8:{key:'unknown',hard:null,repeat:false}};
const revision='2026-10-21',sources={shorekeeper:'https://wutheringwaves.kurogames.com/en/main/news/detail/1420',patch13:'https://wutheringwaves.kurogames.com/en/main/news/detail/1374',collab:'https://wutheringwaves.kurogames.com/en/main/news/detail/4765'};
const banners=[{id:'global-1.3-shorekeeper',pool:1,names:['Till the Sea Turns Clear'],start:'2024-09-29 11:00:00',end:'2024-10-24 09:59:59',region:'global',servers:['Asia'],up:['1505'],group:'featured-character',ruleVersion:'traditional-v1',status:'verified',sources:[sources.shorekeeper,sources.patch13],timeBasis:'Asia UTC+8; start after maintenance, server-local records'},
...[[101,'lucy','Dreaming Upon the Moon','1511'],[101,'rebecca','Rekindled Embers of Rage','1308'],[102,'spectral-trigger','Spectral Trigger','21030056'],[102,'skull-thrasher','Skull Thrasher','21030066']].map(([pool,id,name,item])=>({id:'edgerunners-'+id,pool,names:[name],start:null,end:null,region:'global',servers:[],up:[item],group:null,ruleVersion:null,status:'identity-only',currency:null,hard:null,upRule:null,inheritance:null,sources:[sources.collab]}))];
banners.push(...(History||[]));
rules[8]={key:'newVoyageCharacter',hard:null,repeat:false};rules[9]={key:'newVoyageWeapon',hard:null,repeat:false};rules[104]={key:'reverbCharacter',hard:null,repeat:true};rules[105]={key:'reverbWeapon',hard:null,repeat:true};
for(const [id,r]of Object.entries(rules)){r.four=[1,2,3,4,5,6,104,105].includes(+id)?10:null;r.group={1:'featured-character',2:'featured-weapon',3:'standard-character',4:'standard-weapon',5:'novice',6:'beginner-choice'}[id]||null;}
function category(r){const known=banners.find(b=>[101,102].includes(b.pool)&&b.names.includes(r.label));if(known)return known.pool;if(/Reverb|回響|回响|星途重奏|潮铸重奏|潮鑄重奏/.test(r.label||''))return /武器|Weapon|Tideforge/.test(r.label)?105:104;return /联动|聯動|Collab/i.test(r.label||'')?(/武器|Weapon/i.test(r.label||'')?102:101):({10:101,11:102,12:104,13:105}[r.pool]||r.pool);}
function classifier(a){const exclusive=new Set(banners.filter(b=>[101,102].includes(b.pool)).flatMap(b=>b.up)),ambiguous=new Set((a?.records||[]).filter(r=>[1,2].includes(r.pool)&&exclusive.has(r.item)&&category(r)===r.pool).map(r=>r.pool));return r=>ambiguous.has(r.pool)?103:category(r);}
function candidates(r,a,entries=banners){return entries.filter(b=>b.status==='verified'&&b.pool===r.pool&&b.region===a.region&&b.start&&b.end&&r.time>=b.start&&r.time<=b.end&&(b.servers.includes(a.server)||!b.servers.length&&(r.time.slice(0,10)>b.start.slice(0,10)&&r.time.slice(0,10)<b.end.slice(0,10))));}
function resolve(r,a,entries=banners){const all=candidates(r,a,entries),explicit=all.filter(b=>b.id===r.banner||b.names.includes(r.label)),unique=x=>[...new Map(x.map(b=>[[b.pool,b.start,b.end,b.up.join(','),b.group].join('|'),b])).values()];const named=unique(explicit);if(named.length===1&&!named[0].selectionRequired)return named[0];const possible=unique(all);return possible.length===1&&!possible[0].selectionRequired?possible[0]:null;}
function campaign(r,a){return (History||[]).find(b=>[101,102].includes(b.pool)&&(b.names.includes(r.label)||({10:101,11:102}[r.pool]===b.pool))&&a.region===b.region&&r.time>=b.start&&r.time<=b.end)?.group||null;}
function transition(state,isUp){
 let outcome='unknown',next='unknown',conflict=false;
 if(isUp===true){outcome=state==='guaranteed'?'guarantee':state==='chance'?'win':'unknown';next='chance';}
 if(isUp===false){outcome=state==='guaranteed'?'unknown':'loss';next=state==='guaranteed'?'unknown':'guaranteed';conflict=state==='guaranteed';}
 return {outcome,next,conflict};
}
return {rules,revision,sources,banners,category,classifier,resolve,candidates,campaign,transition,standardCharacters:['1104','1203','1301','1405','1503']};
});
