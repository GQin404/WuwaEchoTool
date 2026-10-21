const C=require('../js/convene-core.js');const info={region:'global',server:'Asia',uid:'700000099'};
function fixture(n=31){let marks=[0],at=0;for(let i=1;i<n;i++){at+=[1,4,10,20,39,60][i%6];marks.push(at);}const set=new Set(marks),raw=Array.from({length:at+1},(_,i)=>({id:String(i+1),time:new Date(Date.UTC(2024,9,1,0,0,i)).toISOString().slice(0,19).replace('T',' '),resourceId:set.has(i)?'1505':'21010013',resourceType:set.has(i)?'角色':'武器',qualityLevel:set.has(i)?5:3,name:'Synthetic',cardPoolType:'Till the Sea Turns Clear'})).reverse();return C.mergeAccount(null,info,1,raw).account;}

module.exports={fixture};
