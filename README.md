# digital-kakejiku

据置型環境観測・暦表示・詩生成システム  
最終更新: 2026-06-20  
文書版: vNext 1.3 phase1 ready delta

---

# 1. 目的

本READMEは、digital-kakejiku プロジェクト全体の導線である。

詳細仕様は各基準源ドキュメントを参照する。

本READMEには、プロジェクト概要、現在フェーズ、採択済み構成、参照すべき基準源、Phase 1 開始条件のみを記載する。

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

---

# 3. 現在位置

```text
Phase 1
GAS本実装
```

状態。

```text
READY_TO_START
```

Phase 1 開始条件は vNext 1.3 で満たしたものとして扱う。

理由。

- Spreadsheet Schema は確定済み
- GAS Implementation Guide は確定済み
- GAS Retry Strategy を新規作成済み
- Gemini Prompt Specification を新規作成済み
- Testing Strategy は更新済み
- Troubleshooting Guide は更新済み

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

---

# 5. 採択済み構成

## MCU

- XIAO ESP32S3 Plus

## Front Display

- 7.5inch E-Paper
- 800×480
- XIAO ePaper Breakout V2

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
- ポリスイッチ

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
- 80～120文字
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

# 7. Phase 1 開始前の最終基準源

Phase 1 GAS実装を開始する場合、最低限以下を参照する。

```text
14_SPREADSHEET_SCHEMA.md
15_GAS_IMPLEMENTATION_GUIDE.md
18_GAS_RETRY_STRATEGY.md
19_GEMINI_PROMPT_SPECIFICATION.md
16_TESTING_STRATEGY.md
17_TROUBLESHOOTING.md
```

---

# 8. 背面保守UI方針

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

# 9. STATUS

| 項目 | 状態 |
|---|---|
| 要件定義 | COMPLETE |
| ハードウェア主要構成 | CONFIRMED |
| Spreadsheet Schema | FINALIZED |
| GAS Implementation Guide | FINALIZED |
| GAS Retry Strategy | FINALIZED |
| Gemini Prompt Specification | FINALIZED |
| Troubleshooting Guide | FINALIZED |
| Testing Strategy | FINALIZED |
| Phase 1 GAS実装 | READY_TO_START |
| ESP32統合 | PENDING |
| Phase 2ハード実測 | PENDING |

---

# 10. CHANGE LOG

| 日付 | 内容 |
|---|---|
| 2026-06-20 | vNext 1.3としてPhase 1開始条件を整理 |
| 2026-06-20 | 18_GAS_RETRY_STRATEGY.mdを参照ガイドへ追加 |
| 2026-06-20 | 19_GEMINI_PROMPT_SPECIFICATION.mdを参照ガイドへ追加 |
| 2026-06-20 | Phase 1状態をREADY_TO_STARTへ更新 |
