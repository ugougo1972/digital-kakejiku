# digital-kakejiku

**タイトル**  
digital-kakejiku

**最終更新**  
2026-07-15

**文書版**  
vNext 1.3

**STATUS**  
FINALIZED

**責務**  
本書は digital-kakejiku プロジェクトの入口となる文書であり、プロジェクトの目的、全体構成、開発状況、文書体系への導線を提供する。

**Single Source**  
本書はプロジェクト概要および文書体系の入口を管理する唯一の文書である。詳細仕様は各設計文書を参照し、本書へ重複記載しない。

---

# 対象読者

- プロジェクトオーナー
- ハードウェア設計者
- ソフトウェア設計者
- GAS開発者
- 保守担当者
- 新規参画者

---

# 関連文書

## 前提

- docs/00_PROJECT_CONVENTIONS.md

## 参照

- CURRENT_STATUS.md
- ROADMAP.md

## 関連

- docs/01_HARDWARE_OVERVIEW.md
- docs/02_SOFTWARE_OVERVIEW.md
- docs/03_LOG_FORMAT.md
- docs/04_STATE_MACHINE.md
- docs/05_WIRING_DIAGRAM.md
- docs/06_GAS_API_SPEC.md
- docs/07_DISPLAY_UI_SPEC.md
- docs/08_POWER_ARCHITECTURE.md
- docs/09_SPI_RESOURCE_CONTROL.md
- docs/10_CALENDAR_POEM_SUBSYSTEM.md
- docs/11_SECURITY_MANAGEMENT.md
- docs/12_CONFIGURATION_MANAGEMENT.md
- docs/13_GAS_OPERATION_POLICY.md
- docs/14_SPREADSHEET_SCHEMA.md
- docs/15_GAS_IMPLEMENTATION_GUIDE.md
- docs/16_TESTING_STRATEGY.md
- docs/17_TROUBLESHOOTING.md
- docs/18_GAS_RETRY_STRATEGY.md
- docs/19_GEMINI_PROMPT_SPECIFICATION.md

## 後続

本リポジトリを利用するすべての設計・実装・試験・保守作業

---

# 1. プロジェクト概要

## 1.1 概要

digital-kakejiku は、環境観測、暦情報表示、AIによる詩生成を組み合わせた据置型情報表示システムである。

ESP32マイコンを中心として各種環境センサーから取得した情報を Google Apps Script および Google Spreadsheet に蓄積し、必要に応じて AI による文章生成を行い、7.5inch E-Paper に表示する。

本プロジェクトは長期間の安定運用、保守性、拡張性およびドキュメント駆動開発を重視する。

---

## 1.2 プロジェクト目的

本プロジェクトでは以下を目的とする。

- 環境情報の継続的な観測
- 暦情報の表示
- AI生成コンテンツの活用
- 長期運用可能な据置型システムの構築
- 保守性・拡張性を考慮した設計

---

# 2. システム概要

## 2.1 全体構成

```text
環境センサー
        │
        ▼
XIAO ESP32S3 Plus
        │
     HTTPS
        │
        ▼
Google Apps Script
        │
        ▼
Google Spreadsheet
        │
        ▼
Gemini
        │
        ▼
7.5inch E-Paper
```

各コンポーネントの詳細仕様は個別設計書で管理する。

---

## 2.2 システム構成

本システムは以下の主要コンポーネントで構成される。

### ハードウェア

- 本体基板
- 電源基板
- OLED操作基板

### ソフトウェア

- ESP32 Firmware
- Google Apps Script
- Google Spreadsheet
- Gemini

---

## 2.3 主な特徴

- 据置型観測システム
- UPS電源構成
- 7.5inch E-Paper表示
- Google Apps Script連携
- Google Spreadsheet連携
- AIによる詩生成
- 保守用OLEDコンソール
- モジュール交換可能構造
- ファンレス自然空冷

---

# 3. 開発状況

本書では概要のみを示す。

現在の詳細な進捗、完了状況、課題および開発優先順位は **CURRENT_STATUS.md** を正式情報とする。

現在の開発フェーズは以下のとおりである。

|項目|状態|
|---|---|
|開発フェーズ|IN_PROGRESS|
|電源基板PoC|COMPLETED|
|本体基板設計|IN_PROGRESS|
|筐体設計|IN_PROGRESS|
|GAS実装|IN_PROGRESS|
|文書体系整備|IN_PROGRESS|

---

# 4. システム設計方針

本プロジェクトでは以下の設計方針を採用する。

- ドキュメント駆動開発
- モジュール構成
- 保守性優先
- 拡張性優先
- 長期運用を前提とした設計
- GitHubを正式設計情報とする

設計規約の詳細は **00_PROJECT_CONVENTIONS.md** を参照する。

---

# 5. 文書体系

## 5.1 基準文書

以下の4文書をプロジェクト全体の基準文書とする。

|文書|責務|
|---|---|
|README.md|プロジェクト概要・入口|
|CURRENT_STATUS.md|現在の開発状況|
|ROADMAP.md|中長期開発計画|
|docs/00_PROJECT_CONVENTIONS.md|共通規約|

---

## 5.2 設計文書

|文書|内容|
|---|---|
|01_HARDWARE_OVERVIEW|ハードウェア全体設計|
|02_SOFTWARE_OVERVIEW|ソフトウェア全体設計|
|03_LOG_FORMAT|ログ仕様|
|04_STATE_MACHINE|状態遷移|
|05_WIRING_DIAGRAM|配線仕様|
|06_GAS_API_SPEC|GAS API仕様|
|07_DISPLAY_UI_SPEC|表示仕様|
|08_POWER_ARCHITECTURE|電源設計|
|09_SPI_RESOURCE_CONTROL|SPI資源管理|
|10_CALENDAR_POEM_SUBSYSTEM|暦・詩生成|
|11_SECURITY_MANAGEMENT|セキュリティ|
|12_CONFIGURATION_MANAGEMENT|設定管理|
|13_GAS_OPERATION_POLICY|GAS運用|
|14_SPREADSHEET_SCHEMA|Spreadsheet設計|
|15_GAS_IMPLEMENTATION_GUIDE|GAS実装|
|16_TESTING_STRATEGY|試験方針|
|17_TROUBLESHOOTING|障害対応|
|18_GAS_RETRY_STRATEGY|リトライ設計|
|19_GEMINI_PROMPT_SPECIFICATION|Geminiプロンプト仕様|

---

# 6. リポジトリ運用方針

設計・実装・試験・運用に関する情報は GitHub リポジトリで管理する。

設計変更時は以下の順序で更新する。

1. 設計文書更新
2. 関連文書との整合性確認
3. GitHub反映
4. 実装
5. 試験

設計書より先に実装を変更する運用は行わない。

---

# 7. 開発ロードマップ

本書では概要のみを示す。

詳細なマイルストーン、計画および将来構想は **ROADMAP.md** を正式情報とする。

---

# 8. 現在未定義の事項

以下は本書では定義しない。

- リリース計画
- バージョン採番規則
- Git運用詳細
- ブランチ運用
- Commit Message規則

必要となった時点で関連文書に追加する。

---

# CHANGE LOG

|日付|内容|
|---|---|
|2026-07-15|vNext 1.3として全面刷新。READMEをプロジェクト入口文書へ再設計し、Single Source of Truthに基づきCURRENT_STATUS、ROADMAP、00_PROJECT_CONVENTIONSとの責務を明確化。|
|2026-07-14|初版更新。|