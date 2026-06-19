# 08_POWER_ARCHITECTURE.md

最終更新: 2026-06-03

---

## 1. 概要

本書は digital-kakejiku の電源アーキテクチャを定義する。

本機は据置型・常時稼働を前提とし、通常時はUSB給電で動作する。停電またはUSB給電喪失時は、18650リチウムイオン電池へ自動的に切り替え、観測データの保存を継続するUPS方式を採用する。

本書では、電源ブロック構成、電圧系統、保護部品、監視項目、停電時の動作方針を整理する。

---

## 2. 関連ドキュメント

| 文書 | 内容 |
|---|---|
| 01_HARDWARE_OVERVIEW.md | 採択部材とハードウェア概要 |
| 02_SOFTWARE_OVERVIEW.md | PowerManager責務 |
| 04_STATE_MACHINE.md | BATTERY_MODE状態遷移 |
| 05_WIRING_DIAGRAM.md | 配線定義 |
| 07_DISPLAY_UI_SPEC.md | 電源状態表示 |
| 03_LOG_FORMAT.md | power/event/system/errorログ形式 |
| 06_GAS_API_SPEC.md | system/error payload仕様 |
| 11_SECURITY_MANAGEMENT.md | ログ出力禁止情報 |

---

## 3. 用語定義

| 用語 | 意味 |
|---|---|
| 据置型 | 基本的に移動を想定しない設置形態 |
| 常時稼働 | 電源投入状態を継続し、観測を止めない運用 |
| UPS方式 | 外部給電喪失時に電池へ切り替えて動作継続する方式 |
| 5V系 | 主にUSBまたはIP5306昇圧出力に由来する電源系統 |
| 3.3V系 | TPS63802で生成し、MCUおよび多くのセンサーへ供給する電源系統 |

---

## 4. 採択済み電源構成

| 項目 | 採択部材 | 状態 | 備考 |
|---|---|---|---|
| バッテリー | 18650 リチウムイオン電池 | CONFIRMED | 容量は実装時に選定 |
| 充電・昇圧管理 | IP5306 | CONFIRMED | IC採択は確定。実装モジュール仕様はPROPOSED |
| 逆流防止 | DMG2305UX-13 | CONFIRMED | P-MOSFET |
| 3.3V生成 | TPS63802 | CONFIRMED | 昇降圧DC/DC |
| 過電流保護 | ポリスイッチ | CONFIRMED | USB入力または電源ライン保護 |

---

## 5. 電源ブロック構成

```text
USB-C入力
   │
   ▼
ポリスイッチ
   │
   ▼
IP5306
   │
   ├── 18650 充電
   │
   └── 5V系出力
            │
            ├── SPS30
            │
            ▼
      DMG2305UX-13
            │
            ▼
        TPS63802
            │
            ▼
          3.3V系
            │
            ├── XIAO ESP32S3 Plus
            ├── SCD41
            ├── SGP41
            ├── BME680
            ├── LTR390
            ├── DS3231+AT24
            ├── MCP23017
            ├── HLK-LD2410C（電源電圧は実機確認）
            └── ICS-43434
```

---

## 6. 電圧系統

### 6.1 5V系

| デバイス | 用途 | 備考 |
|---|---|---|
| SPS30 | 粒子状物質センサー | 5V系給電 |
| TPS63802入力 | 3.3V系生成元 | IP5306出力から供給 |

### 6.2 3.3V系

| デバイス | 用途 | 備考 |
|---|---|---|
| XIAO ESP32S3 Plus | MCU | 3.3V系 |
| SCD41 | CO₂ | I2C |
| SGP41 | VOC / NOx | I2C |
| BME680 | 温度・湿度・気圧 | I2C |
| LTR390 | 照度・UV | I2C |
| DS3231+AT24 | RTC / EEPROM | I2C |
| MCP23017 | GPIO拡張 | I2C |
| ICS-43434 | 音環境観測 | I2S |
| HLK-LD2410C | 人感検知 | 3.3Vまたは5V、実機確認待ち |

---

## 7. 電源フロー

### 7.1 通常時

```text
USB-C入力
 ↓
IP5306
 ↓
5V系
 ↓
TPS63802
 ↓
3.3V系
 ↓
MCU・センサー動作
```

