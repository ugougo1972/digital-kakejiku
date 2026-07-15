# 14 Spreadsheet Schema

**タイトル**  
14 Spreadsheet Schema

**最終更新**  
2026-07-15

**文書版**  
vNext 1.3

**STATUS**  
FINALIZED

**責務**  
本書は digital-kakejiku における Google Spreadsheet のデータ構造、シート構成、データ保持方針およびスキーマを定義する正式設計書である。

**Single Source**  
本書は Spreadsheet データ構造を管理する唯一の文書である。

シート構成、カラム定義、主キー、保持ルールおよびデータ責務は本書を正式情報とし、他文書では重複管理しない。

---

# 対象読者

- GAS開発者
- システム設計者
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

- docs/03_LOG_FORMAT.md
- docs/06_GAS_API_SPEC.md
- docs/10_CALENDAR_POEM_SUBSYSTEM.md
- docs/12_CONFIGURATION_MANAGEMENT.md
- docs/13_GAS_OPERATION_POLICY.md

## 後続

- Spreadsheet構築
- GAS実装
- システム統合試験

---

# 1. 文書の目的

本書は Google Spreadsheet のデータ構造を定義する。

本書では以下を管理する。

- シート一覧
- シート責務
- カラム構成
- 主キー
- データ保持方針
- データ整合性

実装コードやGASロジックは本書では管理しない。

---

# 2. 設計方針

本システムでは以下を基本方針とする。

- Spreadsheet を Single Source of Truth とする。
- シートごとに責務を分離する。
- 主キーを明確に定義する。
- データ重複を禁止する。
- Secret 情報は Spreadsheet に保存しない。
- 保守性および拡張性を優先する。

---

# 3. Spreadsheet構成

```text
Google Spreadsheet
│
├── observation_log
├── event_log
├── error_log
├── system_log
├── system_config
├── source_config
├── calendar_master
├── poem_cache
├── solar_term_master
└── season_dictionary
```

---

# 4. シート一覧

|シート|責務|STATUS|
|---|---|---|
|observation_log|観測データ保存|CONFIRMED|
|event_log|イベント記録|CONFIRMED|
|error_log|エラー記録|CONFIRMED|
|system_log|システムログ|CONFIRMED|
|system_config|システム設定|CONFIRMED|
|source_config|取得元設定|CONFIRMED|
|calendar_master|暦情報|CONFIRMED|
|poem_cache|AI詩キャッシュ|CONFIRMED|
|solar_term_master|二十四節気マスター|CONFIRMED|
|season_dictionary|七十二候辞書|CONFIRMED|

---

# 5. observation_log

`observation_log` はセンサー観測結果を保存する。

---

## 5.1 責務

- 観測データ保存
- 長期履歴管理
- AI生成入力
- 統計処理基礎データ

---

## 5.2 主キー

|項目|内容|
|---|---|
|Primary Key|未定義|

主キー構成は実装と整合するよう管理する。

---

## 5.3 基本方針

- 観測結果は追記方式とする。
- 更新ではなく追加を基本とする。
- 既存データを上書きしない。

---

# 6. event_log

`event_log` はシステムイベントを記録する。

---

## 責務

- 設定変更
- 保守操作
- 手動実行
- 管理イベント

---

## 基本方針

- 重要イベントのみ保存する。
- Secret情報を保存しない。
- Event Log を正式履歴とする。

---

# 7. error_log

`error_log` は障害情報を保存する。

---

## 責務

- エラー内容
- 例外内容
- Retry結果
- 障害解析

---

## 基本方針

- Secretを保存しない。
- API Keyを保存しない。
- POST本文を保存しない。
- 障害解析に必要な情報のみ保存する。

---

# 8. system_log

`system_log` はシステム運用情報を保存する。

---

## 責務

- 起動
- 終了
- ジョブ開始
- ジョブ終了
- Retry開始
- Retry成功

---

## 基本方針

- システム状態を時系列で保存する。
- Error Logとは責務を分離する。
- Secret情報を保存しない。

