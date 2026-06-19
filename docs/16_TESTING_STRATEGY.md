# 16_TESTING_STRATEGY.md

# digital-kakejiku Testing Strategy

最終更新: 2026-06-19

---

# 1. 目的

本ドキュメントは digital-kakejiku における試験方針を定義する。

本書は詳細試験仕様書ではない。

実装前段階における試験戦略を定義し、GAS実装後に詳細試験項目へ展開することを目的とする。

---

# 2. 文書位置付け

状態。

```text
DRAFT
```

理由。

```text
A1～A4採択済み

B2実装方針採択済み

実装未着手
```

今後。

```text
実装
 ↓
試験実施
 ↓
詳細試験表作成
```

---

# 3. 基本方針

採用方針。

```text
小さく実装

小さく試験

小さく修正
```

---

試験対象。

```text
GAS

Spreadsheet

Calendar

Poem

ESP32連携
```

---

対象外。

```text
長期運用試験

量産試験

耐久試験
```

---

# 4. 試験レベル

## L1

単体試験

---

## L2

結合試験

---

## L3

障害試験

---

## L4

運用試験

---

## L5

受入試験

---

# 5. L1 単体試験

## SecurityManager

確認。

```text
secret検証

device_id検証

schema検証
```

期待。

```text
AUTH_ERROR

INVALID_DEVICE

SCHEMA_ERROR
```

---

## ConfigManager

確認。

```text
source_config取得

system_config取得

Script Properties取得
```

---

## LogSubsystem

確認。

```text
observation_log保存

event_log保存

error_log保存

system_log保存
```

---

## CalendarSubsystem

確認。

```text
Calendar生成

再生成

状態遷移
```

---

## PoemSubsystem

確認。

```text
Prompt生成

Gemini呼出

Poem保存

状態遷移
```

---

# 6. L2 結合試験

## API → Spreadsheet

フロー。

```text
ESP32
 ↓
doPost
 ↓
observation_log
```

確認。

```text
Payload保存
```

---

## Calendar → Poem

フロー。

```text
calendar_master
 ↓
PoemSubsystem
 ↓
poem_cache
```

確認。

```text
CALENDAR_READY
 ↓
POEM_READY
```

---

## Config → Calendar

フロー。

```text
source_config
 ↓
CalendarSubsystem
```

確認。

```text
設定反映
```

---

## Config → Poem

フロー。

```text
system_config
 ↓
PoemSubsystem
```

確認。

```text
Prompt反映

Gemini設定反映
```

---

# 7. L3 障害試験

## Calendar失敗

期待。

```text
CALENDAR_ERROR
```

---

Poem。

```text
POEM_SKIPPED
```

---

## Calendar未完了

期待。

```text
CALENDAR_PENDING
```

---

## Gemini失敗

期待。

```text
POEM_RETRY
```

---

Retry上限。

```text
POEM_ERROR
```

---

## Config欠損

期待。

```text
CONFIG_ERROR
```

---

## 認証失敗

期待。

```text
SECURITY_ERROR
```

---

# 8. L4 運用試験

## 年次生成

確認。

```text
12月1日
 ↓
翌年生成
```

---

## Calendar再生成

確認。

```text
指定年

指定期間
```

---

## Prompt更新

確認。

```text
prompt_version変更
 ↓
Poem反映
```

---

## Gemini設定変更

確認。

```text
model変更

temperature変更
```

---

# 9. L5 受入試験

## Calendar

確認。

```text
祝日

二十四節気

七十二候

旧暦

六曜

月齢
```

---

## Poem

確認。

```text
タイトル生成

自由詩

客観描写

100文字前後
```

---

## 禁止事項

確認。

```text
政治

宗教

説教

誘導

経済情報
```

---

## 数値出力

確認。

```text
直接出力なし
```

例。

禁止。

```text
26.4℃
61%
712ppm
```

許可。

```text
湿り気

穏やかな空気

静かな室内
```

---

# 10. Calendar状態試験

対象。

```text
SCHEDULED

CALENDAR_RUNNING

CALENDAR_RETRY

CALENDAR_READY

CALENDAR_ERROR
```

---

確認。

```text
正常遷移

Retry遷移

失敗遷移
```

---

# 11. Poem状態試験

対象。

```text
CALENDAR_PENDING

POEM_RUNNING

POEM_RETRY

POEM_READY

POEM_ERROR

POEM_SKIPPED
```

---

確認。

```text
依存関係

Retry

Error
```

---

# 12. Spreadsheet整合性試験

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

---

確認。

```text
列構成

必須項目

型整合
```

---

# 13. 自動試験候補

対象。

```text
SecurityManager

ConfigManager

CalendarSubsystem

状態遷移
```

状態。

```text
PROPOSED
```

---

# 14. 手動試験候補

対象。

```text
Poem品質

Calendar品質

表示品質
```

状態。

```text
PROPOSED
```

---

# 15. 受入条件

## API

```text
Payload保存成功
```

---

## Calendar

```text
生成成功
```

---

## Poem

```text
生成成功
```

---

## Retry

```text
正常動作
```

---

## Spreadsheet

```text
整合性維持
```

---

# 16. 将来追加予定

候補。

```text
負荷試験

長期運用試験

バックアップ試験

障害復旧試験
```

状態。

```text
PROPOSED
```

---

# 17. STATUS

| 項目           | 状態        |
| ------------ | --------- |
| 試験方針         | DRAFT     |
| L1単体試験       | CONFIRMED |
| L2結合試験       | CONFIRMED |
| L3障害試験       | CONFIRMED |
| L4運用試験       | CONFIRMED |
| L5受入試験       | CONFIRMED |
| Calendar状態試験 | CONFIRMED |
| Poem状態試験     | CONFIRMED |
| 自動試験         | PROPOSED  |
| 手動試験         | PROPOSED  |
| 負荷試験         | PROPOSED  |

---

# 18. CHANGE LOG

| 日付         | 内容              |
| ---------- | --------------- |
| 2026-06-19 | 新規作成            |
| 2026-06-19 | A2状態遷移反映        |
| 2026-06-19 | A4 Poem仕様反映     |
| 2026-06-19 | system_config反映 |
| 2026-06-19 | B1暫定採択反映        |
| 2026-06-19 | 実装前方針として整理      |
