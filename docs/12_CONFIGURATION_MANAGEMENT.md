# 12_CONFIGURATION_MANAGEMENT.md

# digital-kakejiku 設定管理仕様

最終更新: 2026-06-19

---

# 1. 目的

本ドキュメントは digital-kakejiku における設定値の管理方式を定義する。

査読反映および既存文書との整合性維持を目的として、source_config、Script Properties、ESP32 NVS の責務境界を明確化する。

関連文書。

- 06_GAS_API_SPEC.md
- 10_CALENDAR_POEM_SUBSYSTEM.md
- 11_SECURITY_MANAGEMENT.md

---

# 2. 基本方針

設定値は以下へ分離する。

| 保存先 | 用途 |
|---|---|
| Script Properties | 機密情報 |
| source_config | 運用設定 |
| ESP32 NVS | 端末設定 |
| ソースコード定数 | 固定値 |

機密情報と運用設定を混在させない。

---

# 3. 管理対象分類

## 機密情報

対象。

- API_SECRET
- GEMINI_API_KEY
- Wi-Fi Password
- OAuth Token

保存先。

- Script Properties
- ESP32 NVS

Spreadsheet保存禁止。

---

## 運用設定

対象。

- URL
- 更新周期
- 有効フラグ
- 表示設定

保存先。

- source_config

---

## 端末設定

対象。

- device_id
- display_mode
- debug_mode

保存先。

- ESP32 NVS

---

# 4. source_config

## 役割

Calendar Subsystem および Poem Subsystem が参照する運用設定。

---

## 管理項目例

| key | 内容 |
|---|---|
| HOLIDAY_SOURCE_URL | 祝日取得元 |
| SOLAR_TERM_SOURCE_URL | 二十四節気取得元 |
| SEASON_INFO_URL | 解説取得元 |
| CALENDAR_ENABLE | Calendar有効 |
| POEM_ENABLE | Poem有効 |

---

## 保存禁止

以下は禁止。

- API_SECRET
- GEMINI_API_KEY
- Password

状態。

FINALIZED

---

# 5. Script Properties

## 役割

GAS側機密情報管理。

---

## 管理項目

| key | 内容 |
|---|---|
| API_SECRET | API認証 |
| GEMINI_API_KEY | Gemini利用 |
| SYSTEM_VERSION | バージョン管理 |

---

## 制約

Spreadsheet保存禁止。

ログ出力禁止。

状態。

FINALIZED

---

# 6. ESP32 NVS

## 役割

端末設定保持。

---

## 管理項目

| key | 内容 |
|---|---|
| DEVICE_ID | 端末識別 |
| WIFI_SSID | Wi-Fi |
| WIFI_PASSWORD | Wi-Fi |
| API_SECRET | API認証 |
| DISPLAY_MODE | 表示設定 |

---

## 制約

Gemini API Key保存禁止。

状態。

FINALIZED

理由。

Gemini API呼出はGASのみ。

---

# 7. Calendar Subsystemとの関係

Calendarは以下を参照する。

- source_config
- solar_term_master
- season_dictionary

参照しない。

- API_SECRET
- GEMINI_API_KEY

---

# 8. Poem Subsystemとの関係

Poemは以下を参照する。

- source_config
- calendar_master
- observation_log

Gemini API利用時。

- GEMINI_API_KEY

取得元。

- Script Properties

---

# 9. 設定変更フロー

```text
管理者変更
    ↓
source_config更新
    ↓
Calendar/Poem参照
    ↓
反映
```

機密情報。

```text
管理者変更
    ↓
Script Properties更新
    ↓
次回実行反映
```

---

# 10. エラー処理

## CONFIG_ERROR

対象。

- 設定欠損
- URL欠損
- 不正設定

保存先。

- error_log

---

## SECURITY_ERROR

対象。

- API Key混入
- Secret混入

保存先。

- error_log

---

# 11. バージョン管理

設定変更時。

推奨。

```text
CONFIG_VERSION
```

保持。

状態。

PROPOSED

---

# 12. 将来拡張

候補。

- 設定履歴
- ロールバック
- 多端末設定管理

状態。

PROPOSED

---

# 13. STATUS

| 項目 | 状態 |
|---|---|
| source_config採択 | CONFIRMED |
| Script Properties採択 | CONFIRMED |
| ESP32 NVS採択 | CONFIRMED |
| Gemini API Key GAS限定 | FINALIZED |
| Spreadsheet保存禁止 | FINALIZED |
| CONFIG_VERSION | PROPOSED |
| 設定履歴管理 | PROPOSED |

---

# 14. CHANGE LOG

| 日付 | 内容 | 理由 |
|---|---|---|
| 2026-06-19 | 新規作成 | 査読対応 |
| 2026-06-19 | source_config責務整理 | Calendar整合 |
| 2026-06-19 | Script Properties整理 | Security整合 |
| 2026-06-19 | STATUS追加 | 確定度管理導入 |
