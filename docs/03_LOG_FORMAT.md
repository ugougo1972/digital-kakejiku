# digital-kakejiku Log Format Specification

最終更新: 2026-06-20  
文書版: vNext 1.1 review reflected

---

# 1. 目的

本書はログ形式の基準源である。

---

# 2. 基本方針

- ログは追記主体
- 削除禁止
- 履歴保持
- DATETIMEはISO8601形式
- 機密情報は保存しない

---

# 3. observation_log

Primary Key。

```text
message_id
```

| Column | Type | Required | Description |
|---|---|---|---|
| timestamp | DATETIME | YES | ESP32観測日時 |
| server_timestamp | DATETIME | NO | GAS受信日時。RTC異常時の補助 |
| device_id | STRING | YES | 端末ID |
| message_id | STRING | YES | 一意ID |
| retry_count | INTEGER | YES | 再送回数 |
| boot_count | INTEGER | YES | 起動回数 |
| wakeup_reason | STRING | YES | 起床理由 |
| timestamp_validity | STRING | YES | RTC状態 |
| temperature | FLOAT | NO | 温度 |
| humidity | FLOAT | NO | 湿度 |
| pressure | FLOAT | NO | 気圧 |
| co2 | FLOAT | NO | CO2 |
| voc_index | FLOAT | NO | VOC |
| nox_index | FLOAT | NO | NOx |
| pm1_0 | FLOAT | NO | PM1.0 |
| pm2_5 | FLOAT | NO | PM2.5 |
| pm4_0 | FLOAT | NO | PM4.0 |
| pm10 | FLOAT | NO | PM10 |
| illuminance | FLOAT | NO | 照度 |
| uv_index | FLOAT | NO | UV |
| motion_detected | BOOLEAN | NO | 人感 |
| sound_level | FLOAT | NO | 音環境 |
| battery_voltage | FLOAT | NO | 電池電圧 |
| battery_percent | FLOAT | NO | 電池残量 |
| power_mode | STRING | NO | USB/BATTERY |
| wifi_rssi | INTEGER | NO | RSSI |
| firmware_version | STRING | NO | FW |
| schema_version | STRING | YES | Payload版 |
| created_at | DATETIME | YES | 保存日時 |

---

# 4. event_log

| Column | Type | Description |
|---|---|---|
| timestamp | DATETIME | 発生日時 |
| event_type | STRING | イベント種別 |
| event_source | STRING | 発生元 |
| severity | STRING | INFO/WARNING/ERROR |
| description | STRING | 説明 |
| created_at | DATETIME | 保存日時 |

主な event_type。

- OBSERVATION_ACCEPTED
- OBSERVATION_DUPLICATED
- CALENDAR_REBUILD
- POEM_REGENERATED
- USB_POWER_LOST
- USB_POWER_RESTORE
- CONFIG_UPDATE

---

# 5. error_log

| Column | Type | Description |
|---|---|---|
| timestamp | DATETIME | 発生日時 |
| error_code | STRING | エラーコード |
| subsystem | STRING | API/CONFIG/SECURITY/CALENDAR/POEM/ESP32 |
| severity | STRING | WARNING/ERROR/CRITICAL |
| retryable | BOOLEAN | リトライ対象か |
| attempts | INTEGER | 試行回数 |
| description | STRING | 説明 |
| stacktrace | STRING | GAS内部例外情報。機密情報はマスク |
| created_at | DATETIME | 保存日時 |

主な error_code。

- AUTH_ERROR
- INVALID_DEVICE
- INVALID_PAYLOAD
- SCHEMA_ERROR
- CONFIG_ERROR
- SECURITY_ERROR
- CALENDAR_ERROR
- CALENDAR_PENDING
- POEM_ERROR
- GEMINI_RATE_LIMIT
- GEMINI_SERVER_ERROR
- NETWORK_ERROR
- RTC_ERROR
- RESOURCE_LOCK_ERROR
- RESOURCE_TIMEOUT

---

# 6. system_log

| Column | Type | Description |
|---|---|---|
| timestamp | DATETIME | 記録日時 |
| category | STRING | SYSTEM/CONFIG/JOB/SECURITY/CALENDAR/POEM |
| message | STRING | 内容 |
| created_at | DATETIME | 保存日時 |

---

# 7. 保持方針

| 対象 | 保持期間 |
|---|---|
| observation_log | 永続保持 |
| event_log | 永続保持 |
| error_log | 永続保持 |
| system_log | 永続保持 |
| calendar_master | 過去5年＋当年＋翌年 |
| poem_cache | 永続保持 |

---

# 8. STATUS

| 項目 | 状態 |
|---|---|
| Observation Payload v1.0 | FINALIZED |
| server_timestamp | PROPOSED |
| Error Retry項目 | FINALIZED |
| Log Masking | FINALIZED |

---

# 9. CHANGE LOG

| 日付 | 内容 |
|---|---|
| 2026-06-20 | エラーリトライ用カラムを追加 |
| 2026-06-20 | RTC異常時補助用server_timestampをPROPOSED追加 |
