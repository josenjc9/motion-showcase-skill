# 教學：用 motion-showcase 做一段動態影片

## 1. 安裝
```sh
git clone https://github.com/josenjc9/motion-showcase-skill ~/.claude/skills/motion-showcase
```
重開 Claude Code，skill 就會被偵測到。不用裝任何套件。

## 2. 先看有什麼
- 想看全部招式長怎樣：開 `README.md` 的總覽圖。
- 想查編號：`catalog.md`。
- 想看某一招動起來：用瀏覽器開
  `demo.html?type=enter&i=0&t=0.25`，改 `t`（秒）就能看不同瞬間。

`type` 可選：`enter`、`break`、`arrange`、`camera`、`transition`、`widget`。

## 3. 跟 AI 說要什麼
直接用白話描述，AI 會讀 `SKILL.md` 與 `catalog.md` 挑招式。例如：

> 用 motion-showcase 做一段 6 秒的直式展示：先用「3D 彈出」帶出第 5 號元件，接「方塊爆破」拆掉，再用 ink 轉場切到第 30 號元件。

好的描述會講：幾秒、用哪幾招、順序、哪個元件。不確定編號就說「挑一個看起來像計時器的元件」，AI 會去目錄找。

## 4. 輸出成影片
一支片 = 逐幀截圖 + 合成。以 30fps、6 秒為例：

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
需要：Google Chrome、ffmpeg（`brew install ffmpeg`）。

要把多招串成一支片，在自己的頁面載入 `lib/` 底下的檔案，照 `demo.html` 裡的 `renderAt` 寫法組合；每一幀只要算出當下的 `t`，呼叫對應的招式，把結果放進畫面即可。

## 5. 組合原則
- 相鄰兩段不要用同一招，節奏會變單調。
- 進場、破壞各約 0.38 秒，想要慢一點就拉長 `t` 的對應範圍。
- 時間只由 `t` 決定，不要在招式裡加計時器或隨機數，不然每次渲出來不同。

## 6. 疑難排解
- 畫面全空白：打開 `selftest.html`，最後一行是 `RESULT: PASS` 就表示招式本身正常，多半是 `i` 超出範圍。
- 字型看起來不一樣：字型走系統字，換系統外觀會變。
- 要確認每招都能跑：開 `selftest.html`。
