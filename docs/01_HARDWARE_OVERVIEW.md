# digital-kakejiku ハードウェア概要

最終更新: 2026-06-20  
文書版: vNext 1.1 review reflected

---

# 1. 目的

本書は digital-kakejiku のハードウェア構成の基準源である。

## 位置づけ

本ドキュメントは、対象領域の基準源を明示し、他文書では要約または参照に留める。  
詳細仕様が他文書の基準源にある場合、本書では重複記述を避け、参照先を明示する。

| 領域 | 基準源 |
|---|---|
| ハードウェア構成 | 01_HARDWARE_OVERVIEW.md |
| ソフトウェア構成 | 02_SOFTWARE_OVERVIEW.md |
| ログ形式 | 03_LOG_FORMAT.md |
| 状態遷移 | 04_STATE_MACHINE.md |
| 配線 | 05_WIRING_DIAGRAM.md |
| GAS API | 06_GAS_API_SPEC.md |
| 表示・背面UI | 07_DISPLAY_UI_SPEC.md |
| 電源 | 08_POWER_ARCHITECTURE.md |
| SPI共有制御 | 09_SPI_RESOURCE_CONTROL.md |
| Calendar / Poem | 10_CALENDAR_POEM_SUBSYSTEM.md |
| セキュリティ | 11_SECURITY_MANAGEMENT.md |
| 設定管理 | 12_CONFIGURATION_MANAGEMENT.md |
| GAS運用 | 13_GAS_OPERATION_POLICY.md |
| Spreadsheet Schema | 14_SPREADSHEET_SCHEMA.md |
| GAS実装 | 15_GAS_IMPLEMENTATION_GUIDE.md |
| 試験 | 16_TESTING_STRATEGY.md |
| 障害対応 | 17_TROUBLESHOOTING.md |

---

# 2. 全体構成

```text
センサー群
 ↓
XIAO ESP32S3 Plus
 ↓ Wi-Fi / HTTPS POST
Google Apps Script
 ↓
Google Spreadsheet
 ↓
7.5inch 800×480 E-Paper
```

---

# 3. MCU

採択。

- XIAO ESP32S3 Plus

GPIO方針。

| 区分 | 方針 |
|---|---|
| 2.54mmヘッダー | 使用可 |
| 背面ランド | 使用禁止 |
| 1.27mm側面ランド | 使用解禁 |
| 1.27mm側面ランド | D11～D19に相当 |
| D11～D19 | 信号線＋GND撚り線JST HX 2Pで本体基板へ接続 |
| GPIO拡張 | MCP23017採択 |

背面ランド利用。

| 信号 | GPIO | 用途 |
|---|---:|---|
| MTCK | GPIO39 | ICS-43434 BCLK |
| MTDO | GPIO40 | ICS-43434 WS |
| MTDI | GPIO41 | ICS-43434 DATA |
| MTMS | GPIO42 | 予備 |

---

# 4. 電源

UPS方式を採択する。

| 部品 | 用途 | 状態 |
|---|---|---|
| 18650 | 停電時電源 | CONFIRMED |
| IP5306 | 充電・昇圧管理 | CONFIRMED |
| DMG2305UX-13 | 逆流防止 | CONFIRMED |
| TPS63802 | 3.3V生成 | CONFIRMED |
| ポリスイッチ | 過電流保護 | CONFIRMED |

電源フロー。

```text
USB-C
 ↓
ポリスイッチ
 ↓
IP5306
 ├─ 18650
 └─ 5V
     ├─ SPS30
     └─ TPS63802
          ↓ 3.3V BUS
```

---

# 5. 表示

## 前面

- 7.5inch E-Paper
- 800×480
- XIAO ePaper Breakout V2
- SPI接続
- 表示専用

## 背面

- 保守コンソール
- I2C OLED
- 128×128 OLED 第一候補
- 128×64 OLED 代替候補
- 秋月電子販売コード114936 押下スイッチ付きロータリーエンコーダ
- MCP23017経由

背面UIでは設定値本文の編集は行わない。

---

# 6. センサー

| センサー | 用途 | 接続 | 状態 |
|---|---|---|---|
| SCD41 | CO2 | I2C | CONFIRMED |
| SGP41 | VOC / NOx | I2C | CONFIRMED |
| SPS30* | PM | I2C / 3.5V～5.0V | CONFIRMED |
| LTR390 | UV / ALS | I2C | CONFIRMED |
| BME680 | 温湿度・気圧 | I2C | CONFIRMED |
| HLK-LD2410C | 人感 | OUT | CONFIRMED |
| ICS-43434 | 音環境 | I2S | CONFIRMED |
| DS3231 + AT24C32 | RTC | I2C | CONFIRMED |
*供給：5V バス
 I2Cプルアップ：3.3V系に統一

---

# 7. 未確定事項

| 項目 | 状態 | 確定条件 |
|---|---|---|
| OLED最終型番 | PROPOSED | I2C 128×128候補の実機確認 |
| IP5306実装モジュール | PROPOSED | 型番・負荷応答・発熱確認 |
| USB Presence検出方法 | PROPOSED | 実回路確認 |
| LD2410C電源電圧 | PROPOSED | 実機確認 |
| ICS-43434音処理方式 | PROPOSED | RMS/FFT等をPhase2前に決定 |

---

# 8. STATUS

| 項目 | 状態 |
|---|---|
| MCU | CONFIRMED |
| 電源方式 | CONFIRMED |
| 前面表示 | CONFIRMED |
| 背面UI方針 | FINALIZED |
| センサー選定 | CONFIRMED |
| GPIO方針 | FINALIZED |

---

# 9. CHANGE LOG

| 日付 | 内容 |
|---|---|
| 2026-06-20 | vNext 1.1査読反映版として全面再生成 |
| 2026^06-25 | 裏面ランド禁止 側面ランド使用解禁 |

