const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const I18n=require('../js/i18n.js');
async function run(protocol,locale,mode){
    let tainted=false,downloads=0,picks=0;const drawn=[],borders=[];
    const nodes=[];
    const ctx=new Proxy({fillText:(s)=>drawn.push(s),stroke:()=>borders.push(ctx.strokeStyle),measureText:s=>({width:s.length*10}),drawImage:img=>{if(img.src.startsWith('image/')&&protocol==='file:')tainted=true;},getImageData:()=>{if(tainted)throw Object.assign(Error(),{name:'SecurityError'});}},{get:(o,k)=>k in o?o[k]:()=>{}});
    function element(tag){
        const node={classList:{add(){},remove(){}},tag,children:[],append(...xs){this.children.push(...xs);},setAttribute(){},focus(){},showModal(){},close(){},remove(){},getContext:()=>ctx,toBlob:fn=>fn(new Blob(['png'])),click(){if(tag==='a')downloads++;if(tag==='input')picks++;}};
        if(tag==='canvas')Object.defineProperty(node,'width',{set(){tainted=false;}});
        nodes.push(node);return node;
    }
    const document={baseURI:protocol==='file:'?'file:///project/mccost.html':'https://test/mccost.html',createElement:element,body:element('body')};
    class Image{constructor(){this.width=100;this.height=100;}set src(value){this._src=value;queueMicrotask(()=>this.onload());}get src(){return this._src;}}
    class FileReader{readAsDataURL(){this.result='data:image/png;base64,AA==';queueMicrotask(()=>this.onload());}}
    const context={module:{exports:{}},URL,Image,FileReader,document,setTimeout:()=>0,clearTimeout(){}};
    vm.runInNewContext(fs.readFileSync('js/register-share.js','utf8'),context);
    const model={role:{id:1,catalogId:'test',portrait:'image/characters/test.webp'},model:{chain:0,status:'available',parameters:{}},slots:[],summary:{score:72,knownContribution:75,energyCorrection:-3,status:'complete',substatTotals:[]}};
    model.slots=[{position:1,status:'incomplete',echo:{catalogId:'Long echo name for wrapping verification',cost:4,mainStat:{key:'crit_rate',unit:'percent',value:22},score:{value:null},substats:[{key:'crit_rate',status:'valid',unit:'percent',value:10.5,rawContribution:0},{key:'hp_flat',status:'valid',unit:'flat',value:470,rawContribution:4},{key:'crit_damage',status:'valid',unit:'percent',value:21,rawContribution:null},{key:'resonance_skill_damage',status:'invalid',value:null,rawContribution:9}]}}];
    const before=JSON.stringify(model),i18n=I18n.create({language:locale});
    await context.module.exports.open(model,i18n);
    assert.equal(downloads,0);assert.equal(drawn.length,0);const choice=nodes.find(n=>n.tag==='button'&&n.textContent===i18n.t('share.'+mode));await choice.onclick();
    const save=nodes.find(n=>n.tag==='button'&&[i18n.t('share.download'),i18n.t('share.chooseImages')].includes(n.textContent)),picker=nodes.find(n=>n.tag==='input');
    const renderedHeight=nodes.find(n=>n.tag==='canvas').height;
    assert.ok(renderedHeight>=1000);if(mode==='detailed')assert.ok(renderedHeight>=1800);
    assert.ok(drawn.includes(i18n.t('share.radarTitle')));assert.ok(drawn.includes(i18n.t('register.brand')));assert.ok(drawn.includes(i18n.t('register.brandLatin')));
    if(mode==='detailed'){assert.equal(borders.filter(c=>c==='#578c7d').length,1);assert.equal(borders.filter(c=>c==='#3d5047').length,4);}else assert.equal(borders.filter(c=>c==='#578c7d'||c==='#3d5047').length,0);
    assert.equal(save.disabled,false);
    const max=context.module.exports.radarData(model).max;
    const technical=[i18n.t('share.loadoutCorrection'),i18n.t('share.radarScope'),i18n.t('share.radarPartial'),i18n.t('share.radarScale',{max:i18n.format.decimal(max)})];
    assert.ok(drawn.every(word=>!technical.includes(word)));
    if(protocol==='file:'){
        assert.equal(save.textContent,i18n.t('share.chooseImages'));
        save.onclick();assert.equal(picks,1);assert.equal(downloads,0);
        picker.files=[];await picker.onchange();assert.equal(downloads,0);
        picker.files=[{name:'wrong.webp'}];await picker.onchange();assert.equal(downloads,0);assert.equal(save.disabled,false);
        picker.files=[{name:'test.webp'}];await picker.onchange();assert.equal(tainted,false);
    }else save.onclick();
    assert.equal(downloads,1);assert.equal(save.disabled,false);assert.equal(JSON.stringify(model),before);
}
(async()=>{for(const locale of ['zh-TW','zh-CN','en']){for(const mode of ['compact','detailed']){await run('https:',locale,mode);await run('file:',locale,mode);}}console.log('PASS: PNG download, local file selection/redraw, cancel/mismatch recovery, three locales, immutable model.');})().catch(error=>{console.error(error);process.exitCode=1;});
