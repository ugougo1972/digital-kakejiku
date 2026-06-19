# 04_STATE_MACHINE.md

# digital-kakejiku State Machine Specification

最終更新: 2026-06-19

---

# 1. 目的

本ドキュメントは digital-kakejiku における状態遷移を定義する。

対象。

```text
CalendarSubsystem

PoemSubsystem

JobScheduler
```

---

# 2. 基本方針

状態管理は以下を目的とする。

```text
実行状況可視化

Retry制御

障害検知

依存関係管理
```

---

# 3. CalendarSubsystem

## 状態一覧

| Status           | 説明      |
| ---------------- | ------- |
| SCHEDULED        | 実行待ち    |
| CALENDAR_RUNNING | 実行中     |
| CALENDAR_RETRY   | Retry待ち |
| CALENDAR_READY   | 完了      |
| CALENDAR_ERROR   | 失敗      |

状態。

```text
FINALIZED
```

---

# 4. Calendar正常遷移

```text
SCHEDULED
      ↓
CALENDAR_RUNNING
      ↓
CALENDAR_READY
```

---

# 5. Calendar Retry遷移

```text
SCHEDULED
      ↓
CALENDAR_RUNNING
      ↓
CALENDAR_RETRY
      ↓
CALENDAR_RUNNING
      ↓
CALENDAR_READY
```

---

# 6. Calendar異常遷移

```text
SCHEDULED
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

---

# 7. Calendar Retry制御

取得元。

```text
system_config
```

設定。

```text
calendar_retry_max
```

初期値。

```text
3
```

状態。

```text
FINALIZED
```

---

# 8. PoemSubsystem

## 状態一覧

| Status           | 説明         |
| ---------------- | ---------- |
| CALENDAR_PENDING | Calendar待ち |
| POEM_RUNNING     | 実行中        |
| POEM_RETRY       | Retry待ち    |
| POEM_READY       | 完了         |
| POEM_ERROR       | 失敗         |
| POEM_SKIPPED     | 実行禁止       |

状態。

```text
FINALIZED
```

---

# 9. Poem正常遷移

```text
POEM_RUNNING
      ↓
POEM_READY
```

---

# 10. Poem Retry遷移

```text
POEM_RUNNING
      ↓
POEM_RETRY
      ↓
POEM_RUNNING
      ↓
POEM_READY
```

---

# 11. Poem異常遷移

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
POEM_ERROR
```

---

# 12. Poem Retry制御

取得元。

```text
system_config
```

設定。

```text
poem_retry_max
```

初期値。

```text
3
```

状態。

```text
FINALIZED
```

---

# 13. Calendar依存関係

```text
Calendar Job
      ↓
calendar_master
      ↓
Poem Job
```

状態。

```text
FINALIZED
```

---

# 14. CALENDAR_PENDING

## 発生条件

以下の場合。

```text
calendar_master.status
=
SCHEDULED
```

または

```text
calendar_master.status
=
CALENDAR_RUNNING
```

または

```text
calendar_master.status
=
CALENDAR_RETRY
```

---

## 動作

```text
Poem生成禁止

Poem実行保留
```

---

## 状態

```text
CALENDAR_PENDING
```

状態。

```text
FINALIZED
```

---

# 15. CALENDAR_PENDING完全状態遷移

## Case-1

Calendar未開始

```text
SCHEDULED
      ↓
CALENDAR_PENDING
      ↓
CALENDAR_READY
      ↓
POEM_RUNNING
```

---

## Case-2

Calendar実行中

```text
CALENDAR_RUNNING
      ↓
CALENDAR_PENDING
      ↓
CALENDAR_READY
      ↓
POEM_RUNNING
```

---

## Case-3

Calendar Retry中

```text
CALENDAR_RETRY
      ↓
CALENDAR_PENDING
      ↓
CALENDAR_READY
      ↓
POEM_RUNNING
```

---

## Case-4

Calendar失敗

```text
CALENDAR_ERROR
      ↓
POEM_SKIPPED
```

状態。

```text
FINALIZED
```

---

# 16. Calendar → Poem連携

## 実行許可

```text
CALENDAR_READY
```

↓

```text
POEM_RUNNING
```

---

## 保留

```text
SCHEDULED

CALENDAR_RUNNING

CALENDAR_RETRY
```

↓

```text
CALENDAR_PENDING
```

---

## 実行禁止

```text
CALENDAR_ERROR
```

↓

```text
POEM_SKIPPED
```

状態。

```text
FINALIZED
```

---

# 17. JobScheduler

## Calendar Job

```text
02:00 Main

02:30 Retry1

03:00 Retry2

03:30 Retry3
```

---

## Poem Job

```text
02:10 Main

02:40 Retry1

03:10 Retry2

03:40 Retry3
```

状態。

```text
FINALIZED
```

---

# 18. JobScheduler状態

## Calendar Job

```text
WAITING
      ↓
RUNNING
      ↓
SUCCESS
```

---

## Calendar Retry

```text
RUNNING
      ↓
FAILED
      ↓
RETRY_WAIT
      ↓
RUNNING
```

---

## Calendar Error

```text
RUNNING
      ↓
FAILED
      ↓
ERROR
```

---

## Poem Job

```text
WAITING
      ↓
RUNNING
      ↓
SUCCESS
```

---

## Poem Retry

```text
RUNNING
      ↓
FAILED
      ↓
RETRY_WAIT
      ↓
RUNNING
```

---

## Poem Error

```text
RUNNING
      ↓
FAILED
      ↓
ERROR
```

---

# 19. エラー状態

## Calendar

```text
CALENDAR_ERROR
```

記録先。

```text
error_log
```

---

## Poem

```text
POEM_ERROR
```

記録先。

```text
error_log
```

---

## Config

```text
CONFIG_ERROR
```

記録先。

```text
error_log
```

---

## Security

```text
SECURITY_ERROR
```

記録先。

```text
error_log
```

---

# 20. Spreadsheet反映

## calendar_master

状態保存。

```text
status

retry_count

error_code
```

---

## poem_cache

状態保存。

```text
generation_status

retry_count

error_code
```

状態。

```text
FINALIZED
```

---

# 21. テスト対象

対象。

```text
Calendar状態遷移

Poem状態遷移

CALENDAR_PENDING

Retry制御

Error制御
```

参照。

```text
16_TESTING_STRATEGY.md
```

---

# 22. STATUS

| 項目                     | 状態        |
| ---------------------- | --------- |
| Calendar State Machine | FINALIZED |
| Poem State Machine     | FINALIZED |
| CALENDAR_PENDING       | FINALIZED |
| Retry制御                | FINALIZED |
| Calendar依存関係           | FINALIZED |
| JobScheduler状態         | CONFIRMED |

---

# 23. CHANGE LOG

| 日付         | 内容                                 |
| ---------- | ---------------------------------- |
| 2026-06-19 | CALENDAR_PENDING完全状態遷移追加           |
| 2026-06-19 | Calendar Retry状態追加                 |
| 2026-06-19 | Poem Retry状態追加                     |
| 2026-06-19 | system_config反映                    |
| 2026-06-19 | JobScheduler状態追加                   |
| 2026-06-19 | 15_GAS_IMPLEMENTATION_GUIDE.mdと整合化 |
| 2026-06-19 | 16_TESTING_STRATEGY.mdと整合化         |
