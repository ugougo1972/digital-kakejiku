# digital-kakejiku

据置型環境観測・暦表示・AI詩生成システム

最終更新: 2026-07-14
文書版: vNext 1.5

---

# 1. プロジェクト概要

## 1.1 本プロジェクトについて

digital-kakejiku は、環境観測・暦情報・AI生成コンテンツを組み合わせた据置型情報表示システムである。

各種環境センサーで取得したデータを Google Apps Script と Google Spreadsheet に蓄積し、Gemini により生成した詩とともに 7.5inch E-Paper に表示する。

本プロジェクトでは、

- 長期安定運用
- 保守性
- 拡張性
- 低消費電力
- ドキュメント駆動開発

を基本理念として設計を進める。

---

## 1.2 開発状況

現在は Phase1 を継続中であり、

電源基板PoCが完了し、

本体基板設計および筐体設計を進めている。

```text
✓ 電源基板PoC

▶ 本体基板設計

▶ 筐体設計

□ 実負荷試験

□ 長期連続試験

□ 初号機完成
```

---

## 1.3 システム概要

```text
環境センサー
        │
        ▼
XIAO ESP32S3 Plus
        │
 Wi-Fi / HTTPS
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

---

# 2. システム構成

## 2.1 ハードウェア

本システムは以下の3基板構成を採用する。

| 基板 | 役割 |
|------|------|
| 本体基板 | MCU・センサー・RTC・I/O制御 |
| 電源基板 | UPS・充電・電源監視 |
| OLED操作基板 | 保守UI |

電源基板はPoCを完了しており、現在は本体基板設計へ移行している。

---

## 2.2 ソフトウェア

ソフトウェアはGoogle Apps Scriptを中心に構成する。

主要コンポーネントは以下のとおり。

- ConfigManager
- SecurityManager
- LogSubsystem
- ApiGateway
- CalendarSubsystem
- PoemSubsystem

ESP32は観測・表示・通信を担当し、設定情報はGAS側で管理する。

---

## 2.3 主な特徴

- 据置型観測装置
- UPS方式
- 7.5inch E-Paper
- Google Apps Script中心構成
- Google Spreadsheet連携
- Geminiによる詩生成
- OLED保守コンソール
- ファンレス自然空冷
- 20シリーズアルミフレーム筐体
- モジュール交換可能構造

---

# 3. 現在の開発状況

## 3.1 現在フェーズ

| 項目 | 状態 |
|------|------|
| Phase | Phase1 |
| 電源基板PoC | COMPLETED |
| 本体基板設計 | IN_PROGRESS |
| 筐体設計 | IN_PROGRESS |
| GAS実装 | IN_PROGRESS |
| GitHub文書 | vNext 1.5 更新中 |

---

## 3.2 現在の重点作業

現在の優先順位は以下のとおり。

1. 本体基板設計
2. 筐体設計
3. GitHub文書整備
4. GAS実装
5. 実負荷試験

---

## 3.3 今後の流れ

```text
電源基板PoC
        │
        ▼
本体基板設計
        │
        ▼
筐体試作
        │
        ▼
実負荷試験
        │
        ▼
長期連続試験
        │
        ▼
初号機完成
```

# 4. システムアーキテクチャ

## 4.1 全体構成

digital-kakejiku は、環境観測・データ蓄積・AIコンテンツ生成・電子ペーパー表示を組み合わせたシステムである。

各コンポーネントは独立した役割を持ち、疎結合構成を採用する。

```text
┌─────────────┐
│  各種センサー │
└──────┬──────┘
       │
       ▼
┌──────────────────────┐
│ XIAO ESP32S3 Plus    │
│ ・観測               │
│ ・表示制御           │
│ ・HTTPS通信          │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ Google Apps Script   │
│ ・API                │
│ ・設定管理           │
│ ・ログ管理           │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ Google Spreadsheet   │
│ ・観測データ         │
│ ・設定情報           │
│ ・ログ               │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ Gemini               │
│ ・詩生成             │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│ 7.5inch E-Paper      │
└──────────────────────┘
```

---

## 4.2 ハードウェア構成

初号機では以下の3基板構成を採用する。

| 基板 | 役割 |
|------|------|
| 本体基板 | MCU・各種センサー・RTC・I/O制御 |
| 電源基板 | UPS・充電・昇降圧・電源監視 |
| OLED操作基板 | 保守UI |

各基板は交換可能なモジュール構成とし、保守性および拡張性を重視する。

---

## 4.3 電源システム

電源はUPS方式を採用する。

通常はUSB Type-Cから給電し、停電時には18650リチウムイオン電池へ自動切替を行う。

```text
USB Type-C
      │
      ▼
PTC
      │
      ▼
IP5306
      │
      ▼
DMG2305UX-13
      │
      ▼
5V_BUS
      │
      ▼
TPS63802
      │
      ▼
