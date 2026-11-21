/* Controlled explanatory infocards. No implicit clock when step is supplied. */
(function(){'use strict';
const C={amber:'#efba70',sage:'#b8cda8',clay:'#e5a28a',lilac:'#c7b2df',cream:'#fbf1e2'},W=540,H=360,F="-apple-system,'PingFang TC',sans-serif",TAU=Math.PI*2;
const finite=v=>{if(typeof v!=='number'&&typeof v!=='string'||typeof v==='string'&&!v.trim())return null;const n=Number(v);return Number.isFinite(n)?n:null;};
const num=(o,k,d)=>finite(o[k])===null?d:finite(o[k]),clamp=(x,a=0,b=1)=>Math.max(a,Math.min(b,x)),r=x=>Math.round(x*10000)/10000;
const phase=t=>finite(t)===null?0:r(((Number(t)%3)+3)%3),ease=x=>1-Math.pow(1-clamp(x),3);
const esc=s=>String(s).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const raw=(o,k,d)=>typeof o[k]==='string'?o[k]:d,text=(o,k,d)=>esc(raw(o,k,d));
const color=(v,f='amber')=>{const k=typeof v==='string'?v.toLowerCase():'';return Object.prototype.hasOwnProperty.call(C,k)?C[k]:C[f];};
const cut=(s,max)=>{const a=Array.from(s);return a.length>max?a.slice(0,max-1).join('')+'…':s;};
const box=(x,y,w,h,s,extra='')=>`<div style="position:absolute;left:${r(x)}px;top:${r(y)}px;width:${w}px;height:${h}px;${extra}">${s}</div>`;
const ty=(size,c=C.cream,weight=600)=>`font-size:${size}px;line-height:1.25;font-weight:${weight};color:${c};`;
const fitted=(s,w)=>`<span style="display:block;max-width:${w}px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap">${s}</span>`;
const shell=(id,s)=>`<section data-infocard="${id}" style="position:relative;width:540px;height:360px;overflow:hidden;box-sizing:border-box;border:1px solid #75644c;border-radius:26px;background:linear-gradient(145deg,#29241e,#1b1a17);color:${C.cream};font-family:${F};font-size:16px;font-variant-numeric:tabular-nums;box-shadow:0 15px 36px #0004">${box(28,347,484,1,'','background:#b9a58933')}${s}</section>`;
// Integers hold completed layers; the fractional part animates the next layer.
const layer=(amount,s,x,y,w,h,extra='')=>{if(amount<=0)return '';const v=ease(amount);return box(x,y,w,h,s,`opacity:${r(v)};transform:translateY(${r(16*(1-v))}px);transform-origin:center;clip-path:inset(0 ${r((1-v)*100)}% 0 0);${extra}`);};
function title(t,o={}){
 const p=phase(t),s=finite(o.step)===null?clamp((p-.08)/.4)+clamp((p-.65)/.4):clamp(num(o,'step',0),0,2),a=color(o.accent),heading=cut(raw(o,'title','內容流程如何形成循環'),42),word=raw(o,'highlight','循環'),i=word?heading.indexOf(word):-1;
 const marked=i<0?esc(heading):esc(heading.slice(0,i))+`<span style="color:${a};white-space:${Array.from(word).length<=10?'nowrap':'normal'}">${esc(word)}</span>`+esc(heading.slice(i+word.length)),size=Array.from(heading).length>22?32:42;
 return shell('infocard-title',box(28,28,44,5,'',`border-radius:4px;background:${a}`)+layer(s,text(o,'kicker','CONTENT NOTES'),28,61,484,24,ty(16,a,700)+'letter-spacing:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis')+layer(s-1,marked,28,125,484,150,ty(size,C.cream,700)+'overflow-wrap:anywhere;overflow:hidden;text-wrap:balance'));
}
const defaults=[{label:'觀',sub:'整理觀察',color:'amber'},{label:'寫',sub:'建立內容',color:'sage'},{label:'校',sub:'檢查重點',color:'clay'},{label:'驗',sub:'回看成效',color:'lilac'}];
const nodesOf=a=>Array.isArray(a)&&a.length>=2&&a.length<=6&&Array.from(a).every(q=>q&&typeof q==='object'&&!Array.isArray(q)&&typeof q.label==='string'&&typeof q.sub==='string'&&(q.color===undefined||typeof q.color==='string'))?a.map((q,i)=>q.color===undefined?{...q,color:['amber','sage','clay','lilac'][i%4]}:q):defaults;
function flywheel(t,o={}){
 const p=phase(t),nodes=nodesOf(o.nodes),N=nodes.length,s=finite(o.step)===null?clamp((p-.12)/.4,0,N):clamp(num(o,'step',0),0,N),cx=270,cy=195,rx=180,ry=95,ns=nodes.map(q=>Object.values(C).indexOf(color(q.color))).join('');let edges='',dots='',labels='';
 for(let i=0;i<N;i++){
  const a=-Math.PI/2+TAU*i/N,b=a+TAU/N,x=cx+rx*Math.cos(a),y=cy+ry*Math.sin(a),c=color(nodes[i].color),v=ease(clamp((s-i)/.75)),progress=i===N-1?(s>=N?1:0):clamp((s-(i+1)-.75)/.25);
  if(progress>0){const start=a+50/Math.hypot(rx*Math.sin(a),ry*Math.cos(a)),end=b-50/Math.hypot(rx*Math.sin(b),ry*Math.cos(b));edges+=`<defs><linearGradient id="fw-${ns}-edge-${i}" x1="0" y1="0" x2="1" y2="1"><stop stop-color="${c}"/><stop offset="1" stop-color="${color(nodes[(i+1)%N].color)}"/></linearGradient><marker id="fw-${ns}-tip-${i}" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="4" markerHeight="4" orient="auto"><path d="M1 1 L9 5 L1 9" fill="none" stroke="${color(nodes[(i+1)%N].color)}" stroke-width="2"/></marker></defs><path data-edge="${i}" d="M${r(cx+rx*Math.cos(start))} ${r(cy+ry*Math.sin(start))} A${rx} ${ry} 0 0 1 ${r(cx+rx*Math.cos(end))} ${r(cy+ry*Math.sin(end))}" fill="none" stroke="url(#fw-${ns}-edge-${i})" stroke-width="3" pathLength="1" stroke-dasharray="${r(progress)} 1" marker-end="${progress===1?'url(#fw-'+ns+'-tip-'+i+')':'none'}"/>`;}
  if(v>0){dots+=`<g data-node="${i}" opacity="${r(v)}" transform="translate(${r(x)} ${r(y+13*(1-v))}) "><circle r="${r(42*(.75+.25*v))}" fill="#26221e" stroke="${c}" stroke-width="2"/><circle r="35" fill="${c}" opacity=".12"/><text y="-3" text-anchor="middle" fill="${c}" font-size="24" font-weight="700">${esc(cut(nodes[i].label,2))}</text><text y="22" text-anchor="middle" fill="#e2d6c5" font-size="16" font-weight="500">${esc(cut(nodes[i].sub,4))}</text></g>`;}
 }
 const flow=s>=N?`<circle data-flow="1" cx="${r(cx+rx*Math.cos(TAU*p/3-Math.PI/2))}" cy="${r(cy+ry*Math.sin(TAU*p/3-Math.PI/2))}" r="4" fill="${C.cream}"/>`:'';
 return shell('flywheel',box(28,22,484,26,'循環飛輪',ty(18,C.amber,700))+`<svg width="540" height="360" viewBox="0 0 540 360" style="position:absolute;inset:0" xmlns="http://www.w3.org/2000/svg"><ellipse cx="270" cy="195" rx="180" ry="95" fill="none" stroke="#aa936039" stroke-width="2" stroke-dasharray="3 8"/>${edges}${flow}${dots}</svg>`+box(180,182,180,30,fitted(text(o,'title','內容循環'),180),ty(22,C.cream,650)+'text-align:center')+labels);
}
function milestone(t,o={}){
 const p=phase(t),controlled=finite(o.step)!==null,q=controlled?clamp(num(o,'step',0)):clamp((p-.12)/.68),value=clamp(num(o,'value',1200),0,1e12),count=Math.round(value*q),segments=clamp(Math.round(num(o,'segments',12)),2,24),chip=q<1?0:finite(o.chipEnter)!==null?clamp(num(o,'chipEnter',1)):controlled?1:clamp((p-.8)/.4),number=count.toLocaleString('en-US'),suffix=cut(raw(o,'suffix','+'),6),size=Math.max(32,Math.min(76,470/((number.length+suffix.length)*.64)));let bars='';
 for(let i=0;i<segments;i++){const fill=clamp(q*segments-i);bars+=box(28+i*484/segments,223,484/segments-5,12,box(0,0,r((484/segments-5)*fill),12,'',`background:${[C.amber,C.sage,C.clay,C.lilac][i%4]};border-radius:4px`),'background:#ffffff13;border-radius:4px;overflow:hidden');}
 return shell('milestone-counter',box(28,24,310,25,'里程碑',ty(18,C.amber,700))+(finite(o.value)===null?box(365,25,145,24,'示意資料',ty(16,'#c3b5a3',400)+'text-align:right'):'')+box(28,85,484,105,`${number}<span style="font-size:${number.length>12?16:28}px;color:${C.amber}">${esc(suffix)}</span>`,ty(size,C.cream,700)+'white-space:nowrap;overflow:hidden')+box(28,181,484,28,fitted(text(o,'label','範例完成數'),484),ty(20,'#e2d6c5',500))+bars+layer(chip,fitted(text(o,'chip','階段達成'),422),28,267,484,44,ty(18,'#252118',700)+`box-sizing:border-box;padding:10px 18px;border-radius:12px;background:${C.sage}`));
}
/* Paste inside widgets5.js's existing IIFE, before entries.
 * No registry writes here. Dependencies: the existing C/W/H and helpers.
 * step 0 is a completed LEFT card (unlike the title widget's shell-only 0).
 * An explicitly invalid step holds 0; only absent/undefined step uses period-3 demo.
 */
const cmpDefaults={
 before:{left:{title:'原始資料',desc:'先保留內容，再逐項整理。',icon:'document'},right:{title:'整理結果',desc:'把重點排好，方便接續閱讀。',icon:'chip'},badge:'新的整理方式'},
 dual:{left:{title:'資料端',desc:'保留來源與必要脈絡。',icon:'cloud',chips:['來源 A','來源 B']},right:{title:'處理端',desc:'整理內容與呈現重點。',icon:'chip',chips:['整理','檢查']},badge:{text:'協作示意',sub:'兩側各自保留清楚角色'}}
};
const cmpObject=v=>v!==null&&typeof v==='object'&&!Array.isArray(v);
const cmpOptions=o=>cmpObject(o)?o:{};
const cmpSide=(v,d,dual)=>{
 const valid=cmpObject(v)&&['title','desc','icon'].every(k=>typeof v[k]==='string')&&(!dual||(Array.isArray(v.chips)&&Array.from(v.chips).every(s=>typeof s==='string')));
 return valid?v:d;
};
const cmpStep=(t,o)=>o.step===undefined?clamp((phase(t)-.38)/.4,0,3):clamp(num(o,'step',0),0,3);
// Conservative width budget, not font measurement: CJK/full-width 1 em,
// ASCII conservatively .85 em, widest letters 1 em. Fixed font size, explicit line/length limits.
const cmpEnter=(t,o,j)=>o.step===undefined?clamp((phase(t)-(.05+(j-1)*.3))/.4):clamp(cmpStep(t,o)-(j-1));
const cmpUnits=s=>Array.from(s).reduce((n,c)=>n+(/[\u0000-\u00ff]/u.test(c)?(/[MW@]/u.test(c)?1:.85):1),0);
const cmpShort=(s,budget)=>{
 let out='';const clean=s.replace(/\s+/gu,' ').trim();
 if(cmpUnits(clean)<=budget)return clean;
 for(const c of Array.from(clean)){if(cmpUnits(out+c)>budget-1)break;out+=c;}
 return out+'…';
};
const cmpLines=(s,budget,max)=>{
 const chars=Array.from(s.replace(/\s+/gu,' ').trim()),lines=[];let line='';
 for(let i=0;i<chars.length;i++){
  const c=chars[i];
  if(cmpUnits(line+c)>budget&&line){
   if(lines.length===max-1){lines.push(cmpShort(line+chars.slice(i).join(''),budget));return lines.map(esc).join('<br>');}
   lines.push(line);line='';
  }
  line+=c;
 }
 if(line)lines.push(line);
 return lines.map(esc).join('<br>');
};
const cmpIcon=(name,c)=>{
 // Only these literal paths can enter SVG; never interpolate supplied markup.
 const paths={document:'<path d="M10 6h15l7 7v25H10zM25 6v9h7M16 22h10M16 28h10M16 34h7"/>',chip:'<rect x="11" y="11" width="22" height="22" rx="4"/><path d="M17 17h10v10H17zM16 5v6M22 5v6M28 5v6M16 33v6M22 33v6M28 33v6M5 16h6M5 22h6M5 28h6M33 16h6M33 22h6M33 28h6"/>',cloud:'<path d="M12 33h21a8 8 0 0 0 0-16 12 12 0 0 0-23-1 9 9 0 0 0 2 17z"/>'};
 const p=Object.prototype.hasOwnProperty.call(paths,name)?paths[name]:paths.document;
 return `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 44 44" aria-hidden="true" fill="none" stroke="${c}" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${p}</svg>`;
};
const cmpCard=(v,c,dual)=>{
 const chips=dual?v.chips.slice(0,2).map((s,i)=>box(18+i*85,94,79,28,esc(cmpShort(s,3.75)),ty(16,c,600)+`box-sizing:border-box;padding:4px 8px;background:${c}17;border:1px solid ${c}55;border-radius:9px;overflow:hidden;white-space:nowrap`)).join(''):'';
 return box(18,16,36,36,cmpIcon(v.icon,c))+box(18,dual?58:64,174,28,esc(cmpShort(v.title,8)),ty(20,C.cream,650)+'white-space:nowrap;overflow:hidden')+chips+box(18,dual?138:108,174,dual?48:66,cmpLines(v.desc,9.5,dual?2:3),ty(18,'#e2d6c5',400)+'line-height:1.2;overflow:hidden');
};
const cmpPanel=(amount,v,c,dual,x)=>layer(amount,cmpCard(v,c,dual),x,dual?64:78,210,dual?208:184,`box-sizing:border-box;border:1px solid ${c}66;border-radius:18px;background:linear-gradient(145deg,${c}12,#25211d)`);
const cmpArrow=()=>`<svg xmlns="http://www.w3.org/2000/svg" width="40" height="32" viewBox="0 0 40 32" aria-hidden="true"><path d="M5 16h28M24 6l10 10-10 10" fill="none" stroke="${C.clay}" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></svg>`;
function beforeAfter(t,o={}){
 o=cmpOptions(o);const d=cmpDefaults.before,s=cmpStep(t,o),left=cmpSide(o.left,d.left,false),right=cmpSide(o.right,d.right,false);
 return shell('before-after',box(28,24,484,26,'前後對照',ty(18,C.amber,700))+cmpPanel(1,left,C.amber,false,28)+layer(cmpEnter(t,o,1),cmpArrow(),250,152,40,32)+cmpPanel(cmpEnter(t,o,2),right,C.sage,false,302)+layer(cmpEnter(t,o,3),esc(cmpShort(raw(o,'badge',d.badge),23)),28,286,484,44,ty(18,'#252118',700)+`box-sizing:border-box;padding:10px 18px;text-align:center;border-radius:12px;background:${C.lilac};white-space:nowrap;overflow:hidden`));
}
function dualCompare(t,o={}){
 o=cmpOptions(o);const d=cmpDefaults.dual,s=cmpStep(t,o),left=cmpSide(o.left,d.left,true),right=cmpSide(o.right,d.right,true),badge=cmpObject(o.badge)&&typeof o.badge.text==='string'&&typeof o.badge.sub==='string'?o.badge:d.badge;
 const badgeHTML=box(16,5,452,24,esc(cmpShort(badge.text,24)),ty(18,'#252118',700)+'text-align:center;white-space:nowrap;overflow:hidden')+box(16,29,452,20,esc(cmpShort(badge.sub,27)),ty(16,'#352e24',500)+'text-align:center;white-space:nowrap;overflow:hidden');
 return shell('dual-compare',box(28,24,484,26,'雙欄對比',ty(18,C.amber,700))+cmpPanel(1,left,C.clay,true,28)+cmpPanel(cmpEnter(t,o,1),right,C.lilac,true,302)+layer(cmpEnter(t,o,2),'+',250,151,40,40,ty(30,C.amber,500)+'text-align:center')+layer(cmpEnter(t,o,3),badgeHTML,28,286,484,52,`border-radius:12px;background:${C.sage};overflow:hidden`));
}

// Additional controlled cards; caller owns the narration clock.
const extraList=(v,d)=>Array.isArray(v)&&v.length>0&&Array.from(v).every(x=>typeof x==='string')?v:d;
const extraEnter=(t,o,j)=>o.step===undefined?clamp((phase(t)-(.05+(j-1)*.3))/.4):clamp(num(o,'step',0)-(j-1));
const prodColors=['amber','sage','clay','lilac'];
function productionLine(t,o={}){
 const count=clamp(Math.round(num(o,'count',4)),0,9999999),n=Math.min(5,count),first=count-n+1,colors=extraList(o.colors,prodColors),s=o.step===undefined?clamp((phase(t)-.08)/.4,0,n):clamp(num(o,'step',0),0,n);let tiles='';
 for(let i=0;i<n;i++){
  const c=color(colors[i%colors.length]),body=box(0,0,84,104,'',`border-radius:15px;border:1px solid ${c}99;background:linear-gradient(145deg,${c}88,${c}22);box-sizing:border-box`)+box(22,22,40,40,`<svg width="40" height="40" viewBox="0 0 40 40" aria-hidden="true"><circle cx="20" cy="20" r="18" fill="#28231dcc"/><path d="M16 12l13 8-13 8z" fill="${C.cream}"/></svg>`)+box(8,76,68,22,fitted(esc(String(first+i)),68),ty(16,C.cream,650)+'text-align:center');
  tiles+=layer(s-i,body,28+i*100,142,84,104);
 }
 return shell('production-line',box(28,24,484,27,'內容產線',ty(18,C.amber,700))+box(28,79,242,39,fitted(text(o,'label','內容整理'),208),ty(18,C.sage,650)+`box-sizing:border-box;padding:8px 16px;border:1px solid ${C.sage}55;border-radius:13px;background:${C.sage}12`)+tiles+box(28,283,484,42,fitted(text(o,'doneLabel','已完成')+' '+count.toLocaleString('en-US')+' 支',484),ty(28,C.cream,650))+(finite(o.count)===null?box(367,24,145,24,'示意資料',ty(16,'#c3b5a3',400)+'text-align:right'):''));
}
function renderQueue(t,o={}){
 const percent=clamp(num(o,'percent',64),0,100),done=clamp(Math.round(num(o,'done',3)),0,9999999),items=extraList(o.items,['片段甲','片段乙','片段丙']).slice(0,3);let tiles='';
 for(let i=0;i<items.length;i++){
  const named=Object.prototype.hasOwnProperty.call(C,items[i].toLowerCase()),c=named?color(items[i]):C[prodColors[i%4]],label=named?'項目 '+(i+1):items[i],body=box(0,0,74,112,'',`border-radius:14px;background:linear-gradient(150deg,${c}66,${c}11);border:1px solid ${c}99;box-sizing:border-box`)+box(17,23,40,40,cmpIcon('document',c))+box(5,82,64,22,esc(cmpShort(label,4)),ty(16,C.cream,600)+'white-space:nowrap;overflow:hidden;text-align:center');
  tiles+=layer(extraEnter(t,o,i+1),body,266+i*82,118,74,112);
 }
 const left=box(16,15,34,34,cmpIcon('chip',C.amber))+box(56,21,132,26,fitted(text(o,'status','處理中'),132),ty(18,C.cream,600))+box(18,61,172,42,r(percent)+'%',ty(32,C.amber,650))+box(18,114,172,12,box(0,0,r(172*percent/100),12,'',`background:${C.sage};border-radius:5px`),'border-radius:5px;background:#ffffff18;overflow:hidden')+box(18,137,172,24,'完成比例',ty(16,'#e2d6c5',400));
 return shell('render-queue',box(28,20,484,24,fitted(text(o,'kicker','QUEUE STATUS'),484),ty(16,C.amber,700)+'letter-spacing:1px')+box(28,51,484,33,fitted(text(o,'title','逐項整理與輸出'),484),ty(24,C.cream,650))+box(28,103,208,174,left,'background:#ffffff05;border:1px solid #75644c88;border-radius:17px;box-sizing:border-box')+tiles+layer(extraEnter(t,o,items.length+1),'已完成 '+done.toLocaleString('en-US'),266,285,246,39,ty(24,C.sage,650))+(finite(o.percent)===null||finite(o.done)===null?box(28,307,208,24,'含示意資料',ty(16,'#c3b5a3',400)):''));
}
function endCard(t,o={}){
 const b=ease(extraEnter(t,o,3));
 return shell('end-card',box(28,26,484,24,'END NOTES',ty(16,C.amber,700)+'letter-spacing:2px')+box(28,80,484,48,esc(cmpShort(raw(o,'left','內容整理'),14)),ty(32,C.cream,650)+'white-space:nowrap;overflow:hidden;text-align:center')+layer(extraEnter(t,o,1),'×',238,136,64,46,ty(32,C.clay,400)+'text-align:center')+layer(extraEnter(t,o,2),esc(cmpShort(raw(o,'right','清楚說明'),14)),28,185,484,48,ty(32,C.sage,650)+'white-space:nowrap;overflow:hidden;text-align:center')+layer(extraEnter(t,o,3),esc(cut(raw(o,'brand','示意名稱'),16)),28,264,484,30,ty(18,C.amber,650)+`letter-spacing:${r(10-6*b)}px;text-align:center;white-space:nowrap;overflow:hidden`)+layer(extraEnter(t,o,4),esc(cmpShort(raw(o,'note','內容整理與說明'),29)),28,310,484,24,ty(16,'#e2d6c5',400)+'text-align:center;white-space:nowrap;overflow:hidden'));
}
// Literal, longest-first matching; escaped text and allowlisted colour only.
function highlightWords(value,words,accent='amber'){
 const valueText=typeof value==='string'?value:'',valid=Array.isArray(words)&&Array.from(words).every(w=>typeof w==='string'),list=valid?[...new Set(words.filter(w=>w.length))].sort((a,b)=>b.length-a.length):[],v=typeof accent==='string'?accent:'amber',hl=/^#(?:[a-f\d]{3}|[a-f\d]{6}|[a-f\d]{8})$/i.test(v)?v:color(v);let out='';
 for(let i=0;i<valueText.length;){const found=list.find(w=>valueText.startsWith(w,i));if(found){out+=`<span class="ms-keyword" style="color:${hl};font-weight:700">${esc(found)}</span>`;i+=found.length;}else{const char=String.fromCodePoint(valueText.codePointAt(i));out+=esc(char);i+=char.length;}}
 return out;
}
window.highlightWords=highlightWords;

const entries=[['infocard-title','標題面板',title],['flywheel','循環飛輪圖',flywheel],['milestone-counter','里程碑計數卡',milestone],['before-after','前後對照卡',beforeAfter],['dual-compare','雙欄對比卡',dualCompare],['production-line','內容產線條',productionLine],['render-queue','渲染佇列卡',renderQueue],['end-card','結尾品牌卡',endCard]];
window.WALL5=entries.map(([id,name,fn])=>[(t,o)=>fn(t,o&&typeof o==='object'?o:{}),W,H]);window.WALL5_META=entries.map(([id,name])=>({id,name,width:W,height:H,period:3}));
window.WDATA=window.WDATA||{};const field=(type,desc,example)=>({type,desc,example});
window.WDATA['infocard-title']={base:{},fields:{kicker:field('文字','左上小標籤','CONTENT NOTES'),title:field('文字','面板主標題，長文以32px排列並省略過長部分','內容流程如何形成循環'),highlight:field('文字','主標要強調的詞；未找到時保留原標題','循環'),accent:field('顏色名','amber/sage/clay/lilac/cream，未知色名回amber','amber'),step:field('數字','0殼，1小標，2主標；小數代表下一層進場比例',0)}};
window.WDATA.flywheel={base:{},fields:{nodes:field('物件清單','2至6節點，label最多2字/sub最多4字；color選填，省略依序amber/sage/clay/lilac；錯型態整份回預設',defaults),title:field('文字','軌道中央文字','內容循環'),step:field('數字','已建節點數；小數依序進場，滿節點數後循環流動',0)}};
window.WDATA['milestone-counter']={base:{},fields:{value:field('數字','計數目標；內建1200僅示意資料',1200),suffix:field('文字','數字後綴，最多六字','+'),label:field('文字','計數說明','範例完成數'),segments:field('數字','色條段數2至24',12),chip:field('文字','step為1時才揭露的晶片文字','階段達成'),chipEnter:field('數字 0–1','選用的晶片進場比例，屬視覺參數；step須先到1',0),step:field('數字 0–1','計數與分段完成比例，1才揭露晶片',0)}};
Object.assign(window.WDATA,{"before-after": {"base": {}, "fields": {"left": {"type": "物件", "desc": "左卡 {title,desc,icon} 必須全為文字；任一錯型態整張左卡回預設。title 固定20px、約8全形字；desc 固定18px、最多3行，每行約9.5全形字，超長省略，不縮字。icon 白名單 document/chip/cloud，未知名稱回 document，不接受 HTML。", "example": {"title": "原始資料", "desc": "先保留內容，再逐項整理。", "icon": "document"}}, "right": {"type": "物件", "desc": "右卡 {title,desc,icon}，驗證與截斷規則同 left；錯型態整張右卡回預設，step 到2才完整顯示。", "example": {"title": "整理結果", "desc": "把重點排好，方便接續閱讀。", "icon": "chip"}}, "badge": {"type": "文字", "desc": "step 到3才完整顯示的徽章；固定18px、最多約23全形字，超長省略。錯型態回中性預設。", "example": "新的整理方式"}, "step": {"type": "數字", "desc": "0左卡、1箭頭、2右卡、3徽章；0–3，接受數字字串，越界夾限，小數控制下一層的遮罩與位移進場，不縮放文字。固定step不受t影響；只有未提供或undefined時使用period:3示範（每層約0.4秒）；已提供但無效的值固定回0，不啟用demo。", "example": 2}}}, "dual-compare": {"base": {}, "fields": {"left": {"type": "物件", "desc": "左卡 {title,desc,icon,chips}：前三項必須為文字，chips為文字清單（可空）；任一錯型態整張卡回預設。title固定20px、約8全形字；desc固定18px、最多2行，每行約9.5全形字；chips僅顯示前2項，每項固定16px、約3.75全形字。超長文字省略，不縮字。icon白名單document/chip/cloud，未知名稱回document，不接受HTML。", "example": {"title": "資料端", "desc": "保留來源與必要脈絡。", "icon": "cloud", "chips": ["來源 A", "來源 B"]}}, "right": {"type": "物件", "desc": "右卡 {title,desc,icon,chips}，驗證、清單及省略規則同left；錯型態整張右卡回預設；step到1才完整顯示。", "example": {"title": "處理端", "desc": "整理內容與呈現重點。", "icon": "chip", "chips": ["整理", "檢查"]}}, "badge": {"type": "物件", "desc": "{text,sub} 兩項都必須為文字；任一錯型態整個徽章回預設。step到3完整顯示；text固定18px約24全形字、sub固定16px約27全形字，超長單行省略。", "example": {"text": "協作示意", "sub": "兩側各自保留清楚角色"}}, "step": {"type": "數字", "desc": "0左卡、1右卡、2加號連接、3底部徽章；接受數字字串並夾限0–3，小數控制下一層的遮罩與位移，不縮放文字。固定step不受t影響；只有未提供或undefined才使用period:3 demo（每層約0.4秒）；已提供但無效的值固定回0。", "example": 3}}}, "production-line": {"base": {}, "fields": {"count": {"type": "數字", "desc": "已完成總數，0至9999999；卡片僅展示最後五項，數字不假增量", "example": 4}, "label": {"type": "文字", "desc": "上方懸浮標籤", "example": "內容整理"}, "doneLabel": {"type": "文字", "desc": "底部完成數的文字前綴", "example": "已完成"}, "colors": {"type": "顏色名清單", "desc": "縮圖輪替色名，至少一項，錯型態整份退預設；未知色名退amber", "example": ["amber", "sage", "clay", "lilac"]}, "step": {"type": "數字", "desc": "0無縮圖，1至5依序揭露；總數少於5時上限為總數。只未傳才示範", "example": 0}}}, "render-queue": {"base": {}, "fields": {"percent": {"type": "數字", "desc": "實際完成百分比0至100，接受數字字串", "example": 64}, "status": {"type": "文字", "desc": "左側狀態，過長省略", "example": "處理中"}, "done": {"type": "數字", "desc": "實際已完成總數，0至9999999，不自行增加", "example": 3}, "items": {"type": "文字或顏色清單", "desc": "右側清單最多呈現前三項，空或錯型態回預設；合法色名顯示彩色縮圖，其他字串作標籤", "example": ["片段甲", "片段乙", "片段丙"]}, "kicker": {"type": "文字", "desc": "上方小標，16px", "example": "QUEUE STATUS"}, "title": {"type": "文字", "desc": "主標，24px，長文省略", "example": "逐項整理與輸出"}, "step": {"type": "數字", "desc": "0左狀態；1至N依序亮起縮圖；N+1揭露已完成數。沒傳才示範", "example": 0}}}, "end-card": {"base": {}, "fields": {"left": {"type": "文字", "desc": "第一行主題，32px，長文省略", "example": "內容整理"}, "right": {"type": "文字", "desc": "第二行主題，32px，長文省略", "example": "清楚說明"}, "brand": {"type": "文字", "desc": "品牌或署名，最多16字，字距收攏，不縮字", "example": "示意名稱"}, "note": {"type": "文字", "desc": "底部註腳，16px，長文省略", "example": "內容整理與說明"}, "step": {"type": "數字", "desc": "0首行，1乘號，2第二行，3署名字距收攏，4註腳；小數插值，未傳才示範", "example": 0}}}});
})();
