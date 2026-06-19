# digital-kakejiku GAS運用方針

最終更新: 2026-06-19

---

# 1. 目的

本ドキュメントは digital-kakejiku における GAS 運用方針を定義する。

査読結果および採択済み事項を反映し、Calendar Subsystem、Poem Subsystem、ログ運用、障害時動作、定期実行方針を整理する。

関連文書。

- 06_GAS_API_SPEC.md
- 10_CALENDAR_POEM_SUBSYSTEM.md
- 11_SECURITY_MANAGEMENT.md
- 12_CONFIGURATION_MANAGEMENT.md

---

# 2. 基本方針

GASは以下を担当する。

- API Gateway
- Payload検証
- Spreadsheet保存
- Calendar生成
- Poem生成
- Config参照
- 障害記録

ESP32は観測端末として動作する。

Calendar生成およびPoem生成はGAS側責務とする。

---

# 3. 定期実行ジョブ

## Calendar Job

実行時刻。

- 02:00 本実行
- 02:30 Retry-1
- 03:00 Retry-2
- 03:30 Retry-3

失敗時。

- CALENDAR_ERROR

最大リトライ回数。

- 3回

状態。

FINALIZED

---

## Poem Job

実行時刻。

- 02:10 本実行
- 02:40 Retry-1
- 03:10 Retry-2
- 03:40 Retry-3

失敗時。

- POEM_ERROR

最大リトライ回数。

- 3回

状態。

FINALIZED

---

## Job依存関係

```text
Calendar Job
      ↓
calendar_master
      ↓
Poem Job
```

状態。

FINALIZED

---

# 4. Spreadsheet運用

対象。

- observation_log
- event_log
- error_log
- system_log
- source_config
- solar_term_master
- season_dictionary
- calendar_master
- poem_cache

RawLogs はPoC用途とし、本番運用対象外とする。

状態。

FINALIZED

---

# 5. Calendar運用

取得元。

| 項目 | 情報源 |
|---|---|
| 祝日 | 内閣府 |
| 二十四節気 | 国立天文台系 |
| 七十二候名称 | 固定マスタ |
| 解説 | source_config管理URL |

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

状態。

FINALIZED

---

# 6. Poem運用

入力。

- calendar_master
- observation_log

出力。

- poem_cache

利用AI。

- Gemini API Free Tier

用途。

- 今日の詩

禁止。

- 暦生成
- 暦補完
- 表示時再生成

状態。

FINALIZED

---

# 7. 障害時運用

## Calendar失敗

記録。

- error_log

表示。

取得できません

前回値流用禁止。

---

## Calendar未完了

状態。

- CALENDAR_PENDING

Poem生成。

- 保留

次回Poem Jobで再確認。

状態。

FINALIZED

---

## Poem失敗

記録。

- error_log

表示。

取得できません

代替詩生成禁止。

---

## source_config失敗

記録。

- error_log

状態。

- CALENDAR_ERROR
- CONFIG_ERROR

---

# 8. ログ運用

error_log対象。

- NETWORK_ERROR
- RTC_ERROR
- CALENDAR_ERROR
- CALENDAR_PENDING
- POEM_ERROR
- CONFIG_ERROR
- SECURITY_ERROR

system_log対象。

- 起動
- 停止
- BATTERY_MODE
- 更新処理

---

# 9. 運用監視項目

監視。

- Calendar成功率
- Poem成功率
- source_config取得率
- GAS実行失敗率
- Spreadsheet書込失敗率

---

# 10. Gemini API運用

Gemini API Key。

保存先。

- Script Properties

禁止。

- Spreadsheet保存
- Log出力
- GitHub記載

状態。

FINALIZED

---

# 11. 手動保守

対象。

- Calendar再生成
- Calendar範囲再生成
- source_config確認
- ログ確認

Calendar再生成。

許可。

Poem再生成。

保守用途のみ。

状態。

CONFIRMED

---

# 12. RTC異常時

Calendar判定。

- GAS側日付優先

Poem判定。

- GAS側日付優先

RTC異常でも。

- Calendar補完禁止
- Poem補完禁止

---

# 13. バージョン管理

管理。

- SYSTEM_VERSION

保存先。

- Script Properties

状態。

CONFIRMED

---

# 14. STATUS

| 項目 | 状態 |
|---|---|
| Calendar Job | FINALIZED |
| Poem Job | FINALIZED |
| Job依存関係 | FINALIZED |
| CALENDAR_PENDING | FINALIZED |
| Calendar保持期間 | FINALIZED |
| Calendar年次生成 | FINALIZED |
| RawLogs廃止 | FINALIZED |
| 表示時Poem再生成禁止 | FINALIZED |
| AIによる暦生成禁止 | FINALIZED |
| Gemini API Key Script Properties管理 | FINALIZED |
| Calendar再生成 | CONFIRMED |
| Calendar範囲再生成 | CONFIRMED |
| Poem手動再生成 | PROPOSED |

---

# 15. CHANGE LOG

| 日付 | 内容 | 理由 |
|---|---|---|
| 2026-06-19 | Calendar/Poemスケジュール確定 | 採択事項反映 |
| 2026-06-19 | CALENDAR_PENDING追加 | Job依存関係整理 |
| 2026-06-19 | Calendar保持期間追加 | Calendar方針確定 |
| 2026-06-19 | Calendar再生成方針追加 | 運用保守対応 |
