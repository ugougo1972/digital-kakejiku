# 17 Troubleshooting

**タイトル**  
17 Troubleshooting

**最終更新**  
2026-07-15

**文書版**  
vNext 1.3

**STATUS**  
FINALIZED

**責務**  
本書は digital-kakejiku における障害調査、原因切り分け、復旧手順および保守時の対応方針を定義する正式設計書である。

**Single Source**  
本書は障害対応手順を管理する唯一の文書である。

障害分類、調査手順、復旧方針および保守対応は本書を正式情報とし、他文書では重複管理しない。

---

# 対象読者

- 保守担当者
- GAS開発者
- ESP32開発者
- システム設計者

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
- docs/11_SECURITY_MANAGEMENT.md
- docs/13_GAS_OPERATION_POLICY.md
- docs/16_TESTING_STRATEGY.md
- docs/18_GAS_RETRY_STRATEGY.md

## 後続

- 障害解析
- 修正実施
- 再試験

---

# 1. 文書の目的

本書はシステム障害発生時の調査および復旧方針を定義する。

本書では以下を管理する。

- 障害分類
- 調査手順
- 復旧手順
- ログ確認
- 原因切り分け
- 保守ルール

実装コードや障害修正方法そのものは本書では管理しない。

---

# 2. 基本方針

本システムでは以下を基本方針とする。

- 再現性を確認する。
- ログを優先して確認する。
- 原因を切り分ける。
- Secret情報を保護する。
- 修正後は再試験を実施する。
- Single Source of Truth を維持する。

---

# 3. 障害分類

|分類|内容|STATUS|
|---|---|---|
|Hardware|ハードウェア障害|CONFIRMED|
|Firmware|ESP32障害|CONFIRMED|
|GAS|Google Apps Script障害|CONFIRMED|
|Spreadsheet|データ障害|CONFIRMED|
|Network|通信障害|CONFIRMED|
|Configuration|設定障害|CONFIRMED|

---

# 4. 調査手順

障害発生時は以下の順序で調査する。

```text
障害確認
     │
     ▼
再現確認
     │
     ▼
ログ確認
     │
     ▼
原因切り分け
     │
     ▼
修正
     │
     ▼
再試験
```

---

# 5. ログ確認

障害解析ではログを最優先で確認する。

---

## 5.1 確認順序

|順序|ログ|
|---:|---|
|1|Error Log|
|2|System Log|
|3|Event Log|
|4|Observation Log|

---

## 5.2 基本方針

- Error Logから確認する。
- 障害発生時刻を特定する。
- 関連ログを時系列で確認する。
- Secret情報が出力されていないことを確認する。

ログ仕様は **03_LOG_FORMAT.md** を正式情報とする。

---

# 6. Hardware障害

Hardware障害は物理機器を対象とする。

---

## 確認項目

- 電源電圧
- 配線
- コネクタ
- センサー接続
- SPI/I2C通信
- 基板実装状態

---

## 基本方針

- 電源から確認する。
- 配線ミスを除外する。
- 導通確認を実施する。
- モジュール単位で切り分ける。

---

# 7. Firmware障害

Firmware障害はESP32側を対象とする。

---

## 確認項目

- 起動ログ
- API通信
- センサー取得
- Display更新
- State Machine

---

## 基本方針

- シリアルログを確認する。
- 設定値を確認する。
- 再現性を確認する。

---

# 8. GAS障害

Google Apps Script の障害を確認する。

---

## 確認項目

- Health Check
- Logger
- Configuration Manager
- Calendar Manager
- Poem Manager
- API

---

## 基本方針

- Health Checkを最初に実施する。
- Script Propertiesを確認する。
- Spreadsheet接続を確認する。
- Error Logを確認する。

---

# 9. Spreadsheet障害

Spreadsheet構造またはデータ異常を確認する。

---

## 確認項目

- シート存在
- 必須カラム
- 主キー
- 設定値
- データ整合性

---

## 基本方針

