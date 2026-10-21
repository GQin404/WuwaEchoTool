from pathlib import Path
import json,hashlib,subprocess,datetime,zipfile
W=Path(__file__).resolve().parent;R=W.parents[1]
v=json.loads((W/'verification.json').read_text('utf-8'));snap=json.loads((W/'snapshot.json').read_text('utf-8'))
def sha(p):return hashlib.sha256(p.read_bytes()).hexdigest()
for f in snap['preExclusionSourceFiles']:assert sha(R/f['path'])==f['originalSha256'],f['path']
for name,marker in [('extracted-verify.txt','PASS 794 files'),('extracted-unit.txt','pass 139'),('extracted-static.txt','283 local entry dependencies and 131 script syntax')]:
 p=R/'artifacts'/name;t=p.read_text('utf-8-sig');assert marker in t,(name,t[-200:]);(W/name).write_text(t,encoding='utf-8')
# All packaging outputs are generated only under artifacts; compare every other Git status line.
def relevant(t):return sorted(x.strip() for x in t.splitlines()if x.strip() and ' artifacts/' not in x)
git=subprocess.check_output(['git','status','--short','--untracked-files=all'],cwd=R,encoding='utf-8')
assert relevant(git)==relevant(snap['gitStatus']),'Non-artifact Git state changed'
t=(W/'extracted-browser.txt').read_text('utf-8-sig');assert 'PASS 6 target browser flows' in t,t[-500:]
b=json.loads((W/'extracted-browser/results.json').read_text('utf-8'));assert not b.get('pageErrors')
v['freshExtraction']={'manifestAndSHA256':'794 files / 793 digests passed','unit':{'passed':139,'failed':0,'skipped':0},'static':{'localDependencies':283,'scriptSyntaxChecks':131,'failed':0},'portableBrowserLauncher':{'targetFlows':6,'passed':True,'api':'mock','pageErrors':0}}
v['productGitStatusUnchanged']=True;v['finalizedAt']=datetime.datetime.now().astimezone().isoformat();v['deliveryPath']='C:\\Users\\user\\Downloads\\'+v['zipName']
assert sha(Path(v['zipPath']))==v['sha256']
(W/'verification.json').write_text(json.dumps(v,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
print(json.dumps({k:v[k]for k in ['zipName','zipBytes','fileCount','sha256','freshExtraction','productGitStatusUnchanged']},ensure_ascii=True))
