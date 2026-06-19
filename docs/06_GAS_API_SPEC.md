# 06_GAS_API_SPEC.md

# digital-kakejiku GAS API仕様

最終更新: 2026-06-19

---

## 1. 目的

本書は ESP32 ⇔ GAS 間通信仕様を定義する。

本改訂版は「原文保持＋査読反映＋整合性維持」を目的として以下を反映する。

- Observation Payload v1.0確定
- Payload拡張5項目正式採択
- 標準レスポンス形式追加
- RTC_ERROR運用整理
- Calendar / Poem取得方針整理
- CALENDAR_PENDING追加

---

## 2. 基本方針

- HTTPS POST
- JSON形式
- device_id + secret認証
- GASを唯一のAPI入口とする
- Calendar生成はGAS側
- Poem生成はGAS側

---

## 3. エンドポイント

### POST

```text
/doPost
```

用途。

- observation
- event
- error
- system

---

### GET

```text
/health
```

用途。

- 死活監視

状態。

CONFIRMED

---

## 4. 認証

送信項目。

```json
{
  "device_id":"dk-001",
  "secret":"xxxxx"
}
```

検証。

- Script Properties
- device_id
- secret

詳細。

11_SECURITY_MANAGEMENT.md を正とする。

---

## 5. Payload種別

| type | 用途 |
|---|---|
| observation | 観測データ |
| event | イベント |
| error | エラー |
| system | システム |

状態。

CONFIRMED

---

## 6. Observation Payload

Observation Payload v1.0

状態：FINALIZED

Observation Payload は 28項目で確定する。

### 採択済み拡張項目

| 項目 | 状態 | 用途 |
|---|---|---|
| timestamp_validity | FINALIZED | RTC異常判定 |
| boot_count | FINALIZED | 障害解析 |
| wakeup_reason | FINALIZED | 将来拡張 |
| message_id | FINALIZED | 重複排除 |
| retry_count | FINALIZED | 通信解析 |

定義は 03_LOG_FORMAT.md を正とする。

---

## 7. 値検証

GAS側で実施。

対象。

- 型検証
- 必須項目検証
- null判定
- 異常値判定
- センサー仕様逸脱判定

異常値。

- 保存可
- error_log記録

状態。

CONFIRMED

---

## 8. 標準レスポンス

### 成功

```json
{
  "status":"ok",
  "code":200,
  "server_time":"2026-06-19T12:00:00+09:00"
}
```

### エラー

```json
{
  "status":"error",
  "code":400,
  "error_code":"REQ-001",
  "message":"invalid payload"
}
```

状態。

CONFIRMED

---

## 9. エラーコード

| code | 内容 |
|---|---|
| REQ-001 | invalid payload |
| REQ-002 | invalid secret |
| REQ-003 | invalid device |
| REQ-004 | invalid type |
| RTC-001 | rtc error |
| CALENDAR-001 | calendar error |
| CALENDAR-002 | calendar pending |
| POEM-001 | poem error |
| CONFIG-001 | config error |
| SECURITY-001 | security error |

---

## 10. RTC_ERROR時

RTC異常時も保存継続。

| 項目 | 動作 |
|---|---|
| observation_log | 保存 |
| error_log | RTC_ERROR記録 |
| Calendar判定 | GAS日付優先 |
| Poem判定 | GAS日付優先 |

timestamp_validity を利用する。

状態。

FINALIZED

---

## 11. Calendar取得

生成主体。

- GAS

出力。

- calendar_master

禁止。

- AI生成
- AI推定
- AI補完

状態。

FINALIZED

---

## 12. Poem取得

生成主体。

- GAS

出力。

- poem_cache

利用。

- Gemini API Free Tier

用途。

- 今日の詩

状態。

CONFIRMED

---

## 13. Calendar / Poem応答

ESP32は生成処理を呼ばない。

取得対象。

```text
calendar_master
poem_cache
```

表示時。

- 再生成禁止

状態。

FINALIZED

---

## 14. Calendar依存関係

```text
Calendar Job
      ↓
calendar_master
      ↓
Poem Job
```

Calendar未完了。

```text
CALENDAR_PENDING
```

Poem生成。

- 保留

状態。

FINALIZED

---

## 15. セキュリティ

保存禁止。

- API_SECRET
- GEMINI_API_KEY
- Password

管理。

- Script Properties

状態。

FINALIZED

---

## 16. STATUS

| 項目 | 状態 |
|---|---|
| HTTPS POST | CONFIRMED |
| device_id+secret認証 | CONFIRMED |
| 標準レスポンス | CONFIRMED |
| Observation Payload v1.0 | FINALIZED |
| Observation Payload 28項目 | FINALIZED |
| timestamp_validity | FINALIZED |
| boot_count | FINALIZED |
| wakeup_reason | FINALIZED |
| message_id | FINALIZED |
| retry_count | FINALIZED |
| RTC_ERROR運用 | FINALIZED |
| Calendar生成GAS側 | FINALIZED |
| Poem生成GAS側 | FINALIZED |
| CALENDAR_PENDING | FINALIZED |
| 表示時再生成禁止 | FINALIZED |

---

## 17. CHANGE LOG

| 日付 | 内容 |
|---|---|
| 2026-06-19 | Observation Payload 28項目確定 |
| 2026-06-19 | Payload追加5項目採択 |
| 2026-06-19 | 標準レスポンス形式追加 |
| 2026-06-19 | CALENDAR_PENDING追加 |
| 2026-06-19 | RTC_ERROR運用整理 |
| 2026-06-19 | Calendar/Poem取得仕様整理 |
