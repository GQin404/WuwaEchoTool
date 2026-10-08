/* 仅生成独立浏览器 QA 入口，不由产品代码加载。 */
const fs=require('node:fs');
const path=require('node:path');
const directory=process.argv[2];
if(!directory)throw new Error('Expected QA output directory');
const template={roleId:101,roleListId:1,name:'今汐',cls:'mcr-jinxi',ming:0,isImport:false,level:90,totalScore:0,costList:[59,51,52,35,39].map((id,i)=>({costId:600+i,costListId:id,imgCode:String(id),name:'',suite:'光套',type:['Cost4','Cost3','Cost3','Cost1','Cost1'][i],mainAtrri:['暴击22%','属伤30%','共鸣效率32%','攻击18%','攻击18%'][i],sumScores:0,propertyList:(i===2?[['小防御','50'],['大防御','8.1%'],['小生命','320'],['暴击','6.3%'],['共鸣效率','8.4%']]:[['暴击','8.1%'],['暴伤','16.2%'],['大攻击','8.6%'],['技能伤害','8.6%'],['共鸣效率','8.4%']]).map(([property,value])=>({property,value}))}))};
const clone=x=>JSON.parse(JSON.stringify(x));
const imported=clone(template);imported.roleId=102;imported.isImport=true;
imported.costList.forEach((e,i)=>e.mainAtrri={property:['暴击','属伤','共鸣效率','大攻击','大攻击'][i],value:['22%','30%','32%','18%','18%'][i]});
const empty=clone(template);empty.roleId=103;empty.costList=[];
const partial=clone(template);partial.roleId=104;partial.costList[2].propertyList=[];
const unknown=clone(template);unknown.roleId=105;unknown.roleListId=999;
const mechanism=clone(template);mechanism.roleId=106;mechanism.roleListId=62;
const energy=clone(template);energy.roleId=107;energy.roleListId=51;
const records={role:[template,imported,empty,partial,unknown,mechanism,energy],unusedEchoes:[]};
const links=records.role.map(r=>'<li><a href="/'+(r.isImport?'mccost-readonly':'mccost')+'.html?roleid='+r.roleId+'&view=register">'+r.roleId+'</a></li>').join('');
fs.mkdirSync(directory,{recursive:true});
fs.writeFileSync(path.join(directory,'seed.html'),`<!doctype html><meta charset="utf-8"><title>Register QA</title><h1>Isolated synthetic fixtures</h1><button id="seed">Load QA fixtures</button><button id="check">Inspect saved data</button><button id="replace">Replace instance 602</button><output id="result"></output><ul>${links}</ul><script>
const fixture=${JSON.stringify(records)};
document.querySelector('#seed').onclick=()=>{const data=JSON.stringify(fixture);localStorage.setItem('mcData',data);sessionStorage.setItem('qaBaseline',data);document.querySelector('#result').textContent='Fixtures ready';};
document.querySelector('#check').onclick=()=>{document.querySelector('#result').textContent=localStorage.getItem('mcData')===sessionStorage.getItem('qaBaseline')?'Saved data unchanged':'Saved data changed';};
document.querySelector('#replace').onclick=()=>{const data=JSON.parse(localStorage.getItem('mcData'));data.role.find(r=>r.roleId===101).costList[2].costId=9999;localStorage.setItem('mcData',JSON.stringify(data));document.querySelector('#result').textContent='Instance replaced';};
</script>`);
console.log('Generated independent QA fixture entry: '+path.join(directory,'seed.html'));
