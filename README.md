# motion-showcase｜把會動的小元件放進你的網頁

心率、即時比分、訂單進度、折線圖……這裡有 **72 個可帶入自己資料的動態元件**，另外提供進場、破壞、排列、鏡頭與轉場效果。

**最快的用法：安裝 skill → 貼一句需求給 AI → 開啟產生的網頁。** 不需要先讀懂元件程式。

## 快速安裝，交給 AI 使用

### 第一步：在你的專案資料夾執行

先準備好支援 skills 的 AI 開發工具，以及 [Node.js](https://nodejs.org/) **22.20 以上版本**與 [Git](https://git-scm.com/downloads)。開啟終端機，進入你要放網頁的專案資料夾，再執行：

```bash
npx skills add josenjc9/motion-showcase-skill --skill motion-showcase
```

這會透過第三方 [skills CLI](https://github.com/vercel-labs/skills) 下載 skill；首次執行時，npx 可能會詢問是否下載 CLI。接著依提示選擇你正在使用的 AI 工具，並選 **Project**（只裝到目前專案）。如果詢問安裝方式，保留預設即可。

**不想用終端機？** 請看 [手動安裝](docs/install.md#不用指令手動安裝)，整包下載後放到 AI 工具的 skills 資料夾；不能只複製 `SKILL.md`。

### 第二步：開一個新的 AI 對話，貼上這句

```text
請使用 motion-showcase skill，在目前專案建立一個可以直接用瀏覽器開啟的 motion-demo.html。
放入心率卡片（88 bpm）與進度環（30%，文字「上傳中」），加一個按鈕，按下後變成 120 bpm 和 80%。
請從已安裝 skill 的目錄複製所需 lib/ 檔案到本專案，使用相對路徑，不要重新安裝套件，也不要覆寫既有檔案。
完成後告訴我 HTML 放在哪裡、如何開啟。
```

AI 若尚未辨識新 skill，請重新開啟工具或對話，並要求它先讀取已安裝的 `SKILL.md`。

### 第三步：開啟結果

用 Chrome 開啟 AI 產生的 `motion-demo.html`。應看到心率與進度環，按下按鈕後數字會更新。**這一步才是可使用的確認，不只是安裝指令跑完。**

需要 Codex、Hermes 的安裝方式，或更新、移除與故障排除？看 [安裝指南](docs/install.md)。

> 元件負責顯示你提供的資料，不會自動連上 API；這個專案也不是一鍵輸出 MP4 的工具。

## 1. 不安裝，先看效果

1. [直接下載 ZIP](https://github.com/josenjc9/motion-showcase-skill/archive/refs/heads/main.zip)，或在本頁上方按綠色 **Code → Download ZIP**。
2. 解壓縮下載的檔案。請保留整個資料夾，不要只拿一個 HTML 檔出來。
3. 在解壓縮後的資料夾裡，雙擊 `gallery.html`，用 Chrome 開啟。
4. 想看「改數字，畫面跟著變」：打開 `examples` 資料夾，再雙擊 `web-demo.html`，拖動心率或比分滑桿。

**看到什麼才算成功？** 展示頁會播放效果；拖動滑桿時，元件會換成新數字。

只看展示不需要安裝 Node.js，也不用執行 npm 指令。GitHub 裡的 HTML 連結是原始碼頁，不是可播放的展示頁，請先下載。

## 2. 做出你的第一個元件

這一步需要能用文字編輯器儲存 HTML；不熟程式也可以把下面整段交給 AI 協助。

### 準備檔案

建立一個資料夾，把下載內容中的 **整個 `lib/` 資料夾**複製進去，再新增 `index.html`。位置要像這樣：

```text
my-page/
├── index.html
└── lib/
    ├── ms.css
    ├── widgets.js
    ├── widgets2.js
    ├── widgets3.js
    ├── widgets-all.js
    ├── names.js
    ├── ms.js
    └── motion.js
```

### 複製這份完整 HTML

把以下內容存進 `index.html`，確認副檔名不是 `.html.txt`，再用 Chrome 開啟。

```html
<!doctype html>
<html lang="zh-Hant">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>我的第一個動態元件</title>
  <link rel="stylesheet" href="lib/ms.css">
</head>
<body>
  <h1>我的心率卡片</h1>
  <div id="heart" style="width:250px"></div>
  <button id="change" type="button">改成 120 bpm</button>

  <!-- 請保留以下載入順序，並把自己的程式放在最後 -->
  <script src="lib/widgets.js"></script>
  <script src="lib/widgets2.js"></script>
  <script src="lib/widgets3.js"></script>
  <script src="lib/widgets-all.js"></script>
  <script src="lib/names.js"></script>
  <script src="lib/ms.js"></script>
  <script>
    const heart = MS.mount('#heart', 'heart-rate', { value: 88 });
    document.getElementById('change').addEventListener('click', () => {
      heart.update({ value: 120 });
    });
  </script>
</body>
</html>
```

**預期結果：** 心率卡片先顯示 `88 bpm`；按下按鈕後，數字平順變成 `120 bpm`。

這個範例不需要 `motion.js`；它是展示進場、轉場等效果時使用的另一層程式。

### 你先記住這三個地方就好

- `'#heart'`：元件要放在哪裡，對應上方的 `<div id="heart">`。
- `'heart-rate'`：元件的英文名稱，換元件時來這裡改。
- `{ value: 88 }`：給元件的資料；`update()` 則是換成新資料。

## 3. 換成你需要的元件

先從常見用途挑，不用一次翻完 72 個：

| 想呈現什麼 | 元件 id | 主要資料欄位 |
|---|---|---|
| 心率 | `heart-rate` | `value` |
| 比分 | `live-score` | `homeScore`、`awayScore` |
| 完成百分比 | `progress-ring` | `value`（0–100）、`label` |
| 訂單走到哪一步 | `order-progress` | `steps`、`current`（從 0 開始） |
| 數字與折線 | `trend-line` | `value`、`series` |

每個元件的欄位不同，不能只換名稱、卻照用上一個元件的欄位。

- **查全部元件與欄位：** [元件目錄](catalog.md)
- **學習換元件、更新資料、排除問題：** [操作教學](docs/tutorial.md)

## 交給 AI 幫你做

讓 AI 能讀到這個專案資料夾，再貼上這段需求：

```text
請先讀 README.md、SKILL.md 和 catalog.md。
幫我在網頁放一個 progress-ring 元件，初始完成度 30%，文字是「上傳中」。
加一個按鈕，按下後更新成 80%。
請使用現有 lib/，給我完整 HTML，並說明檔案要放哪裡、如何開啟。
不要安裝套件、不要連外部服務，也不要把示範數字說成真實 API 資料。
```

`SKILL.md` 是給 AI 讀的操作說明；一般使用者不必先安裝成某個平台的 skill，才能使用網頁元件。

## 還有哪些效果？

以下效果先到 `gallery.html` 看，再視需要研究 `demo.html` 與 `lib/motion.js`；它們不是 `MS.mount()` 可直接掛上的元件名稱。

- **進場 8 種：** 彈出、翻牌、彈跳落下、旋轉縮放等。
- **破壞 8 種：** 玻璃碎裂、方塊爆破、像素崩壞、粒子溶解等。
- **排列 3 種：** 堆疊展開、卡片洗牌、元件轉盤。
- **鏡頭 4 種：** 拉焦、荷蘭角推近、無限套娃、俯拍旋轉。
- **轉場 9 種：** 墨水擴散、橫／直百葉、甩鏡、衝擊放大、故障位移、閃白、圓形擴張、色散切換。

## 元件外觀預覽

圖片只能看外觀；要看動態，請開 `gallery.html`。

<details>
<summary>展開 72 個元件的預覽圖</summary>

**基礎元件（24 個）**

![基礎元件](docs/img/widgets-basic-v2.png)

**生活與工具類（24 個）**

![生活與工具類](docs/img/widgets-daily-v2.png)

**進階類（24 個）**

![進階類](docs/img/widgets-advanced-v2.png)

</details>

## 使用限制與授權

- 專案原有測試範圍為 Chrome；其他瀏覽器與真實裝置請另行確認。
- 不包含配樂、音效、字型檔或影片匯出工具。
- 上線前請檢查資料來源、文字長度與個資；不要把 API 金鑰放進前端 HTML。
- 授權為 [MIT](LICENSE)；使用、修改或散布時，請保留授權聲明。
