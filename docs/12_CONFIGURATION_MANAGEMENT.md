# 12 Configuration Management

**タイトル**  
12 Configuration Management

**最終更新**  
2026-07-15

**文書版**  
vNext 1.3

**STATUS**  
FINALIZED

**責務**  
本書は digital-kakejiku における設定情報の管理方式、設定データの責務、更新方針および設定運用を定義する正式設計書である。

**Single Source**  
本書は設定管理仕様を管理する唯一の文書である。

設定項目、設定取得方法、更新方針および管理責務は本書を正式情報とし、他文書では重複管理しない。

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
- docs/06_GAS_API_SPEC.md
- docs/11_SECURITY_MANAGEMENT.md
- docs/14_SPREADSHEET_SCHEMA.md
- docs/13_GAS_OPERATION_POLICY.md

## 後続

- GAS実装
- ESP32 Firmware実装
- システム統合試験

---

# 1. 文書の目的

本書はシステム全体の設定管理を定義する。

本書では以下を管理する。

- 設定体系
- 設定責務
- 設定取得方法
- 更新方針
- 設定保存先
- 管理ルール

実際の設定値やSpreadsheet構造の詳細は管理しない。

---

# 2. 設定管理方針

本システムでは以下を基本方針とする。

- Spreadsheetを設定情報の正式な保存先とする。
- Secret情報はScript Propertiesで管理する。
- ESP32は必要時のみ設定を取得する。
- 設定情報を重複管理しない。
- 設定追加時は後方互換性を維持する。
- Single Source of Truth を維持する。

---

# 3. 設定構成

```text
          Script Properties
                 │
         Secret Information

                 │

Google Spreadsheet
      │
      ├──────────────┐
      │              │
system_config   source_config
      │              │
      └──────┬───────┘
             ▼
     Configuration API
             │
             ▼
           ESP32
```

---

# 4. 設定分類

|設定|用途|STATUS|
|---|---|---|
|system_config|システム設定|CONFIRMED|
|source_config|データ取得元設定|CONFIRMED|
|Script Properties|Secret管理|CONFIRMED|

---

# 5. system_config

`system_config` はシステム全体で使用する設定を管理する。

---

## 5.1 責務

- システム設定管理
- 動作パラメータ管理
- Gemini関連設定管理
- Retry設定管理
- 表示設定管理

---

## 5.2 基本方針

- Google Spreadsheet を正式情報とする。
- GAS が読み込みを管理する。
- ESP32 は必要時のみ取得する。
- Secret 情報を含めない。

---

## 5.3 管理対象

代表的な管理項目を以下に示す。

|分類|例|
|---|---|
|Gemini設定|モデル・Temperature等|
|表示設定|更新周期等|
|Retry設定|待機時間・回数等|
|運用設定|システムパラメータ|

詳細な項目一覧は **14_SPREADSHEET_SCHEMA.md** を正式情報とする。

---

# 6. source_config

`source_config` は外部データ取得元を管理する。

---

## 6.1 責務

- データソース管理
- 有効・無効管理
- URL管理
- 優先順位管理

---

## 6.2 基本方針

- GASのみが利用する。
- ESP32は直接利用しない。
- データ取得元を集中管理する。

---

## 6.3 管理対象

|分類|例|
|---|---|
|Calendar Source|暦取得元|
|Season Source|七十二候取得元|
|Holiday Source|祝日取得元|
|Moon Source|月齢取得元|

取得処理の詳細は **13_GAS_OPERATION_POLICY.md** を正式情報とする。

---

# 7. Script Properties

Script Properties は Secret 情報を管理する。

---

## 管理対象

|項目|用途|
|---|---|
|Spreadsheet ID|Spreadsheet識別|
|API Secret|API認証|
|Gemini API Key|Gemini利用|
|管理者情報|保守管理|

---

## 基本方針

- GASのみがアクセスする。
- Spreadsheetへ保存しない。
- ESP32へ返却しない。
- ログへ保存しない。

詳細は **11_SECURITY_MANAGEMENT.md** を正式情報とする。

---

# 8. 設定取得

設定取得は Configuration API を介して実施する。

---

## 基本方針

- ESP32 は必要時に取得する。
- 設定値を永続保持しない。
- Spreadsheet を正式情報とする。

取得仕様は **06_GAS_API_SPEC.md** を正式情報とする。

---

# 9. 設定更新

設定更新は Google Apps Script を経由して実施する。

直接 Spreadsheet を編集する運用は保守作業を除き想定しない。

---

## 9.1 基本方針

- 設定更新は認証後のみ実施する。
- 更新対象を明示する。
- 更新結果を記録する。
- 必要に応じてEvent Logへ記録する。

---

## 9.2 更新対象

|設定|更新主体|
|---|---|
|system_config|Google Apps Script|
|source_config|Google Apps Script|
|Script Properties|管理者|

ESP32 は設定更新を行わない。

---

# 10. 設定反映

設定変更後の反映方法を定義する。

---

## 基本方針

- Spreadsheet を正式情報とする。
- ESP32 は次回取得時に反映する。
- Secret 情報は外部へ通知しない。
- 変更反映時に必要なログを出力する。

---

# 11. 設定整合性

設定の整合性維持を目的として以下を適用する。

---

## 基本方針

