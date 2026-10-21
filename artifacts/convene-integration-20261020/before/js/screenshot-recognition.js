/* OCR 在本机 Worker 运行；只把右侧选中详情交给纯解析适配器。 */
(function(root){
    'use strict';
    function create({catalog,suites,rollValues,mainValues,onProgress=()=>{}}){
        let worker=null,pending=null,generation=0,rejectActive=null;
        const lines=data=>(data.blocks||[]).flatMap(b=>b.paragraphs.flatMap(p=>p.lines)).map(l=>({text:l.text,confidence:l.confidence,bbox:l.bbox,words:l.words?.map(w=>({text:w.text,bbox:w.bbox})),costBox:l.words?.find(w=>/^C[O0]ST(?:[134])?$/i.test(w.text.trim()))?.bbox}));
        async function ready(){
            if(worker)return worker;
            const started=generation;
            if(!pending)pending=(async()=>{
                onProgress({phase:'loading',progress:0});
                if(location.protocol==='file:')throw Error('engine');
                if(!root.Tesseract){await new Promise((resolve,reject)=>{const s=document.createElement('script');let timer=setTimeout(()=>{s.remove();reject(Error('engine'));},30000);s.src=new URL('library/ocr/tesseract.min.js',document.baseURI).href;s.onload=()=>{clearTimeout(timer);resolve();};s.onerror=()=>{clearTimeout(timer);s.remove();reject(Error('engine'));};document.head.append(s);});}
                if(started!==generation)throw Error('cancelled');
                // 禁用 IndexedDB 模型缓存，避免浏览器存储受限时初始化一直等待。
                const asset=path=>new URL('library/ocr/'+path,document.baseURI).href;
                const w=await root.Tesseract.createWorker('chi_tra+chi_sim+eng',1,{workerPath:asset('worker.min.js'),corePath:asset(''),langPath:asset(''),workerBlobURL:false,cacheMethod:'none',errorHandler:()=>{if(started===generation)rejectActive?.(Error('engine'));},logger:m=>{if(started===generation)onProgress({phase:m.status==='recognizing text'?'processing':'loading',progress:m.progress||0});}});
                if(started!==generation){await w.terminate();throw Error('engine');}
                worker=w;await w.setParameters({tessedit_pageseg_mode:'6',preserve_interword_spaces:'1'});return w;
            })().catch(e=>{if(started===generation)pending=null;throw e;});
            return pending;
        }
        function surface(img,rect,threshold=false,zoom=0){
            const c=document.createElement('canvas'),scale=zoom||Math.min(3,900/rect.width);c.width=Math.round(rect.width*scale);c.height=Math.round(rect.height*scale);const ctx=c.getContext('2d',{willReadFrequently:true});ctx.drawImage(img,rect.left,rect.top,rect.width,rect.height,0,0,c.width,c.height);
            if(threshold){const p=ctx.getImageData(0,0,c.width,c.height);for(let i=0;i<p.data.length;i+=4){const light=p.data[i]>160&&p.data[i+1]>160&&p.data[i+2]>120;p.data[i]=p.data[i+1]=p.data[i+2]=light?0:255;}ctx.putImageData(p,0,0);}
            return {canvas:c,scale};
        }
        async function recognize(sourceImage){
            const img=new Image();img.src=sourceImage;try{await img.decode();}catch(_){throw Error('fileError');}
            if(img.width*img.height>24000000)throw Error('size');
            const w=await ready();
            async function scan(rect,threshold=false,zoom=0){const s=surface(img,rect,threshold,zoom);const {data}=await w.recognize(s.canvas,{}, {blocks:true,text:true});return {lines:lines(data),scale:s.scale};}
            let rect={left:img.width>img.height*1.25?Math.floor(img.width*.7):0,top:0,width:img.width>img.height*1.25?img.width-Math.floor(img.width*.7):img.width,height:img.height};
            let found=await scan(rect);
            const anchors=ls=>ls.filter(l=>l.costBox&&/\bC[O0]ST\s*[:：]?\s*[134]\b/i.test(l.text));
            if(!anchors(found.lines).length&&rect.left){rect={left:0,top:0,width:img.width,height:img.height};found=await scan(rect);}
            const anchor=anchors(found.lines).sort((a,b)=>b.costBox.x0-a.costBox.x0)[0];
            if(!anchor)return ScreenshotRecognitionAdapter.empty(sourceImage);
            const box=anchor.costBox;
            const h=(box.y1-box.y0)/found.scale;
            const left=Math.max(0,rect.left+box.x0/found.scale-h*1.2),top=Math.max(0,box.y0/found.scale-h*3.2);
            // 根据 COST 锚点定位详情，而不是依赖游戏窗口的固定分辨率。
            const panel={left,top,width:img.width-left,height:Math.min(img.height-top,h*32)};
            const primary=await scan(panel),secondary=await scan(panel,true);
            await w.reinitialize('chi_tra+chi_sim',1);
            await w.setParameters({tessedit_pageseg_mode:'7'});
            const title=await scan({left,top,width:img.width-left,height:Math.max(1,box.y0/found.scale-top-h*.3)});
            await w.setParameters({tessedit_pageseg_mode:'6'});
            const chinese=await scan(panel,true);
            await w.reinitialize('chi_tra+chi_sim+eng',1);
            await w.setParameters({tessedit_pageseg_mode:'6',preserve_interword_spaces:'1'});
            const searchLines=found.lines.filter(l=>l.bbox.y1>=box.y0-h*found.scale*3.2).map(l=>{const words=l.words.filter(word=>word.bbox.x0>=box.x0-h*found.scale*1.2);return {...l,text:words.length===l.words.length?l.text:words.map(word=>word.text).join(' ')};}).filter(l=>l.text.trim());
            const results=[ScreenshotRecognitionAdapter.parse([...title.lines,...primary.lines.slice(primary.lines.findIndex(l=>/C[O0]ST/i.test(l.text)))],{catalog,suites,rollValues,mainValues,sourceImage,alternate:secondary.lines}),ScreenshotRecognitionAdapter.parse(primary.lines,{catalog,suites,rollValues,mainValues,sourceImage,alternate:secondary.lines}),ScreenshotRecognitionAdapter.parse(searchLines,{catalog,suites,rollValues,mainValues,sourceImage}),ScreenshotRecognitionAdapter.parse(secondary.lines,{catalog,suites,rollValues,mainValues,sourceImage}),ScreenshotRecognitionAdapter.parse(chinese.lines,{catalog,suites,rollValues,mainValues,sourceImage})];
            const result=results[0];
            for(const other of results.slice(1)){
                if(!result.catalogId&&other.catalogId){result.catalogId=other.catalogId;result.detectedName=other.detectedName;result.confidence.name=other.confidence.name;}
                if((!result.detectedMainStat.key||result.detectedMainStat.value==='')&&other.detectedMainStat.key&&other.detectedMainStat.value!=='')result.detectedMainStat={...other.detectedMainStat,needsReview:true};
                result.detectedSubstats=result.detectedSubstats.map((s,i)=>(!s.key||s.value==='')&&other.detectedSubstats[i].key&&other.detectedSubstats[i].value!==''?{...other.detectedSubstats[i],needsReview:true}:s);
            }
            // 仅在七行属性结构完整时重读缺失行，防止跨行补值或把技能文字当作属性。
            const costRow=primary.lines.findIndex(l=>/C[O0]ST/i.test(l.text)),endRow=primary.lines.findIndex((l,i)=>i>costRow&&/声骸技能|聲骸技能|echo\s*skill/i.test(l.text));
            const statRows=endRow<0?[]:primary.lines.slice(costRow+1,endRow);
            if(statRows.length===7&&result.detectedSubstats.some(s=>!s.key||s.value==='')){
                await w.setParameters({tessedit_pageseg_mode:'7'});
                for(let i=0;i<5;i++){
                    const current=result.detectedSubstats[i];if(current.key&&current.value!=='')continue;
                    const b=statRows[i+2].bbox,height=b.y1-b.y0,pad=height*.35;
                    const x=panel.left+(b.x0+height*.7)/primary.scale,y=Math.max(0,panel.top+(b.y0-pad)/primary.scale);
                    const row=await scan({left:x,top:y,width:Math.min(img.width-x,(b.x1-b.x0+pad-height*.7)/primary.scale),height:Math.min(img.height-y,(height+pad*2)/primary.scale)},false,3);
                    const read=row.lines.length===1?ScreenshotRecognitionAdapter.stat(row.lines[0]):null;
                    if(read&&rollValues[read.key]?.includes(read.value)&&(!current.key||current.key===read.key)&&!result.detectedSubstats.some((s,j)=>j!==i&&s.key===read.key))result.detectedSubstats[i]={...read,needsReview:true};
                }
                await w.setParameters({tessedit_pageseg_mode:'6'});
            }
            if(result.catalogId)result.suggestedCatalogIds=[];
            result.status=result.catalogId&&result.detectedMainStat.value!==''&&result.detectedSubstats.every(s=>s.key&&s.value!=='')?'review':'needsReview';
            return result;
        }
        async function dispose(){generation++;const w=worker;worker=null;pending=null;if(w)await w.terminate();}
        async function bounded(source){let timer;try{return await Promise.race([new Promise((_,reject)=>{rejectActive=reject;timer=setTimeout(()=>reject(Error('timeout')),90000);}),recognize(source)]);}catch(error){await dispose();throw error;}finally{clearTimeout(timer);rejectActive=null;}}
        function cancel(){rejectActive?.(Error('cancelled'));}
        return {recognize:bounded,dispose,cancel};
    }
    root.ScreenshotRecognition=create;
})(globalThis);
