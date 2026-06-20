# digital-kakejiku GAS API Specification

最終更新: 2026-06-20  
文書版: vNext 1.1 review reflected

---

# 1. 目的

本書は外部公開GAS APIの基準源である。

---

# 2. API構成

公開API。

- GET /
- POST /

Calendar / Poem / JobScheduler は原則内部ジョブであり、一般公開API対象外とする。保守操作は MaintenanceHandler 経由で認証後に実行する。

---

# 3. GET /

用途。

- Alive Check
- Health Check

応答。

```json
{
  "status": "ok",
  "service": "digital-kakejiku"
}
```

---

# 4. POST /

用途。

- 観測データ送信

認証。

```text
device_id + secret
```

---

# 5. Observation Payload v1.0

必須項目。

- device_id
- secret
- timestamp
- message_id
- retry_count
- boot_count
- wakeup_reason
- timestamp_validity
- schema_version

Optional項目。

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

---

# 6. Response

Success。

```json
{
  "status": "success",
  "message_id": "msg-000001"
}
```

Validation Error。

```json
{
  "status": "error",
  "error_code": "SCHEMA_ERROR"
}
```

Authentication Error。

```json
{
  "status": "error",
  "error_code": "AUTH_ERROR"
}
```

---

# 7. 将来拡張

- Bulk Upload
- Device Registration
- Firmware Version Check
- Health Report
- HMAC認証

---

# 8. STATUS

| 項目 | 状態 |
|---|---|
| GET API | FINALIZED |
| POST API | FINALIZED |
| Observation Payload v1.0 | FINALIZED |
| Maintenance API | PROPOSED |
| HMAC認証 | PROPOSED |

---

# 9. CHANGE LOG

| 日付 | 内容 |
|---|---|
| 2026-06-20 | 保守操作APIをMaintenanceHandler扱いへ整理 |
