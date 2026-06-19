# 03_LOG_FORMAT.md

# digital-kakejiku ログ・Spreadsheet形式

最終更新: 2026-06-19

---

## 1. 概要

本書は digital-kakejiku におけるログ保存形式および Google Spreadsheet のシート構成を定義する。

GAS本実装では、PoC用の `RawLogs` 単一保存から、責務分離された複数シート構成へ移行する。

---

## 2. 基本方針

- 1レコードを1行として保存する。
- シートごとに責務を分ける。
- `secret` は保存しない。
- raw JSONを保存する場合も、secretを除去またはマスクする。
- 文字コードはUTF-8とする。
- タイムゾーンはAsia/Tokyoとする。
- 取得不能値は推測で補完しない。
- 取得失敗は `error_log` に記録する。
- 表示不能時は「取得できません」とする。

- Payloadのフィールド数は、実装時点の `schema_version` ごとに確定する。
- 未確定フィールドを確定済みとして扱わない。
- GAS側では型検証、必須項目検証、機密値除去、物理的に不自然な値またはセンサー仕様逸脱値の検出を行う。
- 単位変換は原則としてESP32側で行い、GAS側は所定単位で受信した値として扱う。

---

## 3. 正式シート構成

| シート名 | 用途 | 優先度 |
|---|---|---:|
| observation_log | 環境観測データ | A |
| event_log | 操作・状態イベント | A |
| error_log | エラー情報 | A |
| system_log | システム状態 | A |
| source_config | 外部情報源管理 | B |
| solar_term_master | 二十四節気マスタ | B |
| season_dictionary | 七十二候辞書 | B |
| calendar_master | 表示用統合カレンダー | B |
| poem_cache | 今日の詩キャッシュ | C |

---

## 4. PoC用シートの扱い

### RawLogs

`RawLogs` は通信PoC用シートである。

GAS本実装では正式保存先としない。

保持する場合は、過去検証ログの参照用とする。

---

## 5. observation_log

### 用途

環境観測データを保存する。

### 列定義

| 列 | 項目 | 型 | 単位 | 内容 |
|---:|---|---|---|---|
| 1 | server_received_at | datetime | - | GAS受信時刻 |
| 2 | device_id | string | - | 端末識別子 |
| 3 | device_timestamp | datetime/string | - | RTC基準時刻 |
| 4 | firmware_version | string | - | firmware version |
| 5 | schema_version | string | - | payload schema |
| 6 | co2_ppm | number/null | ppm | SCD41 |
| 7 | temperature_c | number/null | ℃ | BME680またはSCD41 |
| 8 | humidity_pct | number/null | % | BME680またはSCD41 |
| 9 | pressure_hpa | number/null | hPa | BME680 |
| 10 | voc_index | number/null | index | SGP41 |
| 11 | nox_index | number/null | index | SGP41 |
| 12 | lux | number/null | lx | LTR390 |
| 13 | uv | number/null | - | LTR390 |
| 14 | pm1_0 | number/null | µg/m³ | SPS30 |
| 15 | pm2_5 | number/null | µg/m³ | SPS30 |
| 16 | pm4_0 | number/null | µg/m³ | SPS30 |
| 17 | pm10 | number/null | µg/m³ | SPS30 |
| 18 | presence | number/null | 0/1 | HLK-LD2410C |
| 19 | sound_level | number/null | 未確定 | ICS-43434 |
| 20 | battery_v | number/null | V | バッテリー電圧 |
| 21 | usb_power | number/null | 0/1 | USB給電状態 |
| 22 | rssi | number/null | dBm | Wi-Fi RSSI |
| 23 | raw_json | string | - | secret除去済みJSON |


### 5.1.1 追加検討フィールド

以下は査読指摘を受けた追加検討項目である。現時点では `PROPOSED` とし、確定済みフィールド数には含めない。

| 項目 | 型 | 必須 | 内容 | 状態 |
|---|---|---|---|---|
| timestamp_validity | string | 任意 | RTC/NTP/仮時刻等の時刻信頼度 | PROPOSED |
| boot_count | number | 任意 | 起動回数 | PROPOSED |
| wakeup_reason | string | 任意 | 起動要因。PoC成果保持用 | PROPOSED |
| message_id | string | 任意 | 重複検出用ID | PROPOSED |
| retry_count | number | 任意 | 再送回数 | PROPOSED |

### 5.1.2 値の妥当性検証

GAS側では、型、null許容、物理的に不自然な値、センサー仕様逸脱値を検出する。

初期実装では、厳密な範囲で拒否するのではなく、異常疑いとして `error_log` または `note` に記録する方針とする。

具体的な閾値は、各センサーの実機確認後に `PROPOSED` から `CONFIRMED` へ昇格する。

### 未取得値

