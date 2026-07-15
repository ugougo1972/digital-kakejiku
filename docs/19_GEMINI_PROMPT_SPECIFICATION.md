# 19 Gemini Prompt Specification

**タイトル**  
19 Gemini Prompt Specification

**最終更新**  
2026-07-15

**文書版**  
vNext 1.3

**STATUS**  
FINALIZED

**責務**  
本書は digital-kakejiku における Gemini を利用した詩生成の Prompt 構造、生成条件、品質要件および運用ルールを定義する正式設計書である。

**Single Source**  
本書は AI 詩生成 Prompt を管理する唯一の文書である。

Prompt構造、生成条件、品質要件および禁止事項は本書を正式情報とし、他文書では重複管理しない。

---

# 対象読者

- GAS開発者
- システム設計者
- Prompt設計者
- 保守担当者

---

# 関連文書

## 前提

- docs/00_PROJECT_CONVENTIONS.md

## 参照

- README.md
- CURRENT_STATUS.md
- ROADMAP.md

## 関連

- docs/06_GAS_API_SPEC.md
- docs/10_CALENDAR_POEM_SUBSYSTEM.md
- docs/12_CONFIGURATION_MANAGEMENT.md
- docs/13_GAS_OPERATION_POLICY.md
- docs/18_GAS_RETRY_STRATEGY.md

## 後続

- GAS実装
- AI詩生成
- 品質評価

---

# 1. 文書の目的

本書は AI 詩生成 Prompt を定義する。

本書では以下を管理する。

- Prompt構造
- 入力情報
- 出力要件
- 品質基準
- 禁止事項
- Prompt運用

Gemini API の実装方法やAPI仕様は本書では管理しない。

---

# 2. Prompt設計方針

本システムでは以下を基本方針とする。

- 客観描写を優先する。
- 季節感を重視する。
- 暦情報を反映する。
- 観測データを反映する。
- 説教・誘導を行わない。
- Single Source of Truth を維持する。

---

# 3. Prompt構成

```text
Observation
        │
Calendar
        │
System Config
        │
Prompt Builder
        │
Gemini
        │
Poem
```

Prompt は GAS 側で生成する。

ESP32 は Prompt を生成しない。

---

# 4. 入力情報

|入力|STATUS|
|---|---|
|Observation|CONFIRMED|
|calendar_master|CONFIRMED|
|system_config|CONFIRMED|

---

# 5. Prompt入力

Prompt Builder は複数の情報源から入力データを構築する。

---

## 5.1 入力データ

|入力|取得元|
|---|---|
|観測データ|observation_log|
|暦情報|calendar_master|
|システム設定|system_config|

---

## 5.2 基本方針

- 正式情報のみ利用する。
- 推測データを入力しない。
- Secret情報を入力しない。
- 必要最小限の情報のみ渡す。

---

# 6. Prompt生成

Prompt は GAS 側で動的に生成する。

---

## 基本方針

- 固定テンプレートを利用する。
- system_config を参照する。
- Prompt Version を管理する。
- Prompt Builder に責務を集中させる。

Prompt Version は system_config により管理する。

---

# 7. 詩生成要件

Gemini が生成する詩は以下を満たす。

---

## 基本要件

- 日本語
- 約100文字
- 自由詩
- 客観描写
- 季節感を含む
- 自然な文章

---

## 品質要件

- 読みやすい。
- 季節を感じられる。
- 観測データを自然に反映する。
- 説明文にならない。
- 日記にならない。

---

# 8. 表現ルール

生成文章では以下を適用する。

---

## 推奨

- 静かな表現
- 客観描写
- 季節表現
- 自然描写
- 空気感の表現

---

## 避ける表現

- 説教
- 命令
- 励まし
- 不安を煽る表現
- 宣伝

---

# 9. 禁止事項

以下を生成してはならない。

