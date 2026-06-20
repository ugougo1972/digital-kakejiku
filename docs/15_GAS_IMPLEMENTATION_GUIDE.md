# digital-kakejiku GAS実装ガイド

最終更新: 2026-06-20  
文書版: vNext 1.3 phase1 ready delta

---

# 1. 目的

本書はGAS実装の基準源である。

対象。

- ApiGateway
- SecurityManager
- ConfigManager
- LogSubsystem
- CalendarSubsystem
- PoemSubsystem
- JobScheduler
- MaintenanceHandler

Retry詳細は `18_GAS_RETRY_STRATEGY.md` を基準源とする。

Gemini Prompt詳細は `19_GEMINI_PROMPT_SPECIFICATION.md` を基準源とする。

---

# 2. モジュール構成

```text
ApiGateway
SecurityManager
ConfigManager
LogSubsystem
CalendarSubsystem
PoemSubsystem
JobScheduler
MaintenanceHandler
```

---

# 3. 実装順序

1. Spreadsheet初期化
2. Script Properties設定
3. ConfigManager
4. SecurityManager
5. LogSubsystem
6. ApiGateway
7. CalendarSubsystem
8. PoemSubsystem
9. JobScheduler
10. MaintenanceHandler
11. 結合試験

---

# 4. ConfigManager

対象。

- source_config
- system_config
- Script Properties

関数候補。

```javascript
function getSystemConfig(key) {}
function getSourceConfig(type) {}
function getProperty(key) {}
function reloadConfig() {}
```

制約。

- API_SECRET は Script Properties から取得する
- GEMINI_API_KEY は Script Properties から取得する
- source_config / system_config に機密情報を保存しない

---

# 5. SecurityManager

認証方式。

```text
device_id + secret
```

関数候補。

```javascript
function validateSecret(deviceId, secret) {}
function validateDeviceId(deviceId) {}
function validatePayloadSchema(payload) {}
```

認証失敗時。

- AUTH_ERROR
- INVALID_DEVICE
- SCHEMA_ERROR

4xx系認証エラーはRetry対象外とする。

詳細は `18_GAS_RETRY_STRATEGY.md` を参照する。

---

# 6. LogSubsystem

関数候補。

```javascript
function appendObservationLog(payload) {}
function appendEventLog(event) {}
function appendErrorLog(error) {}
function appendSystemLog(message) {}
```

ログ出力禁止。

- API_SECRET
- GEMINI_API_KEY
- Wi-Fi Password
- OAuth Token

---

# 7. ApiGateway

公開関数。

```javascript
function doGet(e) {}
function doPost(e) {}
```

doGet用途。

- Alive Check
- Health Check

doPost用途。

- Observation Payload受信
- 認証
- スキーマ検証
- observation_log保存

doPost処理順序。

```text
1. JSON parse
2. SecurityManager.validateDeviceId
3. SecurityManager.validateSecret
4. SecurityManager.validatePayloadSchema
5. LogSubsystem.appendObservationLog
6. LogSubsystem.appendEventLog
7. JSON response
```

doPost内では外部APIの再呼び出しRetryは行わない。

Observation Payload受信の再送・欠損補完はESP32側の設計範囲とし、GAS側では受信したPayloadを検証・保存する。

---

# 8. CalendarSubsystem

責務。

- Calendar生成
- Calendar再生成
- calendar_master更新
- Calendar状態管理

関数候補。

```javascript
function runCalendarJob() {}
function generateCalendarForYear(year) {}
function regenerateCalendarByYear(year) {}
function regenerateCalendarByRange(startDate, endDate) {}
function updateCalendarStatus(date, status, errorCode) {}
```

入力。

- source_config
- solar_term_master
- season_dictionary

出力。

- calendar_master

七十二候名称。

```text
season_dictionary
```

七十二候解説。

```text
source_config管理URL
```

AI利用。

```text
禁止
```

---

# 9. Calendar Job実装フロー

```text
Calendar Job
  ↓
対象日付決定
  ↓
calendar_master.status = CALENDAR_RUNNING
  ↓
source_config / master 読込
  ↓
暦情報生成
  ↓
calendar_master保存
  ↓
CALENDAR_READY
```

一時的エラー。

```text
CALENDAR_RETRY
↓
次回Retry Triggerで再実行
```

永続的エラー。

```text
CALENDAR_ERROR
↓
error_log記録
↓
終了
```

Retry Trigger。

| 実行 | 時刻 |
|---|---|
| Main | 02:00 |
| Retry1 | 02:30 |
| Retry2 | 03:00 |
| Retry3 | 03:30 |

---

# 10. PoemSubsystem

責務。

- Calendar状態確認
- Prompt入力生成
- Gemini API呼出
- poem_cache保存
- Poem状態管理

関数候補。

```javascript
function runPoemJob() {}
function checkCalendarReadiness(date) {}
function buildPromptInput(date) {}
function callGemini(prompt) {}
function savePoemCache(poem) {}
function updatePoemStatus(date, status, errorCode) {}
```

