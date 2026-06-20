# 18_GAS_RETRY_STRATEGY.md

# digital-kakejiku GAS Retry Strategy

最終更新: 2026-06-20  
文書版: vNext 1.3 phase1 ready delta

---

# 1. 目的

本書は digital-kakejiku におけるGAS側Retry戦略の基準源である。

Phase 1 GAS実装で必要となる以下を定義する。

- 一時的エラーと永続的エラーの分類
- Retry対象判定
- 待機時間
- 最大Retry回数
- Calendar Job / Poem Job のRetryフロー
- Gemini API Retry方針
- Spreadsheet書込失敗時の扱い

---

# 2. 基本方針

Retryは以下の原則で行う。

- 一時的エラーのみRetryする
- 永続的エラーはRetryしない
- UNKNOWNは限定Retryとする
- 機密情報をログに出さない
- ESP32側で暦や詩を補完しない
- Calendar / Poem Jobは固定Triggerで再実行する
- Gemini API呼出は短時間Retryを許可する

---

# 3. エラー分類

| 分類 | 意味 | Retry |
|---|---|---|
| TEMPORARY | 一時的障害 | あり |
| PERMANENT | 設定・認証・入力の恒久的障害 | なし |
| UNKNOWN | 判断不能 | 1回のみ |

---

# 4. TEMPORARY エラー

| エラーコード | HTTP | 待機時間 | 最大Retry | 例 |
|---|---:|---|---:|---|
| NETWORK_TIMEOUT | - | 30s → 60s → 120s | 3 | 接続タイムアウト |
| GEMINI_RATE_LIMIT | 429 | 60s | 1 | Gemini API制限 |
| GEMINI_SERVER_ERROR | 5xx | 30s → 60s → 120s | 3 | Gemini側一時障害 |
| GAS_SERVER_ERROR | 5xx | 30s → 60s → 120s | 3 | GAS側一時障害 |
| SPREADSHEET_TIMEOUT | - | 30s → 60s → 120s | 3 | Spreadsheet一時失敗 |

---

# 5. PERMANENT エラー

| エラーコード | HTTP | Retry | 対応 |
|---|---:|---|---|
| AUTH_ERROR | 401 | なし | secret確認 |
| INVALID_DEVICE | 403 | なし | device_id確認 |
| SCHEMA_ERROR | 400 | なし | Payload修正 |
| CONFIG_ERROR | - | なし | source_config / system_config確認 |
| GEMINI_AUTH_ERROR | 401 / 403 | なし | GEMINI_API_KEY確認 |
| PROMPT_SCHEMA_ERROR | - | なし | Prompt / JSON仕様確認 |

---

# 6. UNKNOWN エラー

UNKNOWNは1回のみRetryする。

| 分類 | 待機時間 | 最大Retry |
|---|---:|---:|
| UNKNOWN | 60秒 | 1 |

UNKNOWNが再発した場合は永続扱いとしてerror_logへ記録する。

---

# 7. 待機時間計算

```javascript
function getBackoffWaitSeconds(errorClass, attemptCount) {
  const baseWait = {
    TEMPORARY: 30,
    UNKNOWN: 60
  };

  const maxWait = {
    TEMPORARY: 120,
    UNKNOWN: 60
  };

  if (errorClass === 'PERMANENT') {
    return 0;
  }

  const wait = baseWait[errorClass] * Math.pow(2, attemptCount - 1);
  return Math.min(wait, maxWait[errorClass]);
}
```

単位。

```text
seconds
```

---

# 8. エラー分類関数

```javascript
function classifyError(error) {
  const code = error.code || error.error_code || error.httpStatus;

  if (
    code === 'NETWORK_TIMEOUT' ||
    code === 'SPREADSHEET_TIMEOUT' ||
    code === 'GAS_SERVER_ERROR' ||
    code === 'GEMINI_SERVER_ERROR' ||
    code === 500 ||
    code === 502 ||
    code === 503 ||
    code === 504
  ) {
    return 'TEMPORARY';
  }

  if (code === 'GEMINI_RATE_LIMIT' || code === 429) {
    return 'TEMPORARY';
  }

  if (
    code === 'AUTH_ERROR' ||
    code === 'INVALID_DEVICE' ||
    code === 'SCHEMA_ERROR' ||
    code === 'CONFIG_ERROR' ||
    code === 'GEMINI_AUTH_ERROR' ||
    code === 'PROMPT_SCHEMA_ERROR' ||
    code === 400 ||
    code === 401 ||
    code === 403
  ) {
    return 'PERMANENT';
  }

  return 'UNKNOWN';
}
```

---

# 9. Retry可否判定

```javascript
function shouldRetry(error, attemptCount) {
  const errorClass = classifyError(error);

  if (errorClass === 'PERMANENT') {
    return false;
  }

  if (errorClass === 'UNKNOWN') {
    return attemptCount < 1;
  }

  if (error.code === 'GEMINI_RATE_LIMIT' || error.httpStatus === 429) {
    return attemptCount < 1;
  }

  return attemptCount < 3;
}
```

