const C=require('../js/convene-core.js');
// Explicit synthetic records; never shipped as a real user's history.
const ACCOUNT={uid:'700000001',server:'1001',region:'global'};
function rows(count=420,pool=1,offset=0){const five=new Set([0,12,39,70,82,114,153,193,232,271,310,349,388,419]);return Array.from({length:count},(_,i)=>{const k=i+offset;return {time:new Date(Date.UTC(2026,7,1,0,0,k*120)).toISOString().slice(0,19).replace('T',' '),name:five.has(k)&&pool===1?'今汐':'测试武器',resourceId:five.has(k)&&pool===1?1304:21010011,resourceType:five.has(k)&&pool===1?'角色':'武器',qualityLevel:five.has(k)?5:3,count:1,cardPoolType:pool===1?'角色活动唤取':'武器活动唤取'};}).reverse();}
function archive(){let a=C.mergeAccount(null,ACCOUNT,1,rows()).account;a=C.mergeAccount(a,ACCOUNT,2,rows(90,2)).account;return {version:1,accounts:[a]};}
module.exports={ACCOUNT,rows,archive};
