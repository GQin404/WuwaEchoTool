/* 仅增强现有控件的展示；筛选、排序与写入仍由各页面负责。 */
(function(root){
 'use strict';
 const hosts=new WeakMap(),configs=[
  {key:'roles',search:'[data-dock-search]',group:'.dock-filters',legacy:'[data-dock-picker]',reset:'[data-dock-reset]',count:'.dock-index .op-count'},
  {key:'library',search:'[data-library-filter="search"]',group:'.rw-filters',reset:'[data-library-reset]',count:'[data-library-count]'},
  {key:'candidate',search:'[data-rc-filter="search"]',group:'.op-filters',reset:'[data-rc-reset]',count:'.rr-candidate-surface .op-count'},
  {key:'history',search:'[data-history-filter="search"]',group:'.op-filters',reset:'[data-history-reset]',count:'.op-count'},
  {key:'import',search:'#ri-search'}
 ];
 function isDefault(el){const key=el.dataset.libraryFilter||el.dataset.libraryField||el.dataset.rcFilter||el.dataset.historyFilter||(['source','status','sort'].find(k=>el.hasAttribute('data-dock-'+k)))||'';const def=key==='sort'?'recent':key==='source'||key==='status'?'all':'';return el.type==='checkbox'?!el.checked:el.multiple?![...el.selectedOptions].some(o=>o.value!==def):el.value===def;}
 function count(panel){return [...panel.querySelectorAll('select,input')].filter(el=>!isDefault(el)).length;}
 function enhance(host,i18n,options={}){
  if(!host?.querySelector)return;
  let state=hosts.get(host);if(!state){state={open:{},i18n};hosts.set(host,state);
   host.addEventListener('toggle',e=>{const details=e.target;if(!details.matches?.('.sf-advanced'))return;state.open[details.dataset.sfKey]=details.open;details.querySelector('summary').setAttribute('aria-expanded',String(details.open));},true);
   host.addEventListener('click',e=>{const summary=e.target.closest('.sf-advanced>summary');if(summary){const details=summary.parentElement;if(!details.open){state.open[details.dataset.sfKey]=true;summary.setAttribute('aria-expanded','true');}else if(matchMedia('(prefers-reduced-motion:reduce)').matches){state.open[details.dataset.sfKey]=false;summary.setAttribute('aria-expanded','false');}if(details.open&&!matchMedia('(prefers-reduced-motion:reduce)').matches){e.preventDefault();if(details._sfTimer){clearTimeout(details._sfTimer);details._sfTimer=null;details.classList.remove('sf-closing');state.open[details.dataset.sfKey]=true;}else{state.open[details.dataset.sfKey]=false;details.classList.add('sf-closing');details._sfTimer=setTimeout(()=>{details.open=false;details.classList.remove('sf-closing');details._sfTimer=null;},180);}return;}}const button=e.target.closest('[data-sf-reset]');if(!button)return;const widget=button.closest('.sf-search');for(const input of widget.querySelectorAll('input,select')){if(input.type==='checkbox')input.checked=false;else input.value='';input.dispatchEvent(new Event(input.tagName==='SELECT'?'change':'input',{bubbles:true}));}});
  }state.i18n=i18n;
  for(const config of configs){
   const input=host.querySelector(config.search);if(!input)continue;
   let widget=input.closest('.sf-search');
   if(!widget){
    const group=config.group?input.closest(config.group):null,legacy=config.legacy?input.closest(config.legacy):null;
    widget=document.createElement('section');widget.className='sf-search';widget.dataset.sfKey=config.key;
    let label=input.closest('label');if(!label){label=host.querySelector('label[for="'+input.id+'"]')||document.createElement('label');label.append(input);}label.classList.add('sf-query');
    if(legacy){const heading=legacy.parentElement;heading.after(widget);legacy.remove();}
    else if(group)group.before(widget);else label.before(widget);
    widget.append(label);
    if(group){
     const details=document.createElement('details'),summary=document.createElement('summary');details.className='sf-advanced';details.dataset.sfKey=config.key;details.open=!!state.open[config.key];
     if(legacy)details.setAttribute('data-dock-picker','');
     summary.setAttribute('role','button');summary.setAttribute('aria-controls','sf-panel-'+config.key);details.append(summary);group.id='sf-panel-'+config.key;group.classList.add('sf-panel');details.append(group);widget.append(details);
    }
    const actions=document.createElement('div');actions.className='sf-actions';widget.append(actions);
    if(!config.reset){const reset=document.createElement('button');reset.type='button';reset.dataset.sfReset='';actions.append(reset);}
   }
   const details=widget.querySelector('.sf-advanced');if(details){const summary=details.querySelector('summary'),n=count(details);summary.textContent=i18n.t('ops.advanced')+(n?' ('+n+')':'');summary.setAttribute('aria-expanded',String(details.open));summary.setAttribute('aria-controls','sf-panel-'+config.key);}
   const actions=widget.querySelector('.sf-actions');
   const resets=config.reset?[...host.querySelectorAll(config.reset)]:[],reset=config.reset?(resets.find(e=>!widget.contains(e))||resets[0]):widget.querySelector('[data-sf-reset]');if(reset){reset.textContent=i18n.t('ops.reset');if(reset.parentElement!==actions){actions.querySelector('button')?.remove();actions.append(reset);}}
   if(config.count){const candidates=[...host.querySelectorAll(config.count)],fresh=candidates.find(e=>!widget.contains(e));if(fresh){widget.querySelector('.sf-results')?.remove();fresh.classList.add('sf-results');widget.append(fresh);}}
   if(config.key==='import'){let result=widget.querySelector('.sf-results');if(!result){result=document.createElement('p');result.className='sf-results';widget.append(result);}result.textContent=i18n.t('ops.count',{matched:host.querySelectorAll('#ri-rows .ri-row').length,total:options.importTotal??0});}
  }
 }
 root.RegisterSearchUI={enhance,count};
})(globalThis);
