# 05_WIRING_DIAGRAM.md

# digital-kakejiku 配線図

最終更新: 2026-06-03

---

# 1. 電源系

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
      3.3V BUS
```

---

# 2. I2C配線

SDA=D4 / SCL=D5

## I2Cアドレス一覧

| デバイス | アドレス | 備考 |
|---|---|---|
| SCD41 | 0x62 | 確認済 |
| SGP41 | 0x59 | 確認済 |
| SPS30 | 0x69 | 要実機確認 |
| LTR390 | 0x53 | 確認済 |
| BME680 | 0x76/0x77 | 実装依存 |
| MCP23017 | 0x20 | 採択 |
| DS3231 | 0x68 | 確認済 |
| AT24C32 | 0x57 | 実機確認済 |

---

# 3. SPI配線

E-PaperとmicroSDでSPI共有

| 信号 | 接続先 |
|---|---|
| SCK | E-Paper / microSD |
| MOSI | E-Paper / microSD |
| MISO | microSD |
| CS | 個別 |

---

# 4. ICS-43434

| 信号 | 接続先 |
|---|---|
| BCLK | GPIO39 |
| WS | GPIO40 |
| DATA | GPIO41 |
| L/R | GND |
| VDD | 3.3V |
| GND | GND |

---

# 5. MCP23017

| 信号 | 接続先 |
|---|---|
| SDA | D4 |
| SCL | D5 |
| VDD | 3.3V |
| VSS | GND |

---

# 6. HLK-LD2410C

| 信号 | 接続先 |
|---|---|
| OUT | XIAOまたはMCP23017 |
| VCC | 未確定(3.3V/5V) |

---

# 7. RTC

採択済みRTC

- DS3231 + AT24C32
- CR2032

| 信号 | 接続先 |
|---|---|
| SDA | D4 |
| SCL | D5 |
| VCC | 3.3V |
| GND | GND |

---

# 8. 未確定事項

- LD2410C電源電圧
- MCP23017詳細割当
- ePaper Breakout V2最終ピン配置


---

# 2026-06-19 配線設計更新

## RTC確定

採択

- DS3231
- AT24C32
- CR2032

接続

I2C共有

- SDA
- SCL

---

## 背面OLED追加

採択

- OLED 128×96
- SSD1315優先

接続

I2C共有

用途

- 設定
- 診断
- 保守

---

## 3ポジションダイヤル追加

用途

- MENU
- CONFIG
- SERVICE

詳細GPIO割付は未確定。

---

## UI更新

採択

- 水平ダイヤル式ロータリーエンコーダ
- 押下スイッチ付き
- RGB LED無し

RGB配線は不要とする。

---

## センサー構成確定

I2C

- SCD41
- SGP41
- BME680
- LTR390
- DS3231
- MCP23017
- OLED

SPI共有

- E-Paper
- microSD

I2S

- ICS-43434

---

## I2S割付確定

GPIO39

- BCLK

GPIO40

- WS

GPIO41

- DATA

GPIO42

- 予備

---

## 電源構成確定

採択

- 18650
- IP5306
- DMG2305UX-13
- TPS63802
- ポリスイッチ

運用

- USB優先
- UPS方式
- 自動切替

---

## 電圧系統

5V系

- SPS30

3.3V系

- XIAO ESP32S3 Plus
- DS3231
- MCP23017
- OLED
- SCD41
- SGP41
- BME680
- LTR390
- ICS-43434

LD2410Cは実機確認とする。

---

## GPIO方針

使用可

- 背面ランド

使用禁止

- 1.27mm側面ランド

---

## 表示対象更新

表示内容

- 六曜
- 二十四節気
- 七十二候
- 今日の詩

生成処理

- GAS側

ESP32側で暦計算は行わない。

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
- MCP23017詳細割付
- ダイヤルスイッチGPIO
- LD2410C最終電源条件
