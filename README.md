# digital-kakejiku

据置型環境観測・暦表示・詩生成システム  
最終更新: 2026-06-20  
文書版: vNext 1.1 review reflected

---

# 1. 概要

digital-kakejiku は、XIAO ESP32S3 Plus を中核とする据置型環境観測端末である。環境観測、長期記録、暦表示、今日の詩表示を目的とし、Google Apps Script（GAS）と Google Spreadsheet を中央制御層として利用する。

本READMEはプロジェクト全体の導線である。詳細仕様は各基準源ドキュメントを参照する。

---

# 2. 現在位置

```text
Phase 1
GAS本実装
```

状態。

```text
IN_PROGRESS
```

---

# 3. システム構成

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
   └─ JobScheduler
   ↓
Google Spreadsheet
   ↓
7.5inch E-Paper Display
```

---

# 4. 主要採択事項

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

## Calendar

- GAS生成
- AI利用禁止
- CALENDAR_PENDING採択
- 保持期間は過去5年＋当年＋翌年
- 毎年12月1日に翌年分を生成
- 指定年・指定期間の再生成を許可

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

# 5. 文書構成

| 文書 | 役割 |
|---|---|
| CURRENT_STATUS.md | 現在状態のみ |
| ROADMAP.md | フェーズ計画のみ |
| README.md | プロジェクト概要と導線 |
| 01_HARDWARE_OVERVIEW.md | ハードウェア基準源 |
| 02_SOFTWARE_OVERVIEW.md | ソフトウェア構成基準源 |
| 03_LOG_FORMAT.md | ログ形式基準源 |
| 04_STATE_MACHINE.md | 状態遷移基準源 |
| 05_WIRING_DIAGRAM.md | 配線基準源 |
| 06_GAS_API_SPEC.md | API基準源 |
| 07_DISPLAY_UI_SPEC.md | 表示・UI基準源 |
| 08_POWER_ARCHITECTURE.md | 電源基準源 |
| 09_SPI_RESOURCE_CONTROL.md | SPI制御基準源 |
| 10_CALENDAR_POEM_SUBSYSTEM.md | Calendar/Poem基準源 |
| 11_SECURITY_MANAGEMENT.md | セキュリティ基準源 |
| 12_CONFIGURATION_MANAGEMENT.md | 設定管理基準源 |
| 13_GAS_OPERATION_POLICY.md | GAS運用基準源 |
| 14_SPREADSHEET_SCHEMA.md | Spreadsheet基準源 |
| 15_GAS_IMPLEMENTATION_GUIDE.md | GAS実装基準源 |
| 16_TESTING_STRATEGY.md | 試験方針基準源 |
| 17_TROUBLESHOOTING.md | 障害対応基準源 |

---

# 6. 月次運用チェック

毎月末に以下を確認する。

## Spreadsheet

- [ ] observation_log の増加傾向が正常である
- [ ] error_log に同一エラーが集中していない
- [ ] system_log で Calendar / Poem 成功率を確認する

## Calendar

- [ ] 翌月分の calendar_master が存在する
- [ ] 祝日・二十四節気・七十二候が欠損していない
- [ ] CALENDAR_ERROR が継続していない

## Poem

- [ ] poem_cache が日次生成されている
- [ ] POEM_ERROR / CALENDAR_PENDING が継続していない

## Security

- [ ] Spreadsheet共有範囲を確認する
- [ ] Script Properties に API_SECRET / GEMINI_API_KEY が存在する
- [ ] GitHub に機密情報が含まれていない

## Quota

- [ ] GAS実行時間が許容範囲内である
- [ ] Spreadsheet容量が許容範囲内である
- [ ] Gemini API Free Tier内で運用できている

---

# 7. STATUS

| 項目 | 状態 |
|---|---|
| Phase0 設計 | COMPLETE |
| Phase1 GAS本実装 | IN_PROGRESS |
| ハードウェア構成 | CONFIRMED |
| Spreadsheet構成 | FINALIZED |
| Calendar設計 | FINALIZED |
| Poem設計 | FINALIZED |
| 背面UI保守コンソール | FINALIZED |
| vNext 1.1査読反映 | FINALIZED |

---

# 8. CHANGE LOG

| 日付 | 内容 |
|---|---|
| 2026-06-20 | vNext 1.1として査読反映 |
| 2026-06-20 | READMEを導線中心へ再整理 |
| 2026-06-20 | 月次運用チェックを追加 |
