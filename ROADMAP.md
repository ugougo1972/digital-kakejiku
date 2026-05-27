# ROADMAP.md

# digital-kakejiku Roadmap

最終更新: 2026-05-27

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
- gas/src/Code.gs 配置

## 状態

完了。

## 完了条件

- 基本文書配置完了
- Tree構造固定化
- GASコードのGitHub管理開始

---

# Phase 1 : GAS通信PoC

## 目的

ESP32 ↔ GAS ↔ Spreadsheet
通信基盤確立。

## 実施内容

- GAS WebApp 作成
- doGet / doPost 実装
- 外部POST確認
- Spreadsheet append確認
- JSON保存確認
- PowerShellからのPOST確認

## 状態

基本PoC完了。

## 確認済み事項

- GAS WebApp GET応答成功
- PowerShell外部POST成功
- Spreadsheet `RawLogs` へのappend成功
- JSON文字列保存成功
- Apps Script実行数確認済み

## 完了条件

- 外部POST成功
- Spreadsheet記録成功
- JSON保存成功

---

# Phase 1.5 : GAS Hardening / Stabilization

## 目的

ESP32実装前に、GAS受信側の安全性・検証性・保守性を高める。

## 実施内容

- secret validation
- device_id 必須化
- JSON validation
- number validation
- structured JSON response
- エラー応答整理
- Code.gs のGitHub保存

## 状態

初期hardening完了。

## 確認済み事項

- hardening版 `doPost(e)` のPowerShell POST成功
- Spreadsheet追記成功
- 実行数確認済み
- `gas/src/Code.gs` としてGitHub管理開始済み

## 残タスク

- secretの管理方法検討
- ESP32側送信処理との整合確認
- 通信失敗時のretry方針検討
- GAS URL再デプロイ時の管理方針整理

## 完了条件

- ESP32からhardening版GASへPOST成功
- エラー時の応答内容確認
- Spreadsheet記録の継続確認

---

# Phase 2 : ESP32 HTTPS POST実装

## 目的

実機ESP32からGAS WebAppへ観測データを送信する。

## 実施内容

- WiFi接続
- HTTPS POST
- JSON生成
- secret付与
- device_id付与
- GAS応答確認
- Spreadsheet記録確認
- 通信失敗時の最低限のログ出力

## 初期送信項目

- device_id
- temperature
- humidity
- pressure
- rssi
- battery
- secret

## 完了条件

- ESP32からGASへPOST成功
- Spreadsheet `RawLogs` へ記録成功
- GAS応答JSONをESP32側で確認可能
- 連続送信で異常がないことを確認

---

# Phase 3 : センサ統合

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

# Phase 4 : データ設計

## 目的

長期運用破綻回避。

## 実施内容

- Spreadsheet責務分離
- カラム固定
- retention検討
- 月次ローテーション設計
- RawLogs schema固定
- DeviceStatus schema検討

## 完了条件

- schema固定
- GAS側参照統一
- 長期ログ肥大化方針の初期決定

---

# Phase 5 : GAS高度化

## 目的

中央制御層化。

## 実施内容

- 状態集約
- Context生成
- Prompt生成
- Config返却
- エラー制御
- DeviceStatus更新
- Config読取

## 完了条件

- AI投入用context生成
- Device設定配信成功
- ESP32側がConfigを受信可能

---

# Phase 6 : Gemini連携

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
- 文体の過剰な固定化を避ける初期方針確認

---

# Phase 7 : Display PoC

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

## 現時点の扱い

E-Paper案が思想整合性の観点で優勢。  
ただし最終採択は未確定。

## 完了条件

- 安定表示
- 長時間動作
- 表示更新頻度の初期方針決定

---

# Phase 8 : UI思想統合

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
- 高FPS前提
- ダッシュボード化

---

# Phase 9 : 長期運転試験

## 目的

長期安定性検証。

## 実施内容

- 24h運転
- 1週間運転
- 通信断試験
- API quota確認
- Spreadsheet肥大化確認
- GAS timeout確認

## 完了条件

- 安定運用
- 自動復帰確認
- 記録欠損時の扱い確認

---

# Phase 10 : 筐体化

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

# Current Priority

現時点の最優先は以下。

```text
ESP32 → GAS hardening版 WebApp への HTTPS POST
```

優先順位：

1. ESP32 HTTPS POST実装
2. Spreadsheet記録確認
3. retry / error handling 方針整理
4. センサ統合
5. Gemini / Display検討再開

---

# Deferred Items

現時点では、以下は後続工程まで保留。

- Gemini最適化
- E-Paper最終選定
- LVGL本格実装
- OTA
- mmWave
- clasp
- GitHub Actions
- 自動デプロイ

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
