# ROADMAP.md

# digital-kakejiku Roadmap

最終更新: 2026-06-19

---

## 1. ロードマップ方針

本ロードマップは、過去PoC成果を保持しつつ、現行のGAS中心アーキテクチャへ再整理した実装計画を示す。

査読指摘を反映し、旧Phase体系と現行Phase体系の対応関係を明示する。

現在の最優先はハードウェア追加検証ではなく、GAS本実装およびCalendar/Poem基盤整備である。

---

## 2. Phase体系

### 現行Phase体系

| Phase | 名称 | 状態 |
|---:|---|---|
| 1 | GAS基盤本実装 | 次作業 |
| 2 | Calendar Subsystem | 後続 |
| 3 | ESP32統合 | 後続 |
| 4 | Poem Subsystem | 後続 |
| 5 | 長期運用評価 | 後続 |
| 6 | 筐体化 | 後続 |

### 旧Phase体系との対応

| 旧Phase | 状態 | 現行位置付け |
|---:|---|---|
| Phase0 Repository | 完了 | 履歴 |
| Phase1 GAS通信PoC | 完了 | 履歴 |
| Phase1.5 Hardening | 完了 | 履歴 |
| Phase2 HTTPS POST / DeepSleep PoC | 完了 | 履歴 |
| Phase2.5 UPS設計 | CONFIRMED | 技術採択済み |
| Current | GAS本実装前 | 現行Phase1 |

---

## 3. 完了済み成果（履歴）

### Repository / Documentation

完了。

- GitHub Repository整備
- README
- CURRENT_STATUS
- ROADMAP
- docs整備

### GAS通信PoC

完了。

- doGet
- doPost
- Spreadsheet保存
- PowerShell試験

### GAS Hardening

完了。

- secret validation
- device_id validation
- JSON validation
- structured response

### ESP32 HTTPS POST / DeepSleep PoC

完了。

- HTTPS POST
- DeepSleep周期送信
- boot_count記録
- wakeup_reason記録

---

## 4. 現在位置

```text
Spreadsheet構成確定
        ↓
GAS本実装
        ↓
Calendar Subsystem
        ↓
ESP32統合
        ↓
Poem Subsystem
        ↓
長期運用評価
        ↓
筐体化
```

---

## 5. Phase1 : GAS基盤本実装

### 目的

本番運用用GAS基盤の完成。

### 実施項目

- Spreadsheet構成確定
- observation_log
- event_log
- error_log
- system_log
- source_config
- solar_term_master
- season_dictionary
- calendar_master
- poem_cache

### GAS機能

- 認証
- Payload検証
- type分岐
- Script Properties
- JSON応答統一

### 完了条件

- ESP32接続成功
- シート保存成功
- エラーログ動作確認

---

## 6. Phase2 : Calendar Subsystem

### 目的

暦情報の自動生成。

### 情報源

| 情報 | 取得元 |
|---|---|
| 祝日 | 内閣府 |
| 二十四節気 | 国立天文台系 |
| 七十二候名称 | 固定マスタ |
| 解説 | source_config |

### 制約

- AI生成禁止
- AI推定禁止
- 欠損補完禁止

### エラー時

- error_log記録
- 「取得できません」表示

### 完了条件

- calendar_master生成
- 年次更新確認

---

## 7. Phase3 : ESP32統合

### 対象

- SCD41
- SGP41
- SPS30
- LTR390
- BME680
- HLK-LD2410C
- ICS-43434
- DS3231
- microSD

### 実施項目

- センサー統合
- RTC統合
- SD統合
- GAS送信統合

### 完了条件

- 統合観測成功
- GAS連携成功

---

## 8. Phase4 : Poem Subsystem

### 目的

今日の詩生成。

### 採択事項

- Gemini API Free Tier
- 1日1回生成
- poem_cache保存
- 表示時再生成禁止

### 入力

- calendar_master
- 観測データ

### 出力

- poem_cache

### エラー時

- error_log
- 「取得できません」表示

### 完了条件

- 日次生成成功
- キャッシュ運用確認

---

## 9. Phase5 : 長期運用評価

### 評価項目

- UPS動作
- 通信断復帰
- RTC運用
- SD運用
- Spreadsheet肥大化
- キャッシュ運用

### 完了条件

- 30日以上安定運用

---

## 10. Phase6 : 筐体化

### 実施項目

- E-Paper固定
- 背面OLED固定
- SPS30吸排気
- 通気設計

### 注意

熱設計はDISCUSSION管理とする。

---

## 11. 優先順位

### 優先度A

1. GAS本実装
2. Script Properties移行
3. Payload検証
4. Calendar基盤

### 優先度B

1. ESP32統合
2. SPI統合試験
3. 表示統合

### 優先度C

1. Poem Subsystem
2. 長期運用評価
3. 筐体化

---

## 12. STATUS

| 項目 | 状態 |
|---|---|
| GAS本実装 | CONFIRMED |
| Calendar Subsystem | CONFIRMED |
| Poem Subsystem | CONFIRMED |
| SPI排他制御 | CONFIRMED |
| Gemini運用詳細 | PROPOSED |
| IP5306実機評価 | PROPOSED |

---

## 13. CHANGE LOG

| 日付 | 内容 | 理由 |
|---|---|---|
| 2026-06-19 | Phase体系整理 | 査読対応 |
| 2026-06-19 | Calendar/Poem統合反映 | GAS中心構成へ整理 |
| 2026-06-19 | STATUS追加 | 保守性向上 |
