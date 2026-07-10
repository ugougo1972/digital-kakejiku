# digital-kakejiku ROADMAP

最終更新: 2026-07-10
文書版: vNext 1.4 hardware-power reflected

---

# 1. 目的

本書は digital-kakejiku の開発計画およびマイルストーン管理の基準文書である。

現在の実施状況は

CURRENT_STATUS.md

を参照する。

詳細設計については

- 01_HARDWARE_OVERVIEW.md
- 05_WIRING_DIAGRAM.md
- 08_POWER_ARCHITECTURE.md

を基準源とする。

---

# 2. 現在位置

## 現在フェーズ

```text
Phase 1
GAS本実装
```

状態

```text
IN_PROGRESS
```

---

## 並行作業

現在は

```text
Phase 2前提作業

・電源基板配線設計
・電源基板PoC
・本体基板設計
・GitHub文書更新
```

を並行して実施している。

---

## 現在の優先順位

### 1位

GAS本実装

---

### 2位

電源基板PoC

---

### 3位

本体基板設計

---

### 4位

GitHub文書更新

---

## 電源基板PoC工程

```text
電源基板配線最終確認
        │
        ▼
テストポイント追加
        │
        ▼
導通確認
        │
        ▼
無負荷通電
        │
        ▼
5V_BUS確認
        │
        ▼
TPS63802入力確認
        │
        ▼
3.3V_OUT確認
        │
        ▼
XIAO単体起動
        │
        ▼
USB通信確認
```

---

# 3. Phase 1

## Goal

Phase1では

Google Apps Script

を完成させる。

---

## 実装対象

- Spreadsheet Schema
- ConfigManager
- SecurityManager
- LogSubsystem
- ApiGateway
- CalendarSubsystem
- PoemSubsystem
- JobScheduler
- MaintenanceHandler
- 結合試験

---

## 完了条件

以下を満たすこと。

### Calendar

- Calendar生成成功
- CALENDAR_PENDING制御成功
- Retry制御成功

---

### Poem

- Gemini生成成功
- Prompt Version管理
- Poem Cache運用

---

### Log

- observation_log
- event_log
- error_log
- system_log

正常保存。

---

### Security

- API_SECRET確認
- Script Properties確認
- 機密情報非出力

---

### Spreadsheet

以下が初期化されること。

- system_config
- source_config
- calendar_master
- poem_cache

---

## Phase1実施中の並行作業

Phase1期間中に

以下を同時進行する。

### ハードウェア

- 電源基板PoC
- 本体基板設計
- センサー配置検討

---

### ドキュメント

以下を

vNext 1.4

へ更新する。

- README.md
- CURRENT_STATUS.md
- ROADMAP.md
- 01_HARDWARE_OVERVIEW.md
- 05_WIRING_DIAGRAM.md
- 08_POWER_ARCHITECTURE.md

これらは

相互整合性を維持する。

---

# 4. Phase1追加反映項目

## 査読反映済み

以下はPhase1開始前に設計へ反映済みである。

### Gemini

- Prompt Template
- Prompt Version管理
- Prompt再生成方針

---

### Retry

- Error Retry Strategy
- Temporary Error制御
- Unknown Error制御
- 最大Retry回数
- Retry待機時間

---

### GAS

- Trigger運用
- Script Properties
- system_config
- source_config

---

### Security

- API_SECRET運用
- Secretローテーション
- 機密情報ログ出力禁止

---

### Spreadsheet

- observation_log
- event_log
- error_log
- system_log
- calendar_master
- poem_cache

スキーマを確定済み。

---

# 5. Phase1運用準備

Phase1実装中に

以下を確認する。

## GAS

- Trigger作成
- Trigger実行
- Retry動作
- エラー通知

---

## Script Properties

以下が設定されていること。

- SPREADSHEET_ID
- API_SECRET
- GEMINI_API_KEY
- ADMIN_PASSWORD_HASH

---

## Config

以下が初期化されること。

### system_config

- 初期値生成
- 読込確認
- 更新確認

---

### source_config

- 初期値生成
- 読込確認

---

## Log

以下を確認する。

- observation_log
- event_log
- error_log
- system_log

---

## Troubleshooting

障害発生時に

17_TROUBLESHOOTING.md

だけで

原因追跡できること。

---

# 6. Phase2前提作業

## 電源基板PoC

ESP32統合前に

電源基板を単独で評価する。

---

## 対象

- USB Type-C
- PTC
- IP5306
- 18650
- DMG2305UX-13
- TPS63802
- 5V_BUS
- 3.3V_OUT
- Battery_SENSE
- 5V_SENSE
- USB D+/D-
- テストポイント

---

## 正式仕様

### 電源構成

```text
USB Type-C
      │
      ▼
PTC
      │
      ▼
IP5306
 ├────18650
 │
 └────OUT_5V
          │
          ▼
DMG2305UX-13
          │
          ▼
5V_BUS
      ├────────5V_OUT
      ├────────5V_SENSE
      └────────TPS63802
                   │
                   ▼
              3.3V_OUT
```

---

### GND設計

採用するGNDは

- 5V_GND
- 3.3V_GND
- SENSE_GND

電源基板上では

見かけ上完全分離

する。

一点接続は

本体基板

XIAO ESP32S3 Plus近傍

のみとする。

TPS63802内部導通は

