# CURRENT_STATUS.md

# digital-kakejiku Current Status

最終更新: 2026-06-19

---

# プロジェクト概要

digital-kakejiku は据置型環境観測・暦表示・詩生成システムである。

目的。

* 長期環境観測
* 暦情報表示
* 今日の詩表示
* 生活記録支援

---

# 現在フェーズ

```text
Phase1

GAS本実装
```

状態。

```text
IN_PROGRESS
```

---

# 全体進捗

| 項目            | 状態          |
| ------------- | ----------- |
| 要件定義          | COMPLETE    |
| ハードウェア選定      | COMPLETE    |
| センサー選定        | COMPLETE    |
| 電源設計          | COMPLETE    |
| 表示設計          | COMPLETE    |
| Spreadsheet設計 | COMPLETE    |
| GAS設計         | COMPLETE    |
| Gemini設計      | COMPLETE    |
| GAS実装         | IN_PROGRESS |
| ESP32実装       | PENDING     |
| 統合試験          | PENDING     |

---

# 採択済みハードウェア

## MCU

```text
XIAO ESP32S3 Plus
```

状態。

```text
CONFIRMED
```

---

## 前面表示

```text
7.5inch E-Paper

800x480

XIAO ePaper Breakout V2
```

状態。

```text
CONFIRMED
```

---

## 背面UI

```text
OLED 128x96

SSD1315優先

3ポジションダイヤル
```

状態。

```text
CONFIRMED
```

---

## RTC

```text
DS3231

AT24C32

CR2032
```

状態。

```text
CONFIRMED
```

---

## 電源

```text
18650

IP5306

DMG2305UX-13

TPS63802

PTC
```

方式。

```text
UPS
```

状態。

```text
CONFIRMED
```

---

## センサー

| センサー      | 用途        | 状態        |
| --------- | --------- | --------- |
| SCD41     | CO2       | CONFIRMED |
| SGP41     | VOC / NOx | CONFIRMED |
| SPS30     | PM        | CONFIRMED |
| LTR390    | UV / ALS  | CONFIRMED |
| BME680    | 温湿度・気圧    | CONFIRMED |
| LD2410C   | 人感        | CONFIRMED |
| ICS-43434 | 音環境       | CONFIRMED |

---

# ICS-43434

予定GPIO。

```text
GPIO39 BCLK

GPIO40 WS

GPIO41 DATA
```

状態。

```text
CONFIRMED
```

音解析方式。

```text
PROPOSED
```

---

# GAS構成

## モジュール

```text
ApiGateway

SecurityManager

ConfigManager

LogSubsystem

CalendarSubsystem

PoemSubsystem

JobScheduler
```

状態。

```text
FINALIZED
```

---

# Spreadsheet構成

## ログ

```text
observation_log

event_log

error_log

system_log
```

---

## Calendar

```text
source_config

system_config

solar_term_master

season_dictionary

calendar_master
```

---

## Poem

```text
poem_cache
```

状態。

```text
FINALIZED
```

---

# Observation Payload

## バージョン

```text
v1.0
```

---

## 項目数

```text
28項目
```

---

## 追加採択

```text
timestamp_validity

boot_count

wakeup_reason

message_id

retry_count
```

状態。

```text
FINALIZED
```

---

# Calendar Subsystem

## 情報源

| 項目    | 情報源           |
| ----- | ------------- |
| 祝日    | 内閣府           |
| 二十四節気 | 国立天文台系        |
| 七十二候  | 固定マスタ         |
| 解説    | source_config |

---

## AI利用

禁止。

```text
AI生成

AI推定

AI補完
```

状態。

```text
FINALIZED
```

---

## 保持期間

```text
過去5年

当年

翌年
```

状態。

```text
FINALIZED
```

---

## 年次生成

```text
毎年12月1日
```

状態。

```text
FINALIZED
```

---

## 再生成

許可。

```text
指定年

指定期間
```

用途。

```text
祝日改正

制度変更

情報源修正
```

状態。

```text
FINALIZED
```

---

## calendar_master拡張

採択済み。

```text
旧暦

六曜

月齢

月相

干支

十二支
```

状態。

```text
FINALIZED
```

---

# Calendar状態管理

```text
SCHEDULED

CALENDAR_RUNNING

CALENDAR_RETRY

CALENDAR_READY

CALENDAR_ERROR
```

状態。

```text
FINALIZED
```

---

# Poem Subsystem

## AI

