# 14_SPREADSHEET_SCHEMA.md

# digital-kakejiku Spreadsheet Schema

最終更新: 2026-06-20  
版: vNext 1.0

---

# 1. 目的

Spreadsheet構造を定義する。本書はSpreadsheetの唯一の正式仕様とする。

対象。

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

# 2. 基本方針

| 種別 | 方針 |
| --- | --- |
| ログ系 | 追記専用 |
| 設定系 | 管理者更新 |
| マスタ系 | 参照主体 |
| Calendar系 | 生成主体 |
| Poem系 | キャッシュ主体 |


機密情報はSpreadsheetに保存しない。

# 3. observation_log

Primary Key。

```text
message_id
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

| Column | Type | Required |
| --- | --- | --- |
| timestamp | DATETIME | YES |
| event_type | STRING | YES |
| event_source | STRING | YES |
| severity | STRING | YES |
| description | STRING | NO |
| created_at | DATETIME | YES |


# 5. error_log

| Column | Type | Required |
| --- | --- | --- |
| timestamp | DATETIME | YES |
| error_code | STRING | YES |
| subsystem | STRING | YES |
| severity | STRING | YES |
| description | STRING | NO |
| stacktrace | STRING | NO |
| created_at | DATETIME | YES |


# 6. system_log

| Column | Type | Required |
| --- | --- | --- |
| timestamp | DATETIME | YES |
| category | STRING | YES |
| message | STRING | YES |
| created_at | DATETIME | YES |


# 7. source_config

用途。

- 情報源URL管理専用

| Column | Type | Required |
| --- | --- | --- |
| source_id | STRING | YES |
| source_name | STRING | YES |
| source_type | STRING | YES |
| source_url | STRING | YES |
| enabled | BOOLEAN | YES |
| update_frequency | STRING | YES |
| notes | STRING | NO |


source_type。

```text
HOLIDAY
SOLAR_TERM
SEASON_REFERENCE
```

保存禁止。

```text
API_SECRET
GEMINI_API_KEY
PASSWORD
PROMPT_BODY
GEMINI_MODEL
GEMINI_TEMPERATURE
```

# 8. system_config

用途。

- システム設定管理
- Job設定
- Gemini設定
- Prompt Version管理
- 表示設定

| Column | Type | Required |
| --- | --- | --- |
| config_key | STRING | YES |
| config_value | STRING | YES |
| value_type | STRING | YES |
| category | STRING | YES |
| enabled | BOOLEAN | YES |
| description | STRING | NO |
| updated_at | DATETIME | YES |


初期値。

| config_key | config_value |
| --- | --- |
| prompt_version | 1.0 |
| gemini_model | gemini-2.5-flash |
| gemini_temperature | 0.5 |
| gemini_max_tokens | 300 |
| calendar_retry_max | 3 |
| poem_retry_max | 3 |


# 9. solar_term_master

| Column | Type | Required |
| --- | --- | --- |
| solar_term_id | STRING | YES |
| season | STRING | YES |
| solar_term_name | STRING | YES |
| description | STRING | NO |


# 10. season_dictionary

用途。

- 七十二候名称
- 七十二候説明

| Column | Type | Required |
| --- | --- | --- |
| season_id | STRING | YES |
| parent_season | STRING | YES |
| kou_type | STRING | YES |
| season_name | STRING | YES |
| description | STRING | NO |


kou_type。

```text
FIRST
MIDDLE
LAST
```

# 11. calendar_master

Primary Key。

```text
calendar_date
```

| Column | Type | Required |
| --- | --- | --- |
| calendar_date | DATE | YES |
| year | INTEGER | YES |
| month | INTEGER | YES |
| day | INTEGER | YES |
| weekday | STRING | YES |
| holiday_name | STRING | NO |
| solar_term | STRING | NO |
| season_name | STRING | NO |
| lunar_date | STRING | NO |
| rokuyo | STRING | NO |
| moon_age | FLOAT | NO |
| moon_phase | STRING | NO |
| zodiac | STRING | NO |
| eto | STRING | NO |
| seasonal_event | STRING | NO |
| description | STRING | NO |
| status | STRING | YES |
| retry_count | INTEGER | YES |
| first_attempt_at | DATETIME | NO |
| last_attempt_at | DATETIME | NO |
| error_code | STRING | NO |
| updated_at | DATETIME | YES |


status。

```text
SCHEDULED
CALENDAR_RUNNING
CALENDAR_RETRY
CALENDAR_READY
CALENDAR_ERROR
```

# 12. poem_cache

Primary Key。

```text
poem_date
```

| Column | Type | Required |
| --- | --- | --- |
| poem_date | DATE | YES |
| generated_at | DATETIME | YES |
| model_name | STRING | YES |
| prompt_version | STRING | YES |
| poem_title | STRING | YES |
| poem_body | STRING | YES |
| calendar_date | DATE | YES |
| observation_reference | STRING | NO |
| generation_status | STRING | YES |
| retry_count | INTEGER | YES |
| first_attempt_at | DATETIME | NO |
| last_attempt_at | DATETIME | NO |
| error_code | STRING | NO |
| error_message | STRING | NO |


generation_status。

```text
CALENDAR_PENDING
POEM_RUNNING
POEM_RETRY
POEM_READY
POEM_ERROR
POEM_SKIPPED
```

# 13. アクセス方針

読み取り専用。

- source_config
- system_config
- solar_term_master
- season_dictionary

読み書き。

- calendar_master
- poem_cache

追記専用。

- observation_log
- event_log
- error_log
- system_log

# 14. STATUS

| 項目 | 状態 |
| --- | --- |
| observation_log | FINALIZED |
| event_log | CONFIRMED |
| error_log | CONFIRMED |
| system_log | CONFIRMED |
| source_config | FINALIZED |
| system_config | FINALIZED |
| solar_term_master | FINALIZED |
| season_dictionary | FINALIZED |
| calendar_master | FINALIZED |
| poem_cache | FINALIZED |
| Prompt Version保存 | FINALIZED |
| 機密情報保存禁止 | FINALIZED |


# 15. CHANGE LOG

| 日付 | 内容 |
| --- | --- |
| 2026-06-20 | vNext 1.0として全面再生成 |
| 2026-06-20 | source_configを情報源URL管理専用として整理 |
| 2026-06-20 | season_dictionaryを七十二候名称・説明の正本として整理 |
| 2026-06-20 | poem_cacheにprompt_version保存を明記 |
