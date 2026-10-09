/* 分享只读取当前 view model，不访问角色存储或计算入口。 */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.RegisterShare=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
    function snapshot(model){return JSON.parse(JSON.stringify({role:model.role,model:model.model,slots:model.slots,summary:model.summary}));}
    async function open(model,i18n){
        const data=snapshot(model),t=(k,p)=>i18n.t(k,p),f=i18n.format,dialog=document.createElement('dialog');dialog.className='rr-dialog rr-share-dialog';
        const heading=document.createElement('h2');heading.textContent=t('share.title');dialog.append(heading);
        const note=document.createElement('p');note.textContent=t('share.conditions')+' '+t('share.scope');dialog.append(note);
        const canvas=document.createElement('canvas');canvas.width=1440;canvas.height=1150;canvas.setAttribute('role','img');canvas.setAttribute('aria-label',t('share.title'));dialog.append(canvas);
        const status=document.createElement('p');status.setAttribute('role','status');dialog.append(status);
        const actions=document.createElement('div');actions.className='rr-dialog-actions';const save=document.createElement('button'),close=document.createElement('button');save.textContent=t('share.download');close.textContent=t('common.close');save.disabled=true;actions.append(save,close);dialog.append(actions);document.body.append(dialog);const opener=document.activeElement;
        const finish=()=>{dialog.close();dialog.remove();opener?.focus();};close.onclick=finish;dialog.oncancel=event=>{event.preventDefault();finish();};dialog.showModal();close.focus();
        const replacements=new Map(),localSources=[...new Set([data.role.portrait,...data.slots.map(s=>s.echo?.image)].filter(src=>src&&new URL(src,document.baseURI).protocol==='file:'))];
        const filename=src=>decodeURIComponent(new URL(src,document.baseURI).pathname.split('/').pop());
        const picker=document.createElement('input');picker.type='file';picker.accept='image/*';picker.multiple=true;picker.hidden=true;dialog.append(picker);
        let restricted=false;
        async function render(){
        save.disabled=true;status.textContent='';restricted=false;
        // 重置画布的来源状态，再用用户明确选择的文件重新绘制。
        canvas.width=1440;
        const ctx=canvas.getContext('2d');ctx.fillStyle='#111918';ctx.fillRect(0,0,1440,1150);
        function text(value,x,y,size=22,color='#dce4dd',width=1300){ctx.fillStyle=color;ctx.font=size+'px system-ui, sans-serif';const lines=[];let line='';for(const ch of String(value)){if(ctx.measureText(line+ch).width>width&&line){lines.push(line);line='';}line+=ch;}lines.push(line);lines.forEach((v,i)=>ctx.fillText(v,x,y+i*size*1.4));return lines.length*size*1.4;}
        function line(x,y,x2){ctx.strokeStyle='#53645c';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x2,y);ctx.stroke();}
        let missing=false;
        async function picture(src,x,y,w,h){if(!src)return;src=replacements.get(src)||src;try{const image=await new Promise((resolve,reject)=>{const img=new Image();const timer=setTimeout(()=>reject(Error()),4000);if(/^https?:$/.test(new URL(src,document.baseURI).protocol))img.crossOrigin='anonymous';img.onload=()=>{clearTimeout(timer);resolve(img);};img.onerror=()=>{clearTimeout(timer);reject(Error());};img.src=src;});const scale=Math.min(w/image.width,h/image.height);ctx.drawImage(image,x+(w-image.width*scale)/2,y+(h-image.height*scale)/2,image.width*scale,image.height*scale);}catch(_){missing=true;}}
        // 品牌整体居中；说明留在预览外，导出只保留展示所需的读数。
        ctx.font='24px system-ui, sans-serif';const brandWidth=Math.max(ctx.measureText(t('register.brand')).width,250),brandX=(1440-brandWidth-58)/2;
        ctx.fillStyle='#e2e8e2';[[0,12,20],[8,0,44],[16,12,20]].forEach(([x,y,h])=>ctx.fillRect(brandX+x,48+y,2,h));text(t('register.brand'),brandX+58,64,24);text(t('register.brandLatin'),brandX+58,94,17);
        function resonance(x,y,size,color='#82968a'){
            ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(x,y-size);ctx.lineTo(x+size*.22,y-size*.18);ctx.lineTo(x+size*.7,y);ctx.lineTo(x+size*.22,y+size*.18);ctx.lineTo(x,y+size);ctx.lineTo(x-size*.22,y+size*.18);ctx.lineTo(x-size*.7,y);ctx.lineTo(x-size*.22,y-size*.18);ctx.closePath();ctx.fill();
        }
        line(48,78,brandX-36);line(brandX+brandWidth+94,78,1392);
        // 低对比共鸣环衬托立绘，五槽节点继续共用一条配置基线。
        ctx.strokeStyle='#2c3b34';ctx.lineWidth=1;[142,160].forEach(r=>{ctx.beginPath();ctx.arc(210,292,r,0,Math.PI*2);ctx.stroke();});
        await picture(data.role.portrait,48,130,330,310);
        text(i18n.entity('characters',data.role.catalogId,data.role.legacy?.name||data.role.catalogId),420,226,54,'#eef0e9',520);
        text(t('role.chain',{chain:data.model.chain}),420,285,22,'#b5c2b9');
        text(data.model.status==='available'?t('register.mode.'+(data.model.parameters.mode||'default')):t('issues.model-unavailable'),420,326,20,'#b5c2b9',500);
        text(t('summary.score'),1000,226,22,'#b5c2b9',350);text(f.decimal(data.summary.score),1000,322,76);
        if(data.summary.status!=='complete')text(t('state.'+data.summary.status),1000,368,20,'#b5c2b9',350);
        resonance(1340,385,28);resonance(1304,385,12);resonance(1376,385,12);
        line(48,460,1392);
        for(const slot of data.slots){const x=48+(slot.position-1)*272;const e=slot.echo;text(String(slot.position).padStart(2,'0'),x,502,22);if(!e){text(t('loadout.empty'),x,575,22,'#b5c2b9',245);continue;}await picture(e.image,x,520,120,110);text(i18n.entity('echoes',e.catalogId,e.legacy?.name||e.catalogId),x,664,20,'#e2e8e2',245);text(t('loadout.cost',{cost:e.cost}),x,727,18,'#b5c2b9');text((e.mainStat.key?t('stats.'+e.mainStat.key):t('state.missing')),x,764,18,'#b5c2b9',245);text(e.mainStat.unit==='percent'?f.percentage(e.mainStat.value):f.decimal(e.mainStat.value),x,805,24);text(f.score(e.score.value),x,851,30);}
        data.slots.forEach(slot=>resonance(48+(slot.position-1)*272+120,460,7));
        line(48,880,1392);text(t('summary.substatTotals'),48,915,18,'#b5c2b9');const totals=new Map(data.summary.substatTotals.map(s=>[s.key,s.value]));['crit_rate','crit_damage','atk_percent','resonance_efficiency'].forEach((key,i)=>{text(t('stats.'+key),48+i*340,955,18,'#b5c2b9',320);text(f.percentage(totals.get(key)??(data.summary.status==='complete'?0:null)),48+i*340,994,27);});
        line(48,1080,652);line(788,1080,1392);[[-44,7],[-22,12],[0,26],[22,12],[44,7]].forEach(([dx,size])=>resonance(720+dx,1080,size));
        const commentary=data.summary.status==='complete'?'':t('share.summaryIncomplete');
        canvas.setAttribute('aria-label',heading.textContent+' · '+i18n.entity('characters',data.role.catalogId,data.role.legacy?.name)+' · '+f.score(data.summary.score)+' · '+commentary);
        if(missing)status.textContent=t('share.imagesMissing');save.disabled=false;
        try{ctx.getImageData(0,0,1,1);}catch(error){if(error.name==='SecurityError')restricted=true;}
        save.textContent=t(restricted&&localSources.length?'share.chooseImages':'share.download');
        if(restricted)status.textContent=localSources.length?t('share.chooseImagesHelp',{files:localSources.map(filename).join(', ')}):t('share.localExportRestricted');
        }
        function download(){
            save.disabled=true;status.textContent=t('share.exporting');
            try{canvas.toBlob(blob=>{save.disabled=false;if(!blob){status.textContent=t('share.failure');return;}const a=document.createElement('a'),url=URL.createObjectURL(blob);a.href=url;a.download='resonance-register-'+data.role.id+'.png';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);status.textContent=t('share.downloadStarted');},'image/png');}catch(_){save.disabled=false;status.textContent=t('share.failure');}
        }
        save.onclick=()=>{if(restricted){if(localSources.length)picker.click();else status.textContent=t('share.localExportRestricted');return;}download();};
        picker.onchange=async()=>{
            const files=Array.from(picker.files||[]);if(!files.length)return;
            save.disabled=true;
            try{
                for(const src of localSources){const matches=files.filter(file=>file.name===filename(src));if(matches.length!==1)continue;const url=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(reader.error);reader.readAsDataURL(matches[0]);});replacements.set(src,url);}
                const pending=localSources.filter(src=>!replacements.has(src));
                if(pending.length){status.textContent=t('share.chooseImagesHelp',{files:pending.map(filename).join(', ')});return;}
                await render();if(!restricted)download();
            }catch(_){status.textContent=t('share.failure');}finally{save.disabled=false;picker.value='';}
        };
        await render();
    }
    return {snapshot,open};
});
