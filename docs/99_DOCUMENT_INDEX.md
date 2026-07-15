# 99 Document Index

**タイトル**  
99 Document Index

**最終更新**  
2026-07-15

**文書版**  
vNext 1.3

**STATUS**  
FINALIZED

**責務**  
本書は Repository 全体の文書索引である。

**Single Source**  
本書は文書体系の索引を管理する唯一の文書である。

---

# 1. 文書体系

```text
Repository
│
├── README.md
├── CURRENT_STATUS.md
├── ROADMAP.md
│
├── docs/
│   ├──00_PROJECT_CONVENTIONS.md
│   ├──01_HARDWARE_OVERVIEW.md
│   ├──02_SOFTWARE_OVERVIEW.md
│   ├──03_LOG_FORMAT.md
│   ├──04_STATE_MACHINE.md
│   ├──05_WIRING_DIAGRAM.md
│   ├──06_GAS_API_SPEC.md
│   ├──07_DISPLAY_UI_SPEC.md
│   ├──08_POWER_ARCHITECTURE.md
│   ├──09_SPI_RESOURCE_CONTROL.md
│   ├──10_CALENDAR_POEM_SUBSYSTEM.md
│   ├──11_SECURITY_MANAGEMENT.md
│   ├──12_CONFIGURATION_MANAGEMENT.md
│   ├──13_GAS_OPERATION_POLICY.md
│   ├──14_SPREADSHEET_SCHEMA.md
│   ├──15_GAS_IMPLEMENTATION_GUIDE.md
│   ├──16_TESTING_STRATEGY.md
│   ├──17_TROUBLESHOOTING.md
│   ├──18_GAS_RETRY_STRATEGY.md
│   ├──19_GEMINI_PROMPT_SPECIFICATION.md
│   ├──20_DEVELOPMENT_GUIDELINES.md
│   └──99_DOCUMENT_INDEX.md
│
└──90_DECISIONS/
```

---

# 2. 文書一覧

|番号|文書|責務|
|---:|---|---|
|README|Repository入口|概要|
|CURRENT_STATUS|現在|進捗|
|ROADMAP|未来|計画|
|00|PROJECT_CONVENTIONS|共通規約|
|01|HARDWARE_OVERVIEW|ハードウェア|
|02|SOFTWARE_OVERVIEW|ソフトウェア|
|03|LOG_FORMAT|ログ|
|04|STATE_MACHINE|状態遷移|
|05|WIRING_DIAGRAM|配線|
|06|GAS_API_SPEC|API|
|07|DISPLAY_UI_SPEC|UI|
|08|POWER_ARCHITECTURE|電源|
|09|SPI_RESOURCE_CONTROL|SPI|
|10|CALENDAR_POEM_SUBSYSTEM|Calendar・Poem|
|11|SECURITY_MANAGEMENT|セキュリティ|
|12|CONFIGURATION_MANAGEMENT|設定|
|13|GAS_OPERATION_POLICY|運用|
|14|SPREADSHEET_SCHEMA|Spreadsheet|
|15|GAS_IMPLEMENTATION_GUIDE|実装|
|16|TESTING_STRATEGY|試験|
|17|TROUBLESHOOTING|障害対応|
|18|GAS_RETRY_STRATEGY|Retry|
|19|GEMINI_PROMPT_SPECIFICATION|Prompt|
|20|DEVELOPMENT_GUIDELINES|開発規約|
|90|DECISIONS|設計判断|
|99|DOCUMENT_INDEX|文書索引|

---

# 3. 文書参照順

初めて参照する場合は以下の順序を推奨する。

1. README.md
2. CURRENT_STATUS.md
3. ROADMAP.md
4. 00_PROJECT_CONVENTIONS.md
5. 必要な設計書
6. 90_DECISIONS

---

# 4. Single Source of Truth

|情報|正式文書|
|---|---|
|プロジェクト概要|README.md|
|現在の状態|CURRENT_STATUS.md|
|将来計画|ROADMAP.md|
|設計仕様|docs配下|
|設計判断|90_DECISIONS|

---

# CHANGE LOG

|日付|内容|
|---|---|
|2026-07-15|新規作成。Repository全体の文書索引を追加。|

---

# 自己査読チェックリスト

- [x] 文書一覧最新
- [x] 責務重複なし
- [x] Single Source維持
- [x] GitHub表示崩れなし
- [x] vNext 1.3文書体系へ適合