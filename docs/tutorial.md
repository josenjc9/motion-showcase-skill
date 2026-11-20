# 教學

## 1. 安裝
```sh
git clone https://github.com/josenjc9/motion-showcase-skill ~/.claude/skills/motion-showcase
```
重開 Claude Code 就會抓到，不用裝其他東西。

## 2. 先看有什麼
- 圖：看 README 的元件圖。
- 名稱與編號：看 `catalog.md`。
- 看某個效果動起來：用瀏覽器開 `demo.html?type=enter&i=0&t=0.25`，改 `t`（秒）看不同瞬間。

`type` 可以填：`enter`（進場）、`break`（破壞）、`arrange`（排列）、`camera`（鏡頭）、`transition`（轉場）、`widget`（元件）。

## 3. 跟 AI 說要什麼
用白話講就好：

> 用 motion-showcase 做一段 6 秒的直式展示：先用「3D 彈出」帶出「心率」元件，接「方塊爆破」拆掉，再用 ink 轉場切到「番茄鐘」。

講清楚：幾秒、哪幾招、順序、哪個元件。不確定就說「挑一個像計時器的元件」，AI 會去目錄找。

## 4. 輸出成影片
需要 Google Chrome 和 ffmpeg（`brew install ffmpeg`）。以 30fps、6 秒為例：

```sh
cd ~/.claude/skills/motion-showcase
mkdir -p out
for f in $(seq 0 179); do
  t=$(python3 -c "print($f/30)")
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --hide-scrollbars \
    --window-size=1080,1920 --virtual-time-budget=2000 \
    --screenshot=out/f_$(printf %04d $f).png "file://$PWD/demo.html?type=break&i=1&t=$t"
done
ffmpeg -framerate 30 -i out/f_%04d.png -pix_fmt yuv420p out.mp4
```
這是一格一格截圖再合成影片。要把多個效果接成一支片，就是每一格算出現在是第幾秒，挑對應的效果去截。

## 5. 小提醒
- 前後兩段別用同一個效果，會單調。
- 進場、破壞大約 0.38 秒演完，想慢一點就把時間拉長。
- 不要在效果裡加計時或亂數，不然每次輸出會不一樣。

## 6. 卡住時
- 畫面全空白：多半是編號填超過範圍。
- 想確認每個效果都正常：開 `selftest.html`，最後一行是 `RESULT: PASS` 就沒問題。
