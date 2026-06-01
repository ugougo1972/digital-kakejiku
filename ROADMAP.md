# ROADMAP.md

# digital-kakejiku Roadmap

最終更新: 2026-06-01

---

# Phase 0 : Repository / Documentation

## 目的

設計散逸防止。

## 実施内容

- GitHub Repository 初期化
- README.md 作成
- CURRENT_STATUS.md 作成
- ROADMAP.md 作成
- docs Tree 整備
- 01_HARDWARE_OVERVIEW.md 作成
- 05_WIRING_DIAGRAM.md 作成
- gas/src/Code.gs 配置

## 状態

完了。

---

# Phase 1 : GAS通信PoC

## 目的

ESP32 ⇔ GAS ⇔ Spreadsheet 通信基盤確立。

## 実施内容

- GAS WebApp 作成
- doGet / doPost 実装
- 外部POST確認
- Spreadsheet append確認
- JSON保存確認
- PowerShellからのPOST確認

## 状態

完了。

---

# Phase 1.5 : GAS Hardening / Stabilization

## 目的

ESP32実装前に、GAS受信側の安全性・検証性・保守性を高める。

## 実施内容

- secret validation
- device_id 必須化
- JSON validation
- number validation
- structured JSON response
- エラー応答整理
- Code.gs のGitHub保存
- PowerShell POSTとの整合確認

## 状態

完了。

## 判定

ESP32からhardening版GASへのPOSTとSpreadsheet保存が成立したため、完了扱いとする。

---

# Phase 2 : ESP32 HTTPS POST / DeepSleep周期送信

## 目的

実機ESP32からGAS WebAppへ観測データを送信し、DeepSleepを用いた周期送信の基礎を確認する。

## 実施内容

- Wi-Fi接続
- HTTPS POST
- JSON生成
- secret付与
- device_id付与
- GAS応答確認
- Spreadsheet記録確認
- 通信失敗時ログ出力
- DeepSleep設定
- timer wakeup
- boot_count保持
- wakeup_reason記録
- 起床後Wi-Fi再接続
- 起床後POST
- Spreadsheetへの周期保存確認

## 状態

PoC完了。

## 確認済み

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

約73分間、`boot_count` 1 から 66 までの継続記録を確認済み。

初回の `wakeup_reason` は `OTHER`、2回目以降は `TIMER` として記録済み。

## 注意点

ESP32側のSerial Monitorでは、Google側リダイレクト処理により `HTTP Code: 400` が表示される場合がある。

ただし、GAS実行ログとSpreadsheet保存は成立しているため、通信・受信・保存の主経路は成立済み。

## 残タスク

- ESP32側HTTP応答処理の整理
- redirect追従設定の整理
- 成功判定条件の整理
- 通信失敗時のretry方針検討
- secret管理方針整理
- Wi-Fi再接続戦略整理
- PoCスケッチ整理

## 判定

主要完了条件は満たしたため、Phase 2はPoC完了扱いとする。残タスクは運用安定化タスクとして継続管理する。

---

# Phase 2.5 : 電源系UPS設計

## 目的

据置型・常時USB給電を基本としつつ、USB給電喪失時に18650へ自動移行するUPS的電源構成を確立する。

## 採択済み構成

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

## 実施内容

- 18650採択
- 18650電池ホルダー採択
- IP5306系モジュール採択
- TPS63802継続採用
- UPS的動作方針決定
- P-MOSFET逆流防止方式採択
- 手動切替なしの電源構成採択
- TP4056単体案を主構成から除外

## 残タスク

- IP5306系モジュールの端子仕様確認
- TPS63802入力・出力配線確認
- P-MOSFET型番選定
- P-MOSFETの向き、ゲート処理、プル抵抗の設計
- XIAO USB接続時の逆流防止確認
- USB給電中の通常動作確認
- USB抜去時の18650バックアップ動作確認
- USB復帰時の動作確認
- 長時間連続運転試験

## 完了条件

- USB給電時にXIAOとセンサー群が3.3V系で安定動作すること
- USB抜去時に18650由来電源へ自動移行すること
- USB復帰時に通常給電へ戻ること
- XIAOのUSB接続時に外部3.3V系からPC側へ逆流しないこと
- 手動切替なしで開発・運用できること

