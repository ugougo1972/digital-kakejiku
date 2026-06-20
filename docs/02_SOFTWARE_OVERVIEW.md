# 02_SOFTWARE_OVERVIEW.md

# digital-kakejiku Software Overview

最終更新: 2026-06-20  
版: vNext 1.0

---

# 1. 目的

digital-kakejiku のソフトウェア構成を定義する。

対象。

- ESP32 Firmware
- Google Apps Script
- Google Spreadsheet
- Gemini API

# 2. システム概要

```text
Sensors
↓
ESP32 Firmware
↓ HTTPS
Google Apps Script
↓
Google Spreadsheet
↓
E-Paper Display
```

# 3. ソフトウェア構成

```text
ESP32
├─ SensorManager
├─ StorageManager
├─ NetworkManager
├─ DisplayManager
├─ UIManager
├─ DiagnosticManager
├─ PowerManager
└─ ResourceManager

Google Apps Script
├─ ApiGateway
├─ SecurityManager
├─ ConfigManager
├─ LogSubsystem
├─ CalendarSubsystem
├─ PoemSubsystem
└─ JobScheduler
```

# 4. ESP32側構成

| Manager | 責務 |
| --- | --- |
| SensorManager | センサー制御、観測データ収集 |
| StorageManager | microSD保存、ローカルキャッシュ管理 |
| NetworkManager | Wi-Fi接続、HTTPS通信、再送制御 |
| DisplayManager | 前面E-Paper表示、表示データ整形 |
| UIManager | 背面OLED表示、ロータリーエンコーダ操作 |
| DiagnosticManager | RTC、SD、センサー、通信、Calendar、Poem状態確認 |
| PowerManager | UPS監視、電池監視、電源状態管理 |
| ResourceManager | I2C管理、SPI排他制御、メモリ管理 |


UIManagerは禁止操作を提供しない。

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

# 5. GAS側構成

| Module | 責務 |
| --- | --- |
| ApiGateway | doGet、doPost、API入口 |
| SecurityManager | 認証、Payload検証 |
| ConfigManager | source_config、system_config、Script Properties取得 |
| LogSubsystem | 各種ログ保存 |
| CalendarSubsystem | 暦生成、再生成、状態管理 |
| PoemSubsystem | 詩生成、Gemini API呼出、状態管理 |
| JobScheduler | 定期実行、Retry制御 |


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

# 7. Config管理

- source_config: 情報源URL管理専用
- system_config: Job、Prompt Version、Gemini、表示設定
- season_dictionary: 七十二候名称・説明
- Script Properties: API_SECRET、GEMINI_API_KEY、SYSTEM_VERSION
- ESP32 NVS: 端末設定

# 8. Observation Flow

```text
SensorManager
↓
Observation Payload
↓
StorageManager
↓
NetworkManager
↓
ApiGateway
↓
SecurityManager
↓
LogSubsystem
↓
observation_log
```

# 9. Calendar Flow

```text
source_config
↓
solar_term_master
↓
season_dictionary
↓
CalendarSubsystem
↓
calendar_master
```

# 10. Poem Flow

```text
calendar_master
↓
observation_log
↓
PoemSubsystem
↓
Gemini API
↓
poem_cache
```

# 11. 状態管理

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

# 12. Gemini利用方針

- モデルはsystem_configから取得
- temperatureはsystem_configから取得し初期値0.5
- prompt_versionはsystem_configから取得
- prompt_versionはpoem_cacheへ保存
- API KeyはScript Propertiesから取得

# 13. 実装優先順位

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

# 14. STATUS

| 項目 | 状態 |
| --- | --- |
| ESP32 Architecture | CONFIRMED |
| GAS Architecture | FINALIZED |
| ConfigManager | FINALIZED |
| Calendar Design | FINALIZED |
| Poem Design | FINALIZED |
| Calendar Status | FINALIZED |
| Poem Status | FINALIZED |
| Gemini Policy | FINALIZED |
| Security Policy | FINALIZED |
| 背面保守UI方針 | FINALIZED |


# 15. CHANGE LOG

| 日付 | 内容 |
| --- | --- |
| 2026-06-20 | vNext 1.0として全面再生成 |
| 2026-06-20 | 背面保守UIの責務と禁止操作を反映 |
| 2026-06-20 | Calendar/Poem/Gemini/Config方針を統一 |
