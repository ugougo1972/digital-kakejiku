# 09 SPI Resource Control

**タイトル**  
09 SPI Resource Control

**最終更新**  
2026-07-15

**文書版**  
vNext 1.3

**STATUS**  
FINALIZED

**責務**  
本書は digital-kakejiku における SPI バス資源の割り当て、共有方式、排他制御および通信ルールを定義する正式設計書である。

**Single Source**  
本書は SPI バス設計および資源管理を管理する唯一の文書である。

SPI接続機器、CS割り当て、排他制御および通信ルールは本書を正式情報とし、他文書では重複管理しない。

---

# 対象読者

- ハードウェア設計者
- ESP32 Firmware開発者
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
- docs/05_WIRING_DIAGRAM.md
- docs/07_DISPLAY_UI_SPEC.md
- docs/08_POWER_ARCHITECTURE.md

## 後続

- ESP32 Firmware実装
- 本体基板製作
- システム統合試験

---

# 1. 文書の目的

本書は SPI バス資源管理を定義する。

本書では以下を管理する。

- SPI接続機器
- バス共有方式
- CS管理
- 排他制御
- 通信ルール
- SPI設計方針

通信プロトコル実装およびライブラリ実装は本書では管理しない。

---

# 2. SPI設計方針

本システムでは以下を基本方針とする。

- SPIバスは共有する。
- CS信号でデバイスを選択する。
- 同時アクセスを禁止する。
- 排他制御を実装する。
- 配線長を最小化する。
- Single Source of Truth を維持する。

---

# 3. SPI接続機器

本システムでSPI接続する機器を以下に示す。

|デバイス|用途|STATUS|
|---|---|---|
|7.5inch E-Paper|表示装置|CONFIRMED|
|microSD Card|データ保存|CONFIRMED|

将来的な追加デバイスは本章を更新して管理する。

---

# 4. SPIバス構成

```text
              XIAO ESP32S3 Plus

             MOSI
             MISO
             SCK
                │
      ──────────┼──────────
                │
      ┌─────────┴─────────┐
      │                   │
 E-Paper Driver        microSD
      │                   │
     CS1                 CS2
```

SPI信号線（MOSI・MISO・SCK）は共有し、CS信号のみ個別に割り当てる。

---

# 5. SPIインターフェース

本章では SPI バスのインターフェース仕様を定義する。

詳細なピン番号は **05_WIRING_DIAGRAM.md** を正式情報とする。

---

## 5.1 共通信号

すべての SPI デバイスで以下の信号を共有する。

|信号|用途|
|---|---|
|MOSI|Master → Slave|
|MISO|Slave → Master|
|SCK|シリアルクロック|
|GND|基準電位|

---

## 5.2 個別信号

各デバイスは専用の CS 信号を持つ。

必要に応じて以下の補助信号を使用する。

|信号|用途|
|---|---|
|CS|デバイス選択|
|BUSY|状態通知|
|RST|リセット|
|DC|Data / Command切替|

BUSY・RST・DC は E-Paper 専用信号であり、他デバイスと共有しない。

---

# 6. CS管理

SPIバス共有のため、CS制御を明確に管理する。

---

## 基本方針

- 同時に複数CSを有効化しない。
- 通信開始前に対象CSのみを有効化する。
- 通信終了後はCSを無効化する。
- CS切替時は必要に応じて待機時間を設ける。

---

## デバイス割り当て

|CS|対象|
|---|---|
|CS1|7.5inch E-Paper|
|CS2|microSD|

追加デバイスが採用された場合は本章を更新する。

---

# 7. 排他制御

SPIバスは共有資源であるため排他制御を行う。

---

## 基本方針

- 同時通信は禁止する。
- 通信要求はシリアライズする。
- 通信中は他デバイスへアクセスしない。
- 通信終了後に排他を解除する。

---

## 管理責務

排他制御は ESP32 Firmware が担当する。

各デバイスドライバが個別にSPI排他を管理してはならない。

---

# 8. 通信順序

SPI通信は以下の順序を基本とする。

```text
Acquire SPI
      │
Select CS
      │
Transfer
      │
Wait Complete
      │
Release CS
      │
Release SPI
```

例外的な通信順序が必要なデバイスは個別実装で管理する。

---

# 9. 通信優先順位

複数のSPI通信要求が同時に発生した場合は、以下の優先順位で処理する。

|優先順位|対象|理由|
|---:|---|---|
|1|7.5inch E-Paper|表示更新の一貫性維持|
|2|microSD|データ保存・読込|

優先順位の変更は、影響評価を実施したうえで本書を更新する。

---

# 10. エラー処理

SPI通信中に異常を検出した場合は、安全に通信を終了し、状態を復旧する。

---

## 10.1 基本方針

