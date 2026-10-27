(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./convene-core.js'));else root.ConveneVisuals=factory(root.ConveneCore);})(typeof globalThis!=='undefined'?globalThis:this,function(Core){
'use strict';
const COLORS={breeze:'#b1c5d9',radiant:'#b4df96',fate:'#f0ce86',star:'#c9b1ee',lucky:'#89ddca',steady:'#adc8cf',headwind:'#d5ad87',abyss:'#c18ba9',observing:'#8eb6ac'};
function geometry(title,family='overall'){const index=(family==='character'?Core.CHARACTER_TIERS.slice().reverse():Core.RATING_RULES.tiers.slice().reverse()).map(t=>t.title).indexOf(title),level=index+1,sides=index<0?4:4+index*2;return {level,sides,color:COLORS[title]||COLORS.observing,observing:index<0};}
function points(sides,radius,rotation=-Math.PI/2){return Array.from({length:sides},(_,i)=>{const a=rotation+i*Math.PI*2/sides;return [50+radius*Math.cos(a),50+radius*Math.sin(a)];});}
// Original primitives shared by transparent SVG and Canvas; no remote art.
function baseArtwork(title,family='overall'){
 const g=geometry(title,family),level=Math.max(0,g.level),out=[];
 const add=(d,fill=false,opacity=1,width=1.25)=>out.push({d,fill,opacity,width});
 if(g.observing)return [{d:'M50 8L85 28L85 70L50 92L15 70L15 28Z',fill:true,opacity:.3,width:1.8},{d:'M50 17L77 33L77 65L50 82L23 65L23 33Z',fill:false,opacity:.8,width:1},{d:'M50 28L57 43L72 50L57 57L50 72L43 57L28 50L43 43Z',fill:true,opacity:.7,width:1.5},{d:'M22 45Q50 15 78 45M22 55Q50 85 78 55',fill:false,opacity:.7,width:1},{d:'M50 40L56 50L50 60L44 50Z',fill:true,opacity:1,width:1}];
 if(family==='overall'){
  // Every rank retains the same astrolabe, star and orbit; higher ranks only add layers.
  add('M50 10L83 29V68L50 89L17 68V29Z',true,.14,1.8);
  add('M50 15L79 32V65L50 84L21 65V32Z',false,.55,.8);
  add('M50 27L56 44L73 50L56 56L50 73L44 56L27 50L44 44Z',true,.42,1.8);
  add('M50 39L56 50L50 61L44 50Z',true,1,1.2);
  add('M25 36C14 42 17 60 36 66C55 72 82 59 80 45C79 40 75 37 70 35',false,.65,1);
  if(level>=2){add('M50 5L88 27V71L50 95L12 71V27Z',false,.8,1);add('M50 29V36M50 64V71M29 50H36M64 50H71',false,.8,1.5);}
  if(level>=3){add('M27 30C9 44 23 71 50 72C75 73 91 49 75 32',false,.7,1.2);add('M17 43L11 50L17 57M83 43L89 50L83 57',true,.7,1.2);add('M50 78L54 83L50 88L46 83Z',true,.8,1);}
  if(level>=4){add('M16 35L5 27L8 48L17 60M84 35L95 27L92 48L83 60',true,.3,1.5);add('M15 65L24 69L21 76L31 77M85 65L76 69L79 76L69 77',false,.9,1.4);add('M41 17L50 22L59 17',false,.9,1.5);}
  if(level>=5){add('M28 23L23 9L39 16L50 5L61 16L77 9L72 23',true,.24,1.8);add('M5 41C0 58 9 74 25 80M95 41C100 58 91 74 75 80',false,.8,1);add('M22 69L20 61L29 67M78 69L80 61L71 67',true,.55,1);}
  if(level>=6){add('M50 0L57 9L50 18L43 9Z',true,.95,1.8);add('M10 53L3 59L8 64L15 61M90 53L97 59L92 64L85 61',true,.5,1.5);add('M13 73L19 84L30 85L35 91M87 73L81 84L70 85L65 91',false,.95,1.8);add('M38 88L50 98L62 88',false,.8,1.2);}
  if(level>=7){add('M8 20L18 10M82 10L92 20M8 80L18 90M82 90L92 80',false,.9,1.8);add('M35 50A15 15 0 1 0 65 50',false,.6,.8);}
  if(level>=8){add('M3 35L8 30L13 35L8 40ZM87 35L92 30L97 35L92 40Z',true,.9,1.5);add('M26 6Q50 22 74 6M26 94Q50 78 74 94',false,.8,1.2);}
 }else{
  // Paired contract stones inside a constant seal; never recolor the astrolabe silhouette.
  add('M50 11L80 25L83 54L72 73L50 91L28 73L17 54L20 25Z',true,.15,1.8);
  add('M50 17L75 29L77 53L67 69L50 83L33 69L23 53L25 29Z',false,.6,.85);
  add('M40 31L53 49L40 67L27 49Z',true,.4,1.6);add('M60 31L73 49L60 67L47 49Z',true,.4,1.6);
  add('M50 42L56 50L50 58L44 50Z',true,.95,1.2);
  if(level>=2){add('M50 5L85 22L89 56L76 77L50 97L24 77L11 56L15 22Z',false,.75,1);add('M40 39L47 49L40 59M60 39L53 49L60 59',false,.85,1.3);}
  if(level>=3){add('M25 33L15 38L20 59M75 33L85 38L80 59',false,.8,1.5);add('M33 73L50 84L67 73',false,.85,1.5);add('M50 77L54 83L50 89L46 83Z',true,.8,1);}
  if(level>=4){add('M19 30L6 23L9 43L20 57M81 30L94 23L91 43L80 57',true,.3,1.5);add('M21 63L28 65L25 75L36 78M79 63L72 65L75 75L64 78',false,.8,1.4);add('M42 19L50 25L58 19',false,.9,1.5);}
  if(level>=5){add('M30 22L30 8L42 16L50 6L58 16L70 8L70 22',true,.3,1.7);add('M8 48L4 62L16 75L23 72M92 48L96 62L84 75L77 72',false,.8,1.1);add('M31 82L25 86L39 90M69 82L75 86L61 90',true,.5,1);}
  if(level>=6){add('M50 0L57 8L50 16L43 8Z',true,1,1.7);add('M17 67Q8 81 28 86L23 92L39 87M83 67Q92 81 72 86L77 92L61 87',true,.3,1.5);add('M38 30L34 25L28 32M62 30L66 25L72 32',false,.95,1.5);add('M4 35L10 32L14 40M96 35L90 32L86 40',true,.5,1.5);}
 }

 return out;
}
function artwork(title,family='overall'){
 const ranks=(family==='character'?Core.CHARACTER_TIERS:Core.RATING_RULES.tiers).slice().reverse().map(t=>t.title),end=ranks.indexOf(title);if(end<0)return baseArtwork(title,family);const out=[];
 for(let level=1;level<=end+1;level++){
  const base=baseArtwork(ranks[level-1],family),prior=level===1?[]:baseArtwork(ranks[level-2],family);out.push(...base.slice(prior.length));
  const add=(d,opacity=.7,width=.7,fill=false)=>out.push({d,opacity,width,fill});
  if(level===2)for(let i=0;i<8;i++){const a=i*Math.PI/4,r=family==='overall'?34:38;add('M'+(50+Math.cos(a)*r)+' '+(50+Math.sin(a)*r)+'L'+(50+Math.cos(a)*(r+3))+' '+(50+Math.sin(a)*(r+3)),.8,.65);}
  if(level===3)add('M50 20L80 50L50 80L20 50Z',.35,.65);
  if(level===4){add('M50 12A38 38 0 1 1 49.99 12',.55,.7);add('M50 29L58 42L71 50L58 58L50 71L42 58L29 50L42 42Z',.75,.75);}
  if(level===5)for(let i=0;i<8;i++){const a=i*Math.PI/4,r=43,x=50+Math.cos(a)*r,y=50+Math.sin(a)*r;add('M'+x+' '+(y-1.5)+'L'+(x+1.5)+' '+y+'L'+x+' '+(y+1.5)+'L'+(x-1.5)+' '+y+'Z',.85,.7,true);}
  if(level===6){add('M50 9A41 41 0 1 1 49.99 9',.7,.8);add('M50 16L79.4 67H20.6ZM50 84L20.6 33H79.4Z',.45,.7);add('M33 47L39 45L36 51M67 47L61 45L64 51',.9,.9);}
 }
 return out;
}

function mix(color,white){const rgb=color.slice(1).match(/../g).map(h=>parseInt(h,16));return '#'+rgb.map(v=>Math.round(v+(white?255-v:-v)*.48).toString(16).padStart(2,'0')).join('');}
function badge(title,family='overall',label=title){const g=geometry(title,family),id='cv-metal-'+family+'-'+title,light=mix(g.color,true),dark=mix(g.color,false);return '<svg xmlns="http://www.w3.org/2000/svg" class="cv-badge" data-family="'+family+'" viewBox="0 0 100 100" role="img" aria-label="'+String(label).replace(/[&<>"']/g,c=>'&#'+c.charCodeAt(0)+';')+'" style="color:'+g.color+'"><defs><linearGradient id="'+id+'" x1="0" y1="0" x2="1" y2="1"><stop stop-color="'+light+'"/><stop offset=".38" stop-color="'+g.color+'"/><stop offset=".55" stop-color="'+dark+'"/><stop offset=".75" stop-color="'+light+'"/><stop offset="1" stop-color="'+g.color+'"/></linearGradient></defs>'+artwork(title,family).map(p=>'<path d="'+p.d+'" fill="'+(p.fill?'url(#'+id+')':'none')+'" stroke="'+(p.width>=1.5?light:'currentColor')+'" stroke-width="'+p.width+'" opacity="'+p.opacity+'" stroke-linejoin="round"/>').join('')+'<polygon points="'+points(g.sides,3).map(p=>p.join(',')).join(' ')+'" fill="'+light+'"/></svg>';}
function drawBadge(ctx,title,cx,cy,size,family='overall'){const g=geometry(title,family);ctx.save();ctx.translate(cx-size/2,cy-size/2);ctx.scale(size/100,size/100);const gradient=ctx.createLinearGradient(0,0,100,100),light=mix(g.color,true);for(const [at,color]of [[0,light],[.38,g.color],[.55,mix(g.color,false)],[.75,light],[1,g.color]])gradient.addColorStop(at,color);ctx.fillStyle=gradient;ctx.lineJoin='round';for(const p of artwork(title,family)){ctx.strokeStyle=p.width>=1.5?light:g.color;ctx.globalAlpha=p.opacity;ctx.lineWidth=p.width;const path=new Path2D(p.d);if(p.fill)ctx.fill(path);ctx.stroke(path);}ctx.globalAlpha=1;ctx.fillStyle=light;ctx.beginPath();points(g.sides,3).forEach(([x,y],i)=>i?ctx.lineTo(x,y):ctx.moveTo(x,y));ctx.closePath();ctx.fill();ctx.restore();}
const achievementKeys=['pull1','pull100','pull500','pull1000','pull3000','gold1','gold10','gold30','gold100','one','ten','fiveEarly','pity','hard','streak','consecutive','comeback','characters5','characters10','weapons5','weapons10','seven','collab','weaponGold','fourCollect','months'];
const motifs=['M50 24L58 42L76 50L58 58L50 76L42 58L24 50L42 42Z','M36 25L62 44L38 75L44 53L32 51Z','M28 64L38 34L50 56L62 34L72 64Z','M30 31L50 20L70 31V59L50 79L30 59ZM40 39L50 31L60 39V56L50 66L40 56Z','M27 49L40 28L53 49L40 71ZM53 49L66 28L79 49L66 71Z','M32 24L62 55L55 62L24 32ZM50 66L66 50L73 57L57 73Z','M26 57Q50 19 74 57L64 49L50 70L36 49Z','M28 39L50 26L72 39L65 66L50 77L35 66Z'];
function achievementArtwork(key){const i=Math.max(0,achievementKeys.indexOf(key)),sides=6+i%3,color=['#a9c8d0','#8fdec8','#d8b7f4','#eccb83'][Math.min(3,Math.floor(i/7))],outer=points(sides,44).map(p=>p.join(' ')).join('L'),inner=points(sides,36).map(p=>p.join(' ')).join('L'),satellites=Array.from({length:1+i%5},(_,j)=>{const a=(j/(1+i%5)*Math.PI*2)+(i*.31),x=50+30*Math.cos(a),y=50+30*Math.sin(a);return 'M'+x+' '+(y-2.5)+'L'+(x+2.5)+' '+y+'L'+x+' '+(y+2.5)+'L'+(x-2.5)+' '+y+'Z';}).join('');return {color,paths:[{d:'M'+outer+'Z',fill:true,width:2,opacity:1},{d:'M'+inner+'Z',fill:false,width:.8,opacity:.8},{d:'M16 52C26 16 79 23 86 49C80 78 30 83 16 52Z',fill:false,width:1,opacity:.5},{d:motifs[i%motifs.length],fill:true,width:1.5,opacity:.95},{d:satellites,fill:true,width:.8,opacity:1}]};}
function achievementIcon(key){const a=achievementArtwork(key),id='cv-ach-'+key;return '<svg viewBox="0 0 100 100" aria-hidden="true" data-achievement="'+key+'"><defs><linearGradient id="'+id+'" x2="1" y2="1"><stop stop-color="'+mix(a.color,true)+'"/><stop offset=".4" stop-color="'+a.color+'"/><stop offset=".65" stop-color="'+mix(a.color,false)+'"/><stop offset="1" stop-color="'+mix(a.color,true)+'"/></linearGradient></defs>'+a.paths.map((p,i)=>'<path d="'+p.d+'" fill="'+(p.fill?(i===0?'#14262e':'url(#'+id+')'):'none')+'" stroke="'+(i===0?'url(#'+id+')':a.color)+'" stroke-width="'+p.width+'" opacity="'+p.opacity+'" stroke-linejoin="round"/>').join('')+'</svg>';}
function drawAchievement(ctx,key,x,y,size){const a=achievementArtwork(key);ctx.save();ctx.translate(x,y);ctx.scale(size/100,size/100);const g=ctx.createLinearGradient(0,0,100,100);for(const[stop,color]of [[0,mix(a.color,true)],[.4,a.color],[.65,mix(a.color,false)],[1,mix(a.color,true)]])g.addColorStop(stop,color);ctx.lineJoin='round';a.paths.forEach((p,i)=>{ctx.globalAlpha=p.opacity;ctx.lineWidth=p.width;ctx.fillStyle=i===0?'#14262e':g;ctx.strokeStyle=i===0?g:a.color;const path=new Path2D(p.d);if(p.fill)ctx.fill(path);ctx.stroke(path);});ctx.restore();}

/* The same engraving primitives drive page SVG and exported Canvas. */
function frameArtwork(title,w=1000,h=430){
 const level=Math.max(0,geometry(title).level),u=Math.min(w,h)/400,m=12*u,c=18*u+level*4*u,out=[];
 const add=(d,opacity=.55,width=1,fill=false)=>out.push({d,opacity,width,fill});
 add('M'+m+' '+(m+c)+'V'+m+'H'+(w-m)+'V'+(h-m)+'H'+m+'Z',.55,1.2);
 if(!level){add('M'+(w/2-12*u)+' '+m+'L'+w/2+' '+(m+9*u)+'L'+(w/2+12*u)+' '+m,.5);return out;}
 // Each higher rank retains the lower engraving and adds real geometry.
 for(const sx of [1,-1])for(const sy of [1,-1]){
  const X=x=>sx===1?x:w-x,Y=y=>sy===1?y:h-y;
  const path=pts=>pts.map(([x,y],i)=>(i?'L':'M')+X(x)+' '+Y(y)).join('');
  add(path([[m,m+c],[m,m],[m+c,m]]),.9,1.6);
  if(level>=2)add(path([[m+6*u,m+20*u],[m+6*u,m+6*u],[m+20*u,m+6*u]]),.6,.9);
  if(level>=3){add(path([[m+10*u,m+c],[m+10*u,m+25*u],[m+25*u,m+10*u],[m+c,m+10*u]]),.7);add(path([[m+17*u,m+30*u],[m+30*u,m+17*u],[m+24*u,m+24*u],[m+17*u,m+30*u]]),.5,1,true);}
  if(level>=4)add(path([[m-4*u,m+32*u],[m-4*u,m-4*u],[m+32*u,m-4*u],[m+25*u,m+3*u],[m+3*u,m+3*u],[m+3*u,m+25*u]]),.85,1.2);
  if(level>=5){add(path([[m+8*u,m+45*u],[m+8*u,m+36*u],[m+36*u,m+8*u],[m+45*u,m+8*u]]),.85);for(let j=0;j<4;j++)add(path([[m+19*u+j*5*u,m+11*u],[m+24*u+j*5*u,m+6*u]]),.55,.7);}
  if(level>=6){add(path([[m-7*u,m+50*u],[m-7*u,m-7*u],[m+50*u,m-7*u]]),.65,.8);add(path([[m+11*u,m+43*u],[m+43*u,m+11*u],[m+35*u,m+11*u],[m+11*u,m+35*u],[m+11*u,m+43*u]]),.28,1,true);}
 }
 if(level>=7){add('M'+(w*.2)+' '+(m+4*u)+'H'+(w*.8),.6,.8);add('M'+(w*.2)+' '+(h-m-4*u)+'H'+(w*.8),.6,.8);}
 if(level>=8)for(const x of [w*.2,w*.8])add('M'+(x-6*u)+' '+m+'L'+x+' '+(m+8*u)+'L'+(x+6*u)+' '+m+'L'+x+' '+(m-8*u)+'Z',.8,1,true);
 const center=w/2;
 add('M'+(center-9*u)+' '+m+'L'+center+' '+(m+9*u)+'L'+(center+9*u)+' '+m,.8,1.1);
 if(level>=3)for(const sign of [-1,1])add('M'+(center+sign*22*u)+' '+m+'H'+(center+sign*(40+level*12)*u),.65);
 if(level>=5){const b=h-m;add('M'+(center-56*u)+' '+b+'L'+(center-35*u)+' '+(b-7*u)+'H'+(center-13*u)+'L'+center+' '+(b-18*u)+'L'+(center+13*u)+' '+(b-7*u)+'H'+(center+35*u)+'L'+(center+56*u)+' '+b,.8,1.3);}
 if(level>=6){const inset=m+7*u;add('M'+inset+' '+inset+'H'+(w-inset)+'V'+(h-inset)+'H'+inset+'Z',.5,.7);add('M'+(center-44*u)+' '+m+'L'+(center-26*u)+' '+(m+8*u)+'L'+center+' '+(m+21*u)+'L'+(center+26*u)+' '+(m+8*u)+'L'+(center+44*u)+' '+m,.6);for(let j=0;j<7;j++){const xx=center+(j-3)*10*u;add('M'+xx+' '+(h-m-3*u)+'v'+(-4-(3-Math.abs(j-3))*2)*u,.65,.8);}}
 return out;
}
function frame(title,variant='desktop'){
 const mobile=variant==='mobile',w=mobile?400:1000,h=mobile?620:430,g=geometry(title);
 return '<svg class="cv-engraving cv-engraving-'+variant+'" viewBox="0 0 '+w+' '+h+'" preserveAspectRatio="none" aria-hidden="true" style="color:'+g.color+'">'+frameArtwork(title,w,h).map(p=>'<path d="'+p.d+'" fill="'+(p.fill?'currentColor':'none')+'" stroke="currentColor" stroke-width="'+p.width+'" opacity="'+p.opacity+'" vector-effect="non-scaling-stroke" stroke-linejoin="miter"/>').join('')+'</svg>';
}
function drawFrame(ctx,title,x,y,w,h){ctx.save();ctx.translate(x,y);const color=geometry(title).color,g=ctx.createLinearGradient(0,0,w,h);for(const [at,c]of [[0,mix(color,true)],[.25,color],[.5,mix(color,false)],[.8,mix(color,true)],[1,color]])g.addColorStop(at,c);ctx.strokeStyle=g;ctx.fillStyle=g;for(const p of frameArtwork(title,w,h)){ctx.globalAlpha=p.opacity;ctx.lineWidth=p.width;const d=new Path2D(p.d);if(p.fill)ctx.fill(d);ctx.stroke(d);}ctx.restore();}

return {frameArtwork,frame,drawFrame,COLORS,geometry,artwork,badge,drawBadge,achievementIcon,drawAchievement,achievementArtwork,achievementKeys};});
