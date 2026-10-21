/* 校对状态只存在内存；确认后由宿主调用既有 Core 写入。 */
(function(root){
    'use strict';
    function create({i18n,catalog,suites,core,roleId,rollValues,mainValues,onSaved=()=>{}}){
        const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
        const t=(k,p)=>esc(i18n.t('screenshot.'+k,p)),tr=k=>esc(i18n.t(k));
        const state={items:[],busy:false,message:'',progress:0,phase:'preparing',cancelled:false,examples:false,expected:JSON.stringify(core.load())};
        const progressText=()=>i18n.t('screenshot.'+state.phase,{percent:state.progress});
        let generation=0;
        const makeEngine=token=>ScreenshotRecognition({catalog,suites,rollValues,mainValues,onProgress:p=>{if(token!==generation||!state.busy)return;state.phase=p.phase;state.progress=Math.round(p.progress*100);const out=document.querySelector('[data-ocr-progress]');if(out)out.textContent=progressText();}});
        let engine=makeEngine(generation),redraw=()=>{};
        function options(values,selected,label){return '<option value="">'+t('unknown')+'</option>'+values.map(v=>'<option value="'+esc(v)+'"'+(String(v)===String(selected)?' selected':'')+'>'+label(v)+'</option>').join('');}
        function status(s){return '<small class="rw-ocr-review">'+t(s?'needsReview':'detected')+'</small>';}
        function statField(s,index,main,cost){
            const prefix=main?'main':'sub'+index;
            // 主词条和副词条档位直接复用新增声骸的数据，未知值不补零。
            const values=main?[...new Set((mainValues['Cost'+cost]||[]).filter(v=>v.key===s.key).map(v=>v.value))]:(rollValues[s.key]||[]);
            const label=v=>esc(RoleCandidates.unit(s.key)==='percent'?i18n.format.percentage(Number(v)):i18n.format.decimal(Number(v)));
            return `<div class="rw-stat"><label>${main?tr('loadout.mainStat'):tr('candidate.substatIndex').replace('{position}',index+1)}${status(s.needsReview)}<select data-ocr-field="${prefix}.key">${options(main?(RoleCandidates.MAIN[cost]||[]):RoleCandidates.SUB,s.key,k=>tr('stats.'+k))}</select></label><label>${tr('analysis.actualValue')}<select data-ocr-field="${prefix}.value"${values.length?'':' disabled'}>${options(values,s.value,label)}</select></label></div>`;
        }
        function nameSuggestions(r){const choices=(r.suggestedCatalogIds||[]).map(id=>catalog.find(e=>String(e.id)===String(id))).filter(Boolean);return !r.catalogId&&choices.length?'<div class="rw-ocr-suggestions"><p>'+t('nameSuggestion')+'</p>'+choices.map(e=>'<button type="button" data-ocr-suggestion="'+esc(e.id)+'">'+esc(i18n.entity('echoes',e.id,e.name))+' · '+esc(e.type)+'</button>').join('')+'</div>':'';}
        function itemView(item,index){
            const r=item.result;
            let target=null;try{if(roleId)target=core.load().role.find(r=>String(r.roleId)===String(roleId));}catch(_){/* 存档冲突由确认写入入口统一处理。 */}
            const eligible=target&&!target.isImport&&target.costList.length<5;
            return `<section class="rw-ocr-result" data-ocr-item="${item.id}"><div class="rw-ocr-source"><a href="${esc(item.url)}" target="_blank" rel="noopener"><img src="${esc(item.url)}" alt="${t('sourceImage',{number:index+1})}"></a><p>${esc(item.fileName)}</p><span>${t(item.saved?'saved':item.phase==='pending'?'pending':item.phase==='processing'?'recognizing':r.status)}</span><button type="button" data-ocr-remove="${item.id}"${state.busy?' disabled':''}>${tr('workspace.delete')}</button></div><form data-ocr-form="${item.id}"><fieldset${state.busy||item.saved?' disabled':''}><legend>${t('echoNumber',{number:index+1})}</legend>${item.error?'<p role="alert">'+t(item.error)+'</p>':''}${['engine','timeout','cancelled'].includes(item.error)?'<button type="button" data-ocr-retry="'+item.id+'">'+t('retry')+'</button>':''}<p>${t('readName')} <strong>${esc(r.detectedName)||'—'}</strong></p>${nameSuggestions(r)}<div class="rw-stat"><label>${tr('candidate.echo')}${status(!r.catalogId||r.confidence.name<.85)}<select data-ocr-field="catalogId">${options(catalog.map(e=>e.id),r.catalogId,id=>esc(i18n.entity('echoes',id,catalog.find(e=>e.id===id).name)))}</select></label><label>Cost${status(!r.detectedCost||r.confidence.cost<.85)}<select data-ocr-field="detectedCost">${options([1,3,4],r.detectedCost,v=>'Cost '+v)}</select></label></div><label>${tr('workspace.suite')}<select data-ocr-field="suite">${options(Object.keys(suites),r.suite,v=>esc(i18n.entity('sets',suites[v],v)))}</select></label>${statField(r.detectedMainStat,0,true,r.detectedCost)}${r.detectedSubstats.map((s,i)=>statField(s,i,false,r.detectedCost)).join('')}<p>${t('incomplete')}</p><p>${t('retryHint')}</p><label>${t('destination')}<select data-ocr-target><option value="">${t('library')}</option>${eligible?'<option value="'+esc(roleId)+'"'+(item.target?' selected':'')+'>'+t('roleTarget',{name:esc(i18n.entity('characters',target.roleListId,target.name)),position:target.costList.length+1})+'</option>':''}</select></label><label class="rw-ocr-confirm"><input type="checkbox" data-ocr-confirm required${item.confirmed?' checked':''}> ${t('confirm')}</label><button class="rw-primary" type="submit">${t(item.saved?'saved':'save')}</button>${item.error==='conflict'?'<button type="button" data-ocr-refresh>'+t('refresh')+'</button>':''}</fieldset></form></section>`;
        }
        function render(){return `<section class="rw-ocr"><p class="rw-ocr-eyebrow">${t('steps')}</p><h2>${t('heading')}</h2><p>${t('scope')}</p><p>${t('local')}</p><button type="button" data-ocr-examples aria-expanded="${state.examples}">${t('examples')}</button>${state.examples?`<div class="rw-ocr-examples"><p>${t('scope')}</p><p>${t('requirements')}</p><figure><img src="image/screenshot-examples/full.png" alt="${t('fullExample')}"><figcaption>${t('fullExample')} · ${t('masked')}</figcaption></figure><figure><img src="image/screenshot-examples/panel.png" alt="${t('panelExample')}"><figcaption>${t('panelExample')}</figcaption></figure></div>`:''}${location.protocol==='file:'?'<p role="alert">'+t('fileProtocol')+'</p>':''}<label class="rw-ocr-upload">${t('upload')}<input type="file" data-ocr-files accept="image/png,image/jpeg,image/webp,.png,.jpg,.jpeg,.webp" multiple${state.busy||location.protocol==='file:'?' disabled':''}></label><p>${t('limits')}</p><p role="status" aria-live="polite" data-ocr-progress>${state.busy?esc(progressText()):state.message?t(state.message):t('waiting')}</p>${state.busy?'<button type="button" data-ocr-cancel>'+t('cancelRecognition')+'</button>':''}${state.items.map(itemView).join('')}</section>`;}
        async function add(files){
            if(state.busy)return;const token=generation;state.busy=true;state.cancelled=false;state.phase='preparing';state.progress=0;state.message='';redraw();
            const added=[];
            for(const file of files){
                if(token!==generation||state.cancelled)break;
                if(state.items.length>=20){state.message='limit';break;}
                if(!/^image\/(png|jpeg|webp)$/.test(file.type)||!file.size||file.size>20*1024*1024){state.message='fileError';continue;}
                try{const buffer=await file.arrayBuffer();if(token!==generation||state.cancelled)break;const words=[];new Uint8Array(buffer).forEach((byte,index)=>{words[index>>>2]=(words[index>>>2]||0)|(byte<<(24-(index%4)*8));});const id=CryptoJS.SHA256(CryptoJS.lib.WordArray.create(words,buffer.byteLength)).toString();if(state.items.some(item=>item.id===id)){state.message='duplicate';continue;}
                    const url=URL.createObjectURL(file),item={id,url,fileName:file.name,result:ScreenshotRecognitionAdapter.empty(url),phase:'pending',target:'',confirmed:false,saved:false};state.items.push(item);added.push(item);
                }catch(_){if(token===generation)state.message='fileError';}
            }
            if(token!==generation)return;redraw();
            try{for(const item of added){if(token!==generation)break;if(state.cancelled){item.phase='done';item.error='cancelled';continue;}await recognizeItem(item,token);}}
            finally{if(token===generation){state.busy=false;redraw();}}
        }
        async function recognizeItem(item,token=generation){
            item.phase='processing';item.error='';item.confirmed=false;state.phase='loading';state.progress=0;redraw();
            const activeEngine=engine;try{const result=await activeEngine.recognize(item.url);if(token!==generation)return;item.result=result;}catch(e){if(token!==generation)return;item.error=['size','fileError','timeout','cancelled'].includes(e.message)?e.message:'engine';}
            item.phase='done';redraw();
        }
        function mount(host,renderHost){
            redraw=renderHost;
            host.addEventListener('change',async e=>{if(e.target.matches('[data-ocr-files]')){await add(Array.from(e.target.files||[]));return;}
                const section=e.target.closest('[data-ocr-item]'),item=state.items.find(i=>i.id===section?.dataset.ocrItem);if(!item||item.saved)return;
                if(e.target.matches('[data-ocr-confirm]')){item.confirmed=e.target.checked;return;}
                if(e.target.matches('[data-ocr-target]')){item.target=e.target.value;item.confirmed=false;section.querySelector('[data-ocr-confirm]').checked=false;return;}
                const field=e.target.dataset.ocrField;if(!field)return;
                const r=item.result;item.confirmed=false;section.querySelector('[data-ocr-confirm]').checked=false;
                if(field.includes('.')){const [which,key]=field.split('.'),s=which==='main'?r.detectedMainStat:r.detectedSubstats[Number(which.slice(3))];s[key]=e.target.value;s.needsReview=false;if(key==='key'){s.value='';redraw();host.querySelector('[data-ocr-item="'+item.id+'"] [data-ocr-field="'+field+'"]')?.focus({preventScroll:true});}}
                else {r[field]=e.target.value;if(field==='catalogId')r.confidence.name=1;if(field==='detectedCost'){r.confidence.cost=1;if(!(mainValues['Cost'+r.detectedCost]||[]).some(s=>s.key===r.detectedMainStat.key&&s.value===Number(r.detectedMainStat.value)))r.detectedMainStat={key:'',value:'',confidence:0,needsReview:true};}redraw();host.querySelector('[data-ocr-item="'+item.id+'"] [data-ocr-field="'+field+'"]')?.focus({preventScroll:true});}
            });
            host.addEventListener('click',async e=>{
                const suggestion=e.target.closest('[data-ocr-suggestion]');if(suggestion&&!state.busy){const item=state.items.find(i=>i.id===suggestion.closest('[data-ocr-item]')?.dataset.ocrItem),entry=catalog.find(e=>String(e.id)===suggestion.dataset.ocrSuggestion);if(item&&!item.saved&&entry&&entry.type==='Cost'+item.result.detectedCost){item.result.catalogId=entry.id;item.result.confidence.name=1;item.confirmed=false;redraw();}return;}
                if(e.target.closest('[data-ocr-cancel]')){state.cancelled=true;state.message='cancelled';engine.cancel();return;}
                const retry=e.target.closest('[data-ocr-retry]');if(retry&&!state.busy){const item=state.items.find(i=>i.id===retry.dataset.ocrRetry);if(!item||item.saved)return;const token=generation;state.busy=true;state.cancelled=false;try{await recognizeItem(item,token);}finally{if(token===generation){state.busy=false;redraw();}}return;}
            });
            host.addEventListener('click',e=>{if(e.target.closest('[data-ocr-examples]')){state.examples=!state.examples;redraw();}const remove=e.target.closest('[data-ocr-remove]');if(remove&&!state.busy){const item=state.items.find(i=>i.id===remove.dataset.ocrRemove);URL.revokeObjectURL(item.url);state.items=state.items.filter(i=>i!==item);redraw();}if(e.target.closest('[data-ocr-refresh]')){state.expected=JSON.stringify(core.load());state.items.forEach(i=>{i.confirmed=false;i.error='';});redraw();}});
            host.addEventListener('submit',e=>{
                const id=e.target.dataset.ocrForm;if(!id)return;e.preventDefault();e.stopImmediatePropagation();const item=state.items.find(i=>i.id===id);if(!item||!item.confirmed||state.busy||item.saved)return;
                try{const next=ScreenshotRecognitionAdapter.toEcho(item.result,{catalog,createEcho:CharacterCore.createEcho,id:Date.now(),suites,rollValues,mainValues});
                    core.transact(state.expected,d=>{const ids=new Set([...d.role.flatMap(r=>r.costList),...(d.unusedEchoes||[])].map(e=>String(e.costId)));while(ids.has(String(next.costId)))next.costId++;
                        if(item.target&&String(item.target)!==String(roleId))throw Error('SOURCE_CHANGED');
                        const role=item.target?d.role.find(r=>String(r.roleId)===String(item.target)):null;
                        core.saveEcho(d,item.target||null,null,next,role?role.costList.length+1:undefined);
                    });item.saved=true;item.error='';state.message='saved';state.expected=JSON.stringify(core.load());onSaved({complete:state.items.every(i=>i.saved)});
                }catch(err){item.error=err.message==='SOURCE_CHANGED'?'conflict':err.message==='COST_LIMIT'?'costLimit':['QuotaExceededError','SecurityError'].includes(err.name)?'saveFailed':'invalid';item.confirmed=false;}redraw();
            });
            window.addEventListener('pagehide',clear);
        }
        // 退出即丢弃临时结果，旧识别任务不得更新新会话。
        function clear(){
            generation++;engine.cancel();engine.dispose().catch(()=>{});state.items.forEach(i=>URL.revokeObjectURL(i.url));
            Object.assign(state,{items:[],busy:false,message:'',progress:0,phase:'preparing',cancelled:false,examples:false});engine=makeEngine(generation);
        }
        function start(){clear();state.expected=JSON.stringify(core.load());}
        return {render,mount,clear,start};
    }
    root.RegisterScreenshotImport={create};
})(globalThis);
