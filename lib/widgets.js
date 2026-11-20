// 動態元件庫（我們自己的即時動態小卡）：每個元件 W.x(t, o) 回傳 HTML 字串，只依時間 t（秒）決定畫面，可逐幀渲染
// 質感照參考：純黑圓角卡、細邊、大數字、每類一個主色；內容換成主隊與剪輯
(function(){
const C={blue:'#5aa9ff',green:'#7ee06a',red:'#ff5a4e',coral:'#ff7a59',yellow:'#ffc94a',purple:'#a78bfa',pink:'#ff6fae',orange:'#ff8a3d',white:'#f5f5f7',dim:'#8e8e93',dim2:'#48484a'};
const F='-apple-system,"SF Pro Display","PingFang TC",sans-serif';
const c01=t=>t<0?0:t>1?1:t,eo=t=>1-Math.pow(1-t,3),sm=t=>t*t*(3-2*t);
const rnd=s=>{const x=Math.sin(s*127.1+311.7)*43758.5453;return x-Math.floor(x)};
const ab=(x,y,w,h,st='')=>`position:absolute;left:${x}px;top:${y}px;width:${w}px;height:${h}px;${st}`;
function card(w,h,inner,o={}){const r=o.r??Math.min(40,h*.32);return `<div style="position:relative;width:${w}px;height:${h}px;border-radius:${r}px;background:${o.bg||'linear-gradient(180deg,#141416,#0b0b0c)'};box-shadow:inset 0 0 0 1.5px #ffffff14,0 18px 40px #0000004d;overflow:hidden;font-family:${F};color:${C.white};font-variant-numeric:tabular-nums">${inner}</div>`}
const tx=(x,y,s,txt,col=C.white,wt=600,extra='')=>`<div style="${ab(x,y,'auto','auto',`font-size:${s}px;font-weight:${wt};color:${col};white-space:nowrap;line-height:1.1;letter-spacing:${s>40?-.5:0}px;${extra}`)}">${txt}</div>`;
const ico={bolt:(c,s)=>`<svg width="${s}" height="${s}" viewBox="0 0 100 100"><path fill="${c}" d="M58 6 22 56h24l-6 38 38-52H54z"/></svg>`,
 heart:(c,s)=>`<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path fill="${c}" d="M12 21s-7.5-4.6-9.6-9.2C.9 8.4 3 4.5 6.7 4.5c2.1 0 3.6 1.2 5.3 3.1 1.7-1.9 3.2-3.1 5.3-3.1 3.7 0 5.8 3.9 4.3 7.3C19.5 16.4 12 21 12 21z"/></svg>`,
 drop:(c,s)=>`<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path fill="${c}" d="M12 2C9 7 5 10.5 5 15a7 7 0 0014 0c0-4.5-4-8-7-13z"/></svg>`,
 bolt:(c,s)=>`<svg width="${s}" height="${s}" viewBox="0 0 24 24"><path fill="${c}" d="M13 2L4 14h6l-1 8 9-12h-6z"/></svg>`,
 film:(c,s)=>`<svg width="${s}" height="${s}" viewBox="0 0 24 24"><rect x="3" y="5" width="18" height="14" rx="3" fill="none" stroke="${c}" stroke-width="2.4"/><path d="M10 9l5 3-5 3z" fill="${c}"/></svg>`,
 yarn:(c,s)=>`<svg width="${s}" height="${s}" viewBox="0 0 24 24"><circle cx="12" cy="12" r="9" fill="none" stroke="${c}" stroke-width="2.2"/><path d="M5 9c4 1 9 4 13 9M4 14c5-1 10 1 13 5M9 3.5c2 4 6 9 12 9.5" fill="none" stroke="${c}" stroke-width="1.6"/></svg>`};
const W={};
// 1 小膠囊：圖示＋數值（數字滾動）
W.pill=(t,o={})=>{const w=o.w||250,h=o.h||96;const col=C[o.col||'blue'];const v=o.fmt?o.fmt(t):o.val;
 return card(w,h,`<div style="${ab(26,h/2-21,42,42)}">${(ico[o.icon||'bolt'])(col,42)}</div>${tx(84,h/2-26,46,`${v}<span style="font-size:24px;color:${col};margin-left:4px">${o.unit||''}</span>`,col,700)}`,{r:h/2})};
// 2 比分：LIVE 主隊 2–1 客隊
W.score=(t,o={})=>{const w=480,h=210;const s2=t%4>1.6?2:1;const pulse=.5+.5*Math.sin(t*6);
 return card(w,h,`<div style="${ab(28,24,10,10,`border-radius:50%;background:${C.red};opacity:${pulse}`)}"></div>${tx(46,18,22,'LIVE',C.red,700)}${tx(w-120,18,22,'第 '+(1+Math.floor(t%9))+" 回合",C.dim,500)}
 <div style="${ab(28,66,56,56,'border-radius:50%;background:#2c2c2e;display:flex;align-items:center;justify-content:center')}">${ico.bolt(C.white,32)}</div>${tx(28,128,24,'主隊',C.white,600)}
 ${tx(0,60,80,`<div style="width:${w}px;text-align:center">${s2}<span style="color:${C.dim2}"> – </span>1</div>`,C.white,700)}
 <div style="${ab(w-84,66,56,56,'border-radius:50%;background:'+C.red+';display:flex;align-items:center;justify-content:center')}">${ico.yarn('#fff',34)}</div>${tx(w-112,128,24,'客隊',C.white,600)}
 <div style="${ab(28,166,190,6,'border-radius:3px;background:#fff')}"></div><div style="${ab(w-218,166,190,6,'border-radius:3px;background:'+C.red)}"></div>`)};
// 3 跳躍軌跡：起點 → 終點 弧線，掌印沿弧線飛
W.arc=(t,o={})=>{const w=480,h=220;const p=(t*.45)%1;const P=(u)=>{const x=60+u*360,y=150-Math.sin(Math.PI*u)*90;return [x,y]};let d='M'+P(0).join(' ');for(let i=1;i<=40;i++)d+=' L'+P(i/40).join(' ');const [px,py]=P(p);
 return card(w,h,`${tx(28,22,22,'跳躍 #482',C.dim,500)}<div style="${ab(w-150,18,124,34,`border-radius:10px;background:${C.blue}22;color:${C.blue};font-size:20px;font-weight:700;display:flex;align-items:center;justify-content:center`)}">滯空 0.8s</div>
 <svg style="${ab(0,0,w,h)}" viewBox="0 0 ${w} ${h}"><path d="${d}" fill="none" stroke="${C.dim2}" stroke-width="3" stroke-dasharray="4 8"/><path d="${d}" fill="none" stroke="${C.blue}" stroke-width="4" pathLength="1" stroke-dasharray="${p} 1"/><circle cx="60" cy="150" r="7" fill="${C.blue}"/></svg>
 <div style="${ab(px-18,py-18,36,36)}">${ico.bolt(C.white,36)}</div>${tx(28,166,38,'起點',C.white,700)}${tx(w-150,166,38,'終點',C.white,700)}`)};
// 4 進度點：渲染中 第 N／5 步
W.steps=(t,o={})=>{const w=480,h=200;const steps=o.steps||['腳本','素材','分鏡','剪輯','檢查'];const p=((t*.35)%1.15);const k=Math.min(steps.length-1,Math.floor(p*steps.length));
 let dots='';steps.forEach((s,i)=>{const x=40+i*(400/(steps.length-1));const on=i<=k;dots+=`<div style="${ab(x-20,106,40,40,`border-radius:50%;background:${on?C.orange:'#2c2c2e'};box-shadow:${i===k?'0 0 0 6px '+C.orange+'44':'none'}`)}"></div>`});
 return card(w,h,`${tx(28,22,22,'訂單 #2025',C.dim,500)}${tx(w-160,22,22,`預計 <b style="color:${C.orange}">0:${String(65-Math.floor(t*3)%60).padStart(2,'0')}</b>`,C.dim,500)}${tx(28,52,36,'渲染中・'+steps[k],C.white,700)}
 <div style="${ab(40,124,400,5,'border-radius:3px;background:#2c2c2e')}"></div><div style="${ab(40,124,400*Math.min(1,p),5,'border-radius:3px;background:'+C.orange)}"></div>${dots}`)};
// 5 通話：錄音中 + 綠色聲波 + 紅色掛斷
W.call=(t,o={})=>{const w=480,h=120;let b='';for(let i=0;i<7;i++){const hh=10+Math.abs(Math.sin(t*9+i*1.3))*44;b+=`<div style="${ab(250+i*14,h/2-hh/2,7,hh,'border-radius:4px;background:'+C.green)}"></div>`}
 return card(w,h,`<div style="${ab(24,24,72,72,`border-radius:50%;background:linear-gradient(135deg,#ff9d7a,#ff5a4e);display:flex;align-items:center;justify-content:center;font-size:32px;font-weight:700`)}">主隊</div>${tx(112,28,30,o.name||'錄音中',C.white,700)}${tx(112,68,22,'0:'+String(4+Math.floor(t)).padStart(2,'0'),C.dim,500)}${b}<div style="${ab(w-96,24,72,72,'border-radius:50%;background:'+C.red+';display:flex;align-items:center;justify-content:center')}"><svg width="34" height="34" viewBox="0 0 24 24"><path fill="#fff" d="M3 14c5-5 13-5 18 0l-2.5 2.5-3.5-1.5v-2.5c-2-.7-4-.7-6 0V15l-3.5 1.5z"/></svg></div>`,{r:60})};
// 6 音樂：封面漸層＋歌名＋跳動長條
W.music=(t,o={})=>{const w=480,h=150;let b='';for(let i=0;i<5;i++){const hh=10+Math.abs(Math.sin(t*7+i*1.9))*40;b+=`<div style="${ab(w-110+i*15,h/2+24-hh,8,hh,'border-radius:3px;background:'+C.pink)}"></div>`}
 return card(w,h,`<div style="${ab(24,24,102,102,`border-radius:22px;background:linear-gradient(${135+t*30}deg,#ff9d6c,#ff4f8b 60%,#8b5cf6)`)}"></div>${tx(146,36,34,o.title||'Night Drive',C.white,700)}${tx(146,82,24,o.sub||'Suno・Studio',C.dim,500)}${b}
 <div style="${ab(146,124,200,4,'border-radius:2px;background:#2c2c2e')}"></div><div style="${ab(146,124,200*((t*.12)%1),4,'border-radius:2px;background:#fff')}"></div>`)};
// 7 跑步：大數字＋綠色長條圖長出來
W.run=(t,o={})=>{const w=480,h=260;let b='';const N=26;for(let i=0;i<N;i++){const g=c01(t*1.6-i*.04);const hh=(20+rnd(i)*60+Math.sin(i*.6)*20)*eo(g);b+=`<div style="${ab(28+i*16.5,210-hh,10,hh,'border-radius:3px;background:'+(i%5===3?C.green:'#5fbf4f'))}"></div>`}
 return card(w,h,`<div style="${ab(24,24,52,52,`border-radius:14px;background:${C.green}22;display:flex;align-items:center;justify-content:center`)}">${ico.bolt(C.green,30)}</div>${tx(90,24,22,'晨跑',C.dim,500)}${tx(90,50,28,'0:'+String(12+Math.floor(t*2)%48).padStart(2,'0'),C.white,700)}${tx(w-200,22,64,(1.2+t*.73).toFixed(2)+'<span style="font-size:26px"> 圈</span>',C.green,700)}${b}${tx(28,222,22,`${ico.heart(C.red,20)} ${150+Math.floor(Math.sin(t*3)*6)} bpm`,C.red,600)}`)};
// 8 長條預報：觀看數 N 分鐘後爆發（藍色長條）
W.rain=(t,o={})=>{const w=480,h=240;let b='';const N=30;for(let i=0;i<N;i++){const g=c01(t*1.4-i*.03);const hh=(i<8?6+i*2:20+Math.pow((i-8)/22,1.4)*100+rnd(i)*20)*eo(g);b+=`<div style="${ab(28+i*14.2,190-hh,8,hh,'border-radius:3px;background:linear-gradient('+C.blue+',#2f6fd1)')}"></div>`}
 return card(w,h,`${tx(28,22,32,`${ico.drop(C.blue,26)} ${o.title||'觀看數 12 分鐘後爆發'}`,C.white,700)}${tx(w-90,26,24,Math.min(99,Math.floor(40+t*14))+'%',C.dim,500)}${b}${tx(28,202,20,'現在',C.dim,500)}${tx(160,202,20,'15 分',C.dim,500)}${tx(290,202,20,'30 分',C.dim,500)}${tx(410,202,20,'45 分',C.dim,500)}`)};
// 9 計時器：黃色圓環倒數＋按鈕
W.timer=(t,o={})=>{const w=480,h=230;const tot=451-Math.floor(t);const m=Math.floor(tot/60),s=tot%60;const p=(t*.08)%1;const r=30,cf=2*Math.PI*r;
 return card(w,h,`<svg style="${ab(24,22,76,76)}" viewBox="0 0 76 76"><circle cx="38" cy="38" r="${r}" fill="none" stroke="${C.yellow}33" stroke-width="8"/><circle cx="38" cy="38" r="${r}" fill="none" stroke="${C.yellow}" stroke-width="8" stroke-linecap="round" stroke-dasharray="${cf*(1-p)} ${cf}" transform="rotate(-90 38 38)"/></svg>${tx(116,40,34,o.title||'烤吐司',C.white,700)}${tx(w-200,26,72,`${m}:${String(s).padStart(2,'0')}`,C.yellow,700)}
 <div style="${ab(24,134,210,72,`border-radius:36px;background:${C.yellow}2a;color:${C.yellow};font-size:28px;font-weight:700;display:flex;align-items:center;justify-content:center`)}">❚❚ 暫停</div><div style="${ab(250,134,206,72,'border-radius:36px;background:#2c2c2e;font-size:28px;font-weight:700;display:flex;align-items:center;justify-content:center')}">＋1 分</div>`)};
// 10 呼吸：紫色圓脈動
W.breathe=(t,o={})=>{const w=480,h=150;const b=.5+.5*Math.sin(t*1.6);const lab=Math.sin(t*1.6)>0?'吸氣':'吐氣';
 return card(w,h,`<div style="${ab(40,35,80,80,'display:flex;align-items:center;justify-content:center')}"><div style="width:${40+40*b}px;height:${40+40*b}px;border-radius:50%;background:radial-gradient(circle,${C.purple},#5b3fd1);box-shadow:0 0 ${30*b}px ${C.purple}"></div></div>${tx(146,34,22,'第 5／6 輪',C.dim,500)}${tx(146,64,44,lab,C.purple,700)}${tx(w-110,56,40,'2:'+String(30+Math.floor(t)%30).padStart(2,'0'),C.purple,600)}`)};
// 11 時間碼：REC＋跑動的 timecode
W.tc=(t,o={})=>{const w=480,h=120;const T=32*60+15+t;const ff=Math.floor((T%1)*30);const hh=Math.floor(T/3600),mm=Math.floor(T/60)%60,ss=Math.floor(T)%60;const on=Math.floor(t*2)%2===0;
 return card(w,h,`<div style="${ab(30,46,26,26,`border-radius:50%;background:${C.red};opacity:${on?1:.25}`)}"></div>${tx(68,42,30,'REC',C.red,700)}${tx(150,30,54,`${String(hh).padStart(2,'0')}:${String(mm).padStart(2,'0')}:${String(ss).padStart(2,'0')}<span style="color:${C.dim}">:${String(ff).padStart(2,'0')}</span>`,C.white,600,'font-family:"SF Mono",Menlo,monospace')}`,{r:60})};
// 12 打字：對話泡泡，三點→字
W.chat=(t,o={})=>{const w=480,h=150;const str=o.text||'哈囉～錄音中！過來～';const p=(t*.5)%1.4;const n=Math.floor(c01((p-.35)/.7)*str.length);let dots='';for(let i=0;i<3;i++)dots+=`<div style="${ab(150+i*22,92,13,13,`border-radius:50%;background:${C.dim};opacity:${.3+.7*Math.abs(Math.sin(t*6-i))}`)}"></div>`;
 return card(w,h,`<div style="${ab(24,30,60,60,'border-radius:50%;background:#2c2c2e;display:flex;align-items:center;justify-content:center')}">${ico.bolt(C.white,34)}</div>${tx(100,22,22,'訊息',C.dim,500)}<div style="${ab(100,58,356,70,'border-radius:22px 22px 22px 6px;background:#2c2c2e')}"></div>${p<.35?dots:tx(120,74,30,str.slice(0,n)+(n<str.length?'<span style="color:'+C.blue+'">|</span>':''),C.white,600)}`)};
// 13 生成環：H3 生成中 N%
W.ring=(t,o={})=>{const w=230,h=230;const p=c01((t*.22)%1.1);const r=72,cf=2*Math.PI*r;
 return card(w,h,`<svg style="${ab(23,23,184,184)}" viewBox="0 0 184 184"><circle cx="92" cy="92" r="${r}" fill="none" stroke="#2c2c2e" stroke-width="14"/><circle cx="92" cy="92" r="${r}" fill="none" stroke="${C[o.col||'green']}" stroke-width="14" stroke-linecap="round" stroke-dasharray="${cf*p} ${cf}" transform="rotate(-90 92 92)"/></svg>${tx(0,76,48,`<div style="width:${w}px;text-align:center">${Math.floor(p*100)}<span style="font-size:24px">%</span></div>`,C.white,700)}${tx(0,136,20,`<div style="width:${w}px;text-align:center">${o.label||'H3 生成中'}</div>`,C.dim,500)}`)};
// 14 等化器：多條音量
W.eq=(t,o={})=>{const w=480,h=200;let b='';for(let i=0;i<12;i++){const v=.2+.8*Math.abs(Math.sin(t*(2+i*.37)+i));const seg=Math.round(v*9);for(let k=0;k<9;k++)b+=`<div style="${ab(30+i*36,160-k*14,26,9,`border-radius:3px;background:${k<seg?(k>6?C.red:k>4?C.yellow:C.green):'#2c2c2e'}`)}"></div>`}
 return card(w,h,`${tx(30,20,22,'混音・音效軌',C.dim,500)}${b}`)};
// 15 折線圖：線畫出來＋漸層填色
W.line=(t,o={})=>{const w=480,h=230;const p=c01((t*.4)%1.2);const pts=[];for(let i=0;i<=30;i++){pts.push([28+i*14.2,180-(Math.sin(i*.45)*30+i*2.6+rnd(i)*14)])}const n=Math.max(2,Math.floor(p*30)+1);const d='M'+pts.slice(0,n).map(q=>q.join(' ')).join(' L');const last=pts[n-1];
 return card(w,h,`${tx(28,20,22,o.title||'互動累積',C.dim,500)}${tx(28,48,52,`${Math.floor(p*42)}<span style="font-size:24px;color:${C.coral}"> ↑</span>`,C.white,700)}<svg style="${ab(0,0,w,h)}" viewBox="0 0 ${w} ${h}"><defs><linearGradient id="lg${o.id||0}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${C.coral}" stop-opacity=".45"/><stop offset="1" stop-color="${C.coral}" stop-opacity="0"/></linearGradient></defs><path d="${d} L${last[0]} 210 L28 210 Z" fill="url(#lg${o.id||0})"/><path d="${d}" fill="none" stroke="${C.coral}" stroke-width="4" stroke-linejoin="round"/><circle cx="${last[0]}" cy="${last[1]}" r="8" fill="${C.coral}" stroke="#0b0b0c" stroke-width="3"/></svg>`)};
// 16 開關清單
W.toggles=(t,o={})=>{const w=480,h=230;const items=o.items||['動態模糊','顆粒','漏光'];let s='';items.forEach((it,i)=>{const on=((t*.6+i*.33)%2)>1;const k=c01((((t*.6+i*.33)%1))*4);const x=on?k:1-k;
 s+=`${tx(30,30+i*64,30,it,C.white,600)}<div style="${ab(w-120,24+i*64,90,48,`border-radius:24px;background:${on?C.green:'#3a3a3c'}`)}"><div style="${ab(4+38*(on?k:1-k),4,40,40,'border-radius:50%;background:#fff;box-shadow:0 2px 6px #0006')}"></div></div>`});return card(w,h,s)};
// 17 天氣式大數字＋圖示（小卡）
W.stat=(t,o={})=>{const w=230,h=230;const col=C[o.col||'orange'];return card(w,h,`<div style="${ab(24,24,44,44)}">${(ico[o.icon||'bolt'])(col,44)}</div>${tx(24,90,64,o.fmt?o.fmt(t):o.val,C.white,700)}${tx(24,170,22,o.label||'',C.dim,500)}`)};
window.WG=W;window.WC=C;window.wcard=card;
// 牆用的元件清單：(t)=>HTML，尺寸固定
window.WALL=[
 [t=>W.pill(t,{icon:'bolt',col:'orange',fmt:t=>'×'+(12+Math.floor(t*3)%30)}),250,96],
 [t=>W.score(t),480,210],
 [t=>W.pill(t,{icon:'heart',col:'red',fmt:t=>144+Math.floor(Math.sin(t*4)*5),unit:'bpm'}),250,96],
 [t=>W.arc(t),480,220],
 [t=>W.pill(t,{icon:'film',col:'blue',fmt:t=>'0:'+String(27-Math.floor(t)%27).padStart(2,'0')}),250,96],
 [t=>W.steps(t),480,200],
 [t=>W.call(t),480,120],
 [t=>W.pill(t,{icon:'bolt',col:'green',fmt:t=>(60+Math.floor(t*4)%40)+'%'}),250,96],
 [t=>W.music(t),480,150],
 [t=>W.run(t),480,260],
 [t=>W.pill(t,{icon:'drop',col:'blue',fmt:t=>(9+Math.floor(t)%5),unit:'m'}),250,96],
 [t=>W.rain(t),480,240],
 [t=>W.timer(t),480,230],
 [t=>W.breathe(t),480,150],
 [t=>W.tc(t),480,120],
 [t=>W.chat(t),480,150],
 [t=>W.ring(t,{col:'green'}),230,230],
 [t=>W.eq(t),480,200],
 [t=>W.line(t,{id:1}),480,230],
 [t=>W.toggles(t),480,230],
 [t=>W.stat(t,{icon:'yarn',col:'coral',val:'42',label:'動態'}),230,230],
 [t=>W.pill(t,{icon:'yarn',col:'yellow',fmt:t=>'2h '+(40+Math.floor(t)%20)+'m'}),250,96],
 [t=>W.ring(t+2,{col:'purple',label:'去背中'}),230,230],
 [t=>W.stat(t,{icon:'film',col:'blue',fmt:t=>Math.floor(1962*Math.min(1,t*.3))+'',label:'已渲染幀'}),230,230],
];
})();
