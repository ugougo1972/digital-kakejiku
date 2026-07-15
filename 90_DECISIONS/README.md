# 20 Development Guidelines

**タイトル**  
20 Development Guidelines

**最終更新**  
2026-07-15

**文書版**  
vNext 1.3

**STATUS**  
FINALIZED

**責務**  
本書は digital-kakejiku プロジェクト全体における開発規約、設計原則、変更管理、レビュー方針および品質維持ルールを定義する正式文書である。

**Single Source**  
本書は開発ルールを管理する唯一の文書である。

開発手順、レビュー基準、設計原則および変更管理は本書を正式情報とし、他文書では重複管理しない。

---

# 対象読者

- プロジェクト管理者
- システム設計者
- ハードウェア開発者
- Firmware開発者
- GAS開発者
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

- docs/15_GAS_IMPLEMENTATION_GUIDE.md
- docs/16_TESTING_STRATEGY.md
- docs/17_TROUBLESHOOTING.md

## 後続

- 全開発工程
- 全レビュー工程
- 全保守工程

---

# 1. 文書の目的

本書はプロジェクト全体の開発ルールを定義する。

本書では以下を管理する。

- 開発原則
- レビュー基準
- 品質維持
- 変更管理
- ブランチ運用方針
- ドキュメント運用

実装仕様や個別設計は各設計書で管理する。

---

# 2. 開発基本方針

本プロジェクトでは以下を基本原則とする。

- Single Source of Truth を維持する。
- 単一責務を維持する。
- ドキュメント駆動で開発する。
- 設計変更は必ず文書へ反映する。
- 実装より文書を先行する。
- 推測で仕様を追加しない。

---

# 3. 設計原則

すべての設計では以下を適用する。

- 単一責務
- 高凝集・低結合
- 保守性優先
- 拡張性確保
- 可読性優先
- 再利用性確保

---

# 4. Single Source of Truth

同一情報は一箇所のみで管理する。

例

|情報|正式文書|
|---|---|
|現在の進捗|CURRENT_STATUS.md|
|今後の計画|ROADMAP.md|
|電源設計|08_POWER_ARCHITECTURE.md|
|配線|05_WIRING_DIAGRAM.md|
|Spreadsheet構造|14_SPREADSHEET_SCHEMA.md|
|Retry仕様|18_GAS_RETRY_STRATEGY.md|
|Prompt仕様|19_GEMINI_PROMPT_SPECIFICATION.md|

他文書では概要のみ記載する。

---

# 5. ドキュメント更新原則

設計変更時は以下を実施する。

- 関連文書を洗い出す。
- Single Sourceを維持する。
- CHANGE LOGを更新する。
- STATUSを確認する。
- 相互参照を確認する。
- GitHub表示を確認する。

---

# 6. STATUS運用

STATUSは以下のみ使用する。

|STATUS|用途|
|---|---|
|PROPOSED|構想|
|PENDING|未着手|
|IMPLEMENTING|実装中|
|IN_PROGRESS|進行中|
|COMPLETED|完了|
|CONFIRMED|確認済|
|FINALIZED|正式確定|

独自STATUSは禁止する。

---

# 7. RESULT運用

RESULTは以下のみ使用する。

|RESULT|用途|
|---|---|
|GO|実施可|
|NG|実施不可|
|PASS|試験合格|
|FAIL|試験不合格|

PASS/FAILは試験専用とする。

GO/NGは判断結果として使用する。

---

# 8. レビュー方針

レビューでは以下を確認する。

- 文書矛盾
- 用語統一
- STATUS統一
- Single Source維持
- GitHub表示
- Markdown構文
- 関連文書整合性

レビュー結果は事実と改善案を分離して記録する。

---

# 9. 実装方針

実装前に設計書を更新する。

設計変更をコードのみへ反映してはならない。

コード修正後は必要に応じて以下を更新する。

- CURRENT_STATUS.md
- CHANGE LOG
- ROADMAP.md

---

# 10. 品質方針

品質を以下で維持する。

- 設計レビュー
- コードレビュー
- 単体試験
- 結合試験
- システム試験
- ドキュメントレビュー

品質判定は **16_TESTING_STRATEGY.md** を正式情報とする。

---

# 11. GitHub運用

GitHubでは以下を基本とする。

- Markdownを正式文書とする。
- CHANGE LOGを維持する。
- コミット単位で変更理由を明確化する。
- ドキュメントと実装を同期する。
- レビュー完了後に反映する。

---

# 12. 制約事項

本書では開発ルールのみを定義する。

実装仕様や設計仕様は対象外とする。

---

# 13. 未定義事項

|項目|状態|
|---|---|
|ブランチ戦略詳細|今後決定|
|タグ運用詳細|今後決定|
|Issue運用詳細|今後決定|
|PRテンプレート|今後決定|

---

# CHANGE LOG

|日付|内容|
|---|---|
|2026-07-15|新規作成。vNext 1.3文書体系に合わせ、プロジェクト全体の開発規約を定義。Single Source of Truth、レビュー基準、STATUS・RESULT運用、品質管理、GitHub運用を正式化。|

---

# 自己査読チェックリスト

- [x] 文書内矛盾なし
- [x] 全文書との責務分離
- [x] STATUS統一
- [x] RESULT統一
- [x] Single Source of Truth維持
- [x] GitHub表示崩れなし
- [x] vNext 1.3文書体系へ適合