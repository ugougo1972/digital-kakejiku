# SOFTWARE_OVERVIEW.md

## 1. 概要

digital-kakejiku は XIAO ESP32S3 Plus を中心とした据置型環境観測システムである。

各種センサーから取得した情報をローカル保存し、Google Apps Script（GAS）経由で Google Spreadsheet へ送信する。

また、7.5inch E-Paper ディスプレイへ観測情報および生成コンテンツを表示する。

本書はソフトウェア全体構成および各モジュールの責務を定義する。

---

## 2. ソフトウェア構成

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
└─ DiagnosticManager
```

---

## 3. SystemManager

### 役割

システム全体の制御を行う。

### 主な機能

* 起動シーケンス管理
* 周期タスク管理
* 状態遷移管理
* 異常検知
* モジュール初期化

---

## 4. SensorManager

### 役割

センサー制御を統括する。

### 管理対象

| センサー        | 用途                           |
| ----------- | ---------------------------- |
| SCD41       | CO₂                          |
| SGP41       | VOC / NOx                    |
| BME680      | 温度・湿度・気圧                     |
| LTR390      | 照度・UV                        |
| SPS30       | PM1.0 / PM2.5 / PM4.0 / PM10 |
| HLK-LD2410C | 人感検知                         |
| ICS-43434   | 音環境                          |

### 主な機能

* センサー初期化
* データ取得
* 異常値判定
* キャッシュ管理

---

## 5. StorageManager

### 役割

ローカルデータ保存を行う。

### 保存先

* microSD

### 主な機能

* CSV保存
* JSON保存
* バッファ管理
* GAS送信失敗時の退避

---

## 6. NetworkManager

### 役割

ネットワーク通信を管理する。

### 通信先

* GAS WebApp

### 主な機能

* Wi-Fi接続
* HTTPS POST
* 再送制御
* RSSI取得
* 時刻同期補助

---

## 7. DisplayManager

### 役割

E-Paper画面描画を管理する。

### 表示対象

* 環境データ
* 時刻
* 状態情報
* 生成コンテンツ

### 主な機能

* 部分更新
* 全面更新
* レイアウト管理
* フォント管理

---

## 8. UIManager

### 役割

ユーザー操作を管理する。

### 入力装置

* ロータリーエンコーダ
* プッシュスイッチ

### 主な機能

* メニュー操作
* 設定変更
* ページ切替

---

## 9. PowerManager

### 役割

電源監視を行う。

### 主な機能

* USB給電状態監視
* バッテリー電圧監視
* 電源異常検知
* 低電圧警告

---

## 10. DiagnosticManager

### 役割

自己診断および保守情報管理を行う。

### 主な機能

* センサー状態監視
* SDカード状態監視
* 通信状態監視
* エラーログ生成

---

## 11. データフロー

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

## 12. 状態遷移

```text
BOOT
 ↓
INIT
 ↓
NORMAL
 ├─ SENSOR_UPDATE
 ├─ STORAGE_WRITE
 ├─ NETWORK_UPLOAD
 └─ DISPLAY_UPDATE
 ↓
NORMAL
```

異常発生時

```text
NORMAL
 ├─ SENSOR_ERROR
 ├─ STORAGE_ERROR
 ├─ NETWORK_ERROR
 └─ DISPLAY_ERROR
```

---

## 13. 将来拡張

### Phase2

* Gemini連携
* GAS側分析強化
* 異常検知

### Phase3

* 長期統計分析
* AI生成コメント
* ダッシュボード連携

---

## 14. 採択方針

* 常時稼働を前提とする
* DeepSleepは必須要件としない
* ローカル保存を優先する
* 通信失敗時もデータを失わない
* E-Paper更新回数を最小化する
* モジュール間の依存性を低減する

```
```
