# digital-kakejiku Current Status

最終更新: 2026-06-20  
文書版: vNext 1.1 review reflected

---

# 1. 目的

本書はプロジェクトの現在状態を示す。設計詳細は各基準源文書を参照する。

---

# 2. 現在フェーズ

```text
Phase1
GAS本実装
```

状態。

```text
IN_PROGRESS
```

---

# 3. 進捗サマリ

| 項目 | 状態 |
|---|---|
| 要件定義 | COMPLETE |
| ハードウェア選定 | COMPLETE |
| センサー選定 | COMPLETE |
| 電源設計 | COMPLETE |
| 表示設計 | COMPLETE |
| Spreadsheet設計 | COMPLETE |
| GAS設計 | COMPLETE |
| Gemini設計 | COMPLETE |
| GAS実装 | IN_PROGRESS |
| ESP32実装 | PENDING |
| 統合試験 | PENDING |

---

# 4. 採択済み事項

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

- Spreadsheet Schema: FINALIZED
- Calendar Subsystem: FINALIZED
- Poem Subsystem: FINALIZED
- JobScheduler: FINALIZED
- ConfigManager: FINALIZED
- SecurityManager: CONFIRMED

---

# 5. Phase1実装前の重点項目

- [ ] Spreadsheet初期化
- [ ] ConfigManager実装
- [ ] SecurityManager実装
- [ ] LogSubsystem実装
- [ ] ApiGateway実装
- [ ] CalendarSubsystem実装
- [ ] PoemSubsystem実装
- [ ] JobScheduler実装
- [ ] L1/L2試験

---

# 6. 査読反映済み項目

- 基準源の明確化
- README / CURRENT_STATUS / ROADMAP の役割分離
- Gemini Promptドラフト追加
- Error Retry詳細仕様追加
- CALENDAR_PENDING終了条件追加
- Calendar Job / Poem Job詳細フロー追加
- 月次運用チェック追加
- 17_TROUBLESHOOTING.md新規作成
- HMAC将来拡張追加
- E-Paper更新周期案追加

---

# 7. 未確定事項

| 項目 | 状態 | 備考 |
|---|---|---|
| OLED最終型番 | PROPOSED | I2C、128×128第一候補 |
| IP5306実装モジュール | PROPOSED | 実機確認後確定 |
| USB Presence検出方式 | PROPOSED | 実測後確定 |
| LD2410C電源電圧 | PROPOSED | 実機確認 |
| ICS-43434音処理方式 | PROPOSED | RMS/FFT等はPhase2前に確定 |
| E-Paper部分更新可否 | PROPOSED | 実機確認 |

---

# 8. STATUS

| 項目 | 状態 |
|---|---|
| vNext 1.1文書セット | FINALIZED |
| Phase1準備 | IN_PROGRESS |
| GAS実装 | IN_PROGRESS |
| ESP32統合 | PENDING |

---

# 9. CHANGE LOG

| 日付 | 内容 |
|---|---|
| 2026-06-20 | vNext 1.1査読反映版として全面再生成 |
