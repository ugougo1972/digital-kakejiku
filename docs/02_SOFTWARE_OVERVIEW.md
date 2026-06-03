# 02_SOFTWARE_OVERVIEW.md

最終更新: 2026-06-03

---

## 1. 概要

digital-kakejiku は XIAO ESP32S3 Plus を中心とした据置型環境観測システムである。

各種センサーから取得した環境データをローカル保存し、Google Apps Script（GAS）経由で Google Spreadsheet へ送信する。

また、7.5inch 800×480 E-Paper へ観測情報および生成コンテンツを表示する。

本書はソフトウェア全体構成、各モジュールの責務、ログ生成責務、実行上の排他制御方針を定義する。

---

## 2. 関連ドキュメント

| 文書 | 内容 |
|---|---|
| 01_HARDWARE_OVERVIEW.md | ハードウェア構成 |
| 03_LOG_FORMAT.md | ログ形式 |
| 04_STATE_MACHINE.md | 状態遷移 |
| 05_WIRING_DIAGRAM.md | 配線定義 |
| 06_GAS_API_SPEC.md | GAS API仕様 |
| 07_DISPLAY_UI_SPEC.md | 表示UI仕様 |
| 08_POWER_ARCHITECTURE.md | 電源構成 |

---

## 3. ソフトウェア構成

```text
Application
│
├─ SystemManager
├─ SensorManager
├─ StorageManager
├─ NetworkManager
├─ DisplayManager
├─ UIManager
├─ PowerManager
├─ RTCManager
└─ DiagnosticManager
```

---

## 4. SystemManager

### 4.1 役割

システム全体の統括制御を行う。

### 4.2 主な機能

- 起動シーケンス管理
- 周期タスク管理
- 状態遷移管理
- モジュール初期化
- 異常検知
- フェイルセーフ制御
- SPI共有デバイスの実行順序制御
- 停電時の動作モード切替指示

### 4.3 管理対象状態

詳細は `04_STATE_MACHINE.md` を参照する。

主な状態は以下とする。

- BOOT
- INIT
- RTC_SYNC
- NORMAL
- BATTERY_MODE
- ERROR系状態

---

## 5. SensorManager

### 5.1 役割

観測センサー群の管理を行う。

### 5.2 管理対象

| センサー | 用途 | 電源系統 | 備考 |
|---|---|---|---|
| SCD41 | CO₂ | 3.3V | I2C |
| SGP41 | VOC / NOx | 3.3V | I2C |
| BME680 | 温度・湿度・気圧 | 3.3V | I2C |
| LTR390 | 照度・UV | 3.3V | I2C |
| SPS30 | PM1.0 / PM2.5 / PM4.0 / PM10 | 5V | I2C想定 |
| HLK-LD2410C | 人感検知 | 未確定 | 初号機はOUT接続を基本とする |
| ICS-43434 | 音環境観測 | 3.3V | I2S |

### 5.3 主な機能

- センサー初期化
- 定期観測
- 異常値判定
- データキャッシュ
- 観測失敗記録
- センサー別ステータス管理

### 5.4 ログ責務

SensorManager は観測値を生成する。

実ファイルへの保存は StorageManager が担当する。

| 生成元 | 対象ログ | 備考 |
|---|---|---|
| SensorManager | OBSERVATION_LOG | 観測データをStorageManagerへ渡す |
| SensorManager | ERROR_LOG | センサー初期化失敗・取得失敗を通知 |

---

## 6. StorageManager

### 6.1 役割

ローカルデータ保存を行う。

### 6.2 保存先

- microSD

### 6.3 保存形式

- CSV
- JSON

### 6.4 主な機能

- ログ保存
- 送信待ちキュー管理
- GAS送信失敗時の退避
- ログローテーション
- ファイル整合性確認
- 起動時の未送信ログ検出

### 6.5 SPI共有デバイスとの排他制御

E-Paper と microSD は SPI バスを共有する。

そのため、StorageManager は DisplayManager の描画処理と同時に microSD へアクセスしない。

基本ルールは以下とする。

