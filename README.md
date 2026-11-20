# motion-showcase

給網站和影片用的動態小元件包：心率、比分、進度環、訂單進度、折線圖、開關……72 個會動的元件，另外還有進場、破壞、排列、鏡頭、轉場效果。

**可以接你自己的數據**：把數字丟進去，元件會平順變成新數字。目前 **24 個元件可接數據**，其餘 48 個先當展示用。

## 先看效果
- 下載後雙擊 **`gallery.html`**：所有元件和效果都會自己動，每個下面有名字。
- 雙擊 **`examples/web-demo.html`**：真正接數據的網頁範例，拖拉滑桿元件就跟著變。

## 放進你的網站（三步）
1. 把 `lib/` 資料夾放進你的專案。
2. 網頁裡依序載入：
```html
<link rel="stylesheet" href="lib/ms.css">
<script src="lib/widgets.js"></script>
<script src="lib/widgets2.js"></script>
<script src="lib/widgets3.js"></script>
<script src="lib/widgets-all.js"></script>
<script src="lib/names.js"></script>
<script src="lib/ms.js"></script>
```
3. 掛上元件、之後換數據：
```js
const hr = MS.mount('#heart', 'heart-rate', { value: 88 });
hr.update({ value: 120 });   // 88 平順變成 120
```
每個元件能傳哪些欄位，看 [catalog.md](catalog.md)。完整說明看 [docs/tutorial.md](docs/tutorial.md)。

## 一、進場（8 種）
元件怎麼出現。
3D 彈出、翻牌進場、彈跳落下、旋轉縮放、對焦浮現、擦除揭露、圓形遮罩、殘影滑入。

## 二、破壞特效（8 種）
元件怎麼被拆掉。
玻璃碎裂、方塊爆破、像素崩壞、時間切片、撕開畫面、扯畫面、RGB 色散、粒子溶解。

## 三、排列（3 種）
多個元件怎麼排：堆疊展開、卡片洗牌、元件轉盤。

## 四、鏡頭運動（4 種）
整個畫面怎麼動：拉焦、荷蘭角推近、無限套娃、俯拍旋轉。

## 五、轉場（9 種）
兩個畫面怎麼切換：ink（墨水擴散）、blinds（橫百葉）、vblinds（直百葉）、whip（甩鏡）、punch（衝擊放大）、glitch（故障位移）、flash（閃白）、iris（圓形擴張）、rgb（色散切換）。

## 六、動態元件（72 個，其中 24 個可接數據）
可接數據的有：閃電計數、即時比分、心率、跳躍軌跡、影片倒數、訂單進度、通話中、電量百分比、音樂播放、跑步配速、水滴數值、爆發預測長條、烤吐司計時、呼吸引導、錄影時間碼、聊天輸入、渲染進度環、混音等化器、互動曲線、設定開關、大數字統計、時長膠囊、處理中圓環、已渲染幀數（就是第一張「基礎元件」）。

**基礎元件（24）**
![基礎元件](docs/img/widgets-basic-v2.png)

**生活與工具類（24）**
![生活與工具類](docs/img/widgets-daily-v2.png)

**進階類（24）**
![進階類](docs/img/widgets-advanced-v2.png)


## 檔案
| 檔 | 用途 |
|---|---|
| `lib/` | 所有元件與效果的程式（放進你的專案） |
| `gallery.html` | 全部效果展示頁（雙擊開） |
| `examples/web-demo.html` | 接數據的網頁範例 |
| `demo.html` | 預覽單一效果（進階） |
| `catalog.md` | 全部效果與編號 |
| `selftest.html` | 檢查每個效果都能正常顯示 |
| `datatest.html` | 檢查每個可接數據的元件，傳進去的值真的會顯示 |

只在 Chrome 測過。不含音效與配樂。

授權：MIT
