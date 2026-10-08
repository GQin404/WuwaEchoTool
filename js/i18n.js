(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory(require('./i18n-dictionaries.js'));else root.EchoI18n=factory(root.EchoDictionaries);})(typeof globalThis!=='undefined'?globalThis:this,function(dictionaries){
    'use strict';
    const FALLBACK='zh-TW', STORAGE_KEY='wuwa.ui.locale';
    function supported(tag){
        if(typeof tag!=='string')return null;
        let loc;try{loc=new Intl.Locale(tag.trim().replace(/_/g,'-'));}catch(_){return null;}
        if(loc.language==='en')return 'en';
        if(loc.language!=='zh')return null;
        if(['TW','HK','MO'].includes(loc.region))return 'zh-TW';
        if(['CN','SG'].includes(loc.region))return 'zh-CN';
        if(loc.script==='Hans')return 'zh-CN';
        return 'zh-TW';
    }
    function resolveLocale({manual,url,languages=[],language}={}){
        for(const [source,value] of [['manual',manual],['url',url]]){const locale=supported(value);if(locale)return {locale,source};}
        const browser=[...(Array.isArray(languages)?languages:[]),language];
        for(const value of browser){const locale=supported(value);if(locale)return {locale,source:'browser'};}
        return {locale:FALLBACK,source:'fallback'};
    }
    function create({storage,document:doc,languages=[],language,url='',messages=dictionaries}={}){
        let manual=null,urlLanguage=null;
        try{manual=storage?.getItem(STORAGE_KEY);}catch(_){/* 浏览器可能禁止访问偏好存储。 */}
        try{urlLanguage=new URL(url,'https://local.invalid/').searchParams.get('lang');}catch(_){}
        let state=resolveLocale({manual,url:urlLanguage,languages,language});
        const listeners=new Set();
        function sync(){if(doc?.documentElement)doc.documentElement.lang=state.locale;}
        sync();
        function t(key,params={}){
            const template=messages?.[state.locale]?.[key]??messages?.[FALLBACK]?.[key];
            if(typeof template!=='string')return '['+key+']';
            return template.replace(/\{([\w]+)\}/g,(match,name)=>Object.hasOwn(params,name)?String(params[name]):match);
        }
        const finite=n=>typeof n==='number'&&Number.isFinite(n);
        function number(value,options={}){return finite(value)?new Intl.NumberFormat(state.locale,options).format(value):t('common.unavailable');}
        const format={
            integer:(n)=>number(n,{maximumFractionDigits:0}),
            decimal:(n,digits=2)=>number(n,{minimumFractionDigits:0,maximumFractionDigits:digits}),
            // 数据值 6.3 表示 6.3%，不是比例 .063；仅在显示时换算。
            percentage:(n,digits=1)=>finite(n)?number(n/100,{style:'percent',maximumFractionDigits:digits}):t('common.unavailable'),
            percentagePoint:(n,digits=1)=>finite(n)?t('format.percentagePoint',{value:number(n,{maximumFractionDigits:digits,signDisplay:'exceptZero'})}):t('common.unavailable'),
            score:(n)=>finite(n)?t('format.score',{value:number(n,{minimumFractionDigits:2,maximumFractionDigits:2})}):t('common.unavailable'),
            dateTime:(value,options={})=>{
                if(!(value instanceof Date)&&typeof value!=='string'&&typeof value!=='number')return t('common.unavailable');
                if(value==='')return t('common.unavailable');
                const date=value instanceof Date?value:new Date(value);
                return Number.isFinite(date.getTime())?new Intl.DateTimeFormat(state.locale,{dateStyle:'medium',timeStyle:'short',...options}).format(date):t('common.unavailable');
            }
        };
        return {
            get locale(){return state.locale;},get source(){return state.source;},t,format,
            setLocale(locale){
                // 仅由用户手动切换调用，自动检测不写入偏好。
                if(!['zh-TW','zh-CN','en'].includes(locale))throw new RangeError('Unsupported locale');
                state={locale,source:'manual'};let persisted=false;
                try{if(storage){storage.setItem(STORAGE_KEY,locale);persisted=true;}}catch(_){}
                sync();listeners.forEach(fn=>fn({...state}));return {locale,persisted};
            },
            subscribe(fn){if(typeof fn!=='function')throw new TypeError('Expected listener');listeners.add(fn);return ()=>listeners.delete(fn);},
            entity(namespace,id,fallback=null){const key=namespace+'.'+id;return messages?.[state.locale]?.[key]??messages?.[FALLBACK]?.[key]??fallback??'['+key+']';}
        };
    }
    function createBrowser(env){
        // Classic 固定简体中文，但不读取或覆盖 Register 的语言偏好。
        if(env.UiView?.state.effective==='classic'&&new URL(env.location.href).searchParams.get('guide')!=='1')return create({document:env.document,language:'zh-CN'});
        let storage;try{storage=env.localStorage;}catch(_){}
        return create({storage,document:env.document,languages:env.navigator?.languages,language:env.navigator?.language,url:env.location?.href});
    }
    return {resolveLocale,supported,create,createBrowser,STORAGE_KEY,FALLBACK};
});
