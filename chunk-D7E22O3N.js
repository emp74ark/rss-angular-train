import{a as O,b as R,d as j,e as z,f as B,g as G,h as N}from"./chunk-6FOTKAWA.js";import{d as V,e as E}from"./chunk-3UPHS55R.js";import{ha as L}from"./chunk-LZO44IQN.js";import{$a as t,$b as b,Cb as D,Hb as l,Ib as s,Jb as T,Kb as C,Nb as y,Pb as x,Rc as A,_b as p,ac as S,ea as f,fc as I,gc as h,hc as w,ia as v,jc as F,kc as i,sa as g,sb as k,ta as _,wb as o}from"./chunk-4LMCG722.js";var Q=()=>({"text-align":"center"}),U=()=>({display:"flex","justify-content":"center","align-items":"center"}),W=()=>({"font-size":"70px",height:"70px",width:"70px"}),X=()=>({display:"flex","justify-content":"center","align-items":"center",gap:"10px","flex-wrap":"nowrap"}),q=()=>({flex:"1 1 50%"});function Y(a,n){if(a&1){let u=C();l(0,"button",5),y("click",function(){g(u);let r=x();return _(r.onCancelClick())}),p(1),s()}if(a&2){x();let u=w(1),d=w(2);o("ngStyle",i(3,q))("color",d),t(),S(" ",u," ")}}var ct=(()=>{let n=class n{constructor(){this.dialogRef=f(O),this.data=f(R)}onConfirmClick(){this.dialogRef.close(!0)}onCancelClick(){this.dialogRef.close(!1)}};n.\u0275fac=function(r){return new(r||n)},n.\u0275cmp=v({type:n,selectors:[["app-password-modal"]],standalone:!0,features:[F],decls:15,vars:18,consts:[["mat-dialog-title","",3,"ngStyle"],[3,"ngStyle"],["aria-hidden","false","aria-label","icon",3,"ngStyle","fontIcon","color"],["mat-button","","mat-dialog-close","",3,"ngStyle","color"],["mat-raised-button","",3,"click","ngStyle","color"],["mat-button","","mat-dialog-close","",3,"click","ngStyle","color"]],template:function(r,e){if(r&1){let c=C();I(0)(1)(2)(3)(4)(5)(6),l(7,"h2",0),p(8),s(),l(9,"mat-dialog-content",1),T(10,"mat-icon",2),s(),l(11,"mat-dialog-actions",1),k(12,Y,2,4,"button",3),l(13,"button",4),y("click",function(){return g(c),_(e.onConfirmClick())}),p(14),s()()}if(r&2){let c,m,H=e.data.title||"Are you sure?";t(),h(e.data.cancelText||"Cancel"),t(),h(e.data.cancelColor||"accent");let J=e.data.confirmText||"Ok",K=e.data.confirmColor||"primary",P=(c=e.data.showCancel)!==null&&c!==void 0?c:"true",M=(m=e.data.showOkIcon)!==null&&m!==void 0?m:!1;t(5),o("ngStyle",i(13,Q)),t(),b(H),t(),o("ngStyle",i(14,U)),t(),o("ngStyle",i(15,W))("fontIcon",M?"recommend":"warning_amber")("color",M?"primary":"warn"),t(),o("ngStyle",i(16,X)),t(),D(P?12:-1),t(),o("ngStyle",i(17,q))("color",K),t(),S(" ",J," ")}},dependencies:[N,j,z,G,B,E,V,L,A],changeDetection:0});let a=n;return a})();export{ct as a};