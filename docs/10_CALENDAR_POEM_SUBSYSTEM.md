# digital-kakejiku Calendar / Poem Subsystem

最終更新: 2026-06-19

---

# 1. 目的

本ドキュメントは digital-kakejiku における Calendar Subsystem および Poem Subsystem の責務、データ構造、状態遷移、運用方針を定義する。

本サブシステムは以下を担当する。

* 暦情報生成
* 暦情報保持
* 今日の詩生成
* 詩キャッシュ保持
* Calendar → Poem依存制御
* エラー管理
* 定期実行管理

---

# 2. 基本方針

CalendarおよびPoem生成はGAS側で実施する。

ESP32は生成済みデータの表示のみを担当する。

採択事項。

* Calendar生成はGAS側
* Poem生成はGAS側
* ESP32は表示専用
* AIによる暦生成禁止
* AIによる暦推定禁止
* AIによる欠損補完禁止
* 表示時再生成禁止
* エラー時は「取得できません」を表示

状態。

```text
FINALIZED
```

---

# 3. 関連ドキュメント

```text
03_LOG_FORMAT.md

04_STATE_MACHINE.md

06_GAS_API_SPEC.md

07_DISPLAY_UI_SPEC.md

11_SECURITY_MANAGEMENT.md

12_CONFIGURATION_MANAGEMENT.md

14_SPREADSHEET_SCHEMA.md

15_GAS_IMPLEMENTATION_GUIDE.md

16_TESTING_STRATEGY.md
```

---

# 4. 使用シート

## 読み取り

```text
source_config

system_config

solar_term_master

season_dictionary

observation_log
```

---

## 読み書き

```text
calendar_master

poem_cache
```

状態。

```text
FINALIZED
```

---

# 5. 全体フロー

```text
Calendar Job
        ↓
calendar_master
        ↓
Poem Job
        ↓
poem_cache
        ↓
ESP32表示
```

ESP32は以下を行わない。

```text
Calendar生成

Poem生成

Gemini API呼出
```

状態。

```text
FINALIZED
```

---

# 6. Calendar Subsystem

## 責務

```text
祝日生成

二十四節気生成

七十二候生成

旧暦情報生成

六曜生成

月齢生成

calendar_master更新
```

---

## 情報源

| 項目     | 情報源                |
| ------ | ------------------ |
| 祝日     | 内閣府                |
| 二十四節気  | 国立天文台系             |
| 七十二候名称 | season_dictionary  |
| 解説     | source_config管理URL |

---

## 禁止事項

```text
AI生成

AI推定

AI補完
```

状態。

```text
FINALIZED
```

---

# 7. calendar_master

Primary Key。

```text
calendar_date
```

主要カラム。

```text
calendar_date

holiday_name

solar_term

season_name

lunar_date

rokuyo

moon_age

moon_phase

status

retry_count

error_code

updated_at
```

状態。

```text
CONFIRMED
```

---

## Calendar状態

```text
SCHEDULED

CALENDAR_RUNNING

CALENDAR_RETRY

CALENDAR_READY

CALENDAR_ERROR
```

状態。

```text
FINALIZED
```

---

## 保持期間

```text
過去5年

当年

翌年
```

状態。

```text
FINALIZED
```

---

## 年次生成

毎年。

```text
12月1日
```

翌年分生成。

状態。

```text
FINALIZED
```

---

# 8. Poem Subsystem

## 入力

```text
calendar_master

observation_log
```

---

## 出力

```text
poem_cache
```

---

## 利用AI

```text
Gemini API
```

用途。

```text
今日の詩
```

状態。

```text
CONFIRMED
```

---

# 9. Poem生成仕様

## 詩種

```text
自由詩
```

---

## 視点

```text
客観描写
```

---

## 長さ

```text
80～120文字
```

目標。

```text
100文字
```

---

## タイトル

```text
Gemini自由生成
```

---

## 数値出力

直接出力禁止。

禁止例。

```text
26.4℃
61%
712ppm
```

許可例。

```text
湿り気

穏やかな空気

静かな室内
```

---

## 使用禁止

```text
二十四節気名称そのまま

七十二候名称そのまま

祝日名称そのまま
```

状態。

```text
FINALIZED
```

---

# 10. poem_cache

Primary Key。

```text
poem_date
```

主要カラム。

```text
poem_date

generated_at

model_name

prompt_version

poem_title

poem_body

generation_status

retry_count

error_code
```

状態。

```text
CONFIRMED
```

---

# 11. Poem状態

```text
CALENDAR_PENDING

POEM_RUNNING

POEM_RETRY

POEM_READY

POEM_ERROR

POEM_SKIPPED
```

