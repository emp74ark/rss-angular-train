import{a as T}from"./chunk-3UPHS55R.js";import{j as S}from"./chunk-BGIOPOK4.js";import{$a as l,$b as u,Cb as R,Hb as f,Ib as d,Pb as h,_b as O,ba as i,ea as n,ia as c,jc as C,kb as m,sb as p,za as a}from"./chunk-4LMCG722.js";var g=new i("CUSTOM_ERRORS"),M=new i("ARRAY_CONTROL_CUSTOM_ERRORS");function x(t,e){if(t&1&&(f(0,"span"),O(1),d()),t&2){let _=h();l(),u(_.error())}}var k=(()=>{let e=class e{constructor(){this.control=n(S,{self:!0}),this.errors=n(g),this.destroyRef=n(a),this.error=m(""),this.control.valueAccessor=this}ngOnInit(){this.control.control?.events.pipe(T(this.destroyRef)).subscribe(()=>{let o=this.control.name;if(o&&this.control.errors){let r=Object.keys(this.control.errors)?.[0],s=this.errors[o][r]||"Unknown error occurred";this.error.set(s)}else this.error.set("")})}writeValue(){}registerOnChange(){}registerOnTouched(){}setDisabledState(){}};e.\u0275fac=function(r){return new(r||e)},e.\u0275cmp=c({type:e,selectors:[["app-form-error-message"]],standalone:!0,features:[C],decls:1,vars:1,template:function(r,s){r&1&&p(0,x,2,1,"span"),r&2&&R(s.error()?0:-1)}});let t=e;return t})();export{g as a,M as b,k as c};