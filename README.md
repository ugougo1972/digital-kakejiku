# digital-kakejiku

据置型環境観測・暦表示・詩生成システム  
最終更新: 2026-06-29  
文書版: vNext 1.3 hardware power reflected

---

# 1. 目的

本READMEは、digital-kakejiku プロジェクト全体の導線である。

詳細仕様は各基準源ドキュメントを参照する。

本READMEには、プロジェクト概要、現在フェーズ、採択済み構成、参照すべき基準源、Phase 1 / Phase 2 前提作業の現在位置のみを記載する。  
詳細な電源基板配線、GND系統、テストポイント、通電前チェックは、`05_WIRING_DIAGRAM.md` および `08_POWER_ARCHITECTURE.md` を基準源とする。

---

# 2. 概要

digital-kakejiku は、XIAO ESP32S3 Plus を中核とする据置型の環境観測・暦表示・詩生成システムである。

目的。

- 環境観測
- 長期記録
- 暦表示
- 今日の詩表示
- 生活支援
- 長期運用可能な保守性確保

特徴。

- 常時稼働
- UPS運用
- Google Apps Script 中央集権構成
- Spreadsheet蓄積
- Calendar Subsystem
- Poem Subsystem
- 背面保守コンソール
- 電源基板を本体基板から分離可能な設計
- 通電前検査と段階的な電源PoCを重視

---

# 3. 現在位置

```text
Phase 1
GAS本実装
```

状態。

```text
IN_PROGRESS
```

補足。

```text
Phase 1 GAS実装と並行して、Phase 2前提となる電源基板PoCを先行実施中。
```

Phase 1 開始条件は vNext 1.3 で満たしたものとして扱う。

理由。

- Spreadsheet Schema は確定済み
- GAS Implementation Guide は確定済み
- GAS Retry Strategy は確定済み
- Gemini Prompt Specification は確定済み
- Testing Strategy は確定済み
- Troubleshooting Guide は確定済み
- Script Properties運用方針は確定済み
- system_config設計は確定済み

現在のハードウェア作業。

- 電源基板配線案作成中
- TPS63802表面視点ピン配置は図面座標と一致確認済み
- テストポイント追加方針を確定
- 次工程は通電前導通確認、無負荷電圧確認、XIAO + 電源基板のみの起動試験

---

# 4. システム構成

```text
Sensors
   ↓
XIAO ESP32S3 Plus
   ↓ HTTPS
Google Apps Script
   ├─ ApiGateway
   ├─ SecurityManager
   ├─ ConfigManager
   ├─ LogSubsystem
   ├─ CalendarSubsystem
   ├─ PoemSubsystem
   ├─ JobScheduler
   └─ MaintenanceHandler
   ↓
Google Spreadsheet
   ↓
E-Paper Display
```

電源系の概略。

```text
USB-C
 ↓
PTC / ポリスイッチ
 ↓
IP5306
 ├─ 18650
 └─ 5V BUS
      ├─ SPS30
      └─ TPS63802
           ↓
         3.3V BUS
```

---

# 5. 採択済み構成

## MCU

- XIAO ESP32S3 Plus
- 1台構成を維持する
- XIAO ePaper Breakout V2 は本体基板近傍に配置する
- ePaper は長めリボンケーブルで本体側配置自由度を確保する
- D11〜D19 側面ランドは JST-XH 2ピンで Signal + GND ペアとして取り出す
- D11〜D19 の用途はスケッチ上で定義する
- 裏面ランドは原則使用禁止とする
- USB D+ / D- に限り、XIAO裏面ランド使用を例外的に解禁する

## Front Display

- 7.5inch E-Paper
- 800×480
- XIAO ePaper Breakout V2
- SPI接続
- 表示専用

## Back UI

- 保守コンソール
- I2C OLED
- 128×128 OLED 第一候補
- 128×64 OLED 代替候補
- 秋月電子販売コード114936
- 押下スイッチ付きロータリーエンコーダ
- MCP23017経由

## Power

- UPS方式
- 18650
- IP5306
- DMG2305UX-13
- TPS63802
- ポリスイッチ / PTC
- DMG3415U 採択は撤回
- 電源基板は本体基板上の亀の子構成を許容する
- 電源基板と本体基板の間に高低差を設け、センサーブロックへの熱対流を抑制する
- 亀の子基板下は、ノイズリダクション用コンデンサー等の配置余地として扱う

## Power Board

電源基板は以下の系統に分ける。

| 系統 | 対象 |
|---|---|
| 5V系 | USB-C / PTC / IP5306 / 18650 JST / DMG2305UX-13 / TPS63802 VIN |
| 3.3V系 | TPS63802 VOUT |
| SENSE系 | Battery_SENSE / 5V_SENSE |
| USB通信 | USB D+ / D- を電源系から独立して配線 |

GND方針。

- 電気的には共通GNDとする
- 物理配線として、5V系GND、TPS63802近傍GND島、SENSE GND枝を分ける
- TPS63802近傍GND島を局所合流点として扱う
- SENSE GNDには5V大電流を流さない
- GNDバスは原則スズメッキ線で作成する
- 交差部、亀の子基板下、XIAO裏面ランド周辺はカプトンで絶縁する

## Sensors

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

SPS30は5Vバスから供給する。  
I2Cプルアップは3.3V系に統一する。

## Calendar

- GAS生成
- AI利用禁止
- CALENDAR_PENDING採択
- 保持期間は過去5年、当年、翌年
- 毎年12月1日に翌年生成
- 指定年再生成許可
- 指定期間再生成許可

