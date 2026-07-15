# Project Conventions

**タイトル**  
Project Conventions

**最終更新**  
2026-07-15

**文書版**  
vNext 1.3

**STATUS**  
FINALIZED

**責務**  
本書は digital-kakejiku プロジェクト全体で共通となる設計・記述・運用・文書管理規約を定義する唯一の共通規約である。

**Single Source**  
本書はプロジェクト全体の共通規約（Single Source of Truth）である。  
各設計書は本書を参照し、同一内容を重複記載してはならない。

---

# 対象読者

- プロジェクトオーナー
- ハードウェア設計者
- ソフトウェア設計者
- GAS開発者
- ドキュメント編集者
- 将来の保守担当者

---

# 関連文書

## 前提

- README.md

## 参照

- CURRENT_STATUS.md
- ROADMAP.md

## 関連

- docs/01_HARDWARE_OVERVIEW.md
- docs/02_SOFTWARE_OVERVIEW.md
- docs/03_LOG_FORMAT.md
- docs/04_STATE_MACHINE.md
- docs/05_WIRING_DIAGRAM.md
- docs/06_GAS_API_SPEC.md
- docs/07_DISPLAY_UI_SPEC.md
- docs/08_POWER_ARCHITECTURE.md
- docs/09_SPI_RESOURCE_CONTROL.md
- docs/10_CALENDAR_POEM_SUBSYSTEM.md
- docs/11_SECURITY_MANAGEMENT.md
- docs/12_CONFIGURATION_MANAGEMENT.md
- docs/13_GAS_OPERATION_POLICY.md
- docs/14_SPREADSHEET_SCHEMA.md
- docs/15_GAS_IMPLEMENTATION_GUIDE.md
- docs/16_TESTING_STRATEGY.md
- docs/17_TROUBLESHOOTING.md
- docs/18_GAS_RETRY_STRATEGY.md
- docs/19_GEMINI_PROMPT_SPECIFICATION.md

## 後続

本書を参照する全設計文書

---

# 1. 本書の目的

本書は digital-kakejiku プロジェクト全体で適用する共通規約を定義する。

目的は以下とする。

- ドキュメント品質の均一化
- 文書間整合性の維持
- 用語統一
- 記述方式統一
- 文書責務の明確化
- Single Source of Truth の維持

個別文書で共通事項を重複管理してはならない。

---

# 2. 基本設計思想

本プロジェクトでは以下を設計原則とする。

- ドキュメント駆動開発
- 保守性優先
- 拡張性優先
- モジュール化
- 段階的実装
- GitHubを唯一の設計情報管理基盤とする
- 実装前に設計書を更新する
- 設計・実装・試験・運用の整合性を維持する

---

# 3. ドキュメント体系

## 3.1 基準文書

|文書|責務|
|---|---|
|README.md|プロジェクト概要・入口|
|CURRENT_STATUS.md|現在の開発状況|
|ROADMAP.md|中長期開発計画|
|00_PROJECT_CONVENTIONS.md|共通規約（本書）|

上記4文書をプロジェクトの基準文書とする。

---

## 3.2 設計文書

設計文書は担当領域のみを記載する。

共通事項は本書へ集約する。

---

## 3.3 Single Source of Truth

各情報は一か所のみで正式管理する。

例

|情報|正式管理文書|
|---|---|
|共通規約|00_PROJECT_CONVENTIONS.md|
|現在状況|CURRENT_STATUS.md|
|開発計画|ROADMAP.md|
|プロジェクト概要|README.md|

他文書へ同内容を重複記載してはならない。

必要な場合は参照のみとする。

---

# 4. 文書構成

全設計文書は原則として以下の構成を採用する。

1. タイトル
2. 最終更新
3. 文書版
4. STATUS
5. 責務
6. Single Source
7. 対象読者
8. 関連文書
9. 本文
10. CHANGE LOG

適用できない項目がある場合は省略可能とする。

---

# 5. STATUS

STATUSは文書・仕様・実装の進行状態を示す。

