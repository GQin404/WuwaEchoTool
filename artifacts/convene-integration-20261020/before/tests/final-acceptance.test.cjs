const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const Core=require('../js/character-core.js'),Share=require('../js/register-share.js'),I18n=require('../js/i18n.js'),VM=require('../js/role-view-model.js');
const context={$:()=>{}};vm.runInNewContext(fs.readFileSync('js/base.js','utf8')+';globalThis.api={roleList,costList,newCharacterModels,getRoleScoreConfig,getScoreDetails,countScores,countMainAttr,countMainAttr2,getRoleEnergyCorrection};',context);
const normalize=VM.createAdapter(context.api),data={role:[Core.createRole(context.api.roleList[0],1),Core.createRole(context.api.roleList[1],2)],unusedEchoes:[{costId:7}]};
let stored=JSON.parse(JSON.stringify(data)),writes=0;const core=Core.create({read:()=>stored,write:x=>{stored=x;writes++;}}),before=JSON.stringify(stored);
// 打开和取消确认只读，事务在确认后重新检查整个来源快照。
core.load();assert.equal(writes,0);stored.role[0].ming=1;
assert.throws(()=>core.transact(before,d=>Core.removeRole(d,1)),/SOURCE_CHANGED/);assert.equal(writes,0);
core.transact(JSON.stringify(stored),d=>Core.removeRole(d,1));assert.equal(writes,1);assert.deepEqual(stored.role.map(r=>r.roleId),[2]);assert.deepEqual(stored.unusedEchoes,[{costId:7}]);
assert.throws(()=>Core.removeRole({role:[{roleId:1},{roleId:1}]},1),/IDENTITY/);
const model=normalize(data.role[0]),original=JSON.stringify(model),share=Share.snapshot(model);share.slots[0].position=9;assert.equal(JSON.stringify(model),original);assert.equal(share.summary.score,null);
const map=new Map([[I18n.STORAGE_KEY,'en']]),storage={getItem:k=>map.get(k)??null,setItem:()=>assert.fail('locale write')};
const doc={documentElement:{}};const classic=I18n.createBrowser({UiView:{state:{effective:'classic'}},document:doc,localStorage:storage,location:{href:'https://test/index.html?view=classic&lang=en'}});
assert.equal(classic.locale,'zh-CN');assert.equal(doc.documentElement.lang,'zh-CN');assert.equal(map.get(I18n.STORAGE_KEY),'en');
const guide=I18n.createBrowser({UiView:{state:{effective:'classic'}},document:doc,localStorage:storage,location:{href:'https://test/index.html?guide=1'}});assert.equal(guide.locale,'en');
const renderer=require('../js/role-register-renderer.js');for(const locale of ['zh-TW','zh-CN','en']){const tr=I18n.create({language:locale}),html=renderer.render(model,tr).html;assert.match(html,/rr-breadcrumb/);assert.match(html,/data-delete-role="1"/);assert.match(html,/data-rr-share/);assert.doesNotMatch(html,/class="rr-top"/);}
console.log('PASS: deletion source conflicts and isolation, duplicate identity rejection, immutable share snapshot, incomplete share score, Classic locale isolation, translated breadcrumb and role actions.');
