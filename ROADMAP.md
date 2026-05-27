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

## 現在の最優先事項

```text
ESP32 → HTTPS POST → GAS
```

## 残タスク

- ESP32側送信処理との整合確認
- 通信失敗時のretry方針検討
- secret管理方針整理
- WiFi再接続戦略整理

## 完了条件

- ESP32からhardening版GASへPOST成功
- Spreadsheet記録成功
- GAS応答JSON確認
- Serial Monitor上で異常追跡可能

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
- 通信失敗時ログ出力

## 開発方針

まずは：

```text
電源安定化
↓
Serial Monitor確認
↓
HTTPS POST
```

を優先する。

センサー統合は後段で順次行う。

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

- VOC
- 人感
- RSSI

## 方針

センサーは、
「手元にあるものから順次潰す」
方針とする。

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

---

# Phase 6 : UI統合

## 目的

観測情報表示。

## 現在有力

- E-Paper
- ジョグダイヤルUI

## UI方針

- 静的
- 緩慢
- 非常時のみ強調
- 常時アニメーション抑制

---

# Phase 7 : 省電力化 / 長期運用

## 実施内容

- deep sleep
- wake制御
- retry
- offline cache
- 電源最適化
- 18650運用最適化

---

# Phase 8 : 筐体化

## 実施内容

- 据置型筐体
- ノブ固定
- E-Paper固定
- 放熱確認
- ケーブル整理
