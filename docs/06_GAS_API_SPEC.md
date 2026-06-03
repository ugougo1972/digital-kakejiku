# 06_GAS_API_SPEC.md

最終更新: 2026-06-03

---

## 1. 概要

本書は digital-kakejiku 端末と Google Apps Script（GAS）WebApp 間の通信仕様を定義する。

本仕様は、XIAO ESP32S3 Plus から HTTPS POST で観測データ、イベント、エラー情報を送信し、GAS 側で Google Spreadsheet へ保存することを目的とする。

初期実装では、端末側のローカル保存を優先し、通信失敗時も観測データを失わない構成とする。

---

## 2. 関連ドキュメント

| 文書 | 内容 |
|---|---|
| 02_SOFTWARE_OVERVIEW.md | ソフトウェア構成とManager責務 |
| 03_LOG_FORMAT.md | ログ形式 |
| 04_STATE_MACHINE.md | 状態遷移 |
| 07_DISPLAY_UI_SPEC.md | 表示UI仕様 |
| 08_POWER_ARCHITECTURE.md | 電源構成 |

---

## 3. 通信構成

```text
XIAO ESP32S3 Plus
   │
   │ HTTPS POST / JSON
   ▼
GAS WebApp
   │
   │ appendRow
   ▼
Google Spreadsheet
```

---

## 4. 通信方式

| 項目 | 内容 |
|---|---|
| プロトコル | HTTPS |
| メソッド | POST |
| Content-Type | application/json |
| 文字コード | UTF-8 |
| 送信形式 | JSON |
| 応答形式 | JSON |

---

## 5. エンドポイント

GAS WebApp のデプロイURLを使用する。

```text
https://script.google.com/macros/s/{DEPLOYMENT_ID}/exec
```

実際のURLはソースコードへ直書きせず、設定値として管理する。

---

## 6. 認証方式

### 6.1 初期実装

初期実装では以下を使用する。

| 項目 | 内容 |
|---|---|
| device_id | 端末識別子 |
| secret | 共有シークレット |

### 6.2 認証方針

- `device_id` が未指定の場合は拒否する
- `secret` が不一致の場合は拒否する
- `secret` は Spreadsheet に保存しない
- `secret` はログへ出力しない

### 6.3 将来拡張

HMAC方式は将来拡張として検討する。

本書でいう「将来拡張」は通信認証方式の拡張であり、プロジェクト全体の Phase2 / Phase3 とは別概念である。

---

## 7. Payload種別

| type | 内容 | 保存先 |
|---|---|---|
| observation | 環境観測データ | OBSERVATION_LOG / Spreadsheet |
| event | 操作・状態イベント | EVENT_LOG / Spreadsheet |
| error | エラー情報 | ERROR_LOG / Spreadsheet |
| system | システム状態 | SYSTEM_LOG / Spreadsheet |
| ai | AI生成結果 | AI_LOG / Spreadsheet、Phase2以降 |

---

## 8. 共通Payload項目

すべてのPayloadに以下を含める。

| 項目 | 型 | 必須 | 内容 |
|---|---|---|---|
| type | string | 必須 | Payload種別 |
| device_id | string | 必須 | 端末識別子 |
| secret | string | 必須 | 認証用共有シークレット |
| timestamp | string | 必須 | RTC基準のISO 8601時刻 |
| firmware_version | string | 任意 | ファームウェア版 |
| schema_version | string | 必須 | Payloadスキーマ版 |

---

## 9. Observation Payload

### 9.1 概要

環境観測値を送信するPayloadである。

項目は `03_LOG_FORMAT.md` の OBSERVATION_LOG と整合させる。

### 9.2 JSON例

