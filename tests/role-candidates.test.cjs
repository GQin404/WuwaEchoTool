const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),path=require('node:path');
const {webcrypto}=require('node:crypto');
const candidates=require('../js/role-candidates.js'),drafts=require('../js/role-draft-model.js'),storageModule=require('../js/role-draft-storage.js');
const {createAdapter}=require('../js/role-view-model.js'),controllerModule=require('../js/role-register-controller.js');
const I18n=require('../js/i18n.js'),dictionary=require('../js/i18n-dictionaries.js');
const read=name=>fs.readFileSync(path.join(__dirname,'../js',name),'utf8'),copy=x=>JSON.parse(JSON.stringify(x));
const env={$:()=>{}};vm.runInNewContext(read('base.js')+'\n;globalThis.api={roleList,costList,newCharacterModels,getRoleScoreConfig,getScoreDetails,countScores,countMainAttr,countMainAttr2,getRoleEnergyCorrection};',env);
const normalize=createAdapter(env.api),adapter=candidates.createAdapter(normalize);
const role={roleId:101,roleListId:1,ming:0,costList:[59,51,52,35,39].map((id,i)=>({costId:600+i,costListId:id,type:['Cost4','Cost3','Cost3','Cost1','Cost1'][i],mainAtrri:['暴击22%','属伤30%','共鸣效率32%','攻击18%','攻击18%'][i],propertyList:[{property:'暴击',value:'8.1%'},{property:'暴伤',value:'16.2%'},{property:'大攻击',value:'8.6%'},{property:'小防御',value:'50'},{property:'共鸣效率',value:'8.4%'}]}))};
const baseline=drafts.createBaseline(normalize(role),{id:'b',createdAt:1,sourceRevision:'r1',modelVersion:'v1'});
const original=JSON.stringify(role),baselineOriginal=JSON.stringify(baseline);
for(let position=1;position<=5;position++){
    const fields=candidates.editor(normalize(role).slots[position-1].echo);
    fields.substats[0].value=9.3;
    const slot=adapter.fromEditor(fields,role,'new-'+position);
    const result=adapter.prepare(baseline,position,slot,{id:'c-'+position,source:'manual',sourceRevision:'c-r1',identityScope:[slot.echo.id]});
    assert.equal(result.eligibility.status,'ready');
    assert.equal(result.candidate.echo.substats[0].value,9.3);
    const d=drafts.createDraft(baseline,result.candidate,{id:'d-'+position,targetSlot:position,createdAt:2});
    const ctx=candidates.context(baseline,d,baseline,3,'en',result.eligibility).context;
    assert.equal(ctx.targetSlot,position);assert.equal(ctx.currentEcho.identity,String(599+position));assert.equal(ctx.conclusion,null);
    assert.ok(Object.isFrozen(ctx.baseline.slots));
    const changed=copy(baseline);changed.sourceRevision='r2';assert.equal(candidates.context(baseline,d,changed,3,'en',result.eligibility).context,null);
    changed.conditions.chain=2;assert.equal(candidates.context(baseline,d,changed,3,'en',result.eligibility).validity.status,'incompatible');
}
assert.equal(JSON.stringify(role),original);assert.equal(JSON.stringify(baseline),baselineOriginal);
const raw={...copy(role.costList[2]),costId:999};
for(const imported of [false,true]){
    const record=copy(raw);if(imported)record.mainAtrri={property:'共鸣效率',value:'32%'};
    const before=JSON.stringify(record),slot=adapter.fromRecord(record,role);
    assert.equal(adapter.eligibility(baseline,3,slot,[999]).status,'ready');
    assert.equal(adapter.eligibility(baseline,3,slot,[999,999]).reason,'identity');
    assert.equal(adapter.eligibility(baseline,4,slot,[999]).reason,'cost');
    record.propertyList.pop();const partial=adapter.fromRecord(record,role);
    assert.equal(adapter.eligibility(baseline,3,partial,[999]).status,'incomplete');
    const prepared=adapter.prepare(baseline,3,partial,{id:'partial',source:'inventory',sourceRevision:'r1',identityScope:[999]});
    const d=drafts.createDraft(baseline,prepared.candidate,{id:'partial-d',targetSlot:3,createdAt:2});
    assert.equal(candidates.context(baseline,d,baseline,3,'en',prepared.eligibility).context.conclusion,null);
    record.mainAtrri=null;assert.equal(adapter.eligibility(baseline,3,adapter.fromRecord(record,role),[999]).reason,'main');
    assert.equal(JSON.stringify(imported?{...raw,mainAtrri:{property:'共鸣效率',value:'32%'}}:raw),before);
}

