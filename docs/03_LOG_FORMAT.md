# 03_LOG_FORMAT.md

# digital-kakejiku Log Format Specification

最終更新: 2026-06-19

---

# 1. 目的

本ドキュメントは digital-kakejiku におけるログ形式を定義する。

対象。

```text
observation_log

event_log

error_log

system_log

calendar_master

poem_cache
```

---

# 2. 基本方針

ログは以下の原則で管理する。

```text
追記主体

削除禁止

履歴保持

UTC保存推奨
```

---

# 3. observation_log

## 用途

観測データ保存。

---

## Primary Key

```text
message_id
```

---

## Observation Payload v1.0

状態。

```text
FINALIZED
```

---

## カラム

| Column             | Type     | Required |
| ------------------ | -------- | -------- |
| timestamp          | DATETIME | YES      |
| device_id          | STRING   | YES      |
| message_id         | STRING   | YES      |
| retry_count        | INTEGER  | YES      |
| boot_count         | INTEGER  | YES      |
| wakeup_reason      | STRING   | YES      |
| timestamp_validity | STRING   | YES      |
| temperature        | FLOAT    | NO       |
| humidity           | FLOAT    | NO       |
| pressure           | FLOAT    | NO       |
| co2                | FLOAT    | NO       |
| voc_index          | FLOAT    | NO       |
| nox_index          | FLOAT    | NO       |
| pm1_0              | FLOAT    | NO       |
| pm2_5              | FLOAT    | NO       |
| pm4_0              | FLOAT    | NO       |
| pm10               | FLOAT    | NO       |
| illuminance        | FLOAT    | NO       |
| uv_index           | FLOAT    | NO       |
| motion_detected    | BOOLEAN  | NO       |
| sound_level        | FLOAT    | NO       |
| battery_voltage    | FLOAT    | NO       |
| battery_percent    | FLOAT    | NO       |
| power_mode         | STRING   | NO       |
| wifi_rssi          | INTEGER  | NO       |
| firmware_version   | STRING   | NO       |
| schema_version     | STRING   | YES      |
| created_at         | DATETIME | YES      |

---

## timestamp_validity

許容値。

```text
RTC_VALID

RTC_INVALID

RTC_RECOVERED
```

---

## wakeup_reason

許容値。

```text
BOOT

TIMER

MANUAL

WATCHDOG

POWER_RECOVERY
```

---

## power_mode

許容値。

```text
USB

BATTERY
```

---

# 4. event_log

## 用途

イベント履歴。

---

## カラム

| Column       | Type     |
| ------------ | -------- |
| timestamp    | DATETIME |
| event_type   | STRING   |
| event_source | STRING   |
| severity     | STRING   |
| description  | STRING   |
| created_at   | DATETIME |

---

## severity

```text
INFO

WARNING

ERROR
```

---

## event_type例

```text
BOOT

RTC_SYNC

POWER_SWITCH

CONFIG_UPDATE

CALENDAR_REBUILD

POEM_GENERATED
```

---

# 5. error_log

## 用途

障害履歴。

---

## カラム

| Column      | Type     |
| ----------- | -------- |
| timestamp   | DATETIME |
| error_code  | STRING   |
| subsystem   | STRING   |
| severity    | STRING   |
| description | STRING   |
| stacktrace  | STRING   |
| created_at  | DATETIME |

---

## subsystem

```text
API

CONFIG

SECURITY

CALENDAR

POEM

ESP32
```

---

## error_code

```text
AUTH_ERROR

INVALID_DEVICE

INVALID_PAYLOAD

SCHEMA_ERROR

CONFIG_ERROR

SECURITY_ERROR

CALENDAR_ERROR

CALENDAR_PENDING

POEM_ERROR

RESOURCE_LOCK_ERROR

RESOURCE_TIMEOUT

NETWORK_ERROR

RTC_ERROR
```

---

# 6. system_log

## 用途

運用ログ。

---

## カラム

| Column     | Type     |
| ---------- | -------- |
| timestamp  | DATETIME |
| category   | STRING   |
| message    | STRING   |
| created_at | DATETIME |

---

## category

