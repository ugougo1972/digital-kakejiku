# 19_GEMINI_PROMPT_SPECIFICATION.md

# digital-kakejiku Gemini Prompt Specification

最終更新: 2026-06-20  
文書版: vNext 1.3 phase1 ready delta

---

# 1. 目的

本書は digital-kakejiku における Gemini Prompt 仕様の基準源である。

Phase 1 PoemSubsystem 実装で必要となる以下を定義する。

- 入力データ形式
- Prompt Version
- Prompt本文
- 出力JSON形式
- パラメータ設定
- 禁止事項
- 検証ルール
- エラーハンドリング

---

# 2. 基本方針

Poem生成はGAS側で実施する。

ESP32はGemini APIを呼び出さない。

Gemini APIの用途は「今日の詩」に限定する。

禁止。

- 暦生成
- 暦推定
- 欠損補完
- 表示時再生成
- 数値直接出力
- 二十四節気名称そのまま使用
- 七十二候名称そのまま使用
- 祝日名称そのまま使用

---

# 3. Prompt Version

初期採択。

```text
poem_prompt_v1.0
```

管理元。

```text
system_config.prompt_version
```

poem_cacheへ保存。

```text
prompt_version
```

旧Versionで生成済みのpoem_cacheは有効なまま保持する。

---

# 4. Geminiパラメータ

| 項目 | 値 | 管理元 |
|---|---|---|
| model | system_config.gemini_model | system_config |
| temperature | 0.5 | system_config |
| max_tokens | 300 | system_config |
| top_p | 1.0 | 固定値またはsystem_config |
| response_mime_type | application/json | 実装時指定 |

modelの初期値。

```text
gemini-2.5-flash
```

ただし、実際に利用可能なモデル名は実装時点のGemini API仕様で確認する。

確認できない場合は未確定として扱い、推測で固定しない。

---

# 5. 入力データ

## calendar_master由来

```json
{
  "date": "2026-06-20",
  "weekday": "土",
  "holiday_name": "",
  "solar_term": "夏至",
  "season_name": "乃東枯",
  "rokuyo": "先勝",
  "moon_phase": "上弦",
  "description": "暦説明文"
}
```

## observation_log由来

直近24時間または当日分の代表値を用いる。

```json
{
  "avg_temperature": 26.5,
  "avg_humidity": 65.0,
  "avg_pressure": 1011.2,
  "avg_co2": 620,
  "avg_pm2_5": 3.4,
  "avg_illuminance": 120.0,
  "motion_detected": true,
  "peak_sound_level": 52.1
}
```

欠損値はPromptから除外する。

欠損値を推測補完してはならない。

---

# 6. Prompt Template v1.0

```text
あなたは、室内外の空気感と季節の移ろいを、短い日本語の自由詩として記録する書き手です。

以下の暦情報と環境観測データを参考に、今日の詩を作成してください。

【暦情報】
日付: {{date}}
曜日: {{weekday}}
二十四節気: {{solar_term}}
七十二候: {{season_name}}
祝日: {{holiday_name}}
六曜: {{rokuyo}}
月相: {{moon_phase}}
説明: {{description}}

【環境観測データ】
平均気温: {{avg_temperature}}℃
平均湿度: {{avg_humidity}}%
平均気圧: {{avg_pressure}}hPa
平均CO2: {{avg_co2}}ppm
平均PM2.5: {{avg_pm2_5}}
平均照度: {{avg_illuminance}}
人感検知: {{motion_detected}}
ピーク音環境: {{peak_sound_level}}

【要件】
- 日本語のみで出力する
- 自由詩形式とする
- 客観的な環境描写を優先する
- 80～120文字を目安にする
- 目標は100文字前後とする
- タイトルを付ける
- 数値を直接出力しない
- 二十四節気名、七十二候名、祝日名をそのまま本文に使わない
- 政治、宗教、説教、誘導、経済情報を含めない
- 不明な値を補完しない
- 誇張しない

【出力形式】
JSONのみを返してください。

{
  "title": "短いタイトル",
  "body": "詩本体"
}
```

