const {test}=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const I18n=require('../js/i18n.js'),Navigation=require('../js/register-navigation.js');

test('score readings keep two decimals and missing values across all locales',()=>{
 for(const language of ['zh-TW','zh-CN','en']){const i18n=I18n.create({language});assert.equal(i18n.format.scoreValue(71.9),'71.90');assert.equal(i18n.format.scoreValue(null),i18n.t('common.unavailable'));assert.equal(i18n.format.scoreValue(NaN),i18n.t('common.unavailable'));}
});

test('operation feedback is consumed once by the intended destination without touching saved data',()=>{
 const data=new Map([['mcData','unchanged']]),storage={getItem:key=>data.get(key)??null,setItem:(key,value)=>data.set(key,value)},nav=Navigation.create(storage);
 nav.save('library',{search:'Guardian',sort:'name',scroll:860});nav.notify('role:101','saved');assert.equal(nav.takeNotice('library'),null);assert.equal(nav.takeNotice('role:101'),'saved');assert.equal(nav.takeNotice('role:101'),null);assert.deepEqual(nav.load('library'),{search:'Guardian',sort:'name',scroll:860});assert.equal(data.get('mcData'),'unchanged');
 nav.notify('library','INVALID_DATA');assert.equal(nav.takeNotice('library'),null);
});

function shareFixture(){
 const nodes=[],pictures=[],timers=new Map(),drawn=[];let timerId=0,downloads=0,blobCallback;
 const ctx=new Proxy({measureText:s=>({width:String(s).length*10}),fillText:(text,x,y)=>drawn.push({text,x,y}),getImageData:()=>({})},{get:(o,k)=>k in o?o[k]:()=>{}});
 function element(tag){const node={tag,isConnected:true,classList:{add(){},remove(){}},append(){},setAttribute(){},focus(){},showModal(){},close(){},remove(){this.isConnected=false;},getContext:()=>ctx,toBlob:fn=>{blobCallback=fn;},click(){if(tag==='a')downloads++;}};nodes.push(node);return node;}
 class Image{constructor(){this.width=100;this.height=100;pictures.push(this);}set src(value){this._src=value;}get src(){return this._src;}}
 const env={module:{exports:{}},URL,Image,document:{baseURI:'https://test/mccost.html',body:element('body'),createElement:element},setTimeout:fn=>{timers.set(++timerId,fn);return timerId;},clearTimeout:id=>timers.delete(id)};
 vm.runInNewContext(fs.readFileSync('js/register-share.js','utf8'),env);
 const model={role:{id:1,catalogId:999,legacy:{name:'Test character'},portrait:'image/role/a.png'},model:{chain:0,status:'available',parameters:{}},slots:Array.from({length:5},(_,i)=>({position:i+1,status:'complete',echo:{catalogId:999+i,legacy:{name:'Echo '+i},image:'image/cost/'+i+'.png',mainStat:{key:'crit_rate',unit:'percent',value:22},score:{value:12},substats:[]}})),summary:{score:60,knownContribution:60,energyCorrection:0,status:'complete',substatTotals:[]}};
 return {nodes,pictures,timers,drawn,model,api:env.module.exports,resolve(){pictures.filter(p=>p.onload).forEach(p=>p.onload());},get downloads(){return downloads;},deliverBlob(){blobCallback(new Blob(['png']));}};
}
const tick=()=>new Promise(resolve=>setImmediate(resolve));

test('share images load together, reuse successful assets, and close cancels outstanding work',async()=>{
 const f=shareFixture(),i18n=I18n.create({language:'en'});await f.api.open(f.model,i18n);
 const compact=f.nodes.find(n=>n.textContent===i18n.t('share.compact')),render=compact.onclick();await tick();assert.equal(f.pictures.length,6);assert.equal(f.timers.size,6);f.resolve();await render;assert.equal(f.timers.size,0);
 const back=f.nodes.find(n=>n.textContent===i18n.t('share.back'));back.onclick();const detailed=f.nodes.find(n=>n.textContent===i18n.t('share.detailed'));await detailed.onclick();assert.equal(f.pictures.length,6);
 const save=f.nodes.find(n=>n.textContent===i18n.t('share.download'));save.onclick();f.nodes.find(n=>n.textContent===i18n.t('common.close')).onclick();f.deliverBlob();assert.equal(f.downloads,0);
 const pending=shareFixture();await pending.api.open(pending.model,i18n);const task=pending.nodes.find(n=>n.textContent===i18n.t('share.compact')).onclick();await tick();pending.nodes.find(n=>n.textContent===i18n.t('common.close')).onclick();await task;assert.equal(pending.timers.size,0);assert.equal(pending.drawn.length,0);
});

test('compact output expands for long Echo names and preserves footer space and data',async()=>{
 const f=shareFixture(),i18n=I18n.create({language:'en'});f.model.slots[0].echo.legacy.name='Long Echo name '.repeat(10);const before=JSON.stringify(f.model);await f.api.open(f.model,i18n);const render=f.nodes.find(n=>n.textContent===i18n.t('share.compact')).onclick();await tick();f.resolve();await render;
 const canvas=f.nodes.find(n=>n.tag==='canvas');assert.ok(canvas.height>1150);assert.ok(f.drawn.every(row=>row.y<canvas.height));assert.equal(JSON.stringify(f.model),before);
});
