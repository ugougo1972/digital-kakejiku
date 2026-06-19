# 02_SOFTWARE_OVERVIEW.md

# digital-kakejiku Software Overview

最終更新: 2026-06-19

---

# 1. 目的

本ドキュメントは digital-kakejiku のソフトウェア構成を定義する。

対象。

```text
ESP32 Firmware

Google Apps Script

Google Spreadsheet

Gemini API
```

---

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

---

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

---

# 4. ESP32側構成

## SensorManager

責務。

```text
センサー制御

観測データ収集
```

---

## StorageManager

責務。

```text
microSD保存

キャッシュ管理
```

---

## NetworkManager

責務。

```text
WiFi接続

HTTPS通信

再送制御
```

---

## DisplayManager

責務。

```text
ePaper表示

OLED表示
```

---

## UIManager

責務。

```text
ダイヤル操作

メニュー制御
```

---

## DiagnosticManager

責務。

```text
自己診断

ログ出力
```

---

## PowerManager

責務。

```text
UPS監視

電池監視
```

---

## ResourceManager

責務。

```text
I2C管理

SPI管理

メモリ管理
```

---

# 5. GAS側構成

## ApiGateway

責務。

```text
API入口
```

公開関数。

```javascript
doGet()

doPost()
```

---

## SecurityManager

責務。

```text
認証

Payload検証
```

---

## ConfigManager

責務。

```text
設定取得

設定管理
```

---

## LogSubsystem

責務。

```text
ログ保存
```

---

## CalendarSubsystem

責務。

```text
暦生成
```

---

## PoemSubsystem

責務。

```text
詩生成
```

---

## JobScheduler

責務。

```text
定期実行管理
```

---

# 6. Spreadsheet構成

## ログ

```text
observation_log

event_log

error_log

system_log
```

---

## Calendar

```text
source_config

system_config

solar_term_master

season_dictionary

calendar_master
```

---

## Poem

```text
poem_cache
```

状態。

```text
FINALIZED
```

---

# 7. Config管理

## source_config

用途。

```text
Calendar情報源管理
```

保持対象。

```text
祝日情報源

二十四節気情報源

解説情報源
```

---

## system_config

用途。

```text
システム設定
```

保持対象。

```text
Gemini設定

Prompt設定

Job設定

表示設定
```

---

## Script Properties

用途。

```text
機密情報管理
```

保持対象。

```text
API_SECRET

GEMINI_API_KEY

SYSTEM_VERSION
```

---

# 8. Observation Flow

```text
SensorManager
      ↓

Observation Payload

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

---

# 9. Observation Payload

状態。

```text
FINALIZED
```

---

構成。

```text
v1.0

28項目
```

---

追加採択。

```text
timestamp_validity

boot_count

wakeup_reason

message_id

retry_count
```

---

# 10. Calendar Flow

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

---

# 11. Calendar保持方針

保持期間。

```text
過去5年

当年

翌年
```

状態。

```text
FINALIZED
```

---

## 年次生成

```text
毎年12月1日
```

---

## 手動再生成

許可。

```text
指定年

指定期間
```

---

# 12. Calendar状態管理

## status

```text
SCHEDULED

CALENDAR_RUNNING

CALENDAR_RETRY

CALENDAR_READY

CALENDAR_ERROR
```

状態。

```text
FINALIZED
```

---

# 13. Poem Flow

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

---

# 14. Poem依存関係

```text
Calendar Job
      ↓

calendar_master
      ↓

Poem Job
```

状態。

```text
FINALIZED
```

---

## CALENDAR_PENDING

対象。

```text
SCHEDULED

CALENDAR_RUNNING

CALENDAR_RETRY
```

動作。

```text
Poem生成保留
```

状態。

```text
FINALIZED
```

---

# 15. Poem生成仕様

## 立場

```text
観測
+
歳時記
```

---

## 詩種

```text
自由詩
```

---

## 視点

```text
客観描写
```

---

## 長さ

```text
80〜120文字
```

目標。

```text
100文字
```

---

## タイトル

```text
Gemini自由生成
```

---

## 数値

直接出力禁止。

例。

禁止。

```text
26.4℃
61%
712ppm
```

許可。

```text
湿り気

穏やかな空気

静かな室内
```

状態。

```text
FINALIZED
```

---

# 16. Poem状態管理

## generation_status

```text
CALENDAR_PENDING

POEM_RUNNING

POEM_RETRY

POEM_READY

POEM_ERROR

POEM_SKIPPED
```

状態。

```text
FINALIZED
```

---

# 17. Gemini利用方針

## モデル

取得元。

```text
system_config
```

---

## Temperature

```text
0.5
```

状態。

```text
FINALIZED
```

---

## Prompt Version

取得元。

```text
system_config
```

---

## API Key

取得元。

```text
Script Properties
```

---

# 18. JobScheduler

## Calendar Job

```text
02:00 Main

02:30 Retry1

03:00 Retry2

03:30 Retry3
```

---

## Poem Job

```text
02:10 Main

02:40 Retry1

03:10 Retry2

03:40 Retry3
```

状態。

```text
FINALIZED
```

---

# 19. セキュリティ

認証方式。

```text
device_id
+
secret
```

---

保存禁止。

```text
API_SECRET

GEMINI_API_KEY

PASSWORD
```

---

Gemini呼出。

```text
GASのみ
```

状態。

```text
FINALIZED
```

---

# 20. 実装優先順位

```text
1 ConfigManager

2 SecurityManager

3 LogSubsystem

4 ApiGateway

5 CalendarSubsystem

6 PoemSubsystem

7 JobScheduler
```

状態。

```text
FINALIZED
```

---

# 21. STATUS

| 項目                 | 状態        |
| ------------------ | --------- |
| ESP32 Architecture | CONFIRMED |
| GAS Architecture   | FINALIZED |
| ConfigManager      | FINALIZED |
| Calendar Design    | FINALIZED |
| Poem Design        | FINALIZED |
| Calendar Status    | FINALIZED |
| Poem Status        | FINALIZED |
| Gemini Policy      | FINALIZED |
| Security Policy    | FINALIZED |

---

# 22. CHANGE LOG

| 日付         | 内容                 |
| ---------- | ------------------ |
| 2026-06-19 | system_config追加    |
| 2026-06-19 | ConfigManager追加    |
| 2026-06-19 | Calendar Status反映  |
| 2026-06-19 | Poem Status反映      |
| 2026-06-19 | CALENDAR_PENDING反映 |
| 2026-06-19 | Gemini Prompt方針反映  |
| 2026-06-19 | A1〜A4採択反映          |