```json
{
  "type": "observation",
  "schema_version": "1.0",
  "device_id": "dk-001",
  "secret": "********",
  "timestamp": "2026-06-03T12:00:00+09:00",
  "firmware_version": "0.1.0",
  "co2_ppm": 500,
  "temperature_c": 25.3,
  "humidity_pct": 45.2,
  "pressure_hpa": 1012.4,
  "voc_index": 120,
  "nox_index": 8,
  "lux": 350.5,
  "uv": 0.02,
  "pm1_0": 3.1,
  "pm2_5": 5.6,
  "pm4_0": 7.8,
  "pm10": 12.4,
  "presence": 1,
  "sound_level": 42.5,
  "battery_v": 3.92,
  "usb_power": 1,
  "rssi": -62
}
```

### 9.3 フィールド定義

| 項目 | 型 | 単位 | 必須 | 内容 |
|---|---|---:|---|---|
| co2_ppm | number | ppm | 任意 | SCD41 CO₂濃度 |
| temperature_c | number | ℃ | 任意 | BME680 温度 |
| humidity_pct | number | % | 任意 | BME680 湿度 |
| pressure_hpa | number | hPa | 任意 | BME680 気圧 |
| voc_index | number | index | 任意 | SGP41 VOC Index |
| nox_index | number | index | 任意 | SGP41 NOx Index |
| lux | number | lx | 任意 | LTR390 照度 |
| uv | number | - | 任意 | LTR390 UV値 |
| pm1_0 | number | µg/m³ | 任意 | SPS30 PM1.0 |
| pm2_5 | number | µg/m³ | 任意 | SPS30 PM2.5 |
| pm4_0 | number | µg/m³ | 任意 | SPS30 PM4.0 |
| pm10 | number | µg/m³ | 任意 | SPS30 PM10 |
| presence | number | 0/1 | 任意 | HLK-LD2410C 人感状態 |
| sound_level | number | 未確定 | 任意 | ICS-43434 音環境値 |
| battery_v | number | V | 任意 | バッテリー電圧 |
| usb_power | number | 0/1 | 任意 | USB給電状態 |
| rssi | number | dBm | 任意 | Wi-Fi受信強度 |

### 9.4 未取得値の扱い

センサー未搭載、取得失敗、初期化未完了の場合は、該当項目を `null` とする。

項目自体は省略せず、スキーマの安定性を優先する。

---

## 10. Event Payload

### 10.1 JSON例

```json
{
  "type": "event",
  "schema_version": "1.0",
  "device_id": "dk-001",
  "secret": "********",
  "timestamp": "2026-06-03T12:01:00+09:00",
  "event": "encoder_push",
  "value": "home_to_detail"
}
```

### 10.2 主なevent値

| event | 内容 |
|---|---|
| boot | 起動 |
| shutdown | シャットダウン準備 |
| encoder_cw | ロータリーエンコーダ右回転 |
| encoder_ccw | ロータリーエンコーダ左回転 |
| encoder_push | 押下 |
| page_change | 画面切替 |
| display_update | 表示更新 |
| usb_power_lost | USB給電喪失 |
| usb_power_restore | USB給電復帰 |

---

## 11. Error Payload

### 11.1 JSON例

```json
{
  "type": "error",
  "schema_version": "1.0",
  "device_id": "dk-001",
  "secret": "********",
  "timestamp": "2026-06-03T12:02:00+09:00",
  "module": "network",
  "error_code": "NET-001",
  "error_detail": "Wi-Fi connection failed"
}
```

### 11.2 module値

| module | 内容 |
|---|---|
| sensor | センサー |
| rtc | RTC |
| network | Wi-Fi / HTTPS |
| storage | microSD |
| display | E-Paper |
| power | 電源 |
| system | システム全体 |

---

## 12. System Payload

### 12.1 JSON例

```json
{
  "type": "system",
  "schema_version": "1.0",
  "device_id": "dk-001",
  "secret": "********",
  "timestamp": "2026-06-03T12:03:00+09:00",
  "event": "rtc_sync",
  "detail": "RTC read success"
}
```

---

## 13. AI Payload

AI Payload は Phase2 以降の将来拡張とする。

初期実装では必須としない。

### 13.1 JSON例

