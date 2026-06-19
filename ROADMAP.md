# ROADMAP.md

# digital-kakejiku 開発ロードマップ

最終更新: 2026-06-19

---

# 1. 現在位置

現在フェーズ。

```text
Phase 1
GAS本実装
```

状態。

IN_PROGRESS

---

# 2. 完了済み事項

## ハードウェア設計

- XIAO ESP32S3 Plus採択
- 7.5inch E-Paper採択
- XIAO ePaper Breakout V2採択
- DS3231採択
- AT24C32採択
- UPS構成採択
- センサー選定完了

状態。

CONFIRMED

---

## システム設計

- Spreadsheet構成確定
- Calendar Subsystem採択
- Poem Subsystem採択
- Security方針採択
- SPI制御方針採択

状態。

CONFIRMED

---

## Payload設計

Observation Payload v1.0

状態。

FINALIZED

確定。

- timestamp_validity
- boot_count
- wakeup_reason
- message_id
- retry_count

Observation Payload。

- 28項目

状態。

FINALIZED

---

## Calendar設計

確定事項。

- 過去5年保持
- 当年保持
- 翌年保持
- 毎年12月1日翌年生成
- Calendar再生成
- Calendar範囲再生成

状態。

FINALIZED

---

## Calendar / Poem スケジュール

Calendar。

- 02:00 本実行
- 02:30 Retry-1
- 03:00 Retry-2
- 03:30 Retry-3

Poem。

- 02:10 本実行
- 02:40 Retry-1
- 03:10 Retry-2
- 03:40 Retry-3

状態。

FINALIZED

---

# 3. Phase 1

## GAS本実装

### Spreadsheet実装

対象。

- observation_log
- event_log
- error_log
- system_log
- source_config
- solar_term_master
- season_dictionary
- calendar_master
- poem_cache

状態。

IN_PROGRESS

---

### API実装

対象。

- observation
- event
- error
- system

状態。

IN_PROGRESS

---

### Calendar実装

対象。

- source_config
- calendar_master生成
- 手動再生成
- 範囲再生成

状態。

TODO

---

### Poem実装

対象。

- Gemini API
- poem_cache生成
- キャッシュ管理

状態。

TODO

---

# 4. Phase 2

## ESP32統合

対象。

- Wi-Fi
- GAS通信
- RTC
- E-Paper
- OLED
- SD
- 各種センサー

状態。

TODO

---

# 5. Phase 3

## 統合試験

対象。

- 通信試験
- 障害試験
- 停電試験
- RTC異常試験

状態。

TODO

---

# 6. Phase 4

## 長期運用試験

対象。

- ログ蓄積
- Spreadsheet容量
- Calendar運用
- Gemini運用

状態。

TODO

---

# 7. Phase 5

## 筐体化

対象。

- 熱設計評価
- 通気評価
- 筐体設計

状態。

TODO

---

# 8. 現在の重要未確定事項

## 優先度A

| 項目 | 状態 |
|---|---|
| IP5306実モジュール仕様 | PROPOSED |
| OLED最終型番 | PROPOSED |
| LD2410C電源条件 | PROPOSED |
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

# 9. 次回作業

優先順。

1. Calendar Subsystem実装
2. Poem Subsystem実装
3. Spreadsheet構築
4. GAS API実装
5. Script Properties実装

---

# 10. STATUS

| 項目 | 状態 |
|---|---|
| ハードウェア設計 | CONFIRMED |
| Spreadsheet設計 | CONFIRMED |
| Observation Payload v1.0 | FINALIZED |
| Observation Payload 28項目 | FINALIZED |
| Calendar保持方針 | FINALIZED |
| Calendar年次生成 | FINALIZED |
| Calendar再生成 | FINALIZED |
| Calendar→Poem依存 | FINALIZED |
| CALENDAR_PENDING | FINALIZED |
| GAS本実装 | IN_PROGRESS |
| ESP32統合 | TODO |
| 統合試験 | TODO |

---

# 11. CHANGE LOG

| 日付 | 内容 |
|---|---|
| 2026-06-19 | Observation Payload 28項目確定 |
| 2026-06-19 | Payload追加5項目採択 |
| 2026-06-19 | Calendar保持方針確定 |
| 2026-06-19 | Calendar再生成方針確定 |
| 2026-06-19 | Calendar/Poemスケジュール確定 |
| 2026-06-19 | CALENDAR_PENDING採択 |
