// 从正式计分模型生成三位角色的全部链数表，避免文档和网页各维护一份数值。
const fs=require('node:fs'),path=require('node:path');
const model=require('./new-character-model.cjs').createNewCharacterModels();
const ids=[54,55,56],names={54:'露西',55:'丽贝卡',56:'洛瑟菈'};
const profiles=Object.fromEntries(ids.map(id=>[id,Object.fromEntries(model.settings[id].modes.map(([mode])=>[
    mode,Array.from({length:7},(_,ming)=>model.profile({roleListId:id,ming,damageMode:mode}))
]))]));
function tables(){
    return ids.flatMap(id=>model.settings[id].modes.map(([mode,label])=>
        '### '+names[id]+' · '+label+'\n\n| 链 | 普攻 | 技能 | 重击 | 解放 | 其他 | 评分分母 |\n|---|---:|---:|---:|---:|---:|---:|\n'+
        profiles[id][mode].map(({weights:w},ming)=>'| '+ming+' | '+['normal','skill','heavy','liberate','other'].map(k=>(w[k]*100).toFixed(2)+'%').join(' | ')+' | '+w.maxscore.toFixed(2)+' |').join('\n')
    )).join('\n\n');
}
if(require.main===module){
    if(process.argv.includes('--write-docs')){
        const file=path.join(__dirname,'../docs/character-weights-54-56.md'),source=fs.readFileSync(file,'utf8');
        const start='<!-- BEGIN MISSING CHARACTER TABLES -->',end='<!-- END MISSING CHARACTER TABLES -->';
        if(!source.includes(start)||!source.includes(end))throw Error('找不到链数表标记');
        fs.writeFileSync(file,source.slice(0,source.indexOf(start))+start+'\n\n'+tables()+'\n\n'+source.slice(source.indexOf(end)));
        console.log('已更新三位角色的63组链数／情景表。');
    }else console.log(JSON.stringify({facts:model.missingCharacterFacts,profiles},null,2));
}
module.exports={profiles,tables};
