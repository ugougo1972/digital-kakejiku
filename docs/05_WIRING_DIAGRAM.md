# digital-kakejiku 配線図

最終更新: 2026-06-29  
文書版: vNext 1.3 hardware-power reflected

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
 └─ OUT-5V
     ↓
   DMG2305UX-13
     ↓
   5V BUS
     ├─ SPS30
     └─ TPS63802 VIN
          ↓
        TPS63802 VOUT
          ↓
        3.3V OUTPUT
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

---

# 6. D11〜D19側面ランド取り出し

D11〜D19は1.27mm側面ランドから取り出す。

| 項目 | 方針 |
|---|---|
| 取り出し基板 | D11〜D19取り出し用ミニ基板 |
| ミニ基板用途 | 信号線＋GND取り出し専用 |
| ミニ基板上の部品 | 抵抗・RCは原則載せない |
| コネクタ | JST-XH 2ピン |
| 配線 | Signal＋GND撚り線 |
| 本体側JST GND | 本体基板GND BUSへ直結 |
| 禁止 | 大電流GNDをD11〜D19用GNDへ流さない |

## 側面ランド利用ルール

各JSTのPin1を信号、Pin2をGNDとする。  
各JSTのGNDは本体基板GND BUSへ直結する。  
ただし、SPS30、DC-DC、ePaper電源の大電流帰路として使用しない。

配置方針。

| 区分 | 方針 |
|---|---|
| 基本 | D11〜D14を左、D15〜D19を右に分割配置 |
| 例外 | 配線交差や用途上の合理性がある場合は一部変更可 |

---

# 7. 背面UI

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

# 8. 電圧系統

| 系統 | 対象 |
|---|---|
| 5V | SPS30、TPS63802入力、必要に応じた5V系負荷 |
| 3.3V | XIAO、I2Cセンサー、OLED、MCP23017、DS3231、ICS-43434 |
| SENSE | Battery_SENSE、5V_SENSE |

LD2410Cの電源電圧は実機確認とする。

---

# 9. 電源基板回路設計方針

## 9.1 電源基板の系統

| 系統 | 対象 |
|---|---|
| 5V系 | USB-C / PTC / IP5306 / 18650 JST / DMG2305UX-13 / TPS63802 VIN |
| 3.3V系 | TPS63802 VOUT / 3.3V OUTPUT |
| SENSE系 | Battery_SENSE / 5V_SENSE |
| USB通信 | USB D+ / D- |

GNDは5V系GND BUS、TPS63802近傍GND島、SENSE GND枝を分けて扱う。SENSE GNDには5V大電流を流さない。

---

# 10. 電源基板ピン配置

## 10.1 USB-C

図面は表面側から見る。

| ピン | 座標 | 接続先 |
|---|---:|---|
| VBUS | (29,23) | PTC入力 |
| GND | (28,23) | 5V系GND BUS |
| CC1 | (27,23) | USB-C基板上5.1kΩあり |
| D- | (26,23) | 本体基板上のXIAO裏面ランドへ |
| D+ | (25,23) | 本体基板上のXIAO裏面ランドへ |
| CC2 | (24,23) | USB-C基板上5.1kΩあり |

USB D+/D-は電源系と独立させる。

## 10.2 IP5306

| ピン | 座標 | 接続先 |
|---|---:|---|
| VIN | (29,07) | PTC出力 |
| GND | (28,07) | 5V系GND BUS |
| GND | (27,07) | 5V系GND BUS |
| BAT | (26,07) | 18650 JST+ / Battery_SENSE上側抵抗 |
| GND | (25,07) | 5V系GND BUS |
| OUT-5V | (24,07) | DMG2305UX-13 Drain |

## 10.3 DMG2305UX-13

| 端子 | 座標 | 接続先 |
|---|---:|---|
| Gate | (22,17) | 100kΩで5V系GNDへ |
| Drain | (22,18) | IP5306 OUT-5V |
| Source | (22,19) | 5V BUS |

## 10.4 TPS63802

図面は表面側から見る。表面視点ピン配置は図面座標と一致確認済み。

| ピン | 座標 | 接続先 |
|---|---:|---|
| GND | (06,20) | TPS63802近傍GND島 |
| GND | (06,19) | TPS63802近傍GND島 |
| VOUT | (06,17) | 3.3V BUS |
| VOUT | (06,16) | 3.3V BUS |
| GND | (15,20) | TPS63802近傍GND島 |
| GND | (15,19) | TPS63802近傍GND島 |
| VIN | (15,17) | 5V BUS |
| VIN | (15,16) | 5V BUS |

## 10.5 本体基板向け10P