- 通信異常を検出した場合は直ちにCSを無効化する。
- 必要に応じてSPIバスを初期化する。
- エラー内容をError Logへ記録する。
- 復旧処理はState Machineに従う。

---

## 10.2 エラー例

|事象|対応|
|---|---|
|通信タイムアウト|通信終了・Error Log出力|
|BUSY解除待ちタイムアウト|通信中止・Error Log出力|
|初期化失敗|ERROR状態へ遷移|
|SPI初期化失敗|ERROR状態へ遷移|

状態遷移は **04_STATE_MACHINE.md** を正式情報とする。

---

# 11. 設計方針

SPI資源管理は以下を設計原則とする。

---

## 単一責務

SPI管理モジュールはSPI資源管理のみを担当する。

デバイス固有処理は各デバイスドライバへ委譲する。

---

## Single Source of Truth

SPI構成は本書を正式情報とする。

ピン配置は **05_WIRING_DIAGRAM.md** を正式情報とする。

---

## 保守性

- デバイス追加を容易にする。
- CS追加を容易にする。
- 排他制御を共通化する。
- 個別ドライバへの依存を最小化する。

---

## 拡張性

将来のSPIデバイス追加に対応できる構成を維持する。

---

# 12. 制約事項

本書では以下を定義しない。

|項目|管理文書|
|---|---|
|SPIライブラリ実装|ESP32 Firmware|
|GPIO番号|05_WIRING_DIAGRAM.md|
|クロック設定値|ESP32 Firmware|
|DMA利用有無|ESP32 Firmware|
|通信速度|ESP32 Firmware|

---

# 13. 将来拡張

本章ではSPI資源管理における将来的な拡張方針を示す。

本章は構想を示すものであり、実装を保証するものではない。

---

## 13.1 SPIデバイス追加

将来的に以下のSPIデバイス追加を検討する。

|項目|STATUS|備考|
|---|---|---|
|SPIセンサー追加|PROPOSED|詳細未定|
|SPI表示装置追加|PROPOSED|詳細未定|
|SPIメモリ追加|PROPOSED|詳細未定|
|SPI通信モジュール追加|PROPOSED|詳細未定|

---

## 13.2 管理機能拡張

将来的に以下を検討する。

- SPI診断機能
- 通信統計取得
- エラー解析支援
- バス利用率監視

詳細仕様は今後決定する。

---

# 14. 未定義事項

本書では以下を定義しない。

|項目|状態|
|---|---|
|SPIクロック周波数|ESP32 Firmwareで管理|
|DMA利用方式|ESP32 Firmwareで管理|
|ライブラリ構成|ESP32 Firmwareで管理|
|割込み制御方式|ESP32 Firmwareで管理|
|通信性能評価|今後決定|

---

# CHANGE LOG

|日付|内容|
|---|---|
|2026-07-15|vNext 1.3文書体系に合わせ全面刷新。SPI資源管理文書として再設計し、README・CURRENT_STATUS・ROADMAP・01_HARDWARE_OVERVIEW・05_WIRING_DIAGRAM・08_POWER_ARCHITECTUREとの責務を明確化。Single Source of Truthに基づき、SPIバス構成・CS管理・排他制御・通信ルールを整理し、STATUS表記・文書構成を共通規約へ統一。|
|2026-07-14|SPI共有構成および排他制御方針を更新。|
|2026-07-13|E-Paper・microSDのSPI構成を整理。|

---

# 付録A. 関連文書の責務

|文書|責務|
|---|---|
|README.md|プロジェクト概要・入口|
|CURRENT_STATUS.md|現在の開発状況|
|ROADMAP.md|中長期計画|
|01_HARDWARE_OVERVIEW.md|ハードウェア全体構成|
|05_WIRING_DIAGRAM.md|配線仕様・GPIO割当|
|08_POWER_ARCHITECTURE.md|電源設計|
|09_SPI_RESOURCE_CONTROL.md|SPI資源管理（本書）|

---

# 付録B. 更新ルール

本書は以下の場合に更新する。

- SPIデバイス追加・削除
- SPIバス構成変更
- CS割当変更
- 排他制御変更
- 通信方針変更
- 文書体系変更

日常的な実装変更は記載しない。

実装詳細はESP32 Firmwareおよび関連設計書で管理する。

---

# 自己査読チェックリスト

- [x] 文書内矛盾なし
- [x] READMEとの責務分離
- [x] CURRENT_STATUSとの責務分離
- [x] ROADMAPとの責務分離
- [x] 00_PROJECT_CONVENTIONSとの整合
- [x] 01_HARDWARE_OVERVIEWとの責務分離
- [x] 05_WIRING_DIAGRAMとの責務分離
- [x] 08_POWER_ARCHITECTUREとの責務分離
- [x] STATUS表記統一
- [x] Single Source of Truth維持
- [x] GitHub表示崩れなし
- [x] vNext 1.3文書体系へ適合