# 設計書（確定版）

**プロジェクト名**：kitaayase-timetable
**作成日**：2026-05-03
**バージョン**：1.0
**保存先**：`C:\_claude\projects\kitaayase-timetable\docs\design.md`

> ⚠️ このドキュメントはソースコード・ユニットテストと常に同期を保つこと
> 変更時は3点セット（ソース・テスト・設計書）を同時に更新する

---

## 1. 概要

| 項目 | 内容 |
|---|---|
| アプリ名 | 北綾瀬 時刻表 |
| 目的 | 外出前に北綾瀬駅の次の列車まで何分かを素早く確認する |
| 対象ユーザー | 個人利用 |
| 使用タイミング | 外出直前 |
| URL | https://kitaayase-timetable-fdvl.vercel.app/ |
| リポジトリ | https://github.com/nui1971/kitaayase-timetable |

---

## 2. 画面仕様（確定版）

### 画面イメージ

| 通常表示（5本） | 展開表示（10本） |
|:---:|:---:|
| ![メイン画面](./images/screenshot-main.png) | ![展開表示](./images/screenshot-expanded.png) |

### 画面構成

| # | 領域 | 内容 |
|---|---|---|
| 1 | ヘッダー | 路線記号（C20）・駅名・ローマ字表記／現在時刻・日付（曜日） |
| 2 | ダイヤバッジ | 「平日」「土・休日」の切り替えタブ（自動＋手動） |
| 3 | フィルターバー | 行先別の表示/非表示トグル（localStorage永続化） |
| 4 | 次の列車カード | 発車時刻・行先・種別・あと何分（60分超は「X時間Y分」） |
| 5 | 列車リスト | デフォルト5本、「▼ さらに表示（+5本）」で10本に展開 |
| 6 | 翌日接続 | 残り5本未満になると「── 翌日の運行 ──」区切りで翌日先頭5本を接続 |
| 7 | フッター | データ出典表記 |

---

### 2-1. 全体

| 要素 | 値 |
|---|---|
| 背景色 | `#0d1526` |
| フォント | sans-serif |
| 最大幅 | 390px（iPhone 15 Pro 基準）・中央揃え |
| 画面構成 | 1画面完結（画面遷移なし・スクロールのみ） |

---

### 2-2. ヘッダー

| 要素 | 値 |
|---|---|
| padding | 14px 16px 10px |
| border-bottom | 0.5px solid rgba(255,255,255,0.08) |
| C20バッジ | background `#006400`・color `#fff`・font-size 11px・font-weight 500・padding 2px 7px・border-radius 4px |
| 駅名「北綾瀬」 | color `#fff`・font-size 24px・font-weight 700 |
| ローマ字「Kita-Ayase」 | color `#8a9bb5`・font-size 11px・margin-top 2px |
| 現在時刻 | color `#fff`・font-size 32px・font-weight 300（秒なし・1分ごと更新） |
| 日付 | color `#8a9bb5`・font-size 11px・右寄せ・形式：YYYY/MM/DD (曜) |
| 終電後（hours≥5） | 「YYYY/MM/DD (曜) → 翌 MM/DD (曜)」 |
| 深夜切替（hours＜5） | 「YYYY/MM/DD (曜)」のみ（翌日矢印なし） |

---

### 2-3. ダイヤバッジエリア

| 要素 | 値 |
|---|---|
| padding | 10px 16px 4px |
| 選択中バッジ | background `#006400`・color `#fff`・font-size 12px・font-weight 500・padding 4px 12px・border-radius 6px |
| 非選択バッジ | background `rgba(255,255,255,0.07)`・color `#8a9bb5`・font-size 11px |
| 自動切替 | 月〜金：平日・土日祝：土・休日 |
| 手動切替 | タップで切替可能 |

---

### 2-4. フィルターエリア

| 要素 | 値 |
|---|---|
| padding | 5px 16px 8px |
| チェックボックス | accent-color `#006400`・14px |
| ラベル | 「綾瀬行を表示しない」・color `#c8d6e8`・font-size 12px |
| 永続化 | localStorage に保存・次回起動時も維持 |

---

### 2-5. 次の列車カード

