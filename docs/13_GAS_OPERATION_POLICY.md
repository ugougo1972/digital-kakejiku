# 13 GAS Operation Policy

**タイトル**  
13 GAS Operation Policy

**最終更新**  
2026-07-15

**文書版**  
vNext 1.3

**STATUS**  
FINALIZED

**責務**  
本書は Google Apps Script の運用ポリシー、定期実行、ジョブ管理、データ更新および運用ルールを定義する正式設計書である。

**Single Source**  
本書は GAS の運用ポリシーを管理する唯一の文書である。

スケジュール、ジョブ責務、運用方針および更新タイミングは本書を正式情報とし、他文書では重複管理しない。

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
- docs/12_CONFIGURATION_MANAGEMENT.md
- docs/14_SPREADSHEET_SCHEMA.md
- docs/18_GAS_RETRY_STRATEGY.md

## 後続

- GAS実装
- 定期実行設定
- システム運用

---

# 1. 文書の目的

本書は Google Apps Script の運用ポリシーを定義する。

本書では以下を管理する。

- 定期実行
- ジョブ構成
- 更新タイミング
- 運用方針
- Scheduler責務
- 運用ルール

実装コードやSpreadsheet構造の詳細は管理しない。

---

# 2. 運用設計方針

本システムでは以下を基本方針とする。

- Google Apps Script が定期実行を管理する。
- Calendar生成とPoem生成を分離する。
- Retryを考慮した運用とする。
- Spreadsheetを正式情報とする。
- Single Source of Truth を維持する。
- ESP32は運用スケジュールを管理しない。

---

# 3. 運用構成

```text
Time Trigger
      │
      ▼
 Scheduler
      │
      ├─────────────┐
      ▼             ▼
Calendar Job   Poem Job
      │             │
      ▼             ▼
Spreadsheet   Gemini API
```

---

# 4. 定期ジョブ

|ジョブ|用途|STATUS|
|---|---|---|
|Calendar Job|暦生成・更新|CONFIRMED|
|Poem Job|AI詩生成|CONFIRMED|
|Health Check|運用確認|CONFIRMED|
|Maintenance|保守処理|CONFIRMED|

---

# 5. 定期実行

Google Apps Script の Time Trigger により定期実行する。

---

## 5.1 基本方針

- ジョブごとに独立して実行する。
- ジョブ間の依存を最小限とする。
- Retry を考慮したスケジュールとする。
- 実行結果を必要に応じてログへ記録する。

---

## 5.2 実行順序

|順序|ジョブ|
|---:|---|
|1|Calendar Job|
|2|Poem Job|
|3|Maintenance Job|

---

## 5.3 実行タイミング

現在採用している運用は以下とする。

|ジョブ|実行時刻|STATUS|
|---|---|---|
|Calendar Job|02:00|CONFIRMED|
|Poem Job|02:10|CONFIRMED|

Retry 時刻の詳細は **18_GAS_RETRY_STRATEGY.md** を正式情報とする。

---

# 6. Calendar Job

Calendar Job は暦情報を管理する。

---

## 責務

- Calendar生成
- 翌年生成
- 必要時更新
- 整合性維持

---

## 基本方針

- Calendar を正式情報とする。
- 年単位で管理する。
- 外部データソースを利用する。
- 更新内容を必要に応じて記録する。

Calendar仕様は **10_CALENDAR_POEM_SUBSYSTEM.md** を正式情報とする。

---

# 7. Poem Job

Poem Job は AI 詩生成を管理する。

---

## 責務

- poem_cache確認
- AI生成
- Retry
- キャッシュ更新

---

## 基本方針

- poem_cache を優先利用する。
- Gemini API は必要時のみ利用する。
- 同一日の再生成は明示的操作時のみ実施する。
- Retry に対応する。

---

# 8. Health Check

Health Check はシステム状態を確認する。

---

## 責務

- GAS動作確認
- Spreadsheet接続確認
- Config確認
- 基本機能確認

---

## 基本方針

- 障害を早期検知する。
- 結果を必要に応じてSystem Logへ記録する。
- 異常時は保守者が原因を追跡できる情報を残す。

Health Check API の仕様は **06_GAS_API_SPEC.md** を正式情報とする。

