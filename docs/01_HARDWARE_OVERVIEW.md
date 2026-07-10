# digital-kakejiku ハードウェア概要

最終更新: 2026-07-10
文書版: vNext 1.4 hardware revised

---

# 1. 目的

本書は digital-kakejiku のハードウェア構成に関する基準源である。

本書では

- システム構成
- 採択ハードウェア
- 基板構成
- 電源構成
- 配線方針

について概要を定義する。

詳細な配線仕様は

05_WIRING_DIAGRAM.md

詳細な電源設計は

08_POWER_ARCHITECTURE.md

を基準源とする。

---

# 2. 全体構成

```text
各種センサー
      │
      ▼
XIAO ESP32S3 Plus
      │
 Wi-Fi / HTTPS POST
      │
      ▼
Google Apps Script
      │
      ▼
Google Spreadsheet
      │
      ▼
Gemini
      │
      ▼
7.5inch E-Paper
```

本システムは

常時給電型据置観測器

として設計する。

通常運転はUSB給電とし、

停電時のみ

18650リチウムイオン電池へ自動切替を行う。

---

# 3. MCU

## 採択

MCUは

Seeed Studio

XIAO ESP32S3 Plus

を採用する。

初号機は

1台構成

を維持する。

---

## GPIO方針

| 区分 | 方針 |
|------|------|
| 2.54mmヘッダー | 使用可 |
| 裏面ランド | 原則使用しない |
| USB D+・D- | 例外として裏面ランド使用可 |
| D11〜D19 | 使用可 |
| GPIO拡張 | MCP23017採択 |

---

## D11〜D19

D11〜D19は

側面ランドから

専用ミニ基板を介して

本体基板へ取り出す。

取り出し基板は

信号取り出し専用とし、

抵抗、

RC回路、

レベル変換回路

は実装しない。

---

## GND

D11〜D19用GNDは

信号リターン専用とする。

SPS30、

TPS63802、

USB入力

などの

大電流リターンには使用しない。

---

# 4. 電源

## 基本構成

UPS方式を採用する。

通常時

USB給電

停電時

18650給電

へ自動切替する。

PowerManagerは

監視のみ行い、

電源切替制御は行わない。

---

## 採択部品

| 部品 | 用途 | 状態 |
|------|------|------|
| USB Type-C | 外部5V入力・USB通信 | CONFIRMED |
| PTC | USB入力保護 | CONFIRMED |
| 18650 | バックアップ電源 | CONFIRMED |
| IP5306 | 充電・昇圧 | CONFIRMED |
| DMG2305UX-13 | 5V経路保護・逆流抑制 | CONFIRMED |
| TPS63802 | 3.3V生成 | CONFIRMED |

---

## 電源フロー

```text
USB Type-C
      │
      ▼
PTC
      │
      ▼
IP5306
 ├────18650
 │
 └────OUT_5V
          │
          ▼
DMG2305UX-13
          │
          ▼
5V_BUS
 ├────────5V_OUT
 ├────────5V_SENSE
 └────────TPS63802
             │
             ▼
        3.3V_OUT
```

---

## USB Type-C

採用するUSB Type-C基板には

CC1

CC2

それぞれ

5.1kΩ

終端抵抗が実装済みである。

そのため

外付けCC抵抗は実装しない。

USB GNDは

5V_GND

へ接続する。

---

## GND設計

本システムでは

- 5V_GND
- 3.3V_GND
- SENSE_GND

の3系統を採用する。

電源基板上では

3系統を

見かけ上完全分離

して配線する。

TPS63802内部で

GNDが導通していても

設計上は共有しない。

一点接続は

本体基板側

XIAO ESP32S3 Plus近傍

のみとする。

---

## 電源基板

電源基板は

本体基板上へ

亀の子実装

を許容する。

高低差を設けることで

発熱部から

温湿度センサーへの

熱対流を抑制する。

基板下部は

コンデンサ、

抵抗など