`<main>` の外（フレックスレイアウト内の固定領域）に配置するため、リストをスクロールしても常に表示される。

| 要素 | 値 |
|---|---|
| コンポーネント | `NextTrainCard.tsx`（独立コンポーネント） |
| 配置 | FilterBar と main の間（スクロール対象外） |
| margin | 12px 16px 0 |
| background | `linear-gradient(135deg, #0f2a4a, #0a2040)` |
| border | 0.5px solid rgba(0,100,0,0.5) |
| border-radius | 12px |
| padding | 14px 16px |
| 「次の列車」ラベル | color `#4a9e6a`・font-size 12px・margin-bottom 6px |
| 時刻 | color `#fff`・font-size 42px・font-weight 300 |
| 行き先 | color `#fff`・font-size 18px・font-weight 500 |
| 種別バッジ | 下記バッジ仕様参照 |
| レイアウト | 時刻・行き先・種別を1行横並び（gap 10px・flex-wrap） |
| 「あと XX 分」 | color `#4a9e6a`・font-size 16px・font-weight 500 |

---

### 2-6. 種別バッジ

| 種別 | background | color |
|---|---|---|
| 普通 | `#3a4a5a` | `#c8d6e8` |
| 準急 | `#1a3a7a` | `#90b8f0` |
| 急行 | `#7a1a1a` | `#f09090` |

共通：font-size 10px・font-weight 500・padding 2px 7px・border-radius 4px・white-space nowrap

---

### 2-7. 列車リスト

| 要素 | 値 |
|---|---|
| ヘッダー | 「綾瀬・代々木上原方面」・color `#c8d6e8`・font-size 11px・font-weight 500 |
| padding | 0 16px 10px・gap 5px |
| 各行 padding | 9px 12px・border-radius 9px |
| 先頭行 | background `rgba(0,100,0,0.18)`・border `0.5px solid rgba(0,100,0,0.35)` |
| その他の行 | background `rgba(255,255,255,0.04)` |
| 時刻 | color `#fff`・font-size 18px・font-weight 300・min-width 46px |
| 行き先 | color `#c8d6e8`・font-size 11px・flex 1 |
| XX分後（先頭） | color `#4a9e6a`・font-size 11px・font-weight 500 |
| XX分後（その他） | color `#8a9bb5`・font-size 11px・font-weight 500 |
| デフォルト表示 | 5本 |

---

### 2-8. 展開ボタン

| 状態 | テキスト |
|---|---|
| 閉じているとき | 「▼ さらに表示（+5本）」 |
| 開いているとき | 「▲ 追加分を非表示」 |

| 要素 | 値 |
|---|---|
| margin | 0 16px 14px |
| padding | 8px |
| background | `rgba(255,255,255,0.04)` |
| border-radius | 8px |
| color | `#8a9bb5`・font-size 11px・中央揃え |
| 展開後 | +5本（合計10本）表示 |

---

### 2-9. 分後の表示形式

| 条件 | 表示形式 |
|---|---|
| 60分未満 | 「XX分後」 |
| 60分ちょうど | 「1時間後」 |
| 60分超 | 「X時間YY分後」 |

次の列車カードの「あとXX分」も同形式（「あと X時間Y分」）。

---

## 3. 機能仕様

### 3-1. 現在時刻管理

| 項目 | 仕様 |
|---|---|
| タイムゾーン | Asia/Tokyo（日本時間） |
| 更新頻度 | 1分ごと |
| カスタムフック | `useCurrentTime.ts` |

---

### 3-2. 列車フィルタリング

**入力**

```typescript
trains: Train[]          // 時刻表データ
now: { hour: number, minute: number }  // 現在時刻
hideAyase: boolean       // 綾瀬行非表示フラグ
```

**処理**

```
1. 現在時刻より後の列車を抽出
2. hideAyase が true の場合、綾瀬行きを除外
3. 結果が0件（終電後）の場合は翌日ダイヤに切替
```

**出力**

```typescript
Train[]  // フィルタリング済み列車配列（時刻順）
```

**テスト条件**

