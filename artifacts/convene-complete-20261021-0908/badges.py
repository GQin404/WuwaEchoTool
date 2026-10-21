from pathlib import Path
p=Path('js/convene-visuals.js');t=p.read_text('utf-8');a=t.index('function artwork(');b=t.index('\nfunction mix(',a)
t=t[:a]+r'''function artwork(title,family='overall'){
 const g=geometry(title),level=Math.max(0,g.level),out=[];
 const add=(d,fill=false,opacity=1,width=1.25)=>out.push({d,fill,opacity,width});
 if(g.observing)return [{d:'M50 13L87 50L50 87L13 50Z',fill:false,opacity:.45,width:1},{d:'M34 50H45M55 50H66',fill:false,opacity:1,width:2}];
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
}'''+t[b:];p.write_text(t,encoding='utf-8',newline='\n')
print('Replaced layered badges with two consistent additive rank families; scoring untouched.')
