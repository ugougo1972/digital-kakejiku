# 02 Software Overview

**タイトル**  
02 Software Overview

**最終更新**  
2026-07-15

**文書版**  
vNext 1.3

**STATUS**  
FINALIZED

**責務**  
本書は digital-kakejiku のソフトウェア全体構成、各ソフトウェアモジュールの責務、および相互関係を定義する正式設計書である。

**Single Source**  
本書はソフトウェア全体構成を管理する唯一の文書である。

API仕様、状態遷移、ログ仕様、Geminiプロンプト仕様などの詳細は各専門文書を正式情報とし、本書では重複管理しない。

---

# 対象読者

- ソフトウェア設計者
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

- docs/03_LOG_FORMAT.md
- docs/04_STATE_MACHINE.md
- docs/06_GAS_API_SPEC.md
- docs/13_GAS_OPERATION_POLICY.md
- docs/18_GAS_RETRY_STRATEGY.md
- docs/19_GEMINI_PROMPT_SPECIFICATION.md

## 後続

- ESP32 Firmware実装
- GAS実装
- システム統合試験

---

# 1. 文書の目的

本書は digital-kakejiku のソフトウェア全体構成を定義する。

本書では以下を管理する。

- ソフトウェア構成
- システム構成
- モジュール責務
- データフロー概要
- システム連携
- 設計方針

個別API、ログ仕様、状態遷移、実装詳細は管理しない。

---

# 2. ソフトウェア概要

本システムは以下のソフトウェアで構成される。

- ESP32 Firmware
- Google Apps Script
- Google Spreadsheet
- Gemini API

各モジュールは独立して責務を持ち、HTTPSを介して連携する。

---

# 3. ソフトウェアアーキテクチャ

```text
+----------------------+
|     Gemini API       |
+----------+-----------+
           ^
           |
+----------+-----------+
| Google Apps Script   |
+----------+-----------+
           ^
           |
Google Spreadsheet
           ^
           |
HTTPS / Wi-Fi
           ^
           |
+----------+-----------+
|  XIAO ESP32S3 Plus   |
+----------+-----------+
           ^
           |
 Environment Sensors
```

本構成は責務分離を基本とし、各モジュールを独立して保守可能な設計とする。

---

# 4. ソフトウェア構成

本システムは責務ごとにソフトウェアモジュールを分離し、相互依存を最小限に抑えた構成を採用する。

|モジュール|役割|詳細設計|
|---|---|---|
|ESP32 Firmware|デバイス制御|本書|
|Google Apps Script|クラウド処理|06_GAS_API_SPEC.md|
|Google Spreadsheet|データ管理|14_SPREADSHEET_SCHEMA.md|
|Gemini API|詩生成|19_GEMINI_PROMPT_SPECIFICATION.md|

---

# 5. ESP32 Firmware

ESP32 Firmware はハードウェア全体を制御する中核ソフトウェアである。

---

## 5.1 責務

- センサー制御
- E-Paper制御
- OLED制御
- 通信制御
- 電源監視
- 状態管理
- GAS通信
- エラー処理

---

## 5.2 主な機能

|機能|概要|
|---|---|
|Sensor Manager|センサー取得|
|Display Manager|表示制御|
|Power Manager|電源管理|
|Communication Manager|GAS通信|
|State Manager|状態遷移|
|Configuration Manager|設定取得|

状態遷移の詳細は **04_STATE_MACHINE.md** を正式情報とする。

---

# 6. Google Apps Script

Google Apps Script はクラウド側の制御を担当する。

ESP32 と Google Spreadsheet の仲介を行い、必要に応じて Gemini API を利用する。

---

## 6.1 責務

- API提供
- データ保存
- データ取得
- Calendar生成
- 詩生成
- Retry制御
- ログ管理
- エラー管理

---

## 6.2 主なモジュール

|モジュール|概要|
|---|---|
|API Controller|HTTP API|
|Config Manager|設定管理|
|Calendar Manager|暦生成|
|Poem Manager|詩生成|
|Logger|ログ管理|
|Retry Controller|再試行制御|

詳細仕様は **06_GAS_API_SPEC.md** を参照する。

---

# 7. Google Spreadsheet

Google Spreadsheet はシステム全体のデータストアとして利用する。

---

## 7.1 責務

- 観測データ保存
- 設定保存
- 暦データ保存
- 詩キャッシュ保存
- ログ保存

---

## 7.2 データ構成

管理する主なデータは以下とする。

|分類|用途|
|---|---|
|Observation|観測データ|
|Calendar|暦データ|
|Poem Cache|生成済み詩|
|Configuration|設定情報|
|System Log|システムログ|
|Error Log|エラーログ|

詳細は **14_SPREADSHEET_SCHEMA.md** を正式情報とする。

---

# 8. Gemini API

