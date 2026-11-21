# motion-showcase

72 個動態元件，讓 AI 幫你放進網頁。

## 取得方式，選一種就好

### ① 下載交給 AI｜最簡單，不用安裝

**[下載 ZIP](https://github.com/josenjc9/motion-showcase-skill/archive/refs/heads/main.zip)** → 解壓縮 → 用 **Codex 或 Claude Code** 開啟這個資料夾，貼上：

```text
先讀取這個資料夾的 SKILL.md，用現有元件幫我做一個心率卡片和進度環的互動展示，完成後告訴我怎麼開啟。
```

保留整個資料夾即可，不需要終端機、Node.js，也不必先放進 skills 目錄。

### ② 指令安裝｜想在現有專案裡使用

在你的專案資料夾開啟終端機，選一行：

**Codex**
```bash
npx skills add josenjc9/motion-showcase-skill --skill motion-showcase -a codex
```

**Claude Code**
```bash
npx skills add josenjc9/motion-showcase-skill --skill motion-showcase -a claude-code
```

需有 [Node.js 22.20+](https://nodejs.org/) 與 [Git](https://git-scm.com/downloads)，安裝選項用預設值。接著在同一專案開新對話，說：「使用 motion-showcase，幫我做一個互動展示。」

### ③ 手動放進 skills｜想保留在專案裡，不用安裝指令

下載並解壓縮，將整包資料夾改名為 `motion-showcase`，放到：

- **Codex：** `<你的專案>/.agents/skills/motion-showcase/`
- **Claude Code：** `<你的專案>/.claude/skills/motion-showcase/`

開新對話，說：「使用 motion-showcase，幫我做一個互動展示。」[手動安裝說明](docs/install.md#不用指令手動安裝)

---

三種方式的結果都用 Chrome 開啟 AI 產生的 HTML。只想看動態？解壓縮後直接開 `gallery.html`。

以上適用於能讀取本機專案的 **Codex／Claude Code**；不是把 ZIP 丟進一般聊天網頁就會自動安裝。

## 元件預覽

### 基礎元件
![基礎元件：24 個元件預覽](docs/img/widgets-basic-v2.png)

### 生活與工具
![生活與工具類：24 個元件預覽](docs/img/widgets-daily-v2.png)

### 進階元件
![進階類：24 個元件預覽](docs/img/widgets-advanced-v2.png)

[安裝排錯](docs/install.md) · [元件目錄](catalog.md) · [手動寫 HTML](docs/first-widget.md) · [操作教學](docs/tutorial.md)

元件不會自動接 API，也不會直接輸出 MP4。授權：[MIT](LICENSE)。
