---
name: motion-showcase
description: 使用現有 lib/ 將動態元件放進網頁、更新數據，或預覽影片元件與轉場效果時使用。含 72 個可接資料的元件；不提供 API 自動串接或一鍵影片匯出。
---

# motion-showcase｜AI 操作指南

## 先確認要做什麼

- **只看效果：** 引導使用者下載並解壓縮專案，用 Chrome 開啟 `gallery.html`。
- **放進網頁：** 先讀 `README.md` 的完整 HTML，再依 `catalog.md` 選元件與欄位。
- **更新資料：** 參考 `docs/tutorial.md`，沿用已建立元件的 `update()`。
- **影片素材或轉場：** 查看 `demo.html`、`lib/motion.js`；不要承諾此專案能直接輸出 MP4。

## 安裝後，先定位檔案

使用者安裝本 skill 後，先定位本 `SKILL.md` 所在的目錄。以下 `README.md`、`catalog.md`、`lib/`、`docs/` 等路徑都**相對於 skill 目錄**，不是使用者目前的專案目錄。

1. 確認 `lib/ms.js`、`lib/ms.css` 與元件檔案齊全。若只有 `SKILL.md`，引導使用者依 `docs/install.md` 安裝整包，不自行下載並執行未知安裝腳本。
2. 讀取 skill 目錄的 README 完整範例與 catalog；將需要的 `lib/` 複製到目標專案，再使用專案內的相對路徑。
3. 若目標已有同名檔案，先比較內容；不要默默覆寫。可建立獨立 demo 子目錄避開衝突。
4. 使用者只說「試用」時，預設交付可直接開啟的 `motion-demo.html`：心率 88、進度環 30%，按鈕更新到 120 與 80%。不要先推給使用者一長串選擇題。

只看展示或手動整合不需要先安裝 skill；需要安裝方法時看 `docs/install.md`。不論哪種方式，都必須能讀到整包檔案，不能假設安裝了說明就已把 `lib/` 放進網站。

## 網頁整合步驟

1. 將完整 `lib/` 複製到目標專案，確認 HTML 的相對路徑。
2. 載入 `lib/ms.css`，依序載入 `lib/widgets.js`、`lib/widgets2.js`、`lib/widgets3.js`、`lib/widgets-all.js`、`lib/names.js`、`lib/ms.js`。
3. 先建立有合理寬度的容器，再呼叫 `MS.mount()`。自己的 script 必須位於外部 script 後面。
4. 從 `catalog.md` 確認元件 id、欄位名稱、型態、數值範圍與索引起點。
5. 更新資料時呼叫 `update()`；移除頁面或元件時呼叫 `destroy()`。

以下是局部示意，不是完整 HTML；給新手交付時請提供 README 那樣的完整檔案：

```html
<div id="heart" style="width:250px"></div>
```

```js
// 容器與六個外部 script 都已載入後才執行。
const heart = MS.mount('#heart', 'heart-rate', { value: 88 });
// 按鈕點擊或收到已驗證的新資料時再呼叫：
heart.update({ value: 120 });
```

## 資料與功能邊界

- 元件名稱可用中文或英文 id；教學優先使用目錄中的英文 id，避免拼字差異。
- 不同元件的欄位不同；未知欄位可能不報錯但沒有效果。
- 不要保證所有錯誤資料都能自動回退，各元件的容錯處理不同。應先驗證資料，未知值不當成 0。
- API、WebSocket、登入、重試與錯誤提示由網站處理；不把示範資料說成真實串接，不把秘密放進前端。
- `MS.list()` 查全部元件，`MS.get(id)` 查單一元件；`MS.render(id, 秒, 資料)` 只回傳某時間點的 HTML 字串。
- 程式依賴瀏覽器環境，不保證能直接在純 Node.js 執行；截圖與影片編碼需要另行處理。
- 元件依容器寬度縮放；不要在元件內加入計時器或亂數，渲染應由傳入時間與資料決定。外部資料更新另行處理。
- 進場、破壞、排列、鏡頭與轉場不是 `MS.mount()` 的元件 id；使用它們前先讀實作，不自行猜 API。

## 交付與驗證

交付時說清楚：檔案放哪裡、如何開啟、哪些資料能改、預期看到什麼。

- 網頁整合：實際開啟並操作，檢查數值更新、容器尺寸與 Console。
- 修改元件庫時：另檢查 `selftest.html`、`datatest.html`，兩頁最後一行應為 `RESULT: PASS`。
- 無法執行瀏覽器或測試時，明確標記「未實測」，不能把靜態檢查當成互動測試通過。

不包含鏡頭表、配樂、音效、字型檔、實拍特效、材質圖片或影片匯出工具。
