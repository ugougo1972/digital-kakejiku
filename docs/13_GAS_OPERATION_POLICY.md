# 13_GAS_OPERATION_POLICY.md

# digital-kakejiku GAS運用方針

最終更新: 2026-06-19

---

# 1. 目的

本ドキュメントは digital-kakejiku における GAS 運用方針を定義する。

査読結果を反映し、Calendar Subsystem、Poem Subsystem、ログ運用、障害時動作、定期実行方針を整理する。

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

担当。

- 祝日取得
- 二十四節気取得
- 七十二候生成
- calendar_master更新

出力。

- calendar_master

---

## Poem Job

担当。

- Gemini API呼出
- Prompt生成
- poem_cache生成

出力。

- poem_cache

制約。

- 1日1回生成
- 表示時再生成禁止

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

---

# 7. 障害時運用

## Calendar失敗

記録。

- error_log

表示。

```text
取得できません
```

前回値流用禁止。

---

## Poem失敗

記録。

- error_log

表示。

```text
取得できません
```

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
- source_config確認
- ログ確認

Poem再生成。

通常運用では実施しない。

保守用途のみ検討。

状態。

PROPOSED

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
| Calendar Job | CONFIRMED |
| Poem Job | CONFIRMED |
| RawLogs廃止 | FINALIZED |
| 表示時Poem再生成禁止 | FINALIZED |
| AIによる暦生成禁止 | FINALIZED |
| Gemini API Key Script Properties管理 | FINALIZED |
| Calendar再生成 | CONFIRMED |
| Poem手動再生成 | PROPOSED |

---

# 15. CHANGE LOG

| 日付 | 内容 | 理由 |
|---|---|---|
| 2026-06-19 | 新規作成 | 査読対応 |
| 2026-06-19 | Calendar運用方針整理 | サブシステム整合 |
| 2026-06-19 | Poem運用方針整理 | Gemini運用整理 |
| 2026-06-19 | STATUS追加 | 確定度管理導入 |