背の低い受動部品の配置領域として利用できる。

---

# 5. 表示

## 5.1 前面表示

前面表示には

7.5inch モノクロ E-Paper

を採用する。

| 項目 | 内容 |
|------|------|
| サイズ | 7.5inch |
| 解像度 | 800×480 |
| 接続 | SPI |
| ドライバ | XIAO ePaper Breakout V2 |
| 用途 | 日めくり表示専用 |

E-Paperは

SPI専用デバイスとし、

microSDとSPIバスを共有する。

---

## 5.2 実装方針

E-Paperドライバ基板は

本体基板から分離して配置できる構造とする。

長めのフレキシブルケーブルを使用し、

XIAOおよび電源基板を

本体基板近傍へ配置できる構成を許容する。

これにより

- 放熱性
- 配線性
- 保守性

を向上させる。

---

## 5.3 背面UI

背面には

保守コンソールを配置する。

通常運転中は

表示更新のみ行い、

各種設定変更は保守画面から実施する。

---

### OLED

OLEDは

I2C接続とする。

| 項目 | 内容 |
|------|------|
| 接続 | I2C |
| 第一候補 | 128×128 OLED |
| 第二候補 | 128×64 OLED |
| 電源 | 3.3V_OUT |
| GND | 3.3V_GND |

OLEDは

SPIバスを使用しない。

---

### Rotary Encoder

押下スイッチ付き

ロータリーエンコーダを採用する。

入力は

MCP23017

へ接続する。

| 信号 | 接続先 |
|------|--------|
| A | MCP23017 |
| B | MCP23017 |
| SW | MCP23017 |

RGB LED付きエンコーダは

採用しない。

---

## 5.4 背面UI設計方針

背面UIでは

- 状態表示
- 保守メニュー
- 詩の再生成
- システム確認

を行う。

設定値本文の編集は行わない。

system_config

source_config

は

GAS側で管理する。

ESP32から

直接編集は行わない。

---

# 6. センサー

## 採択一覧

| センサー | 用途 | 接続 | 状態 |
|----------|------|------|------|
| SCD41 | CO₂ | I2C | CONFIRMED |
| SGP41 | VOC / NOx | I2C | CONFIRMED |
| SPS30 | PM | I2C | CONFIRMED |
| LTR390 | UV / ALS | I2C | CONFIRMED |
| BME680 | 温湿度・気圧 | I2C | CONFIRMED |
| HLK-LD2410C | 人感 | OUT | CONFIRMED |
| ICS-43434 | 音環境 | I2S | CONFIRMED |
| DS3231 | RTC | I2C | CONFIRMED |
| AT24C32 | EEPROM | I2C | CONFIRMED |

---

## 接続方針

I2Cデバイスは

すべて

3.3V_OUT

から給電する。

I2Cプルアップも

3.3V_OUT

へ統一する。

---

## SPS30

SPS30は

5V_BUS

から給電する。

電源リターンは

5V_GND

とする。

SPS30のGNDを

SENSE_GND

へ接続してはならない。

---

## HLK-LD2410C

初号機では

OUT信号のみ接続する。

UARTは

保守用途として

将来対応とする。

電源電圧は

実機確認後に最終決定する。

---

## ICS-43434

ICS-43434は

I2S専用接続とする。

電源は

3.3V_OUT

GNDは

3.3V_GND

を使用する。

---

# 7. USB

## 基本方針

USB Type-Cは

- 外部5V入力
- USB通信

の2用途を兼ねる。

---

## USB通信

USB D+

USB D-

は

本体基板上の

XIAO ESP32S3 Plus

へ直接接続する。

```text
USB Type-C D+ ─────► XIAO USB D+

USB Type-C D- ─────► XIAO USB D-
```

---

## 配線ルール

USB D+

USB D-

は

近接並走配線とする。

以下を避ける。

- 5V_BUSとの長距離並走
- TPS63802周辺
- IP5306周辺

必要な場合のみ

