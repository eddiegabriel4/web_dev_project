(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const n of i)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function e(i){const n={};return i.integrity&&(n.integrity=i.integrity),i.referrerPolicy&&(n.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?n.credentials="include":i.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(i){if(i.ep)return;i.ep=!0;const n=e(i);fetch(i.href,n)}})();var B,xe;class at extends Error{}at.prototype.name="InvalidTokenError";function Js(r){return decodeURIComponent(atob(r).replace(/(.)/g,(t,e)=>{let s=e.charCodeAt(0).toString(16).toUpperCase();return s.length<2&&(s="0"+s),"%"+s}))}function Zs(r){let t=r.replace(/-/g,"+").replace(/_/g,"/");switch(t.length%4){case 0:break;case 2:t+="==";break;case 3:t+="=";break;default:throw new Error("base64 string is not of the correct length")}try{return Js(t)}catch{return atob(t)}}function es(r,t){if(typeof r!="string")throw new at("Invalid token specified: must be a string");t||(t={});const e=t.header===!0?0:1,s=r.split(".")[e];if(typeof s!="string")throw new at(`Invalid token specified: missing part #${e+1}`);let i;try{i=Zs(s)}catch(n){throw new at(`Invalid token specified: invalid base64 for part #${e+1} (${n.message})`)}try{return JSON.parse(i)}catch(n){throw new at(`Invalid token specified: invalid json for part #${e+1} (${n.message})`)}}const Gs="mu:context",Kt=`${Gs}:change`;class Qs{constructor(t,e){this._proxy=Xs(t,e)}get value(){return this._proxy}set value(t){Object.assign(this._proxy,t)}apply(t){this.value=t(this.value)}}class ie extends HTMLElement{constructor(t){super(),console.log("Constructing context provider",this),this.context=new Qs(t,this),this.style.display="contents"}attach(t){return this.addEventListener(Kt,t),t}detach(t){this.removeEventListener(Kt,t)}}function Xs(r,t){return new Proxy(r,{get:(s,i,n)=>{if(i==="then")return;const o=Reflect.get(s,i,n);return console.log(`Context['${i}'] => `,o),o},set:(s,i,n,o)=>{const l=r[i];console.log(`Context['${i.toString()}'] <= `,n);const a=Reflect.set(s,i,n,o);if(a){let d=new CustomEvent(Kt,{bubbles:!0,cancelable:!0,composed:!0});Object.assign(d,{property:i,oldValue:l,value:n}),t.dispatchEvent(d)}else console.log(`Context['${i}] was not set to ${n}`);return a}})}function ti(r,t){const e=ss(t,r);return new Promise((s,i)=>{if(e){const n=e.localName;customElements.whenDefined(n).then(()=>s(e))}else i({context:t,reason:`No provider for this context "${t}:`})})}function ss(r,t){const e=`[provides="${r}"]`;if(!t||t===document.getRootNode())return;const s=t.closest(e);if(s)return s;const i=t.getRootNode();if(i instanceof ShadowRoot)return ss(r,i.host)}class ei extends CustomEvent{constructor(t,e="mu:message"){super(e,{bubbles:!0,composed:!0,detail:t})}}function is(r="mu:message"){return(t,...e)=>t.dispatchEvent(new ei(e,r))}class re{constructor(t,e,s="service:message",i=!0){this._pending=[],this._context=e,this._update=t,this._eventType=s,this._running=i}attach(t){t.addEventListener(this._eventType,e=>{e.stopPropagation();const s=e.detail;this.consume(s)})}start(){this._running||(console.log(`Starting ${this._eventType} service`),this._running=!0,this._pending.forEach(t=>this.process(t)))}apply(t){this._context.apply(t)}consume(t){this._running?this.process(t):(console.log(`Queueing ${this._eventType} message`,t),this._pending.push(t))}process(t){console.log(`Processing ${this._eventType} message`,t);const e=this._update(t,this.apply.bind(this));e&&e(this._context.value)}}function si(r){return t=>({...t,...r})}const Jt="mu:auth:jwt",rs=class ns extends re{constructor(t,e){super((s,i)=>this.update(s,i),t,ns.EVENT_TYPE),this._redirectForLogin=e}update(t,e){switch(t[0]){case"auth/signin":const{token:s,redirect:i}=t[1];return e(ri(s)),Ft(i);case"auth/signout":return e(ni()),Ft(this._redirectForLogin);case"auth/redirect":return Ft(this._redirectForLogin,{next:window.location.href});default:const n=t[0];throw new Error(`Unhandled Auth message "${n}"`)}}};rs.EVENT_TYPE="auth:message";let os=rs;const as=is(os.EVENT_TYPE);function Ft(r,t={}){if(!r)return;const e=window.location.href,s=new URL(r,e);return Object.entries(t).forEach(([i,n])=>s.searchParams.set(i,n)),()=>{console.log("Redirecting to ",r),window.location.assign(s)}}class ii extends ie{get redirect(){return this.getAttribute("redirect")||void 0}constructor(){const t=G.authenticateFromLocalStorage();super({user:t,token:t.authenticated?t.token:void 0})}connectedCallback(){new os(this.context,this.redirect).attach(this)}}class Z{constructor(){this.authenticated=!1,this.username="anonymous"}static deauthenticate(t){return t.authenticated=!1,t.username="anonymous",localStorage.removeItem(Jt),t}}class G extends Z{constructor(t){super();const e=es(t);console.log("Token payload",e),this.token=t,this.authenticated=!0,this.username=e.username}static authenticate(t){const e=new G(t);return localStorage.setItem(Jt,t),e}static authenticateFromLocalStorage(){const t=localStorage.getItem(Jt);return t?G.authenticate(t):new Z}}function ri(r){return si({user:G.authenticate(r),token:r})}function ni(){return r=>{const t=r.user;return{user:t&&t.authenticated?Z.deauthenticate(t):t,token:""}}}function oi(r){return r.authenticated?{Authorization:`Bearer ${r.token||"NO_TOKEN"}`}:{}}function ai(r){return r.authenticated?es(r.token||""):{}}const x=Object.freeze(Object.defineProperty({__proto__:null,AuthenticatedUser:G,Provider:ii,User:Z,dispatch:as,headers:oi,payload:ai},Symbol.toStringTag,{value:"Module"}));function Et(r,t,e){const s=r.target,i=new CustomEvent(t,{bubbles:!0,composed:!0,detail:e});console.log(`Relaying event from ${r.type}:`,i),s.dispatchEvent(i),r.stopPropagation()}function Zt(r,t="*"){return r.composedPath().find(s=>{const i=s;return i.tagName&&i.matches(t)})}const ls=Object.freeze(Object.defineProperty({__proto__:null,originalTarget:Zt,relay:Et},Symbol.toStringTag,{value:"Module"}));function cs(r,...t){const e=r.map((i,n)=>n?[t[n-1],i]:[i]).flat().join("");let s=new CSSStyleSheet;return s.replaceSync(e),s}const li=new DOMParser;function H(r,...t){const e=t.map(l),s=r.map((a,d)=>{if(d===0)return[a];const f=e[d-1];return f instanceof Node?[`<ins id="mu-html-${d-1}"></ins>`,a]:[f,a]}).flat().join(""),i=li.parseFromString(s,"text/html"),n=i.head.childElementCount?i.head.children:i.body.children,o=new DocumentFragment;return o.replaceChildren(...n),e.forEach((a,d)=>{if(a instanceof Node){const f=o.querySelector(`ins#mu-html-${d}`);if(f){const u=f.parentNode;u==null||u.replaceChild(a,f)}else console.log("Missing insertion point:",`ins#mu-html-${d}`)}}),o;function l(a,d){if(a===null)return"";switch(typeof a){case"string":return ke(a);case"bigint":case"boolean":case"number":case"symbol":return ke(a.toString());case"object":if(a instanceof Node||a instanceof DocumentFragment)return a;if(Array.isArray(a)){const f=new DocumentFragment,u=a.map(l);return f.replaceChildren(...u),f}return new Text(a.toString());default:return new Comment(`[invalid parameter of type "${typeof a}"]`)}}}function ke(r){return r.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;").replace(/'/g,"&#39;")}function Rt(r,t={mode:"open"}){const e=r.attachShadow(t),s={template:i,styles:n};return s;function i(o){const l=o.firstElementChild,a=l&&l.tagName==="TEMPLATE"?l:void 0;return a&&e.appendChild(a.content.cloneNode(!0)),s}function n(...o){e.adoptedStyleSheets=o}}B=class extends HTMLElement{constructor(){super(),this._state={},Rt(this).template(B.template).styles(B.styles),this.addEventListener("change",r=>{const t=r.target;if(t){const e=t.name,s=t.value;e&&(this._state[e]=s)}}),this.form&&this.form.addEventListener("submit",r=>{r.preventDefault(),Et(r,"mu-form:submit",this._state)})}set init(r){this._state=r||{},ci(this._state,this)}get form(){var r;return(r=this.shadowRoot)==null?void 0:r.querySelector("form")}},B.template=H`
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
  `,B.styles=cs`
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
  `;function ci(r,t){const e=Object.entries(r);for(const[s,i]of e){const n=t.querySelector(`[name="${s}"]`);if(n){const o=n;switch(o.type){case"checkbox":const l=o;l.checked=!!i;break;case"date":o.value=i.toISOString().substr(0,10);break;default:o.value=i;break}}}return r}const hs=class us extends re{constructor(t){super((e,s)=>this.update(e,s),t,us.EVENT_TYPE)}update(t,e){switch(t[0]){case"history/navigate":{const{href:s,state:i}=t[1];e(ui(s,i));break}case"history/redirect":{const{href:s,state:i}=t[1];e(di(s,i));break}}}};hs.EVENT_TYPE="history:message";let ne=hs;class Pe extends ie{constructor(){super({location:document.location,state:{}}),this.addEventListener("click",t=>{const e=hi(t);if(e){const s=new URL(e.href);s.origin===this.context.value.location.origin&&(console.log("Preventing Click Event on <A>",t),t.preventDefault(),oe(e,"history/navigate",{href:s.pathname+s.search}))}}),window.addEventListener("popstate",t=>{console.log("Popstate",t.state),this.context.value={location:document.location,state:t.state}})}connectedCallback(){new ne(this.context).attach(this)}}function hi(r){const t=r.currentTarget,e=s=>s.tagName=="A"&&s.href;if(r.button===0)if(r.composed){const i=r.composedPath().find(e);return i||void 0}else{for(let s=r.target;s;s===t?null:s.parentElement)if(e(s))return s;return}}function ui(r,t={}){return history.pushState(t,"",r),()=>({location:document.location,state:history.state})}function di(r,t={}){return history.replaceState(t,"",r),()=>({location:document.location,state:history.state})}const oe=is(ne.EVENT_TYPE),pi=Object.freeze(Object.defineProperty({__proto__:null,HistoryProvider:Pe,Provider:Pe,Service:ne,dispatch:oe},Symbol.toStringTag,{value:"Module"}));class P{constructor(t,e){this._effects=[],this._target=t,this._contextLabel=e}observe(t=void 0){return new Promise((e,s)=>{if(this._provider){const i=new Ce(this._provider,t);this._effects.push(i),e(i)}else ti(this._target,this._contextLabel).then(i=>{const n=new Ce(i,t);this._provider=i,this._effects.push(n),i.attach(o=>this._handleChange(o)),e(n)}).catch(i=>console.log(`Observer ${this._contextLabel}: ${i}`,i))})}_handleChange(t){console.log("Received change event for observers",t,this._effects),t.stopPropagation(),this._effects.forEach(e=>e.runEffect())}}class Ce{constructor(t,e){this._provider=t,e&&this.setEffect(e)}get context(){return this._provider.context}get value(){return this.context.value}setEffect(t){this._effectFn=t,this.runEffect()}runEffect(){this._effectFn&&this._effectFn(this.context.value)}}const ds=class ps extends HTMLElement{constructor(){super(),this._state={},this._user=new Z,this._authObserver=new P(this,"blazing:auth"),Rt(this).template(ps.template),this.form&&this.form.addEventListener("submit",t=>{if(t.preventDefault(),this.src||this.action){if(console.log("Submitting form",this._state),this.action)this.action(this._state);else if(this.src){const e=this.isNew?"POST":"PUT",s=this.isNew?"created":"updated",i=this.isNew?this.src.replace(/[/][$]new$/,""):this.src;fi(i,this._state,e,this.authorization).then(n=>it(n,this)).then(n=>{const o=`mu-rest-form:${s}`,l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,[s]:n,url:i}});this.dispatchEvent(l)}).catch(n=>{const o="mu-rest-form:error",l=new CustomEvent(o,{bubbles:!0,composed:!0,detail:{method:e,error:n,url:i,request:this._state}});this.dispatchEvent(l)})}}}),this.addEventListener("change",t=>{const e=t.target;if(e){const s=e.name,i=e.value;s&&(this._state[s]=i)}})}get src(){return this.getAttribute("src")}get isNew(){return this.hasAttribute("new")}set init(t){this._state=t||{},it(this._state,this)}get form(){var t;return(t=this.shadowRoot)==null?void 0:t.querySelector("form")}get authorization(){var t;return(t=this._user)!=null&&t.authenticated?{Authorization:`Bearer ${this._user.token}`}:{}}connectedCallback(){this._authObserver.observe(({user:t})=>{t&&(this._user=t,this.src&&!this.isNew&&Oe(this.src,this.authorization).then(e=>{this._state=e,it(e,this)}))})}attributeChangedCallback(t,e,s){switch(t){case"src":this.src&&s&&s!==e&&!this.isNew&&Oe(this.src,this.authorization).then(i=>{this._state=i,it(i,this)});break;case"new":s&&(this._state={},it({},this));break}}};ds.observedAttributes=["src","new","action"];ds.template=H`
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
  `;function Oe(r,t){return fetch(r,{headers:t}).then(e=>{if(e.status!==200)throw`Status: ${e.status}`;return e.json()}).catch(e=>console.log(`Failed to load form from ${r}:`,e))}function it(r,t){const e=Object.entries(r);for(const[s,i]of e){const n=t.querySelector(`[name="${s}"]`);if(n){const o=n;switch(o.type){case"checkbox":const l=o;l.checked=!!i;break;default:o.value=i;break}}}return r}function fi(r,t,e="PUT",s={}){return fetch(r,{method:e,headers:{"Content-Type":"application/json",...s},body:JSON.stringify(t)}).then(i=>{if(i.status!=200&&i.status!=201)throw`Form submission failed: Status ${i.status}`;return i.json()})}const fs=class ms extends re{constructor(t,e){super(e,t,ms.EVENT_TYPE,!1)}};fs.EVENT_TYPE="mu:message";let gs=fs;class mi extends ie{constructor(t,e,s){super(e),this._user=new Z,this._updateFn=t,this._authObserver=new P(this,s)}connectedCallback(){const t=new gs(this.context,(e,s)=>this._updateFn(e,s,this._user));t.attach(this),this._authObserver.observe(({user:e})=>{console.log("Store got auth",e),e&&(this._user=e),t.start()})}}const gi=Object.freeze(Object.defineProperty({__proto__:null,Provider:mi,Service:gs},Symbol.toStringTag,{value:"Module"}));/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const wt=globalThis,ae=wt.ShadowRoot&&(wt.ShadyCSS===void 0||wt.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,le=Symbol(),Te=new WeakMap;let vs=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==le)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(ae&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=Te.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&Te.set(e,t))}return t}toString(){return this.cssText}};const vi=r=>new vs(typeof r=="string"?r:r+"",void 0,le),yi=(r,...t)=>{const e=r.length===1?r[0]:t.reduce((s,i,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[n+1],r[0]);return new vs(e,r,le)},_i=(r,t)=>{if(ae)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),i=wt.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,r.appendChild(s)}},Ue=ae?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return vi(e)})(r):r;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:$i,defineProperty:bi,getOwnPropertyDescriptor:wi,getOwnPropertyNames:Ai,getOwnPropertySymbols:Ei,getPrototypeOf:Si}=Object,Q=globalThis,Re=Q.trustedTypes,xi=Re?Re.emptyScript:"",Ne=Q.reactiveElementPolyfillSupport,lt=(r,t)=>r,St={toAttribute(r,t){switch(t){case Boolean:r=r?xi:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},ce=(r,t)=>!$i(r,t),Le={attribute:!0,type:String,converter:St,reflect:!1,hasChanged:ce};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),Q.litPropertyMetadata??(Q.litPropertyMetadata=new WeakMap);let Y=class extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Le){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&bi(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:n}=wi(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get(){return i==null?void 0:i.call(this)},set(o){const l=i==null?void 0:i.call(this);n.call(this,o),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Le}static _$Ei(){if(this.hasOwnProperty(lt("elementProperties")))return;const t=Si(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(lt("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(lt("properties"))){const e=this.properties,s=[...Ai(e),...Ei(e)];for(const i of s)this.createProperty(i,e[i])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const i of s)e.unshift(Ue(i))}else t!==void 0&&e.push(Ue(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return _i(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EC(t,e){var s;const i=this.constructor.elementProperties.get(t),n=this.constructor._$Eu(t,i);if(n!==void 0&&i.reflect===!0){const o=(((s=i.converter)==null?void 0:s.toAttribute)!==void 0?i.converter:St).toAttribute(e,i.type);this._$Em=t,o==null?this.removeAttribute(n):this.setAttribute(n,o),this._$Em=null}}_$AK(t,e){var s;const i=this.constructor,n=i._$Eh.get(t);if(n!==void 0&&this._$Em!==n){const o=i.getPropertyOptions(n),l=typeof o.converter=="function"?{fromAttribute:o.converter}:((s=o.converter)==null?void 0:s.fromAttribute)!==void 0?o.converter:St;this._$Em=n,this[n]=l.fromAttribute(e,o.type),this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){if(s??(s=this.constructor.getPropertyOptions(t)),!(s.hasChanged??ce)(this[t],e))return;this.P(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,s){this._$AL.has(t)||this._$AL.set(t,e),s.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var t;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[n,o]of i)o.wrapped!==!0||this._$AL.has(n)||this[n]===void 0||this.P(n,this[n],o)}let e=!1;const s=this._$AL;try{e=this.shouldUpdate(s),e?(this.willUpdate(s),(t=this._$EO)==null||t.forEach(i=>{var n;return(n=i.hostUpdate)==null?void 0:n.call(i)}),this.update(s)):this._$EU()}catch(i){throw e=!1,this._$EU(),i}e&&this._$AE(s)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var i;return(i=s.hostUpdated)==null?void 0:i.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}};Y.elementStyles=[],Y.shadowRootOptions={mode:"open"},Y[lt("elementProperties")]=new Map,Y[lt("finalized")]=new Map,Ne==null||Ne({ReactiveElement:Y}),(Q.reactiveElementVersions??(Q.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const xt=globalThis,kt=xt.trustedTypes,Me=kt?kt.createPolicy("lit-html",{createHTML:r=>r}):void 0,ys="$lit$",C=`lit$${Math.random().toFixed(9).slice(2)}$`,_s="?"+C,ki=`<${_s}>`,j=document,ut=()=>j.createComment(""),dt=r=>r===null||typeof r!="object"&&typeof r!="function",he=Array.isArray,Pi=r=>he(r)||typeof(r==null?void 0:r[Symbol.iterator])=="function",Vt=`[ 	
\f\r]`,rt=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Ie=/-->/g,He=/>/g,N=RegExp(`>|${Vt}(?:([^\\s"'>=/]+)(${Vt}*=${Vt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),je=/'/g,ze=/"/g,$s=/^(?:script|style|textarea|title)$/i,Ci=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),nt=Ci(1),X=Symbol.for("lit-noChange"),$=Symbol.for("lit-nothing"),De=new WeakMap,M=j.createTreeWalker(j,129);function bs(r,t){if(!he(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return Me!==void 0?Me.createHTML(t):t}const Oi=(r,t)=>{const e=r.length-1,s=[];let i,n=t===2?"<svg>":t===3?"<math>":"",o=rt;for(let l=0;l<e;l++){const a=r[l];let d,f,u=-1,c=0;for(;c<a.length&&(o.lastIndex=c,f=o.exec(a),f!==null);)c=o.lastIndex,o===rt?f[1]==="!--"?o=Ie:f[1]!==void 0?o=He:f[2]!==void 0?($s.test(f[2])&&(i=RegExp("</"+f[2],"g")),o=N):f[3]!==void 0&&(o=N):o===N?f[0]===">"?(o=i??rt,u=-1):f[1]===void 0?u=-2:(u=o.lastIndex-f[2].length,d=f[1],o=f[3]===void 0?N:f[3]==='"'?ze:je):o===ze||o===je?o=N:o===Ie||o===He?o=rt:(o=N,i=void 0);const h=o===N&&r[l+1].startsWith("/>")?" ":"";n+=o===rt?a+ki:u>=0?(s.push(d),a.slice(0,u)+ys+a.slice(u)+C+h):a+C+(u===-2?l:h)}return[bs(r,n+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};let Gt=class ws{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let n=0,o=0;const l=t.length-1,a=this.parts,[d,f]=Oi(t,e);if(this.el=ws.createElement(d,s),M.currentNode=this.el.content,e===2||e===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(i=M.nextNode())!==null&&a.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(const u of i.getAttributeNames())if(u.endsWith(ys)){const c=f[o++],h=i.getAttribute(u).split(C),p=/([.?@])?(.*)/.exec(c);a.push({type:1,index:n,name:p[2],strings:h,ctor:p[1]==="."?Ui:p[1]==="?"?Ri:p[1]==="@"?Ni:Nt}),i.removeAttribute(u)}else u.startsWith(C)&&(a.push({type:6,index:n}),i.removeAttribute(u));if($s.test(i.tagName)){const u=i.textContent.split(C),c=u.length-1;if(c>0){i.textContent=kt?kt.emptyScript:"";for(let h=0;h<c;h++)i.append(u[h],ut()),M.nextNode(),a.push({type:2,index:++n});i.append(u[c],ut())}}}else if(i.nodeType===8)if(i.data===_s)a.push({type:2,index:n});else{let u=-1;for(;(u=i.data.indexOf(C,u+1))!==-1;)a.push({type:7,index:n}),u+=C.length-1}n++}}static createElement(t,e){const s=j.createElement("template");return s.innerHTML=t,s}};function tt(r,t,e=r,s){var i,n;if(t===X)return t;let o=s!==void 0?(i=e.o)==null?void 0:i[s]:e.l;const l=dt(t)?void 0:t._$litDirective$;return(o==null?void 0:o.constructor)!==l&&((n=o==null?void 0:o._$AO)==null||n.call(o,!1),l===void 0?o=void 0:(o=new l(r),o._$AT(r,e,s)),s!==void 0?(e.o??(e.o=[]))[s]=o:e.l=o),o!==void 0&&(t=tt(r,o._$AS(r,t.values),o,s)),t}class Ti{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=((t==null?void 0:t.creationScope)??j).importNode(e,!0);M.currentNode=i;let n=M.nextNode(),o=0,l=0,a=s[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new gt(n,n.nextSibling,this,t):a.type===1?d=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(d=new Li(n,this,t)),this._$AV.push(d),a=s[++l]}o!==(a==null?void 0:a.index)&&(n=M.nextNode(),o++)}return M.currentNode=j,i}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class gt{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this.v}constructor(t,e,s,i){this.type=2,this._$AH=$,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this.v=(i==null?void 0:i.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=tt(this,t,e),dt(t)?t===$||t==null||t===""?(this._$AH!==$&&this._$AR(),this._$AH=$):t!==this._$AH&&t!==X&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Pi(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==$&&dt(this._$AH)?this._$AA.nextSibling.data=t:this.T(j.createTextNode(t)),this._$AH=t}$(t){var e;const{values:s,_$litType$:i}=t,n=typeof i=="number"?this._$AC(t):(i.el===void 0&&(i.el=Gt.createElement(bs(i.h,i.h[0]),this.options)),i);if(((e=this._$AH)==null?void 0:e._$AD)===n)this._$AH.p(s);else{const o=new Ti(n,this),l=o.u(this.options);o.p(s),this.T(l),this._$AH=o}}_$AC(t){let e=De.get(t.strings);return e===void 0&&De.set(t.strings,e=new Gt(t)),e}k(t){he(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const n of t)i===e.length?e.push(s=new gt(this.O(ut()),this.O(ut()),this,this.options)):s=e[i],s._$AI(n),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){var e;this._$AM===void 0&&(this.v=t,(e=this._$AP)==null||e.call(this,t))}}class Nt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,n){this.type=1,this._$AH=$,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=$}_$AI(t,e=this,s,i){const n=this.strings;let o=!1;if(n===void 0)t=tt(this,t,e,0),o=!dt(t)||t!==this._$AH&&t!==X,o&&(this._$AH=t);else{const l=t;let a,d;for(t=n[0],a=0;a<n.length-1;a++)d=tt(this,l[s+a],e,a),d===X&&(d=this._$AH[a]),o||(o=!dt(d)||d!==this._$AH[a]),d===$?t=$:t!==$&&(t+=(d??"")+n[a+1]),this._$AH[a]=d}o&&!i&&this.j(t)}j(t){t===$?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Ui extends Nt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===$?void 0:t}}class Ri extends Nt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==$)}}class Ni extends Nt{constructor(t,e,s,i,n){super(t,e,s,i,n),this.type=5}_$AI(t,e=this){if((t=tt(this,t,e,0)??$)===X)return;const s=this._$AH,i=t===$&&s!==$||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==$&&(s===$||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class Li{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){tt(this,t)}}const Fe=xt.litHtmlPolyfillSupport;Fe==null||Fe(Gt,gt),(xt.litHtmlVersions??(xt.litHtmlVersions=[])).push("3.2.0");const Mi=(r,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let i=s._$litPart$;if(i===void 0){const n=(e==null?void 0:e.renderBefore)??null;s._$litPart$=i=new gt(t.insertBefore(ut(),n),n,void 0,e??{})}return i._$AI(r),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let J=class extends Y{constructor(){super(...arguments),this.renderOptions={host:this},this.o=void 0}createRenderRoot(){var t;const e=super.createRenderRoot();return(t=this.renderOptions).renderBefore??(t.renderBefore=e.firstChild),e}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this.o=Mi(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this.o)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this.o)==null||t.setConnected(!1)}render(){return X}};J._$litElement$=!0,J.finalized=!0,(xe=globalThis.litElementHydrateSupport)==null||xe.call(globalThis,{LitElement:J});const Ve=globalThis.litElementPolyfillSupport;Ve==null||Ve({LitElement:J});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.0");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Ii={attribute:!0,type:String,converter:St,reflect:!1,hasChanged:ce},Hi=(r=Ii,t,e)=>{const{kind:s,metadata:i}=e;let n=globalThis.litPropertyMetadata.get(i);if(n===void 0&&globalThis.litPropertyMetadata.set(i,n=new Map),n.set(e.name,r),s==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,r)},init(l){return l!==void 0&&this.P(o,void 0,r),l}}}if(s==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,r)}}throw Error("Unsupported decorator location: "+s)};function As(r){return(t,e)=>typeof e=="object"?Hi(r,t,e):((s,i,n)=>{const o=i.hasOwnProperty(n);return i.constructor.createProperty(n,o?{...s,wrapped:!0}:s),o?Object.getOwnPropertyDescriptor(i,n):void 0})(r,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function Es(r){return As({...r,state:!0,attribute:!1})}function ji(r){return r&&r.__esModule&&Object.prototype.hasOwnProperty.call(r,"default")?r.default:r}function zi(r){throw new Error('Could not dynamically require "'+r+'". Please configure the dynamicRequireTargets or/and ignoreDynamicRequires option of @rollup/plugin-commonjs appropriately for this require call to work.')}var Ss={};(function(r){var t=function(){var e=function(u,c,h,p){for(h=h||{},p=u.length;p--;h[u[p]]=c);return h},s=[1,9],i=[1,10],n=[1,11],o=[1,12],l=[5,11,12,13,14,15],a={trace:function(){},yy:{},symbols_:{error:2,root:3,expressions:4,EOF:5,expression:6,optional:7,literal:8,splat:9,param:10,"(":11,")":12,LITERAL:13,SPLAT:14,PARAM:15,$accept:0,$end:1},terminals_:{2:"error",5:"EOF",11:"(",12:")",13:"LITERAL",14:"SPLAT",15:"PARAM"},productions_:[0,[3,2],[3,1],[4,2],[4,1],[6,1],[6,1],[6,1],[6,1],[7,3],[8,1],[9,1],[10,1]],performAction:function(c,h,p,g,m,v,It){var A=v.length-1;switch(m){case 1:return new g.Root({},[v[A-1]]);case 2:return new g.Root({},[new g.Literal({value:""})]);case 3:this.$=new g.Concat({},[v[A-1],v[A]]);break;case 4:case 5:this.$=v[A];break;case 6:this.$=new g.Literal({value:v[A]});break;case 7:this.$=new g.Splat({name:v[A]});break;case 8:this.$=new g.Param({name:v[A]});break;case 9:this.$=new g.Optional({},[v[A-1]]);break;case 10:this.$=c;break;case 11:case 12:this.$=c.slice(1);break}},table:[{3:1,4:2,5:[1,3],6:4,7:5,8:6,9:7,10:8,11:s,13:i,14:n,15:o},{1:[3]},{5:[1,13],6:14,7:5,8:6,9:7,10:8,11:s,13:i,14:n,15:o},{1:[2,2]},e(l,[2,4]),e(l,[2,5]),e(l,[2,6]),e(l,[2,7]),e(l,[2,8]),{4:15,6:4,7:5,8:6,9:7,10:8,11:s,13:i,14:n,15:o},e(l,[2,10]),e(l,[2,11]),e(l,[2,12]),{1:[2,1]},e(l,[2,3]),{6:14,7:5,8:6,9:7,10:8,11:s,12:[1,16],13:i,14:n,15:o},e(l,[2,9])],defaultActions:{3:[2,2],13:[2,1]},parseError:function(c,h){if(h.recoverable)this.trace(c);else{let p=function(g,m){this.message=g,this.hash=m};throw p.prototype=Error,new p(c,h)}},parse:function(c){var h=this,p=[0],g=[null],m=[],v=this.table,It="",A=0,Ae=0,Bs=2,Ee=1,Ws=m.slice.call(arguments,1),_=Object.create(this.lexer),U={yy:{}};for(var Ht in this.yy)Object.prototype.hasOwnProperty.call(this.yy,Ht)&&(U.yy[Ht]=this.yy[Ht]);_.setInput(c,U.yy),U.yy.lexer=_,U.yy.parser=this,typeof _.yylloc>"u"&&(_.yylloc={});var jt=_.yylloc;m.push(jt);var Ys=_.options&&_.options.ranges;typeof U.yy.parseError=="function"?this.parseError=U.yy.parseError:this.parseError=Object.getPrototypeOf(this).parseError;for(var Ks=function(){var q;return q=_.lex()||Ee,typeof q!="number"&&(q=h.symbols_[q]||q),q},w,R,E,zt,V={},$t,k,Se,bt;;){if(R=p[p.length-1],this.defaultActions[R]?E=this.defaultActions[R]:((w===null||typeof w>"u")&&(w=Ks()),E=v[R]&&v[R][w]),typeof E>"u"||!E.length||!E[0]){var Dt="";bt=[];for($t in v[R])this.terminals_[$t]&&$t>Bs&&bt.push("'"+this.terminals_[$t]+"'");_.showPosition?Dt="Parse error on line "+(A+1)+`:
`+_.showPosition()+`
Expecting `+bt.join(", ")+", got '"+(this.terminals_[w]||w)+"'":Dt="Parse error on line "+(A+1)+": Unexpected "+(w==Ee?"end of input":"'"+(this.terminals_[w]||w)+"'"),this.parseError(Dt,{text:_.match,token:this.terminals_[w]||w,line:_.yylineno,loc:jt,expected:bt})}if(E[0]instanceof Array&&E.length>1)throw new Error("Parse Error: multiple actions possible at state: "+R+", token: "+w);switch(E[0]){case 1:p.push(w),g.push(_.yytext),m.push(_.yylloc),p.push(E[1]),w=null,Ae=_.yyleng,It=_.yytext,A=_.yylineno,jt=_.yylloc;break;case 2:if(k=this.productions_[E[1]][1],V.$=g[g.length-k],V._$={first_line:m[m.length-(k||1)].first_line,last_line:m[m.length-1].last_line,first_column:m[m.length-(k||1)].first_column,last_column:m[m.length-1].last_column},Ys&&(V._$.range=[m[m.length-(k||1)].range[0],m[m.length-1].range[1]]),zt=this.performAction.apply(V,[It,Ae,A,U.yy,E[1],g,m].concat(Ws)),typeof zt<"u")return zt;k&&(p=p.slice(0,-1*k*2),g=g.slice(0,-1*k),m=m.slice(0,-1*k)),p.push(this.productions_[E[1]][0]),g.push(V.$),m.push(V._$),Se=v[p[p.length-2]][p[p.length-1]],p.push(Se);break;case 3:return!0}}return!0}},d=function(){var u={EOF:1,parseError:function(h,p){if(this.yy.parser)this.yy.parser.parseError(h,p);else throw new Error(h)},setInput:function(c,h){return this.yy=h||this.yy||{},this._input=c,this._more=this._backtrack=this.done=!1,this.yylineno=this.yyleng=0,this.yytext=this.matched=this.match="",this.conditionStack=["INITIAL"],this.yylloc={first_line:1,first_column:0,last_line:1,last_column:0},this.options.ranges&&(this.yylloc.range=[0,0]),this.offset=0,this},input:function(){var c=this._input[0];this.yytext+=c,this.yyleng++,this.offset++,this.match+=c,this.matched+=c;var h=c.match(/(?:\r\n?|\n).*/g);return h?(this.yylineno++,this.yylloc.last_line++):this.yylloc.last_column++,this.options.ranges&&this.yylloc.range[1]++,this._input=this._input.slice(1),c},unput:function(c){var h=c.length,p=c.split(/(?:\r\n?|\n)/g);this._input=c+this._input,this.yytext=this.yytext.substr(0,this.yytext.length-h),this.offset-=h;var g=this.match.split(/(?:\r\n?|\n)/g);this.match=this.match.substr(0,this.match.length-1),this.matched=this.matched.substr(0,this.matched.length-1),p.length-1&&(this.yylineno-=p.length-1);var m=this.yylloc.range;return this.yylloc={first_line:this.yylloc.first_line,last_line:this.yylineno+1,first_column:this.yylloc.first_column,last_column:p?(p.length===g.length?this.yylloc.first_column:0)+g[g.length-p.length].length-p[0].length:this.yylloc.first_column-h},this.options.ranges&&(this.yylloc.range=[m[0],m[0]+this.yyleng-h]),this.yyleng=this.yytext.length,this},more:function(){return this._more=!0,this},reject:function(){if(this.options.backtrack_lexer)this._backtrack=!0;else return this.parseError("Lexical error on line "+(this.yylineno+1)+`. You can only invoke reject() in the lexer when the lexer is of the backtracking persuasion (options.backtrack_lexer = true).
`+this.showPosition(),{text:"",token:null,line:this.yylineno});return this},less:function(c){this.unput(this.match.slice(c))},pastInput:function(){var c=this.matched.substr(0,this.matched.length-this.match.length);return(c.length>20?"...":"")+c.substr(-20).replace(/\n/g,"")},upcomingInput:function(){var c=this.match;return c.length<20&&(c+=this._input.substr(0,20-c.length)),(c.substr(0,20)+(c.length>20?"...":"")).replace(/\n/g,"")},showPosition:function(){var c=this.pastInput(),h=new Array(c.length+1).join("-");return c+this.upcomingInput()+`
`+h+"^"},test_match:function(c,h){var p,g,m;if(this.options.backtrack_lexer&&(m={yylineno:this.yylineno,yylloc:{first_line:this.yylloc.first_line,last_line:this.last_line,first_column:this.yylloc.first_column,last_column:this.yylloc.last_column},yytext:this.yytext,match:this.match,matches:this.matches,matched:this.matched,yyleng:this.yyleng,offset:this.offset,_more:this._more,_input:this._input,yy:this.yy,conditionStack:this.conditionStack.slice(0),done:this.done},this.options.ranges&&(m.yylloc.range=this.yylloc.range.slice(0))),g=c[0].match(/(?:\r\n?|\n).*/g),g&&(this.yylineno+=g.length),this.yylloc={first_line:this.yylloc.last_line,last_line:this.yylineno+1,first_column:this.yylloc.last_column,last_column:g?g[g.length-1].length-g[g.length-1].match(/\r?\n?/)[0].length:this.yylloc.last_column+c[0].length},this.yytext+=c[0],this.match+=c[0],this.matches=c,this.yyleng=this.yytext.length,this.options.ranges&&(this.yylloc.range=[this.offset,this.offset+=this.yyleng]),this._more=!1,this._backtrack=!1,this._input=this._input.slice(c[0].length),this.matched+=c[0],p=this.performAction.call(this,this.yy,this,h,this.conditionStack[this.conditionStack.length-1]),this.done&&this._input&&(this.done=!1),p)return p;if(this._backtrack){for(var v in m)this[v]=m[v];return!1}return!1},next:function(){if(this.done)return this.EOF;this._input||(this.done=!0);var c,h,p,g;this._more||(this.yytext="",this.match="");for(var m=this._currentRules(),v=0;v<m.length;v++)if(p=this._input.match(this.rules[m[v]]),p&&(!h||p[0].length>h[0].length)){if(h=p,g=v,this.options.backtrack_lexer){if(c=this.test_match(p,m[v]),c!==!1)return c;if(this._backtrack){h=!1;continue}else return!1}else if(!this.options.flex)break}return h?(c=this.test_match(h,m[g]),c!==!1?c:!1):this._input===""?this.EOF:this.parseError("Lexical error on line "+(this.yylineno+1)+`. Unrecognized text.
`+this.showPosition(),{text:"",token:null,line:this.yylineno})},lex:function(){var h=this.next();return h||this.lex()},begin:function(h){this.conditionStack.push(h)},popState:function(){var h=this.conditionStack.length-1;return h>0?this.conditionStack.pop():this.conditionStack[0]},_currentRules:function(){return this.conditionStack.length&&this.conditionStack[this.conditionStack.length-1]?this.conditions[this.conditionStack[this.conditionStack.length-1]].rules:this.conditions.INITIAL.rules},topState:function(h){return h=this.conditionStack.length-1-Math.abs(h||0),h>=0?this.conditionStack[h]:"INITIAL"},pushState:function(h){this.begin(h)},stateStackSize:function(){return this.conditionStack.length},options:{},performAction:function(h,p,g,m){switch(g){case 0:return"(";case 1:return")";case 2:return"SPLAT";case 3:return"PARAM";case 4:return"LITERAL";case 5:return"LITERAL";case 6:return"EOF"}},rules:[/^(?:\()/,/^(?:\))/,/^(?:\*+\w+)/,/^(?::+\w+)/,/^(?:[\w%\-~\n]+)/,/^(?:.)/,/^(?:$)/],conditions:{INITIAL:{rules:[0,1,2,3,4,5,6],inclusive:!0}}};return u}();a.lexer=d;function f(){this.yy={}}return f.prototype=a,a.Parser=f,new f}();typeof zi<"u"&&(r.parser=t,r.Parser=t.Parser,r.parse=function(){return t.parse.apply(t,arguments)})})(Ss);function W(r){return function(t,e){return{displayName:r,props:t,children:e||[]}}}var xs={Root:W("Root"),Concat:W("Concat"),Literal:W("Literal"),Splat:W("Splat"),Param:W("Param"),Optional:W("Optional")},ks=Ss.parser;ks.yy=xs;var Di=ks,Fi=Object.keys(xs);function Vi(r){return Fi.forEach(function(t){if(typeof r[t]>"u")throw new Error("No handler defined for "+t.displayName)}),{visit:function(t,e){return this.handlers[t.displayName].call(this,t,e)},handlers:r}}var Ps=Vi,qi=Ps,Bi=/[\-{}\[\]+?.,\\\^$|#\s]/g;function Cs(r){this.captures=r.captures,this.re=r.re}Cs.prototype.match=function(r){var t=this.re.exec(r),e={};if(t)return this.captures.forEach(function(s,i){typeof t[i+1]>"u"?e[s]=void 0:e[s]=decodeURIComponent(t[i+1])}),e};var Wi=qi({Concat:function(r){return r.children.reduce((function(t,e){var s=this.visit(e);return{re:t.re+s.re,captures:t.captures.concat(s.captures)}}).bind(this),{re:"",captures:[]})},Literal:function(r){return{re:r.props.value.replace(Bi,"\\$&"),captures:[]}},Splat:function(r){return{re:"([^?]*?)",captures:[r.props.name]}},Param:function(r){return{re:"([^\\/\\?]+)",captures:[r.props.name]}},Optional:function(r){var t=this.visit(r.children[0]);return{re:"(?:"+t.re+")?",captures:t.captures}},Root:function(r){var t=this.visit(r.children[0]);return new Cs({re:new RegExp("^"+t.re+"(?=\\?|$)"),captures:t.captures})}}),Yi=Wi,Ki=Ps,Ji=Ki({Concat:function(r,t){var e=r.children.map((function(s){return this.visit(s,t)}).bind(this));return e.some(function(s){return s===!1})?!1:e.join("")},Literal:function(r){return decodeURI(r.props.value)},Splat:function(r,t){return t[r.props.name]?t[r.props.name]:!1},Param:function(r,t){return t[r.props.name]?t[r.props.name]:!1},Optional:function(r,t){var e=this.visit(r.children[0],t);return e||""},Root:function(r,t){t=t||{};var e=this.visit(r.children[0],t);return e?encodeURI(e):!1}}),Zi=Ji,Gi=Di,Qi=Yi,Xi=Zi;vt.prototype=Object.create(null);vt.prototype.match=function(r){var t=Qi.visit(this.ast),e=t.match(r);return e||!1};vt.prototype.reverse=function(r){return Xi.visit(this.ast,r)};function vt(r){var t;if(this?t=this:t=Object.create(vt.prototype),typeof r>"u")throw new Error("A route spec is required");return t.spec=r,t.ast=Gi.parse(r),t}var tr=vt,er=tr,sr=er;const ir=ji(sr);var rr=Object.defineProperty,Os=(r,t,e,s)=>{for(var i=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&rr(t,e,i),i};const Ts=class extends J{constructor(t,e,s=""){super(),this._cases=[],this._fallback=()=>nt` <h1>Not Found</h1> `,this._cases=t.map(i=>({...i,route:new ir(i.path)})),this._historyObserver=new P(this,e),this._authObserver=new P(this,s)}connectedCallback(){this._historyObserver.observe(({location:t})=>{console.log("New location",t),t&&(this._match=this.matchRoute(t))}),this._authObserver.observe(({user:t})=>{this._user=t}),super.connectedCallback()}render(){return console.log("Rendering for match",this._match,this._user),nt` <main>${(()=>{const e=this._match;if(e){if("view"in e)return this._user?e.auth&&e.auth!=="public"&&this._user&&!this._user.authenticated?(as(this,"auth/redirect"),nt` <h1>Redirecting for Login</h1> `):(console.log("Loading view, ",e.params,e.query),e.view(e.params||{},e.query)):nt` <h1>Authenticating</h1> `;if("redirect"in e){const s=e.redirect;if(typeof s=="string")return this.redirect(s),nt` <h1>Redirecting to ${s}…</h1> `}}return this._fallback({})})()}</main> `}updated(t){t.has("_match")&&this.requestUpdate()}matchRoute(t){const{search:e,pathname:s}=t,i=new URLSearchParams(e),n=s+e;for(const o of this._cases){const l=o.route.match(n);if(l)return{...o,path:s,params:l,query:i}}}redirect(t){oe(this,"history/redirect",{href:t})}};Ts.styles=yi`
    :host,
    main {
      display: contents;
    }
  `;let Pt=Ts;Os([Es()],Pt.prototype,"_user");Os([Es()],Pt.prototype,"_match");const nr=Object.freeze(Object.defineProperty({__proto__:null,Element:Pt,Switch:Pt},Symbol.toStringTag,{value:"Module"})),Us=class Rs extends HTMLElement{constructor(){if(super(),Rt(this).template(Rs.template),this.shadowRoot){const t=this.shadowRoot.querySelector("slot[name='actuator']");t&&t.addEventListener("click",()=>this.toggle())}}toggle(){this.hasAttribute("open")?this.removeAttribute("open"):this.setAttribute("open","open")}};Us.template=H`
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
  `;let or=Us;const ar=Object.freeze(Object.defineProperty({__proto__:null,Element:or},Symbol.toStringTag,{value:"Module"})),Ns=class Qt extends HTMLElement{constructor(){super(),this._array=[],Rt(this).template(Qt.template).styles(Qt.styles),this.addEventListener("input-array:add",t=>{t.stopPropagation(),this.append(Ls("",this._array.length))}),this.addEventListener("input-array:remove",t=>{t.stopPropagation(),this.removeClosestItem(t.target)}),this.addEventListener("change",t=>{t.stopPropagation();const e=t.target;if(e&&e!==this){const s=new Event("change",{bubbles:!0}),i=e.value,n=e.closest("label");if(n){const o=Array.from(this.children).indexOf(n);this._array[o]=i,this.dispatchEvent(s)}}}),this.addEventListener("click",t=>{Zt(t,"button.add")?Et(t,"input-array:add"):Zt(t,"button.remove")&&Et(t,"input-array:remove")})}get name(){return this.getAttribute("name")}get value(){return this._array}set value(t){this._array=Array.isArray(t)?t:[t],lr(this._array,this)}removeClosestItem(t){const e=t.closest("label");if(console.log("Removing closest item:",e,t),e){const s=Array.from(this.children).indexOf(e);this._array.splice(s,1),e.remove()}}};Ns.template=H`
    <template>
      <ul>
        <slot></slot>
      </ul>
      <button class="add">
        <slot name="label-add">Add one</slot>
        <style></style>
      </button>
    </template>
  `;Ns.styles=cs`
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
  `;function lr(r,t){t.replaceChildren(),r.forEach((e,s)=>t.append(Ls(e)))}function Ls(r,t){const e=r===void 0?H`<input />`:H`<input value="${r}" />`;return H`
    <label>
      ${e}
      <button class="remove" type="button">Remove</button>
    </label>
  `}function ue(r){return Object.entries(r).map(([t,e])=>{customElements.get(t)||customElements.define(t,e)}),customElements}var cr=Object.defineProperty,hr=Object.getOwnPropertyDescriptor,ur=(r,t,e,s)=>{for(var i=hr(t,e),n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&cr(t,e,i),i};class Ms extends J{constructor(t){super(),this._pending=[],this._observer=new P(this,t)}get model(){return this._lastModel=this._context?this._context.value:{},this._lastModel}connectedCallback(){var t;super.connectedCallback(),(t=this._observer)==null||t.observe().then(e=>{console.log("View effect (initial)",this,e),this._context=e.context,this._pending.length&&this._pending.forEach(([s,i])=>{console.log("Dispatching queued event",i,s),s.dispatchEvent(i)}),e.setEffect(()=>{var s;if(console.log("View effect",this,e,(s=this._context)==null?void 0:s.value),this._context)console.log("requesting update"),this.requestUpdate();else throw"View context not ready for effect"})})}dispatchMessage(t,e=this){const s=new CustomEvent("mu:message",{bubbles:!0,composed:!0,detail:t});this._context?(console.log("Dispatching message event",s),e.dispatchEvent(s)):(console.log("Queueing message event",s),this._pending.push([e,s]))}ref(t){return this.model?this.model[t]:void 0}}ur([As()],Ms.prototype,"model");const dr={};function pr(r,t,e){switch(r[0]){case"app/trails":fr(r[1],e).then(i=>t(n=>({...n,profile:i})));break;default:const s=r[0];throw new Error(`Unhandled Auth message "${s}"`)}}function fr(r,t){return fetch(`/app/trails/${r.trailID}`,{headers:x.headers(t)}).then(e=>{if(e.status===200)return e.json()}).then(e=>{if(e)return console.log(e),e})}/**
 * @license
 * Copyright 2019 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const At=globalThis,de=At.ShadowRoot&&(At.ShadyCSS===void 0||At.ShadyCSS.nativeShadow)&&"adoptedStyleSheets"in Document.prototype&&"replace"in CSSStyleSheet.prototype,pe=Symbol(),qe=new WeakMap;let Is=class{constructor(t,e,s){if(this._$cssResult$=!0,s!==pe)throw Error("CSSResult is not constructable. Use `unsafeCSS` or `css` instead.");this.cssText=t,this.t=e}get styleSheet(){let t=this.o;const e=this.t;if(de&&t===void 0){const s=e!==void 0&&e.length===1;s&&(t=qe.get(e)),t===void 0&&((this.o=t=new CSSStyleSheet).replaceSync(this.cssText),s&&qe.set(e,t))}return t}toString(){return this.cssText}};const mr=r=>new Is(typeof r=="string"?r:r+"",void 0,pe),yt=(r,...t)=>{const e=r.length===1?r[0]:t.reduce((s,i,n)=>s+(o=>{if(o._$cssResult$===!0)return o.cssText;if(typeof o=="number")return o;throw Error("Value passed to 'css' function must be a 'css' function result: "+o+". Use 'unsafeCSS' to pass non-literal values, but take care to ensure page security.")})(i)+r[n+1],r[0]);return new Is(e,r,pe)},gr=(r,t)=>{if(de)r.adoptedStyleSheets=t.map(e=>e instanceof CSSStyleSheet?e:e.styleSheet);else for(const e of t){const s=document.createElement("style"),i=At.litNonce;i!==void 0&&s.setAttribute("nonce",i),s.textContent=e.cssText,r.appendChild(s)}},Be=de?r=>r:r=>r instanceof CSSStyleSheet?(t=>{let e="";for(const s of t.cssRules)e+=s.cssText;return mr(e)})(r):r;/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const{is:vr,defineProperty:yr,getOwnPropertyDescriptor:_r,getOwnPropertyNames:$r,getOwnPropertySymbols:br,getPrototypeOf:wr}=Object,T=globalThis,We=T.trustedTypes,Ar=We?We.emptyScript:"",qt=T.reactiveElementPolyfillSupport,ct=(r,t)=>r,Ct={toAttribute(r,t){switch(t){case Boolean:r=r?Ar:null;break;case Object:case Array:r=r==null?r:JSON.stringify(r)}return r},fromAttribute(r,t){let e=r;switch(t){case Boolean:e=r!==null;break;case Number:e=r===null?null:Number(r);break;case Object:case Array:try{e=JSON.parse(r)}catch{e=null}}return e}},fe=(r,t)=>!vr(r,t),Ye={attribute:!0,type:String,converter:Ct,reflect:!1,hasChanged:fe};Symbol.metadata??(Symbol.metadata=Symbol("metadata")),T.litPropertyMetadata??(T.litPropertyMetadata=new WeakMap);class K extends HTMLElement{static addInitializer(t){this._$Ei(),(this.l??(this.l=[])).push(t)}static get observedAttributes(){return this.finalize(),this._$Eh&&[...this._$Eh.keys()]}static createProperty(t,e=Ye){if(e.state&&(e.attribute=!1),this._$Ei(),this.elementProperties.set(t,e),!e.noAccessor){const s=Symbol(),i=this.getPropertyDescriptor(t,s,e);i!==void 0&&yr(this.prototype,t,i)}}static getPropertyDescriptor(t,e,s){const{get:i,set:n}=_r(this.prototype,t)??{get(){return this[e]},set(o){this[e]=o}};return{get(){return i==null?void 0:i.call(this)},set(o){const l=i==null?void 0:i.call(this);n.call(this,o),this.requestUpdate(t,l,s)},configurable:!0,enumerable:!0}}static getPropertyOptions(t){return this.elementProperties.get(t)??Ye}static _$Ei(){if(this.hasOwnProperty(ct("elementProperties")))return;const t=wr(this);t.finalize(),t.l!==void 0&&(this.l=[...t.l]),this.elementProperties=new Map(t.elementProperties)}static finalize(){if(this.hasOwnProperty(ct("finalized")))return;if(this.finalized=!0,this._$Ei(),this.hasOwnProperty(ct("properties"))){const e=this.properties,s=[...$r(e),...br(e)];for(const i of s)this.createProperty(i,e[i])}const t=this[Symbol.metadata];if(t!==null){const e=litPropertyMetadata.get(t);if(e!==void 0)for(const[s,i]of e)this.elementProperties.set(s,i)}this._$Eh=new Map;for(const[e,s]of this.elementProperties){const i=this._$Eu(e,s);i!==void 0&&this._$Eh.set(i,e)}this.elementStyles=this.finalizeStyles(this.styles)}static finalizeStyles(t){const e=[];if(Array.isArray(t)){const s=new Set(t.flat(1/0).reverse());for(const i of s)e.unshift(Be(i))}else t!==void 0&&e.push(Be(t));return e}static _$Eu(t,e){const s=e.attribute;return s===!1?void 0:typeof s=="string"?s:typeof t=="string"?t.toLowerCase():void 0}constructor(){super(),this._$Ep=void 0,this.isUpdatePending=!1,this.hasUpdated=!1,this._$Em=null,this._$Ev()}_$Ev(){var t;this._$ES=new Promise(e=>this.enableUpdating=e),this._$AL=new Map,this._$E_(),this.requestUpdate(),(t=this.constructor.l)==null||t.forEach(e=>e(this))}addController(t){var e;(this._$EO??(this._$EO=new Set)).add(t),this.renderRoot!==void 0&&this.isConnected&&((e=t.hostConnected)==null||e.call(t))}removeController(t){var e;(e=this._$EO)==null||e.delete(t)}_$E_(){const t=new Map,e=this.constructor.elementProperties;for(const s of e.keys())this.hasOwnProperty(s)&&(t.set(s,this[s]),delete this[s]);t.size>0&&(this._$Ep=t)}createRenderRoot(){const t=this.shadowRoot??this.attachShadow(this.constructor.shadowRootOptions);return gr(t,this.constructor.elementStyles),t}connectedCallback(){var t;this.renderRoot??(this.renderRoot=this.createRenderRoot()),this.enableUpdating(!0),(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostConnected)==null?void 0:s.call(e)})}enableUpdating(t){}disconnectedCallback(){var t;(t=this._$EO)==null||t.forEach(e=>{var s;return(s=e.hostDisconnected)==null?void 0:s.call(e)})}attributeChangedCallback(t,e,s){this._$AK(t,s)}_$EC(t,e){var n;const s=this.constructor.elementProperties.get(t),i=this.constructor._$Eu(t,s);if(i!==void 0&&s.reflect===!0){const o=(((n=s.converter)==null?void 0:n.toAttribute)!==void 0?s.converter:Ct).toAttribute(e,s.type);this._$Em=t,o==null?this.removeAttribute(i):this.setAttribute(i,o),this._$Em=null}}_$AK(t,e){var n;const s=this.constructor,i=s._$Eh.get(t);if(i!==void 0&&this._$Em!==i){const o=s.getPropertyOptions(i),l=typeof o.converter=="function"?{fromAttribute:o.converter}:((n=o.converter)==null?void 0:n.fromAttribute)!==void 0?o.converter:Ct;this._$Em=i,this[i]=l.fromAttribute(e,o.type),this._$Em=null}}requestUpdate(t,e,s){if(t!==void 0){if(s??(s=this.constructor.getPropertyOptions(t)),!(s.hasChanged??fe)(this[t],e))return;this.P(t,e,s)}this.isUpdatePending===!1&&(this._$ES=this._$ET())}P(t,e,s){this._$AL.has(t)||this._$AL.set(t,e),s.reflect===!0&&this._$Em!==t&&(this._$Ej??(this._$Ej=new Set)).add(t)}async _$ET(){this.isUpdatePending=!0;try{await this._$ES}catch(e){Promise.reject(e)}const t=this.scheduleUpdate();return t!=null&&await t,!this.isUpdatePending}scheduleUpdate(){return this.performUpdate()}performUpdate(){var s;if(!this.isUpdatePending)return;if(!this.hasUpdated){if(this.renderRoot??(this.renderRoot=this.createRenderRoot()),this._$Ep){for(const[n,o]of this._$Ep)this[n]=o;this._$Ep=void 0}const i=this.constructor.elementProperties;if(i.size>0)for(const[n,o]of i)o.wrapped!==!0||this._$AL.has(n)||this[n]===void 0||this.P(n,this[n],o)}let t=!1;const e=this._$AL;try{t=this.shouldUpdate(e),t?(this.willUpdate(e),(s=this._$EO)==null||s.forEach(i=>{var n;return(n=i.hostUpdate)==null?void 0:n.call(i)}),this.update(e)):this._$EU()}catch(i){throw t=!1,this._$EU(),i}t&&this._$AE(e)}willUpdate(t){}_$AE(t){var e;(e=this._$EO)==null||e.forEach(s=>{var i;return(i=s.hostUpdated)==null?void 0:i.call(s)}),this.hasUpdated||(this.hasUpdated=!0,this.firstUpdated(t)),this.updated(t)}_$EU(){this._$AL=new Map,this.isUpdatePending=!1}get updateComplete(){return this.getUpdateComplete()}getUpdateComplete(){return this._$ES}shouldUpdate(t){return!0}update(t){this._$Ej&&(this._$Ej=this._$Ej.forEach(e=>this._$EC(e,this[e]))),this._$EU()}updated(t){}firstUpdated(t){}}K.elementStyles=[],K.shadowRootOptions={mode:"open"},K[ct("elementProperties")]=new Map,K[ct("finalized")]=new Map,qt==null||qt({ReactiveElement:K}),(T.reactiveElementVersions??(T.reactiveElementVersions=[])).push("2.0.4");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const ht=globalThis,Ot=ht.trustedTypes,Ke=Ot?Ot.createPolicy("lit-html",{createHTML:r=>r}):void 0,Hs="$lit$",O=`lit$${Math.random().toFixed(9).slice(2)}$`,js="?"+O,Er=`<${js}>`,z=document,pt=()=>z.createComment(""),ft=r=>r===null||typeof r!="object"&&typeof r!="function",me=Array.isArray,Sr=r=>me(r)||typeof(r==null?void 0:r[Symbol.iterator])=="function",Bt=`[ 	
\f\r]`,ot=/<(?:(!--|\/[^a-zA-Z])|(\/?[a-zA-Z][^>\s]*)|(\/?$))/g,Je=/-->/g,Ze=/>/g,L=RegExp(`>|${Bt}(?:([^\\s"'>=/]+)(${Bt}*=${Bt}*(?:[^ 	
\f\r"'\`<>=]|("|')|))|$)`,"g"),Ge=/'/g,Qe=/"/g,zs=/^(?:script|style|textarea|title)$/i,xr=r=>(t,...e)=>({_$litType$:r,strings:t,values:e}),y=xr(1),et=Symbol.for("lit-noChange"),b=Symbol.for("lit-nothing"),Xe=new WeakMap,I=z.createTreeWalker(z,129);function Ds(r,t){if(!me(r)||!r.hasOwnProperty("raw"))throw Error("invalid template strings array");return Ke!==void 0?Ke.createHTML(t):t}const kr=(r,t)=>{const e=r.length-1,s=[];let i,n=t===2?"<svg>":t===3?"<math>":"",o=ot;for(let l=0;l<e;l++){const a=r[l];let d,f,u=-1,c=0;for(;c<a.length&&(o.lastIndex=c,f=o.exec(a),f!==null);)c=o.lastIndex,o===ot?f[1]==="!--"?o=Je:f[1]!==void 0?o=Ze:f[2]!==void 0?(zs.test(f[2])&&(i=RegExp("</"+f[2],"g")),o=L):f[3]!==void 0&&(o=L):o===L?f[0]===">"?(o=i??ot,u=-1):f[1]===void 0?u=-2:(u=o.lastIndex-f[2].length,d=f[1],o=f[3]===void 0?L:f[3]==='"'?Qe:Ge):o===Qe||o===Ge?o=L:o===Je||o===Ze?o=ot:(o=L,i=void 0);const h=o===L&&r[l+1].startsWith("/>")?" ":"";n+=o===ot?a+Er:u>=0?(s.push(d),a.slice(0,u)+Hs+a.slice(u)+O+h):a+O+(u===-2?l:h)}return[Ds(r,n+(r[e]||"<?>")+(t===2?"</svg>":t===3?"</math>":"")),s]};class mt{constructor({strings:t,_$litType$:e},s){let i;this.parts=[];let n=0,o=0;const l=t.length-1,a=this.parts,[d,f]=kr(t,e);if(this.el=mt.createElement(d,s),I.currentNode=this.el.content,e===2||e===3){const u=this.el.content.firstChild;u.replaceWith(...u.childNodes)}for(;(i=I.nextNode())!==null&&a.length<l;){if(i.nodeType===1){if(i.hasAttributes())for(const u of i.getAttributeNames())if(u.endsWith(Hs)){const c=f[o++],h=i.getAttribute(u).split(O),p=/([.?@])?(.*)/.exec(c);a.push({type:1,index:n,name:p[2],strings:h,ctor:p[1]==="."?Cr:p[1]==="?"?Or:p[1]==="@"?Tr:Lt}),i.removeAttribute(u)}else u.startsWith(O)&&(a.push({type:6,index:n}),i.removeAttribute(u));if(zs.test(i.tagName)){const u=i.textContent.split(O),c=u.length-1;if(c>0){i.textContent=Ot?Ot.emptyScript:"";for(let h=0;h<c;h++)i.append(u[h],pt()),I.nextNode(),a.push({type:2,index:++n});i.append(u[c],pt())}}}else if(i.nodeType===8)if(i.data===js)a.push({type:2,index:n});else{let u=-1;for(;(u=i.data.indexOf(O,u+1))!==-1;)a.push({type:7,index:n}),u+=O.length-1}n++}}static createElement(t,e){const s=z.createElement("template");return s.innerHTML=t,s}}function st(r,t,e=r,s){var o,l;if(t===et)return t;let i=s!==void 0?(o=e._$Co)==null?void 0:o[s]:e._$Cl;const n=ft(t)?void 0:t._$litDirective$;return(i==null?void 0:i.constructor)!==n&&((l=i==null?void 0:i._$AO)==null||l.call(i,!1),n===void 0?i=void 0:(i=new n(r),i._$AT(r,e,s)),s!==void 0?(e._$Co??(e._$Co=[]))[s]=i:e._$Cl=i),i!==void 0&&(t=st(r,i._$AS(r,t.values),i,s)),t}class Pr{constructor(t,e){this._$AV=[],this._$AN=void 0,this._$AD=t,this._$AM=e}get parentNode(){return this._$AM.parentNode}get _$AU(){return this._$AM._$AU}u(t){const{el:{content:e},parts:s}=this._$AD,i=((t==null?void 0:t.creationScope)??z).importNode(e,!0);I.currentNode=i;let n=I.nextNode(),o=0,l=0,a=s[0];for(;a!==void 0;){if(o===a.index){let d;a.type===2?d=new _t(n,n.nextSibling,this,t):a.type===1?d=new a.ctor(n,a.name,a.strings,this,t):a.type===6&&(d=new Ur(n,this,t)),this._$AV.push(d),a=s[++l]}o!==(a==null?void 0:a.index)&&(n=I.nextNode(),o++)}return I.currentNode=z,i}p(t){let e=0;for(const s of this._$AV)s!==void 0&&(s.strings!==void 0?(s._$AI(t,s,e),e+=s.strings.length-2):s._$AI(t[e])),e++}}class _t{get _$AU(){var t;return((t=this._$AM)==null?void 0:t._$AU)??this._$Cv}constructor(t,e,s,i){this.type=2,this._$AH=b,this._$AN=void 0,this._$AA=t,this._$AB=e,this._$AM=s,this.options=i,this._$Cv=(i==null?void 0:i.isConnected)??!0}get parentNode(){let t=this._$AA.parentNode;const e=this._$AM;return e!==void 0&&(t==null?void 0:t.nodeType)===11&&(t=e.parentNode),t}get startNode(){return this._$AA}get endNode(){return this._$AB}_$AI(t,e=this){t=st(this,t,e),ft(t)?t===b||t==null||t===""?(this._$AH!==b&&this._$AR(),this._$AH=b):t!==this._$AH&&t!==et&&this._(t):t._$litType$!==void 0?this.$(t):t.nodeType!==void 0?this.T(t):Sr(t)?this.k(t):this._(t)}O(t){return this._$AA.parentNode.insertBefore(t,this._$AB)}T(t){this._$AH!==t&&(this._$AR(),this._$AH=this.O(t))}_(t){this._$AH!==b&&ft(this._$AH)?this._$AA.nextSibling.data=t:this.T(z.createTextNode(t)),this._$AH=t}$(t){var n;const{values:e,_$litType$:s}=t,i=typeof s=="number"?this._$AC(t):(s.el===void 0&&(s.el=mt.createElement(Ds(s.h,s.h[0]),this.options)),s);if(((n=this._$AH)==null?void 0:n._$AD)===i)this._$AH.p(e);else{const o=new Pr(i,this),l=o.u(this.options);o.p(e),this.T(l),this._$AH=o}}_$AC(t){let e=Xe.get(t.strings);return e===void 0&&Xe.set(t.strings,e=new mt(t)),e}k(t){me(this._$AH)||(this._$AH=[],this._$AR());const e=this._$AH;let s,i=0;for(const n of t)i===e.length?e.push(s=new _t(this.O(pt()),this.O(pt()),this,this.options)):s=e[i],s._$AI(n),i++;i<e.length&&(this._$AR(s&&s._$AB.nextSibling,i),e.length=i)}_$AR(t=this._$AA.nextSibling,e){var s;for((s=this._$AP)==null?void 0:s.call(this,!1,!0,e);t&&t!==this._$AB;){const i=t.nextSibling;t.remove(),t=i}}setConnected(t){var e;this._$AM===void 0&&(this._$Cv=t,(e=this._$AP)==null||e.call(this,t))}}class Lt{get tagName(){return this.element.tagName}get _$AU(){return this._$AM._$AU}constructor(t,e,s,i,n){this.type=1,this._$AH=b,this._$AN=void 0,this.element=t,this.name=e,this._$AM=i,this.options=n,s.length>2||s[0]!==""||s[1]!==""?(this._$AH=Array(s.length-1).fill(new String),this.strings=s):this._$AH=b}_$AI(t,e=this,s,i){const n=this.strings;let o=!1;if(n===void 0)t=st(this,t,e,0),o=!ft(t)||t!==this._$AH&&t!==et,o&&(this._$AH=t);else{const l=t;let a,d;for(t=n[0],a=0;a<n.length-1;a++)d=st(this,l[s+a],e,a),d===et&&(d=this._$AH[a]),o||(o=!ft(d)||d!==this._$AH[a]),d===b?t=b:t!==b&&(t+=(d??"")+n[a+1]),this._$AH[a]=d}o&&!i&&this.j(t)}j(t){t===b?this.element.removeAttribute(this.name):this.element.setAttribute(this.name,t??"")}}class Cr extends Lt{constructor(){super(...arguments),this.type=3}j(t){this.element[this.name]=t===b?void 0:t}}class Or extends Lt{constructor(){super(...arguments),this.type=4}j(t){this.element.toggleAttribute(this.name,!!t&&t!==b)}}class Tr extends Lt{constructor(t,e,s,i,n){super(t,e,s,i,n),this.type=5}_$AI(t,e=this){if((t=st(this,t,e,0)??b)===et)return;const s=this._$AH,i=t===b&&s!==b||t.capture!==s.capture||t.once!==s.once||t.passive!==s.passive,n=t!==b&&(s===b||i);i&&this.element.removeEventListener(this.name,this,s),n&&this.element.addEventListener(this.name,this,t),this._$AH=t}handleEvent(t){var e;typeof this._$AH=="function"?this._$AH.call(((e=this.options)==null?void 0:e.host)??this.element,t):this._$AH.handleEvent(t)}}class Ur{constructor(t,e,s){this.element=t,this.type=6,this._$AN=void 0,this._$AM=e,this.options=s}get _$AU(){return this._$AM._$AU}_$AI(t){st(this,t)}}const Wt=ht.litHtmlPolyfillSupport;Wt==null||Wt(mt,_t),(ht.litHtmlVersions??(ht.litHtmlVersions=[])).push("3.2.1");const Rr=(r,t,e)=>{const s=(e==null?void 0:e.renderBefore)??t;let i=s._$litPart$;if(i===void 0){const n=(e==null?void 0:e.renderBefore)??null;s._$litPart$=i=new _t(t.insertBefore(pt(),n),n,void 0,e??{})}return i._$AI(r),i};/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */let S=class extends K{constructor(){super(...arguments),this.renderOptions={host:this},this._$Do=void 0}createRenderRoot(){var e;const t=super.createRenderRoot();return(e=this.renderOptions).renderBefore??(e.renderBefore=t.firstChild),t}update(t){const e=this.render();this.hasUpdated||(this.renderOptions.isConnected=this.isConnected),super.update(t),this._$Do=Rr(e,this.renderRoot,this.renderOptions)}connectedCallback(){var t;super.connectedCallback(),(t=this._$Do)==null||t.setConnected(!0)}disconnectedCallback(){var t;super.disconnectedCallback(),(t=this._$Do)==null||t.setConnected(!1)}render(){return et}};var ts;S._$litElement$=!0,S.finalized=!0,(ts=globalThis.litElementHydrateSupport)==null||ts.call(globalThis,{LitElement:S});const Yt=globalThis.litElementPolyfillSupport;Yt==null||Yt({LitElement:S});(globalThis.litElementVersions??(globalThis.litElementVersions=[])).push("4.1.1");/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */const Nr={attribute:!0,type:String,converter:Ct,reflect:!1,hasChanged:fe},Lr=(r=Nr,t,e)=>{const{kind:s,metadata:i}=e;let n=globalThis.litPropertyMetadata.get(i);if(n===void 0&&globalThis.litPropertyMetadata.set(i,n=new Map),n.set(e.name,r),s==="accessor"){const{name:o}=e;return{set(l){const a=t.get.call(this);t.set.call(this,l),this.requestUpdate(o,a,r)},init(l){return l!==void 0&&this.P(o,void 0,r),l}}}if(s==="setter"){const{name:o}=e;return function(l){const a=this[o];t.call(this,l),this.requestUpdate(o,a,r)}}throw Error("Unsupported decorator location: "+s)};function ge(r){return(t,e)=>typeof e=="object"?Lr(r,t,e):((s,i,n)=>{const o=i.hasOwnProperty(n);return i.constructor.createProperty(n,o?{...s,wrapped:!0}:s),o?Object.getOwnPropertyDescriptor(i,n):void 0})(r,t,e)}/**
 * @license
 * Copyright 2017 Google LLC
 * SPDX-License-Identifier: BSD-3-Clause
 */function F(r){return ge({...r,state:!0,attribute:!1})}var Mr=Object.defineProperty,Ir=(r,t,e,s)=>{for(var i=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&Mr(t,e,i),i};function Hr(r){const e=r.target.checked;document.body.classList.toggle("dark-mode",e),ls.relay(r,"dark-mode",{checked:e})}const Ut=class Ut extends S{constructor(){super(...arguments),this.userId="hiker",this._user=new x.User,this._authObserver=new P(this,"blazing:auth"),this.handleSignOut=t=>{t.preventDefault(),ls.relay(t,"auth:message",["auth/signout"]),this._user=new x.User,window.location.href="/login"}}connectedCallback(){super.connectedCallback(),console.log("HeaderElement connected to the DOM."),this._authObserver.observe(({user:t})=>{console.log("Auth observer triggered with user:",t),t&&(this._user=t,this.loadUserId())}),this.loadUserId()}updated(){var e;const t=(e=this.shadowRoot)==null?void 0:e.querySelector("#signout");t&&t.addEventListener("click",this.handleSignOut)}disconnectedCallback(){var e;super.disconnectedCallback();const t=(e=this.shadowRoot)==null?void 0:e.querySelector("#signout");t&&t.removeEventListener("click",this.handleSignOut)}loadUserId(){console.log("Loading user ID...");const t=this._user;t&&t.username?(console.log("User found:",t.username),this.userId=t.username):this.userId="hiker"}render(){return y`
        <header>
          <h1>PNW Hikes</h1>
          <nav>
            <drop-down>
              <a slot="actuator">
                Hello,
                <span id="userid">${this.userId}</span>
              </a>
              <menu>
                <label @change=${Hr}>
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
      `}};Ut.uses=ue({"drop-down":ar.Element}),Ut.styles=yt`
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
  `;let Tt=Ut;Ir([F()],Tt.prototype,"userId");var jr=Object.defineProperty,Mt=(r,t,e,s)=>{for(var i=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&jr(t,e,i),i};const ye=class ye extends S{constructor(){super(...arguments),this.mode="view",this.src="",this._user=new x.User,this.slots={},this._authObserver=new P(this,"blazing:auth"),this.handleEdit=()=>{console.log("Switching to edit mode"),this.mode="edit"}}connectedCallback(){super.connectedCallback(),console.log("TrailCard connected to DOM"),this._authObserver.observe(({user:t})=>{console.log("Auth observer triggered:",t),t&&(this._user=t),t!=null&&t.authenticated&&this.src&&this.hydrate(this.src)})}hydrate(t){fetch(t,{headers:x.headers(this._user)}).then(e=>{if(!e.ok)throw new Error(`Failed to fetch trail data: ${e.status}`);return e.json()}).then(e=>{console.log("Trail data fetched:",e),this.slots=e}).catch(e=>console.error("Error fetching trail data:",e))}submit(t,e){console.log("Submit: Sending PUT request to:",t),console.log("Submit: Payload being sent:",e),fetch(t,{method:"PUT",headers:{"Content-Type":"application/json",...x.headers(this._user)},body:JSON.stringify(e)}).then(s=>{if(!s.ok)throw console.error(`Submit: Server responded with status ${s.status}`),new Error(`Failed to update resource: ${s.status} ${s.statusText}`);return s.json()}).then(s=>{console.log("Submit: Successfully updated resource:",s),this.slots=s,this.mode="view"}).catch(s=>{console.error("Submit: Error occurred while updating resource:",s)})}handleSubmit(t){var i;t.preventDefault();const e=(i=this.shadowRoot)==null?void 0:i.querySelector("mu-form");if(!e){console.error("Form not found");return}const s={};e.querySelectorAll("input").forEach(n=>{const o=n.name,l=n.value;o&&(s[o]=l)}),this.submit(this.src,s)}render(){const t=[{href:"groups",text:"Hiking Groups"},{href:"gear",text:"Gear"},{href:"viewpoints",text:"Viewpoints"}];return y`
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
    `}};ye.styles=yt`
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
  `;let D=ye;Mt([F()],D.prototype,"mode");Mt([ge({type:String})],D.prototype,"src");Mt([F()],D.prototype,"_user");Mt([F()],D.prototype,"slots");var zr=Object.defineProperty,Dr=(r,t,e,s)=>{for(var i=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&zr(t,e,i),i};class Fs extends S{constructor(){super(...arguments),this.src="/api/trails",this.trailIndex=[],this._authObserver=new P(this,"blazing:auth"),this._user=new x.User}render(){return y`
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
    `}hydrate(t){fetch(t,{headers:x.headers(this._user)}).then(e=>{if(e.status===200)return e.json();throw`Server responded with status ${e.status}`}).then(e=>{this.trailIndex=e||[]}).catch(e=>console.error("Failed to fetch trail data:",e))}connectedCallback(){super.connectedCallback(),this._authObserver.observe(({user:t})=>{t&&(this._user=t),this.hydrate(this.src)})}}Dr([F()],Fs.prototype,"trailIndex");var Fr=Object.defineProperty,Vr=(r,t,e,s)=>{for(var i=void 0,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=o(t,e,i)||i);return i&&Fr(t,e,i),i};class Vs extends S{constructor(){super(...arguments),this.src="/api/trails",this.trailIndex=[],this._authObserver=new P(this,"blazing:auth"),this._user=new x.User}render(){var e;const t=(e=this.trailIndex)!=null&&e.length?this.trailIndex.map(this.renderItem):y`<p>Loading trails...</p>`;return y`
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

      <trail-message-view trailID="${t.name}"></trail-message-view>

    `}hydrate(t){fetch(t,{headers:x.headers(this._user)}).then(e=>{if(e.status===200)return e.json();throw`Server responded with status ${e.status}`}).then(e=>{console.log(e),this.trailIndex=e||[]}).catch(e=>console.error("Failed to fetch trail data:",e))}connectedCallback(){super.connectedCallback(),this._authObserver.observe(({user:t})=>{t&&(this._user=t),this.hydrate(this.src)})}}Vr([F()],Vs.prototype,"trailIndex");const _e=class _e extends S{render(){return y`
      <h1>Hiking Gear</h1>
      <ul>
        <li>Clothes: Lightweight jacket, hiking boots</li>
        <li>Tools: Hiking poles, water filter</li>
        <li>Food: Energy bars, water bottles</li>
      </ul>
      <a href="/app/trails">Back to Trails</a>
    `}};_e.styles=yt`
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
  `;let Xt=_e;const $e=class $e extends S{render(){return y`
      <h1>Upcoming Hiking Groups</h1>
      <ul>
        <li>15 people, hiking on 2025-01-15</li>
        <li>3 people, hiking on 2025-01-18</li>
        <li>7 people, hiking on 2025-01-22</li>      
      </ul>
      <a href="/app/trails">Back to Trails</a>
    `}};$e.styles=yt`
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
  `;let te=$e;const be=class be extends S{render(){return y`
      <h1>Viewpoints You Can See</h1>
      <ul>
         <li>Cliff View: Panoramic view of the valley</li>
        <li>Waterfall View: Cascading waterfalls</li>
        <li>Lake View: Peaceful lakeside spot</li>     
      </ul>
      <a href="/app/trails">Back to Trails</a>
    `}};be.styles=yt`
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
  `;let ee=be;var qr=Object.defineProperty,Br=Object.getOwnPropertyDescriptor,qs=(r,t,e,s)=>{for(var i=s>1?void 0:s?Br(t,e):t,n=r.length-1,o;n>=0;n--)(o=r[n])&&(i=(s?o(t,e,i):o(i))||i);return s&&i&&qr(t,e,i),i};class ve extends Ms{get trail(){return this.model.trail}constructor(){super("blazing:model")}render(){const{trail:t}=this;return y`
      ${t?y`
            <div>
              <h1>${t.name}</h1>
              <p>${t.description}</p>
              <p>Location: ${t.location}</p>
            </div>
          `:y`<p>Loading trail information...</p>`}
    `}attributeChangedCallback(t,e,s){super.attributeChangedCallback(t,e,s),t==="userid"&&e!==s&&s&&this.dispatchMessage(["app/trails",{trailID:s}])}}qs([ge()],ve.prototype,"trailID",2);qs([F()],ve.prototype,"trail",1);const we=class we extends S{render(){return y`
      <home-view></home-view>
    `}connectedCallback(){super.connectedCallback()}};we.uses=ue({"home-view":Fs,"trails-view":Vs,"gear-view":Xt,"groups-view":te,"viewpoints-view":ee,"trail-message-view":ve});let se=we;const Wr=[{path:"/app",view:()=>y`
        <home-view></home-view>
      `},{path:"/app/trails",view:()=>y`
          <trails-view></trails-view>
        `},{path:"/app/gear",view:()=>y`
          <gear-view></gear-view>
        `},{path:"/app/groups",view:()=>y`
          <groups-view></groups-view>
        `},{path:"/app/viewpoints",view:()=>y`
          <viewpoints-view></viewpoints-view>
        `},{path:"/",redirect:"/app"}];ue({"mu-auth":x.Provider,"blazing-app":se,"blazing-header":Tt,"trail-card":D,"mu-history":pi.Provider,"mu-switch":class extends nr.Element{constructor(){super(Wr,"blazing:history","blazing:auth")}},"mu-store":class extends gi.Provider{constructor(){super(pr,dr,"blazing:auth")}}});
