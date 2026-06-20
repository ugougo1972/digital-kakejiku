# digital-kakejiku

最終更新: 2026-06-20  
版: vNext 1.0

---

据置型環境観測・暦表示・詩生成システム。

# 1. 概要

digital-kakejiku は、XIAO ESP32S3 Plus を中心とする据置型観測端末である。環境センサー群の観測値をGoogle Apps Script（GAS）経由でGoogle Spreadsheetへ蓄積し、前面の7.5inch E-Paperへ環境情報、暦情報、今日の詩を表示する。

目的。

- 環境観測
- 長期記録
- 暦表示
- 今日の詩表示
- 生活支援
- 停電時も観測データを失いにくい据置型端末の構築

# 2. システム構成

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
   ├─ observation_log
   ├─ event_log
   ├─ error_log
   ├─ system_log
   ├─ source_config
   ├─ system_config
   ├─ solar_term_master
   ├─ season_dictionary
   ├─ calendar_master
   └─ poem_cache
   ↓
7.5inch E-Paper
```

# 3. 現在位置

```text
Phase1
GAS本実装
IN_PROGRESS
```

# 4. ハードウェア構成

## MCU

- XIAO ESP32S3 Plus

## Front Display

- 7.5inch E-Paper
- 800×480
- XIAO ePaper Breakout V2
- SPI接続

## Back UI

背面UIは保守コンソールとする。

- I2C OLED
- 128×128 OLED 第一候補
- 128×64 OLED 代替候補
- 秋月電子販売コード114936
- 押下スイッチ付きロータリーエンコーダ
- MCP23017経由

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

## 電源

- UPS方式
- 18650
- IP5306
- DMG2305UX-13
- TPS63802
- ポリスイッチ

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


# 5. ソフトウェア構成

ESP32側。

- SensorManager
- StorageManager
- NetworkManager
- DisplayManager
- UIManager
- DiagnosticManager
- PowerManager
- ResourceManager

GAS側。

- ApiGateway
- SecurityManager
- ConfigManager
- LogSubsystem
- CalendarSubsystem
- PoemSubsystem
- JobScheduler

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

GAS側で生成する。ESP32側では暦生成を行わない。

| 項目 | 情報源 |
| --- | --- |
| 祝日 | 内閣府 |
| 二十四節気 | 国立天文台系 |
| 七十二候名称 | season_dictionary |
| 七十二候説明 | season_dictionary |
| 解説参照URL | source_config |


禁止。

- AI生成
- AI推定
- AI補完

保持期間。

- 過去5年
- 当年
- 翌年

毎年12月1日に翌年分を生成する。指定年・指定期間再生成を許可する。

# 8. Poem Subsystem

GAS側で生成する。ESP32側ではGemini APIを呼び出さない。

- Gemini API Free Tier
- 自由詩
- 客観描写
- 80～120文字
- 目標100文字
- temperature=0.5
- 数値直接出力禁止
- 表示時再生成禁止

# 9. Job依存関係

```text
Calendar Job
      ↓
calendar_master
      ↓
Poem Job
      ↓
poem_cache
```

Calendar未完了時は `CALENDAR_PENDING` とする。

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

# 11. 設定管理

- source_config: 情報源URL管理専用
- system_config: Job、Prompt Version、Gemini、表示設定
- season_dictionary: 七十二候名称・説明
- Script Properties: API_SECRET、GEMINI_API_KEY、SYSTEM_VERSION
- ESP32 NVS: DEVICE_ID、WIFI_SSID、WIFI_PASSWORD、API_SECRET、DISPLAY_MODE

# 12. セキュリティ

認証方式。

```text
device_id
+
secret
```

Gemini API KeyはScript Propertiesに保存し、Spreadsheet、GitHub、Log、ESP32へ保存しない。

# 13. 関連文書

```text
README.md
CURRENT_STATUS.md
ROADMAP.md
01_HARDWARE_OVERVIEW.md
02_SOFTWARE_OVERVIEW.md
03_LOG_FORMAT.md
04_STATE_MACHINE.md
05_WIRING_DIAGRAM.md
06_GAS_API_SPEC.md
07_DISPLAY_UI_SPEC.md
08_POWER_ARCHITECTURE.md
09_SPI_RESOURCE_CONTROL.md
10_CALENDAR_POEM_SUBSYSTEM.md
11_SECURITY_MANAGEMENT.md
12_CONFIGURATION_MANAGEMENT.md
13_GAS_OPERATION_POLICY.md
14_SPREADSHEET_SCHEMA.md
15_GAS_IMPLEMENTATION_GUIDE.md
16_TESTING_STRATEGY.md
```

# 14. STATUS

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
| 2026-06-20 | 背面UI保守コンソール方針を反映 |
| 2026-06-20 | Calendar/Poem/Config/Security方針を統一 |
