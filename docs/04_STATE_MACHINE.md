# 04 State Machine

**タイトル**  
04 State Machine

**最終更新**  
2026-07-15

**文書版**  
vNext 1.3

**STATUS**  
FINALIZED

**責務**  
本書は digital-kakejiku システムにおける状態遷移、状態定義、状態管理方針および状態間の遷移条件を定義する正式設計書である。

**Single Source**  
本書はシステム状態遷移を管理する唯一の文書である。

状態一覧、遷移条件および状態責務は本書を正式情報とし、他文書では重複管理しない。

---

# 対象読者

- ソフトウェア設計者
- ESP32開発者
- GAS開発者
- 保守担当者

---

# 関連文書

## 前提

- docs/00_PROJECT_CONVENTIONS.md

## 参照

- README.md
- CURRENT_STATUS.md
- ROADMAP.md

## 関連

- docs/02_SOFTWARE_OVERVIEW.md
- docs/03_LOG_FORMAT.md
- docs/06_GAS_API_SPEC.md
- docs/17_TROUBLESHOOTING.md
- docs/18_GAS_RETRY_STRATEGY.md

## 後続

- ESP32 Firmware実装
- GAS実装
- システム統合試験

---

# 1. 文書の目的

本書はシステム全体の状態遷移を定義する。

本書では以下を管理する。

- システム状態
- 状態遷移
- 状態責務
- 遷移条件
- エラー遷移
- 復旧方針

実装クラスや画面制御は管理しない。

---

# 2. 状態管理方針

本システムでは状態管理を一元化する。

以下を基本原則とする。

- 状態は単一管理とする。
- 状態遷移を明示する。
- 復旧経路を定義する。
- エラー状態を独立管理する。
- 状態と表示を分離する。

---

# 3. システム状態一覧

|状態|概要|
|---|---|
|BOOT|起動処理|
|INITIALIZE|初期化|
|IDLE|待機|
|MEASURE|観測|
|COMMUNICATION|通信|
|DISPLAY|表示更新|
|SLEEP|待機・省電力|
|ERROR|障害処理|
|RECOVERY|復旧処理|

---

# 4. 全体状態遷移

```text
BOOT
  │
  ▼
INITIALIZE
  │
  ▼
IDLE
  │
  ├────────────┐
  ▼            ▼
MEASURE   COMMUNICATION
  │            │
  └──────┬─────┘
         ▼
DISPLAY
     │
     ▼
SLEEP
     │
     ▼
IDLE

障害発生
     │
     ▼
ERROR
     │
     ▼
RECOVERY
     │
     ├──成功──►IDLE
     └──失敗──►ERROR
```

---

# 5. 状態定義

各状態は単一責務を持ち、状態遷移によってのみ変更される。

---

## 5.1 BOOT

### 目的

システム起動直後の処理を行う。

### 主な処理

- CPU起動
- RTC初期化
- Watchdog初期化
- 基本設定読込

### 遷移先

- INITIALIZE

---

## 5.2 INITIALIZE

### 目的

システム全体の初期化を行う。

### 主な処理

- GPIO初期化
- SPI初期化
- I2C初期化
- I2S初期化
- センサー初期化
- Display初期化
- 通信初期化

### 遷移先

- IDLE
- ERROR

---

## 5.3 IDLE

### 目的

通常待機状態。

### 主な処理

- イベント待ち
- Scheduler待機
- 割込み待ち

### 遷移先

- MEASURE
- COMMUNICATION
- DISPLAY
- SLEEP
- ERROR

---

## 5.4 MEASURE

### 目的

センサー観測を行う。

### 主な処理

- 全センサー取得
- データ検証
- Observation生成

### 遷移先

- COMMUNICATION
- DISPLAY
- ERROR

---

## 5.5 COMMUNICATION

### 目的

Google Apps Scriptとの通信を行う。

### 主な処理

- HTTPS通信
- Observation送信
- 設定取得
- 詩取得
- エラー判定

### 遷移先

- DISPLAY
- SLEEP
- ERROR

---

## 5.6 DISPLAY

### 目的

表示更新を行う。

### 主な処理

- E-Paper更新
- OLED更新
- 表示状態更新

### 遷移先

- SLEEP
- ERROR

---

## 5.7 SLEEP

### 目的

待機または省電力状態へ移行する。

### 主な処理

- 周辺停止
- タイマー設定
- 次回起動準備

### 遷移先

- IDLE
- ERROR

---

# 6. エラー状態

エラー状態は通常状態から独立して管理する。

障害発生時は必ず ERROR 状態へ遷移し、必要に応じて RECOVERY を実行する。

---

## 6.1 ERROR

### 目的

障害を安全に処理する。

### 主な処理

- エラー内容記録
- Error Log出力
- システム状態保存
- 復旧可否判定

### 遷移先

- RECOVERY

---

## 6.2 RECOVERY

### 目的

システム復旧を試行する。

### 主な処理

- 通信再試行
- デバイス再初期化
- 状態復元
- Retry実施

### 遷移先

|条件|遷移先|
|---|---|
|復旧成功|IDLE|
|復旧失敗|ERROR|

Retryの詳細仕様は **18_GAS_RETRY_STRATEGY.md** を正式情報とする。

---

# 7. 状態遷移条件

各状態間の遷移条件を以下に示す。