---

# 7. 欠損値処理

入力値がNULLまたは空の場合、その行をPromptから除外する。

例。

```text
平均CO2: {{avg_co2}}ppm
```

avg_co2が欠損している場合、上記行をPromptに含めない。

禁止。

- 欠損値を平均値で補う
- 欠損値をAIに推定させる
- 「不明」を詩本文に出す

---

# 8. 出力JSONスキーマ

```json
{
  "title": "string",
  "body": "string"
}
```

必須。

- title
- body

禁止。

- Markdown
- コードブロック
- 説明文
- JSON以外の前置き
- 配列形式

---

# 9. 出力検証

## title

条件。

- 1行
- 短いタイトル
- 具体的な数値を含めない

## body

条件。

- 日本語
- 80～120文字を目標範囲
- 数値直接出力なし
- 暦名称の直接使用なし
- 禁止トピックなし

禁止例。

```text
26.4℃
61%
712ppm
夏至
乃東枯
建国記念の日
```

許可例。

```text
湿り気
穏やかな空気
静かな室内
長い昼
淡い光
```

---

# 10. Prompt出力例

入力。

```json
{
  "date": "2026-06-20",
  "solar_term": "夏至",
  "season_name": "乃東枯",
  "avg_temperature": 26.5,
  "avg_humidity": 65.0,
  "avg_co2": 620,
  "avg_illuminance": 120.0
}
```

期待出力例。

```json
{
  "title": "長い昼の室",
  "body": "白い光が部屋の奥まで届き、湿り気を含んだ空気が静かにとどまる。人の気配は淡く、午後の長さだけが窓辺に残っている。"
}
```

注記。

この例は仕様説明用であり、固定出力ではない。

---

# 11. エラーハンドリング

| エラー | 原因 | 対応 |
|---|---|---|
| PROMPT_SCHEMA_ERROR | 出力JSON不正 | POEM_ERROR |
| GEMINI_RATE_LIMIT | 429 | Retry 1回 |
| GEMINI_SERVER_ERROR | 5xx | Retry 3回 |
| GEMINI_AUTH_ERROR | 401/403 | Retryなし |
| CONFIG_ERROR | model / prompt_version欠損 | Retryなし |

Retry詳細は `18_GAS_RETRY_STRATEGY.md` を参照する。

---

# 12. Prompt Version更新ルール

新Versionを導入する場合。

1. system_config.prompt_versionを更新する
2. 19_GEMINI_PROMPT_SPECIFICATION.mdに新Versionを追加する
3. 新規Poem生成から新Versionを使用する
4. 既存poem_cacheは自動再生成しない
5. 必要な場合のみMaintenanceHandlerで再生成する

旧Versionの扱い。

- 旧Versionで生成済みのpoem_cacheは有効
- 品質比較のためprompt_versionを保存する
- 廃止する場合はCHANGE LOGへ記録する

---

# 13. 保存項目

poem_cacheへ保存する。

- poem_date
- generated_at
- model_name
- prompt_version
- poem_title
- poem_body
- calendar_date
- observation_reference
- generation_status
- retry_count
- error_code
- error_message

---

# 14. STATUS

| 項目 | 状態 |
|---|---|
| Prompt Version v1.0 | FINALIZED |
| 入力データ形式 | FINALIZED |
| 出力JSON形式 | FINALIZED |
| 禁止事項 | FINALIZED |
| 欠損値処理 | FINALIZED |
| エラーハンドリング | FINALIZED |
| Version更新ルール | FINALIZED |
| model実名 | CONFIRMED |
| API利用可否確認 | 実装時確認 |

---

# 15. CHANGE LOG

| 日付 | 内容 |
|---|---|
| 2026-06-20 | 新規作成 |
| 2026-06-20 | Phase 1開始前ブロッカー解消用にPrompt仕様をFINALIZED化 |
