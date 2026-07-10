# digital-kakejiku 配線図

最終更新: 2026-07-10
文書版: vNext 1.4 wiring revised

---

# 1. 目的

本書は digital-kakejiku の配線設計に関する基準源である。

本書では、

- 電源配線
- 信号配線
- バス構成
- 本体基板・電源基板間インターフェース
- 配線設計上の制約

を定義する。

部品仕様および設計思想については
「08_POWER_ARCHITECTURE.md」を基準源とする。

---

# 2. 電源系

## 2.1 電源ブロック

```text
USB Type-C
      │
      ▼
PTC（Polyfuse）
      │
      ▼
IP5306
 ├────18650 Battery
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
      └────────TPS63802 VIN
                     │
                     ▼
                TPS63802
                     │
                     ▼
                3.3V_OUT
```

---

## 2.2 電源配線方針

USB入力は

USB Type-C

↓

PTC

↓

IP5306

の順に接続する。

IP5306 OUT_5V は

DMG2305UX-13

を経由して

5V_BUS

へ供給する。

TPS63802は

5V_BUS

から

3.3V_OUT

を生成する。

---

## 2.3 USB Type-C

USB Type-C基板は

CC1

CC2

に

5.1kΩ

終端抵抗が実装済みである。

したがって

外付けCC抵抗は実装しない。

USB GNDは

5V_GND

へ接続する。

USB D+

USB D-

は

電源系とは独立して配線する。

---

## 2.4 GND設計

本システムでは

- 5V_GND
- 3.3V_GND
- SENSE_GND

の3系統を採用する。

これらは

電源基板上では

見かけ上完全に分離して配線する。

TPS63802内部で

GNDが導通していても

設計上は共有しないものとして扱う。

各GNDは

10PINコネクタまで

独立配線とする。

一点接続は

本体基板側

XIAO ESP32S3 Plus近傍

のみとする。

---

# 3. I2C

I2Cバスは

XIAO ESP32S3 Plus

の標準I2Cを使用する。

全デバイスを

3.3V系

へ接続する。

| デバイス | アドレス | 備考 |
|-----------|-----------|------|
| SCD41 | 0x62 | CO₂ |
| SGP41 | 0x59 | VOC / NOx |
| SPS30 | 0x69 | 実機確認済み |
| LTR390 | 0x53 | UV / ALS |
| BME680 | 0x76 / 0x77 | 実装依存 |
| MCP23017 | 0x20 | GPIO拡張 |
| DS3231 | 0x68 | RTC |
| AT24C32 | 0x57 | EEPROM |
| OLED | 未確定 | 128×128 第一候補 |

I2Cプルアップは

3.3V_OUT

を使用する。

---

# 4. SPI

SPIバスは

E-Paper

microSD

で共有する。

| 信号 | 接続先 |
|--------|--------------------|
| SCK | E-Paper / microSD |
| MOSI | E-Paper / microSD |
| MISO | microSD |
| CS | 個別配線 |

OLEDは

I2C接続のため

SPIには接続しない。

SPI配線は

可能な限り短くし、

3.3V_GNDをリターン経路とする。

CSラインは

デバイスごとに

独立して配線する。

---

# 5. I2S

## 5.1 基本方針

音環境観測には

ICS-43434

を採用する。

I2S専用バスを使用し、

他の通信バスとは共有しない。

I2S信号は

3.3V_OUT

を基準電源とし、

3.3V_GND

をリターン経路とする。

---

## 5.2 接続

| 信号 | 接続先 |
|------|--------|
| BCLK | XIAO I2S BCLK |
| WS | XIAO I2S WS |
| DATA | XIAO I2S DATA |
| L/R | GND固定 |
| VDD | 3.3V_OUT |
| GND | 3.3V_GND |

---

## 5.3 配線方針

BCLK

WS

DATA

は可能な限り並走させる。

電源線、

5V_BUS、

USB通信線とは

長距離並走させない。

交差する場合は

直角交差を基本とする。

