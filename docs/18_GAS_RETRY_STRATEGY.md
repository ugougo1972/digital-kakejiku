# 18 GAS Retry Strategy

**タイトル**  
18 GAS Retry Strategy

**最終更新**  
2026-07-15

**文書版**  
vNext 1.3

**STATUS**  
FINALIZED

**責務**  
本書は Google Apps Script における Retry 制御、障害分類、待機時間、終了条件および共通 Retry ポリシーを定義する正式設計書である。

**Single Source**  
本書は Retry 制御仕様を管理する唯一の文書である。

Retry 判定、待機時間、Retry 回数、終了条件および障害分類は本書を正式情報とし、他文書では重複管理しない。

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

- docs/06_GAS_API_SPEC.md
- docs/10_CALENDAR_POEM_SUBSYSTEM.md
- docs/13_GAS_OPERATION_POLICY.md
- docs/15_GAS_IMPLEMENTATION_GUIDE.md
- docs/17_TROUBLESHOOTING.md

## 後続

- GAS実装
- システム運用
- 障害解析

---

# 1. 文書の目的

本書は Google Apps Script 全体で利用する Retry 制御仕様を定義する。

本書では以下を管理する。

- Retry方針
- 障害分類
- Retry判定
- 待機時間
- Retry終了条件
- 共通Retryルール

Retry を利用する各ジョブの実装方法は本書では管理しない。

---

# 2. Retry設計方針

本システムでは以下を基本方針とする。

- Retry対象を明確に分類する。
- 無限Retryを禁止する。
- 待機時間は設定値で管理する。
- Retry結果をログへ記録する。
- 共通Retry処理を利用する。
- Single Source of Truth を維持する。

---

# 3. Retry対象

|対象|STATUS|
|---|---|
|Calendar Job|CONFIRMED|
|Poem Job|CONFIRMED|
|API通信|CONFIRMED|
|外部データ取得|CONFIRMED|
|Gemini API|CONFIRMED|

---

# 4. Retry全体構成

```text
処理開始
    │
    ▼
処理実行
    │
    ▼
成功？
 ┌──┴──┐
 │     │
YES    NO
 │      │
 ▼      ▼
終了  Retry判定
         │
         ▼
 Retry対象？
 ┌──┴──┐
 │     │
NO    YES
 │      │
 ▼      ▼
終了  待機
         │
         ▼
再実行
```

---

# 5. Retry判定

Retry の可否は障害分類に基づいて決定する。

---

## 5.1 基本方針

- 一時障害のみ Retry 対象とする。
- 恒久障害は Retry を実施しない。
- Retry 判定は共通処理で実施する。
- 判定結果を必要に応じて System Log へ記録する。

---

## 5.2 Retry対象

|障害|Retry|STATUS|
|---|---|---|
|通信タイムアウト|YES|CONFIRMED|
|Gemini一時障害|YES|CONFIRMED|
|Spreadsheet一時障害|YES|CONFIRMED|
|一時ネットワーク障害|YES|CONFIRMED|

---

## 5.3 Retry対象外

|障害|Retry|STATUS|
|---|---|---|
|認証失敗|NO|CONFIRMED|
|Secret設定不足|NO|CONFIRMED|
|設定値異常|NO|CONFIRMED|
|必須データ欠損|NO|CONFIRMED|
|プログラム不整合|NO|CONFIRMED|

---

# 6. Retry回数

Retry 回数は `system_config` により管理する。

---

## 基本方針

- 最大回数を設定値で管理する。
- 無限 Retry を禁止する。
- 初回実行は Retry 回数へ含めない。
- 最大回数到達後は終了する。

---

## 現在採用値

|項目|値|STATUS|
|---|---:|---|
|最大Retry回数|3|CONFIRMED|

---

# 7. 待機時間

Retry の待機時間は設定値から取得する。

---

## 基本方針

- 固定値をハードコードしない。
- 障害分類ごとに待機時間を変更可能とする。
- 設定値は `system_config` を正式情報とする。

---

## 管理項目

代表的な管理項目を以下に示す。

