const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const path=require('node:path');
const model=require('../js/role-draft-model.js');
const storageModule=require('../js/role-draft-storage.js');
const {createAdapter}=require('../js/role-view-model.js');
const i18n=require('../js/i18n.js');
const read=name=>fs.readFileSync(path.join(__dirname,'../js',name),'utf8');
const clone=x=>JSON.parse(JSON.stringify(x));
const ctx={$:()=>{}};
vm.runInNewContext(read('base.js')+'\n;globalThis.api={roleList,costList,newCharacterModels,getRoleScoreConfig,getScoreDetails,countScores,countMainAttr,countMainAttr2,getRoleEnergyCorrection};',ctx);
const normalize=createAdapter(ctx.api);
function fixture(imported=false){
    const mains=[['暴击22%','暴击','22%'],['属伤30%','属伤','30%'],['共鸣效率32%','共鸣效率','32%'],['攻击18%','大攻击','18%'],['攻击18%','大攻击','18%']];
    return {roleId:123,roleListId:imported?'1':1,isImport:imported,ming:0,totalScore:'999',costList:mains.map((m,i)=>({
        costId:600+i,costListId:100+i,type:['Cost4','Cost3','Cost3','Cost1','Cost1'][i],
        mainAtrri:imported?{property:m[1],value:m[2]}:m[0],propertyList:[{property:'暴击',value:'8.1%'},{property:'暴伤',value:'16.2%'},{property:'大攻击',value:'8.6%'},{property:'小防御',value:'50'},{property:'共鸣效率',value:'8.4%'}]
    }))};
}
const options={id:'baseline-1',createdAt:1000,expiresAt:10000,sourceRevision:'source-r1',modelVersion:'score-v1'};
const capture=(role,changes={})=>model.createBaseline(normalize(role),{...options,...changes});
function candidate(role=fixture()){
    const copy=clone(role);copy.costList[2].costId=999;
    const slot=normalize(copy).slots[2];
    return model.createCandidate(slot.echo,{id:'candidate-1',source:'inventory',sourceRevision:'inventory-r1',identityScope:copy.costList.map(e=>e.costId),completeness:slot.status});
}
const draft=(b,c,changes={})=>model.createDraft(b,c,{id:'draft-1',createdAt:2000,targetSlot:3,...changes});
let cases=0;
for(const imported of [false,true]){
    const role=fixture(imported),before=JSON.stringify(role),b=capture(role),c=candidate(role),d=draft(b,c);
    const baselineBefore=JSON.stringify(b);
    assert.ok(Object.isFrozen(b)&&Object.isFrozen(b.slots[2].echo.substats[0]));
    assert.ok(Object.isFrozen(d.candidate.echo));
    assert.equal(JSON.stringify(role),before);
    assert.equal(JSON.stringify(b),baselineBefore);
    assert.equal(model.assess(b,d,capture(role,{id:'fresh',createdAt:2500}),3000).status,'valid');
    const trial=model.materialize(b,d,b,3000);
    assert.deepEqual(trial.slots.map(s=>s.echo.identity),['600','601','999','603','604']);
    assert.equal(b.slots[2].echo.identity,'602');
    assert.equal(draft(b,c,{id:'draft-2'}).id,'draft-2');
    assert.equal(d.candidate.echo.mainStat.key,'resonance_efficiency');
    assert.equal(d.candidate.echo.mainStat.value,32);
    assert.doesNotMatch(JSON.stringify([b,c,d]),/暴击|共鸣|legacy|mainAtrri|sumScores|nameKey|999分/);

    const edited=clone(role);edited.costList[2].propertyList[0].value='9.3%';
    const stale=capture(edited);
    assert.equal(model.assess(b,d,stale,3000).status,'stale');
    assert.throws(()=>model.materialize(b,d,stale,3000),/SOURCE_CHANGED/);
    assert.equal(model.assess(b,d,capture(role,{sourceRevision:'reimport-r2'}),3000).status,'stale');
    assert.equal(model.assess(b,d,b,10000).reason,'BASELINE_EXPIRED');
    const reordered=clone(role);[reordered.costList[0],reordered.costList[2]]=[reordered.costList[2],reordered.costList[0]];
    assert.equal(model.assess(b,d,capture(reordered),3000).status,'stale');
    const chain=clone(role);chain.ming=1;
    assert.equal(model.assess(b,d,capture(chain),3000).reason,'MODEL_CONDITIONS_CHANGED');
    assert.equal(model.assess(b,d,capture(role,{modelVersion:'score-v2'}),3000).reason,'MODEL_VERSION_CHANGED');
    const anotherRole=clone(role);anotherRole.roleId=124;
    assert.equal(model.assess(b,d,capture(anotherRole),3000).reason,'ROLE_MISMATCH');
    const preview=model.updateDraft(d,b,{updatedAt:2100,modelConditions:{...b.conditions,chain:2}});
    assert.equal(model.assess(b,preview,b,3000).status,'incompatible');
    assert.equal(d.modelConditions.chain,0);
    assert.throws(()=>model.updateDraft(d,b,{updatedAt:1999}),/INVALID_UPDATE_TIME/);
    assert.equal(JSON.stringify(role),before);
    assert.equal(JSON.stringify(b),baselineBefore);

    for(const bad of ['missing','duplicate']){
        const r=clone(role);if(bad==='missing')delete r.costList[2].costId;else r.costList[2].costId=600;
        const ambiguous=capture(r);
        assert.equal(ambiguous.identityState,'ambiguous');
        assert.throws(()=>draft(ambiguous,c),/AMBIGUOUS_TARGET/);
        assert.equal(model.assess(b,d,ambiguous,3000).reason,'AMBIGUOUS_IDENTITY');
    }
    const empty=clone(role);empty.costList.pop();const emptyBaseline=capture(empty);
    const add=draft(emptyBaseline,c,{targetSlot:5});
    assert.equal(add.originalEchoIdentity,null);
    assert.equal(model.materialize(emptyBaseline,add,emptyBaseline,3000).slots[4].echo.identity,'999');
    const incomplete=clone(role);incomplete.costList[2].propertyList.pop();
    assert.equal(capture(incomplete).slots[2].echo.completeness,'incomplete');
    const unknown=clone(role);unknown.roleListId=9999;const unsupported=capture(unknown);
    assert.equal(model.assess(unsupported,draft(unsupported,c),unsupported,3000).reason,'MODEL_UNAVAILABLE');
    for(const locale of ['zh-TW','zh-CN','en']){
        const original=JSON.stringify([b,d,trial]);i18n.create({language:locale}).format.score(normalize(role).summary.score);
        assert.equal(JSON.stringify([b,d,model.materialize(b,d,b,3000)]),original);
    }
    cases++;
}

