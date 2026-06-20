# 10_CALENDAR_POEM_SUBSYSTEM.md

# digital-kakejiku Calendar / Poem Subsystem

最終更新: 2026-06-20  
版: vNext 1.0

---

# 1. 目的

Calendar Subsystem および Poem Subsystem の責務、データ構造、状態遷移、運用方針を定義する。

# 2. 基本方針

- Calendar生成はGAS側
- Poem生成はGAS側
- ESP32は表示専用
- Gemini API呼出はGAS側のみ
- 表示時再生成禁止
- エラー時は「取得できません」を表示

禁止。

- AIによる暦生成
- AIによる暦推定
- AIによる欠損補完
- 代替詩生成

# 3. 使用シート

読み取り。

- source_config
- system_config
- solar_term_master
- season_dictionary
- observation_log

読み書き。

- calendar_master
- poem_cache

# 4. Calendar Subsystem

責務。

- 祝日生成
- 二十四節気生成
- 七十二候生成
- 旧暦情報生成
- 六曜生成
- 月齢生成
- calendar_master更新

情報源。

| 項目 | 情報源 |
| --- | --- |
| 祝日 | 内閣府 |
| 二十四節気 | 国立天文台系 |
| 七十二候名称 | season_dictionary |
| 七十二候説明 | season_dictionary |
| 解説参照URL | source_config |


# 5. calendar_master

Primary Key。

```text
calendar_date
```

主要カラム。

- calendar_date
- holiday_name
- solar_term
- season_name
- lunar_date
- rokuyo
- moon_age
- moon_phase
- zodiac
- eto
- status
- retry_count
- error_code
- updated_at

# 6. Calendar状態

```text
SCHEDULED
CALENDAR_RUNNING
CALENDAR_RETRY
CALENDAR_READY
CALENDAR_ERROR
```

# 7. Calendar保持・生成

保持期間。

```text
過去5年
当年
翌年
```

年次生成。

```text
毎年12月1日に翌年分生成
```

再生成。

- 指定年再生成
- 指定期間再生成

# 8. Poem Subsystem

入力。

- calendar_master
- observation_log

出力。

- poem_cache

利用AI。

- Gemini API Free Tier

# 9. Poem生成仕様

- 自由詩
- 客観描写
- 80～120文字
- 目標100文字
- temperature=0.5
- タイトルはGemini自由生成

禁止。

- 二十四節気名称そのまま
- 七十二候名称そのまま
- 祝日名称そのまま
- 観測値数値の直接出力

# 10. poem_cache

Primary Key。

```text
poem_date
```

主要カラム。

- poem_date
- generated_at
- model_name
- prompt_version
- poem_title
- poem_body
- calendar_date
- observation_reference
- generation_status
- retry_count
- error_code
- error_message

# 11. Poem状態

```text
CALENDAR_PENDING
POEM_RUNNING
POEM_RETRY
POEM_READY
POEM_ERROR
POEM_SKIPPED
```

# 12. Calendar → Poem依存

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

# 13. Retry制御

- system_configから取得
- calendar_retry_max=3
- poem_retry_max=3
- 30分間隔

# 14. 実行スケジュール

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

# 15. Prompt Version管理

- system_configから取得
- poem_cacheへ保存
- 背面保守UIから変更しない

# 16. 手動保守

許可。

- Calendar再生成
- Calendar範囲再生成
- Poem再生成
- 状態確認
- エラー確認

禁止。

```text
source_config編集
system_config編集
URL編集
Prompt編集
Geminiモデル変更
temperature変更
API Key編集
```

# 17. エラー処理

Calendar失敗。

- CALENDAR_ERROR
- error_log記録
- 取得できません表示

Poem失敗。

- POEM_ERROR
- error_log記録
- 取得できません表示
- 代替詩生成禁止

# 18. STATUS

| 項目 | 状態 |
| --- | --- |
| Calendar Subsystem | FINALIZED |
| Poem Subsystem | FINALIZED |
| calendar_master | FINALIZED |
| poem_cache | FINALIZED |
| Calendar保持期間 | FINALIZED |
| 年次生成 | FINALIZED |
| Calendar再生成 | FINALIZED |
| Poem再生成 | FINALIZED |
| Calendar→Poem依存 | FINALIZED |
| CALENDAR_PENDING | FINALIZED |
| Retry制御 | FINALIZED |
| 表示時Poem再生成禁止 | FINALIZED |
| Prompt Version管理 | FINALIZED |


# 19. CHANGE LOG

| 日付 | 内容 |
| --- | --- |
| 2026-06-20 | vNext 1.0として全面再生成 |
| 2026-06-20 | season_dictionaryとsource_configの責務を分離 |
| 2026-06-20 | 背面保守UIからのCalendar/Poem再生成を反映 |
| 2026-06-20 | Prompt Version管理を反映 |
