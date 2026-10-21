/* Editorial covers never determine pool identity or calculations. Replace files in-place. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.ConveneCovers=factory();})(globalThis,function(){
'use strict';
const files=Object.freeze({1:'image/convene-current/featured-character.webp',2:'image/convene-current/featured-weapon.webp',4:'image/convene-current/standard-weapon.svg',101:'image/convene-current/collab-character.svg',102:'image/convene-current/collab-weapon.svg',104:'image/convene-current/reverb-character.svg'});
const illustrative=new Set([4,101,102,104]);
function resolve(pool,art,{featured=false}={}){const manual=(featured||illustrative.has(pool))&&files[pool];return {src:manual||art.src,editorial:!!manual,illustrative:!!manual&&illustrative.has(pool),mode:manual?illustrative.has(pool)?'illustration':'manual':art.hasArtwork?'mapped':'placeholder',fallbacks:[...new Set([...(manual?[art.src]:[]),art.fallback].filter(Boolean))].filter(p=>p!==(manual||art.src))};}
return {files,resolve};
});
