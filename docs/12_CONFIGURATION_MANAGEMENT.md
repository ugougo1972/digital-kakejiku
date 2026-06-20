# digital-kakejiku 設定管理仕様

最終更新: 2026-06-20  
文書版: vNext 1.1 review reflected

---

# 1. 目的

本書は設定管理の基準源である。

---

# 2. 保存先と責務

| 保存先 | 用途 | 編集主体 |
|---|---|---|
| source_config | 情報源URL管理 | Spreadsheet管理者 |
| system_config | Job/Gemini/Prompt/表示設定 | Spreadsheet管理者 / GAS |
| Script Properties | 機密情報 | GAS管理者 |
| ESP32 NVS | 端末設定 | ESP32 |

---

# 3. source_config

用途。

- 祝日情報源URL
- 二十四節気情報源URL
- 七十二候解説参照URL

禁止。

- API_SECRET保存
- GEMINI_API_KEY保存
- Password保存

背面UIから編集しない。

---

# 4. season_dictionary

用途。

- 七十二候名称
- 七十二候説明

source_configはURL管理、season_dictionaryはマスタ管理として分離する。

---

# 5. system_config

用途。

- calendar_retry_max
- poem_retry_max
- gemini_model
- gemini_temperature
- gemini_max_tokens
- prompt_version
- display設定

背面UIから編集しない。

---

# 6. Prompt Version

- system_configで管理する
- Poem生成時点の値をpoem_cacheへ保存する
- ESP32から変更しない

---

# 7. 背面UIで禁止する編集

- source_config編集
- system_config編集
- URL編集
- Prompt編集
- Geminiモデル変更
- temperature変更
- API Key編集

---

# 8. CONFIG_VERSION

設定世代管理は将来拡張とする。

状態。

```text
PROPOSED
```

現時点ではESP32へsource_config/system_configを同期しないため、必須ではない。

---

# 9. STATUS

| 項目 | 状態 |
|---|---|
| source_config責務 | FINALIZED |
| system_config責務 | FINALIZED |
| season_dictionary責務 | FINALIZED |
| Prompt Version管理 | FINALIZED |
| CONFIG_VERSION | PROPOSED |

---

# 10. CHANGE LOG

| 日付 | 内容 |
|---|---|
| 2026-06-20 | source_configとseason_dictionaryの責務を分離 |
| 2026-06-20 | 背面UI編集禁止を明記 |
