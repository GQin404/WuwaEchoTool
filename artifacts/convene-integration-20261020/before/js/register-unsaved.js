(function(root){
 const guards=new Set();let installed=false,leaving=false;
 root.RegisterUnsaved={create,leave};
 function leave(action){
  if(leaving)return;leaving=true;const pending=[...guards].filter(g=>g.dirty()),accepted=[];
  const cancel=()=>{accepted.forEach(g=>g.resume());leaving=false;};
  const next=()=>{const guard=pending.shift();if(!guard){leaving=false;action();return;}guard.leave(()=>{accepted.push(guard);next();},cancel);};next();
 }
 function install(){
  if(installed)return;installed=true;
  window.addEventListener('beforeunload',e=>{const dirty=[...guards].filter(g=>g.dirty());if(dirty.length){dirty.forEach(g=>g.retain());e.preventDefault();e.returnValue='';}});
  document.addEventListener('click',event=>{const link=event.target.closest('a[href]');if(!link||event.defaultPrevented||link.hasAttribute?.('download')||link.target&&link.target!=='_self'||event.ctrlKey||event.metaKey||event.shiftKey||![...guards].some(g=>g.dirty()))return;const destination=new URL(link.href,location.href),here=new URL(location.href);if(destination.origin===here.origin&&destination.pathname===here.pathname&&destination.search===here.search)return;event.preventDefault();leave(()=>location.assign(link.href));});
 }
 function create({scope,get,apply,revision,i18n,serialize=JSON.stringify}){
 const key=()=> 'wuwa.register.edit.'+(typeof scope==='function'?scope():scope),version=()=>typeof revision==='function'?revision():revision;let initial=serialize(get()),paused=false;
 const dirty=()=>!paused&&serialize(get())!==initial;
 function retain(){try{sessionStorage.setItem(key(),JSON.stringify({revision:version(),value:get()}));return true;}catch(_){return false;}}
 function recover(){try{const raw=JSON.parse(sessionStorage.getItem(key())||'null');if(raw&&raw.revision===version()){apply(raw.value);return true;}}catch(_){}return false;}
 function clear(){try{sessionStorage.removeItem(key());return true;}catch(_){return false;}}
 let dialogOpen=false;
 function prompt(action,cancel=()=>{}){if(!dirty()){action();return;}if(dialogOpen)return;dialogOpen=true;const opener=document.activeElement,dialog=document.createElement('dialog');dialog.className='rr-dialog';const h=document.createElement('h2');h.textContent=i18n.t('ops.unsaved');dialog.append(h);const p=document.createElement('p');p.textContent=i18n.t('ops.unsavedHelp');dialog.append(p);const finish=()=>{dialogOpen=false;dialog.close();dialog.remove();if(opener?.isConnected)opener.focus({preventScroll:true});};const stay=()=>{finish();cancel();};dialog.addEventListener('cancel',event=>{event.preventDefault();stay();});for(const choice of ['retain','discard','stay']){const button=document.createElement('button');button.type='button';button.textContent=i18n.t('ops.'+choice);button.onclick=()=>{if(choice==='stay'){stay();return;}if(!(choice==='retain'?retain():clear())){p.textContent=i18n.t('workspace.SAVE_FAILED');return;}paused=true;finish();action();};dialog.append(button);}document.body.append(dialog);dialog.showModal();dialog.querySelector('button').focus();}
 const guard={dirty,retain,recover,leave:prompt,markSaved(){initial=serialize(get());paused=false;clear();},reset(){initial=serialize(get());paused=false;},discard(){if(!clear())return false;paused=true;return true;},pause(){paused=true;},resume(){paused=false;}};
 guards.add(guard);install();return guard;
}})(globalThis);
