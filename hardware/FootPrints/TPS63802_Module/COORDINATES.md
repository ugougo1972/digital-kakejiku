# TPS63802_Module 座標仕様書

**Document ID**: PM-FP-006
**Document Name**: COORDINATES.md
**Module**: TPS63802_Module
**Library**: PowerModules.pretty
**Version**: Release v1.0
**Status**: RELEASED
**Author**: Digital Kakejiku Project
**Last Updated**: 2026-07-17

---

# 1. 目的

本書は
TPS63802_Module フットプリントの

- 座標
- 寸法
- レイヤ構成
- プロパティ配置

を定義する。

本書は
KiCadフットプリント再構築時の
唯一の座標仕様書とする。

---

# 2. 基本仕様

|項目|内容|
|---|---|
|単位|mm|
|原点|基板中心|
|X正方向|右|
|Y正方向|下|
|回転|0°|
|精度|0.001mm|

---

# 3. 原点

採択

```
X = 0.000
Y = 0.000
```

基板中心を
PowerModules.pretty 全体の
共通原点とする。

---

# 4. 基板外形

## 4.1 F.Fab

矩形

|項目|値|
|---|---:|
|左|-12.920|
|右|12.920|
|上|-6.425|
|下|6.425|

幅

```
25.840mm
```

高さ

```
12.850mm
```

線幅

```
0.100mm
```

Layer

```
F.Fab
```

---

## 4.2 F.Courtyard

矩形

|項目|値|
|---|---:|
|左|-13.420|
|右|13.420|
|上|-6.925|
|下|6.925|

幅

```
26.840mm
```

高さ

```
13.850mm
```

線幅

```
0.050mm
```

F.Fabから

```
0.500mm
```

外側。

Layer

```
F.Courtyard
```

---

# 5. Pad仕様

Pad Type

```
Through Hole
```

Pad Shape

```
Rect
```

Rotation

```
0°
```

Layers

```
*.Cu
*.Mask
```

---

# 6. Pad一覧

|Pad|信号|X|Y|Pad寸法|Drill|
|---:|---|---:|---:|---:|---:|
|1|VIN|-11.660|-5.080|2.625×2.580|1.000|
|2|VIN|-11.660|-2.540|2.625×2.580|1.000|
|3|GND|-11.660|2.540|2.625×2.580|0.800|
|4|GND|-11.660|5.080|2.625×2.580|0.800|
|5|VOUT|11.660|-5.080|2.540×2.580|1.000|
|6|VOUT|11.660|-2.540|2.540×2.580|1.000|
|7|GND|11.660|2.540|2.540×2.580|1.000|
|8|GND|11.660|5.080|2.540×2.580|1.000|

---

# 7. Pad配置

## 左列

```
Pad1
Pad2
Pad3
Pad4
```

中心

```
X = -11.660
```

---

## 右列

```
Pad5
Pad6
Pad7
Pad8
```

中心

```
X = 11.660
```

---

## 左右間隔

```
23.320mm
```

---

## Y座標

```
-5.080

-2.540

 2.540

 5.080
```

上下対称配置。

---

# 8. Pad寸法

## 左列

```
2.625 × 2.580
```

Pad

```
1
2
3
4
```

---

## 右列

```
2.540 × 2.580
```

Pad

```
5
6
7
8
```

---

# 9. ドリル径

Pad1

```
1.000
```

Pad2

```
1.000
```

Pad3

```
0.800
```

Pad4

```
0.800
```

Pad5

```
1.000
```

Pad6

```
1.000
```

Pad7

```
1.000
```

Pad8

```
1.000
```

---

# 10. Pad端部

左Pad

```
Pad端

-12.9725
```

F.Fab

```
-12.920
```

約

```
0.053mm
```

張り出す。

右Pad

```
12.930
```

F.Fab

```
12.920
```

約

```
0.010mm
```

張り出す。

これは
元フットプリントの
実測値を維持する。

# 11. シルク仕様

Layer

```
F.SilkS
```

---

## 11.1 左側表示

|表示|X|Y|
|---|---:|---:|
|VIN|-10.160|-5.080|
|VIN|-10.160|-2.540|
|GND|-10.160|2.540|
|GND|-10.160|5.080|

文字サイズ

```
0.800 × 0.800 mm
```

線幅

```
0.100 mm
```

---

## 11.2 右側表示