| 条件 | 動作 |
|---|---|
| DisplayManagerがE-Paper更新中 | microSD書込を待機 |
| StorageManagerがmicroSD書込中 | E-Paper更新を待機 |
| SENSOR_UPDATE直後 | 先にmicroSD保存を行う |
| DISPLAY_UPDATE直前 | 未完了のSD書込を完了させる |
| 停電検知時 | 表示更新よりログ保存を優先 |

### 6.6 ログ責務

StorageManager は全ログの最終保存責任を持つ。

| ログ種別 | 保存形式 | 生成元 |
|---|---|---|
| OBSERVATION_LOG | CSV | SensorManager |
| SYSTEM_LOG | CSV | SystemManager / PowerManager / RTCManager |
| EVENT_LOG | CSV | UIManager |
| ERROR_LOG | CSV | 各Manager |
| AI_LOG | JSON | NetworkManager または将来のAI処理 |

---

## 7. NetworkManager

### 7.1 役割

ネットワーク通信を管理する。

### 7.2 通信先

- GAS WebApp

### 7.3 主な機能

- Wi-Fi接続
- HTTPS POST
- 再送制御
- RSSI取得
- NTP時刻同期補助
- 通信異常監視
- GAS応答結果の判定

### 7.4 再送方針

通信失敗時は、データを破棄しない。

StorageManager が保持する送信待ちキューを次回通信可能時に再送する。

### 7.5 ログ責務

| ログ種別 | 内容 |
|---|---|
| SYSTEM_LOG | Wi-Fi接続、切断、GAS送信成功 |
| ERROR_LOG | Wi-Fi接続失敗、HTTPS失敗、GASエラー |
| OBSERVATION_LOG | GAS送信対象データとして参照 |

---

## 8. DisplayManager

### 8.1 役割

E-Paper描画管理を行う。

### 8.2 表示対象

- 日付
- 時刻
- 環境データ
- 状態情報
- システム通知
- AI生成コンテンツ

AI生成コンテンツは将来拡張扱いとし、初期実装では必須としない。

### 8.3 主な機能

- 画面レイアウト管理
- 部分更新
- 全面更新
- フォント管理
- 画面キャッシュ管理
- 表示更新回数の抑制

### 8.4 SPI共有デバイスとの排他制御

DisplayManager は E-Paper 更新時に SPI バスを使用する。

microSD との同時アクセスは禁止する。

排他制御は SystemManager が管理し、StorageManager と DisplayManager は同時に SPI を使用しない。

---

## 9. UIManager

### 9.1 役割

ユーザー操作を管理する。

### 9.2 入力装置

- 水平ダイヤル式ロータリーエンコーダ
- プッシュスイッチ

RGB LED付きロータリーエンコーダは本プロジェクトでは採択しない。

### 9.3 主な機能

- ページ切替
- メニュー操作
- 設定変更
- 診断画面表示
- 操作イベント記録

### 9.4 ログ責務

| 操作 | ログ |
|---|---|
| 回転 | EVENT_LOG |
| 押下 | EVENT_LOG |
| ページ切替 | EVENT_LOG |
| 設定変更 | EVENT_LOG / SYSTEM_LOG |

---

## 10. PowerManager

### 10.1 役割

UPS電源状態の監視を行う。

### 10.2 対象構成

- 18650
- IP5306
- DMG2305UX-13
- TPS63802
- ポリスイッチ
- USB給電

### 10.3 主な機能

- USB給電監視
- バッテリー電圧監視
- 停電検知
- 復電検知
- 低電圧警告
- BATTERY_MODE遷移要求
- シャットダウン準備

### 10.4 状態遷移との関係

PowerManager は USB給電喪失を検知した場合、SystemManager に `USB_POWER_LOST` を通知する。

SystemManager は `BATTERY_MODE` へ遷移し、以下の優先順位で処理を行う。

1. 未保存ログのmicroSD保存
2. 通信処理の抑制または中断
3. E-Paper更新頻度の抑制
4. 低電圧時の保護動作

復電を検知した場合、PowerManager は `USB_POWER_RESTORE` を通知する。

SystemManager は通常の `NORMAL` 動作へ復帰する。

---

## 11. RTCManager

### 11.1 役割