| Pin | 信号 | 座標 | 接続先 |
|---:|---|---:|---|
| 1 | 5V SENSE | (07,24) | 5V_SENSE中点 |
| 2 | GND SENSE | (08,24) | SENSE GND枝 |
| 3 | BAT SENSE | (09,24) | Battery_SENSE中点 |
| 4 | 3.3V系 GND | (10,24) | GND島 |
| 5 | 3.3V OUTPUT | (11,24) | 3.3V BUS |
| 6 | 3.3V OUTPUT | (12,24) | 3.3V BUS |
| 7 | 5V系 GND | (13,24) | GND島 |
| 8 | 5V系 GND | (14,24) | GND島 |
| 9 | 5V OUTPUT | (15,24) | 5V BUS |
| 10 | 5V OUTPUT | (16,24) | 5V BUS |

---

# 11. 電源基板主要配線

## 11.1 5V主経路

```text
USB-C VBUS(29,23)
  ↓
PTC(29,21→29,20)
  ↓
IP5306 VIN(29,07)
  ↓
IP5306 OUT-5V(24,07)
  ↓
DMG2305UX-13 Drain(22,18)
  ↓
DMG2305UX-13 Source(22,19)
  ↓
5V BUS
  ├─ 5V OUTPUT(15,24)(16,24)
  ├─ 5V_SENSE上側抵抗
  └─ TPS63802 VIN(15,17)(15,16)
```

## 11.2 GND

```text
5V系GND BUS
  ├─ USB-C GND
  ├─ IP5306 GND群
  ├─ 18650 JST-
  ├─ DMG2305UX-13 Gate抵抗下端
  └─ TPS63802近傍GND島

TPS63802近傍GND島
  ├─ TPS63802 GND全ピン
  ├─ TPS入力コンデンサーGND
  ├─ TPS出力コンデンサーGND
  └─ 本体基板向けGND

SENSE GND枝
  ├─ Battery_SENSE下側抵抗GND
  ├─ Battery_SENSE 0.1µF GND
  ├─ 5V_SENSE下側抵抗GND
  └─ 5V_SENSE 0.1µF GND
```

## 11.3 Battery_SENSE

```text
IP5306 BAT / BAT+ → 100kΩ → Battery_SENSE中点 → 100kΩ → SENSE GND
Battery_SENSE中点 → 0.1µF → SENSE GND
Battery_SENSE中点 → 本体基板向け10P Pin3
```

## 11.4 5V_SENSE

```text
5V BUS → 150kΩ → 5V_SENSE中点 → 100kΩ → SENSE GND
5V_SENSE中点 → 0.1µF → SENSE GND
5V_SENSE中点 → 本体基板向け10P Pin1
```

---

# 12. 受動部品

| 部品 | 座標 | 接続 | 備考 |
|---|---|---|---|
| 0.1µF | (30,18)-(30,16) | PTC後段5V - 5V系GND | USB入力高周波 |
| 470µF | (31,18)-(31,16) | PTC後段5V - 5V系GND | USB入力バルク |
| 0.1µF | (24,12)-(22,12) | 5V系 - 5V系GND | 5V高周波 |
| 470µF | (20,22)-(18,22) | 5V BUS - GND島 | 5V BUSバルク |
| 22µF | (17,19)-(17,17) | TPS VIN - TPS近傍GND島 | TPS入力 |
| 0.1µF | (18,19)-(18,17) | TPS VIN - TPS近傍GND島 | TPS入力高周波 |
| 0.1µF | (09,11)-(09,09) | Battery_SENSE中点 - SENSE GND | 分圧平滑 |
| 0.1µF | (06,11)-(04,11) | 5V_SENSE中点 - SENSE GND | 分圧平滑 |
| 0.1µF | (04,18)-(04,16) | 3.3V - TPS近傍GND島 | TPS出力高周波 |
| 22µF | (05,19)-(05,17) | TPS VOUT - TPS近傍GND島 | TPS出力 |
| 0.1µF | (05,22)-(03,22) | 3.3V OUTPUT - GND | 3.3V高周波 |
| 22µF | (05,23)-(03,23) | 3.3V OUTPUT - GND | 3.3V出力補助 |
| 100kΩ | (22,17)-(22,15) | DMG Gate - 5V系GND | Gateプルダウン |
| 100kΩ | (08,11)-(08,09) | Battery_SENSE下側 | 下側抵抗 |
| 100kΩ | (08,09)-(08,07) | Battery_SENSE上側 | 上側抵抗 |
| 150kΩ | (04,13)-(04,11) | 5V_SENSE上側 | 上側抵抗 |
| 100kΩ | (04,11)-(04,09) | 5V_SENSE下側 | 下側抵抗 |

