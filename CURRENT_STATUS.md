# CURRENT_STATUS

**タイトル**  
CURRENT_STATUS

**最終更新**  
2026-07-15

**文書版**  
vNext 1.3

**STATUS**  
IN_PROGRESS

**責務**  
本書は digital-kakejiku プロジェクトの現在の開発状況、完了事項、進行中事項、未着手事項および現在の課題を管理する正式文書である。

**Single Source**  
プロジェクト全体の現在状況は本書を唯一の正式情報とする。設計内容・仕様・将来計画は各設計書または ROADMAP.md を参照し、本書へ重複記載しない。

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
- ROADMAP.md

## 関連

- docs/01_HARDWARE_OVERVIEW.md
- docs/02_SOFTWARE_OVERVIEW.md
- docs/05_WIRING_DIAGRAM.md
- docs/08_POWER_ARCHITECTURE.md
- docs/15_GAS_IMPLEMENTATION_GUIDE.md
- docs/16_TESTING_STRATEGY.md
- docs/18_GAS_RETRY_STRATEGY.md

## 後続

本書を参照するすべての設計・実装・試験・運用作業

---

# 1. 文書の目的

本書は、プロジェクトの「現在」を管理するための文書である。

以下を管理対象とする。

- 現在の開発フェーズ
- 完了した作業
- 進行中の作業
- 未着手事項
- 現在の課題
- 次工程
- 判定結果

本書は開発状況を管理するものであり、設計仕様や将来計画は管理しない。

---

# 2. プロジェクト概要

|項目|内容|
|---|---|
|プロジェクト名|digital-kakejiku|
|開発形態|個人開発|
|システム種別|据置型環境情報表示システム|
|開発方針|ドキュメント駆動開発|
|文書体系|GitHub管理|
|現行バージョン|vNext 1.3|

---

# 3. 現在の総合ステータス

|項目|STATUS|RESULT|備考|
|---|---|---|---|
|プロジェクト全体|IN_PROGRESS|GO|継続開発中|
|文書体系再構築|IN_PROGRESS|GO|vNext1.3整備中|
|システム設計|COMPLETED|PASS|基本設計完了|
|GAS基盤|IN_PROGRESS|GO|機能実装継続|
|ハードウェア|IN_PROGRESS|GO|本体基板設計中|
|統合試験|PENDING|-|未着手|

---

# 4. 現在の重点開発項目

現在は以下を優先して実施する。

|優先度|項目|STATUS|
|---|---|---|
|1|本体基板設計|IN_PROGRESS|
|2|GitHubドキュメント全面刷新|IN_PROGRESS|
|3|GAS機能実装|IN_PROGRESS|
|4|筐体設計|IN_PROGRESS|
|5|システム統合試験準備|PENDING|

---

# 5. 最新マイルストーン

|日付|内容|STATUS|RESULT|
|---|---|---|---|
|2026-07|電源基板PoC完了|COMPLETED|PASS|
|2026-07|UPS切替確認完了|COMPLETED|PASS|
|2026-07|GND設計確定|CONFIRMED|PASS|
|2026-07|USB配線方針確定|CONFIRMED|PASS|
|2026-07|文書体系全面刷新開始|IN_PROGRESS|GO|

---

# 6. Phase別進捗状況

本章はプロジェクト全体の開発フェーズごとの進捗を管理する。

各Phaseの詳細設計は関連文書を参照すること。

---

## 6.1 Phase一覧

|Phase|名称|STATUS|RESULT|備考|
|---|---|---|---|---|
|Phase 0|システム設計|COMPLETED|PASS|基本設計完了|
|Phase 1|ソフトウェア基盤構築|IN_PROGRESS|GO|GAS実装継続|
|Phase 2|ハードウェア統合|IN_PROGRESS|GO|本体基板設計継続|
|Phase 3|システム統合試験|PENDING|-|未着手|
|Phase 4|長期評価|PENDING|-|未着手|
|Phase 5|正式リリース|PENDING|-|未着手|

---

# 7. ソフトウェア進捗

## 7.1 Google Spreadsheet

