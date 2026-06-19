# 14_SPREADSHEET_SCHEMA.md

# digital-kakejiku Spreadsheet Schema

最終更新: 2026-06-19

---

# 1. 目的

本ドキュメントは digital-kakejiku における Spreadsheet 構造を定義する。

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

本書は Spreadsheet の唯一の正式仕様とする。

---

# 2. 基本方針

ログ系。

```text
追記専用
```

マスタ系。

```text
参照主体
```

Calendar系。

```text
生成主体
```

Poem系。

```text
キャッシュ主体
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

## カラム

| Column             | Type     | Required | Description |
| ------------------ | -------- | -------- | ----------- |
| timestamp          | DATETIME | YES      | 観測日時        |
| device_id          | STRING   | YES      | 端末ID        |
| message_id         | STRING   | YES      | 一意ID        |
| retry_count        | INTEGER  | YES      | 再送回数        |
| boot_count         | INTEGER  | YES      | 起動回数        |
| wakeup_reason      | STRING   | YES      | 起床理由        |
| timestamp_validity | STRING   | YES      | RTC状態       |
| temperature        | FLOAT    | NO       | 温度          |
| humidity           | FLOAT    | NO       | 湿度          |
| pressure           | FLOAT    | NO       | 気圧          |
| co2                | FLOAT    | NO       | CO2         |
| voc_index          | FLOAT    | NO       | VOC         |
| nox_index          | FLOAT    | NO       | NOx         |
| pm1_0              | FLOAT    | NO       | PM1.0       |
| pm2_5              | FLOAT    | NO       | PM2.5       |
| pm4_0              | FLOAT    | NO       | PM4.0       |
| pm10               | FLOAT    | NO       | PM10        |
| illuminance        | FLOAT    | NO       | 照度          |
| uv_index           | FLOAT    | NO       | UV          |
| motion_detected    | BOOLEAN  | NO       | 人感          |
| sound_level        | FLOAT    | NO       | 音環境         |
| battery_voltage    | FLOAT    | NO       | 電池電圧        |
| battery_percent    | FLOAT    | NO       | 電池残量        |
| power_mode         | STRING   | NO       | USB/BATTERY |
| wifi_rssi          | INTEGER  | NO       | RSSI        |
| firmware_version   | STRING   | NO       | FW          |
| schema_version     | STRING   | YES      | Payload版    |
| created_at         | DATETIME | YES      | 保存日時        |

状態。

FINALIZED

---

# 4. event_log

## 用途

イベント記録。

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

# 5. error_log

## 用途

障害記録。

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

## エラーコード

```text
NETWORK_ERROR
RTC_ERROR
CALENDAR_ERROR
CALENDAR_PENDING
POEM_ERROR
CONFIG_ERROR
SECURITY_ERROR
RESOURCE_LOCK_ERROR
RESOURCE_TIMEOUT
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

# 7. source_config

## 用途

Calendar情報源管理。

---

## カラム

| Column           | Type    | Required |
| ---------------- | ------- | -------- |
| source_id        | STRING  | YES      |
| source_name      | STRING  | YES      |
| source_type      | STRING  | YES      |
| source_url       | STRING  | YES      |
| enabled          | BOOLEAN | YES      |
| update_frequency | STRING  | YES      |
| notes            | STRING  | NO       |

---

## source_type

```text
HOLIDAY
SOLAR_TERM
SEASON_INFO
```

---

## 保存禁止

```text
API_SECRET
GEMINI_API_KEY
PASSWORD
```

状態。

FINALIZED

---

# 8. system_config

## 用途

システム設定管理。

---

## Primary Key

```text
config_key
```

---

## カラム

| Column       | Type     | Required |
| ------------ | -------- | -------- |
| config_key   | STRING   | YES      |
| config_value | STRING   | YES      |
| value_type   | STRING   | YES      |
| category     | STRING   | YES      |
| enabled      | BOOLEAN  | YES      |
| description  | STRING   | NO       |
| updated_at   | DATETIME | YES      |

---

## category

```text
SYSTEM
JOB
PROMPT
GEMINI
DISPLAY
```

---

## 初期値

| config_key         | config_value     |
| ------------------ | ---------------- |
| prompt_version     | 1.0              |
| gemini_model       | gemini-2.5-flash |
| gemini_temperature | 0.5              |
| gemini_max_tokens  | 300              |
| calendar_retry_max | 3                |
| poem_retry_max     | 3                |

