# digital-kakejiku Software Overview

最終更新: 2026-06-20  
文書版: vNext 1.1 review reflected

---

# 1. 目的

本書は digital-kakejiku のソフトウェア構成の基準源である。

## 位置づけ

本ドキュメントは、対象領域の基準源を明示し、他文書では要約または参照に留める。  
詳細仕様が他文書の基準源にある場合、本書では重複記述を避け、参照先を明示する。

| 領域 | 基準源 |
|---|---|
| ハードウェア構成 | 01_HARDWARE_OVERVIEW.md |
| ソフトウェア構成 | 02_SOFTWARE_OVERVIEW.md |
| ログ形式 | 03_LOG_FORMAT.md |
| 状態遷移 | 04_STATE_MACHINE.md |
| 配線 | 05_WIRING_DIAGRAM.md |
| GAS API | 06_GAS_API_SPEC.md |
| 表示・背面UI | 07_DISPLAY_UI_SPEC.md |
| 電源 | 08_POWER_ARCHITECTURE.md |
| SPI共有制御 | 09_SPI_RESOURCE_CONTROL.md |
| Calendar / Poem | 10_CALENDAR_POEM_SUBSYSTEM.md |
| セキュリティ | 11_SECURITY_MANAGEMENT.md |
| 設定管理 | 12_CONFIGURATION_MANAGEMENT.md |
| GAS運用 | 13_GAS_OPERATION_POLICY.md |
| Spreadsheet Schema | 14_SPREADSHEET_SCHEMA.md |
| GAS実装 | 15_GAS_IMPLEMENTATION_GUIDE.md |
| 試験 | 16_TESTING_STRATEGY.md |
| 障害対応 | 17_TROUBLESHOOTING.md |

---

# 2. 基本方針

- ESP32は観測端末として動作する
- GASは中央制御層として動作する
- Spreadsheetはデータ保存と設定保持を担当する
- Calendar生成とPoem生成はGAS側で実施する
- ESP32はGemini APIを呼び出さない

---

# 3. ESP32 Firmware

| Manager | 責務 |
|---|---|
| SensorManager | センサー制御・観測値収集 |
| StorageManager | microSD保存・ローカルキャッシュ |
| NetworkManager | Wi-Fi・HTTPS送信・再送制御 |
| DisplayManager | E-Paper / OLED表示 |
| UIManager | 背面UI・ロータリー操作 |
| DiagnosticManager | 自己診断・状態表示 |
| PowerManager | UPS状態・電池監視 |
| ResourceManager | SPI / I2C / メモリ管理 |

---

# 4. GAS

| Module | 責務 |
|---|---|
| ApiGateway | doGet / doPost入口 |
| SecurityManager | device_id + secret検証、Payload検証 |
| ConfigManager | source_config / system_config / Script Properties取得 |
| LogSubsystem | observation/event/error/system log保存 |
| CalendarSubsystem | calendar_master生成 |
| PoemSubsystem | poem_cache生成 |
| JobScheduler | 02:00/02:10ジョブとRetry管理 |
| MaintenanceHandler | 保守操作要求の受付・実行 |

---

# 5. データフロー

## Observation

```text
SensorManager
 ↓
Observation Payload
 ↓
NetworkManager
 ↓
ApiGateway
 ↓
SecurityManager
 ↓
LogSubsystem
 ↓
observation_log
```

## Calendar / Poem

```text
source_config + season_dictionary
 ↓
CalendarSubsystem
 ↓
calendar_master
 ↓
PoemSubsystem
 ↓
poem_cache
 ↓
ESP32 Display
```

---

# 6. 境界条件

- RTC異常時のCalendar/Poem判定はGAS側 Asia/Tokyo 日付を優先する
- observation_logにはESP32時刻とGAS受信時刻の両方を扱えるよう拡張余地を残す
- 表示時再生成は禁止する
- 取得失敗時は「取得できません」と表示する

---

# 7. STATUS

| 項目 | 状態 |
|---|---|
| ESP32構成 | CONFIRMED |
| GAS構成 | FINALIZED |
| Calendar/Poem責務分離 | FINALIZED |
| MaintenanceHandler | FINALIZED |

---

# 8. CHANGE LOG

| 日付 | 内容 |
|---|---|
| 2026-06-20 | MaintenanceHandlerと境界条件を追加 |