通常時はUSB給電を主電源とする。

18650はIP5306により充電・維持される。

---

### 7.2 停電時

```text
USB-C入力喪失
 ↓
18650
 ↓
IP5306
 ↓
5V系
 ↓
TPS63802
 ↓
3.3V系
 ↓
観測・保存を継続
```

停電時は電池運転へ移行する。

このとき、通信と表示更新は抑制し、未保存ログのmicroSD保存を優先する。

---

### 7.3 復電時

```text
USB-C入力復帰
 ↓
IP5306通常給電へ復帰
 ↓
18650充電再開
 ↓
NORMAL動作へ復帰
```

復電時はPowerManagerがUSB給電復帰を検知し、SystemManagerへ通知する。

---


---

## 7.4 電源切替の責務

査読指摘を反映し、「UPS自動切替」の責務を以下の通り明確化する。

### ハードウェア側の責務

USB給電喪失時の給電元移行は、以下の電源回路構成によるUPS的動作として扱う。

- IP5306
- 18650
- DMG2305UX-13
- TPS63802
- ポリスイッチ

ハードウェア側は、USB入力、18650、5V系、3.3V系の電源経路を構成し、USB喪失時に18650運用へ移行できる構成を担う。

### ソフトウェア側の責務

PowerManagerは電源切替そのものを実行しない。

PowerManagerの責務は以下である。

- USB給電有無を検知する
- 電池電圧を監視する
- BATTERY_MODE状態を管理する
- `event_log` へ `USB_POWER_LOST` / `USB_POWER_RESTORE` を記録する
- `system_log` へ `power_mode` / `battery_voltage` を記録する
- 必要に応じて `error_log` へ `POWER_ERROR` / `BATTERY_ERROR` を記録する

### 明示的な禁止事項

PowerManagerは、ソフトウェア処理として給電経路を切り替えない。

本プロジェクトにおける「自動切替」は、PowerManagerがFETや電源ICを能動制御して切り替えることを意味しない。


## 8. 保護機能

| 保護対象 | 部材 | 目的 |
|---|---|---|
| USB入力 | ポリスイッチ | 過電流保護 |
| 逆流防止 | DMG2305UX-13 | USB系・電池系間の意図しない逆流防止 |
| 3.3V系 | TPS63802 | 安定化・昇降圧 |
| バッテリー | IP5306 | 充電・放電管理 |

---

## 9. 監視項目

| 項目 | 取得元 | 用途 |
|---|---|---|
| USB Presence | USB入力検出回路 | 通常給電 / 停電判定 |
| Battery Voltage | 分圧回路または電源監視回路 | 低電圧判定 |
| Power Mode | PowerManager内部状態 | NORMAL / BATTERY_MODE |
| Low Voltage | Battery Voltageから判定 | 警告・保護動作 |
| Restore Event | USB Presence復帰 | NORMAL復帰 |

---


### 9.1 監視項目の確定度

| 項目 | 状態 | 備考 |
|---|---|---|
| Power Mode管理 | CONFIRMED | USB_MODE / BATTERY_MODE |
| Battery Voltage監視 | CONFIRMED | 回路方式・分圧比は実装時確定 |
| USB Presence検出 | PROPOSED | 検出方法はIP5306実モジュール仕様に依存 |
| Low Voltage閾値 | PROPOSED | 実測後に決定 |
| Restore Event検出 | PROPOSED | USB Presence検出方式確定後に決定 |


---

## 10. PowerManagerとの関係

PowerManager は電源状態を監視し、SystemManagerへ状態変化を通知する。

| 検知内容 | 通知イベント | 遷移先 |
|---|---|---|
| USB給電喪失 | USB_POWER_LOST | BATTERY_MODE |
| USB給電復帰 | USB_POWER_RESTORE | NORMAL |
| 低電圧 | POWER_ERROR | 保護動作 |
| 電圧正常 | POWER_NORMAL | NORMAL継続 |

詳細な状態遷移は `04_STATE_MACHINE.md` を参照する。

---

## 11. 停電時の動作方針

停電時は以下の優先順位で動作する。

