# 11 Security Management

**タイトル**  
11 Security Management

**最終更新**  
2026-07-15

**文書版**  
vNext 1.3

**STATUS**  
FINALIZED

**責務**  
本書は digital-kakejiku におけるセキュリティ方針、認証・認可、秘密情報管理、ログ保護およびセキュリティ運用を定義する正式設計書である。

**Single Source**  
本書はセキュリティ設計を管理する唯一の文書である。

認証方式、秘密情報管理、アクセス制御およびログ保護は本書を正式情報とし、他文書では重複管理しない。

---

# 対象読者

- システム設計者
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
- docs/06_GAS_API_SPEC.md
- docs/12_CONFIGURATION_MANAGEMENT.md
- docs/17_TROUBLESHOOTING.md

## 後続

- GAS実装
- ESP32 Firmware実装
- セキュリティ試験

---

# 1. 文書の目的

本書はシステム全体のセキュリティ設計を定義する。

本書では以下を管理する。

- 認証方針
- 秘密情報管理
- アクセス制御
- ログ保護
- セキュリティ運用
- 基本原則

暗号アルゴリズムや実装コードの詳細は管理しない。

---

# 2. セキュリティ設計方針

本システムでは以下を基本方針とする。

- 最小権限を採用する。
- 秘密情報をハードコードしない。
- ログへ秘密情報を記録しない。
- Spreadsheetを直接公開しない。
- APIはGoogle Apps Scriptのみ公開する。
- Single Source of Truth を維持する。

---

# 3. 保護対象

|対象|STATUS|
|---|---|
|API Secret|CONFIRMED|
|Spreadsheet ID|CONFIRMED|
|Gemini API Key|CONFIRMED|
|管理者情報|CONFIRMED|
|システム設定|CONFIRMED|

---

# 4. セキュリティ構成

```text
ESP32
    │
 HTTPS
    │
    ▼
Google Apps Script
    │
    ├─────────────┐
    ▼             ▼
Spreadsheet   Script Properties
                    │
                    ▼
            Secret Information
```

Spreadsheetへ直接アクセスするクライアントは存在しない。

---

# 5. 認証方針

本システムでは、Google Apps Script を唯一の公開APIとし、認証を経由しないアクセスを許可しない。

---

## 5.1 基本方針

- API認証を実施する。
- 認証情報はHTTPS経由のみ送信する。
- 認証失敗時は処理を中断する。
- 認証情報をレスポンスへ返却しない。
- 認証情報をログへ記録しない。

---

## 5.2 認証対象

|対象|用途|
|---|---|
|ESP32|API利用|
|保守画面|管理操作|
|GAS内部処理|管理API|

認証方式の実装詳細は本書では定義しない。

---

# 6. Secret管理

Secret情報は Google Apps Script の Script Properties を正式な保管場所とする。

---

## 6.1 管理対象

|項目|保存先|
|---|---|
|API Secret|Script Properties|
|Gemini API Key|Script Properties|
|Spreadsheet ID|Script Properties|
|管理者設定|Script Properties|

---

## 6.2 基本方針

- ソースコードへ埋め込まない。
- Spreadsheetへ保存しない。
- ログへ保存しない。
- 画面へ表示しない。

---

# 7. アクセス制御

アクセス制御は Google Apps Script が担当する。

---

## 基本方針

- API単位で認証を行う。
- 権限外の操作を許可しない。
- 異常アクセスは拒否する。
- 必要に応じてError Logへ記録する。

---

# 8. ログ保護

ログには秘密情報を保存しない。

---

## 記録禁止情報

- API Secret
- Gemini API Key
- 認証トークン
- パスワード
- Secret文字列
- Cookie情報

---

## 基本方針

- 必要最小限のみ記録する。
- 機密情報はマスクする。
- 障害解析に必要な情報のみ保存する。

ログ仕様は **03_LOG_FORMAT.md** を正式情報とする。

---

# 9. 通信保護

本章ではシステム間通信における保護方針を定義する。

通信方式の実装詳細は対象モジュールを正式情報とする。

---

## 9.1 基本方針

- HTTPS通信を前提とする。
- 平文通信を行わない。
- API以外の通信経路を設けない。
- 通信エラー時は安全側へ遷移する。

---

## 9.2 通信経路

```text
ESP32
   │
 HTTPS
   │
Google Apps Script
   │
Spreadsheet
```

外部サービスとの通信は Google Apps Script を経由する。

---

# 10. Spreadsheet保護

Google Spreadsheet は内部データストアとして利用する。

ESP32 は直接アクセスしない。

---

## 基本方針

- Spreadsheetは非公開で運用する。
- GAS経由以外の更新を想定しない。
- 直接編集は保守作業時のみ実施する。
- データ整合性を維持する。

---

# 11. 設定保護

設定情報は用途ごとに分離して管理する。

---

## 管理対象

|情報|保存先|
|---|---|
|system_config|Spreadsheet|
|source_config|Spreadsheet|
|Secret情報|Script Properties|

---

## 基本方針

- Secret情報と設定情報を分離する。
- 設定変更は認証後のみ許可する。
- ESP32は必要な設定のみ取得する。

設定仕様は **12_CONFIGURATION_MANAGEMENT.md** を正式情報とする。

---

