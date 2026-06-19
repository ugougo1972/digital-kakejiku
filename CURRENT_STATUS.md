# CURRENT_STATUS.md

# digital-kakejiku 現在状況

最終更新: 2026-06-19

---

## 1. プロジェクト状態

現在は以下の段階である。

```text
Phase 0   : Repository / Documentation 完了
Phase 1   : GAS通信PoC 完了
Phase 1.5 : GAS Hardening / Stabilization 完了
Phase 2   : ESP32 HTTPS POST / DeepSleep周期送信 PoC 完了
Phase 2.5 : UPS電源設計 CONFIRMED
Current   : GAS本実装前の整合性修正・Spreadsheet構成確定
Next      : GAS本実装
```

PowerShell から GAS WebApp への外部POST、Spreadsheet追記、JSON保存に加え、XIAO ESP32S3 Plus から hardening版 GAS WebApp への HTTPS POST も成立済みである。

さらに、DeepSleep を用いた周期起床、Wi-Fi再接続、HTTPS POST、GAS受信、Spreadsheet保存まで確認済みである。

約73分間、`boot_count` 1 から 66 まで継続し、`wakeup_reason` は初回 `OTHER`、2回目以降 `TIMER` として記録された。

ただし、据置型・通常USB給電・UPS運用を採択したため、通常運用ではDeepSleepを主軸にしない。DeepSleep PoCは通信・再起動・継続記録の検証成果として保持する。

---

## 2. 現時点での主目的

本プロジェクトは、以下を長期蓄積・表示する「据置型観測装置」の構築を目的とする。

- 環境状態
- 空気感
- 時系列変化
- 季節感
- 今日の詩
- 電源状態
- 滞在感

単なるダッシュボードではなく、静けさ、余白、緩慢な変化、時間性を重視する据置型観測ガジェットとして設計する。

---

## 3. 設計成熟度

以後、すべての設計判断は以下で管理する。

| 状態 | 意味 |
|---|---|
| PROPOSED | 提案中・検討中 |
| CONFIRMED | 技術採択済み。実装対象 |
| FINALIZED | 実装・運用前提として凍結 |

本書では、実機未検証でも採択済みの構成は `CONFIRMED` と表記する。実装後に変更リスクが十分低いもののみ `FINALIZED` とする。

---

## 4. 現在の主要構成

```text
Sensors
↓
XIAO ESP32S3 Plus
↓ HTTPS POST
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
E-Paper / 背面OLED
```

ESP32側は観測端末に徹し、GAS側をAPI Gateway、ログ管理、暦管理、詩生成、状態推定、Config配信の中心に置く。

---

## 5. 開発方針

本プロジェクトでは、部材選定そのものよりも「開発停止を防ぐこと」を重視する。

```text
必要部材を粗く先行洗い出し
↓
AliExpress等で先行発注
↓
輸送待ち期間中に
ESP32 / GAS / GitHub整備を進行
```

GitHubドキュメント整備は、独立した重要開発タスクとして扱う。

---

## 6. 表示装置状況

### 前面

表示装置は、据置型・静的表示・電子的掛軸という思想との整合性から、E-Paper を主軸として進行する。

採択済み。

- 7.5inch 800×480 E-Paper
- XIAO ePaper Breakout Board V2

前面E-Paperは表示専用とする。

### 背面

背面UIとして以下を採択する。

- 128×96 OLED
- SSD1315優先
- 3ポジションダイヤルスイッチ

用途は以下に限定する。

- 設定
- 診断
- 保守

### LCD案の扱い

LCD案は、高解像度・動的UI・LVGL等の可能性はあるものの、現時点では主軸から外す。必要が生じた場合のみ再評価する。

---

## 7. UI方針

### 前面UI

- E-Paper表示専用
- 通常操作を求めない
- 低頻度更新
- 日めくり表示を主軸

### 背面UI

- OLED 128×96
- 3ポジションダイヤルスイッチ
- 設定・診断・保守専用

### ロータリーエンコーダ方針

水平ダイヤル式・押下スイッチ付き・RGB LED無しを採択する。

旧記述に存在した「RGB LED付きロータリーエンコーダ」は不採用とする。

---

## 8. GAS方針

