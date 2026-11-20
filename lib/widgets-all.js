// 合併四份元件庫成一張 WALL 清單
// WALL 每項：[ t=>HTML字串, 寬, 高 ]；前 72 項是動態元件（widgets/2/3），後 24 項是材質元件（widgets4 的 WALL4，另外載入）
window.WALL.push(...window.WALL2,...window.WALL3);