3.3V_OUT
```

電源基板PoCは完了しており、現在は本体基板設計へ移行している。

詳細は **08_POWER_ARCHITECTURE.md** を参照する。

---

## 4.4 筐体

筐体は20シリーズアルミフレームを主構造とする。

主な特徴は以下のとおり。

- 20シリーズアルミフレーム
- 白色塩ビ化粧板
- 面ファスナー固定
- 7.5inch E-Paper縦置き
- OLED独立基板
- ファンレス自然対流

詳細は **01_HARDWARE_OVERVIEW.md** を参照する。

---

# 5. ハードウェア構成

## 5.1 MCU

| 項目 | 内容 |
|------|------|
| MCU | XIAO ESP32S3 Plus |
| 構成 | 1台構成 |
| GPIO拡張 | MCP23017 |

---

## 5.2 表示

### 前面

- 7.5inch E-Paper
- 800×480
- SPI接続

### 背面

- I2C OLED
- Rotary Encoder
- 保守メニュー

---

## 5.3 センサー

採択済みセンサー

- SCD41
- SGP41
- BME680
- LTR390
- SPS30
- HLK-LD2410C
- ICS-43434
- DS3231
- AT24C32

---

## 5.4 電源

採択済み部品

- USB Type-C
- PTC
- IP5306
- DMG2305UX-13
- TPS63802
- 18650

電源PoCは完了している。

---

## 5.5 設計コンセプト

本プロジェクトでは以下を設計原則とする。

- 保守性優先
- モジュール交換可能
- ファンレス自然空冷
- UPS方式
- 配線交差最小化
- GitHubによる設計管理

# 6. ドキュメント体系

## 6.1 基準文書

本プロジェクトでは、以下の文書を設計・実装・試験の基準文書（Single Source of Truth）とする。

| 文書 | 内容 |
|------|------|
| README.md | プロジェクト概要・入口文書 |
| CURRENT_STATUS.md | 開発状況・進捗管理 |
| ROADMAP.md | 開発計画 |
| 01_HARDWARE_OVERVIEW.md | ハードウェア全体設計 |
| 02_SOFTWARE_OVERVIEW.md | ソフトウェア全体設計 |
| 03_LOG_FORMAT.md | ログ仕様 |
| 04_STATE_MACHINE.md | 状態遷移 |
| 05_WIRING_DIAGRAM.md | 配線仕様 |
| 06_GAS_API_SPEC.md | GAS API |
| 07_DISPLAY_UI_SPEC.md | 表示仕様 |
| 08_POWER_ARCHITECTURE.md | 電源設計 |

---

## 6.2 実装文書

以下は各サブシステムの実装仕様書である。

| 文書 | 内容 |
|------|------|
| 09_SPI_RESOURCE_CONTROL.md | SPI制御 |
| 10_CALENDAR_POEM_SUBSYSTEM.md | Calendar・Poem |
| 11_SECURITY_MANAGEMENT.md | セキュリティ |
| 12_CONFIGURATION_MANAGEMENT.md | 設定管理 |
| 13_GAS_OPERATION_POLICY.md | GAS運用 |
| 14_SPREADSHEET_SCHEMA.md | Spreadsheet設計 |
| 15_GAS_IMPLEMENTATION_GUIDE.md | GAS実装 |
| 16_TESTING_STRATEGY.md | 試験計画 |
| 17_TROUBLESHOOTING.md | 障害対応 |
| 18_GAS_RETRY_STRATEGY.md | Retry設計 |
| 19_GEMINI_PROMPT_SPECIFICATION.md | Gemini Prompt |

---

## 6.3 ドキュメント運用

設計変更時は関連文書を同時に更新する。

特にハードウェア変更時は以下の3文書を同時更新対象とする。

- 01_HARDWARE_OVERVIEW.md
- 05_WIRING_DIAGRAM.md
- 08_POWER_ARCHITECTURE.md

また、変更内容に応じて以下も更新する。

- README.md
- CURRENT_STATUS.md
- ROADMAP.md

---

# 7. 開発ロードマップ

## 7.1 現在位置

```text
✓ GAS基盤整備

✓ 電源基板PoC

▶ 本体基板設計

▶ 筐体設計

□ 本体基板製作

□ センサー統合

□ 実負荷試験

□ 長期連続運転試験

□ 初号機完成
```

---

## 7.2 今後の工程

### ハードウェア

1. 本体基板レイアウト確定
2. 基板製作
3. センサー実装
4. 筐体試作
5. 実負荷試験
6. 長期連続運転試験

### ソフトウェア

1. ConfigManager完成
2. SecurityManager
3. LogSubsystem
4. ApiGateway
5. CalendarSubsystem
6. PoemSubsystem
7. 統合試験

### ドキュメント

1. README.md
2. CURRENT_STATUS.md
3. ROADMAP.md
4. 05_WIRING_DIAGRAM.md
5. 08_POWER_ARCHITECTURE.md
6. DISCUSSION（筐体構造刷新）

---

# 8. 開発方針

## ハードウェア

- UPS方式を採用する。
- 電源基板を独立構成とする。
- 本体基板・電源基板・OLED操作基板の3基板構成とする。
- ファンレス自然対流を採用する。
- 保守性を優先したレイアウトとする。

---

## ソフトウェア

- Google Apps Scriptを中核とする。
- Google Spreadsheetを唯一の設定管理基盤とする。
- ESP32から設定情報を直接編集しない。
- Geminiは詩生成に限定して利用する。

---

## ドキュメント

- GitHubを唯一の設計情報管理基盤とする。
- 設計変更時は関連文書を同時更新する。
- 文書間の用語・状態・フェーズを統一する。
- CHANGE LOGを継続的に更新する。

---

# 9. CHANGE LOG

| 日付 | 内容 |
|------|------|
| 2026-06-20 | READMEをPhase1開始版として全面更新 |
| 2026-06-25 | GPIO・USB設計方針を更新 |
| 2026-06-29 | 電源構成・GND設計を更新 |
| 2026-07-10 | USB Type-C・TPS63802・DMG2305UX-13仕様を反映 |
| 2026-07-10 | 電源アーキテクチャを最新設計へ更新 |
| 2026-07-14 | 電源基板PoC完了を反映 |
| 2026-07-14 | 本体基板設計・筐体設計開始を反映 |
| 2026-07-14 | 20シリーズアルミフレーム構造を正式仕様化 |
| 2026-07-14 | READMEをvNext 1.5として全面再構成 |