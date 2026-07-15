# ROADMAP

**タイトル**  
ROADMAP

**最終更新**  
2026-07-15

**文書版**  
vNext 1.3

**STATUS**  
IN_PROGRESS

**責務**  
本書は digital-kakejiku プロジェクトの中長期開発計画、マイルストーンおよび将来構想を管理する正式文書である。

**Single Source**  
プロジェクトの将来計画は本書を唯一の正式情報とする。現在の開発状況は CURRENT_STATUS.md を参照し、本書へ重複記載しない。

---

# 対象読者

- プロジェクトオーナー
- ハードウェア設計者
- ソフトウェア設計者
- GAS開発者
- 保守担当者

---

# 関連文書

## 前提

- docs/00_PROJECT_CONVENTIONS.md

## 参照

- README.md
- CURRENT_STATUS.md

## 関連

- docs/01_HARDWARE_OVERVIEW.md
- docs/02_SOFTWARE_OVERVIEW.md
- docs/08_POWER_ARCHITECTURE.md
- docs/15_GAS_IMPLEMENTATION_GUIDE.md
- docs/16_TESTING_STRATEGY.md

## 後続

今後作成される全設計・実装・試験計画

---

# 1. 文書の目的

本書はプロジェクト全体の中長期計画を管理する。

以下を管理対象とする。

- 開発ロードマップ
- マイルストーン
- Phase計画
- 将来機能
- 技術的負債への対応
- 保守計画

現在の進捗は管理対象としない。

現在状況は CURRENT_STATUS.md を正式情報とする。

---

# 2. 開発方針

本プロジェクトでは以下を基本方針とする。

- ドキュメント駆動開発
- 段階的実装
- 保守性優先
- 拡張性優先
- モジュール構成
- 長期運用を前提とした設計
- GitHubによる設計情報管理

---

# 3. 開発Phase

|Phase|名称|目的|
|---|---|---|
|Phase0|システム設計|基本設計完了|
|Phase1|ソフトウェア基盤|GAS・Spreadsheet基盤|
|Phase2|ハードウェア完成|本体・電源・筐体完成|
|Phase3|統合試験|システム統合|
|Phase4|長期評価|安定性評価|
|Phase5|正式リリース|運用開始|

---

# 4. 中長期マイルストーン

本章ではプロジェクト全体の開発計画を示す。

現在の達成状況は **CURRENT_STATUS.md** を正式情報とする。

---

## 4.1 Phase0

### 目的

システム全体設計の確立

### 主な成果物

- システムアーキテクチャ
- ハードウェア構成
- ソフトウェア構成
- GASアーキテクチャ
- ドキュメント体系

### 完了条件

- 基本設計完了
- 文書体系確立

---

## 4.2 Phase1

### 目的

クラウド基盤の完成

### 対象

- Google Apps Script
- Google Spreadsheet
- ログ管理
- 設定管理
- Retry制御
- Gemini連携
- Calendar生成

### 完了条件

- 全API実装
- Health Check完成
- ログ機能完成
- Calendar機能完成
- Poem生成完成

---

## 4.3 Phase2

### 目的

ハードウェア完成

### 対象

- 本体基板
- 電源基板
- OLED操作部
- 筐体
- センサー統合

### 完了条件

- 本体基板完成
- 筐体完成
- 全センサー接続
- UPS動作確認
- E-Paper表示確認

---

## 4.4 Phase3

### 目的

システム統合

### 対象

- ESP32
- GAS
- Spreadsheet
- Gemini
- E-Paper

### 完了条件

- システム統合
- 長時間連続運転
- 障害復旧確認

---

## 4.5 Phase4

### 目的

長期評価

### 評価項目

- 安定動作
- 消費電力
- 通信安定性
- ログ品質
- AI生成品質

### 完了条件

評価基準は今後決定する。

---

## 4.6 Phase5

### 目的

正式運用開始

### 完了条件

正式リリース判定基準は今後決定する。

