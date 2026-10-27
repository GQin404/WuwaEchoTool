/* Shared evidence and engraving, presentation only. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./convene-visuals.js'),require('./convene-report.js'),require('./convene-character-share.js'));else root.ConveneShare=factory(root.ConveneVisuals,root.ConveneReport,root.ConveneCharacterShare);})(globalThis,function(Visuals,Report,CharacterShare){
'use strict';
const COLORS=Visuals.COLORS;
async function render({stats,character=null,name='',portrait=null,t,account=null,detailed=false,showUID=false,fixture=false,page=0,characterRating=null,document:doc=globalThis.document}){
 if(character)return CharacterShare.render({stats,character,name,portrait,t,account,detailed,showUID,fixture,document:doc});
 const entries=Report.acquisitions(character),cols=entries.length>24?4:3,w=character&&entries.length>24?1440:1200,margin=56,inner=w-112;
 const cellH=146,historyY=1000,historyHeight=character?(detailed?entries.length*116:Math.ceil(entries.length/cols)*cellH):0;
 const highlights=Report.highlights(stats),achievements=Report.representativeAchievements(stats),poolHeight=stats.pools.length*94;
 const h=character?historyY+historyHeight+(detailed?520:210):detailed?2080+poolHeight+achievements.length*60:1290;
 if(h>30000)throw Error('IMAGE_TOO_LARGE');
 await doc.fonts?.ready;
 const c=doc.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');if(!x)throw Error('IMAGE_FAILED');
 const data=character||stats,title=data.luck.title,family=character?'character':'overall',accent=COLORS[title]||COLORS.observing,ink='#eff1e7',muted='#a7bcb7',gold='#e2cfaa',layout=[];
 function text(value,px,py,size=24,color=ink,max=inner,weight=400){
  let s=String(value),font=size;x.fillStyle=color;const fontSet=()=>x.font=weight+' '+font+'px "Segoe UI","Microsoft JhengHei",sans-serif';fontSet();
  while(x.measureText(s).width>max&&font>16){font--;fontSet();}
  while(x.measureText(s).width>max&&s.length){s=s.slice(0,-1);}if(s!==String(value))s=s.slice(0,-1)+'…';
  x.fillText(s,px,py);layout.push({text:s,x:px,y:py,font,width:x.measureText(s).width,limit:max});
 }
 function line(y){x.strokeStyle=accent+'45';x.lineWidth=1;x.beginPath();x.moveTo(margin,y);x.lineTo(w-margin,y);x.stroke();}
 function panel(px,py,pw,ph){x.fillStyle='#192a30';x.strokeStyle='#526462';x.lineWidth=.8;x.beginPath();x.roundRect(px,py,pw,ph,10);x.fill();x.stroke();}
 function metric(label,value,px,py,pw,ph=128){text(label,px,py+24,18,muted,pw);text(value,px,py+85,46,ink,pw,600);}
 function section(label,y){text(label,margin,y,25,gold,inner,600);line(y+22);}
 function interval(r){return r.interval!=null?String(r.interval):r.lowerBound!=null?'≥ '+r.lowerBound:'—';}
 function intervalKind(r){return t(r.anomaly?'intervalAnomaly':r.interval!=null?'exactShort':r.lowerBound!=null?'lowerBoundShort':'unknownInterval');}
 const bg=x.createLinearGradient(0,0,w,h);bg.addColorStop(0,'#101d27');bg.addColorStop(.48,'#152b2d');bg.addColorStop(1,'#0b171e');x.fillStyle=bg;x.fillRect(0,0,w,h);
 // Resonance rings stay in the emblem zone, away from text and statistics.
 const level=Visuals.geometry(title).level;
 x.save();x.strokeStyle=accent;x.globalAlpha=.05+Math.max(0,level)*.008;for(let i=0;i<Math.max(1,level);i++){x.beginPath();x.arc(character?w-225:260,350,140+i*18,0,Math.PI*2);x.stroke();}x.restore();
 text('WUWA ECHO TOOL',margin,60,18,gold,inner*.5,600);text(t('reportLabel'),margin,90,14,muted,inner);
 const heroY=120,heroH=character?548:466;Visuals.drawFrame(x,title,28,heroY,w-56,heroH);
 if(character){
  text(name||character.name,margin+10,174,32,ink,inner-20,600);
  let loaded=false;
  const src=portrait||'image/convene/character-fallback.svg';
  if(/^(?:image\/characters\/[\w-]+\.(?:webp|png|jpe?g|avif)|image\/convene\/character-fallback\.svg)$/.test(src)){const image=new (doc.defaultView?.Image||globalThis.Image)();image.src=src;let timer;try{await Promise.race([image.decode(),new Promise((_,reject)=>{timer=setTimeout(()=>reject(Error()),4000)})]);const scale=Math.min(320/image.naturalWidth,430/image.naturalHeight),iw=image.naturalWidth*scale,ih=image.naturalHeight*scale;x.drawImage(image,70+(320-iw)/2,heroY+heroH-24-ih,iw,ih);loaded=true;}catch(_){}finally{clearTimeout(timer)}}
  if(!loaded)Visuals.drawBadge(x,'observing',230,400,190,'character');
  Visuals.drawBadge(x,title,w-210,292,260,'character');
  text(t('bond.'+title),438,295,48,accent,w-840,600);
  text(t('characterAutomatic'),438,345,18,muted,w-740);
  text(data.luck.score==null?'—':data.luck.score.toFixed(1),438,472,112,ink,360,600);text('/ 100',805,468,25,muted,130);
  text(t('bond.'+title+'.desc'),438,524,20,muted,w-500);
  text(t('characterSample',{n:data.luck.samples}),438,574,19,muted,w-500);
  const metrics=[['acquired',character.total],['avg',number(character.average)],['fast',number(character.min)],['slow',number(character.max)],['sumIntervals',character.knownSpend]];
  metrics.forEach(([key,value],i)=>metric(t(key),value,margin+i*inner/5,720,inner/5-18));
  text(t('sumIntervalsNote'),margin,884,17,muted,inner);
  section(t('allAcquisitions'),940);text(t('allShown',{n:entries.length}),margin,980,19,muted);
  entries.forEach((r,i)=>{
   const xx=detailed?margin:margin+(i%cols)*(inner/cols),yy=historyY+(detailed?i*116:Math.floor(i/cols)*cellH),cw=detailed?inner:inner/cols-14;
   if(detailed){
    line(yy+105);text(t('acquisitionOrdinal',{n:r.ordinal}),xx,yy+28,19,gold,120,600);
    text(interval(r),xx+155,yy+46,43,r.interval!=null?accent:muted,150,600);
    text(intervalKind(r),xx+155,yy+78,15,muted,240);
    text(r.time,xx+420,yy+28,21,ink,inner-430);
    const pool=stats.pools.find(p=>p.pool===r.pool);text(pool?.displayName||t((pool?.rule.key||'unknown')+'Pool'),xx+420,yy+64,18,muted,inner-430);
    text(t(r.upResult==='unknown'?'unknown':r.upResult),xx+820,yy+94,17,muted,inner-830);
   }else{
    panel(xx,yy,cw,126);text(t('acquisitionOrdinal',{n:r.ordinal}),xx+18,yy+30,17,gold,cw-36,600);
    text(interval(r),xx+18,yy+83,45,r.interval!=null?accent:muted,cw-36,600);
    text(intervalKind(r),xx+18,yy+110,15,muted,cw-36);
   }
  });
  const end=historyY+historyHeight;
  if(detailed){section(t('distribution'),end+55);drawDistribution(Report.eligible(stats).filter(r=>r.item===character.item),end+90,190);text(t('sumIntervalsNote'),margin,end+326,18,muted);text(t('optionalTargetSeparate'),margin,end+365,18,muted);}
 }else{
  Visuals.drawBadge(x,title,260,heroY+230,328);
  text(t('tierWord'),470,211,18,muted,inner-440);
  text(t(title),470,285,62,accent,w-526,600);
  text(data.luck.score==null?'—':data.luck.score.toFixed(1),470,419,116,ink,380,600);text('/ 100',816,416,26,muted,180);
  text(t(title+'.desc'),470,475,22,muted,w-526);
  text(t('samples')+' '+data.luck.samples+' · '+t('evaluation.'+data.luck.status)+(data.luck.useLimited?'':' · '+t('drawOnly')),470,523,18,muted,w-526);
  [['total',stats.total.toLocaleString()],['five',stats.five.length],['avg',number(stats.average)]].forEach(([key,value],i)=>metric(t(key),value,margin+i*inner/3,636,inner/3-30));
  section(t('luckyHighlights'),835);
  if(!highlights.length)text(t('noReliableHighlight'),margin,909,25,muted,inner);
  highlights.forEach((highlight,i)=>{const yy=906+i*76;text('0'+(i+1),margin,yy,18,accent,60,600);text(t(highlight.key,{n:highlight.value,total:highlight.denominator}),margin+64,yy,29,ink,inner-64,600);});
  text(t('evidenceOnly'),margin,highlights.length?936+highlights.length*76:962,17,muted);
  if(detailed){
   section(t('distribution'),1240);drawDistribution(Report.eligible(stats),1285,210);
   section(t('pools'),1565);
   stats.pools.forEach((pool,i)=>{const yy=1625+i*94;text(pool.displayName||t(pool.rule.key+'Pool'),margin,yy,24,ink,inner*.6,500);text(t('total')+' '+pool.total+'   /   5★ '+pool.five.length,margin,yy+33,18,muted,inner*.65);text(t('avg')+' '+number(mean(pool.five.filter(r=>r.interval!=null).map(r=>r.interval))),w-320,yy+14,22,accent,264);line(yy+55);});
   let yy=1620+poolHeight;section(t('reliableUP'),yy);yy+=65;
   text(t('win')+' '+stats.limited.win+'   ·   '+t('loss')+' '+stats.limited.loss+'   ·   '+t('guarantee')+' '+stats.limited.guarantee,margin,yy,25,ink,inner);
   text(t('unknown')+' '+stats.limited.unknown+' · '+t('unknownUPNote'),margin,yy+38,18,muted,inner);
   if(achievements.length){section(t('representativeAchievements'),yy+115);achievements.forEach((a,i)=>{Visuals.drawAchievement(x,a.key,margin,yy+146+i*60,42);text(t(a.key),margin+60,yy+174+i*60,22,gold,inner-60);});}
  }
 }
 function drawDistribution(records,py,ph){
  const bins=Array.from({length:8},(_,i)=>records.filter(r=>r.interval>i*10&&r.interval<=(i+1)*10).length),max=Math.max(1,...bins),step=inner/8;
  bins.forEach((n,i)=>{const xx=margin+i*step,bar=n/max*(ph-65);x.fillStyle=accent+'85';x.fillRect(xx,py+ph-38-bar,step-24,bar);text(n,xx+12,py+ph-48-bar,17,ink,step-24);text((i*10+1)+'–'+((i+1)*10),xx,py+ph-8,16,muted,step-16);});
 }
 const coverage=Report.coverage(stats),unknown=character?entries.filter(r=>r.interval==null).length:coverage.censored;
 line(h-116);text(t('reportCoverage',{n:unknown,gaps:coverage.gaps}),margin,h-80,17,muted,inner);
 text(fixture?t('sample'):t('archiveScope'),margin,h-47,16,muted,inner-220);
 if(showUID&&account)text('UID '+Report.maskUID(account.uid),w-300,h-47,16,muted,244);
 return {canvas:c,dataURL:c.toDataURL('image/png'),pages:1,page:0,layout,acquisitionCount:entries.length,acquisitionIDs:entries.map(r=>r.id),highlights,coverage};
}
function mean(values){return values.length?values.reduce((a,b)=>a+b,0)/values.length:null;}
// Discord target report: receives the exact derived snapshot used by the page.
async function renderTarget({rating,name='',portrait=null,t,account=null,detailed=false,showUID=false,fixture=false,page=0,showExcess=false,showBadge=true,document:doc=globalThis.document}){
 if(!rating)throw Error('IMAGE_FAILED');
 const all=showExcess?rating.acquisitions:rating.selected,perPage=12,pages=detailed?Math.max(1,Math.ceil(all.length/perPage)):1,currentPage=Math.max(0,Math.min(pages-1,page)),rows=detailed?all.slice(currentPage*perPage,(currentPage+1)*perPage):[],c=doc.createElement('canvas'),w=1200,h=detailed?1600:880;
 c.width=w;c.height=h;const x=c.getContext('2d');if(!x)throw Error('IMAGE_FAILED');const accent=COLORS[rating.tier],gold='#e8c982',ink='#e8efdf',muted='#abc0b8',layout=[];
 function text(value,px,py,size=22,color=ink,max=1088){let str=String(value),font=size;x.fillStyle=color;const set=()=>x.font='500 '+font+'px "Segoe UI","Microsoft JhengHei",sans-serif';set();while(x.measureText(str).width>max&&font>14){font--;set();}while(x.measureText(str).width>max&&str.length>1){str=str.slice(0,-2)+'…';}x.fillText(str,px,py);layout.push({text:str,x:px,y:py,font,width:x.measureText(str).width,limit:max});}
 function panel(px,py,pw,ph){x.fillStyle='#172b2b';x.strokeStyle='#43645e';x.lineWidth=1;x.beginPath();x.roundRect(px,py,pw,ph,14);x.fill();x.stroke();}
 const gradient=x.createLinearGradient(0,0,w,h);gradient.addColorStop(0,'#102126');gradient.addColorStop(.5,'#142d2a');gradient.addColorStop(1,'#0c191f');x.fillStyle=gradient;x.fillRect(0,0,w,h);x.strokeStyle=accent+'28';for(let r=220;r<740;r+=75){x.beginPath();x.ellipse(1060,270,r,r*.53,-.5,0,Math.PI*2);x.stroke();}
 Visuals.drawFrame(x,rating.tier,22,100,w-44,625);text('WUWA ECHO TOOL',56,62,17,gold);text(t('share'),775,62,14,muted,370);x.fillStyle=gold;x.fillRect(56,86,1088,1);
 let loaded=false;
 if((portrait=portrait||'image/convene/character-fallback.svg')&&/^(?:image\/characters\/[\w-]+\.(?:webp|png|jpe?g|avif)|image\/convene\/character-fallback\.svg)$/.test(portrait)){const img=new Image();img.src=portrait;try{await Promise.race([img.decode(),new Promise((_,reject)=>setTimeout(()=>reject(Error()),2000))]);const scale=Math.min(360/img.naturalWidth,500/img.naturalHeight),iw=img.naturalWidth*scale,ih=img.naturalHeight*scale;x.drawImage(img,36+(360-iw)/2,110+500-ih,iw,ih);loaded=true;}catch(_){}}
 if(!loaded)Visuals.drawBadge(x,'observing',215,380,235,'character');
 text(name,420,184,48,ink,690);text('R'+rating.target+' / '+rating.copies+'×',420,239,26,gold,620);
 text(t(rating.scope==='window'?'rWindowLabel':'rActual'),420,275,17,muted,670);
 if(showBadge){Visuals.drawBadge(x,rating.tier,1060,377,155,'character');text(t('bond.'+rating.tier),420,332,32,accent,540);}
 text(rating.score==null?'—':rating.score.toFixed(1),420,434,90,accent,390);text('/ 100',735,432,22,muted,150);
 text(t('rDraws'),420,483,21,muted,620);text(rating.draws??'—',420,562,70,ink,620);text(t('rReason.'+rating.reason),420,607,17,muted,700);
 panel(56,646,1088,107);text(t('rVisible')+'  '+rating.total,80,688,23,ink,470);if(showExcess)text(t('rExcess')+'  '+rating.excess,590,688,20,gold,530);text(t('rActual'),80,728,21,muted,1020);
 if(detailed){
  text(t('rStart')+' · '+(rating.anchor?.time||'—'),56,803,19,muted);text(t('rEnd')+' · '+(rating.end?.time||'—'),56,837,19,muted);
  panel(56,872,1088,94+rows.length*44);text(t('history')+' · '+t('interval'),80,911,21,gold,900);text((currentPage+1)+' / '+pages,1010,911,19,muted,100);
  rows.forEach((r,i)=>{const idx=currentPage*perPage+i,yy=958+i*44;text(idx<7?'R'+idx:'+'+(idx-6),80,yy,21,gold,95);text(r.time,190,yy,21,ink,660);text(r.interval==null?'—':r.interval,990,yy,23,accent,120);});
 }
 text(fixture?t('sample'):t('rNotLifetime'),56,h-64,16,muted,1050);text(t('selfMade'),56,h-30,14,muted,790);if(showUID&&account)text('UID '+Report.maskUID(account.uid),860,h-30,16,muted,280);
 return {canvas:c,dataURL:c.toDataURL('image/png'),pages,page:currentPage,layout};
}
function number(n){return n==null?'—':Number(n).toFixed(1).replace(/\.0$/,'');}
return {render,renderTarget,COLORS,number};});
