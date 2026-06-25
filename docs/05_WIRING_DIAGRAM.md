# digital-kakejiku 配線図

最終更新: 2026-06-20  
文書版: vNext 1.1 review reflected

---

# 1. 目的

本書は配線の基準源である。

---

# 2. 電源系

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

# 3. I2C

SDA / SCL は XIAO ESP32S3 Plus の I2Cバスを使用する。

| デバイス | アドレス | 備考 |
|---|---|---|
| SCD41 | 0x62 | CO2 |
| SGP41 | 0x59 | VOC / NOx |
| SPS30 | 0x69 | 実機確認 |
| LTR390 | 0x53 | UV / ALS |
| BME680 | 0x76 / 0x77 | 実装依存 |
| MCP23017 | 0x20 | GPIO拡張 |
| DS3231 | 0x68 | RTC |
| AT24C32 | 0x57 | EEPROM |
| OLED | 未確定 | I2C 128×128第一候補 |

---

# 4. SPI

E-Paper と microSD で SPI共有する。

| 信号 | 接続先 |
|---|---|
| SCK | E-Paper / microSD |
| MOSI | E-Paper / microSD |
| MISO | microSD |
| CS | デバイス別個別CS |

OLEDはI2CのためSPI共有対象外とする。

---

# 5. I2S

ICS-43434。

| 信号 | 接続先 |
|---|---|
| BCLK | 未定 |
| WS | 未定 |
| DATA | 未定 |
| L/R | GND |
| VDD | 3.3V |
| GND | GND |

## D11〜D19側面ランド取り出し
D11〜D19取り出し用ミニ基板
ミニ基板GNDバス
JST 2ピン構成
信号線＋GND撚り線
本体基板側JST GNDのGNDバス直結
大電流GNDをD11〜D19用GNDへ流さない

## 側面ランド利用ルール
各JSTのPin1を信号、Pin2をGNDとする。
各JSTのGNDは本体基板GND BUSへ直結する。
ただし、SPS30、DC-DC、ePaper電源の大電流帰路として使用しない。

---

# 6. 背面UI

## OLED

| 信号 | 接続先 |
|---|---|
| SDA | I2C SDA |
| SCL | I2C SCL |
| VCC | 3.3V |
| GND | GND |

## Rotary Encoder

秋月電子販売コード114936を採択する。

| 信号 | 接続先 |
|---|---|
| A | MCP23017 |
| B | MCP23017 |
| SW | MCP23017 |

---

# 7. 電圧系統

| 系統 | 対象 |
|---|---|
| 5V | SPS30、TPS63802入力 |
| 3.3V | XIAO、I2Cセンサー、OLED、MCP23017、DS3231、ICS-43434 |

LD2410Cの電源電圧は実機確認とする。

---

# 8. 未確定事項

- OLED最終型番
- MCP23017詳細ポート割付
- LD2410C電源電圧
- E-Paper Breakout V2最終ピン配置

---

# 9. STATUS

| 項目 | 状態 |
|---|---|
| I2C共有 | CONFIRMED |
| SPI共有 | CONFIRMED |
| I2S割当 | CONFIRMED |
| OLED I2C化 | FINALIZED |
| Rotary MCP23017収容 | FINALIZED |

---

# 10. CHANGE LOG

| 日付 | 内容 |
|---|---|
| 2026-06-20 | 背面UI配線をI2C OLED + MCP23017入力へ統一 |
| 2026-06-25 | 裏面ランド禁止 側面ランド取り出しに変更 |
