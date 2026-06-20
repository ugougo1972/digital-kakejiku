# 05_WIRING_DIAGRAM.md

# digital-kakejiku 配線図

最終更新: 2026-06-20  
版: vNext 1.0

---

# 1. 電源系

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
         ↓
     DMG2305UX-13
         ↓
     3.3V BUS
```

# 2. I2C配線

SDA。

```text
D4
```

SCL。

```text
D5
```

I2C接続対象。

| デバイス | アドレス | 備考 |
| --- | --- | --- |
| SCD41 | 0x62 | CO₂ |
| SGP41 | 0x59 | VOC / NOx |
| SPS30 | 0x69 | PM、5V給電 |
| LTR390 | 0x53 | 照度 / UV |
| BME680 | 0x76 / 0x77 | 実装依存 |
| MCP23017 | 0x20 | GPIO拡張 |
| DS3231 | 0x68 | RTC |
| AT24C32 | 0x57 | EEPROM |
| OLED | 未確定 | I2C OLED |


# 3. SPI配線

E-Paper と microSD で SPI を共有する。

| 信号 | 接続先 |
| --- | --- |
| SCK | E-Paper / microSD |
| MOSI | E-Paper / microSD |
| MISO | microSD |
| CS | 個別 |


背面OLEDはI2CのためSPI共有対象外。

# 4. ICS-43434

| 信号 | 接続先 |
| --- | --- |
| BCLK | GPIO39 |
| WS | GPIO40 |
| DATA | GPIO41 |
| L/R | GND |
| VDD | 3.3V |
| GND | GND |


# 5. MCP23017

| 信号 | 接続先 |
| --- | --- |
| SDA | D4 |
| SCL | D5 |
| VDD | 3.3V |
| VSS | GND |


用途。

- ロータリーエンコーダ
- 将来拡張GPIO

# 6. 背面OLED

採択方針。

- I2C OLED
- 保守コンソール用途
- 128×128 OLED 第一候補
- 128×64 OLED 代替候補

接続。

| 信号 | 接続先 |
| --- | --- |
| SDA | D4 |
| SCL | D5 |
| VCC | 3.3V |
| GND | GND |


# 7. ロータリーエンコーダ

採択。

- 秋月電子販売コード114936
- 押下スイッチ付き
- RGB無し

接続方針。

```text
MCP23017経由
```

| 信号 | 接続先 |
| --- | --- |
| A | MCP23017 |
| B | MCP23017 |
| SW | MCP23017 |


# 8. HLK-LD2410C

| 信号 | 接続先 |
| --- | --- |
| OUT | XIAOまたはMCP23017 |
| VCC | 未確定 |
| GND | GND |


# 9. RTC

採択。

- DS3231
- AT24C32
- CR2032

| 信号 | 接続先 |
| --- | --- |
| SDA | D4 |
| SCL | D5 |
| VCC | 3.3V |
| GND | GND |


# 10. 電圧系統

5V系。

- SPS30
- TPS63802入力

3.3V系。

- XIAO ESP32S3 Plus
- DS3231
- AT24C32
- MCP23017
- OLED
- SCD41
- SGP41
- BME680
- LTR390
- ICS-43434

LD2410Cは実機確認。

# 11. UI配線方針

前面。

- E-Paperのみ
- 表示専用
- SPI接続

背面。

- I2C OLED
- 押下スイッチ付きロータリーエンコーダ
- MCP23017経由

# 12. GPIO方針

使用可。

- 2.54mmヘッダー
- 背面ランド

使用禁止。

- 1.27mm側面ランド

# 13. STATUS

| 項目 | 状態 |
| --- | --- |
| RTC配線 | CONFIRMED |
| I2S配線 | CONFIRMED |
| SPI共有 | CONFIRMED |
| MCP23017 | CONFIRMED |
| OLED I2C化 | FINALIZED |
| ロータリーエンコーダ採択 | FINALIZED |
| MCP23017収容方針 | FINALIZED |
| OLED最終型番 | PROPOSED |


# 14. CHANGE LOG

| 日付 | 内容 |
| --- | --- |
| 2026-06-20 | vNext 1.0として全面再生成 |
| 2026-06-20 | 背面OLEDをI2C前提へ統一 |
| 2026-06-20 | 秋月電子販売コード114936ロータリーエンコーダを反映 |
