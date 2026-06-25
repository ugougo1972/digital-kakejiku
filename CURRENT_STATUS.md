# digital-kakejiku Current Status

最終更新: 2026-06-20  
文書版: vNext 1.3 phase1 ready delta

---

# 1. 目的

本書は digital-kakejiku プロジェクトの現在状態を示す。

設計詳細は各基準源文書を参照する。

---

# 2. 現在フェーズ

```text
Phase 1
GAS本実装
```

状態。

```text
READY_TO_START
```

判定。

```text
Phase 1開始条件は満たした
```

---

# 3. Phase 1 Go / NoGo 判定

| 項目 | 状態 | 判定 |
|---|---|---|
| Spreadsheet Schema | FINALIZED | GO |
| GAS Implementation Guide | FINALIZED | GO |
| GAS Retry Strategy | FINALIZED | GO |
| Gemini Prompt Specification | FINALIZED | GO |
| Testing Strategy | FINALIZED | GO |
| Troubleshooting Guide | FINALIZED | GO |
| Script Properties運用方針 | FINALIZED | GO |
| system_config設計 | FINALIZED | GO |

総合判定。

```text
GO
```

---

# 4. GAS実装の詳細進捗

## 完了

- [x] Spreadsheet スキーマ設計
- [x] GAS モジュール構成決定
- [x] エラーコード体系確定
- [x] Calendar / Poem 状態遷移確定
- [x] CALENDAR_PENDING 方針確定
- [x] Gemini Prompt 仕様確定
- [x] Retry 詳細仕様確定
- [x] Troubleshooting 方針確定
- [x] Testing Strategy 策定

## 実装中

- [ ] Spreadsheet 初期化
- [ ] ConfigManager 実装
- [ ] SecurityManager 実装
- [ ] LogSubsystem 実装
- [ ] ApiGateway 実装

## 未着手

- [ ] CalendarSubsystem 実装
- [ ] PoemSubsystem 実装
- [ ] JobScheduler 実装
- [ ] MaintenanceHandler 実装
- [ ] L1単体試験
- [ ] L2結合試験
- [ ] L3障害試験

---

# 5. 採択済み事項

## ハードウェア

- MCU: XIAO ESP32S3 Plus
- 前面表示: 7.5inch E-Paper / 800×480 / XIAO ePaper Breakout V2
- 背面UI: I2C OLED + 秋月電子販売コード114936ロータリーエンコーダ
- RTC: DS3231 + AT24C32 + CR2032
- 電源: 18650 + IP5306 + DMG2305UX-13 + TPS63802 + ポリスイッチ

## センサー

| センサー | 用途 | 状態 |
|---|---|---|
| SCD41 | CO2 | CONFIRMED |
| SGP41 | VOC / NOx | CONFIRMED |
| SPS30 | PM | CONFIRMED |
| LTR390 | UV / ALS | CONFIRMED |
| BME680 | 温湿度・気圧 | CONFIRMED |
| HLK-LD2410C | 人感 | CONFIRMED |
| ICS-43434 | 音環境 | CONFIRMED |

## GAS / Spreadsheet

| 項目 | 状態 |
|---|---|
| Spreadsheet Schema | FINALIZED |
| Calendar Subsystem | FINALIZED |
| Poem Subsystem | FINALIZED |
| JobScheduler | FINALIZED |
| ConfigManager | FINALIZED |
| SecurityManager | CONFIRMED |
| Retry Strategy | FINALIZED |
| Gemini Prompt Specification | FINALIZED |

---

# 6. Phase 1実装順序

1. Spreadsheet初期化
2. Script Properties設定
3. ConfigManager実装
4. SecurityManager実装
5. LogSubsystem実装
6. ApiGateway実装
7. CalendarSubsystem実装
8. PoemSubsystem実装
9. JobScheduler実装
10. MaintenanceHandler実装
11. L1単体試験
12. L2結合試験
13. L3障害試験

---

# 7. Phase 1実装時の必読文書

```text
14_SPREADSHEET_SCHEMA.md
15_GAS_IMPLEMENTATION_GUIDE.md
18_GAS_RETRY_STRATEGY.md
19_GEMINI_PROMPT_SPECIFICATION.md
16_TESTING_STRATEGY.md
17_TROUBLESHOOTING.md
```

---

# 8. 未確定事項

以下はPhase 1 GAS実装のブロッカーではない。

| 項目 | 状態 | 対応時期 |
|---|---|---|
| OLED最終型番 | PROPOSED | Phase 2前 |
| IP5306実装モジュール | PROPOSED | Phase 2 PoC前 |
| USB Presence検出方式 | PROPOSED | Phase 2 PoC前 |
| LD2410C電源電圧 | PROPOSED | Phase 2 PoC前 |
| ICS-43434音処理方式 | PROPOSED | Phase 2前 |
| E-Paper部分更新可否 | PROPOSED | Phase 2実機評価 |
| D11〜D19側面ランド取り出し構造 PROPOSED | Phase 2前 |
| D11〜D19各PIN割当 PROPOSED | Phase 2前 |
| D11〜D19用JST 2ピン接続 PROPOSED | Phase 2前 |
| ミニ基板GNDバス PROPOSED | Phase 2前 |
| 本体基板GNDバス接続 PROPOSED | Phase 2前 |
| I2S再割当 PROPOSED | Phase 2前 |

---

# 9. STATUS

| 項目 | 状態 |
|---|---|
| 現在フェーズ | Phase 1 |
| Phase 1開始判定 | GO |
| GAS本実装 | READY_TO_START |
| Spreadsheet初期化 | PENDING |
| ESP32統合 | PENDING |
| 長期運用試験 | PENDING |

---

# 10. CHANGE LOG

| 日付 | 内容 |
|---|---|
| 2026-06-20 | vNext 1.3としてPhase 1開始判定をGOへ更新 |
| 2026-06-20 | GAS実装の詳細進捗を追加 |
| 2026-06-20 | Retry Strategy / Gemini Prompt SpecificationをFINALIZED化 |
| 2026-06-25 | 裏面ランド使用禁止 側面ランド使用解禁 |
