# 10 Calendar & Poem Subsystem

**タイトル**  
10 Calendar & Poem Subsystem

**最終更新**  
2026-07-15

**文書版**  
vNext 1.3

**STATUS**  
FINALIZED

**責務**  
本書は digital-kakejiku における暦生成、AI詩生成および両者の連携サブシステムを定義する正式設計書である。

**Single Source**  
本書は暦生成およびAI詩生成サブシステムを管理する唯一の文書である。

暦データ生成、詩生成フロー、キャッシュ利用およびサブシステム構成は本書を正式情報とし、他文書では重複管理しない。

---

# 対象読者

- GAS開発者
- ESP32開発者
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

- docs/02_SOFTWARE_OVERVIEW.md
- docs/06_GAS_API_SPEC.md
- docs/13_GAS_OPERATION_POLICY.md
- docs/14_SPREADSHEET_SCHEMA.md
- docs/18_GAS_RETRY_STRATEGY.md
- docs/19_GEMINI_PROMPT_SPECIFICATION.md

## 後続

- GAS実装
- Calendar生成
- Poem生成
- システム統合試験

---

# 1. 文書の目的

本書は暦生成およびAI詩生成サブシステムを定義する。

本書では以下を管理する。

- 暦サブシステム
- AI詩生成サブシステム
- データフロー
- キャッシュ利用
- 更新タイミング
- サブシステム責務

生成アルゴリズムやPrompt内容の詳細は管理しない。

---

# 2. サブシステム構成

```text
Calendar Source
       │
       ▼
Calendar Manager
       │
       ▼
calendar_master
       │
       ├──────────────┐
       ▼              ▼
Observation      system_config
       │              │
       └──────┬───────┘
              ▼
       Poem Manager
              │
              ▼
         Gemini API
              │
              ▼
         poem_cache
              │
              ▼
            ESP32
```

---

# 3. 基本設計方針

本システムでは以下を基本方針とする。

- 暦生成と詩生成を分離する。
- Calendarを正式情報とする。
- 詩はキャッシュを利用する。
- Geminiは必要時のみ呼び出す。
- Single Source of Truth を維持する。
- ESP32は生成処理を担当しない。

---

# 4. サブシステム一覧

|サブシステム|責務|STATUS|
|---|---|---|
|Calendar Manager|暦生成|CONFIRMED|
|Poem Manager|詩生成|CONFIRMED|
|Poem Cache|生成結果保持|CONFIRMED|
|Gemini API|AI生成|CONFIRMED|

---

# 5. Calendar Manager

Calendar Manager は暦情報を生成・更新・管理する。

---

## 5.1 責務

- 暦データ生成
- Calendar更新
- Calendar取得
- Calendar整合性維持

---

## 5.2 入力

|入力|提供元|
|---|---|
|system_config|Spreadsheet|
|source_config|Spreadsheet|
|外部暦情報|各データソース|

---

## 5.3 出力

|出力|保存先|
|---|---|
|calendar_master|Google Spreadsheet|

calendar_master の構造は **14_SPREADSHEET_SCHEMA.md** を正式情報とする。

---

# 6. Poem Manager

Poem Manager はAI詩生成全体を管理する。

---

## 6.1 責務

- キャッシュ確認
- Prompt生成
- Gemini呼出し
- poem_cache更新

---

## 6.2 入力

|入力|提供元|
|---|---|
|Observation|Observation Log|
|calendar_master|Spreadsheet|
|system_config|Spreadsheet|

Prompt構成は **19_GEMINI_PROMPT_SPECIFICATION.md** を正式情報とする。

---

## 6.3 出力

|出力|保存先|
|---|---|
|AI生成詩|poem_cache|

---

# 7. Calendar更新

Calendar はGoogle Apps Script により管理する。

---

## 基本方針

- 年単位で管理する。
- 必要時のみ更新する。
- Spreadsheet を正式情報とする。

---

## 更新タイミング

|処理|STATUS|
|---|---|
|初期生成|CONFIRMED|
|翌年生成|CONFIRMED|
|手動再生成|CONFIRMED|

詳細な運用は **13_GAS_OPERATION_POLICY.md** を正式情報とする。

---

# 8. Poem生成

Poem生成は必要時のみ実施する。

---

## 基本方針

- poem_cache を優先する。
- キャッシュが無い場合のみGeminiを利用する。
- 同一日の再生成は明示的操作時のみ行う。

---

## 更新タイミング

|処理|STATUS|
|---|---|
|定期生成|CONFIRMED|
|手動再生成|CONFIRMED|
|Retry生成|CONFIRMED|

Retry仕様は **18_GAS_RETRY_STRATEGY.md** を正式情報とする。

---

# 9. データフロー

本章では、Calendar サブシステムと Poem サブシステムのデータフローを定義する。

---

## 9.1 Calendarフロー

```text
External Calendar Sources
            │
            ▼
     Calendar Manager
            │
            ▼
     calendar_master
```

Calendar Manager は外部データソースから暦情報を取得し、正規化したうえで `calendar_master` を更新する。

---

## 9.2 Poemフロー

```text
Observation
      │
calendar_master
      │
system_config
      │
      ▼
 Prompt Builder
      │
      ▼
 Gemini API
      │
      ▼
 poem_cache
      │
      ▼
    ESP32
```

ESP32 は生成済みデータのみ取得し、詩生成処理は実施しない。

---

# 10. キャッシュ管理

AI生成結果は `poem_cache` に保存する。

---

## 10.1 基本方針

- 同一日の生成結果を再利用する。
- キャッシュを正式な配信元とする。
- Gemini API の不要な呼出しを防止する。
- ESP32 はキャッシュ内容のみ取得する。

