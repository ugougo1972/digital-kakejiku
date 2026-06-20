# digital-kakejiku Troubleshooting Guide

最終更新: 2026-06-20  
文書版: vNext 1.1 review reflected

---

# 1. 目的

本書は障害対応の基準源である。運用中に発生しやすい問題について、確認順序と対処を定義する。

---

# 2. Poemが生成されない

## 確認順序

1. calendar_master.status を確認する
2. poem_cache.generation_status を確認する
3. error_log の POEM_ERROR / CALENDAR_PENDING を確認する
4. Script Properties の GEMINI_API_KEY を確認する
5. system_config の prompt_version / gemini_model / gemini_temperature を確認する

## 状態別対応

| 状態 | 原因 | 対応 |
|---|---|---|
| CALENDAR_PENDING | Calendar未完了 | Calendar復旧を待つ、またはCalendar再生成 |
| POEM_SKIPPED | Calendar失敗 | Calendarエラーを先に解消 |
| POEM_ERROR | GeminiまたはPrompt失敗 | error_log確認、必要ならPoem再生成 |

---

# 3. Calendarが生成されない

## 確認順序

1. source_config の enabled を確認
2. source_url を確認
3. season_dictionary が存在するか確認
4. calendar_master.status を確認
5. error_log の CALENDAR_ERROR / CONFIG_ERROR を確認

## 対応

- URL誤り: source_configをSpreadsheetで修正
- season_dictionary欠損: マスタを修正
- 一時的通信失敗: Retryを待つ
- 永続的エラー: 管理者がCalendar再生成

---

# 4. CALENDAR_PENDINGが続く

CALENDAR_PENDINGはCalendarが復旧するまで保持する。日数による自動破棄は行わない。

確認。

- calendar_master.status が CALENDAR_READY になっているか
- Calendar Job が正常終了しているか
- error_log に CONFIG_ERROR がないか

対処。

1. Calendarエラー原因を解消
2. Calendar再生成
3. Poem再生成

---

# 5. 通信できない

確認。

- Wi-Fi接続
- GAS Web App URL
- device_id
- secret
- HTTPS応答
- GAS実行ログ

エラー別。

| エラー | 対応 |
|---|---|
| AUTH_ERROR | secret確認 |
| INVALID_DEVICE | device_id確認 |
| SCHEMA_ERROR | Payload形式確認 |
| NETWORK_ERROR | Wi-Fi / DNS / HTTPS確認 |

---

# 6. 背面UIで設定変更できない

仕様である。

背面UIから禁止する操作。

- source_config編集
- system_config編集
- URL編集
- Prompt編集
- Geminiモデル変更
- temperature変更
- API Key編集

設定変更はSpreadsheetまたはScript Propertiesで行う。

---

# 7. E-Paperが更新されない

確認。

- SPI Lock状態
- microSD書込中でないか
- ResourceManagerの RESOURCE_LOCK_ERROR
- E-Paper BUSY信号
- BATTERY_MODEで更新抑制中でないか

対処。

- microSD保存完了を待つ
- E-Paper更新を再実行
- 電源電圧を確認

---

# 8. 月次確認で異常が見つかった場合

## error_logが増えている

- 同一error_codeが集中しているか確認
- subsystem別に分類する
- Calendar / Poem / Network / Security を切り分ける

## Gemini API失敗が増えている

- Free Tier上限
- API Key有効性
- 429 Rate Limit
- 5xx Server Error

## Calendar失敗が増えている

- source_config URL
- 外部サイト仕様変更
- season_dictionary欠損

---

# 9. STATUS

| 項目 | 状態 |
|---|---|
| Poem障害対応 | FINALIZED |
| Calendar障害対応 | FINALIZED |
| CALENDAR_PENDING対応 | FINALIZED |
| 通信障害対応 | CONFIRMED |
| E-Paper障害対応 | PROPOSED |

---

# 10. CHANGE LOG

| 日付 | 内容 |
|---|---|
| 2026-06-20 | vNext 1.1で新規作成 |
