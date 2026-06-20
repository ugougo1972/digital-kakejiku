# digital-kakejiku セキュリティ管理仕様

最終更新: 2026-06-20  
文書版: vNext 1.2 review reflected

---

# 1. 目的

本書はセキュリティ管理の基準源である。

対象。

- API_SECRET
- GEMINI_API_KEY
- Wi-Fi Password
- Script Properties
- ESP32 NVS
- ログマスク
- 将来認証強化

---

# 2. 基本方針

- 機密情報をGitHubへ保存しない
- 機密情報をSpreadsheetへ保存しない
- 機密情報をLogへ保存しない
- Gemini API KeyはGASのみで使用する
- ESP32にGemini API Keyを保存しない

---

# 3. 保存先

| 情報 | 保存先 | 状態 |
|---|---|---|
| API_SECRET | ESP32 NVS / Script Properties | CONFIRMED |
| WIFI_SSID | ESP32 NVS | CONFIRMED |
| WIFI_PASSWORD | ESP32 NVS | CONFIRMED |
| GEMINI_API_KEY | Script Properties | FINALIZED |
| SYSTEM_VERSION | Script Properties | CONFIRMED |

---

# 4. 保存禁止

以下への保存を禁止する。

- GitHub
- Spreadsheet
- Log
- README
- 設計書本文
- サンプル以外の設定ファイル

---

# 5. 認証方式

Phase 1。

```text
device_id + secret
```

状態。

```text
CONFIRMED
```

---

# 6. Secretローテーション

Secret漏洩または漏洩疑いがある場合は以下を行う。

1. 新しいsecretを生成する
2. Script Propertiesの対象device_id用secretを更新する
3. ESP32 NVSのAPI_SECRETを更新する
4. 古いsecretをScript Propertiesから削除する
5. doPost疎通確認を行う
6. SECURITY_ERRORが消えることを確認する

備考。

- ESP32 NVS更新手順はPhase 2実装時に確定する
- 背面UIからAPI Keyは編集しない
- Secret入力UIの採否は未確定

状態。

```text
CONFIRMED
```

---

# 7. Gemini API Keyローテーション

Gemini API Key更新時は以下を行う。

1. Google Cloud側で新Keyを作成する
2. Script PropertiesのGEMINI_API_KEYを更新する
3. GAS単体でPoem生成テストを行う
4. 旧Keyを無効化する
5. error_logのPOEM_ERRORが継続しないことを確認する

Spreadsheetへの暗号化バックアップは採用しない。

理由。

- Spreadsheet保存禁止方針と衝突するため
- 機密情報はScript Propertiesおよび外部の安全な保管先で管理するため

---

# 8. 将来拡張: HMAC

Phase 3候補。

現在の固定secret方式は実装容易だが、漏洩時のリスクがある。

HMAC方式候補。

```text
request_id
timestamp
message_id
payload_hash
secret
```

を用いて署名を生成する。

GAS側では同じ材料から署名を再計算し、一致を確認する。

期待効果。

- secret自体が通信に現れない
- replay attack耐性を向上できる
- timestampとmessage_idで重複検出しやすい

状態。

```text
PROPOSED
```

---

# 9. ログマスク

保存禁止。

- API_SECRET
- GEMINI_API_KEY
- Password
- Token

保存可。

- device_id
- firmware_version
- boot_count
- schema_version

---

# 10. STATUS

| 項目 | 状態 |
|---|---|
| device_id + secret | CONFIRMED |
| Gemini API Key GAS限定 | FINALIZED |
| Secretローテーション | CONFIRMED |
| Gemini API Keyローテーション | CONFIRMED |
| Spreadsheet機密保存禁止 | FINALIZED |
| HMAC | PROPOSED |

---

# 11. CHANGE LOG

| 日付 | 内容 |
|---|---|
| 2026-06-20 | vNext 1.2としてSecretローテーション手順を追加 |
| 2026-06-20 | Gemini API Keyローテーション手順を追加 |
| 2026-06-20 | HMAC将来拡張を補強 |
