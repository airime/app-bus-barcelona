"use strict";(self.webpackChunkapp=self.webpackChunkapp||[]).push([[5083],{5083:(ue,G,H)=>{H.d(G,{E_:()=>x,F3:()=>j,Ii:()=>_});var d=H(467);typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:typeof global<"u"&&global;var E=function(r){return r.Unimplemented="UNIMPLEMENTED",r.Unavailable="UNAVAILABLE",r}(E||{});class $ extends Error{constructor(e,t,o){super(e),this.message=e,this.code=t,this.data=o}}const z=r=>{var e,t,o,i,n;const a=r.CapacitorCustomPlatform||null,s=r.Capacitor||{},g=s.Plugins=s.Plugins||{},l=r.CapacitorPlatforms,C=(null===(e=null==l?void 0:l.currentPlatform)||void 0===e?void 0:e.getPlatform)||(()=>null!==a?a.name:(r=>{var e,t;return null!=r&&r.androidBridge?"android":null!==(t=null===(e=null==r?void 0:r.webkit)||void 0===e?void 0:e.messageHandlers)&&void 0!==t&&t.bridge?"ios":"web"})(r)),ee=(null===(t=null==l?void 0:l.currentPlatform)||void 0===t?void 0:t.isNativePlatform)||(()=>"web"!==C()),re=(null===(o=null==l?void 0:l.currentPlatform)||void 0===o?void 0:o.isPluginAvailable)||(c=>{const u=W.get(c);return!!(null!=u&&u.platforms.has(C())||I(c))}),I=(null===(i=null==l?void 0:l.currentPlatform)||void 0===i?void 0:i.getPluginHeader)||(c=>{var u;return null===(u=s.PluginHeaders)||void 0===u?void 0:u.find(A=>A.name===c)}),W=new Map,ae=(null===(n=null==l?void 0:l.currentPlatform)||void 0===n?void 0:n.registerPlugin)||((c,u={})=>{const A=W.get(c);if(A)return console.warn(`Capacitor plugin "${c}" already registered. Cannot register plugins twice.`),A.proxy;const w=C(),L=I(c);let v;const le=function(){var f=(0,d.A)(function*(){return!v&&w in u?v=v="function"==typeof u[w]?yield u[w]():u[w]:null!==a&&!v&&"web"in u&&(v=v="function"==typeof u.web?yield u.web():u.web),v});return function(){return f.apply(this,arguments)}}(),T=f=>{let m;const p=(...b)=>{const P=le().then(h=>{const y=((f,m)=>{var p,b;if(!L){if(f)return null===(b=f[m])||void 0===b?void 0:b.bind(f);throw new $(`"${c}" plugin is not implemented on ${w}`,E.Unimplemented)}{const P=null==L?void 0:L.methods.find(h=>m===h.name);if(P)return"promise"===P.rtype?h=>s.nativePromise(c,m.toString(),h):(h,y)=>s.nativeCallback(c,m.toString(),h,y);if(f)return null===(p=f[m])||void 0===p?void 0:p.bind(f)}})(h,f);if(y){const O=y(...b);return m=null==O?void 0:O.remove,O}throw new $(`"${c}.${f}()" is not implemented on ${w}`,E.Unimplemented)});return"addListener"===f&&(P.remove=(0,d.A)(function*(){return m()})),P};return p.toString=()=>`${f.toString()}() { [capacitor code] }`,Object.defineProperty(p,"name",{value:f,writable:!1,configurable:!1}),p},B=T("addListener"),F=T("removeListener"),de=(f,m)=>{const p=B({eventName:f},m),b=function(){var h=(0,d.A)(function*(){const y=yield p;F({eventName:f,callbackId:y},m)});return function(){return h.apply(this,arguments)}}(),P=new Promise(h=>p.then(()=>h({remove:b})));return P.remove=(0,d.A)(function*(){console.warn("Using addListener() without 'await' is deprecated."),yield b()}),P},S=new Proxy({},{get(f,m){switch(m){case"$$typeof":return;case"toJSON":return()=>({});case"addListener":return L?de:B;case"removeListener":return F;default:return T(m)}}});return g[c]=S,W.set(c,{name:c,proxy:S,platforms:new Set([...Object.keys(u),...L?[w]:[]])}),S});return s.convertFileSrc||(s.convertFileSrc=c=>c),s.getPlatform=C,s.handleError=c=>r.console.error(c),s.isNativePlatform=ee,s.isPluginAvailable=re,s.pluginMethodNoop=(c,u,A)=>Promise.reject(`${A} does not have an implementation of "${u}".`),s.registerPlugin=ae,s.Exception=$,s.DEBUG=!!s.DEBUG,s.isLoggingEnabled=!!s.isLoggingEnabled,s.platform=s.getPlatform(),s.isNative=s.isNativePlatform(),s},_=(r=>r.Capacitor=z(r))(typeof globalThis<"u"?globalThis:typeof self<"u"?self:typeof window<"u"?window:typeof global<"u"?global:{}),j=_.registerPlugin;class x{constructor(e){this.listeners={},this.retainedEventArguments={},this.windowListeners={},e&&(console.warn(`Capacitor WebPlugin "${e.name}" config object was deprecated in v3 and will be removed in v4.`),this.config=e)}addListener(e,t){var o=this;let i=!1;this.listeners[e]||(this.listeners[e]=[],i=!0),this.listeners[e].push(t);const a=this.windowListeners[e];a&&!a.registered&&this.addWindowListener(a),i&&this.sendRetainedArgumentsForEvent(e);const s=function(){var l=(0,d.A)(function*(){return o.removeListener(e,t)});return function(){return l.apply(this,arguments)}}();return Promise.resolve({remove:s})}removeAllListeners(){var e=this;return(0,d.A)(function*(){e.listeners={};for(const t in e.windowListeners)e.removeWindowListener(e.windowListeners[t]);e.windowListeners={}})()}notifyListeners(e,t,o){const i=this.listeners[e];if(i)i.forEach(n=>n(t));else if(o){let n=this.retainedEventArguments[e];n||(n=[]),n.push(t),this.retainedEventArguments[e]=n}}hasListeners(e){return!!this.listeners[e].length}registerWindowListener(e,t){this.windowListeners[t]={registered:!1,windowEventName:e,pluginEventName:t,handler:o=>{this.notifyListeners(t,o)}}}unimplemented(e="not implemented"){return new _.Exception(e,E.Unimplemented)}unavailable(e="not available"){return new _.Exception(e,E.Unavailable)}removeListener(e,t){var o=this;return(0,d.A)(function*(){const i=o.listeners[e];if(!i)return;const n=i.indexOf(t);o.listeners[e].splice(n,1),o.listeners[e].length||o.removeWindowListener(o.windowListeners[e])})()}addWindowListener(e){window.addEventListener(e.windowEventName,e.handler),e.registered=!0}removeWindowListener(e){e&&(window.removeEventListener(e.windowEventName,e.handler),e.registered=!1)}sendRetainedArgumentsForEvent(e){const t=this.retainedEventArguments[e];t&&(delete this.retainedEventArguments[e],t.forEach(o=>{this.notifyListeners(e,o)}))}}const M=r=>encodeURIComponent(r).replace(/%(2[346B]|5E|60|7C)/g,decodeURIComponent).replace(/[()]/g,escape),D=r=>r.replace(/(%[\dA-F]{2})+/gi,decodeURIComponent);class J extends x{getCookies(){return(0,d.A)(function*(){const e=document.cookie,t={};return e.split(";").forEach(o=>{if(o.length<=0)return;let[i,n]=o.replace(/=/,"CAP_COOKIE").split("CAP_COOKIE");i=D(i).trim(),n=D(n).trim(),t[i]=n}),t})()}setCookie(e){return(0,d.A)(function*(){try{const t=M(e.key),o=M(e.value),i=`; expires=${(e.expires||"").replace("expires=","")}`,n=(e.path||"/").replace("path=",""),a=null!=e.url&&e.url.length>0?`domain=${e.url}`:"";document.cookie=`${t}=${o||""}${i}; path=${n}; ${a};`}catch(t){return Promise.reject(t)}})()}deleteCookie(e){return(0,d.A)(function*(){try{document.cookie=`${e.key}=; Max-Age=0`}catch(t){return Promise.reject(t)}})()}clearCookies(){return(0,d.A)(function*(){try{const e=document.cookie.split(";")||[];for(const t of e)document.cookie=t.replace(/^ +/,"").replace(/=.*/,`=;expires=${(new Date).toUTCString()};path=/`)}catch(e){return Promise.reject(e)}})()}clearAllCookies(){var e=this;return(0,d.A)(function*(){try{yield e.clearCookies()}catch(t){return Promise.reject(t)}})()}}j("CapacitorCookies",{web:()=>new J});const Q=function(){var r=(0,d.A)(function*(e){return new Promise((t,o)=>{const i=new FileReader;i.onload=()=>{const n=i.result;t(n.indexOf(",")>=0?n.split(",")[1]:n)},i.onerror=n=>o(n),i.readAsDataURL(e)})});return function(t){return r.apply(this,arguments)}}();class N extends x{request(e){return(0,d.A)(function*(){const t=((r,e={})=>{const t=Object.assign({method:r.method||"GET",headers:r.headers},e),i=((r={})=>{const e=Object.keys(r);return Object.keys(r).map(i=>i.toLocaleLowerCase()).reduce((i,n,a)=>(i[n]=r[e[a]],i),{})})(r.headers)["content-type"]||"";if("string"==typeof r.data)t.body=r.data;else if(i.includes("application/x-www-form-urlencoded")){const n=new URLSearchParams;for(const[a,s]of Object.entries(r.data||{}))n.set(a,s);t.body=n.toString()}else if(i.includes("multipart/form-data")||r.data instanceof FormData){const n=new FormData;if(r.data instanceof FormData)r.data.forEach((s,g)=>{n.append(g,s)});else for(const s of Object.keys(r.data))n.append(s,r.data[s]);t.body=n;const a=new Headers(t.headers);a.delete("content-type"),t.headers=a}else(i.includes("application/json")||"object"==typeof r.data)&&(t.body=JSON.stringify(r.data));return t})(e,e.webFetchExtra),o=((r,e=!0)=>r?Object.entries(r).reduce((o,i)=>{const[n,a]=i;let s,g;return Array.isArray(a)?(g="",a.forEach(l=>{s=e?encodeURIComponent(l):l,g+=`${n}=${s}&`}),g.slice(0,-1)):(s=e?encodeURIComponent(a):a,g=`${n}=${s}`),`${o}&${g}`},"").substr(1):null)(e.params,e.shouldEncodeUrlParams),i=o?`${e.url}?${o}`:e.url,n=yield fetch(i,t),a=n.headers.get("content-type")||"";let g,l,{responseType:s="text"}=n.ok?e:{};switch(a.includes("application/json")&&(s="json"),s){case"arraybuffer":case"blob":l=yield n.blob(),g=yield Q(l);break;case"json":g=yield n.json();break;default:g=yield n.text()}const k={};return n.headers.forEach((C,U)=>{k[U]=C}),{data:g,headers:k,status:n.status,url:n.url}})()}get(e){var t=this;return(0,d.A)(function*(){return t.request(Object.assign(Object.assign({},e),{method:"GET"}))})()}post(e){var t=this;return(0,d.A)(function*(){return t.request(Object.assign(Object.assign({},e),{method:"POST"}))})()}put(e){var t=this;return(0,d.A)(function*(){return t.request(Object.assign(Object.assign({},e),{method:"PUT"}))})()}patch(e){var t=this;return(0,d.A)(function*(){return t.request(Object.assign(Object.assign({},e),{method:"PATCH"}))})()}delete(e){var t=this;return(0,d.A)(function*(){return t.request(Object.assign(Object.assign({},e),{method:"DELETE"}))})()}}j("CapacitorHttp",{web:()=>new N})}}]);