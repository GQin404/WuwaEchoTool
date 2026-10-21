/* Read-only cover selection and stable artwork identity; never edits player archives. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./convene-core.js'),require('./weapon-portraits.js'));else root.ConveneAssets=factory(root.ConveneCore,root.WeaponPortraits);})(typeof globalThis!=='undefined'?globalThis:this,function(Core,Weapons){
'use strict';
const CHARACTER_FALLBACK='image/convene/character-fallback.svg';
function create({roles=[],dictionaries={},portraits,weaponPortraits=Weapons}={}){
 const byID=new Map(),aliases=new Map(),key=Weapons.normalize;
 for(const entry of roles){if(entry.gid!=null){const id=String(entry.gid);byID.set(id,byID.has(id)?null:entry);}for(const name of [entry.name,...['zh-CN','zh-TW','en'].map(l=>dictionaries[l]?.['characters.'+entry.id])]){if(!name)continue;const k=key(name);if(!aliases.has(k))aliases.set(k,new Set());aliases.get(k).add(entry);}}
 function role(record){if(!record)return null;const id=record.item??record.resourceId;if(id!=null&&String(id)!=='')return byID.get(String(id))||null;const hits=aliases.get(key(record.name));return hits?.size===1?[...hits][0]:null;}
 function isCharacter(r){return !!role(r)||Core.isCharacter(r);}
 function artwork(r){if(!r)return {src:CHARACTER_FALLBACK,fallback:CHARACTER_FALLBACK,hasArtwork:false,kind:'character'};if(!isCharacter(r))return {...weaponPortraits.resolve(r),kind:'weapon'};const entry=role(r),src=portraits?.resolve(entry);return {entry,src:src||CHARACTER_FALLBACK,fallback:CHARACTER_FALLBACK,hasArtwork:!!src,kind:'character'};}
 function latest(stats,pool){const rows=stats.pools.find(p=>p.pool===pool)?.five||[];return [...rows].filter(r=>r.pool===pool&&r.rank===5&&(pool===1?isCharacter(r):pool===2?!isCharacter(r):true)).sort(Core.order).at(-1)||null;}
 function name(r,locale='zh-CN'){const a=artwork(r);return a.kind==='character'?(dictionaries[locale]?.['characters.'+a.entry?.id]||a.entry?.name||r?.name||''):(a.entry?.names?.[locale]||r?.name||'');}
 function searchText(r){const a=artwork(r);return [r.name,r.item,...(a.kind==='character'?['zh-CN','zh-TW','en'].map(l=>dictionaries[l]?.['characters.'+a.entry?.id]):[...Object.values(a.entry?.names||{}),...(a.entry?.aliases||[])])].filter(Boolean).join(' ').toLowerCase();}
 return {role,isCharacter,artwork,latest,name,searchText};
}
return {create,CHARACTER_FALLBACK};
});
