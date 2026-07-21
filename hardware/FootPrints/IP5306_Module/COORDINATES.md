# IP5306_Module 座標仕様書
**Document ID**: PM-FP-005
**Document Name**: COORDINATES.md
**Module**: IP5306_Module
**Version**: Release v2.0
**Status**: RELEASED
**Library**: PowerModules.pretty
**Last Updated**: 2026-07-17

---

# 1. 目的

本書は PowerModules.pretty に登録する
IP5306_Module フットプリントの
KiCad入力用座標および機械寸法を管理する。

本書は本モジュールの唯一の座標基準文書とする。

---

# 2. 座標系

## 原点

```
基板中心
```

```
X = 0.00
Y = 0.00
```

---

## 軸方向

```
X+

→
```

```
Y+

↓

KiCad標準
```

---

## 単位

```
mm
```

---

## 精度

```
0.01mm
```

---

# 3. 基板外形（F.Fab）

管理レイヤ

```
F.Fab
```

外形は実測値に基づき作成する。

管理対象

- 基板外形
- 基板切欠き
- モジュール突出部

※数値は KiCad フットプリントを正本とする。

---

# 4. Courtyard

管理レイヤ

```
F.Courtyard
```

最大機械外形に対し

```
+0.50mm
```

以上確保する。

線幅

```
0.05mm
```

---

# 5. Pad仕様

Pad Type

```
Through Hole
```

Pad Shape

|Pad|形状|
|---:|---|
|1|RoundRect|
|2|Oval|
|3|Oval|
|4|Oval|
|5|Oval|
|6|Oval|

Pad1をPin1識別とする。

---

# 6. Pad配置

Padは基板右側に縦一列で配置する。

上から

|Pad|信号|
|---:|---|
|6|OUT-5V|
|5|GND|
|4|BAT|
|3|GND|
|2|GND|
|1|VIN|

Pad番号は下から昇順となる。

---

# 7. Pad座標

Pad中心座標で管理する。

|Pad|X|Y|
|---:|---:|---:|
|1|KiCadデータ準拠|KiCadデータ準拠|
|2|KiCadデータ準拠|KiCadデータ準拠|
|3|KiCadデータ準拠|KiCadデータ準拠|
|4|KiCadデータ準拠|KiCadデータ準拠|
|5|KiCadデータ準拠|KiCadデータ準拠|
|6|KiCadデータ準拠|KiCadデータ準拠|

**注記**

本書では座標値を重複管理しない。

正式値は

```
IP5306_Module.kicad_mod
```

を正本とする。

---

# 8. Pin1

Pin1

```
VIN
```

位置

```
右下
```

Pad形状

```
RoundRect
```

---

# 9. シルク

管理レイヤ

```
F.SilkS
```

表示

```
OUT-5V
GND
BAT
GND
GND
VIN
```

端子名称はPad中心と対応させる。

文字高さ

```
約1.0mm
```

線幅

```
0.15mm
```

---

# 10. Reference

Field

```
Reference
```

Layer

```
F.SilkS
```

初期値

```
J**
```

配置

モジュール中央付近。

---

# 11. Value

Field

```
Value
```

Layer

```
F.Fab
```

表示

```
IP5306_Module
```

Referenceと重ならない位置に配置する。

---

# 12. Description

```
IP5306 UPS Power Module
```

---

# 13. Keywords

```
IP5306
UPS
Battery
Boost
Charger
Power
```

---

# 14. KiCad入力順

1. 基板外形（F.Fab）
2. Pad
3. Pin1形状
4. シルク文字
5. Reference
6. Value
7. Courtyard
8. Description
9. Keywords
10. 保存
11. エディタ終了
12. ライブラリ再読込
13. PCB配置確認

---

# 15. 完成確認

確認項目

- 基板中心原点
- Pad番号
- Pad形状
- シルク文字
- Reference
- Value
- Description
- Keywords
- F.Fab
- F.Courtyard

---

# 16. Design Rationale

## 原点

採択

```
基板中心
```

理由

PowerModulesライブラリ全体との整合性を維持するため。

---

## Pad配置

採択

```
実モジュールと同一配置
```

理由

ユニバーサル基板配線およびPCB設計時の誤接続を防止するため。

---

## シルク

採択

```
端子名称表示
```

理由

配線作業およびレビュー性を向上させるため。

---

## Description / Keywords

採択

登録する。

理由

KiCadライブラリ検索性向上のため。

---

# 17. 最終判定

Design Review

```
PASS
```

Footprint Review

```
PASS
```

Library Registration

```
PASS
```

PCB Placement

```
PASS
```

---

# 18. 関連文書

- SPEC.md
- ../common/FOOTPRINT_LIBRARY_RULES.md
- ../common/FOOTPRINT_COORDINATE_RULES.md
- ../common/FOOTPRINT_REVIEW_CHECKLIST.md
- ../common/DESIGN_RATIONALE_GUIDE.md

---

# 19. 変更履歴

|Version|内容|
|---|---|
|v2.0|Release初版。PowerModules.pretty用IP5306_Module座標仕様書を制定。|