---

# 9. system_config

`system_config` はシステム設定を管理する。

---

## 責務

- Gemini設定
- Retry設定
- 表示設定
- システム設定

---

## 基本方針

- key を一意キーとする。
- 同一keyの重複を禁止する。
- Secret情報を保存しない。

---

# 10. source_config

`source_config` はデータ取得元設定を管理する。

---

## 責務

- URL管理
- 有効／無効管理
- 優先順位管理

---

## 基本方針

- key を一意キーとする。
- GASのみが利用する。
- ESP32は直接利用しない。

---

# 11. calendar_master

`calendar_master` はシステム全体で利用する正式な暦情報を管理する。

---

## 11.1 責務

- 日付情報管理
- 二十四節気管理
- 七十二候管理
- 祝日管理
- 六曜管理
- 月齢管理
- 干支管理

---

## 11.2 主キー

|項目|内容|
|---|---|
|Primary Key|date|

`date` は一意でなければならない。

---

## 11.3 基本方針

- Calendar の正式情報とする。
- 年単位で管理する。
- 同一日付を重複登録しない。
- Poem生成は本シートを参照する。

保持期間は以下を基本とする。

- 過去5年
- 当年
- 翌年

---

# 12. poem_cache

`poem_cache` はAI生成結果を保持する。

---

## 12.1 責務

- AI生成詩保存
- 再利用
- 再生成管理

---

## 12.2 主キー

|項目|内容|
|---|---|
|Primary Key|date|

同一日付に対し有効な生成結果は1件とする。

---

## 12.3 基本方針

- Gemini生成結果を保持する。
- ESP32は本シートのみ参照する。
- キャッシュ優先運用とする。

保持期間は今後決定する。

---

# 13. solar_term_master

`solar_term_master` は二十四節気マスターを管理する。

---

## 責務

- 二十四節気名称
- 表示順
- 補助情報

---

## 基本方針

- マスターデータとして管理する。
- 必要時のみ更新する。
- Calendar生成で利用する。

---

# 14. season_dictionary

`season_dictionary` は七十二候辞書を管理する。

---

## 責務

- 七十二候名称
- 読み
- 表示情報
- 補助情報

---

## 基本方針

- 辞書データとして利用する。
- Poem生成で参照する。
- GASのみ更新する。

---

# 15. データ整合性

Spreadsheet全体で以下を適用する。

---

## 基本方針

- 主キー重複を禁止する。
- 必須項目を管理する。
- 型整合性を維持する。
- Secretを保存しない。
- データ責務を重複させない。

---

## データ責務

|情報|正式管理|
|---|---|
|Calendar|calendar_master|
|AI詩|poem_cache|
|設定|system_config|
|取得元|source_config|
|Secret|Script Properties|

---

# 16. データ保持方針

各シートの保持方針を以下に示す。

|シート|保持方針|
|---|---|
|observation_log|追記|
|event_log|追記|
|error_log|追記|
|system_log|追記|
|system_config|更新|
|source_config|更新|
|calendar_master|更新|
|poem_cache|更新|
|solar_term_master|更新|
|season_dictionary|更新|

削除ポリシーは今後決定する。

---

# 17. 設計方針

Spreadsheet設計は以下を設計原則とする。

---

## 単一責務

各シートは一つの責務のみを持つ。

---

## Single Source of Truth

各情報は一箇所のみで管理する。

---

## 保守性

- シート追加を容易にする。
- カラム追加を容易にする。
- 主キーを維持する。
- データ重複を防止する。

---

## 拡張性

将来的なシート追加および項目追加へ対応できる構成を維持する。

---

# 18. 制約事項

本章では Spreadsheet 設計における制約事項を定義する。

本書では Spreadsheet の論理構造を対象とし、Google Spreadsheet の実装仕様や GAS コードは対象外とする。

---

## 18.1 本書で定義しない事項

