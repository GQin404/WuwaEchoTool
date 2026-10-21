/* Stable, local-only weapon artwork catalog. No guessed official IDs or remote URLs. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./weapon-catalog.js'));else root.WeaponPortraits=factory(root.WeaponCatalog);})(typeof globalThis!=='undefined'?globalThis:this,function(catalog){
'use strict';
const FALLBACK='image/weapons/fallback.svg',normalize=s=>String(s??'').normalize('NFKC').trim().toLowerCase().replace(/\s+/g,' ');
function create(config={version:1,weapons:[]}){
 if(config.version!==1||!Array.isArray(config.weapons))throw Error('INVALID_WEAPON_CATALOG');
 const ids=new Map(),aliases=new Map();
 for(const raw of config.weapons){
  if(!raw||!raw.names||typeof raw.names!=='object'||Array.isArray(raw.names)||raw.aliases!=null&&!Array.isArray(raw.aliases)||!/^\d{1,12}$/.test(String(raw.id))||ids.has(String(raw.id))||![1,2,3,4,5].includes(raw.rarity)||!['sword','broadblade','pistols','gauntlets','rectifier','unknown'].includes(raw.category||'unknown'))throw Error('INVALID_WEAPON_CATALOG');
  if(raw.image!=null&&(!raw.image.startsWith('image/weapons/'+raw.rarity+'star/')||!raw.image.endsWith('.webp')||/[\\<>:"|?*\x00-\x1f]/.test(raw.image)||raw.image.split('/').length!==4||raw.image.split('/')[3].startsWith('.')||raw.image.includes('..')))throw Error('INVALID_WEAPON_PATH');
  const entry=Object.freeze({...raw,id:String(raw.id),names:Object.freeze({...raw.names}),aliases:Object.freeze([...(raw.aliases||[])])});ids.set(entry.id,entry);
  for(const name of [...Object.values(entry.names),...entry.aliases]){if(typeof name!=='string')throw Error('INVALID_WEAPON_CATALOG');const key=normalize(name);if(!key)continue;if(!aliases.has(key))aliases.set(key,new Set());aliases.get(key).add(entry.id);}
 }
 function find(record){if(!record)return null;const id=record.item??record.resourceId??record.weaponId;if(id!=null&&String(id)!=='')return ids.get(String(id))||null;const hits=aliases.get(normalize(record.name));return hits?.size===1?ids.get([...hits][0]):null;}
 function resolve(record){const entry=find(record),fallback=entry?.category&&entry.category!=='unknown'?'image/weapons/fallback-'+entry.category+'.svg':FALLBACK;return {id:entry?.id||String(record?.item??record?.resourceId??''),entry,src:entry?.image||fallback,fallback,hasArtwork:!!entry?.image,source:entry?.image?'catalog':'category-placeholder'};}
 function missing(records=[]){const out=new Map();for(const r of records){const a=resolve(r);if(!a.hasArtwork&&!out.has(a.id))out.set(a.id,{id:a.id,name:r.name||'',rarity:r.rank??r.qualityLevel??null,reason:a.entry?'image-not-supplied':'id-not-in-catalog'});}return [...out.values()];}
 return {find,resolve,missing,entries:[...ids.values()]};
}
return {create,normalize,FALLBACK,...create(catalog)};
});
