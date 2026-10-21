from pathlib import Path
import os,json,hashlib,shutil,re,subprocess,datetime,zipfile,collections
R=Path.cwd(); W=R/'artifacts/chatgpt-handoff-20261020-2009'; S=W/'stage/WuwaEchoTool'
def sha(b):return hashlib.sha256(b).hexdigest()
def put(p,s):p.parent.mkdir(parents=True,exist_ok=True);p.write_text(s,encoding='utf-8',newline='\n')
def data(p,x):put(p,json.dumps(x,ensure_ascii=False,indent=2)+'\n')
def git(*a):return subprocess.check_output(['git',*a],encoding='utf-8',errors='replace').strip()
selected=[];excluded=[];sanitized=[];jwt=re.compile(r'eyJ[A-Za-z0-9_-]{15,}\.[A-Za-z0-9_-]{15,}\.[A-Za-z0-9_-]{20,}')
def walk(d):
 for p in sorted(d.iterdir()):
  rel=p.relative_to(R).as_posix()
  if p.is_symlink():excluded.append({'path':rel,'reason':'symlink not followed'});continue
  if p.is_dir():
   if p.name in {'.git','node_modules','.cache','.next','coverage','playwright-report','test-results','.idea','.vscode','.codex','.agents'} or (rel.startswith('artifacts/') and (p.name in {'WuwaEchoTool','extracted','stage','stage-final','source-stage','verified','verified-final','delivery','delivery-final'} or rel.startswith(('artifacts/handoff','artifacts/multiconfig','artifacts/chatgpt-handoff','artifacts/inventory-fix')))):
    excluded.append({'path':rel+'/','reason':'reviewed Git/dependencies/cache or prior generated delivery tree'});continue
   yield from walk(p)
  else:yield p
for p in walk(R):
 rel=p.relative_to(R).as_posix();size=p.stat().st_size
 if (p.name.startswith('.env') and p.name!='.env.example') or p.name in {'.DS_Store','Thumbs.db'} or p.suffix.lower() in {'.zip','.log','.tmp','.pem','.key','.pfx','.p12','.db','.sqlite'}:
  excluded.append({'path':rel,'bytes':size,'reason':'archive/temporary output or potentially private data; not runtime resource'});continue
 if rel.startswith('artifacts/cleanup') or rel.startswith('artifacts/') and not('/baseline/' in rel or rel=='artifacts/register-overview/classic-before.js' or p.suffix.lower() in {'.json','.txt','.md','.js','.css','.html','.cjs'}):
  excluded.append({'path':rel,'bytes':size,'reason':'historical generated screenshot/packaging output'});continue
 b=p.read_bytes();original=sha(b)
 if p.suffix.lower() in {'.js','.cjs','.json','.html','.css','.md','.txt'}:
  txt=b.decode('utf-8-sig')
  if jwt.search(txt):
   assert rel=='js/base.js' and txt.count('tokenList')==1,'Credential review needed: '+rel
   b=jwt.sub('',txt).encode('utf-8');sanitized.append({'path':rel,'reason':'unused declaration-only historical token removed in package copy only','originalSha256':original,'archiveSha256':sha(b)})
 target=S/rel;target.parent.mkdir(parents=True,exist_ok=True);target.write_bytes(b)
 selected.append({'path':rel,'bytes':len(b),'sha256':sha(b),'originalSha256':original})
sizes=collections.Counter()
for f in selected:sizes[f['path'].split('/')[0]]+=f['bytes']
meta={'startedAt':datetime.datetime.now().astimezone().isoformat(),'root':str(R),'stage':str(S),'head':git('log','-1','--format=%H %s'),'branch':git('branch','--show-current'),'gitStatus':git('status','--short','--untracked-files=all'),'gitDiffStat':git('diff','--stat'),'sourceFiles':selected,'excluded':excluded,'sanitized':sanitized,'largestDirectories':sizes.most_common(10),'largestFiles':sorted(selected,key=lambda f:f['bytes'],reverse=True)[:15]}
data(W/'snapshot.json',meta);print(json.dumps({'sourceFiles':len(selected),'bytes':sum(x['bytes']for x in selected),'largestDirectories':sizes.most_common(6),'sanitizedPaths':[x['path']for x in sanitized]},ensure_ascii=True))
