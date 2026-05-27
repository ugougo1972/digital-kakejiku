# CURRENT_STATUS.md

# digital-kakejiku 現在状況

最終更新: 2026-05-27

---

# 1. プロジェクト状態

現在は：

```text
Phase 1.5 : ESP32 ↔ GAS 通信基盤確立フェーズ
```

です。

GAS WebApp への外部POST、Spreadsheet追記、JSON保存まで成立しました。
現在は、ESP32-S3 から hardening版 GAS WebApp への HTTPS POST 実装を最優先として進行しています。

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

# 3. 現在検討中の主要構成

```text
Sensors
↓
ESP32-S3
↓ HTTPS
Google Apps Script
↓
Google Spreadsheet
↓
Gemini API
↓
E-Paper / LCD
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

## 現在比較中

### LCD案

- 高解像度
- LVGL
- 動的UI
- RGBパラレル接続

### E-Paper案（優勢）

- 非発光
- 静的表示
- 電子的掛軸
- 低頻度更新

現時点では、
思想整合性の観点から E-Paper が優勢。

ただし、表示装置の最終採択はまだ未確定です。
現段階では、表示系よりも通信基盤安定化を優先します。

---

# 6. UI方針

UIは、
「ジョグダイヤル主体UI」を現在有力候補として検討中。

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

# 8. GAS PoC状況

## 完了済み

以下の通信経路が成立済みです。

```text
PowerShell
↓ HTTPS POST
GAS WebApp
↓
Spreadsheet記録
```

## 確認済み項目

- GAS WebApp デプロイ成功
- `doGet()` 応答確認
- `doPost(e)` 外部POST確認
- PowerShell からのPOST成功
- Spreadsheet `RawLogs` への `appendRow()` 成功
- JSON全文保存成功
- Apps Script 実行数確認済み

## hardening版で確認済み

以下を導入し、PowerShell POST と Spreadsheet 追記を確認済みです。

- `secret` validation
- `device_id` 必須化
- JSON body validation
- number validation
- structured JSON response
- error response

---

# 9. Spreadsheet方針

責務分離を行う。

## 現在作成済み

- RawLogs

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

- BME280
- LTR390
- SCD40（候補）
- ENS160（候補）
- PIR人感センサー（候補）

## 表示/UI

- OLED（開発用）
- E-Paper（本命候補）
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

- LCD / E-Paper 最終採択
- mmWave採用有無
- OTA方針
- オフライン時挙動
- キャッシュ戦略
- AI Prompt構造
- `secret` の最終管理方法
- ESP32側のretry方針

---

# 13. 現在の最優先タスク

## 優先度A

- ESP32-S3 から GAS への HTTPS POST 実装
- ESP32 WiFi接続安定化
- HTTPS retry方針整理
- Serial Monitor ベースのログ確認
- 電源安定化

## 優先度B

- CURRENT_STATUS.md / ROADMAP.md 同期
- Spreadsheet項目定義整理
- センサ統合準備
- 長期ログ構造検討

## 優先度C

- Display候補比較
- Gemini連携方針整理
- Prompt構造検討
