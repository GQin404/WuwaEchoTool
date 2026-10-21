/* Explicit synthetic window evidence, not actual game/account data. */
const C=require('../js/convene-core.js');
const account={uid:'700000009',server:'global_Server-A_01',region:'global'};
function targetRows(copies=12,step=40){return Array.from({length:copies*step+1},(_,i)=>{const target=i>0&&i%step===0,other=i===0||i%80===0||i===60;return {time:new Date(Date.UTC(2026,5,1,0,0,i*60)).toISOString().slice(0,19).replace('T',' '),resourceId:target?1304:other?1403:21010011,resourceType:target||other?'角色':'武器',name:target?'今汐':other?'安可':'测试武器',qualityLevel:target||other?5:3,count:1,cardPoolType:'角色活动唤取'};}).reverse();}
function targetArchive(copies=12,step=40){return {version:1,accounts:[C.mergeAccount(null,account,1,targetRows(copies,step)).account]};}
module.exports={account,targetRows,targetArchive};
