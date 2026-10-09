/* 分享只读取当前 view model，不访问角色存储或计算入口。 */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.RegisterShare=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
    function snapshot(model){return JSON.parse(JSON.stringify({role:model.role,model:model.model,slots:model.slots,summary:model.summary}));}
    async function open(model,i18n){
        const data=snapshot(model),t=(k,p)=>i18n.t(k,p),f=i18n.format,dialog=document.createElement('dialog');dialog.className='rr-dialog rr-share-dialog';
        const heading=document.createElement('h2');heading.textContent=t('share.title');dialog.append(heading);
        const note=document.createElement('p');note.textContent=t('share.conditions');dialog.append(note);
        const canvas=document.createElement('canvas');canvas.width=1440;canvas.height=1150;canvas.setAttribute('role','img');canvas.setAttribute('aria-label',t('share.title'));dialog.append(canvas);
        const status=document.createElement('p');status.setAttribute('role','status');dialog.append(status);
        const actions=document.createElement('div');actions.className='rr-dialog-actions';const save=document.createElement('button'),close=document.createElement('button');save.textContent=t('share.download');close.textContent=t('common.close');save.disabled=true;actions.append(save,close);dialog.append(actions);document.body.append(dialog);const opener=document.activeElement;
        const finish=()=>{dialog.close();dialog.remove();opener?.focus();};close.onclick=finish;dialog.oncancel=event=>{event.preventDefault();finish();};dialog.showModal();close.focus();
        const ctx=canvas.getContext('2d');ctx.fillStyle='#111918';ctx.fillRect(0,0,1440,1150);
        function text(value,x,y,size=22,color='#dce4dd',width=1300){ctx.fillStyle=color;ctx.font=size+'px system-ui, sans-serif';const lines=[];let line='';for(const ch of String(value)){if(ctx.measureText(line+ch).width>width&&line){lines.push(line);line='';}line+=ch;}lines.push(line);lines.forEach((v,i)=>ctx.fillText(v,x,y+i*size*1.4));return lines.length*size*1.4;}
        function line(x,y,x2){ctx.strokeStyle='#53645c';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x2,y);ctx.stroke();}
        let missing=false;
        async function picture(src,x,y,w,h){if(!src)return;try{const image=await new Promise((resolve,reject)=>{const img=new Image();const timer=setTimeout(()=>reject(Error()),4000);img.crossOrigin='anonymous';img.onload=()=>{clearTimeout(timer);resolve(img);};img.onerror=()=>{clearTimeout(timer);reject(Error());};img.src=src;});const scale=Math.min(w/image.width,h/image.height);ctx.drawImage(image,x+(w-image.width*scale)/2,y+(h-image.height*scale)/2,image.width*scale,image.height*scale);}catch(_){missing=true;}}
        ctx.fillStyle='#e2e8e2';[[0,12,20],[8,0,44],[16,12,20]].forEach(([x,y,h])=>ctx.fillRect(48+x,40+y,2,h));text('RESONANCE REGISTER',90,65,20);text(t('share.scope'),48,115,22,'#b5c2b9');
        await picture(Number(data.role.catalogId)===1?'image/register/jinhsi.webp':data.role.portrait,48,160,210,270);
        text(i18n.entity('characters',data.role.catalogId,data.role.legacy?.name||data.role.catalogId),290,210,48,'#eef0e9',1080);
        text(t('role.chain',{chain:data.model.chain})+' · '+(data.model.status==='available'?t('register.mode.'+(data.model.parameters.mode||'default')):t('issues.model-unavailable')),290,260,22);
        text(t('summary.score'),290,325,22);text(f.decimal(data.summary.score),290,395,64);text(t('state.'+data.summary.status),550,390,22);
        const conditions=Object.entries(data.model.parameters).filter(([k])=>k!=='mode').map(([k,v])=>t('interaction.'+k)+': '+f.decimal(v));
        if(conditions.length)text(conditions.join(' · '),290,430,18,'#b5c2b9',1050);
        line(48,460,1392);
        for(const slot of data.slots){const x=48+(slot.position-1)*272;const e=slot.echo;text(String(slot.position).padStart(2,'0'),x,502,22);if(!e){text(t('loadout.empty'),x,575,22,'#b5c2b9',245);continue;}await picture(e.image,x,520,120,110);text(i18n.entity('echoes',e.catalogId,e.legacy?.name||e.catalogId),x,664,20,'#e2e8e2',245);text(t('loadout.cost',{cost:e.cost}),x,727,18,'#b5c2b9');text((e.mainStat.key?t('stats.'+e.mainStat.key):t('state.missing')),x,764,18,'#b5c2b9',245);text(e.mainStat.unit==='percent'?f.percentage(e.mainStat.value):f.decimal(e.mainStat.value),x,805,24);text(f.score(e.score.value),x,851,30);}
        line(48,880,1392);text(t('summary.substatTotals')+' · '+t('summary.scope'),48,915,18,'#b5c2b9');const totals=new Map(data.summary.substatTotals.map(s=>[s.key,s.value]));['crit_rate','crit_damage','atk_percent','resonance_efficiency'].forEach((key,i)=>{text(t('stats.'+key),48+i*340,955,18,'#b5c2b9',320);text(f.percentage(totals.get(key)??(data.summary.status==='complete'?0:null)),48+i*340,994,27);});
        const commentary=data.summary.status==='complete'?t('share.summaryComplete',{positions:data.summary.weakestPositions.join(', ')}):t('share.summaryIncomplete');text(t('assistant.name')+' · '+commentary,48,1046,19,'#b5c2b9',1330);
        canvas.setAttribute('aria-label',heading.textContent+' · '+i18n.entity('characters',data.role.catalogId,data.role.legacy?.name)+' · '+f.score(data.summary.score)+' · '+commentary);
        if(missing)status.textContent=t('share.imagesMissing');save.disabled=false;
        save.onclick=()=>{try{canvas.toBlob(blob=>{if(!blob){status.textContent=t('share.failure');return;}const a=document.createElement('a'),url=URL.createObjectURL(blob);a.href=url;a.download='resonance-register-'+data.role.id+'.png';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);},'image/png');}catch(_){status.textContent=t('share.failure');}};
    }
    return {snapshot,open};
});
