#!/bin/sh
# 把「三段範例」輸出成 4 秒、30fps 的 mp4（out.mp4）
# 需要：Google Chrome（或 Chromium）、ffmpeg。macOS／Linux 都可以，不需要 Python。
set -e
cd "$(dirname "$0")"
if [ -x "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" ]; then
  CHROME="/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
else
  CHROME="$(command -v google-chrome || command -v chromium || command -v chromium-browser || true)"
fi
[ -n "$CHROME" ] || { echo "找不到 Chrome，請先安裝 Google Chrome"; exit 1; }
command -v ffmpeg >/dev/null || { echo "找不到 ffmpeg，請先安裝（macOS：brew install ffmpeg）"; exit 1; }
mkdir -p out && rm -f out/f_*.png
for f in $(seq 0 119); do
  t=$(awk "BEGIN{printf \"%.4f\", $f/30}")
  "$CHROME" --headless=new --hide-scrollbars --window-size=1080,1920 --virtual-time-budget=2000 \
    --screenshot="out/f_$(printf %04d $f).png" "file://$PWD/three-segments.html?t=$t" >/dev/null 2>&1
done
ffmpeg -y -loglevel error -framerate 30 -i out/f_%04d.png -pix_fmt yuv420p out.mp4
echo "完成：$PWD/out.mp4"
