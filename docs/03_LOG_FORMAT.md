# 03_LOG_FORMAT.md

# digital-kakejiku ログ仕様

最終更新: 2026-06-19

---

## 1. 目的

本書は observation_log / event_log / error_log / system_log および Calendar / Poem 関連シートのログ仕様を定義する。

査読反映事項。

- Observation Payload確定
- Payload拡張5項目正式採択
- ERROR_LOG判定基準明文化
- RTC_ERROR運用整理
- Calendar / Poem エラー記録整理
- CONFIRMED / FINALIZED / PROPOSED管理

---

## 2. 基本方針

- 推測禁止
- 欠損補完禁止
- AIによる暦生成禁止
- 表示不能時は「取得できません」
- schema_version により管理する

---

## 3. Spreadsheet構成

### 運用ログ

- observation_log
- event_log
- error_log
- system_log

### Calendar

- source_config
- solar_term_master
- season_dictionary
- calendar_master

### Poem

- poem_cache

---

## 4. observation_log

### Observation Payload v1.0

状態：FINALIZED

Observation Payload は 28項目で確定する。

### 追加採択項目

以下を正式採択する。

| 項目 | 状態 | 用途 |
|---|---|---|
| timestamp_validity | FINALIZED | RTC異常判定 |
| boot_count | FINALIZED | 障害解析 |
| wakeup_reason | FINALIZED | 将来拡張 |
| message_id | FINALIZED | 重複排除 |
| retry_count | FINALIZED | 通信解析 |

### schema_version

```text
1.0
```

状態：FINALIZED

---

## 5. 値検証方針

GAS側で実施。

- 型検証
- 必須項目検証
- null許容判定
- センサー仕様逸脱判定
- 異常値判定

初期実装では異常値も保存し、error_logへ記録する。

---

## 6. event_log

利用目的。

- 状態変化記録
- BATTERY_MODE遷移
- USB_POWER_LOST
- USB_POWER_RESTORE
- Calendar更新
- Poem生成

---

## 7. error_log

### ERROR_LOG判定基準

| 種別 | 条件 | 状態 |
|---|---|---|
| SENSOR_ERROR | センサー異常 | CONFIRMED |
| STORAGE_ERROR | SD異常 | CONFIRMED |
| NETWORK_ERROR | 通信異常 | CONFIRMED |
| RTC_ERROR | RTC異常 | CONFIRMED |
| CALENDAR_ERROR | Calendar異常 | CONFIRMED |
| CALENDAR_PENDING | Calendar待機 | FINALIZED |
| POEM_ERROR | Poem異常 | CONFIRMED |
| CONFIG_ERROR | 設定異常 | CONFIRMED |
| SECURITY_ERROR | 認証異常 | CONFIRMED |
| RESOURCE_TIMEOUT | SPI競合 | CONFIRMED |

---

## 8. RTC_ERROR時の扱い

RTC異常時でも観測継続。

| 項目 | 動作 |
|---|---|
| observation_log | 保存 |
| error_log | RTC_ERROR記録 |
| Calendar判定 | GAS日付優先 |
| Poem判定 | GAS日付優先 |

timestamp_validity を利用する。

状態：FINALIZED

---

## 9. Calendarエラー記録方針

Calendar取得失敗時。

- error_log記録
- calendar_master.status=error

表示。

取得できません

前回値流用禁止。

状態：FINALIZED

---

## 10. Poemエラー記録方針

Poem生成失敗時。

- error_log記録
- poem_cache.status=error

表示。

取得できません

代替詩生成禁止。

状態：FINALIZED

---

## 11. セキュリティログ方針

保存禁止。

- API_SECRET
- GEMINI_API_KEY
- Password

マスク対象。

- secret
- token
- credential

詳細は 11_SECURITY_MANAGEMENT.md を正とする。

---

## 12. STATUS

| 項目 | 状態 |
|---|---|
| Spreadsheet構成 | CONFIRMED |
| Observation Payload v1.0 | FINALIZED |
| Observation Payload 28項目 | FINALIZED |
| timestamp_validity | FINALIZED |
| boot_count | FINALIZED |
| wakeup_reason | FINALIZED |
| message_id | FINALIZED |
| retry_count | FINALIZED |
| ERROR_LOG判定基準 | CONFIRMED |
| CALENDAR_PENDING | FINALIZED |
| RTC_ERROR運用 | FINALIZED |
| Calendar失敗時表示 | FINALIZED |
| Poem失敗時表示 | FINALIZED |

---

## 13. CHANGE LOG

| 日付 | 内容 |
|---|---|
| 2026-06-19 | Observation Payload 28項目確定 |
| 2026-06-19 | Payload追加5項目採択 |
| 2026-06-19 | CALENDAR_PENDING追加 |
| 2026-06-19 | RTC_ERROR運用整理 |
| 2026-06-19 | Calendar/Poemログ方針整理 |
