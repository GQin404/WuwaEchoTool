/* 展示适配层保留 Classic 统计范围；不重新计算或写入角色分数。 */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.RegisterOverview=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
    function prepare(records,normalize,calculate){
        const imported=records.some(r=>r.isImport),selected=records.filter(r=>imported?!!r.isImport:!r.isImport);
        const complete=r=>['number','string'].includes(typeof r.totalScore)&&Number.isFinite(parseFloat(r.totalScore))&&Number.isFinite(Number(r.totalScore))&&Number(r.totalScore)>=0&&normalize(r).summary.status==='complete';
        const completeRecords=new Set(records.filter(complete));
        const ready=selected.filter(r=>completeRecords.has(r)),allReady=completeRecords.size;
        // 部分数据仅展示已确认的分布，不以子集生成全范围总分或称号。
        const available=selected.length>0&&ready.length===selected.length;
        const result=available?calculate(records):null;
        return {total:records.length,completed:allReady,remaining:records.length-allReady,source:imported?'imported':'manual',count:selected.length,ready:ready.length,pending:selected.length-ready.length,bys:result?.bys||(ready.length?calculate(ready).bys:null),result};
    }
    function render(data,i18n){
        const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
        const t=(k,p)=>esc(i18n.t('overview.'+k,p)),f=i18n.format,r=data.result;
        const bands=['> 90','> 80 · ≤ 90','> 70 · ≤ 80','> 60 · ≤ 70'];
        const counts=data.bys?Object.values(data.bys):[null,null,null,null];
        // 概况对应完整角色列表；分布及鉴定继续使用既有来源优先规则。
        let content='<dl class="rr-overview-counts">'+[['total',data.total],['completed',data.completed],['remaining',data.remaining]].map(([key,value])=>'<div><dt>'+t(key)+'</dt><dd>'+esc(f.integer(value))+'</dd></div>').join('')+'</dl>';
        if(!data.total)content+='<p class="rr-overview-empty">'+t('noRoles')+'</p>';
        content+='<div class="rr-overview-heading"><h3>'+t('distribution')+'</h3><details class="rr-overview-info"><summary>'+t('info')+'</summary><p>'+t('shortInfo')+'</p></details></div><div class="rr-overview-bands">'+counts.map((count,i)=>'<div><h3>'+t('band'+i)+'</h3><small>'+esc(bands[i])+'</small><strong>'+ (count===null?'—':t('count',{count:f.integer(count)}))+'</strong></div>').join('')+'</div>';
        if(data.total)content+='<p class="rr-overview-hint">'+t('completedOnly')+'</p>';
        if(r){
            const readings=[['sum',f.decimal(Number(r.sumScore),2)],['avg',f.decimal(Number(r.avgScore),2)],['grade',i18n.t('overview.appraisal.'+r.appraisal.level+'.dj')],['rank',i18n.t('overview.appraisal.'+r.appraisal.level+'.ps')]];
            content+='<section class="rr-overview-appraisal"><h3>'+t('appraisal')+'</h3><dl class="rr-overview-readings">'+readings.map(([k,v])=>'<div><dt>'+t(k)+'</dt><dd>'+esc(v)+'</dd></div>').join('')+'</dl><p class="rr-overview-comment">'+t('appraisal.'+r.appraisal.level+'.say')+'</p></section>';
        }else if(data.total){content+='<p class="rr-overview-empty" role="status">'+t('finishForAppraisal')+'</p>';}
        return '<section id="cultivation-overview" class="rr-cultivation-overview" aria-labelledby="cultivation-title"><h2 id="cultivation-title">'+t('title')+'</h2>'+content+'</section>';
    }
    return {prepare,render};
});
