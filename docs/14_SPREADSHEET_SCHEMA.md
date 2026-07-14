# digital-kakejiku Spreadsheet Schema

最終更新: 2026-07-14
文書版: vNext 1.3
STATUS: FINALIZED

---

# 1. 文書の目的

本書は **digital-kakejiku** プロジェクトで使用する Google Spreadsheet の構造を定義する唯一の正式仕様（Single Source of Truth）である。

本書では以下を定義する。

- Spreadsheet全体構成
- 各シートの役割
- Primary Key
- カラム構成
- データ型
- 必須項目
- 制約事項
- シート間の関連

一方、以下は本書の対象外とする。

- ログ出力条件
- ログレベル
- 保持期間
- Retry制御
- Job運用
- API仕様

これらは各基準文書を参照する。

| 内容 | 基準文書 |
|------|---------|
| API仕様 | 06_GAS_API_SPEC.md |
| ログ運用 | 03_LOG_FORMAT.md |
| Retry制御 | 18_GAS_RETRY_STRATEGY.md |
| GAS運用 | 13_GAS_OPERATION_POLICY.md |
| セキュリティ | 11_SECURITY_MANAGEMENT.md |

---

# 2. Spreadsheet構成

Spreadsheet名

```text
digital-kakejiku-config
```

全10シートで構成する。

| No | シート名 | 用途 | 更新元 |
|----|----------|------|---------|
|1|observation_log|観測データ保存|ESP32|
|2|event_log|イベントログ|GAS|
|3|error_log|障害ログ|GAS|
|4|system_log|運用ログ|GAS|
|5|source_config|情報源設定|管理者|
|6|system_config|システム設定|管理者|
|7|solar_term_master|二十四節気マスタ|管理者|
|8|season_dictionary|七十二候マスタ|管理者|
|9|calendar_master|暦生成結果|CalendarGenerator|
|10|poem_cache|生成済み詩キャッシュ|PoemGenerator|

---

## 2.1 シート関係図

```text
                     source_config
                           │
                           │
solar_term_master          │
          │                │
          ├──────────────┐
          │              │
season_dictionary         │
          │              │
          ▼              ▼
      CalendarGenerator
              │
              ▼
      calendar_master
              │
              ▼
       PoemGenerator
              │
              ▼
        poem_cache


ESP32
   │
   ▼
observation_log

GAS
 ├── event_log
 ├── error_log
 └── system_log
```

---

## 2.2 シート更新主体

| シート | 更新主体 |
|---------|---------|
|observation_log|ESP32|
|event_log|GAS|
|error_log|GAS|
|system_log|GAS|
|source_config|管理者|
|system_config|管理者|
|solar_term_master|管理者|
|season_dictionary|管理者|
|calendar_master|CalendarGenerator|
|poem_cache|PoemGenerator|

---

## 2.3 命名規則

### シート名

- 小文字
- snake_case
- 英数字のみ

例

```text
calendar_master
```

---

### カラム名

- 小文字
- snake_case
- 英数字のみ

例

```text
battery_voltage
retry_count
schema_version
```

---

### Primary Key

各シートには論理Primary Keyを持たせる。

重複は禁止する。

---

# 3. 共通設計方針

## 3.1 データ型

| Type | 内容 |
|------|------|
|STRING|文字列|
|INTEGER|整数|
|FLOAT|実数|
|BOOLEAN|真偽値|
|DATE|日付|
|DATETIME|日時|

---

## 3.2 必須項目

Required = YES の項目は必ず値を保持する。

NULLは禁止。

---

## 3.3 タイムスタンプ

日時はすべて

```text
Asia/Tokyo
```

を基準とする。

保存形式

```text
yyyy-MM-dd HH:mm:ss
```

---

## 3.4 更新日時

設定系マスタは

```text
updated_at
```

を保持する。

ログ系データは

```text
created_at
```

を保持する。

受信ログは

```text
server_timestamp
```

