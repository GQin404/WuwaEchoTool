/* 旧版中文计分名称只在兼容边界内使用，UI 使用稳定 key。 */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.StatKeys=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
    'use strict';
    const pairs=[['暴击','crit_rate'],['暴伤','crit_damage'],['大攻击','atk_percent'],['小攻击','atk_flat'],['大生命','hp_percent'],['小生命','hp_flat'],['生命','hp_flat_legacy'],['大防御','def_percent'],['小防御','def_flat'],['共鸣效率','resonance_efficiency'],['属伤','elemental_damage'],['治疗','healing_bonus'],['普攻伤害','basic_attack_damage'],['重击伤害','heavy_attack_damage'],['技能伤害','resonance_skill_damage'],['解放伤害','resonance_liberation_damage'],['导电伤害','electro_damage'],['衍射伤害','spectro_damage'],['湮灭伤害','havoc_damage'],['气动伤害','aero_damage'],['热熔伤害','fusion_damage'],['冷凝伤害','glacio_damage']];
    const legacyToKey=Object.freeze(Object.fromEntries(pairs));
    return Object.freeze({legacyToKey,keyToLegacy:Object.freeze(Object.fromEntries(pairs.map(([a,b])=>[b,a]))),fromLegacy:name=>legacyToKey[name]||null});
});
