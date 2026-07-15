# 06 GAS API Specification

**タイトル**  
06 GAS API Specification

**最終更新**  
2026-07-15

**文書版**  
vNext 1.3

**STATUS**  
FINALIZED

**責務**  
本書は Google Apps Script が提供する API の仕様、エンドポイント、リクエスト・レスポンスおよび API の責務を定義する正式設計書である。

**Single Source**  
本書は GAS API 仕様を管理する唯一の文書である。

API仕様、エンドポイント、レスポンス仕様およびエラー応答は本書を正式情報とし、他文書では重複管理しない。

---

# 対象読者

- GAS開発者
- ESP32開発者
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
- docs/03_LOG_FORMAT.md
- docs/12_CONFIGURATION_MANAGEMENT.md
- docs/14_SPREADSHEET_SCHEMA.md
- docs/18_GAS_RETRY_STRATEGY.md
- docs/19_GEMINI_PROMPT_SPECIFICATION.md

## 後続

- GAS実装
- ESP32 Firmware実装
- API試験

---

# 1. 文書の目的

本書は Google Apps Script が提供する API を定義する。

本書では以下を管理する。

- API一覧
- エンドポイント
- リクエスト形式
- レスポンス形式
- エラー応答
- API設計方針

実装コードおよび Spreadsheet スキーマは管理しない。

---

# 2. API設計方針

本システムでは以下を基本方針とする。

- RESTライクなAPI構成とする。
- JSONを標準フォーマットとする。
- HTTPS通信を前提とする。
- APIは単一責務とする。
- エラー応答を統一する。
- API仕様は後方互換性を考慮する。

---

# 3. API一覧

|API|用途|STATUS|
|---|---|---|
|Health Check API|動作確認|CONFIRMED|
|Observation API|観測データ送信|CONFIRMED|
|Configuration API|設定取得|CONFIRMED|
|Calendar API|暦取得|CONFIRMED|
|Poem API|詩取得|CONFIRMED|

---

# 4. システム構成

```text
ESP32
   │
 HTTPS
   │
   ▼
Google Apps Script
   │
   ├──────────────┐
   ▼              ▼
Spreadsheet    Gemini API
```

APIは Google Apps Script を唯一の窓口とする。

---

# 5. API共通仕様

本章では、すべてのAPIに共通する仕様を定義する。

---

## 5.1 通信方式

|項目|内容|
|---|---|
|Protocol|HTTPS|
|Request Format|JSON|
|Response Format|JSON|
|Character Encoding|UTF-8|

---

## 5.2 リクエスト

ESP32 は JSON を使用して Google Apps Script へ送信する。

リクエスト項目の詳細は各APIで定義する。

---

## 5.3 レスポンス

レスポンスは JSON を返却する。

正常・異常を問わず同一フォーマットを基本とする。

---

## 5.4 RESULT

API内部で使用する RESULT は以下を使用する。

|RESULT|意味|
|---|---|
|GO|処理継続可能|
|NG|処理異常|
|PASS|正常終了|
|FAIL|処理失敗|

STATUS はAPIレスポンスとして使用しない。

---

# 6. Health Check API

Health Check API はシステムの稼働状態を確認する。

---

## 6.1 責務

- GAS動作確認
- Spreadsheet接続確認
- 基本機能確認

---

## 6.2 処理概要

```text
ESP32
   │
Health Check
   │
   ▼
GAS
   │
Spreadsheet確認
   │
   ▼
Response
```

---

# 7. Observation API

Observation API は観測データを受信し保存する。

---

## 7.1 責務

- Observation受信
- データ検証
- Spreadsheet保存
- ログ記録

---

## 7.2 保存先

Observation Log

詳細構造は **14_SPREADSHEET_SCHEMA.md** を正式情報とする。

---

# 8. Configuration API

Configuration API は設定情報を取得する。

---

## 8.1 責務

- system_config取得
- source_config取得

ESP32 は設定値を保持せず、必要時に取得する。

詳細仕様は **12_CONFIGURATION_MANAGEMENT.md** を正式情報とする。

---

# 9. Calendar API

Calendar API は暦情報を返却する。

---

## 9.1 責務

- 暦情報取得
- Calendar返却

生成方法は **13_GAS_OPERATION_POLICY.md** を正式情報とする。

---

# 10. Poem API

Poem API は詩情報を返却する。

---

## 10.1 責務

- 詩取得
- キャッシュ確認
- 必要時生成
- レスポンス返却

生成仕様は **19_GEMINI_PROMPT_SPECIFICATION.md** を正式情報とする。

---

# 11. エラー応答

本章では API 共通のエラー応答方針を定義する。

エラー処理の実装詳細は対象モジュールおよび **18_GAS_RETRY_STRATEGY.md** を正式情報とする。

---

## 11.1 基本方針

- エラー応答形式は統一する。
- 内部例外をそのまま返却しない。
- エラー内容は Error Log へ記録する。
- Retry可能なエラーは Retry Controller が処理する。

---

## 11.2 エラー分類

|分類|概要|
|---|---|
|Validation Error|入力値異常|
|Authentication Error|認証異常|
|Spreadsheet Error|Spreadsheetアクセス異常|
|Gemini Error|Gemini API異常|
|Internal Error|想定外例外|

---

## 11.3 エラー処理

```text
API Request
      │
      ▼
入力検証
      │
      ├──正常─────►API処理
      │
      └──異常─────►Error Response
                     │
                     ▼
                 Error Log
```

---

# 12. ログとの関係

API処理では必要に応じてログを記録する。