| ケース | 入力 | 期待する出力 |
|---|---|---|
| 通常 | 18:24 | 18:26以降の列車 |
| フィルターあり | 18:24・綾瀬非表示 | 18:26以降・綾瀬行除外 |
| 終電後（平日） | 00:16 | 翌日ダイヤの全列車 |
| 金曜終電後 | 00:16 | 土休日ダイヤ |
| 日曜終電後 | 00:13 | 平日ダイヤ |

---

### 3-3. 終電後の翌日ダイヤ切替

| 条件 | 動作 |
|---|---|
| 当日の残り列車が0件 | 翌日ダイヤに自動切替 |
| 翌日が月〜金 | 平日ダイヤ |
| 翌日が土日祝 | 土休日ダイヤ |
| ヘッダー表示（通常時） | 「2026/05/01 (金)」 |
| ヘッダー表示（終電後・hours≥5） | 「2026/05/01 (金) → 翌 05/02 (土)」 |
| ヘッダー表示（深夜切替・hours＜5） | 「2026/05/03 (日)」（翌日矢印なし） |

---

### 3-4. 深夜帯の翌日接続表示

| 状態 | 条件 | 動作 |
|---|---|---|
| 通常 | 残り5本以上 | 当日の列車のみ表示 |
| 接続表示 | 残り5本未満（終電前） | 当日残り ＋「── 翌日の運行 ──」＋ 翌日先頭5本 |
| 翌日切替 | 終電通過後（残り0本） | 翌日ダイヤのみ表示 |

サービス日の定義：0〜4時台は前日のサービス日（例：日曜00:30 → 土曜ダイヤ）

---

### 3-5. フィルター永続化

| 項目 | 仕様 |
|---|---|
| 保存先 | localStorage |
| キー名 | `kitaayase_hide_ayase` |
| 値 | `true` / `false` |
| タイミング | チェックボックス変更時に即時保存 |
| 読み込み | アプリ起動時 |

---

## 4. データ仕様

### 4-1. 型定義

```typescript
export type TrainType = '普通' | '準急' | '急行'
export type DayType = 'weekday' | 'holiday'

export interface Train {
  hour: number        // 0〜23
  minute: number      // 0〜59
  destination: string // 行き先（例：綾瀬・代々木上原）
  trainType: TrainType
}

export interface Timetable {
  weekday: Train[]
  holiday: Train[]
}
```

---

### 4-2. ODPT API

| 項目 | 値 |
|---|---|
| エンドポイント | `https://api.odpt.org/api/v4/odpt:StationTimetable` |
| 駅 | `odpt.Station:TokyoMetro.Chiyoda.KitaAyase` |
| 方向 | 北綾瀬は終点のため方向フィルタ不要 |
| 認証 | `acl:consumerKey`（環境変数 `VITE_ODPT_TOKEN`） |
| キャッシュ | sessionStorage・キー：`odpt_timetable_weekday` / `odpt_timetable_holiday` |
| フォールバック | API失敗時はハードコードデータを使用 |

**駅名マッピング**

| ODPT値 | 表示名 |
|---|---|
| `odpt.Station:TokyoMetro.Chiyoda.Ayase` | 綾瀬 |
| `odpt.Station:TokyoMetro.Chiyoda.YoyogiUehara` | 代々木上原 |
| `odpt.Station:TokyoMetro.Chiyoda.Kasumigaseki` | 霞ケ関 |
| `odpt.Station:TokyoMetro.Chiyoda.MeijiJingumae` | 明治神宮前 |
| `odpt.Station:Odakyu.Odawara.SeijogakuenMae` | 成城学園前 |
| `odpt.Station:Odakyu.Odawara.MukogaokaYuen` | 向ケ丘遊園 |
| `odpt.Station:Odakyu.Odawara.Isehara` | 伊勢原 |
| `odpt.Station:Odakyu.Odawara.SagamiOno` | 相模大野 |
| `odpt.Station:Odakyu.Tama.Karakida` | 唐木田 |

**種別マッピング**

| ODPT値 | 表示名 |
|---|---|
| `odpt.TrainType:TokyoMetro.Local` | 普通 |
| `odpt.TrainType:TokyoMetro.SemiExpress` | 準急 |
| `odpt.TrainType:TokyoMetro.Express` | 急行 |
| その他 | 普通 |

