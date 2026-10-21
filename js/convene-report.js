/* Read-only presentation evidence. Calculations remain in ConveneCore. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./convene-core.js'));else root.ConveneReport=factory(root.ConveneCore);})(globalThis,function(Core){
'use strict';
function eligible(stats){return (stats.intervals||[]).filter(r=>r.interval!=null&&!r.anomaly&&Core.POOLS[r.pool]?.repeat&&Core.POOLS[r.pool]?.hard);}
function highlights(stats){
 const rows=eligible(stats),ids=new Set(rows.map(r=>r.id)),out=[];if(!rows.length)return out;
 const fastest=rows.reduce((a,b)=>b.interval<a.interval?b:a);
 out.push({key:'highlightFastest',value:fastest.interval,records:[fastest.id]});
 let best=[],run=[];for(const p of stats.pools||[]){run=[];for(const r of p.five){if(ids.has(r.id)&&r.interval<=20){if(run.length&&run.at(-1).segment!==r.segment)run=[];run.push(r);if(run.length>best.length)best=run.slice();}else run=[];}}
 if(best.length>=3)out.push({key:'highlightStreak',value:best.length,records:best.map(r=>r.id)});
 const early=rows.filter(r=>r.interval<=10);
 if(early.length>=2)out.push({key:'highlightEarly',value:early.length,records:early.map(r=>r.id)});
 const opportunities=stats.limited.win+stats.limited.loss;
 if(opportunities>=3&&stats.limited.win>0)out.push({key:'highlightUP',value:stats.limited.win,denominator:opportunities,records:stats.five.filter(r=>r.effectiveResult==='win').map(r=>r.id)});
 return out.slice(0,3);
}
function acquisitions(character){return (character?.five||[]).slice().sort(Core.order).map((r,i)=>({ordinal:i+1,id:r.id,time:r.time,pool:r.pool,interval:r.interval,lowerBound:r.interval==null&&!r.anomaly&&r.observed>0?r.observed:null,anomaly:!!r.anomaly,upResult:r.effectiveResult||'unknown',bannerId:r.bannerId||null}));}
function coverage(stats){return {censored:stats.five.filter(r=>r.interval==null).length,gaps:stats.pools.reduce((n,p)=>n+p.gaps,0),samples:stats.luck.samples};}
const luckAchievements=['one','ten','fiveEarly','streak','consecutive','comeback'];
function representativeAchievements(stats){return Core.achievementDetails(stats).filter(a=>a.state==='unlocked'&&luckAchievements.includes(a.key)).slice(0,3);}
return {eligible,highlights,acquisitions,coverage,representativeAchievements};});