|表示|X|Y|
|---|---:|---:|
|VOUT|6.500|-5.080|
|VOUT|6.500|-2.540|
|GND|7.000|2.540|
|GND|7.000|5.080|

文字サイズ

```
0.800 × 0.800 mm
```

線幅

```
0.100 mm
```

---

## 11.3 TOP表示

|項目|値|
|---|---|
|文字|TOP|
|X|-2.540|
|Y|-5.080|
|回転|0°|
|Layer|F.SilkS|

文字サイズ

```
0.800 × 0.800 mm
```

線幅

```
0.100 mm
```

TOP表示は
モジュール方向識別用である。

---

# 12. Pin1識別

Pin1識別は
左上にL字マークを配置する。

|項目|値|
|---|---|
|縦線開始|(-15.000,-6.425)|
|縦線終了|(-15.000,-5.425)|
|横線開始|(-15.000,-6.425)|
|横線終了|(-14.000,-6.425)|

Layer

```
F.SilkS
```

線幅

```
0.100 mm
```

---

# 13. Reference

|項目|値|
|---|---|
|名称|Reference|
|値|J**|
|Layer|F.SilkS|
|X|0.000|
|Y|-0.500|
|回転|0°|
|文字サイズ|1.000 × 1.000 mm|
|線幅|0.100 mm|

---

# 14. Value

|項目|値|
|---|---|
|名称|Value|
|値|TPS63802_Module|
|Layer|F.Fab|
|X|0.000|
|Y|1.000|
|回転|0°|
|文字サイズ|1.000 × 1.000 mm|
|線幅|0.150 mm|

---

# 15. Description

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

Propertyと
トップレベルdescrは
同一文字列とする。

---

# 16. Keywords

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

# 17. 再構築手順

1. 新規フットプリント作成
2. 原点を基板中心へ設定
3. F.Fab作成
4. F.Courtyard作成
5. Pad1～Pad8配置
6. Pad番号設定
7. Pad寸法設定
8. ドリル径設定
9. シルク文字配置
10. TOP表示追加
11. Pin1識別追加
12. Reference配置
13. Value配置
14. Description設定
15. Tags設定
16. 保存
17. ライブラリ再読込
18. PCBへ配置
19. DRC確認
20. GitHub登録

---

# 18. 検証チェックリスト

|確認項目|基準|
|---|---|
|原点|基板中心|
|Pad数|8|
|Pad番号|1〜8|
|Pad配置|左右対称|
|Pad寸法|仕様一致|
|ドリル径|仕様一致|
|F.Fab|25.840×12.850|
|F.Courtyard|26.840×13.850|
|TOP表示|あり|
|Pin1表示|L字|
|Reference|J**|
|Value|TPS63802_Module|
|Description|設定済み|
|Tags|設定済み|
|DRC|PASS|
|ライブラリ再読込|PASS|

---

# 19. Design Rationale

## 原点

```
基板中心
```

PowerModules.pretty
全体との整合性を維持するため。

---

## Pad番号

```
番号のみ
```

信号管理を
シンボルへ集約するため。

---

## シルク

```
端子名称表示
```

配線ミス防止。

---

## TOP表示

```
TOP
```

180°逆実装防止。

---

## Pin1

```
L字マーク
```

視認性向上。

---

## Description

```
TPS63802 Buck-Boost Power Module
```

ライブラリ検索性向上。

---

## Tags

```
TPS63802
Buck
Boost
DCDC
Converter
Power
3V3
```

検索性向上。

---

# 20. 最終判定

Coordinate Review

```
PASS
```

Pad Review

```
PASS
```

Silkscreen Review

```
PASS
```

Library Registration

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

# 21. 関連文書

- SPEC.md
- ../common/FOOTPRINT_LIBRARY_RULES.md
- ../common/FOOTPRINT_COORDINATE_RULES.md
- ../common/FOOTPRINT_REVIEW_CHECKLIST.md
- ../common/FOOTPRINT_DESIGN_WORKFLOW.md
- ../common/MEASUREMENT_GUIDE.md
- ../common/DESIGN_RATIONALE_GUIDE.md

---

# 22. 変更履歴

|Version|日付|内容|
|---|---|---|
|v1.0|2026-07-17|初版制定。TPS63802_Module(3).kicad_modに合わせ、Pad座標・寸法・F.Fab・F.Courtyard・シルク・Reference・Value・Description・Tagsを正式仕様として反映。|