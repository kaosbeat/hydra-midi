!function(){"use strict";const e=(e,t)=>(e=e.bind({}),Object.entries(t).forEach((([t,n])=>e[t]=n(e))),e),t=(e,t,n)=>e*(n-t)+t,n=JSON.parse(sessionStorage.getItem("hydra-midi_ccValues")||"{}"),a={set(){return sessionStorage.setItem("hydra-midi_ccValues",JSON.stringify(n)),Reflect.set(...arguments)}};var i={ccValues:new Proxy(n,a),playingNotes:new Map,noteOnEvents:{},initialDefaults:{channel:0,input:0,adsr:[100,100,1,100]},defaults:{channel:0,input:0,adsr:[100,100,1,100]}};class s{active=!1;noteOn=!1;gateDuration=null;startTime=null;constructor({a:e,d:t,s:n,r:a}){this.a=e,this.d=t,this.s=n,this.r=a}trigger(){this.startTime=null,this.gateDuration=null,this.noteOn=!0,this.active=!0}stop(){this.noteOn=!1}value(e){if(!this.active)return 0;this.startTime??=e;const n=e-this.startTime,{a:a,d:i,s:s,r:c}=this;if(n<a){return t(n/a,0,1)}if(n<a+i&&s>0){return t((n-a)/i,1,s)}if(this.noteOn&&s>0)return s;{this.gateDuration??=n;const e=Math.min(1,(n-this.gateDuration)/c);1===e&&(this.active=!1);return t(e,s||1,0)}}}const c=t=>n=>e(((...e)=>n(t(...e))),{scale:o,range:r}),r=t=>(n=0,a=1)=>e(((...e)=>((e,t,n,a,i)=>(e-t)*(i-a)/(n-t)+a)(t(...e),0,1,n,a)),{scale:o,value:c}),o=t=>n=>e(((...e)=>t(...e)*n),{range:r,value:c}),d={},l=(t,n=(()=>1))=>()=>(a,l,u,p)=>{[a,l,u,p]=[a,l,u,p].map(((e,t)=>e??i.defaults.adsr[t]??i.initialDefaults.adsr[t])),d[t]=new s({a:a,d:l,s:u,r:p});const h=d[t];return e((({time:e})=>h.value(1e3*e)*n()),{scale:o,range:r,value:c})};class u{listeners={};on(e,t){this.listeners[e]??=[],this.listeners[e].push(t)}off(e,t){this.listeners[e]?.splice(this.listeners[e].indexOf(t),1)}emit(e,t){this.listeners[e]?.forEach((e=>e(t)))}}class p extends u{static TypeNoteOff=128;static TypeNoteOn=144;static TypeAfterTouchPoly=160;static TypeControlChange=176;static TypeProgramChange=192;static TypeAfterTouchChannel=208;static TypePitchBend=224;static TypeSystemExclusive=240;static TypeTimeCodeQuarterFrame=241;static TypeSongPosition=242;static TypeSongSelect=243;static TypeTuneRequest=246;static TypeClock=248;static TypeStart=250;static TypeContinue=251;static TypeStop=252;static TypeActiveSensing=254;static TypeSystemReset=255;enabled=!1;isSetup=!1;access=null;static parseMessage(e){const[t,n,a]=e.data;return{type:240&t,channel:15&t,data:[n,a]}}async setup(){this.access=await navigator.requestMIDIAccess();for(const e of this.access.inputs.values())e.open();const e=this.handleMessage.bind(this);this.access.addEventListener("statechange",(({port:t})=>{if("connected"===t.state){this.access.inputs.get(t.id)?.addEventListener("midimessage",e)}})),this.isSetup=!0}async start(){this.isSetup||await this.setup(),this.enabled=!0}pause(){this.enabled=!1}getInputByIndex(e){return this.access&&[...this.access.inputs.values()][e]}getInputByName(e){return this.access&&[...this.access.inputs.values()].find((t=>t.name===e))}getInputId(e){return("number"==typeof e?this.getInputByIndex(e):this.getInputByName(e))?.id}handleMessage(e){if(this.enabled){const{type:t,data:n,channel:a}=p.parseMessage(e);this.emit(t,{data:n,channel:a,input:e.target})}}}let h=document.querySelector(".hydra-midi-gui"),y=h?.querySelector(".hydra-midi-inputs"),m=h?.querySelector(".hydra-midi-inputs");let g=!1;const f=()=>{h||(()=>{const e=document.createElement("style");e.innerText=".hydra-midi-gui {\n  position: absolute;\n  /* Make space for hydra's audio monitor */\n  bottom: 80px;\n  right: 0;\n  margin-bottom: 20px;\n  margin-right: 20px;\n  padding: 0.3em 0.5em;\n  background-color: rgba(0, 0, 0, 0.6);\n  color: #cccccc;\n  font-family: monospace;\n  line-height: 1.2em;\n  pointer-events: none;\n\n  --color-midi-on: orange;\n  --color-midi-off: orange;\n  --color-midi-cc: dodgerblue;\n  --color-midi-bend: #00d86c;\n  --color-midi-aft: #e34040;\n}\n\n.hydra-midi-messages {\n  white-space: pre;\n  /* Reserve spaces for line-height * 10 */\n  height: 12em;\n  width: 15ch;\n}\n\n.hydra-midi-heading {\n  margin-bottom: 3px;\n}\n\n.hydra-midi-input {\n  display: flex;\n  white-space: pre;\n}\n\n.hydra-midi-input-name {\n  display: block;\n  max-width: 12ch;\n  text-overflow: ellipsis;\n  overflow: hidden;\n}\n",document.head.append(e),h=document.createElement("div"),h.classList.add("hydra-midi-gui"),h.innerHTML=`\n      <div class="hydra-midi-inputs"></div>\n      <span>⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯⎯</span>\n      <div class="hydra-midi-heading">Ch Type Values</div>\n      <div class="hydra-midi-messages">${[...Array(10)].map((()=>"<div></div>")).join("")}</div>\n    `,document.body.append(h),y=h.querySelector(".hydra-midi-inputs"),m=h.querySelector(".hydra-midi-messages")})(),h.hidden=!1,g=!0},v=e=>{if(!g)return;const t=(e,t=3)=>String(e).padEnd(t," "),{input:n}=e,a=t(e.channel,2),i=t(e.type,4),s=t(e.data[0]),c=e.data[1]?t(e.data[1]):"";m.removeChild(m.firstChild);const r=document.createElement("div");r.style.color=`var(--color-midi-${i})`,r.innerHTML=[a,i,s,c].join(" "),m.append(r),b(n,e.type)},T={},b=(e,t)=>{clearTimeout(T[e.id]);const n=`--color-${e.id}`;h.style.setProperty(n,`var(--color-midi-${t})`),T[e.id]=setTimeout((()=>{h.style.setProperty(n,null)}),100)},{ccValues:S,playingNotes:w,noteOnEvents:E}=i,I=new p,O=(e,t,n)=>{if(void 0!==n)return`${e}/${t}/${n??I.getInputId(0)}`},x=(e,t,n)=>[O("*","*","*"),O(e,"*","*"),O("*",t,"*"),O("*","*",n),O(e,t,"*"),O("*",t,n),O(e,"*",n)],C=e=>"*"===e?"*":I.getInputId(e),N=e=>"*"===e?e:(e=>{if("string"!=typeof e)return e;const t=e.slice(0,-1).toLowerCase(),n=parseInt(e.slice(-1));return{c:0,"c#":1,db:1,d:2,"d#":3,eb:3,e:4,f:5,"f#":6,gb:6,g:7,"g#":8,ab:8,a:9,"a#":10,bb:10,b:11}[t.toLowerCase()]+12*(n+2)})(e);I.on(p.TypeControlChange,(({data:e,channel:t,input:n})=>{const[a,i]=e,s=O(a,t,n.id),c=i/127;S[s]=c,x(a,t,n.id).forEach((e=>S[e]=c)),v({input:n,type:"cc",channel:t,data:e})})),I.on(p.TypeNoteOn,(({data:e,channel:t,input:n})=>{const[a,i]=e,s=O(a,t,n.id);w.set(s,i),d[s]?.trigger(),E[s]?.call(),x(a,t,n.id).forEach((e=>{w.set(e,i),d[e]?.trigger(),E[e]?.call()})),v({input:n,type:"on",channel:t,data:e})})),I.on(p.TypeNoteOff,(({data:e,channel:t,input:n})=>{const[a]=e,i=O(a,t,n.id);w.delete(i),d[i]?.stop(),x(a,t,n.id).forEach((e=>{w.delete(e),d[e]?.stop()})),v({input:n,type:"off",channel:t,data:e})})),I.on(p.TypePitchBend,(({input:e,data:t,channel:n})=>{const a=+(((t[1]<<7)+t[0]-8192)/8192).toFixed(2);v({input:e,type:"bend",channel:n,data:[a]})})),I.on(p.TypeAfterTouchChannel,(({input:e,data:t,channel:n})=>{v({input:e,type:"aft",channel:n,data:t})})),I.on(p.TypeAfterTouchPoly,(({input:e,data:t,channel:n})=>{v({input:e,type:"aft",channel:n,data:t})}));const M=e=>i.playingNotes.has(e),$=(e,t,n)=>O(N(e),t??i.defaults.channel,C(n??i.defaults.input)),L=(t,n,a)=>{const i=$(t,n,a);return e((()=>M(i)?1:0),{scale:o,range:r,value:c,adsr:l(i),velocity:V(i)})},P=(e,t,n,a)=>{const s=$(e,t,n);i.noteOnEvents[s]=a},D=(e,t=null)=>({note:(n,a,i)=>L(n,a??e,i??t),cc:(n,a,i)=>A(n,a??e,i??t),onNote:(n,a)=>P(n,e,t??"*",a)}),V=t=>()=>()=>{const n=()=>(e=>i.playingNotes.get(e)??0)(t)/127;return e((()=>n()),{scale:o,range:r,value:c,adsr:l(t,n)})},q=(e,t,n)=>O(e,t??i.defaults.channel,C(n??i.defaults.input)),A=(t,n,a)=>{const s=q(t,n,a);return e((()=>i.ccValues[s]??0),{scale:o,range:r,value:c})},B={start:e=>(i.defaults={...i.initialDefaults,...e},I.start().then((()=>I.access.addEventListener("statechange",(()=>(e=>{if(!g)return;y.innerHTML=[...e.values()].map(((e,t)=>`<div class="hydra-midi-input" style="color: var(--color-${e.id})">#${t} <span class="hydra-midi-input-name">${(e=>e.name??e.id??"n/a")(e)}</span></div>`)).join("")})(I.access.inputs))))),{show:f}),pause:()=>I.pause(),show:f,hide:()=>{h.hidden=!0,g=!1},input:e=>({note:(t,n,a)=>L(t,n,a??e),cc:(t,n,a)=>A(t,n,a??e),onNote:(t,n)=>P(t,"*",e,n),channel:t=>D(t,e)}),channel:D};var j;j={midi:B,cc:A,_cc:(e,t,n)=>i.ccValues[q(e,t,n)]??0,note:L,_note:(e,t,n)=>M($(e,t,n))?1:0,_noteVelocity:(e,t,n)=>V($(e,t,n))()()(),midiState:i},Object.entries(j).forEach((([e,t])=>window[e]=t))}();
