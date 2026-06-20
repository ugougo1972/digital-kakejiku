# digital-kakejiku Calendar / Poem Subsystem

最終更新: 2026-06-20  
文書版: vNext 1.1 review reflected

---

# 1. 目的

本書は Calendar Subsystem および Poem Subsystem の基準源である。

---

# 2. 基本方針

- Calendar生成はGAS側
- Poem生成はGAS側
- ESP32は生成済みデータの表示のみ
- AIによる暦生成・推定・補完は禁止
- 表示時Poem再生成は禁止
- エラー時は「取得できません」を表示

---

# 3. Calendar Subsystem

責務。

- 祝日生成
- 二十四節気生成
- 七十二候生成
- 旧暦生成
- 六曜生成
- 月齢生成
- calendar_master更新

情報源。

| 項目 | 情報源 |
|---|---|
| 祝日 | 内閣府 |
| 二十四節気 | 国立天文台系 |
| 七十二候名称 | season_dictionary |
| 七十二候説明 | season_dictionary |
| 解説参照URL | source_config |

保持期間。

- 過去5年
- 当年
- 翌年

年次生成。

- 毎年12月1日に翌年分を生成

再生成。

- 指定年再生成
- 指定期間再生成

---

# 4. Calendar状態

- SCHEDULED
- CALENDAR_RUNNING
- CALENDAR_RETRY
- CALENDAR_READY
- CALENDAR_ERROR

---

# 5. Poem Subsystem

入力。

- calendar_master
- observation_log

出力。

- poem_cache

利用AI。

- Gemini API Free Tier

用途。

- 今日の詩

---

# 6. Gemini Promptドラフト

## 入力フィーチャー

```json
{
  "date": "YYYY-MM-DD",
  "weekday": "曜日",
  "solar_term": "二十四節気名またはnull",
  "season_name": "七十二候名またはnull",
  "holiday_name": "祝日名またはnull",
  "moon_phase": "月相またはnull",
  "observation": {
    "temperature": 26.5,
    "humidity": 65.0,
    "co2": 420,
    "pm2_5": 3.2,
    "illuminance": 120
  }
}
```

## Prompt本文ドラフト

```text
あなたは、室内外の環境観測と季節の移ろいを客観的に描写する短い日本語詩を生成します。

以下の暦情報と観測データを参考にしてください。ただし、二十四節気名、七十二候名、祝日名を本文にそのまま使ってはいけません。観測値の数値も本文に直接出力してはいけません。

要件:
- 日本語
- 自由詩
- 客観描写
- 80～120文字
- 目標100文字
- 説教、誘導、政治、宗教、経済情報を含めない
- タイトルを自由生成する

出力形式:
{
  "title": "...",
  "body": "..."
}
```

## 生成パラメータ

| 項目 | 値 |
|---|---|
| temperature | 0.5 |
| max_tokens | system_config管理 |
| prompt_version | system_config管理 |

---

# 7. Poem状態

- CALENDAR_PENDING
- POEM_RUNNING
- POEM_RETRY
- POEM_READY
- POEM_ERROR
- POEM_SKIPPED

---

# 8. CALENDAR_PENDING終了条件

CALENDAR_PENDINGは Calendarが復旧するまで保持する。日数による自動破棄は行わない。

終了条件。

```text
calendar_master.status = CALENDAR_READY
```

終了後。

```text
POEM_RUNNING
```

Calendarが失敗した場合。

```text
CALENDAR_ERROR
 ↓
POEM_SKIPPED
```

---

# 9. Job詳細フロー

## Calendar Job

```text
02:00 起動
 ↓
source_config確認
 ↓
solar_term_master / season_dictionary確認
 ↓
calendar_master対象日確認
 ↓
生成または再生成
 ↓
CALENDAR_READY
```

失敗時。

```text
CALENDAR_RUNNING
 ↓
CALENDAR_RETRY
 ↓ 30分後
CALENDAR_RUNNING
```

最大3回失敗。

```text
CALENDAR_ERROR
```

## Poem Job

```text
02:10 起動
 ↓
calendar_master.status確認
 ↓
CALENDAR_READYならPrompt生成
 ↓
Gemini API呼出
 ↓
poem_cache保存
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

# 10. Retry詳細

| エラー | 分類 | 対応 |
|---|---|---|
| Network Timeout | 一時的 | Retry |
| 429 Rate Limit | 一時的 | 待機後Retry |
| 5xx Server Error | 一時的 | 待機後Retry |
| 401 Unauthorized | 永続的 | Retryしない |
| 403 Forbidden | 永続的 | Retryしない |
| CONFIG_ERROR | 永続的 | 管理者対応 |

---

# 11. 手動保守

背面UIから許可。

- Calendar再生成
- Calendar範囲再生成
- Poem再生成
- 状態確認
- エラー確認

背面UIから禁止。

- source_config編集
- system_config編集
- URL編集
- Prompt編集
- Geminiモデル変更
- temperature変更
- API Key編集

---

# 12. STATUS

| 項目 | 状態 |
|---|---|
| Calendar Subsystem | FINALIZED |
| Poem Subsystem | FINALIZED |
| Gemini Promptドラフト | FINALIZED |
| CALENDAR_PENDING終了条件 | FINALIZED |
| Job詳細フロー | FINALIZED |
| Retry詳細 | FINALIZED |
| 表示時再生成禁止 | FINALIZED |

---

# 13. CHANGE LOG

| 日付 | 内容 |
|---|---|
| 2026-06-20 | Gemini Promptドラフト追加 |
| 2026-06-20 | CALENDAR_PENDING終了条件追加 |
| 2026-06-20 | Job詳細フロー追加 |
| 2026-06-20 | Error Retry詳細追加 |
