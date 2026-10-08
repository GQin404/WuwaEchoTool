const assert=require('node:assert/strict');
const views=require('../js/ui-view.js'),i18n=require('../js/i18n.js'),messages=require('../js/i18n-dictionaries.js');
const local=require('../js/role-local-configuration.js'),controller=require('../js/role-register-controller.js');
const map=new Map([['mcData','original']]),writes=[];
const storage={getItem:k=>map.get(k)??null,setItem:(k,v)=>{writes.push(k);map.set(k,v);}};
for(const preference of [null,'register','classic','invalid'])for(const override of [null,'register','classic','invalid'])for(const desktop of [true,false]){
    const url='https://test.invalid/index.html'+(override?'?view='+override:'');
    const result=views.resolve({url,preference,desktop});
    const requested=['register','classic'].includes(override)?override:['register','classic'].includes(preference)?preference:null;
    assert.equal(result.requested,requested);assert.equal(result.effective,requested==='register'&&!desktop?'classic':requested);
}
assert.equal(views.resolve({url:'https://test.invalid/index.html'}).source,'choice');
map.set(views.KEY,'register');
assert.equal(views.resolve({url:'https://test.invalid/?view=classic',preference:map.get(views.KEY)}).effective,'classic');assert.equal(map.get(views.KEY),'register');
views.recent(storage,1);views.recent(storage,2);views.recent(storage,1);assert.deepEqual(views.recent(storage),['1','2']);
for(const locale of ['zh-TW','zh-CN','en']){
    const tr=i18n.create({storage,language:locale});tr.setLocale(locale);
    assert.equal(map.get(views.KEY),'register');assert.equal(map.get('mcData'),'original');
    for(const key of Object.keys(messages.en).filter(k=>/^(entry|dock)\./.test(k)))assert.ok(messages[locale][key]);
}
assert.equal(controller.editorReturn('?view=classic',1,2),'./mccost.html?roleid=1&view=classic');
assert.match(controller.editorReturn('?returnRegister=1&rrPosition=3',1,2),/view=register/);
const backup=local.create(storage);const json=backup.exportData().json;
assert.equal(backup.restore(json).ok,true);const old=map.get(local.KEY);
assert.equal(backup.restore('{broken').ok,false);assert.equal(map.get(local.KEY),old);
assert.equal(map.get('mcData'),'original');assert.ok(!writes.includes('mcData'));
console.log('PASS: 32 routing combinations, first visit, URL precedence, mobile fallback, locale/view isolation, recent roles, Classic editor return and isolated adoption backup.');