# 12. 障害時のセキュリティ

障害発生時も秘密情報を保護する。

---

## 基本方針

- ExceptionへSecretを含めない。
- Error LogへSecretを保存しない。
- 復旧時も認証状態を維持する。
- 障害情報は必要最小限とする。

障害対応は **17_TROUBLESHOOTING.md** を正式情報とする。

---

# 13. 設計方針

本システムでは以下をセキュリティ設計原則とする。

---

## 最小権限

各モジュールは必要最小限の権限のみ保持する。

---

## Single Source of Truth

|情報|正式管理|
|---|---|
|Secret|Script Properties|
|設定|Spreadsheet|
|認証仕様|本書|

---

## 保守性

- Secretを集中管理する。
- 認証方式を共通化する。
- セキュリティ設定を文書化する。

---

## 拡張性

将来的な認証方式変更に対応できる構成を維持する。

---

# 14. 制約事項

本章ではセキュリティ設計における制約事項を定義する。

本書ではセキュリティアーキテクチャを対象とし、暗号アルゴリズムや実装コードの詳細は対象外とする。

---

## 14.1 本書で定義しない事項

|項目|管理文書|
|---|---|
|暗号アルゴリズム実装|ソースコード|
|認証ライブラリ|ソースコード|
|HTTPS実装|Google Apps Script / ESP32 Firmware|
|Googleアカウント管理|Googleサービス|
|OSレベルセキュリティ|対象外|

---

## 14.2 設計制約

以下を設計制約とする。

- Google Apps Script を唯一の公開APIとする。
- ESP32 は Spreadsheet へ直接アクセスしない。
- Secret情報は Script Properties のみで管理する。
- Secret情報をログへ保存しない。
- Secret情報を画面表示しない。

---

# 15. 将来拡張

本章では将来的に追加を検討するセキュリティ機能を示す。

本章は構想であり、実装を保証するものではない。

---

## 15.1 セキュリティ機能

|項目|STATUS|備考|
|---|---|---|
|認証方式追加|PROPOSED|詳細未定|
|APIキー更新機能|PROPOSED|詳細未定|
|アクセス監査|PROPOSED|詳細未定|
|異常アクセス検知|PROPOSED|詳細未定|
|監査ログ強化|PROPOSED|詳細未定|

---

## 15.2 保守支援

将来的に以下を検討する。

- Secret更新支援
- セキュリティ診断
- 設定整合性確認
- 監査レポート生成

詳細仕様は今後決定する。

---

# 16. 未定義事項

本書では以下を定義しない。

|項目|状態|
|---|---|
|鍵ローテーション方式|今後決定|
|APIレート制限|今後決定|
|監査ログ保持期間|今後決定|
|侵入検知方式|今後決定|
|多要素認証対応|今後決定|

---

# CHANGE LOG

|日付|内容|
|---|---|
|2026-07-15|vNext 1.3文書体系に合わせ全面刷新。セキュリティ設計文書として再設計し、README・CURRENT_STATUS・ROADMAP・02_SOFTWARE_OVERVIEW・03_LOG_FORMAT・06_GAS_API_SPEC・12_CONFIGURATION_MANAGEMENT・17_TROUBLESHOOTINGとの責務を明確化。Single Source of Truthに基づき、認証・Secret管理・通信保護・アクセス制御・ログ保護を整理し、STATUS表記・文書構成を共通規約へ統一。|
|2026-07-14|Script Propertiesを利用したSecret管理方針を更新。|
|2026-07-13|ログへの秘密情報保存禁止および認証設計を整理。|

---

# 付録A. 関連文書の責務

|文書|責務|
|---|---|
|README.md|プロジェクト概要・入口|
|CURRENT_STATUS.md|現在の開発状況|
|ROADMAP.md|中長期計画|
|02_SOFTWARE_OVERVIEW.md|ソフトウェア全体構成|
|03_LOG_FORMAT.md|ログ仕様|
|06_GAS_API_SPEC.md|API仕様|
|11_SECURITY_MANAGEMENT.md|セキュリティ設計（本書）|
|12_CONFIGURATION_MANAGEMENT.md|設定管理|
|17_TROUBLESHOOTING.md|障害対応|

---

# 付録B. 更新ルール

本書は以下の場合に更新する。

- 認証方式変更
- Secret管理変更
- 通信保護変更
- アクセス制御変更
- セキュリティポリシー変更
- 文書体系変更

日常的な運用変更は記載しない。

現在の開発状況は **CURRENT_STATUS.md** を正式情報とする。

---

# 自己査読チェックリスト

- [x] 文書内矛盾なし
- [x] READMEとの責務分離
- [x] CURRENT_STATUSとの責務分離
- [x] ROADMAPとの責務分離
- [x] 00_PROJECT_CONVENTIONSとの整合
- [x] 02_SOFTWARE_OVERVIEWとの責務分離
- [x] 03_LOG_FORMATとの責務分離
- [x] 06_GAS_API_SPECとの責務分離
- [x] 12_CONFIGURATION_MANAGEMENTとの責務分離
- [x] 17_TROUBLESHOOTINGとの責務分離
- [x] STATUS表記統一
- [x] Single Source of Truth維持
- [x] GitHub表示崩れなし
- [x] vNext 1.3文書体系へ適合