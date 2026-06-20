# digital-kakejiku GAS実装ガイド

最終更新: 2026-06-20  
文書版: vNext 1.1 review reflected

---

# 1. 目的

本書はGAS実装の基準源である。

---

# 2. モジュール

- ApiGateway
- SecurityManager
- ConfigManager
- LogSubsystem
- CalendarSubsystem
- PoemSubsystem
- JobScheduler
- MaintenanceHandler

---

# 3. 実装順序

1. Spreadsheet初期化
2. ConfigManager
3. SecurityManager
4. LogSubsystem
5. ApiGateway
6. CalendarSubsystem
7. PoemSubsystem
8. JobScheduler
9. MaintenanceHandler
10. 結合試験

---

# 4. ConfigManager

取得対象。

- source_config
- system_config
- Script Properties

禁止。

- API Keyのログ出力
- Secretのログ出力

---

# 5. CalendarSubsystem

関数。

- runCalendarJob()
- generateCalendarForYear()
- regenerateCalendarByYear()
- regenerateCalendarByRange()
- updateCalendarStatus()

処理フロー。

```text
loadSourceConfig
 ↓
loadSeasonDictionary
 ↓
validateCalendarTarget
 ↓
generateCalendarRows
 ↓
writeCalendarMaster
 ↓
updateCalendarStatus(CALENDAR_READY)
```

---

# 6. PoemSubsystem

関数。

- runPoemJob()
- checkCalendarReadiness()
- buildPrompt()
- callGemini()
- validateGeminiResponse()
- savePoemCache()
- updatePoemStatus()

処理フロー。

```text
checkCalendarReadiness
 ↓
CALENDAR_READY?
 ↓ yes
buildPrompt
 ↓
callGemini
 ↓
validateGeminiResponse
 ↓
savePoemCache
 ↓
POEM_READY
```

Calendar未完了。

```text
CALENDAR_PENDING
```

Calendar失敗。

```text
POEM_SKIPPED
```

---

# 7. Gemini Prompt実装ドラフト

Prompt Versionは system_config から取得し、生成時点の値を poem_cache へ保存する。

出力形式。

```json
{
  "title": "...",
  "body": "..."
}
```

制約。

- 自由詩
- 客観描写
- 80～120文字
- 数値直接出力禁止
- 二十四節気名・七十二候名・祝日名をそのまま使わない

---

# 8. Retry実装仕様

```javascript
function classifyError(error) {
  if (error.code === 429 || error.code >= 500 || error.code === 'NETWORK_TIMEOUT') {
    return 'TEMPORARY';
  }
  if (error.code === 401 || error.code === 403 || error.code === 'CONFIG_ERROR') {
    return 'PERMANENT';
  }
  return 'UNKNOWN';
}
```

対応。

| 分類 | Retry |
|---|---|
| TEMPORARY | 実施 |
| PERMANENT | 実施しない |
| UNKNOWN | 1回のみ検討 |

---

# 9. MaintenanceHandler

許可操作。

- Calendar再生成
- Calendar範囲再生成
- Poem再生成
- status取得
- last_error取得

禁止操作。

- source_config編集
- system_config編集
- URL編集
- Prompt編集
- Gemini設定変更
- API Key編集

---

# 10. STATUS

| 項目 | 状態 |
|---|---|
| ConfigManager | FINALIZED |
| CalendarSubsystem | FINALIZED |
| PoemSubsystem | FINALIZED |
| Gemini Promptドラフト | FINALIZED |
| Retry実装仕様 | FINALIZED |
| MaintenanceHandler | FINALIZED |

---

# 11. CHANGE LOG

| 日付 | 内容 |
|---|---|
| 2026-06-20 | Gemini Promptドラフト追加 |
| 2026-06-20 | Retry実装仕様追加 |
| 2026-06-20 | MaintenanceHandler追加 |