センサー未搭載、取得失敗、初期化未完了の場合は `null` とする。項目自体は省略しない。

---

## 6. event_log

### 用途

操作、状態変化、UI遷移を保存する。

### 列定義

| 列 | 項目 | 型 | 内容 |
|---:|---|---|---|
| 1 | server_received_at | datetime | GAS受信時刻 |
| 2 | device_id | string | 端末識別子 |
| 3 | device_timestamp | datetime/string | RTC基準時刻 |
| 4 | firmware_version | string | firmware version |
| 5 | schema_version | string | payload schema |
| 6 | event | string | イベント名 |
| 7 | value | string | 値 |
| 8 | detail | string | 詳細 |
| 9 | raw_json | string | secret除去済みJSON |

### 主なevent値

| event | 内容 |
|---|---|
| boot | 起動 |
| shutdown | シャットダウン準備 |
| encoder_cw | エンコーダ右回転 |
| encoder_ccw | エンコーダ左回転 |
| encoder_push | 押下 |
| page_change | 画面切替 |
| display_update | 表示更新 |
| usb_power_lost | USB給電喪失 |
| usb_power_restore | USB給電復帰 |
| calendar_refresh | 暦更新 |
| poem_generated | 詩生成 |
| maintenance_action | 保守操作 |

---

## 7. error_log

### 用途

GAS、ESP32、外部情報源、AI生成、表示、通信の失敗を保存する。

### 列定義

| 列 | 項目 | 型 | 内容 |
|---:|---|---|---|
| 1 | server_received_at | datetime | GAS記録時刻 |
| 2 | device_id | string | 端末識別子。GAS内部エラーは空欄可 |
| 3 | device_timestamp | datetime/string | RTC基準時刻 |
| 4 | module | string | 発生モジュール |
| 5 | error_code | string | エラーコード |
| 6 | error_detail | string | 詳細 |
| 7 | severity | string | info/warn/error/fatal |
| 8 | source | string | esp32/gas/calendar/poem/display等 |
| 9 | raw_json | string | secret除去済みJSON |

### module値

| module | 内容 |
|---|---|
| sensor | センサー |
| rtc | RTC |
| network | Wi-Fi / HTTPS |
| storage | microSD |
| display | E-Paper / OLED |
| power | 電源 |
| gas | GAS内部 |
| calendar | Calendar Subsystem |
| source | 外部情報源 |
| poem | Poem Subsystem |
| security | 認証・権限 |
| system | システム全体 |


### 7.1 ERROR_LOG 判定基準

査読指摘を反映し、ERROR_LOGへの記録基準を以下の通り管理する。

| エラー種別 | 記録条件 | 重大度 | 状態 |
|---|---|---|---|
| SENSOR_ERROR | 初期化失敗1回 | warn | CONFIRMED |
| SENSOR_ERROR | 取得失敗1回 | info | PROPOSED |
| SENSOR_ERROR | 連続取得失敗3回 | warn | PROPOSED |
| SENSOR_ERROR | 連続取得失敗10回 | error | PROPOSED |
| STORAGE_ERROR | microSD mount失敗1回 | error | CONFIRMED |
| STORAGE_ERROR | 書込失敗1回 | error | CONFIRMED |
| NETWORK_ERROR | 通信失敗1回 | info | PROPOSED |
| NETWORK_ERROR | 連続通信失敗3回 | warn | PROPOSED |
| RTC_ERROR | RTC読取失敗1回 | error | CONFIRMED |
| CALENDAR_ERROR | 暦情報取得失敗1回 | warn | CONFIRMED |
| POEM_ERROR | Gemini API失敗または生成失敗 | warn | CONFIRMED |
| SECURITY_ERROR | 認証失敗 | warn | CONFIRMED |

上記回数は初期値であり、実装・運用結果に基づいて変更する。

### 7.2 主要センサーの定義

主要センサーは、表示・観測目的への影響が大きい以下とする。

- SCD41
- SPS30
- BME680
- RTC

LTR390、SGP41、LD2410C、ICS-43434は、初期実装では補助センサーとして扱う。ただし用途が確定した段階で主要センサーへ昇格可能とする。

### error_code例

| error_code | 内容 |
|---|---|
| AUTH-001 | secret不一致 |
| AUTH-002 | device_id未指定 |
| REQ-001 | JSON解析失敗 |
| REQ-002 | 必須項目不足 |
| REQ-003 | 未対応type |
| SHEET-001 | Spreadsheet書込失敗 |
| CALENDAR-001 | 暦情報取得失敗 |
| SOURCE-001 | source_config取得失敗 |
| POEM-001 | Gemini API失敗 |
| GAS-001 | GAS内部例外 |

---

## 8. system_log

### 用途

システム状態、定期処理、保守処理を保存する。

### 列定義