使用可能な値は以下のみとする。

|STATUS|意味|
|---|---|
|PROPOSED|提案中|
|PENDING|未着手|
|IMPLEMENTING|実装中|
|IN_PROGRESS|設計・評価・試験など進行中|
|COMPLETED|対象作業完了|
|CONFIRMED|内容確認済み|
|FINALIZED|正式仕様として確定|

これ以外のSTATUSは使用しない。

---

# 6. RESULT

RESULTはレビュー・試験・工程判定で使用する。

|RESULT|意味|
|---|---|
|GO|次工程へ進行可能|
|NG|修正が必要|
|PASS|試験合格|
|FAIL|試験不合格|

STATUSとRESULTを混在させてはならない。

---

# 7. Phase定義

|Phase|内容|
|---|---|
|Phase0|システム設計|
|Phase1|ソフトウェア基盤|
|Phase2|ハードウェア完成|
|Phase3|システム統合|
|Phase4|長期評価|
|Phase5|Release|

---

# 8. 用語・命名規則

## 8.1 電源

|名称|意味|
|---|---|
|5V_BUS|電源基板内部5V|
|5V_OUT|本体基板供給5V|
|3.3V_OUT|本体基板供給3.3V|

---

## 8.2 GND

|名称|意味|
|---|---|
|5V_GND|5V系リターン|
|3.3V_GND|3.3V系リターン|
|SENSE_GND|ADC測定専用リターン|

---

## 8.3 ADC

|名称|意味|
|---|---|
|Battery_SENSE|バッテリー電圧監視|
|5V_SENSE|5V電圧監視|

---

## 8.4 表記

略称・変数名・信号名は大文字小文字を含め統一する。

同一対象へ複数名称を使用してはならない。

---

# 9. ドキュメント更新規則

設計変更時は影響範囲を確認し、関連文書を同一変更で更新する。

## ハードウェア変更

最低限更新対象

- README.md
- CURRENT_STATUS.md
- ROADMAP.md
- 01_HARDWARE_OVERVIEW.md
- 05_WIRING_DIAGRAM.md
- 08_POWER_ARCHITECTURE.md

---

## ソフトウェア変更

最低限更新対象

- README.md
- CURRENT_STATUS.md
- ROADMAP.md
- 対象ソフトウェア文書

---

## 共通規約変更

本書を変更した場合は影響する全文書を確認する。

---

# 10. 配線設計共通規則

配線設計に関する共通原則のみを定義する。

個別実装は各設計書を参照する。

共通原則

- 配線交差を最小化する
- 電源系と通信系を分離する
- SENSE系へ負荷電流を流さない
- USB D+ / D-は近接配線する
- 電源配線は可能な限り短くする
- 個別配線仕様は配線図を正式情報とする

---

# 11. Markdown記述規約

## 見出し

使用可能な見出し

```
#
##
###
####
```

---

## 表

全てヘッダーを持つMarkdown表を使用する。

---

## 箇条書き

以下で統一する。

```
-
```

---

## コード

コードブロックを使用する。

---

## ASCII図

回路概略・配線概略はASCIIアートを使用できる。

詳細図は個別文書で管理する。

---

## STATUS・RESULT

必ず大文字表記とする。

---

## ファイル名

以下で統一する。

```
NN_NAME.md
```

---

# 12. GitHub運用

GitHubを正式設計情報とする。

設計変更時は

1. 設計書更新
2. 整合性確認
3. GitHub反映

の順で実施する。

実装のみ先行する運用は禁止する。

---

# 13. 未定義事項

以下は本書では定義しない。

- Coding Style
- Git Branch運用
- Release運用
- Version採番規則
- Commit Message規則

必要となった時点で別文書または本書へ追加する。

---

# CHANGE LOG

|日付|内容|
|---|---|
|2026-07-15|vNext1.3文書体系に合わせ全面刷新。文書構成・STATUS・RESULT・Single Source・Markdown規約・更新規則を統一。|
|2026-07-14|初版作成。|