/* 沿用旧工具的离散概率假设与逐轮舍入；不参与角色评分公式。 */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.EchoToolCore=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
    'use strict';
    const pool=[['暴击',0],['暴伤',1],['大攻击',2],['小攻击',6],['小生命',5],['小防御',7],['共鸣效率',4],['大防御',3],['大生命',2],['普攻伤害',2],['重击伤害',2],['技能伤害',2],['解放伤害',2]];
    const size=k=>['小攻击','小防御'].includes(k)?4:8;
    function probability(properties,score=()=>0,values=[]){
        if(properties.length>5||new Set(properties.map(x=>x.property)).size!==properties.length||properties.some(x=>!pool.some(p=>p[0]===x.property)))throw Error('INVALID_ECHO');
        const existing=properties.map(x=>x.property),remaining=pool.map(p=>p[0]).filter(k=>!existing.includes(k));
        const total=96-existing.reduce((n,k)=>n+size(k),0),open=5-properties.length;
        function chance(key){
            if(existing.includes(key))return {present:true,total:100,rounds:[]};
            const rounds=[];let sum=0,survival=1;
            for(let i=0;i<open;i++){const p=Number((size(key)*100/(total*(remaining.length-i)/remaining.length)).toFixed(2));rounds.push(p);sum+=survival*p;survival*=1-p/100;}
            return {present:false,total:sum,rounds};
        }
        const crit=chance('暴击'),damage=chance('暴伤'),attack=chance('大攻击');
        const dual=crit.present&&damage.present?{present:true,total:100}: {present:false,total:crit.present?damage.total:damage.present?crit.total:open>=2?crit.total*damage.total/100:0};
        const defensive=(28-existing.filter(k=>['大生命','小生命','大防御','小防御'].includes(k)).reduce((n,k)=>n+size(k),0))*100/total;
        const expected=values.filter(s=>remaining.includes(s.property)).reduce((n,s)=>n+Number(score(s)),0)*open/total;
        return {crit,damage,attack,dual,defensive,expected};
    }
    function roll(properties,values,random=Math.random){
        if(properties.length>=5)return null;
        // 保留原模拟器的顺序避重规则，并修正越界时访问不存在词条的问题。
        let index=Math.floor(random()*pool.length);
        for(let n=0;n<pool.length;n++,index=(index+1)%pool.length){const [property,group]=pool[index];if(!properties.some(p=>p.property===property)){const list=values[group].values;return {property,value:list[Math.floor(random()*list.length)]};}}
        return null;
    }
    function resources(count,table){
        const used=count?table[count-1]:{gouliang:0,dakong:0},max=table[4];
        if(!used||!max)throw Error('INVALID_ECHO');
        return {used:{xp:used.gouliang,tuners:used.dakong},recovered:{xp:used.gouliang*.7,tuners:used.dakong*.3},lost:{xp:used.gouliang*.3,tuners:used.dakong*.7},remaining:{xp:max.gouliang-used.gouliang,tuners:max.dakong-used.dakong}};
    }
    return {probability,roll,resources};
});