直角交差とする。

---

## GND

USB通信の基準GNDは

5V_GND

とする。

USB通信専用GNDは

設けない。

---

## USB Type-C

採用するUSB Type-C基板は

CC1

CC2

に

5.1kΩ終端抵抗を内蔵する。

外付けCC抵抗は

実装しない。

---

# 8. 未確定事項

以下の項目は現時点では正式採択に至っておらず、
実機評価またはPoC完了後に確定する。

| 項目 | 状態 | 確定条件 |
|------|------|----------|
| OLED最終型番 | PROPOSED | 128×128候補の評価完了 |
| LD2410C電源電圧 | PROPOSED | 実機評価 |
| MCP23017最終ポート割付 | PROPOSED | 本体基板設計完了 |
| D11〜D19最終割付 | PROPOSED | 配線設計完了 |
| E-Paper Breakout V2最終配置 | PROPOSED | 本体基板レイアウト確定 |
| Battery_SENSE校正式 | PROPOSED | ADC評価完了 |
| 5V_SENSE校正式 | PROPOSED | ADC評価完了 |

---

## 今後のPoC対象

以下はPoCにより確認する。

### 電源

- UPS切替時間
- DMG2305UX-13温度
- TPS63802効率
- 発熱状況
- リップル

### USB

- USB通信安定性
- USB給電切替
- PC接続時の安定性

### センサー

- I2Cバス負荷
- I2Sノイズ
- SPS30ノイズ影響
- Battery_SENSE精度
- 5V_SENSE精度

---

# 9. STATUS

| 項目 | 状態 |
|------|------|
| MCU構成 | CONFIRMED |
| 1台構成 | CONFIRMED |
| GPIO方針 | FINALIZED |
| D11〜D19利用 | FINALIZED |
| 電源方式 | FINALIZED |
| USB Type-C | FINALIZED |
| IP5306 | FINALIZED |
| DMG2305UX-13 | FINALIZED |
| TPS63802 | FINALIZED |
| GND設計 | FINALIZED |
| 10PIN仕様 | FINALIZED |
| 前面表示 | CONFIRMED |
| 背面UI | FINALIZED |
| センサー選定 | CONFIRMED |
| 電源基板PoC | IN_PROGRESS |

---

# 10. CHANGE LOG

| 日付 | 内容 |
|------|------|
| 2026-06-20 | vNext 1.1査読反映版として全面再生成 |
| 2026-06-25 | D11〜D19側面ランド利用、裏面ランド原則禁止を反映 |
| 2026-06-29 | 電源基板構成、USB D+/D-例外利用、DMG2305UX-13採択継続を反映 |
| 2026-07-10 | USB Type-C(CC1/CC2 5.1kΩ実装済み)を正式仕様化 |
| 2026-07-10 | 電源構成を「USB Type-C→PTC→IP5306→DMG2305UX-13→5V_BUS→TPS63802→3.3V_OUT」へ更新 |
| 2026-07-10 | DMG2305UX-13接続を Source＝OUT_5V、Drain＝5V_BUS、Gate＝100kΩ→5V_GND に修正 |
| 2026-07-10 | TPS63802同名2ホール運用（外側：主配線、内側：コンデンサ接続）を正式仕様化 |
| 2026-07-10 | GND設計を全面改訂し、5V_GND・3.3V_GND・SENSE_GNDを電源基板上で見かけ上完全分離、本体基板XIAO近傍で一点接続する方針へ更新 |
| 2026-07-10 | 電源基板を独立サブ基板とし、10PINインターフェースによる接続構成を明確化 |
| 2026-07-10 | PowerManagerは電源切替を制御せず、監視・ログ管理のみを担当する仕様を反映 |
| 2026-07-10 | TPS63802入力470µF＋0.1µF、出力220µF＋0.1µF構成を正式仕様化 |
| 2026-07-10 | 背面UI、USB、センサー、GPIO方針について最新設計へ全面更新 |