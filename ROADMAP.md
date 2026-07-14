# digital-kakejiku ROADMAP

最終更新: 2026-07-14
文書版: vNext 1.5 Roadmap

---

# 1. 本書の目的

本書は digital-kakejiku プロジェクトの中長期開発計画を管理する基準文書である。

本書では、

- 開発ロードマップ
- 各Phaseの目的
- 完了条件
- マイルストーン
- 開発優先順位

を定義する。

現在の進捗状況については **CURRENT_STATUS.md** を参照する。

ハードウェア仕様およびソフトウェア仕様については各設計文書を基準源とする。

---

# 2. 現在位置

## 2.1 開発フェーズ

現在の開発位置を以下に示す。

```text
Phase1
GAS基盤整備
      │
      ├─────────────┐
      ▼             ▼
本体基板設計     GitHub文書更新
      │
      ▼
筐体設計
      │
      ▼
統合試験
```

電源基板PoCは完了しており、本体基板設計および筐体設計へ移行している。

---

## 2.2 現在のマイルストーン

```text
✓ システム設計

✓ Spreadsheet構築

✓ GAS基盤

✓ 電源基板PoC

▶ 本体基板設計

▶ 筐体設計

□ 実負荷試験

□ 長期連続試験

□ 初号機完成
```

---

## 2.3 現在の重点作業

現在の優先順位を以下に示す。

| 優先 | 作業 |
|------|------|
| 1 | 本体基板設計 |
| 2 | 筐体設計 |
| 3 | GitHub文書更新 |
| 4 | GAS実装継続 |
| 5 | 実負荷試験準備 |

---

# 3. 開発全体ロードマップ

## Phase0

### システム設計

目的

- 要件定義
- アーキテクチャ設計
- 部品選定
- ドキュメント整備

状態

```text
COMPLETED
```

---

## Phase1

### GAS基盤構築

目的

Google Apps Script を中心としたソフトウェア基盤を完成させる。

主な成果物

- Spreadsheet Schema
- ConfigManager
- SecurityManager
- LogSubsystem
- ApiGateway
- CalendarSubsystem
- PoemSubsystem

状態

```text
IN PROGRESS
```

---

## Phase2

### ハードウェア完成

目的

実機ハードウェアを完成させる。

現在位置

```text
✓ 電源基板PoC

▶ 本体基板設計

▶ 筐体設計

□ 基板製作

□ センサー統合

□ 実負荷試験
```

---

## Phase3

### システム統合

目的

ハードウェア・ソフトウェアを統合し、全機能を動作させる。

対象

- ESP32
- GAS
- E-Paper
- センサー
- OLED
- Rotary Encoder

状態

```text
PENDING
```

---

## Phase4

### 長期評価

目的

長期間の安定運転を確認する。

対象

- UPS
- 通信
- センサー
- RTC
- 電源
- ログ

状態

```text
PENDING
```

---

## Phase5

### Release

目的

初号機完成。

成果物

- 完成筐体
- GitHubドキュメント
- ソースコード
- 運用手順

状態

```text
PENDING
```

# 4. Phase1：ソフトウェア基盤構築

## 4.1 目的

Google Apps Script を中心としたクラウド側の基盤を完成させる。

ESP32実機に依存しない部分を先行実装し、ハードウェア完成後すぐに統合試験へ移行できる状態を目標とする。

---

## 4.2 成果物

- Spreadsheet Schema
- ConfigManager
- SecurityManager
- LogSubsystem
- ApiGateway
- CalendarSubsystem
- PoemSubsystem
- JobScheduler
- MaintenanceHandler

---

## 4.3 完了済み

以下は完了している。

- Spreadsheet設計
- Spreadsheet初期化
- Script Properties
- ConfigManager動作確認
- HealthCheck
- SystemLogger
- ErrorLogger
- Retry Strategy
- Gemini Prompt設計

---

## 4.4 残作業

- ConfigManager完成
- SecurityManager
- LogSubsystem
- ApiGateway
- CalendarSubsystem
- PoemSubsystem
- JobScheduler
- MaintenanceHandler
- 統合試験

---

## 4.5 完了条件

以下を満たした時点でPhase1完了とする。

- GAS主要モジュール完成
- Calendar生成成功
- Poem生成成功
- Retry動作確認
- ログ保存確認
- セキュリティ確認

---