|項目|STATUS|RESULT|備考|
|---|---|---|---|
|Spreadsheet初期化|COMPLETED|PASS|運用中|
|シート構成作成|COMPLETED|PASS|10シート構成|
|Script Properties設定|COMPLETED|PASS|運用中|

---

## 7.2 ConfigManager

|項目|STATUS|RESULT|備考|
|---|---|---|---|
|基本構成|COMPLETED|PASS|完成|
|system_config読込|COMPLETED|PASS|正常|
|source_config読込|COMPLETED|PASS|正常|
|Script Properties読込|COMPLETED|PASS|正常|

---

## 7.3 Logger

|項目|STATUS|RESULT|備考|
|---|---|---|---|
|System Logger|COMPLETED|PASS|正常|
|Error Logger|COMPLETED|PASS|正常|
|イベントログ|COMPLETED|PASS|正常|

---

## 7.4 Calendar Subsystem

|項目|STATUS|RESULT|備考|
|---|---|---|---|
|calendar_master生成|IMPLEMENTING|GO|実装中|
|祝日取得|IMPLEMENTING|GO|実装中|
|六曜生成|IMPLEMENTING|GO|実装中|
|干支生成|IMPLEMENTING|GO|実装中|
|月齢生成|IMPLEMENTING|GO|実装中|
|二十四節気取得|IMPLEMENTING|GO|実装中|
|七十二候取得|IMPLEMENTING|GO|実装中|

---

## 7.5 Gemini連携

|項目|STATUS|RESULT|備考|
|---|---|---|---|
|Prompt仕様|COMPLETED|PASS|確定|
|Retry仕様|COMPLETED|PASS|確定|
|Poem生成|IMPLEMENTING|GO|実装中|
|キャッシュ管理|IMPLEMENTING|GO|実装中|

---

## 7.6 GAS API

|項目|STATUS|RESULT|備考|
|---|---|---|---|
|Health Check API|COMPLETED|PASS|動作確認済み|
|Observation API|IMPLEMENTING|GO|実装中|
|Calendar API|IMPLEMENTING|GO|実装中|
|Poem API|IMPLEMENTING|GO|実装中|
|Configuration API|IMPLEMENTING|GO|実装中|

---

# 8. データ管理状況

|項目|STATUS|RESULT|備考|
|---|---|---|---|
|Spreadsheet Schema|COMPLETED|PASS|設計完了|
|設定管理|COMPLETED|PASS|運用中|
|ログ管理|COMPLETED|PASS|運用中|
|キャッシュ管理|IMPLEMENTING|GO|実装継続|

---

# 9. 現在未確定の事項

以下は現時点では正式決定していない。

|項目|状態|
|---|---|
|Geminiモデル更新手順|今後決定|
|Prompt Version運用|今後決定|
|poem_cache保持期間|今後決定|
|長期バックアップ運用|今後決定|
|正式Release判定基準|今後決定|

---

# 10. ハードウェア進捗

本章ではハードウェア開発の現在状況を管理する。

詳細設計・回路・配線仕様は各設計文書を正式情報とし、本章では進捗のみを管理する。

---

## 10.1 本体基板

|項目|STATUS|RESULT|備考|
|---|---|---|---|
|基本構成設計|COMPLETED|PASS|構成確定|
|部品選定|COMPLETED|PASS|主要部品決定|
|ピンアサイン|CONFIRMED|PASS|運用中|
|基板レイアウト|IN_PROGRESS|GO|設計継続|
|実装|PENDING|-|本体基板製作前|

---

## 10.2 電源基板

|項目|STATUS|RESULT|備考|
|---|---|---|---|
|基本設計|COMPLETED|PASS|完了|
|部品選定|COMPLETED|PASS|完了|
|PoC製作|COMPLETED|PASS|完成|
|無負荷試験|COMPLETED|PASS|正常|
|UPS切替試験|COMPLETED|PASS|正常|
|実負荷試験|PENDING|-|本体基板完成後実施|

---

## 10.3 電源アーキテクチャ

|項目|STATUS|RESULT|備考|
|---|---|---|---|
|UPS構成|CONFIRMED|PASS|運用方針確定|
|GND設計|CONFIRMED|PASS|仕様確定|
|SENSE系設計|CONFIRMED|PASS|仕様確定|
|USB-C入力|CONFIRMED|PASS|仕様確定|
|逆流防止回路|CONFIRMED|PASS|仕様確定|

