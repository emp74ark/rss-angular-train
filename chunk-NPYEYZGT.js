import{a as ct}from"./chunk-IDJFH4JO.js";import{a as it,g as rt,k as st,ka as A}from"./chunk-AD6NZPMH.js";import{d as T}from"./chunk-DVTAY4W2.js";import{$a as g,$b as nt,B as L,Bb as J,Ca as E,Cc as ot,F as O,Fa as H,Gb as K,Hb as Q,J as x,O as D,Qb as X,Rb as Z,Sb as tt,V as S,Wa as d,Z as U,_ as P,_a as W,_b as et,a as N,aa as p,ca as _,da as m,ha as C,ia as j,jc as F,l as f,lb as $,m as b,p as u,qb as B,tb as V,ub as Y,v as M,wa as k,xb as q,ya as z,zb as G}from"./chunk-JA5R5AR2.js";var at=new p("CUSTOM_ERRORS");function gt(i,s){if(i&1&&(K(0,"span"),et(1),Q()),i&2){let R=X();W(),nt(R.error())}}var Ot=(()=>{let s=class s{constructor(){this.control=m(st,{self:!0}),this.errors=m(at),this.destroyRef=m(z),this.error=$(""),this.control.valueAccessor=this}ngOnInit(){this.control.control?.events.pipe(ct(this.destroyRef)).subscribe(()=>{let t=this.control.name;if(t&&this.control.errors){let e=Object.keys(this.control.errors)?.[0],n=this.errors[t][e]||"Unknown error occurred";this.error.set(n)}else this.error.set("")})}writeValue(){}registerOnChange(){}registerOnTouched(){}setDisabledState(){}};s.\u0275fac=function(e){return new(e||s)},s.\u0275cmp=C({type:s,selectors:[["app-form-error-message"]],standalone:!0,features:[F],decls:1,vars:1,template:function(e,n){e&1&&V(0,gt,2,1,"span"),e&2&&J(n.error()?0:-1)}});let i=s;return i})();var pt=["*"],w;function _t(){if(w===void 0&&(w=null,typeof window<"u")){let i=window;i.trustedTypes!==void 0&&(w=i.trustedTypes.createPolicy("angular#components",{createHTML:s=>s}))}return w}function v(i){return _t()?.createHTML(i)||i}function lt(i){return Error(`Unable to find icon with the name "${i}"`)}function vt(){return Error("Could not find HttpClient for use with Angular Material icons. Please add provideHttpClient() to your providers.")}function ht(i){return Error(`The URL provided to MatIconRegistry was not trusted as a resource URL via Angular's DomSanitizer. Attempted URL was "${i}".`)}function ft(i){return Error(`The literal provided to MatIconRegistry was not trusted as safe HTML by Angular's DomSanitizer. Attempted literal was "${i}".`)}var a=class{constructor(s,R,t){this.url=s,this.svgText=R,this.options=t}},It=(()=>{let s=class s{constructor(t,e,n,o){this._httpClient=t,this._sanitizer=e,this._errorHandler=o,this._svgIconConfigs=new Map,this._iconSetConfigs=new Map,this._cachedIconsByUrl=new Map,this._inProgressUrlFetches=new Map,this._fontCssClassesByAlias=new Map,this._resolvers=[],this._defaultFontSetClass=["material-icons","mat-ligature-font"],this._document=n}addSvgIcon(t,e,n){return this.addSvgIconInNamespace("",t,e,n)}addSvgIconLiteral(t,e,n){return this.addSvgIconLiteralInNamespace("",t,e,n)}addSvgIconInNamespace(t,e,n,o){return this._addSvgIconConfig(t,e,new a(n,null,o))}addSvgIconResolver(t){return this._resolvers.push(t),this}addSvgIconLiteralInNamespace(t,e,n,o){let r=this._sanitizer.sanitize(d.HTML,n);if(!r)throw ft(n);let c=v(r);return this._addSvgIconConfig(t,e,new a("",c,o))}addSvgIconSet(t,e){return this.addSvgIconSetInNamespace("",t,e)}addSvgIconSetLiteral(t,e){return this.addSvgIconSetLiteralInNamespace("",t,e)}addSvgIconSetInNamespace(t,e,n){return this._addSvgIconSetConfig(t,new a(e,null,n))}addSvgIconSetLiteralInNamespace(t,e,n){let o=this._sanitizer.sanitize(d.HTML,e);if(!o)throw ft(e);let r=v(o);return this._addSvgIconSetConfig(t,new a("",r,n))}registerFontClassAlias(t,e=t){return this._fontCssClassesByAlias.set(t,e),this}classNameForFontAlias(t){return this._fontCssClassesByAlias.get(t)||t}setDefaultFontSetClass(...t){return this._defaultFontSetClass=t,this}getDefaultFontSetClass(){return this._defaultFontSetClass}getSvgIconFromUrl(t){let e=this._sanitizer.sanitize(d.RESOURCE_URL,t);if(!e)throw ht(t);let n=this._cachedIconsByUrl.get(e);return n?f(y(n)):this._loadSvgIconFromConfig(new a(t,null)).pipe(S(o=>this._cachedIconsByUrl.set(e,o)),u(o=>y(o)))}getNamedSvgIcon(t,e=""){let n=ut(e,t),o=this._svgIconConfigs.get(n);if(o)return this._getSvgFromConfig(o);if(o=this._getIconConfigFromResolvers(e,t),o)return this._svgIconConfigs.set(n,o),this._getSvgFromConfig(o);let r=this._iconSetConfigs.get(e);return r?this._getSvgFromIconSetConfigs(t,r):b(lt(n))}ngOnDestroy(){this._resolvers=[],this._svgIconConfigs.clear(),this._iconSetConfigs.clear(),this._cachedIconsByUrl.clear()}_getSvgFromConfig(t){return t.svgText?f(y(this._svgElementFromConfig(t))):this._loadSvgIconFromConfig(t).pipe(u(e=>y(e)))}_getSvgFromIconSetConfigs(t,e){let n=this._extractIconWithNameFromAnySet(t,e);if(n)return f(n);let o=e.filter(r=>!r.svgText).map(r=>this._loadSvgIconSetFromConfig(r).pipe(L(c=>{let h=`Loading icon set URL: ${this._sanitizer.sanitize(d.RESOURCE_URL,r.url)} failed: ${c.message}`;return this._errorHandler.handleError(new Error(h)),f(null)})));return M(o).pipe(u(()=>{let r=this._extractIconWithNameFromAnySet(t,e);if(!r)throw lt(t);return r}))}_extractIconWithNameFromAnySet(t,e){for(let n=e.length-1;n>=0;n--){let o=e[n];if(o.svgText&&o.svgText.toString().indexOf(t)>-1){let r=this._svgElementFromConfig(o),c=this._extractSvgIconFromSet(r,t,o.options);if(c)return c}}return null}_loadSvgIconFromConfig(t){return this._fetchIcon(t).pipe(S(e=>t.svgText=e),u(()=>this._svgElementFromConfig(t)))}_loadSvgIconSetFromConfig(t){return t.svgText?f(null):this._fetchIcon(t).pipe(S(e=>t.svgText=e))}_extractSvgIconFromSet(t,e,n){let o=t.querySelector(`[id="${e}"]`);if(!o)return null;let r=o.cloneNode(!0);if(r.removeAttribute("id"),r.nodeName.toLowerCase()==="svg")return this._setSvgAttributes(r,n);if(r.nodeName.toLowerCase()==="symbol")return this._setSvgAttributes(this._toSvgElement(r),n);let c=this._svgElementFromString(v("<svg></svg>"));return c.appendChild(r),this._setSvgAttributes(c,n)}_svgElementFromString(t){let e=this._document.createElement("DIV");e.innerHTML=t;let n=e.querySelector("svg");if(!n)throw Error("<svg> tag not found");return n}_toSvgElement(t){let e=this._svgElementFromString(v("<svg></svg>")),n=t.attributes;for(let o=0;o<n.length;o++){let{name:r,value:c}=n[o];r!=="id"&&e.setAttribute(r,c)}for(let o=0;o<t.childNodes.length;o++)t.childNodes[o].nodeType===this._document.ELEMENT_NODE&&e.appendChild(t.childNodes[o].cloneNode(!0));return e}_setSvgAttributes(t,e){return t.setAttribute("fit",""),t.setAttribute("height","100%"),t.setAttribute("width","100%"),t.setAttribute("preserveAspectRatio","xMidYMid meet"),t.setAttribute("focusable","false"),e&&e.viewBox&&t.setAttribute("viewBox",e.viewBox),t}_fetchIcon(t){let{url:e,options:n}=t,o=n?.withCredentials??!1;if(!this._httpClient)throw vt();if(e==null)throw Error(`Cannot fetch icon from URL "${e}".`);let r=this._sanitizer.sanitize(d.RESOURCE_URL,e);if(!r)throw ht(e);let c=this._inProgressUrlFetches.get(r);if(c)return c;let l=this._httpClient.get(r,{responseType:"text",withCredentials:o}).pipe(u(h=>v(h)),x(()=>this._inProgressUrlFetches.delete(r)),D());return this._inProgressUrlFetches.set(r,l),l}_addSvgIconConfig(t,e,n){return this._svgIconConfigs.set(ut(t,e),n),this}_addSvgIconSetConfig(t,e){let n=this._iconSetConfigs.get(t);return n?n.push(e):this._iconSetConfigs.set(t,[e]),this}_svgElementFromConfig(t){if(!t.svgElement){let e=this._svgElementFromString(t.svgText);this._setSvgAttributes(e,t.options),t.svgElement=e}return t.svgElement}_getIconConfigFromResolvers(t,e){for(let n=0;n<this._resolvers.length;n++){let o=this._resolvers[n](e,t);if(o)return St(o)?new a(o.url,null,o.options):new a(o,null)}}};s.\u0275fac=function(e){return new(e||s)(_(it,8),_(rt),_(T,8),_(E))},s.\u0275prov=U({token:s,factory:s.\u0275fac,providedIn:"root"});let i=s;return i})();function y(i){return i.cloneNode(!0)}function ut(i,s){return i+":"+s}function St(i){return!!(i.url&&i.options)}var Ct=new p("MAT_ICON_DEFAULT_OPTIONS"),Et=new p("mat-icon-location",{providedIn:"root",factory:Ft});function Ft(){let i=m(T),s=i?i.location:null;return{getPathname:()=>s?s.pathname+s.search:""}}var mt=["clip-path","color-profile","src","cursor","fill","filter","marker","marker-start","marker-mid","marker-end","mask","stroke"],wt=mt.map(i=>`[${i}]`).join(", "),yt=/^url\(['"]?#(.*?)['"]?\)$/,Xt=(()=>{let s=class s{get color(){return this._color||this._defaultColor}set color(t){this._color=t}get svgIcon(){return this._svgIcon}set svgIcon(t){t!==this._svgIcon&&(t?this._updateSvgIcon(t):this._svgIcon&&this._clearSvgElement(),this._svgIcon=t)}get fontSet(){return this._fontSet}set fontSet(t){let e=this._cleanupFontValue(t);e!==this._fontSet&&(this._fontSet=e,this._updateFontIconClasses())}get fontIcon(){return this._fontIcon}set fontIcon(t){let e=this._cleanupFontValue(t);e!==this._fontIcon&&(this._fontIcon=e,this._updateFontIconClasses())}constructor(t,e,n,o,r,c){this._elementRef=t,this._iconRegistry=e,this._location=o,this._errorHandler=r,this.inline=!1,this._previousFontSetClass=[],this._currentIconFetch=N.EMPTY,c&&(c.color&&(this.color=this._defaultColor=c.color),c.fontSet&&(this.fontSet=c.fontSet)),n||t.nativeElement.setAttribute("aria-hidden","true")}_splitIconName(t){if(!t)return["",""];let e=t.split(":");switch(e.length){case 1:return["",e[0]];case 2:return e;default:throw Error(`Invalid icon name: "${t}"`)}}ngOnInit(){this._updateFontIconClasses()}ngAfterViewChecked(){let t=this._elementsWithExternalReferences;if(t&&t.size){let e=this._location.getPathname();e!==this._previousPath&&(this._previousPath=e,this._prependPathToReferences(e))}}ngOnDestroy(){this._currentIconFetch.unsubscribe(),this._elementsWithExternalReferences&&this._elementsWithExternalReferences.clear()}_usingFontIcon(){return!this.svgIcon}_setSvgElement(t){this._clearSvgElement();let e=this._location.getPathname();this._previousPath=e,this._cacheChildrenWithExternalReferences(t),this._prependPathToReferences(e),this._elementRef.nativeElement.appendChild(t)}_clearSvgElement(){let t=this._elementRef.nativeElement,e=t.childNodes.length;for(this._elementsWithExternalReferences&&this._elementsWithExternalReferences.clear();e--;){let n=t.childNodes[e];(n.nodeType!==1||n.nodeName.toLowerCase()==="svg")&&n.remove()}}_updateFontIconClasses(){if(!this._usingFontIcon())return;let t=this._elementRef.nativeElement,e=(this.fontSet?this._iconRegistry.classNameForFontAlias(this.fontSet).split(/ +/):this._iconRegistry.getDefaultFontSetClass()).filter(n=>n.length>0);this._previousFontSetClass.forEach(n=>t.classList.remove(n)),e.forEach(n=>t.classList.add(n)),this._previousFontSetClass=e,this.fontIcon!==this._previousFontIconClass&&!e.includes("mat-ligature-font")&&(this._previousFontIconClass&&t.classList.remove(this._previousFontIconClass),this.fontIcon&&t.classList.add(this.fontIcon),this._previousFontIconClass=this.fontIcon)}_cleanupFontValue(t){return typeof t=="string"?t.trim().split(" ")[0]:t}_prependPathToReferences(t){let e=this._elementsWithExternalReferences;e&&e.forEach((n,o)=>{n.forEach(r=>{o.setAttribute(r.name,`url('${t}#${r.value}')`)})})}_cacheChildrenWithExternalReferences(t){let e=t.querySelectorAll(wt),n=this._elementsWithExternalReferences=this._elementsWithExternalReferences||new Map;for(let o=0;o<e.length;o++)mt.forEach(r=>{let c=e[o],l=c.getAttribute(r),h=l?l.match(yt):null;if(h){let I=n.get(c);I||(I=[],n.set(c,I)),I.push({name:r,value:h[1]})}})}_updateSvgIcon(t){if(this._svgNamespace=null,this._svgName=null,this._currentIconFetch.unsubscribe(),t){let[e,n]=this._splitIconName(t);e&&(this._svgNamespace=e),n&&(this._svgName=n),this._currentIconFetch=this._iconRegistry.getNamedSvgIcon(n,e).pipe(O(1)).subscribe(o=>this._setSvgElement(o),o=>{let r=`Error retrieving icon ${e}:${n}! ${o.message}`;this._errorHandler.handleError(new Error(r))})}}};s.\u0275fac=function(e){return new(e||s)(g(H),g(It),k("aria-hidden"),g(Et),g(E),g(Ct,8))},s.\u0275cmp=C({type:s,selectors:[["mat-icon"]],hostAttrs:["role","img",1,"mat-icon","notranslate"],hostVars:10,hostBindings:function(e,n){e&2&&(Y("data-mat-icon-type",n._usingFontIcon()?"font":"svg")("data-mat-icon-name",n._svgName||n.fontIcon)("data-mat-icon-namespace",n._svgNamespace||n.fontSet)("fontIcon",n._usingFontIcon()?n.fontIcon:null),G(n.color?"mat-"+n.color:""),q("mat-icon-inline",n.inline)("mat-icon-no-color",n.color!=="primary"&&n.color!=="accent"&&n.color!=="warn"))},inputs:{color:"color",inline:[2,"inline","inline",ot],svgIcon:"svgIcon",fontSet:"fontSet",fontIcon:"fontIcon"},exportAs:["matIcon"],standalone:!0,features:[B,F],ngContentSelectors:pt,decls:1,vars:0,template:function(e,n){e&1&&(Z(),tt(0))},styles:["mat-icon,mat-icon.mat-primary,mat-icon.mat-accent,mat-icon.mat-warn{color:var(--mat-icon-color)}.mat-icon{-webkit-user-select:none;user-select:none;background-repeat:no-repeat;display:inline-block;fill:currentColor;height:24px;width:24px;overflow:hidden}.mat-icon.mat-icon-inline{font-size:inherit;height:inherit;line-height:inherit;width:inherit}.mat-icon.mat-ligature-font[fontIcon]::before{content:attr(fontIcon)}[dir=rtl] .mat-icon-rtl-mirror{transform:scale(-1, 1)}.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-prefix .mat-icon,.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-suffix .mat-icon{display:block}.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-prefix .mat-icon-button .mat-icon,.mat-form-field:not(.mat-form-field-appearance-legacy) .mat-form-field-suffix .mat-icon-button .mat-icon{margin:auto}"],encapsulation:2,changeDetection:0});let i=s;return i})(),Zt=(()=>{let s=class s{};s.\u0275fac=function(e){return new(e||s)},s.\u0275mod=j({type:s}),s.\u0275inj=P({imports:[A,A]});let i=s;return i})();export{at as a,Ot as b,Xt as c,Zt as d};
