/* Real file:// and nested HTTP navigation; isolated profiles, no output files. */
const {chromium}=require('C:/Users/user/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const fs=require('node:fs'),path=require('node:path'),http=require('node:http');
const assert=require('node:assert/strict'),{pathToFileURL}=require('node:url');
const root=path.resolve(__dirname,'..'),prefix='/nested/wuwa/';
let server,browser;
(async()=>{
    server=http.createServer((req,res)=>{
        const pathname=new URL(req.url,'http://localhost').pathname;
        if(!pathname.startsWith(prefix))return res.writeHead(404).end();
        const file=path.resolve(root,decodeURIComponent(pathname.slice(prefix.length)));
        if(!file.startsWith(root+path.sep))return res.writeHead(403).end();
        fs.readFile(file,(error,content)=>{
            if(error)return res.writeHead(404).end();
            res.setHeader('Content-Type',({'.html':'text/html','.js':'text/javascript','.css':'text/css','.png':'image/png','.ico':'image/x-icon'}[path.extname(file)]||'application/octet-stream'));
            res.end(content);
        });
    });
    await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
    const bases=[pathToFileURL(root+path.sep).href,`http://127.0.0.1:${server.address().port}${prefix}`];
    browser=await chromium.launch({channel:'msedge',headless:true});
    let scenarios=0;
    for(const base of bases)for(const locale of ['zh-TW','zh-CN','en']){
        const context=await browser.newContext(),page=await context.newPage(),errors=[];
        page.on('pageerror',error=>errors.push(error.message));
        await context.route(/^https?:/,route=>new URL(route.request().url()).hostname==='127.0.0.1'?route.continue():route.abort());
        await page.goto(base+'index.html?lang='+locale);
        await page.locator('[data-ui-view=register]').click();
        await page.waitForURL(url=>url.pathname===new URL(base+'index.html').pathname&&url.searchParams.get('view')==='register');
        await page.locator('#register-shell nav').waitFor();
        for(const destination of ['index.html','register-workspace.html?mode=library','register-workspace.html?mode=compare','register-workspace.html?mode=tools','register-workspace.html?mode=backup']){
            const expected=new URL(destination,base);
            const links=page.locator('#register-shell nav a');
            const index=destination==='index.html'?0:['library','compare','tools','backup'].indexOf(expected.searchParams.get('mode'))+1;
            const actual=new URL(await links.nth(index).getAttribute('href'),page.url());
            assert.equal(actual.pathname,expected.pathname,'navigation must stay inside the project directory');
            assert.equal(actual.protocol,expected.protocol);
            assert.equal(actual.searchParams.get('lang'),locale);
            await links.nth(index).click();
            await page.waitForURL(url=>url.pathname===expected.pathname&&url.searchParams.get('mode')===expected.searchParams.get('mode'));
            await page.locator('#register-shell nav').waitFor();
        }
        await page.goto(base+'index.html?lang='+locale);
        await page.locator('[data-ui-view=classic]').click();
        await page.waitForURL(url=>url.pathname===new URL(base+'index.html').pathname&&url.searchParams.get('view')==='classic');
        await page.locator('#classic-interface-switch').waitFor();
        assert.equal(await page.locator('#register-shell').count(),0);
        assert.deepEqual(errors,[]);
        await context.close();scenarios++;
    }
    console.log(`PASS: ${scenarios} file/nested HTTP trilingual chooser + five navigation destinations + Classic scenarios.`);
})().catch(error=>{console.error(error);process.exitCode=1;}).finally(async()=>{await browser?.close();server?.close();});