---

## 10.4 配線設計

|項目|STATUS|RESULT|備考|
|---|---|---|---|
|SPI配線|CONFIRMED|PASS|仕様確定|
|I2C配線|CONFIRMED|PASS|仕様確定|
|I2S配線|CONFIRMED|PASS|仕様確定|
|USB D+/D-|CONFIRMED|PASS|ヘッダーピン経由|
|電源配線|CONFIRMED|PASS|仕様確定|

---

## 10.5 センサー

|項目|STATUS|RESULT|備考|
|---|---|---|---|
|BME680|CONFIRMED|PASS|採用|
|SCD41|CONFIRMED|PASS|採用|
|SGP41|CONFIRMED|PASS|採用|
|LTR390|CONFIRMED|PASS|採用|
|SPS30|CONFIRMED|PASS|採用|
|ICS-43434|CONFIRMED|PASS|採用|
|HLK-LD2410C|CONFIRMED|PASS|採用|

---

## 10.6 表示装置

|項目|STATUS|RESULT|備考|
|---|---|---|---|
|7.5inch E-Paper|CONFIRMED|PASS|採用|
|OLED管理画面|CONFIRMED|PASS|採用|
|ロータリーエンコーダ|CONFIRMED|PASS|採用|

---

## 10.7 筐体

|項目|STATUS|RESULT|備考|
|---|---|---|---|
|構造検討|IN_PROGRESS|GO|継続中|
|アルミフレーム設計|CONFIRMED|PASS|採用|
|塩ビパネル設計|IN_PROGRESS|GO|継続中|
|センサー配置|IN_PROGRESS|GO|継続中|
|放熱設計|IN_PROGRESS|GO|継続中|

---

# 11. ドキュメント整備状況

本章ではGitHubドキュメント体系の整備状況を管理する。

詳細仕様は各文書を正式情報とする。

|文書|STATUS|RESULT|
|---|---|---|
|README|IN_PROGRESS|GO|
|CURRENT_STATUS|IN_PROGRESS|GO|
|ROADMAP|IN_PROGRESS|GO|
|00_PROJECT_CONVENTIONS|FINALIZED|PASS|
|Hardware Documents|IN_PROGRESS|GO|
|Software Documents|IN_PROGRESS|GO|
|Operation Documents|IN_PROGRESS|GO|

---

# 12. 現在の主要課題

|優先度|課題|STATUS|
|---|---|---|
|1|本体基板完成|IN_PROGRESS|
|2|ドキュメント体系完成|IN_PROGRESS|
|3|GAS実装完了|IN_PROGRESS|
|4|筐体設計確定|IN_PROGRESS|
|5|統合試験開始|PENDING|

---

# 13. 次工程

本章では、現在の開発状況を踏まえた次工程を管理する。

ROADMAP.md に記載する中長期計画とは区別し、本章では現在着手予定の作業のみを管理する。

---

## 13.1 優先順位

|優先度|作業項目|STATUS|RESULT|備考|
|---|---|---|---|---|
|1|本体基板設計完了|IN_PROGRESS|GO|最優先|
|2|GitHubドキュメント体系完成|IN_PROGRESS|GO|vNext1.3|
|3|GAS実装完了|IN_PROGRESS|GO|Phase1継続|
|4|筐体設計確定|IN_PROGRESS|GO|本体基板と並行|
|5|システム統合試験開始|PENDING|-|本体完成後|

---

## 13.2 開始条件

|作業|開始条件|
|---|---|
|本体基板実装|設計完了|
|統合試験|本体基板完成|
|長期評価|統合試験完了|
|正式リリース|評価完了|

---

# 14. 現在のリスク

本章では、現在認識しているリスクを管理する。

設計変更や実装状況に応じて適宜更新する。

|項目|STATUS|内容|
|---|---|---|
|本体基板設計|IN_PROGRESS|レイアウト調整継続中|
|筐体設計|IN_PROGRESS|内部配置検討継続|
|ドキュメント体系|IN_PROGRESS|全面刷新作業中|
|統合試験|PENDING|ハードウェア完成待ち|