状態。

```text
FINALIZED
```

---

# 12. 表示時再生成禁止

```text
poem_cache検索
        ↓
POEM_READY
        ↓
表示
```

---

失敗時。

```text
POEM_ERROR
        ↓
取得できません
```

---

禁止。

```text
表示処理からGemini API呼出

表示処理からPoem生成

代替詩生成
```

状態。

```text
FINALIZED
```

---

# 13. Calendar → Poem依存関係

Poem実行前に以下を確認する。

```text
calendar_master.status
```

---

## 実行許可

```text
CALENDAR_READY
```

↓

```text
POEM_RUNNING
```

---

## 保留

```text
SCHEDULED

CALENDAR_RUNNING

CALENDAR_RETRY
```

↓

```text
CALENDAR_PENDING
```

---

## 実行禁止

```text
CALENDAR_ERROR
```

↓

```text
POEM_SKIPPED
```

状態。

```text
FINALIZED
```

---

# 14. Retry制御

設定取得元。

```text
system_config
```

---

## Calendar

```text
calendar_retry_max
```

初期値。

```text
3
```

---

## Poem

```text
poem_retry_max
```

初期値。

```text
3
```

状態。

```text
FINALIZED
```

---

# 15. 定期実行スケジュール

## Calendar Job

```text
02:00 Main

02:30 Retry1

03:00 Retry2

03:30 Retry3
```

---

## Poem Job

```text
02:10 Main

02:40 Retry1

03:10 Retry2

03:40 Retry3
```

状態。

```text
FINALIZED
```

---

# 16. Gemini運用方針

API Key保存先。

```text
Script Properties
```

---

保存禁止。

```text
Spreadsheet

Log

GitHub

ESP32
```

---

ESP32。

```text
Gemini API利用禁止
```

状態。

```text
FINALIZED
```

---

# 17. RTC異常時

判定基準。

```text
GAS側 Asia/Tokyo
```

優先。

ESP32 RTCを正としない。

状態。

```text
CONFIRMED
```

---

# 18. エラー処理

## Calendar

```text
CALENDAR_ERROR
```

記録先。

```text
error_log
```

表示。

```text
取得できません
```

前回値流用禁止。

---

## Poem

```text
POEM_ERROR
```

記録先。

```text
error_log
```

表示。

```text
取得できません
```

代替詩生成禁止。

状態。

```text
FINALIZED
```

---

# 19. エラー表示寿命

| 状態             | 表示      | 継続条件   |
| -------------- | ------- | ------ |
| CALENDAR_ERROR | 取得できません | 正常生成まで |
| POEM_ERROR     | 取得できません | 正常生成まで |
| CONFIG_ERROR   | 取得できません | 復旧まで   |

状態。

```text
FINALIZED
```

---

# 20. 手動保守

許可。

```text
Calendar再生成

Calendar範囲再生成
```

---

Poem再生成。

```text
保守用途のみ
```

状態。

```text
CONFIRMED
```

---

# 21. テスト対象

```text
Calendar状態遷移

Poem状態遷移

CALENDAR_PENDING

Retry制御

Calendar依存制御

表示時再生成禁止
```

参照。

```text
16_TESTING_STRATEGY.md
```

---

# 22. STATUS

| 項目                 | 状態        |
| ------------------ | --------- |
| Calendar Subsystem | FINALIZED |
| Poem Subsystem     | FINALIZED |
| calendar_master    | FINALIZED |
| poem_cache         | FINALIZED |
| Calendar保持期間       | FINALIZED |
| 年次生成               | FINALIZED |
| Calendar→Poem依存    | FINALIZED |
| CALENDAR_PENDING   | FINALIZED |
| Retry制御            | FINALIZED |
| AIによる暦生成禁止         | FINALIZED |
| AIによる暦補完禁止         | FINALIZED |
| 表示時Poem再生成禁止       | FINALIZED |
| Gemini API GAS限定   | FINALIZED |
| RTC異常時GAS優先        | CONFIRMED |
| 手動Poem再生成          | CONFIRMED |

---

# 23. CHANGE LOG

| 日付         | 内容                       |
| ---------- | ------------------------ |
| 2026-06-19 | Spreadsheet Schema整合     |
| 2026-06-19 | system_config反映          |
| 2026-06-19 | Retry制御追加                |
| 2026-06-19 | Calendar状態管理統合           |
| 2026-06-19 | Poem状態管理統合               |
| 2026-06-19 | Poem仕様詳細反映               |
| 2026-06-19 | Security/Configuration整合 |
| 2026-06-19 | Testing Strategy整合       |
