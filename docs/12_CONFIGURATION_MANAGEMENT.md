# 12_CONFIGURATION_MANAGEMENT.md

# digital-kakejiku 設定管理仕様

最終更新: 2026-06-20  
版: vNext 1.0

---

# 1. 目的

digital-kakejiku における設定値の管理方式を定義する。

対象。

- Script Properties
- source_config
- system_config
- season_dictionary
- ESP32 NVS
- ソースコード定数
- 背面保守UI

# 2. 基本方針

| 保存先 | 用途 |
| --- | --- |
| Script Properties | 機密情報 |
| source_config | 情報源URL管理 |
| system_config | GAS/Job/Gemini/Prompt/表示設定 |
| season_dictionary | 七十二候名称・説明 |
| ESP32 NVS | 端末設定 |
| ソースコード定数 | 固定値 |


# 3. source_config

役割。

- 情報源URL管理専用

管理項目例。

- HOLIDAY_SOURCE_URL
- SOLAR_TERM_SOURCE_URL
- SEASON_REFERENCE_URL
- CALENDAR_ENABLE
- POEM_ENABLE

保存禁止。

- API_SECRET
- GEMINI_API_KEY
- Password
- Prompt本文
- Geminiモデル
- Gemini Temperature

# 4. system_config

役割。

- GAS側の非機密設定管理

管理項目例。

- calendar_retry_max
- poem_retry_max
- gemini_model
- gemini_temperature
- gemini_max_tokens
- prompt_version
- display_mode

保存禁止。

- API_SECRET
- GEMINI_API_KEY
- Wi-Fi Password

# 5. season_dictionary

役割。

- 七十二候名称
- 七十二候説明
- 親となる二十四節気
- 初候 / 次候 / 末候

source_config は七十二候名称・説明の正本ではない。

# 6. Script Properties

管理項目。

- API_SECRET
- GEMINI_API_KEY
- SYSTEM_VERSION

制約。

- Spreadsheet保存禁止
- ログ出力禁止
- GitHub記載禁止

# 7. ESP32 NVS

管理項目。

- DEVICE_ID
- WIFI_SSID
- WIFI_PASSWORD
- API_SECRET
- DISPLAY_MODE

制約。

- Gemini API Key保存禁止
- Prompt本文保存禁止
- source_config同期不要
- system_config同期不要

# 8. Calendar/Poemとの関係

Calendar参照。

- source_config
- system_config
- solar_term_master
- season_dictionary

Poem参照。

- system_config
- calendar_master
- observation_log
- Script Properties

Prompt Version。

- system_configから取得
- poem_cacheへ保存

# 9. 背面保守UI

```text
許可
- 状態確認
- 診断
- Calendar再生成
- Poem再生成
- 通信確認

禁止
- source_config編集
- system_config編集
- URL編集
- Prompt編集
- Geminiモデル変更
- temperature変更
- API Key編集
```

# 10. 設定変更フロー

source_config。

```text
Spreadsheet管理者変更
↓
source_config更新
↓
CalendarSubsystem参照
↓
次回実行反映
```

system_config。

```text
Spreadsheet管理者変更
↓
system_config更新
↓
Calendar/Poem/Job参照
↓
次回実行反映
```

Script Properties。

```text
管理者変更
↓
Script Properties更新
↓
次回実行反映
```

# 11. CONFIG_VERSION

設定変更時の版管理候補。

状態。

```text
PROPOSED
```

現時点ではESP32への設定同期機構を前提としないため、必須項目とはしない。

# 12. STATUS

| 項目 | 状態 |
| --- | --- |
| source_config採択 | FINALIZED |
| source_config情報源URL専用化 | FINALIZED |
| system_config採択 | FINALIZED |
| season_dictionary役割分離 | FINALIZED |
| Script Properties採択 | FINALIZED |
| ESP32 NVS採択 | FINALIZED |
| Gemini API Key GAS限定 | FINALIZED |
| Spreadsheet機密情報保存禁止 | FINALIZED |
| 背面UIからの設定編集禁止 | FINALIZED |
| CONFIG_VERSION | PROPOSED |


# 13. CHANGE LOG

| 日付 | 内容 |
| --- | --- |
| 2026-06-20 | vNext 1.0として全面再生成 |
| 2026-06-20 | source_configを情報源URL管理専用として整理 |
| 2026-06-20 | season_dictionaryを七十二候名称・説明の正本として整理 |
| 2026-06-20 | 背面保守UIからの設定編集禁止を反映 |
