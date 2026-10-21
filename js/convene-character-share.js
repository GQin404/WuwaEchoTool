/* Character-only settlement report. Overall and target renderers are independent. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./convene-visuals.js'),require('./convene-report.js'));else root.ConveneCharacterShare=factory(root.ConveneVisuals,root.ConveneReport);})(globalThis,function(Visuals,Report){
'use strict';
const number=n=>n==null?'—':Number(n).toFixed(1).replace(/\.0$/,'');
async function render({stats,character,name='',portrait=null,t,account=null,detailed=false,showUID=false,fixture=false,document:doc=globalThis.document}){
 if(!character)throw Error('IMAGE_FAILED');
 const entries=Report.acquisitions(character),cols=detailed?2:entries.length>24?4:3,w=entries.length>24?1440:1200,m=54,inner=w-m*2,gap=14,cardW=(inner-gap*(cols-1))/cols,cardH=detailed?188:112,rows=Math.ceil(entries.length/cols),gridY=detailed?874:828,end=gridY+rows*(cardH+gap)-gap,h=end+(detailed?194:138);
 if(h>30000)throw Error('IMAGE_TOO_LARGE');
 await doc.fonts?.ready;const c=doc.createElement('canvas');c.width=w;c.height=h;const x=c.getContext('2d');if(!x)throw Error('IMAGE_FAILED');
 const title=character.luck.title,accent=Visuals.COLORS[title]||Visuals.COLORS.observing,ink='#edf0e7',muted='#a5bcb9',metal='#dccca9',layout=[];
 function text(value,px,py,size=24,color=ink,max=inner,weight=500){let s=String(value),font=size;const set=()=>x.font=weight+' '+font+'px "Segoe UI","Microsoft JhengHei",sans-serif';set();while(x.measureText(s).width>max&&font>15){font--;set();}while(x.measureText(s).width>max&&s.length)s=s.slice(0,-1);if(s!==String(value))s=s.slice(0,-1)+'…';x.fillStyle=color;x.fillText(s,px,py);layout.push({text:s,x:px,y:py,font,width:x.measureText(s).width,limit:max});}
 function line(y){x.strokeStyle=accent+'45';x.beginPath();x.moveTo(m,y);x.lineTo(w-m,y);x.stroke();}
 function box(px,py,pw,ph){const g=x.createLinearGradient(px,py,px+pw,py+ph);g.addColorStop(0,'#20393d');g.addColorStop(1,'#172a32');x.fillStyle=g;x.strokeStyle=accent+'48';x.lineWidth=1;x.beginPath();x.roundRect(px,py,pw,ph,7);x.fill();x.stroke();}
 const bg=x.createLinearGradient(0,0,w,h);bg.addColorStop(0,'#12212e');bg.addColorStop(.5,'#183335');bg.addColorStop(1,'#0c1e25');x.fillStyle=bg;x.fillRect(0,0,w,h);
 text('WUWA ECHO TOOL',m,46,16,metal);text(t('characterAutomatic'),m,76,16,muted);
 Visuals.drawFrame(x,title,24,98,w-48,516);
 // Portrait and name share a dedicated identity panel.
 x.save();x.beginPath();x.rect(45,112,400,486);x.clip();
 const src=portrait||'image/convene/character-fallback.svg';let loaded=false;
 if(/^(?:image\/characters\/[\w-]+\.(?:webp|png|jpe?g|avif)|image\/convene\/character-fallback\.svg)$/.test(src)){const image=new (doc.defaultView?.Image||globalThis.Image)();image.src=src;let timer;try{await Promise.race([image.decode(),new Promise((_,reject)=>timer=setTimeout(()=>reject(Error()),4000))]);const scale=Math.min(380/image.naturalWidth,410/image.naturalHeight),iw=image.naturalWidth*scale,ih=image.naturalHeight*scale;x.drawImage(image,62+(360-iw)/2,574-ih,iw,ih);loaded=true;}catch(_){}finally{clearTimeout(timer)}}
 if(!loaded)Visuals.drawBadge(x,'observing',240,330,190,'character');x.restore();
 const nameBg=x.createLinearGradient(0,482,0,598);nameBg.addColorStop(0,'#10232b00');nameBg.addColorStop(.6,'#10232be0');nameBg.addColorStop(1,'#10232b');x.fillStyle=nameBg;x.fillRect(48,482,392,116);
 text(name||character.name,68,558,49,ink,350,650);text('RESONATOR · 5★',70,587,13,metal,350);
 const cx=440+(w-480)/2;
 Visuals.drawBadge(x,title,cx,271,278,'character');
 const titleText=t('bond.'+title);x.font='600 42px "Segoe UI","Microsoft JhengHei",sans-serif';const titleWidth=Math.min(w-500,x.measureText(titleText).width);text(titleText,cx-titleWidth/2,455,42,accent,w-500,600);
 const score=character.luck.score==null?'—':character.luck.score.toFixed(1),label=score+' / 100';x.font='500 43px "Segoe UI","Microsoft JhengHei",sans-serif';text(label,cx-x.measureText(label).width/2,518,43,ink,w-500);
 text(t('characterSample',{n:character.luck.samples}),470,559,17,muted,w-520);
 text(t('bond.'+title+'.desc'),470,589,16,muted,w-520);
 const metrics=[['acquired',character.total],['avg',number(character.average)],['fast',number(character.min)],['slow',number(character.max)]];
 if(detailed)metrics.push(['sumIntervals',character.knownSpend]);
 metrics.forEach(([key,value],i)=>{const xx=m+i*inner/metrics.length;text(t(key),xx,660,16,muted,inner/metrics.length-18);text(value,xx,706,34,ink,inner/metrics.length-18,600)});
 line(733);text(t('allAcquisitions'),m,777,25,metal,inner-240,600);text(t('allShown',{n:entries.length}),w-286,777,16,muted,232);
 if(detailed)text(t('sumIntervalsNote'),m,825,15,muted);
 entries.forEach((r,i)=>{const xx=m+(i%cols)*(cardW+gap),yy=gridY+Math.floor(i/cols)*(cardH+gap);box(xx,yy,cardW,cardH);
  // A medal-like index connects the chronological acquisition to the hero seal.
  x.strokeStyle=accent+'90';x.beginPath();x.moveTo(xx+17,yy+16);x.lineTo(xx+47,yy+16);x.lineTo(xx+53,yy+27);x.lineTo(xx+47,yy+38);x.lineTo(xx+17,yy+38);x.stroke();
  text(String(r.ordinal).padStart(2,'0'),xx+22,yy+32,14,metal,30,600);
  text(t('acquisitionOrdinal',{n:r.ordinal}),xx+66,yy+32,16,muted,cardW-88);
  const value=r.interval!=null?String(r.interval):r.lowerBound!=null?'≥ '+r.lowerBound:'—';
  text(value,xx+20,yy+83,42,r.interval!=null?accent:muted,cardW*.45,600);
  text(t(r.anomaly?'intervalAnomaly':r.interval!=null?'exactShort':r.lowerBound!=null?'lowerBoundShort':'unknownInterval'),xx+cardW*.49,yy+81,14,muted,cardW*.51-20);
  if(detailed){text(r.time,xx+20,yy+121,18,ink,cardW-40);const p=stats.pools.find(p=>p.pool===r.pool);text(p?.displayName||t((p?.rule.key||'unknown')+'Pool'),xx+20,yy+151,16,muted,cardW-40);text(t(r.upResult==='unknown'?'unknown':r.upResult),xx+20,yy+175,14,muted,cardW-40);}
 });
 const coverage=Report.coverage(stats),unknown=entries.filter(r=>r.interval==null).length;line(end+25);
 text(t('reportCoverage',{n:unknown,gaps:coverage.gaps}),m,end+59,16,muted);
 if(detailed)text(t('optionalTargetSeparate'),m,end+95,16,muted);
 text(fixture?t('sample'):t('archiveScope'),m,h-30,14,muted,inner-230);
 if(showUID&&account)text('UID '+account.uid,w-290,h-30,14,muted,236);
 return {canvas:c,dataURL:c.toDataURL('image/png'),pages:1,page:0,layout,acquisitionCount:entries.length,acquisitionIDs:entries.map(r=>r.id),coverage,highlights:[],rating:{title,score:character.luck.score},badgeSize:278};
}
return {render};
});
