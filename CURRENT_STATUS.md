# CURRENT_STATUS.md

# digital-kakejiku 現在状況

最終更新: 2026-06-19

---

# 1. プロジェクト概要

digital-kakejiku は据置型観測端末である。

目的。

- 環境観測
- 暦情報表示
- 今日の詩表示
- 長期記録
- 生活支援

MCU。

- XIAO ESP32S3 Plus

状態。

設計フェーズ終盤

---

# 2. 現在の最優先事項

Phase1

GAS本実装

対象。

- Spreadsheet構築
- Calendar Subsystem
- Poem Subsystem
- API実装
- ログ実装

状態。

進行中

---

# 3. ハードウェア確定事項

## MCU

- XIAO ESP32S3 Plus

## 表示

- 7.5inch E-Paper 800x480
- XIAO ePaper Breakout V2

## 背面UI

- 128x96 OLED
- SSD1315優先
- 3ポジションダイヤル

## RTC

- DS3231
- AT24C32
- CR2032

## 電源

- 18650
- IP5306
- DMG2305UX-13
- TPS63802
- PTC

状態。

CONFIRMED

---

# 4. センサー構成

| センサー | 用途 | 状態 |
|---|---|---|
| SCD41 | CO2 | CONFIRMED |
| SGP41 | VOC / NOx | CONFIRMED |
| SPS30 | PM | CONFIRMED |
| LTR390 | UV / ALS | CONFIRMED |
| BME680 | 温湿度気圧 | CONFIRMED |
| LD2410C | 人感 | CONFIRMED |
| ICS-43434 | 音環境 | CONFIRMED |

---

# 5. Spreadsheet構成

## 運用ログ

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

# 6. Observation Payload

Observation Payload v1.0

状態。

FINALIZED

Observation Payload は28項目で確定。

追加採択項目。

- timestamp_validity
- boot_count
- wakeup_reason
- message_id
- retry_count

状態。

FINALIZED

---

# 7. Calendar Subsystem

情報源。

| 項目 | 情報源 |
|---|---|
| 祝日 | 内閣府 |
| 二十四節気 | 国立天文台系 |
| 七十二候名称 | 固定マスタ |
| 解説 | source_config管理URL |

禁止。

- AI生成
- AI推定
- AI補完

状態。

FINALIZED

---

# 8. Calendar保持方針

保持。

- 過去5年
- 当年
- 翌年

年次生成。

- 毎年12月1日

手動生成。

- 許可

範囲再生成。

- 許可

状態。

FINALIZED

---

# 9. Poem Subsystem

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

# 10. Calendar / Poem 実行スケジュール

## Calendar

- 02:00 本実行
- 02:30 Retry-1
- 03:00 Retry-2
- 03:30 Retry-3

## Poem

- 02:10 本実行
- 02:40 Retry-1
- 03:10 Retry-2
- 03:40 Retry-3

状態。

FINALIZED

---

# 11. Job依存関係

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

# 12. 現在の重要未確定事項

## 優先度A

| 項目 | 状態 |
|---|---|
| IP5306実モジュール仕様 | PROPOSED |
| OLED最終型番 | PROPOSED |
| LD2410C最終電源条件 | PROPOSED |
| Gemini詳細運用 | PROPOSED |

## 優先度B

| 項目 | 状態 |
|---|---|
| OTA方針 | PROPOSED |
| E-Paper更新周期 | PROPOSED |
| キャッシュ戦略 | PROPOSED |

## 優先度C

| 項目 | 状態 |
|---|---|
| 長期運用方針 | PROPOSED |

---

# 13. 次回作業

優先順。

1. GAS本実装
2. Calendar生成処理
3. Poem生成処理
4. Spreadsheet実装
5. ESP32統合

---

# 14. STATUS

| 項目 | 状態 |
|---|---|
| ハードウェア構成 | CONFIRMED |
| Spreadsheet構成 | CONFIRMED |
| Observation Payload v1.0 | FINALIZED |
| Observation Payload 28項目 | FINALIZED |
| Calendar保持方針 | FINALIZED |
| Calendar年次生成 | FINALIZED |
| Calendar再生成 | FINALIZED |
| Calendar→Poem依存 | FINALIZED |
| CALENDAR_PENDING | FINALIZED |
| Calendar Subsystem | FINALIZED |
| Poem Subsystem | CONFIRMED |
| GAS本実装 | IN_PROGRESS |

---

# 15. CHANGE LOG

| 日付 | 内容 |
|---|---|
| 2026-06-19 | Observation Payload 28項目確定 |
| 2026-06-19 | Payload追加5項目採択 |
| 2026-06-19 | Calendar保持方針確定 |
| 2026-06-19 | Calendar再生成方針確定 |
| 2026-06-19 | Calendar/Poem実行スケジュール確定 |
| 2026-06-19 | CALENDAR_PENDING採択 |
