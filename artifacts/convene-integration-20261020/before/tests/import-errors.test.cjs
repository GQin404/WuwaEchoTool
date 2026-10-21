const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const env={};vm.runInNewContext(fs.readFileSync('js/import-service.js','utf8'),env);
const I18n=require('../js/i18n.js');
async function run(target,response,transport){
 const calls=[],store=new Map([['kjq_token','secret-login']]);
 const service=env.ImportService.create({
  host:'',methods:['list','detail','bind','refresh','','','auth'],
  headers:()=>({}),tokenHeaders:()=>({}),storage:{getItem:k=>store.get(k),setItem:(k,v)=>store.set(k,v)},convert:x=>x,
  ajax:o=>{
   calls.push(o.url);assert.equal(o.timeout,30000);
   if(o.url===target){if(transport)o.error(...transport);else o.success(response);}
   else o.success(o.url==='auth'?{code:200,data:{accessToken:'secret-data'}}:{success:true});
  }
 });
 let error;
 try{if(target==='bind')await service.bind('secret-login');else if(target==='detail')await service.detail('123456789',{gameRoleId:1});else await service.list('123456789');}catch(e){error=e;}
 assert.ok(error?.importFailure);
 assert.equal(error.importFailure.stage,target);
 assert.equal(calls.at(-1),target);
 assert.equal(store.has('mcData'),false);
 return error;
}
(async()=>{
 for(const locale of ['zh-TW','zh-CN','en']){
  const i=I18n.create({url:'/?lang='+locale,languages:[locale]});
  for(const key of ['INVALID_UID','TOKEN_REQUIRED','SOURCE_CHANGED','SAVE_FAILED']){
   assert.equal(env.ImportService.formatError(Error(key),(k,p)=>i.t(k,p)),i.t('workspace.'+key));
  }
  assert.equal(env.ImportService.formatError(Error('secret-login'),(k,p)=>i.t(k,p)),i.t('workspace.IMPORT_FAILED'));
 }
 const cases=[
 ['bind',{code:220,msg:'访问令牌不能为空'},'credential'],
 ['auth',{code:999,msg:'数据令牌已失效'},'dataToken'],
 ['refresh',{code:999,msg:'系统维护'},'maintenance'],
 ['list',{code:200,data:{geeTest:true}},'verification'],
 ['detail',{code:200,data:'broken json'},'format'],
 ['auth',{code:200,data:{}},'format'],
 ['list',{code:200,data:{}},'format'],
 ['list',{code:987,msg:'secret-login secret-data <script> raw unknown'},'rejected']
 ];
 for(const [stage,response,reason]of cases){
  const e=await run(stage,response);assert.equal(e.importFailure.reason,reason);
  for(const locale of ['zh-TW','zh-CN','en']){
   const i=I18n.create({url:'/?lang='+locale,languages:[locale]});
   const text=env.ImportService.formatError(e,(k,p)=>i.t(k,p));
   assert.ok(!text.includes('workspace.'));
   assert.ok(!/secret-|<script>/.test(text));
   if(e.importFailure.code)assert.ok(text.includes(String(response.code)));
  }
 }
 for(const [state,status,reason] of [['timeout',0,'timeout'],['error',0,'network'],['error',503,'http'],['parsererror',200,'format']]){
  const e=await run('list',null,[{status},state]);assert.equal(e.importFailure.reason,reason);
 }
 const e=await run('auth',null,[{status:401,responseJSON:{code:220,msg:'访问令牌不能为空'}},'error']);
 assert.equal(e.importFailure.status,401);assert.equal(e.importFailure.code,'220');
 console.log('PASS: import error stages, business failures, refresh stop, malformed responses, transport failures, safe diagnostics and three locales.');
})().catch(e=>{console.error(e);process.exitCode=1;});
