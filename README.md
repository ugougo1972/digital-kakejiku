# digital-kakejiku

据置型環境観測・暦表示・詩生成システム

最終更新: 2026-06-19

---

# 概要

digital-kakejiku は据置型観測端末である。

目的。

- 環境観測
- 長期記録
- 暦表示
- 今日の詩表示
- 生活支援

MCU。

- XIAO ESP32S3 Plus

表示。

- 7.5inch E-Paper
- 800x480
- XIAO ePaper Breakout V2

---

# 現在位置

現在の開発フェーズ。

```text
Phase 1
GAS本実装
```

現在の最優先。

```text
Spreadsheet
Calendar Subsystem
Poem Subsystem
GAS API
```

---

# システム構成

## ハードウェア

### MCU

- XIAO ESP32S3 Plus

### 表示

- 7.5inch E-Paper
- 800x480
- XIAO ePaper Breakout V2

### 背面UI

- 128x96 OLED
- SSD1315優先
- 3ポジションダイヤル

### RTC

- DS3231
- AT24C32
- CR2032

### 電源

- 18650
- IP5306
- DMG2305UX-13
- TPS63802
- PTC

### センサー

- SCD41
- SGP41
- SPS30
- LTR390
- BME680
- LD2410C
- ICS-43434

状態。

CONFIRMED

---

# Spreadsheet構成

## ログ

- observation_log
- event_log
- error_log
- system_log

## Calendar

- source_config
- solar_term_master
- season_dictionary
- calendar_master

## Poem

- poem_cache

状態。

CONFIRMED

---

# Observation Payload

Observation Payload v1.0

状態。

FINALIZED

Observation Payload。

```text
28項目
```

採択済み追加項目。

- timestamp_validity
- boot_count
- wakeup_reason
- message_id
- retry_count

---

# Calendar Subsystem

情報源。

| 項目 | 情報源 |
|---|---|
| 祝日 | 内閣府 |
| 二十四節気 | 国立天文台系 |
| 七十二候名称 | 固定マスタ |
| 解説 | source_config管理URL |

禁止事項。

- AI生成
- AI推定
- AI補完

状態。

FINALIZED

---

# Calendar保持方針

保持。

- 過去5年
- 当年
- 翌年

年次生成。

- 毎年12月1日

再生成。

- 任意年再生成
- 任意期間再生成

状態。

FINALIZED

---

# Poem Subsystem

入力。

- calendar_master
- observation_log

出力。

- poem_cache

利用。

- Gemini API Free Tier

用途。

- 今日の詩

状態。

CONFIRMED

---

# Calendar / Poem スケジュール

## Calendar Job

- 02:00 本実行
- 02:30 Retry-1
- 03:00 Retry-2
- 03:30 Retry-3

## Poem Job

- 02:10 本実行
- 02:40 Retry-1
- 03:10 Retry-2
- 03:40 Retry-3

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

Calendar未完了時。

```text
CALENDAR_PENDING
```

Poem生成保留。

状態。

FINALIZED

---

# 開発ロードマップ

## Phase 1

- GAS本実装
- Spreadsheet実装
- Calendar実装
- Poem実装

## Phase 2

- ESP32統合

## Phase 3

- 統合試験

## Phase 4

- 長期運用試験

## Phase 5

- 筐体化

---

# 関連文書

## プロジェクト管理

- CURRENT_STATUS.md
- ROADMAP.md

## 設計書

- 01_HARDWARE_OVERVIEW.md
- 02_SOFTWARE_OVERVIEW.md
- 03_LOG_FORMAT.md
- 04_STATE_MACHINE.md
- 05_WIRING_DIAGRAM.md
- 06_GAS_API_SPEC.md
- 07_DISPLAY_UI_SPEC.md
- 08_POWER_ARCHITECTURE.md
- 09_SPI_RESOURCE_CONTROL.md
- 10_CALENDAR_POEM_SUBSYSTEM.md
- 11_SECURITY_MANAGEMENT.md
- 12_CONFIGURATION_MANAGEMENT.md
- 13_GAS_OPERATION_POLICY.md

---

# STATUS

| 項目 | 状態 |
|---|---|
| ハードウェア構成 | CONFIRMED |
| Spreadsheet構成 | CONFIRMED |
| Observation Payload v1.0 | FINALIZED |
| Observation Payload 28項目 | FINALIZED |
| Calendar保持方針 | FINALIZED |
| Calendar年次生成 | FINALIZED |
| Calendar→Poem依存 | FINALIZED |
| CALENDAR_PENDING | FINALIZED |
| GAS本実装 | IN_PROGRESS |

---

# CHANGE LOG

| 日付 | 内容 |
|---|---|
| 2026-06-19 | Observation Payload 28項目確定 |
| 2026-06-19 | Payload追加5項目採択 |
| 2026-06-19 | Calendar保持方針確定 |
| 2026-06-19 | Calendar再生成方針確定 |
| 2026-06-19 | Calendar/Poemスケジュール確定 |
| 2026-06-19 | CALENDAR_PENDING採択 |