- 政治的内容
- 宗教的主張
- 投資助言
- 医療助言
- 差別表現
- 暴力表現
- 誹謗中傷
- 個人情報
- URL
- 広告

---

# 10. 暦情報利用

Calendar 情報を詩へ自然に反映する。

---

## 基本方針

- 二十四節気を反映する。
- 七十二候を反映する。
- 季節感を重視する。
- 説明的にならない。

---

## 表示ルール

二十四節気名および七十二候名を本文中へそのまま繰り返し表示しない。

表示仕様は **07_DISPLAY_UI_SPEC.md** を正式情報とする。

---

# 11. 観測データ利用

Observation を自然な表現へ変換する。

---

## 基本方針

- 数値をそのまま羅列しない。
- 客観描写へ変換する。
- 季節感を優先する。
- 異常値を誇張しない。

---

# 12. 出力

Gemini 出力は poem_cache へ保存する。

---

## 基本方針

- poem_cache を正式情報とする。
- ESP32 は poem_cache のみ取得する。
- Prompt を保存しない。
- Secret 情報を出力しない。


# 13. 品質要件

AI生成結果は以下の品質要件を満たさなければならない。

---

## 13.1 必須要件

|項目|要件|
|---|---|
|言語|日本語|
|文字数|約100文字|
|文体|自由詩|
|視点|客観描写|
|内容|自然・季節・観測情報を反映|
|読後感|静かで落ち着いた印象|

---

## 13.2 品質基準

生成結果は以下を満たすこと。

- 日本語として自然である。
- 文法上の破綻がない。
- 観測情報を自然に反映する。
- 季節感が感じられる。
- 説明文ではない。
- 毎日読んでも違和感が少ない。

---

# 14. Prompt Version管理

Prompt はバージョン管理する。

---

## 基本方針

- Prompt Version は `system_config` で管理する。
- Prompt 更新時は Version を更新する。
- Version により生成条件を追跡可能とする。
- Version をソースコードへハードコードしない。

---

## 管理対象

|項目|保存先|
|---|---|
|Prompt Version|system_config|
|Gemini Model|system_config|
|Temperature|system_config|
|Max Tokens|system_config|

---

# 15. Prompt運用

Prompt は運用ポリシーに従って利用する。

---

## 基本方針

- Prompt は GAS 側のみで生成する。
- ESP32 は Prompt を生成しない。
- Prompt を永続保存しない。
- Prompt をログへ出力しない。
- Prompt を外部公開しない。

---

## 再生成

Poem 再生成時は最新の Prompt Version を利用する。

再生成方式は **13_GAS_OPERATION_POLICY.md** を正式情報とする。

---

# 16. エラー時の扱い

Prompt 生成または Gemini 応答で異常が発生した場合の扱いを定義する。

---

## 基本方針

- Retry 対象を判定する。
- Prompt 自体を破壊しない。
- poem_cache を破壊しない。
- Error Log を記録する。

Retry 方針は **18_GAS_RETRY_STRATEGY.md** を正式情報とする。

---

# 17. 設計方針

Prompt 設計は以下を設計原則とする。

---

## 単一責務

- Prompt Builder は Prompt 作成のみ担当する。
- Gemini は文章生成のみ担当する。
- Poem Manager は生成管理のみ担当する。

---

## Single Source of Truth

|情報|正式管理|
|---|---|
|Prompt仕様|本書|
|設定|system_config|
|Calendar|calendar_master|
|Observation|observation_log|

---

## 保守性

- Prompt をコードへ分散させない。
- Prompt Builder を共通利用する。
- Version 管理を行う。

---

## 拡張性

将来的な AI モデル追加および Prompt 改良へ対応できる構成を維持する。

---

# 18. 制約事項

本書では Prompt 設計方針を定義する。

以下は対象外とする。

