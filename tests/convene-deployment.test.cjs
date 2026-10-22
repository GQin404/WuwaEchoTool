const {test}=require('node:test');
const A=require('node:assert/strict');
const fs=require('node:fs');
const S=require('../js/convene-service.js');
const source=fs.readFileSync('functions/api/convene.js','utf8');
const api=()=>import('data:text/javascript;base64,'+Buffer.from(source).toString('base64'));
const historyURL='https://aki-gm-resources-oversea.aki-game.net/aki/gacha/index.html#/record?player_id=700000099&svr_id=Asia&record_id=synthetic-authorization&resources_id=synthetic-resource&lang=en';

test('default Pages config targets the existing project without requiring an external Worker',()=>{
 const active=fs.readFileSync('wrangler.toml','utf8').split(/\r?\n/).filter(line=>!line.trim().startsWith('#')).join('\n');
 A.match(active,/^name\s*=\s*"wuwaechotool"/m);
 A.match(active,/^pages_build_output_dir\s*=\s*"\."/m);
 A.doesNotMatch(active,/^\s*\[\[services\]\]/m);
});

test('unconfigured Pages proxy fails closed instead of forwarding an unmetered request',async()=>{
 const {onRequest}=await api();
 const response=await onRequest({request:new Request('https://example.test/api/convene',{method:'POST',headers:{'Content-Type':'application/json'},body:'{}'}),env:{}});
 A.equal(response.status,503);
 A.deepEqual(await response.json(),{error:'CONFIGURATION'});
});

test('an explicitly configured proxy receives the original request and response',async()=>{
 const {onRequest}=await api();
 const request=new Request('https://example.test/api/convene',{method:'POST',body:'synthetic'});
 const expected=new Response('{"code":0,"data":[]}',{headers:{'Content-Type':'application/json'}});
 let calls=0;
 const actual=await onRequest({request,env:{CONVENE_PROXY:{fetch:async received=>{A.equal(received,request);calls++;return expected;}}}});
 A.equal(calls,1);
 A.equal(actual,expected);
});

test('automatic import still works directly without calling the unconfigured proxy',async()=>{
 const calls=[];
 const rows=await S.fetchPool(S.parseURL(historyURL),1,{proxy:'auto',fetcher:async(url)=>{calls.push(url);return new Response('{"code":0,"data":[]}',{headers:{'Content-Type':'application/json'}});}});
 A.deepEqual(rows,[]);
 A.deepEqual(calls,[S.ENDPOINTS.global]);
});

test('blocked direct import and unconfigured proxy produce the existing actionable error',async()=>{
 const calls=[];
 await A.rejects(S.fetchPool(S.parseURL(historyURL),1,{proxy:'auto',fetcher:async(url)=>{calls.push(url);if(url!=='/api/convene')throw Error('network blocked');return new Response('{"error":"CONFIGURATION"}',{status:503});}}),/PROXY_UNAVAILABLE/);
 A.deepEqual(calls,[S.ENDPOINTS.global,'/api/convene']);
});
