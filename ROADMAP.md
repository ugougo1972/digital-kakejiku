# ROADMAP.md

# digital-kakejiku Roadmap

---

# Phase 0 : Repository / Document Setup

## 目的

設計散逸防止。

## 実施内容

- GitHub Repository 初期化
- README.md 作成
- CURRENT_STATUS.md 作成
- ROADMAP.md 作成
- docs Tree 整備

## 完了条件

- 基本文書配置完了
- Tree構造固定化

---

# Phase 1 : GAS通信PoC

## 目的

ESP32 ↔ GAS ↔ Spreadsheet
通信基盤確立。

## 実施内容

- HTTPS POST
- GAS WebApp
- Spreadsheet append
- Timestamp整形
- Error handling

## 完了条件

- 定期送信成功
- 通信断復帰成功
- Spreadsheet記録成功

---

# Phase 2 : センサ統合

## 目的

観測基盤構築。

## 初期対象

### 優先度A

- BME280
- CO2
- 照度

### 優先度B

- 音環境
- 人感
- RSSI

## 完了条件

- 1分周期観測
- 安定ログ取得
- 欠損時処理確認

---

# Phase 3 : データ設計

## 目的

長期運用破綻回避。

## 実施内容

- Spreadsheet責務分離
- カラム固定
- retention検討
- 月次ローテーション設計

## 完了条件

- schema固定
- GAS側参照統一

---

# Phase 4 : GAS高度化

## 目的

中央制御層化。

## 実施内容

- 状態集約
- Context生成
- Prompt生成
- Config返却
- エラー制御

## 完了条件

- AI投入用context生成
- Device設定配信成功

---

# Phase 5 : Gemini連携

## 目的

観測データの意味化。

## 実施内容

- Prompt template
- Context要約
- Gemini API連携
- Response保存

## 初期方針

まずは短文生成。

## 完了条件

- 30分周期生成
- ログ保存成功

---

# Phase 6 : Display PoC

## 目的

表示装置検証。

## LCD案

- LVGL
- FPS確認
- PSRAM負荷確認

## E-Paper案

- 更新速度確認
- 部分更新確認
- ゴースト確認

## 完了条件

- 安定表示
- 長時間動作

---

# Phase 7 : UI思想統合

## 目的

「情報表示」から
「観測掛軸」へ移行。

## 重視項目

- 余白
- 時間性
- 緩慢な変化
- 静止
- 行間

## 非推奨

- 常時アニメーション
- 情報過密化

---

# Phase 8 : 長期運転試験

## 目的

長期安定性検証。

## 実施内容

- 24h運転
- 1週間運転
- 通信断試験
- API quota確認
- Spreadsheet肥大化確認

## 完了条件

- 安定運用
- 自動復帰確認

---

# Phase 9 : 筐体化

## 目的

最終観測装置化。

## 実施内容

- 筐体設計
- 放熱検討
- 配線固定
- Display固定
- 電源整理

## 注意

Display変更可能性があるため、
早期固定化は避ける。

---

# Long-term Vision

本プロジェクトは：

- 単なるIoT機器
- AI表示端末
- ダッシュボード

ではなく、

「静的観測装置」

を目指す。

そのため：

- 静けさ
- 余白
- 季節性
- 時間変化

を長期的に扱う。
