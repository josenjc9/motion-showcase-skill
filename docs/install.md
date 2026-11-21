# Codex / Claude Code 安裝

[回首頁](../README.md)

## 複製一行

先安裝 [Node.js 22.20+](https://nodejs.org/) 與 [Git](https://git-scm.com/downloads)，在你的專案資料夾開啟終端機。

**Codex**
```bash
npx skills add josenjc9/motion-showcase-skill --skill motion-showcase -a codex
```

**Claude Code**
```bash
npx skills add josenjc9/motion-showcase-skill --skill motion-showcase -a claude-code
```

安裝選項用預設值，只裝目前專案；若已有同名 skill，先保留自己的修改。

## 貼一句需求

在同一個專案開啟 Codex 或 Claude Code 的新對話：

```text
使用 motion-showcase，幫我做一個心率卡片和進度環的互動展示，完成後告訴我怎麼開啟。
```

用 Chrome 開啟產出的 HTML，點按鈕確認數字會更新。這裡的 Claude 指 **Claude Code**，不是一般聊天網頁。

## 不用指令，手動安裝

[下載 ZIP](https://github.com/josenjc9/motion-showcase-skill/archive/refs/heads/main.zip) → 解壓縮 → 將資料夾改名為 `motion-showcase` → 整包放到：

- **Codex：** `<你的專案>/.agents/skills/motion-showcase/`
- **Claude Code：** `<你的專案>/.claude/skills/motion-showcase/`

保留 `SKILL.md`、`lib/` 與其他檔案，不要只拿一份說明。已有同名資料夾時先備份自己的修改。接著在同一專案開新對話，貼上前面的需求。

## 卡住時

- **找不到 npx／Git：** 安裝 Node.js／Git，再重開終端機。
- **安裝完成但 AI 沒讀到：** 確認開的是同一個專案，重開對話，請 AI 讀已安裝的 `SKILL.md`。
- **AI 找不到 lib：** 確認裝了整包，不是只有 `SKILL.md`。
- **HTML 空白：** 看 [網頁排錯](tutorial.md#8-遇到問題怎麼辦)。

指令使用第三方 [skills CLI](https://github.com/vercel-labs/skills)；[工具名稱與安裝位置](https://github.com/vercel-labs/skills/blob/main/docs/agents.md)。