|項目|管理文書|
|---|---|
|Gemini API仕様|06_GAS_API_SPEC.md|
|Retry制御|18_GAS_RETRY_STRATEGY.md|
|実装コード|15_GAS_IMPLEMENTATION_GUIDE.md|
|Calendar構造|10_CALENDAR_POEM_SUBSYSTEM.md|
|Spreadsheet構造|14_SPREADSHEET_SCHEMA.md|

---

# 19. 将来拡張

本章では将来的な Prompt 機能拡張を示す。

---

## 19.1 拡張候補

|項目|STATUS|備考|
|---|---|---|
|複数詩スタイル|PROPOSED|詳細未定|
|季節別Prompt|PROPOSED|詳細未定|
|地域別Prompt|PROPOSED|詳細未定|
|AIモデル切替|PROPOSED|詳細未定|
|品質評価AI|PROPOSED|詳細未定|

---

## 19.2 品質改善

将来的に以下を検討する。

- Prompt最適化
- 品質自動評価
- AI生成比較
- Prompt改善支援

詳細仕様は今後決定する。

---

# 20. 未定義事項

|項目|状態|
|---|---|
|Promptテンプレート詳細|今後決定|
|品質評価基準詳細|今後決定|
|複数モデル運用|今後決定|
|自動品質判定|今後決定|
|生成履歴保持期間|今後決定|

---

# CHANGE LOG

|日付|内容|
|---|---|
|2026-07-15|vNext 1.3文書体系に合わせ全面刷新。Gemini Prompt設計文書として再設計し、README・CURRENT_STATUS・ROADMAP・06_GAS_API_SPEC・10_CALENDAR_POEM_SUBSYSTEM・12_CONFIGURATION_MANAGEMENT・13_GAS_OPERATION_POLICY・18_GAS_RETRY_STRATEGYとの責務を明確化。Single Source of Truthに基づき、Prompt構造・入力情報・品質要件・禁止事項・Version管理を整理し、STATUS表記・文書構成を共通規約へ統一。|
|2026-07-14|約100文字・自由詩・客観描写・政治/宗教/説教禁止・二十四節気/七十二候名の本文重複禁止方針を反映。|
|2026-06-21|Phase1 Prompt設計およびGemini運用方針を反映。|

---

# 付録A. 関連文書の責務

|文書|責務|
|---|---|
|README.md|プロジェクト概要・入口|
|CURRENT_STATUS.md|現在の運用状況|
|ROADMAP.md|中長期計画|
|06_GAS_API_SPEC.md|Gemini API利用仕様|
|10_CALENDAR_POEM_SUBSYSTEM.md|Calendar・Poemサブシステム|
|12_CONFIGURATION_MANAGEMENT.md|設定管理|
|13_GAS_OPERATION_POLICY.md|生成運用|
|18_GAS_RETRY_STRATEGY.md|Retry仕様|
|19_GEMINI_PROMPT_SPECIFICATION.md|Prompt仕様（本書）|

---

# 付録B. 更新ルール

本書は以下の場合に更新する。

- Prompt構造変更
- 品質要件変更
- AIモデル変更
- Version管理変更
- 生成ルール変更
- 文書体系変更

日常的な生成結果は記載しない。

現在の運用状況は **CURRENT_STATUS.md** を正式情報とする。

---

# 自己査読チェックリスト

- [x] 文書内矛盾なし
- [x] READMEとの責務分離
- [x] CURRENT_STATUSとの責務分離
- [x] ROADMAPとの責務分離
- [x] 00_PROJECT_CONVENTIONSとの整合
- [x] 06_GAS_API_SPECとの責務分離
- [x] 10_CALENDAR_POEM_SUBSYSTEMとの責務分離
- [x] 12_CONFIGURATION_MANAGEMENTとの責務分離
- [x] 13_GAS_OPERATION_POLICYとの責務分離
- [x] 18_GAS_RETRY_STRATEGYとの責務分離
- [x] STATUS表記統一
- [x] Single Source of Truth維持
- [x] GitHub表示崩れなし
- [x] vNext 1.3文書体系へ適合