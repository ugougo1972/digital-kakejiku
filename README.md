# digital-kakejiku

静かに空間を観測し、時間と環境の変化を記録する、据置型デジタル観測装置。

本プロジェクトは、XIAO ESP32S3 Plus、Google Apps Script、Google Spreadsheet、Gemini API、7.5inch E-Paper 等を用いて、環境状態・空気感・季節感・滞在感・今日の詩・時系列変化を長期的に蓄積・可視化することを目的とする。

最終更新: 2026-06-19

---

## 1. コンセプト

digital-kakejiku は、単なる情報表示端末ではない。

本装置は以下を重視する。

- 静けさ
- 余白
- 時間性
- 空気感
- 緩慢な変化
- 低頻度更新
- 長期観測

高FPS・派手な演出・常時アニメーションよりも、静止、季節変化、文脈、微細な環境変動を重視する。

---

## 2. 現時点での構成

```text
Sensors
↓
XIAO ESP32S3 Plus
↓ HTTPS POST / JSON
Google Apps Script
↓
Google Spreadsheet
├─ observation_log
├─ event_log
├─ error_log
├─ system_log
├─ source_config
├─ solar_term_master
├─ season_dictionary
├─ calendar_master
└─ poem_cache
↓
Gemini API
↓
poem_cache
↓
7.5inch E-Paper / 背面OLED
```

ESP32側は観測端末に徹し、データ蓄積、暦情報管理、詩生成、状態推定、表示内容生成は Google Apps Script 側を中心に構成する。

---

## 3. 設計成熟度

本リポジトリでは、設計状態を以下の3段階で管理する。

| 状態 | 意味 |
|---|---|
| PROPOSED | 提案中・検討中 |
| CONFIRMED | 技術採択済み。実装対象として扱う |
| FINALIZED | 実装・運用前提として凍結。原則変更しない |

本READMEに記載する主要構成は、特記がない限り `CONFIRMED` とする。

---

## 3.1 Phase体系と現在位置

Claude査読で指摘された旧Phase体系と新Phase体系の混在を避けるため、本READMEでは以下の扱いとする。

### 現行Phase体系

| Phase | 内容 | 現在状態 |
|---:|---|---|
| Phase 1 | GAS基盤本実装 | 次作業 |
| Phase 2 | Calendar Subsystem | GAS基盤後 |
| Phase 3 | ESP32統合 | 後続 |
| Phase 4 | Poem Subsystem | Calendar/ESP32統合後 |
| Phase 5 | 長期運用評価 | 後続 |
| Phase 6 | 筐体化 | 後続 |

### 旧Phase体系の扱い

旧Phase体系は、過去のPoC成果を説明するための履歴情報として保持する。

| 旧Phase | 内容 | 現行体系での扱い |
|---:|---|---|
| Phase 0 | Repository / Documentation | 完了済み履歴 |
| Phase 1 | GAS通信PoC | 完了済み履歴 |
| Phase 1.5 | GAS Hardening / Stabilization | 完了済み履歴 |
| Phase 2 | ESP32 HTTPS POST / DeepSleep周期送信PoC | 完了済み履歴 |
| Phase 2.5 | 電源系UPS設計 | CONFIRMED、実機評価は後続 |
| Phase 3以降 | 旧ロードマップ上の後続作業 | 現行Phase 1以降へ再整理 |

現在位置は「GAS本実装前の整合性修正・Spreadsheet構成確定」であり、次作業はGAS本実装である。


## 4. 採択済み主要ハードウェア

| 区分 | 採択内容 | 確定度 |
|---|---|---|
| MCU | XIAO ESP32S3 Plus | CONFIRMED |
| 前面表示 | 7.5inch 800×480 E-Paper | CONFIRMED |
| E-Paper基板 | XIAO ePaper Breakout Board V2 | CONFIRMED |
| 背面UI表示 | 128×96 OLED、SSD1315優先 | CONFIRMED |
| 背面操作 | 3ポジションダイヤルスイッチ | CONFIRMED |
| RTC | DS3231 + AT24C32 + CR2032 | CONFIRMED |
| 電源 | 18650 + IP5306 + DMG2305UX-13 + TPS63802 + PTC | CONFIRMED |
| CO₂ | SCD41 | CONFIRMED |
| VOC/NOx | SGP41 | CONFIRMED |
| PM | SPS30 | CONFIRMED |
| 照度/UV | LTR390 | CONFIRMED |
| 温湿度/気圧 | BME680 | CONFIRMED |
| 人感 | HLK-LD2410C | CONFIRMED |
| 音環境 | ICS-43434 | CONFIRMED |
| ストレージ | microSD | CONFIRMED |
| GPIO拡張 | MCP23017 | CONFIRMED |

