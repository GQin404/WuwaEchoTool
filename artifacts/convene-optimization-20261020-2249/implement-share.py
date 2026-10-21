from pathlib import Path
p=Path('js/convene-share.js');t=p.read_text('utf-8')
# Asset inputs remain restricted to known local portrait namespaces.
t=t.replace("/^image\\/characters\\/[\\w-]+\\.(?:webp|png|jpe?g|avif)$/", "/^(?:image\\/characters\\/[\\w-]+\\.(?:webp|png|jpe?g|avif)|image\\/convene\\/character-fallback\\.svg)$/")
# A real local silhouette is available when missing art is not loadable; do not silently draw a rank badge as a person.
t=t.replace("portrait&&/", "(portrait=portrait||'image/convene/character-fallback.svg')&&/")
t=t.replace("text(character?t('character'):t('fortune'),56,165,20,accent)", "text(character?t('character')+(characterRating?' / R'+characterRating.target+' · '+characterRating.copies+'×':''):t('fortune'),56,165,20,accent)")
t=t.replace("text(t(characterRating?'bond.'+data.luck.title:data.luck.title),440,305,30,accent,700,500);", "text(t(characterRating?'bond.'+data.luck.title:data.luck.title),440,305,30,accent,500,500);if(characterRating)text(characterRating.score==null?'—':characterRating.score.toFixed(1),1000,305,28,accent,144,600);")
t=t.replace("text(t('characterNote'),56,historyEnd+55,20,muted);text(t('bannerSpend'),56,historyEnd+96,20,muted);", "text(characterRating?'R'+characterRating.target+' · '+t('rDraws')+' '+(characterRating.draws??'—'):t('characterNote'),56,historyEnd+55,20,muted);text(characterRating?t('rReason.'+characterRating.reason):t('bannerSpend'),56,historyEnd+96,20,muted);")
t=t.replace("text(achievement?t(achievement==='pity'?'pityAch':achievement):t('observing')", "text(achievement?t(achievement==='pity'?'pityAch':achievement):t('noAchievements')")
t=t.replace("text(achievement?t('unlocked'):t('observing.desc')", "text(achievement?t('unlocked'):t('achievementNext')")
t=t.replace("text('✦',80,727,37,gold,50);", "if(achievement)Visuals.drawAchievement(x,achievement,80,685,40);else text('✦',80,727,37,gold,50);")
p.write_text(t,encoding='utf-8')
p=Path('js/convene-ui.js');t=p.read_text('utf-8');t=t.replace("targetR=0,ratingScope", "searchTimer=null,targetR=0,ratingScope",1)
# R selector applies to original character shares too; unrelated target-only toggles stay target-only.
t=t.replace("+'</select></label><label class=\"cv-check\"><input type=\"checkbox\" data-share-excess", "+'</select></label>':'')+(shareTarget?'<label class=\"cv-check\"><input type=\"checkbox\" data-share-excess")
t=t.replace("if(el.dataset.filter){filters", "if(el.dataset.filter){if(el.dataset.filter==='search')clearTimeout(searchTimer);filters")
t=t.replace("if(e.target.name!=='url')return;", "if(e.target.dataset.filter==='search'){clearTimeout(searchTimer);const value=e.target.value,position=e.target.selectionStart;searchTimer=setTimeout(()=>{if(view!=='history')return;filters.search=value;page=0;render();const input=host.querySelector('[data-filter=search]');input?.focus();input?.setSelectionRange(position,position);},220);return;}if(e.target.name!=='url')return;")
# Per-acquisition state has a concise explicit label without changing stored values.
t=t.replace("+'★ · '+esc(poolName(r.pool))+'</small></div>", "+'★ · '+esc(poolName(r.pool))+'</small><span class=\"cv-visible-state\">'+esc(t('acquisitionState'))+'</span></div>")
p.write_text(t,encoding='utf-8')
p=Path('js/convene-i18n.js');t=p.read_text('utf-8');import json
t=t.replace('function create(locale=','Object.assign(rows,'+json.dumps({'noAchievements':['成就等待點亮','成就等待点亮','No achievements unlocked'],'achievementNext':['只依目前存檔判定，保留每一步共鳴。','仅依据当前存档判定，保留每一步共鸣。','Based on the visible archive. Keep each resonance.']},ensure_ascii=False)+');\nfunction create(locale=');p.write_text(t,encoding='utf-8')