---

# 10. Calendar Job Retryフロー

```text
Calendar Job (02:00)
  ├─ 成功
  │   └─ calendar_master.status = CALENDAR_READY
  ├─ 一時的エラー
  │   └─ calendar_master.status = CALENDAR_RETRY
  │       ├─ 02:30 Retry1
  │       ├─ 03:00 Retry2
  │       └─ 03:30 Retry3
  └─ 永続的エラー
      └─ calendar_master.status = CALENDAR_ERROR
          error_log記録
```

Retry3でも失敗した場合。

```text
CALENDAR_ERROR
```

---

# 11. Poem Job Retryフロー

```text
Poem Job (02:10)
  ├─ calendar_master.status確認
  │   ├─ CALENDAR_READY → Poem生成
  │   ├─ SCHEDULED / CALENDAR_RUNNING / CALENDAR_RETRY → CALENDAR_PENDING
  │   └─ CALENDAR_ERROR → POEM_SKIPPED
  ├─ Gemini成功
  │   └─ poem_cache.generation_status = POEM_READY
  ├─ 一時的エラー
  │   └─ poem_cache.generation_status = POEM_RETRY
  │       ├─ 02:40 Retry1
  │       ├─ 03:10 Retry2
  │       └─ 03:40 Retry3
  └─ 永続的エラー
      └─ poem_cache.generation_status = POEM_ERROR
          error_log記録
```

---

# 12. Gemini API呼出Retry

Gemini API呼出では、Job内で短時間Retryを許可する。

| エラー | 待機 | 最大Retry |
|---|---:|---:|
| 429 Rate Limit | 60秒 | 1 |
| 5xx Server Error | 30s → 60s → 120s | 3 |
| 400 Bad Request | なし | 0 |
| 401 / 403 | なし | 0 |

実装例。

```javascript
function callGeminiWithRetry(prompt) {
  const maxAttempts = 3;
  let lastError = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return callGemini(prompt);
    } catch (error) {
      lastError = error;
      const errorClass = classifyError(error);

      if (!shouldRetry(error, attempt - 1)) {
        throw error;
      }

      const wait = getBackoffWaitSeconds(errorClass, attempt);
      Utilities.sleep(wait * 1000);
    }
  }

  throw lastError;
}
```

---

# 13. Spreadsheet書込失敗時

| エラー | 分類 | Retry |
|---|---|---|
| Spreadsheet timeout | TEMPORARY | 3回 |
| Sheet not found | PERMANENT | なし |
| Missing column | PERMANENT | なし |
| Permission denied | PERMANENT | なし |

Spreadsheet書込に最終失敗した場合。

- error_logへ記録
- system_logへ記録
- 対象JobはERROR状態へ遷移

---

# 14. ApiGatewayでのRetry方針

doPost受信処理では、GAS側の長時間Retryは行わない。

理由。

- ESP32からのPOST応答を遅延させないため
- 同一message_idによる重複検出を優先するため

doPostでの扱い。

| HTTP | 意味 | Retry |
|---:|---|---|
| 200 | 成功 | 不要 |
| 400 | Payload不正 | なし |
| 401 | secret不正 | なし |
| 403 | device_id不正 | なし |
| 500 | GAS内部エラー | ESP32側で再送判断 |

---

# 15. ESP32側Retryとの境界

本書はGAS側Retryを定義する。

ESP32側の送信Retryは別途Firmware実装時に定義する。

ただし、GAS応答の扱いは以下とする。

| GAS応答 | ESP32側の推奨動作 |
|---|---|
| 200 | 送信済みとしてローカル送信済みマーク |
| 400 | 再送しない |
| 401 | 再送しない、設定確認 |
| 403 | 再送しない、device_id確認 |
| 500 | ローカル保存を維持し次回再送候補 |

---

# 16. error_log記録項目

Retry失敗時には以下を記録する。

- timestamp
- error_code
- subsystem
- severity
- description
- retry_count
- last_attempt_at

機密情報は禁止。

---

# 17. STATUS

| 項目 | 状態 |
|---|---|
| Error分類 | FINALIZED |
| Retry回数 | FINALIZED |
| 待機時間 | FINALIZED |
| Calendar Retry | FINALIZED |
| Poem Retry | FINALIZED |
| Gemini Retry | FINALIZED |
| Spreadsheet Retry | FINALIZED |
| ApiGateway Retry境界 | FINALIZED |
| ESP32 Retry境界 | CONFIRMED |

---

# 18. CHANGE LOG

| 日付 | 内容 |
|---|---|
| 2026-06-20 | 新規作成 |
| 2026-06-20 | Phase 1開始前ブロッカー解消用にRetry詳細をFINALIZED化 |
