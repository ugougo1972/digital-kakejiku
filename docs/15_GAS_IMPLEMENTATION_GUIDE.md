# 15 GAS Implementation Guide

**タイトル**  
15 GAS Implementation Guide

**最終更新**  
2026-07-15

**文書版**  
vNext 1.3

**STATUS**  
FINALIZED

**責務**  
本書は Google Apps Script の実装手順、モジュール構成、開発規約および実装ガイドラインを定義する正式設計書である。

**Single Source**  
本書は GAS 実装方針を管理する唯一の文書である。

実装順序、モジュール責務、開発ルールおよび実装ガイドラインは本書を正式情報とし、他文書では重複管理しない。

---

# 対象読者

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

- docs/02_SOFTWARE_OVERVIEW.md
- docs/06_GAS_API_SPEC.md
- docs/11_SECURITY_MANAGEMENT.md
- docs/12_CONFIGURATION_MANAGEMENT.md
- docs/13_GAS_OPERATION_POLICY.md
- docs/14_SPREADSHEET_SCHEMA.md

## 後続

- GAS実装
- 単体試験
- 統合試験

---

# 1. 文書の目的

本書は Google Apps Script の実装ガイドラインを定義する。

本書では以下を管理する。

- 実装順序
- モジュール構成
- 実装ルール
- コーディング方針
- 開発手順

API仕様、Spreadsheet構造およびRetry仕様は本書では管理しない。

---

# 2. 実装方針

本システムでは以下を基本方針とする。

- モジュール単位で実装する。
- 単一責務を維持する。
- 共通処理を再利用する。
- Spreadsheetを正式情報とする。
- Secret情報は Script Properties で管理する。
- Single Source of Truth を維持する。

---

# 3. 実装構成

```text
Google Apps Script

├── API
├── Managers
├── Services
├── Utilities
├── Logger
├── Retry
├── Health Check
└── Scheduler
```

---

# 4. 実装順序

|順序|モジュール|STATUS|
|---:|---|---|
|1|Logger|CONFIRMED|
|2|Configuration Manager|CONFIRMED|
|3|Health Check|CONFIRMED|
|4|Calendar Manager|CONFIRMED|
|5|Poem Manager|CONFIRMED|
|6|API|CONFIRMED|
|7|Scheduler|CONFIRMED|
|8|Maintenance|PENDING|

---

# 5. Logger

Logger はシステム全体のログ出力を担当する。

---

## 5.1 責務

- Observation Log出力
- Event Log出力
- Error Log出力
- System Log出力

---

## 5.2 基本方針

- ログ形式を統一する。
- Secret情報を保存しない。
- Logger以外から直接Spreadsheetを書き込まない。
- ログ仕様は **03_LOG_FORMAT.md** を正式情報とする。

---

# 6. Configuration Manager

Configuration Manager は設定情報を取得・管理する。

---

## 6.1 責務

- system_config取得
- source_config取得
- 設定検証
- 設定キャッシュ管理

---

## 6.2 基本方針

- Spreadsheetを正式情報とする。
- Secretは取得しない。
- 必須設定を検証する。
- Configuration APIと責務を分離する。

---

# 7. Health Check

Health Check はシステムの健全性を確認する。

---

## 7.1 責務

- Spreadsheet確認
- Script Properties確認
- Configuration確認
- Logger確認

---

## 7.2 基本方針

- 起動確認を容易にする。
- 障害箇所を特定しやすくする。
- 実行結果をSystem Logへ記録する。

---

# 8. Calendar Manager

Calendar Manager は暦情報を生成する。

---

## 責務

- Calendar生成
- Calendar更新
- Calendar取得

---

## 基本方針

- calendar_masterを正式情報とする。
- 外部データソースを利用する。
- Spreadsheetへ保存する。

詳細仕様は **10_CALENDAR_POEM_SUBSYSTEM.md** を正式情報とする。

---

# 9. Poem Manager

Poem Manager はAI詩生成を担当する。

---

## 責務

- Prompt生成
- Gemini呼出し
- poem_cache更新

---

## 基本方針

- poem_cacheを優先利用する。
- Gemini APIを必要時のみ利用する。
- Prompt仕様を外部管理する。

Prompt仕様は **19_GEMINI_PROMPT_SPECIFICATION.md** を正式情報とする。

---

# 10. API

API モジュールは ESP32 との通信窓口を提供する。

