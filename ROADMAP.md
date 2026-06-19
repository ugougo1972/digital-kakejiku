# ROADMAP.md

# digital-kakejiku Roadmap

最終更新: 2026-06-19

---

# プロジェクト目的

digital-kakejiku は据置型環境観測・暦表示・詩生成システムである。

目的。

* 長期環境観測
* 暦表示
* 今日の詩表示
* 生活記録支援

---

# 現在位置

```text
Phase1

GAS本実装
```

状態。

```text
IN_PROGRESS
```

---

# 全体ロードマップ

```text
Phase0
 ↓
Phase1
 ↓
Phase2
 ↓
Phase3
 ↓
Phase4
 ↓
Phase5
```

---

# Phase0

設計フェーズ

状態。

```text
COMPLETE
```

---

## 完了事項

### ハードウェア

```text
MCU選定

表示選定

RTC選定

UPS選定

センサー選定
```

---

### ソフトウェア

```text
Spreadsheet設計

Calendar設計

Poem設計

GAS設計
```

---

### ドキュメント

```text
01_HARDWARE_OVERVIEW

02_SOFTWARE_OVERVIEW

03_LOG_FORMAT

04_STATE_MACHINE

05_WIRING_DIAGRAM

06_GAS_API_SPEC

07_DISPLAY_UI_SPEC

08_POWER_ARCHITECTURE

09_SPI_RESOURCE_CONTROL

10_CALENDAR_POEM_SUBSYSTEM

11_SECURITY_MANAGEMENT

12_CONFIGURATION_MANAGEMENT

13_GAS_OPERATION_POLICY

14_SPREADSHEET_SCHEMA

15_GAS_IMPLEMENTATION_GUIDE

16_TESTING_STRATEGY
```

状態。

```text
COMPLETE
```

---

# Phase1

GAS本実装

状態。

```text
IN_PROGRESS
```

---

## Goal

```text
Calendar生成

Poem生成

Spreadsheet完成

API完成
```

---

## Step1

Spreadsheet構築

状態。

```text
NEXT
```

---

### 対象

```text
observation_log

event_log

error_log

system_log

source_config

system_config

solar_term_master

season_dictionary

calendar_master

poem_cache
```

---

## Step2

ConfigManager実装

状態。

```text
PLANNED
```

---

### 対象

```text
source_config

system_config

Script Properties
```

---

## Step3

SecurityManager実装

状態。

```text
PLANNED
```

---

### 対象

```text
device_id

secret

schema validation
```

---

## Step4

LogSubsystem実装

状態。

```text
PLANNED
```

---

### 対象

```text
observation_log

event_log

error_log

system_log
```

---

## Step5

ApiGateway実装

状態。

```text
PLANNED
```

---

### 対象

```text
doGet()

doPost()
```

---

## Step6

CalendarSubsystem実装

状態。

```text
PLANNED
```

---

### 機能

```text
年次生成

再生成

Calendar Status管理
```

---

### 状態管理

```text
SCHEDULED

CALENDAR_RUNNING

CALENDAR_RETRY

CALENDAR_READY

CALENDAR_ERROR
```

---

## Step7

PoemSubsystem実装

状態。

```text
PLANNED
```

---

### 機能

```text
Prompt生成

Gemini実行

Poem保存
```

---

### 状態管理

```text
CALENDAR_PENDING

POEM_RUNNING

POEM_RETRY

POEM_READY

POEM_ERROR

POEM_SKIPPED
```

---

## Step8

JobScheduler実装

状態。

```text
PLANNED
```

---

### Calendar Job

```text
02:00 Main

02:30 Retry1

03:00 Retry2

03:30 Retry3
```

---

### Poem Job

```text
02:10 Main

02:40 Retry1

03:10 Retry2

03:40 Retry3
```

---

## Step9

結合試験

状態。

```text
PLANNED
```

---

### 対象

```text
Calendar

Poem

API

Spreadsheet
```

---

## Phase1完了条件

### Spreadsheet

```text
全シート作成完了
```

---

### API

```text
doGet正常

doPost正常
```

---

### Calendar

```text
calendar_master生成成功
```

---

### Poem

```text
poem_cache生成成功
```

---

### Retry

```text
正常動作
```

---

# Phase2

ESP32統合

状態。

```text
PENDING
```

---

## Goal

```text
ESP32
↓
GAS
↓
Spreadsheet
```

完成

---

## 対象

```text
WiFi

HTTPS

Payload送信

再送制御
```

---

## 完了条件

```text
24時間連続送信成功
```

---

# Phase3

表示統合

状態。

```text
PENDING
```

---

## Goal

```text
ePaper表示完成
```

---

## 表示対象

```text
観測値

暦情報

今日の詩
```

---

## 完了条件

```text
自動更新成功
```

---

# Phase4

長期運用試験

状態。

```text
PENDING
```

---

## Goal

```text
安定運用確認
```

---

## 評価項目

```text
Calendar

Poem

API

UPS

RTC
```

---

## 完了条件

```text
30日以上安定稼働
```

---

# Phase5

筐体完成

状態。

```text
PENDING
```

---

## Goal

```text
完成機組立
```

---

## 対象

```text
筐体

配線整理

放熱

通気
```

---

## 完了条件

```text
完成版稼働
```

---

# 採択済み設計

## A1

```text
14_SPREADSHEET_SCHEMA
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
15_GAS_IMPLEMENTATION_GUIDE
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
16_TESTING_STRATEGY
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

# リスク

## Gemini

```text
API仕様変更
```

---

## Calendar

```text
祝日法改正

暦情報変更
```

---

## Hardware

```text
部材入荷待ち

納期変動
```

---

# 優先順位

## Highest

```text
Spreadsheet

Calendar

Poem

GAS API
```

---

## High

```text
ESP32統合
```

---

## Medium

```text
ePaper統合
```

---

## Low

```text
筐体

長期運用試験
```

---

# STATUS SUMMARY

| 項目             | 状態          |
| -------------- | ----------- |
| Phase0 設計      | COMPLETE    |
| Phase1 GAS実装   | IN_PROGRESS |
| Phase2 ESP32統合 | PENDING     |
| Phase3 表示統合    | PENDING     |
| Phase4 長期試験    | PENDING     |
| Phase5 筐体完成    | PENDING     |

---

# CHANGE LOG

| 日付         | 内容              |
| ---------- | --------------- |
| 2026-06-19 | A1採択反映          |
| 2026-06-19 | A2採択反映          |
| 2026-06-19 | A3採択反映          |
| 2026-06-19 | A4採択反映          |
| 2026-06-19 | B1採択反映          |
| 2026-06-19 | B2採択反映          |
| 2026-06-19 | system_config追加 |
| 2026-06-19 | GAS本実装フェーズへ移行   |