const role=fixture(),b=capture(role),c=candidate(),d=draft(b,c);
for(const field of ['id','sourceRevision','modelVersion'])for(const value of [null,'',12])assert.throws(()=>capture(role,{[field]:value}),/INVALID_BASELINE_VERSION/);
assert.throws(()=>capture({...role,roleId:null}),/INVALID_ROLE_IDENTITY/);
assert.throws(()=>draft(b,c,{id:null}),/INVALID_DRAFT/);
const badCandidate=clone(c);badCandidate.echo.identity='600';
assert.throws(()=>draft(b,badCandidate),/CANDIDATE_ALREADY_EQUIPPED/);
const slot=normalize(role).slots[2];
for(const identityScope of [[],[602,602]])assert.throws(()=>model.createCandidate(slot.echo,{id:'c',source:'inventory',sourceRevision:'r',identityScope,completeness:'complete'}),/AMBIGUOUS_CANDIDATE/);
assert.throws(()=>draft(b,c,{targetSlot:0}),/AMBIGUOUS_TARGET/);
const wrong=clone(d);wrong.originalEchoIdentity='601';assert.throws(()=>model.validateDraft(wrong,b),/TARGET_MISMATCH/);
const badUnit=clone(c);badUnit.echo.mainStat.unit='flat';assert.throws(()=>model.validateCandidate(badUnit),/INVALID_CANDIDATE/);
const falseComplete=clone(c);falseComplete.echo.substats.pop();assert.throws(()=>model.validateCandidate(falseComplete),/INVALID_CANDIDATE/);
const extraSlot=clone(role);extraSlot.costList.push(clone(extraSlot.costList[0]));
assert.equal(capture(extraSlot).identityState,'ambiguous');