- 必須シートを確認する。
- キー重複を確認する。
- 必須設定を確認する。

Spreadsheet構造は **14_SPREADSHEET_SCHEMA.md** を正式情報とする。

---

# 10. Network障害

通信障害を確認する。

---

## 確認項目

- HTTPS通信
- API応答
- Timeout
- Retry

---

## 基本方針

- 通信経路を確認する。
- Retry動作を確認する。
- APIレスポンスを確認する。

Retry仕様は **18_GAS_RETRY_STRATEGY.md** を正式情報とする。

---

# 11. Configuration障害

設定異常を確認する。

---

## 確認項目

- system_config
- source_config
- Script Properties
- 必須キー

---

## 基本方針

- 必須キーを確認する。
- 型を確認する。
- Secret情報を確認する。

設定仕様は **12_CONFIGURATION_MANAGEMENT.md** を正式情報とする。

---

# 12. 復旧方針

復旧は原因を特定した後に実施する。

---

## 基本方針

- 原因未特定で設定変更しない。
- 一度に複数箇所を変更しない。
- 修正後は再試験する。
- 復旧内容をEvent Logへ記録する。

試験方針は **16_TESTING_STRATEGY.md** を正式情報とする。

---

# 13. 障害記録

障害対応では調査内容を記録として残す。

---

## 13.1 記録内容

以下を記録する。

- 発生日時
- 障害分類
- 発生条件
- 原因
- 対応内容
- 修正内容
- 再試験結果
- 判定結果

---

## 13.2 基本方針

- 原因と推測を区別する。
- 再現条件を明記する。
- 修正内容を記録する。
- PASS / FAIL を明記する。

---

# 14. エスカレーション

障害内容に応じて調査範囲を拡大する。

---

## 14.1 基本方針

- 原因が判明しない場合は上位レイヤへ切り分ける。
- 修正前にログを保存する。
- Secret情報を外部へ送信しない。
- 暫定対策と恒久対策を区別する。

---

## 14.2 切り分け順序

```text
Hardware
     │
Firmware
     │
Network
     │
GAS
     │
Spreadsheet
     │
Configuration
```

障害が複数レイヤへ波及している場合は、最初に発生した原因を優先して特定する。

---

# 15. 障害分類と対応

|障害分類|初期対応|RESULT|
|---|---|---|
|Hardware|電源・配線確認|GO|
|Firmware|シリアルログ確認|GO|
|Network|通信確認|GO|
|GAS|Health Check実施|GO|
|Spreadsheet|シート・データ確認|GO|
|Configuration|設定値確認|GO|

GO は調査開始可否を示すものであり、障害解決を意味しない。

---

# 16. 再試験

障害修正後は再試験を実施する。

---

## 基本方針

- 修正箇所のみで終了しない。
- 関連機能も確認する。
- PASS を確認する。
- 再現しないことを確認する。

試験方針は **16_TESTING_STRATEGY.md** を正式情報とする。

---

# 17. 設計方針

障害対応は以下を設計原則とする。

---

## 単一責務

- 障害調査
- 原因分析
- 修正
- 再試験

を明確に分離する。

---

## Single Source of Truth

|情報|正式管理|
|---|---|
|障害対応|本書|
|ログ仕様|03_LOG_FORMAT.md|
|試験方針|16_TESTING_STRATEGY.md|
|Retry仕様|18_GAS_RETRY_STRATEGY.md|

---

## 保守性

- 調査手順を統一する。
- ログを共通利用する。
- 原因分析を容易にする。

---

## 拡張性

将来的な障害分類追加に対応できる構成を維持する。

---

# 18. 制約事項

本書では障害対応方針を定義する。

以下は対象外とする。

|項目|管理文書|
|---|---|
|実装修正方法|ソースコード|
|API仕様|06_GAS_API_SPEC.md|
|Spreadsheet構造|14_SPREADSHEET_SCHEMA.md|
|Retryアルゴリズム|18_GAS_RETRY_STRATEGY.md|
|実装ガイド|15_GAS_IMPLEMENTATION_GUIDE.md|

