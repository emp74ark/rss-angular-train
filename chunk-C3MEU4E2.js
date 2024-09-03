import{c as pe,d as ue,h as _e,j as P,k as Ce,l as fe,m as ge,n as he,o as Me}from"./chunk-732JO2U5.js";import{a as xe}from"./chunk-AMKR4GSQ.js";import{a as ae}from"./chunk-UMVH7XMK.js";import"./chunk-UWJMY7QB.js";import{a as Se,b as Te,c as Oe,d as ve,e as ye,f as we,g as be,h as F}from"./chunk-6FOTKAWA.js";import{A as ce,B as me,b as re,d as ne,w as oe,x as de,y as se,z as le}from"./chunk-3UPHS55R.js";import"./chunk-RGNDWIHZ.js";import{ha as N,ma as k}from"./chunk-LZO44IQN.js";import{$a as s,$b as J,Cb as g,Db as E,Ea as W,Fa as j,Fb as V,Gb as D,Hb as d,Ib as o,Jb as q,Kb as h,Nb as p,Pb as c,T as R,Tc as ee,Uc as te,Vc as ie,_b as l,ac as S,bc as G,ea as u,fc as B,gc as K,hc as v,ia as O,jc as y,kb as I,kc as z,oc as T,pc as Q,q as H,qc as A,r as b,rc as X,sa as _,sb as f,sc as Z,ta as C,wb as x,zb as Y}from"./chunk-4LMCG722.js";import"./chunk-A43TDCY5.js";var Ee=(()=>{let r=class r{constructor(){this.dialogRef=u(Se),this.data=u(Te)}cancelOrder(){this.dialogRef.close(!0)}closeModal(){this.dialogRef.close()}};r.\u0275fac=function(n){return new(n||r)},r.\u0275cmp=O({type:r,selectors:[["app-order-card-modal"]],standalone:!0,features:[y],decls:11,vars:1,consts:[["mat-dialog-title",""],["mat-raised-button","","color","primary",3,"click"],["mat-button","","mat-dialog-close","",3,"click"]],template:function(n,e){if(n&1){let m=h();B(0),d(1,"h2",0),l(2),o(),d(3,"mat-dialog-content")(4,"p"),l(5,"Are you sure you want to cancel this order?"),o()(),d(6,"mat-dialog-actions")(7,"button",1),p("click",function(){return _(m),C(e.cancelOrder())}),l(8,"Yes"),o(),d(9,"button",2),p("click",function(){return _(m),C(e.closeModal())}),l(10,"Cancel"),o()()}if(n&2){let m=e.data.title;s(2),J(m)}},dependencies:[F,ve,ye,be,we,k,N]});let t=r;return t})();var U=function(t){return t.ACTIVE="active",t.COMPLETED="completed",t.REJECTED="rejected",t.CANCELED="canceled",t}(U||{});var Ne=()=>({margin:"16px"});function ke(t,r){if(t&1&&(d(0,"p"),l(1),o()),t&2){let i=c();s(),S("User Name: ",i.order().userName,"")}}function Pe(t,r){if(t&1){let i=h();d(0,"app-modal-window",3),p("toggleVisibility",function(){_(i);let n=c();return C(n.onModal())}),q(1,"app-route-graph",4),o()}if(t&2){let i=c();x("title","Route "+i.order().routeId),s(),x("path",i.order().path)("segments",i.order().schedule.segments)("startStation",i.order().startStationId)("lastStation",i.order().endStationId)}}function Fe(t,r){if(t&1){let i=h();d(0,"mat-card-actions")(1,"button",5),p("click",function(){_(i);let n=c();return C(n.onCancelOrder())}),l(2,"Cancel Order"),o()()}}var Ve=(()=>{let r=class r{constructor(){this.dialog=u(Oe),this.isManager=j(!1),this.order=j.required(),this.cancelOrder=W(),this.modal=I(!1)}onModal(){this.modal.set(!this.modal())}onCancelOrder(){let a="";this.isManager()?a=`You wants to cancel ${this.order().userName}'s order ${this.order().id}?`:a=`Cancel Order ${this.order().id}?`,this.dialog.open(Ee,{width:"320px",enterAnimationDuration:"500ms",exitAnimationDuration:"250ms",data:{title:a}}).afterClosed().subscribe(e=>{e&&this.cancelOrder.emit(this.order().id)})}isCancelable(){return this.order().status===U.ACTIVE}};r.\u0275fac=function(n){return new(n||r)},r.\u0275cmp=O({type:r,selectors:[["app-order-card"]],inputs:{isManager:[1,"isManager"],order:[1,"order"]},outputs:{cancelOrder:"cancelOrder"},standalone:!0,features:[y],decls:29,vars:25,consts:[[1,"order-card"],["mat-button","","color","primary",1,"route-button",3,"click"],[3,"title"],[3,"toggleVisibility","title"],[3,"path","segments","startStation","lastStation"],["mat-button","","color","warn",3,"click"]],template:function(n,e){n&1&&(d(0,"mat-card",0)(1,"mat-card-header")(2,"mat-card-title"),l(3),o(),d(4,"mat-card-subtitle"),l(5),T(6,"date"),T(7,"date"),o()(),d(8,"mat-card-content")(9,"p"),l(10),o(),d(11,"p"),l(12),o(),d(13,"p"),l(14),o(),d(15,"p"),l(16),o(),d(17,"p"),l(18),T(19,"currency"),o(),d(20,"p"),l(21),o(),f(22,ke,2,1,"p"),d(23,"button",1),p("click",function(){return e.onModal()}),d(24,"mat-icon"),l(25,"route"),o(),l(26," Route "),o(),f(27,Pe,2,5,"app-modal-window",2),o(),f(28,Fe,3,0,"mat-card-actions"),o()),n&2&&(Y(z(24,Ne)),s(3),G("",e.order().startStationName," - ",e.order().endStationName,""),s(2),G("",A(6,15,e.order().startTripTime,"MMMM dd hh:mm")," - ",A(7,18,e.order().endTripTime,"MMMM dd hh:mm"),""),s(5),S("Trip Duration: ",e.order().tripDuration,""),s(2),S("Carriage Type: ",e.order().currentCarriageType,""),s(2),S("Seat Number: ",e.order().seatId,""),s(2),S("Carriage Number: ",e.order().currentCarriageNumber,""),s(2),S("Price: ",A(19,21,e.order().totalPrice,"USD"),""),s(3),S("Status: ",e.order().status,""),s(),g(e.isManager()?22:-1),s(5),g(e.modal()?27:-1),s(),g(e.isCancelable()?28:-1))},dependencies:[te,ie,ne,oe,me,de,le,se,ce,k,N,F,Ce,P]});let t=r;return t})();function $e(t,r){if(t&1){let i=h();d(0,"app-order-card",5),p("cancelOrder",function(n){_(i);let e=c(3);return C(e.cancelOrder(n))}),o()}if(t&2){let i=r.$implicit,a=c(3);x("order",i)("isManager",a.isManager)}}function Le(t,r){if(t&1&&(V(0,$e,1,2,"app-order-card",4,E),T(2,"filterBy")),t&2){c(2);let i=v(2);D(X(2,0,i,"userName","Admin"))}}function Re(t,r){if(t&1){let i=h();d(0,"app-order-card",5),p("cancelOrder",function(n){_(i);let e=c(3);return C(e.cancelOrder(n))}),o()}if(t&2){let i=r.$implicit,a=c(3);x("order",i)("isManager",a.isManager)}}function je(t,r){if(t&1&&(V(0,Re,1,2,"app-order-card",4,E),T(2,"filterBy")),t&2){c(2);let i=v(2);D(Z(2,0,i,"userName","Admin",!0))}}function Ge(t,r){if(t&1&&(d(0,"mat-tab",1),f(1,Le,3,4),o(),d(2,"mat-tab",3),f(3,je,3,5),o()),t&2){c();let i=v(2);s(),g(i?1:-1),s(2),g(i?3:-1)}}function Ue(t,r){if(t&1){let i=h();d(0,"app-order-card",5),p("cancelOrder",function(n){_(i);let e=c(3);return C(e.cancelOrder(n))}),o()}if(t&2){let i=r.$implicit,a=c(3);x("order",i)("isManager",a.isManager)}}function He(t,r){if(t&1&&V(0,Ue,1,2,"app-order-card",4,E),t&2){c(2);let i=v(2);D(i)}}function We(t,r){if(t&1&&(d(0,"mat-tab",1),f(1,He,2,0),o()),t&2){c();let i=v(2);s(),g(i?1:-1)}}function Ye(t,r){if(t&1){let i=h();d(0,"app-modal-window",6),p("toggleVisibility",function(){_(i);let n=c();return C(n.onModal())}),d(1,"p"),l(2,"OK!"),o()()}t&2&&x("title","Success!")}var Et=(()=>{let r=class r{constructor(){this.orderService=u(he),this.stationService=u(ae),this.profileService=u(xe),this.rideService=u(ge),this.trainService=u(fe),this.modal=I(!1),this.stations=[],this.stationSignal=re(this.stationService.$stations,{initialValue:[]})}ngOnInit(){this.orderCards$=b([this.profileService.loadProfile(),this.stationService.getStations()]).pipe(R(([a,n])=>(this.profile=a,this.isManager=a.role==="manager",this.stations=n,this.isManager?b([this.orderService.getOrders(this.isManager),this.orderService.getUsers()]):this.orderService.getOrders(this.isManager))),R(()=>b([this.orderService.$orders,this.orderService.$users])),H(([a,n])=>a?this.mapOrdersToOrderCards(a,n):null))}onModal(){this.modal.set(!this.modal())}mapOrdersToOrderCards(a,n){return a.map(e=>{let m=this.rideService.getInfo({id:e.routeId,path:e.path,carriages:e.carriages},e.rideId,e.schedule.segments,e.stationStart,e.stationEnd),M=this.trainService.getInfoBySeat(e.seatId,e.carriages),$=this.rideService.getPrice(m.userSegments),L=this.stationSignal().find(w=>w.id===e.stationStart),De=this.stationSignal().find(w=>w.id===e.stationEnd),Be=n.find(w=>w.id===e.userId)?.name??"anonymous";return{id:e.id,rideId:e.rideId,routeId:e.routeId,userId:e.userId,userName:Be,status:e.status,path:e.path,startStationName:L?.city??"",startStationId:e.stationStart,startTripTime:m.startTime,endStationName:De?.city??"",endStationId:e.stationEnd,endTripTime:m.endTime,tripDuration:this.calculateDuration(m.startTime,m.endTime),currentCarriageType:M?.code??"",seatId:e.seatId,currentCarriageNumber:M?.number??0,totalPrice:$[M?.code??""],carriages:e.carriages,schedule:e.schedule}}).sort((e,m)=>e.startTripTime>m.startTripTime?1:-1)}calculateDuration(a,n){let e=new Date(a),M=new Date(n).getTime()-e.getTime(),$=Math.floor(M/(1e3*60*60)),L=Math.floor(M%(1e3*60*60)/(1e3*60));return`${$}h ${L}m`}cancelOrder(a){this.onModal(),this.orderService.cancelOrder(a,this.isManager).subscribe()}};r.\u0275fac=function(n){return new(n||r)},r.\u0275cmp=O({type:r,selectors:[["app-orders"]],standalone:!0,features:[y],decls:7,vars:5,consts:[[1,"orders"],["label","My Orders"],[3,"title"],["label","All Orders"],[3,"order","isManager"],[3,"cancelOrder","order","isManager"],[3,"toggleVisibility","title"]],template:function(n,e){n&1&&(d(0,"div",0)(1,"mat-tab-group"),B(2),T(3,"async"),f(4,Ge,4,2)(5,We,2,1,"mat-tab",1),o()(),f(6,Ye,3,1,"app-modal-window",2)),n&2&&(s(2),K(Q(3,2,e.orderCards$)),s(2),g(e.isManager?4:5),s(2),g(e.modal()?6:-1))},dependencies:[_e,pe,ue,Ve,ee,P,Me],styles:[".orders[_ngcontent-%COMP%]{padding:16px;gap:16px}mat-tab-group[_ngcontent-%COMP%]{width:100%}mat-mdc-card[_ngcontent-%COMP%]{margin:16px}"]});let t=r;return t})();export{Et as OrdersComponent};
