# TPS63802_Module フットプリント設計仕様書

**Document ID**: PM-FP-005
**Document Name**: SPEC.md
**Module**: TPS63802_Module
**Library**: PowerModules.pretty
**Version**: Release v1.0
**Status**: RELEASED
**Author**: Digital Kakejiku Project
**Last Updated**: 2026-07-17

---

# 1. 目的

本書は PowerModules.pretty に登録する
TPS63802_Module フットプリントの設計仕様を定義する。

本書は本フットプリントの設計・レビュー・保守・再構築の
唯一の仕様書とする。

KiCadフットプリント作成時は
本書および

```
COORDINATES.md
```

を同時に参照すること。

---

# 2. 適用範囲

本仕様は以下に適用する。

- PowerModules.pretty
- TPS63802_Module.kicad_mod
- GitHub管理ドキュメント
- PCBレイアウト
- レビュー資料

---

# 3. モジュール概要

TPS63802を搭載した
昇降圧DC/DCコンバータモジュールである。

本プロジェクトでは

- UPS出力5V
- TPS63802
- 安定した3.3V生成

を目的として使用する。

用途

- XIAO ESP32S3
- OLED
- RTC
- I2Cデバイス
- SPIデバイス
- 各種センサー

への3.3V供給。

---

# 4. 基本設計方針

PowerModules.pretty 全体で
以下を統一する。

## 4.1 原点

基板中心

```
X=0
Y=0
```

---

## 4.2 実測優先

メーカー図面より

現物実測

を優先する。

---

## 4.3 Pad管理

Padには

```
番号のみ
```

を持たせる。

信号名は回路図シンボルで管理する。

---

## 4.4 レイヤ

|Layer|用途|
|---|---|
|F.Fab|機械外形|
|F.SilkS|視認情報|
|F.Courtyard|占有領域|

---

# 5. モジュール仕様

|項目|内容|
|---|---|
|名称|TPS63802_Module|
|種類|Buck-Boost Converter|
|端子数|8|
|実装|Through Hole|
|配置|左右対称|

---

# 6. ピン仕様

|Pad|信号|
|---:|---|
|1|VIN|
|2|VIN|
|3|GND|
|4|GND|
|5|VOUT|
|6|VOUT|
|7|GND|
|8|GND|

Pad番号のみを管理する。

---

# 7. Pad仕様

Pad Type

```
Through Hole
```

Pad Shape

```
Rect
```

Pad1〜Pad8

すべて矩形。

詳細寸法は

```
COORDINATES.md
```

を参照する。

---

# 8. ドリル径

VIN

```
1.0mm
```

VOUT

```
1.0mm
```

GND

Pad3

Pad4

```
0.8mm
```

Pad7

Pad8

```
1.0mm
```

実測値を採用する。

---

# 9. 基板外形

管理レイヤ

```
F.Fab
```

寸法

```
25.840 × 12.850 mm
```

中心原点。

矩形。

---

# 10. Courtyard

管理レイヤ

```
F.Courtyard
```

F.Fabより

```
0.500mm
```

外側。

寸法

```
26.840 × 13.850 mm
```

---

# 11. シルク仕様

管理レイヤ

```
F.SilkS
```

表示

左側

```
VIN
VIN
GND
GND
```

右側

```
VOUT
VOUT
GND
GND
```

さらに

```
TOP
```

を表示する。

Pin1識別用

L字マーク

を左上に配置する。

---

# 12. Reference

Field

```
Reference
```

初期値

```
J**
```

Layer

```
F.SilkS
```

---

# 13. Value

Field

```
Value
```

値

```
TPS63802_Module
```

Layer

```
F.Fab
```

Referenceと重ならない位置へ配置する。

---

# 14. Description

KiCad Property

```
Description
```

値

```
TPS63802 Buck-Boost Power Module
```

トップレベル

```
(descr "TPS63802 Buck-Boost Power Module")
```

についても

同一文字列を設定する。

---

# 15. Keywords

KiCad Tags

```
TPS63802
Buck
Boost
DCDC
Converter
Power
3V3
```

トップレベル