---

# 19. 将来拡張

本章は将来的な障害対応機能を示す。

---

## 19.1 拡張候補

|項目|STATUS|備考|
|---|---|---|
|自己診断機能|PROPOSED|詳細未定|
|障害レポート生成|PROPOSED|詳細未定|
|自動復旧機能|PROPOSED|詳細未定|
|統計分析|PROPOSED|詳細未定|
|監視ダッシュボード|PROPOSED|詳細未定|

---

## 19.2 保守支援

将来的に以下を検討する。

- 障害分析支援
- 自動ログ解析
- 根本原因分析支援
- 障害履歴検索

詳細仕様は今後決定する。

---

# 20. 未定義事項

|項目|状態|
|---|---|
|障害通知方式|今後決定|
|自動復旧条件|今後決定|
|障害統計保持期間|今後決定|
|監視方式|今後決定|
|外部通知連携|今後決定|

---

# CHANGE LOG

|日付|内容|
|---|---|
|2026-07-15|vNext 1.3文書体系に合わせ全面刷新。障害対応文書として再設計し、README・CURRENT_STATUS・ROADMAP・03_LOG_FORMAT・06_GAS_API_SPEC・11_SECURITY_MANAGEMENT・12_CONFIGURATION_MANAGEMENT・13_GAS_OPERATION_POLICY・16_TESTING_STRATEGY・18_GAS_RETRY_STRATEGYとの責務を明確化。Single Source of Truthに基づき、障害分類・調査手順・復旧方針・再試験・障害記録を整理し、STATUS・RESULT表記および文書構成を共通規約へ統一。|
|2026-07-14|Health Checkを中心としたGAS障害調査手順を更新。|
|2026-06-21|Phase1 Health CheckおよびConfiguration Manager確認手順を反映。|

---

# 付録A. 関連文書の責務

|文書|責務|
|---|---|
|README.md|プロジェクト概要・入口|
|CURRENT_STATUS.md|現在の障害状況・進捗|
|ROADMAP.md|中長期計画|
|03_LOG_FORMAT.md|ログ仕様|
|06_GAS_API_SPEC.md|API仕様|
|11_SECURITY_MANAGEMENT.md|セキュリティ|
|12_CONFIGURATION_MANAGEMENT.md|設定管理|
|13_GAS_OPERATION_POLICY.md|運用方針|
|16_TESTING_STRATEGY.md|試験方針|
|17_TROUBLESHOOTING.md|障害対応（本書）|
|18_GAS_RETRY_STRATEGY.md|Retry仕様|

---

# 付録B. 更新ルール

本書は以下の場合に更新する。

- 障害分類変更
- 調査手順変更
- 復旧方針変更
- ログ運用変更
- 保守手順変更
- 文書体系変更

日常的な障害発生状況は記載しない。

現在の障害状況は **CURRENT_STATUS.md** を正式情報とする。

---

# 自己査読チェックリスト

- [x] 文書内矛盾なし
- [x] READMEとの責務分離
- [x] CURRENT_STATUSとの責務分離
- [x] ROADMAPとの責務分離
- [x] 00_PROJECT_CONVENTIONSとの整合
- [x] 03_LOG_FORMATとの責務分離
- [x] 06_GAS_API_SPECとの責務分離
- [x] 11_SECURITY_MANAGEMENTとの責務分離
- [x] 12_CONFIGURATION_MANAGEMENTとの責務分離
- [x] 13_GAS_OPERATION_POLICYとの責務分離
- [x] 16_TESTING_STRATEGYとの責務分離
- [x] 18_GAS_RETRY_STRATEGYとの責務分離
- [x] STATUS表記統一
- [x] RESULT表記統一
- [x] Single Source of Truth維持
- [x] GitHub表示崩れなし
- [x] vNext 1.3文書体系へ適合