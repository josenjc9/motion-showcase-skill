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
const nodesOf=a=>Array.isArray(a)&&a.length>=2&&a.length<=6&&Array.from(a).every(q=>q&&typeof q==='object'&&!Array.isArray(q)&&typeof q.label==='string'&&typeof q.sub==='string'&&typeof q.color==='string')?a:defaults;
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
const entries=[['infocard-title','標題面板',title],['flywheel','循環飛輪圖',flywheel],['milestone-counter','里程碑計數卡',milestone]];
window.WALL5=entries.map(([id,name,fn])=>[(t,o)=>fn(t,o&&typeof o==='object'?o:{}),W,H]);window.WALL5_META=entries.map(([id,name])=>({id,name,width:W,height:H,period:3}));
window.WDATA=window.WDATA||{};const field=(type,desc,example)=>({type,desc,example});
window.WDATA['infocard-title']={base:{},fields:{kicker:field('文字','左上小標籤','CONTENT NOTES'),title:field('文字','面板主標題，長文以32px排列並省略過長部分','內容流程如何形成循環'),highlight:field('文字','主標要強調的詞；未找到時保留原標題','循環'),accent:field('顏色名','amber/sage/clay/lilac/cream，未知色名回amber','amber'),step:field('數字','0殼，1小標，2主標；小數代表下一層進場比例',0)}};
window.WDATA.flywheel={base:{},fields:{nodes:field('物件清單','2至6節點，label最多2字/sub最多4字/color色名；錯型態整份回預設',defaults),title:field('文字','軌道中央文字','內容循環'),step:field('數字','已建節點數；小數依序進場，滿節點數後循環流動',0)}};
window.WDATA['milestone-counter']={base:{},fields:{value:field('數字','計數目標；內建1200僅示意資料',1200),suffix:field('文字','數字後綴，最多六字','+'),label:field('文字','計數說明','範例完成數'),segments:field('數字','色條段數2至24',12),chip:field('文字','step為1時才揭露的晶片文字','階段達成'),chipEnter:field('數字 0–1','選用的晶片進場比例，屬視覺參數；step須先到1',0),step:field('數字 0–1','計數與分段完成比例，1才揭露晶片',0)}};
})();