---

## 5. 表示・UI方針

### 5.1 前面

前面は表示専用とする。

- 7.5inch E-Paper
- 800×480
- 低頻度更新
- 日めくりカレンダー的表示
- 環境状態、暦情報、今日の詩を表示

### 5.2 背面

背面は設定・診断・保守専用とする。

- OLED 128×96
- SSD1315優先
- 3ポジションダイヤルスイッチ
- 通信状態、エラー状態、手動再取得、保守操作を扱う

### 5.3 AI表示の制約

Gemini APIは「今日の詩」の生成に限定する。

禁止事項は以下である。

- 暦情報生成
- 暦情報推定
- 欠損補完
- 取得失敗時のそれらしい代替文生成

---

## 6. GPIO方針

### 使用可

- 2.54mmピッチヘッダー
- 背面ランド

### 使用禁止

- 1.27mm側面ランド

### ICS-43434 I2S割当

```text
MTCK(GPIO39) → BCLK
MTDO(GPIO40) → WS
MTDI(GPIO41) → DATA
MTMS(GPIO42) → 予備
```

---

## 7. 電源方針

据置型のため、通常稼働はUSB給電を基本とする。USB給電喪失時のみ18650からの給電へ自動移行するUPS的構成を採用する。

```text
USB-C入力
↓
PTC
↓
IP5306
├─ 18650
└─ 5V BUS
   ├─ SPS30
   └─ TPS63802
      ↓ 3.3V
      DMG2305UX-13
      ↓
      3.3V BUS
```

設計目標は以下である。

- 常時USB給電
- 停電時自動切替
- 手動切替なし
- UPS的運用
- XIAOのUSB接続時に外部3.3V系からPC側へ逆流しないこと

TP4056単体構成はUPS用途に不向きなため、主構成から外す。

### 7.1 自動切替の扱い

本READMEにおける「自動切替」は、ソフトウェアによる切替操作ではなく、IP5306、18650、DMG2305UX-13、TPS63802を中心とする電源回路側のUPS的動作を指す。

PowerManagerは切替そのものを実行するのではなく、USB給電喪失、復電、低電圧、BATTERY_MODE等の状態を監視・記録する。

IP5306実モジュール仕様、出力電流容量、発熱、端子仕様、USB Presence検出方法は実機確認待ちであり、未確定事項として管理する。


---

## 8. GAS / Spreadsheet方針

GASは単なる中継ではなく、中央制御層として設計する。

主な責務は以下である。

- API Gateway
- Payload検証
- 認証
- ログ保存
- エラー記録
- Calendar Subsystem
- Poem Subsystem
- Config配信
- Device状態管理

### 8.1 Spreadsheet構成

| シート | 用途 |
|---|---|
| observation_log | 環境観測データ |
| event_log | 操作・状態イベント |
| error_log | エラー情報 |
| system_log | システム状態 |
| source_config | 外部情報源管理 |
| solar_term_master | 二十四節気マスタ |
| season_dictionary | 七十二候辞書 |
| calendar_master | 表示用統合カレンダー |
| poem_cache | 今日の詩キャッシュ |

旧PoCの `RawLogs` は通信検証用の暫定シートであり、GAS本実装では上記構成へ移行する。

### 8.2 Payload検証方針

GAS本実装では、`type`、`device_id`、`secret`、`timestamp`、`schema_version` 等の共通必須項目を検証し、Payload種別ごとに保存先シートを分岐する。

