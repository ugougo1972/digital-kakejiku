# 07 Display UI Specification

**タイトル**  
07 Display UI Specification

**最終更新**  
2026-07-15

**文書版**  
vNext 1.3

**STATUS**  
FINALIZED

**責務**  
本書は digital-kakejiku の表示システム、ユーザーインターフェース、画面構成および操作体系を定義する正式設計書である。

**Single Source**  
本書は表示仕様およびUI仕様を管理する唯一の文書である。

画面構成、表示要素、操作体系および表示更新方針は本書を正式情報とし、他文書では重複管理しない。

---

# 対象読者

- UI設計者
- ハードウェア設計者
- ESP32開発者
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
- docs/02_SOFTWARE_OVERVIEW.md
- docs/05_WIRING_DIAGRAM.md
- docs/10_CALENDAR_POEM_SUBSYSTEM.md
- docs/12_CONFIGURATION_MANAGEMENT.md

## 後続

- ESP32 Firmware実装
- UI実装
- システム統合試験

---

# 1. 文書の目的

本書はシステム全体の表示仕様を定義する。

本書では以下を管理する。

- 表示装置
- UI構成
- 操作体系
- 画面遷移
- 表示更新方針
- 保守画面

表示データ生成および詩生成仕様は管理しない。

---

# 2. UI設計方針

本システムでは以下を基本方針とする。

- 常時表示はE-Paperを使用する。
- 保守操作はOLEDへ分離する。
- 通常表示と保守UIを分離する。
- 情報量より視認性を優先する。
- 表示更新回数を最小化する。
- Single Source of Truth を維持する。

---

# 3. 表示装置

本システムでは2種類の表示装置を使用する。

|表示装置|用途|STATUS|
|---|---|---|
|7.5inch E-Paper|通常表示|CONFIRMED|
|OLED Display|保守画面|CONFIRMED|

---

# 4. UI構成

```text
          7.5inch E-Paper
   +----------------------------+
   |       通常表示画面          |
   +----------------------------+

               ▲

         ESP32 Firmware

               ▼

      OLED + Rotary Encoder

   +----------------------------+
   |      保守・設定画面         |
   +----------------------------+
```

通常表示と保守画面は独立して動作する。

---

# 5. 通常表示（E-Paper）

通常表示は、日常利用時に表示するメイン画面である。

利用者による操作を前提とせず、定期更新を基本とする。

---

## 5.1 表示内容

|項目|STATUS|
|---|---|
|日付|CONFIRMED|
|曜日|CONFIRMED|
|二十四節気|CONFIRMED|
|七十二候|CONFIRMED|
|天候情報|CONFIRMED|
|環境センサー情報|CONFIRMED|
|AI生成詩|CONFIRMED|

各表示内容の生成仕様は関連文書を正式情報とする。

---

## 5.2 更新方針

- 通常表示は必要時のみ更新する。
- E-Paper更新回数を最小化する。
- 更新タイミングはソフトウェアが管理する。
- 表示内容生成は Google Apps Script が担当する。

更新周期の詳細は **13_GAS_OPERATION_POLICY.md** を正式情報とする。

---

# 6. 保守画面（OLED）

OLED は設定変更および保守専用画面とする。

通常運転時の情報表示は担当しない。

---

## 6.1 主な機能

|機能|STATUS|
|---|---|
|システム状態表示|CONFIRMED|
|設定変更|CONFIRMED|
|ログ確認|CONFIRMED|
|通信状態確認|CONFIRMED|
|手動更新|CONFIRMED|
|詩再生成|CONFIRMED|

---

## 6.2 設計方針

- E-Paperとは独立して動作する。
- 保守者向けUIとする。
- 少ない操作で目的へ到達できる構成とする。
- 表示内容はリアルタイム性を優先する。

---

# 7. 操作体系

操作入力はロータリーエンコーダを使用する。

---

## 7.1 入力方法

