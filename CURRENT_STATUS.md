# CURRENT_STATUS.md

# digital-kakejiku Current Status

最終更新: 2026-06-20  
版: vNext 1.0

---

# 1. プロジェクト概要

digital-kakejiku は据置型環境観測・暦表示・詩生成システムである。

目的。

- 長期環境観測
- 暦情報表示
- 今日の詩表示
- 生活記録支援

# 2. 現在フェーズ

```text
Phase1
GAS本実装
IN_PROGRESS
```

# 3. 全体進捗

| 項目 | 状態 |
| --- | --- |
| 要件定義 | COMPLETE |
| ハードウェア選定 | COMPLETE |
| センサー選定 | COMPLETE |
| 電源設計 | COMPLETE |
| 表示設計 | COMPLETE |
| Spreadsheet設計 | COMPLETE |
| GAS設計 | COMPLETE |
| Gemini設計 | COMPLETE |
| vNext文書再生成 | COMPLETE |
| GAS実装 | IN_PROGRESS |
| ESP32実装 | PENDING |
| 統合試験 | PENDING |


# 4. 採択済みハードウェア

## MCU

```text
XIAO ESP32S3 Plus
```

## 前面表示

```text
7.5inch E-Paper
800×480
XIAO ePaper Breakout V2
```

## 背面UI

```text
I2C OLED
128×128 OLED 第一候補
128×64 OLED 代替候補
秋月電子販売コード114936
押下スイッチ付きロータリーエンコーダ
MCP23017経由
保守コンソール
```

## RTC

```text
DS3231
AT24C32
CR2032
```

## 電源

```text
18650
IP5306
DMG2305UX-13
TPS63802
ポリスイッチ
UPS方式
```

## センサー

| センサー | 用途 | 接続 | 状態 |
| --- | --- | --- | --- |
| SCD41 | CO₂ | I2C | CONFIRMED |
| SGP41 | VOC / NOx | I2C | CONFIRMED |
| SPS30 | PM | I2C / 5V | CONFIRMED |
| LTR390 | UV / ALS | I2C | CONFIRMED |
| BME680 | 温湿度・気圧 | I2C | CONFIRMED |
| HLK-LD2410C | 人感 | OUT | CONFIRMED |
| ICS-43434 | 音環境 | I2S | CONFIRMED |
| DS3231 + AT24C32 | RTC / EEPROM | I2C | CONFIRMED |


# 5. GAS構成

```text
ApiGateway
SecurityManager
ConfigManager
LogSubsystem
CalendarSubsystem
PoemSubsystem
JobScheduler
```

# 6. Spreadsheet構成

```text
observation_log
event_log
error_log
system_log
source_config
system_config
solar_term_master
season_dictionary
calendar_master
poem_cache
```

# 7. Calendar Subsystem

| 項目 | 情報源 |
| --- | --- |
| 祝日 | 内閣府 |
| 二十四節気 | 国立天文台系 |
| 七十二候名称 | season_dictionary |
| 七十二候説明 | season_dictionary |
| 解説参照URL | source_config |


禁止。

```text
AI生成
AI推定
AI補完
```

保持期間。

```text
過去5年
当年
翌年
```

毎年12月1日に翌年分を生成する。指定年・指定期間再生成を許可する。

# 8. Poem Subsystem

```text
Gemini API Free Tier
自由詩
客観描写
80～120文字
目標100文字
temperature=0.5
数値直接出力禁止
表示時再生成禁止
```

# 9. 状態管理

Calendar。

```text
SCHEDULED
CALENDAR_RUNNING
CALENDAR_RETRY
CALENDAR_READY
CALENDAR_ERROR
```

Poem。

```text
CALENDAR_PENDING
POEM_RUNNING
POEM_RETRY
POEM_READY
POEM_ERROR
POEM_SKIPPED
```

# 10. 実行スケジュール

```text
Calendar Job
02:00 Main
02:30 Retry1
03:00 Retry2
03:30 Retry3

Poem Job
02:10 Main
02:40 Retry1
03:10 Retry2
03:40 Retry3
```

# 11. 背面UI方針

```text
許可
- 状態確認
- 診断
- Calendar再生成
- Poem再生成
- 通信確認

禁止
- source_config編集
- system_config編集
- URL編集
- Prompt編集
- Geminiモデル変更
- temperature変更
- API Key編集
```

# 12. 現在の最優先タスク

```text
Phase1 GAS本実装
```

実装順序。

```text
1 Spreadsheet初期化
2 ConfigManager
3 SecurityManager
4 LogSubsystem
5 ApiGateway
6 CalendarSubsystem
7 PoemSubsystem
8 JobScheduler
9 Maintenance Handler
10 結合試験
```

# 13. リスク

| 分類 | リスク |
| --- | --- |
| GAS | Gemini API仕様変更、GAS実行時間制限、Spreadsheet書込失敗 |
| Calendar | 祝日法改正、情報源変更 |
| Hardware | OLED最終型番未確定、LD2410C電源条件未確定 |


# 14. STATUS SUMMARY

| 項目 | 状態 |
| --- | --- |
| MCU | CONFIRMED |
| 前面E-Paper | CONFIRMED |
| 背面保守コンソール | FINALIZED |
| UPS方式 | CONFIRMED |
| Spreadsheet構成 | FINALIZED |
| Calendar Subsystem | FINALIZED |
| Poem Subsystem | FINALIZED |
| CALENDAR_PENDING | FINALIZED |
| GAS本実装 | IN_PROGRESS |


# 15. CHANGE LOG

| 日付 | 内容 |
| --- | --- |
| 2026-06-20 | vNext 1.0として全面再生成 |
| 2026-06-20 | 現在フェーズをPhase1 GAS本実装として整理 |
| 2026-06-20 | 背面UIとCalendar/Poem採択事項を統一 |
