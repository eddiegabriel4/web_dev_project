(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const n of i)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function e(i){const n={};return i.integrity&&(n.integrity=i.integrity),i.referrerPolicy&&(n.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?n.credentials="include":i.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(i){if(i.ep)return;i.ep=!0;const n=e(i);fetch(i.href,n)}})();var B,Te;class at extends Error{}at.prototype.name="InvalidTokenError";function Qs(r){return decodeURIComponent(atob(r).replace(/(.)/g,(t,e)=>{let s=e.charCodeAt(0).toString(16).toUpperCase();return s.length<2&&(s="0"+s),"%"+s}))}function Xs(r){let t=r.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return Qs(t)}catch{return atob(t)}}function os(r,t){if(typeof r!="string")throw new at("Invalid token specified: must be a string");t||(t={});const e=t.header===!0?0:1,s=r.split(".")[e];if(typeof s!="string")throw new at(`Invalid token specified: missing part #${e+1}`);let i;try{i=Xs(s)}catch(n){throw new at(`Invalid token specified: invalid base64 for part #${e+1} (${n.message})`)}try{return JSON.parse(i)}catch(n){throw new at(`Invalid token specified: invalid json for part #${e+1} (${n.message})`)}}const ti="mu:context",Qt=`${ti}:change`;class ei{constructor(t,e){this._proxy=si(t,e)}get value(){return this._proxy}set value(t){Object.assign(this._proxy,t)}apply(t){this.value=t(this.value)}}class ae extends HTMLElement{constructor(t){super(),console.log("Constructing context provider",this),this.context=new ei(t,this),this.style.display="contents"}attach(t){return this.addEventListener(Qt,t),t}detach(t){this.removeEventListener(Qt,t)}}function si(r,t){return new Proxy(r,{get:(s,i,n)=>{if(i==="then")return;const o=Reflect.get(s,i,n);return console.log(`Context['${i}'] => `,o),o},set:(s,i,n,o)=>{const l=r[i];console.log(`Context['${i.toString()}'] <= `,n);const a=Reflect.set(s,i,n,o);if(a){let d=new CustomEvent(Qt,{bubbles:!0,cancelable:!0,composed:!0});Object.assign(d,{property:i,oldValue:l,value:n}),t.dispatchEvent(d)}else console.log(`Context['${i}] was not set to ${n}`);return a}})}function ii(r,t){const e=as(t,r);return new Promise((s,i)=>{if(e){const n=e.localName;customElements.whenDefined(n).then(()=>s(e))}else i({context:t,reason:`No provider for this context "${t}:`})})}function as(r,t){const e=`[provides="${r}"]`;if(!t||t===document.getRootNode())return;const s=t.closest(e);if(s)return s;const i=t.getRootNode();if(i instanceof ShadowRoot)return as(r,i.host)}class ri extends CustomEvent{constructor(t,e="mu:message"){super(e,{bubbles:!0,composed:!0,detail:t})}}function ls(r="mu:message"){return(t,...e)=>t.dispatchEvent(new ri(e,r))}class le{constructor(t,e,s="service:message",i=!0){this._pending=[],this._context=e,this._update=t,this._eventType=s,this._running=i}attach(t){t.addEventListener(this._eventType,e=>{e.stopPropagation();const s=e.detail;this.consume(s)})}start(){this._running||(console.log(`Starting ${this._eventType} service`),this._running=!0,this._pending.forEach(t=>this.process(t)))}apply(t){this._context.apply(t)}consume(t){this._running?this.process(t):(console.log(`Queueing ${this._eventType} message`,t),this._pending.push(t))}process(t){console.log(`Processing ${this._eventType} message`,t);const e=this._update(t,this.apply.bind(this));e&&e(this._context.value)}}function ni(r){return t=>({...t,...r})}const Xt="mu:auth:jwt",cs=class hs extends le{constructor(t,e){super((s,i)=>this.update(s,i),t,hs.EVENT_TYPE),this._redirectForLogin=e}update(t,e){switch(t[0]){case"auth/signin":const{token:s,redirect:i}=t[1];return e(ai(s)),Wt(i);case"auth/signout":return e(li()),Wt(this._redirectForLogin);case"auth/redirect":return Wt(this._redirectForLogin,{next:window.location.href});default:const n=t[0];throw new Error(`Unhandled Auth message "${n}"`)}}};cs.EVENT_TYPE="auth:message";let us=cs;const ds=ls(us.EVENT_TYPE);function Wt(r,t={}){if(!r)return;const e=window.location.href,s=new URL(r,e);return Object.entries(t).forEach(([i,n])=>s.searchParams.set(i,n)),()=>{console.log("Redirecting to ",r),window.location.assign(s)}}class oi extends ae{get redirect(){return this.getAttribute("redirect")||void 0}constructor(){const t=G.authenticateFromLocalStorage();super({user:t,token:t.authenticated?t.token:void 0})}connectedCallback(){new us(this.context,this.redirect).attach(this)}}class Z{constructor(){this.authenticated=!1,this.username="anonymous"}static deauthenticate(t){return t.authenticated=!1,t.username="anonymous",localStorage.removeItem(Xt),t}}class G extends Z{constructor(t){super();const e=os(t);console.log("Token payload",e),this.token=t,this.authenticated=!0,this.username=e.username}static authenticate(t){const e=new G(t);return localStorage.setItem(Xt,t),e}static authenticateFromLocalStorage(){const t=localStorage.getItem(Xt);return t?G.authenticate(t):new Z}}function ai(r){return ni({user:G.authenticate(r),token:r})}function li(){return r=>{const t=r.user;return{user:t&&t.authenticated?Z.deauthenticate(t):t,token:""}}}function ci(r){return r.authenticated?{Authorization:`Bearer ${r.token||"NO_TOKEN"}`}:{}}function hi(r){return r.authenticated?os(r.token||""):{}}const S=Object.freeze(Object.defineProperty({__proto__:null,AuthenticatedUser:G,Provider:oi,User:Z,dispatch:ds,headers:ci,payload:hi},Symbol.toStringTag,{value:"Module"}));function Et(r,t,e){const s=r.target,i=new CustomEvent(t,{bubbles:!0,composed:!0,detail:e});console.log(`Relaying event from ${r.type}:`,i),s.dispatchEvent(i),r.stopPropagation()}function te(r,t="*"){return r.composedPath().find(s=>{const i=s;return i.tagName&&i.matches(t)})}const ps=Object.freeze(Object.defineProperty({__proto__:null,originalTarget:te,relay:Et},Symbol.toStringTag,{value:"Module"}));function fs(r,...t){const e=r.map((i,n)=>n?[t[n-1],i]:[i]).flat().join("");let s=new CSSStyleSheet;return s.replaceSync(e),s}const ui=new DOMParser;function H(r,...t){const e=t.map(l),s=r.map((a,d)=>{if(d===0)return[a];const f=e[d-1];return f instanceof Node?[`<ins id="mu-html-${d-1}"></ins>`,a]:[f,a]}).flat().join(""),i=ui.parseFromString(s,"text/html"),n=i.head.childElementCount?i.head.children:i.body.children,o=new DocumentFragment;return o.replaceChildren(...n),e.forEach((a,d)=>{if(a instanceof Node){const f=o.querySelector(`ins#mu-html-${d}`);if(f){const u=f.parentNode;u==null||u.replaceChild(a,f)}else console.log("Missing insertion point:",`ins#mu-html-${d}`)}}),o;function l(a,d){if(a===null)return"";switch(typeof a){case"string":return Ue(a);case"bigint":case"boolean":case"number":case"symbol":return Ue(a.toString());case"object":if(a instanceof Node||a instanceof DocumentFragment)return a;if(Array.isArray(a)){const f=new DocumentFragment,u=a.map(l);return f.replaceChildren(...u),f}return new Text(a.toString());default:return new Comment(`[invalid parameter of type "${typeof a}"]`)}}}function Ue(r){return r.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Nt(r,t={mode:"open"}){const e=r.attachShadow(t),s={template:i,styles:n};return s;function i(o){const l=o.firstElementChild,a=l&&l.tagName==="TEMPLATE"?l:void 0;return a&&e.appendChild(a.content.cloneNode(!0)),s}function n(...o){e.adoptedStyleSheets=o}}let di=(B=class extends HTMLElement{constructor(){super(),this._state={},Nt(this).template(B.template).styles(B.styles),this.addEventListener("change",r=>{const t=r.target;if(t){const e=t.name,s=t.value;e&&(this._state[e]=s)}}),this.form&&this.form.addEventListener("submit",r=>{r.preventDefault(),Et(r,"mu-form:submit",this._state)})}set init(r){this._state=r||{},pi(this._state,this)}get form(){var r;return(r=this.shadowRoot)==null?void 0:r.querySelector("form")}},B.template=H`
    <template>
      <form autocomplete="off">
        <slot></slot>
        <slot name="submit">
          <button type="submit">Submit</button>
        </slot>
      </form>
      <slot name="delete"></slot>
      <style></style>
    </template>
  `,B.styles=fs`
    form {
      display: grid;
      gap: var(--size-spacing-medium);
      grid-column: 1/-1;
      grid-template-columns:
        subgrid
        [start] [label] [input] [col2] [col3] [end];
    }
    ::slotted(label) {
      display: grid;
      grid-column: label / end;
      grid-template-columns: subgrid;
      gap: var(--size-spacing-medium);
    }
    ::slotted(fieldset) {
      display: contents;
    }
    button[type="submit"] {
      grid-column: input;
      justify-self: start;
    }
  `,B);function pi(r,t){const e=Object.entries(r);for(const[s,i]of e){const n=t.querySelector(`[name="${s}"]`);if(n){const o=n;switch(o.type){case"checkbox":const l=o;l.checked=!!i;break;case"date":o.value=i.toISOString().substr(0,10);break;default:o.value=i;break}}}return r}const fi=Object.freeze(Object.defineProperty({__proto__:null,Element:di},Symbol.toStringTag,{value:"Module"})),ms=class gs extends le{constructor(t){super((e,s)=>this.update(e,s),t,gs.EVENT_TYPE)}update(t,e){switch(t[0]){case"history/navigate":{const{href:s,state:i}=t[1];e(gi(s,i));break}case"history/redirect":{const{href:s,state:i}=t[1];e(vi(s,i));break}}}};ms.EVENT_TYPE="history:message";let ce=ms;class Re extends ae{constructor(){super({location:document.location,state:{}}),this.addEventListener("click",t=>{const e=mi(t);if(e){const s=new URL(e.href);s.origin===this.context.value.location.origin&&(console.log("Preventing Click Event on <A>",t),t.preventDefault(),he(e,"history/navigate",{href:s.pathname+s.search}))}}),window.addEventListener("popstate",t=>{console.log("Popstate",t.state),this.context.value={location:document.location,state:t.state}})}connectedCallback(){new ce(this.context).attach(this)}}function mi(r){const t=r.currentTarget,e=s=>s.tagName=="A"&&s.href;if(r.button===0)if(r.composed){const i=r.composedPath().find(e);return i||void 0}else{for(let s=r.target;s;s===t?null:s.parentElement)if(e(s))return s;return}}function gi(r,t={}){return history.pushState(t,"",r),()=>({location:document.location,state:history.state})}function vi(r,t={}){return history.replaceState(t,"",r),()=>({location:document.location,state:history.state})}const he=ls(ce.EVENT_TYPE),vs=Object.freeze(Object.defineProperty({__proto__:null,HistoryProvider:Re,Provider:Re,Service:ce,dispatch:he},Symbol.toStringTag,{value:"Module"}));class P{constructor(t,e){this._effects=[],this._target=t,this._contextLabel=e}observe(t=void 0){return new Promise((e,s)=>{if(this._provider){const i=new Ne(this._provider,t);this._effects.push(i),e(i)}else ii(this._target,this._contextLabel).then(i=>{const n=new Ne(i,t);this._provider=i,this._effects.push(n),i.attach(o=>this._handleChange(o)),e(n)}).catch(i=>console.log(`Observer ${this._contextLabel}: ${i}`,i))})}_handleChange(t){console.log("Received change event for observers",t,this._effects),t.stopPropagation(),this._effects.forEach(e=>e.runEffect())}}class Ne{constructor(t,e){this._provider=t,e&&this.setEffect(e)}get context(){return this._provider.context}get value(){return this.context.value}setEffect(t){this._effectFn=t,this.runEffect()}runEffect(){this._effectFn&&this._effectFn(this.context.value)}}const ys=class _s extends HTMLElement{constructor(){super(),this._state={},this._user=new Z,this._authObserver=new P(this,"blazing:auth"),Nt(this).template(_s.template),this.form&&this.form.addEventListener("submit",t=>{if(t.preventDefault(),this.src||this.action){if(console.log("Submitting form",this._state),this.action)this.action(this._state);else if(this.src){const e=this.isNew?"POST":"PUT",s=this.isNew?"created":"updated",i=this.isNew?this.src.replace(/[/][$]new$/,""):this.src;yi(i,this._state,e,this.authorization).then(n=>it(n,this)).then(n=>{const o=`mu-rest-form:${s}`,l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,[s]:n,url:i}});this.dispatchEvent(l)}).catch(n=>{const o="mu-rest-form:error",l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,error:n,url:i,request:this._state}});this.dispatchEvent(l)})}}}),this.addEventListener("change",t=>{const e=t.target;if(e){const s=e.name,i=e.value;s&&(this._state[s]=i)}})}get src(){return this.getAttribute("src")}get isNew(){return this.hasAttribute("new")}set init(t){this._state=t||{},it(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}get authorization(){var t;return(t=this._user)!=null&&t.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){this._authObserver.observe(({user:t})=>{t&&(this._user=t,this.src&&!this.isNew&&Le(this.src,this.authorization).then(e=>{this._state=e,it(e,this)}))})}attributeChangedCallback(t,e,s){switch(t){case"src":this.src&&s&&s!==e&&!this.isNew&&Le(this.src,this.authorization).then(i=>{this._state=i,it(i,this)});break;case"new":s&&(this._state={},it({},this));break}}};ys.observedAttributes=["src","new","action"];ys.template=H`
    <template>
      <form autocomplete="off">
        <slot></slot>
        <slot name="submit">
          <button type="submit">Submit</button>
        </slot>
      </form>
      <slot name="delete"></slot>
      <style>
        form {
          display: grid;
          gap: var(--size-spacing-medium);
          grid-template-columns: [start] 1fr [label] 1fr [input] 3fr 1fr [end];
        }
        ::slotted(label) {
          display: grid;
          grid-column: label / end;
          grid-template-columns: subgrid;
          gap: var(--size-spacing-medium);
        }
        button[type="submit"] {
          grid-column: input;
          justify-self: start;
        }
      </style>
    </template>
  `;function Le(r,t){return fetch(r,{headers:t}).then(e=>{if(e.status!==200)throw`Status: ${e.status}`;return e.json()}).catch(e=>console.log(`Failed to load form from ${r}:`,e))}function it(r,t){const e=Object.entries(r);for(const[s,i]of e){const n=t.querySelector(`[name="${s}"]`);if(n){const o=n;switch(o.type){case"checkbox":const l=o;l.checked=!!i;break;default:o.value=i;break}}}return r}function yi(r,t,e="PUT",s={}){return fetch(r,{method:e,headers:{"Content-Type":"application/json",...s},body:JSON.stringify(t)}).then(i=>{if(i.status!=200&&i.status!=201)throw`Form submission failed: Status ${i.status}`;return i.json()})}const $s=class bs extends le{constructor(t,e){super(e,t,bs.EVENT_TYPE,!1)}};$s.EVENT_TYPE="mu:message";let ws=$s;class _i extends ae{constructor(t,e,s){super(e),this._user=new Z,this._updateFn=t,this._authObserver=new P(this,s)}connectedCallback(){const t=new ws(this.context,(e,s)=>this._updateFn(e,s,this._user));t.attach(this),this._authObserver.observe(({user:e})=>{console.log("Store got auth",e),e&&(this._user=e),t.start()})}}const $i=Object.freeze(Object.defineProperty({__proto__:null,Provider:_i,Service:ws},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const wt=globalThis,ue=wt.ShadowRoot&&(wt.ShadyCSS===void 0||wt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,de=Symbol(),Ie=new WeakMap;let As=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==de)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(ue&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=Ie.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&Ie.set(e,t))}return t}toString(){return this.cssText}};const bi=r=>new As(typeof r=="string"?r:r+"",void 0,de),wi=(r,...t)=>{const e=r.length===1?r[0]:t.reduce((s,i,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[n+1],r[0]);return new As(e,r,de)},Ai=(r,t)=>{if(ue)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),i=wt.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,r.appendChild(s)}},Me=ue?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return bi(e)})(r):r;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Ei,defineProperty:Si,getOwnPropertyDescriptor:xi,getOwnPropertyNames:ki,getOwnPropertySymbols:Pi,getPrototypeOf:Ci}=Object,Q=globalThis,je=Q.trustedTypes,Oi=je?je.emptyScript:"",He=Q.reactiveElementPolyfillSupport,lt=(r,t)=>r,St={toAttribute(r,t){switch(t){case Boolean:r=r?Oi:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},pe=(r,t)=>!Ei(r,t),ze={attribute:!0,type:String,converter:St,reflect:!1,hasChanged:pe};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),Q.litPropertyMetadata??(Q.litPropertyMetadata=new WeakMap);let Y=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=ze){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&Si(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:n}=xi(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get(){return i==null?void 0:i.call(this)},set(o){const l=i==null?void 0:i.call(this);n.call(this,o),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??ze}static _$Ei(){if(this.hasOwnProperty(lt("elementProperties")))return;const t=Ci(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(lt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(lt("properties"))){const e=this.properties,s=[...ki(e),...Pi(e)];for(const i of s)this.createProperty(i,e[i])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const i of s)e.unshift(Me(i))}else t!==void 0&&e.push(Me(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Ai(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EC(t,e){var s;const i=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,i);if(n!==void 0&&i.reflect===!0){const o=(((s=i.converter)==null?void 0:s.toAttribute)!==void 0?i.converter:St).toAttribute(e,i.type);this._$Em=t,o==null?this.removeAttribute(n):this.setAttribute(n,o),this._$Em=null}}_$AK(t,e){var s;const i=this.constructor,n=i._$Eh.get(t);if(n!==void 0&&this._$Em!==n){const o=i.getPropertyOptions(n),l=typeof o.converter=="function"?{fromAttribute:o.converter}:((s=o.converter)==null?void 0:s.fromAttribute)!==void 0?o.converter:St;this._$Em=n,this[n]=l.fromAttribute(e,o.type),this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){if(s??(s=this.constructor.getPropertyOptions(t)),!(s.hasChanged??pe)(this[t],e))return;this.P(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,s){this._$AL.has(t)||this._$AL.set(t,e),s.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[n,o]of i)o.wrapped!==!0||this._$AL.has(n)||this[n]===void 0||this.P(n,this[n],o)}let e=!1;const s=this._$AL;try{e=this.shouldUpdate(s),e?(this.willUpdate(s),(t=this._$EO)==null||t.forEach(i=>{var n;return(n=i.hostUpdate)==null?void 0:n.call(i)}),this.update(s)):this._$EU()}catch(i){throw e=!1,this._$EU(),i}e&&this._$AE(s)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var i;return(i=s.hostUpdated)==null?void 0:i.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}};Y.elementStyles=[],Y.shadowRootOptions={mode:"open"},Y[lt("elementProperties")]=new Map,Y[lt("finalized")]=new Map,He==null||He({ReactiveElement:Y}),(Q.reactiveElementVersions??(Q.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const xt=globalThis,kt=xt.trustedTypes,De=kt?kt.createPolicy("lit-html",{createHTML:r=>r}):void 0,Es="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,Ss="?"+C,Ti=`<${Ss}>`,z=document,ut=()=>z.createComment(""),dt=r=>r===null||typeof r!="object"&&typeof r!="function",fe=Array.isArray,Ui=r=>fe(r)||typeof(r==null?void 0:r[Symbol.iterator])=="function",Yt=`[ 	
\f\r]`,rt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Fe=/-->/g,Ve=/>/g,L=RegExp(`>|${Yt}(?:([^\\s"'>=/]+)(${Yt}*=${Yt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),qe=/'/g,Be=/"/g,xs=/^(?:script|style|textarea|title)$/i,Ri=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),nt=Ri(1),X=Symbol.for("lit-noChange"),$=Symbol.for("lit-nothing"),We=new WeakMap,M=z.createTreeWalker(z,129);function ks(r,t){if(!fe(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return De!==void 0?De.createHTML(t):t}const Ni=(r,t)=>{const e=r.length-1,s=[];let i,n=t===2?"<svg>":t===3?"<math>":"",o=rt;for(let l=0;l<e;l++){const a=r[l];let d,f,u=-1,c=0;for(;c<a.length&&(o.lastIndex=c,f=o.exec(a),f!==null);)c=o.lastIndex,o===rt?f[1]==="!--"?o=Fe:f[1]!==void 0?o=Ve:f[2]!==void 0?(xs.test(f[2])&&(i=RegExp("</"+f[2],"g")),o=L):f[3]!==void 0&&(o=L):o===L?f[0]===">"?(o=i??rt,u=-1):f[1]===void 0?u=-2:(u=o.lastIndex-f[2].length,d=f[1],o=f[3]===void 0?L:f[3]==='"'?Be:qe):o===Be||o===qe?o=L:o===Fe||o===Ve?o=rt:(o=L,i=void 0);const h=o===L&&r[l+1].startsWith("/>")?" ":"";n+=o===rt?a+Ti:u>=0?(s.push(d),a.slice(0,u)+Es+a.slice(u)+C+h):a+C+(u===-2?l:h)}return[ks(r,n+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};let ee=class Ps{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let n=0,o=0;const l=t.length-1,a=this.parts,[d,f]=Ni(t,e);if(this.el=Ps.createElement(d,s),M.currentNode=this.el.content,e===2||e===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(i=M.nextNode())!==null&&a.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(const u of i.getAttributeNames())if(u.endsWith(Es)){const c=f[o++],h=i.getAttribute(u).split(C),p=/([.?@])?(.*)/.exec(c);a.push({type:1,index:n,name:p[2],strings:h,ctor:p[1]==="."?Ii:p[1]==="?"?Mi:p[1]==="@"?ji:Lt}),i.removeAttribute(u)}else u.startsWith(C)&&(a.push({type:6,index:n}),i.removeAttribute(u));if(xs.test(i.tagName)){const u=i.textContent.split(C),c=u.length-1;if(c>0){i.textContent=kt?kt.emptyScript:"";for(let h=0;h<c;h++)i.append(u[h],ut()),M.nextNode(),a.push({type:2,index:++n});i.append(u[c],ut())}}}else if(i.nodeType===8)if(i.data===Ss)a.push({type:2,index:n});else{let u=-1;for(;(u=i.data.indexOf(C,u+1))!==-1;)a.push({type:7,index:n}),u+=C.length-1}n++}}static createElement(t,e){const s=z.createElement("template");return s.innerHTML=t,s}};function tt(r,t,e=r,s){var i,n;if(t===X)return t;let o=s!==void 0?(i=e.o)==null?void 0:i[s]:e.l;const l=dt(t)?void 0:t._$litDirective$;return(o==null?void 0:o.constructor)!==l&&((n=o==null?void 0:o._$AO)==null||n.call(o,!1),l===void 0?o=void 0:(o=new l(r),o._$AT(r,e,s)),s!==void 0?(e.o??(e.o=[]))[s]=o:e.l=o),o!==void 0&&(t=tt(r,o._$AS(r,t.values),o,s)),t}class Li{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=((t==null?void 0:t.creationScope)??z).importNode(e,!0);M.currentNode=i;let n=M.nextNode(),o=0,l=0,a=s[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new gt(n,n.nextSibling,this,t):a.type===1?d=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(d=new Hi(n,this,t)),this._$AV.push(d),a=s[++l]}o!==(a==null?void 0:a.index)&&(n=M.nextNode(),o++)}return M.currentNode=z,i}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class gt{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this.v}constructor(t,e,s,i){this.type=2,this._$AH=$,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this.v=(i==null?void 0:i.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=tt(this,t,e),dt(t)?t===$||t==null||t===""?(this._$AH!==$&&this._$AR(),this._$AH=$):t!==this._$AH&&t!==X&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Ui(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==$&&dt(this._$AH)?this._$AA.nextSibling.data=t:this.T(z.createTextNode(t)),this._$AH=t}$(t){var e;const{values:s,_$litType$:i}=t,n=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=ee.createElement(ks(i.h,i.h[0]),this.options)),i);if(((e=this._$AH)==null?void 0:e._$AD)===n)this._$AH.p(s);else{const o=new Li(n,this),l=o.u(this.options);o.p(s),this.T(l),this._$AH=o}}_$AC(t){let e=We.get(t.strings);return e===void 0&&We.set(t.strings,e=new ee(t)),e}k(t){fe(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const n of t)i===e.length?e.push(s=new gt(this.O(ut()),this.O(ut()),this,this.options)):s=e[i],s._$AI(n),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){var e;this._$AM===void 0&&(this.v=t,(e=this._$AP)==null||e.call(this,t))}}class Lt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,n){this.type=1,this._$AH=$,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=$}_$AI(t,e=this,s,i){const n=this.strings;let o=!1;if(n===void 0)t=tt(this,t,e,0),o=!dt(t)||t!==this._$AH&&t!==X,o&&(this._$AH=t);else{const l=t;let a,d;for(t=n[0],a=0;a<n.length-1;a++)d=tt(this,l[s+a],e,a),d===X&&(d=this._$AH[a]),o||(o=!dt(d)||d!==this._$AH[a]),d===$?t=$:t!==$&&(t+=(d??"")+n[a+1]),this._$AH[a]=d}o&&!i&&this.j(t)}j(t){t===$?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Ii extends Lt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===$?void 0:t}}class Mi extends Lt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==$)}}class ji extends Lt{constructor(t,e,s,i,n){super(t,e,s,i,n),this.type=5}_$AI(t,e=this){if((t=tt(this,t,e,0)??$)===X)return;const s=this._$AH,i=t===$&&s!==$||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==$&&(s===$||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class Hi{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){tt(this,t)}}const Ye=xt.litHtmlPolyfillSupport;Ye==null||Ye(ee,gt),(xt.litHtmlVersions??(xt.litHtmlVersions=[])).push("3.2.0");const zi=(r,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let i=s._$litPart$;if(i===void 0){const n=(e==null?void 0:e.renderBefore)??null;s._$litPart$=i=new gt(t.insertBefore(ut(),n),n,void 0,e??{})}return i._$AI(r),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let J=class extends Y{constructor(){super(...arguments),this.renderOptions={host:this},this.o=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this.o=zi(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this.o)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this.o)==null||t.setConnected(!1)}render(){return X}};J._$litElement$=!0,J.finalized=!0,(Te=globalThis.litElementHydrateSupport)==null||Te.call(globalThis,{LitElement:J});const Ke=globalThis.litElementPolyfillSupport;Ke==null||Ke({LitElement:J});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Di={attribute:!0,type:String,converter:St,reflect:!1,hasChanged:pe},Fi=(r=Di,t,e)=>{const{kind:s,metadata:i}=e;let n=globalThis.litPropertyMetadata.get(i);if(n===void 0&&globalThis.litPropertyMetadata.set(i,n=new Map),n.set(e.name,r),s==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,r)},init(l){return l!==void 0&&this.P(o,void 0,r),l}}}if(s==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,r)}}throw Error("Unsupported decorator location: "+s)};function Cs(r){return(t,e)=>typeof e=="object"?Fi(r,t,e):((s,i,n)=>{const o=i.hasOwnProperty(n);return i.constructor.createProperty(n,o?{...s,wrapped:!0}:s),o?Object.getOwnPropertyDescriptor(i,n):void 0})(r,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Os(r){return Cs({...r,state:!0,attribute:!1})}function Vi(r){return r&&r.__esModule&&Object.prototype.hasOwnProperty.call(r,"default")?r.default:r}function qi(r){throw new Error('Could not dynamically require "'+r+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var Ts={};(function(r){var t=function(){var e=function(u,c,h,p){for(h=h||{},p=u.length;p--;h[u[p]]=c);return h},s=[1,9],i=[1,10],n=[1,11],o=[1,12],l=[5,11,12,13,14,15],a={trace:function(){},yy:{},symbols_:{error:2,root:3,expressions:4,EOF:5,expression:6,optional:7,literal:8,splat:9,param:10,"(":11,")":12,LITERAL:13,SPLAT:14,PARAM:15,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",11:"(",12:")",13:"LITERAL",14:"SPLAT",15:"PARAM"},productions_:[0,[3,2],[3,1],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[7,3],[8,1],[9,1],[10,1]],performAction:function(c,h,p,g,m,v,Dt){var A=v.length-1;switch(m){case 1:return new g.Root({},[v[A-1]]);case 2:return new g.Root({},[new g.Literal({value:""})]);case 3:this.$=new g.Concat({},[v[A-1],v[A]]);break;case 4:case 5:this.$=v[A];break;case 6:this.$=new g.Literal({value:v[A]});break;case 7:this.$=new g.Splat({name:v[A]});break;case 8:this.$=new g.Param({name:v[A]});break;case 9:this.$=new g.Optional({},[v[A-1]]);break;case 10:this.$=c;break;case 11:case 12:this.$=c.slice(1);break}},table:[{3:1,4:2,5:[1,3],6:4,7:5,8:6,9:7,10:8,11:s,13:i,14:n,15:o},{1:[3]},{5:[1,13],6:14,7:5,8:6,9:7,10:8,11:s,13:i,14:n,15:o},{1:[2,2]},e(l,[2,4]),e(l,[2,5]),e(l,[2,6]),e(l,[2,7]),e(l,[2,8]),{4:15,6:4,7:5,8:6,9:7,10:8,11:s,13:i,14:n,15:o},e(l,[2,10]),e(l,[2,11]),e(l,[2,12]),{1:[2,1]},e(l,[2,3]),{6:14,7:5,8:6,9:7,10:8,11:s,12:[1,16],13:i,14:n,15:o},e(l,[2,9])],defaultActions:{3:[2,2],13:[2,1]},parseError:function(c,h){if(h.recoverable)this.trace(c);else{let p=function(g,m){this.message=g,this.hash=m};throw p.prototype=Error,new p(c,h)}},parse:function(c){var h=this,p=[0],g=[null],m=[],v=this.table,Dt="",A=0,Pe=0,Ks=2,Ce=1,Js=m.slice.call(arguments,1),_=Object.create(this.lexer),R={yy:{}};for(var Ft in this.yy)Object.prototype.hasOwnProperty.call(this.yy,Ft)&&(R.yy[Ft]=this.yy[Ft]);_.setInput(c,R.yy),R.yy.lexer=_,R.yy.parser=this,typeof _.yylloc>"u"&&(_.yylloc={});var Vt=_.yylloc;m.push(Vt);var Zs=_.options&&_.options.ranges;typeof R.yy.parseError=="function"?this.parseError=R.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var Gs=function(){var q;return q=_.lex()||Ce,typeof q!="number"&&(q=h.symbols_[q]||q),q},w,N,E,qt,V={},$t,k,Oe,bt;;){if(N=p[p.length-1],this.defaultActions[N]?E=this.defaultActions[N]:((w===null||typeof w>"u")&&(w=Gs()),E=v[N]&&v[N][w]),typeof E>"u"||!E.length||!E[0]){var Bt="";bt=[];for($t in v[N])this.terminals_[$t]&&$t>Ks&&bt.push("'"+this.terminals_[$t]+"'");_.showPosition?Bt="Parse error on line "+(A+1)+`:
`+_.showPosition()+`
Expecting `+bt.join(", ")+", got '"+(this.terminals_[w]||w)+"'":Bt="Parse error on line "+(A+1)+": Unexpected "+(w==Ce?"end of input":"'"+(this.terminals_[w]||w)+"'"),this.parseError(Bt,{text:_.match,token:this.terminals_[w]||w,line:_.yylineno,loc:Vt,expected:bt})}if(E[0]instanceof Array&&E.length>1)throw new Error("Parse Error: multiple actions possible at state: "+N+", token: "+w);switch(E[0]){case 1:p.push(w),g.push(_.yytext),m.push(_.yylloc),p.push(E[1]),w=null,Pe=_.yyleng,Dt=_.yytext,A=_.yylineno,Vt=_.yylloc;break;case 2:if(k=this.productions_[E[1]][1],V.$=g[g.length-k],V._$={first_line:m[m.length-(k||1)].first_line,last_line:m[m.length-1].last_line,first_column:m[m.length-(k||1)].first_column,last_column:m[m.length-1].last_column},Zs&&(V._$.range=[m[m.length-(k||1)].range[0],m[m.length-1].range[1]]),qt=this.performAction.apply(V,[Dt,Pe,A,R.yy,E[1],g,m].concat(Js)),typeof qt<"u")return qt;k&&(p=p.slice(0,-1*k*2),g=g.slice(0,-1*k),m=m.slice(0,-1*k)),p.push(this.productions_[E[1]][0]),g.push(V.$),m.push(V._$),Oe=v[p[p.length-2]][p[p.length-1]],p.push(Oe);break;case 3:return!0}}return!0}},d=function(){var u={EOF:1,parseError:function(h,p){if(this.yy.parser)this.yy.parser.parseError(h,p);else throw new Error(h)},setInput:function(c,h){return this.yy=h||this.yy||{},this._input=c,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var c=this._input[0];this.yytext+=c,this.yyleng++,this.offset++,this.match+=c,this.matched+=c;var h=c.match(/(?:\r\n?|\n).*/g);return h?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),c},unput:function(c){var h=c.length,p=c.split(/(?:\r\n?|\n)/g);this._input=c+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-h),this.offset-=h;var g=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),p.length-1&&(this.yylineno-=p.length-1);var m=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:p?(p.length===g.length?this.yylloc.first_column:0)+g[g.length-p.length].length-p[0].length:this.yylloc.first_column-h},this.options.ranges&&(this.yylloc.range=[m[0],m[0]+this.yyleng-h]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(c){this.unput(this.match.slice(c))},pastInput:function(){var c=this.matched.substr(0,this.matched.length-this.match.length);return(c.length>20?"...":"")+c.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var c=this.match;return c.length<20&&(c+=this._input.substr(0,20-c.length)),(c.substr(0,20)+(c.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var c=this.pastInput(),h=new Array(c.length+1).join("-");return c+this.upcomingInput()+`
`+h+"^"},test_match:function(c,h){var p,g,m;if(this.options.backtrack_lexer&&(m={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(m.yylloc.range=this.yylloc.range.slice(0))),g=c[0].match(/(?:\r\n?|\n).*/g),g&&(this.yylineno+=g.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:g?g[g.length-1].length-g[g.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+c[0].length},this.yytext+=c[0],this.match+=c[0],this.matches=c,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(c[0].length),this.matched+=c[0],p=this.performAction.call(this,this.yy,this,h,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),p)return p;if(this._backtrack){for(var v in m)this[v]=m[v];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var c,h,p,g;this._more||(this.yytext="",this.match="");for(var m=this._currentRules(),v=0;v<m.length;v++)if(p=this._input.match(this.rules[m[v]]),p&&(!h||p[0].length>h[0].length)){if(h=p,g=v,this.options.backtrack_lexer){if(c=this.test_match(p,m[v]),c!==!1)return c;if(this._backtrack){h=!1;continue}else return!1}else if(!this.options.flex)break}return h?(c=this.test_match(h,m[g]),c!==!1?c:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var h=this.next();return h||this.lex()},begin:function(h){this.conditionStack.push(h)},popState:function(){var h=this.conditionStack.length-1;return h>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(h){return h=this.conditionStack.length-1-Math.abs(h||0),h>=0?this.conditionStack[h]:"INITIAL"},pushState:function(h){this.begin(h)},stateStackSize:function(){return this.conditionStack.length},options:{},performAction:function(h,p,g,m){switch(g){case 0:return"(";case 1:return")";case 2:return"SPLAT";case 3:return"PARAM";case 4:return"LITERAL";case 5:return"LITERAL";case 6:return"EOF"}},rules:[/^(?:\()/,/^(?:\))/,/^(?:\*+\w+)/,/^(?::+\w+)/,/^(?:[\w%\-~\n]+)/,/^(?:.)/,/^(?:$)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6],inclusive:!0}}};return u}();a.lexer=d;function f(){this.yy={}}return f.prototype=a,a.Parser=f,new f}();typeof qi<"u"&&(r.parser=t,r.Parser=t.Parser,r.parse=function(){return t.parse.apply(t,arguments)})})(Ts);function W(r){return function(t,e){return{displayName:r,props:t,children:e||[]}}}var Us={Root:W("Root"),Concat:W("Concat"),Literal:W("Literal"),Splat:W("Splat"),Param:W("Param"),Optional:W("Optional")},Rs=Ts.parser;Rs.yy=Us;var Bi=Rs,Wi=Object.keys(Us);function Yi(r){return Wi.forEach(function(t){if(typeof r[t]>"u")throw new Error("No handler defined for "+t.displayName)}),{visit:function(t,e){return this.handlers[t.displayName].call(this,t,e)},handlers:r}}var Ns=Yi,Ki=Ns,Ji=/[\-{}\[\]+?.,\\\^$|#\s]/g;function Ls(r){this.captures=r.captures,this.re=r.re}Ls.prototype.match=function(r){var t=this.re.exec(r),e={};if(t)return this.captures.forEach(function(s,i){typeof t[i+1]>"u"?e[s]=void 0:e[s]=decodeURIComponent(t[i+1])}),e};var Zi=Ki({Concat:function(r){return r.children.reduce((function(t,e){var s=this.visit(e);return{re:t.re+s.re,captures:t.captures.concat(s.captures)}}).bind(this),{re:"",captures:[]})},Literal:function(r){return{re:r.props.value.replace(Ji,"\\$&"),captures:[]}},Splat:function(r){return{re:"([^?]*?)",captures:[r.props.name]}},Param:function(r){return{re:"([^\\/\\?]+)",captures:[r.props.name]}},Optional:function(r){var t=this.visit(r.children[0]);return{re:"(?:"+t.re+")?",captures:t.captures}},Root:function(r){var t=this.visit(r.children[0]);return new Ls({re:new RegExp("^"+t.re+"(?=\\?|$)"),captures:t.captures})}}),Gi=Zi,Qi=Ns,Xi=Qi({Concat:function(r,t){var e=r.children.map((function(s){return this.visit(s,t)}).bind(this));return e.some(function(s){return s===!1})?!1:e.join("")},Literal:function(r){return decodeURI(r.props.value)},Splat:function(r,t){return t[r.props.name]?t[r.props.name]:!1},Param:function(r,t){return t[r.props.name]?t[r.props.name]:!1},Optional:function(r,t){var e=this.visit(r.children[0],t);return e||""},Root:function(r,t){t=t||{};var e=this.visit(r.children[0],t);return e?encodeURI(e):!1}}),tr=Xi,er=Bi,sr=Gi,ir=tr;vt.prototype=Object.create(null);vt.prototype.match=function(r){var t=sr.visit(this.ast),e=t.match(r);return e||!1};vt.prototype.reverse=function(r){return ir.visit(this.ast,r)};function vt(r){var t;if(this?t=this:t=Object.create(vt.prototype),typeof r>"u")throw new Error("A route spec is required");return t.spec=r,t.ast=er.parse(r),t}var rr=vt,nr=rr,or=nr;const ar=Vi(or);var lr=Object.defineProperty,Is=(r,t,e,s)=>{for(var i=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&lr(t,e,i),i};const Ms=class extends J{constructor(t,e,s=""){super(),this._cases=[],this._fallback=()=>nt` <h1>Not Found</h1> `,this._cases=t.map(i=>({...i,route:new ar(i.path)})),this._historyObserver=new P(this,e),this._authObserver=new P(this,s)}connectedCallback(){this._historyObserver.observe(({location:t})=>{console.log("New location",t),t&&(this._match=this.matchRoute(t))}),this._authObserver.observe(({user:t})=>{this._user=t}),super.connectedCallback()}render(){return console.log("Rendering for match",this._match,this._user),nt` <main>${(()=>{const e=this._match;if(e){if("view"in e)return this._user?e.auth&&e.auth!=="public"&&this._user&&!this._user.authenticated?(ds(this,"auth/redirect"),nt` <h1>Redirecting for Login</h1> `):(console.log("Loading view, ",e.params,e.query),e.view(e.params||{},e.query)):nt` <h1>Authenticating</h1> `;if("redirect"in e){const s=e.redirect;if(typeof s=="string")return this.redirect(s),nt` <h1>Redirecting to ${s}…</h1> `}}return this._fallback({})})()}</main> `}updated(t){t.has("_match")&&this.requestUpdate()}matchRoute(t){const{search:e,pathname:s}=t,i=new URLSearchParams(e),n=s+e;for(const o of this._cases){const l=o.route.match(n);if(l)return{...o,path:s,params:l,query:i}}}redirect(t){he(this,"history/redirect",{href:t})}};Ms.styles=wi`
    :host,
    main {
      display: contents;
    }
  `;let Pt=Ms;Is([Os()],Pt.prototype,"_user");Is([Os()],Pt.prototype,"_match");const cr=Object.freeze(Object.defineProperty({__proto__:null,Element:Pt,Switch:Pt},Symbol.toStringTag,{value:"Module"})),js=class Hs extends HTMLElement{constructor(){if(super(),Nt(this).template(Hs.template),this.shadowRoot){const t=this.shadowRoot.querySelector("slot[name='actuator']");t&&t.addEventListener("click",()=>this.toggle())}}toggle(){this.hasAttribute("open")?this.removeAttribute("open"):this.setAttribute("open","open")}};js.template=H`
    <template>
      <slot name="actuator"><button>Menu</button></slot>
      <div id="panel">
        <slot></slot>
      </div>

      <style>
        :host {
          position: relative;
        }
        #is-shown {
          display: none;
        }
        #panel {
          display: none;

          position: absolute;
          right: 0;
          margin-top: var(--size-spacing-small);
          width: max-content;
          padding: var(--size-spacing-small);
          border-radius: var(--size-radius-small);
          background: var(--color-background-card);
          color: var(--color-text);
          box-shadow: var(--shadow-popover);
        }
        :host([open]) #panel {
          display: block;
        }
      </style>
    </template>
  `;let hr=js;const ur=Object.freeze(Object.defineProperty({__proto__:null,Element:hr},Symbol.toStringTag,{value:"Module"})),me=class se extends HTMLElement{constructor(){super(),this._array=[],Nt(this).template(se.template).styles(se.styles),this.addEventListener("input-array:add",t=>{t.stopPropagation(),this.append(zs("",this._array.length))}),this.addEventListener("input-array:remove",t=>{t.stopPropagation(),this.removeClosestItem(t.target)}),this.addEventListener("change",t=>{t.stopPropagation();const e=t.target;if(e&&e!==this){const s=new Event("change",{bubbles:!0}),i=e.value,n=e.closest("label");if(n){const o=Array.from(this.children).indexOf(n);this._array[o]=i,this.dispatchEvent(s)}}}),this.addEventListener("click",t=>{te(t,"button.add")?Et(t,"input-array:add"):te(t,"button.remove")&&Et(t,"input-array:remove")})}get name(){return this.getAttribute("name")}get value(){return this._array}set value(t){this._array=Array.isArray(t)?t:[t],pr(this._array,this)}removeClosestItem(t){const e=t.closest("label");if(console.log("Removing closest item:",e,t),e){const s=Array.from(this.children).indexOf(e);this._array.splice(s,1),e.remove()}}};me.template=H`
    <template>
      <ul>
        <slot></slot>
      </ul>
      <button class="add">
        <slot name="label-add">Add one</slot>
        <style></style>
      </button>
    </template>
  `;me.styles=fs`
    :host {
      display: grid;
      grid-template-columns: subgrid;
      grid-column: input / end;
    }
    ul {
      display: contents;
    }
    button.add {
      grid-column: input / input-end;
    }
    ::slotted(label) {
      grid-column: 1 / -1;
      display: grid;
      grid-template-columns: subgrid;
    }
  `;let dr=me;function pr(r,t){t.replaceChildren(),r.forEach((e,s)=>t.append(zs(e)))}function zs(r,t){const e=r===void 0?H`<input />`:H`<input value="${r}" />`;return H`
    <label>
      ${e}
      <button class="remove" type="button">Remove</button>
    </label>
  `}const fr=Object.freeze(Object.defineProperty({__proto__:null,Element:dr},Symbol.toStringTag,{value:"Module"}));function It(r){return Object.entries(r).map(([t,e])=>{customElements.get(t)||customElements.define(t,e)}),customElements}var mr=Object.defineProperty,gr=Object.getOwnPropertyDescriptor,vr=(r,t,e,s)=>{for(var i=gr(t,e),n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&mr(t,e,i),i};class ge extends J{constructor(t){super(),this._pending=[],this._observer=new P(this,t)}get model(){return this._lastModel=this._context?this._context.value:{},this._lastModel}connectedCallback(){var t;super.connectedCallback(),(t=this._observer)==null||t.observe().then(e=>{console.log("View effect (initial)",this,e),this._context=e.context,this._pending.length&&this._pending.forEach(([s,i])=>{console.log("Dispatching queued event",i,s),s.dispatchEvent(i)}),e.setEffect(()=>{var s;if(console.log("View effect",this,e,(s=this._context)==null?void 0:s.value),this._context)console.log("requesting update"),this.requestUpdate();else throw"View context not ready for effect"})})}dispatchMessage(t,e=this){const s=new CustomEvent("mu:message",{bubbles:!0,composed:!0,detail:t});this._context?(console.log("Dispatching message event",s),e.dispatchEvent(s)):(console.log("Queueing message event",s),this._pending.push([e,s]))}ref(t){return this.model?this.model[t]:void 0}}vr([Cs()],ge.prototype,"model");const yr={};function _r(r,t,e){switch(r[0]){case"app/trails":$r(r[1],e).then(i=>t(n=>({...n,profile:i})));break;case"trail/save":br(r[1],e).then(i=>t(n=>({...n,profile:i})));break;default:const s=r[0];throw new Error(`Unhandled Auth message "${s}"`)}}function $r(r,t){return fetch(`/app/trails/${r.trailID}`,{headers:S.headers(t)}).then(e=>{if(e.status===200)return e.json()}).then(e=>{if(e)return console.log(e),e})}function br(r,t){return fetch(`/api/trails/${r.trailID}`,{method:"PUT",headers:{"Content-Type":"application/json",...S.headers(t)},body:JSON.stringify(r.trail)}).then(e=>{if(e.status===200)return e.json();throw new Error(`Failed to save trail for ${r.trailID}`)}).then(e=>e)}/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const At=globalThis,ve=At.ShadowRoot&&(At.ShadyCSS===void 0||At.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,ye=Symbol(),Je=new WeakMap;let Ds=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==ye)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(ve&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=Je.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&Je.set(e,t))}return t}toString(){return this.cssText}};const wr=r=>new Ds(typeof r=="string"?r:r+"",void 0,ye),yt=(r,...t)=>{const e=r.length===1?r[0]:t.reduce((s,i,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[n+1],r[0]);return new Ds(e,r,ye)},Ar=(r,t)=>{if(ve)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),i=At.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,r.appendChild(s)}},Ze=ve?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return wr(e)})(r):r;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:Er,defineProperty:Sr,getOwnPropertyDescriptor:xr,getOwnPropertyNames:kr,getOwnPropertySymbols:Pr,getPrototypeOf:Cr}=Object,T=globalThis,Ge=T.trustedTypes,Or=Ge?Ge.emptyScript:"",Kt=T.reactiveElementPolyfillSupport,ct=(r,t)=>r,Ct={toAttribute(r,t){switch(t){case Boolean:r=r?Or:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},_e=(r,t)=>!Er(r,t),Qe={attribute:!0,type:String,converter:Ct,reflect:!1,hasChanged:_e};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),T.litPropertyMetadata??(T.litPropertyMetadata=new WeakMap);class K extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Qe){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&Sr(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:n}=xr(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get(){return i==null?void 0:i.call(this)},set(o){const l=i==null?void 0:i.call(this);n.call(this,o),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Qe}static _$Ei(){if(this.hasOwnProperty(ct("elementProperties")))return;const t=Cr(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(ct("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ct("properties"))){const e=this.properties,s=[...kr(e),...Pr(e)];for(const i of s)this.createProperty(i,e[i])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const i of s)e.unshift(Ze(i))}else t!==void 0&&e.push(Ze(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return Ar(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EC(t,e){var n;const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){const o=(((n=s.converter)==null?void 0:n.toAttribute)!==void 0?s.converter:Ct).toAttribute(e,s.type);this._$Em=t,o==null?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,e){var n;const s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){const o=s.getPropertyOptions(i),l=typeof o.converter=="function"?{fromAttribute:o.converter}:((n=o.converter)==null?void 0:n.fromAttribute)!==void 0?o.converter:Ct;this._$Em=i,this[i]=l.fromAttribute(e,o.type),this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){if(s??(s=this.constructor.getPropertyOptions(t)),!(s.hasChanged??_e)(this[t],e))return;this.P(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,s){this._$AL.has(t)||this._$AL.set(t,e),s.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var s;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[n,o]of i)o.wrapped!==!0||this._$AL.has(n)||this[n]===void 0||this.P(n,this[n],o)}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),(s=this._$EO)==null||s.forEach(i=>{var n;return(n=i.hostUpdate)==null?void 0:n.call(i)}),this.update(e)):this._$EU()}catch(i){throw t=!1,this._$EU(),i}t&&this._$AE(e)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var i;return(i=s.hostUpdated)==null?void 0:i.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}}K.elementStyles=[],K.shadowRootOptions={mode:"open"},K[ct("elementProperties")]=new Map,K[ct("finalized")]=new Map,Kt==null||Kt({ReactiveElement:K}),(T.reactiveElementVersions??(T.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ht=globalThis,Ot=ht.trustedTypes,Xe=Ot?Ot.createPolicy("lit-html",{createHTML:r=>r}):void 0,Fs="$lit$",O=`lit$${Math.random().toFixed(9).slice(2)}$`,Vs="?"+O,Tr=`<${Vs}>`,D=document,pt=()=>D.createComment(""),ft=r=>r===null||typeof r!="object"&&typeof r!="function",$e=Array.isArray,Ur=r=>$e(r)||typeof(r==null?void 0:r[Symbol.iterator])=="function",Jt=`[ 	
\f\r]`,ot=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,ts=/-->/g,es=/>/g,I=RegExp(`>|${Jt}(?:([^\\s"'>=/]+)(${Jt}*=${Jt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),ss=/'/g,is=/"/g,qs=/^(?:script|style|textarea|title)$/i,Rr=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),y=Rr(1),et=Symbol.for("lit-noChange"),b=Symbol.for("lit-nothing"),rs=new WeakMap,j=D.createTreeWalker(D,129);function Bs(r,t){if(!$e(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return Xe!==void 0?Xe.createHTML(t):t}const Nr=(r,t)=>{const e=r.length-1,s=[];let i,n=t===2?"<svg>":t===3?"<math>":"",o=ot;for(let l=0;l<e;l++){const a=r[l];let d,f,u=-1,c=0;for(;c<a.length&&(o.lastIndex=c,f=o.exec(a),f!==null);)c=o.lastIndex,o===ot?f[1]==="!--"?o=ts:f[1]!==void 0?o=es:f[2]!==void 0?(qs.test(f[2])&&(i=RegExp("</"+f[2],"g")),o=I):f[3]!==void 0&&(o=I):o===I?f[0]===">"?(o=i??ot,u=-1):f[1]===void 0?u=-2:(u=o.lastIndex-f[2].length,d=f[1],o=f[3]===void 0?I:f[3]==='"'?is:ss):o===is||o===ss?o=I:o===ts||o===es?o=ot:(o=I,i=void 0);const h=o===I&&r[l+1].startsWith("/>")?" ":"";n+=o===ot?a+Tr:u>=0?(s.push(d),a.slice(0,u)+Fs+a.slice(u)+O+h):a+O+(u===-2?l:h)}return[Bs(r,n+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};class mt{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let n=0,o=0;const l=t.length-1,a=this.parts,[d,f]=Nr(t,e);if(this.el=mt.createElement(d,s),j.currentNode=this.el.content,e===2||e===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(i=j.nextNode())!==null&&a.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(const u of i.getAttributeNames())if(u.endsWith(Fs)){const c=f[o++],h=i.getAttribute(u).split(O),p=/([.?@])?(.*)/.exec(c);a.push({type:1,index:n,name:p[2],strings:h,ctor:p[1]==="."?Ir:p[1]==="?"?Mr:p[1]==="@"?jr:Mt}),i.removeAttribute(u)}else u.startsWith(O)&&(a.push({type:6,index:n}),i.removeAttribute(u));if(qs.test(i.tagName)){const u=i.textContent.split(O),c=u.length-1;if(c>0){i.textContent=Ot?Ot.emptyScript:"";for(let h=0;h<c;h++)i.append(u[h],pt()),j.nextNode(),a.push({type:2,index:++n});i.append(u[c],pt())}}}else if(i.nodeType===8)if(i.data===Vs)a.push({type:2,index:n});else{let u=-1;for(;(u=i.data.indexOf(O,u+1))!==-1;)a.push({type:7,index:n}),u+=O.length-1}n++}}static createElement(t,e){const s=D.createElement("template");return s.innerHTML=t,s}}function st(r,t,e=r,s){var o,l;if(t===et)return t;let i=s!==void 0?(o=e._$Co)==null?void 0:o[s]:e._$Cl;const n=ft(t)?void 0:t._$litDirective$;return(i==null?void 0:i.constructor)!==n&&((l=i==null?void 0:i._$AO)==null||l.call(i,!1),n===void 0?i=void 0:(i=new n(r),i._$AT(r,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=i:e._$Cl=i),i!==void 0&&(t=st(r,i._$AS(r,t.values),i,s)),t}class Lr{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=((t==null?void 0:t.creationScope)??D).importNode(e,!0);j.currentNode=i;let n=j.nextNode(),o=0,l=0,a=s[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new _t(n,n.nextSibling,this,t):a.type===1?d=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(d=new Hr(n,this,t)),this._$AV.push(d),a=s[++l]}o!==(a==null?void 0:a.index)&&(n=j.nextNode(),o++)}return j.currentNode=D,i}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class _t{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=b,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=(i==null?void 0:i.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=st(this,t,e),ft(t)?t===b||t==null||t===""?(this._$AH!==b&&this._$AR(),this._$AH=b):t!==this._$AH&&t!==et&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Ur(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==b&&ft(this._$AH)?this._$AA.nextSibling.data=t:this.T(D.createTextNode(t)),this._$AH=t}$(t){var n;const{values:e,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=mt.createElement(Bs(s.h,s.h[0]),this.options)),s);if(((n=this._$AH)==null?void 0:n._$AD)===i)this._$AH.p(e);else{const o=new Lr(i,this),l=o.u(this.options);o.p(e),this.T(l),this._$AH=o}}_$AC(t){let e=rs.get(t.strings);return e===void 0&&rs.set(t.strings,e=new mt(t)),e}k(t){$e(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const n of t)i===e.length?e.push(s=new _t(this.O(pt()),this.O(pt()),this,this.options)):s=e[i],s._$AI(n),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}}class Mt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,n){this.type=1,this._$AH=b,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=b}_$AI(t,e=this,s,i){const n=this.strings;let o=!1;if(n===void 0)t=st(this,t,e,0),o=!ft(t)||t!==this._$AH&&t!==et,o&&(this._$AH=t);else{const l=t;let a,d;for(t=n[0],a=0;a<n.length-1;a++)d=st(this,l[s+a],e,a),d===et&&(d=this._$AH[a]),o||(o=!ft(d)||d!==this._$AH[a]),d===b?t=b:t!==b&&(t+=(d??"")+n[a+1]),this._$AH[a]=d}o&&!i&&this.j(t)}j(t){t===b?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Ir extends Mt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===b?void 0:t}}class Mr extends Mt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==b)}}class jr extends Mt{constructor(t,e,s,i,n){super(t,e,s,i,n),this.type=5}_$AI(t,e=this){if((t=st(this,t,e,0)??b)===et)return;const s=this._$AH,i=t===b&&s!==b||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==b&&(s===b||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class Hr{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){st(this,t)}}const Zt=ht.litHtmlPolyfillSupport;Zt==null||Zt(mt,_t),(ht.litHtmlVersions??(ht.litHtmlVersions=[])).push("3.2.1");const zr=(r,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let i=s._$litPart$;if(i===void 0){const n=(e==null?void 0:e.renderBefore)??null;s._$litPart$=i=new _t(t.insertBefore(pt(),n),n,void 0,e??{})}return i._$AI(r),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let x=class extends K{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=zr(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return et}};var ns;x._$litElement$=!0,x.finalized=!0,(ns=globalThis.litElementHydrateSupport)==null||ns.call(globalThis,{LitElement:x});const Gt=globalThis.litElementPolyfillSupport;Gt==null||Gt({LitElement:x});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.1");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Dr={attribute:!0,type:String,converter:Ct,reflect:!1,hasChanged:_e},Fr=(r=Dr,t,e)=>{const{kind:s,metadata:i}=e;let n=globalThis.litPropertyMetadata.get(i);if(n===void 0&&globalThis.litPropertyMetadata.set(i,n=new Map),n.set(e.name,r),s==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,r)},init(l){return l!==void 0&&this.P(o,void 0,r),l}}}if(s==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,r)}}throw Error("Unsupported decorator location: "+s)};function jt(r){return(t,e)=>typeof e=="object"?Fr(r,t,e):((s,i,n)=>{const o=i.hasOwnProperty(n);return i.constructor.createProperty(n,o?{...s,wrapped:!0}:s),o?Object.getOwnPropertyDescriptor(i,n):void 0})(r,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function U(r){return jt({...r,state:!0,attribute:!1})}var Vr=Object.defineProperty,qr=(r,t,e,s)=>{for(var i=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&Vr(t,e,i),i};function Br(r){const e=r.target.checked;document.body.classList.toggle("dark-mode",e),ps.relay(r,"dark-mode",{checked:e})}const Rt=class Rt extends x{constructor(){super(...arguments),this.userId="hiker",this._user=new S.User,this._authObserver=new P(this,"blazing:auth"),this.handleSignOut=t=>{t.preventDefault(),ps.relay(t,"auth:message",["auth/signout"]),this._user=new S.User,window.location.href="/login"}}connectedCallback(){super.connectedCallback(),console.log("HeaderElement connected to the DOM."),this._authObserver.observe(({user:t})=>{console.log("Auth observer triggered with user:",t),t&&(this._user=t,this.loadUserId())}),this.loadUserId()}updated(){var e;const t=(e=this.shadowRoot)==null?void 0:e.querySelector("#signout");t&&t.addEventListener("click",this.handleSignOut)}disconnectedCallback(){var e;super.disconnectedCallback();const t=(e=this.shadowRoot)==null?void 0:e.querySelector("#signout");t&&t.removeEventListener("click",this.handleSignOut)}loadUserId(){console.log("Loading user ID...");const t=this._user;t&&t.username?(console.log("User found:",t.username),this.userId=t.username):this.userId="hiker"}render(){return y`
        <header>
          <h1>PNW Hikes</h1>
          <nav>
            <drop-down>
              <a slot="actuator">
                Hello,
                <span id="userid">${this.userId}</span>
              </a>
              <menu>
                <label @change=${Br}>
                  <input type="checkbox" autocomplete="off" />
                  Dark mode
                </label>
  
                <label class="when-signed-in">
                  <a id="signout">Sign Out</a>
                </label>
  
                <label class="when-signed-out">
                  <a href="/login">Sign In</a>
                </label>
              </menu>
            </drop-down>
          </nav>
        </header>
      `}};Rt.uses=It({"drop-down":ur.Element}),Rt.styles=yt`
    :host {
      display: contents;
    }
    header {
      display: flex;
      flex-wrap: wrap;
      align-items: bottom;
      justify-content: space-between;
      padding: var(--size-spacing-medium);
      background-color: var(--color-background-header);
      color: var(--color-text-inverted);
    }
    header ~ * {
      margin: var(--size-spacing-medium);
    }
    header p {
      --color-link: var(--color-link-inverted);
    }
    nav {
      display: flex;
      flex-direction: column;
      flex-basis: max-content;
      align-items: end;
    }
    a[slot="actuator"] {
      color: var(--color-link-inverted);
      cursor: pointer;
    }
    #userid:empty::before {
      content: "hiker";
    }
    menu a {
      color: var(--color-link);
      cursor: pointer;
      text-decoration: underline;
    }
    a:has(#userid:empty) ~ menu > .when-signed-in,
    a:has(#userid:not(:empty)) ~ menu > .when-signed-out {
      display: none;
    }

    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      background-color: var(--color-background-page);
      color: var(--color-text-default);
      font-family: var(--font-family-body);
      font-size: var(--font-size-base);
      max-width: 1200px;
      margin: 0 auto;
      padding: var(--padding-default);
    }

    header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--padding-default);
      background-color: var(--color-background-header);
      color: var(--color-text-header);
      font-family: var(--font-family-heading);
    }
  `;let Tt=Rt;qr([U()],Tt.prototype,"userId");var Wr=Object.defineProperty,Ht=(r,t,e,s)=>{for(var i=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&Wr(t,e,i),i};const we=class we extends x{constructor(){super(...arguments),this.mode="view",this.src="",this._user=new S.User,this.slots={},this._authObserver=new P(this,"blazing:auth"),this.handleEdit=()=>{console.log("Switching to edit mode"),this.mode="edit"}}connectedCallback(){super.connectedCallback(),console.log("TrailCard connected to DOM"),this._authObserver.observe(({user:t})=>{console.log("Auth observer triggered:",t),t&&(this._user=t),t!=null&&t.authenticated&&this.src&&this.hydrate(this.src)})}hydrate(t){fetch(t,{headers:S.headers(this._user)}).then(e=>{if(!e.ok)throw new Error(`Failed to fetch trail data: ${e.status}`);return e.json()}).then(e=>{console.log("Trail data fetched:",e),this.slots=e}).catch(e=>console.error("Error fetching trail data:",e))}submit(t,e){console.log("Submit: Sending PUT request to:",t),console.log("Submit: Payload being sent:",e),fetch(t,{method:"PUT",headers:{"Content-Type":"application/json",...S.headers(this._user)},body:JSON.stringify(e)}).then(s=>{if(!s.ok)throw console.error(`Submit: Server responded with status ${s.status}`),new Error(`Failed to update resource: ${s.status} ${s.statusText}`);return s.json()}).then(s=>{console.log("Submit: Successfully updated resource:",s),this.slots=s,this.mode="view"}).catch(s=>{console.error("Submit: Error occurred while updating resource:",s)})}handleSubmit(t){var i;t.preventDefault();const e=(i=this.shadowRoot)==null?void 0:i.querySelector("mu-form");if(!e){console.error("Form not found");return}const s={};e.querySelectorAll("input").forEach(n=>{const o=n.name,l=n.value;o&&(s[o]=l)}),this.submit(this.src,s)}render(){const t=[{href:"groups",text:"Hiking Groups"},{href:"gear",text:"Gear"},{href:"viewpoints",text:"Viewpoints"}];return y`
        ${this.mode==="view"?y`
                <!-- View Mode -->
                <section class="view">
                    <div class="card">
                        <h2 class="card-title">
                            <slot name="name">${this.slots.name||"Default Title"}</slot>
                        </h2>
                        <p class="card-content">
                            <slot name="description">${this.slots.description||"Default Content"}</slot>
                        </p>
                        <p class="card-content location">
                            <svg class="icon" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                                <path
                                    d="M12 2C8.13 2 5 5.13 5 9c0 4.71 7 13 7 13s7-8.29 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"
                                />
                            </svg>
                            <slot name="location">${this.slots.location||"Default Location"}</slot>
                        </p>
                        <nav class="card-nav">
                            <slot name="nav">
                                <ul class="nav-list">
                                ${t.map(e=>y`
                                        <li>
                                            <a href="${e.href}">${e.text}</a>
                                        </li>
                                    `)}
                                </ul>
                            </slot>
                        </nav>
                        <button @click=${this.handleEdit}>Edit</button>
                    </div>
                </section>
            `:y`
                <!-- Edit Mode -->
                <section class="edit">
                    <mu-form @mu-form:submit=${this.handleSubmit}>
                        <label>
                            <span>Trail Description</span>
                            <input
                                name="description"
                                .value=${this.slots.description||""}
                                @input=${e=>this.slots.description=e.target.value}
                            />
                        </label>
                        <label>
                            <span>Location</span>
                            <input
                                name="location"
                                .value=${this.slots.location||""}
                                @input=${e=>this.slots.location=e.target.value}
                            />
                        </label>
                        <button type="button" @click=${this.handleSubmit}>Save</button>
                    </mu-form>
                </section>
            `}
    `}};we.styles=yt`
    :host {
      display: block;
      padding: var(--padding-default);
      max-width: 300px;
      background-color: var(--color-background-header);
      color: var(--color-text-default);
    }

    section.view {
      display: block;
    }

    :host([mode="edit"]) section.view {
      display: none;
    }

    mu-form.edit {
      display: none;
    }

    :host([mode="edit"]) mu-form.edit {
      display: block;
    }

    .card {
      border: 1px solid var(--color-link);
      border-radius: 8px;
      padding: var(--padding-default);
      transition: transform 0.2s;
    }

    .card:hover {
      transform: scale(1.05);
    }

    .card-title {
      font-family: var(--font-family-heading);
      font-size: var(--font-size-large);
      margin-bottom: var(--padding-small);
    }

    .card-content {
      font-family: var(--font-family-body);
      font-size: var(--font-size-base);
    }

    .location {
      display: flex;
      align-items: center;
    }

    .icon {
      width: 16px;
      height: 16px;
      margin-right: 8px;
      fill: var(--color-link);
    }
  `;let F=we;Ht([U()],F.prototype,"mode");Ht([jt({type:String})],F.prototype,"src");Ht([U()],F.prototype,"_user");Ht([U()],F.prototype,"slots");var Yr=Object.defineProperty,Kr=(r,t,e,s)=>{for(var i=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&Yr(t,e,i),i};class Ws extends x{constructor(){super(...arguments),this.src="/api/trails",this.trailIndex=[],this._authObserver=new P(this,"blazing:auth"),this._user=new S.User}render(){return y`
        <main class="page">
        <header>
          <h1>Welcome to the center for all things trails in the Pacific Northwest</h1>
          <p>
            <a href="/app/trails">Click here to see all trails</a>
          </p>
        </header>
      </main>
    `}renderItem(t){return y`
      <trail-card 
          src="/api/trails/${t.name}">
      </trail-card>
    `}hydrate(t){fetch(t,{headers:S.headers(this._user)}).then(e=>{if(e.status===200)return e.json();throw`Server responded with status ${e.status}`}).then(e=>{this.trailIndex=e||[]}).catch(e=>console.error("Failed to fetch trail data:",e))}connectedCallback(){super.connectedCallback(),this._authObserver.observe(({user:t})=>{t&&(this._user=t),this.hydrate(this.src)})}}Kr([U()],Ws.prototype,"trailIndex");var Jr=Object.defineProperty,Zr=(r,t,e,s)=>{for(var i=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&Jr(t,e,i),i};class Ys extends x{constructor(){super(...arguments),this.src="/api/trails",this.trailIndex=[],this._authObserver=new P(this,"blazing:auth"),this._user=new S.User}render(){var e;const t=(e=this.trailIndex)!=null&&e.length?this.trailIndex.map(this.renderItem):y`<p>Loading trails...</p>`;return y`
        <main class="page">
        <header>
          <h1>Here are all the trails</h1>
          <section class="trail-list">
                ${t}
        </section>

        </header>
      </main>
    `}renderItem(t){return y`
      <trail-card 
          src="/api/trails/${t.name}">
      </trail-card>
    `}hydrate(t){fetch(t,{headers:S.headers(this._user)}).then(e=>{if(e.status===200)return e.json();throw`Server responded with status ${e.status}`}).then(e=>{console.log(e),this.trailIndex=e||[]}).catch(e=>console.error("Failed to fetch trail data:",e))}connectedCallback(){super.connectedCallback(),this._authObserver.observe(({user:t})=>{t&&(this._user=t),this.hydrate(this.src)})}}Zr([U()],Ys.prototype,"trailIndex");const Ae=class Ae extends x{render(){return y`
      <h1>Hiking Gear</h1>
      <ul>
        <li>Clothes: Lightweight jacket, hiking boots</li>
        <li>Tools: Hiking poles, water filter</li>
        <li>Food: Energy bars, water bottles</li>
      </ul>
      <a href="/app/trails">Back to Trails</a>
    `}};Ae.styles=yt`
    :host {
      display: block;
      padding: var(--padding-default);
      font-family: Arial, sans-serif;
      color: var(--color-text-default);
      background-color: var(--color-background-page);
    }

    h1 {
      font-size: 1.8em;
      font-weight: bold;
      margin-bottom: var(--padding-default);
      text-align: center;
    }

    ul {
      padding: var(--padding-default);
      list-style-type: disc;
    }

    ul li {
      margin: var(--padding-small) 0;
    }

    a {
      display: inline-block;
      margin-top: var(--padding-default);
      text-decoration: none;
      color: var(--color-link);
    }

    a:hover {
      text-decoration: underline;
      color: var(--color-link-hover);
    }
  `;let ie=Ae;const Ee=class Ee extends x{render(){return y`
      <h1>Upcoming Hiking Groups</h1>
      <ul>
        <li>15 people, hiking on 2025-01-15</li>
        <li>3 people, hiking on 2025-01-18</li>
        <li>7 people, hiking on 2025-01-22</li>      
      </ul>
      <a href="/app/trails">Back to Trails</a>
    `}};Ee.styles=yt`
    :host {
      display: block;
      padding: var(--padding-default);
      font-family: Arial, sans-serif;
      color: var(--color-text-default);
      background-color: var(--color-background-page);
    }

    h1 {
      font-size: 1.8em;
      font-weight: bold;
      margin-bottom: var(--padding-default);
      text-align: center;
    }

    ul {
      padding: var(--padding-default);
      list-style-type: disc;
    }

    ul li {
      margin: var(--padding-small) 0;
    }

    a {
      display: inline-block;
      margin-top: var(--padding-default);
      text-decoration: none;
      color: var(--color-link);
    }

    a:hover {
      text-decoration: underline;
      color: var(--color-link-hover);
    }
  `;let re=Ee;const Se=class Se extends x{render(){return y`
      <h1>Viewpoints You Can See</h1>
      <ul>
         <li>Cliff View: Panoramic view of the valley</li>
        <li>Waterfall View: Cascading waterfalls</li>
        <li>Lake View: Peaceful lakeside spot</li>     
      </ul>
      <a href="/app/trails">Back to Trails</a>
    `}};Se.styles=yt`
    :host {
      display: block;
      padding: var(--padding-default);
      font-family: Arial, sans-serif;
      color: var(--color-text-default);
      background-color: var(--color-background-page);
    }

    h1 {
      font-size: 1.8em;
      font-weight: bold;
      margin-bottom: var(--padding-default);
      text-align: center;
    }

    ul {
      padding: var(--padding-default);
      list-style-type: disc;
    }

    ul li {
      margin: var(--padding-small) 0;
    }

    a {
      display: inline-block;
      margin-top: var(--padding-default);
      text-decoration: none;
      color: var(--color-link);
    }

    a:hover {
      text-decoration: underline;
      color: var(--color-link-hover);
    }
  `;let ne=Se;var Gr=Object.defineProperty,Qr=Object.getOwnPropertyDescriptor,zt=(r,t,e,s)=>{for(var i=s>1?void 0:s?Qr(t,e):t,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=(s?o(t,e,i):o(i))||i);return s&&i&&Gr(t,e,i),i};class be extends ge{get trail(){return this.model.trail}constructor(){super("blazing:model")}render(){const{trail:t}=this;return y`
      ${t?y`
            <div>
              <h1>${t.name}</h1>
              <p>${t.description}</p>
              <p>Location: ${t.location}</p>
            </div>
          `:y`<p>Loading trail information...</p>`}
    `}attributeChangedCallback(t,e,s){super.attributeChangedCallback(t,e,s),t==="userid"&&e!==s&&s&&this.dispatchMessage(["app/trails",{trailID:s}])}}zt([jt()],be.prototype,"trailID",2);zt([U()],be.prototype,"trail",1);const xe=class xe extends ge{get trail(){return this.model.trail}render(){return y`
      <main class="page">
        <mu-form
          .init=${this.trail}
          @mu-form:submit=${this._handleSubmit}>
          <input name="name" type="text" placeholder="Trail Name" />
          <input name="description" type="text" placeholder="Description" />
          <input name="location" type="text" placeholder="Location" />
          <button type="submit">Save</button>
        </mu-form>
      </main>
    `}_handleSubmit(t){this.dispatchMessage(["trail/save",{trailID:this.trailID,trail:t.detail,onSuccess:()=>vs.dispatch(this,"history/navigate",{href:`/app/trail/${this.trailID}`}),onFailure:e=>console.log("Error saving trail:",e)}])}};xe.uses=It({"mu-form":fi.Element,"input-array":fr.Element});let Ut=xe;zt([jt()],Ut.prototype,"trailID",2);zt([U()],Ut.prototype,"trail",1);const ke=class ke extends x{render(){return y`
      <home-view></home-view>
    `}connectedCallback(){super.connectedCallback()}};ke.uses=It({"home-view":Ws,"trails-view":Ys,"gear-view":ie,"groups-view":re,"viewpoints-view":ne,"trail-message-view":be});let oe=ke;const Xr=[{path:"/app",view:()=>y`
        <home-view></home-view>
      `},{path:"/app/trails",view:()=>y`
          <trails-view></trails-view>
        `},{path:"/app/gear",view:()=>y`
          <gear-view></gear-view>
        `},{path:"/app/groups",view:()=>y`
          <groups-view></groups-view>
        `},{path:"/app/viewpoints",view:()=>y`
          <viewpoints-view></viewpoints-view>
        `},{path:"/",redirect:"/app"}];It({"mu-auth":S.Provider,"blazing-app":oe,"blazing-header":Tt,"trail-card":F,"mu-history":vs.Provider,"mu-switch":class extends cr.Element{constructor(){super(Xr,"blazing:history","blazing:auth")}},"mu-store":class extends $i.Provider{constructor(){super(_r,yr,"blazing:auth")}}});