|設定キー|用途|
|---|---|
|retry_base_wait_temporary_sec|一時障害の初期待機時間|
|retry_max_wait_temporary_sec|一時障害の最大待機時間|
|retry_base_wait_unknown_sec|未知障害の初期待機時間|
|retry_max_wait_unknown_sec|未知障害の最大待機時間|

設定値の定義は **14_SPREADSHEET_SCHEMA.md** を正式情報とする。

---

# 8. Retry終了条件

Retry は以下の条件で終了する。

---

## 終了条件

- 正常終了
- 最大 Retry 回数到達
- Retry 対象外と判定
- 必須データ欠損
- 認証異常
- 保守者による停止

---

## 基本方針

- 終了理由を記録する。
- Error Log または System Log へ必要な情報を保存する。
- Retry 終了後は次回定期実行または手動実行を待つ。

---

# 9. 障害分類

Retry 判定では障害を分類する。

|分類|Retry|例|
|---|---|---|
|Temporary|YES|通信タイムアウト|
|Unknown|YES|原因不明の一時障害|
|Permanent|NO|設定不備|
|Authentication|NO|認証失敗|
|Configuration|NO|設定値異常|

障害分類の詳細は **17_TROUBLESHOOTING.md** を正式情報とする。

---

# 10. Retryフロー

```text
処理開始
     │
     ▼
処理実行
     │
     ▼
正常？
 ┌──┴──┐
 │     │
YES    NO
 │      │
 ▼      ▼
終了  Retry判定
          │
          ▼
 Retry対象？
 ┌──┴──┐
 │     │
NO    YES
 │      │
 ▼      ▼
終了   Wait
          │
          ▼
      Retry実行
```

Retry ロジックはすべて共通 Retry Manager を経由する。

---

# 11. Retryログ

Retry の開始から終了までの処理はログへ記録する。

---

## 11.1 記録内容

以下を必要に応じて記録する。

- ジョブ名
- Retry対象
- Retry回数
- 待機時間
- 判定結果
- 終了理由
- 実行日時

---

## 11.2 記録先

|内容|保存先|
|---|---|
|Retry開始|System Log|
|Retry成功|System Log|
|Retry終了|System Log|
|最終失敗|Error Log|

ログ仕様は **03_LOG_FORMAT.md** を正式情報とする。

---

# 12. Calendar Job Retry

Calendar Job の Retry 運用を定義する。

---

## 基本方針

- 一時障害のみ Retry を実施する。
- 外部データ取得失敗時は Retry を実施する。
- Calendar 更新中の障害は整合性を維持する。
- 部分更新状態を正式情報としない。

---

## Retry対象例

|障害|Retry|
|---|---|
|通信タイムアウト|YES|
|Spreadsheet一時障害|YES|
|外部取得失敗|YES|
|設定異常|NO|

---

# 13. Poem Job Retry

Poem Job の Retry 運用を定義する。

---

## 基本方針

- Gemini 一時障害は Retry を実施する。
- `poem_cache` を破壊しない。
- 生成済みデータを優先利用する。
- Retry 成功時のみ更新する。

---

## Retry対象例

|障害|Retry|
|---|---|
|Gemini一時障害|YES|
|通信障害|YES|
|認証失敗|NO|
|Prompt異常|NO|

Prompt仕様は **19_GEMINI_PROMPT_SPECIFICATION.md** を正式情報とする。

---

# 14. API Retry

API 通信時の Retry 方針を定義する。

---

## 基本方針

- API利用側で無限Retryを行わない。
- 一時通信障害のみRetry対象とする。
- 認証失敗はRetryしない。
- API応答内容によりRetry可否を判定する。

API仕様は **06_GAS_API_SPEC.md** を正式情報とする。

---

# 15. Retry実装方針

Retry は共通 Retry Manager に集約する。

---

## 基本方針

- Retry ロジックを各モジュールへ重複実装しない。
- Retry 判定を共通化する。
- 待機時間取得を共通化する。
- Logger を共通利用する。
- Configuration Manager から設定値を取得する。

---

# 16. 設計方針

Retry設計は以下を原則とする。

---

## 単一責務

- Retry判定
- 待機時間取得
- Retry実行
- Retry終了判定

を明確に分離する。

---

## Single Source of Truth

|情報|正式管理|
|---|---|
|Retry仕様|本書|
|設定値|system_config|
|ログ仕様|03_LOG_FORMAT.md|

