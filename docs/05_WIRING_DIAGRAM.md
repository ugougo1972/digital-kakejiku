# 05 Wiring Diagram

**タイトル**  
05 Wiring Diagram

**最終更新**  
2026-07-15

**文書版**  
vNext 1.3

**STATUS**  
FINALIZED

**責務**  
本書は digital-kakejiku の配線構成、インターフェース接続および信号接続方針を定義する正式設計書である。

**Single Source**  
本書は配線仕様を管理する唯一の文書である。

ピンアサイン、配線方式、信号接続およびモジュール間インターフェースは本書を正式情報とし、他文書では重複管理しない。

---

# 対象読者

- ハードウェア設計者
- 基板製作担当者
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

- docs/01_HARDWARE_OVERVIEW.md
- docs/08_POWER_ARCHITECTURE.md
- docs/09_SPI_RESOURCE_CONTROL.md
- docs/07_DISPLAY_UI_SPEC.md

## 後続

- 本体基板製作
- 電源基板製作
- システム統合試験

---

# 1. 文書の目的

本書はシステム全体の配線仕様を定義する。

本書では以下を管理する。

- モジュール間接続
- ピンアサイン
- バス構成
- 配線方針
- インターフェース

回路図および電源回路の詳細は管理しない。

---

# 2. 配線設計方針

本システムでは以下を基本方針とする。

- 配線交差を最小化する。
- モジュール交換を容易にする。
- 電源系と信号系を分離する。
- バス構成を明確にする。
- 保守性を優先する。
- Single Source of Truth を維持する。

---

# 3. システム配線構成

```text
              Google Apps Script
                     │
                  Wi-Fi
                     │
             XIAO ESP32S3 Plus
                     │
   ┌─────────┬────────┼─────────┐
   │         │        │         │
  SPI       I2C      I2S      GPIO
   │         │        │         │
E-Paper   Sensors   MEMS Mic  LD2410C
microSD    RTC
            OLED

        Power Board
             │
      5V / 3.3V / SENSE
             │
        Main Board
```

---

# 4. インターフェース一覧

|インターフェース|用途|詳細設計|
|---|---|---|
|SPI|E-Paper・microSD|09_SPI_RESOURCE_CONTROL.md|
|I2C|センサー・RTC・OLED|本書|
|I2S|MEMSマイク|本書|
|GPIO|人感・制御|本書|
|ADC|電源監視|08_POWER_ARCHITECTURE.md|
|USB|書込み・デバッグ|本書|

---

# 5. 本体基板インターフェース

本章では、本体基板に接続される主要インターフェースを定義する。

詳細なPCBレイアウトは本書の対象外とする。

---

## 5.1 SPI

SPIは高速通信を必要とするデバイスで共有する。

### 接続対象

|デバイス|STATUS|
|---|---|
|7.5inch E-Paper|CONFIRMED|
|microSD|CONFIRMED|

### 設計方針

- SPIバスを共有する。
- デバイスごとにCSを割り当てる。
- 配線長を最小化する。
- 詳細仕様は **09_SPI_RESOURCE_CONTROL.md** を正式情報とする。

---

## 5.2 I2C

I2Cは低速周辺機器を接続する共通バスとする。

### 接続対象

|デバイス|STATUS|
|---|---|
|BME680|CONFIRMED|
|SCD41|CONFIRMED|
|SGP41|CONFIRMED|
|LTR390|CONFIRMED|
|DS3231|CONFIRMED|
|AT24Cxx|CONFIRMED|
|OLED Display|CONFIRMED|

### 設計方針

- 単一バスで構成する。
- アドレス重複を避ける。
- 分岐を最小限とする。

---

## 5.3 I2S

I2SはMEMSマイク専用バスとして使用する。

|デバイス|STATUS|
|---|---|
|ICS-43434|CONFIRMED|

共有利用は行わない。

---

## 5.4 UART

UARTは必要なデバイスのみ接続する。

|デバイス|STATUS|
|---|---|
|SPS30|CONFIRMED|

その他用途は今後決定する。

---

## 5.5 GPIO

