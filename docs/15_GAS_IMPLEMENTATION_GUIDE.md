# digital-kakejiku GAS実装ガイド

最終更新: 2026-06-20  
文書版: vNext 1.2 review reflected

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

---

# 6. Gemini Prompt Template

prompt_version。

```text
poem_prompt_v1.0
```

出力形式。

```json
{
  "title": "短いタイトル",
  "body": "詩本体"
}
```

Promptテンプレート。

```text
あなたは季節感を短い自由詩で表現する記録者です。

以下の暦情報と環境観測をもとに、今日の室内外の空気感を日本語の自由詩として表現してください。

【暦情報】
日付: {{date}}
二十四節気: {{solar_term}}
七十二候: {{season_name}}
祝日: {{holiday_name}}
六曜: {{rokuyo}}
月相: {{moon_phase}}

【環境観測】
温度: {{temperature}}℃
湿度: {{humidity}}%
気圧: {{pressure}}hPa
CO2: {{co2}}ppm
PM2.5: {{pm2_5}}
照度: {{illuminance}}
人感: {{motion_detected}}

【要件】
- 自由詩
- 客観描写
- 80〜120文字
- 目標100文字
- 数値を直接出力しない
- 二十四節気名、七十二候名、祝日名をそのまま使わない
- 政治、宗教、説教、誘導、経済情報を含めない
- 誇張しない
- 不明な値は補完しない

【出力形式】
JSONのみを返してください。
{"title":"短いタイトル","body":"詩本体"}
```

---

# 7. Prompt入力値の扱い

欠損値はPromptから除外する。

禁止。

- 欠損値を推測して埋める
- 数値を詩本文に直接出す
- 暦名を詩本文に直接出す

---

# 8. Retry実装仕様

分類。

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

待機時間。

```javascript
function getBackoffWait(errorType, attemptCount) {
  const baseWait = {
    TEMPORARY: 30,
    UNKNOWN: 60
  };
  const maxWait = {
    TEMPORARY: 600,
    UNKNOWN: 300
  };
  if (errorType === 'PERMANENT') return 0;
  const wait = baseWait[errorType] * Math.pow(2, attemptCount - 1);
  return Math.min(wait, maxWait[errorType]);
}
```

---

# 9. Calendar Job実装フロー

```text
runCalendarJob()
  ↓
対象日のcalendar_master確認
  ↓
status = CALENDAR_RUNNING
  ↓
暦生成
  ↓
成功 → CALENDAR_READY
  ↓
TEMPORARY失敗 → CALENDAR_RETRY
  ↓
PERMANENT失敗 → CALENDAR_ERROR
  ↓
Retry上限超過 → CALENDAR_ERROR
```

擬似コード。

```javascript
function runCalendarJob(kind) {
  const context = createJobContext('CALENDAR', kind);
  try {
    updateCalendarStatus(context.date, 'CALENDAR_RUNNING');
    generateCalendarForDate(context.date);
    updateCalendarStatus(context.date, 'CALENDAR_READY');
    appendEventLog('CALENDAR_READY', context);
  } catch (error) {
    const errorType = classifyError(error);
    if (errorType === 'TEMPORARY' && context.retryCount < getSystemConfig('calendar_retry_max')) {
      updateCalendarStatus(context.date, 'CALENDAR_RETRY');
    } else {
      updateCalendarStatus(context.date, 'CALENDAR_ERROR');
    }
    appendErrorLog(error, 'CALENDAR');
  }
}
```

---

# 10. Poem Job実装フロー

```text
runPoemJob()
  ↓
calendar_master.status確認
  ├─ CALENDAR_READY → Poem生成
  ├─ SCHEDULED/RUNNING/RETRY → CALENDAR_PENDING
  └─ CALENDAR_ERROR → POEM_SKIPPED
```

擬似コード。

```javascript
function runPoemJob(kind) {
  const context = createJobContext('POEM', kind);
  const calendarStatus = getCalendarStatus(context.date);

  if (calendarStatus !== 'CALENDAR_READY') {
    if (calendarStatus === 'CALENDAR_ERROR') {
      updatePoemStatus(context.date, 'POEM_SKIPPED');
    } else {
      updatePoemStatus(context.date, 'CALENDAR_PENDING');
    }
    return;
  }

  try {
    updatePoemStatus(context.date, 'POEM_RUNNING');
    const prompt = buildPoemPrompt(context.date);
    const poem = callGemini(prompt);
    savePoemCache(context.date, poem);
    updatePoemStatus(context.date, 'POEM_READY');
  } catch (error) {
    const errorType = classifyError(error);
    if (errorType === 'TEMPORARY' && context.retryCount < getSystemConfig('poem_retry_max')) {
      updatePoemStatus(context.date, 'POEM_RETRY');
    } else {
      updatePoemStatus(context.date, 'POEM_ERROR');
    }
    appendErrorLog(error, 'POEM');
  }
}
```

---

# 11. GAS Trigger設定

Phase 1では時間主導トリガーを使用する。

```javascript
function installTriggers() {
  removeExistingTriggers();

  ScriptApp.newTrigger('runCalendarJobMain')
    .timeBased().everyDays(1).atHour(2).nearMinute(0).create();

  ScriptApp.newTrigger('runCalendarJobRetry1')
    .timeBased().everyDays(1).atHour(2).nearMinute(30).create();

  ScriptApp.newTrigger('runPoemJobMain')
    .timeBased().everyDays(1).atHour(2).nearMinute(10).create();

  ScriptApp.newTrigger('runPoemJobRetry1')
    .timeBased().everyDays(1).atHour(2).nearMinute(40).create();
}
```

注記。

GASのnearMinuteは厳密な秒単位実行を保証しない。実行結果はsystem_logで確認する。

---

# 12. MaintenanceHandler

関数候補。

```javascript
function regenerateCalendarByYear(year) {}
function regenerateCalendarByRange(startDate, endDate) {}
function regeneratePoemByDate(date) {}
function regeneratePoemByRange(startDate, endDate) {}
```

禁止。

- source_config直接編集
- system_config直接編集
- API Key編集

---

# 13. Prompt Version更新時の処理

system_config.prompt_version変更後の新規Poem生成から新Versionを使用する。

既存poem_cacheは自動更新しない。

再生成が必要な場合はMaintenanceHandlerを使う。

---

# 14. STATUS

| 項目 | 状態 |
|---|---|
| Gemini Prompt Template | FINALIZED |
| Retry実装仕様 | FINALIZED |
| Calendar Job実装フロー | FINALIZED |
| Poem Job実装フロー | FINALIZED |
| GAS Trigger設定 | CONFIRMED |
| MaintenanceHandler | CONFIRMED |

---

# 15. CHANGE LOG

| 日付 | 内容 |
|---|---|
| 2026-06-20 | vNext 1.2としてPromptテンプレート完全版を追加 |
| 2026-06-20 | Retry待機時間と実装例を追加 |
| 2026-06-20 | Calendar/Poem Job擬似コードを追加 |
| 2026-06-20 | GAS Trigger設定例を追加 |
