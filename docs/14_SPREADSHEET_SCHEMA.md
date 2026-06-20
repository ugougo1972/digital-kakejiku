# digital-kakejiku Spreadsheet Schema

最終更新: 2026-06-20  
文書版: vNext 1.1 review reflected

---

# 1. 目的

本書はSpreadsheet構造の唯一の正式仕様である。

---

# 2. シート一覧

- observation_log
- event_log
- error_log
- system_log
- source_config
- system_config
- solar_term_master
- season_dictionary
- calendar_master
- poem_cache

---

# 3. observation_log

Primary Key。

```text
message_id
```

主要カラム。

- timestamp
- server_timestamp（PROPOSED）
- device_id
- message_id
- retry_count
- boot_count
- wakeup_reason
- timestamp_validity
- temperature
- humidity
- pressure
- co2
- voc_index
- nox_index
- pm1_0
- pm2_5
- pm4_0
- pm10
- illuminance
- uv_index
- motion_detected
- sound_level
- battery_voltage
- battery_percent
- power_mode
- wifi_rssi
- firmware_version
- schema_version
- created_at

---

# 4. source_config

用途。

- 情報源URL管理

カラム。

| Column | Type | Required |
|---|---|---|
| source_id | STRING | YES |
| source_name | STRING | YES |
| source_type | STRING | YES |
| source_url | STRING | YES |
| enabled | BOOLEAN | YES |
| update_frequency | STRING | YES |
| notes | STRING | NO |

source_type。

- HOLIDAY
- SOLAR_TERM
- SEASON_INFO

---

# 5. system_config

用途。

- Job設定
- Gemini設定
- Prompt設定
- 表示設定

カラム。

| Column | Type | Required |
|---|---|---|
| config_key | STRING | YES |
| config_value | STRING | YES |
| value_type | STRING | YES |
| category | STRING | YES |
| enabled | BOOLEAN | YES |
| description | STRING | NO |
| updated_at | DATETIME | YES |

初期値。

| config_key | config_value |
|---|---|
| prompt_version | 1.0 |
| gemini_model | gemini-2.5-flash |
| gemini_temperature | 0.5 |
| gemini_max_tokens | 300 |
| calendar_retry_max | 3 |
| poem_retry_max | 3 |

---

# 6. season_dictionary

用途。

- 七十二候名称
- 七十二候説明

カラム。

- season_id
- parent_season
- kou_type
- season_name
- description

---

# 7. calendar_master

Primary Key。

```text
calendar_date
```

主要カラム。

- calendar_date
- year
- month
- day
- weekday
- holiday_name
- solar_term
- season_name
- lunar_date
- rokuyo
- moon_age
- moon_phase
- zodiac
- eto
- seasonal_event
- description
- status
- retry_count
- first_attempt_at
- last_attempt_at
- error_code
- updated_at

status。

- SCHEDULED
- CALENDAR_RUNNING
- CALENDAR_RETRY
- CALENDAR_READY
- CALENDAR_ERROR

---

# 8. poem_cache

Primary Key。

```text
poem_date
```

主要カラム。

- poem_date
- generated_at
- model_name
- prompt_version
- poem_title
- poem_body
- calendar_date
- observation_reference
- generation_status
- retry_count
- first_attempt_at
- last_attempt_at
- error_code
- error_message

status。

- CALENDAR_PENDING
- POEM_RUNNING
- POEM_RETRY
- POEM_READY
- POEM_ERROR
- POEM_SKIPPED

---

# 9. error_log拡張

Retry詳細記録用として以下を追加候補とする。

- retryable
- attempts

状態。

```text
PROPOSED
```

---

# 10. STATUS

| 項目 | 状態 |
|---|---|
| Spreadsheet Schema | FINALIZED |
| source_config | FINALIZED |
| system_config | FINALIZED |
| season_dictionary | FINALIZED |
| calendar_master | FINALIZED |
| poem_cache | FINALIZED |
| error_log retryable/attempts | PROPOSED |
| observation_log server_timestamp | PROPOSED |

---

# 11. CHANGE LOG

| 日付 | 内容 |
|---|---|
| 2026-06-20 | vNext 1.1として基準源を再整理 |
| 2026-06-20 | Retry詳細用カラム候補を追加 |