Gemini API は、観測データおよび暦情報を基に詩を生成する AI コンポーネントである。

本書ではシステム内での責務のみを定義する。

プロンプト仕様、生成条件および制約は **19_GEMINI_PROMPT_SPECIFICATION.md** を正式情報とする。

---

## 8.1 責務

- 詩生成
- プロンプト処理
- 生成結果返却
- エラー通知

Gemini は観測データの保存や設定管理は行わない。

---

## 8.2 入力

Gemini が利用する情報は以下とする。

|入力データ|提供元|
|---|---|
|観測データ|Google Spreadsheet|
|暦情報|calendar_master|
|設定情報|system_config|
|生成条件|Prompt Specification|

---

## 8.3 出力

|出力|用途|
|---|---|
|詩本文|E-Paper表示|
|生成日時|履歴管理|
|生成状態|ログ管理|

---

# 9. ログ管理

ログ管理は Google Apps Script が担当する。

ESP32 は必要最小限の情報のみ送信し、保存処理は行わない。

---

## 9.1 管理対象

|ログ|用途|
|---|---|
|Observation Log|観測データ|
|Event Log|イベント履歴|
|System Log|システム状態|
|Error Log|障害記録|

ログ仕様は **03_LOG_FORMAT.md** を正式情報とする。

---

# 10. 設定管理

システム設定は Google Spreadsheet を正式な保存先とする。

ESP32 は設定値を保持せず、必要時に取得する。

---

## 10.1 管理対象

|設定|用途|
|---|---|
|system_config|システム設定|
|source_config|取得元設定|

設定仕様は **12_CONFIGURATION_MANAGEMENT.md** を正式情報とする。

---

## 10.2 基本方針

- Spreadsheet を正式情報とする。
- ESP32 は設定のコピーを保持しない。
- 設定変更は GAS を経由する。
- 設定変更方法の詳細は関連文書を参照する。

---

# 11. 状態管理

状態遷移は ESP32 Firmware が管理する。

状態定義および遷移条件は **04_STATE_MACHINE.md** を正式情報とする。

---

## 11.1 責務

- 起動管理
- 通信状態管理
- エラー管理
- 表示状態管理
- 復旧制御

---

## 11.2 基本方針

- 状態は一元管理する。
- 状態遷移は明示的に定義する。
- エラーからの復旧経路を定義する。
- 状態管理と画面表示を分離する。

---

# 12. エラー処理

エラー処理は各モジュールで実施し、必要に応じて Logger へ記録する。

---

## 基本方針

- エラーを隠蔽しない。
- リトライ可能なエラーは Retry Controller が処理する。
- 復旧不能なエラーは Error Log に記録する。
- 詳細仕様は **18_GAS_RETRY_STRATEGY.md** および **17_TROUBLESHOOTING.md** を参照する。

---

# 13. データフロー

本章では、システム全体のデータの流れを定義する。

データ構造およびAPI仕様は各設計文書を正式情報とする。

---

## 13.1 観測データフロー

```text
Environment Sensors
        │
        ▼
XIAO ESP32S3 Plus
        │
        ▼
Google Apps Script
        │
        ▼
Google Spreadsheet
```

観測データは Google Spreadsheet を正式な保存先とする。

---

## 13.2 詩生成フロー

```text
Observation Data
        │
Calendar Data
        │
System Config
        │
        ▼
Google Apps Script
        │
        ▼
Gemini API
        │
        ▼
Poem Cache
        │
        ▼
ESP32
        │
        ▼
E-Paper
```

---

## 13.3 設定取得フロー

```text
ESP32
    │
HTTPS
    │
    ▼
Google Apps Script
    │
    ▼
system_config
source_config
```

設定は Spreadsheet を正式情報とする。

---

# 14. ソフトウェア設計方針

本システムでは以下を設計原則とする。

---

## 14.1 責務分離

各モジュールは単一責務を持つ。

例

|モジュール|責務|
|---|---|
|ESP32|デバイス制御|
|GAS|クラウド処理|
|Spreadsheet|データ管理|
|Gemini|詩生成|

---

## 14.2 Single Source of Truth

各情報は一か所のみで管理する。

|情報|正式管理|
|---|---|
|設定|Spreadsheet|
|ログ|Spreadsheet|
|状態遷移|State Machine|
|API仕様|GAS API Specification|
|Prompt仕様|Gemini Prompt Specification|

---

## 14.3 保守性

以下を基本方針とする。

- モジュール分離
- API分離
- 実装依存を最小化
- 設定値の集中管理
- 文書と実装の整合維持

---

## 14.4 拡張性

将来の機能追加を考慮し、以下を維持する。

- API追加容易性
- センサー追加容易性
- Spreadsheet項目追加容易性
- Prompt変更容易性

---

# 15. ソフトウェアインターフェース

本章では、各モジュール間のインターフェース概要を示す。