---

# 5. マイルストーン

|No.|マイルストーン|STATUS|
|---|---|---|
|M1|システム設計完了|COMPLETED|
|M2|電源基板PoC完了|COMPLETED|
|M3|本体基板完成|IN_PROGRESS|
|M4|筐体完成|IN_PROGRESS|
|M5|GAS完成|IN_PROGRESS|
|M6|統合試験開始|PENDING|
|M7|長期評価開始|PENDING|
|M8|正式リリース|PENDING|

---

# 6. 将来構想

本章では、正式リリース後を含む中長期的な構想を管理する。

本章の内容は計画であり、現在の実装状況を示すものではない。

---

## 6.1 システム拡張

将来的に以下の拡張を検討する。

|項目|STATUS|備考|
|---|---|---|
|センサー追加対応|PROPOSED|詳細未定|
|表示テンプレート追加|PROPOSED|詳細未定|
|複数テーマ切替|PROPOSED|詳細未定|
|表示レイアウト追加|PROPOSED|詳細未定|
|設定画面拡張|PROPOSED|詳細未定|

---

## 6.2 ソフトウェア拡張

|項目|STATUS|備考|
|---|---|---|
|AI生成機能拡張|PROPOSED|詳細未定|
|キャッシュ最適化|PROPOSED|詳細未定|
|設定同期機能|PROPOSED|詳細未定|
|運用支援機能|PROPOSED|詳細未定|

---

## 6.3 ハードウェア拡張

|項目|STATUS|備考|
|---|---|---|
|新規センサー対応|PROPOSED|詳細未定|
|表示デバイス追加|PROPOSED|詳細未定|
|通信方式追加|PROPOSED|詳細未定|
|低消費電力化|PROPOSED|継続検討|

---

# 7. 技術的負債

本章では、将来的に改善を予定している事項を管理する。

技術的負債は「不具合」ではなく、将来改善予定の項目として扱う。

|項目|STATUS|備考|
|---|---|---|
|ドキュメント継続整理|IN_PROGRESS|vNext1.3継続|
|コード整理|PROPOSED|実装後対応|
|設定管理改善|PROPOSED|運用開始後検討|
|ログ最適化|PROPOSED|運用実績を踏まえ検討|

---

# 8. リスク対策計画

現在判明しているリスクへの対応方針を示す。

詳細なリスク状況は CURRENT_STATUS.md を正式情報とする。

|項目|対応方針|
|---|---|
|ハードウェア変更|設計書更新を優先する|
|GAS仕様変更|API仕様との整合確認を行う|
|Gemini仕様変更|Prompt仕様を見直す|
|ライブラリ更新|影響評価後に反映する|
|ドキュメント更新|関連文書を同時更新する|

---

# 9. 文書体系ロードマップ

本章では、プロジェクト全体のドキュメントシステムの整備計画を管理する。

文書構成および責務の詳細は **docs/00_PROJECT_CONVENTIONS.md** を正式情報とする。

---

## 9.1 基準文書

以下の4文書を文書体系の基準文書とする。

|文書|責務|STATUS|
|---|---|---|
|README.md|プロジェクト入口|FINALIZED|
|CURRENT_STATUS.md|現在の状況|IN_PROGRESS|
|ROADMAP.md|中長期計画|IN_PROGRESS|
|docs/00_PROJECT_CONVENTIONS.md|共通規約|FINALIZED|

---

## 9.2 設計文書整備

|文書群|STATUS|目標|
|---|---|---|
|Hardware Documents|IN_PROGRESS|責務整理・整合性確保|
|Software Documents|IN_PROGRESS|責務整理・整合性確保|
|Operation Documents|IN_PROGRESS|責務整理・整合性確保|

---

## 9.3 文書品質向上

今後も以下を継続して実施する。

- Single Source of Truth の維持
- 文書間相互参照の整備
- 用語統一
- STATUS・RESULT統一
- Markdown記法統一
- GitHub表示確認
- 査読結果の継続反映

