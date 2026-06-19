# digital-kakejiku

据置型環境観測・暦表示・詩生成システム

最終更新: 2026-06-19

---

# 概要

digital-kakejiku は据置型観測端末である。

目的。

* 環境観測
* 長期記録
* 暦表示
* 今日の詩表示
* 生活支援

特徴。

* 常時稼働
* UPS運用
* Google Apps Script 中央集権構成
* Spreadsheet蓄積
* Calendar Subsystem
* Poem Subsystem
* 長期運用前提

---

# システム構成

```text
Sensors
   ↓
XIAO ESP32S3 Plus
   ↓ HTTPS
Google Apps Script
   ├─ ApiGateway
   ├─ LogManager
   ├─ ConfigManager
   ├─ CalendarSubsystem
   └─ PoemSubsystem
   ↓
Google Spreadsheet
   ↓
E-Paper Display
```

---

# 現在位置

現在フェーズ。

```text
Phase 1
GAS本実装
```

状態。

```text
IN_PROGRESS
```

---

# ハードウェア構成

## MCU

* XIAO ESP32S3 Plus

## 表示

### 前面

* 7.5inch E-Paper
* 800×480
* XIAO ePaper Breakout V2

用途。

* 日めくり表示
* 環境表示
* 暦表示
* 今日の詩

### 背面

* OLED 128×96
* SSD1315優先
* 3ポジションダイヤルスイッチ
* ロータリーエンコーダ

用途。

* 設定
* 診断
* 保守

---

## RTC

* DS3231
* AT24C32
* CR2032

状態。

CONFIRMED

---

## 電源

UPS方式採択。

構成。

* USB-C
* 18650
* IP5306
* DMG2305UX-13
* TPS63802
* ポリスイッチ

運用。

* 通常時USB給電
* 停電時18650自動移行
* 常時稼働

状態。

CONFIRMED

---

## センサー

| センサー        | 用途        |
| ----------- | --------- |
| SCD41       | CO₂       |
| SGP41       | VOC / NOx |
| SPS30       | PM        |
| LTR390      | UV / ALS  |
| BME680      | 温湿度・気圧    |
| HLK-LD2410C | 人感        |
| ICS-43434   | 音環境       |

状態。

CONFIRMED

---

# ソフトウェア構成

## ESP32側

* SensorManager
* StorageManager
* NetworkManager
* DisplayManager
* UIManager
* DiagnosticManager
* PowerManager
* ResourceManager

---

## GAS側

* ApiGateway
* LogManager
* ConfigManager
* CalendarSubsystem
* PoemSubsystem

---

# Spreadsheet構成

## ログ

* observation_log
* event_log
* error_log
* system_log

---

## Calendar

* source_config
* system_config
* solar_term_master
* season_dictionary
* calendar_master

---

## Poem

* poem_cache

状態。

CONFIRMED

---

# Observation Payload

Observation Payload v1.0

状態。

FINALIZED

Observation Payloadは28項目で確定。

追加採択項目。

* timestamp_validity
* boot_count
* wakeup_reason
* message_id
* retry_count

---

# Calendar Subsystem

情報源。

| 項目     | 情報源                |
| ------ | ------------------ |
| 祝日     | 内閣府                |
| 二十四節気  | 国立天文台系             |
| 七十二候名称 | 固定マスタ              |
| 解説     | source_config管理URL |

禁止事項。

* AI生成
* AI推定
* AI補完

状態。

FINALIZED

---

## 保持方針

保持期間。

* 過去5年
* 当年
* 翌年

年次生成。

* 毎年12月1日

再生成。

* 任意年再生成
* 任意期間再生成

状態。

FINALIZED

---

# Poem Subsystem

入力。

* calendar_master
* observation_log

出力。

* poem_cache

利用。

* Gemini API Free Tier

用途。

* 今日の詩

状態。

CONFIRMED

---

## Poem生成方針

生成回数。

```text
1日1回
```

表示時再生成。

```text
禁止
```

失敗時。

```text
取得できません
```

代替詩生成。

```text
禁止
```

状態。

FINALIZED

---

# Job依存関係