---

# 11. Poem Job実装フロー

```text
Poem Job
  ↓
calendar_master.status確認
  ├─ CALENDAR_READY → Poem生成
  ├─ SCHEDULED / CALENDAR_RUNNING / CALENDAR_RETRY → CALENDAR_PENDING
  └─ CALENDAR_ERROR → POEM_SKIPPED
```

Poem生成。

```text
Prompt入力生成
↓
Gemini API呼出
↓
JSON検証
↓
poem_cache保存
↓
POEM_READY
```

一時的エラー。

```text
POEM_RETRY
↓
次回Retry Triggerで再実行
```

永続的エラー。

```text
POEM_ERROR
↓
error_log記録
↓
終了
```

Retry Trigger。

| 実行 | 時刻 |
|---|---|
| Main | 02:10 |
| Retry1 | 02:40 |
| Retry2 | 03:10 |
| Retry3 | 03:40 |

---

# 12. Gemini Prompt

詳細仕様は `19_GEMINI_PROMPT_SPECIFICATION.md` を基準源とする。

実装上の必須事項。

- prompt_version は system_config から取得する
- gemini_model は system_config から取得する
- gemini_temperature は system_config から取得する
- GEMINI_API_KEY は Script Properties から取得する
- 出力はJSONとして検証する
- title / body の両方を必須とする
- body は80～120文字を目標範囲とする
- 数値直接出力は禁止する
- 暦名直接使用は禁止する

---

# 13. Retry Strategy

詳細仕様は `18_GAS_RETRY_STRATEGY.md` を基準源とする。

実装方針。

- TEMPORARY はRetry対象
- PERMANENT はRetryしない
- UNKNOWN は限定Retry
- Calendar / Poem Jobは固定Trigger時刻でRetryする
- Gemini API呼出内では短時間Retryを許可する
- 4xx認証・設定エラーはRetryしない

---

# 14. JobScheduler

GAS Triggerとして以下を設定する。

Calendar。

- 02:00 Main
- 02:30 Retry1
- 03:00 Retry2
- 03:30 Retry3

Poem。

- 02:10 Main
- 02:40 Retry1
- 03:10 Retry2
- 03:40 Retry3

Trigger設定関数候補。

```javascript
function setupTriggers() {}
function clearTriggers() {}
function listTriggers() {}
```

---

# 15. MaintenanceHandler

許可。

- Calendar指定年再生成
- Calendar指定期間再生成
- Poem指定日再生成
- Poem指定期間再生成
- Status確認

禁止。

- source_config直接編集
- system_config直接編集
- API Key編集
- Prompt本文編集

関数候補。

```javascript
function regenerateCalendarByYear(year) {}
function regenerateCalendarByRange(startDate, endDate) {}
function regeneratePoemByDate(date) {}
function regeneratePoemByRange(startDate, endDate) {}
function getSystemStatus() {}
```

---

# 16. エラー処理

記録先。

- error_log
- system_log

主なエラー。

- AUTH_ERROR
- INVALID_DEVICE
- SCHEMA_ERROR
- CONFIG_ERROR
- CALENDAR_ERROR
- CALENDAR_PENDING
- POEM_ERROR
- NETWORK_ERROR
- GEMINI_RATE_LIMIT
- GEMINI_SERVER_ERROR

詳細分類は `18_GAS_RETRY_STRATEGY.md` を参照する。

---

# 17. 実装開始前チェック

- [ ] Script Properties に API_SECRET を設定
- [ ] Script Properties に GEMINI_API_KEY を設定
- [ ] system_config 初期値を設定
- [ ] source_config 初期値を設定
- [ ] calendar_master 列構成を作成
- [ ] poem_cache 列構成を作成
- [ ] 18_GAS_RETRY_STRATEGY.md を確認
- [ ] 19_GEMINI_PROMPT_SPECIFICATION.md を確認

---

# 18. STATUS

| 項目 | 状態 |
|---|---|
| ApiGateway | CONFIRMED |
| SecurityManager | CONFIRMED |
| ConfigManager | CONFIRMED |
| LogSubsystem | CONFIRMED |
| CalendarSubsystem | FINALIZED |
| PoemSubsystem | FINALIZED |
| JobScheduler | FINALIZED |
| MaintenanceHandler | CONFIRMED |
| Retry Strategy | FINALIZED |
| Gemini Prompt Specification | FINALIZED |
| 実装順序 | FINALIZED |
| Phase 1開始可否 | GO |

---

# 19. CHANGE LOG

| 日付 | 内容 |
|---|---|
| 2026-06-20 | vNext 1.3として18/19への参照を追加 |
| 2026-06-20 | Calendar/Poem Job実装フローを整理 |
| 2026-06-20 | Retry Strategyを外部基準源化 |
| 2026-06-20 | Gemini Prompt Specificationを外部基準源化 |