## Poem

- Gemini API Free Tier
- 自由詩
- 客観描写
- 80〜120文字
- 目標100文字
- temperature=0.5
- 数値直接出力禁止
- 表示時再生成禁止

---

# 6. ドキュメント参照ガイド

| 調べたいこと | 基準源ドキュメント |
|---|---|
| プロジェクト全体の導線 | README.md |
| 現在の進捗 | CURRENT_STATUS.md |
| フェーズ計画 | ROADMAP.md |
| ハードウェア構成 | 01_HARDWARE_OVERVIEW.md |
| ソフトウェア責務 | 02_SOFTWARE_OVERVIEW.md |
| ログ形式 | 03_LOG_FORMAT.md |
| 状態遷移 | 04_STATE_MACHINE.md |
| 配線 | 05_WIRING_DIAGRAM.md |
| GAS API | 06_GAS_API_SPEC.md |
| 表示・UI | 07_DISPLAY_UI_SPEC.md |
| 電源 | 08_POWER_ARCHITECTURE.md |
| SPI排他制御 | 09_SPI_RESOURCE_CONTROL.md |
| Calendar / Poem | 10_CALENDAR_POEM_SUBSYSTEM.md |
| セキュリティ | 11_SECURITY_MANAGEMENT.md |
| 設定管理 | 12_CONFIGURATION_MANAGEMENT.md |
| GAS運用 | 13_GAS_OPERATION_POLICY.md |
| Spreadsheet構造 | 14_SPREADSHEET_SCHEMA.md |
| GAS実装 | 15_GAS_IMPLEMENTATION_GUIDE.md |
| 試験方針 | 16_TESTING_STRATEGY.md |
| 障害対応 | 17_TROUBLESHOOTING.md |
| GAS Retry詳細 | 18_GAS_RETRY_STRATEGY.md |
| Gemini Prompt詳細 | 19_GEMINI_PROMPT_SPECIFICATION.md |

---

# 7. Phase 1 実装時の基準源

Phase 1 GAS実装を進める場合、最低限以下を参照する。

```text
14_SPREADSHEET_SCHEMA.md
15_GAS_IMPLEMENTATION_GUIDE.md
18_GAS_RETRY_STRATEGY.md
19_GEMINI_PROMPT_SPECIFICATION.md
16_TESTING_STRATEGY.md
17_TROUBLESHOOTING.md
```

---

# 8. Phase 2前提ハード作業

Phase 1 GAS本実装と並行して、Phase 2 ESP32統合の前提となる電源基板PoCを先行する。

次工程。

1. 電源基板配線図の最終修正
2. テストポイント追加
3. 導通・短絡確認
4. 無負荷通電
5. 5V BUS確認
6. TPS63802 3.3V出力確認
7. XIAO + 電源基板のみの起動試験
8. USB D+ / D- 通信確認

通電前に確認する主な項目。

- USB VBUS - GND 短絡なし
- PTC後段 - GND 短絡なし
- IP5306 VIN - GND 短絡なし
- BAT+ - GND 短絡なし
- 5V BUS - GND 短絡なし
- TPS63802 VIN - GND 短絡なし
- TPS63802 VOUT - GND 短絡なし
- 3.3V BUS - GND 短絡なし
- BAT_SENSE - GND が分圧抵抗由来の抵抗値を示すこと
- 5V_SENSE - GND が分圧抵抗由来の抵抗値を示すこと
- USB D+ - D- 短絡なし
- USB D+ - GND 短絡なし
- USB D- - GND 短絡なし

---

# 9. 背面保守UI方針

許可。

- 状態確認
- 診断
- Calendar再生成
- Poem再生成
- 通信確認

禁止。

- source_config編集
- system_config編集
- URL編集
- Prompt編集
- Geminiモデル変更
- temperature変更
- API Key編集

---

# 10. STATUS

| 項目 | 状態 |
|---|---|
| 要件定義 | COMPLETE |
| ハードウェア主要構成 | CONFIRMED |
| 電源方式 | CONFIRMED |
| 電源基板配線案 | IN_PROGRESS |
| 電源基板通電前チェック | PENDING |
| Spreadsheet Schema | FINALIZED |
| GAS Implementation Guide | FINALIZED |
| GAS Retry Strategy | FINALIZED |
| Gemini Prompt Specification | FINALIZED |
| Troubleshooting Guide | FINALIZED |
| Testing Strategy | FINALIZED |
| Phase 1 GAS実装 | IN_PROGRESS |
| ESP32統合 | PENDING |
| Phase 2ハード実測 | PENDING |

---

# 11. CHANGE LOG

| 日付 | 内容 |
|---|---|
| 2026-06-20 | vNext 1.3としてPhase 1開始条件を整理 |
| 2026-06-20 | 18_GAS_RETRY_STRATEGY.mdを参照ガイドへ追加 |
| 2026-06-20 | 19_GEMINI_PROMPT_SPECIFICATION.mdを参照ガイドへ追加 |
| 2026-06-20 | Phase 1状態をREADY_TO_STARTへ更新 |
| 2026-06-25 | 裏面ランド使用禁止、側面ランド使用解禁 |
| 2026-06-29 | 査読反映。Phase 1をIN_PROGRESSへ更新し、電源基板PoC、USB D+/D-裏面ランド例外、D11〜D19 JST-XH方針、DMG3415U撤回、GND/SENSE方針を反映 |
