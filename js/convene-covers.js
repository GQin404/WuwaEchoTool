/* 维护封面不决定卡池身份或统计结果，可直接替换同名图片。 */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.ConveneCovers=factory();})(globalThis,function(){
'use strict';
const files=Object.freeze({1:'image/convene-current/featured-character.webp',2:'image/convene-current/featured-weapon.webp',4:'image/convene-current/standard-weapon.svg',101:'image/convene-current/collab-character.webp',102:'image/convene-current/collab-weapon.webp',104:'image/convene-current/reverb-character.svg'});
const illustrative=new Set([4,104]);
const fixedPools=new Set([4,101,102,104]);
function resolve(pool,art,{featured=false}={}){const manual=(featured||fixedPools.has(pool))&&files[pool];return {src:manual||art.src,editorial:!!manual,illustrative:!!manual&&illustrative.has(pool),mode:manual?illustrative.has(pool)?'illustration':'manual':art.hasArtwork?'mapped':'placeholder',fallbacks:[...new Set([...(manual?[art.src]:[]),art.fallback].filter(Boolean))].filter(p=>p!==(manual||art.src))};}
return {files,resolve};
});
