# 安裝指南｜裝好後，直接請 AI 幫你做

[回首頁](../README.md) · [網頁操作教學](tutorial.md)

這是一包 **AI 操作說明＋可直接使用的網頁元件**。安裝 skill 是讓 AI 找得到操作方法與 `lib/`；真正使用時，AI 會把所需檔案放進你的網站專案。

## 推薦：一行安裝

**前提：** 已有支援 skills 的 AI 開發工具，且電腦已安裝 [Node.js 22.20 以上](https://nodejs.org/)與 [Git](https://git-scm.com/downloads)。這不是一般聊天網頁的外掛，不能貼到任意聊天視窗就自動安裝。

在你的專案資料夾開啟終端機，執行：

```bash
npx skills add josenjc9/motion-showcase-skill --skill motion-showcase
```

1. npx 若詢問是否下載 `skills` CLI，先確認套件名稱，再同意。
2. 選你正在使用的 AI 工具。
3. 安裝範圍選 **Project**，只影響目前專案。安裝方式若有詢問，保留預設即可。
4. 開新對話；必要時重新啟動 AI 工具，讓它重新找到 skill。

這個指令會執行第三方 [skills CLI](https://github.com/vercel-labs/skills)，不是本專案自製的安裝程式。不需要 sudo，也不需要提供 API 金鑰。若同名 skill 已存在，先確認是否要更新，不要直接覆寫自己的修改。

### 使用 Codex：指定工具，不必互動選擇

在目標專案執行：

```bash
npx skills add josenjc9/motion-showcase-skill --skill motion-showcase -a codex
```

### 使用 Hermes：裝到使用者技能庫

對採預設 `~/.hermes` 路徑的 Hermes，可透過同一套 CLI 安裝：

```bash
npx skills add josenjc9/motion-showcase-skill --skill motion-showcase -a hermes-agent -g
```

`-g` 表示跨專案可用。若使用獨立 profile 或自訂 `HERMES_HOME`，請改用下方手動安裝，放進該 profile 的 skills 目錄；不要誤裝到另一個 Agent。

不要只使用單一 raw `SKILL.md` 的下載方式，因為它可能漏掉本專案必需的 `lib/`、目錄與教學。

## 安裝後，第一句就這樣問

```text
請使用 motion-showcase skill，在目前專案建立一個可以直接用瀏覽器開啟的 motion-demo.html。
放入心率卡片（88 bpm）與進度環（30%，文字「上傳中」），加一個按鈕，按下後變成 120 bpm 和 80%。
請從已安裝 skill 的目錄複製所需 lib/ 檔案到本專案，使用相對路徑，不要重新安裝套件，也不要覆寫既有檔案。
完成後告訴我 HTML 放在哪裡、如何開啟。
```

用 Chrome 開啟產出的 HTML，確認：

- 一開始看得到 `88 bpm` 與 `30%`。
- 按下按鈕，改成 `120 bpm` 與 `80%`。
- 不必啟動後端，頁面也能顯示這組示範資料。

接著就能改需求，例如：「把進度環換成訂單進度，顯示接單、製作、配送、完成四步。」

## 不用指令，手動安裝

1. [下載整包 ZIP](https://github.com/josenjc9/motion-showcase-skill/archive/refs/heads/main.zip)。
2. 解壓縮，把資料夾名稱改成 `motion-showcase`。
3. 將整個資料夾放到你使用工具的 skills 目錄。若已有同名資料夾，先備份自己的修改，再決定是否替換。
4. 開啟新的 AI 對話，貼上前面的第一句需求。

常見位置：

| 工具 | 放置位置 |
|---|---|
| Codex，僅目前專案 | `<你的專案>/.agents/skills/motion-showcase/` |
| Codex，跨專案 | `~/.agents/skills/motion-showcase/` |
| Hermes，預設環境 | `~/.hermes/skills/motion-showcase/` |
| Hermes，自訂環境或 profile | `<該環境的 HERMES_HOME>/skills/motion-showcase/` |

`~` 是你的使用者家目錄；其他工具的位置請以該工具文件為準。

**放好後的結構必須是：**

```text
motion-showcase/
├── SKILL.md
├── README.md
├── catalog.md
├── lib/
├── docs/
├── examples/
└── gallery.html
```

其他原有檔案也保留。不要只搬 `SKILL.md`，也不要多包一層 `motion-showcase/motion-showcase-skill-main/`，否則 AI 可能找不到。

如果你的 AI 工具不支援 skill 安裝，只要讓它能讀取下載的專案資料夾，再說「請先讀這個資料夾的 SKILL.md，依照裡面的說明製作網頁」即可。不支援讀取本機檔案的聊天工具，無法直接完成這種整合。

## 更新與移除

以下指令適用於透過 skills CLI 安裝的版本。請先保留自己改過的內容；更新可能替換已安裝檔案。

```bash
# 查看目前專案的已安裝 skills
npx skills list

# 更新目前專案中的這個 skill
npx skills update motion-showcase -p

# 移除目前專案的 skill，依提示確認目標
npx skills remove motion-showcase
```

若原本使用全域安裝，改用 `npx skills list -g`、`npx skills update motion-showcase -g` 與 `npx skills remove motion-showcase -g`。手動安裝的版本不一定由 CLI 管理，請用原方式維護。

移除 skill 不會替你清掉已複製進網站專案的元件檔案。

## 安裝卡住時

| 問題 | 先做這件事 |
|---|---|
| `npx` 找不到 | 安裝 Node.js 後，重新開啟終端機 |
| CLI 說 Node 版本不支援 | 用 `node --version` 確認至少 22.20；依 Node 官方方式更新 |
| 找不到 Git | 安裝 Git 後重新開啟終端機，用 `git --version` 確認 |
| 下載失敗 | 確認能連上 GitHub 與 npm；不行就改用下載 ZIP 手動安裝 |
| 工具清單沒有你的 AI | 查該工具的 skills 支援方式，或用讀取專案資料夾的方式，不猜安裝路徑 |
| 安裝顯示成功，但 AI 不知道這個 skill | 確認安裝的專案／工具相同，開新對話，要求它先讀已安裝的 `SKILL.md` |
| AI 找不到 `lib/` | 確認安裝的是整包，不是只有 SKILL.md；程式路徑要相對於 skill 所在目錄解析 |
| 產出的 HTML 空白 | 看 [操作教學的排錯表](tutorial.md#8-遇到問題怎麼辦)，檢查 lib 路徑與 script 順序 |

## 指令與路徑來源

- [skills CLI 安裝與管理指令](https://github.com/vercel-labs/skills/blob/main/docs/commands.md)
- [支援工具與安裝位置](https://github.com/vercel-labs/skills/blob/main/docs/agents.md)
- [skill 根目錄辨識規則](https://github.com/vercel-labs/skills/blob/main/docs/creating-skills.md)

CLI 與各 AI 工具會持續更新；選項如有差異，請以工具當下提示及官方文件為準。