```json
{
  "type": "ai",
  "schema_version": "1.0",
  "device_id": "dk-001",
  "secret": "********",
  "timestamp": "2026-06-03T12:30:00+09:00",
  "prompt_id": "daily_summary",
  "generated_text": "室内環境は安定しています。",
  "generation_time_ms": 1200,
  "status": "ok"
}
```

---

## 14. GAS応答仕様

### 14.1 成功応答

```json
{
  "status": "ok",
  "message": "stored",
  "received_type": "observation",
  "server_time": "2026-06-03T12:00:01+09:00"
}
```

### 14.2 エラー応答

```json
{
  "status": "error",
  "error_code": "AUTH-001",
  "message": "invalid secret"
}
```

---

## 15. HTTPステータス

| ステータス | 内容 |
|---:|---|
| 200 | 正常処理 |
| 400 | JSON形式不正、必須項目不足 |
| 401 | 認証失敗 |
| 500 | GAS内部エラー |

GAS WebApp の制約により、実際のHTTPステータスが常に200となる場合は、JSON本文の `status` と `error_code` を正とする。

---

## 16. エラーコード

| error_code | 内容 |
|---|---|
| AUTH-001 | secret不一致 |
| AUTH-002 | device_id未指定 |
| REQ-001 | JSON解析失敗 |
| REQ-002 | 必須項目不足 |
| REQ-003 | 未対応type |
| SHEET-001 | Spreadsheet書込失敗 |
| GAS-001 | GAS内部例外 |

---

## 17. Spreadsheet保存仕様

### 17.1 基本方針

1レコードを1行として保存する。

Payload種別ごとにシートを分ける。

| type | シート名 |
|---|---|
| observation | observation_log |
| event | event_log |
| error | error_log |
| system | system_log |
| ai | ai_log |

### 17.2 observation_log 列定義

| 列 | 項目 |
|---:|---|
| 1 | server_received_at |
| 2 | device_id |
| 3 | timestamp |
| 4 | firmware_version |
| 5 | schema_version |
| 6 | co2_ppm |
| 7 | temperature_c |
| 8 | humidity_pct |
| 9 | pressure_hpa |
| 10 | voc_index |
| 11 | nox_index |
| 12 | lux |
| 13 | uv |
| 14 | pm1_0 |
| 15 | pm2_5 |
| 16 | pm4_0 |
| 17 | pm10 |
| 18 | presence |
| 19 | sound_level |
| 20 | battery_v |
| 21 | usb_power |
| 22 | rssi |
| 23 | raw_json |

---

## 18. 再送仕様

### 18.1 端末側方針

- 送信前にmicroSDへ保存する
- GAS送信成功後に送信済みとして扱う
- 送信失敗時は未送信キューへ残す
- 次回通信可能時に再送する
- 再送順序は古いデータを優先する

### 18.2 GAS側方針

GAS側では同一データの重複受信を完全には防がない。

将来、`record_id` を導入して重複排除を検討する。

---

## 19. セキュリティ方針

- HTTPS通信を使用する
- secretをSpreadsheetへ保存しない
- secretをGASログへ出力しない
- Wi-Fi SSID、パスワード、GAS URL、secretは設定値として分離する
- Gemini APIキー等は端末側に保持しない方針とする

---

## 20. 将来拡張

- HMAC認証
- record_idによる重複排除
- 複数端末対応
- Gemini連携
- ダッシュボード連携
- 統計分析

---

## 21. 採択方針

- ローカル保存を通信より優先する
- 通信失敗で観測を止めない
- Payload項目は `03_LOG_FORMAT.md` と整合させる
- Phase1では observation / event / error / system を優先する
- AI Payload は Phase2以降とする

---

## 22. 変更履歴

| 日付 | 内容 |
|---|---|
| 2026-06-03 | 初版作成 |
| 2026-06-03 | 査読指摘を反映し、Observation Payload完全定義、応答仕様、エラーコード、Spreadsheet列定義を追加 |
