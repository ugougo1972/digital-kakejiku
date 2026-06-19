# 01_HARDWARE_OVERVIEW.md

# digital-kakejiku ハードウェア概要

最終更新: 2026-06-03

---

# 1. 目的

本ドキュメントは、digital-kakejiku（据置型日めくり観測器）のハードウェア構成を整理する。

本装置は環境情報を長期観測し、Google Apps Script / Spreadsheet と連携しながら、7.5インチE-Paperへ静的・低頻度に表示する据置型観測装置である。

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

## 採択

- XIAO ESP32S3 Plus

## GPIO方針

### 使用可

- 2.54mmピッチヘッダー
- 背面ランド

### 使用禁止

- 1.27mm側面ランド

### 方針

- GPIO不足対策としてMCP23017を採択
- 操作系は原則MCP23017へ収容
- ICS-43434のみ背面ランドを使用

## 背面ランド利用

| 信号 | GPIO | 用途 |
|---|---:|---|
| MTCK | GPIO39 | ICS-43434 BCLK |
| MTDO | GPIO40 | ICS-43434 WS |
| MTDI | GPIO41 | ICS-43434 DATA |
| MTMS | GPIO42 | 予備 |

---

# 4. 電源構成

## 採択済み部材

- 18650 Li-ion
- 18650電池ホルダー
- IP5306
- TPS63802
- DMG2305UX-13
- ポリスイッチ

## 電源方針

- UPS方式採択
- 通常時はUSB給電
- 停電時は18650へ自動切替
- XIAO USB側への逆流防止としてDMG2305UX-13採択

## 電源ブロック図

```text
USB-C
 ↓
ポリスイッチ
 ↓
IP5306
 ├─18650
 └─5V
     ├─SPS30
     └─TPS63802
          ↓3.3V
      DMG2305UX-13
          ↓
      3.3V電源バス
```

---

# 5. 表示装置

- 7.5inch 800×480 E-Paper
- XIAO ePaper Breakout Board V2

---

# 6. センサー構成

| センサー | 用途 | 接続 |
|---|---|---|
| SCD41 | CO₂ | I2C |
| SGP41 | VOC/NOx | I2C |
| SPS30 | PM | I2C・5V給電 |
| LTR390 | 照度/UV | I2C |
| BME680 | 温湿度/気圧 | I2C |
| HLK-LD2410C | 人感 | OUT接続 |
| ICS-43434 | 音環境 | I2S |
| DS3231+AT24C32 | RTC | I2C |

---

# 7. GPIO拡張

- MCP23017採択
- ロータリーエンコーダ
- ボタン類
- 補助GPIO

---

# 8. ストレージ

- microSD
- SPI接続
- E-PaperとSPI共有

---

# 9. RTC

## 採択

- DS3231 + AT24C32
- CR2032

## 方針

- I2C接続
- 縦実装で省スペース化

---

# 10. 操作系

## 採択

- 水平ダイヤル式ロータリーエンコーダ
- プッシュスイッチ付き
- RGB LEDなし

---

# 11. 筐体・通気方針

- 底面吸気
- 上部排気
- SPS30は吸排気確保
- SCD41/SGP41/BME680は熱源から分離

---

# 12. 未確定事項

- IP5306モジュール型番
- LD2410C動作電圧
- 最終電流容量
- ICS-43434実装位置


---

# 2026-06-19 採択事項反映

## RTC

以下を正式採択とする。

- DS3231
- AT24C32
- CR2032

従来のRTC未確定記述は本採択内容を優先する。

---

## 電源アーキテクチャ確定

UPS方式を採択する。

構成

- 18650
- IP5306
- DMG2305UX-13
- TPS63802
- ポリスイッチ

運用

- 通常時USB給電
- 停電時自動切替
- 常時稼働

---

## 表示系更新

### 前面

- 7.5inch E-Paper
- 800×480
- XIAO ePaper Breakout V2

用途

- 表示専用

### 背面

追加採択

- OLED 128×96
- SSD1315優先
- 3ポジションダイヤルスイッチ

用途

- 設定
- 診断
- 保守

---

## UI更新

採択

- 水平ダイヤル式ロータリーエンコーダ
- 押下スイッチ付き
- RGB LED無し

従来のRGB前提記述は不採用とする。

---

## センサー構成確定

採択

- SCD41
- SGP41
- SPS30
- LTR390
- BME680
- HLK-LD2410C
- ICS-43434

---

## I2S割当確定

ICS-43434用

- GPIO39 : BCLK
- GPIO40 : WS
- GPIO41 : DATA
- GPIO42 : 予備

---

## GPIO方針

使用可

- 背面ランド

使用禁止

- 1.27mm側面ランド

---

## Calendar / AI対応

本装置は以下の表示を行う。

- 六曜
- 二十四節気
- 七十二候
- 今日の詩

暦情報生成はGAS側で実施する。

ESP32側では生成しない。

---

## 文字コード

採択

- UTF-8

## フォント

採択

- Noto Sans JP

---

## 未確定事項

- OLED最終型番
- 筐体詳細構造
- センサー実装位置最終調整

その他は設計凍結候補とする。