| 列 | 項目 | 型 | 内容 |
|---:|---|---|---|
| 1 | server_received_at | datetime | GAS記録時刻 |
| 2 | device_id | string | 端末識別子 |
| 3 | device_timestamp | datetime/string | RTC基準時刻 |
| 4 | event | string | システムイベント |
| 5 | detail | string | 詳細 |
| 6 | firmware_version | string | firmware version |
| 7 | schema_version | string | schema version |
| 8 | raw_json | string | secret除去済みJSON |

### 主なevent値

- init_complete
- rtc_sync
- network_connect
- network_disconnect
- storage_mount
- storage_unmount
- display_refresh
- calendar_job_start
- calendar_job_end
- poem_job_start
- poem_job_end
- maintenance_start
- maintenance_end

---


---

## 8.1 RTC_ERROR時のタイムスタンプ扱い

RTC異常時も観測は継続する。

### ESP32側

RTC読取に失敗した場合、ESP32は以下のいずれかを `device_timestamp` に設定する。

| 状態 | device_timestamp | timestamp_validity |
|---|---|---|
| RTC正常 | RTC由来ISO 8601 | rtc |
| NTP補正済み | NTP補正後ISO 8601 | ntp |
| RTC異常・NTP不可 | 仮時刻または起動後経過時間併記 | estimated |
| 時刻不明 | nullまたは文字列 | invalid |

### GAS側

GAS側は `timestamp_validity` または `device_timestamp` の異常を検出した場合、以下を行う。

- `error_log` に `RTC_ERROR` または `TIMESTAMP_INVALID` を記録する。
- `observation_log` には受信行を保存する。
- `server_received_at` を正規の受信時刻として保持する。
- Calendar SubsystemおよびPoem Subsystemの日付判定には、異常な `device_timestamp` を使用しない。

Calendar/Poemの日付基準は、GAS側のAsia/Tokyo基準日を優先する。


---

## 9. source_config

### 用途

外部情報源のURL、優先順位、取得方針を管理する。

### 列定義

| 列 | 項目 | 型 | 内容 |
|---:|---|---|---|
| 1 | source_id | string | 情報源ID |
| 2 | category | string | holiday/solar_term/season_description等 |
| 3 | name | string | 情報源名 |
| 4 | url | string | 取得URL |
| 5 | priority | number | 優先順位 |
| 6 | enabled | boolean/string | 有効/無効 |
| 7 | fetch_method | string | csv/json/html/manual等 |
| 8 | last_checked_at | datetime | 最終確認日時 |
| 9 | note | string | 備考 |

---

## 10. solar_term_master

### 用途

二十四節気を管理する。

### 情報源

国立天文台。

### 列定義

| 列 | 項目 | 型 | 内容 |
|---:|---|---|---|
| 1 | year | number | 年 |
| 2 | term_index | number | 1-24 |
| 3 | term_name | string | 節気名 |
| 4 | date | date | 日付 |
| 5 | datetime_jst | datetime/string | JST日時 |
| 6 | source_id | string | source_config参照 |
| 7 | fetched_at | datetime | 取得日時 |
| 8 | status | string | ok/error |
| 9 | note | string | 備考 |

---

## 11. season_dictionary

### 用途

七十二候の名称、読み、解説、キーワードを管理する。

### 方針

- 七十二候名称は固定マスタとする。
- 読み・解説・キーワードはsource_config管理URL由来とする。
- 推測禁止。
- 前回値流用禁止。

### 列定義

| 列 | 項目 | 型 | 内容 |
|---:|---|---|---|
| 1 | season_index | number | 1-72 |
| 2 | name | string | 七十二候名称 |
| 3 | reading | string | 読み |
| 4 | description | string | 解説 |
| 5 | keywords | string | カンマ区切り |
| 6 | source_id | string | source_config参照 |
| 7 | fetched_at | datetime | 取得日時 |
| 8 | status | string | ok/error |
| 9 | note | string | 備考 |

---

## 12. calendar_master

### 用途

表示用統合カレンダーを管理する。

### 列定義

| 列 | 項目 | 型 | 内容 |
|---:|---|---|---|
| 1 | date | date | 対象日 |
| 2 | year | number | 年 |
| 3 | month | number | 月 |
| 4 | day | number | 日 |
| 5 | weekday | string | 曜日 |
| 6 | rokuyo | string/null | 六曜 |
| 7 | holiday_name | string/null | 祝日 |
| 8 | solar_term_name | string/null | 二十四節気 |
| 9 | season_name | string/null | 七十二候 |
| 10 | season_reading | string/null | 七十二候読み |
| 11 | season_description | string/null | 七十二候解説 |
| 12 | season_keywords | string/null | キーワード |
| 13 | status | string | ok/error/partial |
| 14 | display_text | string | 表示用文字列 |
| 15 | updated_at | datetime | 更新日時 |
| 16 | note | string | 備考 |


