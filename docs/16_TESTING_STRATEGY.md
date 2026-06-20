# 16_TESTING_STRATEGY.md

# digital-kakejiku Testing Strategy

最終更新: 2026-06-20  
版: vNext 1.0

---

# 1. 目的

試験方針を定義する。本書は詳細試験仕様書ではない。

# 2. 文書位置付け

状態。

```text
DRAFT_ADOPTED
```

理由。

- A1～A4採択済み
- B2実装方針採択済み
- vNext 1.0文書セット作成済み
- 実装はPhase1 IN_PROGRESS

# 3. 基本方針

- 小さく実装
- 小さく試験
- 小さく修正

試験対象。

- GAS
- Spreadsheet
- Calendar
- Poem
- ESP32連携
- 背面保守UI連携

# 4. 試験レベル

| Level | 内容 |
| --- | --- |
| L1 | 単体試験 |
| L2 | 結合試験 |
| L3 | 障害試験 |
| L4 | 運用試験 |
| L5 | 受入試験 |


# 5. L1 単体試験

対象。

- SecurityManager
- ConfigManager
- LogSubsystem
- CalendarSubsystem
- PoemSubsystem
- Maintenance Handler

確認。

- secret検証
- device_id検証
- schema検証
- source_config取得
- system_config取得
- Script Properties取得
- Calendar生成
- Poem生成
- Prompt Version保存
- 禁止設定編集の拒否

# 6. L2 結合試験

API → Spreadsheet。

```text
ESP32
↓
doPost
↓
observation_log
```

Calendar → Poem。

```text
calendar_master
↓
PoemSubsystem
↓
poem_cache
```

Config → Calendar。

```text
source_config
season_dictionary
↓
CalendarSubsystem
```

Config → Poem。

```text
system_config
↓
PoemSubsystem
```

背面保守UI → GAS。

- Calendar再生成要求
- Poem再生成要求
- source_config編集不可
- system_config編集不可

# 7. L3 障害試験

Calendar失敗。

```text
CALENDAR_ERROR
↓
POEM_SKIPPED
```

Calendar未完了。

```text
CALENDAR_PENDING
Gemini APIを呼び出さない
```

Gemini失敗。

```text
POEM_RETRY
↓
POEM_ERROR
```

Config欠損。

```text
CONFIG_ERROR
```

認証失敗。

```text
SECURITY_ERROR
```

SPI Lock失敗。

```text
RESOURCE_LOCK_ERROR
```

# 8. L4 運用試験

- 12月1日の翌年生成
- 指定年Calendar再生成
- 指定期間Calendar再生成
- Poem再生成
- prompt_version変更のPoem反映
- Gemini設定変更のPoem反映
- 背面UIでは設定変更できないこと

# 9. L5 受入試験

Calendar確認。

- 祝日
- 二十四節気
- 七十二候
- 旧暦
- 六曜
- 月齢

Poem確認。

- タイトル生成
- 自由詩
- 客観描写
- 100文字前後
- 80～120文字
- 数値直接出力なし

禁止事項確認。

- 政治
- 宗教
- 説教
- 誘導
- 経済情報
- 暦名称そのまま使用

# 10. 状態試験

Calendar。

```text
SCHEDULED
CALENDAR_RUNNING
CALENDAR_RETRY
CALENDAR_READY
CALENDAR_ERROR
```

Poem。

```text
CALENDAR_PENDING
POEM_RUNNING
POEM_RETRY
POEM_READY
POEM_ERROR
POEM_SKIPPED
```

確認。

- 正常遷移
- Retry遷移
- 失敗遷移
- CALENDAR_PENDING
- POEM_SKIPPED

# 11. Spreadsheet整合性試験

対象。

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

確認。

- 列構成
- 必須項目
- 型整合
- 機密情報非保存
- prompt_version保存

# 12. 背面保守UI試験

許可操作。

- 状態確認
- 診断
- Calendar再生成
- Poem再生成
- 通信確認

禁止操作。

- source_config編集
- system_config編集
- URL編集
- Prompt編集
- Geminiモデル変更
- temperature変更
- API Key編集

# 13. 受入条件

- Payload保存成功
- Calendar生成成功
- Poem生成成功
- Retry正常動作
- Spreadsheet整合性維持
- 背面保守UIでは許可操作のみ可能

# 14. 将来追加予定

- 負荷試験
- 長期運用試験
- バックアップ試験
- 障害復旧試験
- 多端末試験

# 15. STATUS

| 項目 | 状態 |
| --- | --- |
| 試験方針 | DRAFT_ADOPTED |
| L1単体試験 | CONFIRMED |
| L2結合試験 | CONFIRMED |
| L3障害試験 | CONFIRMED |
| L4運用試験 | CONFIRMED |
| L5受入試験 | CONFIRMED |
| Calendar状態試験 | CONFIRMED |
| Poem状態試験 | CONFIRMED |
| 背面保守UI試験 | CONFIRMED |
| 自動試験 | PROPOSED |
| 手動試験 | PROPOSED |
| 負荷試験 | PROPOSED |


# 16. CHANGE LOG

| 日付 | 内容 |
| --- | --- |
| 2026-06-20 | vNext 1.0として全面再生成 |
| 2026-06-20 | 背面保守UI試験を追加 |
| 2026-06-20 | Prompt Version保存試験を追加 |
| 2026-06-20 | source_config/system_config編集禁止試験を追加 |