GAS は単なる中継ではなく、以下を担う中央制御層として設計する。

- API Gateway
- Payload検証
- 認証
- ログ管理
- Calendar Subsystem
- Poem Subsystem
- Config配信
- DeviceStatus管理
- エラー集計

現在の最優先タスクはGAS本実装である。

---

## 9. GAS / ESP32 通信PoC状況

### 完了済み通信経路

```text
PowerShell
↓ HTTPS POST
GAS WebApp
↓
Spreadsheet記録
```

```text
XIAO ESP32S3 Plus
↓ Wi-Fi
HTTPS POST
↓
GAS WebApp
↓
Spreadsheet記録
```

```text
XIAO ESP32S3 Plus
↓ DeepSleep起床
Wi-Fi再接続
↓
HTTPS POST
↓
GAS WebApp
↓
Spreadsheet記録
↓
DeepSleep
```

### 確認済み項目

- GAS WebApp デプロイ成功
- `doGet()` 応答確認
- `doPost(e)` 外部POST確認
- PowerShell からのPOST成功
- XIAO ESP32S3 Plus からのHTTPS POST成功
- Spreadsheet `RawLogs` への `appendRow()` 成功
- JSON全文保存成功
- Apps Script 実行数確認済み
- DeepSleep周期起床確認
- `boot_count` 継続増加確認
- `wakeup_reason` 保存確認
- Wi-Fi再接続確認
- RSSI保存確認

### hardening版で確認済み

- `secret` validation
- `device_id` 必須化
- JSON body validation
- number validation
- structured JSON response
- error response

### 注意点

ESP32側のSerial Monitorでは、Google側リダイレクト処理により `HTTP Code: 400` が表示される場合があった。

ただし、GAS実行ログおよびSpreadsheet保存は成立しているため、送信・受信・保存経路そのものは成立している。

今後、ESP32側のHTTP応答処理は以下を整理する。

- redirect追従設定
- 成功判定条件
- GAS応答JSONの読み取り方
- エラー時ログ出力

---

## 10. Spreadsheet方針

GAS本実装では、PoC用 `RawLogs` を主構成から外し、以下へ移行する。

| シート | 用途 | 実装優先度 |
|---|---|---:|
| observation_log | 環境観測データ | A |
| event_log | 操作・状態イベント | A |
| error_log | エラー情報 | A |
| system_log | システム状態 | A |
| source_config | 外部情報源管理 | B |
| solar_term_master | 二十四節気マスタ | B |
| season_dictionary | 七十二候辞書 | B |
| calendar_master | 表示用統合カレンダー | B |
| poem_cache | 今日の詩キャッシュ | C |

### PoCで作成済み

- RawLogs

### RawLogsの扱い

`RawLogs` は通信PoCの検証記録である。GAS本実装では参照用として残してもよいが、正式保存先とはしない。

### secretの扱い

PoCではraw JSON内に `secret` が含まれていたが、本実装では保存禁止とする。

---

## 11. 現在想定している主要ハードウェア

### MCU

- XIAO ESP32S3 Plus

### 電源

採択済み。

- 18650 Li-ion
- 18650電池ホルダー
- IP5306系 18650充電・5V電源管理モジュール
- TPS63802 昇降圧DC/DC
- DMG2305UX-13
- PTC

### 電源構成

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
      3.3V電源バス
