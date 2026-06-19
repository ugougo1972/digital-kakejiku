# 10_CALENDAR_POEM_SUBSYSTEM.md

# digital-kakejiku Calendar / Poem Subsystem

最終更新: 2026-06-19

---

## 1. 目的

Calendar Subsystem および Poem Subsystem の責務、データフロー、エラー処理、運用方針を定義する。

本版は「原文保持＋査読反映＋整合性維持」を目的として以下を反映する。

- Calendar/Poem責務の明確化
- ESP32取得フローの明確化
- 表示時再生成禁止の強制方法追加
- エラー表示寿命の定義
- Gemini運用方針整理
- STATUS / CHANGE LOG追加

---

## 2. 基本方針

- Calendar生成はGAS側で実施する
- Poem生成はGAS側で実施する
- ESP32は表示専用とする
- AIによる暦生成は禁止
- AIによる暦推定は禁止
- AIによる欠損補完は禁止
- 表示時再生成は禁止
- 取得失敗時は「取得できません」

---

## 3. 使用シート

### Calendar

- source_config
- solar_term_master
- season_dictionary
- calendar_master

### Poem

- poem_cache

---

## 4. 全体フロー

```text
Calendar Job
    ↓
calendar_master

Poem Job
    ↓
poem_cache

ESP32
    ↓
calendar_master参照
    ↓
poem_cache参照
    ↓
表示
```

ESP32はCalendar生成・Poem生成を行わない。

---

## 5. Calendar Subsystem

### 情報源

| 項目 | 情報源 |
|---|---|
| 祝日 | 内閣府 |
| 二十四節気 | 国立天文台系 |
| 七十二候名称 | 固定マスタ |
| 解説 | source_config管理URL |

### 禁止事項

- AI生成
- AI推定
- AI補完

状態：FINALIZED

---

## 6. calendar_master

保持項目例

- date
- holiday
- solar_term
- season_name
- description
- status
- updated_at

生成主体

- GAS

状態：CONFIRMED

---

## 7. Poem Subsystem

### 入力

- calendar_master
- observation_log

### 出力

- poem_cache

### AI

- Gemini API Free Tier

用途

- 今日の詩

状態：CONFIRMED

---

## 8. poem_cache

保持項目例

- date
- poem_text
- status
- generated_at
- prompt_version

### 表示時再生成禁止

```text
date検索
 ↓
poem_cache取得
 ↓
status=ok
 ↓
表示

status=error
 ↓
取得できません
```

表示処理からGemini APIを呼び出してはならない。

状態：FINALIZED

---

## 9. ESP32取得方針

ESP32が取得するのは生成済みデータのみ。

対象

- calendar_master
- poem_cache

ESP32は以下を行わない。

- Calendar生成
- Poem生成
- Gemini API呼出

状態：FINALIZED

---

## 10. Calendarエラー処理

失敗時

- error_log記録
- calendar_master.status=error

表示

```text
取得できません
```

前回値流用禁止。

状態：FINALIZED

---

## 11. Poemエラー処理

失敗時

- error_log記録
- poem_cache.status=error

表示

```text
取得できません
```

代替詩生成禁止。

状態：FINALIZED

---

## 12. RTC_ERROR時

日付判定

- GAS側Asia/Tokyoを優先

ESP32時刻を正としない。

状態：CONFIRMED

---

## 13. Gemini運用方針

### 保存場所

- Script Properties

### 保存禁止

- Spreadsheet
- Log
- GitHub

### リトライ

初期方針

```text
失敗
 ↓
error_log
 ↓
次回定期実行
```

詳細な指数バックオフは実装時決定。

状態：PROPOSED

---

## 14. エラー表示寿命

| 状態 | 表示 | 継続条件 |
|---|---|---|
| Calendar Error | 取得できません | 正常生成まで |
| Poem Error | 取得できません | 正常生成まで |
| source_config Error | 取得できません | 復旧まで |

---

## 15. STATUS

| 項目 | 状態 |
|---|---|
| Calendar Subsystem | CONFIRMED |
| Poem Subsystem | CONFIRMED |
| calendar_master | CONFIRMED |
| poem_cache | CONFIRMED |
| AIによる暦生成禁止 | FINALIZED |
| AIによる暦補完禁止 | FINALIZED |
| 表示時Poem再生成禁止 | FINALIZED |
| RTC異常時GAS日付優先 | CONFIRMED |
| Gemini詳細リトライ | PROPOSED |
| 手動Poem再生成 | PROPOSED |

---

## 16. CHANGE LOG

| 日付 | 内容 |
|---|---|
| 2026-06-19 | ESP32取得フロー追加 |
| 2026-06-19 | 表示時再生成禁止を明文化 |
| 2026-06-19 | エラー表示寿命追加 |
| 2026-06-19 | Gemini運用方針整理 |
| 2026-06-19 | STATUS追加 |