を保持する。

---

## 3.5 Primary Key

各シートで定義するPrimary Keyは

- 一意
- 更新不可
- NULL不可

とする。

---

## 3.6 機密情報

以下はSpreadsheetへ保存してはならない。

- API_SECRET
- GEMINI_API_KEY
- PASSWORD
- OAuth Token
- Refresh Token
- Access Token
- Cookie
- Session ID

ESP32から受信したJSONを保存する場合は、

```text
secret
```

を必ず削除したコピーのみ保存する。

---

## 3.7 バージョン管理

観測データには

```text
schema_version
```

を保持する。

これにより将来の列追加・削除に対応する。

---

## 3.8 他文書との責務分離

本書は

**データ構造**

のみを定義する。

ログ出力条件

Retry

保持期間

通知条件

などの運用仕様は対象外とする。

詳細は以下を参照する。

- 03_LOG_FORMAT.md
- 06_GAS_API_SPEC.md
- 11_SECURITY_MANAGEMENT.md
- 13_GAS_OPERATION_POLICY.md
- 18_GAS_RETRY_STRATEGY.md

# 4. observation_log

## 4.1 目的

ESP32から送信される観測データを保存する。

本シートは観測値の永続保存を目的とし、
表示用・分析用・再生成用の一次情報となる。

更新主体

```text
ESP32
```

更新タイミング

```text
観測データ送信毎
```

参照モジュール

- CalendarGenerator
- ObservationAnalyzer
- GAS API
- 保守ツール

---

## 4.2 Primary Key

```text
message_id
```

message_idはESP32で生成する。

同一message_idの重複登録は禁止する。

---

## 4.3 カラム定義

| Column | Type | Required | Description |
|---------|------|----------|-------------|
| message_id | STRING | YES | 一意なメッセージID |
| timestamp | DATETIME | YES | ESP32観測日時 |
| server_timestamp | DATETIME | YES | GAS受信日時 |
| device_id | STRING | YES | 端末ID |
| retry_count | INTEGER | YES | Retry回数 |
| boot_count | INTEGER | YES | 起動回数 |
| wakeup_reason | STRING | YES | Wakeup理由 |
| timestamp_validity | STRING | YES | RTC状態 |
| temperature | FLOAT | NO | 温度(℃) |
| humidity | FLOAT | NO | 湿度(%) |
| pressure | FLOAT | NO | 気圧(hPa) |
| co2 | FLOAT | NO | CO₂(ppm) |
| voc_index | FLOAT | NO | VOC Index |
| nox_index | FLOAT | NO | NOx Index |
| pm1_0 | FLOAT | NO | PM1.0 |
| pm2_5 | FLOAT | NO | PM2.5 |
| pm4_0 | FLOAT | NO | PM4.0 |
| pm10 | FLOAT | NO | PM10 |
| illuminance | FLOAT | NO | 照度(lx) |
| uv_index | FLOAT | NO | UV Index |
| motion_detected | BOOLEAN | NO | 人感検知 |
| sound_level | FLOAT | NO | 騒音レベル |
| battery_voltage | FLOAT | NO | バッテリー電圧(V) |
| battery_percent | FLOAT | NO | バッテリー残量(%) |
| battery_current | FLOAT | NO | バッテリー電流(mA) |
| input_voltage | FLOAT | NO | USB入力電圧(V) |
| input_current | FLOAT | NO | USB入力電流(mA) |
| power_mode | STRING | NO | 電源モード |
| wifi_rssi | INTEGER | NO | RSSI |
| firmware_version | STRING | NO | FWバージョン |
| schema_version | STRING | YES | スキーマ版 |
| payload | STRING | NO | secret除去済JSON |
| created_at | DATETIME | YES | 保存日時 |

---

## 4.4 制約

message_id

- NULL禁止
- 重複禁止
- 更新禁止

timestamp

- JST
- ESP32生成

server_timestamp

- GAS生成
- JST

