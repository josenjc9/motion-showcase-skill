// motion-showcase core: 把畫面組成 HTML 字串，逐幀由時間 t（秒）決定。1080x1920。
// 用法見 README。所有函式都是全域，載入順序：widgets*.js → motion.js
const FPS=30;
const c01=t=>t<0?0:t>1?1:t,seg=(t,a,b)=>c01((t-a)/(b-a)),sm=t=>t*t*(3-2*t),eo=t=>1-Math.pow(1-t,3),ei=t=>t*t*t,lerp=(a,b,t)=>a+(b-a)*t;
const back=t=>{const c=1.70158;return 1+(c+1)*Math.pow(t-1,3)+c*Math.pow(t-1,2)};
const rnd=s=>{const x=Math.sin(s*127.1+311.7)*43758.5453;return x-Math.floor(x)};const pad=n=>String(n).padStart(2,'0');
let html='',GT=0;const P=s=>html+=s;const cap=fn=>{const b=html;html='';fn();const r=html;html=b;return r};
const COLW=250,GAPW=22,NCOL=16;
const WL=(()=>{const items=[];for(let c=0;c<NCOL;c++){let y=-rnd(c)*200;let k=Math.floor(rnd(c*7)*WALL.length);while(y<4200){const [fn,w,h]=WALL[k%WALL.length];const sc=w>300?.5:w>240&&h<100?.48:.52;
   if(w>240&&h<100){items.push({c,x:c*(COLW+GAPW),y,k:k%WALL.length,sc,w,h});items.push({c,x:c*(COLW+GAPW)+128,y,k:(k+5)%WALL.length,sc,w:WALL[(k+5)%WALL.length][1],h:WALL[(k+5)%WALL.length][2],pillPair:1});y+=h*sc+GAPW}
   else{items.push({c,x:c*(COLW+GAPW),y,k:k%WALL.length,sc,w,h});y+=h*sc+GAPW}k+=3+Math.floor(rnd(k+c)*5)}}
 return items.filter(it=>!(it.pillPair&&WALL[it.k][1]>240&&WALL[it.k][2]>=100))})();
const WCX=NCOL*(COLW+GAPW)/2,WCY=2100;
// cam: {x,y,z} 世界座標中心與縮放；o.hi 亮起的元件 index；o.dark 背景
function wall(cam,o={}){const z=cam.z;let s='';const t=GT;
 WL.forEach((it,i)=>{const sx=540+(it.x-cam.x)*z,sy=960+(it.y-cam.y)*z+Math.sin(t*.8+it.c)*6*z,w=it.w*it.sc*z,h=it.h*it.sc*z;if(sx>1100||sy>1940||sx+w<-20||sy+h<-20)return;
  const age=o.reveal?c01((o.reveal-Math.hypot(it.x-o.rx,it.y-o.ry))/260):1;if(age<=0)return;
  const hi=o.hi&&o.hi.includes(i);
  s+=`<div class="wg" style="left:${sx}px;top:${sy}px;width:${it.w}px;height:${it.h}px;transform-origin:0 0;transform:scale(${it.sc*z*(.7+.3*eo(age))});opacity:${eo(age)*(o.op??1)};${hi?'filter:drop-shadow(0 0 30px #ff8a3d)':''}">${WALL[it.k][0](t+i*.37)}</div>`});
 P(`<div style="left:0;top:0;width:1080px;height:1920px;background:${o.bg||'radial-gradient(ellipse at 50% 40%,#f6f1e7,#e6ddcc)'}"></div>`+s)}