---

# 9. Maintenance Job

Maintenance Job はシステム保守に必要な定期処理を実施する。

---

## 9.1 責務

- 定期保守
- キャッシュ整合性確認
- 不要データ確認
- システム診断

---

## 9.2 基本方針

- 他ジョブへ影響を与えない。
- 必要最小限の処理とする。
- 異常時はError Logへ記録する。
- 保守結果を必要に応じてSystem Logへ記録する。

Maintenance内容の詳細は今後決定する。

---

# 10. 運用データ

GAS運用で利用する正式データを示す。

|データ|正式管理|
|---|---|
|system_config|Spreadsheet|
|source_config|Spreadsheet|
|calendar_master|Spreadsheet|
|poem_cache|Spreadsheet|
|Observation Log|Spreadsheet|
|System Log|Spreadsheet|
|Error Log|Spreadsheet|

Single Source of Truth に基づき、同一情報を複数箇所で保持しない。

---

# 11. ジョブ依存関係

ジョブ間の依存関係を以下に示す。

```text
Calendar Job
      │
      ▼
calendar_master
      │
      ▼
Poem Job
      │
      ▼
poem_cache
```

Calendar Job が生成した暦情報を Poem Job が利用する。

Health Check および Maintenance Job は独立して動作する。

---

# 12. 設計方針

GAS運用は以下を設計原則とする。

---

## 単一責務

- Calendar Job は暦管理のみ担当する。
- Poem Job は詩生成のみ担当する。
- Maintenance Job は保守処理のみ担当する。
- Health Check は診断のみ担当する。

---

## Single Source of Truth

|情報|正式管理|
|---|---|
|設定|Spreadsheet|
|Calendar|calendar_master|
|AI詩|poem_cache|
|Secret|Script Properties|

---

## 保守性

- ジョブを独立して管理する。
- Schedulerを共通化する。
- Retry処理を共通化する。
- ジョブ追加を容易にする。

---

## 拡張性

将来的なジョブ追加に対応できる構成を維持する。

---

# 13. Retry運用

ジョブ失敗時は、共通Retry方針に従って再実行する。

---

## 13.1 基本方針

- Retry可能な障害とRetry不可の障害を分離する。
- Retry回数および待機時間は設定値として管理する。
- Retry結果をSystem LogまたはError Logへ記録する。
- 最大回数を超えた場合は処理を終了する。
- 無限Retryを禁止する。

Retryアルゴリズムおよび待機時間の詳細は **18_GAS_RETRY_STRATEGY.md** を正式情報とする。

---

## 13.2 定期ジョブのRetry

現在採用する定期ジョブのRetry運用は以下とする。

|ジョブ|初回実行|Retry間隔|最大Retry回数|STATUS|
|---|---:|---:|---:|---|
|Calendar Job|02:00|30分|3回|CONFIRMED|
|Poem Job|02:10|30分|3回|CONFIRMED|

Retry回数は初回実行を含まない。

---

## 13.3 Retry終了条件

以下のいずれかに該当した場合、Retryを終了する。

- 処理が正常終了した場合
- 最大Retry回数へ到達した場合
- Retry不可と判定された場合
- 前提データの欠損により継続不能と判定された場合
- 認証異常など、再試行で解消しない障害が発生した場合

---

# 14. 手動実行

定期実行とは別に、保守目的の手動実行を許可する。

---

## 14.1 手動実行対象

|処理|実行経路|STATUS|
|---|---|---|
|Calendar再生成|GAS保守機能|CONFIRMED|
|任意年・任意期間のCalendar再生成|GAS保守機能|CONFIRMED|
|Poem再生成|背面OLED管理メニュー経由|CONFIRMED|
|Health Check|GAS保守機能|CONFIRMED|
|System Logger確認|GAS保守機能|CONFIRMED|

---

## 14.2 手動実行方針

- 実行対象を明示する。
- 認証後のみ実行する。
- 定期ジョブとの競合を避ける。
- 実行結果をログへ記録する。
- 既存データを上書きする場合は対象範囲を限定する。
- Secret情報をリクエスト、レスポンスおよびログへ残さない。

---

# 15. Calendar運用

