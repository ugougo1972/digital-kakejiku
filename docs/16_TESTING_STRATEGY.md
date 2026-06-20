# digital-kakejiku Testing Strategy

最終更新: 2026-06-20  
文書版: vNext 1.1 review reflected

---

# 1. 目的

本書は試験方針の基準源である。

---

# 2. 基本方針

```text
小さく実装
小さく試験
小さく修正
```

---

# 3. 試験レベル

| Level | 名称 | 対象 |
|---|---|---|
| L1 | 単体試験 | Manager / Subsystem |
| L2 | 結合試験 | API / Spreadsheet / Calendar / Poem |
| L3 | 障害試験 | Retry / Error / Config欠損 |
| L4 | 運用試験 | 年次生成 / 手動再生成 / 月次確認 |
| L5 | 受入試験 | 表示品質 / Poem品質 / 安定性 |

---

# 4. Phase1必須試験

- Spreadsheet列構成検証
- ConfigManager取得試験
- SecurityManager認証試験
- Observation Payload保存試験
- Calendar生成試験
- Poem生成試験
- CALENDAR_PENDING試験
- Retry分類試験
- Gemini Prompt出力形式試験

---

# 5. 障害試験

| 条件 | 期待結果 |
|---|---|
| Calendar未完了 | CALENDAR_PENDING |
| Calendar失敗 | POEM_SKIPPED |
| Gemini 429 | POEM_RETRY |
| Gemini 5xx | POEM_RETRY |
| Gemini 401/403 | POEM_ERROR、Retry停止 |
| Config欠損 | CONFIG_ERROR |
| 認証失敗 | SECURITY_ERROR |

---

# 6. E-Paper試験

Phase2以降。

- 更新時間測定
- 更新時消費電流測定
- 部分更新可否確認
- 月間更新回数推定
- BATTERY_MODE時の更新抑制確認

---

# 7. 月次運用試験

- Calendar成功率
- Poem成功率
- error_log集中
- Gemini Free Tier利用状況
- GAS実行時間
- Spreadsheet容量

---

# 8. STATUS

| 項目 | 状態 |
|---|---|
| L1 | CONFIRMED |
| L2 | CONFIRMED |
| L3 | CONFIRMED |
| L4 | CONFIRMED |
| L5 | CONFIRMED |
| Retry詳細試験 | FINALIZED |
| Gemini Prompt試験 | FINALIZED |
| E-Paper試験 | PROPOSED |

---

# 9. CHANGE LOG

| 日付 | 内容 |
|---|---|
| 2026-06-20 | 査読反映によりRetry/Prompt/E-Paper試験を追加 |
