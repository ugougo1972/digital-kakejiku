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