```text
SYSTEM

CONFIG

JOB

SECURITY

CALENDAR

POEM
```

---

# 7. calendar_master

## 用途

暦生成結果。

---

## Primary Key

```text
calendar_date
```

---

## カラム

| Column           | Type     |
| ---------------- | -------- |
| calendar_date    | DATE     |
| year             | INTEGER  |
| month            | INTEGER  |
| day              | INTEGER  |
| weekday          | STRING   |
| holiday_name     | STRING   |
| solar_term       | STRING   |
| season_name      | STRING   |
| lunar_date       | STRING   |
| rokuyo           | STRING   |
| moon_age         | FLOAT    |
| moon_phase       | STRING   |
| zodiac           | STRING   |
| eto              | STRING   |
| seasonal_event   | STRING   |
| description      | STRING   |
| status           | STRING   |
| retry_count      | INTEGER  |
| first_attempt_at | DATETIME |
| last_attempt_at  | DATETIME |
| error_code       | STRING   |
| updated_at       | DATETIME |

---

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

# 8. poem_cache

## 用途

生成済み詩キャッシュ。

---

## Primary Key

```text
poem_date
```

---

## カラム

| Column                | Type     |
| --------------------- | -------- |
| poem_date             | DATE     |
| generated_at          | DATETIME |
| model_name            | STRING   |
| prompt_version        | STRING   |
| poem_title            | STRING   |
| poem_body             | STRING   |
| calendar_date         | DATE     |
| observation_reference | STRING   |
| generation_status     | STRING   |
| retry_count           | INTEGER  |
| first_attempt_at      | DATETIME |
| last_attempt_at       | DATETIME |
| error_code            | STRING   |
| error_message         | STRING   |

---

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

# 9. Calendar状態遷移ログ

## 正常

```text
SCHEDULED
↓
CALENDAR_RUNNING
↓
CALENDAR_READY
```

---

## Retry

```text
CALENDAR_RUNNING
↓
CALENDAR_RETRY
↓
CALENDAR_RUNNING
```

---

## 異常終了

```text
CALENDAR_RUNNING
↓
CALENDAR_ERROR
```

---

# 10. Poem状態遷移ログ

## 正常

```text
POEM_RUNNING
↓
POEM_READY
```

---

## Retry

```text
POEM_RUNNING
↓
POEM_RETRY
↓
POEM_RUNNING
```

---

## Calendar待機

```text
CALENDAR_PENDING
```

---

## 実行禁止

```text
POEM_SKIPPED
```

---

## 異常終了

```text
POEM_ERROR
```

---

# 11. 保持方針

## observation_log

```text
永続保持
```

---

## event_log

```text
永続保持
```

---

## error_log

```text
永続保持
```

---

## system_log

```text
永続保持
```

---

## calendar_master

```text
過去5年

当年

翌年
```

---

## poem_cache

```text
永続保持
```

---

# 12. 出力規則

## DATETIME

```text
ISO8601
```

例。

```text
2026-06-19T02:00:00+09:00
```

---

## DATE

```text
YYYY-MM-DD
```

例。

```text
2026-06-19
```

---

## BOOLEAN

```text
TRUE

FALSE
```

---

# 13. STATUS

| 項目                       | 状態        |
| ------------------------ | --------- |
| Observation Payload v1.0 | FINALIZED |
| Observation Payload 28項目 | FINALIZED |
| Event Log Format         | FINALIZED |
| Error Log Format         | FINALIZED |
| System Log Format        | FINALIZED |
| Calendar Status管理        | FINALIZED |
| Poem Status管理            | FINALIZED |
| 保持方針                     | FINALIZED |

---

# 14. CHANGE LOG

| 日付         | 内容                           |
| ---------- | ---------------------------- |
| 2026-06-19 | Observation Payload v1.0反映   |
| 2026-06-19 | Payload 28項目反映               |
| 2026-06-19 | Calendar Status追加            |
| 2026-06-19 | Poem Status追加                |
| 2026-06-19 | CALENDAR_PENDING追加           |
| 2026-06-19 | 保持方針更新                       |
| 2026-06-19 | 14_SPREADSHEET_SCHEMA.mdと整合化 |
