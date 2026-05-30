# CURRENT_STATUS.md

# digital-kakejiku 現在状況

最終更新: 2026-05-30

---

# 1. プロジェクト状態

現在は：

```text
Phase 2 : ESP32 HTTPS POST / DeepSleep周期送信 PoC 完了
```

です。

PowerShell から GAS WebApp への外部POST、Spreadsheet追記、JSON保存に加え、XIAO ESP32S3 Plus から hardening版 GAS WebApp への HTTPS POST も成立しました。

さらに、DeepSleep を用いた周期起床、Wi-Fi再接続、HTTPS POST、GAS受信、Spreadsheet保存まで確認済みです。

約73分間、`boot_count` 1 から 66 まで継続し、`wakeup_reason` は初回 `OTHER`、2回目以降 `TIMER` として記録されました。

---

# 2. 現時点での主目的

本プロジェクトは、

- 環境状態
- 空気感
- 時系列変化
- 季節感
- AI生成文

を長期蓄積・表示する
「据置型観測装置」の構築を目的としています。

単なるダッシュボードではなく、
静けさ・余白・緩慢な変化・時間性を重視する
据置型観測ガジェットとして設計します。

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
7.5inch E-Paper
```

---

# 4. 開発方針

本プロジェクトでは、
部材選定そのものよりも、
「開発停止を防ぐこと」を重視する。

そのため：

```text
必要部材を粗く先行洗い出し
↓
AliExpress等で先行発注
↓
輸送待ち期間中に
ESP32 / GAS / GitHub整備を進行
```

という並列開発方針を採用する。

また、GitHubドキュメント整備は独立した重要作業として扱う。

---

# 5. 表示装置状況

## E-Paper案を主軸として進行

表示装置は、
据置型・静的表示・電子的掛軸という思想との整合性から、
E-Paper を主軸として進行します。

## 発注済み

- 7.5inch 800×480 E-Paper
- XIAO ePaper Breakout Board V2

## LCD案の扱い

LCD案は、
高解像度・動的UI・LVGL等の可能性はあるものの、
現時点では主軸から外します。

必要が生じた場合のみ再評価します。

---

# 6. UI方針

UIは、
「ジョグダイヤル主体UI」を現在有力候補として進行します。

## 想定構成

- RGB LED付きロータリーエンコーダ
- 大径ノブ
- 押下スイッチ

## 想定操作

- 回転 : 日送り / 項目送り
- 押下 : 決定
- 長押し : メニュー

常時アニメーションよりも、
静的・緩慢・低頻度操作を重視する。

---

# 7. GAS方針

GAS は単なる中継ではなく、

- API Gateway
- ログ管理
- Prompt生成
- 状態推定
- Config配信

を担う中央制御層として設計予定。

---

# 8. GAS / ESP32 通信PoC状況

## 完了済み

以下の通信経路が成立済みです。

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

以下を導入し、PowerShell POST、ESP32 POST、Spreadsheet追記を確認済みです。

- `secret` validation
- `device_id` 必須化
- JSON body validation
- number validation
- structured JSON response
- error response

## 注意点

ESP32側のSerial Monitorでは、Google側リダイレクト処理により `HTTP Code: 400` が表示される場合がありました。

ただし、GAS実行ログおよびSpreadsheet保存は成立しているため、送信・受信・保存経路そのものは成立しています。

今後、ESP32側のHTTP応答処理は以下を整理します。

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

- 18650 Li-ion
- TP4056
- TPS63802

## センサー

- BME280 / BME680 系
- LTR390
- SCD40（候補）
- ENS160（候補）
- PIR人感センサー（候補）

## 表示/UI

- OLED（開発用）
- 7.5inch 800×480 E-Paper
- XIAO ePaper Breakout Board V2
- RGBロータリーエンコーダ

---

# 11. GitHub管理状況

## 作成済み

- README.md
- CURRENT_STATUS.md
- ROADMAP.md
- gas/src/Code.gs
- 90_DECISIONS

## GitHub運用方針

GitHubは単なるコード置場ではなく、

- 設計判断
- 開発方針
- フェーズ管理
- 実装状況

を記録する場として扱う。

また、ドキュメント整備自体を重要開発タスクとして扱う。

---

# 12. 現在の重要未確定事項

- mmWave採用有無
- OTA方針
- オフライン時挙動
- キャッシュ戦略
- AI Prompt構造
- `secret` の最終管理方法
- ESP32側のretry方針
- ESP32側のHTTPリダイレクト処理
- Spreadsheet長期運用方針
- E-Paper表示更新周期

---

# 13. 現在の最優先タスク

## 優先度A

- PoCスケッチ整理
- ESP32側のHTTP応答処理整理
- `secret` 管理方法整理
- センサー実測値への置換
- BME280 / BME680 系データ取得
- バッテリー電圧実測化

## 優先度B

- CURRENT_STATUS.md / ROADMAP.md 同期
- Spreadsheet項目定義整理
- DeviceStatus設計
- DeepSleep周期と送信周期の整理
- HTTPS retry方針整理

## 優先度C

- E-Paper初期表示テスト
- ジョグダイヤルUI移植
- Gemini連携方針整理
- Prompt構造検討