created_at

- 保存時刻
- GAS生成

---

## 4.5 payload保存規則

payloadへ保存するJSONは

```text
secret
```

を削除したコピーのみ保存する。

保存例

```json
{
  "device_id":"DK001",
  "message_id":"MSG202607140001",
  "temperature":25.3
}
```

保存禁止

```text
secret
API_SECRET
PASSWORD
OAuth Token
Refresh Token
Access Token
Cookie
Session ID
```

---

## 4.6 データ取得元

| 項目 | センサー |
|------|----------|
| temperature | BME680 |
| humidity | BME680 |
| pressure | BME680 |
| co2 | SCD41 |
| voc_index | SGP41 |
| nox_index | SGP41 |
| pm1_0 | SPS30 |
| pm2_5 | SPS30 |
| pm4_0 | SPS30 |
| pm10 | SPS30 |
| illuminance | LTR390 |
| uv_index | LTR390 |
| motion_detected | LD2410C |
| sound_level | ICS-43434 |

---

## 4.7 インデックス推奨

検索性能向上のため

```text
message_id
timestamp
device_id
```

を検索キーとして利用することを推奨する。

---

## 4.8 データライフサイクル

```text
ESP32

    │

    ▼

POST(API)

    │

    ▼

Validation

    │

    ▼

secret除去

    │

    ▼

Spreadsheet保存

    │

    ▼

CalendarGenerator参照

    │

    ▼

PoemGenerator参照
```

---

## 4.9 備考

本シートは観測データの原本である。

観測データの加工・分析・集計は本シートを書き換えず、
別シートまたはメモリ上で実施する。

本シートはAppend Onlyとし、
既存レコードの更新は行わない。

# 5. event_log

## 5.1 目的

ESP32・GAS・管理機能で発生する通常イベントを記録する。

本シートは障害ログ(error_log)とは区別し、
システム動作履歴を保存する。

更新主体

```text
GAS
```

更新タイミング

```text
イベント発生時
```

参照モジュール

- EventLogger
- SystemMonitor
- 管理画面

---

## 5.2 Primary Key

```text
event_id
```

UUIDまたは一意なIDを使用する。

---

## 5.3 カラム定義

| Column | Type | Required | Description |
|---------|------|----------|-------------|
| event_id | STRING | YES | イベントID |
| timestamp | DATETIME | YES | 発生日時 |
| subsystem | STRING | YES | 発生モジュール |
| category | STRING | YES | イベント分類 |
| event_type | STRING | YES | イベント種別 |
| severity | STRING | YES | INFO/WARN |
| message | STRING | YES | 内容 |
| detail | STRING | NO | 詳細 |
| related_id | STRING | NO | message_id等 |
| created_at | DATETIME | YES | 保存日時 |

---

## 5.4 category

```text
SYSTEM
POWER
DISPLAY
NETWORK
CALENDAR
POEM
CONFIG
MAINTENANCE
```

---

## 5.5 severity

```text
INFO
WARN
```

---

## 5.6 運用方針

正常系イベントのみ保存する。

異常終了・例外は
error_logへ保存する。

---

# 6. error_log

## 6.1 目的

障害・例外・APIエラー・Retry発生を保存する。

更新主体

```text
GAS
```

更新タイミング

```text
例外発生時
```

参照モジュール

- ErrorLogger
- RetryManager
- SecurityManager

---

## 6.2 Primary Key

```text
error_id
```

---

## 6.3 カラム定義

| Column | Type | Required | Description |
|---------|------|----------|-------------|
| error_id | STRING | YES | エラーID |
| timestamp | DATETIME | YES | 発生日時 |
| subsystem | STRING | YES | 発生モジュール |
| error_code | STRING | YES | エラーコード |
| severity | STRING | YES | ERROR/FATAL |
| message | STRING | YES | エラー内容 |
| detail | STRING | NO | 詳細 |
| stacktrace | STRING | NO | StackTrace |
| retry_count | INTEGER | NO | Retry回数 |
| related_id | STRING | NO | message_id等 |
| created_at | DATETIME | YES | 保存日時 |

