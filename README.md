# motion-showcase

直式（1080×1920）動態視覺招式庫，給 AI 助理或自己用。裝成 skill 後，叫助理「用 motion-showcase 做一段……」就能挑招式、預覽、渲染。

**內容**：96 個動態元件、8 進場、8 破壞特效、4 排列、4 鏡頭運動、9 轉場。完整清單：`catalog.md`。

## 五分鐘上手
1. 把整個資料夾放到 `~/.claude/skills/motion-showcase/`（Claude Code）。
2. 用瀏覽器直接開檔案預覽，不需要安裝任何東西：

   `demo.html?type=break&i=1&t=0.3` → 方塊爆破的某一瞬間
   `demo.html?type=widget&i=30&t=1` → 第 30 號動態元件在第 1 秒
3. 要輸出影片：無頭 Chrome 逐幀截圖，再用 ffmpeg 合成。

## 範例：逐幀輸出
```sh
for f in $(seq 0 29); do
  t=$(python3 -c "print($f/30)")
  "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --hide-scrollbars \
    --window-size=1080,1920 --virtual-time-budget=2000 \
    --screenshot=frame_$(printf %03d $f).png "file://$PWD/demo.html?type=break&i=1&t=$t"
done
ffmpeg -framerate 30 -i frame_%03d.png -pix_fmt yuv420p out.mp4
```

## 檔案
| 檔 | 用途 |
|---|---|
| `lib/widgets.js`、`widgets2.js`、`widgets3.js` | 72 個動態元件 |
| `lib/widgets4.js` | 24 個材質元件 |
| `lib/widgets-all.js` | 合併成同一張 WALL 清單 |
| `lib/motion.js` | 進場、破壞、排列、鏡頭、轉場與共用函式 |
| `demo.html` | 單招預覽頁 |
| `catalog.md` | 招式目錄 |

## 限制
- 只在 Chrome（含無頭模式）實測。Safari／Firefox 沒測。
- 預設字型走系統字（PingFang TC、SF Pro），其他系統字型會不同。
- 沒有附音效、配樂與實拍特效素材。
