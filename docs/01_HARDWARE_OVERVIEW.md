# 01_HARDWARE_OVERVIEW.md

# digital-kakejiku ハードウェア概要

最終更新: 2026-06-20  
版: vNext 1.0

---

# 1. 目的

digital-kakejiku（据置型日めくり観測器）のハードウェア構成を定義する。

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

背面には保守コンソールとしてI2C OLEDと押下スイッチ付きロータリーエンコーダを設ける。

# 3. MCU

- XIAO ESP32S3 Plus

GPIO方針。

- 2.54mmピッチヘッダー使用可
- 背面ランド使用可
- 1.27mm側面ランド使用禁止
- GPIO不足対策としてMCP23017を採択
- 操作系はMCP23017へ収容
- ICS-43434のみ背面ランドを使用

背面ランド利用。

| 信号 | GPIO | 用途 |
| --- | --- | --- |
| MTCK | GPIO39 | ICS-43434 BCLK |
| MTDO | GPIO40 | ICS-43434 WS |
| MTDI | GPIO41 | ICS-43434 DATA |
| MTMS | GPIO42 | 予備 |


# 4. 電源構成

採択。

- 18650 Li-ion
- IP5306
- TPS63802
- DMG2305UX-13
- ポリスイッチ

方針。

- UPS方式
- 通常時USB給電
- 停電時18650自動切替
- 常時稼働
- ローカル保存優先

# 5. 表示装置

前面。

- 7.5inch 800×480 E-Paper
- XIAO ePaper Breakout Board V2
- SPI接続
- 表示専用

背面。

- I2C OLED
- 128×128 OLED 第一候補
- 128×64 OLED 代替候補
- 保守コンソール

# 6. 操作系

採択。

- 秋月電子販売コード114936
- 押下スイッチ付きロータリーエンコーダ
- RGB LEDなし
- MCP23017経由

# 7. センサー構成

| センサー | 用途 | 接続 | 状態 |
| --- | --- | --- | --- |
| SCD41 | CO₂ | I2C | CONFIRMED |
| SGP41 | VOC / NOx | I2C | CONFIRMED |
| SPS30 | PM | I2C / 5V | CONFIRMED |
| LTR390 | UV / ALS | I2C | CONFIRMED |
| BME680 | 温湿度・気圧 | I2C | CONFIRMED |
| HLK-LD2410C | 人感 | OUT | CONFIRMED |
| ICS-43434 | 音環境 | I2S | CONFIRMED |
| DS3231 + AT24C32 | RTC / EEPROM | I2C | CONFIRMED |


# 8. GPIO拡張

- MCP23017採択
- I2C接続
- ロータリーエンコーダを収容
- 将来拡張I/Oとして利用可能

# 9. ストレージ

- microSD
- SPI接続
- E-PaperとSPI共有
- ResourceManagerで排他制御

# 10. RTC

- DS3231
- AT24C32
- CR2032
- I2C接続

# 11. 筐体・通気方針

- 底面吸気
- 上部排気
- SPS30は吸排気確保
- SCD41 / SGP41 / BME680 は熱源から分離
- 背面保守UIは操作可能位置に配置

# 12. Calendar / Poem対応

ESP32は以下を表示するが生成しない。

- 六曜
- 二十四節気
- 七十二候
- 今日の詩

Calendar生成、Poem生成、Gemini API呼出はGAS側で実施する。

# 13. 文字コード・フォント

- UTF-8
- Noto Sans JP

# 14. 未確定事項

| 項目 | 状態 | 備考 |
| --- | --- | --- |
| OLED最終型番 | PROPOSED | I2C OLEDを前提 |
| OLED最終サイズ | PROPOSED | 128×128第一候補、128×64代替候補 |
| HLK-LD2410C電源条件 | PROPOSED | 実機確認 |
| IP5306実装モジュール | PROPOSED | 型番・基板仕様は未確定 |
| 筐体詳細構造 | PROPOSED | 通気・保守性を含め検討 |


# 15. STATUS

| 項目 | 状態 |
| --- | --- |
| MCU | CONFIRMED |
| 前面E-Paper | CONFIRMED |
| 背面保守コンソール | FINALIZED |
| OLED I2C方針 | FINALIZED |
| OLED最終型番 | PROPOSED |
| ロータリーエンコーダ | FINALIZED |
| MCP23017 | CONFIRMED |
| RTC | CONFIRMED |
| UPS構成 | CONFIRMED |
| センサー構成 | CONFIRMED |
| I2S割当 | CONFIRMED |
| SPI共有 | CONFIRMED |
| 1.27mm側面ランド不使用 | FINALIZED |


# 16. CHANGE LOG

| 日付 | 内容 |
| --- | --- |
| 2026-06-20 | vNext 1.0として全面再生成 |
| 2026-06-20 | 背面UIを保守コンソールとして整理 |
| 2026-06-20 | I2C OLED、128×128第一候補、128×64代替候補を反映 |
| 2026-06-20 | 秋月電子販売コード114936ロータリーエンコーダを反映 |