---

## 6.4 severity

```text
ERROR

FATAL
```

---

## 6.5 保存対象

保存対象

- Runtime Exception
- Validation Error
- Retry Error
- API Error
- Gemini Error
- Calendar Error

保存しない

- INFO
- DEBUG

---

## 6.6 セキュリティ

以下は保存禁止

- API_SECRET
- PASSWORD
- OAuth Token
- Access Token
- Refresh Token
- Cookie
- Session ID

StackTraceへも機密情報を残してはならない。

---

# 7. system_log

## 7.1 目的

システム運用状況を保存する。

error_logとの違いは

障害ではなく

運用状態

を記録する点である。

更新主体

```text
GAS
```

更新タイミング

```text
Job開始・終了
HealthCheck
保守操作
```

参照モジュール

- SystemLogger
- HealthCheck
- Scheduler

---

## 7.2 Primary Key

```text
log_id
```

---

## 7.3 カラム定義

| Column | Type | Required | Description |
|---------|------|----------|-------------|
| log_id | STRING | YES | ログID |
| timestamp | DATETIME | YES | 発生日時 |
| module | STRING | YES | モジュール |
| operation | STRING | YES | 操作 |
| status | STRING | YES | 実行結果 |
| message | STRING | NO | 内容 |
| duration_ms | INTEGER | NO | 実行時間 |
| created_at | DATETIME | YES | 保存日時 |

---

## 7.4 operation

```text
HEALTHCHECK

START

STOP

GENERATE

UPDATE

DELETE

RETRY
```

---

## 7.5 status

```text
SUCCESS

FAILED

SKIPPED
```

---

## 7.6 用途

system_logは

- HealthCheck
- Scheduler
- Calendar生成
- 詩生成
- 設定変更
- 保守操作

の履歴として利用する。

障害解析にはerror_logを利用する。

# 8. source_config

## 8.1 目的

CalendarGeneratorが参照する外部情報源を管理する。

本シートはURLや取得優先順位を管理するものであり、
認証情報・秘密情報を保存してはならない。

更新主体

```text
管理者
```

更新タイミング

```text
情報源変更時
```

参照モジュール

- ConfigManager
- CalendarGenerator

---

## 8.2 Primary Key

```text
source_id
```

---

## 8.3 カラム定義

| Column | Type | Required | Description |
|---------|------|----------|-------------|
| source_id | STRING | YES | 情報源ID |
| source_name | STRING | YES | 情報源名称 |
| source_type | STRING | YES | 情報種別 |
| source_url | STRING | YES | URL |
| enabled | BOOLEAN | YES | 有効 |
| priority | INTEGER | YES | 優先順位 |
| update_frequency | STRING | YES | 更新周期 |
| timeout_sec | INTEGER | NO | Timeout |
| retry_max | INTEGER | NO | Retry回数 |
| notes | STRING | NO | 備考 |
| updated_at | DATETIME | YES | 更新日時 |

---

## 8.4 source_type

```text
HOLIDAY

SOLAR_TERM

SEASON_INFO

MOON_PHASE

ROKUYO

ETO
```

---

## 8.5 保存禁止

保存してはならない。

- API_SECRET
- GEMINI_API_KEY
- PASSWORD
- OAuth Token
- Refresh Token
- Access Token

---

# 9. system_config

## 9.1 目的

システム全体の設定を管理する。

ESP32は直接編集せず、
ConfigManager経由で読み込む。

更新主体

```text
管理者
```

参照モジュール

- ConfigManager
- Scheduler
- RetryManager
- PoemGenerator
- CalendarGenerator

---

## 9.2 Primary Key

```text
config_key
```

---

## 9.3 カラム定義