// 机制条件使用实际模型投影，并核对改变后不能沿用旧比较。
for(const roleId of [49,51,53,...ctx.api.newCharacterModels.ids]){
    const r={...fixture(),roleListId:roleId},base=capture(r),local=draft(base,c);
    const modes=ctx.api.newCharacterModels.settings[roleId]?.modes.map(m=>m[0])||(roleId===49?['tune','fusion']:roleId===53?['fusion','harmony']:[]);
    for(const damageMode of modes){const current=capture({...r,damageMode});assert.equal(model.assess(base,local,current,3000).status,current.conditions.mode===base.conditions.mode?'valid':'incompatible');}
    if(roleId===51)assert.equal(model.assess(base,local,capture({...r,extraEnergy:100}),3000).status,'incompatible');
    if(roleId===62)assert.equal(model.assess(base,local,capture({...r,referenceHealth:50000}),3000).status,'incompatible');
}

const mcData=JSON.stringify({role:[role],unusedEchoes:[]}),map=new Map([['mcData',mcData]]),writes=[];
const storage={getItem:k=>map.has(k)?map.get(k):null,setItem:(k,v)=>{writes.push(k);map.set(k,v);}};
const store=storageModule.create(storage);
assert.equal(store.load().data.revision,0);
assert.equal(writes.length,0);
assert.equal(store.save(b,d,0).ok,true);
assert.equal(store.save(b,draft(b,c,{id:'draft-2'}),1).ok,true);
assert.equal(store.load().data.baselines.length,1);
assert.equal(store.load().data.drafts.length,2);
assert.equal(store.save(b,d,0).code,'STORAGE_CONFLICT');
const changedBaseline=clone(b);changedBaseline.sourceRevision='different';
assert.equal(store.save(changedBaseline,d,2).code,'IMMUTABLE_BASELINE_CONFLICT');
const backup=store.exportData();assert.equal(backup.ok,true);
const loaded=store.load().data;
assert.equal(model.assess(loaded.baselines[0],loaded.drafts[0],capture({...role,ming:1}),3000).status,'incompatible');
assert.equal(model.assess(loaded.baselines[0],loaded.drafts[0],capture(role,{sourceRevision:'new'}),3000).status,'stale');
assert.equal(store.remove('draft-1',2).ok,true);assert.equal(store.load().data.baselines.length,1);
assert.equal(store.remove('draft-2',3).ok,true);assert.equal(store.load().data.baselines.length,0);
assert.equal(store.restore(backup.json,4).ok,true);
assert.equal(store.load().data.drafts.length,2);
assert.equal(store.restore('{',5).code,'INVALID_BACKUP');
assert.equal(store.load().data.revision,5);
assert.equal(map.get('mcData'),mcData);
assert.ok(writes.every(k=>k===storageModule.KEY));
const exposed=store.load().data;exposed.baselines[0].slots=[];
assert.equal(store.load().data.baselines[0].slots.length,5);

for(const bad of ['{',JSON.stringify({schemaVersion:99}),JSON.stringify({schemaVersion:1,revision:0,baselines:[],drafts:[d]}),JSON.stringify({...JSON.parse(backup.json),baselines:[b,b]})]){
    map.set(storageModule.KEY,bad);const before=writes.length;
    assert.equal(store.load().ok,false);
    assert.equal(store.save(b,d,0).ok,false);
    assert.equal(store.restore(backup.json,0).ok,false);
    assert.equal(map.get(storageModule.KEY),bad);
    assert.equal(map.get('mcData'),mcData);
    assert.equal(writes.length,before);
}
const blocked=storageModule.create({getItem(){throw Error('denied');}});assert.equal(blocked.load().ok,false);
const quota=storageModule.create({getItem:()=>null,setItem(){throw Error('quota');}});assert.equal(quota.save(b,d,0).code,'STORAGE_WRITE_FAILED');
// 浏览器导出同样不访问 DOM、存储或时钟；时间及来源修订均由调用方显式提供。
const browser={StatKeys:require('../js/stat-keys.js')};
for(const key of ['document','localStorage'])Object.defineProperty(browser,key,{get(){throw Error('Unexpected access');}});
vm.runInNewContext(read('role-draft-model.js'),browser);vm.runInNewContext(read('role-draft-storage.js'),browser);
assert.equal(typeof browser.RoleDraftModel.materialize,'function');
assert.equal(typeof browser.RoleDraftStorage.create,'function');
console.log(`PASS: ${cases} manual/import baseline lifecycles; immutable semantic snapshots, candidate uniqueness, multiple drafts, stale/incompatible gating, all supported mechanisms, locale invariance, versioned storage, conflicts, deletion, backup roundtrip, corruption/quota isolation and unchanged mcData.`);
