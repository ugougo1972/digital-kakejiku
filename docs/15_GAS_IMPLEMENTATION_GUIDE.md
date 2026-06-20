# 15_GAS_IMPLEMENTATION_GUIDE.md

# digital-kakejiku GAS実装ガイド

最終更新: 2026-06-20  
版: vNext 1.0

---

# 1. 目的

GAS実装方針を定義する。

対象。

- ApiGateway
- SecurityManager
- ConfigManager
- LogSubsystem
- CalendarSubsystem
- PoemSubsystem
- JobScheduler
- Maintenance Handler

# 2. 基本方針

GASは以下を担当する。

- API受信
- Payload検証
- Spreadsheet保存
- Calendar生成
- Poem生成
- Config管理
- 障害記録
- 定期Job実行
- 保守要求処理

ESP32は観測端末とする。

# 3. システム構成

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

CalendarSubsystem
↓
calendar_master

PoemSubsystem
↓
poem_cache
```

# 4. モジュール構成

- ApiGateway
- SecurityManager
- ConfigManager
- LogSubsystem
- CalendarSubsystem
- PoemSubsystem
- JobScheduler
- Maintenance Handler

# 5. ApiGateway

責務。

- doGet
- doPost
- API入口

公開関数。

- doGet()
- doPost()

# 6. SecurityManager

責務。

- 認証
- 入力検証

関数。

- validateSecret()
- validateDeviceId()
- validatePayloadSchema()

認証方式。

```text
device_id
+
secret
```

# 7. ConfigManager

対象。

- system_config
- source_config
- Script Properties

関数。

- getSystemConfig()
- getSourceConfig()
- getProperty()
- reloadConfig()

source_config用途。

- Calendar情報源URL管理専用

system_config用途。

- Job設定
- Prompt Version
- Gemini設定
- 表示設定

# 8. LogSubsystem

関数。

- appendObservationLog()
- appendEventLog()
- appendErrorLog()
- appendSystemLog()

# 9. CalendarSubsystem

関数。

- runCalendarJob()
- generateCalendarForYear()
- regenerateCalendarByYear()
- regenerateCalendarByRange()
- updateCalendarStatus()

入力。

- source_config
- solar_term_master
- season_dictionary

出力。

- calendar_master

七十二候。

- 名称: season_dictionary
- 説明: season_dictionary
- 解説参照URL: source_config

# 10. Calendar状態管理

```text
SCHEDULED
CALENDAR_RUNNING
CALENDAR_RETRY
CALENDAR_READY
CALENDAR_ERROR
```

Retry。

- 最大3回
- 30分間隔
- 設定元system_config

# 11. PoemSubsystem

関数。

- runPoemJob()
- checkCalendarReadiness()
- buildPrompt()
- callGemini()
- savePoemCache()
- updatePoemStatus()

入力。

- calendar_master
- observation_log
- system_config
- Script Properties

出力。

- poem_cache

# 12. Gemini利用方針

- gemini_model: system_config
- gemini_temperature: system_config
- prompt_version: system_config
- GEMINI_API_KEY: Script Properties
- temperature初期値: 0.5
- prompt_version保存先: poem_cache

# 13. Poem生成仕様

- 自由詩
- 客観描写
- 80～120文字
- 目標100文字
- タイトルはGemini自由生成

禁止。

- 二十四節気名称そのまま
- 七十二候名称そのまま
- 祝日名称そのまま
- 観測値数値直接出力

# 14. Poem状態管理

```text
CALENDAR_PENDING
POEM_RUNNING
POEM_RETRY
POEM_READY
POEM_ERROR
POEM_SKIPPED
```

Retry。

- 最大3回
- 30分間隔
- 設定元system_config

# 15. Calendar依存

実行許可。

```text
CALENDAR_READY
```

保留。

```text
SCHEDULED
CALENDAR_RUNNING
CALENDAR_RETRY
↓
CALENDAR_PENDING
```

禁止。

```text
CALENDAR_ERROR
↓
POEM_SKIPPED
```

# 16. JobScheduler

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

# 17. Maintenance Handler

目的。

- 背面保守UIからの保守要求をGAS側で処理する。

許可。

- Calendar再生成
- Calendar範囲再生成
- Poem再生成
- 状態確認
- エラー確認

禁止。

- source_config編集
- system_config編集
- URL編集
- Prompt編集
- Geminiモデル変更
- temperature変更
- API Key編集

# 18. エラー処理

Calendar。

- CALENDAR_ERROR
- error_log記録

Poem。

- POEM_ERROR
- error_log記録

Config。

- CONFIG_ERROR

Security。

- SECURITY_ERROR

代替生成は禁止。

# 19. Spreadsheetアクセス方針

読み取り専用。

- source_config
- system_config
- solar_term_master
- season_dictionary

読み書き。

- calendar_master
- poem_cache

追記専用。

- observation_log
- event_log
- error_log
- system_log

# 20. 実装順序

```text
1 Spreadsheet初期化
2 ConfigManager
3 SecurityManager
4 LogSubsystem
5 ApiGateway
6 CalendarSubsystem
7 PoemSubsystem
8 JobScheduler
9 Maintenance Handler
10 結合試験
```

# 21. STATUS

| 項目 | 状態 |
| --- | --- |
| ApiGateway | CONFIRMED |
| SecurityManager | CONFIRMED |
| ConfigManager | CONFIRMED |
| LogSubsystem | CONFIRMED |
| CalendarSubsystem | FINALIZED |
| PoemSubsystem | FINALIZED |
| Calendar Status管理 | FINALIZED |
| Poem Status管理 | FINALIZED |
| Gemini設定管理 | FINALIZED |
| Prompt Version管理 | FINALIZED |
| system_config利用 | FINALIZED |
| Maintenance Handler | FINALIZED |
| 実装順序 | FINALIZED |


# 22. CHANGE LOG

| 日付 | 内容 |
| --- | --- |
| 2026-06-20 | vNext 1.0として全面再生成 |
| 2026-06-20 | Maintenance Handlerを追加 |
| 2026-06-20 | 背面保守UIからの再生成要求を反映 |
| 2026-06-20 | Prompt Version管理とpoem_cache保存を反映 |