## 状態

設計方針決定。実機配線・評価は未実施。

---

# Phase 3 : センサ統合

## 目的

固定値送信から実測値送信へ移行し、観測基盤を構築する。

## 対象センサー

### 優先度A

- SCD41
- SGP41
- SPS30
- BME680
- LTR390
- HLK-LD2410C
- ICS-43434

### 優先度B

- Battery Monitor
- WiFi RSSI

## 方針

センサーは「手元にあるものから順次潰す」方針とする。

まずは固定値を実測値へ置換し、DeepSleep周期送信の枠組みを維持したまま確認する。

## 完了条件

- 実測値取得
- 実測値POST
- Spreadsheet保存
- 異常時処理
- センサー未接続時の処理確認

---

# Phase 3.5 : 音環境観測

## 目的

ICS-43434 を用いて音環境を数値化し、空間の状態変化を観測対象に加える。

## 採択

- ICS-43434

## GPIO

```text
MTCK(GPIO39) → BCLK
MTDO(GPIO40) → WS
MTDI(GPIO41) → DATA
MTMS(GPIO42) → 予備
```

## タスク

- I2S受信PoC
- RMS取得
- Peak取得
- dB換算値の試算
- 音圧推定
- 校正方法決定
- Spreadsheet保存

## 現段階で行わないこと

- 音声保存
- 音声認識
- FFT高度解析

---

# Phase 4 : データ設計

## 目的

長期運用破綻回避。

## 実施内容

- Spreadsheet責務分離
- カラム固定
- retention検討
- 月次ローテーション設計
- RawLogs schema固定
- ContextLogs schema検討
- GeminiLogs schema検討
- DeviceStatus schema検討
- Config schema検討
- raw JSON保存方針整理
- boot_count / wakeup_reason の扱い整理

## 状態

未着手。

---

# Phase 5 : GAS高度化

## 目的

GASを中央制御層化する。

## 実施内容

- 状態集約
- AI Prompt生成
- Device状態管理
- Config配信
- キャッシュ制御
- 要約生成
- エラー集計
- DeviceStatus更新
- Gemini API連携

## 状態

未着手。

---

# Phase 6 : E-Paper統合

## 目的

観測情報をE-Paperへ静的・低頻度に表示する。

## 採択

- 7.5inch 800×480 E-Paper
- XIAO ePaper Breakout Board V2

## UI方針

- 静的
- 緩慢
- 非常時のみ強調
- 常時アニメーション抑制
- 日めくりカレンダー的表示

## 実施内容

- E-Paper初期化
- 全画面更新テスト
- 部分更新可否確認
- 描画速度確認
- UIレイアウト検討
- 日めくり表示試作

## 状態

未着手。

---

# Phase 7 : UI統合

## 目的

ジョグダイヤル主体UIを実装し、据置型観測器としての操作系を確立する。

## 採択

- RGBロータリーエンコーダ
- MCP23017

## 実施内容

- ジョグダイヤル操作
- 回転方向判定
- 押下検出
- 長押し検出
- メニュー構造
- 状態遷移
- E-Paper表示との連携

## 状態

未着手。

---

# Phase 8 : 長期運用

## 目的

据置型観測器として長時間・長期間運用できる状態にする。

## 実施内容

- OTA検討
- キャッシュ
- オフライン運用
- リトライ制御
- 電源監視
- IP5306運用確認
- TPS63802 3.3V安定性確認
- P-MOSFET逆流防止確認
- 18650運用最適化
- バッテリー電圧監視
- 送信失敗時の再送方針

## 状態

未着手。

---

# Phase 9 : 筐体化

## 目的

陶器または据置型筐体へ実装し、実運用可能な物理構成へ移行する。

## 実施内容

- 据置型筐体
- 通気設計
- センサー配置
- ノブ固定
- E-Paper固定
- 放熱確認
- ケーブル整理
- 18650固定
- USB給電/充電経路整理
- IP5306 / TPS63802 / P-MOSFET実装部の固定

## 状態

未着手。

---

# 現在の最優先タスク

1. UPS実機評価
2. ICS-43434 PoC
3. BME680実測値取得
4. E-Paper初期表示
5. UI移植
6. GPIO最終確定
7. ドキュメント同期
