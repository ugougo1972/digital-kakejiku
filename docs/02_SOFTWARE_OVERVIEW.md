# 02_SOFTWARE_OVERVIEW.md

# digital-kakejiku ソフトウェア概要

最終更新: 2026-06-19

---

# 1. 目的

本ドキュメントは digital-kakejiku のソフトウェア全体構成を定義する。

査読結果を反映し、Calendar Subsystem、Poem Subsystem、SPI共有制御、表示責務分離を明確化する。

---

# 2. ソフトウェア全体構成

```text
Sensors
  ↓
ESP32 Firmware
  ├─ SensorManager
  ├─ StorageManager
  ├─ DisplayManager
  ├─ UIManager
  ├─ DiagnosticManager
  ├─ PowerManager
  ├─ NetworkManager
  └─ ResourceManager
          ↓ HTTPS
Google Apps Script
  ├─ ApiGateway
  ├─ CalendarSubsystem
  ├─ PoemSubsystem
  ├─ ConfigManager
  └─ LogManager
          ↓
Google Spreadsheet
```

---

# 3. 基本方針

- ESP32は観測端末
- GASは中央制御層
- Calendar生成はGAS側
- Poem生成はGAS側
- ESP32は表示と観測を担当
- 推測禁止
- AIによる暦生成禁止

---

# 4. ESP32側構成

## SensorManager

担当。

- センサー初期化
- センサー取得
- エラー通知

対象。

- SCD41
- SGP41
- SPS30
- LTR390
- BME680
- LD2410C
- ICS-43434

---

## StorageManager

担当。

- microSD保存
- CSV生成
- ローカルキャッシュ

---

## NetworkManager

担当。

- Wi-Fi接続
- HTTPS POST
- GAS通信

---

## PowerManager

担当。

- 電源状態監視
- 電池電圧監視
- UPS状態記録

注意。

電源切替そのものは実施しない。

UPS切替はハードウェア側で行う。

---

## ResourceManager

担当。

- SPI排他制御
- リソース状態管理

対象。

- E-Paper
- microSD

詳細は 09_SPI_RESOURCE_CONTROL.md を正とする。

---

# 5. 表示責務

## DisplayManager

前面E-Paper担当。

機能。

- 日めくり表示
- 環境情報表示
- Calendar表示
- Poem表示

DisplayManagerは表示のみ担当する。

Calendar生成、Poem生成は担当しない。

---

## UIManager

背面OLED担当。

機能。

- 設定
- メニュー
- 手動同期
- 状態表示

対象。

- OLED 128x96
- 3ポジションダイヤル

---

## DiagnosticManager

診断担当。

機能。

- I2C一覧
- SPI状態
- Wi-Fi状態
- RTC状態
- SD状態
- エラー履歴

査読指摘を反映し、DisplayManager と責務分離する。

---

# 6. GAS側構成

## ApiGateway

担当。

- 認証
- Payload検証
- JSON応答

---

## LogManager

担当。

- observation_log
- event_log
- error_log
- system_log

---

## ConfigManager

担当。

- source_config
- Device設定配信

---

## CalendarSubsystem

担当。

- 祝日取得
- 二十四節気取得
- 七十二候管理
- calendar_master生成

情報源。

- 内閣府
- 国立天文台系
- 固定マスタ
- source_config

禁止。

- AI生成
- AI推定
- 欠損補完

---

## PoemSubsystem

担当。

- Gemini API
- Prompt生成
- poem_cache生成

入力。

- calendar_master
- 観測データ

出力。

- poem_cache

制約。

- 1日1回生成
- 表示時再生成禁止

---

# 7. Spreadsheet構成

運用シート。

- observation_log
- event_log
- error_log
- system_log

Calendar。

- source_config
- solar_term_master
- season_dictionary
- calendar_master

Poem。

- poem_cache

---

# 8. データフロー

```text
ESP32
 ↓
HTTPS POST
 ↓
ApiGateway
 ↓
LogManager
 ↓
Spreadsheet

CalendarSubsystem
 ↓
calendar_master

PoemSubsystem
 ↓
poem_cache

ESP32
 ↓
表示
```

---

# 9. エラー方針

取得失敗時。

- error_log記録
- 推測禁止
- 前回値流用禁止

表示。

- 「取得できません」

---

# 10. STATUS

| 項目 | 状態 |
|---|---|
| GAS中央集権構成 | CONFIRMED |
| CalendarSubsystem | CONFIRMED |
| PoemSubsystem | CONFIRMED |
| Display/UI責務分離 | CONFIRMED |
| SPI排他制御 | CONFIRMED |
| Gemini運用詳細 | PROPOSED |

---

# 11. CHANGE LOG

| 日付 | 内容 | 理由 |
|---|---|---|
| 2026-06-19 | Calendar/Poem統合 | 査読対応 |
| 2026-06-19 | Display/UI責務分離 | 査読対応 |
| 2026-06-19 | STATUS追加 | 保守性向上 |
