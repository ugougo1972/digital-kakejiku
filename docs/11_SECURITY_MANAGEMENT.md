# 11_SECURITY_MANAGEMENT.md

# digital-kakejiku セキュリティ管理仕様

最終更新: 2026-06-20  
版: vNext 1.0

---

# 1. 目的

認証情報管理、ログ管理、API保護、機密情報保護方針を定義する。

# 2. 基本方針

- 最小権限
- 機密情報非公開
- ログマスク
- 認証情報をコミットしない
- Spreadsheetへ機密情報を保存しない
- ESP32へGemini API Keyを保存しない

# 3. 保護対象

- API_SECRET
- GEMINI_API_KEY
- Wi-Fi Password
- OAuth Token
- Access Token
- Script Properties値

# 4. ESP32側管理

API_SECRET。

```text
NVS
```

Wi-Fi設定。

```text
NVS
```

Gemini API Key。

```text
ESP32へ保存しない
```

# 5. GAS側管理

保存先。

```text
Script Properties
```

対象。

- API_SECRET
- GEMINI_API_KEY
- SYSTEM_VERSION

# 6. GitHub管理

禁止。

- secret記載
- API Key記載
- Wi-Fi Password記載

# 7. ログマスク方針

保存禁止。

- API_SECRET
- GEMINI_API_KEY
- Password

保存可。

- device_id
- firmware_version
- boot_count
- schema_version

# 8. Spreadsheet管理

保存禁止。

- API_SECRET
- GEMINI_API_KEY
- Password

保存可。

- device_id
- sensor data
- event data
- source_config URL
- system_config 非機密設定

# 9. 認証方式

```text
device_id
+
secret
```

検証。

```text
GAS側
```

# 10. Gemini API運用

- Gemini API呼出はGASのみ
- ESP32呼出禁止
- API KeyはScript Properties
- Spreadsheet保存禁止
- GitHub記載禁止
- Log出力禁止

# 11. Calendar/Poemとの関係

Calendar。

- AI利用禁止
- Gemini API利用禁止

Poem。

- Gemini API利用可

ただし禁止。

- 暦生成
- 暦推定
- 欠損補完
- 表示時再生成
- 代替詩生成

# 12. source_config / system_config

source_config保存可。

- URL
- 更新日時
- 管理情報
- 有効フラグ

system_config保存可。

- Retry設定
- Job設定
- Prompt Version
- Gemini Model
- Gemini Temperature
- 表示設定

保存禁止。

- API_SECRET
- GEMINI_API_KEY
- Wi-Fi Password

# 13. 背面保守UI

```text
許可
- 状態確認
- 診断
- Calendar再生成
- Poem再生成
- 通信確認

禁止
- source_config編集
- system_config編集
- URL編集
- Prompt編集
- Geminiモデル変更
- temperature変更
- API Key編集
```

理由。

- 機密情報漏洩防止
- 誤操作防止
- OLEDでの長文編集回避

# 14. 将来拡張

- HMAC
- Device Certificate
- Mutual TLS
- 多端末別secret
- 管理者権限分離

# 15. STATUS

| 項目 | 状態 |
| --- | --- |
| API_SECRET NVS保存 | CONFIRMED |
| Wi-Fi Password NVS保存 | CONFIRMED |
| Gemini API Key GAS限定 | FINALIZED |
| Script Properties採択 | CONFIRMED |
| Spreadsheet機密情報保存禁止 | FINALIZED |
| ログマスク | CONFIRMED |
| device_id+secret認証 | CONFIRMED |
| 背面UIからの機密編集禁止 | FINALIZED |
| HMAC | PROPOSED |
| Mutual TLS | PROPOSED |


# 16. CHANGE LOG

| 日付 | 内容 |
| --- | --- |
| 2026-06-20 | vNext 1.0として全面再生成 |
| 2026-06-20 | 背面保守UIからの機密・設定編集禁止を反映 |
| 2026-06-20 | source_config/system_config保存禁止情報を整理 |