設計対象外とする。

---

### TPS63802

正式仕様

- 外側ホール：主配線
- 内側ホール：コンデンサ接続
- 入力470µF＋0.1µF
- 出力220µF＋0.1µF

---

### DMG2305UX-13

正式接続

- Source＝OUT_5V
- Drain＝5V_BUS
- Gate＝100kΩ→5V_GND

---

## 完了条件

以下をすべて満たすこと。

### 導通

- 電源短絡なし
- 5V_BUS短絡なし
- 3.3V_OUT短絡なし

---

### GND

- 5V_GND
- 3.3V_GND
- SENSE_GND

が

電源基板上で

独立していること。

---

### 電源

- USB入力確認
- IP5306確認
- DMG2305UX-13確認
- TPS63802確認
- 5V_BUS確認
- 3.3V_OUT確認

---

### 測定

- Battery_SENSE確認
- 5V_SENSE確認

---

### 起動

- XIAO単体起動
- USB通信確認

---

# 7. Phase2

## Goal

Phase2では

ESP32実機統合を完了する。

```text
ESP32
    │
 HTTPS
    ▼
Google Apps Script
    │
Google Spreadsheet
```

---

## 実装対象

### 通信

- Wi-Fi
- HTTPS POST
- Payload送信
- Retry制御
- API応答処理

---

### 表示

- E-Paper更新
- Home画面
- Detail画面
- Diagnostic画面
- Calendar表示
- Poem表示

---

### 背面UI

- OLED表示
- Rotary Encoder操作
- システム状態表示
- 保守メニュー
- 詩の再生成

---

## Phase2開始条件

以下が完了していること。

### GAS

- Phase1完了

---

### 電源

- 電源基板PoC完了
- UPS切替確認
- 5V_BUS確認
- 3.3V_OUT確認

---

### USB

- USB通信確認
- USB給電確認

---

### センサー

- I2C動作確認
- I2S動作確認

---

# 8. Phase3

## Goal

表示統合を完了する。

対象

- Home
- Detail
- Diagnostic
- Calendar
- Poem
- 背面UI

---

## 完了条件

- 表示時Poem再生成なし
- Calendar取得失敗時表示確認
- Poem取得失敗時表示確認
- Battery Mode表示制御確認

---

# 9. Phase4

## Goal

長期運用試験

評価項目

- Calendar成功率
- Poem成功率
- Retry成功率
- error_log傾向
- GAS実行時間
- UPS動作
- RTC動作
- 電源安定性

---

## 完了条件

30日以上

連続安定動作。

---

# 10. Phase5

## Goal

製品完成

対象

- 筐体
- 配線整理
- 通気
- 放熱
- 背面UI操作性
- 保守性

---

## 完了条件

初号機完成。

---

# 11. 優先順位

## Highest

- GAS
- Spreadsheet
- Calendar
- Poem
- Retry
- Troubleshooting

---

## High

- 電源基板PoC
- ESP32統合
- E-Paper
- 背面UI

---

## Medium

- センサー配置
- 本体基板レイアウト
- I2S最適化
- 熱設計評価

---

## Low

- 筐体意匠
- 長期拡張
- 将来機能

---

# 12. STATUS

| Phase | 状態 |
|--------|------|
| Phase0 設計 | COMPLETE |
| Phase1 GAS本実装 | IN_PROGRESS |
| Phase2前提 電源基板PoC | IN_PROGRESS |
| Phase2 ESP32統合 | PENDING |
| Phase3 表示統合 | PENDING |
| Phase4 長期運用試験 | PENDING |
| Phase5 製品完成 | PENDING |

---

## 現在の重点作業

優先順位

1. GAS本実装
2. 電源基板PoC
3. 本体基板設計
4. GitHub文書更新
5. ESP32統合

---

# 13. CHANGE LOG

| 日付 | 内容 |
|------|------|
| 2026-06-20 | vNext 1.2としてPhase計画を全面整理 |
| 2026-06-20 | Phase1運用準備を追加 |
| 2026-06-20 | Phase2前確認事項を追加 |
| 2026-06-25 | D11〜D19側面ランド利用、裏面ランド原則禁止を反映 |
| 2026-06-29 | 電源基板PoC先行、USB D+/D-、DMG2305UX-13、テストポイントを反映 |
| 2026-07-10 | USB Type-C（CC1/CC2 5.1kΩ実装済み）を正式仕様化 |
| 2026-07-10 | 電源構成を「USB Type-C→PTC→IP5306→DMG2305UX-13→5V_BUS→TPS63802→3.3V_OUT」へ更新 |
| 2026-07-10 | DMG2305UX-13接続（Source＝OUT_5V、Drain＝5V_BUS、Gate＝100kΩ→5V_GND）を反映 |
| 2026-07-10 | TPS63802同名2ホール運用（外側：主配線、内側：コンデンサ接続）を反映 |
| 2026-07-10 | GND設計を「5V_GND・3.3V_GND・SENSE_GNDを電源基板上で見かけ上完全分離、本体基板XIAO近傍で一点接続」へ更新 |
| 2026-07-10 | TPS63802入力470µF・出力220µF・0.1µF構成を正式仕様化 |
| 2026-07-10 | ROADMAPをvNext 1.4として全面再構成し、Phase1～Phase5計画を最新設計へ更新 |