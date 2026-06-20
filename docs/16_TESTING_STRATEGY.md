# digital-kakejiku Testing Strategy

最終更新: 2026-06-20  
文書版: vNext 1.3 phase1 ready delta

---

# 1. 目的

本書は試験方針の基準源である。

Retry試験の詳細は `18_GAS_RETRY_STRATEGY.md` を参照する。

Gemini Prompt試験の詳細は `19_GEMINI_PROMPT_SPECIFICATION.md` を参照する。

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
- Retry待機時間試験
- Gemini Prompt入力生成試験
- Gemini Prompt JSON出力形式試験

---

# 5. Retry試験

## classifyError試験

| 入力 | 期待分類 |
|---|---|
| NETWORK_TIMEOUT | TEMPORARY |
| GEMINI_RATE_LIMIT | TEMPORARY |
| GEMINI_SERVER_ERROR | TEMPORARY |
| SPREADSHEET_TIMEOUT | TEMPORARY |
| AUTH_ERROR | PERMANENT |
| INVALID_DEVICE | PERMANENT |
| SCHEMA_ERROR | PERMANENT |
| CONFIG_ERROR | PERMANENT |
| UNKNOWN_ERROR | UNKNOWN |

## 待機時間試験

| 分類 | 試行 | 期待待機 |
|---|---:|---:|
| TEMPORARY | 1 | 30秒 |
| TEMPORARY | 2 | 60秒 |
| TEMPORARY | 3 | 120秒 |
| UNKNOWN | 1 | 60秒 |

## Job Retry試験

Calendar。

- 02:00失敗時にCALENDAR_RETRY
- 02:30成功時にCALENDAR_READY
- Retry3まで失敗時にCALENDAR_ERROR

Poem。

- 02:10失敗時にPOEM_RETRY
- 02:40成功時にPOEM_READY
- Retry3まで失敗時にPOEM_ERROR

---

# 6. Gemini Prompt試験

## 入力生成

確認項目。

- calendar_masterから必要項目を取得できる
- observation_logから直近24時間集計を生成できる
- 欠損値をPromptから除外できる
- 欠損値を推測補完しない

## 出力検証

期待。

```json
{
  "title": "短いタイトル",
  "body": "詩本体"
}
```

必須。

- titleが存在する
- bodyが存在する
- bodyが日本語である
- bodyが80～120文字を目標範囲とする
- 数値直接出力がない
- 二十四節気名、七十二候名、祝日名の直接出力がない

---

# 7. 障害試験

| 条件 | 期待結果 |
|---|---|
| Calendar未完了 | CALENDAR_PENDING |
| Calendar失敗 | POEM_SKIPPED |
| Gemini 429 | POEM_RETRY |
| Gemini 5xx | POEM_RETRY |
| Gemini 401/403 | POEM_ERROR、Retry停止 |
| Config欠損 | CONFIG_ERROR |
| 認証失敗 | SECURITY_ERROR |
| Prompt JSON不正 | POEM_ERROR |

---

# 8. E-Paper試験

Phase2以降。

- 更新時間測定
- 更新時消費電流測定
- 部分更新可否確認
- 月間更新回数推定
- BATTERY_MODE時の更新抑制確認

---

# 9. 月次運用試験

- Calendar成功率
- Poem成功率
- error_log集中
- Gemini Free Tier利用状況
- GAS実行時間
- Spreadsheet容量
- Script Properties存在確認

---

# 10. Phase1完了条件

- L1単体試験完了
- L2結合試験完了
- Retry分類試験完了
- Gemini Prompt出力検証完了
- Calendar/Poem Job手動実行成功
- error_logに未解消の重大エラーがない

---

# 11. STATUS

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
| Phase1開始可否 | GO |

---

# 12. CHANGE LOG

| 日付 | 内容 |
|---|---|
| 2026-06-20 | vNext 1.3としてRetry詳細試験を追加 |
| 2026-06-20 | Gemini Prompt試験を19文書と整合 |
| 2026-06-20 | Phase1完了条件を追加 |
