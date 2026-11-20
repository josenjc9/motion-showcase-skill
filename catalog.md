# 招式目錄

編號就是呼叫時的 `i`（從 0 開始）。用 `demo.html?type=<類型>&i=<編號>&t=<秒>` 可以單獨渲出某一瞬間。

## 進場（type=enter，8）
- `0` 3D 彈出
- `1` 翻牌進場
- `2` 彈跳落下
- `3` 旋轉縮放
- `4` 對焦浮現
- `5` 擦除揭露
- `6` 圓形遮罩
- `7` 殘影滑入

## 破壞（type=break，8）
- `0` 玻璃碎裂
- `1` 方塊爆破
- `2` 像素崩壞
- `3` 時間切片
- `4` 撕開畫面
- `5` 扯畫面
- `6` RGB 色散
- `7` 粒子溶解

## 排列（type=arrange，3）
- `0` 堆疊展開
- `1` 卡片洗牌
- `2` 元件轉盤

## 鏡頭（type=camera，4）
- `0` 拉焦
- `1` 荷蘭角推近
- `2` 無限套娃
- `3` 俯拍旋轉

## 轉場（type=transition，9）
- `0` ink
- `1` blinds
- `2` vblinds
- `3` whip
- `4` punch
- `5` glitch
- `6` flash
- `7` iris
- `8` rgb

## 動態元件（type=widget，WALL 共 72 個，編號 0–71）
- 0–23：基礎元件 24 個，由 pill, score, arc, steps, call, music, run, rain, timer, breathe, tc, chat, ring, eq, line, toggles, stat 等樣式組成（細節看 `lib/widgets.js` 結尾的 WALL 清單）
- 24–47：天氣, 股票 K 線, 地圖導航, 心電圖, 雷達掃描, 翻頁鐘, 行事曆, 通知堆疊, 支付卡, 相機取景框, 錄音波形, 日出曲線, 電量, 溫度計, 評分星, 下載進度, Wi-Fi／訊號格, 指南針, 圓餅圖, 計步環三圈, 匯率, 外送進度, 碼表, 音量旋鈕
- 48–71：音樂播放器, 聊天輸入中, 語音助理聲波球, 追蹤包裹地圖點, 健身心率區間條, 睡眠階段圖, 股票走勢雙線比較, 加密貨幣跳動, 天氣雷達雨帶, 航班動態, 電梯樓層, 停車計時, 比賽計分板倒數, 投票即時長條, 直播觀看數＋愛心飄, 上傳進度圈, 雲端同步轉圈, 二步驗證碼倒數, 鍵盤打字, 滑桿調整, 顏色選擇器色環, 頻譜瀑布圖, 世界時鐘三城, 番茄鐘

## 材質元件（window.WALL4，24 個，編號 0–23）
- `01` refraction: the target remains fixed; only magnified target moves inside lens.
- `02` iris aperture, independently articulated leaves
- `03` clay compresses under a real platen
- `04` layered frosted shutters uncover a perforation matrix
- `05` liquid bridge neck stretches, volume shifts between reservoirs
- `06` ceramic eccentric cam lifts an orange follower
- `07` paper bellows fold by facet, endpoints stay on rails
- `08` acrylic panel moves across fixed bars, displacing image
- `09` prism bends a single warm beam, no rainbow outside palette
- `10` soft packing — pistons squeeze individual cushions
- `11` corrugated glass changes stripe refraction per rib
- `12` rubber peristaltic tube, traveling local compression
- `13` metallic zipper meshes one tooth at a time
- `14` cork stamp embosses a visible dent
- `15` porcelain valve reveals outlet as wheel turns
- `16` foil embossing propagates a raised crease
- `17` capillary reservoir transfers liquid into glass fingers
- `18` brass linkage has fixed pivots and an articulated knee
- `19` textile weave opens a shed; one weft passes through
- `20` wax seal: pressing changes local meniscus
- `21` ceramic sieve — aperture tiles tilt independently
- `22` acrylic caliper, measuring jaws physically approach sample
- `23` folded paper screw — each facet folds around an axis
- `24` satin ribbon tension: changing curve, fixed anchored ends
