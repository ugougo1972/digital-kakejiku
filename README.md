# digital-kakejiku

静かに空間を観測し、
時間と環境の変化を記録する、
据置型デジタル観測装置。

本プロジェクトは、
ESP32 / Google Apps Script / Gemini / E-Paper 等を用いて、

- 環境状態
- 空気感
- 季節感
- 滞在感
- AI生成文
- 時系列変化

を長期的に蓄積・可視化することを目的としています。

---

# コンセプト

digital-kakejiku は、
単なる情報表示端末ではありません。

本装置は：

- 静けさ
- 余白
- 時間性
- 空気感
- 緩慢な変化

を重視した、
「個人的観測装置」です。

高FPS・派手な演出・常時アニメーションよりも、

- 静止
- 季節変化
- 文脈
- 微細な環境変動

を重視します。

---

# 現時点での構成案

現時点では、
以下構成を中心に検討を進めています。

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

# 想定機能

## 環境観測

- 温度
- 湿度
- 気圧
- CO2
- 照度
- 音環境
- 人感 / 気配
- WiFi RSSI
- 電源状態

等を継続観測。

---

## AI生成コンテキスト

収集データを単純表示するのではなく、

- 時間帯
- 季節
- 空間変化
- 環境推移

を踏まえ、
Gemini により文章生成を行います。

---

# 表示思想

表示装置は、
据置型・静的表示・電子的掛軸という思想との整合性から、
E-Paper を主軸として進めます。

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

LCD案は主軸から外しますが、
必要が生じた場合は再評価します。

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

この周期送信PoCは、
`boot_count` 1 から 66 まで継続して確認済みです。

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

README.md は入口文書です。

詳細設計・判断・運用情報は、
各ドキュメントへ責務分離します。

---

## GAS 中央集権構成

ESP32 は「観測端末」に徹し、
データ集約・AI連携・状態推定は GAS 側で行います。

---

## 長期運用前提

本プロジェクトは短期デモではなく、
長期観測運用を前提としています。

そのため：

- ログ寿命
- Spreadsheet肥大化
- 通信断
- キャッシュ
- 保守性
- 省電力
- 復旧性

を重視します。

---

# 現在の状況

現在の進行状況は：

- CURRENT_STATUS.md

を参照してください。

---

# ロードマップ

長期ロードマップは：

- ROADMAP.md

を参照してください。

---

# 設計判断記録

重要設計判断は：

- docs/90_DECISIONS/

に記録します。

---

# 注意事項

本プロジェクトは現在設計・試作段階です。

以下は未確定です。

- mmWave採用有無
- OTA方針
- オフライン時挙動
- 電源構成
- 筐体設計
- AI Prompt構造
- ESP32側retry方針
- Spreadsheet長期運用方針

---

# License

TBD
