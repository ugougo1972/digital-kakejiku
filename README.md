# digital-kakejiku

据置型環境観測・暦表示・詩生成システム

最終更新: 2026-07-10
文書版: vNext 1.4 hardware-power reflected

---

# 1. 目的

本READMEは、digital-kakejikuプロジェクト全体の入口となる文書である。

本書では

- プロジェクト概要
- 現在の開発フェーズ
- 採択済みシステム構成
- 主要設計方針
- 基準源ドキュメント
- 今後の開発工程

を示す。

詳細仕様は各基準源ドキュメントを参照する。

特に

- 電源基板
- 配線設計
- GND設計
- テストポイント
- 通電前チェック

については

05_WIRING_DIAGRAM.md

08_POWER_ARCHITECTURE.md

を基準源とする。

---

# 2. プロジェクト概要

digital-kakejiku は

Seeed Studio

XIAO ESP32S3 Plus

を中核とした

据置型環境観測システムである。

環境情報を長期保存し、

暦情報と生成した詩を

7.5inch E-Paperへ表示する。

---

## 主な目的

- 環境観測
- 長期データ保存
- 暦表示
- 今日の詩表示
- 長期安定運用
- 保守性向上

---

## システム構成

```text
各種センサー
      │
      ▼
XIAO ESP32S3 Plus
      │
 HTTPS
      ▼
Google Apps Script
      │
Google Spreadsheet
      │
Gemini
      │
7.5inch E-Paper
```

---

## 主な特徴

- 据置型
- 常時給電
- UPS方式
- Google Apps Script中心構成
- Google Spreadsheet蓄積
- Calendar Subsystem
- Poem Subsystem
- 背面保守コンソール
- 電源基板分離構成
- 段階的な電源PoC

---

## 電源構成

正式採択構成は

```text
USB Type-C
        │
        ▼
PTC
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
      └────────TPS63802
                   │
                   ▼
              3.3V_OUT
```

---

## GND設計

本プロジェクトでは

- 5V_GND
- 3.3V_GND
- SENSE_GND

の3系統を採用する。

電源基板上では

見かけ上完全分離

して配線する。

TPS63802内部導通は

設計対象外とする。

一点接続は

本体基板側

XIAO ESP32S3 Plus近傍

のみとする。

---

# 3. 現在位置

## 現在フェーズ

```text
Phase 1
GAS本実装
```

状態

```text
IN_PROGRESS
```

---

## 並行作業

Phase1実装と並行して

以下を実施している。

- 電源基板配線設計
- 電源基板PoC準備
- 本体基板設計
- GitHub文書更新

---

## Phase1開始条件

以下はすべて完了している。

- Spreadsheet Schema
- GAS Implementation Guide
- GAS Retry Strategy
- Gemini Prompt Specification
- Testing Strategy
- Troubleshooting Guide
- Script Properties運用
- system_config設計
- source_config設計

Phase1開始判定は

**GO**

である。

---

## 現在のハードウェア進捗

現在は

```text
電源基板配線設計
      ↓
テストポイント整理
      ↓
導通確認準備
      ↓
無負荷通電
      ↓
XIAO単体起動試験
```

までを対象として進めている。

---

## 現在の重点作業

優先順位は以下とする。

1. GAS本実装
2. 電源基板PoC
3. 本体基板設計
4. GitHub文書更新
5. センサー統合

---

# 4. 採択済み構成

## MCU

| 項目 | 内容 |
|------|------|
| MCU | XIAO ESP32S3 Plus |
| 構成 | 1台構成 |
| GPIO拡張 | MCP23017 |
| ePaper Driver | XIAO ePaper Breakout V2 |

### GPIO方針

- D11～D19側面ランドを利用
- 裏面ランドは原則使用しない
- USB D+・D-のみ例外的に裏面ランド使用を許可
- D11～D19は信号専用として使用
- 大電流経路には使用しない

---

## Front Display

| 項目 | 内容 |
|------|------|
| 表示装置 | 7.5inch E-Paper |
| 解像度 | 800×480 |
| 接続 | SPI |
| 用途 | 日めくり表示 |

E-Paperは

SPI共有構成とし、

microSDとSCK・MOSI・MISOを共有する。

---

## Back UI

