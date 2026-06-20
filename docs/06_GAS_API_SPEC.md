# 06_GAS_API_SPEC.md

# digital-kakejiku GAS API Specification

最終更新: 2026-06-20  
版: vNext 1.0

---

# 1. 目的

GAS API仕様を定義する。

対象。

- ApiGateway
- SecurityManager
- ESP32 Client

# 2. API構成

公開API。

```text
GET /
POST /
```

状態。

```text
FINALIZED
```

# 3. GET API

用途。

- Alive Check
- Health Check

Response。

```json
{
  "status": "ok",
  "service": "digital-kakejiku"
}
```

# 4. POST API

用途。

- 観測データ送信

Request。

```http
POST /
Content-Type: application/json
```

# 5. Observation Payload

Payload Version。

```text
1.0
```

項目数。

```text
28
```

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

Optional項目はセンサー未搭載時NULL許可。

# 6. 許容値

wakeup_reason。

```text
BOOT
TIMER
MANUAL
WATCHDOG
POWER_RECOVERY
```

timestamp_validity。

```text
RTC_VALID
RTC_INVALID
RTC_RECOVERED
```

power_mode。

```text
USB
BATTERY
```

# 7. SecurityManager

認証方式。

```text
device_id
+
secret
```

処理順序。

```text
1 secret確認
2 device_id確認
3 schema確認
4 保存
```

# 8. 保存処理

保存先。

```text
observation_log
```

保存成功。

- event_log
- OBSERVATION_ACCEPTED

保存失敗。

- error_log
- OBSERVATION_REJECTED

# 9. Response

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

# 10. API対象外

通常の観測POST API対象外。

- CalendarSubsystem
- PoemSubsystem
- JobScheduler

ただし、背面保守UIからの Calendar再生成 / Poem再生成 は、Phase3以降の保守操作としてGAS側関数または保守用エンドポイントで扱う。実装方式は `15_GAS_IMPLEMENTATION_GUIDE.md` を正とする。

# 11. STATUS

| 項目 | 状態 |
| --- | --- |
| GET API | FINALIZED |
| POST API | FINALIZED |
| Observation Payload v1.0 | FINALIZED |
| Payload 28項目 | FINALIZED |
| SecurityManager | FINALIZED |
| Validation Rules | FINALIZED |
| Log Integration | FINALIZED |
| Maintenance Request | PROPOSED |


# 12. CHANGE LOG

| 日付 | 内容 |
| --- | --- |
| 2026-06-20 | vNext 1.0として全面再生成 |
| 2026-06-20 | 背面保守UI操作は通常POST API対象外として整理 |
