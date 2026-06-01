# CURRENT_STATUS.md

# digital-kakejiku 現在状況

最終更新: 2026-06-01

---

# 1. プロジェクト状態

現在は以下の段階である。

```text
Phase 2   : ESP32 HTTPS POST / DeepSleep周期送信 PoC 完了
Phase 2.5 : UPS電源設計確定・実機評価準備
Phase 3   : センサー実測値取得準備
```

PowerShell から GAS WebApp への外部POST、Spreadsheet追記、JSON保存に加え、XIAO ESP32S3 Plus から hardening版 GAS WebApp への HTTPS POST も成立済み。

さらに、DeepSleep を用いた周期起床、Wi-Fi再接続、HTTPS POST、GAS受信、Spreadsheet保存まで確認済みである。

約73分間、`boot_count` 1 から 66 まで継続し、`wakeup_reason` は初回 `OTHER`、2回目以降 `TIMER` として記録された。

---

# 2. 現時点での主目的

本プロジェクトは、以下を長期蓄積・表示する「据置型観測装置」の構築を目的とする。

- 環境状態
- 空気感
- 時系列変化
- 季節感
- AI生成文
- 電源状態
- 滞在感

単なるダッシュボードではなく、静けさ、余白、緩慢な変化、時間性を重視する据置型観測ガジェットとして設計する。

---

# 3. 現在の主要構成

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

ESP32側は観測端末に徹し、GAS側をAPI Gateway、ログ管理、状態推定、AI連携、Config配信の中心に置く。

---

# 4. 開発方針

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

# 5. 表示装置状況

## E-Paper案を主軸として進行

表示装置は、据置型・静的表示・電子的掛軸という思想との整合性から、E-Paper を主軸として進行する。

## 発注・採択済み

- 7.5inch 800×480 E-Paper
- XIAO ePaper Breakout Board V2

## LCD案の扱い

LCD案は、高解像度・動的UI・LVGL等の可能性はあるものの、現時点では主軸から外す。必要が生じた場合のみ再評価する。

---

# 6. UI方針

UIは「ジョグダイヤル主体UI」を現在有力候補として進行する。

## 想定構成

- RGB LED付きロータリーエンコーダ
- 大径ノブ
- 押下スイッチ

## 想定操作

- 回転 : 日送り / 項目送り
- 押下 : 決定
- 長押し : メニュー

常時アニメーションよりも、静的・緩慢・低頻度操作を重視する。

---

# 7. GAS方針

GAS は単なる中継ではなく、以下を担う中央制御層として設計する。

- API Gateway
- ログ管理
- Prompt生成
- 状態推定
- Config配信
- DeviceStatus管理
- エラー集計

---

# 8. GAS / ESP32 通信PoC状況

## 完了済み通信経路

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

## 確認済み項目

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

## hardening版で確認済み

- `secret` validation
- `device_id` 必須化
- JSON body validation
- number validation
- structured JSON response
- error response

## 注意点

ESP32側のSerial Monitorでは、Google側リダイレクト処理により `HTTP Code: 400` が表示される場合があった。

ただし、GAS実行ログおよびSpreadsheet保存は成立しているため、送信・受信・保存経路そのものは成立している。

今後、ESP32側のHTTP応答処理は以下を整理する。

- redirect追従設定
- 成功判定条件
- GAS応答JSONの読み取り方
- エラー時ログ出力

---

# 9. Spreadsheet方針

責務分離を行う。

## 現在作成済み

- RawLogs

## RawLogsで確認済みの保存項目

- timestamp
- device_id
- temperature
- humidity
- pressure
- rssi
- battery
- raw JSON

## raw JSON内で確認済みの追加項目

- secret
- boot_count
- wakeup_reason

## 想定シート

- RawLogs
- ContextLogs
- GeminiLogs
- DeviceStatus
- Config

---

# 10. 現在想定している主要ハードウェア

## MCU

- XIAO ESP32S3 Plus

## 電源

### 採択済み

