/* Derived, auditable target-window efficiency. Never invent event spending. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./convene-core.js'));else root.ConveneCharacterRating=factory(root.ConveneCore);})(typeof globalThis!=='undefined'?globalThis:this,function(C){
'use strict';
const RULES=Object.freeze({version:'target-window-v1',referencePerCopy:160,tiers:Object.freeze([{tier:'fate',min:95},{tier:'star',min:85},{tier:'lucky',min:70},{tier:'steady',min:40},{tier:'headwind',min:20},{tier:'abyss',min:0}])});
function score(draws,copies){if(!Number.isSafeInteger(copies)||copies<1||copies>7||!Number.isSafeInteger(draws)||draws<copies)throw Error('INVALID_TARGET');return Math.max(0,Math.min(100,100*(1-(draws-copies)/(RULES.referencePerCopy*copies-copies))));}
function evaluate(account,item,target=0,scope='investment'){
 if(!Number.isInteger(target)||target<0||target>6||!['investment','window'].includes(scope))throw Error('INVALID_TARGET');
 const a=account?C.validate({version:1,accounts:[account]}).accounts[0]:null,history=a?C.character(a,item).five:[],copies=target+1;
 const result={version:RULES.version,item:String(item),target,copies,scope,total:history.length,excess:Math.max(0,history.length-7),maxVisibleTarget:Math.min(6,history.length-1),reached:history.length>=copies,actualChain:null,bannerSpend:null,draws:null,windowDraws:null,score:null,tier:'observing',reason:'targetNotReached',anchor:null,end:null,acquisitions:history,selected:history.slice(0,copies),evidence:[],referencePerCopy:RULES.referencePerCopy};
 if(!result.reached)return result;
 const selected=history.slice(0,copies),first=selected[0],end=selected.at(-1);result.end={id:end.id,time:end.time};
 if(selected.some(r=>r.pool!==1)){result.reason='crossPool';return result;}
 const rows=a.records.filter(r=>r.pool===1).sort(C.order),firstIndex=rows.findIndex(r=>r.id===first.id),endIndex=rows.findIndex(r=>r.id===end.id);
 const start=rows.findIndex(r=>r.rank===5);
 if(start<0||start>=firstIndex){result.reason='missingOrigin';return result;}
 const from=rows[start],span=a.spans.find(s=>s.pool===1&&rows.findIndex(r=>r.id===s.first)<=start&&rows.findIndex(r=>r.id===s.last)>=endIndex);
 if(!span){result.reason='historyGap';return result;}
 let prior=start;for(let i=start+1;i<=endIndex;i++)if(rows[i].rank===5){if(i-prior>C.POOLS[1].hard){result.reason='invalidInterval';return result;}prior=i;}
 result.anchor={id:from.id,time:from.time};result.windowDraws=endIndex-start;result.evidence=rows.slice(start+1,endIndex+1).map(r=>r.id);
 // A visible prior 5★ proves this window's start, not a banner's start or lifetime R.
 if(scope!=='window'){result.reason='bannerUnverified';return result;}
 result.draws=result.windowDraws;result.score=score(result.draws,copies);result.tier=RULES.tiers.find(t=>result.score>=t.min).tier;result.reason='windowVerified';return result;
}
return {RULES,score,evaluate};});
