# digital-kakejiku Troubleshooting Guide

最終更新: 2026-06-20  
文書版: vNext 1.2 review reflected

---

# 1. 目的

本書は障害対応の基準源である。

運用中に発生しやすい問題について、確認順序と対処を定義する。

---

# 2. Poemが生成されない

確認順序。

1. calendar_master.status
2. poem_cache.generation_status
3. error_log
4. Script Properties の GEMINI_API_KEY
5. system_config の prompt_version / gemini_model / gemini_temperature

状態別対応。

| 状態 | 意味 | 対応 |
|---|---|---|
| CALENDAR_PENDING | Calendar待ち | Calendar復旧を待つ |
| POEM_SKIPPED | Calendar失敗 | Calendar失敗原因を解消 |
| POEM_ERROR | Poem生成失敗 | error_log確認、再生成 |
| POEM_RETRY | Retry待ち | 次回Retry Job確認 |
| POEM_READY | 正常 | 表示側確認 |

---

# 3. POEM_ERRORが3日以上続く

確認。

1. Gemini API Keyの有効性
2. Gemini API利用量
3. system_config.prompt_version
4. system_config.gemini_model
5. system_config.gemini_temperature
6. error_logのerror_code

対応。

1. Script PropertiesのGEMINI_API_KEYを確認する
2. system_config.prompt_versionを確認する
3. 必要に応じてprompt_versionを新しい値へ変更する
4. MaintenanceHandlerでPoem再生成を実行する
5. poem_cache.generation_statusがPOEM_READYになることを確認する

---

# 4. Prompt Version変更後の再生成手順

手順。

1. system_config.prompt_versionを更新する
2. 新規生成は次回Poem Jobから反映される
3. 既存poem_cacheは自動再生成しない
4. 必要な日付だけregeneratePoemByDateを実行する
5. 期間再生成が必要な場合はregeneratePoemByRangeを実行する
6. error_logにPOEM_ERRORが出ていないことを確認する

旧Versionで生成済みのpoem_cacheは有効なまま保持する。

---

# 5. CALENDAR_PENDINGが続く

確認。

1. calendar_master.status
2. error_logのCALENDAR_ERROR
3. source_configの有効フラグ
4. season_dictionaryの欠損
5. Calendar Jobのsystem_log

終了条件。

- calendar_master.statusがCALENDAR_READYになること

禁止。

- Calendar未復旧のままPoem生成を強行すること
- ESP32側で暦情報を補完すること

---

# 6. Calendarが生成されない

確認。

1. source_config
2. solar_term_master
3. season_dictionary
4. GAS Trigger
5. error_log

対応。

- source_config URL確認
- season_dictionary欠損確認
- regenerateCalendarByYear実行
- regenerateCalendarByRange実行

---

# 7. Secretが漏洩した場合

手順。

1. 新しいsecretを生成する
2. Script Propertiesの対象device_id用secretを更新する
3. ESP32 NVSのAPI_SECRETを更新する
4. 旧secretを削除する
5. doPost疎通確認を行う
6. SECURITY_ERRORが出ないことを確認する

注意。

- secretをGitHubへ書かない
- secretをSpreadsheetへ書かない
- secretをログへ出さない

---

# 8. Gemini API Keyを更新する場合

手順。

1. Google Cloud側で新しいAPI Keyを作成する
2. Script PropertiesのGEMINI_API_KEYを更新する
3. GAS単体でPoem生成テストを行う
4. 旧Keyを無効化する
5. POEM_ERRORが継続しないことを確認する

---

# 9. E-Paper表示が更新されない

確認。

1. DisplayManager状態
2. ResourceManagerのSPI Lock
3. microSD保存中ではないか
4. BATTERY_MODEではないか
5. DISPLAY_ERRORがないか

対応。

- microSD処理完了後に再更新
- BATTERY_MODEでは更新抑制の可能性あり
- ResourceManagerのtimeoutを確認

---

# 10. system_configを確認する場合

確認対象。

- prompt_version
- gemini_model
- gemini_temperature
- calendar_retry_max
- poem_retry_max
- epaper_update_interval_normal_min
- epaper_update_interval_battery_min

禁止。

- API_SECRETをsystem_configへ保存すること
- GEMINI_API_KEYをsystem_configへ保存すること

---

# 11. 月次確認

- observation_log増加
- error_log集中
- Calendar成功率
- Poem成功率
- GEMINI_API_KEY存在
- API_SECRET存在
- Spreadsheet共有範囲
- GAS Trigger存在
- Gemini API利用量

---

# 12. STATUS

| 項目 | 状態 |
|---|---|
| Poem障害対応 | FINALIZED |
| CALENDAR_PENDING対応 | FINALIZED |
| Secretローテーション | CONFIRMED |
| Prompt Version再生成手順 | CONFIRMED |
| E-Paper障害対応 | CONFIRMED |

---

# 13. CHANGE LOG

| 日付 | 内容 |
|---|---|
| 2026-06-20 | vNext 1.2としてPOEM_ERROR継続時対応を追加 |
| 2026-06-20 | Prompt Version変更時の再生成手順を追加 |
| 2026-06-20 | Secretローテーション手順を追加 |
