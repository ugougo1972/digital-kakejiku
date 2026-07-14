# digital-kakejiku Spreadsheet Schema

最終更新: 2026-06-20  
文書版: vNext 1.2 review reflected

---

# 1. 目的

本書はSpreadsheet構造の唯一の正式仕様である。

---

# 2. シート一覧

| シート | 用途 |
|---|---|
| observation_log | 観測ログ |
| event_log | イベントログ |
| error_log | 障害ログ |
| system_log | 運用ログ |
| source_config | 情報源URL管理 |
| system_config | システム設定 |
| solar_term_master | 二十四節気マスタ |
| season_dictionary | 七十二候マスタ |
| calendar_master | 暦生成結果 |
| poem_cache | 詩キャッシュ |

---

# 3. observation_log

Primary Key。

```text
message_id
```

主要カラム。

| Column | Type | Required |
|---|---|---|
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

---

# 4. source_config

用途。

```text
情報源URL管理専用
```

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
| updated_at | DATETIME | YES |

source_type。

- HOLIDAY
- SOLAR_TERM
- SEASON_INFO

禁止。

- API_SECRET
- GEMINI_API_KEY
- PASSWORD

---

# 5. system_config

用途。

```text
Job、Prompt、Gemini、表示、運用設定
```

Primary Key。

```text
config_key
```

カラム。

| Column | Type | Required | Description |
|---|---|---|---|
| config_key | STRING | YES | 設定キー |
| config_value | STRING | YES | 設定値 |
| value_type | STRING | YES | STRING/INTEGER/FLOAT/BOOLEAN |
| category | STRING | YES | SYSTEM/JOB/PROMPT/GEMINI/DISPLAY/MAINTENANCE |
| enabled | BOOLEAN | YES | 有効フラグ |
| description | STRING | NO | 説明 |
| updated_at | DATETIME | YES | 更新日時 |

初期値。

| config_key | config_value | value_type | category |
|---|---|---|---|
| prompt_version | poem_prompt_v1.0 | STRING | PROMPT |
| gemini_model | gemini-2.5-flash | STRING | GEMINI |
| gemini_temperature | 0.5 | FLOAT | GEMINI |
| gemini_max_tokens | 300 | INTEGER | GEMINI |
| calendar_retry_max | 3 | INTEGER | JOB |
| poem_retry_max | 3 | INTEGER | JOB |
| retry_base_wait_temporary_sec | 30 | INTEGER | JOB |
| retry_max_wait_temporary_sec | 600 | INTEGER | JOB |
| retry_base_wait_unknown_sec | 60 | INTEGER | JOB |
| retry_max_wait_unknown_sec | 300 | INTEGER | JOB |
| epaper_update_interval_normal_min | 60 | INTEGER | DISPLAY |
| epaper_update_interval_battery_min | 120 | INTEGER | DISPLAY |

保存禁止。

- API_SECRET
- GEMINI_API_KEY
- PASSWORD

---

# 6. season_dictionary

用途。

- 七十二候名称
- 七十二候説明

カラム。

| Column | Type | Required |
|---|---|---|
| season_id | STRING | YES |
| parent_season | STRING | YES |
| kou_type | STRING | YES |
| season_name | STRING | YES |
| description | STRING | YES |

---

# 7. calendar_master

Primary Key。

```text
calendar_date
```

カラム。

| Column | Type | Required |
|---|---|---|
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

カラム。

| Column | Type | Required |
|---|---|---|
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

| 値 | 意味 | 次アクション |
|---|---|---|
| CALENDAR_PENDING | Calendar復旧待ち | CALENDAR_READYまで待機 |
| POEM_RUNNING | 生成中 | 完了待ち |
| POEM_RETRY | Retry待ち | 次回Retry Job |
| POEM_READY | 正常生成完了 | 表示可能 |
| POEM_ERROR | GeminiまたはPrompt失敗 | error_log確認、必要時再生成 |
| POEM_SKIPPED | Calendar失敗で生成停止 | Calendar復旧待ち |

---

# 9. error_log

カラム。

| Column | Type | Required |
|---|---|---|
| timestamp | DATETIME | YES |
| error_code | STRING | YES |
| subsystem | STRING | YES |
| severity | STRING | YES |
| description | STRING | NO |
| stacktrace | STRING | NO |
| created_at | DATETIME | YES |

---

# 10. STATUS

| 項目 | 状態 |
|---|---|
| source_config | FINALIZED |
| system_config | FINALIZED |
| poem_cache.generation_status | FINALIZED |
| calendar_master.status | FINALIZED |
| 機密情報保存禁止 | FINALIZED |

---

# 11. CHANGE LOG

| 日付 | 内容 |
|---|---|
| 2026-06-20 | vNext 1.2としてsystem_config詳細スキーマを追加 |
| 2026-06-20 | poem_cache.generation_status定義を補強 |
