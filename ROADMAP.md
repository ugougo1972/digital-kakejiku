# ROADMAP.md

# digital-kakejiku Roadmap

最終更新: 2026-05-30

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

完了。

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
- PowerShell POSTとの整合確認

## 状態

完了。

## 完了条件

- ESP32からhardening版GASへPOST成功
- Spreadsheet記録成功
- GAS応答JSON確認
- Serial Monitor上で異常追跡可能

## 判定

ESP32からhardening版GASへのPOSTとSpreadsheet保存が成立したため、完了扱いとする。

---

# Phase 2 : ESP32 HTTPS POST / DeepSleep周期送信

## 目的

実機ESP32からGAS WebAppへ観測データを送信し、DeepSleepを用いた周期送信の基礎を確認する。

## 実施内容

- Wi-Fi接続
- HTTPS POST
- JSON生成
- secret付与
- device_id付与
- GAS応答確認
- Spreadsheet記録確認
- 通信失敗時ログ出力
- DeepSleep設定
- timer wakeup
- boot_count保持
- wakeup_reason記録
- 起床後Wi-Fi再接続
- 起床後POST
- Spreadsheetへの周期保存確認

## 状態

PoC完了。

## 確認済み

```text
XIAO ESP32S3 Plus
↓ DeepSleep起床
Wi-Fi接続
↓
HTTPS POST
↓
GAS WebApp
↓
Spreadsheet RawLogs
↓
DeepSleep
```

約73分間、
`boot_count` 1 から 66 までの継続記録を確認済み。

初回の `wakeup_reason` は `OTHER`、
2回目以降は `TIMER` として記録済み。

## 注意点

ESP32側のSerial Monitorでは、
Google側リダイレクト処理により `HTTP Code: 400` が表示される場合がある。

ただし、GAS実行ログとSpreadsheet保存は成立しているため、
通信・受信・保存の主経路は成立済み。

## 残タスク

- ESP32側HTTP応答処理の整理
- redirect追従設定の整理
- 成功判定条件の整理
- 通信失敗時のretry方針検討
- secret管理方針整理
- Wi-Fi再接続戦略整理
- PoCスケッチ整理

## 完了条件

- ESP32からGASへPOST成功
- Spreadsheet `RawLogs` へ記録成功
- DeepSleepからの周期起床成功
- 連続送信で欠番なく記録できること
- 異常時ログ出力方針があること

## 判定

主要完了条件は満たしたため、Phase 2はPoC完了扱いとする。
残タスクは運用安定化タスクとして継続管理する。

---

# Phase 3 : センサ統合

## 目的

固定値送信から実測値送信へ移行し、観測基盤を構築する。

## 初期対象

### 優先度A

- BME280 / BME680 系
- バッテリー電圧
- WiFi RSSI

### 優先度B

- LTR390
- CO2
- VOC
- 人感

## 方針

センサーは、
「手元にあるものから順次潰す」
方針とする。

まずは固定値を実測値へ置換し、
DeepSleep周期送信の枠組みを維持したまま確認する。

## 完了条件

- 1分周期観測
- 実測値POST
- Spreadsheet保存
- 欠損時処理確認
- センサー未接続時の処理確認

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
- raw JSON保存方針整理
- boot_count / wakeup_reason の扱い整理

---

# Phase 5 : GAS高度化

## 目的

中央制御層化。

## 実施内容

- 状態集約
- AI Prompt生成
- Device状態管理
- Config配信
- キャッシュ制御
- 要約生成
- エラー集計
- DeviceStatus更新

---

# Phase 6 : E-Paper / UI統合

## 目的

観測情報表示。

## 現在有力

- 7.5inch 800×480 E-Paper
- XIAO ePaper Breakout Board V2
- ジョグダイヤルUI

## UI方針

- 静的
- 緩慢
- 非常時のみ強調
- 常時アニメーション抑制
- 日めくりカレンダー的表示

## 実施内容

- E-Paper初期化
- 画面更新テスト
- 低頻度更新設計
- ジョグダイヤル入力
- 表示状態管理

---

# Phase 7 : 省電力化 / 長期運用

## 実施内容

- DeepSleep周期最適化
- wake制御
- retry
- offline cache
- 電源最適化
- 18650運用最適化
- バッテリー電圧監視
- 送信失敗時の再送方針

---

# Phase 8 : 筐体化

## 実施内容

- 据置型筐体
- ノブ固定
- E-Paper固定
- 放熱確認
- ケーブル整理
- 18650固定
- USB給電/充電経路整理