### 12.1 Calendarエラー記録方針

Calendar取得失敗時は以下を記録する。

| 記録先 | 内容 |
|---|---|
| calendar_master.status | error または partial |
| calendar_master.display_text | 取得できません |
| error_log.module | calendar または source |
| error_log.error_code | CALENDAR-xxx / SOURCE-xxx |

前回値流用およびAI補完は禁止する。

### 取得失敗時

- `status` に `error` または `partial` を記録する。
- `display_text` は「取得できません」とする。
- AIによる補完は禁止する。

---

## 13. poem_cache

### 用途

「今日の詩」を保存する。

### 列定義

| 列 | 項目 | 型 | 内容 |
|---:|---|---|---|
| 1 | date | date | 対象日 |
| 2 | generated_at | datetime | 生成日時 |
| 3 | model_name | string | Geminiモデル名 |
| 4 | prompt_version | string | Prompt版 |
| 5 | source_calendar_date | date | 参照したcalendar_master日付 |
| 6 | source_observation_range | string | 参照観測範囲 |
| 7 | poem_text | string | 詩本文 |
| 8 | status | string | ok/error |
| 9 | error_code | string | 失敗時コード |
| 10 | note | string | 備考 |


### 13.1 Poemエラー記録方針

Poem生成失敗時は以下を記録する。

| 記録先 | 内容 |
|---|---|
| poem_cache.status | error |
| poem_cache.poem_text | 取得できません |
| poem_cache.error_code | POEM-xxx |
| error_log.module | poem |
| error_log.source | gas |

表示時にGemini APIを再呼び出ししない。

### 制約

- 1日1回生成
- 表示時再生成禁止
- 失敗時は「取得できません」
- 暦情報生成禁止
- 暦情報推定禁止
- 欠損補完禁止

---

## 14. raw_json保存ルール

raw_jsonを保存する場合は、以下を除去またはマスクする。

- secret
- access_token
- API key
- Wi-Fi password
- 個人情報に相当する値

推奨処理。

```text
raw_json = JSON.stringify(removeSensitiveFields(payload))
```

---


---

## 14.1 セキュリティ関連ログ方針

機密値はログへ保存しない。

対象。

- secret
- GEMINI_API_KEY
- Wi-Fi password
- access_token
- Authorization header

詳細は `11_SECURITY_MANAGEMENT.md` を正とする。


---

## 15. ローカルmicroSDログ方針

ESP32側では通信成功有無に関係なくmicroSDへ保存する。

- 送信前にmicroSDへ保存する
- GAS送信成功後に送信済みとして扱う
- 送信失敗時は未送信キューへ残す
- 次回通信可能時に再送する
- 再送順序は古いデータを優先する

---

## 16. 実装優先順位

1. observation_log
2. event_log
3. error_log
4. system_log
5. source_config
6. solar_term_master
7. season_dictionary
8. calendar_master
9. poem_cache

---

## 17. 旧仕様からの変更点

| 旧仕様 | 新仕様 |
|---|---|
| RawLogs | PoC用。正式保存先から除外 |
| ContextLogs | calendar_master等へ責務分離 |
| GeminiLogs / AI_LOG | poem_cacheへ整理 |
| secretをraw JSONに含む可能性 | secret保存禁止 |
| 暦情報とAI生成が混在 | CalendarとPoemを分離 |

---

## 18. STATUS

| 項目 | 状態 | 備考 |
|---|---|---|
| 正式シート構成 | CONFIRMED | observation/event/error/system + Calendar/Poem |
| RawLogsの扱い | FINALIZED | PoC用。正式保存先から除外 |
| secret保存禁止 | FINALIZED | raw_json保存時も除去またはマスク |
| Calendar/Poem失敗時表示 | FINALIZED | 取得できません |
| ERROR_LOG判定基準 | PROPOSED | 回数閾値は実装・運用で調整 |
| timestamp_validity | PROPOSED | RTC_ERROR対策として追加検討 |
| message_id/retry_count | PROPOSED | 重複検出・再送管理用 |

---

## 19. CHANGE LOG

| 日付 | 内容 | 理由 | 著者 |
|---|---|---|---|
| 2026-06-19 | ERROR_LOG判定基準を追加 | Claude査読指摘対応 | ChatGPT |
| 2026-06-19 | RTC_ERROR時のtimestamp扱いを追加 | GAS/Calendar/Poem連携時の不整合防止 | ChatGPT |
| 2026-06-19 | Payload追加検討フィールドを明示 | 21/25フィールド混在指摘への対応 | ChatGPT |
| 2026-06-19 | STATUSセクションを追加 | 確定度管理導入 | ChatGPT |