Observation Payloadの列定義は `docs/03_LOG_FORMAT.md` および `docs/06_GAS_API_SPEC.md` を正とする。フィールド数は実装時のスキーマで確定し、未確定項目を「確定済み」と扱わない。

単位付き項目は、ESP32側で所定単位の値を送信する前提とする。GAS側では型検証と、物理的に不自然な値またはセンサー仕様逸脱値の検出を行う方針とする。具体的な閾値は実装・実測に基づき各仕様書で管理する。


---

## 9. Calendar Subsystem

暦情報管理をGAS側へ集約する。

| 情報 | 取得元 | AI利用 |
|---|---|---|
| 祝日 | 内閣府 | 禁止 |
| 二十四節気 | 国立天文台 | 禁止 |
| 七十二候名称 | 固定マスタ | 禁止 |
| 七十二候の読み・解説・キーワード | source_config管理URL | 禁止 |

取得失敗時は以下を実施する。

- `error_log` へ記録
- `calendar_master` に失敗状態を記録
- E-Paperへ「取得できません」と表示
- 前回値流用禁止
- AIによる補完禁止

### 9.1 実装責務

Calendar SubsystemはGAS側で実装する。

ESP32側は暦情報を生成しない。ESP32はGAS側で生成・保存された `calendar_master` を表示用データとして取得し、E-Paper表示に利用する。

日次処理、年次生成、手動再生成、取得失敗時の状態管理は `docs/10_CALENDAR_POEM_SUBSYSTEM.md` を正とする。


---

## 10. Poem Subsystem

Gemini API Free Tier を採択する。

用途は「今日の詩」の生成に限定する。

| 項目 | 内容 |
|---|---|
| 入力 | `calendar_master`、観測データ |
| 出力 | `poem_cache` |
| 生成頻度 | 1日1回 |
| 表示時再生成 | 禁止 |
| 失敗時表示 | 取得できません |
| 暦生成 | 禁止 |
| 暦推定 | 禁止 |
| 欠損補完 | 禁止 |

### 10.1 実装責務

Poem SubsystemはGAS側で実装する。

ESP32側および表示処理側は、表示のたびにGemini APIを呼び出さない。同日分は `poem_cache` を参照する。

「1日1回生成」の基準時刻、リトライ、失敗確定時の挙動は `docs/10_CALENDAR_POEM_SUBSYSTEM.md` を正とする。


---

## 11. 現在の進捗

完了済みPoCは以下である。

- GAS WebApp 作成
- `doGet()` 応答確認
- `doPost(e)` 外部POST確認
- PowerShell から GAS へのPOST確認
- Spreadsheet `RawLogs` への記録確認
- JSON全文保存確認
- GAS hardening版導入
- XIAO ESP32S3 Plus から GAS への HTTPS POST確認
- DeepSleep周期起床
- Wi-Fi再接続
- 周期POST
- Spreadsheetへの継続保存

現在はGAS本実装前の整合性修正段階である。

### 11.1 現在位置

現行ロードマップ上では、現在は Phase 1「GAS基盤本実装」へ進む直前である。

旧Phase 0〜2のPoC成果は完了済み履歴として保持する。旧Phase 2.5のUPS電源設計は `CONFIRMED` であり、実機評価は後続タスクとして扱う。


---

## 12. リポジトリ構成

```text
docs/
├── 01_HARDWARE_OVERVIEW.md
├── 02_SOFTWARE_OVERVIEW.md
├── 03_LOG_FORMAT.md
├── 04_STATE_MACHINE.md
├── 05_WIRING_DIAGRAM.md
├── 06_GAS_API_SPEC.md
├── 07_DISPLAY_UI_SPEC.md
├── 08_POWER_ARCHITECTURE.md
├── 09_SPI_RESOURCE_CONTROL.md
├── 10_CALENDAR_POEM_SUBSYSTEM.md
├── 11_SECURITY_MANAGEMENT.md
├── 90_DECISIONS/
└── 91_DISCUSSIONS/

firmware/
gas/
assets/
tools/
README.md
CURRENT_STATUS.md
ROADMAP.md
```

---

## 13. 重要方針

### README を設計書化しない

