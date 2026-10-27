/* 分享只读取当前 view model，不访问角色存储或计算入口。 */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.RegisterShare=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
    // 同图共用原始分数轴；轴上限按当前最大贡献向上取整，不代表质量上限。
    function radarData(model){
        const entries=Array.from({length:5},(_,i)=>{const slot=model.slots.find(s=>s.position===i+1),value=slot?.echo?.score?.value;return {position:i+1,value:model.model.status==='available'&&Number.isFinite(value)?value:null,status:slot?.status||'empty'};});
        const max=Math.max(1,Math.ceil(Math.max(0,...entries.map(e=>e.value??0))/10)*10);
        return {min:0,max,scope:'raw-role-score-contribution',filled:entries.every(e=>e.status==='complete'&&e.value!==null&&e.value>=0),entries};
    }
    function snapshot(model){return JSON.parse(JSON.stringify({role:model.role,model:model.model,slots:model.slots,summary:model.summary,scale:model.scale}));}
    async function open(model,i18n){
        const data=snapshot(model),t=(k,p)=>i18n.t(k,p),f=i18n.format,dialog=document.createElement('dialog');dialog.className='rr-dialog rr-share-dialog rr-share-choosing';
        const heading=document.createElement('h2');heading.textContent=t('share.title');heading.id='rr-share-title';dialog.setAttribute('aria-labelledby',heading.id);dialog.append(heading);
        const note=document.createElement('p');note.textContent=t('share.conditions')+' '+t('share.scope');dialog.append(note);
        let mode=null,closed=false;const pendingImages=new Set(),images=new Map();const choices=document.createElement('div');choices.className='rr-share-choices';dialog.append(choices);
        const modeButtons=['compact','detailed'].map(value=>{const button=document.createElement('button');button.textContent=t('share.'+value);button.onclick=async()=>{if(back.disabled||closed)return;mode=value;zoom.hidden=false;choices.hidden=true;canvas.hidden=false;chartHelp.hidden=false;save.hidden=false;back.hidden=false;dialog.classList.remove('rr-share-choosing');heading.textContent=t('share.'+mode);back.disabled=true;try{await render();}catch(_){status.textContent=t('share.failure');save.disabled=true;}finally{back.disabled=false;canvas.setAttribute('aria-busy','false');}if(dialog.isConnected)back.focus();};choices.append(button);return button;});
        const canvas=document.createElement('canvas');canvas.hidden=true;canvas.width=1440;canvas.height=1150;canvas.setAttribute('role','img');canvas.setAttribute('aria-label',t('share.title'));dialog.append(canvas);
        // 图表尺度保留在网站可展开说明中，不绘入玩家分享图片。
        const chartHelp=document.createElement('details');chartHelp.className='rr-share-chart-help';chartHelp.hidden=true;
        const chartSummary=document.createElement('summary');chartSummary.textContent=t('share.chartHelp');
        const chartDescription=document.createElement('p');chartHelp.append(chartSummary,chartDescription);dialog.append(chartHelp);
        const status=document.createElement('p');status.setAttribute('role','status');dialog.append(status);
        const zoom=document.createElement('button');zoom.type='button';zoom.textContent=t('share.fullSize');zoom.hidden=true;zoom.onclick=()=>{const expanded=dialog.classList.toggle('rr-share-full-size');zoom.setAttribute('aria-pressed',String(expanded));};dialog.append(zoom);
        const actions=document.createElement('div');actions.className='rr-dialog-actions';const save=document.createElement('button'),close=document.createElement('button');save.textContent=t('share.download');close.textContent=t('common.close');save.disabled=true;const back=document.createElement('button');back.textContent=t('share.back');back.hidden=true;save.hidden=true;back.onclick=()=>{zoom.hidden=true;dialog.classList.remove('rr-share-full-size');canvas.hidden=true;chartHelp.hidden=true;save.hidden=true;back.hidden=true;choices.hidden=false;status.textContent='';heading.textContent=t('share.title');dialog.classList.add('rr-share-choosing');modeButtons[mode==='detailed'?1:0].focus();};actions.append(back,save,close);dialog.append(actions);document.body.append(dialog);const opener=document.activeElement;
        const finish=()=>{closed=true;pendingImages.forEach(cancel=>cancel());pendingImages.clear();dialog.close();dialog.remove();opener?.focus();};close.onclick=finish;dialog.oncancel=event=>{event.preventDefault();finish();};dialog.showModal();modeButtons[0].focus();
        const replacements=new Map(),localSources=[...new Set([data.role.portrait,...data.slots.map(s=>s.echo?.image)].filter(src=>src&&new URL(src,document.baseURI).protocol==='file:'))];
        const filename=src=>decodeURIComponent(new URL(src,document.baseURI).pathname.split('/').pop());
        const picker=document.createElement('input');picker.type='file';picker.accept='image/*';picker.multiple=true;picker.hidden=true;dialog.append(picker);
        let restricted=false;
        async function render(){
        save.disabled=true;status.textContent=t('share.loading');restricted=false;canvas.setAttribute('aria-busy','true');
        // 重置画布的来源状态，再用用户明确选择的文件重新绘制。
        await document.fonts?.ready;
        if(closed)return;
        // 图片并行载入并在当前弹窗内复用；失败仅保留读数和明确提示。
        function loadImage(src){
            if(!src)return Promise.resolve(null);
            src=replacements.get(src)||src;
            if(images.has(src))return Promise.resolve(images.get(src));
            return new Promise(resolve=>{
                const img=new Image();let timer,done=false;
                const settle=value=>{if(done)return;done=true;clearTimeout(timer);pendingImages.delete(cancel);img.onload=img.onerror=null;if(value)images.set(src,value);resolve(value);};
                const cancel=()=>{settle(null);img.src='';};pendingImages.add(cancel);
                timer=setTimeout(()=>cancel(),4000);
                if(/^https?:$/.test(new URL(src,document.baseURI).protocol))img.crossOrigin='anonymous';
                img.onload=()=>settle(img);img.onerror=()=>settle(null);img.src=src;
            });
        }
        const sources=[...new Set([data.role.portrait,...data.slots.map(s=>s.echo?.image)].filter(Boolean))];
        const loaded=new Map(await Promise.all(sources.map(async src=>[src,await loadImage(src)])));
        if(closed)return;
        const pageWidth=mode==='detailed'?2040:1440;
        canvas.width=pageWidth;
        const measure=canvas.getContext('2d'),detailed=mode==='detailed';
        function wrap(value,size,width){measure.font=size+'px system-ui, sans-serif';const lines=[];let line='';for(const ch of String(value)){if(measure.measureText(line+ch).width>width&&line){const space=line.lastIndexOf(' ');if(space>0){lines.push(line.slice(0,space));line=line.slice(space+1);}else {lines.push(line);line='';}}line+=ch;}lines.push(line);return lines;}
        function height(value,size,width){return wrap(value,size,width).length*size*1.35;}
        const echoName=e=>i18n.entity('echoes',e.catalogId,e.legacy?.name||e.catalogId);
        const suiteName=e=>e.suite?.id!=null?i18n.entity('sets',e.suite.id,e.suite.legacy?.name):e.suite?.legacy?.name||'';
        const statName=s=>s?.key?t('stats.'+s.key):t('interaction.missingSubstat');
        const statValue=s=>s?.unit==='percent'?f.percentage(s.value):f.decimal(s?.value);
        const characterName=i18n.entity('characters',data.role.catalogId,data.role.legacy?.name||data.role.catalogId);
        const modeName=data.model.status==='available'?t('register.mode.'+(data.model.parameters.mode||'default')):t('issues.model-unavailable');
        const echoes=data.slots.map(s=>s.echo).filter(Boolean),pad=48,gap=detailed?24:16,column=(pageWidth-pad*2-gap*4)/5;
        const nameSize=detailed?25:22,nameHeight=Math.max(60,...echoes.map(e=>height(echoName(e),nameSize,column-32)));
        const suiteHeight=detailed?Math.max(36,...echoes.map(e=>height(suiteName(e),19,column-32))):0;
        const mainHeight=Math.max(58,...echoes.map(e=>height(statName(e.mainStat),22,column-32)));
        // 简略版按当前模型原始副词条贡献排序，最多两项；并列按稳定词条键排序。
        const compactStats=e=>(e.substats||[]).filter(s=>s.status==='valid'&&Number.isFinite(s.rawContribution)&&s.rawContribution>0).slice().sort((a,b)=>b.rawContribution-a.rawContribution||a.key.localeCompare(b.key)).slice(0,2);
        const compactHeight=Math.max(0,...echoes.map(e=>compactStats(e).reduce((n,s)=>n+height(statName(s)+' '+statValue(s),18,column-32)+8,0)));
        const valueWidth=detailed?Math.max(90,...echoes.flatMap(e=>(e.substats||[]).map(s=>{measure.font='24px system-ui, sans-serif';return measure.measureText(statValue(s)).width;}))):0;
        const labelWidth=column-48-valueWidth;
        const rowHeights=Array.from({length:Math.max(5,...echoes.map(e=>e.substats?.length||0))},(_,i)=>Math.max(56,...echoes.map(e=>height(statName(e.substats?.[i]),21,labelWidth)+20)));
        const heroScale=detailed?1.15:1,heroGap=20,heroInner=pageWidth-pad*2-heroGap*2;
        const identityWidth=heroInner*.38,scoreWidth=heroInner*.30,radarWidth=heroInner*.32;
        const identityX=pad,scoreX=identityX+identityWidth+heroGap,radarX=scoreX+scoreWidth+heroGap;
        const titleSize=38*heroScale,configurationName=data.role.configurationId?(data.role.configurationName||t('mc.defaultName')):'',configurationHeight=configurationName?height(configurationName,22*heroScale,identityWidth-40)+10:0,identityHeight=height(characterName,titleSize,identityWidth-40)+configurationHeight,portraitHeight=285*heroScale;
        const badgeSize=18*heroScale,chainName=t('role.chain',{chain:data.model.chain});
        measure.font=badgeSize+'px system-ui, sans-serif';
        const chainWidth=Math.min(identityWidth-40,measure.measureText(chainName).width+28),modeWidth=Math.min(identityWidth-40,measure.measureText(modeName).width+28);
        const badgeStack=chainWidth+modeWidth+8>identityWidth-40,badgeHeight=Math.max(height(chainName,badgeSize,chainWidth-24),height(modeName,badgeSize,modeWidth-24))+14;
        const heroTop=146,heroHeight=Math.max(500*heroScale,portraitHeight+36+identityHeight+badgeHeight*(badgeStack?2:1)+34),heroBottom=heroTop+heroHeight;
        const cardTop=heroBottom+32,imageHeight=detailed?164:140,nameTop=cardTop+imageHeight+66;
        const mainTop=nameTop+nameHeight+suiteHeight+12,scoreTop=mainTop+mainHeight+42;
        const subTop=scoreTop+94,cardBottom=detailed?subTop+rowHeights.reduce((a,b)=>a+b+8,0)+24:scoreTop+96+compactHeight;
        const totalKeys=[...new Set(['crit_rate','crit_damage','atk_percent','resonance_efficiency',...data.summary.substatTotals.map(s=>s.key)])];
        const totalColumns=totalKeys.length<=6?totalKeys.length:4,totalWidth=(pageWidth-pad*2-(totalColumns-1)*18)/totalColumns,totalRows=Array.from({length:Math.ceil(totalKeys.length/totalColumns)},(_,i)=>Math.max(100,...totalKeys.slice(i*totalColumns,i*totalColumns+totalColumns).map(key=>height(t('stats.'+key),23,totalWidth-32)+62)));
        const totalTop=cardBottom+42,totalHeight=totalRows.reduce((a,b)=>a+b+14,0);
        canvas.height=Math.ceil((detailed?totalTop+56+totalHeight:cardBottom)+118);
        const ctx=canvas.getContext('2d'),boxes=[];
        ctx.fillStyle='#101a1c';ctx.fillRect(0,0,pageWidth,canvas.height);
        function text(value,x,top,size=22,color='#e5eeeb',width=1300,align='left'){
            ctx.fillStyle=color;ctx.font=size+'px system-ui, sans-serif';ctx.textAlign=align;
            const lines=wrap(value,size,width);
            lines.forEach((part,i)=>ctx.fillText(part,x,top+size+i*size*1.35));ctx.textAlign='left';return lines.length*size*1.35;
        }
        function line(x,y,x2){ctx.strokeStyle='#53645c';ctx.lineWidth=1;ctx.beginPath();ctx.moveTo(x,y);ctx.lineTo(x2,y);ctx.stroke();}
        function panel(x,y,w,h,r=16,fill='#19292b',stroke='#3a5556'){
            ctx.beginPath();ctx.roundRect(x,y,w,h,r);ctx.fillStyle=fill;ctx.fill();ctx.strokeStyle=stroke;ctx.lineWidth=1;ctx.stroke();
        }
        let missing=false;
        function picture(src,x,y,w,h){const image=src&&loaded.get(src);if(!image){if(src)missing=true;text('—',x+w/2,y+h/2-20,32,'#738c89',w,'center');return;}const scale=Math.min(w/image.width,h/image.height);ctx.drawImage(image,x+(w-image.width*scale)/2,y+(h-image.height*scale)/2,image.width*scale,image.height*scale);}
        // 顶部品牌的原图标、双侧细线与对称构图保持一致。
        ctx.font='24px system-ui, sans-serif';const brandWidth=Math.max(ctx.measureText(t('register.brand')).width,250),brandX=(pageWidth-brandWidth-58)/2;
        ctx.fillStyle='#e2e8e2';[[0,12,20],[8,0,44],[16,12,20]].forEach(([x,y,h])=>ctx.fillRect(brandX+x,48+y,2,h));text(t('register.brand'),brandX+58,40,24);text(t('register.brandLatin'),brandX+58,77,17);
        function resonance(x,y,size,color='#82968a'){
            ctx.fillStyle=color;ctx.beginPath();ctx.moveTo(x,y-size);ctx.lineTo(x+size*.22,y-size*.18);ctx.lineTo(x+size*.7,y);ctx.lineTo(x+size*.22,y+size*.18);ctx.lineTo(x,y+size);ctx.lineTo(x-size*.22,y+size*.18);ctx.lineTo(x-size*.7,y);ctx.lineTo(x-size*.22,y-size*.18);ctx.closePath();ctx.fill();
        }
        line(48,78,brandX-36);line(brandX+brandWidth+94,78,pageWidth-48);
        // 三个等高区域共用同一顶部设计，长名称和徽章自然扩展高度。
        for(const [x,w] of [[identityX,identityWidth],[scoreX,scoreWidth],[radarX,radarWidth]])panel(x,heroTop,w,heroHeight,20,'#142326','#30484a');
        const portraitW=identityWidth-40,portraitX=identityX+20,cx=identityX+identityWidth/2,cy=heroTop+portraitHeight*.5+12;
        ctx.strokeStyle='#314944';ctx.lineWidth=1;[.43,.48].forEach(r=>{ctx.beginPath();ctx.arc(cx,cy,Math.min(portraitW,portraitHeight)*r,0,Math.PI*2);ctx.stroke();});
        picture(data.role.portrait,portraitX,heroTop+12,portraitW,portraitHeight);boxes.push({kind:'portrait',x:portraitX,y:heroTop+12,w:portraitW,h:portraitHeight});
        const titleTop=heroTop+portraitHeight+22;
        text(characterName,cx,titleTop,titleSize,'#f1f3ec',identityWidth-40,'center');
        if(configurationName)text(configurationName,cx,titleTop+identityHeight-configurationHeight,22*heroScale,'#a8d9ce',identityWidth-40,'center');
        const badgeTop=titleTop+identityHeight+12,totalBadgeWidth=chainWidth+modeWidth+8;
        const badge=(label,x,y,w)=>{panel(x,y,w,badgeHeight,Math.min(16,badgeHeight/2),'#1c3233','#395552');text(label,x+w/2,y+6,badgeSize,'#c4d6cf',w-24,'center');};
        if(badgeStack){badge(chainName,cx-chainWidth/2,badgeTop,chainWidth);badge(modeName,cx-modeWidth/2,badgeTop+badgeHeight+8,modeWidth);}else{badge(chainName,cx-totalBadgeWidth/2,badgeTop,chainWidth);badge(modeName,cx-totalBadgeWidth/2+chainWidth+8,badgeTop,modeWidth);}
        // 评分沿用原读数，只增加克制的共鸣环及高字重数字。
        const scoreCenter=scoreX+scoreWidth/2,scoreY=heroTop+heroHeight*.47,ring=Math.min(scoreWidth*.36,150*heroScale);
        ctx.strokeStyle='#30514d';ctx.lineWidth=1;[ring,ring+9].forEach(r=>{ctx.beginPath();ctx.arc(scoreCenter,scoreY+10,r,0,Math.PI*2);ctx.stroke();});
        text(t('summary.score'),scoreCenter,scoreY-95*heroScale,20*heroScale,'#b6d2c8',scoreWidth-40,'center');
        const scoreText=f.scoreValue(data.summary.score);let scoreSize=112*heroScale;
        while(scoreSize>44){ctx.font='700 '+scoreSize+'px system-ui, sans-serif';if(ctx.measureText(scoreText).width<=scoreWidth-44)break;scoreSize-=2;}
        ctx.textAlign='center';ctx.fillStyle='#bff4df';ctx.shadowColor='#6cd4b844';ctx.shadowBlur=18;ctx.fillText(scoreText,scoreCenter,scoreY+scoreSize*.45);ctx.shadowBlur=0;ctx.textAlign='left';
        if(data.summary.status!=='complete')text(t('state.'+data.summary.status),scoreCenter,scoreY+95*heroScale,18*heroScale,'#d4bd96',scoreWidth-40,'center');
        const condition=data.model.parameters||{},conditions=[];
        if(condition.extraEnergy!=null)conditions.push(t('register.extraEnergy',{value:f.percentage(condition.extraEnergy)}));
        if(condition.referenceHealth!=null)conditions.push(t('register.referenceHealth',{value:f.integer(condition.referenceHealth)}));
        if(conditions.length)text(conditions.join(' · '),scoreCenter,heroBottom-72,17*heroScale,'#b0c4bd',scoreWidth-40,'center');
        const radar=radarData(data),rx=radarX+radarWidth/2,ry=heroTop+heroHeight*.50,radius=Math.min(radarWidth/2-96,160*heroScale);
        boxes.push({kind:'identity',x:identityX,y:heroTop,w:identityWidth,h:heroHeight},{kind:'score',x:scoreX,y:heroTop,w:scoreWidth,h:heroHeight});
        const vertex=(i,r)=>({x:rx+Math.cos(-Math.PI/2+i*Math.PI*2/5)*r,y:ry+Math.sin(-Math.PI/2+i*Math.PI*2/5)*r});
        function polygon(points){ctx.beginPath();points.forEach((p,i)=>i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y));ctx.closePath();}
        text(t('share.radarTitle'),rx,heroTop+20,23,'#d4e7df',detailed?480:320,'center');
        for(let level=1;level<=4;level++){polygon(Array.from({length:5},(_,i)=>vertex(i,radius*level/4)));ctx.strokeStyle=level===4?'#597d76':'#2f4c49';ctx.lineWidth=1;ctx.stroke();}
        for(let i=0;i<5;i++){const p=vertex(i,radius);ctx.beginPath();ctx.moveTo(rx,ry);ctx.lineTo(p.x,p.y);ctx.strokeStyle='#3a5652';ctx.stroke();}
        if(radar.filled){polygon(radar.entries.map((entry,i)=>vertex(i,radius*entry.value/radar.max)));ctx.fillStyle='#78c8b833';ctx.fill();ctx.strokeStyle='#92deca';ctx.lineWidth=2;ctx.stroke();radar.entries.forEach((entry,i)=>{const p=vertex(i,radius*entry.value/radar.max);ctx.beginPath();ctx.arc(p.x,p.y,3.5,0,Math.PI*2);ctx.fillStyle='#b4eedb';ctx.fill();});}
        radar.entries.forEach((entry,i)=>{const p=vertex(i,radius+38);text(String(entry.position).padStart(2,'0'),p.x,p.y-18,17,'#c8a66c',130,'center');text(f.scoreValue(entry.value),p.x,p.y+8,22,'#d5e9e1',150,'center');});
        chartDescription.textContent=t('share.radarScale',{max:f.decimal(radar.max)})+' · '+t('share.radarScope')+' '+(radar.filled?'':t('share.radarPartial')+' ')+t('share.loadoutCorrection');
        boxes.push({kind:'radar',x:radarX,y:heroTop,w:radarWidth,h:heroHeight});
        canvas.setAttribute('data-share-radar',JSON.stringify(radar));
        for(const slot of data.slots){
            const x=pad+(slot.position-1)*(column+gap),e=slot.echo;
            panel(x,cardTop,column,cardBottom-cardTop,16);boxes.push({kind:'echo',position:slot.position,x,y:cardTop,w:column,h:cardBottom-cardTop});
            text(String(slot.position).padStart(2,'0'),x+16,cardTop+14,21,'#c8a66c',60);
            if(!e){text(t('loadout.empty'),x+column/2,cardTop+imageHeight+66,22,'#a5bcb3',column-32,'center');continue;}
            text(t('loadout.cost',{cost:e.cost??'—'}),x+column-16,cardTop+15,19,'#bdcfc6',column-90,'right');
            picture(e.image,x+24,cardTop+52,column-48,imageHeight);
            text(echoName(e),x+16,nameTop,nameSize,'#e6eee7',column-32);
            if(detailed)text(suiteName(e),x+16,nameTop+nameHeight,19,'#9dbbb0',column-32);
            {
                text(statName(e.mainStat),x+16,mainTop,22,'#b9cec5',column-32);
                text(statValue(e.mainStat),x+16,mainTop+mainHeight,29,'#e9efea',column-32);
            }
            text(t('loadout.contribution'),x+16,scoreTop,18,'#adc5ba',column-32);
            text(f.scoreValue(e.score.value),x+16,scoreTop+26,detailed?42:36,'#b8ecd7',column-32);
            if(!detailed){let y=scoreTop+90;for(const stat of compactStats(e)){y+=text(statName(stat)+' '+statValue(stat),x+16,y,18,'#c3efdc',column-32)+8;}}
            if(detailed){let y=subTop;rowHeights.forEach((h,i)=>{
                const stat=e.substats?.[i],effective=data.model.status==='available'&&stat?.status==='valid'&&Number.isFinite(stat.rawContribution)&&stat.rawContribution>0;
                panel(x+12,y,column-24,h,8,effective?'#203b35':'#172629',effective?'#578c7d':'#3d5047');
                text(statName(stat),x+24,y+(h-height(statName(stat),21,labelWidth))/2,21,effective?'#c3efdc':'#b9cbc3',labelWidth);
                text(statValue(stat),x+column-24,y+(h-24)/2-3,24,effective?'#d5f4e6':'#dae5de',valueWidth,'right');
                y+=h+8;
            });}
        }
        if(detailed){
            text(t('summary.substatTotals'),48,totalTop,26,'#d9e9e0',pageWidth-96);
            const totals=new Map(data.summary.substatTotals.map(stat=>[stat.key,stat]));
            totalKeys.forEach((key,i)=>{const row=Math.floor(i/totalColumns),x=48+(i%totalColumns)*(totalWidth+18),y=totalTop+56+totalRows.slice(0,row).reduce((a,b)=>a+b+14,0),stat=totals.get(key)||{unit:'percent',value:data.summary.status==='complete'?0:null};panel(x,y,totalWidth,totalRows[row],12);text(t('stats.'+key),x+16,y+12,23,'#abc5b8',totalWidth-32);text(statValue(stat),x+16,y+totalRows[row]-45,31,'#e3eee6',totalWidth-32);});
        }
        const ornamentY=canvas.height-65;
        // 原底部五共鸣符号、比例与两侧细线原样保留。
        line(48,ornamentY,pageWidth/2-68);line(pageWidth/2+68,ornamentY,pageWidth-48);
        [[-44,7],[-22,12],[0,26],[22,12],[44,7]].forEach(([dx,size])=>resonance(pageWidth/2+dx,ornamentY,size));
        canvas.setAttribute('data-share-layout',JSON.stringify({boxes,cardTop,cardBottom,totalTop:detailed?totalTop:null,footer:ornamentY,scope:'raw-score-distribution'}));

        const commentary=data.summary.status==='complete'?'':t('share.summaryIncomplete');
        canvas.setAttribute('aria-label',heading.textContent+' · '+i18n.entity('characters',data.role.catalogId,data.role.legacy?.name)+' · '+f.score(data.summary.score)+' · '+commentary);
        canvas.setAttribute('aria-busy','false');status.textContent=missing?t('share.imagesMissing'):'';save.disabled=false;
        try{ctx.getImageData(0,0,1,1);}catch(error){if(error.name==='SecurityError')restricted=true;}
        save.textContent=t(restricted&&localSources.length?'share.chooseImages':'share.download');
        if(restricted)status.textContent=localSources.length?t('share.chooseImagesHelp',{files:localSources.map(filename).join(', ')}):t('share.localExportRestricted');
        }
        function download(){
            save.disabled=true;status.textContent=t('share.exporting');
            try{canvas.toBlob(blob=>{if(closed)return;save.disabled=false;if(!blob){status.textContent=t('share.failure');return;}const a=document.createElement('a'),url=URL.createObjectURL(blob);a.href=url;a.download='resonance-register'+(mode==='detailed'?'-detailed':'')+'.png';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);status.textContent=t('share.downloadStarted');},'image/png');}catch(_){save.disabled=false;status.textContent=t('share.failure');}
        }
        save.onclick=()=>{if(restricted){if(localSources.length)picker.click();else status.textContent=t('share.localExportRestricted');return;}download();};
        picker.onchange=async()=>{
            const files=Array.from(picker.files||[]);if(!files.length)return;
            save.disabled=true;
            try{
                for(const src of localSources){const matches=files.filter(file=>file.name===filename(src));if(matches.length!==1)continue;const url=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(reader.error);reader.readAsDataURL(matches[0]);});replacements.set(src,url);}
                const pending=localSources.filter(src=>!replacements.has(src));
                if(pending.length){status.textContent=t('share.chooseImagesHelp',{files:pending.map(filename).join(', ')});return;}
                await render();if(!closed&&!restricted)download();
            }catch(_){status.textContent=t('share.failure');}finally{save.disabled=false;picker.value='';}
        };
    }
    return {snapshot,radarData,open};
});