# 5. Phase2：ハードウェア完成

## 5.1 目的

実機ハードウェアを完成させ、ESP32との統合試験が可能な状態にする。

---

## 5.2 完了済み

### 電源基板PoC

以下を確認済み。

- USB単独動作
- 18650単独動作
- UPS切替
- 5V出力
- 3.3V出力
- Battery_SENSE
- 5V_SENSE
- 導通確認
- 短絡確認

---

## 5.3 現在実施中

現在の主工程。

```text
▶ 本体基板設計

▶ 筐体設計
```

---

## 5.4 今後の工程

```text
本体基板設計
        │
        ▼
基板製作
        │
        ▼
センサー実装
        │
        ▼
筐体組立
        │
        ▼
実負荷試験
```

---

## 5.5 完了条件

- 本体基板完成
- 筐体完成
- 全センサー搭載
- UPS正常動作
- ESP32起動
- E-Paper表示
- OLED動作

---

# 6. Phase3：システム統合

## 6.1 目的

ハードウェア・ソフトウェアを統合し、システム全体として動作させる。

---

## 6.2 統合対象

### ハードウェア

- ESP32
- RTC
- E-Paper
- OLED
- Rotary Encoder
- センサー群

### ソフトウェア

- GAS
- Spreadsheet
- Calendar
- Gemini
- LogSubsystem

---

## 6.3 評価項目

以下を確認する。

### 通信

- HTTPS通信
- Retry
- エラー処理

### 表示

- Home
- Calendar
- Poem
- Diagnostic

### センサー

- I2C
- I2S
- ADC

### 電源

- UPS
- Battery Mode
- USB Mode

---

## 6.4 完了条件

- 全センサー正常動作
- Calendar正常表示
- Poem正常表示
- OLED保守メニュー動作
- USB通信正常
- GAS連携正常
- エラー復旧正常

# 7. Phase4：長期評価

## 7.1 目的

完成したシステムを長期間運転し、信頼性および保守性を評価する。

本フェーズでは、新機能の追加ではなく品質確認を主目的とする。

---

## 7.2 評価項目

### 電源

- UPS切替安定性
- Battery運転時間
- 5V安定性
- 3.3V安定性
- TPS63802温度
- DMG2305UX-13温度

---

### センサー

- 長時間測定安定性
- I2C通信安定性
- I2Sノイズ
- Battery_SENSE精度
- 5V_SENSE精度

---

### 通信

- HTTPS成功率
- Retry成功率
- GAS応答時間
- Spreadsheet書込み成功率

---

### 表示

- E-Paper更新時間
- ゴースト発生状況
- OLED動作安定性

---

### システム

- RTC時刻維持
- DeepSleep復帰
- ログ保存
- エラー復旧
- 長時間無停止運転

---

## 7.3 完了条件

以下を満たした時点でPhase4を完了とする。

- 30日以上連続運転
- 致命的障害なし
- データ欠損なし
- 電源異常なし
- センサー異常なし

---

# 8. Phase5：Release

## 8.1 目的

初号機を完成させ、運用可能な状態とする。

---

## 8.2 完成条件

ハードウェア

- 本体基板完成
- 電源基板完成
- 筐体完成
- 全センサー搭載

---

ソフトウェア

- GAS完成
- ESP32完成
- 表示完成
- 保守UI完成

---

ドキュメント

- README
- CURRENT_STATUS
- ROADMAP
- Hardware
- Software
- Wiring
- Power

最新版へ更新済みであること。

---

## 8.3 Release成果物

完成時には以下を成果物とする。

- GitHub Repository
- ESP32 Firmware
- GAS Project
- Spreadsheet Template
- 配線図
- 組立手順
- 保守手順
- テスト結果

---

# 9. 開発優先順位

## 9.1 現在

現在の優先順位は以下とする。

| 優先 | 作業 |
|------|------|
| 1 | 本体基板設計 |
| 2 | 筐体設計 |
| 3 | GitHub文書更新 |
| 4 | GAS実装 |
| 5 | 実負荷試験準備 |

---

## 9.2 ハードウェア

```text
本体基板設計
      │
      ▼
基板製作
      │
      ▼
センサー実装
      │
      ▼
実負荷試験
      │
      ▼
長期評価
```

---

## 9.3 ソフトウェア