GPIOは制御信号および割込み信号に使用する。

|用途|STATUS|
|---|---|
|LD2410C OUT|CONFIRMED|
|Rotary Encoder|CONFIRMED|
|Push Switch|CONFIRMED|

詳細なGPIO割当は本書を正式情報とする。

---

# 6. 電源基板インターフェース

電源基板との接続は専用ヘッダーを使用する。

詳細回路は **08_POWER_ARCHITECTURE.md** を正式情報とする。

---

## 6.1 接続信号

|信号|用途|
|---|---|
|5V_OUT|5V供給|
|5V_GND|5Vリターン|
|3.3V_OUT|3.3V供給|
|3.3V_GND|3.3Vリターン|
|Battery_SENSE|電池監視|
|5V_SENSE|5V監視|
|SENSE_GND|ADC基準|

---

## 6.2 設計方針

- 電源基板と本体基板を分離する。
- コネクタ接続を基本とする。
- 保守時の交換を容易にする。
- 詳細設計は **08_POWER_ARCHITECTURE.md** を参照する。

---

# 7. USBインターフェース

USB Type-Cは開発およびデバッグ用途で使用する。

---

## 7.1 用途

- Firmware書込み
- シリアル通信
- デバッグ

---

## 7.2 配線方針

- USB D+ と D- はヘッダーピン経由で本体基板へ接続する。
- 電源ラインと信号ラインを分離する。
- USB-CコネクタのCC抵抗は使用するUSB-C基板に実装済みとし、本体基板への追加実装は行わない。

---

# 8. 配線設計共通ルール

全モジュールに共通して以下を適用する。

- 電源配線を優先して配置する。
- 信号線を可能な限り短くする。
- 配線交差を最小限とする。
- コネクタの着脱方向を統一する。
- 保守性を優先する。
- モジュール交換時に他配線へ影響しない構成とする。

---

# 9. XIAO ESP32S3 Plus ピン割り当て方針

本章では、XIAO ESP32S3 Plus のピン利用方針を定義する。

詳細なピン番号および信号一覧は、本書を正式情報とする。

---

## 9.1 基本方針

- ピンは単一責務を持つ。
- 通信バスは共有可能な範囲で共有する。
- 将来拡張用GPIOを可能な限り確保する。
- 変更時は関連文書を同時更新する。

---

## 9.2 通信バス

|インターフェース|用途|STATUS|
|---|---|---|
|SPI|E-Paper・microSD|CONFIRMED|
|I2C|センサー・RTC・OLED|CONFIRMED|
|I2S|MEMSマイク|CONFIRMED|
|UART|SPS30|CONFIRMED|
|Wi-Fi|GAS通信|CONFIRMED|

---

## 9.3 ADC

ADC入力は電源監視専用とする。

|用途|STATUS|
|---|---|
|Battery_SENSE|CONFIRMED|
|5V_SENSE|CONFIRMED|

---

# 10. モジュール間接続

本システムではモジュール間をコネクタ接続とし、保守性を優先する。

---

## 10.1 本体基板⇔電源基板

|信号|用途|
|---|---|
|5V_OUT|主電源|
|5V_GND|5Vリターン|
|3.3V_OUT|3.3V電源|
|3.3V_GND|3.3Vリターン|
|Battery_SENSE|ADC入力|
|5V_SENSE|ADC入力|
|SENSE_GND|ADC基準|

---

## 10.2 本体基板⇔OLED操作基板

|信号|用途|
|---|---|
|I2C SDA|通信|
|I2C SCL|通信|
|3.3V|電源|
|GND|GND|

---

## 10.3 本体基板⇔E-Paper

|信号|用途|
|---|---|
|SPI|通信|
|CS|チップ選択|
|DC|Data/Command|
|RST|リセット|
|BUSY|状態通知|
|5V|電源|
|GND|GND|

---

# 11. 配線品質方針

配線品質を維持するため、以下を共通ルールとする。

---

## 11.1 信号品質

- SPI配線長を最小化する。
- I2C配線は分岐を最小限とする。
- クロック線を不要に延長しない。
- 通信線を電源線から可能な範囲で離す。