|現在状態|条件|次状態|
|---|---|---|
|BOOT|起動完了|INITIALIZE|
|INITIALIZE|初期化成功|IDLE|
|INITIALIZE|初期化失敗|ERROR|
|IDLE|観測開始|MEASURE|
|IDLE|通信要求|COMMUNICATION|
|IDLE|表示更新要求|DISPLAY|
|IDLE|待機要求|SLEEP|
|MEASURE|観測成功|COMMUNICATION|
|MEASURE|通信不要|DISPLAY|
|MEASURE|異常発生|ERROR|
|COMMUNICATION|通信成功|DISPLAY|
|COMMUNICATION|通信不要|SLEEP|
|COMMUNICATION|通信異常|ERROR|
|DISPLAY|更新完了|SLEEP|
|DISPLAY|表示異常|ERROR|
|SLEEP|タイマー起床|IDLE|
|SLEEP|異常検知|ERROR|
|ERROR|復旧開始|RECOVERY|
|RECOVERY|復旧成功|IDLE|
|RECOVERY|復旧失敗|ERROR|

---

# 8. 状態管理ルール

システム全体で以下のルールを適用する。

- 同時に複数状態を保持しない。
- 状態変更は状態管理モジュールのみが実施する。
- 状態変更時は必要に応じて System Log を出力する。
- エラーは ERROR 状態へ集約する。
- 復旧処理は RECOVERY を経由する。
- 状態名は固定とする。

---

# 9. ログとの関係

状態遷移時のログ出力は以下を基本とする。

|状態|ログ|
|---|---|
|BOOT|System Log|
|INITIALIZE|System Log|
|IDLE|System Log（必要時）|
|MEASURE|Observation Log|
|COMMUNICATION|System Log|
|DISPLAY|Event Log|
|SLEEP|System Log（必要時）|
|ERROR|Error Log|
|RECOVERY|System Log|

ログ仕様は **03_LOG_FORMAT.md** を正式情報とする。

---

# 10. ソフトウェアモジュールとの関係

状態管理はシステム全体を統括する機能であり、各モジュールは状態管理モジュールの制御下で動作する。

---

## 10.1 モジュール責務

|モジュール|状態管理との関係|
|---|---|
|Sensor Manager|MEASUREで動作|
|Display Manager|DISPLAYで動作|
|Communication Manager|COMMUNICATIONで動作|
|Power Manager|SLEEP・RECOVERYを支援|
|Configuration Manager|INITIALIZE・COMMUNICATIONで利用|
|Logger|全状態で利用可能|

状態管理は各モジュールへ処理開始・終了を通知する。

---

# 11. 設計方針

状態管理は以下を設計原則とする。

## 単一責務

状態管理モジュールは状態遷移のみを担当する。

個別処理は各モジュールへ委譲する。

---

## 状態の一元管理

状態は一か所のみで保持する。

複数モジュールで状態を個別保持しない。

---

## 再現性

同一条件では同一状態遷移となることを前提とする。

---

## 障害耐性

異常発生時は必ず ERROR を経由する。

復旧可能な場合のみ RECOVERY を実施する。

---

## 保守性

状態追加時は既存状態への影響を最小限にする。

---

# 12. 制約事項

本書では以下を定義しない。

|項目|管理文書|
|---|---|
|Scheduler実装|ソースコード|
|クラス構成|ソースコード|
|FreeRTOSタスク構成|ソースコード|
|割込み処理詳細|ソースコード|
|表示画面制御|07_DISPLAY_UI_SPEC.md|

---

# 13. 将来拡張

将来的に以下の状態追加を検討する。

|状態|STATUS|備考|
|---|---|---|
|OTA_UPDATE|PROPOSED|詳細未定|
|SELF_DIAGNOSIS|PROPOSED|詳細未定|
|MAINTENANCE|PROPOSED|詳細未定|
|SAFE_MODE|PROPOSED|詳細未定|

本章は将来構想であり、実装を保証するものではない。

---

# CHANGE LOG

|日付|内容|
|---|---|
|2026-07-15|vNext 1.3文書体系に合わせ全面刷新。状態遷移設計文書として再設計し、README・CURRENT_STATUS・ROADMAP・02_SOFTWARE_OVERVIEW・03_LOG_FORMAT・06_GAS_API_SPECとの責務を明確化。Single Source of Truthに基づき、状態一覧・遷移条件・設計方針を整理し、STATUS表記・文書構成を共通規約へ統一。|
|2026-07-14|ERROR/RECOVERY設計および状態遷移図を更新。|
|2026-07-13|状態管理方針を見直し。|

---

# 付録A. 関連文書の責務

|文書|責務|
|---|---|
|README.md|プロジェクト概要・入口|
|CURRENT_STATUS.md|現在の開発状況|
|ROADMAP.md|中長期計画|
|02_SOFTWARE_OVERVIEW.md|ソフトウェア全体構成|
|03_LOG_FORMAT.md|ログ仕様|
|04_STATE_MACHINE.md|状態遷移仕様（本書）|
|06_GAS_API_SPEC.md|API仕様|
|17_TROUBLESHOOTING.md|障害対応|
|18_GAS_RETRY_STRATEGY.md|Retry仕様|

---

# 付録B. 更新ルール

本書は以下の場合に更新する。

- 状態追加・削除
- 状態遷移変更
- エラー処理変更
- 復旧処理変更
- 状態管理方針変更
- 文書体系変更

日常的な実装変更は記載しない。

実装詳細はソースコードおよび関連設計書で管理する。

---

# 自己査読チェックリスト

- [x] 文書内矛盾なし
- [x] READMEとの責務分離
- [x] CURRENT_STATUSとの責務分離
- [x] ROADMAPとの責務分離
- [x] 00_PROJECT_CONVENTIONSとの整合
- [x] 02_SOFTWARE_OVERVIEWとの責務分離
- [x] 03_LOG_FORMATとの責務分離
- [x] 06_GAS_API_SPECとの責務分離
- [x] STATUS表記統一
- [x] Single Source of Truth維持
- [x] GitHub表示崩れなし
- [x] vNext 1.3文書体系へ適合