- 必須項目を定義する。
- 不正値を拒否する。
- 型を検証する。
- 重複設定を避ける。
- 未定義キーを適切に扱う。

検証ロジックの詳細は実装を正式情報とする。

---

# 12. 設計方針

設定管理は以下を設計原則とする。

---

## 単一責務

- system_config はシステム設定のみ管理する。
- source_config は取得元設定のみ管理する。
- Script Properties は Secret のみ管理する。

---

## Single Source of Truth

|情報|正式管理|
|---|---|
|システム設定|system_config|
|取得元設定|source_config|
|Secret情報|Script Properties|

同一情報を複数箇所で保持しない。

---

## 保守性

- 設定追加を容易にする。
- 後方互換性を維持する。
- キー名称を統一する。
- 設定変更履歴を追跡可能とする。

---

## 拡張性

将来的な設定項目追加に対応できる構成を維持する。

---

# 13. 制約事項

本章では設定管理設計における制約事項を定義する。

本書では設定管理アーキテクチャを対象とし、設定値そのものや実装コードは対象外とする。

---

## 13.1 本書で定義しない事項

|項目|管理文書|
|---|---|
|設定値一覧|14_SPREADSHEET_SCHEMA.md|
|Spreadsheet構造|14_SPREADSHEET_SCHEMA.md|
|Configuration API実装|06_GAS_API_SPEC.md|
|設定読込コード|GAS実装コード|
|ESP32内部実装|ESP32 Firmware|

---

## 13.2 設計制約

以下を設計制約とする。

- Spreadsheet を設定情報の正式管理先とする。
- Script Properties は Secret 情報専用とする。
- ESP32 は設定を直接更新しない。
- Secret を Spreadsheet に保存しない。
- 設定取得は Configuration API を経由する。

---

# 14. 将来拡張

本章では将来的に追加を検討する設定管理機能を示す。

本章は構想であり、実装を保証するものではない。

---

## 14.1 設定機能

|項目|STATUS|備考|
|---|---|---|
|設定履歴管理|PROPOSED|詳細未定|
|設定比較機能|PROPOSED|詳細未定|
|設定バックアップ|PROPOSED|詳細未定|
|設定エクスポート|PROPOSED|詳細未定|
|設定インポート|PROPOSED|詳細未定|

---

## 14.2 保守支援

将来的に以下を検討する。

- 設定診断
- 設定整合性チェック
- 自動移行支援
- 設定変更レポート

詳細仕様は今後決定する。

---

# 15. 未定義事項

本書では以下を定義しない。

|項目|状態|
|---|---|
|設定バージョン管理|今後決定|
|設定移行方式|今後決定|
|設定履歴保持期間|今後決定|
|ロールバック方式|今後決定|
|複数環境管理|今後決定|

---

# CHANGE LOG

|日付|内容|
|---|---|
|2026-07-15|vNext 1.3文書体系に合わせ全面刷新。設定管理文書として再設計し、README・CURRENT_STATUS・ROADMAP・02_SOFTWARE_OVERVIEW・06_GAS_API_SPEC・11_SECURITY_MANAGEMENT・13_GAS_OPERATION_POLICY・14_SPREADSHEET_SCHEMAとの責務を明確化。Single Source of Truthに基づき、設定管理・Secret管理・Configuration API・更新方針を整理し、STATUS表記・文書構成を共通規約へ統一。|
|2026-07-14|Configuration APIおよびSpreadsheet設定構成を更新。|
|2026-07-13|Script Properties運用方針を整理。|

---

# 付録A. 関連文書の責務

|文書|責務|
|---|---|
|README.md|プロジェクト概要・入口|
|CURRENT_STATUS.md|現在の開発状況|
|ROADMAP.md|中長期計画|
|02_SOFTWARE_OVERVIEW.md|ソフトウェア全体構成|
|06_GAS_API_SPEC.md|Configuration API仕様|
|11_SECURITY_MANAGEMENT.md|Secret管理・認証|
|12_CONFIGURATION_MANAGEMENT.md|設定管理（本書）|
|13_GAS_OPERATION_POLICY.md|設定運用|
|14_SPREADSHEET_SCHEMA.md|設定データ構造|

---

# 付録B. 更新ルール

本書は以下の場合に更新する。

- 設定体系変更
- Configuration API変更
- Secret管理変更
- Spreadsheet構造変更
- 設定運用変更
- 文書体系変更

日常的な設定値変更は記載しない。

現在の開発状況は **CURRENT_STATUS.md** を正式情報とする。

---

# 自己査読チェックリスト

- [x] 文書内矛盾なし
- [x] READMEとの責務分離
- [x] CURRENT_STATUSとの責務分離
- [x] ROADMAPとの責務分離
- [x] 00_PROJECT_CONVENTIONSとの整合
- [x] 02_SOFTWARE_OVERVIEWとの責務分離
- [x] 06_GAS_API_SPECとの責務分離
- [x] 11_SECURITY_MANAGEMENTとの責務分離
- [x] 13_GAS_OPERATION_POLICYとの責務分離
- [x] 14_SPREADSHEET_SCHEMAとの責務分離
- [x] STATUS表記統一
- [x] Single Source of Truth維持
- [x] GitHub表示崩れなし
- [x] vNext 1.3文書体系へ適合