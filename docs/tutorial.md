# 教學

## 1. 安裝
```sh
git clone https://github.com/josenjc9/motion-showcase-skill ~/.claude/skills/motion-showcase
```
重開 Claude Code 就會抓到，不用裝其他東西。

## 2. 先看有什麼
- 圖：看 README 的元件圖。
- 名稱與編號：看 `catalog.md`。
- 看效果動起來：雙擊 `gallery.html`。
- 想停在某個瞬間：用瀏覽器開 `demo.html?type=enter&i=0&t=0.25`，改 `t`（秒）看不同瞬間。

`type` 可以填：`enter`（進場）、`break`（破壞）、`arrange`（排列）、`camera`（鏡頭）、`transition`（轉場）、`widget`（元件）。

## 3. 跟 AI 說要什麼
用白話講就好：

> 用 motion-showcase 做一段 6 秒的直式展示：先用「3D 彈出」帶出「心率」元件，接「方塊爆破」拆掉，再用 ink 轉場切到「番茄鐘」。

講清楚：幾秒、哪幾招、順序、哪個元件。不確定就說「挑一個像計時器的元件」，AI 會去目錄找。

## 4. 輸出成影片
需要先裝好：
- Google Chrome（或 Chromium）
- ffmpeg（macOS：`brew install ffmpeg`；Linux：`sudo apt install ffmpeg`）

不需要 Python。macOS、Linux 都能跑，Windows 沒測。

直接跑現成範例，輸出 4 秒影片（心率彈出 → 方塊爆破 → 墨水轉場切到番茄鐘）：
```sh
sh examples/render.sh
```
約 1 到 2 分鐘，完成後影片在 `examples/out.mp4`。成品長相看 [docs/sample-three-segments.mp4](sample-three-segments.mp4)。

想改成自己的組合：打開 `examples/three-segments.html`，裡面三段各一行，換掉元件編號或效果名稱就行（編號對照看 `catalog.md`），再跑一次 `sh examples/render.sh`。

原理：一格一格截圖，再用 ffmpeg 合成影片。

## 5. 小提醒
- 前後兩段別用同一個效果，會單調。
- 進場、破壞大約 0.38 秒演完，想慢一點就把時間拉長。
- 不要在效果裡加計時或亂數，不然每次輸出會不一樣。

## 6. 卡住時
- 畫面全空白：多半是編號填超過範圍。
- 想確認每個效果都正常：開 `selftest.html`，最後一行是 `RESULT: PASS` 就沒問題。
