# 05_WIRING_DIAGRAM.md

# digital-kakejiku 配線図

最終更新: 2026-06-01

---

# 1. 前提

本ドキュメントは、digital-kakejiku（据置型日めくり観測器）の配線方針を整理する。

現時点では、実モジュールの端子名が未確認のものがあるため、端子名は一般的な表記を用いる。実配線時は、購入したモジュールのシルク印字およびデータシートを優先する。

---

# 2. 電源系配線

## 電源ブロック

```text
USB-C入力
↓
IP5306系 18650充電・5V電源管理
↓ 5V
TPS63802
↓ 3.3V
P-MOSFET逆流防止回路
↓
3.3V電源バス
↓
XIAO ESP32S3 Plus / センサー群
```

## 配線一覧

| 項番 | 接続元 | 接続先 | 用途 | 留意点 |
|---:|---|---|---|---|
| 1 | USB-C VBUS | IP5306 VIN / USB IN | 外部5V入力 | 端子名は実モジュールで確認する |
| 2 | USB-C GND | IP5306 GND | 入力GND | 全系統GNDと共通化する |
| 3 | 18650 + | IP5306 BAT+ / B+ | 電池正極 | 極性厳守 |
| 4 | 18650 - | IP5306 BAT- / B- / GND | 電池負極 | モジュール仕様によりGND共通の場合あり |
| 5 | IP5306 5V OUT / OUT+ | TPS63802 VIN | 5V供給 | 出力常時有効可否を確認する |
| 6 | IP5306 GND / OUT- | TPS63802 GND | GND | 太め・短めを推奨 |
| 7 | TPS63802 VOUT 3.3V | P-MOSFET Source側 | 3.3V入力 | MOSFET向きは回路確定時に再確認する |
| 8 | P-MOSFET Drain側 | 3.3V電源バス | 逆流防止後の3.3V | XIAO / センサーへ供給 |
| 9 | P-MOSFET Gate | 制御抵抗回路 | 逆流防止制御 | プルアップ / プルダウン値は未確定 |
| 10 | 3.3V電源バス | XIAO 3V3 | MCU電源 | XIAO USB接続時の逆流防止を確認する |
| 11 | GNDバス | XIAO GND | MCU GND | 全系統共通GND |
| 12 | 3.3V電源バス | I2Cセンサー群 VCC | センサー電源 | 実モジュールの対応電圧を確認する |
| 13 | GNDバス | I2Cセンサー群 GND | センサーGND | 共通GND |
| 14 | 3.3V電源バス | microSD VCC | ストレージ電源 | モジュール仕様を確認する |
| 15 | 3.3V電源バス | E-Paper系 VCC | 表示系電源 | Breakout Board仕様を確認する |
| 16 | 3.3V電源バス | ICS-43434 VDD | 音環境センサー電源 | 3.3V前提 |

---

# 3. I2C配線

## 方針

I2Cはバス接続とし、XIAO本体のSDA / SCLに複数デバイスを接続する。

## 接続元

| 信号 | 接続元 |
|---|---|
| SDA | D4 SDA |
| SCL | D5 SCL |
| VCC | 3.3V電源バス |
| GND | GNDバス |

## 接続対象

| 項番 | デバイス | 接続 | 備考 |
|---:|---|---|---|
| 1 | SCD41 | I2C | CO2 / 温湿度 |
| 2 | SGP41 | I2C | VOC / NOx |
| 3 | SPS30 | I2C想定 | 粒子状物質 |
| 4 | LTR390 | I2C | 照度 / UV |
| 5 | BME680 | I2C | 温湿度 / 気圧 / 補助ガス |
| 6 | MCP23017 | I2C | GPIO拡張 |
| 7 | RTC | I2C | 型番未確定 |

## 留意点

- I2Cアドレス重複を確認する
- プルアップ抵抗の有無は各モジュール搭載状況を確認する
- 配線が長くなる場合はI2Cの安定性を確認する
- RTCは型番未確定のため、最終配線は採択モジュール確定後に見直す

---

# 4. SPI配線

## 方針

E-PaperとmicroSDはSPIバス共有を前提とする。

## 共有バス

