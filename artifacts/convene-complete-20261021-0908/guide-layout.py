from pathlib import Path
p=Path('js/convene-ui.js');t=p.read_text('utf-8')
actions="<div class=\"cv-actions\">'+button('psCopy','data-copy-windows class=\"cv-primary\"')+button('psDownload','data-download-windows')+'</div><p data-command-status role=\"status\"></p>"
assert actions in t
t=t.replace(actions,"")
needle="+'</div><figure class=\"cv-guide-diagram\"><div>'"
assert needle in t
quick="+'</div>'+(windows?'<section class=\"cv-windows-quick\"><h3>'+esc(t('psTitle'))+'</h3><p>'+esc(t('psScope'))+'</p><div class=\"cv-actions\">'+button('psCopy','data-copy-windows class=\"cv-primary\"')+button('psDownload','data-download-windows')+'</div><p data-command-status role=\"status\"></p></section>':'')+'<figure class=\"cv-guide-diagram\"><div>'"
t=t.replace(needle,quick)
# Keep the lower section as inspect/fallback/source, without repeating the introductory copy.
t=t.replace("<h3>'+esc(t('psTitle'))+'</h3><p>'+esc(t('psScope'))+'</p><details", "<details")
p.write_text(t,encoding='utf-8',newline='\n')
print('Moved actual copy/download controls ahead of diagrams and steps for an actionable first screen.')
