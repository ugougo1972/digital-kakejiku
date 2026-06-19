# 06_GAS_API_SPEC.md

# digital-kakejiku GAS API Specification

最終更新: 2026-06-19

---

# 1. 目的

本ドキュメントは digital-kakejiku における GAS API 仕様を定義する。

対象。

```text
ApiGateway

SecurityManager

ESP32 Client
```

---

# 2. API構成

公開API。

```text
GET  /

POST /
```

状態。

```text
FINALIZED
```

---

# 3. アーキテクチャ

```text
ESP32
   ↓ HTTPS

ApiGateway
   ↓

SecurityManager
   ↓

LogSubsystem
   ↓

Spreadsheet
```

---

# 4. GET API

## 用途

```text
Alive Check

Health Check
```

---

## Request

```http
GET /
```

---

## Response

```json
{
  "status":"ok",
  "service":"digital-kakejiku"
}
```

---

## HTTP Status

```text
200 OK
```

---

# 5. POST API

## 用途

観測データ送信。

---

## Request

```http
POST /
Content-Type: application/json
```

---

# 6. Observation Payload

## 状態

```text
FINALIZED
```

---

## Payload Version

```text
1.0
```

---

## 項目数

```text
28
```

---

## JSON

```json
{
  "device_id":"dk-001",
  "secret":"xxxxxxxx",
  "timestamp":"2026-06-19T12:00:00+09:00",

  "message_id":"msg-000001",

  "retry_count":0,
  "boot_count":123,

  "wakeup_reason":"BOOT",
  "timestamp_validity":"RTC_VALID",

  "temperature":24.8,
  "humidity":55.1,
  "pressure":1012.4,

  "co2":620,

  "voc_index":10,
  "nox_index":3,

  "pm1_0":1,
  "pm2_5":2,
  "pm4_0":2,
  "pm10":3,

  "illuminance":120,

  "uv_index":0.2,

  "motion_detected":false,

  "sound_level":35,

  "battery_voltage":4.05,
  "battery_percent":87,

  "power_mode":"USB",

  "wifi_rssi":-58,

  "firmware_version":"1.0.0",

  "schema_version":"1.0"
}
```

---

# 7. 必須項目

| 項目                 |
| ------------------ |
| device_id          |
| secret             |
| timestamp          |
| message_id         |
| retry_count        |
| boot_count         |
| wakeup_reason      |
| timestamp_validity |
| schema_version     |

---

# 8. Optional項目

センサー未搭載時。

```text
NULL許可
```

対象。

```text
temperature
humidity
pressure

co2

voc_index
nox_index

pm1_0
pm2_5
pm4_0
pm10

illuminance
uv_index

motion_detected

sound_level

battery_voltage
battery_percent

wifi_rssi
```

---

# 9. wakeup_reason

許容値。

```text
BOOT

TIMER

MANUAL

WATCHDOG

POWER_RECOVERY
```

---

# 10. timestamp_validity

許容値。

```text
RTC_VALID

RTC_INVALID

RTC_RECOVERED
```

---

# 11. power_mode

許容値。

```text
USB

BATTERY
```

---

# 12. SecurityManager

## 認証方式

```text
device_id
+
secret
```

状態。

```text
FINALIZED
```

---

## 処理順序

```text
1 secret確認

2 device_id確認

3 schema確認

4 保存
```

---

# 13. device_id

形式。

```text
英数字
```

例。

```text
dk-main-001
```

---

## 一意性

```text
必須
```

---

# 14. secret

用途。

```text
API認証
```

---

## 保存場所

### ESP32

```text
NVS
```

---

### GAS

```text
Script Properties
```

---

## 保存禁止

```text
Spreadsheet
```

状態。

```text
FINALIZED
```

---

# 15. Payload Validation

## schema_version

確認。

```text
必須
```

---

## message_id

確認。

```text
必須

重複検出
```

---

## timestamp

確認。

```text
ISO8601
```

---

## 数値項目

確認。

```text
Number型
```

---

# 16. 保存処理

保存先。

```text
observation_log
```

---

## 保存成功

```text
event_log
```

記録。

```text
OBSERVATION_ACCEPTED
```

---

## 保存失敗

```text
error_log
```

記録。

```text
OBSERVATION_REJECTED
```

---

# 17. Response

## Success

HTTP。

```text
200
```

---

Body。

```json
{
  "status":"success",
  "message_id":"msg-000001"
}
```

---

## Validation Error

HTTP。

```text
400
```

---

Body。

```json
{
  "status":"error",
  "error_code":"SCHEMA_ERROR"
}
```

---

## Authentication Error

HTTP。

```text
401
```

---

Body。

```json
{
  "status":"error",
  "error_code":"AUTH_ERROR"
}
```

---

## Server Error

HTTP。

```text
500
```

---

Body。

```json
{
  "status":"error",
  "error_code":"INTERNAL_ERROR"
}
```

---

# 18. Log連携

## observation_log

保存。

```text
Payload
```

---

## event_log

保存。

```text
OBSERVATION_ACCEPTED

OBSERVATION_DUPLICATED
```

---

## error_log

保存。

```text
AUTH_ERROR

SCHEMA_ERROR

CONFIG_ERROR

SECURITY_ERROR
```

---

# 19. Config連携

## source_config

用途。

```text
対象外
```

---

## system_config

用途。

```text
API設定

Timeout

Retry
```

---

## Script Properties

用途。

```text
API_SECRET

SYSTEM_VERSION
```

---

# 20. API対象外

以下はAPI対象外。

```text
CalendarSubsystem

PoemSubsystem

JobScheduler
```

理由。

```text
内部ジョブ
```

---

# 21. Calendar連携

APIは直接操作しない。

```text
Calendar Job
```

が実施。

---

出力。

```text
calendar_master
```

---

# 22. Poem連携

APIは直接操作しない。

```text
Poem Job
```

が実施。

---

出力。

```text
poem_cache
```

---

# 23. 将来拡張

候補。

```text
Bulk Upload

Device Registration

Firmware Version Check

Health Report
```

状態。

```text
PROPOSED
```

---

# 24. STATUS

| 項目                       | 状態        |
| ------------------------ | --------- |
| GET API                  | FINALIZED |
| POST API                 | FINALIZED |
| Observation Payload v1.0 | FINALIZED |
| Payload 28項目             | FINALIZED |
| SecurityManager          | FINALIZED |
| Validation Rules         | FINALIZED |
| Log Integration          | FINALIZED |
| Config Integration       | FINALIZED |

---

# 25. CHANGE LOG

| 日付         | 内容                                 |
| ---------- | ---------------------------------- |
| 2026-06-19 | Observation Payload 28項目反映         |
| 2026-06-19 | message_id追加                       |
| 2026-06-19 | retry_count追加                      |
| 2026-06-19 | boot_count追加                       |
| 2026-06-19 | wakeup_reason追加                    |
| 2026-06-19 | timestamp_validity追加               |
| 2026-06-19 | system_config反映                    |
| 2026-06-19 | SecurityManager仕様整理                |
| 2026-06-19 | 15_GAS_IMPLEMENTATION_GUIDE.mdと整合化 |
