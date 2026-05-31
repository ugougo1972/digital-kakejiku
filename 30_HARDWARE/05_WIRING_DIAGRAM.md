# 05_WIRING_DIAGRAM.md

# digital-kakejiku 配線図

最終更新: 2026-05-31

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

---

# 3. I2C配線

## 方針

I2Cはバス接続とし、XIAO本体のSDA / SCLに複数デバイスを接続する。

## 接続対象

| 項番 | デバイス | 接続 | 備考 |
|---:|---|---|---|
| 1 | SCD41 | I2C | CO₂ / 温湿度 |
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

---

# 4. SPI配線

## 方針

E-PaperとmicroSDはSPIバス共有を前提とする。

## 配線対象

| 項番 | 信号 | 接続先 | 備考 |
|---:|---|---|---|
| 1 | SCK | E-Paper / microSD | 共有 |
| 2 | MOSI | E-Paper / microSD | 共有 |
| 3 | MISO | microSD | E-Paper側で不要な場合あり |
| 4 | ePaper CS | E-Paper | 専用CS |
| 5 | ePaper DC | E-Paper | 専用制御線 |
| 6 | ePaper RST | E-Paper | 専用制御線 |
| 7 | ePaper BUSY | E-Paper | 専用入力線 |
| 8 | microSD CS | microSD | 専用CS |

---

# 5. MCP23017配線

## 用途

- ロータリーエンコーダ
- ボタン類
- 補助GPIO

## 方針

XIAO本体のGPIOは、E-Paper、microSD、I2C、電源関連に優先配分する。
操作系はMCP23017側へ逃がす。

---

# 6. HLK-LD2410C配線

| 項番 | 信号 | 接続先 | 備考 |
|---:|---|---|---|
| 1 | VCC | 3.3Vまたは5V | 実モジュール仕様を確認する |
| 2 | GND | GNDバス | 共通GND |
| 3 | OUT | XIAO GPIOまたはMCP23017 | 初号機ではOUT 1本接続を基本 |
| 4 | UART TX/RX | 未接続または保守用端子 | 詳細取得は後日拡張 |

---

# 7. 未確定事項

- IP5306モジュールの具体端子名
- TPS63802モジュールのEN端子有無
- P-MOSFET型番
- P-MOSFETの向きとゲート処理
- 3.3Vバスの許容電流
- RTC型番
- LD2410Cの電源電圧