---

# 10. ロードマップ更新規則

ROADMAP.md は将来計画の変更時に更新する。

以下の場合に更新を行う。

- 新しいPhaseを追加した場合
- マイルストーンを追加・変更した場合
- 将来機能を追加した場合
- 中長期方針を変更した場合
- リリース計画を変更した場合

日常的な進捗更新は行わない。

現在の状況は **CURRENT_STATUS.md** を更新する。

---

# 11. 未定義事項

本書では以下を定義しない。

|項目|状態|
|---|---|
|正式リリース日|今後決定|
|Version採番規則|今後決定|
|Git Branch運用|今後決定|
|Commit Message規則|今後決定|
|CI/CD導入計画|今後決定|
|運用保守体制|今後決定|

---

# CHANGE LOG

|日付|内容|
|---|---|
|2026-07-15|vNext 1.3文書体系に合わせ全面刷新。ROADMAPを中長期計画専用文書として再設計し、README・CURRENT_STATUS・00_PROJECT_CONVENTIONSとの責務を明確化。Single Source of Truthに基づき、現在状況・設計仕様との重複を排除。STATUS・RESULT・文書構成を全体規約へ統一。|
|2026-07-14|電源基板PoC完了後の開発計画を反映。|
|2026-07-13|筐体設計および本体基板設計計画を更新。|
|2026-07-12|GAS実装計画および文書整備計画を更新。|

# 付録A. Phase定義

本付録は ROADMAP.md における Phase の位置付けを示す。

詳細なSTATUS運用は **docs/00_PROJECT_CONVENTIONS.md** を正式情報とする。

|Phase|名称|目的|
|---|---|---|
|Phase0|システム設計|システム全体設計の確立|
|Phase1|ソフトウェア基盤|GAS・Spreadsheet・クラウド基盤構築|
|Phase2|ハードウェア完成|本体・電源・筐体・センサー完成|
|Phase3|システム統合|全機能統合および結合試験|
|Phase4|長期評価|安定性・保守性・信頼性評価|
|Phase5|正式リリース|運用開始|

---

# 付録B. ROADMAP運用ルール

ROADMAP.md は中長期計画を管理する文書であり、日々の開発状況は管理しない。

更新対象は以下とする。

- Phase構成の変更
- マイルストーンの追加・変更
- 将来構想の追加・変更
- リリース方針の変更
- 長期計画の見直し

次の内容は記載しない。

- 日々の進捗
- 試験結果
- 作業ログ
- 一時的な課題
- 現在の実装状況

これらは **CURRENT_STATUS.md** を正式情報とする。

---

# 付録C. 関連文書の責務

|文書|責務|
|---|---|
|README.md|プロジェクト概要・入口|
|CURRENT_STATUS.md|現在の開発状況|
|ROADMAP.md|中長期計画・将来構想|
|docs/00_PROJECT_CONVENTIONS.md|共通規約|
|各設計文書|設計仕様|
|実装コード|実装内容|

ROADMAP.md は「将来」を管理し、「現在」や「設計詳細」は管理しない。

---

# 付録D. 文書品質方針

本書は以下の方針に従って維持する。

- Single Source of Truth を維持する
- 計画と実績を混在させない
- 他文書との責務を重複させない
- STATUS・RESULTを共通規約へ統一する
- Markdown記法を統一する
- GitHubでの可読性を維持する
- 未確定事項は「今後決定」と記載し、推測を記載しない

---

# 自己査読チェックリスト

- [x] 文書内矛盾なし
- [x] READMEとの責務分離
- [x] CURRENT_STATUSとの責務分離
- [x] 00_PROJECT_CONVENTIONSとの整合
- [x] STATUS表記統一
- [x] RESULT表記統一
- [x] Single Source of Truth維持
- [x] GitHub表示崩れなし
- [x] 査読採択事項を反映
- [x] vNext 1.3文書体系へ適合