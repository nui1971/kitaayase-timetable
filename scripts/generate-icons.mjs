import sharp from 'sharp'
import { readFileSync, mkdirSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const outDir = resolve(__dirname, '../public/icons')
mkdirSync(outDir, { recursive: true })

// 駅名標風SVG（ベースサイズ 512x512）
const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <!-- 背景：千代田線グリーン 角丸正方形 -->
  <rect width="512" height="512" rx="80" ry="80" fill="#006400"/>

  <!-- 駅名標の白い枠 -->
  <rect x="48" y="140" width="416" height="200" rx="12" ry="12" fill="white"/>

  <!-- 上下の緑ライン（帯） -->
  <rect x="48" y="140" width="416" height="32" rx="12" ry="12" fill="#006400"/>
  <rect x="48" y="308" width="416" height="32" rx="12" ry="2" fill="#006400"/>
  <!-- 帯の角を揃えるための補完 -->
  <rect x="48" y="156" width="416" height="16" fill="#006400"/>
  <rect x="48" y="308" width="416" height="16" fill="#006400"/>

  <!-- 駅名：北綾瀬（太字・緑） -->
  <text
    x="256"
    y="265"
    text-anchor="middle"
    font-family="'Noto Sans JP', 'Hiragino Kaku Gothic Pro', sans-serif"
    font-size="80"
    font-weight="bold"
    fill="#006400"
  >北綾瀬</text>

  <!-- ローマ字：Kita-Ayase（緑） -->
  <text
    x="256"
    y="302"
    text-anchor="middle"
    font-family="'Arial', 'Helvetica', sans-serif"
    font-size="26"
    font-weight="normal"
    fill="#006400"
  >Kita-Ayase</text>

  <!-- 時計アイコン（下部中央・白） -->
  <!-- 外円 -->
  <circle cx="256" cy="408" r="36" fill="white"/>
  <!-- 内円（グリーン抜き） -->
  <circle cx="256" cy="408" r="28" fill="#006400"/>
  <!-- 時計の短針 -->
  <line x1="256" y1="408" x2="256" y2="390" stroke="white" stroke-width="4" stroke-linecap="round"/>
  <!-- 時計の長針 -->
  <line x1="256" y1="408" x2="270" y2="408" stroke="white" stroke-width="4" stroke-linecap="round"/>
  <!-- 中心点 -->
  <circle cx="256" cy="408" r="3" fill="white"/>
</svg>
`

const svgBuffer = Buffer.from(svg)

const sizes = [
    { size: 512, filename: 'icon-512x512.png' },
    { size: 192, filename: 'icon-192x192.png' },
    { size: 180, filename: 'apple-touch-icon.png' },
]

for (const { size, filename } of sizes) {
    const outPath = resolve(outDir, filename)
    await sharp(svgBuffer)
        .resize(size, size)
        .png()
        .toFile(outPath)
    console.log(`生成完了: public/icons/${filename} (${size}x${size})`)
}

console.log('\nすべてのアイコンを生成しました。')