| 優先 | 処理 | 方針 |
|---:|---|---|
| 1 | 未保存ログ保存 | microSD保存を最優先 |
| 2 | RTC維持 | DS3231を時刻基準として継続 |
| 3 | センサー観測 | 必要に応じて継続 |
| 4 | 通信 | 抑制または停止 |
| 5 | E-Paper更新 | 最小限に抑制 |

---

## 12. 低電圧時の動作方針

低電圧時はデータ保護を優先する。

| 状態 | 動作 |
|---|---|
| 軽度低電圧 | SYSTEM_LOG記録、表示に警告 |
| 継続低電圧 | 通信抑制、表示更新抑制 |
| 重大低電圧 | 未保存ログ保存を優先 |
| 動作継続困難 | シャットダウン相当処理を検討 |

完全なシャットダウン動作の可否は、実機検証後に確定する。

---


### 12.1 低電圧閾値の分類

査読指摘を反映し、BATTERY_MODE関連の閾値を以下の3系統に分離して管理する。

| 分類 | 用途 | 状態 |
|---|---|---|
| USB喪失検知閾値 | USB給電喪失を検知しBATTERY_MODEへ遷移する | PROPOSED |
| 低電圧警告閾値 | 電池残量低下を警告し通信・表示抑制を検討する | PROPOSED |
| 復電検知閾値 | USB給電復帰を検知しNORMALへ復帰する | PROPOSED |

現時点では具体電圧を固定しない。

IP5306実モジュール仕様、USB Presence検出方式、実負荷電流、18650容量、発熱を確認した後に確定する。


---

## 13. 電流容量確認方針

現時点では、全デバイス接続時の実負荷電流は未測定である。

初期PoCでは以下を確認する。

| 確認項目 | 内容 |
|---|---|
| 5V系電流 | SPS30動作時の電流 |
| 3.3V系電流 | MCU + センサー群の合算電流 |
| microSDピーク | 書込時の瞬間電流 |
| E-Paperピーク | 画面更新時の瞬間電流 |
| TPS63802温度 | 連続動作時の発熱 |
| IP5306発熱 | USB給電・充電中の発熱 |

---

## 14. PoC確認項目

| 項目 | 確認内容 | 状態 |
|---|---|---|
| IP5306 | USB入力・18650充電・5V出力 | 未確認 |
| DMG2305UX-13 | 逆流防止動作 | 未確認 |
| TPS63802 | 3.3V安定出力 | 未確認 |
| SPS30 | 5V系での安定動作 | 未確認 |
| 3.3V系 | 全I2C/I2Sデバイス接続時の安定性 | 未確認 |
| USB Presence | 停電・復電検知 | 未確認 |
| Battery Voltage | 電池電圧取得 | 未確認 |
| BATTERY_MODE | 停電時の状態遷移 | 未確認 |

---

## 15. 未確定事項

| 項目 | 状態 | 備考 |
|---|---|---|
| 18650容量 | 未確定 | 筐体・稼働時間・入手性で決定 |
| LD2410C電源電圧 | 未確定 | 実モジュールで3.3V/5Vを確認 |
| TPS63802モジュール仕様 | 未確定 | 出力容量・EN端子有無・発熱確認 |
| Battery Voltage測定回路 | 未確定 | 分圧比・ADCピンは配線設計で確定 |
| USB Presence検出方法 | 未確定 | GPIO検出または電源IC信号利用を検討 |

---


### 15.1 IP5306の確定度管理

査読指摘を反映し、IP5306関連の確定度を粒度分解する。

| 項目 | 状態 | 意味 |
|---|---|---|
| IP5306採択 | CONFIRMED | 充電・昇圧管理用ICとして採択 |
| IP5306実装モジュール | PROPOSED | 実装用ブレイクアウトまたは基板仕様は未確定 |
| IP5306性能検証 | PROPOSED | 停電・復電、負荷応答、熱特性は未確認 |
| USB Presence検出方法 | PROPOSED | GPIO検出または電源IC信号利用を検討 |

### 15.2 PROPOSEDからCONFIRMEDへの昇格条件

以下を確認した時点で、該当項目をCONFIRMEDへ昇格する。

1. 実装予定モジュールの型番または回路仕様を決定する。
2. USB Presence検出方法を決定し、動作確認する。
3. 停電・復電時の切替動作を実測する。
4. SPS30、E-Paper、microSD動作時の負荷応答を確認する。
5. IP5306およびTPS63802周辺の発熱を確認する。


