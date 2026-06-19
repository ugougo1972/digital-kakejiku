# digital-kakejiku

静かに空間を観測し、時間と環境の変化を記録する、据置型デジタル観測装置。

本プロジェクトは、XIAO ESP32S3 Plus、Google Apps Script、Google Spreadsheet、Gemini API、7.5inch E-Paper 等を用いて、環境状態・空気感・季節感・滞在感・AI生成文・時系列変化を長期的に蓄積・可視化することを目的とする。

---

# コンセプト

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

# 現時点での構成

```text
Sensors
↓
XIAO ESP32S3 Plus
↓ HTTPS POST
Google Apps Script
↓
Google Spreadsheet
↓
Gemini API
↓
Google Spreadsheet
↓
7.5inch E-Paper
```

ESP32側は観測端末に徹し、データ蓄積、状態推定、AI連携、表示内容生成は Google Apps Script 側を中心に構成する。

---

# 想定機能

## 環境観測

以下を継続観測対象とする。

- 温度
- 湿度
- 気圧
- CO2
- VOC
- NOx
- PM
- 照度
- UV
- 人感 / 気配
- 音環境
- WiFi RSSI
- 電源状態

## AI生成コンテキスト

収集データを単純表示するのではなく、以下を踏まえて Gemini により文章生成を行う。

- 時間帯
- 季節
- 空間変化
- 環境推移
- 滞在感
- 観測履歴

---

# 採択済み主要ハードウェア

## MCU

- XIAO ESP32S3 Plus

## 表示

- 7.5inch 800×480 E-Paper
- XIAO ePaper Breakout Board V2

## 電源

- 18650 Li-ion
- IP5306系 18650充電・5V電源管理モジュール
- TPS63802 昇降圧DC/DC
- P-MOSFET逆流防止回路

## センサー

- SCD41
- SGP41
- SPS30
- LTR390
- BME680
- HLK-LD2410C
- ICS-43434

## ストレージ

- microSD

## GPIO拡張

- MCP23017

## RTC

- I2C接続RTC
- 型番未確定

---

# 表示思想

表示装置は、据置型・静的表示・電子的掛軸という思想との整合性から、E-Paper を主軸として進める。

## 主軸

- 7.5inch 800×480 E-Paper
- XIAO ePaper Breakout Board V2

## E-Paperを優先する理由

- 非発光
- 低頻度更新
- 電子的掛軸
- 静的表現
- 長時間表示
- 常時アニメーションを前提にしない

LCD案は主軸から外す。必要が生じた場合のみ再評価する。

---

# GPIO方針

## 使用可

- 2.54mmピッチヘッダー
- 背面ランド

## 使用禁止

- 1.27mm側面ランド

## 背面ランド利用

ICS-43434 の I2S 接続には、XIAO ESP32S3 Plus の背面ランドを使用する。

```text
MTCK(GPIO39) → BCLK
MTDO(GPIO40) → WS
MTDI(GPIO41) → DATA
MTMS(GPIO42) → 予備
```

---

# 電源方針

据置型のため、通常稼働はUSB給電を基本とする。USB給電喪失時のみ18650からの給電へ自動移行するUPS的構成を採用する。

```text
USB-C入力
↓
IP5306系 18650充電・5V電源管理
↓ 5V
TPS63802
↓ 3.3V
P-MOSFET逆流防止回路
↓
3.3V BUS
```

## 設計目標

- 常時USB給電
- 停電時自動切替
- 手動切替なし
- UPS的運用
- XIAOのUSB接続時に外部3.3V系からPC側へ逆流しないこと

TP4056単体構成はUPS用途に不向きなため、現時点の主構成から外す。

---

# 現在の進捗

## 完了済み

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

## 現在の到達点

```text
XIAO ESP32S3 Plus
↓ DeepSleep起床
Wi-Fi接続
↓
HTTPS POST
↓
GAS WebApp
↓
Spreadsheet RawLogs
↓
DeepSleep
```

周期送信PoCは、`boot_count` 1 から 66 まで継続して確認済み。

---

# リポジトリ構成案

```text
docs/
├── 00_CONCEPT/
├── 10_REQUIREMENTS/
├── 20_ARCHITECTURE/
├── 30_HARDWARE/
├── 40_FIRMWARE/
├── 50_GAS/
├── 60_DATA/
├── 70_UI/
├── 80_OPERATIONS/
└── 90_DECISIONS/

firmware/
gas/
assets/
tools/
```

---

# 重要方針

## README を設計書化しない

README.md は入口文書とする。詳細設計、判断、運用情報は各ドキュメントへ責務分離する。

## GAS 中央集権構成

ESP32 は観測端末に徹し、データ集約、AI連携、状態推定、Config配信は GAS 側で行う。

## 長期運用前提

本プロジェクトは短期デモではなく、長期観測運用を前提とする。

そのため以下を重視する。

- ログ寿命
- Spreadsheet肥大化
- 通信断
- キャッシュ
- 保守性
- 省電力
- 復旧性
- 電源監視

---

# 現在の状況

現在の進行状況は以下を参照する。

- CURRENT_STATUS.md

---

# ロードマップ

長期ロードマップは以下を参照する。

- ROADMAP.md

---

# ハードウェア概要

ハードウェア構成は以下を参照する。

- 01_HARDWARE_OVERVIEW.md

---

# 配線方針

配線方針は以下を参照する。

- 05_WIRING_DIAGRAM.md

---

# 設計判断記録

重要設計判断は以下に記録する。

- docs/90_DECISIONS/

---

# 注意事項

本プロジェクトは設計・試作段階である。

以下は未確定である。

- RTC型番
- RTC選定理由
- P-MOSFET型番
- IP5306実モジュール仕様
- OTA方針
- オフライン時挙動
- 電源喪失時の保存・復旧挙動
- 筐体設計
- AI Prompt構造
- ESP32側retry方針
- Spreadsheet長期運用方針

---

# License

TBD


---

# 2026-06-19 採択事項反映

## RTC

RTCは以下を採択済みとする。

- DS3231
- AT24C32
- CR2032

従来の「I2C接続RTC・型番未確定」記述は更新する。

---

## 背面UI

前面E-Paperは表示専用とする。

背面に以下を追加する。

- OLED 128×96
- SSD1315優先
- 3ポジションダイヤルスイッチ

用途

- 設定
- 診断
- 保守

---

## Calendar Subsystem

暦情報管理をGAS側へ集約する。

追加シート

- source_config
- solar_term_master
- season_dictionary
- calendar_master

### 情報源

| 情報 | 取得元 |
|------|--------|
| 祝日 | 内閣府 |
| 二十四節気 | 国立天文台 |
| 七十二候名称 | 固定マスタ |
| 七十二候の読み・解説・キーワード | source_config管理URL |

### エラー方針

- 推測禁止
- 前回値流用禁止
- error_log記録
- 「取得できません」表示

---

## Poem Subsystem

Gemini API Free Tier を採択する。

用途

- 今日の詩

入力

- calendar_master
- 観測データ

出力

- poem_cache

制約

- 1日1回生成
- 表示時再生成禁止

### AI禁止事項

- 暦情報生成
- 暦情報推定
- 欠損補完

---

## UTF-8・フォント

採択

- UTF-8
- Noto Sans JP

---

## Spreadsheet構成更新

観測系

- observation_log
- event_log
- error_log
- system_log

暦系

- source_config
- solar_term_master
- season_dictionary
- calendar_master

AI系

- poem_cache

---

## 現在の最優先タスク

1. Spreadsheet構成確定
2. GAS本実装
3. Calendar Subsystem実装
4. Poem Subsystem実装
5. ESP32統合試験