---

# 15. 保留事項

現時点で正式決定していない事項を管理する。

未定義事項は推測せず、正式決定後に更新する。

|項目|状態|
|---|---|
|正式リリース日|今後決定|
|Version採番規則|今後決定|
|Git Branch運用|今後決定|
|Commit Message規則|今後決定|
|長期保守運用|今後決定|

---

# 16. 判定

## プロジェクト判定

|項目|RESULT|備考|
|---|---|---|
|システム設計|PASS|完了|
|電源基板PoC|PASS|正常動作|
|UPS構成|PASS|確認済み|
|GND設計|PASS|確定|
|GitHub文書体系|GO|整備継続|
|本体基板|GO|設計継続|
|統合試験|-|未実施|

---

## Phase判定

|Phase|RESULT|
|---|---|
|Phase0|PASS|
|Phase1|GO|
|Phase2|GO|
|Phase3|-|
|Phase4|-|
|Phase5|-|

---

# 17. CHANGE LOG

|日付|内容|
|---|---|
|2026-07-15|vNext1.3文書体系に合わせ全面刷新。README・ROADMAP・00_PROJECT_CONVENTIONSとの責務を再整理し、CURRENT_STATUSを「現在の状況のみ」を管理する文書として再設計。STATUS・RESULT表記を統一し、Single Source of Truthに基づく構成へ変更。|
|2026-07-14|電源基板PoC完了を反映。UPS切替試験、GND設計確定、USB配線方針確定を更新。|
|2026-07-13|本体基板設計および筐体設計の進捗を更新。|
|2026-07-12|ハードウェアPoC結果を反映。|
|2026-07-11|GAS実装状況およびドキュメント整備状況を更新。|

# 付録A. STATUS運用一覧

本付録は CURRENT_STATUS.md 内で使用する STATUS の運用基準を示す。

詳細な定義は **docs/00_PROJECT_CONVENTIONS.md** を正式情報とする。

|STATUS|CURRENT_STATUSでの運用|
|---|---|
|PROPOSED|提案段階|
|PENDING|未着手|
|IMPLEMENTING|実装中（実装工程）|
|IN_PROGRESS|設計・評価・文書整備など進行中|
|COMPLETED|対象作業完了|
|CONFIRMED|仕様・方針確定|
|FINALIZED|正式仕様として確定|

---

# 付録B. RESULT運用一覧

本付録は CURRENT_STATUS.md 内で使用する RESULT の運用基準を示す。

詳細な定義は **docs/00_PROJECT_CONVENTIONS.md** を正式情報とする。

|RESULT|CURRENT_STATUSでの運用|
|---|---|
|GO|次工程へ進行可能|
|NG|修正が必要|
|PASS|試験・確認完了|
|FAIL|試験不合格|

---

# 付録C. 関連文書の責務

CURRENT_STATUS.md は開発状況のみを管理する。

各文書との責務分担は以下のとおりとする。

|文書|責務|
|---|---|
|README.md|プロジェクト概要・入口|
|CURRENT_STATUS.md|現在の状況（正式情報）|
|ROADMAP.md|将来計画・マイルストーン|
|docs/00_PROJECT_CONVENTIONS.md|共通規約|
|各設計文書|設計仕様|

CURRENT_STATUS.md には設計仕様や将来計画を記載しない。

---

# 付録D. 更新ルール

CURRENT_STATUS.md は以下のタイミングで更新する。

- Phase変更時
- STATUS変更時
- RESULT変更時
- 主要マイルストーン達成時
- 試験完了時
- 設計方針確定時
- リスクの増減時

軽微な文言修正のみでは更新履歴に記載しない。

---

# 自己査読チェックリスト

- [x] 文書内矛盾なし
- [x] READMEとの責務分離
- [x] ROADMAPとの責務分離
- [x] 00_PROJECT_CONVENTIONSとの整合
- [x] STATUS表記統一
- [x] RESULT表記統一
- [x] Single Source of Truth維持
- [x] GitHub表示崩れなし
- [x] 未確定事項を推測していない
- [x] vNext 1.3文書体系へ適合