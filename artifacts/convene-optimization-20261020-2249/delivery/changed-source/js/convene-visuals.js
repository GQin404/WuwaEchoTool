(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./convene-core.js'));else root.ConveneVisuals=factory(root.ConveneCore);})(typeof globalThis!=='undefined'?globalThis:this,function(Core){
'use strict';
const COLORS={fate:'#f0ce86',star:'#c9b1ee',lucky:'#89ddca',steady:'#adc8cf',headwind:'#d5ad87',abyss:'#c18ba9',observing:'#8eb6ac'};
function geometry(title){const index=['abyss','headwind','steady','lucky','star','fate'].indexOf(title),level=index+1,sides=index<0?4:4+index*2;return {level,sides,color:COLORS[title]||COLORS.observing,observing:index<0};}
function points(sides,radius,rotation=-Math.PI/2){return Array.from({length:sides},(_,i)=>{const a=rotation+i*Math.PI*2/sides;return [50+radius*Math.cos(a),50+radius*Math.sin(a)];});}
// Original primitives shared by transparent SVG and Canvas; no remote art.
function artwork(title,family='overall'){
 const g=geometry(title),level=Math.max(0,g.level),out=[];
 const add=(d,fill=false,opacity=1,width=1.3)=>out.push({d,fill,opacity,width});
 const polygon=(n,r)=>{const p=points(n,r);return p.map(([x,y],i)=>(i?'L':'M')+x+' '+y).join(' ')+'Z';};
 if(family==='character'){
  const shells=['M50 8 L82 35 L76 65 L50 93 L24 65 L18 35 Z','M50 7 L82 22 L87 57 L70 80 L50 94 L30 80 L13 57 L18 22 Z','M50 5 L78 17 L78 29 L90 38 L84 65 L68 82 L50 95 L32 82 L16 65 L10 38 L22 29 L22 17 Z','M50 5 L86 20 L92 52 L78 73 L78 83 L50 95 L22 83 L22 73 L8 52 L14 20 Z','M50 5 L74 14 L86 9 L84 31 L92 54 Q84 82 50 95 Q16 82 8 54 L16 31 L14 9 L26 14 Z','M50 5 L67 17 L82 12 L84 31 L96 42 L86 59 L88 74 L70 79 L50 95 L30 79 L12 74 L14 59 L4 42 L16 31 L18 12 L33 17 Z'];const shell=shells[Math.max(0,level-1)];add(shell,true,.1);add(shell);
  add('M50 14 L76 28 L80 56 Q74 74 50 85 Q26 74 20 56 L24 28 Z',false,.4);
  add('M38 29 L51 48 L38 68 L25 48 Z',true,.28);add('M62 29 L75 48 L62 68 L49 48 Z',true,.28);
  add('M38 29 L51 48 L38 68 L25 48 Z M62 29 L75 48 L62 68 L49 48 Z',false,1,2);
  if(level>=3)add('M38 42 Q50 33 62 42 M38 54 Q50 64 62 54',false,1,2);else add(level===1?'M50 34 L50 62':'M44 37 L56 59 M56 37 L44 59',false,1,1.8);if(level>=4)add('M50 40 L55 48 L50 56 L45 48 Z',true,.75);if(level===6)add('M12 41 L6 36 L7 57 M88 41 L94 36 L93 57',false,1,2);
  for(let i=0;i<level;i++){const y=71+i*2.7;add('M'+(31+i*2)+' '+y+'L50 '+(y+5)+'L'+(69-i*2)+' '+y,false,.8);}
  if(level>=5)add('M32 19 L38 9 L50 18 L62 9 L68 19',false,1,1.6);
  if(level===6)add('M50 1 L55 6 L50 11 L45 6 Z',true);
 }else{
  add(polygon(g.sides,43),true,.06);add(polygon(g.sides,43));add('M88.105 28 A44 18 -30 1 0 11.895 72 A44 18 -30 1 0 88.105 28',false,.5);
  const core=level===1?'M50 23 L65 50 L50 77 L35 50 Z':level===2?'M50 25 L57 44 L73 50 L57 56 L50 75 L43 56 L27 50 L43 44 Z':level===3?'M50 20 L58 40 L80 50 L58 58 L50 80 L41 58 L20 50 L41 40 Z':level===4?'M50 18 L55 40 L70 30 L60 46 L82 50 L60 55 L70 70 L55 60 L50 82 L45 60 L30 70 L40 55 L18 50 L40 46 L30 30 L45 40 Z':'M50 18 L58 40 L80 50 L58 58 L50 82 L41 58 L20 50 L41 40 Z';add(core,true,.22);add(core,false,1,2);if(level===6)add('M50 12 L65 25 M50 12 L35 25 M35 75 L50 87 L65 75',false,.7,1.2);
  add('M50 36 L60 50 L50 64 L40 50 Z',false,1,1.4);
  for(let i=0;i<level;i++){const y=62+i*4;add('M'+(12+i*2)+' '+(y-7)+'L'+(24+i)+' '+y+' M'+(88-i*2)+' '+(y-7)+'L'+(76-i)+' '+y,false,.8);}
  if(level>=5)add('M32 18 L38 9 L50 16 L62 9 L68 18',false,1,1.8);
  if(level===6)add('M46 5 L50 2 L54 5 L50 9 Z',true);
 }
 // Tier-specific metallic layers, ascending orbit/wing and gem detail in both SVG and Canvas.
 if(!g.observing){
  add(polygon(family==='character'?6:g.sides,39),true,.12,1.6);
  for(let layer=0;layer<level;layer++){
   const r=36-layer*2.4,op=.18+layer*.07;
   add(polygon(family==='character'?6:g.sides,r),false,op,.7);
   const y=60-layer*5,dx=17+layer*2.8;
   add('M'+(50-dx)+' '+y+'Q'+(28-layer*3)+' '+(y-5)+' '+(19-layer*2.2)+' '+(y-14)+'Q'+(29-layer*2)+' '+(y-13)+' '+(50-dx)+' '+y+'Z',true,.18+level*.07,1);
   add('M'+(50+dx)+' '+y+'Q'+(72+layer*3)+' '+(y-5)+' '+(81+layer*2.2)+' '+(y-14)+'Q'+(71+layer*2)+' '+(y-13)+' '+(50+dx)+' '+y+'Z',true,.18+level*.07,1);
  }
  add(family==='character'?'M38 35 L44 48 L38 61 L32 48 Z M62 35 L68 48 L62 61 L56 48 Z':'M50 25 L59 48 L50 71 L41 48 Z',true,.55,1.8);
  if(level>=3){for(let k=0;k<level-2;k++){const px=34+k*8;add('M'+px+' 82L'+(px+2)+' 86L'+px+' 90L'+(px-2)+' 86Z',true,.9,1);}}
  if(level>=4)add('M15 30 L10 19 L23 24 M85 30 L90 19 L77 24',false,.85,2.1);
  if(level>=5)add('M27 19 L29 7 L42 15 L50 4 L58 15 L71 7 L73 19',true,.25,1.4);
  if(level===6){add('M50 0 L57 8 L50 16 L43 8Z',true,1,1.5);add('M7 32L2 45L10 61 M93 32L98 45L90 61',false,.9,2.5);}
 }
 // Crisp tier accents remain visible at 32px: one central gem, then double orbit,
 // wings, laurel and a three-point crown; the two families retain different silhouettes.
 if(!g.observing){
  add(family==='character'?'M50 34L60 49L50 64L40 49Z':'M50 29L60 49L50 69L40 49Z',true,.9,1.5);
  for(let i=0;i<level;i++){const x=32+i*6;add('M'+x+' 88L'+(x+1.5)+' 90L'+x+' 92L'+(x-1.5)+' 90Z',true,.8,.7);}
  if(level>=3)add('M20 25Q9 49 22 75M80 25Q91 49 78 75',false,.85,2);
  if(level>=4){add('M21 43L2 28L7 53L26 65L17 49Z',true,.35,1.4);add('M79 43L98 28L93 53L74 65L83 49Z',true,.35,1.4);}
  if(level>=5){add('M22 26L19 10L35 18L50 2L65 18L81 10L78 26',true,.5,1.6);add('M27 24L50 16L73 24',false,1,1);}
  if(level===6){add('M50 0L57 9L50 18L43 9Z',true,1,1.8);add('M17 67Q13 81 30 87M83 67Q87 81 70 87',false,1,2.5);add('M18 66L7 66L14 77L30 87M82 66L93 66L86 77L70 87',true,.45,1.6);}
 }
 if(g.observing)return [{d:polygon(4,38),fill:false,opacity:.5,width:1},{d:'M35 50 L45 50 M55 50 L65 50',fill:false,opacity:1,width:2}];
 return out;
}
function mix(color,white){const rgb=color.slice(1).match(/../g).map(h=>parseInt(h,16));return '#'+rgb.map(v=>Math.round(v+(white?255-v:-v)*.48).toString(16).padStart(2,'0')).join('');}
function badge(title,family='overall'){const g=geometry(title),id='cv-metal-'+family+'-'+title,light=mix(g.color,true),dark=mix(g.color,false);return '<svg xmlns="http://www.w3.org/2000/svg" class="cv-badge" data-family="'+family+'" viewBox="0 0 100 100" aria-hidden="true" style="color:'+g.color+'"><defs><linearGradient id="'+id+'" x1="0" y1="0" x2="1" y2="1"><stop stop-color="'+light+'"/><stop offset=".38" stop-color="'+g.color+'"/><stop offset=".55" stop-color="'+dark+'"/><stop offset=".75" stop-color="'+light+'"/><stop offset="1" stop-color="'+g.color+'"/></linearGradient></defs>'+artwork(title,family).map(p=>'<path d="'+p.d+'" fill="'+(p.fill?'url(#'+id+')':'none')+'" stroke="'+(p.width>=1.5?light:'currentColor')+'" stroke-width="'+p.width+'" opacity="'+p.opacity+'" stroke-linejoin="round"/>').join('')+'<polygon points="'+points(g.sides,3).map(p=>p.join(',')).join(' ')+'" fill="'+light+'"/></svg>';}
function drawBadge(ctx,title,cx,cy,size,family='overall'){const g=geometry(title);ctx.save();ctx.translate(cx-size/2,cy-size/2);ctx.scale(size/100,size/100);const gradient=ctx.createLinearGradient(0,0,100,100),light=mix(g.color,true);for(const [at,color]of [[0,light],[.38,g.color],[.55,mix(g.color,false)],[.75,light],[1,g.color]])gradient.addColorStop(at,color);ctx.fillStyle=gradient;ctx.lineJoin='round';for(const p of artwork(title,family)){ctx.strokeStyle=p.width>=1.5?light:g.color;ctx.globalAlpha=p.opacity;ctx.lineWidth=p.width;const path=new Path2D(p.d);if(p.fill)ctx.fill(path);ctx.stroke(path);}ctx.restore();}
const paths={one:'M14 2 5 13h6l-1 9 9-13h-6z',ten:'m12 2 3 6 7 1-5 5 1 7-6-3-6 3 1-7-5-5 7-1z',pity:'M12 3a9 9 0 1 0 .1 0M12 7v6l4 2',streak:'m3 8 5 5 4-5 4 5 5-5M3 15h18',comeback:'M4 18V9l5 5 5-5h6M15 4l5 5-5 5',consecutive:'m7 4 2 4 4 1-3 3 1 4-4-2-4 2 1-4-3-3 4-1zm11 7 1 3 4 1-3 2 1 4-3-2-3 2 1-4-3-2 4-1z'};
function achievementIcon(key){return '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="'+(paths[key]||paths.ten)+'" fill="none" stroke="currentColor" stroke-width="1.25" stroke-linecap="round" stroke-linejoin="round"/></svg>';}
function drawAchievement(ctx,key,x,y,size){ctx.save();ctx.translate(x,y);ctx.scale(size/24,size/24);ctx.strokeStyle='#e5c880';ctx.lineWidth=1.25;ctx.lineJoin=ctx.lineCap='round';ctx.stroke(new Path2D(paths[key]||paths.ten));ctx.restore();}
return {COLORS,geometry,artwork,badge,drawBadge,achievementIcon,drawAchievement};});
