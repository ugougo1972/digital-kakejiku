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

PowerShell→GAS→Spreadsheet、ESP32→GAS→Spreadsheet の通信PoCは完了している。

DeepSleep周期送信PoCも完了済みであり、約73分間の継続記録を確認済みである。

ただし据置型・常時給電・UPS運用を採択したため、通常運用ではDeepSleepを主軸としない。

---

## 2. フェーズ管理方針

査読指摘を反映し、旧Phase体系と現行Phase体系の関係を明示する。

| 旧体系 | 状態 | 現行位置付け |
|---|---|---|
| Phase0 | 完了 | 履歴 |
| Phase1 | 完了 | 履歴 |
| Phase1.5 | 完了 | 履歴 |
| Phase2 | 完了 | 履歴 |
| Phase2.5 | CONFIRMED | 技術採択済み |
| Current | GAS本実装 | 現行Phase1相当 |

現行ロードマップでは以下を採用する。

1. GAS基盤本実装
2. Calendar Subsystem
3. ESP32統合
4. Poem Subsystem
5. 長期運用評価
6. 筐体化

---

## 3. 設計成熟度

| 状態 | 意味 |
|---|---|
| PROPOSED | 提案中 |
| CONFIRMED | 採択済み |
| FINALIZED | 凍結済み |

---

## 4. 現時点での主目的

据置型環境観測装置として以下を長期保存・表示する。

- 環境状態
- 季節情報
- 暦情報
- 今日の詩
- 電源状態
- 滞在感

---

## 5. 採択済み主要構成

### MCU

- XIAO ESP32S3 Plus

### センサー

- SCD41
- SGP41
- SPS30
- LTR390
- BME680
- HLK-LD2410C
- ICS-43434

### 表示

前面

- 7.5inch 800×480 E-Paper
- XIAO ePaper Breakout Board V2

背面

- OLED 128×96
- SSD1315優先
- 3ポジションダイヤルスイッチ

### ストレージ

- microSD

### GPIO拡張

- MCP23017

### RTC

- DS3231
- AT24C32
- CR2032

---

## 6. 電源構成状況

採択済み。

- 18650
- IP5306
- DMG2305UX-13
- TPS63802
- ポリスイッチ

### 電源方針

- UPS方式採択
- 通常時USB給電
- 停電時18650給電
- 自動切替

### 補足

自動切替は電源回路によるUPS動作を指す。

PowerManagerは切替を行うのではなく、状態監視とログ記録を担当する。

---

## 7. UI方針

### 前面

- E-Paper表示専用
- 日めくり表示主体
- 低頻度更新

### 背面

- OLED 128×96
- 設定
- 診断
- 保守

### 入力系

- 水平ダイヤル式ロータリーエンコーダ
- 押下スイッチ付き
- RGB無し

---

## 8. GAS方針

GASは以下を担当する。

- API Gateway
- Payload検証
- 認証
- Spreadsheet保存
- Calendar Subsystem
- Poem Subsystem
- Config管理
- エラー集計

現在の最優先タスクはGAS本実装である。

---

## 9. 通信PoC状況

完了済み。

- doGet
- doPost
- PowerShell試験
- ESP32 HTTPS POST
- Spreadsheet保存
- DeepSleep周期送信

---

## 10. SPI排他制御状況

仕様策定済み。

対象。

- E-Paper
- microSD

方針。

- 同時アクセス禁止
- Storage優先
- ResourceManager管理

詳細は 09_SPI_RESOURCE_CONTROL.md を正とする。

---

## 11. GPIO方針

使用可。

- 2.54mmヘッダー
- 背面ランド

使用禁止。

- 1.27mm側面ランド

ICS-43434用。

```text
GPIO39 BCLK
GPIO40 WS
GPIO41 DATA
GPIO42 予備
```

---

## 12. Calendar Subsystem状況

採択済み。

追加シート。

- source_config
- solar_term_master
- season_dictionary
- calendar_master

方針。

- GAS側実装
- AIによる暦生成禁止
- 推測禁止
- 前回値流用禁止

取得失敗時。

- error_log記録
- 「取得できません」表示

---

## 13. Poem Subsystem状況

採択済み。

- Gemini API Free Tier
- poem_cache
- 1日1回生成
- 表示時再生成禁止

用途。

- 今日の詩

禁止。

- 暦生成
- 暦推定
- 欠損補完

---

## 14. GitHub管理状況

作成済み。

- README.md
- CURRENT_STATUS.md
- ROADMAP.md
- docs/01～11

---

## 15. 現在の重要未確定事項

| 項目 | 状態 |
|---|---|
| IP5306実モジュール仕様 | 未確定 |
| OLED最終型番 | 未確定 |
| LD2410C最終電源条件 | 未確定 |
| OTA方針 | 未確定 |
| ESP32 retry方針 | 未確定 |
| Spreadsheet長期運用方針 | 未確定 |
| E-Paper更新周期 | 未確定 |
| キャッシュ戦略 | 未確定 |
| Gemini API運用戦略 | 未確定 |
| オフライン時挙動 | 未確定 |

RTC構成、UPS構成、Calendar採択、Poem採択は未確定事項から除外する。

---

## 16. 現在の最優先タスク

### クリティカルパス

```text
Spreadsheet構成確定
        ↓
GAS本実装
        ↓
ESP32接続試験
        ├─ Calendar Subsystem
        ├─ Poem Subsystem
        └─ UPS実機評価
```

### 優先度A（現行Phase1）

1. Spreadsheet構成確定
2. GAS本実装
3. Script Properties移行
4. Payload type分岐
5. observation/event/error/system保存
6. JSON応答統一
7. PowerShell試験
8. ESP32接続試験

### 優先度B

1. Calendar Subsystem実装
2. Poem Subsystem実装
3. SPI統合試験
4. E-Paper表示試験

### 優先度C

1. UPS実機評価
2. 長期運用評価
3. 筐体設計

---

## 17. STATUS

| 項目 | 状態 |
|---|---|
| UPS方式 | CONFIRMED |
| DS3231+AT24C32 | CONFIRMED |
| Calendar Subsystem | CONFIRMED |
| Poem Subsystem | CONFIRMED |
| AI暦生成禁止 | FINALIZED |
| SPI排他制御 | CONFIRMED |
| IP5306実機評価 | PROPOSED |
| Gemini運用詳細 | PROPOSED |

---

## 18. CHANGE LOG

| 日付 | 内容 | 理由 |
|---|---|---|
| 2026-06-19 | 査読反映 | Phase体系整理、STATUS追加 |
| 2026-06-19 | Calendar/Poem責務明確化 | GAS側実装を明示 |
| 2026-06-19 | タスク依存関係追加 | 優先順位の明確化 |