const wallPick=(cam,sx,sy)=>{let best=0,bd=1e9;WL.forEach((it,i)=>{const x=540+(it.x-cam.x)*cam.z+it.w*it.sc*cam.z/2,y=960+(it.y-cam.y)*cam.z+it.h*it.sc*cam.z/2;const d=Math.hypot(x-sx,y-sy);if(d<bd){bd=d;best=i}});return best};
const full=s=>`<div style="left:0;top:0;width:1080px;height:1920px;${s}"></div>`;
const box=(inner,s='')=>`<div style="left:0;top:0;width:1080px;height:1920px;${s}">${inner}</div>`;
const slices=(inner,GX,GY,fnT)=>{const bw=1080/GX,bh=1920/GY;let s='';for(let j=0;j<GY;j++)for(let i=0;i<GX;i++){const k=j*GX+i;const tr=fnT(k,i,j,i*bw+bw/2,j*bh+bh/2);if(tr===null)continue;s+=`<div style="left:0;top:0;width:1080px;height:1920px;transform-origin:${i*bw+bw/2}px ${j*bh+bh/2}px;transform:${tr.t};${tr.f?'filter:'+tr.f:''}"><div style="left:0;top:0;width:1080px;height:1920px;clip-path:inset(${j*bh}px ${1080-(i+1)*bw}px ${1920-(j+1)*bh}px ${i*bw}px)">${tr.inner||inner}</div></div>`}return s};
const SHARDS=(()=>{const gx=5,gy=8,pt=[];for(let j=0;j<=gy;j++)for(let i=0;i<=gx;i++){const ex=i===0||i===gx,ey=j===0||j===gy;pt.push([i/gx*1080+(ex?0:(rnd(i*31+j)-.5)*150),j/gy*1920+(ey?0:(rnd(i+j*17)-.5)*180)])}
 const Q=(i,j)=>pt[j*(gx+1)+i],o=[];for(let j=0;j<gy;j++)for(let i=0;i<gx;i++){const a=Q(i,j),b=Q(i+1,j),c=Q(i+1,j+1),d=Q(i,j+1);if((i+j)%2){o.push([a,b,c]);o.push([a,c,d])}else{o.push([a,b,d]);o.push([b,c,d])}}return o})();
