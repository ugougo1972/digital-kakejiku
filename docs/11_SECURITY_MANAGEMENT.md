# 11_SECURITY_MANAGEMENT.md

# digital-kakejiku セキュリティ管理仕様

最終更新: 2026-06-19

---

# 1. 目的

本ドキュメントは digital-kakejiku の認証情報管理、ログ管理、API保護、機密情報保護方針を定義する。

Claude査読結果を反映し、secret管理、Gemini API Key管理、NVS利用方針、ログマスク方針を整理する。

---

# 2. 基本方針

- 最小権限
- 機密情報非公開
- ログマスク
- GitHub非公開化不要
- 認証情報をコミットしない

---

# 3. 保護対象

対象。

- API_SECRET
- GEMINI_API_KEY
- Wi-Fi Password
- OAuth Token
- Access Token
- Script Properties値

---

# 4. ESP32側管理

## API_SECRET

保存先。

- NVS

状態。

CONFIRMED

---

## Wi-Fi設定

保存先。

- NVS

状態。

CONFIRMED

---

## Gemini API Key

ESP32へ保存しない。

状態。

FINALIZED

理由。

Gemini API呼び出しはGAS側のみ。

---

# 5. GAS側管理

保存先。

- Script Properties

対象。

- API_SECRET
- GEMINI_API_KEY

Spreadsheet保存禁止。

状態。

FINALIZED

---

# 6. GitHub管理

禁止。

- secret記載
- API Key記載
- Wi-Fi Password記載

禁止対象。

```text
config.h
secrets.h
.env
settings.json
```

サンプル値のみ記載可。

---

# 7. ログマスク方針

保存禁止。

- API_SECRET
- GEMINI_API_KEY
- Password

保存可。

- device_id
- firmware_version
- boot_count

---

## マスク例

入力。

```text
API_SECRET=ABCDEF123456
```

保存。

```text
API_SECRET=******
```

---

# 8. Spreadsheet管理

保存禁止。

- API_SECRET
- GEMINI_API_KEY
- Password

保存可。

- device_id
- sensor data
- event data

---

# 9. error_log方針

SECURITY_ERROR定義。

対象。

- 認証失敗
- Secret不一致
- 機密情報混入

記録例。

```text
SECURITY_ERROR
```

---

# 10. 認証方式

現在採択。

```text
device_id
+
secret
```

検証。

- GAS側

状態。

CONFIRMED

---

# 11. 将来拡張

候補。

- HMAC
- Device Certificate
- Mutual TLS

状態。

PROPOSED

---

# 12. Gemini API運用

Gemini API呼出。

- GASのみ

ESP32。

- 呼出禁止

状態。

FINALIZED

---

# 13. Calendar/Poemとの関係

Calendar。

- AI利用禁止

Poem。

- Gemini利用可

ただし。

- 暦生成禁止
- 暦推定禁止
- 欠損補完禁止

---

# 14. RTC_ERRORとの関係

RTC異常時でも。

- secret変更しない
- 認証方式変更しない

状態。

CONFIRMED

---

# 15. source_config管理

保存可。

- URL
- 更新日時
- 管理情報

保存禁止。

- API Key
- Password

---

# 16. Script Properties一覧

| Key | 用途 |
|---|---|
| API_SECRET | API認証 |
| GEMINI_API_KEY | Gemini利用 |
| CALENDAR_SOURCE_URL | 外部取得 |
| SYSTEM_VERSION | バージョン管理 |

---

# 17. セキュリティ監査項目

確認。

- GitHub漏洩
- Spreadsheet漏洩
- Log漏洩
- Script Properties設定

---

# 18. STATUS

| 項目 | 状態 |
|---|---|
| API_SECRET NVS保存 | CONFIRMED |
| Wi-Fi Password NVS保存 | CONFIRMED |
| Gemini API Key GAS限定 | FINALIZED |
| Script Properties採択 | CONFIRMED |
| Spreadsheet保存禁止 | FINALIZED |
| ログマスク | CONFIRMED |
| device_id+secret認証 | CONFIRMED |
| HMAC | PROPOSED |
| Mutual TLS | PROPOSED |

---

# 19. CHANGE LOG

| 日付 | 内容 | 理由 |
|---|---|---|
| 2026-06-19 | NVS方針追加 | Claude査読対応 |
| 2026-06-19 | Gemini API Key管理整理 | Calendar/Poem統合 |
| 2026-06-19 | ログマスク方針追加 | SECURITY_ERROR整合 |
| 2026-06-19 | STATUS追加 | 確定度管理導入 |