|入力|用途|
|---|---|
|左回転|前項目|
|右回転|次項目|
|押下|決定|

長押し操作および複合操作は本書では定義しない。

---

## 7.2 操作方針

- 階層を浅くする。
- 戻る操作を容易にする。
- 誤操作を防止する。
- 操作回数を最小限とする。

---

# 8. 画面構成

OLED画面は以下の構成を基本とする。

```text
System Status
      │
      ├── Network
      ├── Sensors
      ├── Display
      ├── Configuration
      ├── Logs
      ├── Calendar
      ├── Poem
      └── Maintenance
```

詳細なメニュー構成は実装時に管理する。

---

# 9. 画面遷移

本章では、ユーザーインターフェース全体の画面遷移方針を定義する。

画面構成は保守性を優先し、複雑な階層構造を避ける。

---

## 9.1 遷移概要

```text
System Status
      │
      ├────────────┐
      ▼            ▼
Configuration   Sensor Status
      │            │
      ▼            ▼
Calendar      Communication
      │            │
      ▼            ▼
Poem         System Log
      │            │
      └──────┬─────┘
             ▼
      Maintenance
```

---

## 9.2 基本ルール

- 階層は可能な限り浅くする。
- 一つ前の画面へ容易に戻れる構成とする。
- 設定変更後は確認画面を表示する。
- エラー画面からは安全に復帰できる構成とする。

---

# 10. 表示更新

本章では表示更新の基本方針を定義する。

---

## 10.1 E-Paper

E-Paper は差分更新ではなく、ソフトウェア側で更新要否を判定する。

更新条件の詳細は **13_GAS_OPERATION_POLICY.md** を正式情報とする。

基本方針は以下とする。

- 必要時のみ更新する。
- 更新頻度を最小化する。
- 表示品質を優先する。

---

## 10.2 OLED

OLED は状態変化に応じて更新する。

基本方針

- メニュー遷移時
- 状態変化時
- 設定変更時
- エラー表示時

---

# 11. 表示データ

表示データの生成責務を以下に示す。

|表示項目|生成元|
|---|---|
|日付|Calendar|
|曜日|Calendar|
|二十四節気|Calendar|
|七十二候|Calendar|
|環境情報|Observation|
|AI生成詩|Poem Cache|
|状態表示|ESP32|

生成アルゴリズムは各設計文書を正式情報とする。

---

# 12. 設計方針

表示システムは以下を基本原則とする。

---

## 視認性

- 重要情報を優先表示する。
- 長時間閲覧しても疲れにくい構成とする。
- コントラストを重視する。

---

## 保守性

- UIと表示生成を分離する。
- 表示内容を容易に追加できる構成とする。
- 保守画面を独立させる。

---

## 拡張性

- 表示項目追加に対応する。
- レイアウト変更に対応する。
- 表示テーマ追加に対応する。

---

## Single Source of Truth

- UI仕様は本書を正式情報とする。
- 表示データ生成仕様は関連文書を正式情報とする。
- 状態管理は **04_STATE_MACHINE.md** を正式情報とする。

---

# 13. 制約事項

本章では表示システム設計における制約事項を定義する。

本書ではUI設計を対象とし、表示データ生成アルゴリズムや実装方法は対象外とする。

---

## 13.1 本書で定義しない事項

|項目|管理文書|
|---|---|
|状態遷移|04_STATE_MACHINE.md|
|データ取得|06_GAS_API_SPEC.md|
|暦生成|10_CALENDAR_POEM_SUBSYSTEM.md|
|Gemini Prompt|19_GEMINI_PROMPT_SPECIFICATION.md|
|表示更新周期|13_GAS_OPERATION_POLICY.md|
|表示レイアウト実装|ESP32 Firmware|

---

## 13.2 UI設計制約

以下を設計制約とする。