```text
ConfigManager
      │
      ▼
SecurityManager
      │
      ▼
LogSubsystem
      │
      ▼
ApiGateway
      │
      ▼
CalendarSubsystem
      │
      ▼
PoemSubsystem
      │
      ▼
統合試験
```

---

## 9.4 ドキュメント

GitHub文書は以下の順序で更新する。

1. 01_HARDWARE_OVERVIEW.md
2. CURRENT_STATUS.md
3. README.md
4. ROADMAP.md
5. 05_WIRING_DIAGRAM.md
6. 08_POWER_ARCHITECTURE.md
7. DISCUSSION（筐体構造刷新）

---

## 9.5 開発方針

開発は以下を基本原則とする。

- ハードウェアとソフトウェアを並行開発する。
- GitHubを唯一の設計情報管理基盤とする。
- ドキュメントを先行更新してから実装する。
- 設計変更時は関連文書を同時更新する。
- 保守性・再現性・拡張性を優先する。

# 10. STATUS

## 10.1 開発フェーズ

| Phase | 名称 | 状態 |
|--------|------|------|
| Phase0 | システム設計 | COMPLETED |
| Phase1 | ソフトウェア基盤構築 | IN_PROGRESS |
| Phase2 | ハードウェア完成 | IN_PROGRESS |
| Phase3 | システム統合 | PENDING |
| Phase4 | 長期評価 | PENDING |
| Phase5 | Release | PENDING |

---

## 10.2 現在のマイルストーン

| 項目 | 状態 |
|------|------|
| システム設計 | COMPLETED |
| Spreadsheet基盤 | COMPLETED |
| GAS基盤 | IN_PROGRESS |
| 電源基板PoC | COMPLETED |
| 本体基板設計 | IN_PROGRESS |
| 筐体設計 | IN_PROGRESS |
| 実負荷試験 | PENDING |
| 長期評価 | PENDING |
| 初号機完成 | PENDING |

---

## 10.3 ハードウェア

| 項目 | 状態 |
|------|------|
| MCU構成 | FINALIZED |
| 電源構成 | FINALIZED |
| 電源基板PoC | COMPLETED |
| 本体基板設計 | IN_PROGRESS |
| 筐体設計 | IN_PROGRESS |
| センサー統合 | PENDING |
| 実負荷試験 | PENDING |

---

## 10.4 ソフトウェア

| 項目 | 状態 |
|------|------|
| Spreadsheet | COMPLETED |
| ConfigManager | IMPLEMENTING |
| SecurityManager | IMPLEMENTING |
| LogSubsystem | IMPLEMENTING |
| ApiGateway | IMPLEMENTING |
| CalendarSubsystem | PENDING |
| PoemSubsystem | PENDING |

---

## 10.5 ドキュメント

| 文書 | 状態 |
|------|------|
| README.md | IN_PROGRESS |
| CURRENT_STATUS.md | IN_PROGRESS |
| ROADMAP.md | IN_PROGRESS |
| 01_HARDWARE_OVERVIEW.md | IN_PROGRESS |
| 05_WIRING_DIAGRAM.md | PENDING |
| 08_POWER_ARCHITECTURE.md | PENDING |

---

## 10.6 現在位置

```text
✓ システム設計

✓ Spreadsheet

✓ 電源基板PoC

▶ 本体基板設計

▶ 筐体設計

▶ GitHub文書更新

□ 実負荷試験

□ システム統合

□ 長期評価

□ Release
```

---

# 11. CHANGE LOG

| 日付 | 内容 |
|------|------|
| 2026-06-20 | Phase管理文書として初版作成 |
| 2026-06-25 | GPIO・USB・ハードウェア方針を反映 |
| 2026-06-29 | 電源基板PoC計画を反映 |
| 2026-07-10 | 電源アーキテクチャ更新に伴いPhase計画を改訂 |
| 2026-07-10 | USB Type-C・DMG2305UX-13・TPS63802仕様を反映 |
| 2026-07-10 | GND設計および電源PoC手順を更新 |
| 2026-07-14 | 電源基板PoC完了を反映 |
| 2026-07-14 | 本体基板設計・筐体設計開始を反映 |
| 2026-07-14 | 20シリーズアルミフレーム筐体を正式仕様へ反映 |
| 2026-07-14 | 開発マイルストーンを全面更新 |
| 2026-07-14 | ROADMAP.md を vNext 1.5 として全面再構成 |