```
(tags "TPS63802 Buck Boost DCDC Converter Power 3V3")
```

を設定する。

---

# 16. Design Rationale

## 16.1 原点

採択

```
基板中心
```

理由

PowerModules.pretty 全体で
統一した配置基準を維持するため。

---

## 16.2 現物実測

採択

```
現物実測優先
```

理由

モジュール販売元による寸法差異を吸収するため。

---

## 16.3 Pad番号

採択

```
Pad番号のみ
```

理由

信号管理を回路図シンボルへ
一元化するため。

---

## 16.4 Through Hole

採択

```
Through Hole
```

理由

対象モジュールが
ピンヘッダー実装済みであるため。

---

## 16.5 Pad形状

採択

```
Rect
```

理由

元モジュールの実装状態を忠実に再現するため。

---

## 16.6 シルク

採択

```
端子名称表示
```

理由

ユニバーサル基板配線時の
誤接続を防止するため。

---

## 16.7 TOP表示

採択

```
TOP
```

理由

180°逆実装を防止するため。

---

## 16.8 Pin1識別

採択

```
L字マーク
```

理由

Pin1位置を容易に識別できるため。

---

## 16.9 Description

採択

```
TPS63802 Buck-Boost Power Module
```

理由

KiCadライブラリ検索および
フットプリント管理性向上のため。

---

## 16.10 Keywords

採択

```
TPS63802
Buck
Boost
DCDC
Converter
Power
3V3
```

理由

ライブラリ検索性向上のため。

---

# 17. 品質基準

ライブラリ登録前に
以下を確認する。

- 原点
- Pad番号
- Pad座標
- Pad寸法
- ドリル径
- F.Fab
- F.Courtyard
- F.SilkS
- TOP表示
- Pin1表示
- Reference
- Value
- Description
- Tags
- DRC
- ライブラリ再読込

すべてPASSであること。

---

# 18. レビュー結果

|項目|判定|
|---|---|
|構文|PASS|
|Pad配置|PASS|
|Pad寸法|PASS|
|Pad番号|PASS|
|原点|PASS|
|F.Fab|PASS|
|F.Courtyard|PASS|
|シルク|PASS|
|TOP表示|PASS|
|Pin1識別|PASS|
|Description|PASS|
|Keywords|PASS|
|PowerModules.pretty整合|PASS|

---

# 19. 最終判定

Design Review

```
PASS
```

Library Review

```
PASS
```

PCB Placement

```
PASS
```

GitHub Registration

```
PASS
```

Release

```
APPROVED
```

---

# 20. 関連文書

- COORDINATES.md
- ../common/FOOTPRINT_LIBRARY_RULES.md
- ../common/FOOTPRINT_COORDINATE_RULES.md
- ../common/FOOTPRINT_REVIEW_CHECKLIST.md
- ../common/FOOTPRINT_DESIGN_WORKFLOW.md
- ../common/MEASUREMENT_GUIDE.md
- ../common/DESIGN_RATIONALE_GUIDE.md

---

# 21. 再構築手順

1. 新規フットプリント作成
2. 原点を基板中心へ設定
3. F.Fab作成
4. Pad配置
5. Pad番号設定
6. Pad寸法設定
7. ドリル径設定
8. F.SilkS文字配置
9. TOP表示追加
10. Pin1識別追加
11. F.Courtyard作成
12. Reference配置
13. Value配置
14. Description設定
15. Tags設定
16. 保存
17. ライブラリ再読込
18. PCBへ仮配置
19. DRC実施
20. GitHub登録

---

# 22. 保守方針

フットプリント変更時は
以下を同時更新すること。

- TPS63802_Module.kicad_mod
- SPEC.md
- COORDINATES.md
- FOOTPRINT_CHANGELOG.md

設計変更は
PowerModules.pretty 全体との整合性を維持すること。

---

# 23. 変更履歴

|Version|日付|内容|
|---|---|---|
|v1.0|2026-07-17|初版制定。TPS63802_Module(3).kicad_modに合わせて仕様書を作成。Description・Tags・TOP表示・Pin1識別を正式仕様として反映。|