ログ仕様は **03_LOG_FORMAT.md** を正式情報とする。

|API|ログ|
|---|---|
|Health Check API|System Log|
|Observation API|Observation Log|
|Configuration API|System Log|
|Calendar API|System Log|
|Poem API|System Log|
|API異常|Error Log|

---

# 13. 認証方針

認証方式の詳細は **11_SECURITY_MANAGEMENT.md** を正式情報とする。

本書では設計方針のみ定義する。

---

## 基本方針

- HTTPS通信を前提とする。
- API認証を実施する。
- Secret情報はログへ保存しない。
- 認証情報をレスポンスへ返却しない。

認証アルゴリズムの詳細は本書では定義しない。

---

# 14. 設計方針

本システムでは以下をAPI設計原則とする。

---

## 単一責務

各APIは一つの責務のみを持つ。

---

## Single Source of Truth

データは Spreadsheet を正式情報とする。

APIは保存・取得の仲介のみを担当する。

---

## 保守性

- API追加を容易にする。
- 互換性を維持する。
- エラー処理を統一する。

---

## 拡張性

将来的なAPI追加に対応できる構成を維持する。

---

# 15. 制約事項

本書では API の論理仕様を定義する。

以下の項目は本書では定義しない。

|項目|管理文書|
|---|---|
|Spreadsheet構造|14_SPREADSHEET_SCHEMA.md|
|Retryアルゴリズム|18_GAS_RETRY_STRATEGY.md|
|Gemini Prompt|19_GEMINI_PROMPT_SPECIFICATION.md|
|認証詳細|11_SECURITY_MANAGEMENT.md|
|ソースコード構成|実装コード|

---

# 16. 将来拡張

本章では将来的に追加を検討する API を示す。

本章は構想であり、実装を保証するものではない。

---

## 16.1 API追加候補

|API|STATUS|備考|
|---|---|---|
|Diagnostic API|PROPOSED|詳細未定|
|Maintenance API|PROPOSED|詳細未定|
|Log Search API|PROPOSED|詳細未定|
|Statistics API|PROPOSED|詳細未定|
|OTA Support API|PROPOSED|詳細未定|

---

## 16.2 拡張方針

将来的な機能追加に対応できるよう以下を維持する。

- RESTライク設計
- JSON統一
- エラー応答統一
- 後方互換性維持
- モジュール分離

---

# 17. 未定義事項

本書では以下を定義しない。

|項目|状態|
|---|---|
|API Version管理方式|今後決定|
|レート制限|今後決定|
|リクエストサイズ制限|今後決定|
|タイムアウト値|今後決定|
|将来API追加順序|今後決定|

---

# CHANGE LOG

|日付|内容|
|---|---|
|2026-07-15|vNext 1.3文書体系に合わせ全面刷新。GAS API仕様文書として再設計し、README・CURRENT_STATUS・ROADMAP・02_SOFTWARE_OVERVIEW・03_LOG_FORMAT・11_SECURITY_MANAGEMENT・12_CONFIGURATION_MANAGEMENT・14_SPREADSHEET_SCHEMA・18_GAS_RETRY_STRATEGY・19_GEMINI_PROMPT_SPECIFICATIONとの責務を明確化。Single Source of Truthに基づき、API仕様・認証・エラー応答・データ管理との重複を整理し、STATUS表記・文書構成を共通規約へ統一。|
|2026-07-14|API構成およびエラー処理方針を更新。|
|2026-07-13|Health Check API・Observation API・Configuration API設計を更新。|

---

# 付録A. 関連文書の責務

|文書|責務|
|---|---|
|README.md|プロジェクト概要・入口|
|CURRENT_STATUS.md|現在の開発状況|
|ROADMAP.md|中長期計画|
|02_SOFTWARE_OVERVIEW.md|ソフトウェア全体構成|
|03_LOG_FORMAT.md|ログ仕様|
|06_GAS_API_SPEC.md|API仕様（本書）|
|11_SECURITY_MANAGEMENT.md|認証・セキュリティ|
|12_CONFIGURATION_MANAGEMENT.md|設定管理|
|14_SPREADSHEET_SCHEMA.md|データ構造|
|18_GAS_RETRY_STRATEGY.md|Retry仕様|
|19_GEMINI_PROMPT_SPECIFICATION.md|Gemini仕様|

---

# 付録B. 更新ルール

本書は以下の場合に更新する。

- API追加・削除
- API仕様変更
- リクエスト・レスポンス変更
- 認証方式変更
- エラー応答変更
- 文書体系変更

日常的な実装変更は記載しない。

実装コードおよび詳細アルゴリズムは関連文書またはソースコードで管理する。

---

# 自己査読チェックリスト

- [x] 文書内矛盾なし
- [x] READMEとの責務分離
- [x] CURRENT_STATUSとの責務分離
- [x] ROADMAPとの責務分離
- [x] 00_PROJECT_CONVENTIONSとの整合
- [x] 02_SOFTWARE_OVERVIEWとの責務分離
- [x] 03_LOG_FORMATとの責務分離
- [x] 11_SECURITY_MANAGEMENTとの責務分離
- [x] 12_CONFIGURATION_MANAGEMENTとの責務分離
- [x] 14_SPREADSHEET_SCHEMAとの責務分離
- [x] 18_GAS_RETRY_STRATEGYとの責務分離
- [x] 19_GEMINI_PROMPT_SPECIFICATIONとの責務分離
- [x] STATUS表記統一
- [x] Single Source of Truth維持
- [x] GitHub表示崩れなし
- [x] vNext 1.3文書体系へ適合