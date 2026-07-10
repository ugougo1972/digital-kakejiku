# digital-kakejiku Current Status

最終更新: 2026-07-10
文書版: vNext 1.4 hardware-power reflected

---

# 1. 目的

本書は digital-kakejiku プロジェクトの現在の進捗状況を示す基準文書である。

各設計文書の完成状況、実装状況、採択事項および次工程を管理する。

詳細設計については以下を基準源とする。

- 01_HARDWARE_OVERVIEW.md
- 05_WIRING_DIAGRAM.md
- 08_POWER_ARCHITECTURE.md

---

# 2. 現在フェーズ

## システム全体

```text
Phase 1
GAS本実装
```

並行して

```text
Phase 2前提作業
電源基板PoC
本体基板配線設計
```

を実施中。

---

## 現在状態

| 項目 | 状態 |
|------|------|
| GAS | IN_PROGRESS |
| 電源基板 | WIRING_DESIGN_IN_PROGRESS |
| 本体基板 | DESIGN_PREPARATION |
| GitHub文書 | UPDATING |

---

## 判定

Phase 1開始条件は満たしている。

GAS実装を主工程とし、

電源基板PoCおよび
本体基板設計を並行して進める。

---

# 3. Phase 1 Go / NoGo 判定

| 項目 | 状態 | 判定 |
|------|------|------|
| Spreadsheet Schema | FINALIZED | GO |
| GAS Implementation Guide | FINALIZED | GO |
| GAS Retry Strategy | FINALIZED | GO |
| Gemini Prompt Specification | FINALIZED | GO |
| Testing Strategy | FINALIZED | GO |
| Troubleshooting Guide | FINALIZED | GO |
| Script Properties運用 | FINALIZED | GO |
| system_config設計 | FINALIZED | GO |
| source_config設計 | FINALIZED | GO |
| ConfigManager基本確認 | DONE | GO |
| SystemLogger確認 | DONE | GO |
| ErrorLogger確認 | DONE | GO |

---

## 総合判定

```text
GO
```

Phase 1を継続する。

---

# 4. GAS実装状況

## 完了

- [x] Spreadsheetスキーマ設計
- [x] GASモジュール構成決定
- [x] エラーコード体系確定
- [x] Calendar状態遷移確定
- [x] Poem状態遷移確定
- [x] CALENDAR_PENDING運用確定
- [x] Gemini Prompt仕様確定
- [x] Retry Strategy確定
- [x] Troubleshooting方針確定
- [x] Testing Strategy策定
- [x] GitHub反映
- [x] タグ作成
- [x] Spreadsheet初期化
- [x] GASプロジェクト作成
- [x] Script Properties設定
- [x] ConfigManager基礎確認
- [x] source_config読込確認
- [x] system_config読込確認
- [x] HealthCheck確認
- [x] SystemLogger確認
- [x] ErrorLogger確認

---

## 実装中

- [ ] ConfigManager清書
- [ ] SecurityManager
- [ ] LogSubsystem
- [ ] ApiGateway

---

## 未着手

- [ ] CalendarSubsystem
- [ ] PoemSubsystem
- [ ] JobScheduler
- [ ] MaintenanceHandler
- [ ] L1単体試験
- [ ] L2結合試験
- [ ] L3障害試験

---

## 並行作業

現在は

- 電源基板配線設計
- CURRENT_STATUS更新
- HARDWARE文書更新
- WIRING文書更新
- POWER文書更新

を並行して実施している。

Hardware文書群は
vNext 1.4への更新作業中である。

---

# 5. ハードウェア進捗

## 5.1 採択済み構成

| 領域 | 採択内容 | 状態 |
|------|----------|------|
| MCU | XIAO ESP32S3 Plus（1台構成） | FINALIZED |
| 前面表示 | 7.5inch E-Paper 800×480 | FINALIZED |
| ePaper Driver | XIAO ePaper Breakout V2 | FINALIZED |
| 背面UI | I2C OLED + Rotary Encoder | FINALIZED |
| RTC | DS3231 + AT24C32 + CR2032 | FINALIZED |
| 電源 | USB Type-C + PTC + IP5306 + DMG2305UX-13 + TPS63802 + 18650 | FINALIZED |
| GPIO拡張 | MCP23017 | FINALIZED |
| microSD | SPI共有 | FINALIZED |

