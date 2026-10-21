/* Editorial covers are independent from a player's latest acquisition and pool identity. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.ConveneCovers=factory();})(typeof globalThis!=='undefined'?globalThis:this,function(){
'use strict';
const files=Object.freeze({1:'image/convene-current/featured-character.webp',2:'image/convene-current/featured-weapon.webp'});
function resolve(pool,art,{featured=false}={}){const manual=featured&&files[pool];return {src:manual||art.src,mode:manual?'manual':art.hasArtwork?'mapped':'placeholder',fallbacks:[...new Set([...(manual?[art.src]:[]),art.fallback].filter(Boolean))].filter(p=>p!==(manual||art.src))};}
return {files,resolve};
});