|項目|管理文書|
|---|---|
|GAS実装コード|GASソースコード|
|Configuration API|06_GAS_API_SPEC.md|
|設定運用|12_CONFIGURATION_MANAGEMENT.md|
|ログ形式|03_LOG_FORMAT.md|
|AI Prompt|19_GEMINI_PROMPT_SPECIFICATION.md|

---

## 18.2 設計制約

以下を設計制約とする。

- Spreadsheet を正式なデータストアとする。
- Secret 情報は保存しない。
- 主キーを維持する。
- データ重複を禁止する。
- シート責務を重複させない。

---

# 19. 将来拡張

本章では将来的に追加を検討するデータ管理機能を示す。

本章は構想であり、実装を保証するものではない。

---

## 19.1 シート追加候補

|シート|STATUS|備考|
|---|---|---|
|statistics_cache|PROPOSED|統計情報|
|diagnostic_log|PROPOSED|診断結果|
|maintenance_history|PROPOSED|保守履歴|
|system_backup|PROPOSED|バックアップ管理|

---

## 19.2 データ管理拡張

将来的に以下を検討する。

- アーカイブ管理
- 自動バックアップ
- データ世代管理
- データ整合性診断

詳細仕様は今後決定する。

---

# 20. 未定義事項

|項目|状態|
|---|---|
|ログ保持期間|今後決定|
|poem_cache保持期間|今後決定|
|自動削除ポリシー|今後決定|
|バックアップ方式|今後決定|
|アーカイブ方式|今後決定|

---

# CHANGE LOG

|日付|内容|
|---|---|
|2026-07-15|vNext 1.3文書体系に合わせ全面刷新。Spreadsheet設計文書として再設計し、README・CURRENT_STATUS・ROADMAP・03_LOG_FORMAT・06_GAS_API_SPEC・10_CALENDAR_POEM_SUBSYSTEM・12_CONFIGURATION_MANAGEMENT・13_GAS_OPERATION_POLICYとの責務を明確化。Single Source of Truthに基づき、シート責務・主キー・保持方針・データ整合性を整理し、STATUS表記・文書構成を共通規約へ統一。|
|2026-07-14|Calendar・Poem・Configuration関連シート構成を更新。|
|2026-07-13|Spreadsheet構成を整理。|

---

# 付録A. 関連文書の責務

|文書|責務|
|---|---|
|README.md|プロジェクト概要・入口|
|CURRENT_STATUS.md|現在の開発状況|
|ROADMAP.md|中長期計画|
|03_LOG_FORMAT.md|ログ構造|
|06_GAS_API_SPEC.md|API仕様|
|10_CALENDAR_POEM_SUBSYSTEM.md|Calendar・Poemサブシステム|
|12_CONFIGURATION_MANAGEMENT.md|設定管理|
|13_GAS_OPERATION_POLICY.md|GAS運用|
|14_SPREADSHEET_SCHEMA.md|Spreadsheet構造（本書）|

---

# 付録B. 更新ルール

本書は以下の場合に更新する。

- シート追加・削除
- 主キー変更
- カラム構成変更
- 保持方針変更
- データ責務変更
- 文書体系変更

日常的なデータ内容の変更は記載しない。

現在のデータ内容および運用状況は **CURRENT_STATUS.md** を正式情報とする。

---

# 自己査読チェックリスト

- [x] 文書内矛盾なし
- [x] READMEとの責務分離
- [x] CURRENT_STATUSとの責務分離
- [x] ROADMAPとの責務分離
- [x] 00_PROJECT_CONVENTIONSとの整合
- [x] 03_LOG_FORMATとの責務分離
- [x] 06_GAS_API_SPECとの責務分離
- [x] 10_CALENDAR_POEM_SUBSYSTEMとの責務分離
- [x] 12_CONFIGURATION_MANAGEMENTとの責務分離
- [x] 13_GAS_OPERATION_POLICYとの責務分離
- [x] STATUS表記統一
- [x] Single Source of Truth維持
- [x] Secret情報非保存方針を反映
- [x] GitHub表示崩れなし
- [x] vNext 1.3文書体系へ適合