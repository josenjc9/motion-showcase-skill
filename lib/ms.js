/* motion-showcase 元件介面：把元件放進網頁、接數據。
 *
 *   MS.list()                          → 全部元件（名稱、id、尺寸、可傳的欄位）
 *   MS.mount(容器, 名稱或id, 數據, 選項) → 掛進網頁並持續播放，回傳 {update, pause, play, destroy}
 *   MS.render(名稱或id, 秒, 數據)       → 回傳某一秒的 HTML 字串（做影片、截圖、伺服器端用）
 *
 * 數據欄位沒傳就用預設示範值。數字欄位用 update() 換值時會平順過渡。
 * 載入順序：widgets.js → widgets2.js → widgets3.js → widgets-all.js → names.js → ms.js
 */
(function(){
const W=window.WG, ids={};
const F=(type,desc,example)=>({type,desc,example});
// i = 在 WALL 裡的編號；fn = 底層元件；base = 固定樣式；fields = 可傳的數據欄位
const BASE=[
 {i:0,id:'counter',fn:'pill',base:{icon:'bolt',col:'orange',prefix:'×',value:15},fields:{value:F('數字','要顯示的數字',15),prefix:F('文字','數字前面的符號','×'),unit:F('文字','數字後面的單位','')}},
 {i:1,id:'live-score',fn:'score',base:{},fields:{home:F('文字','主隊名稱','主隊'),away:F('文字','客隊名稱','客隊'),homeScore:F('數字','主隊得分',2),awayScore:F('數字','客隊得分',1),period:F('文字','節次','第 2 回合'),status:F('文字','左上狀態','LIVE')}},
 {i:2,id:'heart-rate',fn:'pill',base:{icon:'heart',col:'red',unit:'bpm',value:144},fields:{value:F('數字','心率數值',144),unit:F('文字','單位','bpm')}},
 {i:3,id:'jump-arc',fn:'arc',base:{},fields:{title:F('文字','左上標題','跳躍 #482'),badge:F('文字','右上標籤','滯空 0.8s'),from:F('文字','起點名稱','起點'),to:F('文字','終點名稱','終點'),progress:F('數字 0–1','走到哪裡',0.5)}},
 {i:4,id:'video-countdown',fn:'pill',base:{icon:'film',col:'blue',value:'0:27'},fields:{value:F('文字','顯示內容，例如倒數時間','0:27')}},
 {i:5,id:'order-progress',fn:'steps',base:{},fields:{title:F('文字','左上標題','訂單 #2025'),eta:F('文字','預計時間','0:62'),steps:F('文字清單','每個步驟名稱',['腳本','素材','分鏡','剪輯','檢查']),current:F('數字','目前第幾步（從 0 開始）',2),prefix:F('文字','步驟名稱前綴','渲染中・')}},
 {i:6,id:'call',fn:'call',base:{},fields:{name:F('文字','通話狀態或對象','錄音中'),avatar:F('文字','頭像文字','主隊'),time:F('文字','通話時間','0:04')}},
 {i:7,id:'battery-percent',fn:'pill',base:{icon:'bolt',col:'green',unit:'%',value:64},fields:{value:F('數字','百分比',64)}},
 {i:8,id:'music-player',fn:'music',base:{},fields:{title:F('文字','歌名','Night Drive'),sub:F('文字','副標','Studio・Live'),progress:F('數字 0–1','播放進度',0.3)}},
 {i:9,id:'run-pace',fn:'run',base:{},fields:{label:F('文字','活動名稱','晨跑'),time:F('文字','時間','0:12'),distance:F('數字','距離',1.56),unit:F('文字','距離單位','圈'),heart:F('數字','心率',150)}},
 {i:10,id:'water-level',fn:'pill',base:{icon:'drop',col:'blue',unit:'m',value:10},fields:{value:F('數字','數值',10),unit:F('文字','單位','m')}},
 {i:11,id:'burst-forecast',fn:'rain',base:{},fields:{title:F('文字','標題','觀看數 12 分鐘後爆發'),percent:F('數字','右上百分比',56)}},
 {i:12,id:'cook-timer',fn:'timer',base:{},fields:{title:F('文字','計時名稱','烤吐司'),seconds:F('數字','剩餘秒數',451),progress:F('數字 0–1','已經過的比例',0.3)}},
 {i:13,id:'breathing',fn:'breathe',base:{},fields:{round:F('數字','第幾輪',5),rounds:F('數字','共幾輪',6),time:F('文字','時間','2:31')}},
 {i:14,id:'timecode',fn:'tc',base:{},fields:{seconds:F('數字','起始秒數（之後自己往上跑）',1935)}},
 {i:15,id:'chat-input',fn:'chat',base:{},fields:{name:F('文字','上方小字','訊息'),text:F('文字','打出來的內容','哈囉～錄音中！過來～'),typing:F('是否','true＝一個字一個字打（預設）；false＝直接顯示全文',true)}},
 {i:16,id:'render-ring',fn:'ring',base:{col:'green',label:'渲染中',value:26},fields:{value:F('數字 0–100','百分比',26),label:F('文字','圈中文字','渲染中'),col:F('顏色名','blue/green/red/coral/yellow/purple/pink/orange','green')}},
 {i:17,id:'mixer-eq',fn:'eq',base:{},fields:{title:F('文字','標題','混音・音效軌'),levels:F('數字清單 0–1','12 條音量',[0.4,0.7,0.5,0.9,0.3,0.6,0.8,0.4,0.7,0.5,0.6,0.3])}},
 {i:18,id:'trend-line',fn:'line',base:{},fields:{title:F('文字','標題','互動累積'),value:F('數字','大數字',20),series:F('數字清單','折線的每個點（至少 2 個）',[3,5,4,8,7,12,10,15,14,20])}},
 {i:19,id:'settings-toggles',fn:'toggles',base:{},fields:{items:F('物件清單','每項 {label, on}',[{label:'動態模糊',on:false},{label:'顆粒',on:true},{label:'漏光',on:true}])}},
 {i:20,id:'big-stat',fn:'stat',base:{icon:'ball',col:'coral',value:42,label:'動態'},fields:{value:F('數字或文字','大數字',42),label:F('文字','下方說明','動態'),icon:F('圖示名','bolt/heart/drop/film/ball','ball'),col:F('顏色名','orange/blue/green/red/coral/yellow/purple/pink','coral')}},
 {i:21,id:'duration-pill',fn:'pill',base:{icon:'ball',col:'yellow',value:'2h 41m'},fields:{value:F('文字','時長','2h 41m')}},
 {i:22,id:'progress-ring',fn:'ring',base:{col:'purple',label:'處理中',value:70},fields:{value:F('數字 0–100','百分比',70),label:F('文字','圈中文字','處理中'),col:F('顏色名','同 render-ring','purple')}},
 {i:23,id:'frame-count',fn:'stat',base:{icon:'film',col:'blue',value:706,label:'已渲染幀'},fields:{value:F('數字或文字','大數字',706),label:F('文字','下方說明','已渲染幀'),icon:F('圖示名','bolt/heart/drop/film/ball','film'),col:F('顏色名','顏色','blue')}}
];
const reg=[];
WALL.forEach((w,i)=>{
  const b=BASE.find(x=>x.i===i), name=(window.WALL_NAMES||[])[i]||('元件'+i);
  const e={index:i,name,id:b?b.id:'w'+i,w:w[1],h:w[2],data:!!b,fields:b?b.fields:{},base:b?b.base:null,fn:b?b.fn:null,fallback:w[0]};
  reg.push(e);ids[e.id]=e;ids[name]=e;
});
const get=n=>{const e=ids[n];if(!e)throw new Error('找不到元件：'+n+'（用 MS.list() 看全部）');return e};
const defaults=e=>{const d={};Object.keys(e.fields).forEach(k=>d[k]=e.fields[k].example);return d};
function render(name,t,data){const e=get(name);
  if(!e.data)return e.fallback(t);
  const o={...e.base,...(data||{})};return W[e.fn](t,o)}
function list(){return reg.map(e=>({name:e.name,id:e.id,width:e.w,height:e.h,dataReady:e.data,fields:e.fields}))}
// 數字（與數字清單）在 update 時平順過渡
const isNum=v=>typeof v==='number'&&isFinite(v);
function mix(a,b,u){
  if(isNum(a)&&isNum(b)){const v=a+(b-a)*u;return Number.isInteger(b)&&Number.isInteger(a)?Math.round(v):+v.toFixed(3)}
  if(Array.isArray(a)&&Array.isArray(b)&&a.length===b.length&&a.every(isNum)&&b.every(isNum))return b.map((x,i)=>mix(a[i],x,u));
  return b}
function mount(el,name,data,opts){opts=opts||{};
  const e=get(name);
  if(typeof el==='string')el=document.querySelector(el);
  if(!el)throw new Error('找不到容器');
  const root=document.createElement('div');root.className='ms-root';
  const stage=document.createElement('div');stage.className='ms-stage';stage.style.width=e.w+'px';stage.style.height=e.h+'px';
  root.appendChild(stage);el.appendChild(root);
  let shown=Object.assign(defaults(e),data||{}),from=shown,to=shown,t0=performance.now(),tw=0,dur=opts.duration??600,run=true,raf=0,start=performance.now(),last=0;
  const fps=opts.fps||30;
  const fit=()=>{const sc=opts.scale||((el.clientWidth||e.w)/e.w);root.style.width=e.w*sc+'px';root.style.height=e.h*sc+'px';stage.style.transform='scale('+sc+')'};
  const draw=now=>{
    if(tw<1){tw=Math.min(1,(now-t0)/dur);const u=1-Math.pow(1-tw,3);const o={};Object.keys(to).forEach(k=>o[k]=mix(from[k],to[k],u));shown=o}
    stage.innerHTML=render(name,(now-start)/1000,shown)};
  const loop=now=>{if(!run)return;if(now-last>=1000/fps-1){last=now;draw(now)}raf=requestAnimationFrame(loop)};
  fit();draw(performance.now());raf=requestAnimationFrame(loop);
  const onResize=()=>fit();window.addEventListener('resize',onResize);
  return{
    update(next,o){const n=Object.assign({},shown,next||{});from=shown;to=n;t0=performance.now();if(o&&o.animate===false){tw=1;shown=n;stage.innerHTML=render(name,(performance.now()-start)/1000,shown)}else tw=0},
    pause(){run=false;cancelAnimationFrame(raf)},
    play(){if(!run){run=true;raf=requestAnimationFrame(loop)}},
    destroy(){run=false;cancelAnimationFrame(raf);window.removeEventListener('resize',onResize);root.remove()},
    get data(){return shown}
  }}
window.MS={_mix:mix,list,mount,render,get:n=>{const e=get(n);return{name:e.name,id:e.id,width:e.w,height:e.h,dataReady:e.data,fields:e.fields}}};
})();