Calendarデータは過去・現在・将来の表示および詩生成で利用する。

---

## 15.1 保持範囲

`calendar_master` は以下の期間を管理する。

- 過去5年
- 当年
- 翌年

具体的な行構造および一意性制約は **14_SPREADSHEET_SCHEMA.md** を正式情報とする。

---

## 15.2 年次更新

毎年12月1日に翌年分を生成する。

既に対象年のデータが存在する場合の更新方式は、Calendar実装仕様に従う。

---

## 15.3 データ取得方針

|暦情報|取得方針|STATUS|
|---|---|---|
|二十四節気|公的な暦情報を取得する|CONFIRMED|
|七十二候|`source_config`で管理する外部情報源から取得する|CONFIRMED|
|祝日|`source_config`で管理する情報源を利用する|CONFIRMED|
|月齢|`source_config`で管理する情報源を利用する|CONFIRMED|
|六曜|`source_config`で管理する情報源を利用する|CONFIRMED|
|干支|`source_config`で管理する情報源を利用する|CONFIRMED|

二十四節気および七十二候は、独自計算による推定値を正式情報として使用しない。

---

# 16. Poem運用

Poemデータは、定期生成および明示的な手動再生成によって管理する。

---

## 16.1 定期生成

Poem Job は対象日の暦情報および観測情報を参照し、必要な詩を生成する。

生成済みデータが有効な場合は `poem_cache` を利用する。

---

## 16.2 手動再生成

背面OLED管理メニューから、任意日の詩再生成を要求できる。

手動再生成時は以下を満たす。

- 対象日を明示する。
- GASへ再生成要求を送信する。
- 生成結果を `poem_cache` へ保存する。
- 実行結果をログへ記録する。
- 失敗時はRetry仕様に従う。

---

## 16.3 ESP32の責務

ESP32は以下を行わない。

- Gemini APIの直接呼出し
- Prompt生成
- Calendar生成
- `system_config`および`source_config`の編集

ESP32は管理メニュー表示時など、必要な時点でGASへ設定情報を問い合わせる。

---

# 17. 排他制御

同一ジョブまたは依存関係を持つジョブの重複実行を防止する。

---

## 17.1 基本方針

- 同一ジョブの多重実行を禁止する。
- Calendar Job実行中のPoem Job開始を制御する。
- 排他取得失敗時は無理に処理を継続しない。
- 排他状態を必要に応じてSystem Logへ記録する。

---

## 17.2 競合時の扱い

|競合|対応|
|---|---|
|同一ジョブの重複|後続処理を中止または延期する|
|Calendar更新中のPoem生成|Calendar更新完了後に実行する|
|手動実行と定期実行の競合|既存処理を優先する|
|Spreadsheet更新競合|排他制御後に再判定する|

具体的なロック実装はGAS実装コードで管理する。

---

# 18. ログ運用

各ジョブは処理内容に応じてログを出力する。

ログ形式は **03_LOG_FORMAT.md** を正式情報とする。

|処理|記録先|
|---|---|
|ジョブ開始・終了|System Log|
|手動実行|Event Log|
|Retry開始・成功|System Log|
|最終失敗|Error Log|
|設定変更|Event Log|
|想定外例外|Error Log|

Secret、認証情報および未加工のPOST bodyをログまたはSpreadsheetへ保存してはならない。

---

# 19. 障害時運用

障害発生時は、障害分類とRetry可否に基づいて処理する。

---

## 19.1 基本方針

- 障害内容を分類する。
- Retry可能な場合のみ再実行する。
- 復旧不能な場合はError Logへ記録する。
- 他ジョブへ障害を波及させない。
- 前回正常データが利用可能な場合は保持する。

---

## 19.2 最終失敗時

最大Retry回数到達後も処理が成功しない場合は、以下を実施する。

1. 対象ジョブを終了する。
2. Error Logへ記録する。
3. 既存の正常データを破壊しない。
4. 次回定期実行または手動実行まで待機する。
5. 必要に応じて保守画面で状態を確認できるようにする。

通知方式は未定義であり、今後決定する。

---

# 20. 制約事項

本書ではGASの運用方針を定義し、以下は対象外とする。

