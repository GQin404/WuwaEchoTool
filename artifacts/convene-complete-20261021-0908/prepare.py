from pathlib import Path
import hashlib,json,shutil,datetime,subprocess
R=Path.cwd();W=R/'artifacts/convene-complete-20261021-0908'
sha=lambda p:hashlib.sha256(p.read_bytes()).hexdigest()
files=[p for folder in ['js','css','tests','scripts','functions','convene-worker','image/characters'] for p in (R/folder).rglob('*') if p.is_file()]+list(R.glob('*.html'))+[R/'_headers']
hashes={p.relative_to(R).as_posix():sha(p) for p in files}
(W/'baseline.json').write_text(json.dumps({'at':datetime.datetime.now().astimezone().isoformat(),'hashes':hashes,'gitStatus':subprocess.check_output(['git','status','--short'],encoding='utf-8')},ensure_ascii=False,indent=2),'utf-8')
for folder in ['js','css']:
 for p in (R/folder).glob('*convene*'):
  dest=W/'before'/p.relative_to(R);dest.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(p,dest)
for rel in ['js/weapon-catalog.js','js/weapon-portraits.js','convene.html','_headers']:
 p=R/rel;dest=W/'before'/rel;dest.parent.mkdir(parents=True,exist_ok=True);shutil.copy2(p,dest)
print('Captured '+str(len(hashes))+' source/resource hashes; no base.js credential copy.')