- 通常表示はE-Paperのみとする。
- 保守操作はOLEDのみとする。
- E-Paperから設定変更は行わない。
- OLEDは保守用途に限定する。
- UI仕様はモジュール構成へ依存しない。

---

# 14. 将来拡張

本章では将来的に追加を検討するUI機能を示す。

本章は構想であり、実装を保証するものではない。

---

## 14.1 表示拡張

|項目|STATUS|備考|
|---|---|---|
|複数テーマ|PROPOSED|詳細未定|
|画面レイアウト切替|PROPOSED|詳細未定|
|季節テーマ|PROPOSED|詳細未定|
|フォント切替|PROPOSED|詳細未定|
|アイコン追加|PROPOSED|詳細未定|

---

## 14.2 保守画面拡張

|項目|STATUS|備考|
|---|---|---|
|診断画面|PROPOSED|詳細未定|
|統計情報表示|PROPOSED|詳細未定|
|通信履歴表示|PROPOSED|詳細未定|
|ログ検索|PROPOSED|詳細未定|

---

# 15. 未定義事項

本書では以下を定義しない。

|項目|状態|
|---|---|
|画面デザイン詳細|今後決定|
|フォントデザイン|今後決定|
|アイコンデザイン|今後決定|
|アニメーション|今後決定|
|多言語表示|今後決定|

---

# CHANGE LOG

|日付|内容|
|---|---|
|2026-07-15|vNext 1.3文書体系に合わせ全面刷新。表示・UI仕様文書として再設計し、README・CURRENT_STATUS・ROADMAP・01_HARDWARE_OVERVIEW・02_SOFTWARE_OVERVIEW・04_STATE_MACHINE・10_CALENDAR_POEM_SUBSYSTEM・12_CONFIGURATION_MANAGEMENTとの責務を明確化。Single Source of Truthに基づき、表示装置・UI・操作体系・表示更新方針を整理し、STATUS表記・文書構成を共通規約へ統一。|
|2026-07-14|OLED保守画面構成およびE-Paper表示方針を更新。|
|2026-07-13|UI構成および画面遷移方針を更新。|

---

# 付録A. 関連文書の責務

|文書|責務|
|---|---|
|README.md|プロジェクト概要・入口|
|CURRENT_STATUS.md|現在の開発状況|
|ROADMAP.md|中長期計画|
|01_HARDWARE_OVERVIEW.md|表示ハードウェア構成|
|02_SOFTWARE_OVERVIEW.md|表示ソフトウェア構成|
|04_STATE_MACHINE.md|状態管理|
|07_DISPLAY_UI_SPEC.md|表示・UI仕様（本書）|
|10_CALENDAR_POEM_SUBSYSTEM.md|表示コンテンツ生成|
|12_CONFIGURATION_MANAGEMENT.md|設定管理|
|13_GAS_OPERATION_POLICY.md|更新周期・運用|

---

# 付録B. 更新ルール

本書は以下の場合に更新する。

- 表示装置変更
- UI構成変更
- メニュー構成変更
- 操作体系変更
- 表示更新方針変更
- 文書体系変更

日常的な画面デザイン調整は記載しない。

実装詳細はESP32 Firmwareおよび関連設計書で管理する。

---

# 自己査読チェックリスト

- [x] 文書内矛盾なし
- [x] READMEとの責務分離
- [x] CURRENT_STATUSとの責務分離
- [x] ROADMAPとの責務分離
- [x] 00_PROJECT_CONVENTIONSとの整合
- [x] 01_HARDWARE_OVERVIEWとの責務分離
- [x] 02_SOFTWARE_OVERVIEWとの責務分離
- [x] 04_STATE_MACHINEとの責務分離
- [x] 10_CALENDAR_POEM_SUBSYSTEMとの責務分離
- [x] 12_CONFIGURATION_MANAGEMENTとの責務分離
- [x] STATUS表記統一
- [x] Single Source of Truth維持
- [x] GitHub表示崩れなし
- [x] vNext 1.3文書体系へ適合