```text
Gemini API
```

---

## 入力

```text
calendar_master

observation_log
```

---

## 出力

```text
poem_cache
```

状態。

```text
CONFIRMED
```

---

# Poem生成仕様

## 立場

```text
観測
+
歳時記
```

---

## 詩種

```text
自由詩
```

---

## 視点

```text
客観描写
```

---

## 長さ

```text
80〜120文字
```

目標。

```text
100文字
```

---

## タイトル

```text
Gemini自由生成
```

---

## 数値

直接出力禁止。

状態。

```text
FINALIZED
```

---

## 禁止事項

```text
政治

宗教

説教

誘導

経済情報
```

状態。

```text
FINALIZED
```

---

# Poem状態管理

```text
CALENDAR_PENDING

POEM_RUNNING

POEM_RETRY

POEM_READY

POEM_ERROR

POEM_SKIPPED
```

状態。

```text
FINALIZED
```

---

# Calendar依存関係

```text
Calendar Job
      ↓
calendar_master
      ↓
Poem Job
```

状態。

```text
FINALIZED
```

---

# 実行スケジュール

## Calendar Job

```text
02:00 Main

02:30 Retry1

03:00 Retry2

03:30 Retry3
```

---

## Poem Job

```text
02:10 Main

02:40 Retry1

03:10 Retry2

03:40 Retry3
```

状態。

```text
FINALIZED
```

---

# Config管理

## source_config

用途。

```text
Calendar情報源管理
```

状態。

```text
FINALIZED
```

---

## system_config

用途。

```text
Gemini設定

Prompt設定

Job設定

表示設定
```

状態。

```text
FINALIZED
```

---

## Script Properties

用途。

```text
API_SECRET

GEMINI_API_KEY

SYSTEM_VERSION
```

状態。

```text
FINALIZED
```

---

# 採択済み設計文書

## A1

```text
14_SPREADSHEET_SCHEMA.md
```

状態。

```text
ADOPTED
```

---

## A2

```text
State Machine
```

状態。

```text
ADOPTED
```

---

## A3

```text
15_GAS_IMPLEMENTATION_GUIDE.md
```

状態。

```text
ADOPTED
```

---

## A4

```text
Gemini Prompt Specification
```

状態。

```text
ADOPTED
```

---

## B1

```text
16_TESTING_STRATEGY.md
```

状態。

```text
DRAFT_ADOPTED
```

---

## B2

```text
GAS実装方針
```

状態。

```text
DRAFT_ADOPTED
```

---

# 現在の最優先タスク

```text
Phase1 GAS本実装
```

---

## 実装順序

```text
1 Spreadsheet初期化

2 ConfigManager

3 SecurityManager

4 LogSubsystem

5 ApiGateway

6 CalendarSubsystem

7 PoemSubsystem

8 JobScheduler

9 結合試験
```

状態。

```text
FINALIZED
```

---

# 次工程

## High Priority

```text
Spreadsheet構築

Calendar実装

Poem実装

GAS API実装
```

---

## Medium Priority

```text
ESP32統合

ePaper統合
```

---

## Low Priority

```text
長期運用試験

筐体設計
```

---

# リスク

## GAS

```text
Gemini API仕様変更
```

---

## Calendar

```text
祝日法改正
```

---

## Hardware

```text
部材入荷待ち
```

---

# STATUS SUMMARY

| 項目                 | 状態          |
| ------------------ | ----------- |
| Hardware Design    | COMPLETE    |
| Power Design       | COMPLETE    |
| Sensor Selection   | COMPLETE    |
| Spreadsheet Design | COMPLETE    |
| Calendar Design    | COMPLETE    |
| Poem Design        | COMPLETE    |
| GAS Architecture   | COMPLETE    |
| GAS Implementation | IN_PROGRESS |
| ESP32 Firmware     | PENDING     |
| Integration Test   | PENDING     |

---

# CHANGE LOG

| 日付         | 内容                         |
| ---------- | -------------------------- |
| 2026-06-19 | Spreadsheet Schema採択       |
| 2026-06-19 | GAS Implementation Guide採択 |
| 2026-06-19 | Testing Strategy追加         |
| 2026-06-19 | system_config追加            |
| 2026-06-19 | Calendar状態管理追加             |
| 2026-06-19 | Poem状態管理追加                 |
| 2026-06-19 | Gemini Prompt仕様反映          |
| 2026-06-19 | GAS実装フェーズ移行                |
