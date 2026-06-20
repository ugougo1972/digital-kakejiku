# 03_LOG_FORMAT.md

# digital-kakejiku Log Format Specification

最終更新: 2026-06-20  
版: vNext 1.0

---

# 1. 目的

digital-kakejiku におけるログ形式を定義する。

対象。

- observation_log
- event_log
- error_log
- system_log
- calendar_master
- poem_cache

# 2. 基本方針

- 追記主体
- 削除禁止
- 履歴保持
- ISO8601形式推奨
- 機密情報保存禁止
- Spreadsheet列構成は `14_SPREADSHEET_SCHEMA.md` と整合する

# 3. observation_log

Primary Key。

```text
message_id
```

Observation Payload。

```text
v1.0
28項目
```

| Column | Type | Required |
| --- | --- | --- |
| timestamp | DATETIME | YES |
| device_id | STRING | YES |
| message_id | STRING | YES |
| retry_count | INTEGER | YES |
| boot_count | INTEGER | YES |
| wakeup_reason | STRING | YES |
| timestamp_validity | STRING | YES |
| temperature | FLOAT | NO |
| humidity | FLOAT | NO |
| pressure | FLOAT | NO |
| co2 | FLOAT | NO |
| voc_index | FLOAT | NO |
| nox_index | FLOAT | NO |
| pm1_0 | FLOAT | NO |
| pm2_5 | FLOAT | NO |
| pm4_0 | FLOAT | NO |
| pm10 | FLOAT | NO |
| illuminance | FLOAT | NO |
| uv_index | FLOAT | NO |
| motion_detected | BOOLEAN | NO |
| sound_level | FLOAT | NO |
| battery_voltage | FLOAT | NO |
| battery_percent | FLOAT | NO |
| power_mode | STRING | NO |
| wifi_rssi | INTEGER | NO |
| firmware_version | STRING | NO |
| schema_version | STRING | YES |
| created_at | DATETIME | YES |


# 4. event_log

| Column | Type |
| --- | --- |
| timestamp | DATETIME |
| event_type | STRING |
| event_source | STRING |
| severity | STRING |
| description | STRING |
| created_at | DATETIME |


event_type例。

- BOOT
- RTC_SYNC
- POWER_SWITCH
- CONFIG_UPDATE
- CALENDAR_REBUILD
- POEM_GENERATED
- OBSERVATION_ACCEPTED
- USB_POWER_LOST
- USB_POWER_RESTORE

# 5. error_log

| Column | Type |
| --- | --- |
| timestamp | DATETIME |
| error_code | STRING |
| subsystem | STRING |
| severity | STRING |
| description | STRING |
| stacktrace | STRING |
| created_at | DATETIME |


error_code。

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
POWER_ERROR
BATTERY_ERROR
```

# 6. system_log

| Column | Type |
| --- | --- |
| timestamp | DATETIME |
| category | STRING |
| message | STRING |
| created_at | DATETIME |


category。

```text
SYSTEM
CONFIG
JOB
SECURITY
CALENDAR
POEM
POWER
DISPLAY
RESOURCE
```

# 7. calendar_master

Primary Key。

```text
calendar_date
```

status。

```text
SCHEDULED
CALENDAR_RUNNING
CALENDAR_RETRY
CALENDAR_READY
CALENDAR_ERROR
```

# 8. poem_cache

Primary Key。

```text
poem_date
```

generation_status。

```text
CALENDAR_PENDING
POEM_RUNNING
POEM_RETRY
POEM_READY
POEM_ERROR
POEM_SKIPPED
```

prompt_versionはPoem生成時の設定値を保存する。

# 9. 保持方針

| 対象 | 保持方針 |
| --- | --- |
| observation_log | 永続保持 |
| event_log | 永続保持 |
| error_log | 永続保持 |
| system_log | 永続保持 |
| calendar_master | 過去5年 + 当年 + 翌年 |
| poem_cache | 永続保持 |


# 10. 機密情報禁止

保存禁止。

- API_SECRET
- GEMINI_API_KEY
- WIFI_PASSWORD
- OAuth Token
- Access Token

# 11. STATUS

| 項目 | 状態 |
| --- | --- |
| Observation Payload v1.0 | FINALIZED |
| Observation Payload 28項目 | FINALIZED |
| Event Log Format | FINALIZED |
| Error Log Format | FINALIZED |
| System Log Format | FINALIZED |
| Calendar Status管理 | FINALIZED |
| Poem Status管理 | FINALIZED |
| 機密情報保存禁止 | FINALIZED |


# 12. CHANGE LOG

| 日付 | 内容 |
| --- | --- |
| 2026-06-20 | vNext 1.0として全面再生成 |
| 2026-06-20 | Calendar/Poem状態とRetry方針を統一 |
| 2026-06-20 | 機密情報保存禁止方針を明確化 |
