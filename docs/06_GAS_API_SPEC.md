# 06_GAS_API_SPEC.md

# digital-kakejiku GAS API仕様

最終更新: 2026-06-19

---

## 1. 目的

本書はESP32⇔GAS間通信仕様を定義する。

査読反映事項。

- Payload確定項目整理
- 標準レスポンス形式定義
- Calendar/Poem取得応答整理
- RTC_ERROR時の扱い整理
- セキュリティ方針整理

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
|--------|--------|
| observation | 観測データ |
| event | イベント |
| error | エラー |
| system | システム |

状態。

CONFIRMED

---

## 6. Observation Payload

Observation項目定義は

- 03_LOG_FORMAT.md

を正とする。

現時点。

```text
確定: 23フィールド
追加検討: 5フィールド
```

追加検討。

```text
timestamp_validity
boot_count
wakeup_reason
message_id
retry_count
```

状態。

PROPOSED

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

査読反映事項。

JSON本文を正とする。

状態。

CONFIRMED

---

## 9. エラーコード

| code | 内容 |
|--------|--------|
| REQ-001 | invalid payload |
| REQ-002 | invalid secret |
| REQ-003 | invalid device |
| REQ-004 | invalid type |
| RTC-001 | rtc error |
| CALENDAR-001 | calendar error |
| POEM-001 | poem error |
| CONFIG-001 | config error |
| SECURITY-001 | security error |

---

## 10. RTC_ERROR時

RTC異常時も保存継続。

| 項目 | 動作 |
|--------|--------|
| observation_log | 保存 |
| error_log | RTC_ERROR記録 |
| Calendar判定 | GAS日付優先 |
| Poem判定 | GAS日付優先 |

状態。

CONFIRMED

---

## 11. Calendar取得

生成主体。

- GAS

出力。

- calendar_master

禁止。

- AI生成
- AI推定
- 欠損補完

状態。

FINALIZED

---

## 12. Poem取得

生成主体。

- GAS

出力。

- poem_cache

利用。

- Gemini API

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

## 14. セキュリティ

保存禁止。

- API_SECRET
- GEMINI_API_KEY
- Password

管理。

- Script Properties

状態。

FINALIZED

---

## 15. STATUS

| 項目 | 状態 |
|--------|--------|
| HTTPS POST | CONFIRMED |
| device_id+secret認証 | CONFIRMED |
| 標準レスポンス | CONFIRMED |
| Observation 23項目 | CONFIRMED |
| 追加5項目 | PROPOSED |
| RTC_ERROR運用 | CONFIRMED |
| Calendar生成GAS側 | FINALIZED |
| Poem生成GAS側 | FINALIZED |
| 表示時再生成禁止 | FINALIZED |

---

## 16. CHANGE LOG

| 日付 | 内容 |
|--------|--------|
| 2026-06-19 | 標準レスポンス形式追加 |
| 2026-06-19 | Payload確定数整理 |
| 2026-06-19 | RTC_ERROR運用整理 |
| 2026-06-19 | Calendar/Poem取得仕様整理 |
