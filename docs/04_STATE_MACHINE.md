# 04_STATE_MACHINE.md

最終更新: 2026-06-03

---

## 1. 概要

本書は digital-kakejiku の状態遷移を定義する。

本機は据置型・常時稼働を前提とするため、DeepSleep を基本動作には含めない。

通常時は `NORMAL` 状態の中で、観測、保存、通信、表示、診断を周期タスクとして実行する。

---

## 2. 関連ドキュメント

| 文書 | 内容 |
|---|---|
| 02_SOFTWARE_OVERVIEW.md | ソフトウェア構成とManager責務 |
| 03_LOG_FORMAT.md | ログ形式 |
| 06_GAS_API_SPEC.md | GAS通信仕様 |
| 07_DISPLAY_UI_SPEC.md | 表示UI仕様 |
| 08_POWER_ARCHITECTURE.md | UPS電源構成 |

---

## 3. 基本状態遷移

```text
BOOT
 ↓
INIT
 ↓
RTC_SYNC
 ↓
NORMAL
```

---

## 4. 状態一覧

| 状態 | 内容 |
|---|---|
| BOOT | 電源投入直後 |
| INIT | 各モジュール初期化 |
| RTC_SYNC | RTC読取・時刻確認 |
| NORMAL | 通常稼働 |
| SENSOR_UPDATE | センサー値取得 |
| STORAGE_WRITE | microSD保存 |
| NETWORK_UPLOAD | GAS送信 |
| NORMAL_WAIT | 次周期まで待機 |
| DISPLAY_UPDATE | E-Paper更新 |
| DIAGNOSTIC_CHECK | 自己診断 |
| USB_POWER_LOST | USB給電喪失検知 |
| BATTERY_MODE | バッテリー運転 |
| USB_POWER_RESTORE | 復電検知 |
| SENSOR_ERROR | センサー異常 |
| STORAGE_ERROR | microSD異常 |
| NETWORK_ERROR | 通信異常 |
| RTC_ERROR | RTC異常 |
| DISPLAY_ERROR | 表示異常 |
| POWER_ERROR | 電源異常 |

---

## 5. BOOT

### 5.1 内容

- 電源投入
- ESP32起動
- 起動要因記録
- 最小限のシリアルログ出力

### 5.2 遷移条件

| 条件 | 次状態 |
|---|---|
| 起動完了 | INIT |
| 起動不能 | POWER_ERROR |

---

## 6. INIT

### 6.1 内容

- GPIO初期化
- I2C初期化
- SPI初期化
- I2S初期化
- センサー初期化
- SD初期化
- E-Paper初期化
- UI入力初期化

### 6.2 初期化対象

| 対象 | 失敗時 |
|---|---|
| I2C | ERROR系状態へ遷移 |
| SPI | STORAGE_ERROR または DISPLAY_ERROR |
| microSD | STORAGE_ERROR |
| E-Paper | DISPLAY_ERROR |
| RTC | RTC_ERROR |
| センサー | SENSOR_ERROR |
| Wi-Fi | NETWORK_ERROR。ただしローカル保存のみで継続可能 |

### 6.3 遷移条件

| 条件 | 次状態 |
|---|---|
| 最低限の初期化成功 | RTC_SYNC |
| microSD使用不能 | STORAGE_ERROR |
| RTC使用不能 | RTC_ERROR |
| 表示使用不能 | DISPLAY_ERROR |

---

## 7. RTC_SYNC

### 7.1 内容

- DS3231から時刻読取
- RTC時刻の妥当性確認
- 必要に応じてNTP時刻取得
- NTP取得成功時はRTC補正

### 7.2 方針

RTCをローカル時刻の基準とする。

NTPは補正用であり、GASまたはインターネット接続不能時でもRTC時刻でログを継続する。

### 7.3 遷移条件

| 条件 | 次状態 |
|---|---|
| RTC読取成功 | NORMAL |
| RTC読取失敗 | RTC_ERROR |
| NTP失敗・RTC正常 | NORMAL |

