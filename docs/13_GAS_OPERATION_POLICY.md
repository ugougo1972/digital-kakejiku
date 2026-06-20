# digital-kakejiku GAS運用方針

最終更新: 2026-06-20  
文書版: vNext 1.1 review reflected

---

# 1. 目的

本書はGAS運用の基準源である。

---

# 2. 定期実行

## Calendar Job

- 02:00 Main
- 02:30 Retry1
- 03:00 Retry2
- 03:30 Retry3

## Poem Job

- 02:10 Main
- 02:40 Retry1
- 03:10 Retry2
- 03:40 Retry3

---

# 3. Job運用フロー

Calendar。

```text
source_config確認
 ↓
master確認
 ↓
calendar_master生成
 ↓
CALENDAR_READY
```

Poem。

```text
calendar_master確認
 ↓
CALENDAR_READYならPrompt生成
 ↓
Gemini呼出
 ↓
poem_cache保存
 ↓
POEM_READY
```

---

# 4. エラーリトライ方針

| 分類 | 例 | 対応 |
|---|---|---|
| 一時的 | Network Timeout / 429 / 5xx | Retry対象 |
| 永続的 | 401 / 403 / CONFIG_ERROR | Retry停止、管理者確認 |
| 依存待機 | CALENDAR_PENDING | 復旧まで保持 |

Retry回数。

```text
最大3回
```

---

# 5. 手動保守

許可。

- Calendar再生成
- Calendar範囲再生成
- Poem再生成
- source_config確認
- ログ確認

禁止。

- 背面UIからの設定本文編集
- API Key編集
- Prompt本文編集

---

# 6. 月次運用

毎月末に確認する。

- Calendar成功率
- Poem成功率
- source_config取得失敗
- error_log集中
- GAS実行時間
- Gemini Free Tier利用状況
- Spreadsheet共有範囲

---

# 7. STATUS

| 項目 | 状態 |
|---|---|
| Calendar Job | FINALIZED |
| Poem Job | FINALIZED |
| Retry方針 | FINALIZED |
| 月次運用 | FINALIZED |
| 手動保守 | CONFIRMED |

---

# 8. CHANGE LOG

| 日付 | 内容 |
|---|---|
| 2026-06-20 | Retry詳細と月次運用を追加 |
