# 06_GAS_API_SPEC.md

# digital-kakejiku GAS API仕様

最終更新: 2026-06-19

---

## 1. 概要

本書は digital-kakejiku 端末と Google Apps Script（GAS）WebApp 間の通信仕様を定義する。

本仕様は、XIAO ESP32S3 Plus から HTTPS POST で観測データ、イベント、エラー情報、システム状態を送信し、GAS 側で Google Spreadsheet へ保存することを目的とする。

GAS本実装では、PoC用 `RawLogs` ではなく、Payload種別ごとの正式シートへ保存する。

---

## 2. 関連ドキュメント

| 文書 | 内容 |
|---|---|
| 02_SOFTWARE_OVERVIEW.md | ソフトウェア構成とManager責務 |
| 03_LOG_FORMAT.md | ログ・Spreadsheet形式 |
| 04_STATE_MACHINE.md | 状態遷移 |
| 07_DISPLAY_UI_SPEC.md | 表示UI仕様 |
| 08_POWER_ARCHITECTURE.md | 電源構成 |
| 09_SPI_RESOURCE_CONTROL.md | ESP32側SPI排他制御 |
| 10_CALENDAR_POEM_SUBSYSTEM.md | 暦・詩サブシステム |
| 11_SECURITY_MANAGEMENT.md | 認証情報管理 |

---

## 3. 通信構成