| 項番 | 信号 | 接続先 | 備考 |
|---:|---|---|---|
| 1 | SCK | E-Paper / microSD | 共有 |
| 2 | MOSI | E-Paper / microSD | 共有 |
| 3 | MISO | microSD | E-Paper側で不要な場合あり |

## 個別制御線

| 項番 | 信号 | 接続先 | 備考 |
|---:|---|---|---|
| 1 | ePaper CS | E-Paper | 専用CS |
| 2 | ePaper DC | E-Paper | 専用制御線 |
| 3 | ePaper RST | E-Paper | 専用制御線 |
| 4 | ePaper BUSY | E-Paper | 専用入力線 |
| 5 | microSD CS | microSD | 専用CS |

## 留意点

- E-PaperとmicroSDはCSを必ず分離する
- 同時アクセスを避ける
- microSDのMISO使用有無を確認する
- XIAO ePaper Breakout Board V2のピン割当を優先する

---

# 5. ICS-43434配線

## 方針

ICS-43434は音環境観測用としてI2S接続する。XIAO ESP32S3 Plusの背面ランドを使用する。

| 項番 | ICS-43434信号 | 接続先 | 備考 |
|---:|---|---|---|
| 1 | BCLK | MTCK(GPIO39) | I2S bit clock |
| 2 | WS | MTDO(GPIO40) | I2S word select |
| 3 | DATA | MTDI(GPIO41) | I2S data |
| 4 | L/R | GND | チャンネル固定 |
| 5 | VDD | 3.3V電源バス | 実モジュール仕様を確認 |
| 6 | GND | GNDバス | 共通GND |

## 予備

| 信号 | 用途 |
|---|---|
| MTMS(GPIO42) | 予備 |

---

# 6. MCP23017配線

## 用途

- ロータリーエンコーダ
- ボタン類
- 補助GPIO

## 方針

XIAO本体のGPIOは、E-Paper、microSD、I2C、I2S、電源関連に優先配分する。操作系はMCP23017側へ逃がす。

## 接続

| 項番 | MCP23017信号 | 接続先 | 備考 |
|---:|---|---|---|
| 1 | VDD | 3.3V電源バス | 3.3V運用 |
| 2 | VSS | GNDバス | 共通GND |
| 3 | SDA | I2C SDA | D4 SDAへ接続 |
| 4 | SCL | I2C SCL | D5 SCLへ接続 |
| 5 | GPA/GPB | Rotary Encoder / Button / 補助GPIO | 詳細割当は後続で確定 |

---

# 7. HLK-LD2410C配線

## 方針

初号機ではOUT 1本接続を基本とする。UART詳細取得は後日拡張または保守用端子扱いとする。

| 項番 | 信号 | 接続先 | 備考 |
|---:|---|---|---|
| 1 | VCC | 3.3Vまたは5V | 実モジュール仕様を確認する |
| 2 | GND | GNDバス | 共通GND |
| 3 | OUT | XIAO GPIOまたはMCP23017 | 初号機ではOUT 1本接続を基本 |
| 4 | UART TX/RX | 未接続または保守用端子 | 詳細取得は後日拡張 |

---

# 8. RTC配線

## 方針

I2C接続RTCを搭載する。型番は未確定。

## 候補

- DS3231
- PCF8523
- RV-8803
- RX8900

## 接続

| 項番 | RTC信号 | 接続先 | 備考 |
|---:|---|---|---|
| 1 | VCC | 3.3V電源バス | モジュール仕様を確認 |
| 2 | GND | GNDバス | 共通GND |
| 3 | SDA | I2C SDA | D4 SDAへ接続 |
| 4 | SCL | I2C SCL | D5 SCLへ接続 |
| 5 | INT / SQW | 未接続または予備 | 使用有無未確定 |

---

# 9. 未確定事項

- IP5306モジュールの具体端子名
- IP5306の常時出力可否
- TPS63802モジュールのEN端子有無
- P-MOSFET型番
- P-MOSFETの向きとゲート処理
- P-MOSFET周辺抵抗値
- 3.3Vバスの許容電流
- RTC型番
- RTC選定理由
- LD2410Cの電源電圧
- MCP23017の詳細ピン割当
- E-Paper Breakout Board V2の最終ピン割当