| Column | Type | Required | Description |
|---------|------|----------|-------------|
| config_key | STRING | YES | キー |
| config_value | STRING | YES | 値 |
| value_type | STRING | YES | STRING/INTEGER/FLOAT/BOOLEAN |
| category | STRING | YES | 設定分類 |
| enabled | BOOLEAN | YES | 有効 |
| description | STRING | NO | 説明 |
| updated_at | DATETIME | YES | 更新日時 |

---

## 9.4 category

```text
SYSTEM

JOB

PROMPT

GEMINI

DISPLAY

MAINTENANCE

POWER

NETWORK
```

---

## 9.5 初期値

| config_key | 初期値 |
|------------|--------|
| prompt_version | poem_prompt_v1.0 |
| gemini_model | gemini-2.5-flash |
| gemini_temperature | 0.5 |
| gemini_max_tokens | 300 |
| calendar_retry_max | 3 |
| poem_retry_max | 3 |
| retry_base_wait_temporary_sec | 30 |
| retry_max_wait_temporary_sec | 600 |
| retry_base_wait_unknown_sec | 60 |
| retry_max_wait_unknown_sec | 300 |
| epaper_update_interval_normal_min | 60 |
| epaper_update_interval_battery_min | 120 |

---

## 9.6 保存禁止

保存禁止

- API_SECRET
- GEMINI_API_KEY
- PASSWORD
- OAuth Token
- Refresh Token

これらは Script Properties で管理する。

---

# 10. solar_term_master

## 10.1 目的

二十四節気マスタを管理する。

CalendarGeneratorは本シートを参照して
calendar_masterを生成する。

更新主体

```text
管理者
```

更新頻度

```text
原則変更なし
```

参照モジュール

- CalendarGenerator

---

## 10.2 Primary Key

```text
solar_term_id
```

---

## 10.3 カラム定義

| Column | Type | Required | Description |
|---------|------|----------|-------------|
| solar_term_id | STRING | YES | ID |
| solar_term_name | STRING | YES | 名称 |
| reading | STRING | NO | 読み |
| order_no | INTEGER | YES | 通番 |
| start_date | DATE | YES | 開始日 |
| end_date | DATE | YES | 終了日 |
| description | STRING | NO | 説明 |
| updated_at | DATETIME | YES | 更新日時 |

---

## 10.4 初期データ

24件固定とする。

例

| order | 名称 |
|-------|------|
|1|立春|
|2|雨水|
|3|啓蟄|
|…|…|
|24|大寒|

---

## 10.5 運用方針

本シートは
マスタデータとして扱う。

通常運用で更新は行わない。

変更が必要な場合は
GitHub管理文書との整合性を確認したうえで
管理者が更新する。

# 11. season_dictionary

## 11.1 目的

七十二候マスタを管理する。

CalendarGeneratorは本シートを参照し、
calendar_masterへ七十二候情報を付加する。

更新主体

```text
管理者
```

更新頻度

```text
原則更新なし
```

参照モジュール

- CalendarGenerator

---

## 11.2 Primary Key

```text
season_id
```

---

## 11.3 カラム定義

| Column | Type | Required | Description |
|---------|------|----------|-------------|
| season_id | STRING | YES | 七十二候ID |
| solar_term_id | STRING | YES | 二十四節気ID |
| kou_no | INTEGER | YES | 節気内通番(1～3) |
| season_name | STRING | YES | 七十二候名称 |
| reading | STRING | NO | 読み |
| description | STRING | NO | 説明 |
| start_date | DATE | YES | 開始日 |
| end_date | DATE | YES | 終了日 |
| updated_at | DATETIME | YES | 更新日時 |

---

## 11.4 制約

- 72件固定
- solar_term_idはsolar_term_masterを参照
- kou_noは1～3

---

## 11.5 運用方針

本シートはマスタデータとする。

通常運用では変更しない。

---

# 12. calendar_master

## 12.1 目的

毎日の暦情報を保存する。

