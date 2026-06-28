# digital-kakejiku ハードウェア概要

最終更新: 2026-06-29  
文書版: vNext 1.3 hardware-power reflected

---

# 1. 目的

本書は digital-kakejiku のハードウェア構成の基準源である。

## 位置づけ

本ドキュメントは、対象領域の基準源を明示し、他文書では要約または参照に留める。  
詳細仕様が他文書の基準源にある場合、本書では重複記述を避け、参照先を明示する。

| 領域 | 基準源 |
|---|---|
| ハードウェア構成 | 01_HARDWARE_OVERVIEW.md |
| ソフトウェア構成 | 02_SOFTWARE_OVERVIEW.md |
| ログ形式 | 03_LOG_FORMAT.md |
| 状態遷移 | 04_STATE_MACHINE.md |
| 配線 | 05_WIRING_DIAGRAM.md |
| GAS API | 06_GAS_API_SPEC.md |
| 表示・背面UI | 07_DISPLAY_UI_SPEC.md |
| 電源 | 08_POWER_ARCHITECTURE.md |
| SPI共有制御 | 09_SPI_RESOURCE_CONTROL.md |
| Calendar / Poem | 10_CALENDAR_POEM_SUBSYSTEM.md |
| セキュリティ | 11_SECURITY_MANAGEMENT.md |
| 設定管理 | 12_CONFIGURATION_MANAGEMENT.md |
| GAS運用 | 13_GAS_OPERATION_POLICY.md |
| Spreadsheet Schema | 14_SPREADSHEET_SCHEMA.md |
| GAS実装 | 15_GAS_IMPLEMENTATION_GUIDE.md |
| 試験 | 16_TESTING_STRATEGY.md |
| 障害対応 | 17_TROUBLESHOOTING.md |

---

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

---

# 3. MCU

採択。

- XIAO ESP32S3 Plus
- 1台構成を維持する

GPIO方針。

| 区分 | 方針 |
|---|---|
| 2.54mmヘッダー | 使用可 |
| 裏面ランド | 原則使用禁止。ただしUSB D+/D-のみ例外的に使用可 |
| 1.27mm側面ランド | 使用解禁 |
| 1.27mm側面ランド対象 | D11〜D19 |
| D11〜D19 | 信号線＋GND撚り線をJST-XH 2ピンで本体基板へ接続 |
| D11〜D19ミニ基板 | 信号線＋GND取り出し専用。抵抗・RCは原則載せない |
| D11〜D19のGND | 本体基板GNDバスへ直結。ただし大電流帰路には使わない |
| GPIO拡張 | MCP23017採択 |

D11〜D19配置方針。

| 項目 | 方針 |
|---|---|
| 基本配置 | D11〜D14を左側JST列、D15〜D19を右側JST列に配置 |
| 例外 | 配線交差や用途上の合理性がある場合は左右配置を一部変更可 |
| コネクタ | JST-XH 2ピン |
| ペア | Signal + GND |
| GND用途 | 信号リターン専用 |

USB裏面ランド例外。

| 信号 | 方針 |
|---|---|
| USB D+ | XIAO裏面ランド使用を例外的に許可 |
| USB D- | XIAO裏面ランド使用を例外的に許可 |
| その他裏面ランド | 原則使用しない |

---

# 4. 電源

UPS方式を採択する。

| 部品 | 用途 | 状態 |
|---|---|---|
| USB-C | 外部5V入力・USB通信 | CONFIRMED |
| PTC / ポリスイッチ | USB入力過電流保護 | CONFIRMED |
| 18650 | 停電時電源 | CONFIRMED |
| IP5306 | 充電・昇圧管理 | CONFIRMED |
| DMG2305UX-13 | 5V経路制御 / 簡易逆流抑制 | CONFIRMED |
| TPS63802 | 3.3V生成 | CONFIRMED |

電源フロー。

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

電源基板は、本体基板上の亀の子構成を許容する。基板間に高低差を設け、発熱部からセンサー側への空気対流を抑制する。亀の子基板下には、ノイズ低減用コンデンサー等を配置できる前提とする。

---

# 5. 表示

## 前面

- 7.5inch E-Paper
- 800×480
- XIAO ePaper Breakout V2
- SPI接続
- 表示専用
- ePaperは長めリボンケーブルを用い、ドライバーボード＋XIAOを本体基板近傍へ配置可能とする

## 背面

- 保守コンソール
- I2C OLED
- 128×128 OLED 第一候補
- 128×64 OLED 代替候補
- 秋月電子販売コード114936 押下スイッチ付きロータリーエンコーダ
- MCP23017経由

背面UIでは設定値本文の編集は行わない。

---

# 6. センサー

| センサー | 用途 | 接続 | 状態 |
|---|---|---|---|
| SCD41 | CO2 | I2C | CONFIRMED |
| SGP41 | VOC / NOx | I2C | CONFIRMED |
| SPS30 | PM | I2C / 3.5V〜5.0V | CONFIRMED |
| LTR390 | UV / ALS | I2C | CONFIRMED |
| BME680 | 温湿度・気圧 | I2C | CONFIRMED |
| HLK-LD2410C | 人感 | OUT | CONFIRMED |
| ICS-43434 | 音環境 | I2S | CONFIRMED |
| DS3231 + AT24C32 | RTC | I2C | CONFIRMED |

補足。

- SPS30供給は5V BUSを基本とする。
- SPS30動作電圧は3.5V〜5.0Vとして扱う。
- I2Cプルアップは3.3V系に統一する。
- SGP41は手配完了済み。
- 採択センサー不足はない。

---

# 7. USB

USB-Cポートは以下の2用途を持つ。

1. USB 5V入力
2. XIAO ESP32S3 PlusとのUSB通信

USB D+/D-は電源系とは独立させ、本体基板上のXIAO裏面ランドへ接続する。

```text
USB-C D- → XIAO裏面 USB D-
USB-C D+ → XIAO裏面 USB D+
```

USB D+/D-は細い被覆線で短く並走させ、IP5306、TPS63802、5V BUSから離して配線する。

---

# 8. 未確定事項

| 項目 | 状態 | 確定条件 |
|---|---|---|
| OLED最終型番 | PROPOSED | I2C 128×128候補の実機確認 |
| IP5306実装モジュール | PROPOSED | 型番・負荷応答・発熱確認 |
| USB Presence検出方法 | PROPOSED | 5V_SENSEまたはIP5306信号の実回路確認 |
| LD2410C電源電圧 | PROPOSED | 実機確認 |
| ICS-43434音処理方式 | PROPOSED | RMS/FFT等をPhase2前に決定 |
| D11〜D19各PIN割当 | PROPOSED | 本体基板配線設計時 |
| I2S再割当 | PROPOSED | Phase2前 |

---

# 9. STATUS

| 項目 | 状態 |
|---|---|
| MCU | CONFIRMED |
| 電源方式 | CONFIRMED |
| 電源基板PoC | IN_PROGRESS |
| 前面表示 | CONFIRMED |
| 背面UI方針 | FINALIZED |
| センサー選定 | CONFIRMED |
| GPIO方針 | FINALIZED |
| D11〜D19取り出し構造 | CONFIRMED |
| USB D+/D-裏面ランド例外 | CONFIRMED |

---

# 10. CHANGE LOG

| 日付 | 内容 |
|---|---|
| 2026-06-20 | vNext 1.1査読反映版として全面再生成 |
| 2026-06-25 | 裏面ランド原則禁止、側面ランド使用解禁を反映 |
| 2026-06-29 | 電源基板方針、D11〜D19、USB D+/D-例外、DMG2305UX-13採択継続、DMG3415U撤回を反映 |
