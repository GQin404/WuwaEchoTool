/* Add only verified resource IDs, exact locale aliases and licensed local artwork.
 * Empty by design: the repository currently contains no verified official weapon images.
 * See docs/weapon-artwork.md. Synthetic IDs belong in tests only. */
(function(root,factory){if(typeof module==='object'&&module.exports)module.exports=factory();else root.WeaponCatalog=factory();})(typeof globalThis!=='undefined'?globalThis:this,()=>({version:1,weapons:[]}));
