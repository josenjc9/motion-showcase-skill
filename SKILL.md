---
name: motion-showcase
description: 給網站與影片用的動態小元件包（直式／卡片式）：80 個會動的元件（心率、比分、進度環、訂單進度、折線圖、開關等，全部可接數據）加進場、破壞、排列、鏡頭、轉場效果。使用者要在網頁放動態元件、儀表板、即時數據卡片，或要做短影音元件素材時使用。
---

# motion-showcase

## 什麼時候用
- 使用者要在網站放動態元件、接即時數據
- 想知道有哪些元件、名字、能傳什麼欄位：先看 `catalog.md`

## 放進網頁
載入順序不能換：`lib/ms.css`、`lib/widgets.js`、`widgets2.js`、`widgets3.js`、`widgets-all.js`、`names.js`、`ms.js`。

```js
const h = MS.mount('#容器', 'heart-rate', { value: 88 });  // 掛上
h.update({ value: 120 });                                   // 換數據，數字平順過渡
```
- `MS.list()` 列出全部元件與欄位；`MS.render(名稱, 秒, 數據)` 回傳某一秒的 HTML。
- 元件名可用中文（心率）或英文 id（heart-rate）。
- 80 個元件全部可接數據。
- 欄位型態與範例在 `catalog.md`；傳錯欄位名稱不會報錯，只是沒效果，先對照目錄。

## 規則
- 元件尺寸固定，掛上去會縮放到容器寬度。
- 不要在元件裡加計時器或亂數，畫面只由時間與數據決定。
- 驗證：`datatest.html`、`selftest.html` 最後一行應為 `RESULT: PASS`。

## 不包含
鏡頭表、配樂、音效、字型、實拍特效、材質圖片。