---

## 保守性

- Retry処理を共通化する。
- 設定変更のみで待機時間を変更できる。
- Retry対象追加を容易にする。

---

## 拡張性

将来的な新規ジョブ追加に対応できる共通Retry基盤を維持する。

---

# 17. 制約事項

本書では Retry 制御方針を定義する。

以下は対象外とする。

|項目|管理文書|
|---|---|
|API仕様|06_GAS_API_SPEC.md|
|運用ポリシー|13_GAS_OPERATION_POLICY.md|
|実装コード|15_GAS_IMPLEMENTATION_GUIDE.md|
|障害対応|17_TROUBLESHOOTING.md|
|Prompt仕様|19_GEMINI_PROMPT_SPECIFICATION.md|

---

# 18. 将来拡張

本章では将来的な Retry 機能拡張を示す。

---

## 18.1 拡張候補

|項目|STATUS|備考|
|---|---|---|
|指数バックオフ高度化|PROPOSED|詳細未定|
|ジッター追加|PROPOSED|詳細未定|
|障害別Retry戦略|PROPOSED|詳細未定|
|Retry統計分析|PROPOSED|詳細未定|
|自動通知|PROPOSED|詳細未定|

---

## 18.2 保守支援

将来的に以下を検討する。

- Retry履歴分析
- Retry成功率可視化
- Retry診断
- Retry設定最適化

詳細仕様は今後決定する。

---

# 19. 未定義事項

|項目|状態|
|---|---|
|指数バックオフ詳細|今後決定|
|ジッター方式|今後決定|
|障害分類追加|今後決定|
|Retry統計保持期間|今後決定|
|通知方式|今後決定|

---

# CHANGE LOG

|日付|内容|
|---|---|
|2026-07-15|vNext 1.3文書体系に合わせ全面刷新。Retry制御文書として再設計し、README・CURRENT_STATUS・ROADMAP・06_GAS_API_SPEC・13_GAS_OPERATION_POLICY・15_GAS_IMPLEMENTATION_GUIDE・17_TROUBLESHOOTINGとの責務を明確化。Single Source of Truthに基づき、Retry判定・障害分類・待機時間・共通Retry処理を整理し、STATUS・RESULT表記および文書構成を共通規約へ統一。|
|2026-07-14|Calendar Job・Poem Jobの30分間隔・最大3回Retry方針を反映。|
|2026-06-21|Phase1 Retry設計を反映。|

---

# 付録A. 関連文書の責務

|文書|責務|
|---|---|
|README.md|プロジェクト概要・入口|
|CURRENT_STATUS.md|現在の運用状況|
|ROADMAP.md|中長期計画|
|06_GAS_API_SPEC.md|API仕様|
|13_GAS_OPERATION_POLICY.md|運用方針|
|15_GAS_IMPLEMENTATION_GUIDE.md|実装ガイド|
|17_TROUBLESHOOTING.md|障害対応|
|18_GAS_RETRY_STRATEGY.md|Retry仕様（本書）|
|19_GEMINI_PROMPT_SPECIFICATION.md|Prompt仕様|

---

# 付録B. 更新ルール

本書は以下の場合に更新する。

- Retry対象変更
- Retry回数変更
- 待機時間変更
- 障害分類変更
- 共通Retry方式変更
- 文書体系変更

日常的なRetry実績は記載しない。

現在の運用状況は **CURRENT_STATUS.md** を正式情報とする。

---

# 自己査読チェックリスト

- [x] 文書内矛盾なし
- [x] READMEとの責務分離
- [x] CURRENT_STATUSとの責務分離
- [x] ROADMAPとの責務分離
- [x] 00_PROJECT_CONVENTIONSとの整合
- [x] 06_GAS_API_SPECとの責務分離
- [x] 13_GAS_OPERATION_POLICYとの責務分離
- [x] 15_GAS_IMPLEMENTATION_GUIDEとの責務分離
- [x] 17_TROUBLESHOOTINGとの責務分離
- [x] STATUS表記統一
- [x] RESULT表記統一
- [x] Single Source of Truth維持
- [x] GitHub表示崩れなし
- [x] vNext 1.3文書体系へ適合