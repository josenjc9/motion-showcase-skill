# 手動建立第一個元件

[回首頁](../README.md) · [後續操作教學](tutorial.md)


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
    ├── widgets5.js
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
  <script src="lib/widgets5.js"></script>
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

## 換成你需要的元件

先從常見用途挑，不用一次翻完 80 個：

| 想呈現什麼 | 元件 id | 主要資料欄位 |
|---|---|---|
| 心率 | `heart-rate` | `value` |
| 比分 | `live-score` | `homeScore`、`awayScore` |
| 完成百分比 | `progress-ring` | `value`（0–100）、`label` |
| 訂單走到哪一步 | `order-progress` | `steps`、`current`（從 0 開始） |
| 數字與折線 | `trend-line` | `value`、`series` |

每個元件的欄位不同，不能只換名稱、卻照用上一個元件的欄位。

- **查全部元件與欄位：** [元件目錄](../catalog.md)
- **學習換元件、更新資料、排除問題：** [操作教學](tutorial.md)