```

### 電源方針

- 据置型の常時USB給電を基本とする
- USB給電喪失時は18650からの給電へ自動移行するUPS的動作を目指す
- 手動切替は行わず、ヒューマンエラーを機械的に排除する
- 既存の3.3V前提の開発環境を維持するため、TPS63802は継続採用する
- TP4056単体構成はUPS用途に不向きなため、主構成から外す
- XIAOのUSB接続時に外部3.3V系からPC側へ逆流しないよう、DMG2305UX-13を使う

### センサー

- SCD41（CO₂ / 温湿度）
- SGP41（VOC / NOx）
- SPS30（粒子状物質、内蔵ファン前提）
- LTR390（照度 / UV）
- BME680（温湿度 / 気圧 / 補助ガス）
- HLK-LD2410C（人感、初号機ではOUT 1本接続を基本）
- ICS-43434（音環境観測、I2S接続）

### 表示/UI

- 7.5inch 800×480 E-Paper
- XIAO ePaper Breakout Board V2
- 背面OLED 128×96
- SSD1315優先
- 3ポジションダイヤルスイッチ
- 水平ダイヤル式ロータリーエンコーダ、押下スイッチ付き、RGB LED無し

### ストレージ

- microSD

### GPIO拡張

- MCP23017

### RTC

- DS3231
- AT24C32
- CR2032

---

## 12. GPIO方針

### 使用可

- 2.54mmピッチヘッダー
- 背面ランド

### 使用禁止

- 1.27mm側面ランド

### 背面ランド利用

ICS-43434用に以下を使用する。

```text
MTCK(GPIO39) → BCLK
MTDO(GPIO40) → WS
MTDI(GPIO41) → DATA
MTMS(GPIO42) → 予備
```

MCP23017を採用し、ロータリーエンコーダ、ボタン類、補助GPIOを移管する。

---

## 13. Calendar Subsystem状況

採択済み。

### 追加シート

- source_config
- solar_term_master
- season_dictionary
- calendar_master

### 情報源

| 情報 | 取得元 |
|---|---|
| 祝日 | 内閣府 |
| 二十四節気 | 国立天文台 |
| 七十二候名称 | 固定マスタ |
| 七十二候の読み・解説・キーワード | source_config管理URL |

### エラー方針

- 推測禁止
- 前回値流用禁止
- error_log記録
- E-Paperへ「取得できません」表示

---

## 14. Poem Subsystem状況

採択済み。

- Gemini API Free Tier
- 用途は「今日の詩」
- 入力は `calendar_master` と観測データ
- 出力は `poem_cache`
- 1日1回生成
- 表示時再生成禁止

禁止事項は以下である。

- 暦情報生成
- 暦情報推定
- 欠損補完

---

## 15. GitHub管理状況

作成済み主要文書。

- README.md
- CURRENT_STATUS.md
- ROADMAP.md
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

---

## 16. 現在の重要未確定事項

| 項目 | 状態 |
|---|---|
| IP5306実モジュール仕様 | 未確定 |
| LD2410C動作電圧 | 未確定 |
| OLED最終型番 | SSD1315優先、最終型番未確定 |
| 筐体詳細構造 | 未確定 |
| センサー実装位置最終調整 | 未確定 |
| OTA方針 | 未確定 |
| オフライン時挙動 | 未確定 |
| キャッシュ戦略 | 未確定 |
| ESP32側retry方針 | 未確定 |
| ESP32側HTTPリダイレクト処理 | 未確定 |
| Spreadsheet長期運用方針 | 未確定 |
| E-Paper表示更新周期 | 未確定 |
| 電源喪失時の保存・復旧挙動 | 未確定 |

RTC型番、RTC選定方針、P-MOSFET型番、Spreadsheet基本構成は未確定事項から除外する。

---

## 17. 現在の最優先タスク

### 優先度A

1. Spreadsheet構成確定
2. GAS本実装
3. 認証情報のScript Properties移行
4. Payload type分岐実装
5. observation/event/error/system保存実装
6. JSON応答統一
7. PowerShell試験
8. ESP32接続試験

### 優先度B

1. Calendar Subsystem実装
2. source_config整備
3. solar_term_master生成
4. season_dictionary整備
5. calendar_master生成
6. 取得失敗時のerror_log記録

### 優先度C

1. Poem Subsystem実装
2. Gemini API Free Tier接続
3. poem_cache生成
4. 1日1回生成制御
5. 表示時再生成禁止制御

### 優先度D

1. ESP32統合試験
2. E-Paper初期表示
3. 背面OLED初期表示
4. SPI排他制御
5. 長期運用評価

---

## 18. 今回の整合性修正で解消した事項

- RTC未確定記述をDS3231+AT24C32+CR2032採択へ統一
- RGBロータリーエンコーダ前提を不採用へ整理
- `RawLogs` をPoC用暫定シートとして整理
- 正式Spreadsheet構成を `observation_log/event_log/error_log/system_log` 等へ統一
- Gemini用途を「今日の詩」に限定
- Calendar SubsystemでのAI推定禁止を明記
- secret保存禁止を明記
- GAS本実装を最優先タスクへ再設定
