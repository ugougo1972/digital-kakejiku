# 10_CALENDAR_POEM_SUBSYSTEM.md

# digital-kakejiku Calendar / Poem Subsystem仕様

最終更新: 2026-06-19

---

## 1. 目的

本書は、digital-kakejiku における暦情報管理および「今日の詩」生成の仕様を定義する。

Calendar Subsystemは暦情報を扱う。

Poem SubsystemはGemini API Free Tierを用いて「今日の詩」を生成する。

両者は関連するが、責務を分離する。

---

## 2. 基本方針

- 暦情報はGAS側で管理する。
- ESP32側では暦情報を生成しない。
- Gemini APIは暦情報生成に使用しない。
- Gemini APIは「今日の詩」の生成に限定する。
- 取得失敗時は推測しない。
- 取得失敗時は前回値を流用しない。
- 取得失敗時は `error_log` に記録する。
- 表示時は「取得できません」と表示する。

- ESP32は暦情報を生成せず、GAS側で生成済みの `calendar_master` を参照する。
- ESP32は詩を生成せず、GAS側で生成済みの `poem_cache` を参照する。
- 表示要求を契機にGemini APIを呼び出してはならない。
- Calendar/Poemの日付基準はGAS側Asia/Tokyoを正とする。

---

## 3. 管理シート

| シート | 用途 |
|---|---|
| source_config | 外部情報源管理 |
| solar_term_master | 二十四節気マスタ |
| season_dictionary | 七十二候辞書 |
| calendar_master | 表示用統合カレンダー |
| poem_cache | 今日の詩キャッシュ |
| error_log | エラー記録 |
| system_log | ジョブ実行記録 |

---


---

## 3.1 全体データフロー

```text
GAS Trigger
  ├─ Calendar Subsystem
  │    ├─ source_config参照
  │    ├─ solar_term_master更新
  │    ├─ season_dictionary更新
  │    └─ calendar_master生成
  │
  └─ Poem Subsystem
       ├─ calendar_master参照
       ├─ observation_log参照
       ├─ Gemini API呼び出し
       └─ poem_cache保存

ESP32
  ├─ GASから表示用データ取得
  ├─ calendar_master由来データ表示
  └─ poem_cache由来データ表示
```

ESP32側はCalendar/Poemの生成責務を持たない。


## 4. Calendar Subsystem

### 4.1 目的

日付ごとの表示用暦情報を生成し、`calendar_master` に保存する。

### 4.2 情報源

| 項目 | 取得元 | 管理方法 |
|---|---|---|
| 祝日 | 内閣府 | source_config |
| 二十四節気 | 国立天文台 | solar_term_master |
| 七十二候名称 | 固定マスタ | season_dictionary |
| 七十二候の読み | source_config管理URL | season_dictionary |
| 七十二候の解説 | source_config管理URL | season_dictionary |
| 七十二候キーワード | source_config管理URL | season_dictionary |

### 4.3 AI禁止事項

Calendar Subsystemでは以下を禁止する。

- AIによる暦生成
- AIによる暦推定
- AIによる欠損補完
- 前回値流用
- 不明値のそれらしい置換

---

## 5. source_config

### 5.1 目的

外部情報源のURL、優先順位、有効状態を管理する。

### 5.2 列定義

| 項目 | 内容 |
|---|---|
| source_id | 情報源ID |
| category | holiday / solar_term / season_description等 |
| name | 情報源名 |
| url | 取得URL |
| priority | 優先順位 |
| enabled | 有効/無効 |
| fetch_method | csv/json/html/manual |
| last_checked_at | 最終確認日時 |
| note | 備考 |

---

## 6. solar_term_master

### 6.1 目的

二十四節気を年単位で保存する。

### 6.2 情報源

国立天文台。

### 6.3 列定義

| 項目 | 内容 |
|---|---|
| year | 年 |
| term_index | 1-24 |
| term_name | 節気名 |
| date | 日付 |
| datetime_jst | JST日時 |
| source_id | source_config参照 |
| fetched_at | 取得日時 |
| status | ok/error |
| note | 備考 |

---

## 7. season_dictionary

### 7.1 目的

七十二候の名称、読み、解説、キーワードを保存する。

### 7.2 方針

七十二候名称は固定マスタとする。

読み・解説・キーワードは `source_config` 管理URLに基づいて取得する。

### 7.3 列定義

| 項目 | 内容 |
|---|---|
| season_index | 1-72 |
| name | 七十二候名称 |
| reading | 読み |
| description | 解説 |
| keywords | キーワード |
| source_id | source_config参照 |
| fetched_at | 取得日時 |
| status | ok/error |
| note | 備考 |

---

## 8. calendar_master

### 8.1 目的

E-Paper表示用の統合カレンダーを保存する。

### 8.2 列定義

