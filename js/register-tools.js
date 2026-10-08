/* 工具仅修改内存输入，共用 Classic 的概率和模拟计算入口。 */
const RegisterTools=(function(){
    let properties=[],result=null,roleId=null;
    function mount(host,i18n){
        const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
        const t=k=>esc(i18n.t('workspace.'+k));
        const stat=k=>esc(i18n.t('stats.'+k));
        function details(){
            const role={roleListId:Number(roleId||roleList[0].id),ming:0},resources=EchoToolCore.resources(properties.length,costExperance);
            return '<details><summary>'+t('rules')+'</summary><p>'+t('ruleScope')+'</p><dl>'+RoleCandidates.SUB.map(k=>{const detail=getScoreDetails({property:StatKeys.keyToLegacy[k],value:RoleCandidates.unit(k)==='percent'?'1%':'1'},role);return '<div><dt>'+stat(k)+'</dt><dd>'+esc(i18n.format.decimal(detail.coefficient))+'</dd></div>';}).join('')+'</dl></details><h2>'+t('resources')+'</h2><dl>'+[['used','used'],['recovered','recovered'],['lost','lost'],['remaining','remainingResources']].map(([key,label])=>'<div><dt>'+t(label)+'</dt><dd>'+t('xp')+': '+esc(i18n.format.decimal(resources[key].xp))+' · '+t('tuners')+': '+esc(i18n.format.decimal(resources[key].tuners))+'</dd></div>').join('')+'</dl>';
        }
        function render(){host.innerHTML='<form><label>'+t('character')+'<select name="role">'+roleList.map(r=>'<option value="'+r.id+'"'+(String(r.id)===String(roleId)?' selected':'')+'>'+esc(i18n.entity('characters',r.id,r.name||i18n.t('register.characterId',{id:r.id})))+'</option>').join('')+'</select></label><fieldset><legend>'+t('probability')+'</legend>'+RoleCandidates.SUB.map(k=>'<label><input type="checkbox" name="stat" value="'+k+'"'+(properties.some(p=>StatKeys.fromLegacy(p.property)===k)?' checked':'')+'>'+stat(k)+'</label>').join('')+'</fieldset><button>'+t('calculate')+'</button></form><h2>'+t('simulation')+'</h2><button data-roll'+(properties.length>=5?' disabled':'')+'>'+t('roll')+'</button> <button data-reset>'+t('reset')+'</button><ul>'+properties.map(p=>'<li>'+stat(StatKeys.fromLegacy(p.property))+(p.value?' · '+esc(p.value):'')+'</li>').join('')+'</ul>'+(result?'<h2>'+t('remaining')+'</h2><dl>'+[['crit','crit_rate'],['damage','crit_damage'],['attack','atk_percent']].map(([k,s])=>'<div><dt>'+stat(s)+'</dt><dd>'+(result[k].present?t('achieved'):esc(i18n.format.percentage(result[k].total)))+'</dd></div>').join('')+'<div><dt>'+t('dualCrit')+'</dt><dd>'+esc(i18n.format.percentage(result.dual.total))+'</dd></div><div><dt>'+t('defensive')+'</dt><dd>'+esc(i18n.format.percentage(result.defensive))+'</dd></div><div><dt>'+t('expected')+'</dt><dd>'+esc(i18n.format.score(result.expected))+'</dd></div></dl>':'')+details();}
        function calculate(){result=EchoToolCore.probability(properties,s=>countScores(s,{roleListId:Number(roleId||roleList[0].id),ming:0}),fctValueHJ);render();}
        host.onsubmit=e=>{e.preventDefault();const values=new FormData(e.target),keys=values.getAll('stat');if(keys.length>5){alert(i18n.t('workspace.INVALID_ECHO'));return;}roleId=values.get('role');properties=keys.map(k=>properties.find(p=>StatKeys.fromLegacy(p.property)===k)||{property:StatKeys.keyToLegacy[k],value:null});calculate();};
        host.onchange=e=>{if(e.target.name==='role'){roleId=e.target.value;calculate();}};
        host.onclick=e=>{if(e.target.closest('[data-reset]')){properties=[];result=null;render();}if(e.target.closest('[data-roll]')){const next=EchoToolCore.roll(properties,fctValue);if(next)properties.push(next);calculate();}};
        render();
    }
    return {mount};
})();
