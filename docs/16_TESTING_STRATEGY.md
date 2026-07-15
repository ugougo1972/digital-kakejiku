# 16 Testing Strategy

**タイトル**  
16 Testing Strategy

**最終更新**  
2026-07-15

**文書版**  
vNext 1.3

**STATUS**  
FINALIZED

**責務**  
本書は digital-kakejiku の試験方針、試験体系、試験責務、品質判定基準および検証手順を定義する正式設計書である。

**Single Source**  
本書は試験方針を管理する唯一の文書である。

試験区分、品質判定、試験責務および試験実施方針は本書を正式情報とし、他文書では重複管理しない。

---

# 対象読者

- システム設計者
- ハードウェア開発者
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

- docs/01_HARDWARE_OVERVIEW.md
- docs/02_SOFTWARE_OVERVIEW.md
- docs/03_LOG_FORMAT.md
- docs/06_GAS_API_SPEC.md
- docs/15_GAS_IMPLEMENTATION_GUIDE.md
- docs/17_TROUBLESHOOTING.md

## 後続

- 各種試験実施
- 品質評価
- リリース判定

---

# 1. 文書の目的

本書はシステム全体の試験方針を定義する。

本書では以下を管理する。

- 試験体系
- 試験責務
- 品質判定
- 試験実施順序
- 合否判定
- 試験運用

実装コードや試験データそのものは本書では管理しない。

---

# 2. 試験設計方針

本システムでは以下を基本方針とする。

- 段階的試験を実施する。
- 単体試験から順次統合する。
- PASS/FAIL による判定を統一する。
- 再現可能な試験を優先する。
- 試験結果を記録する。
- Single Source of Truth を維持する。

---

# 3. 試験体系

```text
Unit Test
      │
      ▼
Integration Test
      │
      ▼
System Test
      │
      ▼
Acceptance Test
```

---

# 4. 試験区分

|試験|目的|STATUS|
|---|---|---|
|Unit Test|単体確認|CONFIRMED|
|Integration Test|結合確認|CONFIRMED|
|System Test|システム確認|CONFIRMED|
|Acceptance Test|最終確認|CONFIRMED|

---

# 5. Unit Test

Unit Test は各モジュール単体の品質を確認する。

---

## 5.1 対象

|対象|STATUS|
|---|---|
|ESP32 Firmware|CONFIRMED|
|Google Apps Script|CONFIRMED|
|各Manager|CONFIRMED|
|Utilities|CONFIRMED|

---

## 5.2 基本方針

- 単一モジュールのみを対象とする。
- 外部依存を排除する。
- PASS/FAIL を記録する。
- 不具合は再現可能とする。

---

# 6. Integration Test

Integration Test はモジュール間の連携を確認する。

---

## 対象

- API
- Configuration
- Logger
- Calendar
- Poem
- Retry
- Scheduler

---

## 基本方針

- モジュール間I/Fを確認する。
- データ整合性を確認する。
- ログ出力を確認する。

---

# 7. System Test

System Test はシステム全体を対象とする。

---

## 対象

- ESP32
- GAS
- Spreadsheet
- センサー
- 表示
- 電源

---

## 基本方針

- 実機で確認する。
- 通常系・異常系を確認する。
- 運用を想定する。

---

# 8. Acceptance Test

Acceptance Test は最終受入試験である。

---

## 確認内容

- 要件充足
- 品質確認
- 長時間運転
- 運用確認

---

## 判定

|RESULT|意味|
|---|---|
|PASS|受入可能|
|FAIL|修正必要|

---

# 9. 試験順序

試験は以下の順序で実施する。

```text
Unit Test
      │
      ▼
Integration Test
      │
      ▼
System Test
      │
      ▼
Acceptance Test
```

各段階で PASS した場合のみ次工程へ進む。

---

# 10. 試験データ

試験では再現可能なデータを使用する。

---

## 基本方針

- 同一条件を維持する。
- 必要に応じて固定データを利用する。
- 実データと試験データを区別する。
- Secret情報を使用しない。

---

# 11. 判定基準

試験結果は RESULT により判定する。

|RESULT|意味|
|---|---|
|PASS|期待どおり|
|FAIL|期待を満たさない|

GO / NG は開発判断に使用し、試験合否には使用しない。

---

# 12. ログ確認

試験ではログも確認対象とする。

---

## 確認対象

|ログ|確認内容|
|---|---|
|System Log|状態遷移|
|Error Log|例外|
|Observation Log|観測|
|Event Log|イベント|

ログ仕様は **03_LOG_FORMAT.md** を正式情報とする。

---

# 13. エラー試験

エラー処理および障害耐性を確認する。

---

## 13.1 確認対象

|対象|確認内容|
|---|---|
|API異常|適切なエラー応答|
|通信異常|Retry実施|
|Spreadsheet異常|Error Log出力|
|Gemini異常|RetryおよびError Log|
|設定異常|Validation|

---

## 13.2 基本方針

- 異常系を意図的に発生させる。
- Retry動作を確認する。
- エラー分類を確認する。
- Secret情報が出力されないことを確認する。

---

# 14. 長時間試験

システムの安定性を確認する。

---

## 確認内容

- 長時間連続動作
- メモリリーク有無
- ログ増加
- Retry継続動作
- スケジューラ動作

---

## 基本方針

- 実運用条件を想定する。
- 定期ジョブを継続実行する。
- 障害発生有無を確認する。