---

## 8. NORMAL

### 8.1 概要

通常稼働状態である。

NORMAL内では複数処理を常時並行実行せず、周期タスクとして順次実行する。

### 8.2 NORMAL内部フロー

```text
NORMAL
  │
  ▼
DIAGNOSTIC_CHECK
  │
  ▼
SENSOR_UPDATE
  │
  ▼
STORAGE_WRITE
  │
  ▼
NETWORK_UPLOAD
  │
  ▼
DISPLAY_UPDATE
  │
  ▼
NORMAL_WAIT
  │
  └── 繰り返し
```

### 8.3 基本実行順序

| 順序 | 状態 | 理由 |
|---:|---|---|
| 1 | DIAGNOSTIC_CHECK | 電源・SD・RTC状態を先に確認する |
| 2 | SENSOR_UPDATE | 観測値を取得する |
| 3 | STORAGE_WRITE | 通信より先にローカル保存する |
| 4 | NETWORK_UPLOAD | 保存済みデータを送信する |
| 5 | DISPLAY_UPDATE | 必要時のみ画面更新する |

### 8.4 周期方針

現時点では厳密な周期は未確定とする。

実装時の初期方針は以下とする。

| タスク              | 周期（初期案）  | 優先度 |
| ---------------- | -------- | --- |
| SENSOR_UPDATE    | 60秒      | 高   |
| STORAGE_WRITE    | SENSOR直後 | 高   |
| DISPLAY_UPDATE   | 60秒      | 中   |
| NETWORK_UPLOAD  | 30分      | 低   |
| DIAGNOSTIC_CHECK | 5分       | 低   |

補足:
- NETWORK_UPLOAD は30分周期を基本とする
- 未送信キューが一定件数を超えた場合は臨時送信を許可する
---

## 9. SENSOR_UPDATE

### 9.1 内容

- SCD41取得
- SGP41取得
- BME680取得
- LTR390取得
- SPS30取得
- HLK-LD2410C状態取得
- ICS-43434音環境取得
- 異常値判定
- 実行順は実装依存とする

### 9.2 遷移条件

| 条件 | 次状態 |
|---|---|
| 取得成功 | STORAGE_WRITE |
| 一部センサー失敗 | STORAGE_WRITE。ただしERROR_LOGを記録 |
| 主要センサー連続失敗 | SENSOR_ERROR |

---

## 10. STORAGE_WRITE

### 10.1 内容

- OBSERVATION_LOG保存
- SYSTEM_LOG保存
- EVENT_LOG保存
- ERROR_LOG保存
- 送信待ちキュー更新

### 10.2 SPI排他制御

microSD と E-Paper は SPI バスを共有する。

そのため `STORAGE_WRITE` 中は `DISPLAY_UPDATE` を実行しない。

### 10.3 遷移条件

| 条件 | 次状態 |
|---|---|
| 保存成功 | NETWORK_UPLOAD |
| 保存失敗 | STORAGE_ERROR |
| 停電検知 | BATTERY_MODE |

---

## 11. NETWORK_UPLOAD

### 11.1 内容

- Wi-Fi接続確認
- GAS WebAppへHTTPS POST
- GAS応答確認
- 送信済みマーク更新
- 失敗時の再送キュー保持

### 11.2 方針

通信失敗時もログは破棄しない。

通信が不安定な場合は短時間で打ち切り、microSD保存を優先する。

### 11.3 遷移条件

| 条件 | 次状態 |
|---|---|
| 送信成功 | DISPLAY_UPDATE |
| 送信失敗 | NETWORK_ERROR または DISPLAY_UPDATE |
| Wi-Fi未接続 | DISPLAY_UPDATE |
| 停電検知 | BATTERY_MODE |

---

## 12. DISPLAY_UPDATE

### 12.1 内容

- ホーム画面更新
- 詳細画面更新
- 診断画面更新
- 必要時の全面更新
- 通常時の部分更新

