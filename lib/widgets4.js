/* E — material mechanisms. Pure seconds; SVG approximations, not physical ray tracing. */
(()=>{'use strict';
const TAU=Math.PI*2, A='#bd622d', ink='#333832';
const rr=(x,y,w,h,r,fill,extra='')=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" ${extra}/>`;
const el=(x,y,rx,ry,fill,extra='')=>`<ellipse cx="${x}" cy="${y}" rx="${rx}" ry="${ry}" fill="${fill}" ${extra}/>`;
const ln=(x,y,X,Y,c='#777b70',sw=2)=>`<path d="M${x} ${y}L${X} ${Y}" fill="none" stroke="${c}" stroke-width="${sw}" stroke-linecap="round"/>`;
const path=(d,f,extra='')=>`<path d="${d}" fill="${f}" ${extra}/>`;
const g=(s,tr,ex='')=>`<g transform="${tr}" ${ex}>${s}</g>`;
const many=(n,f)=>Array.from({length:n},(_,i)=>f(i)).join('');
function defs(id){return `<defs>
<linearGradient id="${id}metal" x2=".92" y2="1"><stop stop-color="#202723"/><stop offset=".17" stop-color="#f6f6ec"/><stop offset=".3" stop-color="#818982"/><stop offset=".43" stop-color="#fdfcf5"/><stop offset=".48" stop-color="#343d36"/><stop offset=".66" stop-color="#1e2622"/><stop offset=".72" stop-color="#a9afa5"/><stop offset=".91" stop-color="#f8f7eb"/><stop offset="1" stop-color="#626b63"/></linearGradient>
<linearGradient id="${id}glass" x2="1" y2="1"><stop stop-color="#ffffff" stop-opacity=".8"/><stop offset=".2" stop-color="#c6cfc4" stop-opacity=".18"/><stop offset=".5" stop-color="#faf9ed" stop-opacity=".1"/><stop offset=".84" stop-color="#98a59a" stop-opacity=".4"/><stop offset=".92" stop-color="#ffffff" stop-opacity=".85"/><stop offset="1" stop-color="#5b6c61" stop-opacity=".6"/></linearGradient>
<radialGradient id="${id}clay" cx=".3" cy=".2" r=".9"><stop stop-color="#f7f0dd"/><stop offset=".6" stop-color="#d3c5a7"/><stop offset="1" stop-color="#9c8e72"/></radialGradient>
<linearGradient id="${id}orange" x2=".8" y2="1"><stop stop-color="#efb77b" stop-opacity=".8"/><stop offset=".45" stop-color="#d78443" stop-opacity=".65"/><stop offset="1" stop-color="#9e481c" stop-opacity=".9"/></linearGradient>
<linearGradient id="${id}dark" x2=".3" y2="1"><stop stop-color="#73796d"/><stop offset=".35" stop-color="#333d35"/><stop offset="1" stop-color="#18231d"/></linearGradient>
<linearGradient id="${id}paper" x2="1" y2="1"><stop stop-color="#fff9e9"/><stop offset=".5" stop-color="#e4d8bb"/><stop offset="1" stop-color="#afa38a"/></linearGradient>
<filter id="${id}shadow" x="-50%" y="-60%" width="200%" height="240%"><feDropShadow dx="2" dy="7" stdDeviation="4" flood-color="#443c28" flood-opacity=".24"/></filter>
<pattern id="${id}grain" width="7" height="9" patternUnits="userSpaceOnUse"><circle cx="1" cy="2" r=".55" fill="#655d48" opacity=".18"/><circle cx="5" cy="7" r=".45" fill="#fffaf0" opacity=".7"/></pattern>
</defs>`}
const scenes=[
// 01 refraction: the target remains fixed; only magnified target moves inside lens.
(p,U,id)=>{let x=115+25*Math.sin(p);return many(9,i=>ln(35+i*20,40,35+i*20,190,'#9a9d8c',.7))+many(8,i=>ln(30,44+i*20,205,44+i*20,'#9a9d8c',.7))+`<defs><clipPath id="${id}clip">${el(x,112,67,67,'white')}</clipPath></defs>`+el(x,184,64,8,'#b6ab91','opacity=".26"')+g(many(7,i=>ln(x-70+i*26,35,x-70+i*26,185, i===3?A:'#636f62',1.4))+many(6,i=>ln(x-75,42+i*28,x+75,42+i*28,'#636f62',1)), '',`clip-path="url(#${id}clip)"`)+el(x,112,68,68,U('glass'),'stroke="#8e9b90" stroke-width="2"')+path(`M${x-51} 91 Q${x-38} 52 ${x+3} 52`, 'none','stroke="#fffdf4" stroke-width="7" opacity=".85"')+el(x+35,151,18,4,'#fffdf4','opacity=".7"');},
// 02 iris aperture, independently articulated leaves
(p,U)=>{let r=28+17*(1-Math.cos(p))/2;return el(115,119,88,88,U('metal'),'filter="url(#E01shadow)"')+el(115,119,70,70,'#252f28')+many(8,i=>g(path(`M${r} -8 L75 -27 L74 28 L${r} 12 Z`,U('metal'),'stroke="#536054" stroke-width="1"'),`translate(115 119) rotate(${i*45+12*Math.sin(p)})`))+el(115,119,r,r,'#efe9dd')+el(115,119,84,84,'none','stroke="#f8f5e8" stroke-width="2"');},
// 03 clay compresses under a real platen
(p,U)=>{const q=(1-Math.cos(p))/2,h=100-34*q;return rr(65,173-h,100+28*q,h,18,U('clay'))+rr(65,173-h,100+28*q,h,18,U('grain'))+rr(40,175,160,12,4,U('dark'))+rr(55,155-h,140,18,5,U('metal'))+ln(125,20,125,155-h,'#858b7e',13)+el(112,162-h,19,4,A,'opacity=".65"');},
// 04 layered frosted shutters uncover a perforation matrix
(p,U)=>{let q=(1-Math.cos(p))/2;return many(18,i=>el(103+i%6*47,69+Math.floor(i/6)*35,5,5,A))+many(3,i=>g(rr(78,40+i*15,305,112,14,U('glass'),'stroke="#dce1d5" stroke-width="2"')+ln(94,49+i*15,361,49+i*15,'#fffbed',2),`translate(${(i-1)*q*60} ${(i-1)*q*15})`,'filter="url(#E03shadow)"'));},
// 05 liquid bridge neck stretches, volume shifts between reservoirs
(p,U)=>{let q=(1-Math.cos(p))/2, x=32*q;return el(240,178,118,9,'#bfb39a','opacity=".3"')+path(`M120 138 C115 85 169 70 199 ${115-x} C222 ${148-x} 258 ${148-x} 281 ${115-x} C315 66 368 91 359 138 C348 180 299 171 281 148 C261 ${128-x} 220 ${128-x} 199 148 C179 177 129 177 120 138Z`,U('metal'),'stroke="#90998e" stroke-width="1"')+path(`M137 116 Q163 87 188 121 M293 112 Q324 86 343 117`,'none','stroke="#fffdf2" stroke-width="5"');},
// 06 ceramic eccentric cam lifts an orange follower
(p,U)=>{let y=12*Math.sin(p);return rr(185,35,115,20,8,U('dark'))+rr(231,55,18,16+y,7,U('metal'))+g(el(12,0,54,54,U('clay'),'stroke="#c1b394" stroke-width="2"')+el(12,0,54,54,U('grain'))+el(36,-18,6,6,A),`translate(240 137) rotate(${p*180/Math.PI})`)+el(240,137,12,12,U('metal'))+rr(210,71+y,61,12,6,U('orange'));},
// 07 paper bellows fold by facet, endpoints stay on rails
(p,U)=>{let d=10+7*(1-Math.cos(p))/2;return ln(55,164,425,164,'#9c9b88',2)+many(12,i=>path(`M${65+i*d} 145 L${65+(i+.5)*d} 58 L${65+(i+1)*d} 145 Z`,i%2?U('paper'):'#f8efd9','stroke="#b9ad90" stroke-width=".6"'))+rr(60,143,12,26,3,U('orange'))+rr(65+12*d,143,12,26,3,U('dark'));},
// 08 acrylic panel moves across fixed bars, displacing image
(p,U)=>{let x=95+145*(1-Math.cos(p))/2;return many(9,i=>rr(70+i*40,61,10,105,2,'#606b5e'))+rr(x,36,122,148,12,U('orange'),'stroke="#a2572a" stroke-width="2" filter="url(#E07shadow)"')+many(3,i=>rr(x+12+i*34,63,8,100,2,'#f2d0a1','opacity=".5"'))+ln(x+5,48,x+5,168,'#ffdfb6',3);},
// 09 prism bends a single warm beam, no rainbow outside palette
(p,U)=>{let y=100+14*Math.sin(p),entry=180+(165-y)*65/123;return path(`M25 ${y-3} L${entry} ${y-3} L${entry} ${y+3} L25 ${y+3} Z`,'#fffcf0')+path(`M180 165 L245 42 L306 165 Z`,U('glass'),'stroke="#929c8d" stroke-width="2" filter="url(#E08shadow)"')+ln(245,43,245,152,'#fffef4',2)+path(`M${entry} ${y} L276 ${y+9} L442 ${y+36} L442 ${y+49} L270 ${y+15} Z`,U('orange'),'opacity=".8"')+path(`M180 165 L245 152 L306 165`, 'none','stroke="#fdf9ea" stroke-width="3"');},
// 10 soft packing — pistons squeeze individual cushions
(p,U)=>{let q=(1-Math.cos(p))/2;return rr(27,70,22,100,6,U('metal'))+rr(181,70,22,100,6,U('metal'))+many(4,i=>el(77+(i%2)*68+(i%2? -1:1)*q*13,80+Math.floor(i/2)*65,38-q*8,36+q*7,i===2?U('dark'):U('clay'),'filter="url(#E09shadow)"'))+rr(39+q*14,90,14,62,5,U('orange'))+rr(177-q*14,90,14,62,5,U('orange'));},
// 11 corrugated glass changes stripe refraction per rib
(p,U,id)=>`<defs><clipPath id="${id}ribs">${many(8,i=>rr(95+i*36,35,37,151,17,'white'))}</clipPath></defs>`+many(13,i=>ln(40+i*32,50,40+i*32,170,'#596654',2))+g(many(13,i=>path(`M${40+i*32} 50 Q${50+i*32} ${80+20*Math.sin(p+i*.5)} ${40+i*32} 105 T${40+i*32} 170`,'none','stroke="#596654" stroke-width="3"')),'',`clip-path="url(#${id}ribs)"`)+many(8,i=>rr(95+i*36,35,37,151,17,U('glass'),'stroke="#bdc7b9" stroke-width="1.5"'))+many(8,i=>path(`M${104+i*36} 48 Q${117+i*36+5*Math.sin(p)} 105 ${104+i*36} 170`,'none','stroke="#fffdf2" stroke-width="4" opacity=".8"')),
// 12 rubber peristaltic tube, traveling local compression
(p,U)=>{let pts=many(49,i=>{let x=35+i*8.5,y=108+22*Math.sin(i/48*TAU),r=12-6*Math.exp(-Math.pow(Math.sin(i/48*Math.PI-p/2),2)*14);return el(x,y,r,r,U('dark'));});return pts+many(3,i=>{let x=110+i*125,y=108+22*Math.sin((x-35)/408*TAU),q=(1+Math.cos(p-i*2))/2;return rr(x-11,y-49,22,31+q*15,8,U('metal'))+el(x,y-16+q*15,10,6,U('orange'));});},
// 13 metallic zipper meshes one tooth at a time
(p,U)=>{let q=(1-Math.cos(p))/2,x=85+310*q;return many(22,i=>{let X=45+i*18,d=8+Math.max(0,X-x)*.18;return rr(X,104-d,13,14,3,U('metal'))+rr(X+7,108+d,13,14,3,U('metal'));})+rr(x-13,91,30,48,7,U('metal'),'stroke="#7d887b"')+g(rr(-8,0,16,40,6,U('orange'))+el(0,31,3,4,'#f2e7d2'),`translate(${x+2} 106) rotate(${-20+40*q})`);},
// 14 cork stamp embosses a visible dent
(p,U)=>{let q=(1-Math.cos(p))/2;return rr(38,145,154,37,8,U('clay'))+rr(38,145,154,37,8,U('grain'))+el(115,149,30,8,'#a7936e',`opacity="${.15+.65*q}"`)+g(rr(75,28,80,30,9,U('clay'))+rr(75,28,80,30,9,U('grain'))+rr(100,55,30,47,7,U('dark'))+rr(77,96,76,13,4,U('metal')),`translate(0 ${q*35})`);},
// 15 porcelain valve reveals outlet as wheel turns
(p,U)=>{let q=(1-Math.cos(p))/2;return rr(44,87,141,50,25,U('clay'),'filter="url(#E14shadow)"')+rr(44,87,141,50,25,U('grain'))+el(115,112,43,43,U('metal'))+g(path('M-32 -4H32V4H-32Z M-4 -32H4V32H-4Z',U('clay'))+el(0,0,12,12,U('orange')),`translate(115 112) rotate(${90*q})`)+rr(181,103,28,18,7,U('dark'))+ln(204,112,215,112,A,3+5*q);},
// 16 foil embossing propagates a raised crease
(p,U)=>{let q=(1-Math.cos(p))/2;return rr(52,40,376,140,7,U('metal'),'filter="url(#E15shadow)"')+many(16,i=>{let y=58+i*7;return path(`M65 ${y} Q${160+90*q} ${y-29*Math.sin(i*.4)*q} 414 ${y}`, 'none',`stroke="${i%2?'#fcfbed':'#354335'}" stroke-width="${i%2?1:2}" opacity=".6"`);})+el(90+300*q,108,8,58,U('orange'),'opacity=".55"');},
// 17 capillary reservoir transfers liquid into glass fingers
(p,U)=>{let q=(1-Math.cos(p))/2;return rr(44,143,142,45,10,U('glass'),'stroke="#9cae9b" stroke-width="2"')+rr(49,158+q*12,132,24-q*12,5,U('orange'))+many(5,i=>rr(59+i*26,47,15,132,7,U('glass'),'stroke="#a2b29e" stroke-width="1"')+rr(63+i*26,136-q*(55+i*6),7,42+q*(55+i*6),3,U('orange')))+ln(57,185,176,185,'#fdf9eb',2);},
// 18 brass linkage has fixed pivots and an articulated knee
(p,U)=>{let x=240+70*Math.sin(p),y=65+23*Math.cos(p);return ln(60,171,420,171,'#969a86',3)+ln(100,166,x,y,'#7d806c',19)+ln(x,y,380,166,'#7d806c',19)+ln(100,162,x,y-4,'#d9cfaf',10)+ln(x,y-4,380,162,'#d9cfaf',10)+ln(100,166,100+(x-100)*.55,166+(y-166)*.55,'#7d806c',23)+ln(100,162,100+(x-100)*.55,162+(y-166)*.55,'#d9cfaf',15)+ln(380,166,380+(x-380)*.55,166+(y-166)*.55,'#7d806c',23)+ln(380,162,380+(x-380)*.55,162+(y-166)*.55,'#d9cfaf',15)+[[100,166],[x,y],[380,166]].map(([X,Y])=>el(X,Y,15,15,U('metal'))+el(X,Y,5,5,A)).join('');},
// 19 textile weave opens a shed; one weft passes through
(p,U)=>{let q=(1-Math.cos(p))/2;return many(15,i=>path(`M${58+i*25} 44 Q${58+i*25+(i%2?1:-1)*q*6} 109 ${58+i*25} 179`,'none',`stroke="${i%2?'#d4c5a6':'#90917c'}" stroke-width="13"`))+many(8,i=>ln(47,55+i*16,427,55+i*16,i%2?'#e4d8bb':'#a89a7a',8))+many(120,k=>{let i=k%15,j=Math.floor(k/15);return (i+j)%2?'':ln(58+i*25,50+j*16,58+i*25,60+j*16,i%2?'#d4c5a6':'#90917c',13);})+g(path('M-34 0L0 -12L34 0L0 12Z',U('orange'))+ln(-22,0,22,0,'#f7ddba',2),`translate(${65+350*q} 112)`);},
// 20 wax seal: pressing changes local meniscus
(p,U)=>{let q=(1-Math.cos(p))/2;return el(115,166,61+q*9,21,U('orange'),'filter="url(#E19shadow)"')+el(115,162,44+q*8,12,'#a34f24')+g(rr(96,23,38,68,15,U('dark'))+rr(75,86,80,23,5,U('metal'))+el(115,109,40,10,U('metal')),`translate(0 ${q*53})`)+el(115,164,24,5,'none',`stroke="#e5a66a" stroke-width="${2+q*2}" opacity="${q}"`);},
// 21 ceramic sieve — aperture tiles tilt independently
(p,U)=>{return rr(46,34,388,154,22,U('clay'),'filter="url(#E20shadow)"')+rr(46,34,388,154,22,U('grain'))+many(24,i=>{let x=80+i%8*45,y=66+Math.floor(i/8)*43,q=.2+.8*(1+Math.sin(p+i*.27))/2;return el(x,y,14,14,U('dark'))+el(x,y-3,13,12*q,U('clay'))+el(x,y-3,8,7*q,A, 'opacity=".45"');});},
// 22 acrylic caliper, measuring jaws physically approach sample
(p,U)=>{let q=(1-Math.cos(p))/2;return rr(40,68,400,26,6,U('glass'),'stroke="#96a28e"')+many(30,i=>ln(52+i*12,69,52+i*12, i%5?77:84,'#717b68',1))+rr(64,82,22,78,5,U('orange'))+rr(155+q*100,61,38,97,7,U('orange'))+rr(87,122,70+q*100,21,9,U('clay'))+ln(95,130,147+q*100,130,'#fbf4df',2);},
// 23 folded paper screw — each facet folds around an axis
(p,U)=>{return ln(115,28,115,197,'#8e947e',3)+many(10,i=>{let a=p+i*.7,x=56*Math.cos(a);return path(`M115 ${34+i*15} L${115+x} ${47+i*15} L115 ${64+i*15} L${115-x} ${49+i*15} Z`,U('paper'),'stroke="#e9e1c9" stroke-width=".8"')+path(`M115 ${34+i*15} L${115+x} ${47+i*15} L115 ${64+i*15} L${115-x} ${49+i*15} Z`,'#535d49',`opacity="${.12+.3*(1+Math.sin(a))/2}"`);})+el(115,199,47,7,'#bbb39c','opacity=".3"')+el(115,28,6,6,A);},
// 24 satin ribbon tension: changing curve, fixed anchored ends
(p,U)=>{let q=Math.sin(p)*37;return path(`M45 133 C125 ${28+q} 176 ${180-q} 238 110 S350 ${40+q} 437 113 L437 143 C350 ${70+q} 306 157 238 140 S125 ${58+q} 45 163 Z`,U('paper'),'stroke="#b5aa8a" stroke-width="1" filter="url(#E23shadow)"')+path(`M45 143 C125 ${38+q} 176 ${190-q} 238 120 S350 ${50+q} 437 123`,'none','stroke="#fff9e7" stroke-width="4" opacity=".85"')+el(45,148,12,24,U('metal'))+el(437,128,12,24,U('orange'));}
];
const sizes=[[230,230],[230,230],[230,230],[480,210],[480,210],[480,210],[480,210],[480,210],[480,210],[230,230],[480,210],[480,210],[480,210],[230,230],[230,230],[480,210],[230,230],[480,210],[480,210],[230,230],[480,210],[480,210],[230,230],[480,210]];
window.WALL4=scenes.map((scene,i)=>{const [w,h]=sizes[i];return [t=>{const phase=((Number(t)%3)+3)%3/3*TAU,id='E'+String(i).padStart(2,'0');const U=n=>`url(#${id+n})`;return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" style="overflow:visible">${defs(id)}${scene(phase,U,id)}</svg>`;},w,h];});
})();