- 18650 Li-ion
- 18650電池ホルダー
- IP5306系 18650充電・5V電源管理モジュール
- TPS63802 昇降圧DC/DC
- P-MOSFET逆流防止回路

### 電源構成

```text
USB-C入力
↓
IP5306系 18650充電・5V電源管理
↓ 5V
TPS63802
↓ 3.3V
P-MOSFET逆流防止回路
↓
3.3V電源バス
↓
XIAO ESP32S3 Plus / センサー群
```

### 電源方針

- 据置型の常時USB給電を基本とする
- USB給電喪失時は18650からの給電へ自動移行するUPS的動作を目指す
- 手動切替は行わず、ヒューマンエラーを機械的に排除する
- 既存の3.3V前提の開発環境を維持するため、TPS63802は継続採用する
- TP4056単体構成はUPS用途に不向きなため、現時点の主構成から外す
- XIAOのUSB接続時に外部3.3V系からPC側へ逆流しないよう、P-MOSFET逆流防止回路を入れる

## センサー

- SCD41（CO2 / 温湿度）
- SGP41（VOC / NOx）
- SPS30（粒子状物質、内蔵ファン前提）
- LTR390（照度 / UV）
- BME680（温湿度 / 気圧 / 補助ガス）
- HLK-LD2410C（人感、初号機ではOUT 1本接続を基本）
- ICS-43434（音環境観測、I2S接続）

## 表示/UI

- OLED（開発用）
- 7.5inch 800×480 E-Paper
- XIAO ePaper Breakout Board V2
- RGBロータリーエンコーダ

## ストレージ

- microSD

## GPIO拡張

- MCP23017

## RTC

- I2C接続RTCを搭載する
- 型番は未確定

---

# 11. GPIO方針

## 使用可

- 2.54mmピッチヘッダー
- 背面ランド

## 使用禁止

- 1.27mm側面ランド

## 背面ランド利用

ICS-43434用に以下を使用する。

```text
MTCK(GPIO39) → BCLK
MTDO(GPIO40) → WS
MTDI(GPIO41) → DATA
MTMS(GPIO42) → 予備
```

MCP23017を採用し、ロータリーエンコーダ、ボタン類、補助GPIOを移管する。

---

# 12. GitHub管理状況

## 作成済み

- README.md
- CURRENT_STATUS.md
- ROADMAP.md
- gas/src/Code.gs
- docs/90_DECISIONS
- 01_HARDWARE_OVERVIEW.md
- 05_WIRING_DIAGRAM.md

## GitHub運用方針

GitHubは単なるコード置場ではなく、以下を記録する場として扱う。

- 設計判断
- 開発方針
- フェーズ管理
- 実装状況
- 実機評価結果

ドキュメント整備自体を重要開発タスクとして扱う。

---

# 13. 現在の重要未確定事項

- RTC型番
- RTC選定理由
- P-MOSFET型番
- IP5306実モジュール仕様
- OTA方針
- オフライン時挙動
- キャッシュ戦略
- AI Prompt構造
- `secret` の最終管理方法
- ESP32側のretry方針
- ESP32側のHTTPリダイレクト処理
- Spreadsheet長期運用方針
- E-Paper表示更新周期
- 電源喪失時の保存・復旧挙動

---

# 14. 現在の最優先タスク

## 優先度A

- UPS実機評価
- IP5306評価
- TPS63802評価
- P-MOSFET回路評価
- ICS-43434 PoC
- BME680実測値取得
- LTR390実測値取得
- センサー実測値への置換
- センサー実測値取得スケッチ整理
- バッテリー電圧実測化

## 優先度B

- E-Paper初期表示
- ジョグダイヤルUI移植
- GPIO最終確定
- Spreadsheet項目定義整理
- DeviceStatus設計
- DeepSleep周期と送信周期の整理
- HTTPS retry方針整理
- ドキュメント同期

## 優先度C

- Gemini連携方針整理
- Prompt構造検討
- OTA方針検討
- 長期運用評価