---

## 16. 採択方針

- 通常時はUSB給電で常時稼働する
- 停電時は18650で動作継続する
- UPS方式を採用する
- ローカル保存を最優先する
- 通信失敗または停電で観測データを失わない
- SPS30は5V系給電とする
- その他主要センサーは3.3V系給電とする
- DMG2305UX-13を逆流防止用P-MOSFETとして採択する
- IP5306表記に統一し、「IP5306系」とは記載しない

---

## 17. 変更履歴

| 日付 | 内容 |
|---|---|
| 2026-06-03 | 初版作成 |
| 2026-06-03 | 査読指摘を反映し、DMG2305UX-13確定、IP5306表記統一、停電時動作、監視項目、PoC確認項目を追加 |


---

# 2026-06-19 電源設計更新

## 電源アーキテクチャ確定

UPS方式を正式採択する。

構成

USB-C
↓
ポリスイッチ
↓
IP5306
↓
DMG2305UX-13
↓
TPS63802
↓
3.3V BUS

---

## 採択部品確定

- 18650
- IP5306
- DMG2305UX-13
- TPS63802
- ポリスイッチ

---

## 運用方針変更

従来のDeepSleep中心運用から、常時給電運用へ移行する。

基本方針

- 常時稼働
- UPS運用
- 自動切替
- ローカル保存優先

---

## 電源モード追加

### USB_MODE

通常状態

特徴

- USB給電
- 全機能利用

---

### BATTERY_MODE

停電状態

特徴

- 18650給電
- 自動切替

---

## 状態遷移

USB_MODE
↓ 停電
BATTERY_MODE
↓ 復電
USB_MODE

---

## 停電時優先順位

1. RTC
2. 観測
3. microSD保存
4. 通信
5. 表示更新

---

## RTC確定

採択

- DS3231
- AT24C32
- CR2032

停電時も時刻維持する。

---

## Display運用更新

前面

- E-Paper

方針

- 更新最小化

背面

- OLED 128×96

用途

- 設定
- 診断
- 保守

---

## センサー系

5V系

- SPS30

3.3V系

- SCD41
- SGP41
- BME680
- LTR390
- MCP23017
- DS3231
- OLED
- ICS-43434

LD2410Cは実機確認とする。

---

## PowerManager追加

役割

- 電源監視
- 状態管理
- ログ記録

状態

- USB_MODE
- BATTERY_MODE

---

## ログ連携

event_log

- POWER_LOSS
- POWER_RESTORE

error_log

- POWER_ERROR
- BATTERY_ERROR

system_log

- battery_voltage
- power_mode

---

## Calendar連携

暦取得失敗時も観測継続する。

表示

取得できません

---

## Poem連携

詩生成失敗時も観測継続する。

表示

取得できません

---

## UTF-8

採択

- UTF-8

---

## フォント

採択

- Noto Sans JP

---

## 設計凍結候補

- UPS方式
- IP5306
- TPS63802
- DMG2305UX-13
- USB_MODE
- BATTERY_MODE
- 停電時優先順位

---

## STATUS

| 項目 | 状態 | 備考 |
|---|---|---|
| UPS方式 | CONFIRMED | USB優先、停電時18650 |
| IP5306採択 | CONFIRMED | 充電・昇圧管理用ICとして採択 |
| IP5306実装モジュール | PROPOSED | 型番・基板仕様は未確定 |
| IP5306性能検証 | PROPOSED | 停電・復電、負荷応答、熱特性は実機確認待ち |
| TPS63802採択 | CONFIRMED | 主電源レギュレータ |
| DMG2305UX-13採択 | CONFIRMED | 逆流防止 |
| PowerManager監視方式 | CONFIRMED | 切替制御は行わない |
| USB Presence検出方法 | PROPOSED | 実装モジュール仕様確認後に決定 |
| BATTERY_MODE | CONFIRMED | 状態として採択 |
| USB喪失検知閾値 | PROPOSED | 実測後に確定 |
| 低電圧警告閾値 | PROPOSED | 実測後に確定 |
| 復電検知閾値 | PROPOSED | 実測後に確定 |
| 熱設計 | PROPOSED | DISCUSSION管理 |