```text
Calendar Job
      ↓
calendar_master
      ↓
Poem Job
```

Calendar未完了。

```text
CALENDAR_PENDING
```

Poem生成保留。

状態。

FINALIZED

---

# 実行スケジュール

## Calendar Job

* 02:00 本実行
* 02:30 Retry-1
* 03:00 Retry-2
* 03:30 Retry-3

---

## Poem Job

* 02:10 本実行
* 02:40 Retry-1
* 03:10 Retry-2
* 03:40 Retry-3

状態。

FINALIZED

---

# 設定管理

## source_config

用途。

* 情報源URL
* Calendar設定
* Poem設定

保存禁止。

* API_SECRET
* GEMINI_API_KEY
* Password

---

## system_config

用途。

* システム運用設定
* Retry回数
* Timeout
* Job制御
* 表示設定

状態。

CONFIRMED

---

## Script Properties

用途。

* API_SECRET
* GEMINI_API_KEY
* SYSTEM_VERSION

状態。

FINALIZED

---

## ESP32 NVS

用途。

* DEVICE_ID
* WIFI_SSID
* WIFI_PASSWORD
* API_SECRET
* DISPLAY_MODE

状態。

FINALIZED

---

# セキュリティ

認証方式。

```text
device_id
+
secret
```

保存禁止。

* API_SECRET
* GEMINI_API_KEY
* Password

Gemini API呼出。

```text
GASのみ
```

ESP32。

```text
禁止
```

状態。

FINALIZED

---

# 関連文書

## プロジェクト管理

* README.md
* CURRENT_STATUS.md
* ROADMAP.md

---

## 設計書

* 01_HARDWARE_OVERVIEW.md
* 02_SOFTWARE_OVERVIEW.md
* 03_LOG_FORMAT.md
* 04_STATE_MACHINE.md
* 05_WIRING_DIAGRAM.md
* 06_GAS_API_SPEC.md
* 07_DISPLAY_UI_SPEC.md
* 08_POWER_ARCHITECTURE.md
* 09_SPI_RESOURCE_CONTROL.md
* 10_CALENDAR_POEM_SUBSYSTEM.md
* 11_SECURITY_MANAGEMENT.md
* 12_CONFIGURATION_MANAGEMENT.md
* 13_GAS_OPERATION_POLICY.md
* 14_SPREADSHEET_SCHEMA.md
* 15_GAS_IMPLEMENTATION_GUIDE.md
* 16_TESTING_STRATEGY.md

---

# 開発ロードマップ

## Phase 1

* Spreadsheet構築
* Calendar実装
* Poem実装
* GAS API実装

## Phase 2

* ESP32統合

## Phase 3

* 統合試験

## Phase 4

* 長期運用試験

## Phase 5

* 筐体化

---

# STATUS

| 項目                       | 状態          |
| ------------------------ | ----------- |
| ハードウェア構成                 | CONFIRMED   |
| Spreadsheet構成            | CONFIRMED   |
| Observation Payload v1.0 | FINALIZED   |
| Observation Payload 28項目 | FINALIZED   |
| Calendar保持方針             | FINALIZED   |
| Calendar年次生成             | FINALIZED   |
| Calendar再生成              | FINALIZED   |
| Calendar→Poem依存          | FINALIZED   |
| CALENDAR_PENDING         | FINALIZED   |
| Poem表示時再生成禁止             | FINALIZED   |
| UPS方式                    | CONFIRMED   |
| Security方針               | CONFIRMED   |
| GAS本実装                   | IN_PROGRESS |

---

# CHANGE LOG

| 日付         | 内容                         |
| ---------- | -------------------------- |
| 2026-06-19 | Observation Payload 28項目確定 |
| 2026-06-19 | Calendar保持方針確定             |
| 2026-06-19 | Calendar再生成方針確定            |
| 2026-06-19 | Calendar/Poemスケジュール確定      |
| 2026-06-19 | CALENDAR_PENDING採択         |
| 2026-06-19 | system_config追加            |
| 2026-06-19 | Spreadsheet構成更新            |
| 2026-06-19 | GAS実装関連文書追加                |
