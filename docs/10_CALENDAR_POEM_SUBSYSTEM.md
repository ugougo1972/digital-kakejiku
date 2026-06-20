# digital-kakejiku Calendar / Poem Subsystem

最終更新: 2026-06-20  
文書版: vNext 1.2 review reflected

---

# 1. 目的

本書は Calendar Subsystem および Poem Subsystem の基準源である。

---

# 2. 基本方針

Calendar生成およびPoem生成はGAS側で実施する。

ESP32は生成済みデータの表示のみを担当する。

禁止。

- AIによる暦生成
- AIによる暦推定
- AIによる欠損補完
- 表示時Poem再生成
- 代替詩生成

---

# 3. Calendar Subsystem

## 責務

- 祝日生成
- 二十四節気生成
- 七十二候生成
- 旧暦生成
- 六曜生成
- 月齢生成
- calendar_master更新

## 情報源

| 項目 | 情報源 |
|---|---|
| 祝日 | 内閣府 |
| 二十四節気 | 国立天文台系 |
| 七十二候名称 | season_dictionary |
| 七十二候説明 | season_dictionary |
| 解説参照URL | source_config |

---

# 4. Calendar保持

保持期間。

- 過去5年
- 当年
- 翌年

年次生成。

- 毎年12月1日
- 翌年分生成

手動再生成。

- 指定年
- 指定期間

---

# 5. Calendar状態

| 状態 | 意味 |
|---|---|
| SCHEDULED | 実行待ち |
| CALENDAR_RUNNING | 実行中 |
| CALENDAR_RETRY | Retry待ち |
| CALENDAR_READY | 生成完了 |
| CALENDAR_ERROR | 生成失敗 |

---

# 6. Poem Subsystem

入力。

- calendar_master
- observation_log

出力。

- poem_cache

利用。

- Gemini API Free Tier

---

# 7. Poem生成仕様

| 項目 | 内容 |
|---|---|
| 詩種 | 自由詩 |
| 視点 | 客観描写 |
| 長さ | 80～120文字 |
| 目標 | 100文字 |
| temperature | 0.5 |
| タイトル | Gemini自由生成 |
| 出力形式 | JSON |

禁止。

- 二十四節気名称そのまま使用
- 七十二候名称そのまま使用
- 祝日名称そのまま使用
- 観測値数値の直接出力

---

# 8. Prompt Version

prompt_versionはsystem_configから取得する。

生成時点のprompt_versionをpoem_cacheに保存する。

旧prompt_versionで生成されたpoem_cacheは有効なまま保持する。

---

# 9. Prompt Version更新時の再生成ルール

Prompt Versionを変更しても既存poem_cacheを自動再生成しない。

再生成する場合は、管理者が以下のいずれかで明示実行する。

- 当日分Poem再生成
- 指定日Poem再生成
- 指定期間Poem再生成

再生成時は以下を更新する。

- prompt_version
- model_name
- generated_at
- retry_count
- generation_status

旧詩の履歴保持方式は未確定とする。初期実装では上書き保存を基本とし、履歴保持はPROPOSEDとする。

---

# 10. Calendar → Poem依存

Poem Job実行時にcalendar_master.statusを確認する。

| Calendar状態 | Poem動作 |
|---|---|
| CALENDAR_READY | POEM_RUNNINGへ進む |
| SCHEDULED | CALENDAR_PENDING |
| CALENDAR_RUNNING | CALENDAR_PENDING |
| CALENDAR_RETRY | CALENDAR_PENDING |
| CALENDAR_ERROR | POEM_SKIPPED |

---

# 11. CALENDAR_PENDING終了条件

CALENDAR_PENDINGはCalendarが復旧するまで保持する。

終了条件。

- calendar_master.status が CALENDAR_READY になる
- 次回Poem Jobまたは手動Poem再生成でPoem生成を再開する

手動解除のみでPoem生成を強行しない。

CALENDAR_ERRORの場合はPOEM_SKIPPEDとし、Calendar復旧後に再生成する。

---

# 12. Retry仕様

| 対象 | 最大回数 | 間隔 |
|---|---:|---|
| Calendar | 3回 | 30分 |
| Poem | 3回 | 30分 |

一時的エラーのみRetry対象とする。

永続的エラーは即時ERRORとする。

---

# 13. Jobスケジュール

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

---

# 14. Poem状態

| 状態 | 意味 |
|---|---|
| CALENDAR_PENDING | Calendar待ち |
| POEM_RUNNING | 実行中 |
| POEM_RETRY | Retry待ち |
| POEM_READY | 生成完了 |
| POEM_ERROR | 生成失敗 |
| POEM_SKIPPED | Calendar失敗により実行禁止 |

---

# 15. 手動保守

背面UIから許可。

- Calendar再生成
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

# 16. エラー時表示

表示。

```text
取得できません
```

前回値流用、代替生成、表示側補完は禁止する。

---

# 17. STATUS

| 項目 | 状態 |
|---|---|
| Calendar Subsystem | FINALIZED |
| Poem Subsystem | FINALIZED |
| CALENDAR_PENDING終了条件 | FINALIZED |
| Prompt Version管理 | FINALIZED |
| Prompt変更時再生成ルール | CONFIRMED |
| 旧詩履歴保持 | PROPOSED |

---

# 18. CHANGE LOG

| 日付 | 内容 |
|---|---|
| 2026-06-20 | vNext 1.2としてPrompt Version更新時の再生成ルールを追加 |
| 2026-06-20 | CALENDAR_PENDING終了条件を明確化 |