const grain=(a,seed)=>`<svg width="1080" height="1920" style="left:0;top:0;opacity:${a};mix-blend-mode:multiply"><filter id="g${seed}"><feTurbulence type="fractalNoise" baseFrequency=".9" numOctaves="2" seed="${seed}"/><feColorMatrix type="saturate" values="0"/></filter><rect width="1080" height="1920" filter="url(#g${seed})"/></svg>`;
const camAt=(dx,dy,z)=>({x:WCX+dx,y:WCY+dy,z});
const TRX={
 ink:(A,B,p)=>{let pts=[];const R=lerp(10,1500,ei(p));for(let i=0;i<90;i++){const a=i/90*6.283,n=1+.22*Math.sin(a*5+1)+.12*Math.sin(a*11+2)+.07*Math.sin(a*23);pts.push(`${540+Math.cos(a)*R*n}px ${960+Math.sin(a)*R*n}px`)}return A+`<div style="left:0;top:0;width:1080px;height:1920px;clip-path:polygon(${pts.join(',')})">${B}</div>`},
 blinds:(A,B,p)=>{let s=A;const N=12,h=1920/N;for(let k=0;k<N;k++){const u=eo(c01(p*1.6-k*.05));if(u<=0)continue;s+=`<div style="left:0;top:0;width:1080px;height:1920px;clip-path:inset(${k*h+h*(1-u)/2}px 0 ${1920-(k+1)*h+h*(1-u)/2}px 0)">${B}</div>`}return s},
 vblinds:(A,B,p)=>{let s=A;const N=9,w=1080/N;for(let k=0;k<N;k++){const u=eo(c01(p*1.6-k*.06));if(u<=0)continue;s+=`<div style="left:0;top:0;width:1080px;height:1920px;clip-path:inset(0 ${1080-k*w-w*u}px 0 ${k*w}px)">${B}</div>`}return s},
 whip:(A,B,p)=>{const u=ei(p);return `<div style="left:0;top:0;width:1080px;height:1920px;transform:translateX(${-u*1080}px);filter:blur(${Math.sin(p*Math.PI)*30}px)">${A}</div><div style="left:0;top:0;width:1080px;height:1920px;transform:translateX(${(1-u)*1080}px);filter:blur(${Math.sin(p*Math.PI)*30}px)">${B}</div>`},
 punch:(A,B,p)=>p<.5?`<div style="left:0;top:0;width:1080px;height:1920px;transform-origin:540px 960px;transform:scale(${1+ei(p*2)*1.8});filter:blur(${p*40}px);opacity:${1-p*.6}">${A}</div>`:`<div style="left:0;top:0;width:1080px;height:1920px;transform-origin:540px 960px;transform:scale(${lerp(.6,1,eo((p-.5)*2))});filter:blur(${(1-p)*30}px)">${B}</div>`,
 glitch:(A,B,p)=>{const f=Math.floor(p*12);const X=p<.5?A:B;return `<div style="left:0;top:0;width:1080px;height:1920px">${slices(X,1,10,(k)=>({t:`translateX(${(rnd(k*7+f)-.5)*260*Math.sin(p*Math.PI)}px)`,f:rnd(k+f)>.7?'hue-rotate(90deg) saturate(3)':''}))}</div>`},
 flash:(A,B,p)=>(p<.5?A:B)+full(`background:#fff;opacity:${1-Math.abs(p-.5)*2}`),
 flash:(A,B,p)=>(p<.5?A:B)+full(`background:#fff;opacity:${1-Math.abs(p-.5)*2}`),
 iris:(A,B,p)=>{const r=lerp(0,2300,ei(p));return A+`<div style="left:0;top:0;width:1080px;height:1920px;clip-path:circle(${r}px at 540px 820px)">${B}</div>`},
 rgb:(A,B,p)=>{const X=p<.5?A:B,f=Math.floor(p*14),o=Math.sin(p*Math.PI)*40;return `<div style="left:0;top:0;width:1080px;height:1920px">${slices(X,1,12,k=>({t:`translateX(${(rnd(k*7+f)-.5)*200*Math.sin(p*Math.PI)}px)`,f:''}))}</div><div style="left:${o}px;top:0;width:1080px;height:1920px;mix-blend-mode:multiply;opacity:.5;filter:sepia(1) saturate(5) hue-rotate(-40deg)">${X}</div>`},
};
const INK='#151412';
const CREAM='radial-gradient(ellipse at 50% 42%,#faf7f1,#e8e0d2 85%)';
const wg=(k,t,o)=>{const it=WALL[k%WALL.length],sc=(o.w||it[1])/it[1];return `<div style="left:${o.x}px;top:${o.y}px;width:0;height:0;perspective:1400px"><div class="wg" style="left:${-it[1]/2}px;top:${-it[2]/2}px;width:${it[1]}px;height:${it[2]}px;transform-origin:50% 50%;transform:rotateY(${o.ry||0}deg) rotateX(${o.rx||0}deg) rotate(${o.r||0}deg) scale(${sc});opacity:${o.op??1};filter:drop-shadow(0 ${24*sc}px ${36*sc}px #0003) ${o.f||''};${o.css||''}">${it[0](t)}</div></div>`};
const bgWall=(cam,blur,veil)=>{wall(cam,{bg:CREAM});P(`<div style="left:0;top:0;width:1080px;height:1920px;backdrop-filter:blur(${blur}px);background:rgba(246,241,232,${veil})"></div>`)};
const cream=()=>P(full(`background:${CREAM}`));
const tower=(t,o={})=>{const g=o.g??1,tilt=o.tilt??-8,z=o.z??-700,R=420;let w='';
 for(let r=0;r<13;r++)for(let k=0;k<15;k++){const th=k/15*360+(r%2?1:-1)*t*18+r*20;const it=WALL[(r*15+k)%WALL.length];const fx=(rnd(r*14+k)-.5)*2000*(1-g),fy=(rnd(r*14+k+3)-.5)*1800*(1-g);
  w+=`<div style="left:-89px;top:-45px;transform-style:preserve-3d;transform:translate3d(${fx}px,${(r-6)*112+fy}px,0) rotateY(${th}deg) translateZ(${-R*g-(1-g)*200}px) rotateX(${(1-g)*260*(rnd(k+r)-.5)}deg)"><div class="wg" style="left:0;top:0;width:${it[1]}px;height:${it[2]}px;transform-origin:0 0;transform:scale(${178/it[1]});backface-visibility:hidden">${it[0](t+r+k)}</div></div>`}
 P(`<div style="left:0;top:0;width:1080px;height:1920px;perspective:1500px;perspective-origin:540px ${o.py??880}px"><div style="left:540px;top:${o.ty??860}px;transform-style:preserve-3d;transform:translateZ(${z}px) rotateX(${tilt}deg) rotateY(${o.spin||0}deg)">${w}${o.extra||''}</div></div>`)};
