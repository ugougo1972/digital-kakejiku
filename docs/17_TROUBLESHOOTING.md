# digital-kakejiku Troubleshooting Guide

最終更新: 2026-06-20  
文書版: vNext 1.3 phase1 ready delta

---

# 1. 目的

本書は障害対応の基準源である。

運用中に発生しやすい問題について、確認順序と対処を定義する。

Retry詳細は `18_GAS_RETRY_STRATEGY.md` を参照する。

Gemini Prompt詳細は `19_GEMINI_PROMPT_SPECIFICATION.md` を参照する。

---

# 2. Poemが生成されない

確認順序。

1. calendar_master.status
2. poem_cache.generation_status
3. error_log
4. Script Properties の GEMINI_API_KEY
5. system_config の prompt_version / gemini_model / gemini_temperature
6. 19_GEMINI_PROMPT_SPECIFICATION.md の出力仕様

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
7. Prompt出力JSONの妥当性

対応。

1. Script PropertiesのGEMINI_API_KEYを確認する
2. system_config.prompt_versionを確認する
3. 19_GEMINI_PROMPT_SPECIFICATION.md のPrompt Versionと一致しているか確認する
4. 必要に応じてprompt_versionを新しい値へ変更する
5. MaintenanceHandlerでPoem再生成を実行する
6. poem_cache.generation_statusがPOEM_READYになることを確認する

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

# 7. 通信できない

確認。

1. Wi-Fi接続
2. DNS
3. GAS Web App URL
4. HTTPS到達性
5. doGet Alive Check
6. error_log

代表エラー。

| エラー | 対応 |
|---|---|
| AUTH_ERROR | secret確認 |
| INVALID_DEVICE | device_id確認 |
| SCHEMA_ERROR | Payload確認 |
| NETWORK_ERROR | Wi-Fi / DNS / HTTPS確認 |
| SERVER_ERROR | Retry Strategy確認 |

Retry判断は `18_GAS_RETRY_STRATEGY.md` を参照する。

---

# 8. Secretが漏洩した場合

手順。

1. 新しいsecretを生成する
2. Script Propertiesの対象device_id用secretを更新する
3. ESP32 NVSのAPI_SECRETを更新する
4. 旧secretを削除する
5. doPost疎通確認を行う
6. SECURITY_ERRORが出ないことを確認する

注意。

- secretをSpreadsheetへ保存しない
- secretをGitHubへ記載しない
- error_logへsecretを出力しない

---

# 9. Gemini API Keyが無効な場合

確認。

1. Script PropertiesにGEMINI_API_KEYが存在するか
2. Google AI Studio / Google Cloud側でKeyが有効か
3. 利用制限に到達していないか
4. error_logにGEMINI_AUTH_ERRORまたはGEMINI_RATE_LIMITがないか

対応。

1. 新しいGEMINI_API_KEYを発行する
2. Script Propertiesを更新する
3. Poem Jobを手動実行する
4. poem_cache更新を確認する

禁止。

- GEMINI_API_KEYをSpreadsheetへ保存すること
- GEMINI_API_KEYをGitHubへ記載すること
- ESP32へ保存すること

---

# 10. E-Paperが更新されない

確認。

1. SPI Lock状態
2. microSDアクセス中でないか
3. ResourceManagerのRESOURCE_LOCK_ERROR
4. BATTERY_MODE中で更新抑制されていないか
5. E-Paper初期化状態

対応。

- microSD保存完了後に再試行
- RESOURCE_TIMEOUTを確認
- BATTERY_MODE解除後に更新確認

---

# 11. 月次確認で異常が見つかった場合

確認対象。

- observation_log行数
- error_log集中
- Calendar成功率
- Poem成功率
- Gemini Free Tier利用状況
- GAS実行時間
- Spreadsheet容量
- Script PropertiesのAPI_SECRET/GEMINI_API_KEY存在

対応。

- error_logのsubsystemで分類
- 17_TROUBLESHOOTING.mdの該当章へ進む
- 必要ならMaintenanceHandlerで再生成

---

# 12. STATUS

| 項目 | 状態 |
|---|---|
| Poem障害対応 | FINALIZED |
| Calendar障害対応 | FINALIZED |
| Retry参照方針 | FINALIZED |
| Secretローテーション | FINALIZED |
| Gemini API Key確認 | FINALIZED |
| E-Paper障害対応 | CONFIRMED |

---

# 13. CHANGE LOG

| 日付 | 内容 |
|---|---|
| 2026-06-20 | vNext 1.3として18/19への参照を追加 |
| 2026-06-20 | Retry判断を18文書へ分離 |
| 2026-06-20 | Gemini Prompt障害対応を19文書と整合 |