---

## 11.2 電源品質

- 電源配線を太くする。
- GND配線を十分確保する。
- SENSE配線へ大電流を流さない。
- デカップリングコンデンサは対象IC近傍へ配置する。

---

## 11.3 保守性

- コネクタ名称を統一する。
- 信号名称を統一する。
- モジュール交換を容易にする。
- 配線識別を容易にする。

---

# 12. 設計上の制約

本書では以下を定義しない。

|項目|管理文書|
|---|---|
|回路図|回路図ファイル|
|PCBレイアウト|PCB設計データ|
|部品配置寸法|筐体設計書|
|ノイズ評価結果|試験結果|
|配線長実測値|製造データ|

---

# 13. 将来拡張

本章では、配線設計において考慮する将来的な拡張方針を示す。

本章は計画を示すものであり、実装を保証するものではない。

---

## 13.1 インターフェース拡張

将来的に以下の追加を検討する。

|項目|STATUS|備考|
|---|---|---|
|センサー追加用コネクタ|PROPOSED|詳細未定|
|予備GPIO活用|PROPOSED|詳細未定|
|保守用インターフェース追加|PROPOSED|詳細未定|
|通信モジュール追加|PROPOSED|詳細未定|

---

## 13.2 配線設計拡張

以下の拡張に対応できる構成を維持する。

- コネクタ追加
- センサー追加
- モジュール交換
- 配線経路変更

詳細は今後決定する。

---

# 14. 未定義事項

本書では以下を定義しない。

|項目|状態|
|---|---|
|PCBアートワーク|PCB設計データで管理|
|部品配置座標|PCB設計データで管理|
|ハーネス長|今後決定|
|ケーブル色規則|今後決定|
|製造治具|今後決定|

---

# CHANGE LOG

|日付|内容|
|---|---|
|2026-07-15|vNext 1.3文書体系に合わせ全面刷新。配線設計文書として再設計し、README・CURRENT_STATUS・ROADMAP・01_HARDWARE_OVERVIEW・08_POWER_ARCHITECTURE・09_SPI_RESOURCE_CONTROLとの責務を明確化。Single Source of Truthに基づき、配線・インターフェース・接続方針を整理し、STATUS表記・文書構成を共通規約へ統一。|
|2026-07-14|USB D+/D-ヘッダーピン経由、UPS構成、電源接続方針を反映。|
|2026-07-13|本体基板・電源基板インターフェースを更新。|

---

# 付録A. 関連文書の責務

|文書|責務|
|---|---|
|README.md|プロジェクト概要・入口|
|CURRENT_STATUS.md|現在の開発状況|
|ROADMAP.md|中長期計画|
|01_HARDWARE_OVERVIEW.md|ハードウェア全体構成|
|05_WIRING_DIAGRAM.md|配線仕様（本書）|
|07_DISPLAY_UI_SPEC.md|表示・操作インターフェース|
|08_POWER_ARCHITECTURE.md|電源設計|
|09_SPI_RESOURCE_CONTROL.md|SPI資源管理|

---

# 付録B. 更新ルール

本書は以下の場合に更新する。

- ピンアサイン変更
- 配線方式変更
- インターフェース追加・削除
- コネクタ仕様変更
- 電源接続変更
- 文書体系変更

日常的な開発進捗は記載しない。

現在の進捗は **CURRENT_STATUS.md** を正式情報とする。

---

# 自己査読チェックリスト

- [x] 文書内矛盾なし
- [x] READMEとの責務分離
- [x] CURRENT_STATUSとの責務分離
- [x] ROADMAPとの責務分離
- [x] 00_PROJECT_CONVENTIONSとの整合
- [x] 01_HARDWARE_OVERVIEWとの責務分離
- [x] 08_POWER_ARCHITECTUREとの責務分離
- [x] 09_SPI_RESOURCE_CONTROLとの責務分離
- [x] STATUS表記統一
- [x] Single Source of Truth維持
- [x] GitHub表示崩れなし
- [x] vNext 1.3文書体系へ適合