---

## 責務

- API受付
- 入力検証
- Manager呼出し
- JSONレスポンス生成

---

## 基本方針

- APIは単一責務を維持する。
- Validationを共通化する。
- エラー応答を統一する。

API仕様は **06_GAS_API_SPEC.md** を正式情報とする。

---

# 11. Scheduler

Scheduler は Time Trigger により各ジョブを実行する。

---

## 責務

- Calendar Job起動
- Poem Job起動
- Maintenance Job起動

---

## 基本方針

- ジョブを独立して管理する。
- Retryを考慮する。
- 排他制御を行う。

運用仕様は **13_GAS_OPERATION_POLICY.md** を正式情報とする。

---

# 12. Retry Manager

Retry Manager は共通Retry処理を担当する。

---

## 責務

- Retry判定
- Retry待機時間管理
- Retry終了判定

---

## 基本方針

- 共通Retry処理を提供する。
- 無限Retryを禁止する。
- Retry結果をLoggerへ通知する。

Retry仕様は **18_GAS_RETRY_STRATEGY.md** を正式情報とする。

---

# 13. Maintenance

Maintenance モジュールは保守用処理を担当する。

---

## 13.1 責務

- 保守ジョブ実行
- キャッシュ整合性確認
- システム診断
- 保守情報出力

---

## 13.2 基本方針

- 他モジュールへ影響を与えない。
- 保守処理を独立管理する。
- 実行結果をSystem Logへ記録する。
- Secret情報を出力しない。

---

# 14. 共通ユーティリティ

Utilities は複数モジュールから利用される共通機能を提供する。

---

## 14.1 責務

- JSON操作
- 日時処理
- バリデーション
- 共通定数
- 共通例外処理

---

## 14.2 基本方針

- ビジネスロジックを持たない。
- 再利用性を優先する。
- モジュール依存を持たない。

---

# 15. 実装ルール

Google Apps Script 全体で以下を適用する。

---

## 15.1 モジュール構成

- モジュール単位でファイルを分割する。
- 単一責務を維持する。
- 相互依存を最小限とする。

---

## 15.2 コーディング方針

- 共通処理はUtilityへ集約する。
- Magic Numberを使用しない。
- 設定値をハードコードしない。
- Secret情報をコードへ記述しない。
- 例外を握りつぶさない。

---

## 15.3 Logger利用

ログ出力はLogger経由のみとする。

Spreadsheetへ直接ログを書き込んではならない。

---

# 16. エラー処理

エラー処理は全モジュールで統一する。

---

## 基本方針

- Exceptionを適切に分類する。
- Error Logへ記録する。
- Retry対象を判定する。
- APIレスポンスを統一する。

Retry仕様は **18_GAS_RETRY_STRATEGY.md** を正式情報とする。

---

# 17. テスト方針

実装後は段階的に試験する。

---

## 試験順序

|順序|試験|
|---:|---|
|1|単体試験|
|2|Manager統合試験|
|3|API試験|
|4|Scheduler試験|
|5|システム試験|

詳細は **16_TESTING_STRATEGY.md** を正式情報とする。

---

# 18. 設計方針

GAS実装は以下を設計原則とする。

---

## 単一責務

各モジュールは一つの責務のみを持つ。

---

## Single Source of Truth

|情報|正式管理|
|---|---|
|設定|Spreadsheet|
|Secret|Script Properties|
|API仕様|06_GAS_API_SPEC.md|

---

## 保守性

- モジュール追加を容易にする。
- 共通処理を再利用する。
- Loggerを共通利用する。

---

## 拡張性

将来的な機能追加に対応できる構成を維持する。

---

# 19. 制約事項

本章では GAS 実装における制約事項を定義する。

本書は実装ガイドラインを対象とし、API仕様・Spreadsheet構造・運用仕様・試験仕様の詳細は対象外とする。

---

## 19.1 本書で定義しない事項

|項目|管理文書|
|---|---|
|API仕様|06_GAS_API_SPEC.md|
|ログ仕様|03_LOG_FORMAT.md|
|設定管理|12_CONFIGURATION_MANAGEMENT.md|
|Spreadsheet構造|14_SPREADSHEET_SCHEMA.md|
|運用ポリシー|13_GAS_OPERATION_POLICY.md|
|Retry仕様|18_GAS_RETRY_STRATEGY.md|
|Prompt仕様|19_GEMINI_PROMPT_SPECIFICATION.md|
|試験方法|16_TESTING_STRATEGY.md|

