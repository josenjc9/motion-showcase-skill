# 下載與安裝

[回首頁選取得方式](../README.md)

## 最簡單：下載後交給 AI

[下載 ZIP](https://github.com/josenjc9/motion-showcase-skill/archive/refs/heads/main.zip) → 解壓縮 → 用 Codex 或 Claude Code 開啟解壓後的資料夾，貼上：

```text
先讀取這個資料夾的 SKILL.md，用現有元件幫我做一個心率卡片和進度環的互動展示，完成後告訴我怎麼開啟。
```

不用終端機、不用 Node.js，不必先安裝 skill。若要放進既有網站，把下載的整包資料夾放進該專案，並在需求中指出它的位置。

## 指令安裝

先安裝 [Node.js 22.20+](https://nodejs.org/) 與 [Git](https://git-scm.com/downloads)，在目標專案的終端機選一行：

**Codex**
```bash
npx skills add josenjc9/motion-showcase-skill --skill motion-showcase -a codex
```

**Claude Code**
```bash
npx skills add josenjc9/motion-showcase-skill --skill motion-showcase -a claude-code
```

安裝選項保留預設，只裝目前專案；若已有同名 skill，先保留自己的修改。

## 不用指令，手動安裝

下載並解壓縮，將整個資料夾改名為 `motion-showcase`，放進：

- **Codex：** `<你的專案>/.agents/skills/motion-showcase/`
- **Claude Code：** `<你的專案>/.claude/skills/motion-showcase/`

保留 `SKILL.md`、`lib/` 與其他檔案，不要只拿說明，也不要多包一層資料夾。若已有同名資料夾，先備份自己的修改。

以上兩種安裝方式完成後，在同一專案開新對話，說：「使用 motion-showcase，幫我做一個互動展示。」用 Chrome 開啟產出的 HTML，點按鈕確認數字會更新。

## 卡住時

- **找不到 npx／Git：** 裝 Node.js／Git，或改用下載後直接交給 AI。
- **AI 沒讀到：** 確認開啟的是同一個專案，明確請它讀取下載或安裝位置的 `SKILL.md`。
- **AI 找不到 lib：** 保留整包檔案，不要只搬 `SKILL.md`。
- **HTML 空白：** 看 [網頁排錯](tutorial.md#8-遇到問題怎麼辦)。

這裡的 Claude 指 **Claude Code**，不是一般聊天網頁；上傳 ZIP 不代表自動安裝或能直接執行網頁。

指令使用第三方 [skills CLI](https://github.com/vercel-labs/skills)；[工具名稱與安裝位置](https://github.com/vercel-labs/skills/blob/main/docs/agents.md)。
