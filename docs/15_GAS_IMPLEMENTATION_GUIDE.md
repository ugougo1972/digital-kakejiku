# 15_GAS_IMPLEMENTATION_GUIDE.md

# digital-kakejiku GAS実装ガイド

最終更新: 2026-06-19

---

# 1. 目的

本ドキュメントは digital-kakejiku における GAS 実装方針を定義する。

対象。

```text
ApiGateway
SecurityManager
ConfigManager
LogSubsystem
CalendarSubsystem
PoemSubsystem
JobScheduler
```

本書は GAS 実装時の正式な実装ガイドとする。

---

# 2. 基本方針

GASは以下を担当する。

* API受信
* Payload検証
* Spreadsheet保存
* Calendar生成
* Poem生成
* Config管理
* 障害記録

ESP32は観測端末とする。

---

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

---

# 4. モジュール構成

```text
ApiGateway

SecurityManager

ConfigManager

LogSubsystem

CalendarSubsystem

PoemSubsystem

JobScheduler
```

---

# 5. ApiGateway

## 責務

* doGet
* doPost
* API入口

---

## 公開関数

```javascript
doGet()

doPost()
```

---

## 内部関数

```javascript
handleObservationPost()

buildResponse()
```

---

## doGet

用途。

```text
Alive Check
Health Check
```

応答。

```json
{
  "status":"ok"
}
```

---

## doPost

処理順序。

```text
1 Security確認

2 Payload検証

3 observation_log保存

4 event_log記録

5 応答返却
```

---

# 6. SecurityManager

## 責務

認証。

入力検証。

---

## 関数

```javascript
validateSecret()

validateDeviceId()

validatePayloadSchema()
```

---

## 認証方式

```text
device_id
+
secret
```

---

## エラー

```text
AUTH_ERROR

INVALID_DEVICE

INVALID_PAYLOAD

SCHEMA_ERROR
```

---

# 7. ConfigManager

## 責務

設定取得。

---

## 対象

```text
system_config

source_config

Script Properties
```

---

## 関数

```javascript
getSystemConfig()

getSourceConfig()

getProperty()

reloadConfig()
```

---

## source_config

用途。

```text
Calendar情報源
```

---

## system_config

用途。

```text
Job設定

Prompt設定

Gemini設定

表示設定
```

---

## Script Properties

用途。

```text
API_SECRET

GEMINI_API_KEY

SYSTEM_VERSION
```

---

# 8. LogSubsystem

## 責務

ログ管理。

---

## 関数

```javascript
appendObservationLog()

appendEventLog()

appendErrorLog()

appendSystemLog()
```

---

## 保存先

```text
observation_log

event_log

error_log

system_log
```

---

# 9. CalendarSubsystem

## 責務

暦生成。

---

## 関数

```javascript
runCalendarJob()

generateCalendarForYear()

regenerateCalendarByYear()

regenerateCalendarByRange()

updateCalendarStatus()
```

---

## 入力

```text
source_config

solar_term_master

season_dictionary
```

---

## 出力

```text
calendar_master
```

---

## 保持期間

```text
過去5年

当年

翌年
```

---

## 年次生成

```text
毎年12月1日
```

---

## 手動再生成

許可。

```text
指定年

指定期間
```

---

# 10. Calendar状態管理

## status

```text
SCHEDULED

CALENDAR_RUNNING

CALENDAR_RETRY

CALENDAR_READY

CALENDAR_ERROR
```

---

## Retry

最大。

```text
3回
```

設定元。

```text
system_config
```

---

# 11. PoemSubsystem

## 責務

今日の詩生成。

---

## 関数

```javascript
runPoemJob()

checkCalendarReadiness()

buildPrompt()

callGemini()

savePoemCache()

updatePoemStatus()
```

---

## 入力

```text
calendar_master

observation_log
```

---

## 出力

```text
poem_cache
```

---

# 12. Gemini利用方針

## モデル

取得元。

```text
system_config
```

例。

```text
gemini_model
```

---

## Temperature

取得元。

```text
system_config
```

初期値。

```text
0.5
```

状態。

FINALIZED

---

## Prompt Version

取得元。

```text
system_config
```

例。

```text
prompt_version
```

---

## API Key

取得元。

```text
Script Properties
```

---

# 13. Poem生成仕様

## 立場

```text
観測
+
歳時記
```

状態。

FINALIZED

---

## 詩種

```text
自由詩
```

---

## 視点

```text
客観描写
```

---

## 長さ

```text
80〜120文字
```

目標。

```text
100文字
```

---

## タイトル

```text
Gemini自由生成
```

---

## 制約

使用禁止。

```text
二十四節気名称そのまま

七十二候名称そのまま

祝日名称そのまま
```

---

## 数値

直接出力禁止。

例。

禁止。

```text
26.4℃
61%
712ppm
```

許可。

```text
湿り気

穏やかな空気

静かな室内
```

状態。

FINALIZED

---

# 14. Poem状態管理

## generation_status

```text
CALENDAR_PENDING

POEM_RUNNING

POEM_RETRY

POEM_READY

POEM_ERROR

POEM_SKIPPED
```

---

## Retry

最大。

```text
3回
```

設定元。

```text
system_config
```

---

# 15. Calendar依存

Poem実行前。

```text
calendar_master.status
確認
```

---

## 実行許可

```text
CALENDAR_READY
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

---

# 16. JobScheduler

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

---

# 17. エラー処理

## Calendar

最終失敗。

```text
CALENDAR_ERROR
```

記録先。

```text
error_log
```

---

## Poem

最終失敗。

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

---

## Security

```text
SECURITY_ERROR
```

---

# 18. Spreadsheetアクセス方針

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

# 19. 実装順序

Phase1。

```text
1 Spreadsheet初期化

2 ConfigManager

3 SecurityManager

4 LogSubsystem

5 ApiGateway

6 CalendarSubsystem

7 PoemSubsystem

8 JobScheduler

9 結合試験
```

状態。

FINALIZED

---

# 20. STATUS

| 項目                | 状態        |
| ----------------- | --------- |
| ApiGateway        | CONFIRMED |
| SecurityManager   | CONFIRMED |
| ConfigManager     | CONFIRMED |
| LogSubsystem      | CONFIRMED |
| CalendarSubsystem | FINALIZED |
| PoemSubsystem     | FINALIZED |
| Calendar Status管理 | FINALIZED |
| Poem Status管理     | FINALIZED |
| Gemini設定管理        | FINALIZED |
| system_config利用   | FINALIZED |
| 実装順序              | FINALIZED |

---

# 21. CHANGE LOG

| 日付         | 内容              |
| ---------- | --------------- |
| 2026-06-19 | 新規作成            |
| 2026-06-19 | A2状態遷移反映        |
| 2026-06-19 | system_config反映 |
| 2026-06-19 | Gemini運用方針反映    |
| 2026-06-19 | Poem仕様反映        |
| 2026-06-19 | Calendar依存関係反映  |
| 2026-06-19 | 実装順序確定          |