CalendarGeneratorが生成し、
PoemGeneratorおよびESP32表示処理が参照する。

更新主体

```text
CalendarGenerator
```

更新タイミング

```text
毎日02:00
```

参照モジュール

- CalendarGenerator
- PoemGenerator
- ESP32

---

## 12.2 Primary Key

```text
calendar_date
```

---

## 12.3 カラム定義

| Column | Type | Required | Description |
|---------|------|----------|-------------|
| calendar_date | DATE | YES | 日付 |
| year | INTEGER | YES | 年 |
| month | INTEGER | YES | 月 |
| day | INTEGER | YES | 日 |
| weekday | STRING | YES | 曜日 |
| holiday_name | STRING | NO | 祝日 |
| solar_term | STRING | NO | 二十四節気 |
| season_name | STRING | NO | 七十二候 |
| lunar_date | STRING | NO | 旧暦 |
| rokuyo | STRING | NO | 六曜 |
| moon_age | FLOAT | NO | 月齢 |
| moon_phase | STRING | NO | 月相 |
| zodiac | STRING | NO | 十二星座 |
| eto | STRING | NO | 干支 |
| seasonal_event | STRING | NO | 年中行事 |
| description | STRING | NO | 説明 |
| generation_status | STRING | YES | 生成状態 |
| retry_count | INTEGER | YES | Retry回数 |
| first_attempt_at | DATETIME | NO | 初回生成 |
| last_attempt_at | DATETIME | NO | 最終生成 |
| error_code | STRING | NO | エラーコード |
| updated_at | DATETIME | YES | 更新日時 |

---

## 12.4 generation_status

```text
SCHEDULED

CALENDAR_RUNNING

CALENDAR_RETRY

CALENDAR_READY

CALENDAR_ERROR
```

---

## 12.5 データ生成

生成元

- holiday
- solar_term_master
- season_dictionary
- moon_phase
- rokuyo
- eto

---

## 12.6 運用方針

calendar_masterは生成専用とする。

ESP32から更新してはならない。

---

# 13. poem_cache

## 13.1 目的

Geminiで生成した詩を保存する。

同日の再表示時は
Geminiを再実行せず、
本シートを参照する。

更新主体

```text
PoemGenerator
```

更新タイミング

```text
毎日02:10
```

参照モジュール

- PoemGenerator
- ESP32

---

## 13.2 Primary Key

```text
poem_date
```

---

## 13.3 カラム定義

| Column | Type | Required | Description |
|---------|------|----------|-------------|
| poem_date | DATE | YES | 対象日 |
| generated_at | DATETIME | YES | 生成日時 |
| model_name | STRING | YES | Geminiモデル |
| prompt_version | STRING | YES | PromptVersion |
| poem_title | STRING | YES | タイトル |
| poem_body | STRING | YES | 本文 |
| calendar_date | DATE | YES | calendar_master参照 |
| observation_reference | STRING | NO | observation_log参照 |
| generation_status | STRING | YES | 生成状態 |
| retry_count | INTEGER | YES | Retry回数 |
| first_attempt_at | DATETIME | NO | 初回生成 |
| last_attempt_at | DATETIME | NO | 最終生成 |
| error_code | STRING | NO | エラーコード |
| error_message | STRING | NO | エラーメッセージ |

---

## 13.4 generation_status

```text
CALENDAR_PENDING

POEM_RUNNING

POEM_RETRY

POEM_READY

POEM_ERROR

POEM_SKIPPED
```

---

## 13.5 データ生成フロー

```text
calendar_master

      │

      ▼

PromptGenerator

      │

      ▼

Gemini API

      │

      ▼

poem_cache

      │

      ▼

ESP32
```

---

## 13.6 運用方針

同一日付の詩は再生成しない。

再生成が必要な場合は

PoemGenerator

または

管理メニュー

から明示的に実施する。

通常表示ではpoem_cacheのみを参照する。

---

## 13.7 保持方針

