/* Read-only cover selection and stable artwork identity; never edits player archives. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./convene-core.js'),require('./weapon-portraits.js'),require('./character-catalog.js'));else root.ConveneAssets=factory(root.ConveneCore,root.WeaponPortraits,root.CharacterCatalog);})(typeof globalThis!=='undefined'?globalThis:this,function(Core,Weapons,Characters){
'use strict';
const CHARACTER_FALLBACK='image/convene/character-fallback.svg';
function create({roles=[],dictionaries={},portraits,weaponPortraits=Weapons}={}){
 const registry=Characters.create({roles,dictionaries,portraits});
 function role(record){return registry.find(record);}
 function isCharacter(r){return !!role(r)||Core.isCharacter(r);}
 function artwork(r){if(!r)return {src:CHARACTER_FALLBACK,fallback:CHARACTER_FALLBACK,hasArtwork:false,kind:'character'};if(!isCharacter(r))return {...weaponPortraits.resolve(r),kind:'weapon'};const entry=role(r),src=portraits?.resolve(entry);return {entry,src:src||CHARACTER_FALLBACK,fallback:CHARACTER_FALLBACK,hasArtwork:!!src,kind:'character'};}
 function latest(stats,pool){const rows=stats.pools.find(p=>p.pool===pool)?.five||[];return [...rows].filter(r=>r.pool===pool&&r.rank===5&&(pool===1?isCharacter(r):pool===2?!isCharacter(r):true)).sort(Core.order).at(-1)||null;}
 function name(r,locale='zh-CN'){const a=artwork(r);return a.entry?.names?.[locale]||a.entry?.name||r?.name||'';}
 function searchText(r){const a=artwork(r);return [r.name,r.item,...Object.values(a.entry?.names||{}),...(a.entry?.aliases||[])].filter(Boolean).join(' ').toLowerCase();}
 return {role,isCharacter,artwork,latest,name,searchText,registry};
}
return {create,CHARACTER_FALLBACK};
});
