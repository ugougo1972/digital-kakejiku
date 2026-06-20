# 13_GAS_OPERATION_POLICY.md

# digital-kakejiku GAS運用方針

最終更新: 2026-06-20  
版: vNext 1.0

---

# 1. 目的

GAS運用方針を定義する。

対象。

- API Gateway
- Payload検証
- Spreadsheet保存
- Calendar生成
- Poem生成
- Config参照
- 障害記録
- Job運用
- 保守操作

# 2. 基本方針

GASは以下を担当する。

- API Gateway
- Payload検証
- Spreadsheet保存
- Calendar生成
- Poem生成
- Config参照
- 障害記録
- 定期Job実行
- 保守要求処理

ESP32は観測端末として動作する。

# 3. 定期実行ジョブ

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

Retry。

- 30分間隔
- 最大3回

# 4. Spreadsheet運用

```text
observation_log
event_log
error_log
system_log
source_config
system_config
solar_term_master
season_dictionary
calendar_master
poem_cache
```

RawLogs はPoC用途とし、本番運用対象外とする。

# 5. Calendar運用

| 項目 | 情報源 |
| --- | --- |
| 祝日 | 内閣府 |
| 二十四節気 | 国立天文台系 |
| 七十二候名称 | season_dictionary |
| 七十二候説明 | season_dictionary |
| 解説参照URL | source_config |


禁止。

- AI生成
- AI推定
- 欠損補完

保持期間。

- 過去5年
- 当年
- 翌年

年次生成。

- 毎年12月1日

# 6. Poem運用

- Gemini API Free Tier
- 自由詩
- 客観描写
- 80～120文字
- 目標100文字
- temperature=0.5

禁止。

- 暦生成
- 暦補完
- 表示時再生成
- 代替詩生成
- 観測値数値直接出力

# 7. 障害時運用

Calendar失敗。

- error_log記録
- 取得できません表示
- 前回値流用禁止

Calendar未完了。

- CALENDAR_PENDING
- Poem生成保留

Poem失敗。

- error_log記録
- 取得できません表示
- 代替詩生成禁止

# 8. 手動保守

対象。

- Calendar再生成
- Calendar範囲再生成
- Poem再生成
- source_config確認
- system_config確認
- ログ確認

禁止。

- 背面保守UIからのsource_config編集
- 背面保守UIからのsystem_config編集
- 背面保守UIからのPrompt編集
- 背面保守UIからのGemini設定変更

# 9. バージョン管理

- SYSTEM_VERSION: Script Properties
- Prompt Version: system_config
- Poem生成時prompt_version: poem_cache

# 10. STATUS

| 項目 | 状態 |
| --- | --- |
| Calendar Job | FINALIZED |
| Poem Job | FINALIZED |
| Job依存関係 | FINALIZED |
| CALENDAR_PENDING | FINALIZED |
| Calendar保持期間 | FINALIZED |
| Calendar年次生成 | FINALIZED |
| RawLogs廃止 | FINALIZED |
| 表示時Poem再生成禁止 | FINALIZED |
| Gemini API Key Script Properties管理 | FINALIZED |
| Calendar再生成 | FINALIZED |
| Calendar範囲再生成 | FINALIZED |
| Poem手動再生成 | FINALIZED |
| 背面保守UIからの設定編集禁止 | FINALIZED |


# 11. CHANGE LOG

| 日付 | 内容 |
| --- | --- |
| 2026-06-20 | vNext 1.0として全面再生成 |
| 2026-06-20 | 背面保守UIからの保守要求方針を反映 |
| 2026-06-20 | Prompt Version管理を反映 |