詳細仕様は各専門文書を正式情報とする。

|接続元|接続先|方式|
|---|---|---|
|ESP32|Google Apps Script|HTTPS|
|Google Apps Script|Spreadsheet|Apps Script API|
|Google Apps Script|Gemini|Gemini API|
|ESP32|E-Paper|SPI|
|ESP32|OLED|I2C|
|ESP32|環境センサー|I2C / UART / I2S|

---

# 16. 設計上の制約

本書では以下を前提とする。

- オフライン時の詳細運用は未定義
- API認証方式の詳細は別文書で管理する
- 実装クラス構成は本書では定義しない
- ソースコード構成は本書では定義しない
- ライブラリ選定は実装文書を参照する

---

# 17. 将来拡張

本章では、ソフトウェアの将来的な拡張方針を示す。

本章は計画を示すものであり、実装を保証するものではない。

---

## 17.1 機能拡張

将来的に以下の機能追加を検討する。

|項目|STATUS|備考|
|---|---|---|
|複数表示テーマ|PROPOSED|詳細未定|
|表示レイアウト追加|PROPOSED|詳細未定|
|新規センサー対応|PROPOSED|詳細未定|
|通知機能|PROPOSED|詳細未定|
|診断機能強化|PROPOSED|詳細未定|

---

## 17.2 GAS拡張

|項目|STATUS|備考|
|---|---|---|
|API追加|PROPOSED|詳細未定|
|キャッシュ最適化|PROPOSED|詳細未定|
|運用支援機能|PROPOSED|詳細未定|
|管理画面拡張|PROPOSED|詳細未定|

---

## 17.3 ESP32 Firmware拡張

|項目|STATUS|備考|
|---|---|---|
|OTA更新|PROPOSED|今後検討|
|診断機能|PROPOSED|詳細未定|
|自己診断|PROPOSED|詳細未定|
|デバッグ支援|PROPOSED|詳細未定|

---

# 18. 未定義事項

本書では以下を定義しない。

|項目|状態|
|---|---|
|ソースコード構成|各実装で管理|
|ライブラリ選定|各実装で管理|
|クラス設計|各実装で管理|
|CI/CD構成|今後決定|
|OTA更新方式|今後決定|
|ユニットテスト構成|今後決定|

---

# CHANGE LOG

|日付|内容|
|---|---|
|2026-07-15|vNext 1.3文書体系に合わせ全面刷新。ソフトウェア全体構成文書として再設計し、README・CURRENT_STATUS・ROADMAP・03_LOG_FORMAT・04_STATE_MACHINE・06_GAS_API_SPEC・19_GEMINI_PROMPT_SPECIFICATIONとの責務を明確化。Single Source of Truthに基づき、API・状態遷移・ログ・プロンプト仕様との重複記述を整理。STATUS表記・文書構成を共通規約へ統一。|
|2026-07-14|GAS基盤およびGemini連携構成を更新。|
|2026-07-13|ソフトウェアアーキテクチャを更新。|

---

# 付録A. 関連文書の責務

|文書|責務|
|---|---|
|README.md|プロジェクト概要・入口|
|CURRENT_STATUS.md|現在の開発状況|
|ROADMAP.md|中長期計画|
|02_SOFTWARE_OVERVIEW.md|ソフトウェア全体構成|
|03_LOG_FORMAT.md|ログ仕様|
|04_STATE_MACHINE.md|状態遷移|
|06_GAS_API_SPEC.md|GAS API仕様|
|12_CONFIGURATION_MANAGEMENT.md|設定管理|
|14_SPREADSHEET_SCHEMA.md|データ構造|
|18_GAS_RETRY_STRATEGY.md|リトライ制御|
|19_GEMINI_PROMPT_SPECIFICATION.md|Geminiプロンプト仕様|

---

# 付録B. 更新ルール

本書は以下の場合に更新する。

- ソフトウェア構成変更
- モジュール追加・削除
- システム構成変更
- モジュール責務変更
- データフロー変更
- 文書体系変更

日常的な実装進捗は記載しない。

現在の進捗は **CURRENT_STATUS.md** を正式情報とする。

---

# 自己査読チェックリスト

- [x] 文書内矛盾なし
- [x] READMEとの責務分離
- [x] CURRENT_STATUSとの責務分離
- [x] ROADMAPとの責務分離
- [x] 00_PROJECT_CONVENTIONSとの整合
- [x] 03_LOG_FORMATとの責務分離
- [x] 04_STATE_MACHINEとの責務分離
- [x] 06_GAS_API_SPECとの責務分離
- [x] 19_GEMINI_PROMPT_SPECIFICATIONとの責務分離
- [x] STATUS表記統一
- [x] Single Source of Truth維持
- [x] GitHub表示崩れなし
- [x] vNext 1.3文書体系へ適合