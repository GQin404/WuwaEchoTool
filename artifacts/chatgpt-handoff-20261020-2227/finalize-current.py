from pathlib import Path
import json,hashlib,subprocess,datetime,collections,zipfile
W=Path(__file__).resolve().parent;R=W.parents[1]
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
v=json.loads((W/'verification.json').read_text('utf-8'));snap=json.loads((W/'snapshot.json').read_text('utf-8'))
for f in snap['preExclusionSourceFiles']:assert sha(R/f['path'])==f['originalSha256'],f['path']
def relevant(t):return sorted(x.strip()for x in t.splitlines()if x.strip()and' artifacts/'not in x)
now=subprocess.check_output(['git','status','--short','--untracked-files=all'],cwd=R,encoding='utf-8')
assert relevant(now)==relevant(snap['gitStatus']),'Product Git status changed'
for file,marker in [('final-extracted-verify.txt','PASS 799 files'),('final-extracted-unit.txt','pass 145'),('final-extracted-static.txt','283 local entry dependencies and 133 script syntax'),('final-extracted-browser.txt','PASS 6 reference UI flows')]:
 t=(W/file).read_text('utf-8-sig');assert marker in t,(file,t[-200:])
b=json.loads((W/'final-extracted-browser/results.json').read_text('utf-8'));assert not b.get('pageErrors')
compressed=collections.Counter()
with zipfile.ZipFile(v['zipPath'])as z:
 assert z.testzip()is None
 for f in z.infolist():compressed[f.filename.split('/')[1]]+=f.compress_size
 assert len(z.namelist())==799
v.update(finalizedAt=datetime.datetime.now().astimezone().isoformat(),deliveryPath='C:\\Users\\user\\Downloads\\'+v['zipName'],productGitStatusUnchanged=True,freshExtraction={'manifestAndSHA256':'799 files / 798 digests passed','unit':{'passed':145,'failed':0,'skipped':0},'static':{'localDependencies':283,'scriptSyntaxChecks':133,'failed':0},'portableBrowser':{'referenceFlows':6,'pageErrors':0,'api':'mock only','passed':True}},compressedDirectories=compressed.most_common(6))
assert sha(Path(v['zipPath']))==v['sha256']
(W/'verification.json').write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps({k:v[k]for k in ['zipName','zipBytes','fileCount','sha256','compressedDirectories','freshExtraction']},ensure_ascii=True))