---

# 6. D11～D19側面ランド取り出し

## 6.1 基本方針

XIAO ESP32S3 Plusの

D11～D19側面ランドを

本体基板へ取り出す。

側面ランドは

信号線専用とし、

大電流経路には使用しない。

---

## 6.2 取り出し方法

| 項目 | 方針 |
|------|------|
| 取り出し基板 | 専用ミニ基板 |
| 用途 | 信号取り出し専用 |
| コネクタ | JST-XH 2ピン |
| 配線 | Signal＋GND |

各JSTは

Pin1

Signal

Pin2

GND

とする。

---

## 6.3 GND

各JSTのGNDは

本体基板側

3.3V_GND

へ接続する。

SPS30

5V_BUS

TPS63802入力

などの

大電流リターンとして

使用してはならない。

---

## 6.4 配置

配線交差を避けるため

基本配置は

D11～D14

左側

D15～D19

右側

とする。

必要に応じて変更を認める。

---

# 7. 背面UI

## 7.1 OLED

背面保守UIは

I2C OLED

を採用する。

第一候補

128×128

第二候補

128×64

とする。

| 信号 | 接続先 |
|------|--------|
| SDA | I2C SDA |
| SCL | I2C SCL |
| VCC | 3.3V_OUT |
| GND | 3.3V_GND |

---

## 7.2 Rotary Encoder

押下スイッチ付き

ロータリーエンコーダ

を採用する。

入力は

MCP23017

へ接続する。

| 信号 | 接続先 |
|------|--------|
| A | MCP23017 |
| B | MCP23017 |
| SW | MCP23017 |

RGB LEDは

採用しない。

---

## 7.3 配線

OLED

Rotary Encoder

ともに

3.3V系

のみを使用する。

5V系とは

独立して配線する。

---

# 8. 電圧系統

## 8.1 5V系

5V_BUSから給電する。

対象は

- TPS63802入力
- SPS30
- 必要に応じた5V負荷

とする。

5V系は

5V_GND

をリターン経路とする。

---

## 8.2 3.3V系

TPS63802出力から給電する。

対象は

- XIAO ESP32S3 Plus
- BME680
- SCD41
- SGP41
- LTR390
- MCP23017
- DS3231
- AT24C32
- OLED
- ICS-43434

とする。

3.3V系は

3.3V_GND

を使用する。

---

## 8.3 SENSE系

SENSE系は

測定専用である。

対象は

- Battery_SENSE
- 5V_SENSE
- SENSE_GND

とする。

SENSE_GNDには

負荷電流を流してはならない。

---

## 8.4 LD2410C

LD2410Cの

電源電圧は

実機確認後

最終決定する。

現時点では

未確定事項とする。

---

# 9. 電源基板回路設計方針

## 9.1 基本方針

電源基板は

- USB入力
- UPS制御
- 5V配電
- 3.3V生成
- 電圧監視

を担当する独立基板とする。

本体基板とは

10PINコネクタ

により接続する。

---

## 9.2 系統構成

| 系統 | 対象 |
|------|------|
| 5V系 | USB-C・PTC・IP5306・DMG2305UX-13・5V_BUS・TPS63802 VIN |
| 3.3V系 | TPS63802 VOUT・3.3V_OUT |
| SENSE系 | Battery_SENSE・5V_SENSE |
| USB通信 | USB D+・USB D- |

---

## 9.3 GND設計

本設計では

- 5V_GND
- 3.3V_GND
- SENSE_GND

を採用する。

TPS63802内部では

各GNDが導通している可能性があるが、

**設計上は共有しないものとして扱う。**

電源基板上では

3系統を完全に独立して配線し、

10PINコネクタまで

個別に引き出す。

一点接続は

本体基板側

XIAO ESP32S3 Plus近傍

のみとする。

---

## 9.4 10PINインターフェース

10PINコネクタは

配電系

測定系

を明確に分離する。

### 配電系

- 5V_OUT
- 5V_GND
- 3.3V_OUT
- 3.3V_GND