---

# 13. テストポイント

通常の電圧測定用テストポイントは1PIN独立ヘッダーとする。GNDは少なくとも1箇所をワニ口用ループとする。USB D+/D-は1PINヘッダーを立てず、小ランドまたは未実装穴に留める。

| TP名 | 推奨座標 | 接続先 | 造作 | 用途 |
|---|---:|---|---|---|
| TP_USB_VBUS | (30,23) | USB-C VBUS / PTC前 | 1PIN | USB入力5V確認 |
| TP_PTC_OUT | (30,19) | PTC後段 / IP5306 VIN前 | 1PIN | PTC通過後確認 |
| TP_IP5306_VIN | (30,07) | IP5306 VIN近傍 | 1PIN | IP5306入力確認 |
| TP_BAT | (27,06) | IP5306 BAT / BAT+ | 1PIN | 電池電圧確認 |
| TP_IP5306_OUT | (23,07) | IP5306 OUT-5V / DMG Drain前 | 1PIN | IP5306出力確認 |
| TP_5V_BUS | (18,19) | DMG Source後 / 5V BUS | 1PIN | 主5V確認 |
| TP_TPS_VIN | (16,16) | TPS63802 VIN近傍 | 1PIN | TPS入力確認 |
| TP_3V3 | (04,17) | TPS63802 VOUT / 3.3V BUS | 1PIN | 3.3V出力確認 |
| TP_BAT_SENSE | (10,09) | Battery_SENSE中点 | 1PIN | ADC入力前確認 |
| TP_5V_SENSE | (03,11) | 5V_SENSE中点 | 1PIN | ADC/GPIO入力前確認 |
| TP_GND_5V | (30,15) | 5V系GND BUS | GNDループ推奨 | 大電流系GND基準 |
| TP_GND_ISLAND | (18,22) | TPS63802近傍GND島 | GNDループまたは1PIN | TPS近傍GND基準 |
| TP_GND_SENSE | (08,18) | SENSE系GND BUS | 1PIN | ADC基準GND |
| TP_USB_D_MINUS | (26,22) | USB-C D- | 小ランド | 短絡確認用 |
| TP_USB_D_PLUS | (25,22) | USB-C D+ | 小ランド | 短絡確認用 |

---

# 14. USB D+/D-独立配線

```text
USB-C D- (26,23) → 本体基板上のXIAO裏面 USB D-
USB-C D+ (25,23) → 本体基板上のXIAO裏面 USB D+
```

方針。

- 細い被覆線を使用する。
- D+/D-を近接並走させる。
- 電源線、IP5306、TPS63802、5V BUSと長く並走させない。
- 裏面ランド接続部はカプトンで絶縁し、応力逃がしを設ける。

---

# 15. 通電前チェック

| 測定 | 期待 |
|---|---|
| USB VBUS - GND | 短絡なし |
| PTC後段 - GND | 短絡なし |
| IP5306 VIN - GND | 短絡なし |
| BAT+ - GND | 短絡なし |
| 5V BUS - GND | 短絡なし |
| TPS63802 VIN - GND | 短絡なし |
| TPS63802 VOUT - GND | 短絡なし |
| 3.3V BUS - GND | 短絡なし |
| Battery_SENSE - GND | 分圧抵抗由来の抵抗値が見える |
| 5V_SENSE - GND | 分圧抵抗由来の抵抗値が見える |
| USB D+ - D- | 短絡なし |
| USB D+ - GND | 短絡なし |
| USB D- - GND | 短絡なし |

---

# 16. 未確定事項

- OLED最終型番
- MCP23017詳細ポート割付
- LD2410C電源電圧
- D11〜D19各PIN割当
- E-Paper Breakout V2最終ピン配置

---

# 17. STATUS

| 項目 | 状態 |
|---|---|
| I2C共有 | CONFIRMED |
| SPI共有 | CONFIRMED |
| I2S割当 | CONFIRMED |
| OLED I2C化 | FINALIZED |
| Rotary MCP23017収容 | FINALIZED |
| D11〜D19側面ランド取り出し | CONFIRMED |
| 電源基板配線案 | IN_PROGRESS |
| TPS63802表面視点ピン配置 | CONFIRMED |
| テストポイント案 | CONFIRMED |

---

# 18. CHANGE LOG

| 日付 | 内容 |
|---|---|
| 2026-06-20 | 背面UI配線をI2C OLED + MCP23017入力へ統一 |
| 2026-06-25 | 裏面ランド原則禁止、側面ランド取り出しに変更 |
| 2026-06-29 | 電源基板回路設計方針、ピン配置、主要配線、受動部品、テストポイント、通電前チェックを反映 |