| 項目 | 内容 |
|---|---|
| date | 対象日 |
| year | 年 |
| month | 月 |
| day | 日 |
| weekday | 曜日 |
| rokuyo | 六曜 |
| holiday_name | 祝日 |
| solar_term_name | 二十四節気 |
| season_name | 七十二候 |
| season_reading | 七十二候読み |
| season_description | 七十二候解説 |
| season_keywords | キーワード |
| status | ok/error/partial |
| display_text | 表示用文字列 |
| updated_at | 更新日時 |
| note | 備考 |

### 8.3 失敗時

取得失敗時は以下とする。

- `status=error` または `partial`
- `display_text=取得できません`
- `error_log` 記録
- AI補完禁止

---

## 9. Calendar更新タイミング

### 自動

毎日00:05に実行する。

### 手動

背面OLEDの保守メニューから手動再生成を可能にする方針とする。

### 年次生成

年初または必要時に指定年分の `calendar_master` を生成する。

---


### 9.1 ESP32からの取得方針

ESP32は、表示更新時または定期同期時に、GAS側で生成済みの当日分表示データを取得する方針とする。

取得対象。

- `calendar_master` の当日行
- `poem_cache` の当日行
- 必要に応じた `system_log` の状態情報

表示時に暦情報を再生成してはならない。

### 9.2 Calendarキャッシュ方針

`calendar_master` をGAS側の正とする。

ESP32側に一時キャッシュを持つ場合でも、生成元はGAS側である。

キャッシュが古い場合は、以下を表示する。

```text
取得できません
```

前回値を当日値として流用してはならない。


---

## 10. Calendarエラー処理

### 記録先

`error_log`

### error_code例

| code | 内容 |
|---|---|
| CALENDAR-001 | calendar_master生成失敗 |
| CALENDAR-002 | 祝日取得失敗 |
| CALENDAR-003 | 二十四節気取得失敗 |
| CALENDAR-004 | 七十二候辞書取得失敗 |
| SOURCE-001 | source_config不備 |
| SOURCE-002 | 外部URL取得失敗 |

---


### 10.1 Calendarエラー表示寿命

| 状態 | 表示 | 継続 |
|---|---|---|
| 当日calendar_master正常 | 暦情報表示 | 次回更新まで |
| 当日calendar_master error | 取得できません | 次回正常生成まで |
| source_config異常 | 取得できません | source_config回復まで |
| 外部URL取得失敗 | 取得できません | 次回ジョブ成功まで |

Calendar失敗時は、Poem Subsystemへ欠損状態として渡す。

Geminiに欠損暦情報を補完させてはならない。


---

## 11. Poem Subsystem

### 11.1 目的

Gemini API Free Tierを用いて「今日の詩」を生成し、`poem_cache` に保存する。

### 11.2 用途

- 今日の詩
- 日めくり表示の余白文
- 観測データと暦情報に基づく短文生成

### 11.3 非用途

- 暦情報生成
- 暦情報推定
- 欠損補完
- センサー値の推定
- エラー時の代替暦生成

---

## 12. Poem入力

Poem Subsystemは以下を入力とする。

- `calendar_master`
- `observation_log`
- 必要に応じた `system_log`

入力に欠損がある場合は、欠損を明示した上で詩生成に使うか、生成失敗とする。

暦情報の欠損をGeminiに補完させてはならない。

---


### 12.1 欠損入力の扱い

入力に欠損がある場合、以下のいずれかとする。

| 欠損対象 | 動作 |
|---|---|
| calendar_masterがerror | 生成失敗とし、poem_cacheに「取得できません」 |
| 観測データが一部欠損 | 欠損を明示して生成するか、生成失敗とする |
| 観測データが全欠損 | 原則生成失敗 |
| RTC異常 | GAS側Asia/Tokyo日付を使用 |

暦欠損をGeminiへ補完させることは禁止する。


---

## 13. poem_cache

### 13.1 列定義

| 項目 | 内容 |
|---|---|
| date | 対象日 |
| generated_at | 生成日時 |
| model_name | Geminiモデル名 |
| prompt_version | Prompt版 |
| source_calendar_date | 参照したcalendar_master日付 |
| source_observation_range | 参照観測範囲 |
| poem_text | 詩本文 |
| status | ok/error |
| error_code | 失敗時コード |
| note | 備考 |

### 13.2 制約

- 1日1回生成
- 表示時再生成禁止
- 失敗時は「取得できません」
- 同日再生成は手動保守操作時のみ検討
- 失敗した詩を推測で補完しない

---


### 13.3 表示時再生成禁止の強制方法

表示側は以下の順で処理する。

```text
dateでpoem_cache検索
↓
status=okならpoem_textを表示
↓
status=errorまたは未生成なら「取得できません」を表示
↓
Gemini APIは呼び出さない
```

Gemini API呼び出しはPoem Subsystemの定期ジョブまたは明示的な保守操作に限定する。

通常表示アクセスでは再生成を行わない。


---

