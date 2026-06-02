# 02_SOFTWARE_OVERVIEW.md

# 1. 概要

digital-kakejiku は XIAO ESP32S3 Plus を中心とした据置型環境観測システムである。

各種センサーから取得した環境データをローカル保存し、Google Apps Script（GAS）経由で Google Spreadsheet へ送信する。

また、7.5inch 800×480 E-Paper へ観測情報および生成コンテンツを表示する。

本書はソフトウェア全体構成および各モジュールの責務を定義する。

---

# 2. ソフトウェア構成

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

# 3. SystemManager

## 役割

システム全体の統括制御を行う。

## 主な機能

- 起動シーケンス管理
- 周期タスク管理
- 状態遷移管理
- モジュール初期化
- 異常検知
- フェイルセーフ制御

---

# 4. SensorManager

## 役割

観測センサー群の管理を行う。

## 管理対象

| センサー | 用途 |
|----------|------|
| SCD41 | CO₂ |
| SGP41 | VOC / NOx |
| BME680 | 温度・湿度・気圧 |
| LTR390 | 照度・UV |
| SPS30 | PM1.0 / PM2.5 / PM4.0 / PM10 |
| HLK-LD2410C | 人感検知 |
| ICS-43434 | 音環境観測 |

## 主な機能

- センサー初期化
- 定期観測
- 異常値判定
- データキャッシュ
- 観測失敗記録

---

# 5. StorageManager

## 役割

ローカルデータ保存を行う。

## 保存先

- microSD

## 保存形式

- CSV
- JSON

## 主な機能

- ログ保存
- 送信待ちキュー管理
- GAS送信失敗時の退避
- ログローテーション
- ファイル整合性確認

---

# 6. NetworkManager

## 役割

ネットワーク通信を管理する。

## 通信先

- GAS WebApp

## 主な機能

- Wi-Fi接続
- HTTPS POST
- 再送制御
- RSSI取得
- NTP時刻同期補助
- 通信異常監視

---

# 7. DisplayManager

## 役割

E-Paper描画管理を行う。

## 表示対象

- 日付
- 時刻
- 環境データ
- 状態情報
- AI生成コンテンツ
- システム通知

## 主な機能

- 画面レイアウト管理
- 部分更新
- 全面更新
- フォント管理
- 画面キャッシュ管理

---

# 8. UIManager

## 役割

ユーザー操作を管理する。

## 入力装置

- 水平ダイヤル式ロータリーエンコーダ
- プッシュスイッチ

## 主な機能

- ページ切替
- メニュー操作
- 設定変更
- 診断画面表示

---

# 9. PowerManager

## 役割

UPS電源状態の監視を行う。

## 対象構成

- 18650
- IP5306
- DMG2305UX-13
- TPS63802
- USB給電

## 主な機能

- USB給電監視
- バッテリー電圧監視
- 停電検知
- 低電圧警告
- シャットダウン準備

---

# 10. RTCManager

## 役割

RTCおよび時刻管理を行う。

## 対象

- DS3231
- AT24C32

## 主な機能

- RTC読取
- RTC書込
- 時刻補正
- バックアップ時刻管理

---

# 11. DiagnosticManager

## 役割

保守および自己診断を行う。

## 主な機能

- センサー状態監視
- SDカード状態監視
- RTC状態監視
- 通信状態監視
- エラーログ生成

---

# 12. データフロー

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

# 13. 状態遷移

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
 └─ DISPLAY_ERROR
```

---

# 14. 将来拡張

## Phase2

- Gemini連携
- GAS分析強化
- 異常検知
- 要約生成

## Phase3

- 長期統計分析
- AI生成日報
- ダッシュボード連携
- 複数端末統合

---

# 15. 採択方針

- 常時稼働を前提とする
- UPS方式を採用する
- ローカル保存を優先する
- 通信失敗時もデータを失わない
- E-Paper更新回数を最小化する
- モジュール間依存を最小化する
- DeepSleepを必須要件としない