README.md は入口文書とする。詳細設計、判断、運用情報は各ドキュメントへ責務分離する。

### GAS 中央集権構成

ESP32 は観測端末に徹し、データ集約、暦情報管理、AI連携、状態推定、Config配信は GAS 側で行う。

### 長期運用前提

本プロジェクトは短期デモではなく、長期観測運用を前提とする。

### 推測禁止

外部情報取得に失敗した場合は、暦情報・詩・表示内容のいずれについても、推測で補完しない。

### SPI共有制御

E-PaperとmicroSDはSPI BUSを共有する。排他制御は `docs/09_SPI_RESOURCE_CONTROL.md` を正とし、保存処理を表示更新より優先する。

### 表示責務の分離

前面E-Paperは日常表示、背面OLEDは設定・診断・保守を担当する。詳細な画面仕様は `docs/07_DISPLAY_UI_SPEC.md` を正とする。

### セキュリティ管理

secret、GEMINI_API_KEY、Wi-Fi password等の機密値はログおよびSpreadsheetへ保存しない。詳細は `docs/11_SECURITY_MANAGEMENT.md` を正とする。


---

## 14. 関連文書

| 文書 | 内容 |
|---|---|
| CURRENT_STATUS.md | 現在状況、未確定事項、最優先タスク |
| ROADMAP.md | Phase体系、実装順序、完了条件 |
| docs/01_HARDWARE_OVERVIEW.md | ハードウェア構成 |
| docs/02_SOFTWARE_OVERVIEW.md | ソフトウェア構成、Manager責務 |
| docs/03_LOG_FORMAT.md | Spreadsheet / ログ仕様 |
| docs/04_STATE_MACHINE.md | 状態遷移 |
| docs/05_WIRING_DIAGRAM.md | 配線定義 |
| docs/06_GAS_API_SPEC.md | GAS API仕様 |
| docs/07_DISPLAY_UI_SPEC.md | 表示UI仕様 |
| docs/08_POWER_ARCHITECTURE.md | 電源構成 |
| docs/09_SPI_RESOURCE_CONTROL.md | SPI共有制御 |
| docs/10_CALENDAR_POEM_SUBSYSTEM.md | 暦・詩サブシステム |
| docs/11_SECURITY_MANAGEMENT.md | 認証情報管理 |

---

## 15. STATUS

| 項目 | 状態 | 備考 |
|---|---|---|
| MCU | CONFIRMED | XIAO ESP32S3 Plus |
| 前面表示 | CONFIRMED | 7.5inch 800×480 E-Paper |
| 背面UI | CONFIRMED | OLED 128×96、SSD1315優先、3ポジションダイヤル |
| RTC | CONFIRMED | DS3231 + AT24C32 + CR2032 |
| 電源方式 | CONFIRMED | UPS方式、通常USB給電、停電時18650 |
| IP5306実モジュール仕様 | PROPOSED | 型番、出力容量、端子仕様、発熱は実機確認待ち |
| Calendar Subsystem | CONFIRMED | GAS側実装、AI補完禁止 |
| Poem Subsystem | CONFIRMED | Gemini API Free Tier、1日1回生成 |
| AIによる暦生成禁止 | FINALIZED | Calendar/Poem共通制約 |
| 表示時Poem再生成禁止 | FINALIZED | `poem_cache`参照 |
| SPI排他制御 | CONFIRMED | `09_SPI_RESOURCE_CONTROL.md` を正とする |
| セキュリティ管理 | CONFIRMED | `11_SECURITY_MANAGEMENT.md` を正とする |

---

## 16. CHANGE LOG

| 日付 | 内容 | 理由 |
|---|---|---|
| 2026-06-19 | Phase体系と現在位置を追記 | Claude査読でのPhase混在指摘への対応 |
| 2026-06-19 | Calendar/PoemのGAS側責務を明記 | 実装責務の曖昧さ解消 |
| 2026-06-19 | UPS自動切替の意味を明記 | ハードウェア自動切替とソフトウェア監視の分離 |
| 2026-06-19 | SPI、セキュリティ、Payload検証方針を追記 | 横断設計文書との整合維持 |


## 17. License

TBD
