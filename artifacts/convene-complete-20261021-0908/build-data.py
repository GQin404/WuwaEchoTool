from pathlib import Path
import json,hashlib,datetime
R=Path.cwd();W=R/'artifacts/convene-complete-20261021-0908'
def load(n):return json.loads((W/n).read_text('utf-8-sig'))
def put(p,t):p.parent.mkdir(parents=True,exist_ok=True);p.write_text(t,encoding='utf-8',newline='\n')
langs={'zh-CN':'zh-Hans','zh-TW':'zh-Hant','en':'en'}
chars={loc:{str(r['Id']):r for r in load('characters-'+tag+'.json')['roleList']}for loc,tag in langs.items()}
weapons={loc:{str(r['Id']):r for r in load('weapons-'+tag+'.json')['weapons']}for loc,tag in langs.items()}
local=load('local-roles.json');rows=[];pending=[]
for role in local:
 rid=str(role['gid']) if role['gid'] else None
 if not rid:
  hits=[k for k,v in chars['zh-CN'].items() if v['Name']==role['name']]
  if len(hits)==1:rid=hits[0]
 if rid:
  assert rid in chars['en']
  names={loc:chars[loc][rid]['Name'] for loc in langs};rarity=chars['en'][rid]['QualityId']
 else:
  # Both Electro Rover entries have the same translated label; gender identity is not inferred from ID order.
  assert role['id'] in [57,58]
  names={'zh-CN':role['name'],'zh-TW':'漂泊者·導電（'+('女'if role['id']==57 else'男')+'）','en':'Rover: Electro ('+('Female'if role['id']==57 else'Male')+')'};rarity=5
  pending.append({'internalId':role['id'],'name':role['name'],'reason':'1309/1310 exist in source, but gender correspondence has not been independently verified; name-only exact qualified variant accepted'})
 if role['id'] in [5,6,21,22,35,36]:
  female=role['id']in[21,22,35]
  for loc,sex in [('zh-CN','女'if female else'男'),('zh-TW','女'if female else'男'),('en','Female'if female else'Male')]:names[loc]+=' ('+sex+')'
 aliases=[role['name']]
 if role['id']==55:aliases+=['蕾贝卡','蕾貝卡']
 if role['id']==11:aliases+=['雪豹']
 # Generic Rover aliases are deliberately ambiguous across form/gender and cannot resolve without an ID.
 if rid and '漂泊者' in chars['zh-CN'][rid]['Name']:
  aliases += [chars[loc][rid]['Name'] for loc in langs]+['Rover','漂泊者']
 rows.append({'internalId':role['id'],'resourceId':rid,'rarity':rarity,'names':names,'aliases':sorted(set(aliases))})
