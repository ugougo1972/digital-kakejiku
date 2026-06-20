# 04_STATE_MACHINE.md

# digital-kakejiku State Machine Specification

最終更新: 2026-06-20  
版: vNext 1.0

---

# 1. 目的

digital-kakejiku における状態遷移を定義する。

対象。

- CalendarSubsystem
- PoemSubsystem
- JobScheduler

# 2. 基本方針

- 実行状況可視化
- Retry制御
- 障害検知
- 依存関係管理
- Spreadsheet上の状態追跡

# 3. Calendar状態一覧

| Status | 説明 |
| --- | --- |
| SCHEDULED | 実行待ち |
| CALENDAR_RUNNING | 実行中 |
| CALENDAR_RETRY | Retry待ち |
| CALENDAR_READY | 完了 |
| CALENDAR_ERROR | 失敗 |


# 4. Calendar遷移

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
CALENDAR_RETRY
↓
CALENDAR_RUNNING
↓
CALENDAR_RETRY
↓
CALENDAR_RUNNING
↓
CALENDAR_ERROR
```

# 5. Poem状態一覧

| Status | 説明 |
| --- | --- |
| CALENDAR_PENDING | Calendar待ち |
| POEM_RUNNING | 実行中 |
| POEM_RETRY | Retry待ち |
| POEM_READY | 完了 |
| POEM_ERROR | 失敗 |
| POEM_SKIPPED | 実行禁止 |


# 6. Poem遷移

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
POEM_RETRY
↓
POEM_RUNNING
↓
POEM_RETRY
↓
POEM_RUNNING
↓
POEM_ERROR
```

# 7. CALENDAR_PENDING

発生条件。

- calendar_master.status = SCHEDULED
- calendar_master.status = CALENDAR_RUNNING
- calendar_master.status = CALENDAR_RETRY

動作。

- Poem生成禁止
- Gemini API呼出禁止
- Poem実行保留
- poem_cache.generation_status に CALENDAR_PENDING を記録

# 8. Calendar → Poem連携

実行許可。

```text
CALENDAR_READY
↓
POEM_RUNNING
```

保留。

```text
SCHEDULED
CALENDAR_RUNNING
CALENDAR_RETRY
↓
CALENDAR_PENDING
```

実行禁止。

```text
CALENDAR_ERROR
↓
POEM_SKIPPED
```

# 9. Retry制御

- 30分間隔
- 最大3回
- 設定元はsystem_config
- calendar_retry_max
- poem_retry_max

# 10. JobScheduler

```text
Calendar Job
02:00 Main
02:30 Retry1
03:00 Retry2
03:30 Retry3

Poem Job
02:10 Main
02:40 Retry1
03:10 Retry2
03:40 Retry3
```

# 11. Spreadsheet反映

calendar_master。

- status
- retry_count
- error_code
- first_attempt_at
- last_attempt_at
- updated_at

poem_cache。

- generation_status
- retry_count
- error_code
- first_attempt_at
- last_attempt_at
- error_message

# 12. STATUS

| 項目 | 状態 |
| --- | --- |
| Calendar State Machine | FINALIZED |
| Poem State Machine | FINALIZED |
| CALENDAR_PENDING | FINALIZED |
| Retry制御 | FINALIZED |
| Calendar依存関係 | FINALIZED |
| JobScheduler状態 | CONFIRMED |


# 13. CHANGE LOG

| 日付 | 内容 |
| --- | --- |
| 2026-06-20 | vNext 1.0として全面再生成 |
| 2026-06-20 | CALENDAR_PENDING完全状態遷移を統一 |
| 2026-06-20 | 30分間隔・最大3回Retryを統一 |