// 用实际候选界面事件与异步摘要验证完整流程；DOM 桩只收集生成内容，不替代业务逻辑。
async function harness(imported=false,locale='en'){
    const input=copy(role);if(imported){input.isImport=true;input.costList.forEach((e,i)=>e.mainAtrri={property:['暴击','属伤','共鸣效率','大攻击','大攻击'][i],value:['22%','30%','32%','18%','18%'][i]});}
    const library={...copy(raw),costId:999};
    const map=new Map([['mcData',JSON.stringify({role:[input],unusedEchoes:[library]})]]),writes=[],events=new Map();
    const c=controllerModule.create(input,normalize);c.select(3,c.snapshot().identities[3]);
    let markup='',surface;
    const parent={insertAdjacentHTML:(_,html)=>{markup=html;},querySelectorAll:()=>[]};
    const host={addEventListener:(type,fn)=>{events.set(type,[...(events.get(type)||[]),fn]);},querySelector:selector=>selector==='.rr-candidate-surface'?{remove(){markup='';}}:selector==='.rr-analysis-content'||selector==='.rr-workspace'?parent:selector==='.rr-inline-analysis'?{hidden:!c.snapshot().selection}:selector==='[data-rc-check]'?{set textContent(_) {}}:{focus(){}}};
    const location={href:'http://localhost/mccost.html?roleid=101&view=register'};
    const i18n=I18n.create({language:locale});
    const runtime={RoleCompare:require('../js/role-compare.js'),RoleLocalConfiguration:require('../js/role-local-configuration.js'),RoleCandidates:candidates,RoleDraftModel:drafts,RoleDraftStorage:storageModule,localStorage:{getItem:k=>map.get(k)??null,setItem:(k,v)=>{writes.push(k);map.set(k,v);}},crypto:webcrypto,TextEncoder,URL,Date,navigator:{locks:{request:async(_,fn)=>fn()}},location,history:{replaceState:(_,__,url)=>{location.href=new URL(url,location.href).href;}}};
    vm.runInNewContext(read('role-candidate-surface.js'),runtime);
    surface=runtime.RoleCandidateSurface.mount({host,i18n,normalize,getController:()=>c,catalog:env.api.costList,refresh:()=>{c.refresh(JSON.parse(map.get('mcData')).role[0]);}});
    async function settle(){for(let n=0;n<8;n++)await new Promise(resolve=>setTimeout(resolve,2));}
    async function click(attr,value=''){
        const dataset={};dataset[attr.replace(/^data-/,'').replace(/-([a-z])/g,(_,s)=>s.toUpperCase())]=value;
        const button={dataset,hasAttribute:key=>key===attr};for(const fn of events.get('click')||[])fn({target:{closest:()=>button}});await settle();
    }
    function inputValue(index,value){for(const fn of events.get('input')||[])fn({target:{dataset:{rcStat:String(index),rcField:'value'},value}});}
    function change(attr,value,extra={}){
        const dataset={...extra};if(attr==='data-rc-stat')dataset.rcStat=extra.rcStat;
        const target={value,dataset,hasAttribute:k=>k===attr};for(const fn of events.get('change')||[])fn({target});
    }
    function confirm(key){for(const fn of events.get('change')||[])fn({target:{dataset:{rcCondition:key},checked:true,hasAttribute:k=>k==='data-rc-condition'}});}
    return {map,writes,c,i18n,location,surface,click,inputValue,change,confirm,settle,runtime,get markup(){return markup;}};
}
(async()=>{
    for(const imported of [false,true])for(const locale of ['zh-TW','zh-CN','en']){
        const h=await harness(imported,locale),saved=h.map.get('mcData');
        for(let position=1;position<=5;position++){
            h.c.restore(position,599+position);await h.click('data-rr-candidates');
            assert.ok(h.markup.includes('rr-candidate-title'));h.surface.close();assert.equal(h.c.snapshot().selection.position,position);
        }
        h.c.restore(3,602);await h.click('data-rr-candidates');await h.click('data-rc-source','clone');h.inputValue(0,'10.5');await h.click('data-rc-create');
        let ctx=h.surface.getContext();assert.ok(ctx);assert.equal(ctx.candidate.echo.substats[0].value,10.5);assert.notEqual(ctx.candidate.echo.identity,'602');
        const id=ctx.draft.id;h.i18n.setLocale('zh-CN');h.surface.render();assert.equal(h.surface.getContext().draft.id,id);
        h.c.collapse();await h.surface.restore();ctx=h.surface.getContext();assert.equal(ctx.draft.id,id);assert.equal(h.c.snapshot().selection.position,3);
        const updated=JSON.parse(saved);updated.role[0].costList[2].propertyList[0].value='9.3%';h.map.set('mcData',JSON.stringify(updated));await h.surface.restore();assert.equal(h.surface.getContext(),null);assert.ok(h.markup.includes(h.i18n.t('candidate.stale')));
        h.map.set('mcData',saved);h.surface.close();await h.click('data-rr-candidates');
        const key=/data-rc-pick="([^"]+)"/.exec(h.markup)[1];await h.click('data-rc-pick',key);assert.equal(h.surface.getContext().candidate.source,'inventory');
        assert.equal(h.surface.getContext().register.roleId,'101');h.surface.close();
        await h.click('data-rr-candidates');h.c.updateModel('ming',1);await h.click('data-rc-source','clone');await h.click('data-rc-create');assert.equal(h.surface.getContext(),null);assert.ok(h.markup.includes(h.i18n.t('candidate.incompatible')));
        assert.equal(h.map.get('mcData'),saved);assert.ok(h.writes.every(k=>k===storageModule.KEY));
        assert.doesNotMatch(h.markup,/candidate\.[a-z]+/);
    }
    const manual=await harness();await manual.click('data-rr-candidates');await manual.click('data-rc-source','manual');
    manual.change('data-rc-catalog','52');manual.change('data-rc-stat','resonance_efficiency',{rcStat:'main',rcField:'key'});manual.inputValue('main','32');
    await manual.click('data-rc-create');assert.equal(manual.surface.getContext().eligibility.status,'incomplete');assert.equal(manual.surface.getContext().conclusion,null);
    assert.equal(manual.surface.getContext().candidate.echo.mainStat.value,32);
    const changedLibrary=await harness();await changedLibrary.click('data-rr-candidates');
    const oldKey=/data-rc-pick="([^"]+)"/.exec(changedLibrary.markup)[1];
    const data=JSON.parse(changedLibrary.map.get('mcData'));data.unusedEchoes.push(copy(data.unusedEchoes[0]));changedLibrary.map.set('mcData',JSON.stringify(data));
    await changedLibrary.click('data-rc-pick',oldKey);assert.equal(changedLibrary.writes.length,0);assert.ok(changedLibrary.markup.includes(changedLibrary.i18n.t('candidate.candidateChanged')));
    const cancelled=await harness();let release;
    cancelled.runtime.navigator.locks.request=(_,fn)=>new Promise(resolve=>{release=async()=>resolve(await fn());});
    await cancelled.click('data-rr-candidates');await cancelled.click('data-rc-source','clone');await cancelled.click('data-rc-create');
    cancelled.surface.close();await release();await cancelled.settle();assert.equal(cancelled.writes.length,0);assert.equal(cancelled.surface.getContext(),null);
    const keys=Object.keys(dictionary.en).filter(k=>k.startsWith('candidate.'));
    for(const locale of ['zh-TW','zh-CN','en']){
        const h=await harness(false,locale),saved=h.map.get('mcData');
        await h.click('data-rr-candidates');await h.click('data-rc-source','clone');h.inputValue(0,'10.5');await h.click('data-rc-create');await h.settle();
        assert.equal(h.surface.getContext().result.conclusion,'needs-condition');
        await h.click('data-rc-decision');h.confirm('equipment');await h.settle();
        assert.equal(h.surface.getContext().result.conclusion,'recommended');
        await h.click('data-rc-decision');await h.settle();assert.ok(h.markup.includes(h.i18n.t('compare.adopted')));
        await h.surface.restore();await h.settle();assert.ok(h.markup.includes(h.i18n.t('compare.adopted')));
        h.i18n.setLocale('en');h.surface.render();await h.settle();assert.equal(h.surface.getContext().result.conclusion,'recommended');
        const changed=JSON.parse(saved);changed.role[0].costList[2].propertyList[0].value='9.3%';h.map.set('mcData',JSON.stringify(changed));
        h.surface.render();await h.settle();assert.equal(h.surface.getContext().result.conclusion,'incompatible');
        assert.ok(!h.markup.includes(h.i18n.t('compare.adopted')));
        assert.ok(h.writes.every(k=>k!== 'mcData'));
    }
    for(const locale of ['zh-TW','zh-CN','en'])for(const key of keys)assert.ok(Object.hasOwn(dictionary[locale],key));
    console.log('PASS: all five slots; manual/import and three locales; library/copy adapters, edited value snapshot, close/return, draft storage isolation, refresh revalidation, stale/incompatible rejection, incomplete without conclusions and immutable contexts.');
})().catch(error=>{console.error(error);process.exitCode=1;});