### 測定系

- Battery_SENSE
- 5V_SENSE
- SENSE_GND

測定系を

配電用途へ使用してはならない。

---

# 10. 電源基板ピン配置

図面は

**部品面（表面）から見た配置**

とする。

---

## 10.1 USB Type-C

| ピン | 接続先 |
|------|--------|
| VBUS | PTC入力 |
| GND | 5V_GND |
| CC1 | 基板内5.1kΩ |
| D- | 本体基板 USB D- |
| D+ | 本体基板 USB D+ |
| CC2 | 基板内5.1kΩ |

USB通信線は

電源配線から離して配線する。

---

## 10.2 IP5306

| ピン | 接続先 |
|------|--------|
| VIN | PTC出力 |
| BAT | 18650 |
| GND | 5V_GND |
| OUT_5V | DMG2305UX-13 Source |

Battery_SENSEは

BAT端子から

分圧回路へ接続する。

---

## 10.3 DMG2305UX-13

正式配線は

| 端子 | 接続 |
|------|------|
| Source | OUT_5V |
| Drain | 5V_BUS |
| Gate | 100kΩ → 5V_GND |

Source

Drain

を逆接続してはならない。

Gateは

GPIO制御を行わず、

100kΩにより

5V_GNDへ接続する。

---

## 10.4 TPS63802

TPS63802は

5V_BUSから

3.3V_OUTを生成する。

### VIN

外側ホール

主配線

内側ホール

入力コンデンサ接続

### VOUT

外側ホール

主配線

内側ホール

出力コンデンサ接続

### GND

GNDピンは

3.3V_GND

へ接続する。

設計上は

5V_GND

SENSE_GND

とは独立して扱う。

---

## 10.5 本体基板向け10PIN

| Pin | 信号 | 用途 |
|----:|------|------|
| 1 | 5V_SENSE | 測定専用 |
| 2 | SENSE_GND | 測定専用 |
| 3 | Battery_SENSE | 測定専用 |
| 4 | 3.3V_GND | 配電 |
| 5 | 3.3V_OUT | 配電 |
| 6 | 3.3V_OUT | 配電 |
| 7 | 5V_GND | 配電 |
| 8 | 5V_GND | 配電 |
| 9 | 5V_OUT | 配電 |
|10 | 5V_OUT | 配電 |

5V_OUT

5V_GND

3.3V_OUT

3.3V_GND

は

配電ランドとして使用できる。

Battery_SENSE

5V_SENSE

SENSE_GND

は

測定専用とし、

他用途へ流用してはならない。

四隅ヘッダーは

支柱固定専用とする。

---

# 11. 電源基板主要配線

## 11.1 5V主電源経路

```text
USB Type-C VBUS
        │
        ▼
PTC（Polyfuse）
        │
        ▼
IP5306 VIN
        │
        ▼
IP5306 OUT_5V
        │
        ▼
DMG2305UX-13 Source
        │
DMG2305UX-13 Drain
        │
        ▼
      5V_BUS
       ├────────5V_OUT
       ├────────5V_SENSE
       └────────TPS63802 VIN
```

5V_BUSは

- 本体基板5V出力
- TPS63802入力
- 5V系負荷

への共通配電ラインとする。

---

## 11.2 3.3V配電経路

```text
TPS63802
      │
      ▼
 3.3V_OUT
      │
      ├────XIAO
      ├────I2Cセンサー
      ├────OLED
      ├────MCP23017
      ├────RTC
      └────ICS-43434
```

3.3V系は

3.3V_GND

をリターン経路とする。

---

## 11.3 GND配線

本設計では

3系統のGNDを採用する。

### 5V_GND

接続対象

- USB Type-C
- PTC
- IP5306
- DMG2305UX-13
- 18650

### 3.3V_GND

接続対象

- TPS63802
- 3.3V系負荷
- XIAO

### SENSE_GND

接続対象

- Battery_SENSE
- 5V_SENSE
- 分圧回路
- ADC平滑コンデンサ

