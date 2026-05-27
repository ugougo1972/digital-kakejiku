# CURRENT_STATUS.md

# digital-kakejiku 現在状況

最終更新: 2026-05-27

---

# 1. プロジェクト状態

現在は：

```text
Phase 1.5 : GAS通信PoC成功後の安定化フェーズ
```

です。

GAS WebApp への外部POST、Spreadsheet追記、JSON保存まで成立しました。
現在は、ESP32-S3 からのHTTPS POST実装へ進む前に、GAS受信側のhardeningとGitHub管理を進める段階です。

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

# 4. 表示装置状況

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

# 5. GAS方針

GAS は単なる中継ではなく、

- API Gateway
- ログ管理
- Prompt生成
- 状態推定
- Config配信

を担う中央制御層として設計予定。

---

# 6. GAS PoC状況

## 完了済み

以下の通信経路が成立済みです。

```text
GAS WebApp
↓
外部POST
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

## 確認データ例

```json
{
  "device_id": "dk-test-hardening-001",
  "temperature": 24.8,
  "humidity": 51.2,
  "pressure": 1011.8,
  "rssi": -60,
  "battery": 4
}
```

---

# 7. Spreadsheet方針

責務分離を行う。

## 現在作成済み

- RawLogs

## 想定シート

- RawLogs
- ContextLogs
- GeminiLogs
- DeviceStatus
- Config

## RawLogs 現在項目

現時点では、以下の形式で記録しています。

```text
timestamp
device_id
temperature
humidity
pressure
rssi
battery
raw_json
```

---

# 8. GitHub管理状況

## 作成済み

- README.md
- CURRENT_STATUS.md
- ROADMAP.md
- 90_DECISIONS

## 次に追加する候補

```text
gas/src/Code.gs
```

現段階では、Apps Script側の `Code.gs` をコピーし、
GitHub上で `gas/src/Code.gs` として管理する方針です。

`clasp` は将来候補ですが、現時点では必須ではありません。

---

# 9. 現在の重要未確定事項

- LCD / E-Paper 最終採択
- mmWave採用有無
- OTA方針
- オフライン時挙動
- キャッシュ戦略
- 電源構成
- AI Prompt構造
- `secret` の最終管理方法
- ESP32側のretry方針
- Spreadsheet長期運用時の分割・退避方針

---

# 10. 現在の最優先タスク

## 優先度A

- `gas/src/Code.gs` をGitHubへ追加
- ESP32-S3 から GAS への HTTPS POST 実装
- GAS受信側validationの継続調整
- `secret` の扱い方針整理
- GAS URL再デプロイ・管理手順整理

## 優先度B

- CURRENT_STATUS.md / ROADMAP.md 同期
- Spreadsheet項目定義の整理
- センサ統合準備
- 長期ログ構造検討

## 優先度C

- Display候補比較
- Gemini連携方針整理
- Prompt構造検討

---

# 11. 現時点での技術的リスク

## ESP32側

- HTTPS POST実装
- 証明書・接続安定性
- WiFi再接続処理
- retry設計
- メモリ使用量

## GAS / Spreadsheet側

- GAS timeout
- 長期ログ肥大化
- append性能低下
- URL公開時の不正POST
- secret漏洩時の再デプロイ対応

## AI側

- APIコスト
- 文体固定化
- 長期運用時の単調化

---

# 12. 現在の推奨次アクション

```text
1. hardening済み Code.gs を gas/src/Code.gs としてGitHub保存
2. ESP32-S3 → GAS HTTPS POST 実装
3. ESP32実機から RawLogs 追記確認
4. Spreadsheet項目定義の固定
5. センサ統合
6. Gemini連携
7. Display PoC
```

---

# 13. 注意事項

本プロジェクトでは：

- README を設計書化しない
- 推測を事実として扱わない
- 設計判断を Decision として記録する

ことを重要方針とする。

## Apps Script運用注意

Apps Script は保存のみでは WebApp に反映されない。

変更後は必ず：

```text
保存
↓
デプロイを管理
↓
編集
↓
バージョン：新しいバージョン
↓
デプロイ
```

を実施する。

## WebApp URL注意

GAS URLは一度チャット上で共有済みのため、
必要に応じて再デプロイURL更新を検討する。

## `doPost(e)` 注意

`doPost(e)` は外部HTTP POST用です。
Apps Script画面から直接実行しても、通常は `e.postData.contents` が存在しないため、
Spreadsheet追記確認には PowerShell POST または `testDoPost()` を使う。