---

## 5.2 電源基板

現在は

**電源基板配線設計**

を実施中。

### 確定事項

- USB Type-C基板はCC1/CC2に5.1kΩ終端抵抗実装済み
- USB Type-C→PTC→IP5306→DMG2305UX-13→5V_BUS→TPS63802→3.3V_OUT
- DMG2305UX-13
  - Source＝OUT_5V
  - Drain＝5V_BUS
  - Gate＝100kΩ→5V_GND
- TPS63802
  - 外側ホール：主配線
  - 内側ホール：コンデンサ接続
- 入力470µF＋0.1µF
- 出力220µF＋0.1µF

---

## 5.3 GND設計

正式仕様は以下とする。

- 5V_GND
- 3.3V_GND
- SENSE_GND

電源基板上では

見かけ上完全分離

して配線する。

一点接続は

本体基板

XIAO ESP32S3 Plus近傍

のみとする。

TPS63802内部導通は

設計対象外とする。

---

## 5.4 10PINインターフェース

配電系

- 5V_OUT
- 5V_GND
- 3.3V_OUT
- 3.3V_GND

測定系

- Battery_SENSE
- 5V_SENSE
- SENSE_GND

測定系は

ADC専用とし、

配電用途へ使用しない。

---

## 5.5 現在位置

現在の進捗は

```text
電源基板配線設計
      ↓
テストポイント追加
      ↓
導通確認
      ↓
無負荷通電
      ↓
5V確認
      ↓
3.3V確認
      ↓
XIAO単体起動試験
      ↓
USB通信試験
```

である。

---

# 6. センサー

| センサー | 用途 | 状態 |
|----------|------|------|
| SCD41 | CO₂ | CONFIRMED |
| SGP41 | VOC / NOx | CONFIRMED |
| SPS30 | PM2.5 | CONFIRMED |
| LTR390 | UV / ALS | CONFIRMED |
| BME680 | 温湿度・気圧 | CONFIRMED |
| HLK-LD2410C | 人感 | CONFIRMED |
| ICS-43434 | 音環境 | CONFIRMED |

---

## センサー電源

### 5V系

- SPS30

### 3.3V系

- XIAO ESP32S3 Plus
- SCD41
- SGP41
- LTR390
- BME680
- MCP23017
- RTC
- OLED
- ICS-43434

---

## 保留事項

以下はPoC後に最終確定する。

- HLK-LD2410C電源電圧
- OLED最終型番
- D11〜D19最終割付

---

# 7. GAS / Spreadsheet

## 完了

| 項目 | 状態 |
|------|------|
| Spreadsheet Schema | DONE |
| Spreadsheet初期化 | DONE |
| Script Properties | DONE |
| ConfigManager確認 | DONE |
| HealthCheck | DONE |
| SystemLogger | DONE |
| ErrorLogger | DONE |

---

## 実装中

| 項目 | 状態 |
|------|------|
| ConfigManager | IMPLEMENTING |
| SecurityManager | IMPLEMENTING |
| LogSubsystem | IMPLEMENTING |
| ApiGateway | IMPLEMENTING |

---

## 実装予定

- CalendarSubsystem
- PoemSubsystem
- JobScheduler
- MaintenanceHandler
- L1試験
- L2試験
- L3試験

---

## ドキュメント更新状況

現在更新中。

- 08_POWER_ARCHITECTURE.md
- 05_WIRING_DIAGRAM.md
- 01_HARDWARE_OVERVIEW.md
- CURRENT_STATUS.md

これら4文書は

vNext 1.4

として整合性を取りながら更新を進めている。

---

# 8. Phase 1実装順序

## 優先順位

Phase 1は

GAS本実装を主工程とし、

ハードウェアPoCを並行して進める。

---

### ソフトウェア

1. ConfigManager清書
2. SecurityManager
3. LogSubsystem
4. ApiGateway
5. CalendarSubsystem
6. PoemSubsystem
7. JobScheduler
8. MaintenanceHandler
9. L1単体試験
10. L2結合試験
11. L3障害試験

---

### ハードウェア

1. 電源基板配線最終確認
2. テストポイント実装
3. 導通確認
4. 無負荷通電
5. 5V_BUS確認
6. TPS63802入力確認
7. 3.3V_OUT確認
8. XIAO単体起動試験
9. USB通信確認
10. センサー接続開始