### 12.2 SPI排他制御

E-Paper と microSD は SPI バスを共有する。

そのため `DISPLAY_UPDATE` 中は `STORAGE_WRITE` を実行しない。

### 12.3 更新方針

- 画面更新は必要時のみ実行する
- E-Paper更新回数を最小化する
- 停電時は表示更新よりログ保存を優先する

### 12.4 遷移条件

| 条件 | 次状態 |
|---|---|
| 更新成功 | NORMAL_WAIT |
| 更新不要 | NORMAL_WAIT |
| 更新失敗 | DISPLAY_ERROR |
| 停電検知 | BATTERY_MODE |

## 12.5 NORMAL_WAIT

### 内容

- 次周期まで待機
- UI入力監視
- USB給電状態監視
- 次回実行時刻判定

### 遷移条件

| 条件 | 次状態 |
|---|---|
| 周期到達 | DIAGNOSTIC_CHECK |
| USB喪失 | USB_POWER_LOST |

---

## 13. DIAGNOSTIC_CHECK

### 13.1 内容

- 電源状態確認
- バッテリー電圧確認
- USB給電状態確認
- SD状態確認
- RTC状態確認
- センサー状態確認
- Wi-Fi状態確認

### 13.2 遷移条件

| 条件 | 次状態 |
|---|---|
| 異常なし | SENSOR_UPDATE |
| USB給電喪失 | USB_POWER_LOST |
| 低電圧 | POWER_ERROR |
| SD異常 | STORAGE_ERROR |
| RTC異常 | RTC_ERROR |

---

## 14. 停電状態

### 14.1 状態遷移

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

### 14.2 USB_POWER_LOST

#### 内容

- USB給電喪失検知
- SYSTEM_LOG記録
- BATTERY_MODE遷移準備

#### 次状態

- BATTERY_MODE

### 14.3 BATTERY_MODE

#### 内容

- バッテリー運転継続
- 未保存ログをmicroSDへ保存
- 通信頻度を抑制
- 表示更新を抑制
- 低電圧監視を強化

#### 優先順位

| 優先 | 処理 |
|---:|---|
| 1 | 未保存ログの保存 |
| 2 | 電源状態監視 |
| 3 | 必要最小限の表示 |
| 4 | 通信抑制または停止 |

### 14.4 USB_POWER_RESTORE

#### 内容

- 復電検知
- SYSTEM_LOG記録
- 通常周期へ復帰

#### 次状態

- NORMAL

---

## 15. エラー状態

```text
NORMAL
 ├─ SENSOR_ERROR
 ├─ NETWORK_ERROR
 ├─ STORAGE_ERROR
 ├─ RTC_ERROR
 ├─ DISPLAY_ERROR
 └─ POWER_ERROR
```

---

## 16. エラー復帰フロー

### 16.1 SENSOR_ERROR

```text
SENSOR_ERROR
 ↓
対象センサー再初期化
 ↓
成功 → NORMAL
失敗 → 該当センサーを無効化してNORMAL継続
```

方針:

- 1回の取得失敗ではシステム停止しない
- 連続失敗時はERROR_LOGを記録
- 該当センサー値は空欄またはエラー値として扱う

### 16.2 NETWORK_ERROR

```text
NETWORK_ERROR
 ↓
Wi-Fi再接続試行
 ↓
成功 → NETWORK_UPLOAD
失敗 → ローカル保存のみでNORMAL継続
```

方針:

- 通信失敗で観測を止めない
- 未送信データはmicroSDに保持する
- 次回通信可能時に再送する

### 16.3 STORAGE_ERROR

```text
STORAGE_ERROR
 ↓
microSD再マウント
 ↓
成功 → STORAGE_WRITE
失敗 → ERROR表示を行い縮退運転
```

方針:

- microSDは本機の信頼性上重要な構成要素
- 保存不能時はGAS送信が可能でも警告状態とする
- 停電時の保存不能は重大異常として扱う

