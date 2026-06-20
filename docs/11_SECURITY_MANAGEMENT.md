# digital-kakejiku セキュリティ管理仕様

最終更新: 2026-06-20  
文書版: vNext 1.1 review reflected

---

# 1. 目的

本書はセキュリティ管理の基準源である。

---

# 2. 保護対象

- API_SECRET
- GEMINI_API_KEY
- Wi-Fi Password
- OAuth Token
- Script Properties値

---

# 3. 保存先

| 情報 | 保存先 | 状態 |
|---|---|---|
| API_SECRET | ESP32 NVS / Script Properties | CONFIRMED |
| WIFI_PASSWORD | ESP32 NVS | CONFIRMED |
| GEMINI_API_KEY | Script Properties | FINALIZED |
| SYSTEM_VERSION | Script Properties | CONFIRMED |

Spreadsheet、GitHub、Logへ保存しない。

---

# 4. 認証方式

Phase1。

```text
device_id + secret
```

状態。

```text
CONFIRMED
```

---

# 5. HMAC将来拡張

Phase3以降の候補。

```text
request_id + timestamp + body + secret
 ↓
HMAC-SHA256
```

目的。

- secretを平文送信しない
- リプレイ攻撃を抑制する
- timestampとmessage_idで重複検出する

状態。

```text
PROPOSED
```

---

# 6. Gemini API Keyバックアップ

通常保存先。

- Script Properties

バックアップ方針。

- GitHubへ保存しない
- Spreadsheetへ平文保存しない
- バックアップが必要な場合は、別管理の安全な保管先を利用する

system_configへの暗号化バックアップは将来検討とし、現時点では未採択とする。

状態。

```text
PROPOSED
```

---

# 7. ログマスク

禁止。

- API_SECRET
- GEMINI_API_KEY
- Password

保存可。

- device_id
- firmware_version
- boot_count
- error_code

---

# 8. STATUS

| 項目 | 状態 |
|---|---|
| device_id + secret | CONFIRMED |
| Gemini API Key GAS限定 | FINALIZED |
| Script Properties | CONFIRMED |
| HMAC | PROPOSED |
| Keyバックアップ戦略 | PROPOSED |
| Log Masking | FINALIZED |

---

# 9. CHANGE LOG

| 日付 | 内容 |
|---|---|
| 2026-06-20 | HMAC将来拡張を追加 |
| 2026-06-20 | Gemini API Keyバックアップ方針を整理 |