背面には

保守コンソールを配置する。

構成

- I2C OLED
- Rotary Encoder
- MCP23017

### OLED

- 第一候補：128×128
- 第二候補：128×64
- I2C接続
- 3.3V_OUT駆動

### Rotary Encoder

- 押下スイッチ付き
- RGB LEDなし
- MCP23017経由で接続

---

## 電源

正式採択構成

| 部品 | 状態 |
|------|------|
| USB Type-C | CONFIRMED |
| PTC | CONFIRMED |
| IP5306 | CONFIRMED |
| DMG2305UX-13 | CONFIRMED |
| TPS63802 | CONFIRMED |
| 18650 | CONFIRMED |

### 電源フロー

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

### GND設計

採用するGNDは

- 5V_GND
- 3.3V_GND
- SENSE_GND

電源基板上では

見かけ上完全分離

する。

一点接続は

本体基板

XIAO ESP32S3 Plus近傍

のみとする。

TPS63802内部導通は

設計対象外とする。

---

## センサー

| センサー | 用途 | 接続 |
|----------|------|------|
| SCD41 | CO₂ | I2C |
| SGP41 | VOC / NOx | I2C |
| SPS30 | PM | I2C（5V系） |
| LTR390 | UV / ALS | I2C |
| BME680 | 温湿度・気圧 | I2C |
| HLK-LD2410C | 人感 | OUT |
| ICS-43434 | 音環境 | I2S |
| DS3231 + AT24C32 | RTC | I2C |

I2Cプルアップは

3.3V_OUTへ統一する。

SPS30のみ

5V_BUSから給電する。

---

## Calendar

- GAS生成
- AI利用なし
- CALENDAR_PENDING採択
- 過去5年＋当年＋翌年保持
- 毎年12月1日に翌年分生成
- 指定期間・指定年再生成対応

---

## Poem

- Gemini API Free Tier
- 自由詩
- 客観描写
- 約100文字
- temperature=0.5
- 数値直接出力禁止
- 表示時再生成禁止

---

# 5. ドキュメント体系

設計・実装は

以下の文書群を基準源とする。

| 文書 | 用途 |
|------|------|
| README.md | プロジェクト入口 |
| CURRENT_STATUS.md | 現在の進捗 |
| ROADMAP.md | 開発計画 |
| 01_HARDWARE_OVERVIEW.md | ハードウェア概要 |
| 02_SOFTWARE_OVERVIEW.md | ソフトウェア概要 |
| 03_LOG_FORMAT.md | ログ仕様 |
| 04_STATE_MACHINE.md | 状態遷移 |
| 05_WIRING_DIAGRAM.md | 配線設計 |
| 06_GAS_API_SPEC.md | GAS API |
| 07_DISPLAY_UI_SPEC.md | UI仕様 |
| 08_POWER_ARCHITECTURE.md | 電源設計 |

---

## 実装文書

| 文書 | 用途 |
|------|------|
| 09_SPI_RESOURCE_CONTROL.md | SPI制御 |
| 10_CALENDAR_POEM_SUBSYSTEM.md | Calendar / Poem |
| 11_SECURITY_MANAGEMENT.md | Security |
| 12_CONFIGURATION_MANAGEMENT.md | 設定管理 |
| 13_GAS_OPERATION_POLICY.md | GAS運用 |
| 14_SPREADSHEET_SCHEMA.md | Spreadsheet |
| 15_GAS_IMPLEMENTATION_GUIDE.md | GAS実装 |
| 16_TESTING_STRATEGY.md | 試験 |
| 17_TROUBLESHOOTING.md | 障害対応 |
| 18_GAS_RETRY_STRATEGY.md | Retry |
| 19_GEMINI_PROMPT_SPECIFICATION.md | Prompt |

---

# 6. Phase1実装時の基準文書

Phase1では

最低限

以下を参照する。

```text
14_SPREADSHEET_SCHEMA.md
15_GAS_IMPLEMENTATION_GUIDE.md
16_TESTING_STRATEGY.md
17_TROUBLESHOOTING.md
18_GAS_RETRY_STRATEGY.md
19_GEMINI_PROMPT_SPECIFICATION.md
```

ハードウェア変更時は

以下3文書を

