/* 模式只切换展示，概率、模拟和资源数据继续调用既有 core。 */
const RegisterTools=(function(){
 let mode='probability',known=[],simulation=[],target='crit',roleId=null;
 function mount(host,i18n){
  const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const t=k=>esc(i18n.t('workspace.'+k)),tr=(k,p)=>esc(i18n.t(k,p)),st=k=>tr('secondary.'+k),stat=k=>tr('stats.'+k);
  const role=()=>({roleListId:Number(roleId||roleList[0].id),ming:0});
  const roleSelect=()=>'<label>'+t('character')+'<select name="role">'+roleList.map(r=>'<option value="'+r.id+'"'+(String(r.id)===String(roleId)?' selected':'')+'>'+esc(i18n.entity('characters',r.id,r.name))+'</option>').join('')+'</select></label><p>'+st('model')+'</p>';
  function resources(count){const data=EchoToolCore.resources(count,costExperance);return '<h2>'+t('resources')+'</h2><dl class="rw-resource-rail">'+[['used','used'],['recovered','recovered'],['lost','lost'],['remaining','remainingResources']].map(([k,label])=>'<div><dt>'+t(label)+'</dt><dd>'+t('xp')+': '+esc(i18n.format.decimal(data[k].xp))+' · '+t('tuners')+': '+esc(i18n.format.decimal(data[k].tuners))+'</dd></div>').join('')+'</dl>';}
  function probability(){
   const result=EchoToolCore.probability(known,s=>countScores(s,role()),fctValueHJ),r=result[target];
   return '<form>'+roleSelect()+'<fieldset><legend>'+st('known')+'</legend><div class="rw-known-options">'+RoleCandidates.SUB.map(k=>'<label><input type="checkbox" name="stat" value="'+k+'"'+(known.some(p=>StatKeys.fromLegacy(p.property)===k)?' checked':'')+'>'+stat(k)+'</label>').join('')+'</div></fieldset><label>'+st('target')+'<select name="target">'+[['crit','crit_rate'],['damage','crit_damage'],['attack','atk_percent'],['dual',null]].map(([k,s])=>'<option value="'+k+'"'+(target===k?' selected':'')+'>'+(s?stat(s):t('dualCrit'))+'</option>').join('')+'</select></label><button>'+t('calculate')+'</button></form><section class="rw-tool-result"><p>'+tr('secondary.holes',{count:5-known.length})+'</p><h2>'+st('probability')+'</h2><strong>'+esc(i18n.format.percentage(r.total))+'</strong><p>'+t('expected')+': '+esc(i18n.format.score(result.expected))+'</p></section>'+resources(known.length);
  }
  function simulate(){return '<section><p>'+tr('secondary.holes',{count:5-simulation.length})+'</p><ol class="rw-simulation-rows">'+Array.from({length:5},(_,i)=>'<li><span>'+String(i+1).padStart(2,'0')+'</span>'+(simulation[i]?'<strong>'+stat(StatKeys.fromLegacy(simulation[i].property))+'</strong><span>'+esc(simulation[i].value)+'</span>':'<span>—</span>')+'</li>').join('')+'</ol><div class="rw-actions"><button data-roll'+(simulation.length>=5?' disabled':'')+'>'+t('roll')+'</button><button data-reset>'+t('reset')+'</button></div>'+resources(simulation.length)+'</section>';}
  function rules(){return roleSelect()+'<p>'+t('ruleScope')+'</p><dl class="rw-rule-rows">'+RoleCandidates.SUB.map(k=>{const detail=getScoreDetails({property:StatKeys.keyToLegacy[k],value:RoleCandidates.unit(k)==='percent'?'1%':'1'},role());return '<div><dt>'+stat(k)+'</dt><dd>'+st('weight')+' '+esc(i18n.format.decimal(detail.coefficient))+'</dd></div>';}).join('')+'</dl>';}
  function render(){host.innerHTML='<nav class="rw-tool-modes" aria-label="'+tr('nav.tools')+'">'+['probability','simulation','rules'].map(k=>'<button type="button" data-tool-mode="'+k+'" aria-pressed="'+(mode===k)+'">'+st(k)+'</button>').join('')+'</nav><div class="rw-tool-content">'+(mode==='probability'?probability():mode==='simulation'?simulate():rules())+'</div>';}
  function collect(form){const values=new FormData(form),keys=values.getAll('stat');if(keys.length>5){alert(i18n.t('workspace.INVALID_ECHO'));return false;}roleId=values.get('role');target=values.get('target');known=keys.map(k=>({property:StatKeys.keyToLegacy[k],value:null}));return true;}
  host.onsubmit=e=>{e.preventDefault();if(collect(e.target))render();};
  host.onchange=e=>{if(mode==='probability'){const form=host.querySelector('form');if(form)collect(form);}else if(e.target.name==='role'){roleId=e.target.value;render();}};
  host.onclick=e=>{const button=e.target.closest('[data-tool-mode]');if(button){if(mode==='probability'&&!collect(host.querySelector('form')))return;mode=button.dataset.toolMode;render();host.querySelector('[data-tool-mode="'+mode+'"]').focus();return;}if(e.target.closest('[data-reset]')){simulation=[];render();}if(e.target.closest('[data-roll]')){const next=EchoToolCore.roll(simulation,fctValue);if(next)simulation.push(next);render();}};
  render();
 }
 return {mount};
})();