const WX=540,WY=900;const one=(k,t,w=760,o={})=>cap(()=>P(wg(k,t,{x:WX,y:WY,w,...o})));
const ENTER=[
 ['3D 彈出',(k,t,u)=>wg(k,t,{x:WX,y:WY,w:lerp(120,760,back(u)),rx:lerp(70,0,eo(u))})],
 ['翻牌進場',(k,t,u)=>wg(k,t,{x:WX,y:WY,w:760,ry:lerp(-180,0,back(u)),op:u>.05?1:0})],
 ['彈跳落下',(k,t,u)=>{const b=u<.55?ei(u/.55):1-Math.abs(Math.sin((u-.55)/.45*Math.PI*2))*(1-(u-.55)/.45)*.18;return wg(k,t,{x:WX,y:lerp(-300,WY,b),w:760})}],
 ['旋轉縮放',(k,t,u)=>wg(k,t,{x:WX,y:WY,w:lerp(0,760,back(u)),r:lerp(-200,0,eo(u))})],
 ['對焦浮現',(k,t,u)=>wg(k,t,{x:WX,y:WY,w:lerp(860,760,eo(u)),op:c01(u*2),f:`blur(${lerp(30,0,eo(u))}px)`})],
 ['擦除揭露',(k,t,u)=>`<div style="left:0;top:0;width:1080px;height:1920px;clip-path:inset(0 ${lerp(100,0,eo(u))}% 0 0)">${wg(k,t,{x:WX,y:WY,w:760})}</div><div style="left:${lerp(160,920,eo(u))}px;top:${WY-260}px;width:10px;height:520px;background:#ff5a1f;opacity:${1-u}"></div>`],
 ['圓形遮罩',(k,t,u)=>`<div style="left:0;top:0;width:1080px;height:1920px;clip-path:circle(${lerp(0,560,eo(u))}px at ${WX}px ${WY}px)">${wg(k,t,{x:WX,y:WY,w:760})}</div>`],
 ['殘影滑入',(k,t,u)=>[.24,.14,.06,0].map((d,j)=>wg(k,t,{x:lerp(1500,WX,eo(c01(u-d))),y:WY,w:760,op:j===3?1:.18})).join('')],
];
// ---- 破壞招式：同一個元件被八種方式拆掉 ----
const BREAK=[
 ['玻璃碎裂',(C,u)=>{let s='';SHARDS.forEach((tr,i)=>{const cx=(tr[0][0]+tr[1][0]+tr[2][0])/3,cy=(tr[0][1]+tr[1][1]+tr[2][1])/3,dx=cx-WX,dy=cy-WY,d=Math.hypot(dx,dy)+60;s+=`<div style="left:0;top:0;width:1080px;height:1920px;transform-origin:${cx}px ${cy}px;transform:translate(${dx/d*u*900}px,${dy/d*u*900+u*u*700}px) rotate(${(rnd(i)-.5)*u*240}deg);clip-path:polygon(${tr.map(p=>p[0]+'px '+p[1]+'px').join(',')});opacity:${1-u*.6}">${C}</div>`});return s}],
 ['方塊爆破',(C,u)=>slices(C,8,14,(k,i,j,cx,cy)=>({t:`translate(${(cx-WX)*u*1.6}px,${(cy-WY)*u*1.6+u*u*600}px) rotate(${(rnd(k)-.5)*u*400}deg) scale(${1-u*.5})`}))],
 ['像素崩壞',(C,u)=>slices(C,1,48,(k)=>({t:`translateX(${(rnd(k*3)-.5)*u*u*1600}px) scaleY(${1+u*rnd(k)*2})`,f:rnd(k)>.8?`saturate(${1+u*4}) hue-rotate(${u*60}deg)`:''}))],
 ['時間切片',(C,u,k=1,t=0)=>{let s='';const N=14,bw=1080/N;for(let j=0;j<N;j++)s+=`<div style="left:0;top:0;width:1080px;height:1920px;clip-path:inset(0 ${1080-(j+1)*bw}px 0 ${j*bw}px);transform:translateY(${Math.sin(j*.7+u*6)*u*120}px)">${one(k,t-j*.09*u*4)}</div>`;return s}],
 ['撕開畫面',(C,u)=>{const z=[];for(let y=0;y<=1920;y+=80)z.push([WX+(rnd(y)-.5)*90,y]);const L=z.map(p=>p[0]+'px '+p[1]+'px').join(','),R=z.slice().reverse().map(p=>p[0]+'px '+p[1]+'px').join(',');const dx=eo(u)*420;
  return `<div style="left:0;top:0;width:1080px;height:1920px;transform:translateX(${-dx}px) rotate(${-u*6}deg);clip-path:polygon(0 0,${L},0 1920px)">${C}</div><div style="left:0;top:0;width:1080px;height:1920px;transform:translateX(${dx}px) rotate(${u*6}deg);clip-path:polygon(1080px 0,${z[0][0]}px 0,${L},1080px 1920px)">${C}</div>`}],
 ['扯畫面',(C,u)=>slices(C,1,20,(k)=>{const d=Math.abs(k-10);return {t:`scaleX(${1+eo(u)*Math.max(0,3-d)*.9}) translateX(${Math.sin(k)*u*60}px)`}})],
 ['RGB 色散',(C,u)=>{const o=Math.sin(u*Math.PI)*60;return `<div style="left:${-o}px;top:0;width:1080px;height:1920px;filter:sepia(1) saturate(6) hue-rotate(-50deg);mix-blend-mode:multiply;opacity:.85">${C}</div><div style="left:${o}px;top:0;width:1080px;height:1920px;filter:sepia(1) saturate(6) hue-rotate(160deg);mix-blend-mode:multiply;opacity:.85">${C}</div>`}],
 ['粒子溶解',(C,u)=>{let s=`<div style="left:0;top:0;width:1080px;height:1920px;opacity:${1-eo(u)}">${C}</div>`;for(let i=0;i<260;i++){const x=WX-380+rnd(i)*760,y=WY-200+rnd(i*3)*400,a=c01(u*1.6-rnd(i*7)*.6);if(a<=0)continue;s+=`<div style="left:${x+(rnd(i*5)-.5)*a*300}px;top:${y-a*a*700}px;width:7px;height:7px;border-radius:50%;background:${i%6?INK:'#ff5a1f'};opacity:${1-a}"></div>`}return s}],
];
// 鏡頭語言連發：拉焦、荷蘭角、套娃、俯拍旋轉
const CAMS=[
 ['拉焦',t=>{const u=sm(c01(t/.8));wall(camAt(100,0,.62),{bg:CREAM});P(full(`backdrop-filter:blur(${lerp(0,10,u)}px)`));P(wg(9,t,{x:330,y:1350,w:900,f:`blur(${lerp(16,0,u)}px)`}))}],
 ['荷蘭角推近',t=>{P(`<div style="left:0;top:0;width:1080px;height:1920px;transform-origin:540px 960px;transform:rotate(${-9-t*3}deg) scale(${1.25+t*.2})">${cap(()=>{wall(camAt(-300,-200,.7),{bg:CREAM});P(wg(14,t,{x:540,y:960,w:700}))})}</div>`)}],
 ['無限套娃',t=>{const u=(t/.9)%1,z=Math.pow(3.2,u);const lay=d=>`<div style="left:0;top:0;width:1080px;height:1920px;transform-origin:540px 900px;transform:scale(${z/Math.pow(3.2,d)})">${cap(()=>{wall(camAt(d*300,0,.55),{bg:CREAM});P(`<div style="left:${540-169}px;top:${900-300}px;width:338px;height:600px;border-radius:26px;background:${INK};box-shadow:0 20px 40px #0004"></div>`)})}</div>`;P(lay(0));P(`<div style="left:0;top:0;width:1080px;height:1920px;clip-path:inset(${900-300*z}px ${540-169*z}px ${1020-300*z}px ${540-169*z}px round ${26*z}px)">${lay(1)}</div>`)}],
 ['俯拍旋轉',t=>{P(full(`background:${CREAM}`));P(`<div style="left:0;top:0;width:1080px;height:1920px;transform-origin:540px 960px;transform:rotate(${t*40}deg) scale(1.6)">${cap(()=>wall(camAt(0,0,.45),{bg:'transparent'}))}</div>`)}],
];
// 排列招式連發：堆疊展開、洗牌、弧形牆、元件轉盤
const ARR=[
 ['堆疊展開',t=>{const u=back(c01(t/.7));for(let i=5;i>=0;i--){const a=(i-2.5)*u;P(wg([1,9,12,8,17,18][i],t,{x:540+a*120,y:900+Math.abs(a)*30*u-i*(1-u)*14,w:600,r:a*9*u}))}}],
 ['卡片洗牌',t=>{const K=[23,14,16,13];K.forEach((k,i)=>{const ph=(t*2+i*.25)%1,lift=Math.sin(ph*Math.PI);const x=540+Math.sin((t*2+i*.5)*Math.PI)*260,y=900-i*14-lift*120;P(wg(k,t,{x,y,w:560,r:Math.sin((t*2+i*.5)*Math.PI)*8,ry:lift*20}))})}],
 ['元件轉盤',t=>{let w='';for(let k=0;k<10;k++){const th=k*36+t*60,it=WALL[(k*5)%WALL.length];w+=`<div style="left:-200px;top:-90px;transform-style:preserve-3d;transform:rotateY(${th}deg) translateZ(620px)"><div class="wg" style="left:0;top:0;width:${it[1]}px;height:${it[2]}px;transform-origin:0 0;transform:scale(${400/it[1]});backface-visibility:hidden">${it[0](t+k)}</div></div>`}
  P(`<div style="left:0;top:0;width:1080px;height:1920px;perspective:1300px;perspective-origin:540px 700px"><div style="left:540px;top:900px;transform-style:preserve-3d;transform:translateZ(-300px) rotateX(-10deg)">${w}</div></div>`)}],
];