## 14. Poem生成タイミング

毎日00:10に実行する。

Calendar Subsystemの00:05実行後に行う。

```text
00:05 Calendar更新
↓
00:10 Poem生成
↓
poem_cache保存
```

---

## 15. Poemリトライ

### 方針

初回失敗時は最大3回まで再試行する。

### 間隔

10分間隔。

```text
1回目失敗
↓ 10分後
2回目
↓ 10分後
3回目
↓
失敗確定
```

### 失敗確定時

- `poem_cache.status=error`
- `poem_cache.poem_text=取得できません`
- `error_log` 記録
- 表示時再生成禁止

---

## 16. Prompt方針

Promptには以下を含める。

- 今日の日付
- calendar_master由来の暦情報
- 観測データの概要
- 欠損情報の明示
- 出力文字数目安
- 暦情報の生成・推定・補完禁止

Promptには以下を含めない。

- secret
- API Key
- 個人情報
- 未確認情報を断定する指示

---


---

## 16.1 Gemini API運用方針

Gemini API Free Tierを使用する。

ただし、Free TierのRPM、日次上限、モデル名、価格条件は変動し得るため、READMEや本書では固定値として断定しない。

実装時点で公式情報を確認し、以下をScript Propertiesまたは設定値として管理する。

| 項目 | 状態 |
|---|---|
| model_name | PROPOSED |
| daily_limit | PROPOSED |
| retry_interval | PROPOSED |
| max_retry | CONFIRMED |
| prompt_version | CONFIRMED |
| GEMINI_API_KEY | CONFIRMED |

### API Key管理

Gemini API KeyはGAS Script Propertiesで管理する。

Spreadsheetへ保存しない。

ログへ出力しない。

詳細は `11_SECURITY_MANAGEMENT.md` を正とする。


---

## 17. エラー時表示

CalendarまたはPoemの取得・生成に失敗した場合、表示側は以下を使用する。

```text
取得できません
```

表示側で代替文を生成しない。

---


### 17.1 表示側の禁止事項

表示側では以下を禁止する。

- 代替詩生成
- 暦補完
- 前回値流用
- Gemini API直接呼び出し
- エラー文の装飾生成

表示文は原則として以下に統一する。

```text
取得できません
```


---

## 18. 実装優先順位

1. source_config作成
2. calendar_master列定義
3. error_log連携
4. Calendar年次生成
5. poem_cache列定義
6. Gemini API KeyのScript Properties管理
7. 1日1回生成制御
8. 表示時再生成禁止制御

---

## 19. 確定度

| 項目 | 確定度 |
|---|---|
| Calendar Subsystem採択 | CONFIRMED |
| Poem Subsystem採択 | CONFIRMED |
| Gemini API Free Tier採択 | CONFIRMED |
| AIによる暦生成禁止 | FINALIZED |
| 表示時再生成禁止 | FINALIZED |
| 00:05/00:10実行時刻 | PROPOSED |


### 19.1 追加確定度

| 項目 | 確定度 |
|---|---|
| ESP32側で暦生成しない | FINALIZED |
| ESP32側でPoem生成しない | FINALIZED |
| GAS側Asia/Tokyo日付基準 | CONFIRMED |
| Poem表示時Gemini呼び出し禁止 | FINALIZED |
| Gemini APIクォータ固定値 | PROPOSED |
| ESP32側一時キャッシュ | PROPOSED |
| 手動再生成操作 | PROPOSED |

---

## 20. STATUS

| 項目 | 状態 | 備考 |
|---|---|---|
| Calendar Subsystem | CONFIRMED | GAS側実装 |
| Poem Subsystem | CONFIRMED | GAS側実装 |
| AIによる暦生成禁止 | FINALIZED | 欠損補完も禁止 |
| 表示時Poem再生成禁止 | FINALIZED | poem_cache参照 |
| Calendar失敗時表示 | FINALIZED | 取得できません |
| Poem失敗時表示 | FINALIZED | 取得できません |
| 00:05/00:10実行時刻 | PROPOSED | 実装時調整可 |
| Gemini Free Tier詳細 | PROPOSED | 実装時点で公式確認 |
| ESP32一時キャッシュ | PROPOSED | 生成元はGAS |

---

## 21. CHANGE LOG

| 日付 | 内容 | 理由 | 著者 |
|---|---|---|---|
| 2026-06-19 | ESP32取得フローを追記 | 査読指摘対応 | ChatGPT |
| 2026-06-19 | 表示時再生成禁止の強制方法を追記 | Poem責務明確化 | ChatGPT |
| 2026-06-19 | Calendar/Poemエラー表示寿命を追記 | UI仕様との整合 | ChatGPT |
| 2026-06-19 | Gemini API運用方針を追記 | Free Tier固定値断定回避 | ChatGPT |
| 2026-06-19 | STATUSセクション追加 | 確定度管理導入 | ChatGPT |
