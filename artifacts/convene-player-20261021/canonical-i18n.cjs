const fs=require('fs'),M=require(process.cwd()+'/js/convene-i18n.js');const rows=M.rows;for(const k of ['advancedResult','manualEvidence','initialGuarantee','initialHelp','source.user'])delete rows[k];fs.writeFileSync('js/convene-i18n.js',`/* Canonical player-facing messages: zh-TW, zh-CN, en. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./convene-core.js'));else root.ConveneMessages=factory(root.ConveneCore);})(typeof globalThis!=='undefined'?globalThis:this,function(Core){
'use strict';
const rows=`+JSON.stringify(rows,null,2)+`;
function create(locale='zh-CN'){const index={'zh-TW':0,'zh-CN':1,en:2}[locale]??1;return (key,params={})=>String(rows[key]?.[index]||key).replace(/\\{(\\w+)\\}/g,(_,k)=>params[k]??'{'+k+'}');}
function poolName(pool,t){return t((Core.POOLS[pool]?.key||'unknown')+'Pool')+(pool>=8&&pool<101?' '+pool:'');}
return {rows,create,poolName};});
`);console.log('Canonical translated keys',Object.keys(rows).length);