3系統は

電源基板上では

接続しない。

---

## 11.4 Battery_SENSE

```text
BAT
 │
100kΩ
 │
●────Battery_SENSE
 │
100kΩ
 │
SENSE_GND

Battery_SENSE
 │
0.1µF
 │
SENSE_GND
```

---

## 11.5 5V_SENSE

```text
5V_BUS
 │
150kΩ
 │
●────5V_SENSE
 │
100kΩ
 │
SENSE_GND

5V_SENSE
 │
0.1µF
 │
SENSE_GND
```

---

# 12. 受動部品

## 12.1 USB入力

| 部品 | 用途 |
|------|------|
| 0.1µF | 高周波除去 |
| 470µF | バルクコンデンサ |

配置順

IP5306

↓

0.1µF

↓

470µF

---

## 12.2 TPS63802入力

| 部品 | 用途 |
|------|------|
| 0.1µF | デカップリング |
| 470µF | バルクコンデンサ |

配置順

TPS63802

↓

0.1µF

↓

470µF

---

## 12.3 TPS63802出力

| 部品 | 用途 |
|------|------|
| 0.1µF | デカップリング |
| 220µF | バルクコンデンサ |

配置順

TPS63802

↓

0.1µF

↓

220µF

---

## 12.4 分圧回路

Battery_SENSE

5V_SENSE

ともに

ADC入力安定化のため

0.1µF

を中点へ接続する。

---

## 12.5 Gateプルダウン

DMG2305UX-13 Gateは

100kΩ

により

5V_GND

へ接続する。

---

# 13. テストポイント

## 基本方針

主要電圧は

すべてテストポイントを設ける。

USB D+

USB D-

は

専用テストピンを設けず

ランド確認のみとする。

---

## 推奨テストポイント

| 名称 | 用途 |
|------|------|
| TP_USB_VBUS | USB入力確認 |
| TP_PTC_OUT | PTC出力確認 |
| TP_IP5306_VIN | IP5306入力確認 |
| TP_IP5306_OUT | IP5306出力確認 |
| TP_BAT | バッテリー確認 |
| TP_5V_BUS | 主5V確認 |
| TP_TPS_VIN | TPS入力確認 |
| TP_3V3 | 3.3V確認 |
| TP_BAT_SENSE | Battery_SENSE |
| TP_5V_SENSE | 5V_SENSE |
| TP_GND_5V | 5V_GND |
| TP_GND_3V3 | 3.3V_GND |
| TP_GND_SENSE | SENSE_GND |

---

## 配置方針

測定頻度が高い

TP_5V_BUS

TP_3V3

TP_BAT

は

基板外周へ配置する。

GNDは

ワニ口クリップを接続できる

GNDループを

少なくとも1箇所設ける。

USB D+

USB D-

は

ランドのみとし、

ヘッダーピンは設けない。

---

# 14. USB D+/D-独立配線

## 14.1 基本方針

USB通信は

USB Type-C

↓

XIAO ESP32S3 Plus

を直接接続する。

USB通信系は

電源系とは独立した系統として扱う。

---

## 14.2 配線

```text
USB Type-C
    │
    ├──── D+
    │
    └───────────────► XIAO USB D+

USB Type-C
    │
    ├──── D-
    │
    └───────────────► XIAO USB D-
```

USB D+

USB D-

は

近接並走配線とする。

---

## 14.3 配線ルール

以下を設計基準とする。

- D+・D-は対として並走させる。
- 5V_BUSと長距離並走させない。
- TPS63802周辺を極力避ける。
- IP5306周辺を極力避ける。
- 必要な場合のみ直角交差する。
- 電源線との平行配線は最小限とする。

---

## 14.4 GND

USB通信の基準GNDは

5V_GND

とする。

USB通信専用に

新たなGNDを設けない。

---

# 15. 通電前チェック

## 15.1 導通確認

初回通電前に

以下を確認する。