### 16.4 RTC_ERROR

```text
RTC_ERROR
 ↓
RTC再読取
 ↓
成功 → RTC_SYNC
失敗 → 仮時刻でNORMAL継続
```

方針:

- RTC異常時も観測は継続する
- 仮時刻には起動後経過時間を併記する
- NTP取得可能時は時刻補正を試行する

### 16.5 DISPLAY_ERROR

```text
DISPLAY_ERROR
 ↓
E-Paper再初期化
 ↓
成功 → DISPLAY_UPDATE
失敗 → 表示なしでNORMAL継続
```

方針:

- 表示異常で観測・保存を停止しない
- 診断情報はログに残す

### 16.6 POWER_ERROR

```text
POWER_ERROR
 ↓
低電圧判定
 ↓
未保存ログ保存
 ↓
必要最小限の保護動作
```

方針:

- 低電圧時は通信と表示を抑制する
- 未保存ログの保存を最優先する
- 完全停止動作の実装可否は実機検証後に確定する

---

## 17. 将来拡張状態

```text
AI_GENERATE
 ↓
AI_DISPLAY
```

### 17.1 AI_GENERATE

- Gemini生成要求
- GAS側または外部API側で処理
- 生成結果をAI_LOGへ保存

### 17.2 AI_DISPLAY

- 生成文章をE-Paperへ表示
- 初期実装では必須としない

---

## 18. 採択方針

- 常時稼働
- ローカル保存優先
- フェイルセーフ
- UPS前提運用
- DeepSleep必須としない
- 通信失敗で観測を止めない
- 表示失敗で観測を止めない
- SPI共有デバイスは同時使用しない
- 停電時は通信・表示より保存を優先する

---

## 19. 変更履歴

| 日付 | 内容 |
|---|---|
| 2026-06-03 | 初版作成 |
| 2026-06-03 | 査読指摘を反映し、NORMAL内部フロー、停電状態、SPI排他制御、エラー復帰フローを追加 |


---

# 2026-06-19 状態遷移更新

## 設計方針変更

従来のセンサー観測中心の状態遷移に加え、Calendar SubsystemおよびPoem Subsystemを正式に追加する。

また、UPS常時給電を前提とした運用へ移行する。

---

## Calendar Subsystem状態

追加状態

CALENDAR_UPDATE

処理内容

source_config取得
↓
二十四節気更新
↓
七十二候辞書更新
↓
calendar_master生成

成功

CALENDAR_OK

失敗

CALENDAR_ERROR

表示

取得できません

---

## Poem Subsystem状態

追加状態

POEM_GENERATE

入力

- calendar_master
- 観測データ

処理

Gemini API Free Tier

出力

- poem_cache

成功

POEM_OK

失敗

POEM_ERROR

表示

取得できません

---

## GAS連携状態

基本フロー

parseJson
↓
validate
↓
routeByType
↓
appendSheet
↓
jsonResponse

対象

- observation
- event
- error
- system

---

## 電源状態追加

USB_MODE

通常状態

BATTERY_MODE

停電状態

切替

自動

---

## 停電時優先順位

1. RTC
2. 観測
3. SD保存
4. 通信
5. 表示更新

---

## UI状態更新

前面

- HOME
- DETAIL
- DIAGNOSTIC

背面OLED

- MENU
- CONFIG
- SERVICE

---

## HOME表示対象

- 六曜
- 二十四節気
- 七十二候
- 今日の詩

---

## Calendarエラー方針

取得失敗時

- 推測禁止
- 前回値流用禁止
- error_log記録

表示

取得できません

---

## AI方針

採択

- Gemini Free Tier

用途

- 今日の詩

禁止

- 暦生成
- 暦推定
- 欠損補完

---

## 文字コード

採択

- UTF-8

## フォント

採択

- Noto Sans JP

---

## 現在の設計凍結候補

- Calendar Subsystem
- Poem Subsystem
- UPS運用
- USB_MODE
- BATTERY_MODE