---

# 15. 品質判定

品質判定は試験結果全体で評価する。

---

## 基本方針

- 各試験はPASS/FAILで判定する。
- FAIL項目を残したまま次工程へ進めない。
- 修正後は再試験を実施する。
- 判定根拠を記録する。

---

## 判定例

|項目|RESULT|
|---|---|
|Unit Test|PASS|
|Integration Test|PASS|
|System Test|PASS|
|Acceptance Test|PASS|

---

# 16. 試験記録

試験結果は記録として保存する。

---

## 記録内容

- 試験日
- 試験担当者
- 試験環境
- 実施内容
- 結果
- 不具合
- 修正履歴

---

## 基本方針

- 再現可能な情報を残す。
- 実施内容を省略しない。
- 判定理由を明記する。

---

# 17. 設計方針

試験設計は以下を原則とする。

---

## 単一責務

各試験は一つの目的のみを持つ。

---

## Single Source of Truth

|情報|正式管理|
|---|---|
|試験方針|本書|
|API仕様|06_GAS_API_SPEC.md|
|ログ仕様|03_LOG_FORMAT.md|
|Retry仕様|18_GAS_RETRY_STRATEGY.md|

---

## 保守性

- 試験追加を容易にする。
- 試験項目を独立管理する。
- 判定方法を統一する。

---

## 拡張性

将来的な試験追加に対応できる構成を維持する。

---

# 18. 制約事項

本書では試験方針を定義する。

以下は対象外とする。

|項目|管理文書|
|---|---|
|実装コード|ソースコード|
|API仕様詳細|06_GAS_API_SPEC.md|
|Spreadsheet構造|14_SPREADSHEET_SCHEMA.md|
|障害対応手順|17_TROUBLESHOOTING.md|
|Retry詳細|18_GAS_RETRY_STRATEGY.md|

---

# 19. 将来拡張

本章では将来的に追加を検討する試験機能を示す。

本章は構想であり、実装を保証するものではない。

---

## 19.1 試験追加候補

|試験|STATUS|備考|
|---|---|---|
|Performance Test|PROPOSED|性能評価|
|Stress Test|PROPOSED|高負荷試験|
|Recovery Test|PROPOSED|障害復旧確認|
|Regression Test|PROPOSED|回帰試験|
|Security Test|PROPOSED|セキュリティ評価|

---

## 19.2 自動化

将来的に以下を検討する。

- 自動試験
- CI連携
- 自動レポート生成
- 自動品質判定

詳細仕様は今後決定する。

---

# 20. 未定義事項

|項目|状態|
|---|---|
|CI/CD構成|今後決定|
|試験自動化ツール|今後決定|
|性能評価基準|今後決定|
|長期試験期間|今後決定|
|品質メトリクス|今後決定|

---

# CHANGE LOG

|日付|内容|
|---|---|
|2026-07-15|vNext 1.3文書体系に合わせ全面刷新。試験方針文書として再設計し、README・CURRENT_STATUS・ROADMAP・03_LOG_FORMAT・06_GAS_API_SPEC・15_GAS_IMPLEMENTATION_GUIDE・17_TROUBLESHOOTING・18_GAS_RETRY_STRATEGYとの責務を明確化。Single Source of Truthに基づき、試験体系・判定基準・品質評価・試験記録を整理し、STATUS・RESULT表記および文書構成を共通規約へ統一。|
|2026-07-14|System Test、Acceptance Test、長時間試験およびエラー試験を整理。|
|2026-06-21|Phase1 Health CheckおよびConfiguration Manager試験結果を反映。|

---

# 付録A. 関連文書の責務

|文書|責務|
|---|---|
|README.md|プロジェクト概要・入口|
|CURRENT_STATUS.md|現在の開発状況|
|ROADMAP.md|中長期計画|
|03_LOG_FORMAT.md|ログ仕様|
|06_GAS_API_SPEC.md|API仕様|
|15_GAS_IMPLEMENTATION_GUIDE.md|実装ガイド|
|16_TESTING_STRATEGY.md|試験方針（本書）|
|17_TROUBLESHOOTING.md|障害対応|
|18_GAS_RETRY_STRATEGY.md|Retry仕様|

---

# 付録B. 更新ルール

本書は以下の場合に更新する。

- 試験区分追加・削除
- 判定基準変更
- 試験手順変更
- 品質評価方法変更
- 試験運用変更
- 文書体系変更

日常的な試験結果は記載しない。

試験実施結果および進捗は **CURRENT_STATUS.md** を正式情報とする。

---

# 自己査読チェックリスト

- [x] 文書内矛盾なし
- [x] READMEとの責務分離
- [x] CURRENT_STATUSとの責務分離
- [x] ROADMAPとの責務分離
- [x] 00_PROJECT_CONVENTIONSとの整合
- [x] 03_LOG_FORMATとの責務分離
- [x] 06_GAS_API_SPECとの責務分離
- [x] 15_GAS_IMPLEMENTATION_GUIDEとの責務分離
- [x] 17_TROUBLESHOOTINGとの責務分離
- [x] 18_GAS_RETRY_STRATEGYとの責務分離
- [x] STATUS表記統一
- [x] RESULT表記統一
- [x] Single Source of Truth維持
- [x] GitHub表示崩れなし
- [x] vNext 1.3文書体系へ適合