RTCおよび時刻管理を行う。

### 11.2 対象

- DS3231
- AT24C32

### 11.3 主な機能

- RTC読取
- RTC書込
- 時刻補正
- バックアップ時刻管理
- NTP取得時のRTC補正
- RTC異常検知

### 11.4 ログ責務

| 内容 | ログ |
|---|---|
| RTC読取成功 | SYSTEM_LOG |
| RTC補正 | SYSTEM_LOG |
| RTC異常 | ERROR_LOG |

---

## 12. DiagnosticManager

### 12.1 役割

保守および自己診断を行う。

### 12.2 主な機能

- センサー状態監視
- SDカード状態監視
- RTC状態監視
- 通信状態監視
- 電源状態監視
- エラーログ生成
- 診断画面向け状態提供

---

## 13. データフロー

```text
Sensors
   │
   ▼
SensorManager
   │
   ├─ StorageManager
   │      │
   │      ▼
   │    microSD
   │
   ├─ NetworkManager
   │      │
   │      ▼
   │    GAS
   │      │
   │      ▼
   │ Spreadsheet
   │
   ▼
DisplayManager
   │
   ▼
E-Paper
```

---

## 14. 通常時の周期実行方針

NORMAL状態では、各処理を常時並行実行するのではなく、周期タスクとして順次処理する。

基本順序は以下とする。

```text
DIAGNOSTIC_CHECK
 ↓
SENSOR_UPDATE
 ↓
STORAGE_WRITE
 ↓
NETWORK_UPLOAD
 ↓
DISPLAY_UPDATE
 ↓
NORMAL待機
```

ただし、通信失敗時は `NETWORK_UPLOAD` を短時間で打ち切り、ローカル保存を優先する。

E-Paper更新は頻繁に実行せず、必要時のみ実施する。

---

## 15. 状態遷移概要

```text
BOOT
 ↓
INIT
 ↓
RTC_SYNC
 ↓
NORMAL
 ├─ SENSOR_UPDATE
 ├─ STORAGE_WRITE
 ├─ NETWORK_UPLOAD
 ├─ DISPLAY_UPDATE
 └─ DIAGNOSTIC_CHECK
 ↓
NORMAL
```

異常発生時

```text
NORMAL
 ├─ SENSOR_ERROR
 ├─ STORAGE_ERROR
 ├─ NETWORK_ERROR
 ├─ RTC_ERROR
 ├─ POWER_ERROR
 └─ DISPLAY_ERROR
```

停電発生時

```text
NORMAL
 ↓
USB_POWER_LOST
 ↓
BATTERY_MODE
 ↓
USB_POWER_RESTORE
 ↓
NORMAL
```

詳細は `04_STATE_MACHINE.md` を参照する。

---

## 16. メモリ・ストレージ設計方針

### 16.1 メモリ方針

- センサー値は最新値のみを基本保持する
- 長期履歴はRAMに保持しない
- 再送対象はmicroSD上のキューを正とする
- 大きな文字列生成は初期実装では避ける

### 16.2 ストレージ方針

- 観測ログはmicroSDへ追記保存する
- 送信失敗ログは再送対象として保持する
- ログローテーション方式は実装時に定義する
- 停電時は未保存ログの退避を最優先とする

---

## 17. 将来拡張

### 17.1 Phase2

- Gemini連携
- GAS分析強化
- 異常検知
- 要約生成

### 17.2 Phase3

- 長期統計分析
- AI生成日報
- ダッシュボード連携
- 複数端末統合

---

## 18. 採択方針

- 常時稼働を前提とする
- UPS方式を採用する
- ローカル保存を優先する
- 通信失敗時もデータを失わない
- E-Paper更新回数を最小化する
- モジュール間依存を最小化する
- DeepSleepを必須要件としない
- SPI共有デバイスは排他制御する
- 停電時は通信・表示より保存を優先する

---

## 19. 変更履歴

| 日付 | 内容 |
|---|---|
| 2026-06-03 | 初版作成 |
| 2026-06-03 | 査読指摘を反映し、PowerManager責務、SPI排他制御、ログ責務、周期実行方針を追記 |