---

## 10.2 キャッシュ更新

|処理|STATUS|
|---|---|
|初回生成|CONFIRMED|
|再生成|CONFIRMED|
|Retry生成|CONFIRMED|

保持期間および削除ポリシーは今後決定する。

---

# 11. データソース

各サブシステムが利用する正式なデータソースを示す。

|情報|正式管理|
|---|---|
|Calendar|calendar_master|
|Observation|observation_log|
|設定|system_config|
|取得元設定|source_config|
|AI生成詩|poem_cache|

Single Source of Truth に基づき、同一情報を複数箇所で管理しない。

---

# 12. 設計方針

本サブシステムでは以下を設計原則とする。

---

## 単一責務

- Calendar Manager は暦生成のみ担当する。
- Poem Manager は詩生成のみ担当する。
- Gemini API は生成処理のみ担当する。

---

## Single Source of Truth

- Calendar は `calendar_master`
- 詩は `poem_cache`
- 設定は `system_config`

を正式情報とする。

---

## 保守性

- Calendar と Poem を独立実装する。
- Prompt を外部管理する。
- データソースを集中管理する。

---

## 拡張性

将来的なデータソース追加やAIモデル変更に対応できる構成を維持する。

---

# 13. 制約事項

本章では Calendar サブシステムおよび Poem サブシステム設計における制約事項を定義する。

本書ではサブシステム全体の責務を対象とし、生成アルゴリズムやAIプロンプト内容の詳細は対象外とする。

---

## 13.1 本書で定義しない事項

|項目|管理文書|
|---|---|
|Gemini Prompt本文|19_GEMINI_PROMPT_SPECIFICATION.md|
|API仕様|06_GAS_API_SPEC.md|
|Spreadsheet構造|14_SPREADSHEET_SCHEMA.md|
|Retryアルゴリズム|18_GAS_RETRY_STRATEGY.md|
|GAS実装コード|ソースコード|

---

## 13.2 設計制約

以下を設計制約とする。

- Calendar生成は Google Apps Script が担当する。
- ESP32 は Calendar を生成しない。
- ESP32 は AI 詩を生成しない。
- AI生成結果は `poem_cache` を正式情報とする。
- 外部データソースは `source_config` により管理する。

---

# 14. 将来拡張

本章では将来的に追加を検討する機能を示す。

本章は構想であり、実装を保証するものではない。

---

## 14.1 Calendar拡張

|項目|STATUS|備考|
|---|---|---|
|暦データソース追加|PROPOSED|詳細未定|
|地域別暦対応|PROPOSED|詳細未定|
|独自イベント対応|PROPOSED|詳細未定|
|祝日管理拡張|PROPOSED|詳細未定|

---

## 14.2 Poem拡張

|項目|STATUS|備考|
|---|---|---|
|AIモデル切替|PROPOSED|詳細未定|
|複数詩スタイル|PROPOSED|詳細未定|
|季節別生成ルール|PROPOSED|詳細未定|
|生成品質評価|PROPOSED|詳細未定|

---

# 15. 未定義事項

本書では以下を定義しない。

|項目|状態|
|---|---|
|Prompt最適化方式|今後決定|
|AIモデル切替条件|今後決定|
|poem_cache保持期間|今後決定|
|Calendar再生成条件|今後決定|
|AI品質評価方法|今後決定|

---

# CHANGE LOG

|日付|内容|
|---|---|
|2026-07-15|vNext 1.3文書体系に合わせ全面刷新。Calendar・Poemサブシステム設計文書として再設計し、README・CURRENT_STATUS・ROADMAP・02_SOFTWARE_OVERVIEW・06_GAS_API_SPEC・13_GAS_OPERATION_POLICY・14_SPREADSHEET_SCHEMA・18_GAS_RETRY_STRATEGY・19_GEMINI_PROMPT_SPECIFICATIONとの責務を明確化。Single Source of Truthに基づき、暦生成・AI詩生成・キャッシュ管理・データフローを整理し、STATUS表記・文書構成を共通規約へ統一。|
|2026-07-14|Calendar生成およびPoem生成フローを更新。|
|2026-07-13|Poem Cache運用方針を整理。|

---

# 付録A. 関連文書の責務

|文書|責務|
|---|---|
|README.md|プロジェクト概要・入口|
|CURRENT_STATUS.md|現在の開発状況|
|ROADMAP.md|中長期計画|
|02_SOFTWARE_OVERVIEW.md|ソフトウェア全体構成|
|06_GAS_API_SPEC.md|API仕様|
|10_CALENDAR_POEM_SUBSYSTEM.md|Calendar・Poemサブシステム（本書）|
|13_GAS_OPERATION_POLICY.md|運用・生成スケジュール|
|14_SPREADSHEET_SCHEMA.md|データ構造|
|18_GAS_RETRY_STRATEGY.md|Retry仕様|
|19_GEMINI_PROMPT_SPECIFICATION.md|AI生成仕様|

---

# 付録B. 更新ルール

本書は以下の場合に更新する。

- Calendar生成方式変更
- Poem生成方式変更
- キャッシュ管理変更
- データソース変更
- AIモデル変更
- 文書体系変更

日常的な生成結果や運用実績は記載しない。

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
- [x] 13_GAS_OPERATION_POLICYとの責務分離
- [x] 14_SPREADSHEET_SCHEMAとの責務分離
- [x] 18_GAS_RETRY_STRATEGYとの責務分離
- [x] 19_GEMINI_PROMPT_SPECIFICATIONとの責務分離
- [x] STATUS表記統一
- [x] Single Source of Truth維持
- [x] GitHub表示崩れなし
- [x] vNext 1.3文書体系へ適合