```text
XIAO ESP32S3 Plus
   │
   │ HTTPS POST / JSON
   ▼
GAS WebApp
   │
   ├─ Payload validation
   ├─ Authentication
   ├─ Type dispatch
   ├─ Spreadsheet append
   └─ JSON response
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
| タイムゾーン | Asia/Tokyo |

---

## 5. エンドポイント

GAS WebApp のデプロイURLを使用する。

```text
https://script.google.com/macros/s/{DEPLOYMENT_ID}/exec
```

実際のURLはソースコードへ直書きせず、ESP32側設定値として管理する。

---

## 6. 認証方式

### 6.1 初期実装

| 項目 | 内容 |
|---|---|
| device_id | 端末識別子 |
| secret | 共有シークレット |

### 6.2 GAS側secret管理

`secret` は Script Properties に保存する。

コード直書きは禁止する。

### 6.3 認証方針

- `device_id` が未指定の場合は拒否する
- `secret` が未指定の場合は拒否する
- `secret` が不一致の場合は拒否する
- `secret` は Spreadsheet に保存しない
- `secret` は GASログへ出力しない
- raw_json保存時も `secret` を除去またはマスクする

### 6.4 将来拡張

### 6.4 将来拡張

HMAC方式は将来拡張として検討する。

### 6.5 ESP32側secret管理

ESP32側のsecretは、初期開発中を除きNVSに保存する方針とする。

実secret、Wi-Fi password、Gemini API KeyをGitHubへcommitしてはならない。

詳細は `11_SECURITY_MANAGEMENT.md` を正とする。


---

## 7. Payload種別

| type | 内容 | 保存先 |
|---|---|---|
| observation | 環境観測データ | observation_log |
| event | 操作・状態イベント | event_log |
| error | エラー情報 | error_log |
| system | システム状態 | system_log |

GAS本実装では、`ai` PayloadはESP32から受け取らない。Poem SubsystemはGAS内部処理として `poem_cache` に保存する。

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


### 8.1 追加検討中の共通項目

以下は査読指摘を受けた追加検討項目であり、現時点では `PROPOSED` とする。

| 項目 | 型 | 必須 | 内容 | 状態 |
|---|---|---|---|---|
| timestamp_validity | string | 任意 | rtc/ntp/estimated/invalid等の時刻信頼度 | PROPOSED |
| boot_count | number | 任意 | 起動回数。DeepSleep PoC成果保持用 | PROPOSED |
| wakeup_reason | string | 任意 | 起動要因。DeepSleep PoC成果保持用 | PROPOSED |
| message_id | string | 任意 | 重複検出用ID | PROPOSED |
| retry_count | number | 任意 | 再送回数 | PROPOSED |

これらは確定済みフィールド数には含めない。採用時は `schema_version` を更新する。

---

## 9. Observation Payload

### 9.1 JSON例

```json
{
  "type": "observation",
  "schema_version": "1.0",
  "device_id": "dk-0001",
  "secret": "********",
  "timestamp": "2026-06-19T12:00:00+09:00",
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

### 9.2 フィールド定義

| 項目 | 型 | 単位 | 必須 | 内容 |
|---|---|---:|---|---|
| co2_ppm | number/null | ppm | 任意 | SCD41 CO₂濃度 |
| temperature_c | number/null | ℃ | 任意 | BME680またはSCD41温度 |
| humidity_pct | number/null | % | 任意 | BME680またはSCD41湿度 |
| pressure_hpa | number/null | hPa | 任意 | BME680気圧 |
| voc_index | number/null | index | 任意 | SGP41 VOC Index |
| nox_index | number/null | index | 任意 | SGP41 NOx Index |
| lux | number/null | lx | 任意 | LTR390照度 |
| uv | number/null | - | 任意 | LTR390 UV値 |
| pm1_0 | number/null | µg/m³ | 任意 | SPS30 PM1.0 |
| pm2_5 | number/null | µg/m³ | 任意 | SPS30 PM2.5 |
| pm4_0 | number/null | µg/m³ | 任意 | SPS30 PM4.0 |
| pm10 | number/null | µg/m³ | 任意 | SPS30 PM10 |
| presence | number/null | 0/1 | 任意 | HLK-LD2410C人感状態 |
| sound_level | number/null | 未確定 | 任意 | ICS-43434音環境値 |
| battery_v | number/null | V | 任意 | バッテリー電圧 |
| usb_power | number/null | 0/1 | 任意 | USB給電状態 |
| rssi | number/null | dBm | 任意 | Wi-Fi受信強度 |

---


### 9.3 値の妥当性検証

GAS側では、Observation Payloadについて以下を検証する。

| 種別 | 内容 | 異常時動作 |
|---|---|---|
| 型検証 | number/null/string等が仕様と一致するか | error応答またはerror_log記録 |
| 単位前提 | ESP32側が所定単位で送信しているか | 実装側仕様違反として扱う |
| 物理異常 | 物理的に不自然な値か | 保存は可、error_logまたはnote記録 |
| センサー仕様逸脱 | センサー仕様範囲を明らかに外れるか | error_log記録 |
| null許容 | 未取得値がnullで送られているか | 省略時はschema不整合扱い |

初期実装では、観測値が範囲外であっても直ちに破棄せず、異常疑いとして保存・記録する方針とする。

具体的な閾値は実測・センサー仕様確認後に `03_LOG_FORMAT.md` 側で管理する。

---

## 10. Event Payload

### 10.1 JSON例

```json
{
  "type": "event",
  "schema_version": "1.0",
  "device_id": "dk-0001",
  "secret": "********",
  "timestamp": "2026-06-19T12:01:00+09:00",
  "firmware_version": "0.1.0",
  "event": "encoder_push",
  "value": "home_to_detail",
  "detail": "front_display_page_changed"
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
| maintenance_action | 保守操作 |

---

## 11. Error Payload

### 11.1 JSON例

```json
{
  "type": "error",
  "schema_version": "1.0",
  "device_id": "dk-0001",
  "secret": "********",
  "timestamp": "2026-06-19T12:02:00+09:00",
  "firmware_version": "0.1.0",
  "module": "network",
  "error_code": "NET-001",
  "error_detail": "Wi-Fi connection failed",
  "severity": "error"
}
```

### 11.2 module値

| module | 内容 |
|---|---|
| sensor | センサー |
| rtc | RTC |
| network | Wi-Fi / HTTPS |
| storage | microSD |
| display | E-Paper / OLED |
| power | 電源 |
| gas | GAS |
| calendar | Calendar Subsystem |
| source | 外部情報源 |
| poem | Poem Subsystem |
| security | 認証 |
| system | システム全体 |

---

## 12. System Payload

### 12.1 JSON例

```json
{
  "type": "system",
  "schema_version": "1.0",
  "device_id": "dk-0001",
  "secret": "********",
  "timestamp": "2026-06-19T12:03:00+09:00",
  "firmware_version": "0.1.0",
  "event": "rtc_sync",
  "detail": "RTC read success"
}
```

---

## 13. GAS応答仕様

### 13.1 成功応答

```json
{
  "status": "ok",
  "code": 200,
  "message": "stored",
  "received_type": "observation",
  "server_time": "2026-06-19T12:00:01+09:00"
}
```

### 13.2 エラー応答

```json
{
  "status": "error",
  "code": 400,
  "error_code": "REQ-002",
  "message": "required field missing",
  "server_time": "2026-06-19T12:00:01+09:00"
}
```

---


### 13.3 バリデーションエラー応答

Payload検証に失敗した場合、GASは可能な限りJSON本文で理由を返す。

```json
{
  "status": "error",
  "code": 400,
  "error_code": "REQ-004",
  "message": "invalid field type",
  "field": "temperature_c",
  "server_time": "2026-06-19T12:00:01+09:00"
}
```

GAS WebAppの制約によりHTTPステータスが200となる場合でも、判定はJSON本文を正とする。

---

## 14. HTTPステータス

GAS WebApp の制約により、実際のHTTPステータスが常に200となる場合がある。

その場合はJSON本文の `status`、`code`、`error_code` を正とする。

| JSON code | 内容 |
|---:|---|
| 200 | 正常処理 |
| 400 | JSON形式不正、必須項目不足 |
| 401 | 認証失敗 |
| 500 | GAS内部エラー |

---

## 15. エラーコード

| error_code | 内容 |
|---|---|
| AUTH-001 | secret不一致 |
| AUTH-002 | device_id未指定 |
| AUTH-003 | secret未指定 |
| REQ-001 | JSON解析失敗 |
| REQ-002 | 必須項目不足 |
| REQ-003 | 未対応type |
| REQ-004 | 型不正 |
| SHEET-001 | Spreadsheet書込失敗 |
| GAS-001 | GAS内部例外 |

---


### 15.1 追加エラーコード

| error_code | 内容 |
|---|---|
| REQ-005 | timestamp不正 |
| REQ-006 | schema_version不一致 |
| RTC-001 | RTC_ERROR由来の仮時刻 |
| TIME-001 | timestamp_validity invalid |
| CALENDAR-001 | calendar_master生成失敗 |
| CALENDAR-002 | 祝日取得失敗 |
| CALENDAR-003 | 二十四節気取得失敗 |
| CALENDAR-004 | 七十二候辞書取得失敗 |
| SOURCE-001 | source_config不備 |
| SOURCE-002 | 外部URL取得失敗 |
| POEM-001 | Gemini API失敗 |
| POEM-002 | poem_cache保存失敗 |
| SECURITY-001 | 機密値混入検出 |

---

## 16. Spreadsheet保存仕様

Payload種別ごとにシートを分ける。

| type | シート名 |
|---|---|
| observation | observation_log |
| event | event_log |
| error | error_log |
| system | system_log |

詳細な列定義は `03_LOG_FORMAT.md` に従う。

---

## 17. 再送仕様

### 17.1 端末側方針

- 送信前にmicroSDへ保存する
- GAS送信成功後に送信済みとして扱う
- 送信失敗時は未送信キューへ残す
- 次回通信可能時に再送する
- 再送順序は古いデータを優先する

### 17.2 GAS側方針

GAS側では同一データの重複受信を完全には防がない。

将来、`record_id` を導入して重複排除を検討する。

---

## 18. セキュリティ方針

- HTTPS通信を使用する
- secretをSpreadsheetへ保存しない
- secretをGASログへ出力しない
- Wi-Fi SSID、パスワード、API Keyをログ出力しない
- Script Propertiesを使用する
- device_id形式は `dk-xxxx` とする

---

## 19. doPost本実装方針

GAS本実装の処理順序は以下とする。

```text
doPost(e)
↓
request body存在確認
↓
JSON parse
↓
共通必須項目検証
↓
secret検証
↓
type検証
↓
type別payload検証
↓
secret除去済みraw_json生成
↓
type別Spreadsheet append
↓
JSON応答
```

---

## 20. Calendar / Poemとの関係

Calendar SubsystemおよびPoem Subsystemは、ESP32からの通常POST APIとは分離する。

- Calendar SubsystemはGAS内部処理
- Poem SubsystemはGAS内部処理
- Gemini API呼び出しはESP32から行わない
- Poem Subsystemの出力は `poem_cache`
- Calendar Subsystemの出力は `calendar_master`

### 20.1 Calendar / Poem API責務の補足

Calendar SubsystemおよびPoem SubsystemはGAS内部処理であり、ESP32から直接Gemini APIや暦生成処理を呼び出さない。

ESP32はGAS側で生成済みの `calendar_master` および `poem_cache` を表示用データとして参照する。

表示時にPoemを再生成してはならない。


---


---

## 20.1 RTC_ERROR / タイムスタンプ異常時の処理

RTC異常または仮時刻が送信された場合、GASは以下の方針で処理する。

### 20.1.1 保存方針

| 状態 | observation_log | error_log | 備考 |
|---|---|---|---|
| RTC正常 | 保存 | 不要 | timestamp_validity=rtc |
| NTP補正済み | 保存 | 必要に応じてsystem_log | timestamp_validity=ntp |
| 仮時刻 | 保存 | RTC-001を記録 | server_received_atを正とする |
| timestamp不正 | 保存可 | TIME-001を記録 | Calendar/Poemの日付判定には使わない |

### 20.1.2 Calendar/Poemへの影響

Calendar SubsystemおよびPoem Subsystemの日付判定では、異常な `device_timestamp` を使用しない。

基準日はGAS側のAsia/Tokyo日付を優先する。

Poem生成で「前日扱い」等の推測補正は行わない。

### 20.1.3 フラグ

`timestamp_validity` が未実装の場合は、GAS側で `device_timestamp` の形式と妥当性を検査し、必要に応じて `error_log` へ記録する。


---

## 21. 実装前チェックリスト

- [ ] Script PropertiesにAPI_SECRETを設定
- [ ] Script Propertiesに必要に応じてGEMINI_API_KEYを設定
- [ ] Spreadsheetに正式シートを作成
- [ ] `RawLogs`依存を除去
- [ ] `type`分岐を実装
- [ ] `secret`除去済みraw_json生成を実装
- [ ] 正常系PowerShell試験
- [ ] 認証失敗PowerShell試験
- [ ] JSON不正PowerShell試験
- [ ] 未対応type試験
- [ ] ESP32接続試験
- [ ] timestamp_validity採否を決定
- [ ] RTC_ERROR時のerror_log記録を実装
- [ ] Observation Payloadの型検証を実装
- [ ] 物理異常値検出方針を実装
- [ ] Calendar/Poemがdevice_timestamp異常に依存しないことを確認
- [ ] Gemini API KeyがScript Propertiesからのみ参照されることを確認

---

## 22. STATUS

| 項目 | 状態 | 備考 |
|---|---|---|
| HTTPS POST JSON API | CONFIRMED | PoC成功済み |
| Payload type分岐 | CONFIRMED | observation/event/error/system |
| secret保存禁止 | FINALIZED | Spreadsheet/GASログへ保存しない |
| Script Properties管理 | CONFIRMED | API_SECRET / GEMINI_API_KEY |
| Calendar/Poem GAS内部処理 | CONFIRMED | ESP32からGemini APIを呼ばない |
| Observation追加検討フィールド | PROPOSED | timestamp_validity等 |
| 値の妥当性検証 | PROPOSED | 閾値は実測後 |
| RTC_ERROR処理 | CONFIRMED | 保存継続、error_log記録 |

---

## 23. CHANGE LOG

| 日付 | 内容 | 理由 | 著者 |
|---|---|---|---|
| 2026-06-19 | 追加検討フィールドを明示 | Payload 21/25混在指摘への対応 | ChatGPT |
| 2026-06-19 | 値の妥当性検証方針を追加 | 単位・範囲検証未定義指摘への対応 | ChatGPT |
| 2026-06-19 | RTC_ERROR時の処理を追加 | Calendar/Poemへの影響明確化 | ChatGPT |
| 2026-06-19 | Calendar/PoemのGAS内部責務を補足 | ESP32側責務の曖昧さ解消 | ChatGPT |
| 2026-06-19 | STATUSセクション追加 | 確定度管理導入 | ChatGPT |
