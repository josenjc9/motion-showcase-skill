# 操作教學｜從第一張卡片到自己的資料

[回首頁](../README.md) · [查元件與欄位](../catalog.md)

第一次使用，請先照 [完整 HTML 範例](first-widget.md) 建立 `index.html`。以下沿用同一份檔案，不需要另裝套件。

## 1. 先確認第一張卡片正常

開啟 `index.html` 後，應看到 `88 bpm`，按下按鈕會變成 `120 bpm`。

如果還沒看到，先跳到最後的「遇到問題怎麼辦」，不要急著接 API。

## 2. 看懂「建立」和「更新」

```js
const heart = MS.mount('#heart', 'heart-rate', { value: 88 });
heart.update({ value: 120 });
```

- `MS.mount()`：建立一個會持續播放的元件，放到指定位置。
- `heart`：這個元件的操作把手，之後用它更新、暫停或移除。
- `update()`：把新資料交給已建立的元件，不必重新建立。

建立元件前，頁面上的容器和 `lib/` 程式都必須已經載入。最簡單的方式，就是保留完整範例的順序：**容器 → 六個外部 script → 自己的 script**。

## 3. 練習換成進度環

在原本的 `index.html` 中，只改以下三個地方，其他載入設定保持不變：

1. 將 `<h1>` 的文字改成「上傳進度」。
2. 將按鈕文字改成「更新到 80%」。
3. 將最後一段 `<script>` 裡的內容換成：

```js
const ring = MS.mount('#heart', 'progress-ring', {
  value: 30,
  label: '上傳中'
});
document.getElementById('change').addEventListener('click', () => {
  ring.update({ value: 80 });
});
```

儲存並重新整理頁面。**預期結果：** 進度環先顯示 30%，按下按鈕後變成 80%，文字仍是「上傳中」。

容器仍叫 `heart` 也能用，因為它只是位置名稱，不決定元件種類。若要改名，HTML 的 `id` 和程式中的 `'#heart'` 必須一起改。

## 4. 讀懂元件目錄

到 [catalog.md](../catalog.md) 搜尋元件 id，例如 `progress-ring`，再確認：

- **欄位名稱：** 例如 `value`、`label`，拼字與大小寫要相同。
- **資料型態：** 數字、文字、清單或物件清單。
- **數值範圍：** `value: 80` 是 80%；標示 0–1 的欄位則要用 `0.8`。
- **索引起點：** 訂單進度的 `current` 從 0 開始；`0` 是第一步，`1` 是第二步。

第一次建立時，沒傳的欄位通常會使用示範內容；更新時，沒傳的欄位保留當下內容。清單更新請傳完整的新清單，不要只傳其中一項。

> 不要把「沒資料」當成 0，也不要依賴錯誤資料自動回退。各元件的容錯處理不同，請先確認資料格式；未知欄位可能不報錯，卻不會改變畫面。

## 5. 接自己的資料：先理解資料流

**你的資料來源 → 整理成元件的欄位 → 呼叫 `update()`。**

元件不會自行抓資料。下面只是格式轉換示意，可放在進度環範例的最後一段 script 裡；不是實際 API 連線：

```js
// 假設你的系統回傳 completed 和 total 兩個數字。
const data = { completed: 8, total: 10 };
const valid = Number.isFinite(data.completed)
  && Number.isFinite(data.total)
  && data.total > 0
  && data.completed >= 0
  && data.completed <= data.total;

if (valid) {
  const percent = Math.round(data.completed / data.total * 100);
  ring.update({ value: percent });
} else {
  // 保留原畫面；正式網站應另外顯示「資料暫時無法取得」。
  console.warn('資料格式不正確，這次不更新元件');
}
```

接真實 API 或 WebSocket 時，也是在收到並檢查資料後呼叫 `update()`。API 網址、登入、跨來源權限與失敗提示要由你的網站另外處理，不能直接把這個示意當成正式串接。需要金鑰的服務請交給後端，不要把秘密寫進 HTML。

## 5b. 解說用資訊圖卡：用 step 控制長到第幾步
最後 8 個元件（標題面板、循環飛輪圖、前後對照卡、雙欄對比卡、內容產線條、渲染佇列卡、里程碑計數卡、結尾品牌卡）是給「邊講邊出現」的解說用。它們由 `step` 決定長到第幾步，沒傳 `step` 才會自己循環示範：

