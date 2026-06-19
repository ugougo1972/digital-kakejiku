# 03_LOG_FORMAT.md

# digital-kakejiku ログ仕様

最終更新: 2026-06-19

---

## 1. 目的

本書は observation_log / event_log / error_log / system_log および Calendar / Poem 関連シートのログ仕様を定義する。

査読反映事項：

- Payload確定フィールドと追加検討フィールドの明確化
- ERROR_LOG判定基準の明文化
- RTC_ERROR時の扱い定義
- Calendar / Poem エラー記録方針整理
- CONFIRMED / FINALIZED / PROPOSED 管理

---

## 2. 基本方針

- 推測禁止
- 欠損補完禁止
- AIによる暦生成禁止
- 表示不能時は「取得できません」
- schema_version によりフィールド構成を管理する

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

### 確定フィールド

状態：CONFIRMED

現時点の運用対象は 23フィールドとする。

### 追加検討フィールド

状態：PROPOSED

| 項目 |
|------|
| timestamp_validity |
| boot_count |
| wakeup_reason |
| message_id |
| retry_count |

これらは採択時に schema_version を更新する。

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
- 手動操作
- Calendar更新
- Poem生成

---

## 7. error_log

### ERROR_LOG判定基準

| 種別 | 条件 | 状態 |
|--------|--------|--------|
| SENSOR_ERROR | センサー異常 | CONFIRMED |
| STORAGE_ERROR | SD異常 | CONFIRMED |
| NETWORK_ERROR | 通信異常 | CONFIRMED |
| RTC_ERROR | RTC異常 | CONFIRMED |
| CALENDAR_ERROR | Calendar異常 | CONFIRMED |
| POEM_ERROR | Poem異常 | CONFIRMED |
| CONFIG_ERROR | 設定異常 | CONFIRMED |
| SECURITY_ERROR | 認証異常 | CONFIRMED |
| RESOURCE_TIMEOUT | SPI競合 | CONFIRMED |

---

## 8. RTC_ERROR時の扱い

RTC異常時でも観測継続。

| 項目 | 動作 |
|--------|--------|
| observation_log | 保存 |
| error_log | RTC_ERROR記録 |
| Calendar判定 | GAS日付優先 |
| Poem判定 | GAS日付優先 |

timestamp_validity は将来拡張項目とする。

状態：PROPOSED

---

## 9. Calendarエラー記録方針

Calendar取得失敗時。

- error_log記録
- calendar_master.status=error
- 表示は「取得できません」

前回値流用禁止。

状態：FINALIZED

---

## 10. Poemエラー記録方針

Poem生成失敗時。

- error_log記録
- poem_cache.status=error
- 表示は「取得できません」

表示時再生成禁止。

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
|--------|--------|
| Spreadsheet構成 | CONFIRMED |
| 23フィールド運用 | CONFIRMED |
| 追加5フィールド | PROPOSED |
| ERROR_LOG判定基準 | CONFIRMED |
| RTC_ERROR運用 | CONFIRMED |
| Calendar失敗時表示 | FINALIZED |
| Poem失敗時表示 | FINALIZED |
| timestamp_validity | PROPOSED |

---

## 13. CHANGE LOG

| 日付 | 内容 |
|--------|--------|
| 2026-06-19 | Payload確定数を明確化 |
| 2026-06-19 | ERROR_LOG判定基準追加 |
| 2026-06-19 | RTC_ERROR運用追加 |
| 2026-06-19 | Calendar/Poemログ方針整理 |