---

### ドキュメント

vNext 1.4への更新を実施する。

対象文書

- 01_HARDWARE_OVERVIEW.md
- 05_WIRING_DIAGRAM.md
- 08_POWER_ARCHITECTURE.md
- CURRENT_STATUS.md
- README.md
- ROADMAP.md

---

# 9. Phase 1実装時の基準文書

Phase 1実装では

以下を基準文書とする。

```text
01_HARDWARE_OVERVIEW.md
02_SOFTWARE_OVERVIEW.md
03_LOG_FORMAT.md
04_STATE_MACHINE.md
05_WIRING_DIAGRAM.md
06_GAS_API_SPEC.md
07_DISPLAY_UI_SPEC.md
08_POWER_ARCHITECTURE.md
14_SPREADSHEET_SCHEMA.md
15_GAS_IMPLEMENTATION_GUIDE.md
16_TESTING_STRATEGY.md
17_TROUBLESHOOTING.md
18_GAS_RETRY_STRATEGY.md
19_GEMINI_PROMPT_SPECIFICATION.md
```

これらを相互の基準源として維持する。

---

# 10. 未確定事項

以下は

Phase 1開始の阻害要因ではない。

| 項目 | 状態 | 確定予定 |
|------|------|-----------|
| OLED最終型番 | PROPOSED | Phase2前 |
| HLK-LD2410C電源電圧 | PROPOSED | 実機評価 |
| MCP23017最終割付 | PROPOSED | 本体基板設計 |
| D11〜D19最終割付 | PROPOSED | 本体基板設計 |
| E-Paper Breakout配置 | PROPOSED | レイアウト設計 |
| Battery_SENSE補正式 | PROPOSED | 電源PoC |
| 5V_SENSE補正式 | PROPOSED | 電源PoC |
| 電源基板レイアウト最終版 | IN_PROGRESS | 電源PoC完了 |

---

# 11. STATUS

| 項目 | 状態 |
|------|------|
| 現在フェーズ | Phase1 |
| Phase1開始判定 | GO |
| GAS本実装 | IN_PROGRESS |
| ConfigManager | IMPLEMENTING |
| 電源基板設計 | WIRING_DESIGN_IN_PROGRESS |
| 電源PoC | PREPARING |
| 本体基板設計 | PREPARING |
| GitHub文書更新 | IN_PROGRESS |
| ESP32統合試験 | PENDING |
| 長期運用試験 | PENDING |

---

## 現在の重点作業

優先順位は以下とする。

1. GAS実装
2. 電源基板PoC
3. 本体基板設計
4. GitHub文書整備
5. センサー統合

---

# 12. CHANGE LOG

| 日付 | 内容 |
|------|------|
| 2026-06-20 | Phase1開始判定をGOへ更新 |
| 2026-06-20 | Spreadsheet・GAS実装進捗を反映 |
| 2026-06-20 | Retry Strategy・Gemini Prompt SpecificationをFINALIZED化 |
| 2026-06-25 | D11〜D19側面ランド利用、裏面ランド原則禁止を反映 |
| 2026-06-29 | 電源基板PoC、USB D+/D-、テストポイント、GND設計方針を反映 |
| 2026-07-10 | USB Type-C（CC1/CC2 5.1kΩ実装済み）を正式仕様化 |
| 2026-07-10 | 電源構成を「USB Type-C→PTC→IP5306→DMG2305UX-13→5V_BUS→TPS63802→3.3V_OUT」へ更新 |
| 2026-07-10 | DMG2305UX-13接続（Source＝OUT_5V、Drain＝5V_BUS、Gate＝100kΩ→5V_GND）を反映 |
| 2026-07-10 | TPS63802同名2ホール運用（外側：主配線、内側：コンデンサ接続）を反映 |
| 2026-07-10 | GND設計を「5V_GND・3.3V_GND・SENSE_GNDを電源基板上で見かけ上完全分離、本体基板XIAO近傍で一点接続」へ更新 |
| 2026-07-10 | 入力470µF・出力220µF・0.1µF構成を正式仕様化 |
| 2026-07-10 | CURRENT_STATUSをvNext 1.4として全面再構成し、ハードウェア・GAS・文書進捗を最新状態へ更新 |