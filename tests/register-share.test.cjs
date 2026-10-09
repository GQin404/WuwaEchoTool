const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const I18n=require('../js/i18n.js');
async function run(protocol,locale){
    let tainted=false,downloads=0,picks=0;
    const nodes=[];
    const ctx=new Proxy({measureText:s=>({width:s.length*10}),drawImage:img=>{if(img.src.startsWith('image/')&&protocol==='file:')tainted=true;},getImageData:()=>{if(tainted)throw Object.assign(Error(),{name:'SecurityError'});}},{get:(o,k)=>k in o?o[k]:()=>{}});
    function element(tag){
        const node={tag,children:[],append(...xs){this.children.push(...xs);},setAttribute(){},focus(){},showModal(){},close(){},remove(){},getContext:()=>ctx,toBlob:fn=>fn(new Blob(['png'])),click(){if(tag==='a')downloads++;if(tag==='input')picks++;}};
        if(tag==='canvas')Object.defineProperty(node,'width',{set(){tainted=false;}});
        nodes.push(node);return node;
    }
    const document={baseURI:protocol==='file:'?'file:///project/mccost.html':'https://test/mccost.html',createElement:element,body:element('body')};
    class Image{constructor(){this.width=100;this.height=100;}set src(value){this._src=value;queueMicrotask(()=>this.onload());}get src(){return this._src;}}
    class FileReader{readAsDataURL(){this.result='data:image/png;base64,AA==';queueMicrotask(()=>this.onload());}}
    const context={module:{exports:{}},URL,Image,FileReader,document,setTimeout:()=>0,clearTimeout(){}};
    vm.runInNewContext(fs.readFileSync('js/register-share.js','utf8'),context);
    const model={role:{id:1,catalogId:'test',portrait:'image/characters/test.webp'},model:{chain:0,status:'available',parameters:{}},slots:[],summary:{score:72,status:'complete',substatTotals:[]}};
    const before=JSON.stringify(model),i18n=I18n.create({language:locale});
    await context.module.exports.open(model,i18n);
    const save=nodes.find(n=>n.tag==='button'),picker=nodes.find(n=>n.tag==='input');
    assert.equal(save.disabled,false);
    if(protocol==='file:'){
        assert.equal(save.textContent,i18n.t('share.chooseImages'));
        save.onclick();assert.equal(picks,1);assert.equal(downloads,0);
        picker.files=[];await picker.onchange();assert.equal(downloads,0);
        picker.files=[{name:'wrong.webp'}];await picker.onchange();assert.equal(downloads,0);assert.equal(save.disabled,false);
        picker.files=[{name:'test.webp'}];await picker.onchange();assert.equal(tainted,false);
    }else save.onclick();
    assert.equal(downloads,1);assert.equal(save.disabled,false);assert.equal(JSON.stringify(model),before);
}
(async()=>{for(const locale of ['zh-TW','zh-CN','en']){await run('https:',locale);await run('file:',locale);}console.log('PASS: PNG download, local file selection/redraw, cancel/mismatch recovery, three locales, immutable model.');})().catch(error=>{console.error(error);process.exitCode=1;});
