# digital-kakejiku GAS運用方針

最終更新: 2026-06-20  
文書版: vNext 1.2 review reflected

---

# 1. 目的

本書はGAS運用の基準源である。

---

# 2. GASの責務

- API Gateway
- Payload検証
- Spreadsheet保存
- Calendar生成
- Poem生成
- Config参照
- 障害記録
- Maintenance処理

---

# 3. 定期実行

## Calendar Job

| 時刻 | 用途 |
|---|---|
| 02:00 | Main |
| 02:30 | Retry1 |
| 03:00 | Retry2 |
| 03:30 | Retry3 |

## Poem Job

| 時刻 | 用途 |
|---|---|
| 02:10 | Main |
| 02:40 | Retry1 |
| 03:10 | Retry2 |
| 03:40 | Retry3 |

---

# 4. Retry運用

エラー分類。

| 分類 | 対象 | Retry |
|---|---|---|
| TEMPORARY | 429, 5xx, NETWORK_TIMEOUT | あり |
| PERMANENT | 401, 403, CONFIG_ERROR | なし |
| UNKNOWN | 分類不能 | 1回のみ候補 |

待機時間。

| 分類 | 初回待機 | 最大待機 | 最大Retry |
|---|---:|---:|---:|
| TEMPORARY | 30秒 | 600秒 | 3回 |
| UNKNOWN | 60秒 | 300秒 | 1回 |
| PERMANENT | なし | なし | 0回 |

---

# 5. Retry実行フロー

Calendar Job。

```text
02:00 Calendar Main
 ├─ 成功 → CALENDAR_READY
 ├─ TEMPORARY → CALENDAR_RETRY → 02:30
 ├─ PERMANENT → CALENDAR_ERROR
 └─ Retry3失敗 → CALENDAR_ERROR
```

Poem Job。

```text
02:10 Poem Main
 ├─ Calendar=CALENDAR_READY → Poem生成
 ├─ Calendar=SCHEDULED/RUNNING/RETRY → CALENDAR_PENDING
 ├─ Calendar=CALENDAR_ERROR → POEM_SKIPPED
 ├─ Gemini TEMPORARY → POEM_RETRY
 ├─ Gemini PERMANENT → POEM_ERROR
 └─ Retry3失敗 → POEM_ERROR
```

---

# 6. GAS Trigger設定方針

Phase 1では時間主導トリガーを使用する。

設定対象。

- runCalendarJobMain
- runCalendarJobRetry1
- runCalendarJobRetry2
- runCalendarJobRetry3
- runPoemJobMain
- runPoemJobRetry1
- runPoemJobRetry2
- runPoemJobRetry3

トリガー作成関数。

```javascript
function installTriggers() {
  ScriptApp.newTrigger('runCalendarJobMain').timeBased().atHour(2).nearMinute(0).everyDays(1).create();
  ScriptApp.newTrigger('runPoemJobMain').timeBased().atHour(2).nearMinute(10).everyDays(1).create();
}
```

実装時には既存トリガー重複を削除してから作成する。

---

# 7. Maintenance運用

背面保守UIまたは管理者運用から実行候補。

- Calendar再生成
- Calendar範囲再生成
- Poem再生成
- Health Check

背面UIから直接設定値編集は行わない。

---

# 8. 月次運用チェック

毎月末に以下を確認する。

- Calendar成功率
- Poem成功率
- CALENDAR_PENDING継続有無
- POEM_ERROR継続有無
- Script Properties存在確認
- Spreadsheet共有範囲
- Gemini API利用状況
- GAS実行時間

---

# 9. STATUS

| 項目 | 状態 |
|---|---|
| Calendar Job | FINALIZED |
| Poem Job | FINALIZED |
| Retry運用 | FINALIZED |
| GAS Trigger方針 | CONFIRMED |
| 月次運用チェック | CONFIRMED |

---

# 10. CHANGE LOG

| 日付 | 内容 |
|---|---|
| 2026-06-20 | vNext 1.2としてRetry実行フローを追加 |
| 2026-06-20 | GAS Trigger設定方針を追加 |
| 2026-06-20 | 月次運用チェックを追加 |