| 確認項目 | 判定 |
|-----------|------|
| USB VBUS－5V_GND短絡なし | □ |
| PTC出力－5V_GND短絡なし | □ |
| IP5306 VIN－5V_GND短絡なし | □ |
| BAT＋－5V_GND短絡なし | □ |
| 5V_BUS－5V_GND短絡なし | □ |
| TPS63802 VIN－5V_GND短絡なし | □ |
| TPS63802 VOUT－3.3V_GND短絡なし | □ |
| 5V_BUS－3.3V_OUT短絡なし | □ |

---

## 15.2 GND確認

以下を確認する。

- 5V_GNDが独立していること
- 3.3V_GNDが独立していること
- SENSE_GNDが独立していること
- 電源基板上で相互接続されていないこと

TPS63802内部導通は

設計対象外とする。

---

## 15.3 SENSE確認

以下を確認する。

- Battery_SENSE分圧中点
- 5V_SENSE分圧中点
- 下側抵抗がSENSE_GNDへ接続されていること
- 0.1µFが接続されていること

---

## 15.4 DMG2305UX-13確認

正式接続は

| 端子 | 接続 |
|------|------|
| Source | OUT_5V |
| Drain | 5V_BUS |
| Gate | 100kΩ→5V_GND |

であることを確認する。

Source

Drain

逆接続は禁止する。

---

## 15.5 TPS63802確認

以下を確認する。

- VIN外側ホールが主配線
- VIN内側ホールが入力コンデンサ
- VOUT外側ホールが主配線
- VOUT内側ホールが出力コンデンサ
- 入力470µF＋0.1µF
- 出力220µF＋0.1µF

---

## 15.6 初回通電

以下の順で実施する。

1. USB入力のみ接続
2. 無負荷通電
3. IP5306出力確認
4. 5V_BUS確認
5. TPS63802入力確認
6. 3.3V_OUT確認
7. XIAOのみ接続
8. USB通信確認

---

# 16. 未確定事項

以下は現時点で未確定とする。

- OLED最終型番
- MCP23017ポート割付
- LD2410C電源電圧
- D11～D19最終割付
- E-Paper Breakout V2最終実装位置

---

# 17. STATUS

| 項目 | 状態 |
|------|------|
| I2C共有 | CONFIRMED |
| SPI共有 | CONFIRMED |
| I2S配線 | CONFIRMED |
| OLED I2C化 | FINALIZED |
| Rotary Encoder | FINALIZED |
| D11～D19取り出し | CONFIRMED |
| USB-C配線 | FINALIZED |
| DMG2305UX-13 | FINALIZED |
| TPS63802 | FINALIZED |
| GND設計 | FINALIZED |
| 10PIN仕様 | FINALIZED |
| 電源基板PoC | IN_PROGRESS |

---

# 18. CHANGE LOG

| 日付 | 内容 |
|------|------|
| 2026-06-20 | 背面UI配線をI2C OLED＋MCP23017へ統一 |
| 2026-06-25 | D11～D19側面ランド取り出しへ変更 |
| 2026-06-29 | 電源基板配線案、受動部品、テストポイントを追加 |
| 2026-07-10 | USB Type-C(CC1/CC2 5.1kΩ実装済み)を正式仕様化 |
| 2026-07-10 | DMG2305UX-13接続を Source＝OUT_5V、Drain＝5V_BUS、Gate＝100kΩ→5V_GND に修正 |
| 2026-07-10 | TPS63802同名ホール運用（外側：主配線、内側：コンデンサ接続）を追加 |
| 2026-07-10 | GND設計を全面改訂し、5V_GND・3.3V_GND・SENSE_GNDを電源基板上で見かけ上完全分離、本体基板XIAO近傍で一点接続する方針へ変更 |
| 2026-07-10 | TPS63802入力470µF・出力220µF構成へ更新 |
| 2026-07-10 | 10PINコネクタの役割を配電系・測定系に整理 |
| 2026-07-10 | 通電前チェックを全面更新 |