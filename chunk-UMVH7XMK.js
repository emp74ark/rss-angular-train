import{a as f}from"./chunk-3UPHS55R.js";import{a as $}from"./chunk-LZO44IQN.js";import{C as n,T as r,W as o,_ as l,ea as p,g as c,m as e,za as h}from"./chunk-4LMCG722.js";var y=(()=>{let i=class i{constructor(){this.httpClient=p($),this.destroyRef=p(h),this.$$stations=new c([]),this.$stations=this.$$stations.asObservable(),this.$$apiStatus=new c({success:!1,error:null}),this.$apiStatus=this.$$apiStatus.asObservable(),this.getStations().pipe(f(this.destroyRef)).subscribe()}getStations(){return this.httpClient.get("/api/station").pipe(o(s=>{this.$$stations.next(s),this.$$apiStatus.next({success:!0,error:null})}),n(({error:s})=>(this.$$apiStatus.next({success:!1,error:s.message}),e(s))))}getStationById(s){return this.$$stations.pipe(r(t=>e(t.find(a=>a.id===s))),n(({error:t})=>(console.log(t),this.$$apiStatus.next({success:!1,error:t.message}),e(t))))}createStation(s){return this.httpClient.post("/api/station",s).pipe(o(()=>{this.$$apiStatus.next({success:!0,error:null})}),r(()=>this.getStations()),r(()=>e(null)),n(t=>{let{error:a}=t;return this.$$apiStatus.next({success:!1,error:a.message}),e(t)}))}deleteStation(s){return this.httpClient.delete(`/api/station/${s}`).pipe(o(()=>{this.$$apiStatus.next({success:!0,error:null})}),r(()=>this.getStations()),r(()=>e(null)),n(t=>{let{error:a}=t;return this.$$apiStatus.next({success:!1,error:a.message}),e(t)}))}};i.\u0275fac=function(t){return new(t||i)},i.\u0275prov=l({token:i,factory:i.\u0275fac,providedIn:"root"});let u=i;return u})();export{y as a};