状態。

CONFIRMED

---

# 9. solar_term_master

## 用途

二十四節気マスタ。

---

## カラム

| Column          | Type   |
| --------------- | ------ |
| solar_term_id   | STRING |
| season          | STRING |
| solar_term_name | STRING |
| description     | STRING |

---

## season

```text
SPRING
SUMMER
AUTUMN
WINTER
```

状態。

FINALIZED

---

# 10. season_dictionary

## 用途

七十二候マスタ。

---

## カラム

| Column        | Type   |
| ------------- | ------ |
| season_id     | STRING |
| parent_season | STRING |
| kou_type      | STRING |
| season_name   | STRING |
| description   | STRING |

---

## kou_type

```text
FIRST
MIDDLE
LAST
```

対応。

```text
初候
次候
末候
```

状態。

FINALIZED

---

# 11. calendar_master

## 用途

暦情報保存。

---

## Primary Key

```text
calendar_date
```

---

## カラム

| Column           | Type     | Required |
| ---------------- | -------- | -------- |
| calendar_date    | DATE     | YES      |
| year             | INTEGER  | YES      |
| month            | INTEGER  | YES      |
| day              | INTEGER  | YES      |
| weekday          | STRING   | YES      |
| holiday_name     | STRING   | NO       |
| solar_term       | STRING   | NO       |
| season_name      | STRING   | NO       |
| lunar_date       | STRING   | NO       |
| rokuyo           | STRING   | NO       |
| moon_age         | FLOAT    | NO       |
| moon_phase       | STRING   | NO       |
| zodiac           | STRING   | NO       |
| eto              | STRING   | NO       |
| seasonal_event   | STRING   | NO       |
| description      | STRING   | NO       |
| status           | STRING   | YES      |
| retry_count      | INTEGER  | YES      |
| first_attempt_at | DATETIME | NO       |
| last_attempt_at  | DATETIME | NO       |
| error_code       | STRING   | NO       |
| updated_at       | DATETIME | YES      |

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

FINALIZED

---

# 12. poem_cache

## 用途

生成済み詩保存。

---

## Primary Key

```text
poem_date
```

---

## カラム

| Column                | Type     | Required |
| --------------------- | -------- | -------- |
| poem_date             | DATE     | YES      |
| generated_at          | DATETIME | YES      |
| model_name            | STRING   | YES      |
| prompt_version        | STRING   | YES      |
| poem_title            | STRING   | YES      |
| poem_body             | STRING   | YES      |
| calendar_date         | DATE     | YES      |
| observation_reference | STRING   | NO       |
| generation_status     | STRING   | YES      |
| retry_count           | INTEGER  | YES      |
| first_attempt_at      | DATETIME | NO       |
| last_attempt_at       | DATETIME | NO       |
| error_code            | STRING   | NO       |
| error_message         | STRING   | NO       |

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

FINALIZED

---

# 13. Spreadsheetアクセス方針

## 読み取り専用

```text
source_config
system_config
solar_term_master
season_dictionary
```

---

## 読み書き

```text
calendar_master
poem_cache
```

---

## 追記専用

```text
observation_log
event_log
error_log
system_log
```

---

# 14. STATUS

| 項目                | 状態        |
| ----------------- | --------- |
| observation_log   | FINALIZED |
| event_log         | CONFIRMED |
| error_log         | CONFIRMED |
| system_log        | CONFIRMED |
| source_config     | FINALIZED |
| system_config     | FINALIZED |
| solar_term_master | FINALIZED |
| season_dictionary | FINALIZED |
| calendar_master   | FINALIZED |
| poem_cache        | FINALIZED |
| Calendar Status管理 | FINALIZED |
| Poem Status管理     | FINALIZED |

---

# 15. CHANGE LOG

| 日付         | 内容                         |
| ---------- | -------------------------- |
| 2026-06-19 | 新規作成                       |
| 2026-06-19 | Observation Payload v1.0反映 |
| 2026-06-19 | system_config追加            |
| 2026-06-19 | Calendar Status追加          |
| 2026-06-19 | Poem Status追加              |
| 2026-06-19 | 旧暦・六曜・月齢追加                 |
| 2026-06-19 | 季節区分追加                     |
| 2026-06-19 | 七十二候区分追加                   |
