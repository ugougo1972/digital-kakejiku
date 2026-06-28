# digital-kakejiku Current Status

最終更新: 2026-06-29  
文書版: vNext 1.3 hardware-power reflected

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

並行作業。

```text
Phase 2前提作業
電源基板PoC / 本体基板配線設計準備
```

状態。

```text
GAS Phase 1: IN_PROGRESS
Hardware Power Board: WIRING_DESIGN_IN_PROGRESS
```

判定。

```text
Phase 1開始条件は満たしている。
GAS実装と並行して、Phase 2前提となる電源基板PoCを先行する。
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
- [x] GitHub反映
- [x] タグ付け
- [x] Spreadsheet初期化
- [x] GASプロジェクト作成
- [x] Script Properties設定
- [x] ConfigManager基礎確認
- [x] SystemLogger / ErrorLogger基礎確認

## 実装中

- [ ] ConfigManager清書
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

# 5. ハードウェア進捗

## 採択済み事項

| 領域 | 採択内容 |
|---|---|
| MCU | XIAO ESP32S3 Plus 1台構成 |
| 前面表示 | 7.5inch E-Paper / 800×480 / XIAO ePaper Breakout V2 |
| ePaper配置 | 長めリボンケーブルにより、ドライバーボード＋XIAOを本体基板近傍へ配置 |
| 背面UI | I2C OLED + 秋月電子販売コード114936ロータリーエンコーダ |
| RTC | DS3231 + AT24C32 + CR2032 |
| 電源 | 18650 + IP5306 + DMG2305UX-13 + TPS63802 + ポリスイッチ |
| DMG2305UX-13 | 採択継続 |
| DMG3415U | 採択撤回 |
| D11〜D19 | 1.27mm側面ランド使用解禁 |
| D11〜D19接続 | JST-XH 2ピンでSignal＋GND化 |
| USB D+/D- | XIAO裏面ランド使用を例外解禁 |
| 裏面ランド | 原則使用禁止。ただしUSB D+/D-のみ例外 |

## 電源基板作業

| 項目 | 状態 |
|---|---|
| 電源基板配線案 | 作成中 |
| TPS63802表面視点ピン配置 | 図面座標と一致確認済み |
| USB-C CC1/CC2 | USB-C基板上5.1kΩ実装済みとして扱う |
| USB D+/D- | 本体基板上のXIAO裏面ランドへ独立配線 |
| DMG2305UX-13 Gate | 100kΩで5V系GNDへプルダウン |
| GND方針 | 5V系GND / TPS63802近傍GND島 / SENSE GND枝を分けて扱う |
| テストポイント | 追加案作成済み。1PINヘッダー中心。USB D+/D-は小ランド扱い |
| 現在状態 | 通電前チェック前段階 |

## 次工程

1. 電源基板配線図の最終修正
2. テストポイント追加
3. 導通・短絡確認
4. 無負荷通電
5. 5V BUS確認
6. TPS63802 3.3V出力確認
7. XIAO + 電源基板のみの起動試験
8. USB D+/D-通信確認

---

# 6. センサー

| センサー | 用途 | 状態 |
|---|---|---|
| SCD41 | CO2 | CONFIRMED |
| SGP41 | VOC / NOx | CONFIRMED |
| SPS30 | PM | CONFIRMED |
| LTR390 | UV / ALS | CONFIRMED |
| BME680 | 温湿度・気圧 | CONFIRMED |
| HLK-LD2410C | 人感 | CONFIRMED |
| ICS-43434 | 音環境 | CONFIRMED |

補足。

- SPS30動作電圧は3.5V〜5.0Vとして扱う。
- SGP41は手配完了済み。
- 採択センサー不足はない。

---

# 7. GAS / Spreadsheet

| 項目 | 状態 |
|---|---|
| Spreadsheet Schema | FINALIZED |
| Spreadsheet初期化 | DONE |
| Script Properties設定 | DONE |
| ConfigManager | IMPLEMENTING |
| SecurityManager | CONFIRMED |
| Calendar Subsystem | FINALIZED |
| Poem Subsystem | FINALIZED |
| JobScheduler | FINALIZED |
| Retry Strategy | FINALIZED |
| Gemini Prompt Specification | FINALIZED |

---

# 8. Phase 1実装順序

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

# 9. Phase 1実装時の必読文書

```text
14_SPREADSHEET_SCHEMA.md
15_GAS_IMPLEMENTATION_GUIDE.md
18_GAS_RETRY_STRATEGY.md
19_GEMINI_PROMPT_SPECIFICATION.md
16_TESTING_STRATEGY.md
17_TROUBLESHOOTING.md
```

---

# 10. 未確定事項

以下はPhase 1 GAS実装のブロッカーではない。

| 項目 | 状態 | 対応時期 |
|---|---|---|
| OLED最終型番 | PROPOSED | Phase 2前 |
| IP5306実装モジュール | PROPOSED | 電源基板PoC時 |
| USB Presence検出方式 | PROPOSED | 電源基板PoC時 |
| LD2410C電源電圧 | PROPOSED | Phase 2前 |
| ICS-43434音処理方式 | PROPOSED | Phase 2前 |
| E-Paper部分更新可否 | PROPOSED | Phase 2実機評価 |
| D11〜D19側面ランド取り出し構造 | CONFIRMED | 実装時 |
| D11〜D19各PIN割当 | PROPOSED | 本体基板配線設計時 |
| D11〜D19用JST-XH 2ピン接続 | CONFIRMED | 実装時 |
| D11〜D19ミニ基板GNDバス | CONFIRMED | 実装時 |
| 本体基板GNDバス接続 | CONFIRMED | 実装時 |
| I2S再割当 | PROPOSED | Phase 2前 |

---

# 11. STATUS

| 項目 | 状態 |
|---|---|
| 現在フェーズ | Phase 1 |
| Phase 1開始判定 | GO |
| GAS本実装 | IN_PROGRESS |
| 電源基板PoC | WIRING_DESIGN_IN_PROGRESS |
| Spreadsheet初期化 | DONE |
| ESP32統合 | PENDING |
| 長期運用試験 | PENDING |

---

# 12. CHANGE LOG

| 日付 | 内容 |
|---|---|
| 2026-06-20 | vNext 1.3としてPhase 1開始判定をGOへ更新 |
| 2026-06-20 | GAS実装の詳細進捗を追加 |
| 2026-06-20 | Retry Strategy / Gemini Prompt SpecificationをFINALIZED化 |
| 2026-06-25 | 裏面ランド原則禁止、側面ランド使用解禁を反映 |
| 2026-06-29 | 電源基板PoC、D11〜D19、USB D+/D-例外、GND方針、テストポイント方針を反映 |