poem_cacheは履歴として保持する。

自動削除は行わない。

削除が必要な場合は
管理者が保守操作として実施する。

# 14. シート間リレーション

## 14.1 全体構成

各シートの依存関係を以下に示す。

```text
                 source_config
                        │
                        │
solar_term_master       │
        │               │
        ├────────────┐  │
        │            │  │
season_dictionary    │  │
        │            │  │
        ▼            ▼  ▼

      CalendarGenerator

             │

             ▼

      calendar_master

             │

             ▼

      PoemGenerator

             │

             ▼

        poem_cache


ESP32

  │

  ▼

observation_log

GAS

├── event_log

├── system_log

└── error_log
```

---

## 14.2 シート参照関係

| シート | 参照先 |
|---------|---------|
|observation_log|-|
|event_log|-|
|error_log|-|
|system_log|-|
|source_config|-|
|system_config|-|
|solar_term_master|-|
|season_dictionary|solar_term_master|
|calendar_master|source_config・solar_term_master・season_dictionary|
|poem_cache|calendar_master・observation_log|

---

# 15. データライフサイクル

## 15.1 観測データ

```text
ESP32

    │

POST

    │

Validation

    │

secret除去

    │

observation_log

    │

CalendarGenerator

    │

calendar_master

    │

PoemGenerator

    │

poem_cache

    │

ESP32表示
```

---

## 15.2 暦生成

```text
source_config

      │

solar_term_master

      │

season_dictionary

      │

      ▼

CalendarGenerator

      │

calendar_master
```

---

## 15.3 詩生成

```text
calendar_master

      │

observation_log

      │

PromptGenerator

      │

Gemini

      │

poem_cache
```

---

# 16. 機密情報管理

## 16.1 保存禁止

Spreadsheetへ保存してはならない。

- API_SECRET
- GEMINI_API_KEY
- PASSWORD
- OAuth Token
- Refresh Token
- Access Token
- Session ID
- Cookie

---

## 16.2 payload

ESP32から受信したJSONを保存する場合は

```
secret
```

を削除したコピーのみ保存する。

例

保存可

```json
{
  "device_id":"DK001",
  "temperature":25.1
}
```

保存不可

```json
{
  "device_id":"DK001",
  "secret":"xxxxxxxx"
}
```

---

## 16.3 管理場所

| 情報 | 保存場所 |
|------|----------|
|API_SECRET|Script Properties|
|GEMINI_API_KEY|Script Properties|
|管理者パスワード|Script Properties|
|OAuth Token|Script Properties|

Spreadsheetへの保存は禁止する。

---

# 17. STATUS

## 17.1 本文書

| 項目 | 状態 |
|------|------|
|Spreadsheet構造|FINALIZED|
|Primary Key定義|FINALIZED|
|カラム定義|FINALIZED|
|機密情報管理|FINALIZED|
|シート関連図|FINALIZED|

---

## 17.2 シート

| シート | 状態 |
|---------|------|
|observation_log|FINALIZED|
|event_log|FINALIZED|
|error_log|FINALIZED|
|system_log|FINALIZED|
|source_config|FINALIZED|
|system_config|FINALIZED|
|solar_term_master|FINALIZED|
|season_dictionary|FINALIZED|
|calendar_master|FINALIZED|
|poem_cache|FINALIZED|

---

# 18. CHANGE LOG

| 日付 | 内容 |
|------|------|
|2026-07-14|vNext 1.3全面刷新|
|2026-07-14|Single Source of Truthとして再構成|
|2026-07-14|event_log正式定義追加|
|2026-07-14|system_log正式定義追加|
|2026-07-14|solar_term_master正式定義追加|
|2026-07-14|server_timestamp正式採用|
|2026-07-14|シート間リレーション追加|
|2026-07-14|データライフサイクル追加|
|2026-07-14|機密情報管理を強化|
|2026-07-14|03_LOG_FORMAT.mdとの責務分離を明文化|