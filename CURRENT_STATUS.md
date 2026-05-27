# CURRENT_STATUS.md

# digital-kakejiku 現在状況

最終更新: 2026-05-27

---

# 1. プロジェクト状態

現在は：

```text
設計初期フェーズ
```

です。

まだ実装本格着手前であり、
思想整理・構成整理・技術検証方針策定を進めています。

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
Display Device
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

# 6. Spreadsheet方針

責務分離を行う。

## 想定シート

- RawLogs
- ContextLogs
- GeminiLogs
- DeviceStatus
- Config

---

# 7. 現在の重要未確定事項

- LCD / E-Paper 最終採択
- mmWave採用有無
- OTA方針
- オフライン時挙動
- キャッシュ戦略
- 電源構成
- AI Prompt構造

---

# 8. 現在の最優先タスク

## 優先度A

- GitHub構成整理
- ドキュメント整備
- GAS通信PoC準備

## 優先度B

- センサ選定
- Display候補比較
- 長期ログ構造検討

---

# 9. 現時点での技術的リスク

## ESP32側

- 高解像度描画負荷
- メモリ使用量
- WiFi安定性

## GAS / Spreadsheet側

- 長期ログ肥大化
- GAS timeout
- append性能低下

## AI側

- APIコスト
- 文体固定化
- 長期運用時の単調化

---

# 10. 現在の推奨次アクション

```text
1. XIAO → GAS HTTPS通信
2. Spreadsheet記録
3. センサ統合
4. Gemini連携
5. Display PoC
```

---

# 11. 注意事項

本プロジェクトでは：

- README を設計書化しない
- 推測を事実として扱わない
- 設計判断を Decision として記録する

ことを重要方針とする。
