/* 项目直接发布静态文件；检查正式入口依赖与全部脚本语法。 */
const fs=require('node:fs'),path=require('node:path'),{spawnSync}=require('node:child_process'),assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');let references=0,scripts=0;
for(const file of fs.readdirSync(root).filter(f=>f.endsWith('.html'))){
 const html=fs.readFileSync(path.join(root,file),'utf8');
 for(const match of html.matchAll(/<(?:script|link)\b[^>]*\b(?:src|href)=["']([^"']+)["']/gi)){
  const value=match[1].split(/[?#]/)[0];if(!value||/^(?:https?:|data:|\/\/)/.test(value))continue;
  assert.ok(fs.existsSync(path.resolve(root,value)),file+' missing dependency '+value);references++;
 }
}
function sourceFiles(dir){return fs.readdirSync(dir,{withFileTypes:true}).flatMap(e=>e.isDirectory()?sourceFiles(path.join(dir,e.name)):/\.(?:js|cjs)$/.test(e.name)?[path.join(dir,e.name)]:[]);}
for(const directory of ['js','scripts','tests','functions','convene-worker'])for(const file of sourceFiles(path.join(root,directory))){
 const result=spawnSync(process.execPath,['--check',file],{encoding:'utf8'});assert.equal(result.status,0,result.stderr);scripts++;
}
console.log('PASS: '+references+' local entry dependencies and '+scripts+' script syntax checks; static release requires no bundler.');
