# USB_C_Breakout_6Pin 座標仕様書
**Document ID**: PM-FP-005
**Document Name**: USB_C_Breakout_6Pin_COORDINATES.md
**Version**: Release v2.0
**Status**: RELEASED
**Last Updated**: 2026-07-17

---

# 1. 目的

本書は USB_C_Breakout_6Pin フットプリントの
KiCad入力用座標を管理する。

PowerModules.pretty へ登録される
唯一の座標基準文書とする。

---

# 2. 座標系

## 原点

```
基板中心
```

```
X=0.00
Y=0.00
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

Layer

```
F.Fab
```

|要素|始点(X,Y)|終点(X,Y)|
|---|---|---|
|上辺|(-10.80,-7.10)|(10.80,-7.10)|
|右辺|(10.80,-7.10)|(10.80,7.10)|
|下辺|(10.80,7.10)|(-10.80,7.10)|
|左辺|(-10.80,7.10)|(-10.80,-7.10)|

---

# 4. USBシェル（F.Fab）

Layer

```
F.Fab
```

|要素|始点(X,Y)|終点(X,Y)|
|---|---|---|
|上辺|(-4.50,-8.50)|(4.50,-8.50)|
|右辺|(4.50,-8.50)|(4.50,-1.10)|
|下辺|(4.50,-1.10)|(-4.50,-1.10)|
|左辺|(-4.50,-1.10)|(-4.50,-8.50)|

---

# 5. Pad座標

Pad仕様

```
Through Hole
```

Pad径

```
1.80mm
```

穴径

```
1.00mm
```

|Pad|X|Y|
|---:|---:|---:|
|1|-6.35|5.73|
|2|-3.81|5.73|
|3|-1.27|5.73|
|4|1.27|5.73|
|5|3.81|5.73|
|6|6.35|5.73|

Pad1

```
RoundRect
```

Pad2〜Pad6

```
Circle
```

---

# 6. 固定穴

Pad Type

```
NPTH Mechanical
```

穴径

```
3.30mm
```

|穴|X|Y|
|---|---:|---:|
|H1|-8.25|-4.55|
|H2|8.25|-4.55|

中心間

```
16.50mm
```

---

# 7. Pin1マーク

Layer

```
F.SilkS
```

推奨

```
L字
```

線幅

```
0.15mm
```

Pad1外周から

```
0.30mm以上
```

離す。

---

# 8. 部品名称

Layer

```
F.SilkS
```

文字

```
USB-C 6P
```

高さ

```
1.00mm
```

線幅

```
0.15mm
```

---

# 9. 端子名称

Layer

```
F.SilkS
```

表示

```
VBUS
GND
CC1
D-
D+
CC2
```

高さ

```
0.80mm
```

線幅

```
0.12mm
```

Padおよび固定穴と重ねない。

---

# 10. Reference

Layer

```
F.SilkS
```

Field

```
Reference
```

初期値

```
J**
```

---

# 11. Value

Layer

```
F.Fab
```

Field

```
Value
```

表示

```
USB_C_Breakout_6Pin
```

---

# 12. Courtyard

Layer

```
F.Courtyard
```

矩形

|始点(X,Y)|終点(X,Y)|
|---|---|
|(-11.30,-9.00)|(11.30,7.60)|

線幅

```
0.05mm
```

---

# 13. KiCad入力順

1. F.Fab
2. Pad
3. 固定穴
4. USBシェル
5. Reference
6. Value
7. Pin1
8. 部品名称
9. 端子名称
10. F.Courtyard

---

# 14. 完成確認

以下を確認済み。

- 基板中心原点
- Pad
- 固定穴
- USBシェル
- F.Fab
- F.SilkS
- F.Courtyard
- Description
- Keywords

---

# 15. 最終判定

```
PASS
```

保存

```
PASS
```

ライブラリ再読込

```
PASS
```

設計レビュー

```
PASS
```

---

# 16. 変更履歴

|Version|内容|
|---|---|
|v2.0|Release第1版。USB_C_Breakout_6Pin完成版座標仕様書。基板中心原点へ全面移行。|