put(R/'js/character-catalog.js',r'''/* Unified read-only identity registry. Images remain in the existing CharacterPortraits/CSS system.
 * Names/IDs/rank from public Encore data, retrieved 2026-10-21; not an assertion of official API availability.
 * Existing internal role IDs are distinct from resource IDs. Unknown gender mappings stay null. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.CharacterCatalog=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const records=__ROWS__;
const normalize=s=>String(s??'').normalize('NFKC').trim().toLowerCase().replace(/\s+/g,' ');
function create({roles=[],dictionaries={},portraits}={}){
 const metadata=new Map(records.map(r=>[String(r.internalId),r])),byID=new Map(),byLocal=new Map(),aliases=new Map();
 const entries=roles.map(role=>{const m=metadata.get(String(role.id)),names={};for(const l of ['zh-CN','zh-TW','en'])names[l]=m?.names[l]||dictionaries[l]?.['characters.'+role.id]||role.name;
  const officialId=m?.resourceId||(Number(role.gid)>0?String(role.gid):null),image=portraits?.resolve(role)||null;
  const entry=Object.freeze({...role,internalId:String(role.id),resourceId:officialId,officialId,names:Object.freeze(names),rarity:m?.rarity??null,image,aliases:Object.freeze([...(m?.aliases||[]),role.name]),identitySource:m?'encore-snapshot-20261021':'existing-project'});
  if(image&&!/^image\/characters\/[\w-]+\.(?:webp|png|jpe?g|avif)$/.test(image))throw Error('INVALID_CHARACTER_PATH');
  byLocal.set(String(role.id),entry);if(officialId)byID.set(officialId,byID.has(officialId)?null:entry);
  for(const n of [...Object.values(names),...entry.aliases]){const k=normalize(n);if(!k)continue;if(!aliases.has(k))aliases.set(k,new Set());aliases.get(k).add(entry);}
  return entry;
 });
 function find(record){if(!record)return null;const id=record.item??record.resourceId;if(id!=null&&String(id)!==''&&String(id)!=='0')return byID.get(String(id))||null;const hits=aliases.get(normalize(record.name));return hits?.size===1?[...hits][0]:null;}
 return {entries,find,byInternal:id=>byLocal.get(String(id))||null,unmapped:entries.filter(e=>!e.resourceId),missingImages:entries.filter(e=>!e.image)};
}
return {records,create,normalize};
});
'''.replace('__ROWS__',json.dumps(rows,ensure_ascii=False,separators=(',',':'))))
categories={1:'broadblade',2:'sword',3:'pistols',4:'gauntlets',5:'rectifier'};wr=[]
for rid,v in weapons['en'].items():
 if v['QualityId']not in [3,4,5]:continue
 assert all(rid in weapons[l] for l in langs)
 wr.append({'id':rid,'resourceId':rid,'rarity':v['QualityId'],'category':categories[v['Type']],'names':{l:weapons[l][rid]['Name']for l in langs},'aliases':[],'source':'https://api-v2.encore.moe/api/en/weapon','image':None})
wr.sort(key=lambda w:int(w['id']))
put(R/'js/weapon-catalog.js','/* Verified public data snapshot, 2026-10-21. Identity metadata is independent of artwork.\n * No remote artwork dependency and no fabricated IDs. Source/provenance: docs/convene-resource-audit.json. */\n(function(root,factory){if(typeof module===\'object\'&&module.exports)module.exports=factory();else root.WeaponCatalog=factory();})(typeof globalThis!==\'undefined\'?globalThis:this,()=>('+json.dumps({'version':1,'weapons':wr},ensure_ascii=False,separators=(',',':'))+'));\n')
audit={'retrievedAt':'2026-10-21','source':'Encore public data service, community-extracted game records; cross-check historical ID facts with yuhkix/wuwa-ids. Not official authenticated API verification. No image downloads.','sources':[{'url':'https://api-v2.encore.moe/api/'+tag+'/'+kind,'sha256':hashlib.sha256((W/(kind+'s-'+tag+'.json')).read_bytes()).hexdigest()}for tag in langs.values()for kind in ['character','weapon']], 'localCharacters':len(local),'registeredCharacters':len(rows),'existingImagesMatched':len(rows),'resourceIdsMatched':sum(bool(r['resourceId'])for r in rows),'characterMappingsPending':pending,'sourceWeapons':len(weapons['en']),'registeredWeapons':len(wr),'excludedRarity1And2':10,'weaponImagesPresent':0,'weaponsMissingImages':[{'id':r['id'],'names':r['names'],'rarity':r['rarity'],'category':r['category']}for r in wr],'charactersInSourceWithoutLocalImage':[]}
put(R/'docs/convene-resource-audit.json',json.dumps(audit,ensure_ascii=False,indent=2)+'\n')
print(json.dumps({'characters':len(rows),'ids':audit['resourceIdsMatched'],'images':64,'pending':pending,'weapons':len(wr),'rarities':{i:sum(r['rarity']==i for r in wr)for i in [3,4,5]}},ensure_ascii=False))
