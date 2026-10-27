/* 原位候选工作流；事件委托只注册一次，所有持久化仅经过草稿存储层。 */
(function(root){
    'use strict';
    root.RoleCandidateSurface={mount};
    function mount({host,i18n,normalize,getController,refresh,catalog}){
        const adapter=RoleCandidates.createAdapter(normalize),store=RoleDraftStorage.create(localStorage);
        const local=RoleLocalConfiguration.create(localStorage);
        const MODEL_VERSION='legacy-scoring-2026-10-08';
        let state=null,epoch=0,busy=false,renderTicket=0;
        let filters=RegisterCollections.defaults(),listScroll=0,detailsOpen=false,nameInput=null,nameExpected=null;
        const editorGuard=RegisterUnsaved.create({scope:()=> 'candidate:'+new URL(location.href).searchParams.get('roleid')+':'+getController()?.snapshot().model.role.configurationId+':'+state?.position+':'+state?.source,get:()=>state?.fields||null,apply:value=>{if(state)state.fields=value;},revision:()=>state?.baseline?.sourceRevision+':'+RoleDraftModel.canonical(state?.baseline?.conditions||null),serialize:v=>RoleDraftModel.canonical(v&&{...v,catalogId:String(v.catalogId||''),mainStat:{...v.mainStat,value:String(v.mainStat.value??'')},substats:v.substats.map(s=>({...s,value:String(s.value??'')}))}),i18n});editorGuard.pause();
        let activeNameId=null;const nameGuard=RegisterUnsaved.create({scope:()=> 'plan-name:'+state?.context?.draft?.id,get:()=>nameInput,apply:v=>nameInput=typeof v==='string'?v:null,revision:()=>nameExpected,i18n});nameGuard.pause();
        const uid=()=>crypto.randomUUID();
        const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
        const t=(key,params)=>esc(i18n.t('candidate.'+key,params));
        const tr=(key,params)=>esc(i18n.t(key,params));
        const name=e=>esc(i18n.entity('echoes',e?.catalogId,catalog.find(x=>String(x.id)===String(e?.catalogId))?.name||i18n.t('register.echoId',{id:e?.catalogId??i18n.t('common.unavailable')})));
        const value=s=>esc(s?.value==null?i18n.format.decimal(null):s.unit==='percent'?i18n.format.percentage(s.value,1):i18n.format.decimal(s.value));
        const stat=s=>s?.key?tr('stats.'+s.key):tr('register.unknownStat');
        function data(){return JSON.parse(localStorage.getItem('mcData')||'null');}
        async function digest(record){
            const bytes=new TextEncoder().encode(RoleDraftModel.canonical(RoleDraftModel.source(record)));
            const hash=await crypto.subtle.digest('SHA-256',bytes);
            return Array.from(new Uint8Array(hash),n=>n.toString(16).padStart(2,'0')).join('');
        }
        async function current(){
            refresh();
            const c=getController();if(!c)throw Error('source');
            const snapshot=c.snapshot(),matches=(data()?.role||[]).filter(r=>String(r.roleId)===String(snapshot.model.role.id));
            if(matches.length!==1)throw Error('source');
            const record=matches[0],conditions=snapshot.model.model;
            const role={...record,ming:conditions.chain,damageMode:conditions.parameters.mode,...Object.fromEntries(['extraEnergy','referenceHealth'].filter(k=>conditions.parameters[k]!=null).map(k=>[k,conditions.parameters[k]]))};
            const sourceRevision=await digest(record);
            const latest=(data()?.role||[]).filter(r=>String(r.roleId)===String(snapshot.model.role.id));
            if(latest.length!==1||RoleDraftModel.canonical(RoleDraftModel.source(latest[0]))!==RoleDraftModel.canonical(RoleDraftModel.source(record))||RoleDraftModel.canonical(getController()?.snapshot().model.model)!==RoleDraftModel.canonical(conditions))throw Error('source');
            const baseline=RoleDraftModel.createBaseline(snapshot.model,{id:uid(),createdAt:Date.now(),sourceRevision,modelVersion:MODEL_VERSION});
            return {baseline,role};
        }
        function focus(){host.querySelector('#rr-candidate-title')?.focus();}
        function urlDraft(id){const url=new URL(location.href);if(id)url.searchParams.set('draft',id);else url.searchParams.delete('draft');history.replaceState(null,'',url.pathname+url.search);host.querySelectorAll?.('[data-op-plans] a').forEach(a=>{if(id&&new URL(a.href,location.href).searchParams.get('draft')===id)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current');});}
        function close(after=()=>{}){if(busy){editorGuard.retain();editorGuard.pause();}const dirty=editorGuard.dirty()||nameGuard.dirty();editorGuard.leave(()=>nameGuard.leave(()=>{editorGuard.pause();nameGuard.pause();epoch++;state=null;busy=false;urlDraft(null);render();host.querySelector('[data-rr-candidates]')?.focus();after();}));return !dirty;}
        async function open(){
            const ticket=++epoch,selected=getController()?.snapshot().selection;
            if(!selected||selected.kind!=='echo'){state={phase:'error',notice:'selectSlot'};render();return;}
            busy=true;
            try{
                const captured=await current();if(ticket!==epoch)return;
                if(RoleDraftModel.canonical(getController()?.snapshot().selection)!==RoleDraftModel.canonical(selected)){
                    state={phase:'error',notice:'stale'};return;
                }
                state={phase:'select',baseline:captured.baseline,role:captured.role,position:selected.position,source:'library',fields:null,rows:[],notice:null};
                library();render();
            }catch(_){if(ticket===epoch){state={phase:'error',notice:'source'};render();}}
            finally{if(ticket===epoch){busy=false;render();focus();}}
        }
        function library(){
            if(!state?.baseline)return;
            const records=(typeof MultiConfig!=='undefined'?MultiConfig.entities(data()||{}):data()?.unusedEchoes||[]);
            if(!Array.isArray(records))throw Error('source');
            const scope=records.map(e=>e?.costId);
            state.rows=records.map(record=>{
                const slot=adapter.fromRecord(record,state.role);
                const eligibility=adapter.eligibility(state.baseline,state.position,slot,scope);
                return {key:String(record.costId),record,slot,scope,eligibility,contribution:eligibility.status==='ready'?RegisterCollections.contribution(slot,state.baseline.modelStatus==='available'):null};
            });
        }
        function editorSource(source){
            state.source=source;state.notice=null;
            const echo=source==='clone'?normalize(state.role).slots[state.position-1].echo:null;
            state.fields=RoleCandidates.editor(echo);state.editorIdentity=uid();render();
            editorGuard.reset();editorGuard.recover();render();
        }
        function editorSlot(){return adapter.fromEditor(state.fields,state.role,state.editorIdentity);}
        function eligible(){const slot=editorSlot();return adapter.eligibility(state.baseline,state.position,slot,[state.editorIdentity]);}
        function summary(e){return `<strong>${name(e)}</strong><span>${tr('loadout.cost',{cost:e.cost??'—'})}</span><span>${stat(e.mainStat)} ${value(e.mainStat)}</span><span>${e.substats.slice(0,5).map(s=>stat(s)+' '+value(s)).join(' · ')||t('noSubstats')}</span>`;}
        function options(list,selected){return '<option value="">'+t('unset')+'</option>'+list.map(k=>`<option value="${esc(k)}"${k===selected?' selected':''}>${tr('stats.'+k)}</option>`).join('');}
        function candidateRows(){const favorite=id=>{try{return !!JSON.parse(localStorage.getItem('wuwa.register.echoMeta.v1')||'{}')[id]?.favorite;}catch(_){return false;}};return RegisterCollections.echoes(state.rows,filters,{name:e=>i18n.entity('echoes',e.costListId,e.name||''),searchText:e=>i18n.searchText('echoes',e.costListId,e.name),favorite,complete:s=>s.status==='complete'});}
        function libraryMarkup(){
            const opt=(value,label,current)=>'<option value="'+esc(value)+'"'+(String(current)===String(value)?' selected':'')+'>'+label+'</option>',control=(key,label,values)=>'<label>'+label+'<select data-rc-filter="'+key+'">'+opt('',tr('ops.all'),filters[key])+values.map(([v,l])=>opt(v,l,filters[key])).join('')+'</select></label>';
            const rows=candidateRows();
            return '<div class="op-filters"><label>'+tr('secondary.search')+'<input type="search" data-rc-filter="search" value="'+esc(filters.search)+'"></label>'+control('cost',tr('secondary.cost'),[1,3,4].map(n=>['Cost'+n,'Cost '+n]))+control('suite',tr('workspace.suite'),[...new Set(state.rows.map(r=>r.record.suite).filter(Boolean))].map(v=>[v,esc(i18n.entity('sets',(typeof suiteAttributeMap==='undefined'?{}:suiteAttributeMap)[v],v))]))+control('main',tr('loadout.mainStat'),[...new Set(state.rows.map(r=>r.slot.echo?.mainStat.key).filter(Boolean))].map(k=>[k,tr('stats.'+k)]))+control('completeness',tr('secondary.complete'),['complete','incomplete'].map(k=>[k,tr('ops.'+k)]))+'<label>'+tr('ops.sort')+'<select data-rc-filter="sort">'+['recent','name','contribution'].map(k=>opt(k,tr('ops.'+(k==='name'?'nameSort':k==='contribution'?'contributionSort':k)),filters.sort)).join('')+'</select></label><label><input type="checkbox" data-rc-filter="favorite"'+(filters.favorite?' checked':'')+'>'+tr('secondary.favoriteOnly')+'</label></div><p class="op-count">'+tr('ops.count',{matched:rows.length,total:state.rows.length})+'<button data-rc-reset>'+tr('ops.reset')+'</button></p><p>'+tr('ops.scope')+'</p><ul class="rr-candidate-list">'+rows.map(row=>'<li>'+summary(row.slot.echo)+'<span>'+tr('ops.contribution')+': '+esc(i18n.format.score(row.contribution))+(row.contribution===null?' · '+tr('ops.unranked'):'')+'</span><span>'+t(row.eligibility.reason)+'</span><button type="button" data-rc-pick="'+esc(row.key)+'"'+(row.eligibility.status==='blocked'?' disabled':'')+'>'+tr('ops.saveCompare')+'</button></li>').join('')+'</ul>'+(rows.length?'':'<p>'+tr(state.rows.length?'ops.noResults':'ops.emptyLibrary')+'</p>');
        }
        function editorMarkup(){
            const fields=state.fields;
            const catalogOptions=catalog.map(e=>`<option value="${esc(e.id)}"${String(e.id)===String(fields.catalogId)?' selected':''}>${name({catalogId:e.id})} · ${tr('loadout.cost',{cost:Number(String(e.type).replace('Cost',''))})}</option>`).join('');
            const unknown=fields.catalogId&&!catalog.some(e=>String(e.id)===String(fields.catalogId))?`<option selected value="${esc(fields.catalogId)}">${name(fields)}</option>`:'';
            const row=(s,index,keys)=>`<div class="rr-candidate-stat"><label>${index==='main'?tr('loadout.mainStat'):t('substatIndex',{position:index+1})}<select data-rc-stat="${index}" data-rc-field="key">${options(keys,s.key)}</select></label><label>${tr('analysis.actualValue')}<input type="number" min="0" step="any" data-rc-stat="${index}" data-rc-field="value" value="${esc(s.value)}"></label><span>${s.key?tr('candidate.unit.'+RoleCandidates.unit(s.key)):''}</span></div>`;
            return `<div class="rr-candidate-editor"><label>${t('echo')}<select data-rc-catalog><option value="">${t('unset')}</option>${unknown}${catalogOptions}</select></label><p>${tr('loadout.cost',{cost:fields.cost})}</p>${row(fields.mainStat,'main',RoleCandidates.MAIN[fields.cost]||[])}${fields.substats.map((s,i)=>row(s,i,RoleCandidates.SUB)).join('')}<p data-rc-check>${t(eligible().reason)}</p><button type="button" data-rc-create>${t('create')}</button></div>`;
        }
        function render(){
            if(state?.phase!=='context'){paint();return;}
            const ticket=++renderTicket,origin=state;
            state.result=null;paint();
            current().then(fresh=>{
                if(ticket!==renderTicket||state!==origin)return;
                const ctx=origin.context;
                const source=adapter.assessSource(ctx.draft,(typeof MultiConfig!=='undefined'?MultiConfig.entities(data()||{}):data()?.unusedEchoes||[]),fresh.role);
                if(source.status!=='valid'){origin.phase='error';origin.context=null;origin.notice=source.reason;paint();return;}
                const savedDrafts=store.load();
                if(!savedDrafts.ok||!savedDrafts.data.drafts.some(d=>RoleDraftModel.canonical(d)===RoleDraftModel.canonical(ctx.draft))){origin.phase='error';origin.context=null;origin.notice='storage';paint();return;}
                const saved=local.find(ctx.baseline,ctx.draft);
                origin.conditions=origin.conditions||saved?.conditions||{};
                origin.adopted=!!saved;
                const validity=RoleDraftModel.assess(ctx.baseline,ctx.draft,fresh.baseline,Date.now());
                const resultKey=RoleDraftModel.canonical({revision:fresh.baseline.sourceRevision,conditions:fresh.baseline.conditions,confirmed:origin.conditions,validity});
                if(origin.resultKey!==resultKey){
                    origin.cachedResult=RoleCompare.evaluate({baseline:ctx.baseline,draft:ctx.draft,current:fresh.baseline,role:fresh.role,normalize,conditions:origin.conditions});
                    origin.resultKey=resultKey;
                }
                origin.result=origin.cachedResult;
                origin.role=fresh.role;
                paint();
                if(origin.focusCondition){host.querySelector('[data-rc-condition="'+origin.focusCondition+'"]')?.focus();origin.focusCondition=null;}
            }).catch(()=>{if(ticket===renderTicket&&state===origin){state={...origin,phase:'error',notice:'source'};paint();}});
        }
        const ct=(key,params)=>tr('compare.'+key,params);
        const label=key=>['score','effective'].includes(key)?ct(key):tr('stats.'+key);
        function compareMarkup(){
            const r=state.result;if(!r)return `<p role="status">${ct('checking')}</p>`;
            const ctx=state.context;
            const number=(n,unit,delta=false)=>esc(unit==='percent'?(delta?i18n.format.percentagePoint(n):i18n.format.percentage(n,1)):i18n.format.decimal(n,2));
            const rows=items=>items.map(row=>`<tr><th scope="row">${label(row.key)}</th><td data-label="${t('current')}">${number(row.current,row.unit)}</td><td data-label="${t('candidate')}">${number(row.candidate,row.unit)}</td><td data-label="${ct('delta')}">${number(row.delta,row.unit,true)}<small>${ct(row.direction)} · ${ct(row.judgement)}</small></td></tr>`).join('');
            const table=items=>`<table class="rr-compare-table"><thead><tr><th>${ct('metric')}</th><th>${t('current')}</th><th>${t('candidate')}</th><th>${ct('delta')}</th></tr></thead><tbody>${rows(items)}</tbody></table>`;
            const trade=kind=>`<div><h5>${ct(kind)}</h5><p>${r[kind].length?r[kind].map(label).join(' · '):ct('none')}</p></div>`;
            const breakdown=()=>['current','candidate'].map(side=>`<h5>${t(side)}</h5><table class="rr-compare-table"><thead><tr><th>${ct('metric')}</th><th>${tr('analysis.actualValue')}</th><th>${ct('weight')}</th><th>${ct('contribution')}</th></tr></thead><tbody>${(r.breakdown?.[side]||[]).map(s=>`<tr><th scope="row">${stat(s)}</th><td data-label="${tr('analysis.actualValue')}">${value(s)}</td><td data-label="${ct('weight')}">${esc(i18n.format.decimal(s.coefficient))}</td><td data-label="${ct('contribution')}">${esc(i18n.format.decimal(s.contribution))}</td></tr>`).join('')}</tbody></table>`).join('');
            const old=ctx.baseline.slots[ctx.targetSlot-1]?.echo,delta=r.rows.find(row=>row.key==='score');
            return `<div class="rr-decision"><div class="rr-compare-lead"><div><small>${t('current')}</small><strong>${old?name(old):'—'}</strong><b>${delta?esc(i18n.format.score(delta.current)):'—'}</b></div><div><small>${t('candidate')}</small><strong>${name(ctx.candidate.echo)}</strong><b>${delta?esc(i18n.format.score(delta.candidate)):'—'}</b></div><div><small>${ct('score')} · ${ct('delta')}</small><strong>${delta?esc(i18n.format.score(delta.delta)):'—'}</strong></div></div><h4>${ct('conclusion.'+r.conclusion)}</h4><p>${ct('why.'+r.conclusion)}</p>${r.validity.status!=='valid'?'<p>'+t(r.validity.status)+'</p>':''}<p class="rr-compare-note">${ct('limits')}</p>${r.rows.length?`<div class="rr-tradeoffs">${trade('gains')}${trade('losses')}${trade('unknown')}</div>`:''}${r.missing.length?'<p>'+ct('conditions')+': '+r.missing.map(k=>ct('need.'+k)).join(' · ')+'</p>':''}${state.showConditions?`<fieldset><legend>${ct('conditions')}</legend>${r.requirements.map(k=>`<label class="rr-compare-condition"><input type="checkbox" data-rc-condition="${k}"${state.conditions[k]?' checked':''}>${ct('condition.'+k)}</label>`).join('')}</fieldset>`:''}<p role="status">${state.adopted&&r.validity.status==='valid'?ct('adopted')+' '+ct('savedLocation')+' <a href="register-workspace.html?view=register&mode=compare&lang='+i18n.locale+'">'+tr('nav.compare')+'</a>':''}</p><button type="button" data-rc-decision${busy||(state.adopted&&r.conclusion==='recommended')?' disabled':''}>${ct('action.'+r.conclusion)}</button>${r.rows.length?`<details data-rc-details${detailsOpen?' open':''}><summary>${ct('details')}</summary>${table(r.rows)}<p>${ct('basis')}</p>${breakdown()}</details>`:''}</div>`;
        }
        function paint(){
            const active=host.querySelector(':focus'),filterKey=active?.dataset?.rcFilter,cursor=active?.selectionStart;
            listScroll=host.querySelector('.rr-candidate-list')?.scrollTop??listScroll;
            host.classList?.toggle('rr-comparing',state?.phase==='context');
            host.querySelector('.rr-candidate-surface')?.remove();
            if(!state)return;
            const hidden=host.querySelector('.rr-inline-analysis')?.hidden;
            const parent=hidden?(state.phase==='error'?host.querySelector('.rr-workspace')||host:null):host.querySelector('.rr-analysis-content');if(!parent)return;
            let body='';
            if(state.phase==='select'){
                body=`<nav aria-label="${t('sources')}">${['library','clone','manual'].map(s=>`<button type="button" data-rc-source="${s}" aria-pressed="${state.source===s}">${t(s)}</button>`).join('')}</nav>`;
                if(state.source==='library')body+=libraryMarkup();
                else body+=editorMarkup();
            }else if(state.phase==='context'){
                body=compareMarkup()+'<button type="button" data-rc-back>'+tr('ops.backCandidates')+'</button>';
                const meta=RegisterMetadata.create(localStorage).load();if(meta.ok&&state.context){if(nameInput===null)nameExpected=meta.raw;if(activeNameId!==state.context.draft.id){activeNameId=state.context.draft.id;nameInput=null;nameGuard.reset();nameGuard.recover();}body+='<form class="op-rename" data-rc-rename><label>'+tr('ops.planName')+'<input data-rc-plan-name maxlength="80" value="'+esc(nameInput??RegisterMetadata.draftName(state.context.draft,i18n,meta.data))+'"></label><button>'+tr('ops.rename')+'</button><p role="status" data-rc-name-status></p></form>';}
            }
            const position=state.position;
            if(state.phase==='context'&&state.context){const meta=RegisterMetadata.create(localStorage).load();body='<p class="op-current-config" data-rc-current-name>'+esc(RegisterMetadata.draftName(state.context.draft,i18n,meta.data))+'</p>'+body;}
            parent.insertAdjacentHTML('beforeend',`<section class="rr-candidate-surface" data-phase="${state.phase}" aria-busy="${busy}" aria-labelledby="rr-candidate-title"><div class="rr-analysis-heading"><h3 id="rr-candidate-title" tabindex="-1">${t(state.phase==='context'?'contextTitle':'title')}${position?' · '+tr('loadout.slot',{position}):''}</h3><button type="button" data-rc-close>${t('close')}</button></div>${state.baseline?'<p>'+tr('role.chain',{chain:state.baseline.conditions.chain})+' · '+tr('register.mode.'+state.baseline.conditions.mode)+'</p>':''}<p role="${state.notice?'alert':'status'}">${state.notice?t(state.notice):''}</p>${body}${state.phase==='error'?'<button type="button" data-rc-restart>'+t('restart')+'</button>':''}</section>`);
            if(busy)parent.querySelectorAll('[data-rc-create],[data-rc-pick],[data-rc-source],[data-rc-stat],[data-rc-catalog]').forEach(b=>b.disabled=true);
            globalThis.RegisterSearchUI?.enhance(host,i18n);
            if(filterKey){const input=host.querySelector('[data-rc-filter="'+filterKey+'"]');input?.focus({preventScroll:true});if(filterKey==='search'&&cursor!=null)input?.setSelectionRange(cursor,cursor);}
            if(host.querySelector('.rr-candidate-list'))host.querySelector('.rr-candidate-list').scrollTop=listScroll;
        }
        async function decision(){
            if(busy||state?.phase!=='context'||!state.result)return;
            const status=state.result.conclusion;
            if(status==='keep-current'){close();return;}
            if(status==='incompatible'){open();return;}
            if(status==='needs-condition'){state.showConditions=true;paint();host.querySelector('[data-rc-condition]')?.focus();return;}
            if(status==='insufficient-data'){
                const origin=state;
                if(origin.baseline.slots.some(s=>!s.echo||s.echo.completeness!=='complete')){close();host.querySelector('.rr-footer a')?.focus();return;}
                state={...origin,phase:'select',source:'clone',fields:RoleCandidates.editor(origin.context.candidate.echo),editorIdentity:uid(),rows:[],context:null};render();return;
            }
            const origin=state,ticket=epoch;busy=true;paint();
            try{
                const write=async()=>{
                    const fresh=await current();if(ticket!==epoch||state!==origin)return;
                    const ctx=origin.context,loaded=store.load();
                    if(!loaded.ok||!loaded.data.drafts.some(d=>RoleDraftModel.canonical(d)===RoleDraftModel.canonical(ctx.draft)))throw Error('storage');
                    const source=adapter.assessSource(ctx.draft,(typeof MultiConfig!=='undefined'?MultiConfig.entities(data()||{}):data()?.unusedEchoes||[]),fresh.role);
                    if(source.status!=='valid'){origin.phase='error';origin.context=null;origin.notice=source.reason;return;}
                    const result=RoleCompare.evaluate({baseline:ctx.baseline,draft:ctx.draft,current:fresh.baseline,role:fresh.role,normalize,conditions:origin.conditions});
                    origin.result=result;
                    if(result.conclusion!=='recommended')return;
                    const saved=local.adopt(ctx.baseline,ctx.draft,fresh.baseline,origin.conditions,result,Date.now());
                    if(!saved.ok)throw Error('storage');origin.adopted=true;refresh(true);
                };
                if(navigator.locks)await navigator.locks.request(RoleLocalConfiguration.KEY,write);else await write();
            }catch(_){if(state===origin)origin.notice='storage';}
            finally{if(state===origin){busy=false;render();}}
        }
        async function enter(slot,scope,source){
            if(busy||!state?.baseline)return;
            busy=true;const ticket=epoch,origin=state;render();
            try{
                if(source==='inventory'){
                    const records=(typeof MultiConfig!=='undefined'?MultiConfig.entities(data()||{}):data()?.unusedEchoes||[]),matches=records.filter(e=>String(e?.costId)===String(slot.echo.id));
                    if(matches.length!==1||RoleDraftModel.canonical(adapter.fromRecord(matches[0],origin.role).echo)!==RoleDraftModel.canonical(slot.echo)){
                        origin.notice='candidateChanged';return;
                    }
                    scope=records.map(e=>e?.costId);
                }
                const prepared=adapter.prepare(origin.baseline,origin.position,slot,{id:uid(),source,sourceRevision:await digest(slot.echo),identityScope:scope});
                if(!prepared.candidate){origin.notice=prepared.eligibility.reason;return;}
                const draft=RoleDraftModel.createDraft(origin.baseline,prepared.candidate,{id:uid(),targetSlot:origin.position,createdAt:Date.now()});
                const fresh=await current();if(ticket!==epoch)return;
                const checked=RoleCandidates.context(origin.baseline,draft,fresh.baseline,Date.now(),i18n.locale,prepared.eligibility);
                if(!checked.context){state={...origin,phase:'error',notice:checked.validity.status};return;}
                const write=async()=>{
                    if(ticket!==epoch)return {ok:false,code:'CANCELLED'};
                    const lockedCurrent=await current();if(ticket!==epoch)return {ok:false,code:'CANCELLED'};
                    const validity=RoleDraftModel.assess(origin.baseline,draft,lockedCurrent.baseline,Date.now());
                    if(validity.status!=='valid')return {ok:false,validity};
                    const sourceCheck=adapter.assessSource(draft,(typeof MultiConfig!=='undefined'?MultiConfig.entities(data()||{}):data()?.unusedEchoes||[]),lockedCurrent.role);
                    if(sourceCheck.status!=='valid')return {ok:false,validity:sourceCheck};
                    const loaded=store.load();return loaded.ok?store.save(origin.baseline,draft,loaded.data.revision):loaded;
                };
                // 可用时串行化跨标签页写入；不支持锁的浏览器仍保留 revision 冲突检查。
                const saved=navigator.locks?await navigator.locks.request(RoleDraftStorage.KEY,write):await write();
                if(ticket!==epoch)return;
                if(!saved.ok){if(saved.validity)state={...origin,phase:'error',notice:saved.validity.status};else origin.notice='storage';return;}
                editorGuard.markSaved();editorGuard.pause();
                const latest=await current();if(ticket!==epoch)return;
                const finalCheck=RoleCandidates.context(origin.baseline,draft,latest.baseline,Date.now(),i18n.locale,prepared.eligibility);
                state={...origin,phase:finalCheck.context?'context':'error',context:finalCheck.context,notice:finalCheck.context?null:finalCheck.validity.status};urlDraft(draft.id);refresh(true);
            }catch(_){if(ticket===epoch)origin.notice='source';}
            finally{if(ticket===epoch){busy=false;render();focus();}}
        }
        async function restore(){
            const draftId=new URL(location.href).searchParams.get('draft');if(!draftId)return;
            const ticket=++epoch;
            try{
                const loaded=store.load(),draft=loaded.ok?loaded.data.drafts.find(d=>d.id===draftId):null;
                if(!draft)throw Error('storage');
                const baseline=loaded.data.baselines.find(b=>b.id===draft.baseline.id);
                const c=getController();if(!c||String(c.snapshot().model.role.id)!==baseline.role.identity)throw Error('source');
                const raw=(data()?.role||[]).find(r=>String(r.roleId)===baseline.role.identity);
                const revision=raw?await digest(raw):null;if(ticket!==epoch)return;
                if(revision===baseline.sourceRevision){
                    const present=c.snapshot().model.model;
                    if(present.chain!==baseline.conditions.chain)c.updateModel('ming',baseline.conditions.chain);
                    if(present.parameters.mode!==baseline.conditions.mode)c.updateModel('damageMode',baseline.conditions.mode);
                    for(const key of ['extraEnergy','referenceHealth'])if(baseline.conditions[key]!=null&&present.parameters[key]!==baseline.conditions[key])c.updateModel(key,baseline.conditions[key]);
                }
                const fresh=await current();if(ticket!==epoch)return;
                const sourceCheck=adapter.assessSource(draft,(typeof MultiConfig!=='undefined'?MultiConfig.entities(data()||{}):data()?.unusedEchoes||[]),fresh.role);
                if(sourceCheck.status!=='valid'){state={baseline,position:draft.targetSlot,phase:'error',notice:sourceCheck.reason};refresh(true);render();return;}
                c.restore(draft.targetSlot,draft.originalEchoIdentity);
                const slot=adapter.fromEditor(RoleCandidates.editor(draft.candidate.echo),fresh.role,draft.candidate.echo.identity);
                const eligibility=adapter.eligibility(baseline,draft.targetSlot,slot,[draft.candidate.echo.identity]);
                const checked=RoleCandidates.context(baseline,draft,fresh.baseline,Date.now(),i18n.locale,eligibility);
                state={baseline,position:draft.targetSlot,phase:checked.context?'context':'error',context:checked.context,notice:checked.context?null:checked.validity.status==='valid'?eligibility.reason:checked.validity.status};
            }catch(_){if(ticket===epoch)state={phase:'error',notice:'storage'};}
            if(ticket===epoch){refresh(true);render();}
        }
        host.addEventListener('click',event=>{
            const b=event.target.closest('button');if(!b)return;
            if(b.hasAttribute('data-rr-candidates')){if(state)close(open);else open();}
            else if(b.hasAttribute('data-rc-decision'))decision();
            else if(b.hasAttribute('data-rc-close'))close();
            else if(b.hasAttribute('data-rc-reset')){filters=RegisterCollections.defaults();listScroll=0;paint();}
            else if(b.hasAttribute('data-rc-back')&&state?.context){nameGuard.leave(()=>{nameGuard.pause();state={...state,phase:'select',context:null,result:null};urlDraft(null);nameInput=null;editorGuard.pause();paint();host.querySelector('[data-rc-filter="search"]')?.focus();});}
            else if(b.hasAttribute('data-rc-restart'))open();
            else if(b.hasAttribute('data-rc-source')&&state?.phase==='select'){
                if(busy)return;
                const source=b.dataset.rcSource;if(source===state.source)return;
                editorGuard.leave(()=>{if(source==='library'){editorGuard.pause();state.source='library';state.fields=null;state.notice=null;try{library();}catch(_){state.notice='source';}render();}else editorSource(source);host.querySelector('[data-rc-source="'+state.source+'"]')?.focus();});
            }else if(b.hasAttribute('data-rc-pick')){const row=state?.rows?.find(r=>r.key===b.dataset.rcPick);if(row)enter(row.slot,row.scope,'inventory');}
            else if(b.hasAttribute('data-rc-create')&&state?.fields)enter(editorSlot(),[state.editorIdentity],'manual');
        });
        // 数值输入即时写入本地编辑状态，避免点击提交时依赖 blur/change 的触发顺序。
        host.addEventListener('input',event=>{
            if(event.target.hasAttribute?.('data-rc-plan-name')){nameInput=event.target.value;return;}
            if(event.target.dataset.rcFilter&&state?.phase==='select'){const value=event.target.type==='checkbox'?event.target.checked:event.target.value;if(filters[event.target.dataset.rcFilter]===value)return;filters[event.target.dataset.rcFilter]=value;paint();return;}
            const el=event.target;if(!state?.fields||state.phase!=='select'||el.dataset.rcField!=='value')return;
            const stat=el.dataset.rcStat==='main'?state.fields.mainStat:state.fields.substats[Number(el.dataset.rcStat)];
            stat.value=el.value;
            const p=host.querySelector('[data-rc-check]');if(p)p.textContent=i18n.t('candidate.'+eligible().reason);
        });
        host.addEventListener('change',event=>{
            const el=event.target;
            if(el.dataset.rcFilter&&state?.phase==='select'){const value=el.type==='checkbox'?el.checked:el.value;if(filters[el.dataset.rcFilter]===value)return;filters[el.dataset.rcFilter]=value;paint();return;}
            if(el.hasAttribute('data-rc-condition')&&state?.phase==='context'&&!busy){state.conditions[el.dataset.rcCondition]=el.checked;state.focusCondition=el.dataset.rcCondition;render();return;}
            if(!state?.fields||state.phase!=='select')return;
            if(el.hasAttribute('data-rc-catalog')){state.fields.catalogId=el.value;const entry=catalog.find(e=>String(e.id)===el.value);if(entry)state.fields.cost=Number(entry.type.replace('Cost',''));render();host.querySelector('[data-rc-catalog]')?.focus();}
            else if(el.hasAttribute('data-rc-stat')){
                const stat=el.dataset.rcStat==='main'?state.fields.mainStat:state.fields.substats[Number(el.dataset.rcStat)];stat[el.dataset.rcField]=el.value;
                if(el.dataset.rcField==='key'){render();host.querySelector('select[data-rc-stat="'+el.dataset.rcStat+'"]')?.focus();}else {const p=host.querySelector('[data-rc-check]');if(p)p.textContent=i18n.t('candidate.'+eligible().reason);}
            }
        });
        host.addEventListener('keydown',event=>{if(event.key==='Escape'&&state){event.preventDefault();event.stopImmediatePropagation();close();}},true);
        async function fromLibrary(identity){
            await open();
            if(state?.phase!=='select')return;
            const matches=state.rows.filter(row=>String(row.slot.echo?.id)===String(identity));
            if(matches.length!==1){state.notice='identity';render();return;}
            const row=matches[0];
            if(row.eligibility.status==='blocked'){state.notice=row.eligibility.reason;render();return;}
            await enter(row.slot,row.scope,'inventory');
        }
        host.addEventListener('toggle',event=>{if(event.target.hasAttribute?.('data-rc-details'))detailsOpen=event.target.open;},true);
        host.addEventListener('submit',event=>{if(!event.target.matches('[data-rc-rename]')||!state?.context)return;event.preventDefault();const loaded=store.load();if(!loaded.ok||!loaded.data.drafts.some(d=>d.id===state.context.draft.id)){host.querySelector('[data-rc-name-status]').textContent=i18n.t('workspace.SOURCE_CHANGED');return;}const result=RegisterMetadata.create(localStorage).rename('drafts',state.context.draft.id,nameInput??event.target.querySelector('input').value,nameExpected);host.querySelector('[data-rc-name-status]').textContent=i18n.t(result.ok?'ops.renamed':'workspace.'+(result.code==='SOURCE_CHANGED'?'SOURCE_CHANGED':'SAVE_FAILED'));const meta=RegisterMetadata.create(localStorage).load();nameExpected=meta.raw;if(result.ok){nameInput=null;nameGuard.markSaved();refresh(true);host.querySelector('[data-rc-name-status]').textContent=i18n.t('ops.renamed');}});
        return {render,restore,close,fromLibrary,active:()=>!!state||busy,
            invalidate(reason='stale'){if(state){if(editorGuard.dirty())editorGuard.retain();if(nameGuard.dirty())nameGuard.retain();nameGuard.pause();editorGuard.pause();nameInput=null;epoch++;busy=false;state={...state,phase:'error',context:null,notice:reason};render();}},
            getContext(){return state?.phase==='context'?{...state.context,locale:i18n.locale,result:state.result||null}:null;}};
    }
})(typeof globalThis!=='undefined'?globalThis:this);