---

## 19.2 実装制約

以下を実装制約とする。

- Spreadsheetを直接操作する処理を各モジュールへ分散させない。
- Loggerを経由せずログを書き込まない。
- Secret情報をScript Properties以外へ保存しない。
- Secret情報をソースコードへ埋め込まない。
- 共通処理はUtilitiesへ集約する。

---

# 20. 将来拡張

本章では将来的な実装拡張を示す。

本章は構想であり、実装を保証するものではない。

---

## 20.1 モジュール追加候補

|モジュール|STATUS|備考|
|---|---|---|
|Notification Manager|PROPOSED|通知管理|
|Backup Manager|PROPOSED|バックアップ|
|Statistics Manager|PROPOSED|統計処理|
|Diagnostic Manager|PROPOSED|診断機能|
|OTA Support|PROPOSED|保守支援|

---

## 20.2 開発支援

将来的に以下を検討する。

- 自動コード生成
- 共通テスト基盤
- Mock環境
- CI対応

詳細仕様は今後決定する。

---

# 21. 未定義事項

|項目|状態|
|---|---|
|フォルダ構成詳細|今後決定|
|命名規約詳細|今後決定|
|Lintルール|今後決定|
|コードレビュー手順|今後決定|
|CI/CD構成|今後決定|

---

# CHANGE LOG

|日付|内容|
|---|---|
|2026-07-15|vNext 1.3文書体系に合わせ全面刷新。GAS実装ガイドとして再設計し、README・CURRENT_STATUS・ROADMAP・06_GAS_API_SPEC・11_SECURITY_MANAGEMENT・12_CONFIGURATION_MANAGEMENT・13_GAS_OPERATION_POLICY・14_SPREADSHEET_SCHEMA・16_TESTING_STRATEGY・18_GAS_RETRY_STRATEGYとの責務を明確化。Single Source of Truthに基づき、実装順序・モジュール責務・開発規約・共通処理を整理し、STATUS表記・文書構成を共通規約へ統一。|
|2026-07-14|Configuration Manager、Health Check、Scheduler構成を更新。|
|2026-06-21|Phase1実装順序およびHealth Check実装結果を反映。|

---

# 付録A. 関連文書の責務

|文書|責務|
|---|---|
|README.md|プロジェクト概要・入口|
|CURRENT_STATUS.md|現在の開発状況|
|ROADMAP.md|中長期計画|
|06_GAS_API_SPEC.md|API仕様|
|11_SECURITY_MANAGEMENT.md|セキュリティ|
|12_CONFIGURATION_MANAGEMENT.md|設定管理|
|13_GAS_OPERATION_POLICY.md|運用方針|
|14_SPREADSHEET_SCHEMA.md|Spreadsheet構造|
|15_GAS_IMPLEMENTATION_GUIDE.md|GAS実装ガイド（本書）|
|16_TESTING_STRATEGY.md|試験方針|
|18_GAS_RETRY_STRATEGY.md|Retry仕様|

---

# 付録B. 更新ルール

本書は以下の場合に更新する。

- 実装順序変更
- モジュール追加・削除
- 共通処理変更
- 開発規約変更
- 実装方針変更
- 文書体系変更

日常的なソースコード修正は記載しない。

現在の実装状況は **CURRENT_STATUS.md** を正式情報とする。

---

# 自己査読チェックリスト

- [x] 文書内矛盾なし
- [x] READMEとの責務分離
- [x] CURRENT_STATUSとの責務分離
- [x] ROADMAPとの責務分離
- [x] 00_PROJECT_CONVENTIONSとの整合
- [x] 06_GAS_API_SPECとの責務分離
- [x] 11_SECURITY_MANAGEMENTとの責務分離
- [x] 12_CONFIGURATION_MANAGEMENTとの責務分離
- [x] 13_GAS_OPERATION_POLICYとの責務分離
- [x] 14_SPREADSHEET_SCHEMAとの責務分離
- [x] 16_TESTING_STRATEGYとの責務分離
- [x] 18_GAS_RETRY_STRATEGYとの責務分離
- [x] STATUS表記統一
- [x] Single Source of Truth維持
- [x] GitHub表示崩れなし
- [x] vNext 1.3文書体系へ適合