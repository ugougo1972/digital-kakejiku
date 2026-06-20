# digital-kakejiku State Machine Specification

最終更新: 2026-06-20  
文書版: vNext 1.1 review reflected

---

# 1. 目的

本書は状態遷移の基準源である。

---

# 2. Calendar状態

| Status | 説明 |
|---|---|
| SCHEDULED | 実行待ち |
| CALENDAR_RUNNING | 実行中 |
| CALENDAR_RETRY | Retry待ち |
| CALENDAR_READY | 完了 |
| CALENDAR_ERROR | 失敗 |

---

# 3. Calendar遷移

正常。

```text
SCHEDULED
 ↓
CALENDAR_RUNNING
 ↓
CALENDAR_READY
```

Retry。

```text
CALENDAR_RUNNING
 ↓
CALENDAR_RETRY
 ↓
CALENDAR_RUNNING
```

異常。

```text
CALENDAR_RUNNING
 ↓
CALENDAR_RETRY
 ↓
CALENDAR_RUNNING
 ↓
CALENDAR_ERROR
```

Retry上限。

```text
calendar_retry_max = 3
```

---

# 4. Poem状態

| Status | 説明 |
|---|---|
| CALENDAR_PENDING | Calendar待ち |
| POEM_RUNNING | 実行中 |
| POEM_RETRY | Retry待ち |
| POEM_READY | 完了 |
| POEM_ERROR | 失敗 |
| POEM_SKIPPED | 実行禁止 |

---

# 5. Poem遷移

正常。

```text
POEM_RUNNING
 ↓
POEM_READY
```

Retry。

```text
POEM_RUNNING
 ↓
POEM_RETRY
 ↓
POEM_RUNNING
```

異常。

```text
POEM_RUNNING
 ↓
POEM_RETRY
 ↓
POEM_RUNNING
 ↓
POEM_ERROR
```

Retry上限。

```text
poem_retry_max = 3
```

---

# 6. CALENDAR_PENDINGライフサイクル

## 進入条件

Poem Job実行時に calendar_master.status が以下の場合。

- SCHEDULED
- CALENDAR_RUNNING
- CALENDAR_RETRY

## 継続条件

Calendarが復旧するまで継続する。日数による自動破棄は行わない。

## 終了条件

```text
calendar_master.status = CALENDAR_READY
```

になった時点で、次回Poem Jobまたは手動Poem再生成により POEM_RUNNING へ進む。

## 禁止条件

```text
calendar_master.status = CALENDAR_ERROR
```

の場合、POEM_SKIPPED とする。

## 記録

CALENDAR_PENDING発生時は error_log または system_log に記録する。重大障害ではなく依存待機として扱う。

---

# 7. 日付境界の処理

RTC異常時でも Calendar / Poem 判定は GAS側 Asia/Tokyo 日付を優先する。

```text
ESP32 timestamp_validity = RTC_INVALID
 ↓
GAS server_timestamp を保存
 ↓
Calendar / Poem の対象日付は GAS日付
```

状態。

```text
CONFIRMED
```

---

# 8. JobScheduler状態

```text
WAITING
 ↓
RUNNING
 ↓
SUCCESS
```

Retry。

```text
RUNNING
 ↓
FAILED
 ↓
RETRY_WAIT
 ↓
RUNNING
```

Error。

```text
RUNNING
 ↓
FAILED
 ↓
ERROR
```

---

# 9. STATUS

| 項目 | 状態 |
|---|---|
| Calendar状態 | FINALIZED |
| Poem状態 | FINALIZED |
| CALENDAR_PENDING終了条件 | FINALIZED |
| 日付境界処理 | CONFIRMED |
| JobScheduler状態 | CONFIRMED |

---

# 10. CHANGE LOG

| 日付 | 内容 |
|---|---|
| 2026-06-20 | CALENDAR_PENDING終了条件を明確化 |
| 2026-06-20 | RTC異常時の日付境界処理を追加 |