|項目|管理先|
|---|---|
|APIリクエスト・レスポンス|06_GAS_API_SPEC.md|
|Calendar・Poem論理構成|10_CALENDAR_POEM_SUBSYSTEM.md|
|設定項目|12_CONFIGURATION_MANAGEMENT.md|
|Spreadsheet構造|14_SPREADSHEET_SCHEMA.md|
|GAS実装手順|15_GAS_IMPLEMENTATION_GUIDE.md|
|試験方法|16_TESTING_STRATEGY.md|
|障害調査手順|17_TROUBLESHOOTING.md|
|Retryアルゴリズム|18_GAS_RETRY_STRATEGY.md|
|Prompt内容|19_GEMINI_PROMPT_SPECIFICATION.md|

---

# 21. 未定義事項

|項目|状態|
|---|---|
|Maintenance Jobの詳細処理|今後決定|
|運用通知方式|今後決定|
|ジョブ実行履歴の保持期間|今後決定|
|障害時の自動通知先|今後決定|
|Time Trigger再構築手順|今後決定|
|運用停止・再開手順|今後決定|

---

# CHANGE LOG

|日付|内容|
|---|---|
|2026-07-15|vNext 1.3文書体系に合わせ全面刷新。GAS運用方針のSingle Sourceとして、定期ジョブ、実行順序、実行時刻、Retry、手動実行、排他制御、ログおよび障害時運用を整理。関連文書との責務を分離し、STATUS・RESULT・Markdown記法を共通規約へ統一。|
|2026-07-14|Calendar Jobを02:00、Poem Jobを02:10に開始し、30分間隔で最大3回Retryする方針を反映。|
|2026-07-14|毎年12月1日の翌年Calendar生成、任意年・任意期間の再生成および背面OLEDからのPoem再生成方針を反映。|
|2026-06-21|GAS Phase1基盤実装およびHealth Check結果を反映。|

---

# 付録A. 関連文書の責務

|文書|責務|
|---|---|
|README.md|プロジェクト概要・入口|
|CURRENT_STATUS.md|現在の進捗と実績|
|ROADMAP.md|中長期計画|
|06_GAS_API_SPEC.md|API契約|
|10_CALENDAR_POEM_SUBSYSTEM.md|Calendar・Poemの論理設計|
|12_CONFIGURATION_MANAGEMENT.md|設定管理方針|
|13_GAS_OPERATION_POLICY.md|GAS運用方針（本書）|
|14_SPREADSHEET_SCHEMA.md|保存構造と制約|
|15_GAS_IMPLEMENTATION_GUIDE.md|実装手順|
|16_TESTING_STRATEGY.md|試験方針|
|17_TROUBLESHOOTING.md|障害調査と復旧手順|
|18_GAS_RETRY_STRATEGY.md|Retry詳細|
|19_GEMINI_PROMPT_SPECIFICATION.md|詩生成条件|

---

# 付録B. 更新ルール

本書は以下の場合に更新する。

- 定期ジョブ追加・削除
- 実行時刻変更
- ジョブ依存関係変更
- 手動実行方式変更
- 排他制御方針変更
- CalendarまたはPoem運用変更
- 障害時運用変更
- 文書体系変更

日々の実行結果や一時的な障害状況は記載しない。

現在の状況は **CURRENT_STATUS.md** を正式情報とする。

---

# 自己査読チェックリスト

- [x] 文書内矛盾なし
- [x] READMEとの責務分離
- [x] CURRENT_STATUSとの責務分離
- [x] ROADMAPとの責務分離
- [x] 00_PROJECT_CONVENTIONSとの整合
- [x] 06_GAS_API_SPECとの責務分離
- [x] 10_CALENDAR_POEM_SUBSYSTEMとの責務分離
- [x] 12_CONFIGURATION_MANAGEMENTとの責務分離
- [x] 14_SPREADSHEET_SCHEMAとの責務分離
- [x] 18_GAS_RETRY_STRATEGYとの責務分離
- [x] STATUS表記統一
- [x] RESULT表記統一
- [x] Single Source of Truth維持
- [x] Secretおよび未加工POST bodyの保存禁止を反映
- [x] GitHub表示崩れなし
- [x] vNext 1.3文書体系へ適合