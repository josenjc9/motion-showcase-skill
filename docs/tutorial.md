# 教學

## 1. 放進網站
把整個 `lib/` 放進你的專案，網頁裡這樣載入（順序不能換）：

```html
<link rel="stylesheet" href="lib/ms.css">
<script src="lib/widgets.js"></script>
<script src="lib/widgets2.js"></script>
<script src="lib/widgets3.js"></script>
<script src="lib/widgets-all.js"></script>
<script src="lib/names.js"></script>
<script src="lib/ms.js"></script>
```
`ms.css` 的樣式都限定在元件裡面，不會動到你頁面其他地方。

## 2. 掛上元件
```html
<div id="heart" style="width:260px"></div>
<script>
  const hr = MS.mount('#heart', 'heart-rate', { value: 88 });
</script>
```
- 第一個參數：放元件的方塊（選擇器或元素）。元件會自動縮放成方塊的寬度。
- 第二個參數：元件名字，中文（`'心率'`）或英文 id（`'heart-rate'`）都可以。
- 第三個參數：數據。不傳就用示範數字。

## 3. 接數據
```js
hr.update({ value: 120 });                  // 數字會平順過渡
hr.update({ value: 60 }, { animate: false }); // 不要過渡，直接跳
```
- 數字（和數字清單，例如折線的每個點）會平順變過去，文字直接換。
- 每個元件能傳哪些欄位：看 [catalog.md](../catalog.md)，每個欄位都有說明和範例。
- 不傳的欄位維持原本的值。

### 接真實的資料（範例）
```js
const score = MS.mount('#score', 'live-score', { home: '藍隊', away: '紅隊' });
const ws = new WebSocket('wss://你的伺服器');
ws.onmessage = e => {
  const d = JSON.parse(e.data);
  score.update({ homeScore: d.home, awayScore: d.away, period: d.period });
};
```
接 API 也一樣：拿到資料就呼叫 `update`。

## 4. 其他方法
- `MS.list()`：列出全部元件、尺寸、能傳的欄位。
- `hr.pause()` / `hr.play()`：暫停、繼續。
- `hr.destroy()`：移除元件。
- `MS.render('heart-rate', 1.5, { value: 88 })`：回傳第 1.5 秒的畫面（HTML 文字），給截圖、做影片或伺服器端用。

## 5. 哪些元件能接數據
- 24 個可接：看 `catalog.md` 的第一部分。
- 其他 48 個：能放進網頁播放，但內容是固定的，還不能傳數據。傳了也不會變。

## 6. 進場、破壞、轉場等效果
這些是「元件出現、被拆掉、切換」的動作，目前用來做展示和影片，雙擊 `gallery.html` 看每一種。

## 7. 檢查
- `selftest.html`：最後一行 `RESULT: PASS` 表示每個元件與效果都能顯示。
- `datatest.html`：最後一行 `RESULT: PASS` 表示 24 個元件傳進去的值都會顯示出來。

## 8. 卡住時
- 畫面是空的：確認 `ms.css` 有載入、script 順序正確。
- 找不到元件：用 `MS.list()` 看名字。
