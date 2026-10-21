(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./convene-visuals.js'));else root.ConveneShare=factory(root.ConveneVisuals);})(typeof globalThis!=='undefined'?globalThis:this,function(Visuals){
'use strict';
const COLORS=Visuals.COLORS;
async function render({stats,character=null,name='',portrait=null,t,account=null,detailed=false,showUID=false,fixture=false,page=0,characterRating=null,document:doc=globalThis.document}){
 const perPage=12,pages=character&&detailed?Math.max(1,Math.ceil(character.five.length/perPage)):1,currentPage=Math.max(0,Math.min(pages-1,page)),history=character?(detailed?character.five.slice(currentPage*perPage,(currentPage+1)*perPage):character.five.slice(-3)):[],historyY=690,historyH=92+history.length*54,historyEnd=historyY+historyH,w=1200,h=character?(detailed?historyEnd+500:historyEnd+155):(detailed?1480+stats.pools.length*52:1080),c=doc.createElement('canvas');
 c.width=w;c.height=h;const x=c.getContext('2d');if(!x)throw Error('IMAGE_FAILED');const data=character&&characterRating?{...character,luck:{...character.luck,title:characterRating.tier,score:characterRating.score}}:character||stats,accent=COLORS[data.luck.title]||COLORS.observing,gold='#e5c880',ink='#ecf0df',muted='#a3b8a2',layout=[];
 function line(x1,y1,x2,y2,color='#344d36'){x.strokeStyle=color;x.lineWidth=1;x.beginPath();x.moveTo(x1,y1);x.lineTo(x2,y2);x.stroke();}
 function panel(px,py,pw,ph,highlight=false){x.fillStyle=highlight?'#203224':'#172a29';x.strokeStyle=highlight?'#847542':'#38533c';x.lineWidth=1;x.beginPath();x.roundRect(px,py,pw,ph,15);x.fill();x.stroke();}
 function text(value,px,py,size=24,color=ink,max=1080,weight=400){let valueText=String(value),font=size;x.fillStyle=color;const set=()=>x.font=weight+' '+font+'px "Segoe UI","Microsoft JhengHei",sans-serif';set();while(x.measureText(valueText).width>max&&font>13){font--;set();}if(x.measureText(valueText).width>max){while(valueText&&x.measureText(valueText+'…').width>max)valueText=valueText.slice(0,-1);valueText+='…';}layout.push({text:valueText,x:px,y:py,font,width:x.measureText(valueText).width,limit:max});x.fillText(valueText,px,py);}
 function metric(label,value,px,py,pw=330,ph=124){panel(px,py,pw,ph);text(label,px+23,py+34,19,muted,pw-46);text(value,px+23,py+ph-25,43,ink,pw-46,600);line(px+23,py+ph-1,px+60,py+ph-1,gold+'80');}
 const bg=x.createLinearGradient(0,0,w,h);bg.addColorStop(0,'#101d20');bg.addColorStop(.6,'#102224');bg.addColorStop(1,'#0b1b20');x.fillStyle=bg;x.fillRect(0,0,w,h);const glow=x.createRadialGradient(980,250,20,980,250,610);glow.addColorStop(0,accent+'1a');glow.addColorStop(1,accent+'00');x.fillStyle=glow;x.fillRect(0,0,w,850);
 x.save();x.strokeStyle=accent+'16';for(let r=180;r<620;r+=68){x.beginPath();x.arc(1010,270,r,-Math.PI*.9,Math.PI*.85);x.stroke();}x.globalAlpha=.5;for(let i=0;i<9;i++){x.beginPath();for(let xx=0;xx<=1200;xx+=8){const yy=460+Math.sin(xx/140+i*.7)*(28+i*3)+i*7;xx?x.lineTo(xx,yy):x.moveTo(xx,yy);}x.stroke();}x.restore();
 line(56,40,1144,40,gold+'55');x.fillStyle=gold;x.fillRect(56,64,2,26);x.fillRect(64,56,2,42);x.fillRect(72,64,2,26);text('WUWA ECHO TOOL',94,77,19,'#dce5ce',800,600);text('CONVENE / RESONANCE REPORT',94,102,12,'#7f9c82');text('✦ ✦ ✦ ✦ ✦',982,82,20,gold,160);text(character?t('character'):t('fortune'),56,165,20,accent);
 if(character){
  if(portrait&&/^image\/characters\/[\w-]+\.(?:webp|png|jpe?g|avif)$/.test(portrait)){const img=new Image();img.src=portrait;try{await Promise.race([img.decode(),new Promise((_,reject)=>setTimeout(()=>reject(Error()),8000))]);const scale=Math.min(360/img.naturalWidth,480/img.naturalHeight),iw=img.naturalWidth*scale,ih=img.naturalHeight*scale;x.drawImage(img,46+(360-iw)/2,154+480-ih,iw,ih);}catch(_){Visuals.drawBadge(x,'observing',220,430,160);}}else Visuals.drawBadge(x,'observing',220,430,160);
  text(name||character.name,440,245,56,ink,595,600);Visuals.drawBadge(x,data.luck.title,1090,198,100,'character');text(t(characterRating?'bond.'+data.luck.title:data.luck.title),440,305,30,accent,700,500);text(t(characterRating?'rNotLifetime':data.luck.title+'.desc'),440,345,19,muted,700);
  metric(t('acquired'),character.total,440,390,330,108);metric(t('avg'),number(character.average),814,390,330,108);metric(t('fast'),number(character.min),440,524,330,108);metric(t('slow'),number(character.max),814,524,330,108);
  panel(56,historyY,1088,historyH);text(t('history'),80,historyY+40,23,gold,450);text(t('recentOnly',{shown:history.length,total:character.five.length}),580,historyY+40,18,muted,540);
  history.forEach((r,i)=>{const yy=historyY+84+i*54;const index=character.five.indexOf(r)+1;text(String(index).padStart(2,'0'),80,yy,18,'#7f9f80',45);text(r.time,145,yy,22,'#c7d6be',580);text(r.interval==null?r.observed!=null?'≥ '+r.observed:'—':String(r.interval),950,yy,27,accent,170,600);if(i<history.length-1)line(145,yy+15,1115,yy+15,'#2a432f');});
  if(detailed){text(t('characterNote'),56,historyEnd+55,20,muted);text(t('bannerSpend'),56,historyEnd+96,20,muted);drawDistribution(stats.intervals.filter(r=>r.item===character.item),historyEnd+145,180);text(t('samples')+'  '+data.luck.samples,56,historyEnd+365,20,'#b8cfae');if(pages>1)text((currentPage+1)+' / '+pages,1010,historyEnd+365,20,gold,130);}
 }else{
  Visuals.drawBadge(x,data.luck.title,1008,302,238);text(t(data.luck.title),56,255,62,accent,805,600);text(data.luck.score==null?'—':data.luck.score.toFixed(1),56,365,100,ink,370,600);text('/ 100',365,362,25,muted,200);text(t(data.luck.title+'.desc'),56,420,24,'#bed1b4',800);text(t('confidence')+' · '+t(data.luck.confidence)+'   /   '+t('samples')+' '+data.luck.samples,56,463,19,muted,1060);
  metric(t('total'),stats.total.toLocaleString(),56,510);metric(t('five'),stats.five.length,435,510);metric(t('avg'),number(stats.average),814,510);
  panel(56,667,1088,99,true);const achievement=stats.achievements[0];text('✦',80,727,37,gold,50);text(achievement?t(achievement==='pity'?'pityAch':achievement):t('observing'),137,710,27,gold,970,500);text(achievement?t('unlocked'):t('observing.desc'),137,742,17,muted,970);
  panel(56,795,1088,136);const limited=stats.limited,chances=limited.win+limited.loss;text(t('limited'),80,832,21,muted,760);text(chances?(100*limited.win/chances).toFixed(1)+'%':'—',875,857,36,gold,240,600);text(t('win')+' '+limited.win+'  /  '+t('loss')+' '+limited.loss+'  /  '+t('unknown')+' '+limited.unknown,80,886,20,'#bdd0b4',770);
  if(detailed){text(t('pools'),56,995,26,gold);stats.pools.forEach((p,i)=>{const yy=1040+i*52;text(p.displayName||p.rule.key,56,yy,23,'#c4d7b9',750);text(p.total+'  /  ★ '+p.five.length,882,yy,23,accent,260);line(56,yy+16,1144,yy+16,'#2b4330');});const end=1020+stats.pools.length*52;drawDistribution(stats.intervals,end+65,180);text(t('fast')+'  '+number(stats.min)+'     '+t('slow')+'  '+number(stats.max),56,end+310,21,'#b7c9ad');}
 }
 function drawDistribution(records,py,ph){text(t('distribution'),56,py,22,gold);const bins=Array.from({length:8},(_,i)=>records.filter(r=>r.interval>i*10&&r.interval<=(i+1)*10).length),max=Math.max(1,...bins);bins.forEach((value,i)=>{const xx=64+i*136,bar=value/max*(ph-70),gradient=x.createLinearGradient(xx,py+ph-34-bar,xx,py+ph-34);gradient.addColorStop(0,'#9ed5c9');gradient.addColorStop(1,'#477652');x.fillStyle=gradient;x.fillRect(xx,py+ph-34-bar,95,bar);text(value,xx+34,py+ph-46-bar,16,'#b3c9ab',95);text((i*10+1)+'–'+((i+1)*10),xx,py+ph-8,16,'#829f7f',105);});}
 line(56,h-120,1144,h-120,gold+'55');text(fixture?t('sample'):t('coverage'),56,h-80,17,'#91aa87');text(t('selfMade'),56,h-42,14,'#6f9274');if(showUID&&account)text('UID '+account.uid,870,h-42,15,'#a9bea0',270);
 return {canvas:c,dataURL:c.toDataURL('image/png'),pages,page:currentPage,layout};
}
// Discord target report: receives the exact derived snapshot used by the page.
async function renderTarget({rating,name='',portrait=null,t,account=null,detailed=false,showUID=false,fixture=false,page=0,showExcess=false,showBadge=true,document:doc=globalThis.document}){
 if(!rating)throw Error('IMAGE_FAILED');
 const all=showExcess?rating.acquisitions:rating.selected,perPage=12,pages=detailed?Math.max(1,Math.ceil(all.length/perPage)):1,currentPage=Math.max(0,Math.min(pages-1,page)),rows=detailed?all.slice(currentPage*perPage,(currentPage+1)*perPage):[],c=doc.createElement('canvas'),w=1200,h=detailed?1600:880;
 c.width=w;c.height=h;const x=c.getContext('2d');if(!x)throw Error('IMAGE_FAILED');const accent=COLORS[rating.tier],gold='#e8c982',ink='#e8efdf',muted='#abc0b8',layout=[];
 function text(value,px,py,size=22,color=ink,max=1088){let str=String(value),font=size;x.fillStyle=color;const set=()=>x.font='500 '+font+'px "Segoe UI","Microsoft JhengHei",sans-serif';set();while(x.measureText(str).width>max&&font>14){font--;set();}while(x.measureText(str).width>max&&str.length>1){str=str.slice(0,-2)+'…';}x.fillText(str,px,py);layout.push({text:str,x:px,y:py,font,width:x.measureText(str).width,limit:max});}
 function panel(px,py,pw,ph){x.fillStyle='#172b2b';x.strokeStyle='#43645e';x.lineWidth=1;x.beginPath();x.roundRect(px,py,pw,ph,14);x.fill();x.stroke();}
 const gradient=x.createLinearGradient(0,0,w,h);gradient.addColorStop(0,'#102126');gradient.addColorStop(.5,'#142d2a');gradient.addColorStop(1,'#0c191f');x.fillStyle=gradient;x.fillRect(0,0,w,h);x.strokeStyle=accent+'28';for(let r=220;r<740;r+=75){x.beginPath();x.ellipse(1060,270,r,r*.53,-.5,0,Math.PI*2);x.stroke();}
 text('WUWA ECHO TOOL / RESONATOR CONTRACT',56,62,17,gold);text('✦  RESONANCE ARCHIVE  ✦',775,62,14,muted,370);x.fillStyle=gold;x.fillRect(56,86,1088,1);
 let loaded=false;
 if(portrait&&/^image\/characters\/[\w-]+\.(?:webp|png|jpe?g|avif)$/.test(portrait)){const img=new Image();img.src=portrait;try{await Promise.race([img.decode(),new Promise((_,reject)=>setTimeout(()=>reject(Error()),2000))]);const scale=Math.min(360/img.naturalWidth,500/img.naturalHeight),iw=img.naturalWidth*scale,ih=img.naturalHeight*scale;x.drawImage(img,36+(360-iw)/2,110+500-ih,iw,ih);loaded=true;}catch(_){}}
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
 text(fixture?t('sample'):t('rNotLifetime'),56,h-64,16,muted,1050);text(t('selfMade'),56,h-30,14,muted,790);if(showUID&&account)text('UID '+account.uid,860,h-30,16,muted,280);
 return {canvas:c,dataURL:c.toDataURL('image/png'),pages,page:currentPage,layout};
}
function number(n){return n==null?'—':Number(n).toFixed(1).replace(/\.0$/,'');}
return {render,renderTarget,COLORS,number};});