同時更新対象とする。

- 01_HARDWARE_OVERVIEW.md
- 05_WIRING_DIAGRAM.md
- 08_POWER_ARCHITECTURE.md

これら3文書は

相互整合性を維持することを原則とする。

---

# 7. 今後の開発工程

## Phase 1（実施中）

主工程は

Google Apps Script

実装とする。

### ソフトウェア

1. ConfigManager完成
2. SecurityManager
3. LogSubsystem
4. ApiGateway
5. CalendarSubsystem
6. PoemSubsystem
7. JobScheduler
8. MaintenanceHandler
9. L1単体試験
10. L2結合試験
11. L3障害試験

---

### ハードウェア

現在の優先順位は

1. 電源基板配線最終確認
2. テストポイント実装
3. 導通確認
4. 無負荷通電
5. 5V_BUS確認
6. TPS63802入力確認
7. 3.3V_OUT確認
8. XIAO単体起動試験
9. USB通信確認
10. センサー接続開始

---

### ドキュメント

現在更新中。

- README.md
- CURRENT_STATUS.md
- ROADMAP.md
- 01_HARDWARE_OVERVIEW.md
- 05_WIRING_DIAGRAM.md
- 08_POWER_ARCHITECTURE.md

これらは

vNext 1.4

として整合性を維持しながら更新する。

---

# 8. 今後のハードウェアPoC

PoCでは以下を確認する。

## 電源

- UPS切替動作
- DMG2305UX-13温度
- TPS63802効率
- TPS63802発熱
- 5Vリップル
- 3.3Vリップル
- Battery_SENSE精度
- 5V_SENSE精度

---

## USB

- USB通信安定性
- USB給電切替
- PC接続時動作
- USB再接続動作

---

## センサー

- I2Cバス安定性
- SPS30動作確認
- I2Sノイズ評価
- HLK-LD2410C動作確認

---

## E-Paper

- 初回表示
- 長時間表示
- 更新時間測定
- ゴースト評価

---

# 9. 開発方針

本プロジェクトでは

以下を設計原則とする。

## ハードウェア

- 常時給電UPS方式
- 電源基板独立構成
- 本体基板との10PIN接続
- 5V_GND・3.3V_GND・SENSE_GND完全分離
- 本体基板XIAO近傍で一点接続
- 電源基板PoC後に本体基板設計を確定

---

## ソフトウェア

- GAS中心構成
- Spreadsheet中心管理
- Gemini API利用
- ESP32から設定編集を行わない
- system_config・source_configはGAS管理

---

## ドキュメント

設計変更時は

以下3文書を

必ず同時更新する。

- 01_HARDWARE_OVERVIEW.md
- 05_WIRING_DIAGRAM.md
- 08_POWER_ARCHITECTURE.md

CURRENT_STATUS.md

README.md

ROADMAP.md

についても

進捗に応じて更新する。

---

# 10. CHANGE LOG

| 日付 | 内容 |
|------|------|
| 2026-06-20 | Phase1開始に伴いREADME全面更新 |
| 2026-06-25 | D11〜D19側面ランド利用方針を反映 |
| 2026-06-29 | 電源基板PoC、USB配線、GND設計更新 |
| 2026-07-10 | USB Type-C（CC1/CC2 5.1kΩ実装済み）を正式仕様化 |
| 2026-07-10 | 電源構成を「USB Type-C→PTC→IP5306→DMG2305UX-13→5V_BUS→TPS63802→3.3V_OUT」へ更新 |
| 2026-07-10 | DMG2305UX-13接続（Source＝OUT_5V、Drain＝5V_BUS、Gate＝100kΩ→5V_GND）を反映 |
| 2026-07-10 | TPS63802同名2ホール運用（外側：主配線、内側：コンデンサ接続）を反映 |
| 2026-07-10 | GND設計を「5V_GND・3.3V_GND・SENSE_GNDを電源基板上で見かけ上完全分離、本体基板XIAO近傍で一点接続」へ更新 |
| 2026-07-10 | 入力470µF・出力220µF・0.1µF構成を正式仕様化 |
| 2026-07-10 | READMEをvNext 1.4として全面再構成し、ハードウェア・ソフトウェア・ドキュメント構成を最新状態へ更新 |