---

## 5. 技術スタック（確定版）

| レイヤー | 技術 | バージョン |
|---|---|---|
| フレームワーク | React | v19.x |
| 言語 | TypeScript | v5.8.x |
| ビルドツール | Vite | v8.x |
| テスト | Vitest + React Testing Library | v4.x |
| ホスティング | Vercel（無料プラン） | - |
| 外部API | ODPT（公共交通オープンデータセンター） | v4 |
| バージョン管理 | GitHub（Public） | - |

---

## 6. ファイル構成

```
kitaayase-timetable/
├── src/
│   ├── data/
│   │   └── timetable.ts          # 時刻表データ・型定義・ハードコード
│   ├── services/
│   │   └── timetableService.ts   # ODPT API取得・キャッシュ・フォールバック
│   ├── components/
│   │   ├── Header.tsx            # ヘッダー（駅名・現在時刻）
│   │   ├── DayBadge.tsx          # 平日／土休日バッジ
│   │   ├── FilterBar.tsx         # フィルターエリア
│   │   ├── TrainList.tsx         # 列車リスト全体・展開ボタン
│   │   └── TrainRow.tsx          # 1列車の行
│   ├── hooks/
│   │   ├── useCurrentTime.ts     # 現在時刻（1分ごと更新）
│   │   ├── useTimetable.ts       # フィルタリング・翌日切替・サービス日計算
│   │   └── useFilter.ts          # 行先フィルター・localStorage永続化
│   ├── test/
│   │   ├── setup.ts
│   │   ├── useCurrentTime.test.ts
│   │   ├── useTimetable.test.ts
│   │   ├── useFilter.test.ts
│   │   └── timetableService.test.ts
│   ├── App.tsx
│   ├── index.css
│   └── main.tsx
├── docs/
│   ├── design.md                 # このファイル（設計書確定版）
│   └── images/
│       ├── screenshot-main.png   # 通常表示（5本）
│       └── screenshot-expanded.png # 展開表示（10本）
├── .env                          # 環境変数（Git管理外）
├── .env.example                  # 環境変数サンプル（Git管理）
├── vite.config.ts
├── tsconfig.app.json
└── package.json
```

---

## 7. 環境変数

| 変数名 | 用途 | 保存場所 |
|---|---|---|
| `VITE_ODPT_TOKEN` | ODPT APIアクセストークン | `.env`（Git管理外） |

> 実際のトークン値は `C:\_claude\tools\api-keys.md` に記録

---

## 8. 運用ルール

### デプロイ手順

```powershell
# ローカルでビルド確認してからpush
npm run build
git add .
git commit -m "fix: [変更内容]"
git push
# → Vercel が自動でビルド・デプロイ（約30秒）
```

### 更新時のルール

```
コード変更
  → ユニットテストを更新（npm run test:run で確認）
  → 設計書（このファイル）を更新
  → git push
```

### ダイヤ改正時の対応

```
1. ODPT API が自動対応（API版）
2. ハードコードデータを更新（フォールバック用）
3. 設計書のデータ仕様を確認・更新
```

---

## 9. 既知の問題・今後の課題

| # | 内容 | 優先度 | 状態 |
|---|---|---|---|
| 1 | 他駅（綾瀬）への拡張 | ⚪ | 別アプリとして作成予定 |
| 2 | 通知機能（出発N分前） | ⚪ | 将来対応 |
| 3 | オフライン対応 | ⚪ | 将来対応 |

---

## 10. 変更履歴

| 日付 | バージョン | 変更内容 |
|---|---|---|
| 2026-05-01 | 0.1 | 初回リリース（ハードコード版） |
| 2026-05-01 | 0.2 | PWA設定追加 |
| 2026-05-01 | 0.3 | ODPT API切り替え |
| 2026-05-03 | 1.0 | UIデザイン確定・設計書作成 |
| 2026-05-04 | 1.1 | 画面イメージ・画面構成を追加 |
| 2026-05-04 | 1.2 | 次の列車カードを main 外の固定領域に移動（sticky 廃止） |