```js
const fw = MS.mount('#fw', 'flywheel', {
  nodes: [{ label: '聽', sub: '收訊號' }, { label: '寫', sub: '出草稿' }, { label: '查', sub: '做檢查' }],
  step: 0
});
fw.update({ step: 2 });   // 前兩個節點依序長出
```

每個元件的 `step` 代表什麼（例如「0 左卡、1 箭頭、2 右卡、3 徽章」）都寫在 `catalog.md` 的欄位說明。完整範例看 `examples/web-demo.html` 下半部：拖滑桿，三張圖卡一起往下長。字幕關鍵詞標色：`highlightWords('講邊緣運算', ['邊緣運算'], 'sage')`，回傳已跳脫的安全 HTML 字串。

## 6. 暫停、繼續與移除

以下用進度環的 `ring` 示意；請依需要單獨呼叫，不要一次全貼上：

```js
ring.pause();    // 暫停播放
ring.play();     // 繼續播放
ring.destroy();  // 移除元件，並停止它的播放與視窗事件監聽
```

要直接切換數值、不做數字過渡：

```js
ring.update({ value: 60 }, { animate: false });
```

元件會依容器寬度等比例縮放；請先給容器合理的寬度。放進原本隱藏的分頁或彈窗時，顯示後也要確認尺寸是否正確。

## 7. 進階：查欄位、取特定時間的畫面

載入元件庫後，可以在瀏覽器開發者工具的 Console 使用：

```js
MS.list();                       // 全部元件與欄位
MS.get('progress-ring');         // 單一元件的尺寸與欄位
MS.render('heart-rate', 1.5, { value: 88 }); // 第 1.5 秒的 HTML 字串
```

`MS.render()` **不會自動播放，也不會輸出圖片或 MP4**。這份程式依賴瀏覽器的 `window`；不能直接當成可在純 Node.js 執行的伺服器端套件。做影片還需要另外的畫面擷取與編碼流程。

進場、破壞、排列、鏡頭與轉場效果，請看 `gallery.html`、`demo.html` 與 `lib/motion.js`，不要把效果名稱直接傳給 `MS.mount()`。

## 8. 遇到問題怎麼辦

| 看到的情況 | 先檢查什麼 | 怎麼處理 |
|---|---|---|
| 在 GitHub 點 HTML 只看到原始碼 | 還沒下載到電腦 | Code → Download ZIP，解壓縮後用 Chrome 開檔 |
| 開檔後空白或只有標題、按鈕 | `lib/` 位置、檔名與載入順序 | 回到 [完整範例](first-widget.md) 對照資料夾結構，確認不是 `.html.txt` |
| Console 出現 `MS is not defined` | `lib/ms.js` 是否載入 | 檢查路徑；自己的 script 必須放在六個外部 script 後面 |
| 出現「找不到容器」 | HTML 的 id 與選擇器是否一致 | 例如 `id="heart"` 對應 `'#heart'`，而且容器要先出現 |
| 出現「找不到元件」 | 元件 id 是否打錯 | 到目錄複製 id，或用 `MS.list()` 查詢 |
| 數字沒變、沒有報錯 | 欄位名稱與資料型態 | 對照該元件的欄位；例如比分用 `homeScore`，不是 `value` |
| 百分比看起來不對 | 該欄位是 0–100 還是 0–1 | 依目錄轉換，不要把兩種比例混用 |
| 元件太大或太小 | 容器寬度 | 先給容器明確寬度，例如 `style="width:250px"` |
| API 抓不到資料 | 網址、登入、跨來源權限或網路 | 先確認 [完整範例](first-widget.md) 的離線頁面正常，再檢查網站的資料串接 |

## 9. 想檢查整包是否正常

在下載資料夾根目錄，用 Chrome 分別開啟：

- `selftest.html`：檢查元件與效果的渲染。
- `datatest.html`：檢查元件資料欄位與預設畫面回歸。

兩頁的最後一行都應出現 `RESULT: PASS`。若出現 FAIL，請保留頁面上的失敗項目與 Console 錯誤，提供瀏覽器版本及重現步驟；不要只回報「不能用」。

這些是專案內建測試，不代表已驗過你的網站、API、手機或其他瀏覽器。
